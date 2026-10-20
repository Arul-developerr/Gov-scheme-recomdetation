import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type CSSProperties,
} from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Menu,
  X,
  Globe2,
  ShieldCheck,
  Check,
  Landmark,
  LayoutGrid,
  MapPinned,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  BriefcaseBusiness,
  Sprout,
  House,
  Users,
  UserRoundPlus,
  ScanSearch,
  ClipboardCheck,
  FileCheck2,
  Sparkles,
  CircleHelp,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";

type Category = {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tint: string;
  keywords: string[];
};
const categories: Category[] = [
  {
    name: "Education",
    description: "Scholarships, learning & skill development",
    icon: GraduationCap,
    color: "#0079AA",
    tint: "#EDF8FE",
    keywords: ["student", "scholarship", "loan", "school", "study"],
  },
  {
    name: "Healthcare",
    description: "Health coverage & medical assistance",
    icon: HeartPulse,
    color: "#00836C",
    tint: "#EEF9F4",
    keywords: ["health", "insurance", "medical", "care"],
  },
  {
    name: "Employment",
    description: "Jobs, training & self-employment",
    icon: BriefcaseBusiness,
    color: "#B85A13",
    tint: "#FFF5EB",
    keywords: ["job", "training", "work", "business", "skill"],
  },
  {
    name: "Agriculture",
    description: "Farmer support & agricultural opportunities",
    icon: Sprout,
    color: "#08795C",
    tint: "#EFF8F1",
    keywords: ["farmer", "farm", "crop", "agri"],
  },
  {
    name: "Housing",
    description: "Affordable homes & housing assistance",
    icon: House,
    color: "#7051AD",
    tint: "#F5F1FC",
    keywords: ["home", "house", "housing"],
  },
  {
    name: "Social Welfare",
    description: "Support for families, women & senior citizens",
    icon: Users,
    color: "#B23D61",
    tint: "#FFF1F5",
    keywords: ["women", "senior", "pension", "family", "disability", "welfare"],
  },
];
const steps = [
  {
    title: "Create Your Account",
    description: "Build your profile with a few basic details about you.",
    icon: UserRoundPlus,
  },
  {
    title: "Find Relevant Schemes",
    description:
      "Discover opportunities that match your profile and interests.",
    icon: ScanSearch,
  },
  {
    title: "Check Eligibility",
    description: "Understand the scheme rules and where you may qualify.",
    icon: ClipboardCheck,
  },
  {
    title: "Get Application Guidance",
    description: "Know the documents you need and where to apply officially.",
    icon: FileCheck2,
  },
];
const summary = [
  {
    title: "Central & state schemes",
    description: "Support at every government level",
    icon: Landmark,
    color: "#0079AA",
    tint: "#EDF8FE",
  },
  {
    title: "Life, in every category",
    description: "Explore opportunities for your needs",
    icon: LayoutGrid,
    color: "#00836C",
    tint: "#EEF9F4",
  },
  {
    title: "Discovery across India",
    description: "Find support relevant to your location",
    icon: MapPinned,
    color: "#B85A13",
    tint: "#FFF5EB",
  },
  {
    title: "Official application links",
    description: "Continue with the relevant department",
    icon: ShieldCheck,
    color: "#00836C",
    tint: "#EEF9F4",
  },
];
const dialogContent = {
  login: {
    eyebrow: "YOUR SAHARASETU ACCOUNT",
    title: "Your next chapter starts here.",
    text: "Account sign-in is part of the next phase. This homepage preview does not collect personal information or offer a working login yet.",
    action: "Explore support instead",
  },
  start: {
    eyebrow: "A LITTLE ABOUT YOU. A WORLD OF SUPPORT.",
    title: "A simpler path to opportunity.",
    text: "Profile creation and demonstration recommendations are available. For now, explore scheme categories and continue to the official myScheme portal.",
    action: "Explore scheme categories",
  },
  help: {
    eyebrow: "HERE TO HELP",
    title: "Let’s make the next step clearer.",
    text: "Start with a category or search for the kind of support you need. This preview helps you explore topics; for current scheme rules, documents and application guidance, always consult the official scheme page.",
    action: "Browse categories",
  },
  language: {
    eyebrow: "LANGUAGE",
    title: "A portal for every voice.",
    text: "This homepage is currently available in English. Hindi and regional language support can be added in a later phase. Scheme information on myScheme may have its own language options.",
    action: "Continue in English",
  },
};
type DialogKey = keyof typeof dialogContent;
function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        })
      }
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="SaharaSetu home"
    >
      <img src="/favicon.svg" width="42" height="46" alt="" />
      <span>
        <strong>SaharaSetu</strong>
        <small>Government Schemes Made Simple</small>
      </span>
    </Link>
  );
}
function Arrow({ external = false }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return <Icon className="arrow" size={17} aria-hidden="true" />;
}
function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const [dialogKey, setDialogKey] = useState<DialogKey>("start");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const activeCategory = params.get("category");
  const activeQuery = params.get("query");
  const discoveryOpen =
    params.has("discover") || !!activeCategory || !!activeQuery;
  const filtered = categories.filter(
    (c) =>
      (!activeCategory || c.name === activeCategory) &&
      (!activeQuery ||
        `${c.name} ${c.description} ${c.keywords.join(" ")}`
          .toLowerCase()
          .includes(activeQuery.toLowerCase())),
  );
  useEffect(() => {
    setQuery(params.get("query") || "");
  }, [params]);
  useEffect(() => {
    if (discoveryOpen)
      document.getElementById("discovery")?.scrollIntoView({
        behavior: reducedMotion ? "instant" : "smooth",
        block: "start",
      });
  }, [discoveryOpen, activeCategory, activeQuery, reducedMotion]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  function openDialog(key: DialogKey) {
    if (key !== "language") {
      navigate(
        key === "login" ? "/login" : key === "start" ? "/register" : "/help",
      );
      return;
    }
    setMenuOpen(false);
    setDialogKey(key);
    dialogRef.current?.showModal();
  }
  function discover(category?: string, search?: string) {
    setMenuOpen(false);
    const filters = new URLSearchParams();
    if (category) filters.set("category", category);
    if (search) filters.set("query", search);
    navigate("/schemes" + (filters.size ? "?" + filters.toString() : ""));
  }
  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      searchRef.current?.focus();
      return;
    }
    discover(undefined, trimmed);
  }
  function closeDiscovery() {
    setParams({});
    document
      .getElementById("categories")
      ?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  }
  const entrance = {
    initial: { opacity: 0, y: reducedMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.55 },
  };
  const nav = (
    <>
      <Link
        to="/"
        className="nav-home"
        onClick={() => {
          setMenuOpen(false);
          window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "instant" : "smooth",
          });
        }}
      >
        Home
      </Link>
      <button onClick={() => discover()}>Schemes</button>
      <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
        How It Works
      </a>
      <Link to="/about" onClick={() => setMenuOpen(false)}>
        About
      </Link>
      <button onClick={() => openDialog("help")}>Help</button>
    </>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav}
          </nav>
          <div className="header-actions">
            <button
              className="language"
              onClick={() => openDialog("language")}
              aria-label="Language: English"
            >
              <Globe2 size={16} aria-hidden="true" />
              <span>English</span>
              <span className="chevron">⌄</span>
            </button>
            <button className="login" onClick={() => openDialog("login")}>
              Login
            </button>
            <motion.button
              className="button primary nav-start"
              whileTap={{ scale: 0.98 }}
              onClick={() => openDialog("start")}
            >
              Get Started <Arrow />
            </motion.button>
            <button
              id="menu-toggle"
              className="menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav container"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {nav}
              <div className="mobile-actions">
                <button
                  className="button secondary"
                  onClick={() => openDialog("login")}
                >
                  Login
                </button>
                <button
                  className="button primary"
                  onClick={() => openDialog("start")}
                >
                  Get Started <Arrow />
                </button>
              </div>
              <button
                className="mobile-language"
                onClick={() => openDialog("language")}
              >
                <Globe2 size={18} /> English · Language options
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <motion.div className="hero-copy" {...entrance}>
              <div className="eyebrow hero-eyebrow">
                <span className="flag" aria-label="India">
                  <i />
                  <i />
                  <i />
                </span>{" "}
                ONE PLATFORM. MANY POSSIBILITIES.
              </div>
              <h1 id="hero-title">
                Find the Government Support That Fits <span>Your Needs</span>
              </h1>
              <p className="hero-description">
                Discover central and state government schemes based on your
                profile. Get personalized recommendations, check eligibility,
                know required documents, and access official application links —
                all in one place.
              </p>
              <form className="search-form" onSubmit={submitSearch}>
                <label className="sr-only" htmlFor="scheme-search">
                  Search schemes by name, keyword or category
                </label>
                <Search size={21} aria-hidden="true" />
                <input
                  ref={searchRef}
                  id="scheme-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={120}
                  placeholder="What kind of support do you need?"
                  required
                />
                <button type="submit" className="button primary">
                  Search <Arrow />
                </button>
              </form>
              <div className="popular">
                <span>Try searching:</span>
                {["Scholarships", "Farmer support", "Health insurance"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => discover(undefined, term.split(" ")[0])}
                    >
                      {term}
                    </button>
                  ),
                )}
              </div>
              <div className="hero-buttons">
                <motion.button
                  className="button primary"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openDialog("start")}
                >
                  Get Started <Arrow />
                </motion.button>
                <button className="button secondary" onClick={() => discover()}>
                  Explore Schemes <Arrow />
                </button>
              </div>
              <div className="trust-chips">
                <span>
                  <Check />
                  Citizen-first discovery
                </span>
                <span>
                  <Check />
                  Official source links
                </span>
                <span>
                  <Check />
                  Clear next steps
                </span>
              </div>
            </motion.div>
            <motion.div
              className="hero-visual"
              {...entrance}
              transition={{ duration: reducedMotion ? 0 : 0.7, delay: 0.1 }}
            >
              <div className="visual-orbit" />
              <img
                className="hero-image"
                src="/assets/citizens-hero.webp"
                alt="Students, a farmer, a worker and an older Indian citizen together in front of a government building"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
              <div className="visual-caption">
                <span className="caption-icon">
                  <Users size={24} />
                </span>
                <span>
                  <strong>
                    More opportunity.
                    <br />
                    For every citizen.
                  </strong>
                  <small>Your journey to support starts here.</small>
                </span>
                <span className="caption-arrow">
                  <Arrow />
                </span>
              </div>
              <div className="visual-label">
                <span /> BUILT AROUND YOU
              </div>
            </motion.div>
          </div>
        </section>
        <div className="container summary-bar">
          {summary.map(({ title, description, icon: Icon, color, tint }) => (
            <div className="summary-item" key={title}>
              <span className="icon-bubble" style={{ color, background: tint }}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
        <section
          className="container section categories-section"
          id="categories"
          aria-labelledby="categories-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                OPPORTUNITIES FOR EVERY STAGE OF LIFE
              </span>
              <h2 id="categories-title">What matters to you?</h2>
              <p>
                Explore scheme categories and take the next step with
                confidence.
              </p>
            </div>
            <button className="text-link" onClick={() => discover()}>
              Explore all categories <Arrow />
            </button>
          </div>
          <div className="category-grid">
            {categories.map(
              ({ name, description, icon: Icon, color, tint }, i) => (
                <motion.button
                  key={name}
                  className="category-card"
                  style={
                    {
                      "--category-color": color,
                      "--category-tint": tint,
                    } as CSSProperties
                  }
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.35,
                    delay: reducedMotion ? 0 : i * 0.045,
                  }}
                  whileHover={{ y: reducedMotion ? 0 : -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => discover(name)}
                >
                  <div className="category-top">
                    <span className="category-icon">
                      <Icon size={28} aria-hidden="true" />
                    </span>
                    <Arrow />
                  </div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <span className="category-action">Explore support</span>
                </motion.button>
              ),
            )}
          </div>
        </section>
        <AnimatePresence>
          {discoveryOpen && (
            <motion.section
              id="discovery"
              className="container discovery"
              aria-labelledby="discovery-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    SCHEME DISCOVERY · HOMEPAGE PREVIEW
                  </span>
                  <h2 id="discovery-title">
                    {activeCategory ||
                      (activeQuery
                        ? `Support for “${activeQuery}”`
                        : "Explore your possibilities")}
                  </h2>
                  <p>
                    Find a starting point, then check current schemes on the
                    official portal.
                  </p>
                </div>
                <button
                  className="icon-button"
                  aria-label="Close scheme discovery"
                  onClick={closeDiscovery}
                >
                  <X />
                </button>
              </div>
              <p className="discovery-note">
                <CircleHelp size={19} /> The SaharaSetu catalogue is not
                connected yet. These are topic suggestions, not scheme results
                or eligibility decisions.
              </p>
              <div className="topic-list">
                {filtered.length ? (
                  filtered.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setParams({ discover: "true", category: c.name });
                      }}
                    >
                      <c.icon size={22} />
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.description}</small>
                      </span>
                      <Arrow />
                    </button>
                  ))
                ) : (
                  <p className="empty-state">
                    No matching category for this search. Try a broader term
                    such as “education”, “health” or “housing”, or browse all
                    categories.
                  </p>
                )}
              </div>
              <div className="discovery-actions">
                <a
                  href="https://www.myscheme.gov.in/search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                >
                  Browse official myScheme catalogue <ExternalLink size={17} />
                </a>
                <button
                  className="text-link"
                  onClick={() => {
                    setQuery("");
                    discover();
                  }}
                >
                  Clear filters <Arrow />
                </button>
              </div>
              <small className="handoff-note">
                Opens a government website in a new tab. Enter your keyword or
                choose a category there; filters are not transferred.
              </small>
            </motion.section>
          )}
        </AnimatePresence>
        <section
          className="how-section"
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className="container section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">A CLEAR PATH FORWARD</span>
                <h2 id="how-title">A little guidance. A lot of possibility.</h2>
                <p>
                  Here’s how SaharaSetu helps you move from discovery to your
                  next step.
                </p>
              </div>
              <span className="process-badge">
                Simple by design <Sparkles size={16} />
              </span>
            </div>
            <ol className="steps-grid">
              {steps.map(({ title, description, icon: Icon }, i) => (
                <li key={title}>
                  <div className="step-visual">
                    <span className="step-number">0{i + 1}</span>
                    <span className="step-icon">
                      <Icon size={29} aria-hidden="true" />
                    </span>
                    {i < 3 && (
                      <ArrowRight
                        className="step-arrow"
                        size={22}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          className="container section responsibility-grid"
          id="about"
          aria-label="About recommendations"
        >
          <div className="recommendation-card">
            <span className="eyebrow">SUPPORT THAT STARTS WITH YOU</span>
            <h2>
              Your profile.
              <br />
              Your possibilities.
            </h2>
            <p>
              With your consent, details like your location, life stage and
              interests will help surface more relevant opportunities.
            </p>
            <ul>
              {[
                "Recommendations based on your profile",
                "Scheme requirements explained clearly",
                "Documents and official next steps in one place",
              ].map((text) => (
                <li key={text}>
                  <Check size={17} />
                  {text}
                </li>
              ))}
            </ul>
            <button className="text-link" onClick={() => openDialog("start")}>
              Start your journey <Arrow />
            </button>
            <Sprout
              className="recommendation-art"
              strokeWidth={0.8}
              aria-hidden="true"
            />
          </div>
          <div className="responsibility-card">
            <span className="responsibility-icon">
              <ShieldCheck size={29} />
            </span>
            <span className="eyebrow">
              CLEAR INFORMATION. RESPONSIBLE GUIDANCE.
            </span>
            <h2>
              Confidence comes
              <br />
              from knowing the facts.
            </h2>
            <p>
              AI can help rank relevant opportunities and explain information.
              Eligibility must be checked against the scheme’s official rules.
            </p>
            <div className="authority-note">
              <Landmark size={21} />
              <p>
                Final eligibility, document acceptance and approval are
                determined by the relevant government department.
              </p>
            </div>
            <a
              className="text-link"
              href="https://www.myscheme.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the official myScheme portal <Arrow external />
            </a>
          </div>
        </section>
        <section className="container closing-banner">
          <div>
            <span className="eyebrow">
              YOUR NEXT STEP COULD CHANGE EVERYTHING
            </span>
            <h2>Let’s find the support you need.</h2>
            <p>Explore opportunities. Understand your options. Move forward.</p>
          </div>
          <button className="button light" onClick={() => discover()}>
            Explore Schemes <Arrow />
          </button>
          <div className="banner-rings" aria-hidden="true" />
        </section>
      </main>
      <footer className="container footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              A simpler bridge between citizens
              <br />
              and the support available to them.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <strong>Explore</strong>
            <Link to="/">Home</Link>
            <button onClick={() => discover()}>Schemes</button>
            <a href="#how-it-works">How It Works</a>
          </nav>
          <nav aria-label="Support navigation">
            <strong>Support</strong>
            <Link to="/about">About SaharaSetu</Link>
            <button onClick={() => openDialog("help")}>Help & guidance</button>
            <a
              href="https://www.myscheme.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official myScheme <Arrow external />
            </a>
          </nav>
          <div className="footer-note">
            <span>
              <LockKeyhole size={17} /> Your information, your choice.
            </span>
            <p>
              This application is a local demonstration. Account features are
              planned for a later phase.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SaharaSetu. Government Schemes Made
            Simple.
          </span>
          <span>
            <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>{" "}
            · Independent project
          </span>
        </div>
      </footer>
      <dialog
        ref={dialogRef}
        className="info-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close dialog"
          onClick={() => dialogRef.current?.close()}
          autoFocus
        >
          <X />
        </button>
        <span className="dialog-icon">
          <Sprout size={32} />
        </span>
        <span className="eyebrow">{dialogContent[dialogKey].eyebrow}</span>
        <h2 id="dialog-title">{dialogContent[dialogKey].title}</h2>
        <p id="dialog-description">{dialogContent[dialogKey].text}</p>
        <button
          className="button primary"
          onClick={() => {
            dialogRef.current?.close();
            if (dialogKey !== "language")
              document.getElementById("categories")?.scrollIntoView({
                behavior: reducedMotion ? "instant" : "smooth",
              });
          }}
        >
          {dialogContent[dialogKey].action}
          <Arrow />
        </button>
      </dialog>
    </>
  );
}
export default HomePage;
