import { DIVISION_LABELS, SCHOOL_DIVISIONS, type DivisionFilter } from "../types";
import "./DivisionFilter.css";

interface DivisionFilterProps {
  value: DivisionFilter;
  onChange: (value: DivisionFilter) => void;
}

export default function DivisionFilterBar({ value, onChange }: DivisionFilterProps) {
  return (
    <div className="division-filter" role="group" aria-label="Filter by division">
      <button
        type="button"
        className={`division-filter__chip${value === "ALL" ? " division-filter__chip--active" : ""}`}
        onClick={() => onChange("ALL")}
      >
        All
      </button>
      {SCHOOL_DIVISIONS.map((division) => (
        <button
          key={division}
          type="button"
          className={`division-filter__chip${value === division ? " division-filter__chip--active" : ""}`}
          onClick={() => onChange(division)}
        >
          {DIVISION_LABELS[division]}
        </button>
      ))}
    </div>
  );
}
