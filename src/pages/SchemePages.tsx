import { useEffect, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Info,
  Landmark,
  ListFilter,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
  Share2,
  ExternalLink,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  schemes,
  categoryData,
  checkScheme,
  getScheme,
  profileCompletion,
  type Scheme,
} from "../data";
import { usePrototype } from "../state";
import {
  Arrow,
  BackLink,
  BtnLink,
  CategoryIcon,
  CheckList,
  DemoNotice,
  EmptyState,
  Field,
  OfficialLink,
  PageTitle,
  Panel,
  Progress,
  SchemeCard,
  SelectField,
  StatCards,
} from "../components/ui";
function relevance(s: Scheme, interests: string[], state: string) {
  return (
    (interests.includes(s.category) ? 2 : 0) +
    (s.state === state ? 1 : 0) +
    (s.level === "Central" ? 0.2 : 0)
  );
}
export function DashboardPage() {
  const { store, loadDemo } = usePrototype();
  const p = store.profile;
  const matches = [...schemes].sort(
    (a, b) =>
      relevance(b, p.interests, p.state) - relevance(a, p.interests, p.state),
  );
  const completion = profileCompletion(p);
  return (
    <>
      <PageTitle
        title={`Welcome${p.name ? `, ${p.name.split(" ")[0]}` : ""}. A world of possibility awaits.`}
        description="Discover support, understand your options and take the next step with confidence."
        eyebrow="YOUR SAHARASETU OVERVIEW"
      />
      <DemoNotice />
      <div className="ss-profile-banner">
        <div>
          <Sparkles size={25} />
          <div>
            <strong>
              {completion === 100
                ? "Your sample profile is ready to explore."
                : "A few details can make discovery more useful."}
            </strong>
            <p>{completion}% of the core profile fields are complete.</p>
          </div>
        </div>
        <BtnLink to="/onboarding/personal">
          {completion === 100 ? "Review profile" : "Complete profile"}
          <Arrow />
        </BtnLink>
      </div>
      <StatCards
        items={[
          {
            label: "Demo opportunities",
            value: schemes.length,
            icon: GraduationCap,
            path: "/schemes",
            hint: "Fictional records",
          },
          {
            label: "Saved schemes",
            value: store.saved.length,
            icon: Bookmark,
            path: "/saved",
          },
          {
            label: "Schemes to compare",
            value: store.compare.length,
            icon: SlidersHorizontal,
            path: "/compare",
          },
          {
            label: "Profile completeness",
            value: `${completion}%`,
            icon: UserRound,
            path: "/profile",
          },
        ]}
      />
      <div className="ss-dashboard-columns">
        <div>
          <div className="ss-section-title">
            <div>
              <span className="eyebrow">A STARTING POINT FOR YOU</span>
              <h2>Recommended opportunities</h2>
            </div>
            <Link className="ss-inline-link" to="/recommendations">
              View all <Arrow />
            </Link>
          </div>
          <p className="ss-section-note">
            Example records ranked by your selected interests and location. No
            live AI or verified scheme feed is connected.
          </p>
          <div className="ss-scheme-grid ss-dashboard-schemes">
            {matches.slice(0, 3).map((s) => (
              <SchemeCard
                key={s.id}
                scheme={s}
                recommended={p.interests.includes(s.category)}
              />
            ))}
          </div>
          <Panel title="Explore by category" icon={Search}>
            <div className="ss-category-links">
              {categoryData.map((c) => (
                <Link
                  to={`/schemes?category=${encodeURIComponent(c.name)}`}
                  key={c.name}
                >
                  <CategoryIcon category={c.name} />
                  <span>{c.name}</span>
                  <Arrow />
                </Link>
              ))}
            </div>
          </Panel>
        </div>
        <aside>
          <Panel
            title="Your profile snapshot"
            icon={UserRound}
            action={
              <Link className="ss-inline-link" to="/profile">
                Edit
              </Link>
            }
          >
            <span className="ss-large-avatar">
              {(p.name || "C").slice(0, 1)}
            </span>
            <h3>{p.name || "Your citizen profile"}</h3>
            <dl className="ss-data-list">
              <div>
                <dt>State</dt>
                <dd>{p.state || "Not yet added"}</dd>
              </div>
              <div>
                <dt>Occupation</dt>
                <dd>{p.status || "Not yet added"}</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>{p.qualification || "Not yet added"}</dd>
              </div>
            </dl>
            <Progress value={completion} />
            <Link className="ss-inline-link" to="/onboarding/personal">
              Complete your details <Arrow />
            </Link>
          </Panel>
          <Panel title="Quick next steps" icon={Sparkles}>
            <div className="ss-quick-links">
              <Link to="/eligibility/education-loan">
                <ClipboardCheck size={19} /> Try an eligibility check <Arrow />
              </Link>
              <Link to="/guidance/education-loan">
                <FileCheck2 size={19} /> Prepare your documents <Arrow />
              </Link>
              <Link to="/help">
                <Info size={19} /> Get a little guidance <Arrow />
              </Link>
            </div>
          </Panel>
          {!p.name && (
            <Panel title="Just looking around?">
              <p>
                Load a fictional profile to explore the complete experience.
              </p>
              <button className="button secondary ss-full" onClick={loadDemo}>
                Use sample profile <Sparkles size={17} />
              </button>
            </Panel>
          )}
        </aside>
      </div>
      <Panel
        className="ss-responsible-banner"
        title="Your next step deserves clear information"
        icon={ShieldCheck}
      >
        <p>
          These records demonstrate the product experience. For actual benefits,
          requirements and application links, continue to the official portal.
        </p>
        <OfficialLink />
      </Panel>
    </>
  );
}
export function CataloguePage({
  mode = "catalogue",
}: {
  mode?: "catalogue" | "recommendations" | "saved";
}) {
  const { store, update, notify } = usePrototype();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get("category") || "";
  const level = params.get("level") || "";
  const state = params.get("state") || "";
  const sort = params.get("sort") || "Relevance";
  const page = Math.max(1, Number(params.get("page")) || 1);
  useEffect(() => setQuery(params.get("query") || ""), [params]);
  const items = (
    mode === "saved"
      ? schemes.filter((s) => store.saved.includes(s.id))
      : schemes
  ).filter(
    (s) =>
      (!category || s.category === category) &&
      (!level || s.level === level) &&
      (!state || s.state === state || s.state === "Across India") &&
      (!params.get("query") ||
        `${s.name} ${s.description} ${s.category} ${s.tags.join(" ")}`
          .toLowerCase()
          .includes(params.get("query")!.toLowerCase())),
  );
  items.sort((a, b) =>
    sort === "Name A–Z"
      ? a.name.localeCompare(b.name)
      : sort === "Name Z–A"
        ? b.name.localeCompare(a.name)
        : relevance(b, store.profile.interests, store.profile.state) -
          relevance(a, store.profile.interests, store.profile.state),
  );
  const maxPage = Math.max(1, Math.ceil(items.length / 6));
  const current = Math.min(page, maxPage);
  const visible = items.slice((current - 1) * 6, current * 6);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    filter("query", query.trim());
  }
  const title =
    mode === "saved"
      ? "Saved schemes"
      : mode === "recommendations"
        ? "Recommended schemes for you"
        : "Find government schemes";
  const description =
    mode === "saved"
      ? "Keep your possibilities close. Revisit the opportunities you have saved."
      : mode === "recommendations"
        ? "A useful starting point, shaped by your sample profile and interests."
        : "Explore opportunities by category, location and the support you need.";
  return (
    <>
      <PageTitle title={title} description={description} />
      <DemoNotice />
      {mode === "recommendations" && (
        <div className="ss-note">
          <Sparkles size={20} />
          <p>
            Ranked using your chosen interests and location — a deterministic
            demonstration, not AI eligibility.{" "}
            <Link to="/onboarding/preferences">Update interests</Link>
          </p>
        </div>
      )}
      {mode === "saved" && (
        <StatCards
          items={[
            {
              label: "Saved demo schemes",
              value: store.saved.length,
              icon: Bookmark,
            },
            {
              label: "For comparison",
              value: store.compare.length,
              icon: SlidersHorizontal,
              path: "/compare",
            },
            {
              label: "Selected interests",
              value: store.profile.interests.length,
              icon: Sparkles,
              path: "/onboarding/preferences",
            },
          ]}
        />
      )}
      <form className="ss-catalog-search" onSubmit={submit}>
        <Search size={21} />
        <label className="sr-only" htmlFor="catalogue-search">
          Search catalogue
        </label>
        <input
          id="catalogue-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search education, housing, healthcare…"
          maxLength={120}
        />
        <button className="button primary">
          Search <Arrow />
        </button>
      </form>
      <div className="ss-category-strip">
        {categoryData.map((c) => (
          <button
            key={c.name}
            className={category === c.name ? "active" : ""}
            aria-pressed={category === c.name}
            onClick={() =>
              filter("category", category === c.name ? "" : c.name)
            }
          >
            <CategoryIcon category={c.name} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>
      <div className="ss-mobile-filter-actions">
        <button
          className="button secondary"
          aria-expanded={filtersOpen}
          aria-controls="catalogue-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <ListFilter size={18} /> {filtersOpen ? "Hide filters" : "Filters"}
        </button>
        <span>{items.length} demo records</span>
      </div>
      <div className="ss-catalog-layout">
        <aside
          id="catalogue-filters"
          className={`ss-catalog-filters ${filtersOpen ? "open" : ""}`}
        >
          <Panel
            title="Filters"
            icon={ListFilter}
            action={
              <button className="ss-inline-link" onClick={() => setParams({})}>
                Clear all
              </button>
            }
          >
            <SelectField
              id="filter-category"
              label="Scheme category"
              value={category}
              onChange={(v) => filter("category", v)}
              options={categoryData.map((c) => c.name)}
            />
            <SelectField
              id="filter-level"
              label="Government level (example)"
              value={level}
              onChange={(v) => filter("level", v)}
              options={["Central", "State"]}
            />
            <SelectField
              id="filter-state"
              label="State (sample dataset)"
              value={state}
              onChange={(v) => filter("state", v)}
              options={["Tamil Nadu", "Karnataka", "Maharashtra"]}
            />
            <p className="ss-field-help">
              Central demo records are shown across all locations.
            </p>
            <Link className="ss-inline-link" to="/onboarding/personal">
              Update your profile <Arrow />
            </Link>
          </Panel>
          <Panel title="Know where to go next" icon={ShieldCheck}>
            <p>
              Always confirm actual eligibility and application rules with the
              relevant government department.
            </p>
            <OfficialLink />
          </Panel>
        </aside>
        <div className="ss-results">
          <div className="ss-results-toolbar">
            <h2>
              {items.length}{" "}
              {items.length === 1
                ? "demonstration scheme"
                : "demonstration schemes"}
            </h2>
            <label>
              Sort by
              <select
                aria-label="Sort schemes"
                value={sort}
                onChange={(e) => filter("sort", e.target.value)}
              >
                {["Relevance", "Name A–Z", "Name Z–A"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          {visible.length ? (
            <>
              <div className="ss-scheme-grid">
                {visible.map((s) => (
                  <SchemeCard
                    key={s.id}
                    scheme={s}
                    recommended={
                      mode === "recommendations" &&
                      store.profile.interests.includes(s.category)
                    }
                  />
                ))}
              </div>
              <nav className="ss-pagination" aria-label="Catalogue pagination">
                <button
                  className="button secondary"
                  disabled={current === 1}
                  onClick={() => filter("page", String(current - 1))}
                >
                  <ArrowLeft size={15} /> Previous
                </button>
                <span>
                  Page {current} of {maxPage}
                </span>
                <button
                  className="button secondary"
                  disabled={current === maxPage}
                  onClick={() => filter("page", String(current + 1))}
                >
                  Next <Arrow />
                </button>
              </nav>
            </>
          ) : mode === "saved" && !store.saved.length ? (
            <EmptyState
              title="Your possibilities, kept in one place."
              description="Save a demonstration scheme with its heart button. You can return to it here at any time."
            />
          ) : (
            <div className="ss-empty">
              <Search size={35} />
              <h2>No matches for these filters</h2>
              <p>
                Try a broader keyword or clear your filters to see all example
                records.
              </p>
              <button className="button primary" onClick={() => setParams({})}>
                Clear filters <Arrow />
              </button>
            </div>
          )}
          {mode === "saved" && store.saved.length > 0 && (
            <button
              className="ss-inline-link"
              onClick={() => {
                update((s) => ({
                  ...s,
                  saved: s.saved.filter(
                    (id) => !items.some((s) => s.id === id),
                  ),
                }));
                notify("Visible schemes removed from saved items.");
              }}
            >
              Remove filtered schemes from saved items
            </button>
          )}
        </div>
      </div>
      {store.compare.length > 0 && (
        <div className="ss-comparison-bar">
          <span>
            <SlidersHorizontal size={18} /> {store.compare.length} selected for
            comparison
          </span>
          <BtnLink to="/compare">
            Compare schemes <Arrow />
          </BtnLink>
        </div>
      )}
    </>
  );
}
export function SchemeDetailsPage() {
  const { id } = useParams();
  const s = getScheme(id);
  const { store, toggleSaved, notify } = usePrototype();
  const [tab, setTab] = useState("Overview");
  if (!s)
    return (
      <>
        <BackLink />
        <EmptyState
          title="Scheme not found"
          description="This example record is not part of the prototype dataset."
        />
      </>
    );
  const tabs = [
    "Overview",
    "Benefits",
    "Eligibility",
    "Documents",
    "Application process",
    "FAQs",
  ];
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Scheme link copied.");
    } catch {
      notify(
        "Copy the page URL from your browser to share this demonstration.",
      );
    }
  }
  return (
    <>
      <BackLink />
      <PageTitle
        title={s.name}
        description={s.description}
        eyebrow={`${s.category.toUpperCase()} · DEMONSTRATION SCHEME`}
        action={
          <>
            <BtnLink to={`/guidance/${s.id}`}>
              Application guidance <Arrow />
            </BtnLink>
            <button
              className="button secondary"
              aria-pressed={store.saved.includes(s.id)}
              onClick={() => toggleSaved(s.id)}
            >
              <Bookmark size={17} />
              {store.saved.includes(s.id) ? "Saved" : "Save scheme"}
            </button>
            <button className="button secondary" onClick={share}>
              <Share2 size={16} /> Share
            </button>
          </>
        }
      />
      <DemoNotice />
      <div
        className="ss-detail-tabs"
        role="tablist"
        aria-label="Scheme details sections"
      >
        {tabs.map((t) => (
          <button
            key={t}
            id={`tab-${t.replace(/\s/g, "-")}`}
            role="tab"
            aria-selected={tab === t}
            aria-controls="scheme-tab-panel"
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="ss-detail-columns">
        <div
          id="scheme-tab-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab.replace(/\s/g, "-")}`}
          tabIndex={0}
        >
          {tab === "Overview" ? (
            <>
              <Panel title="About this demonstration" icon={FileText}>
                <p>
                  {s.description} This fictional record shows how a scheme
                  detail page can bring benefits, rules, documents and next
                  steps together.
                </p>
                <p>
                  It does not represent a currently available government
                  benefit.
                </p>
              </Panel>
              <Benefits s={s} />
              <Rules s={s} />
            </>
          ) : tab === "Benefits" ? (
            <Benefits s={s} />
          ) : tab === "Eligibility" ? (
            <Rules s={s} />
          ) : tab === "Documents" ? (
            <Panel title="Example document checklist" icon={FileCheck2}>
              <CheckList items={s.requiredDocuments} />
              <p className="ss-field-help">
                Documents are examples. Actual requirements must come from
                official guidelines. No uploads are collected here.
              </p>
              <BtnLink to={`/guidance/${s.id}`}>
                Prepare your checklist <Arrow />
              </BtnLink>
            </Panel>
          ) : tab === "Application process" ? (
            <Panel title="A clearer path to applying" icon={ClipboardCheck}>
              <CheckList
                items={[
                  "Find the actual scheme on an official government portal",
                  "Read the latest eligibility criteria and application guidelines",
                  "Gather only the documents requested by the department",
                  "Submit through the official channel and keep the acknowledgement",
                ]}
              />
              <BtnLink to={`/guidance/${s.id}`}>
                Open preparation guide <Arrow />
              </BtnLink>
            </Panel>
          ) : (
            <Panel title="Frequently asked questions" icon={Info}>
              {[
                [
                  "Is this a real government scheme?",
                  "No. This fictional record is designed to demonstrate the SaharaSetu experience.",
                ],
                [
                  "Does a match mean I qualify?",
                  "No. Example matches only check the fictional rules shown here. Government departments determine actual eligibility.",
                ],
                [
                  "Can I apply through this prototype?",
                  "No applications are sent. Use the official government portal for an actual application.",
                ],
              ].map(([q, a]) => (
                <details className="ss-faq" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </Panel>
          )}
        </div>
        <aside>
          <Panel title="At a glance" icon={Landmark}>
            <dl className="ss-data-list">
              <div>
                <dt>Category</dt>
                <dd>{s.category}</dd>
              </div>
              <div>
                <dt>Government level</dt>
                <dd>{s.level} (example)</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{s.state}</dd>
              </div>
              <div>
                <dt>Application status</dt>
                <dd>Demonstration only</dd>
              </div>
              <div>
                <dt>Deadline</dt>
                <dd>No official deadline supplied</dd>
              </div>
            </dl>
          </Panel>
          <Panel title="Check the example rules" icon={ShieldCheck}>
            <p>
              See how a rule-based eligibility walkthrough uses your sample
              profile.
            </p>
            <BtnLink to={`/eligibility/${s.id}`}>
              Check demo eligibility <Arrow />
            </BtnLink>
          </Panel>
          <Panel title="Official resources" icon={ExternalLink}>
            <p>
              Find current schemes, verified requirements and department
              application links.
            </p>
            <OfficialLink />
          </Panel>
        </aside>
      </div>
    </>
  );
}
function Benefits({ s }: { s: Scheme }) {
  return (
    <Panel title="Illustrative benefits" icon={Sparkles}>
      <div className="ss-benefit-grid">
        {[
          s.benefit,
          "A clear view of requirements",
          "A document preparation checklist",
          "Guidance toward official sources",
        ].map((v, i) => (
          <div key={v}>
            <span>
              {
                [
                  <GraduationCap />,
                  <ShieldCheck />,
                  <FileCheck2 />,
                  <Landmark />,
                ][i]
              }
            </span>
            <strong>{v}</strong>
            <p>Example content for the prototype experience.</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function Rules({ s }: { s: Scheme }) {
  return (
    <Panel title="Example eligibility criteria" icon={ClipboardCheck}>
      <dl className="ss-data-list">
        <div>
          <dt>Age</dt>
          <dd>
            {s.minAge}–{s.maxAge} years (demo)
          </dd>
        </div>
        <div>
          <dt>Annual household income</dt>
          <dd>Up to ₹{s.maxIncome.toLocaleString("en-IN")} (demo)</dd>
        </div>
        <div>
          <dt>State</dt>
          <dd>{s.state}</dd>
        </div>
        {s.occupation && (
          <div>
            <dt>Occupation</dt>
            <dd>{s.occupation}</dd>
          </div>
        )}
      </dl>
      <p className="ss-field-help">
        These thresholds are invented for testing. They must never be used to
        assess eligibility for real schemes.
      </p>
    </Panel>
  );
}
export function EligibilityPage({ results = false }: { results?: boolean }) {
  const { id } = useParams();
  const s = getScheme(id);
  const { store, updateProfile } = usePrototype();
  const navigate = useNavigate();
  if (!s)
    return (
      <EmptyState
        title="Scheme not found"
        description="Choose a demonstration scheme to begin."
      />
    );
  const checks = checkScheme(s, store.profile);
  const failed = checks.some((c) => c.status === "fail");
  const missing = checks.some((c) => c.status === "missing");
  const title = failed
    ? "Does not meet the example rules"
    : missing
      ? "A few details are still needed"
      : "Your profile matches the example rules";
  const percent = Math.round(
    (checks.filter((c) => c.status === "pass").length / checks.length) * 100,
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    navigate(`/eligibility/${s!.id}/results`);
  }
  return (
    <>
      <BackLink to={`/schemes/${s.id}`} label="Back to scheme details" />
      <PageTitle
        title={
          results ? "Eligibility results & next steps" : "Eligibility checker"
        }
        description={
          results
            ? "Understand each rule, see what needs attention and choose your next step."
            : "Compare your sample profile with the fictional rules in this demonstration."
        }
      />
      <DemoNotice />
      <div className="ss-selected-scheme">
        <CategoryIcon category={s.category} />
        <div>
          <strong>{s.name}</strong>
          <small>{s.category} · Demo record</small>
        </div>
        <Link className="ss-inline-link" to={`/schemes/${s.id}`}>
          View details <Arrow />
        </Link>
      </div>
      {results ? (
        <>
          <div
            className={`ss-result-summary ${failed ? "fail" : missing ? "missing" : "pass"}`}
          >
            <span>
              {failed || missing ? (
                <AlertCircle size={34} />
              ) : (
                <CheckCircle2 size={34} />
              )}
            </span>
            <div>
              <h2>{title}</h2>
              <p>
                This is an example-rule result. It is not official eligibility,
                an approval or a benefit guarantee.
              </p>
            </div>
            <div className="ss-result-percent">
              <strong>{percent}%</strong>
              <small>Example rules met</small>
            </div>
          </div>
          <div className="ss-detail-columns">
            <Panel title="A clear look at every rule" icon={ClipboardCheck}>
              <div className="ss-rule-results">
                {checks.map((c) => (
                  <div key={c.label}>
                    <span className={`ss-rule-icon ${c.status}`}>
                      {c.status === "pass" ? (
                        <Check size={18} />
                      ) : c.status === "fail" ? (
                        <X size={18} />
                      ) : (
                        <Info size={18} />
                      )}
                    </span>
                    <div>
                      <strong>{c.label}</strong>
                      <p>Your profile: {c.value}</p>
                      <small>Example requirement: {c.expected}</small>
                    </div>
                    <b className={`ss-status ${c.status}`}>
                      {c.status === "pass"
                        ? "Matches"
                        : c.status === "fail"
                          ? "Does not match"
                          : "Needs detail"}
                    </b>
                  </div>
                ))}
              </div>
              <div className="ss-actions">
                <BtnLink to={`/eligibility/${s.id}`} secondary>
                  Check again
                </BtnLink>
                <BtnLink to={`/guidance/${s.id}`}>
                  Document guidance <Arrow />
                </BtnLink>
              </div>
            </Panel>
            <aside>
              <Panel title="Your next step" icon={Sparkles}>
                <CheckList
                  items={
                    missing
                      ? [
                          "Add the missing profile information",
                          "Check your sample details for accuracy",
                          "Repeat the demonstration check",
                        ]
                      : [
                          "Review the actual scheme’s official guidelines",
                          "Confirm your supporting documents",
                          "Apply only through an official channel",
                        ]
                  }
                />
                <BtnLink to="/onboarding/personal" secondary>
                  Update profile
                </BtnLink>
              </Panel>
              <Panel title="Important to remember" icon={ShieldCheck}>
                <p>
                  AI does not decide eligibility here. This result is calculated
                  from the fictional age, income, location and occupation rules.
                  Real approval belongs to the government department.
                </p>
                <OfficialLink />
              </Panel>
            </aside>
          </div>
          <div className="ss-section-title">
            <h2>Explore other possibilities</h2>
            <Link className="ss-inline-link" to="/recommendations">
              View recommendations <Arrow />
            </Link>
          </div>
          <div className="ss-scheme-grid">
            {schemes
              .filter((x) => x.id !== s.id)
              .slice(0, 3)
              .map((s) => (
                <SchemeCard scheme={s} key={s.id} />
              ))}
          </div>
        </>
      ) : (
        <div className="ss-detail-columns">
          <Panel
            title="Your sample profile"
            icon={UserRound}
            action={
              <Link className="ss-inline-link" to="/profile">
                View profile
              </Link>
            }
          >
            <form onSubmit={submit}>
              <div className="ss-form-grid">
                <Field
                  id="eligibility-birth"
                  label="Date of birth"
                  type="date"
                  value={store.profile.birthDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => updateProfile({ birthDate: e.target.value })}
                />
                <Field
                  id="eligibility-income"
                  label="Annual household income (₹)"
                  type="number"
                  min={0}
                  max={100000000}
                  value={store.profile.income}
                  onChange={(e) => updateProfile({ income: e.target.value })}
                />
                <SelectField
                  id="eligibility-state"
                  label="State"
                  value={store.profile.state}
                  options={[
                    "Tamil Nadu",
                    "Karnataka",
                    "Maharashtra",
                    "Kerala",
                    "Delhi",
                    "Other state / union territory",
                  ]}
                  onChange={(state) => updateProfile({ state })}
                />
                <SelectField
                  id="eligibility-employment"
                  label="Employment status"
                  value={store.profile.status}
                  options={[
                    "Student",
                    "Employed",
                    "Self-employed",
                    "Unemployed",
                    "Farmer",
                    "Retired",
                  ]}
                  onChange={(status) => updateProfile({ status })}
                />
              </div>
              <div className="ss-note">
                <Info size={18} />
                <p>
                  You may leave a field empty to test the “more information
                  needed” result. Changes are saved to your sample profile.
                </p>
              </div>
              <button className="button primary ss-full">
                Check example rules <Arrow />
              </button>
            </form>
          </Panel>
          <aside>
            <Rules s={s} />
            <Panel title="Clear rules, clear reasons" icon={ShieldCheck}>
              <p>
                Each result explains the exact rule that matched, failed or
                needs more information. No AI judgement is used.
              </p>
            </Panel>
          </aside>
        </div>
      )}
    </>
  );
}
export function GuidancePage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const s = getScheme(id);
  const { store, update, notify } = usePrototype();
  const [stage, setStage] = useState(0);
  if (!s)
    return (
      <EmptyState
        title="Scheme not found"
        description="Choose an example record to prepare its checklist."
      />
    );
  const docs = store.documents[s.id] || [];
  const stages = ["Understand", "Check", "Prepare", "Official next step"];
  function toggle(doc: string) {
    update((v) => ({
      ...v,
      documents: {
        ...v.documents,
        [s!.id]: docs.includes(doc)
          ? docs.filter((d) => d !== doc)
          : [...docs, doc],
      },
    }));
  }
  function download() {
    const body = `SaharaSetu demonstration checklist\n${s!.name}\nNot an official application or scheme.\n\n${s!.requiredDocuments.map((d) => `${docs.includes(d) ? "[x]" : "[ ]"} ${d}`).join("\n")}\n\nActual requirements must be checked on an official government portal.`;
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${s!.id}-demo-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Demonstration checklist downloaded.");
  }
  const tracker = params.get("tab") === "applications";
  return (
    <>
      <BackLink to={`/schemes/${s.id}`} label="Back to scheme details" />
      <PageTitle
        title={tracker ? "Your preparation tracker" : "Application guidance"}
        description="A practical checklist to help you understand the steps before applying officially."
      />
      <DemoNotice />
      <div className="ss-selected-scheme">
        <CategoryIcon category={s.category} />
        <div>
          <strong>{s.name}</strong>
          <small>Preparation guide · No application is submitted here</small>
        </div>
        <button
          className="ss-inline-link"
          onClick={() => setParams(tracker ? {} : { tab: "applications" })}
        >
          {tracker ? "View guide" : "View preparation tracker"}
          <Arrow />
        </button>
      </div>
      <div className="ss-guidance-steps">
        {stages.map((label, i) => (
          <button
            key={label}
            className={i === stage ? "active" : ""}
            aria-pressed={i === stage}
            onClick={() => setStage(i)}
          >
            <span>{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="ss-detail-columns">
        <Panel
          title={
            tracker
              ? "Document preparation status"
              : `${stage + 1}. ${["Understand the scheme", "Check the example rules", "Prepare your documents", "Continue with official guidance"][stage]}`
          }
          icon={FileCheck2}
        >
          {tracker ? (
            <>
              <Progress
                value={Math.round(
                  (docs.length / s.requiredDocuments.length) * 100,
                )}
                label="Checklist preparation"
              />
              <p>
                You have marked {docs.length} of {s.requiredDocuments.length}{" "}
                example documents as ready. This is a local checklist, not a
                submitted application status.
              </p>
              <button
                className="button secondary"
                onClick={() => setParams({})}
              >
                Return to step-by-step guide <Arrow />
              </button>
            </>
          ) : (
            <>
              <p>
                {
                  [
                    "Begin by reading the scheme overview, benefits and eligibility criteria. This guide uses a fictional record for demonstration.",
                    "Use your sample profile to walk through the example rules. For a real scheme, verify every criterion from official guidance.",
                    "Mark the example documents you have prepared. Do not upload documents or enter any identity numbers here.",
                    "Find the actual government scheme on an official portal. Read the latest guidelines, follow the department’s application channel and keep any official acknowledgement.",
                  ][stage]
                }
              </p>
              {stage === 0 && (
                <CheckList
                  items={[
                    "Know what support the scheme provides",
                    "Confirm the department and official source",
                    "Read the current eligibility and document requirements",
                  ]}
                />
              )}{" "}
              {stage === 1 && (
                <BtnLink to={`/eligibility/${s.id}`}>
                  Open example eligibility check <Arrow />
                </BtnLink>
              )}
              {stage === 2 && (
                <div className="ss-document-checks">
                  {s.requiredDocuments.map((d) => (
                    <label key={d}>
                      <input
                        type="checkbox"
                        checked={docs.includes(d)}
                        onChange={() => toggle(d)}
                      />
                      <span>{d}</span>
                      <small>{docs.includes(d) ? "Ready" : "To prepare"}</small>
                    </label>
                  ))}
                </div>
              )}
              {stage === 3 && (
                <>
                  <div className="ss-note">
                    <ShieldCheck size={20} />
                    <p>
                      Nothing is submitted from SaharaSetu. An official
                      application must be made through the relevant government
                      department.
                    </p>
                  </div>
                  <OfficialLink>Continue to official myScheme</OfficialLink>
                </>
              )}
              <div className="ss-form-navigation">
                <button
                  className="button secondary"
                  disabled={stage === 0}
                  onClick={() => setStage(stage - 1)}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <button
                  className="button primary"
                  disabled={stage === 3}
                  onClick={() => setStage(stage + 1)}
                >
                  Next step <Arrow />
                </button>
              </div>
            </>
          )}
        </Panel>
        <aside>
          <Panel
            title="Example required documents"
            icon={FileText}
            action={
              <button className="ss-inline-link" onClick={download}>
                Download
              </button>
            }
          >
            <div className="ss-document-checks">
              {s.requiredDocuments.map((d) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    checked={docs.includes(d)}
                    onChange={() => toggle(d)}
                  />
                  <span>{d}</span>
                  <small>{docs.includes(d) ? "Ready" : "Needed"}</small>
                </label>
              ))}
            </div>
            <Progress
              value={Math.round(
                (docs.length / s.requiredDocuments.length) * 100,
              )}
              label="Preparation progress"
            />
            <p className="ss-field-help">
              Availability only. No documents are uploaded, validated or sent.
            </p>
          </Panel>
          <Panel title="Need a little help?" icon={Info}>
            <CheckList
              items={[
                "Review the guidance at your own pace",
                "Keep a copy of the official guidelines",
                "Ask the department about unclear requirements",
              ]}
            />
            <BtnLink to="/help" secondary>
              Help & support <Arrow />
            </BtnLink>
          </Panel>
        </aside>
      </div>
    </>
  );
}
export function ComparisonPage() {
  const { store, update, toggleCompare } = usePrototype();
  const selected = schemes.filter((s) => store.compare.includes(s.id));
  const [add, setAdd] = useState("");
  const available = schemes.filter((s) => !store.compare.includes(s.id));
  return (
    <>
      <PageTitle
        title="Compare schemes"
        description="See the important differences side by side and choose what to explore next."
      />
      <DemoNotice />
      <div className="ss-comparison-picker">
        <label htmlFor="comparison-add">Add a demonstration scheme</label>
        <div>
          <select
            id="comparison-add"
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          >
            <option value="">Choose a scheme</option>
            {available.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            className="button primary"
            disabled={!add || selected.length >= 3}
            onClick={() => {
              toggleCompare(add);
              setAdd("");
            }}
          >
            Add to compare <Arrow />
          </button>
        </div>
        <small>Compare up to three example records.</small>
      </div>
      {selected.length ? (
        <>
          <div className="ss-section-title">
            <h2>
              {selected.length} scheme{selected.length !== 1 ? "s" : ""}{" "}
              selected
            </h2>
            <button
              className="ss-inline-link"
              onClick={() => update((s) => ({ ...s, compare: [] }))}
            >
              Clear comparison
            </button>
          </div>
          <div
            className="ss-compare-grid"
            style={
              { "--compare-count": selected.length } as React.CSSProperties
            }
          >
            {selected.map((s) => (
              <Panel key={s.id} className="ss-compare-card">
                <div className="ss-compare-heading">
                  <CategoryIcon category={s.category} />
                  <button
                    className="icon-button"
                    aria-label={`Remove ${s.name} from comparison`}
                    onClick={() => toggleCompare(s.id)}
                  >
                    <X size={19} />
                  </button>
                </div>
                <h2>{s.name}</h2>
                <span className="ss-demo-pill">Demo record</span>
                <dl className="ss-data-list">
                  <div>
                    <dt>Benefit</dt>
                    <dd>{s.benefit}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{s.category}</dd>
                  </div>
                  <div>
                    <dt>Example location</dt>
                    <dd>{s.state}</dd>
                  </div>
                  <div>
                    <dt>Age rule</dt>
                    <dd>
                      {s.minAge}–{s.maxAge} years
                    </dd>
                  </div>
                  <div>
                    <dt>Income rule</dt>
                    <dd>
                      Up to ₹{s.maxIncome.toLocaleString("en-IN")} annually
                    </dd>
                  </div>
                  <div>
                    <dt>Occupation rule</dt>
                    <dd>{s.occupation || "Not restricted in example"}</dd>
                  </div>
                  <div>
                    <dt>Documents</dt>
                    <dd>{s.requiredDocuments.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Application</dt>
                    <dd>No application is submitted here</dd>
                  </div>
                </dl>
                <BtnLink to={`/schemes/${s.id}`} secondary>
                  View details <Arrow />
                </BtnLink>
                <BtnLink to={`/eligibility/${s.id}`}>
                  Check example rules
                </BtnLink>
              </Panel>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="A clearer choice starts with comparison."
          description="Select up to three schemes using the comparison button on a card, or choose one above."
          icon={SlidersHorizontal}
        />
      )}
    </>
  );
}
