export default function Loading() {
  return (
    <div className="relative z-[1] mx-auto flex min-h-svh w-[90vw] max-w-[1600px] flex-col">
      {/* header */}
      <div className="flex items-center justify-between py-[2.22222svh]">
        <div className="h-7 w-40 rounded-sm bg-white/8 animate-pulse" />
        <div className="flex gap-6">
          <div className="h-3 w-16 rounded-sm bg-white/8 animate-pulse" />
          <div className="h-3 w-12 rounded-sm bg-white/8 animate-pulse" />
          <div className="h-3 w-14 rounded-sm bg-white/8 animate-pulse" />
        </div>
      </div>

      {/* content area */}
      <main className="flex-1 pb-[10svh] pt-[7svh]">
        {/* eyebrow */}
        <div className="h-3 w-28 rounded-sm bg-white/8 animate-pulse" />

        {/* heading */}
        <div className="mt-[2svh] space-y-3">
          <div className="h-[clamp(2.5rem,7vw,7rem)] w-[55%] rounded-sm bg-white/8 animate-pulse" />
          <div className="h-[clamp(2.5rem,7vw,7rem)] w-[35%] rounded-sm bg-white/8 animate-pulse" />
        </div>

        {/* body text */}
        <div className="mt-[3svh] space-y-2 max-w-[62ch]">
          <div className="h-4 w-full rounded-sm bg-white/6 animate-pulse" />
          <div className="h-4 w-[90%] rounded-sm bg-white/6 animate-pulse" />
          <div className="h-4 w-[75%] rounded-sm bg-white/6 animate-pulse" />
        </div>

        {/* cards grid */}
        <div className="mt-[7svh] grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[320px] rounded-[2px] border border-white/10 bg-white/4 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </main>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-white/10 py-[2.22222svh]">
        <div className="h-3 w-32 rounded-sm bg-white/8 animate-pulse" />
        <div className="flex gap-8">
          <div className="h-3 w-14 rounded-sm bg-white/8 animate-pulse" />
          <div className="h-3 w-10 rounded-sm bg-white/8 animate-pulse" />
          <div className="h-3 w-14 rounded-sm bg-white/8 animate-pulse" />
        </div>
        <div className="h-3 w-10 rounded-sm bg-white/8 animate-pulse" />
      </div>
    </div>
  );
}
