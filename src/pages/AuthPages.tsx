import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { usePrototype } from "../state";
import { BtnLink, CheckList, Field } from "../components/ui";
type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";
const copy = {
  login: {
    eyebrow: "WELCOME BACK",
    heading: "Continue your journey with SaharaSetu.",
    highlight: "More clarity. More possibility.",
    title: "Login to SaharaSetu",
    description: "Explore your profile, saved schemes and next steps.",
  },
  register: {
    eyebrow: "A NEW CHAPTER STARTS HERE",
    heading: "Create your account. Unlock more opportunities.",
    highlight: "Support that starts with you.",
    title: "Create your account",
    description:
      "Build a profile and explore personalized demo recommendations.",
  },
  verify: {
    eyebrow: "ONE SIMPLE NEXT STEP",
    heading: "Verify your email address.",
    highlight: "Keep your journey connected.",
    title: "Check your email",
    description: "Complete the verification walkthrough to continue.",
  },
  forgot: {
    eyebrow: "LET’S GET YOU BACK ON TRACK",
    heading: "Forgot your password?",
    highlight: "A clear path back.",
    title: "Reset your password",
    description: "Enter your email to explore the password recovery flow.",
  },
  reset: {
    eyebrow: "A FRESH START",
    heading: "Set a new password.",
    highlight: "Your next step, made simple.",
    title: "Choose a new password",
    description: "Practice setting a strong password in this local prototype.",
  },
};
export default function AuthPage({ mode }: { mode: AuthMode }) {
  const { store, update, updateProfile, loadDemo, notify } = usePrototype();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(
    params.get("email") || store.profile.email || "",
  );
  const [name, setName] = useState(store.profile.name);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const c = copy[mode];
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "verify") {
      if (code !== "123456") {
        setError("Use the demonstration code 123456. No real email was sent.");
        return;
      }
      update((s) => ({ ...s, verified: true, session: true }));
      notify(
        "Demo verification complete. No email identity has been verified.",
      );
      navigate("/onboarding/personal");
      return;
    }
    if (mode === "forgot") {
      notify("No email was sent. The recovery walkthrough is ready.");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for this demonstration.");
      return;
    }
    if ((mode === "register" || mode === "reset") && password !== confirm) {
      setError("The passwords do not match.");
      return;
    }
    if (mode === "register" && !consent) {
      setError("Please acknowledge browser-local prototype storage.");
      return;
    }
    if (mode === "reset") {
      setPassword("");
      setConfirm("");
      setSuccess(true);
      return;
    }
    updateProfile({ email, ...(mode === "register" ? { name } : {}) });
    update((s) => ({
      ...s,
      session: true,
      verified: mode === "login" ? s.verified : false,
    }));
    setPassword("");
    setConfirm("");
    navigate(mode === "register" ? "/verify-email" : "/dashboard");
    notify(
      mode === "register"
        ? "Demo profile created in this browser."
        : "Entered the local demonstration. This is not real authentication.",
    );
  }
  return (
    <div className="container ss-auth-wrap">
      <Link className="ss-back" to="/">
        <ArrowLeft size={16} /> Back to homepage
      </Link>
      <div className="ss-auth-grid">
        <section className="ss-auth-story">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1>{c.heading}</h1>
          <h2>{c.highlight}</h2>
          <p>
            Discover opportunities, understand the requirements and take your
            next step with confidence.
          </p>
          <CheckList
            items={[
              "A profile that reflects your needs",
              "Recommendations explained clearly",
              "Guidance that points to official sources",
            ]}
          />
          <div className="ss-auth-image">
            <img
              src="/assets/citizens-hero.webp"
              width="1536"
              height="1024"
              alt="Indian citizens together in front of a government building"
            />
          </div>
          <span className="ss-story-label">
            <ShieldCheck size={18} /> Your information, your choice.
          </span>
        </section>
        <section className="ss-auth-card">
          <span className="ss-auth-icon">
            {mode === "verify" ? <Mail /> : <LockKeyhole />}
          </span>
          <h2>{c.title}</h2>
          <p>{c.description}</p>
          <div className="ss-auth-demo">
            <InfoText mode={mode} />
          </div>
          {success ? (
            <div className="ss-auth-success" role="status">
              <CheckCircle2 size={44} />
              <h3>Recovery walkthrough complete</h3>
              <p>
                No real password was changed. Passwords are never stored by this
                prototype.
              </p>
              <BtnLink to="/login">
                Back to login <ArrowRight size={17} />
              </BtnLink>
            </div>
          ) : (
            <form className="ss-auth-form" onSubmit={submit}>
              {mode === "register" && (
                <Field
                  id="auth-name"
                  label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  maxLength={80}
                />
              )}{" "}
              {mode !== "verify" && (
                <Field
                  id="auth-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  maxLength={120}
                />
              )}{" "}
              {mode === "verify" ? (
                <>
                  <div className="ss-verify-email">
                    <Mail size={18} />
                    <span>{store.profile.email || "citizen@example.com"}</span>
                    <Link to="/register">Edit</Link>
                  </div>
                  <Field
                    id="verification-code"
                    label="Demonstration verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    minLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    help="Enter 123456. This code is shown for testing; no email is delivered."
                  />
                </>
              ) : (
                mode !== "forgot" && (
                  <>
                    <div className="ss-password-field">
                      <Field
                        id="auth-password"
                        label={mode === "reset" ? "New password" : "Password"}
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        required
                        minLength={8}
                        maxLength={128}
                        help="Use a sample password, not a password from a real account."
                      />
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={show ? "Hide password" : "Show password"}
                        onClick={() => setShow(!show)}
                      >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {(mode === "register" || mode === "reset") && (
                      <Field
                        id="confirm-password"
                        label="Confirm password"
                        type={show ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        required
                        minLength={8}
                      />
                    )}
                  </>
                )
              )}
              {mode === "register" && (
                <label className="ss-checkbox">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    I understand this is a browser-local prototype and have read
                    the <Link to="/privacy">Privacy notice</Link> and{" "}
                    <Link to="/terms">Terms</Link>.
                  </span>
                </label>
              )}
              {mode === "login" && (
                <Link
                  className="ss-inline-link ss-forgot-link"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              )}
              {error && (
                <p className="ss-form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary ss-full" type="submit">
                {mode === "login"
                  ? "Enter demo account"
                  : mode === "register"
                    ? "Create demo account"
                    : mode === "verify"
                      ? "Verify demo code"
                      : mode === "forgot"
                        ? "Continue recovery walkthrough"
                        : "Complete password walkthrough"}
                <ArrowRight size={17} />
              </button>
              {mode === "verify" && (
                <button
                  type="button"
                  className="ss-inline-link ss-centered"
                  onClick={() =>
                    notify("Demo code: 123456. No email has been sent.")
                  }
                >
                  Show demo code again
                </button>
              )}
            </form>
          )}
          {(mode === "login" || mode === "register") && (
            <>
              <div className="ss-auth-divider">
                <span>or explore without entering details</span>
              </div>
              <button
                className="button secondary ss-full"
                onClick={() => {
                  loadDemo();
                  navigate("/dashboard");
                }}
              >
                <Sparkles size={17} /> Use sample profile
              </button>
              <p className="ss-auth-bottom">
                {mode === "login" ? "New to SaharaSetu?" : "Already exploring?"}{" "}
                <Link to={mode === "login" ? "/register" : "/login"}>
                  {mode === "login" ? "Create your account" : "Go to login"}
                </Link>
              </p>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <Link className="ss-inline-link ss-centered" to="/login">
              <ArrowLeft size={16} /> Back to login
            </Link>
          )}
          <p className="ss-auth-security">
            <ShieldCheck size={15} /> Passwords are not stored. No server
            authentication is connected.
          </p>
        </section>
      </div>
      <div className="ss-auth-benefits">
        <span>
          <Sparkles /> Profile-based discovery
        </span>
        <span>
          <ShieldCheck /> Clear prototype boundaries
        </span>
        <span>
          <Mail /> No messages sent
        </span>
        <span>
          <CheckCircle2 /> Official next steps
        </span>
      </div>
    </div>
  );
}
function InfoText({ mode }: { mode: AuthMode }) {
  return (
    <p>
      <strong>Local demonstration</strong> ·{" "}
      {mode === "verify"
        ? "No verification email was sent. Use the visible test code."
        : mode === "forgot" || mode === "reset"
          ? "Recovery is a walkthrough; no recovery email is sent or account password changed."
          : "This form opens a demo session in this browser. It does not create or authenticate a real account."}
    </p>
  );
}
