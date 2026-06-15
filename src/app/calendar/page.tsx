import Header from "@/components/Header";
import CalendarView from "@/components/CalendarView";
import { getScoreboardByDate, getScoreboard } from "@/lib/api";

export default async function CalendarPage() {
  // Try to get today's date, or default to a World Cup date for demo purposes
  // Since we are running on June 15, 2026, let's use that as the starting point.
  const today = new Date(2026, 5, 15); // Month is 0-indexed, so 5 = June
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const initialDateStr = `${year}${month}${day}`;

  // Fetch initial data on the server
  const [initialData, scoreboardData] = await Promise.all([
    getScoreboardByDate(initialDateStr),
    getScoreboard() // Just to get the live matches count for the header
  ]);
  
  const liveMatches = scoreboardData.events.filter(e => e.status.type.state === "in");

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <Header liveCount={liveMatches.length} activePage="calendar" />
      
      <div className="mb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
          Calendrier <span className="text-wc-blue">Matchs</span>
        </h2>
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Résultats et programme par jour</p>
      </div>

      <CalendarView initialDate={initialDateStr} initialData={initialData} />
    </main>
  );
}
