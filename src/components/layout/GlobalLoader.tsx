import { Sparkle } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-advent-green">
      <div className="flex animate-pulse items-center gap-2">
        <Sparkle className="h-5 w-5 text-advent-mist" />
        <span className="font-gowun text-2xl font-bold uppercase tracking-wide text-advent-cream">
          Advent Calendar
        </span>
        <Sparkle className="h-5 w-5 text-advent-mist" />
      </div>
    </div>
  );
}
