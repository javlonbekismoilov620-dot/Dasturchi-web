import { LogoMark } from "@/components/layout/logo";

/* Birinchi tashrifda qisqa (≈1 soniya) kinematografik kirish.
   Qaror sahifa chizilishidan oldin inline skript orqali qabul qilinadi —
   shu sababli kontent “miltillamaydi”. Animatsiya to‘liq CSS’da. */
const decide = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('dch-intro'))return;sessionStorage.setItem('dch-intro','1');var d=document.documentElement;d.setAttribute('data-intro','');setTimeout(function(){d.removeAttribute('data-intro')},1900)}catch(e){}})();`;

export function IntroCurtain() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div className="intro-curtain fixed inset-0 z-[95] place-items-center bg-bg" aria-hidden>
        <div className="intro-mark flex items-center gap-3">
          <LogoMark size={44} />
          <span className="intro-word overflow-hidden whitespace-nowrap text-[28px] font-semibold tracking-[-0.04em]">Dasturchi</span>
        </div>
      </div>
    </>
  );
}
