import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Heart,
  HelpCircle,
  Home,
  Info,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { categoryData, demoNotice, type Scheme } from "../data";
import { usePrototype } from "../state";
export function Brand() {
  return (
    <Link to="/" className="brand ss-brand" aria-label="SaharaSetu home">
      <img src="/favicon.svg" width="39" height="44" alt="" />
      <span>
        <strong>SaharaSetu</strong>
        <small>Government Schemes Made Simple</small>
      </span>
    </Link>
  );
}
export function Arrow() {
  return <ArrowRight size={17} aria-hidden="true" />;
}
export function BtnLink({
  to,
  children,
  secondary = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? "secondary" : "primary"} ${className}`}
    >
      {children}
    </Link>
  );
}
export function DemoNotice() {
  return (
    <div className="ss-demo-notice">
      <Info size={16} aria-hidden="true" />
      <p>{demoNotice}</p>
    </div>
  );
}
export function PageTitle({
  title,
  description,
  eyebrow = "YOUR PATH TO OPPORTUNITY",
  action,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <section className="ss-page-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {action && <div className="ss-title-action">{action}</div>}
      </div>
      <img
        src="/assets/citizens-hero.webp"
        width="1536"
        height="1024"
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}
export function Panel({
  title,
  icon: Icon,
  children,
  action,
  className = "",
}: {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ss-panel ${className}`}>
      {title && (
        <div className="ss-panel-heading">
          <h2>
            {Icon && (
              <span className="ss-small-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
            )}
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function EmptyState({
  title,
  description,
  to = "/schemes",
  label = "Explore schemes",
  icon: Icon = Bookmark,
}: {
  title: string;
  description: string;
  to?: string;
  label?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="ss-empty">
      <span>
        <Icon size={35} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <BtnLink to={to}>
        {label}
        <Arrow />
      </BtnLink>
    </div>
  );
}
export function Field({
  label,
  id,
  help,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  help?: string;
  error?: string;
}) {
  return (
    <div className="ss-field">
      <label htmlFor={id}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        {...props}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : help ? `${id}-help` : undefined
        }
      />
      {help && <small id={`${id}-help`}>{help}</small>}
      {error && (
        <small className="ss-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  help,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  help?: string;
}) {
  return (
    <div className="ss-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-describedby={help ? `${id}-help` : undefined}
      >
        <option value="">Choose an option</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {help && <small id={`${id}-help`}>{help}</small>}
    </div>
  );
}
export function Choices({
  label,
  options,
  value,
  onChange,
  multiple = false,
}: {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
}) {
  return (
    <fieldset className="ss-choices">
      <legend>{label}</legend>
      <div>
        {options.map((o) => (
          <label
            key={o}
            className={
              (Array.isArray(value) ? value.includes(o) : value === o)
                ? "selected"
                : ""
            }
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={label}
              value={o}
              checked={Array.isArray(value) ? value.includes(o) : value === o}
              onChange={() =>
                onChange(
                  multiple
                    ? Array.isArray(value)
                      ? value.includes(o)
                        ? value.filter((x) => x !== o)
                        : [...value, o]
                      : [o]
                    : o,
                )
              }
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  label = "Confirm",
  danger = false,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  label?: string;
  danger?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        className={danger ? "ss-danger-link" : "ss-inline-link"}
        onClick={() => ref.current?.showModal()}
      >
        {trigger}
      </button>
      <dialog className="ss-dialog" ref={ref} aria-label={title}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="ss-actions">
          <button
            className="button secondary"
            autoFocus
            onClick={() => ref.current?.close()}
          >
            Cancel
          </button>
          <button
            className={`button ${danger ? "ss-danger" : "primary"}`}
            onClick={() => {
              onConfirm();
              ref.current?.close();
            }}
          >
            {label}
          </button>
        </div>
      </dialog>
    </>
  );
}
export function CategoryIcon({
  category,
  size = 24,
}: {
  category: string;
  size?: number;
}) {
  const c = categoryData.find((c) => c.name === category) || categoryData[0];
  return (
    <span
      className="ss-category-icon"
      style={{ color: c.color, background: c.tint }}
    >
      <c.icon size={size} aria-hidden="true" />
    </span>
  );
}
export function SchemeCard({
  scheme,
  recommended = false,
}: {
  scheme: Scheme;
  recommended?: boolean;
}) {
  const { store, toggleSaved, toggleCompare } = usePrototype();
  const saved = store.saved.includes(scheme.id);
  const compared = store.compare.includes(scheme.id);
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="ss-scheme-card"
      whileHover={{ y: reduced ? 0 : -3 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="ss-card-image"
        style={{
          background: categoryData.find((c) => c.name === scheme.category)
            ?.tint,
        }}
      >
        <CategoryIcon category={scheme.category} size={40} />
        <span className="ss-demo-pill">Demo scheme</span>
        <button
          className="ss-save-button"
          aria-label={`${saved ? "Unsave" : "Save"} ${scheme.name}`}
          aria-pressed={saved}
          onClick={() => toggleSaved(scheme.id)}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="ss-card-art" aria-hidden="true">
          <Landmark size={78} strokeWidth={0.9} />
        </div>
      </div>
      <div className="ss-scheme-body">
        {recommended && (
          <span className="ss-match">
            <Sparkles size={13} /> Profile interest match
          </span>
        )}
        <h3>
          <Link to={`/schemes/${scheme.id}`}>{scheme.name}</Link>
        </h3>
        <p>{scheme.description}</p>
        <div className="ss-tags">
          <span>{scheme.category}</span>
          {scheme.tags.slice(0, 1).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="ss-scheme-meta">
          <Landmark size={14} /> {scheme.level} · Example record
        </div>
        <div className="ss-card-actions">
          <Link to={`/schemes/${scheme.id}`} className="ss-inline-link">
            View details <Arrow />
          </Link>
          <button
            className="ss-compare-button"
            aria-pressed={compared}
            onClick={() => toggleCompare(scheme.id)}
          >
            {compared ? <Check size={15} /> : <SlidersHorizontal size={15} />}{" "}
            {compared ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
export function StatCards({
  items,
}: {
  items: {
    label: string;
    value: string | number;
    icon: LucideIcon;
    path?: string;
    hint?: string;
  }[];
}) {
  return (
    <div className="ss-stat-grid">
      {items.map(({ label, value, icon: Icon, path, hint }) => {
        const inner = (
          <>
            <span className="ss-stat-icon">
              <Icon size={21} />
            </span>
            <span>
              <strong>{value}</strong>
              <span>{label}</span>
              {hint && <small>{hint}</small>}
            </span>
            {path && <ChevronRight size={17} />}
          </>
        );
        return path ? (
          <Link to={path} className="ss-stat" key={label}>
            {inner}
          </Link>
        ) : (
          <div className="ss-stat" key={label}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/recommendations", label: "Recommended schemes", icon: Sparkles },
  { path: "/schemes", label: "Find schemes", icon: Search },
  { path: "/saved", label: "Saved schemes", icon: Bookmark },
  { path: "/compare", label: "Compare schemes", icon: SlidersHorizontal },
  {
    path: "/guidance/education-loan",
    label: "Application guidance",
    icon: FileCheck2,
  },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/profile", label: "My profile", icon: UserRound },
  { path: "/help", label: "Help & support", icon: HelpCircle },
  { path: "/settings", label: "Settings", icon: Settings },
];
export function AppShell() {
  const { store, update, notify } = usePrototype();
  const drawer = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const unread = store.notifications.filter((n) => !n.read).length;
  useEffect(() => {
    drawer.current?.close();
  }, [location.pathname]);
  const links = (
    <>
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => drawer.current?.close()}
        >
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
          {path === "/notifications" && unread > 0 && (
            <b className="ss-count">{unread}</b>
          )}
        </NavLink>
      ))}
    </>
  );
  function search(e: FormEvent) {
    e.preventDefault();
    navigate(
      `/schemes${query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ""}`,
    );
  }
  return (
    <div className="ss-app">
      <a className="skip-link" href="#ss-main">
        Skip to content
      </a>
      <header className="ss-app-header">
        <button
          className="ss-drawer-toggle icon-button"
          onClick={() => drawer.current?.showModal()}
          aria-label="Open application navigation"
          aria-haspopup="dialog"
        >
          <Menu />
        </button>
        <Brand />
        <form className="ss-header-search" onSubmit={search}>
          <Search size={17} />
          <label className="sr-only" htmlFor="header-search">
            Search all schemes
          </label>
          <input
            id="header-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes, keywords or categories…"
          />
          <button className="icon-button" aria-label="Submit scheme search">
            <Arrow />
          </button>
        </form>
        <div className="ss-header-end">
          <button
            className="ss-language"
            onClick={() =>
              notify(
                "This prototype is available in English. Language preferences are saved for a future translation integration.",
              )
            }
          >
            English
          </button>
          <Link
            className="icon-button ss-bell"
            to="/notifications"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Bell size={21} />
            {unread > 0 && <span>{unread}</span>}
          </Link>
          <Link to="/profile" className="ss-user">
            <span className="ss-avatar">
              {(store.profile.name || "Citizen").slice(0, 1).toUpperCase()}
            </span>
            <strong>{store.profile.name.split(" ")[0] || "Citizen"}</strong>
          </Link>
        </div>
      </header>
      <aside className="ss-sidebar">
        <nav aria-label="Application navigation">{links}</nav>
        <div className="ss-sidebar-help">
          <HelpCircle size={24} />
          <strong>A little guidance helps.</strong>
          <p>Find clear answers and your next step.</p>
          <BtnLink to="/help">
            Get help <Arrow />
          </BtnLink>
        </div>
        <button
          className="ss-signout"
          onClick={() => {
            update((s) => ({ ...s, session: false }));
            navigate("/");
            notify(
              "Demo session ended. Saved prototype data remains in this browser.",
            );
          }}
        >
          <LogOut size={17} />{" "}
          {store.session ? "End demo session" : "Back to homepage"}
        </button>
      </aside>
      <dialog
        className="ss-drawer"
        id="ss-nav-drawer"
        ref={drawer}
        aria-label="Application menu"
      >
        <div className="ss-drawer-head">
          <Brand />
          <button
            className="icon-button"
            onClick={() => drawer.current?.close()}
            aria-label="Close application navigation"
            autoFocus
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile application navigation">{links}</nav>
        <Link className="ss-inline-link" to="/">
          Back to homepage <ArrowLeft size={16} />
        </Link>
      </dialog>
      <main className="ss-app-main" id="ss-main">
        <div className="ss-workspace">
          <Outlet />
        </div>
        <div className="ss-workspace-footer">
          <span>SaharaSetu · Independent demonstration project</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </main>
      <nav className="ss-bottom-nav" aria-label="Mobile quick navigation">
        {[
          { path: "/dashboard", label: "Home", icon: Home },
          { path: "/schemes", label: "Schemes", icon: Search },
          { path: "/recommendations", label: "For you", icon: Sparkles },
          { path: "/saved", label: "Saved", icon: Bookmark },
          { path: "/profile", label: "Profile", icon: UserRound },
        ].map(({ path, label, icon: Icon }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { notify } = usePrototype();
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <div className="ss-public">
      <a className="skip-link" href="#ss-public-main">
        Skip to content
      </a>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav className="ss-public-nav" aria-label="Public navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/schemes">Schemes</NavLink>
            <NavLink to="/how-it-works">How it works</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/help">Help</NavLink>
          </nav>
          <div className="ss-public-actions">
            <button
              className="ss-language"
              onClick={() =>
                notify(
                  "English is currently available. Regional translations are a future integration.",
                )
              }
            >
              English
            </button>
            <BtnLink to="/login" secondary>
              Login
            </BtnLink>
            <button
              className="icon-button ss-public-menu"
              aria-label={
                open ? "Close public navigation" : "Open public navigation"
              }
              aria-expanded={open}
              aria-controls="ss-public-mobile"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            className="container ss-public-mobile"
            id="ss-public-mobile"
            aria-label="Mobile public navigation"
          >
            <Link to="/">Home</Link>
            <Link to="/schemes">Schemes</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/about">About</Link>
            <Link to="/help">Help</Link>
            <Link to="/register">Create your account</Link>
          </nav>
        )}
      </header>
      <main id="ss-public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
export function PublicFooter() {
  return (
    <footer className="ss-public-footer">
      <div className="container">
        <div>
          <Brand />
          <p>A simpler bridge to the support you need.</p>
        </div>
        <nav aria-label="Public footer">
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/help">Help</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <small>
          Independent browser-local prototype. Not a government website.
        </small>
      </div>
    </footer>
  );
}
export function Progress({
  value,
  label = "Profile completeness",
}: {
  value: number;
  label?: string;
}) {
  return (
    <div className="ss-progress">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <progress max={100} value={value} aria-label={label} />
    </div>
  );
}
export function OfficialLink({
  children = "Explore official schemes",
}: {
  children?: ReactNode;
}) {
  return (
    <a
      className="button secondary"
      href="https://www.myscheme.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLink size={16} />
    </a>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="ss-check-list">
      {items.map((i) => (
        <li key={i}>
          <CheckCircle2 size={17} />
          {i}
        </li>
      ))}
    </ul>
  );
}
export function BackLink({
  to = "/schemes",
  label = "Back to schemes",
}: {
  to?: string;
  label?: string;
}) {
  return (
    <Link className="ss-back" to={to}>
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}
