import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4Zh-Q6DWWp5yPnQf/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white pointer-events-none dark:via-black/40 dark:to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(125,211,252,0.6)]">
            Orchestrate work with neon clarity
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-2xl">
            Assign tasks, track progress, and visualize delivery across your team with a responsive, glassmorphic interface.
          </p>
        </div>
      </div>
    </section>
  );
}
