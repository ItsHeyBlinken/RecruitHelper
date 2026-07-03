import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSchool, getSchoolContacts } from "../api/client";
import ContactCard from "../components/ContactCard";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Contact, School } from "../types";
import "./SchoolDetail.css";

function getInitials(name: string): string {
  const words = name.split(/\s+/).filter((w) => !["university", "of", "the"].includes(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const schoolId = Number(id);

  const [school, setSchool] = useState<School | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(schoolId)) {
      setError("Invalid school");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getSchool(schoolId), getSchoolContacts(schoolId)])
      .then(([schoolData, contactData]) => {
        if (!cancelled) {
          setSchool(schoolData);
          setContacts(contactData);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [schoolId]);

  if (loading) {
    return (
      <Layout>
        <div className="school-detail">
          <LoadingSpinner label="Loading school..." />
        </div>
      </Layout>
    );
  }

  if (error || !school) {
    return (
      <Layout>
        <div className="school-detail">
          <Link to="/" className="school-detail__back">
            ← Back to search
          </Link>
          <div className="school-detail__message school-detail__message--error">
            {error ?? "School not found"}
          </div>
        </div>
      </Layout>
    );
  }

  const reachableContacts = contacts.filter((contact) => contact.email?.trim());

  return (
    <Layout>
      <div className="school-detail">
        <Link to="/" className="school-detail__back">
          ← Back to search
        </Link>

        <header className="school-detail__hero">
          <span className="school-detail__avatar" aria-hidden="true">
            {getInitials(school.school_name)}
          </span>
          <div className="school-detail__hero-text">
            <h1>{school.school_name}</h1>
            <div className="school-detail__meta">
              {school.abbreviation && (
                <span className="school-detail__badge">{school.abbreviation}</span>
              )}
              <span className="school-detail__badge">{school.division}</span>
              <span>{school.state}</span>
            </div>
            <a
              href={school.athletics_url}
              target="_blank"
              rel="noopener noreferrer"
              className="school-detail__link"
            >
              Visit athletics website ↗
            </a>
          </div>
        </header>

        <section className="school-detail__contacts">
          <div className="school-detail__section-header">
            <h2>Softball Coaching Staff</h2>
            {reachableContacts.length > 0 && (
              <span className="school-detail__count">
                {reachableContacts.length}{" "}
                {reachableContacts.length === 1 ? "coach" : "coaches"}
              </span>
            )}
          </div>

          {reachableContacts.length === 0 ? (
            <div className="school-detail__message">
              {contacts.length > 0
                ? "No coach emails listed for this program yet."
                : "No contacts available yet. Run the scraper to populate this school."}
            </div>
          ) : (
            <div className="school-detail__grid">
              {reachableContacts.map((contact, index) => (
                <div key={contact.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <ContactCard contact={contact} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
