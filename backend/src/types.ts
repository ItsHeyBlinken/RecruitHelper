export interface School {
  id: number;
  school_name: string;
  abbreviation: string | null;
  aliases: string[];
  division: string;
  state: string;
  athletics_url: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  sport_id: number;
  coach_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  updated_at: string;
}

export interface SchoolWithContacts extends School {
  contacts: Contact[];
}
