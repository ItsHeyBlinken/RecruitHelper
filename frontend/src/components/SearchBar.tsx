import { useEffect, useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by school name...",
}: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onChange(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input, onChange]);

  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        className="search-bar__input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        aria-label="Search schools"
        autoFocus
      />
    </div>
  );
}
