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
        <a href={`mailto:${contact.email}`} className="contact-card__link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {contact.email}
        </a>
      </div>
    </article>
  );
}
