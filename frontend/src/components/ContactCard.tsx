import type { Contact } from "../types";
import { formatContactTitle } from "../utils/formatContactTitle";
import "./ContactCard.css";

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const title = formatContactTitle(contact.title, contact.coach_name);

  return (
    <article className="contact-card">
      <div className="contact-card__header">
        <h3 className="contact-card__name">{contact.coach_name}</h3>
        {title && <p className="contact-card__title">{title}</p>}
      </div>
      <div className="contact-card__details">
        {contact.email ? (
          <a href={`mailto:${contact.email}`} className="contact-card__link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {contact.email}
          </a>
        ) : (
          <span className="contact-card__empty">No email listed</span>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="contact-card__link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {contact.phone}
          </a>
        )}
      </div>
    </article>
  );
}
