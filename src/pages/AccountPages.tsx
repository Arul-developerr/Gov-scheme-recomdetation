import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Download,
  FileCheck2,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  LockKeyhole,
  Globe2,
  Eye,
  Heart,
  BookOpen,
  Landmark,
} from "lucide-react";
import { usePrototype, type Notice } from "../state";
import { profileCompletion, type Profile } from "../data";
import { ProfileSummary } from "./OnboardingPage";
import {
  Arrow,
  BtnLink,
  ConfirmDialog,
  DemoNotice,
  EmptyState,
  Field,
  OfficialLink,
  PageTitle,
  Panel,
  Progress,
  SelectField,
  StatCards,
} from "../components/ui";
function downloadJSON(value: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export function ProfilePage() {
  const { store, updateProfile, notify } = usePrototype();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(store.profile);
  function submit(e: FormEvent) {
    e.preventDefault();
    updateProfile(draft);
    setEditing(false);
    notify("Profile changes saved in this browser.");
  }
  return (
    <>
      <PageTitle
        title="My profile"
        description="Your details, your preferences and your next steps — all in one place."
      />
      <div className="ss-profile-heading">
        <span className="ss-large-avatar">
          {(store.profile.name || "C").slice(0, 1)}
        </span>
        <div>
          <h2>{store.profile.name || "Your citizen profile"}</h2>
          <p>
            {store.profile.email || "No email added"} ·{" "}
            {store.profile.state || "Location not added"}
          </p>
          <span className="ss-demo-pill">Browser-local sample profile</span>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            setDraft(store.profile);
            setEditing(!editing);
          }}
        >
          {editing ? "Cancel editing" : "Edit basic profile"}
          <UserRound size={17} />
        </button>
      </div>
      <Panel
        title="Profile completeness"
        icon={UserRound}
        action={
          <Link className="ss-inline-link" to="/onboarding/personal">
            Complete profile <Arrow />
          </Link>
        }
      >
        <Progress value={profileCompletion(store.profile)} />
        <p>
          Adding core details helps you explore the demonstration more clearly.
          It does not verify your identity or eligibility.
        </p>
      </Panel>
      {editing && (
        <Panel title="Edit basic details" icon={UserRound}>
          <form onSubmit={submit}>
            <div className="ss-form-grid">
              <Field
                id="edit-name"
                label="Full name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                required
                maxLength={80}
              />
              <Field
                id="edit-email"
                label="Email address"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                maxLength={120}
              />
              <Field
                id="edit-birth"
                label="Date of birth"
                type="date"
                value={draft.birthDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) =>
                  setDraft({ ...draft, birthDate: e.target.value })
                }
              />
              <Field
                id="edit-phone"
                label="Phone (optional)"
                type="tel"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                help="Use sample details. No messages will be sent."
              />
            </div>
            <button className="button primary">
              Save profile changes <Arrow />
            </button>
          </form>
        </Panel>
      )}
      <ProfileSummary profile={store.profile} />
      <div className="ss-settings-grid">
        <Panel title="Your data belongs to you" icon={ShieldCheck}>
          <p>
            Download your prototype data or clear it from this browser in
            Settings.
          </p>
          <BtnLink to="/settings" secondary>
            Manage your data <Arrow />
          </BtnLink>
        </Panel>
        <Panel title="Make discovery more useful" icon={Sparkles}>
          <p>
            Update your interests and explore how the recommendation ranking
            changes.
          </p>
          <BtnLink to="/onboarding/preferences" secondary>
            Update preferences <Arrow />
          </BtnLink>
        </Panel>
      </div>
    </>
  );
}
export function SettingsPage() {
  const { store, update, updateProfile, notify, clear } = usePrototype();
  const navigate = useNavigate();
  const preferences = [
    {
      key: "newSchemes",
      title: "New scheme alerts",
      description: "Store your preference for future scheme alerts.",
      icon: Bell,
    },
    {
      key: "guidance",
      title: "Application guidance reminders",
      description: "Store a preference for document preparation reminders.",
      icon: FileCheck2,
    },
    {
      key: "recommendations",
      title: "Recommendation updates",
      description: "Store a preference for relevant opportunity updates.",
      icon: Sparkles,
    },
    {
      key: "marketing",
      title: "Promotional updates",
      description: "Optional preference; no promotional messages are sent.",
      icon: Mail,
    },
  ];
  return (
    <>
      <PageTitle
        title="Settings & privacy"
        description="Make the experience yours. Manage preferences, local data and your demo session."
      />
      <div className="ss-settings-grid">
        <Panel
          title="Account settings"
          icon={UserRound}
          action={
            <Link className="ss-inline-link" to="/profile">
              Edit profile
            </Link>
          }
        >
          <div className="ss-account-mini">
            <span className="ss-avatar">
              {(store.profile.name || "C").slice(0, 1)}
            </span>
            <div>
              <strong>{store.profile.name || "Citizen profile"}</strong>
              <p>{store.profile.email || "Email not added"}</p>
              <small>
                Local demo ·{" "}
                {store.verified
                  ? "Test code completed"
                  : "Identity not verified"}
              </small>
            </div>
          </div>
          <dl className="ss-data-list">
            <div>
              <dt>State</dt>
              <dd>{store.profile.state || "Not added"}</dd>
            </div>
            <div>
              <dt>District</dt>
              <dd>{store.profile.district || "Not added"}</dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd>
                {store.session ? "Demo session active" : "Browsing as guest"}
              </dd>
            </div>
          </dl>
          <BtnLink to="/onboarding/personal" secondary>
            Review profile <Arrow />
          </BtnLink>
        </Panel>
        <Panel title="Notification preferences" icon={Bell}>
          <p className="ss-field-help">
            Preferences only. No notification delivery service is connected.
          </p>
          <div className="ss-switch-list">
            {preferences.map(({ key, title, description, icon: Icon }) => (
              <label key={key}>
                <span className="ss-small-icon">
                  <Icon size={19} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  aria-label={title}
                  checked={store.settings[key]}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    update((s) => ({
                      ...s,
                      settings: { ...s.settings, [key]: checked },
                    }));
                    notify("Notification preference saved locally.");
                  }}
                />
              </label>
            ))}
          </div>
        </Panel>
        <Panel title="Language & interests" icon={Globe2}>
          <SelectField
            id="settings-language"
            label="Preferred language"
            value={store.profile.preferredLanguage}
            options={["English", "Tamil", "Hindi", "Other"]}
            onChange={(preferredLanguage) => {
              updateProfile({ preferredLanguage });
              notify(
                "Language preference saved. The interface remains in English until translations are connected.",
              );
            }}
            help="This is a stored preference; English is the only implemented interface language."
          />
          <div className="ss-tags">
            {store.profile.interests.length ? (
              store.profile.interests.map((i) => <span key={i}>{i}</span>)
            ) : (
              <p>No interests selected yet.</p>
            )}
          </div>
          <Link className="ss-inline-link" to="/onboarding/preferences">
            Update your interests <Arrow />
          </Link>
        </Panel>
        <Panel title="Privacy & data" icon={ShieldCheck}>
          <div className="ss-setting-links">
            <Link to="/privacy">
              <Eye size={19} />
              <span>
                <strong>Privacy notice</strong>
                <small>Understand what is saved locally.</small>
              </span>
              <Arrow />
            </Link>
            <Link to="/terms">
              <BookOpen size={19} />
              <span>
                <strong>Terms of this prototype</strong>
                <small>Understand the demonstration boundaries.</small>
              </span>
              <Arrow />
            </Link>
            <button
              onClick={() => {
                downloadJSON(store, "saharasetu-prototype-data.json");
                notify("Your browser-local prototype data was downloaded.");
              }}
            >
              <Download size={19} />
              <span>
                <strong>Download my prototype data</strong>
                <small>Profile, saved items, preferences and checklists.</small>
              </span>
              <Arrow />
            </button>
          </div>
        </Panel>
        <Panel title="Security & session" icon={LockKeyhole}>
          <p>
            This prototype does not have server authentication, two-factor
            authentication or an active-session service. Passwords are never
            stored.
          </p>
          <div className="ss-setting-links">
            <Link to="/reset-password">
              <LockKeyhole size={19} />
              <span>
                <strong>Password walkthrough</strong>
                <small>
                  Practice the reset screen; no real password changes.
                </small>
              </span>
              <Arrow />
            </Link>
            <button
              onClick={() => {
                update((s) => ({ ...s, session: false }));
                notify("Demo session ended. Local profile data remains.");
                navigate("/login");
              }}
            >
              <UserRound size={19} />
              <span>
                <strong>End demo session</strong>
                <small>Return to the demo login screen.</small>
              </span>
              <Arrow />
            </button>
          </div>
        </Panel>
        <Panel title="Account actions" icon={Settings}>
          <p>
            Your profile, checklists and saved schemes exist only in this
            browser. Clearing removes this prototype’s local data.
          </p>
          <ConfirmDialog
            trigger={
              <>
                <Trash2 size={18} /> Clear all prototype data
              </>
            }
            title="Clear data from this browser?"
            description="This removes your sample profile, saved schemes, comparisons, preferences, checklist progress and support drafts. It cannot remove data from exported files."
            label="Clear prototype data"
            danger
            onConfirm={() => {
              clear();
              navigate("/");
            }}
          />
        </Panel>
      </div>
    </>
  );
}
export function NotificationsPage() {
  const { store, update, notify } = usePrototype();
  const [filter, setFilter] = useState("All");
  const list = store.notifications.filter(
    (n) =>
      filter === "All" || (filter === "Unread" ? !n.read : n.kind === filter),
  );
  const unread = store.notifications.filter((n) => !n.read).length;
  function mark(id: string) {
    update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }
  return (
    <>
      <PageTitle
        title="Notifications"
        description="Keep up with your sample profile and the next steps in your demonstration journey."
      />
      <StatCards
        items={[
          { label: "Unread messages", value: unread, icon: Bell },
          {
            label: "All local messages",
            value: store.notifications.length,
            icon: Mail,
          },
          {
            label: "Delivery service",
            value: "Not connected",
            icon: ShieldCheck,
          },
        ]}
      />
      <div className="ss-notification-toolbar">
        <div className="ss-chip-tabs">
          {["All", "Unread", "Profile", "Saved", "Guidance", "System"].map(
            (f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ),
          )}
        </div>
        <button
          className="ss-inline-link"
          disabled={!unread}
          onClick={() => {
            update((s) => ({
              ...s,
              notifications: s.notifications.map((n) => ({ ...n, read: true })),
            }));
            notify("All local notifications marked as read.");
          }}
        >
          <Check size={17} /> Mark all as read
        </button>
      </div>
      {list.length ? (
        <div className="ss-notification-list">
          {list.map((n: Notice) => (
            <article className={n.read ? "read" : "unread"} key={n.id}>
              <span className="ss-small-icon">
                <Bell size={21} />
              </span>
              <div>
                <div className="ss-notification-title">
                  <h2>{n.title}</h2>
                  {!n.read && <span className="ss-demo-pill">Unread</span>}
                </div>
                <p>{n.description}</p>
                <small>{n.date} · Local demonstration message</small>
              </div>
              <div className="ss-notification-actions">
                <Link
                  className="ss-inline-link"
                  to={n.path}
                  onClick={() => mark(n.id)}
                >
                  View <Arrow />
                </Link>
                {!n.read && (
                  <button
                    className="icon-button"
                    aria-label={`Mark ${n.title} as read`}
                    onClick={() => mark(n.id)}
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  className="icon-button"
                  aria-label={`Delete ${n.title}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      notifications: s.notifications.filter(
                        (x) => x.id !== n.id,
                      ),
                    }))
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You’re all caught up."
          description="There are no messages in this view. New local events can appear as you explore the prototype."
          to="/dashboard"
          label="Back to dashboard"
          icon={Bell}
        />
      )}
      <div className="ss-note">
        <InfoIcon />
        <p>
          No messages are delivered by email or SMS. These notices are local to
          this browser.
        </p>
      </div>
    </>
  );
}
function InfoIcon() {
  return <ShieldCheck size={19} />;
}
const faqs = [
  {
    category: "Account",
    q: "Is this a real government portal?",
    a: "SaharaSetu is an independent product prototype. It is not affiliated with a government department, and its scheme records are fictional demonstrations.",
  },
  {
    category: "Account",
    q: "How do I create a profile?",
    a: "Choose Get Started, complete the registration walkthrough and use the visible demonstration verification code. Add your sample details in the seven onboarding steps.",
  },
  {
    category: "Eligibility",
    q: "Does a matching result mean I am eligible?",
    a: "No. The checker evaluates only the example rules shown in the prototype. Real eligibility and approval depend on official scheme rules and the government department.",
  },
  {
    category: "Schemes",
    q: "Where do I find actual government schemes?",
    a: "Use the official myScheme portal. Confirm current details, requirements and application links there or with the relevant department.",
  },
  {
    category: "Schemes",
    q: "How do I save or compare schemes?",
    a: "Use the heart to save a demo record. Use Compare to add up to three records, then open the comparison page.",
  },
  {
    category: "Privacy",
    q: "Where is my information stored?",
    a: "Your sample profile, saved items, preferences and checklists are stored in this browser using localStorage. No server account database is connected.",
  },
  {
    category: "Guidance",
    q: "Can I submit an application from SaharaSetu?",
    a: "No. The application guidance page is a preparation walkthrough. You must use the official department application channel for an actual scheme.",
  },
  {
    category: "Privacy",
    q: "Can I remove my data?",
    a: "Yes. Open Settings, download your data if you want a copy, then choose Clear all prototype data. Exported files must be removed separately.",
  },
];
export function HelpPage() {
  const { store, update, notify } = usePrototype();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  const visible = faqs.filter(
    (f) =>
      (category === "All" || f.category === category) &&
      `${f.q} ${f.a}`.toLowerCase().includes(query.toLowerCase()),
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    const id = `draft-${Date.now().toString(36)}`;
    update((s) => ({
      ...s,
      tickets: [
        ...s.tickets,
        {
          id,
          subject: subject.trim(),
          message: message.trim(),
          created: new Date().toISOString(),
        },
      ],
    }));
    setReceipt(id);
    setSubject("");
    setMessage("");
    notify("Support draft saved locally. It has not been sent.");
  }
  return (
    <>
      <PageTitle
        title="Help & support"
        description="A clear answer can make the next step easier. Find guidance for your SaharaSetu journey."
      />
      <div className="ss-help-search">
        <Search size={20} />
        <label className="sr-only" htmlFor="help-search">
          Search help topics
        </label>
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search account, eligibility, documents…"
        />
      </div>
      <div className="ss-chip-tabs">
        {[
          "All",
          "Account",
          "Schemes",
          "Eligibility",
          "Guidance",
          "Privacy",
        ].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="ss-detail-columns">
        <Panel title="Frequently asked questions" icon={HelpCircle}>
          {visible.length ? (
            visible.map((f) => (
              <details key={f.q} className="ss-faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
                {f.category === "Schemes" && (
                  <a
                    className="ss-inline-link"
                    href="https://www.myscheme.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official myScheme portal <Arrow />
                  </a>
                )}
              </details>
            ))
          ) : (
            <p className="ss-empty-message">
              No help topics match this search. Try a broader keyword.
            </p>
          )}
        </Panel>
        <aside>
          <Panel title="Useful next steps" icon={BookOpen}>
            <div className="ss-quick-links">
              <Link to="/how-it-works">
                How SaharaSetu works <Arrow />
              </Link>
              <Link to="/onboarding/personal">
                Create your sample profile <Arrow />
              </Link>
              <Link to="/guidance/education-loan">
                Try a document checklist <Arrow />
              </Link>
              <Link to="/privacy">
                Understand your local data <Arrow />
              </Link>
            </div>
          </Panel>
          <Panel title="Official scheme support" icon={Landmark}>
            <p>
              For actual eligibility, applications and benefit decisions, use
              the relevant official government portal or department contact.
            </p>
            <OfficialLink />
          </Panel>
        </aside>
      </div>
      <div className="ss-settings-grid">
        <Panel title="Prepare a support message" icon={MessageSquare}>
          <p>
            This form saves a draft in this browser. It does not send a message
            or contact a support team.
          </p>
          <form className="ss-support-form" onSubmit={submit}>
            <Field
              id="support-subject"
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              maxLength={120}
            />
            <div className="ss-field">
              <label htmlFor="support-message">Your message *</label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={2000}
                rows={5}
                placeholder="Describe what you need help with. Do not include passwords or identity numbers."
              />
            </div>
            <button className="button primary">
              Save local draft <Arrow />
            </button>
            {receipt && (
              <p role="status" className="ss-note">
                Draft {receipt} saved locally. Not sent to support.
              </p>
            )}
          </form>
        </Panel>
        <Panel title="Your local support drafts" icon={Mail}>
          {store.tickets.length ? (
            <div className="ss-ticket-list">
              {store.tickets.map((t) => (
                <article key={t.id}>
                  <strong>{t.subject}</strong>
                  <p>{t.message}</p>
                  <small>{t.id} · Not sent</small>
                  <div className="ss-actions">
                    <button
                      className="ss-inline-link"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            `${t.subject}\n\n${t.message}`,
                          );
                          notify("Draft copied.");
                        } catch {
                          notify(
                            "Copy the draft text manually from this panel.",
                          );
                        }
                      }}
                    >
                      Copy draft
                    </button>
                    <button
                      className="ss-danger-link"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          tickets: s.tickets.filter((d) => d.id !== t.id),
                        }))
                      }
                    >
                      Delete draft
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>No drafts saved yet. Prepare a message alongside this panel.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
export function UtilityPage({
  kind,
}: {
  kind: "about" | "how-it-works" | "privacy" | "terms";
}) {
  const { store, clear } = usePrototype();
  const navigate = useNavigate();
  const headings = {
    about: [
      "About SaharaSetu",
      "A simpler bridge between citizens and the support they need.",
    ],
    "how-it-works": [
      "A clear path to your next step",
      "From a little information to a more confident journey.",
    ],
    privacy: [
      "Your information, your choice",
      "Understand exactly what this local prototype stores and how to manage it.",
    ],
    terms: [
      "Terms of this prototype",
      "A clear view of the demonstration, its boundaries and your responsibilities.",
    ],
  };
  return (
    <div className="container ss-utility-wrap">
      <PageTitle title={headings[kind][0]} description={headings[kind][1]} />
      {kind === "about" ? (
        <>
          <div className="ss-utility-story">
            <div>
              <span className="eyebrow">GOVERNMENT SCHEMES MADE SIMPLE</span>
              <h2>Good guidance should feel approachable.</h2>
              <p>
                Finding support can involve unfamiliar requirements, documents
                and application steps. SaharaSetu explores how thoughtful design
                can bring those pieces together in one citizen-friendly
                experience.
              </p>
              <p>
                This independent prototype uses fictional records to demonstrate
                profile-based discovery, transparent example-rule checks and
                preparation guidance.
              </p>
              <BtnLink to="/register">
                Start exploring <Arrow />
              </BtnLink>
            </div>
            <img
              src="/assets/citizens-hero.webp"
              width="1536"
              height="1024"
              alt="Indian citizens from different walks of life"
            />
          </div>
          <div className="ss-value-grid">
            {[
              {
                title: "Built around citizens",
                text: "Clear language, readable layouts and practical next steps.",
                icon: Heart,
              },
              {
                title: "Rules that explain themselves",
                text: "Each example eligibility result shows the rule and the profile value used.",
                icon: ShieldCheck,
              },
              {
                title: "Official sources matter",
                text: "Real benefits and approvals must be confirmed with government departments.",
                icon: Landmark,
              },
            ].map(({ title, text, icon: Icon }) => (
              <Panel key={title} title={title} icon={Icon}>
                <p>{text}</p>
              </Panel>
            ))}
          </div>
          <DemoNotice />
          <OfficialLink />
        </>
      ) : kind === "how-it-works" ? (
        <>
          <div className="ss-how-page">
            {[
              {
                title: "Create your sample profile",
                description:
                  "Follow the registration walkthrough and add your location, education, work and interests.",
                path: "/register",
                icon: UserRound,
              },
              {
                title: "Discover relevant opportunities",
                description:
                  "Search fictional scheme records and filter by category, government level and sample location.",
                path: "/schemes",
                icon: Search,
              },
              {
                title: "Understand every example rule",
                description:
                  "Compare your sample details against fictional rules. See clear reasons and missing information.",
                path: "/eligibility/education-loan",
                icon: ShieldCheck,
              },
              {
                title: "Prepare for an official next step",
                description:
                  "Use the local document checklist, then confirm actual requirements through official channels.",
                path: "/guidance/education-loan",
                icon: FileCheck2,
              },
            ].map(({ title, description, path, icon: Icon }, i) => (
              <Panel key={title}>
                <div className="ss-how-number">
                  0{i + 1}
                  <Icon size={27} />
                </div>
                <h2>{title}</h2>
                <p>{description}</p>
                <BtnLink to={path} secondary>
                  Explore this step <Arrow />
                </BtnLink>
              </Panel>
            ))}
          </div>
          <Panel
            title="Recommendations guide. Official rules decide."
            icon={ShieldCheck}
          >
            <p>
              The prototype ranks records using your interests and location. Its
              example eligibility checker uses explicit fictional rules. No AI
              service is connected, and no demo result determines real
              government eligibility or approval.
            </p>
            <OfficialLink />
          </Panel>
        </>
      ) : kind === "privacy" ? (
        <>
          <div className="ss-prose-grid">
            <article className="ss-prose">
              <h2>What is stored</h2>
              <p>
                The profile details you enter, your saved schemes, comparisons,
                notification preferences, checklist progress and support drafts
                are saved in this browser’s localStorage under the SaharaSetu
                prototype key.
              </p>
              <h2>What is not collected</h2>
              <p>
                This prototype does not store passwords, Aadhaar numbers,
                banking details or uploaded identity documents. The visible
                verification code is a test code, not email verification.
              </p>
              <h2>Where your data goes</h2>
              <p>
                No account server, authentication provider, email service, SMS
                service or scheme backend is connected. Support drafts are not
                sent. Local information is shared by anyone using this browser
                profile; it is not isolated into real user accounts.
              </p>
              <h2>Your controls</h2>
              <p>
                You can edit your profile, remove saved schemes, download a JSON
                copy of your local data or clear the prototype data. Clearing
                browser storage removes the locally saved information, but not
                any exported files.
              </p>
              <h2>External government links</h2>
              <p>
                Following an official portal link opens a separate website with
                its own privacy practices. SaharaSetu does not transfer your
                prototype profile or search filters to that site.
              </p>
              <h2>Before production use</h2>
              <p>
                A production privacy notice must reflect the actual operator,
                services, data flows and retention policy. This notice describes
                only this browser-local implementation.
              </p>
            </article>
            <aside>
              <Panel title="Your local data" icon={ShieldCheck}>
                <p>
                  Profile: {store.profile.name || "Not yet created"}
                  <br />
                  Saved schemes: {store.saved.length}
                  <br />
                  Support drafts: {store.tickets.length}
                </p>
                <BtnLink to="/settings" secondary>
                  Manage data <Arrow />
                </BtnLink>
                <ConfirmDialog
                  trigger="Clear prototype data"
                  title="Clear your local prototype data?"
                  description="This removes saved profile details, preferences, schemes, comparisons, checklists and drafts from this browser."
                  label="Clear local data"
                  danger
                  onConfirm={() => {
                    clear();
                    navigate("/");
                  }}
                />
              </Panel>
            </aside>
          </div>
        </>
      ) : (
        <article className="ss-prose ss-terms">
          <h2>An independent demonstration</h2>
          <p>
            SaharaSetu is a product prototype, not a government website,
            authorized agent or benefits provider. Its scheme records and rule
            thresholds are fictional examples.
          </p>
          <h2>No government decisions or submissions</h2>
          <p>
            Recommendation rankings and eligibility results demonstrate
            interface behavior. They are not official eligibility assessments,
            approvals, applications or guarantees of benefits. Use official
            government guidelines and application channels for actual schemes.
          </p>
          <h2>Use sample information</h2>
          <p>
            Use fictional details while exploring. Do not enter real account
            passwords, identity numbers, banking information or sensitive
            documents. Local data can be viewed by anyone using the same browser
            profile.
          </p>
          <h2>Authentication and messages</h2>
          <p>
            Registration, login, email verification and password reset screens
            are local walkthroughs. No real account is created, no identity is
            authenticated and no email or SMS is sent. Support messages remain
            local drafts.
          </p>
          <h2>Managing your data</h2>
          <p>
            You can review, export and clear your prototype data in Settings.
            The interface currently supports English; other language selections
            save preferences only.
          </p>
          <h2>External sources</h2>
          <p>
            Official links take you to a separate government portal. Confirm
            current scheme rules, deadlines, documents and application details
            there. Its own terms apply.
          </p>
          <h2>Production readiness</h2>
          <p>
            These terms describe the current prototype. Operator details and
            service-specific terms must be established before a production
            launch.
          </p>
          <div className="ss-actions">
            <BtnLink to="/privacy" secondary>
              Read privacy notice
            </BtnLink>
            <BtnLink to="/schemes">
              Explore the prototype <Arrow />
            </BtnLink>
          </div>
        </article>
      )}
    </div>
  );
}
