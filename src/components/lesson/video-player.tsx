"use client";

import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveVideoPositionAction } from "@/app/actions/learning";
import type { LessonVideo } from "@/lib/types";
import { cn } from "@/lib/cn";

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function youtubeId(url: string) {
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  return m?.[1] ?? null;
}
function vimeoId(url: string) {
  return /vimeo\.com\/(?:video\/)?(\d+)/.exec(url)?.[1] ?? null;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function VideoPlayer({ video, lessonId, startAt, title }: { video: LessonVideo; lessonId: string; startAt: number; title: string }) {
  if (video.provider === "youtube") {
    const id = youtubeId(video.url);
    if (!id) return null;
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-border-strong bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&start=${Math.floor(startAt)}`}
          title={title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  if (video.provider === "vimeo") {
    const id = vimeoId(video.url);
    if (!id) return null;
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-border-strong bg-black">
        <iframe className="h-full w-full" src={`https://player.vimeo.com/video/${id}#t=${Math.floor(startAt)}s`} title={title} allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
      </div>
    );
  }
  return <FilePlayer video={video} lessonId={lessonId} startAt={startAt} title={title} />;
}

function FilePlayer({ video, lessonId, startAt, title }: { video: LessonVideo; lessonId: string; startAt: number; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fs, setFs] = useState(false);
  const [resumed, setResumed] = useState(false);
  const lastSaved = useRef(startAt);

  const save = useCallback(
    (force = false) => {
      const v = ref.current;
      if (!v) return;
      const t = v.currentTime;
      if (!force && Math.abs(t - lastSaved.current) < 10) return;
      lastSaved.current = t;
      void saveVideoPositionAction(lessonId, t);
    },
    [lessonId],
  );

  useEffect(() => {
    const onHide = () => {
      const v = ref.current;
      if (!v) return;
      // Sahifa yopilganda ham pozitsiya saqlanadi
      navigator.sendBeacon?.("/api/progress/video", new Blob([JSON.stringify({ lessonId, seconds: v.currentTime })], { type: "application/json" }));
    };
    window.addEventListener("pagehide", onHide);
    const onFs = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [lessonId]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const v = ref.current;
    if (!v) return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration, v.currentTime + 5);
    else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    else if (e.key === "f") void (document.fullscreenElement ? document.exitFullscreen() : wrapRef.current?.requestFullscreen());
    else if (e.key === "m") {
      v.muted = !v.muted;
      setMuted(v.muted);
    }
  };

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onKeyDown={onKey}
      className="group relative aspect-video overflow-hidden rounded-2xl border border-border-strong bg-black outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Video: ${title}. Probel — ijro/pauza, strelkalar — 5 soniya, F — to‘liq ekran`}
    >
      <video
        ref={ref}
        src={video.url}
        poster={video.poster ?? undefined}
        preload="metadata"
        playsInline
        className="h-full w-full"
        onClick={toggle}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (startAt > 5 && startAt < e.currentTarget.duration - 5) {
            e.currentTarget.currentTime = startAt;
            setResumed(true);
            setTimeout(() => setResumed(false), 4000);
          }
        }}
        onTimeUpdate={(e) => {
          setTime(e.currentTarget.currentTime);
          save();
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          save(true);
        }}
        onEnded={() => save(true)}
      />
      {resumed && (
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-[12.5px] text-white backdrop-blur">
          {fmt(startAt)} dan davom ettirildi
          <button
            className="inline-flex items-center gap-1 underline"
            onClick={() => {
              if (ref.current) ref.current.currentTime = 0;
              setResumed(false);
            }}
          >
            <RotateCcw className="h-3 w-3" /> Boshidan
          </button>
        </div>
      )}
      {!playing && (
        <button onClick={toggle} className="absolute inset-0 grid place-items-center bg-black/20" aria-label="Ijro etish">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black shadow-xl transition-transform hover:scale-105">
            <Play className="ml-1 h-6 w-6" fill="currentColor" />
          </span>
        </button>
      )}
      <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-white transition-opacity", playing ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-100")}>
        <input
          type="range"
          className="range w-full"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => {
            if (ref.current) ref.current.currentTime = Number(e.target.value);
          }}
          aria-label="Video vaqti"
        />
        <div className="mt-2 flex items-center gap-3 text-[12.5px]">
          <button onClick={toggle} aria-label={playing ? "Pauza" : "Ijro"}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
          <button
            onClick={() => {
              if (!ref.current) return;
              ref.current.muted = !ref.current.muted;
              setMuted(ref.current.muted);
            }}
            aria-label={muted ? "Ovozni yoqish" : "Ovozni o‘chirish"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="font-mono tabular-nums">{fmt(time)} / {fmt(duration)}</span>
          <button
            className="ml-auto rounded px-1.5 py-0.5 font-mono hover:bg-white/15"
            onClick={() => {
              const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
              setSpeed(next);
              if (ref.current) ref.current.playbackRate = next;
            }}
            aria-label="Ijro tezligi"
          >
            {speed}×
          </button>
          <button onClick={() => void (document.fullscreenElement ? document.exitFullscreen() : wrapRef.current?.requestFullscreen())} aria-label="To‘liq ekran">
            {fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
