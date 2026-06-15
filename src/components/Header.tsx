import Link from "next/link";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  liveCount?: number;
  activePage?: "home" | "standings" | "calendar";
}

export default function Header({ liveCount = 0, activePage = "home" }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="bg-wc-red p-3 rounded-2xl rotate-12 text-white">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
          World Cup <span className="text-wc-red">2026</span>
        </h1>
      </Link>
      
      <nav className="flex items-center gap-2 md:gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-full px-6 overflow-x-auto max-w-full">
        <Link 
          href="/" 
          className={cn(
            "flex items-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all",
            activePage === "home" ? "text-wc-red" : "opacity-50 hover:opacity-100 text-white"
          )}
        >
          {activePage === "home" && <span className="w-2 h-2 bg-wc-red rounded-full animate-ping" />}
          Direct {liveCount > 0 && `(${liveCount})`}
        </Link>
        
        <Link 
          href="/calendar"
          className={cn(
            "transition-opacity whitespace-nowrap uppercase text-sm font-bold tracking-widest",
            activePage === "calendar" ? "text-wc-green opacity-100" : "opacity-50 hover:opacity-100 text-white"
          )}
        >
          Calendrier
        </Link>
        
        <Link 
          href="/standings" 
          className={cn(
            "transition-opacity whitespace-nowrap uppercase text-sm font-bold tracking-widest text-white",
            activePage === "standings" ? "text-wc-green opacity-100" : "opacity-50 hover:opacity-100"
          )}
        >
          Classement
        </Link>
      </nav>
    </header>
  );
}
