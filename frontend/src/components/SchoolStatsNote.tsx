import { DIVISION_LABELS, SCHOOL_DIVISIONS, type DivisionFilter, type SchoolStats } from "../types";
import { getDivisionCount } from "../utils/formatSchoolStats";
import "./SchoolStatsNote.css";

interface SchoolStatsNoteProps {
  stats: SchoolStats;
  activeDivision: DivisionFilter;
}

export default function SchoolStatsNote({ stats, activeDivision }: SchoolStatsNoteProps) {
  const programLabel = stats.total === 1 ? "program" : "programs";
  const texasLabel = stats.texasTotal === 1 ? "program" : "programs";

  return (
    <p className="school-stats-note" aria-live="polite">
      <span className="school-stats-note__total">
        {stats.total} softball {programLabel} nationwide
        <span className="school-stats-note__texas">
          {" "}
          · {stats.texasTotal} Texas {texasLabel}
        </span>
      </span>
      <span className="school-stats-note__breakdown">
        {SCHOOL_DIVISIONS.map((division) => {
          const count = getDivisionCount(stats.texasByDivision, division);
          const isActive = activeDivision === division || activeDivision === "ALL";
          return (
            <span
              key={division}
              className={`school-stats-note__item${isActive && activeDivision === division ? " school-stats-note__item--active" : ""}`}
            >
              <span className="school-stats-note__count">{count}</span>
              <span className="school-stats-note__label">TX {DIVISION_LABELS[division]}</span>
            </span>
          );
        })}
      </span>
    </p>
  );
}
