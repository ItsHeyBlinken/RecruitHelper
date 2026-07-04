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
    subject: '[Grad Year] [Position] | [Height] | [GPA] GPA | [Your Name] | [City, State]',
    body: `Coach [Last Name],

My name is [Your Name], a [Grad Year] [Position] from [City, State] ([High School] / [Club Team]). I've been following [School Name]'s program — [one specific note: recent win, style of play, or camp] — and I'd love to introduce myself.

Quick facts:
• Height / weight: [Height] / [Weight]
• GPA: [GPA]
• Position: [Position]

Highlight video (YouTube or Hudl — not Google Drive):
[Video Link]

Recruiting profile:
[Profile Link]

Do you have any upcoming ID camps where I can play in front of you, or should I complete your recruiting questionnaire?

Thank you,
[Your Name]
[Your Email]
[Your Phone]
CC: [Club or HS Coach Email]`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    whenToUse: "No reply after about 10–14 days. Add one new update so it isn’t only “checking in.”",
    subject: "Following up — [Grad Year] [Position] | [Height] | [Your Name]",
    body: `Coach [Last Name],

I reached out a couple of weeks ago about my interest in [School Name]. I'm a [Grad Year] [Position] from [City, State].

Since then, I [one new update: earned a 4.0 this semester / was named captain / improved a key metric / posted new film].

Highlight video:
[Video Link]

Happy to send anything else that would be helpful.

Thank you,
[Your Name]
[Your Email]`,
  },
  {
    id: "camp",
    name: "Camp or visit",
    whenToUse: "You're interested in their camp, an ID camp, or a campus visit.",
    subject: "Camp / visit interest — [Grad Year] [Position] | [Height] | [Your Name]",
    body: `Coach [Last Name],

I'm a [Grad Year] [Position] from [City, State] ([High School] / [Club Team]) and I'm interested in attending a [School Name] camp or visiting campus.

Quick facts: [Height] / [Weight] · [GPA] GPA

Highlight video:
[Video Link]

Do you have any upcoming ID camps where I can play in front of you, and what’s the best way to register or schedule a visit?

Thank you,
[Your Name]
[Your Email]
CC: [Club or HS Coach Email]`,
  },
  {
    id: "showcase",
    name: "Showcase invite",
    whenToUse: "Invite a coach to watch you play at an upcoming showcase or tournament. Send early so they can plan travel.",
    subject: "Showcase invite — [Grad Year] [Position] | [Your Name] | [Event Name]",
    body: `Coach [Last Name],

My name is [Your Name], a [Grad Year] [Position] from [City, State] ([High School] / [Club Team]).

I'll be playing at [Event Name] in [Event City, State] on [Date(s)]. I'd love for you (or a staff member) to come watch if you're available.

Look for me:
• Jersey #: [Jersey Number]
• Jersey color: [Jersey Color]
• Position: [Position]

Schedule / field info:
[Schedule or Event Link]

Games: [Game times / field numbers]

Highlight video:
[Video Link]

Please let me know if you need anything else. Hope to see you there.

Thank you,
[Your Name]
[Your Email]
[Your Phone]
CC: [Club or HS Coach Email]`,
  },
];

const TIPS = [
  "Send from the athlete’s email when possible (first person: “I,” not “my daughter”).",
  "Keep it short — under about 100 words when you can. Coaches skim on phones.",
  "Subject line: grad year, position, and 1–2 standouts (height, GPA, or a key note) plus your name.",
  "Use the coach’s name and school name — never “Dear Coach.”",
  "Lead with a real personalization line (program, recent win, or camp) — not a generic compliment.",
  "Put stats in short bullets so they’re easy to scan.",
  "Video on its own line (YouTube or Hudl). Avoid Google Drive links that need “request access.”",
  "Add a recruiting profile link (NCSA, SportsRecruits, or personal site) in the signature area.",
  "CC your club or high school coach for credibility.",
  "One clear ask: ID camp, questionnaire, or come watch at a showcase.",
  "Best send window: Tuesday–Thursday mornings. Avoid Monday mornings and Friday afternoons.",
  "For showcases, send early and include jersey number, jersey color, dates, and game times.",
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
