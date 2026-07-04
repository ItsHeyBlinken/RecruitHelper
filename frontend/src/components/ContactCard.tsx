import { useState } from "react";
import type { Contact } from "../types";
import { formatContactTitle } from "../utils/formatContactTitle";
import "./ContactCard.css";

interface ContactCardProps {
  contact: Contact;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function ContactCard({ contact }: ContactCardProps) {
  const title = formatContactTitle(contact.title, contact.coach_name);
  const email = contact.email?.trim() ?? "";
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    if (!email) return;
    const ok = await copyText(email);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="contact-card">
      <div className="contact-card__header">
        <h3 className="contact-card__name">{contact.coach_name}</h3>
        {title && <p className="contact-card__title">{title}</p>}
      </div>
      <div className="contact-card__details">
        {email ? (
          <>
            <p className="contact-card__email">{email}</p>
            <div className="contact-card__actions">
              <button
                type="button"
                className="contact-card__button"
                onClick={handleCopyEmail}
              >
                {copied ? "Copied" : "Copy email address"}
              </button>
              <a href={`mailto:${email}`} className="contact-card__button contact-card__button--secondary">
                Open in email app
              </a>
            </div>
          </>
        ) : (
          <p className="contact-card__empty">No email listed</p>
        )}
      </div>
    </article>
  );
}
