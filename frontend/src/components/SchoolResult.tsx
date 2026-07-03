import { Link } from "react-router-dom";
import type { School } from "../types";
import "./SchoolResult.css";

interface SchoolResultProps {
  school: School;
}

function getInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => !["university", "of", "the"].includes(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function SchoolResult({ school }: SchoolResultProps) {
  return (
    <Link to={`/schools/${school.id}`} className="school-result">
      <span className="school-result__avatar" aria-hidden="true">
        {getInitials(school.school_name)}
      </span>
      <div className="school-result__main">
        <span className="school-result__name">{school.school_name}</span>
        <span className="school-result__meta">
          {school.abbreviation && (
            <span className="school-result__badge school-result__badge--abbr">{school.abbreviation}</span>
          )}
          <span className="school-result__badge">{school.division}</span>
          <span>{school.state}</span>
        </span>
      </div>
      <span className="school-result__arrow" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </Link>
  );
}
