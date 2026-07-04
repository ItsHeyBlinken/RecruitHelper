import { useState } from "react";
import Layout from "../components/Layout";
import "./Templates.css";

interface EmailTemplate {
  id: string;
  name: string;
  whenToUse: string;
  subject: string;
  body: string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: "intro",
    name: "First intro",
    whenToUse: "First time emailing a coach.",
    subject: "[Grad Year] [Position] — [City, State] — [Your Name]",
    body: `Coach [Last Name],

My name is [Your Name], a [Grad Year] [Position] from [City, State] ([High School] / [Club Team]).

I'm interested in [School Name] and wanted to introduce myself. Here's a short highlight video:
[Video Link]

[Optional: one line — GPA, travel team, or something specific about their program]

I'd love to know if you'd like more information or if I should complete your recruiting questionnaire.

Thank you,
[Your Name]
[Your Email]
[Your Phone]`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    whenToUse: "No reply after about 10–14 days.",
    subject: "Following up — [Grad Year] [Position] [Your Name]",
    body: `Coach [Last Name],

I reached out a couple of weeks ago about my interest in [School Name]. I'm a [Grad Year] [Position] from [City, State].

Highlight video: [Video Link]

Happy to send anything else that would be helpful.

Thank you,
[Your Name]`,
  },
  {
    id: "camp",
    name: "Camp or visit",
    whenToUse: "You're interested in their camp or a campus visit.",
    subject: "Camp / visit interest — [Grad Year] [Position] [Your Name]",
    body: `Coach [Last Name],

I'm a [Grad Year] [Position] from [City, State] and I'm interested in attending a [School Name] camp or visiting campus.

Please let me know the best way to register or schedule a visit.

Highlight video: [Video Link]

Thank you,
[Your Name]
[Your Email]`,
  },
  {
    id: "showcase",
    name: "Showcase invite",
    whenToUse: "Invite a coach to watch you play at an upcoming showcase or tournament.",
    subject: "Showcase invite — [Grad Year] [Position] [Your Name] — [Event Name]",
    body: `Coach [Last Name],

My name is [Your Name], a [Grad Year] [Position] from [City, State] ([High School] / [Club Team]).

I'll be playing at [Event Name] in [Event City, State] on [Date(s)]. I'd love for you (or a staff member) to come watch if you're available.

Schedule / field info: [Schedule or Event Link]
Games: [Game times / field numbers if you have them]
Highlight video: [Video Link]

Please let me know if you need anything else. Hope to see you there.

Thank you,
[Your Name]
[Your Email]
[Your Phone]`,
  },
];

const TIPS = [
  "Send from the athlete’s email when possible (first person: “I,” not “my daughter”).",
  "Keep it short — under about 120 words. Coaches skim.",
  "Put grad year, position, and city in the subject line.",
  "Use the coach’s name and school name — never “Dear Coach.”",
  "One clear ask: watch a short video, or reply if interested.",
  "Link a highlight video early. No attachments on the first email.",
  "Personalize one line when you can (program, camp, or something real about the school).",
  "For showcases, send the invite early and include event name, dates, location, and game times.",
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className="templates__copy" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </button>
  );
}

export default function Templates() {
  return (
    <Layout>
      <div className="templates">
        <header className="templates__hero">
          <h1>Email templates</h1>
          <p className="templates__tagline">
            Copy a subject and body into your own email. Replace anything in [brackets]
            before you send.
          </p>
        </header>

        <section className="templates__panel templates__tips" aria-labelledby="tips-heading">
          <h2 id="tips-heading">Best practices</h2>
          <ul>
            {TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <div className="templates__list">
          {TEMPLATES.map((template) => (
            <section key={template.id} className="templates__panel templates__card">
              <div className="templates__card-header">
                <h2>{template.name}</h2>
                <p className="templates__when">{template.whenToUse}</p>
              </div>

              <div className="templates__block">
                <div className="templates__block-header">
                  <span className="templates__label">Subject</span>
                  <CopyButton label="Copy subject" text={template.subject} />
                </div>
                <pre className="templates__text">{template.subject}</pre>
              </div>

              <div className="templates__block">
                <div className="templates__block-header">
                  <span className="templates__label">Body</span>
                  <CopyButton label="Copy body" text={template.body} />
                </div>
                <pre className="templates__text">{template.body}</pre>
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
