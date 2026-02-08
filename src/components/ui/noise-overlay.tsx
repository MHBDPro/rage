export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.02] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.2)_0.4px,transparent_0.6px),radial-gradient(rgba(255,255,255,0.14)_0.3px,transparent_0.5px)] [background-position:0_0,1px_1px] [background-size:3px_3px,4px_4px]"
    />
  );
}
