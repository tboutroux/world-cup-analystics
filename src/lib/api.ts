export interface ScoreboardResponse {
  leagues: any[];
  season: any;
  day: any;
  events: Event[];
}

export interface Event {
  id: string;
  date: string;
  name: string;
  shortName: string;
  season: any;
  competitions: Competition[];
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: "pre" | "in" | "post";
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
}

export interface Competition {
  id: string;
  date: string;
  attendance: number;
  type: any;
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  venue: any;
  competitors: Competitor[];
  notes: any[];
  status: any;
  broadcasts: any[];
  format: any;
  startDate: string;
  geoBroadcasts: any[];
  headlines: any[];
}

export interface Competitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: "home" | "away";
  winner: boolean;
  team: {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    logo: string;
  };
  score: string;
  records: any[];
}

const ESPN_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

export async function getScoreboard(): Promise<ScoreboardResponse> {
  const res = await fetch(`${ESPN_BASE_URL}/scoreboard`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  if (!res.ok) {
    throw new Error("Failed to fetch scoreboard");
  }
  return res.json();
}

export async function getScoreboardByDate(dateString: string): Promise<ScoreboardResponse> {
  const res = await fetch(`${ESPN_BASE_URL}/scoreboard?dates=${dateString}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch scoreboard for date ${dateString}`);
  }
  return res.json();
}

export async function getMatchSummary(eventId: string) {
  const res = await fetch(`${ESPN_BASE_URL}/summary?event=${eventId}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch match summary");
  }
  return res.json();
}

export interface StandingsResponse {
  children: {
    id: string;
    name: string;
    abbreviation: string;
    standings: {
      id: string;
      name: string;
      entries: StandingEntry[];
    };
  }[];
}

export interface StandingEntry {
  team: {
    id: string;
    uid: string;
    location: string;
    name: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    logo: string;
  };
  stats: {
    name: string;
    displayName: string;
    shortDisplayName: string;
    description: string;
    abbreviation: string;
    type: string;
    value: number;
    displayValue: string;
  }[];
}

export async function getStandings(): Promise<StandingsResponse> {
  const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  if (!res.ok) {
    throw new Error("Failed to fetch standings");
  }
  return res.json();
}

export interface PlayerStatsResponse {
  stats: {
    name: string;
    displayName: string;
    leaders: {
      displayValue: string;
      value: number;
      athlete: {
        id: string;
        displayName: string;
        shortName: string;
        team: {
          name: string;
          abbreviation: string;
          logos: { href: string }[];
        };
      };
    }[];
  }[];
}

export async function getPlayerStats(): Promise<PlayerStatsResponse> {
  const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/statistics`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch player stats");
  }
  return res.json();
}
