import {
  Atom,
  AudioLines,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Box,
  Boxes,
  BrainCircuit,
  Briefcase,
  CalendarCheck,
  Camera,
  Clapperboard,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Film,
  Flame,
  Footprints,
  Gamepad2,
  Gem,
  GitBranch,
  Hand,
  Image as ImageIcon,
  Layers,
  Library,
  LineChart,
  Megaphone,
  Monitor,
  Mountain,
  NotebookPen,
  Palette,
  PenTool,
  Server,
  Shapes,
  ShieldCheck,
  Smartphone,
  Sparkle,
  Sparkles,
  TrendingUp,
  Trophy,
  Video,
  MonitorPlay,
  GraduationCap,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/* Ma’lumotlar bazasida ikonka nomi matn sifatida saqlanadi.
   Barcha lucide ikonkalarini import qilmaslik uchun aniq ro‘yxat ishlatiladi. */
const ICONS: Record<string, ComponentType<LucideProps>> = {
  Atom, AudioLines, Award, BadgeCheck, BookOpenCheck, Box, Boxes, BrainCircuit, Briefcase, CalendarCheck,
  Camera, Clapperboard, Code2, Cpu, Database, FileCode2, Film, Flame, Footprints, Gamepad2, Gem, GitBranch,
  Hand, Image: ImageIcon, Layers, Library, LineChart, Megaphone, Monitor, Mountain, NotebookPen, Palette,
  PenTool, Server, Shapes, ShieldCheck, Smartphone, Sparkle, Sparkles, TrendingUp, Trophy, Video, MonitorPlay,
  GraduationCap,
};

export const ICON_NAMES = Object.keys(ICONS).sort();

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = ICONS[name] ?? GraduationCap;
  return <C aria-hidden="true" {...props} />;
}
