import { useCallback, useEffect, useState } from "react";
import { getSchoolStats, listSchools, searchSchools } from "../api/client";
import DivisionFilterBar from "../components/DivisionFilter";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import SchoolResult from "../components/SchoolResult";
import SchoolStatsNote from "../components/SchoolStatsNote";
import {
  getPopularHeading,
  getPopularProgramKeys,
  pickPopularSchools,
} from "../data/popularPrograms";
import type { DivisionFilter, School, SchoolStats } from "../types";
import "./Home.css";

export default function Home() {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<DivisionFilter>("ALL");
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showingPopular = !query;

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  useEffect(() => {
    let cancelled = false;

    getSchoolStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    searchSchools(query, division)
      .then((results) => {
        if (!cancelled) setSchools(results);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setSchools([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, division]);

  useEffect(() => {
    if (query) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    listSchools(division, "TX")
      .then((results) => {
        if (cancelled) return;
        const keys = getPopularProgramKeys(division);
        setSchools(pickPopularSchools(results, keys));
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setSchools([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, division]);

  return (
    <Layout>
      <div className="home">
        <section className="home__hero">
          <h1>Find your next program</h1>
          <p className="home__tagline">
            Search any NCAA softball program by name or abbreviation — we&apos;re building deep coverage of Texas JUCO, D3, D2, and D1 schools first.
          </p>
        </section>

        <div className="home__panel">
          <SearchBar value={query} onChange={handleSearch} placeholder="Search LSU, UofA, OSU, Mizzou..." />
          <DivisionFilterBar value={division} onChange={setDivision} />
          {stats && <SchoolStatsNote stats={stats} activeDivision={division} />}

          <section className="home__results" aria-live="polite">
            {loading && <LoadingSpinner label={showingPopular ? "Loading programs..." : "Searching schools..."} />}

            {!loading && error && (
              <div className="home__message home__message--error">{error}</div>
            )}

            {!loading && !error && !showingPopular && query && schools.length === 0 && (
              <div className="home__message">
                No schools found for &ldquo;{query}&rdquo;
                {division !== "ALL" ? ` in ${division}` : ""}.
              </div>
            )}

            {!loading && !error && schools.length > 0 && (
              <>
                <p className={`home__count${showingPopular ? " home__count--popular" : ""}`}>
                  {showingPopular
                    ? getPopularHeading(division)
                    : `${schools.length} ${schools.length === 1 ? "school" : "schools"} found${division !== "ALL" ? ` in ${division}` : ""}`}
                </p>
                <ul className="home__list">
                  {schools.map((school, index) => (
                    <li key={school.id} style={{ animationDelay: `${index * 40}ms` }}>
                      <SchoolResult school={school} />
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!loading && !error && showingPopular && schools.length === 0 && (
              <div className="home__empty">
                <div className="home__empty-icon" aria-hidden="true">🥎</div>
                <p>No featured programs available for this division yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
