import { useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";
import { usePrototype } from "../state";
import { onboardingSteps, type Profile } from "../data";
import {
  Choices,
  Field,
  Panel,
  SelectField,
  CheckList,
} from "../components/ui";
const stateOptions = [
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Delhi",
  "Uttar Pradesh",
  "West Bengal",
  "Other state / union territory",
];
const districts: Record<string, string[]> = {
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Other district"],
  Karnataka: ["Bengaluru", "Mysuru", "Other district"],
  Maharashtra: ["Mumbai", "Pune", "Other district"],
};
const educationOptions = [
  "No formal education",
  "Primary school",
  "Secondary school",
  "Higher secondary",
  "Diploma",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Other",
];
const employmentOptions = [
  "Student",
  "Employed",
  "Self-employed",
  "Unemployed",
  "Farmer",
  "Retired",
];
const interests = [
  "Education",
  "Employment",
  "Agriculture",
  "Housing",
  "Healthcare",
  "Social Welfare",
];
const allGoals = [
  "Continue my education",
  "Find a job or skills training",
  "Start or grow a business",
  "Find housing support",
  "Improve healthcare access",
  "Support my family",
];
const icons = [
  UserRound,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  SlidersHorizontal,
  CheckCircle2,
];
const descriptions = [
  "Let’s start with a few basic details. Use sample information while exploring this local prototype.",
  "Tell us where you live so the demonstration can show how location-based matching works.",
  "Help us understand your education, current studies and skills.",
  "Tell us about your work, occupation and household income.",
  "Add a few household details. Do not enter identity numbers or upload documents.",
  "Choose your interests and priorities for more useful demonstration recommendations.",
  "Review your details before saving your profile and exploring the dashboard.",
];
function ProfileSummary({ profile: p }: { profile: Profile }) {
  const groups = [
    {
      title: "Personal information",
      path: "/onboarding/personal",
      rows: [
        ["Full name", p.name],
        ["Date of birth", p.birthDate],
        ["Gender", p.gender],
        ["Email", p.email],
      ],
    },
    {
      title: "Location details",
      path: "/onboarding/location",
      rows: [
        ["State", p.state],
        ["District", p.district],
        ["City", p.city],
        ["Residence", p.residential],
      ],
    },
    {
      title: "Educational details",
      path: "/onboarding/education",
      rows: [
        ["Qualification", p.qualification],
        ["Currently studying", p.studying],
        ["Institution", p.institution],
        ["Skills", p.skills.join(", ")],
      ],
    },
    {
      title: "Professional details",
      path: "/onboarding/professional",
      rows: [
        ["Employment", p.status],
        ["Occupation", p.occupation],
        [
          "Annual income",
          p.income ? `₹${Number(p.income).toLocaleString("en-IN")}` : "",
        ],
        ["Sector", p.sector],
      ],
    },
    {
      title: "Family information",
      path: "/onboarding/professional?section=family",
      rows: [
        ["Household size", p.familySize],
        ["Dependents", p.dependents],
        ["Marital status", p.marital],
        ["Disability", p.disability],
      ],
    },
    {
      title: "Your preferences",
      path: "/onboarding/preferences",
      rows: [
        ["Interests", p.interests.join(", ")],
        ["Priorities", p.goals.join(", ")],
        ["Preferred language", p.preferredLanguage],
        ["Channels", p.channels.join(", ")],
      ],
    },
  ];
  return (
    <div className="ss-review-grid">
      {groups.map((g) => (
        <Panel
          key={g.title}
          title={g.title}
          action={
            <Link className="ss-inline-link" to={g.path}>
              Edit
            </Link>
          }
        >
          <dl className="ss-data-list">
            {g.rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "Not provided"}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ))}
    </div>
  );
}
export { ProfileSummary };
export default function OnboardingPage() {
  const { store, update, updateProfile, loadDemo, notify } = usePrototype();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const index = location.pathname.endsWith("professional")
    ? params.get("section") === "family"
      ? 4
      : 3
    : Math.max(
        0,
        onboardingSteps.findIndex((s) => s.path === location.pathname),
      );
  const p = store.profile;
  const [error, setError] = useState("");
  const step = onboardingSteps[index];
  function text(key: keyof Profile, value: string) {
    updateProfile({ [key]: value });
  }
  function select(
    key: keyof Profile,
    label: string,
    options: string[],
    required = false,
    help?: string,
  ) {
    return (
      <SelectField
        id={`profile-${key}`}
        label={label}
        value={p[key] as string}
        onChange={(v) => text(key, v)}
        options={options}
        required={required}
        help={help}
      />
    );
  }
  function input(
    key: keyof Profile,
    label: string,
    required = false,
    type = "text",
    help?: string,
  ) {
    return (
      <Field
        id={`profile-${key}`}
        label={label}
        value={p[key] as string}
        onChange={(e) => text(key, e.target.value)}
        required={required}
        type={type}
        help={help}
        {...(type === "number"
          ? { min: 0, max: key === "income" ? 100000000 : 100 }
          : {})}
        maxLength={120}
      />
    );
  }
  function choices(
    key: keyof Profile,
    label: string,
    options: string[],
    multiple = false,
  ) {
    return (
      <Choices
        label={label}
        options={options}
        value={p[key] as string | string[]}
        onChange={(v) => updateProfile({ [key]: v })}
        multiple={multiple}
      />
    );
  }
  function next(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (index === 0 && p.birthDate && new Date(p.birthDate) > new Date()) {
      setError("Date of birth cannot be in the future.");
      return;
    }
    if (index === 0 && p.phone && !/^[6-9]\d{9}$/.test(p.phone)) {
      setError(
        "Enter a 10-digit Indian mobile number, or leave this optional field empty.",
      );
      return;
    }
    if (index === 1 && !/^\d{6}$/.test(p.pincode)) {
      setError("Enter a 6-digit pincode.");
      return;
    }
    if (index === 5 && !p.interests.length) {
      setError("Choose at least one area of interest.");
      return;
    }
    if (index === 6 && !p.consent) {
      setError("Please acknowledge local storage before submitting.");
      return;
    }
    update((s) => ({
      ...s,
      completed: Array.from(new Set([...s.completed, index])),
      session: true,
    }));
    notify(
      index === 6
        ? "Your demonstration profile is saved in this browser."
        : "Progress saved in this browser.",
    );
    navigate(index === 6 ? "/dashboard" : onboardingSteps[index + 1].path);
  }
  const body =
    index === 0 ? (
      <>
        <div className="ss-form-grid">
          {input("name", "Full name", true)}
          <Field
            id="profile-birthDate"
            label="Date of birth"
            type="date"
            value={p.birthDate}
            onChange={(e) => text("birthDate", e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            required
          />
          {select(
            "gender",
            "Gender",
            ["Male", "Female", "Other", "Prefer not to say"],
            true,
          )}
          <Field
            id="profile-phone"
            label="Mobile number (optional)"
            type="tel"
            inputMode="numeric"
            value={p.phone}
            onChange={(e) => text("phone", e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            help="Use a sample number. No SMS will be sent."
          />
          {input("email", "Email address (optional)", false, "email")}
        </div>
        <label className="ss-checkbox">
          <input
            type="checkbox"
            checked={p.consent}
            onChange={(e) => updateProfile({ consent: e.target.checked })}
            required
          />
          <span>
            I agree to the <Link to="/terms">Terms</Link> and{" "}
            <Link to="/privacy">Privacy notice</Link>. I understand my sample
            profile is stored in this browser.
          </span>
        </label>
        <div className="ss-note">
          <ShieldCheck size={19} /> No Aadhaar numbers, banking details or
          uploaded identity documents are collected.
        </div>
      </>
    ) : index === 1 ? (
      <>
        <div className="ss-form-grid">
          <SelectField
            id="profile-state"
            label="State / union territory"
            value={p.state}
            onChange={(v) => updateProfile({ state: v, district: "" })}
            options={stateOptions}
            required
          />
          {select(
            "district",
            "District",
            districts[p.state] || ["Other district"],
            true,
          )}
          {input("city", "City / town", true)}
          {input("locality", "Area / locality (optional)")}
          <Field
            id="profile-pincode"
            label="Pincode"
            value={p.pincode}
            onChange={(e) => text("pincode", e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
        </div>
        {choices("residential", "Residential status", [
          "Urban",
          "Rural",
          "Semi-urban",
        ])}
        <p className="ss-field-help">
          State and district choices are sample options, not a complete
          administrative directory.
        </p>
      </>
    ) : index === 2 ? (
      <>
        <div className="ss-form-grid">
          {select(
            "qualification",
            "Highest educational qualification",
            educationOptions,
            true,
          )}
          {input("field", "Field of study (optional)")}
          {select(
            "studying",
            "Are you currently studying?",
            ["Yes", "No", "Completed"],
            true,
          )}
          {p.studying === "Yes" &&
            select(
              "educationYear",
              "Current education level",
              [
                "School",
                "1st year",
                "2nd year",
                "3rd year",
                "4th year",
                "Postgraduate",
                "Other",
              ],
              true,
            )}
          {input("institution", "Institution name (optional)")}
        </div>
        {choices("institutionType", "Institution type", [
          "Government",
          "Private",
          "Other",
        ])}
        {choices(
          "skills",
          "Skills & certifications",
          [
            "Computer skills",
            "Vocational skills",
            "Language skills",
            "Technical skills",
            "Entrepreneurship",
            "Other",
          ],
          true,
        )}
      </>
    ) : index === 3 ? (
      <>
        <div className="ss-form-grid">
          {select("status", "Employment status", employmentOptions, true)}
          {input("occupation", "Occupation / job type (optional)")}
          {input("organization", "Organization name (optional)")}
          {select("experience", "Work experience", [
            "No experience",
            "Less than 1 year",
            "1–3 years",
            "3–5 years",
            "More than 5 years",
          ])}
          {input(
            "income",
            "Annual household income (₹)",
            true,
            "number",
            "Example rules use annual household income, not monthly salary.",
          )}
        </div>
        {choices("sector", "Work sector", [
          "Private sector",
          "Government sector",
          "Self-employed",
          "Other",
        ])}
        {choices("ownsBusiness", "Do you own a business?", ["Yes", "No"])}
        {choices("businessPlan", "Would you like to start a business?", [
          "Yes",
          "No",
          "Maybe",
        ])}
      </>
    ) : index === 4 ? (
      <>
        <div className="ss-form-grid">
          {select("marital", "Marital status", [
            "Single",
            "Married",
            "Widowed",
            "Separated",
            "Prefer not to say",
          ])}
          {input("familySize", "Number of household members", true, "number")}
          {input("dependents", "Number of dependents", false, "number")}
          {select(
            "socialCategory",
            "Social category (optional)",
            ["General", "OBC", "SC", "ST", "Prefer not to say"],
            false,
            "This optional field is not used by the current demonstration rules.",
          )}
        </div>
        {choices("disability", "Do you have a disability?", [
          "Yes",
          "No",
          "Prefer not to say",
        ])}
        {choices("rationCard", "Does your household have a ration card?", [
          "Yes",
          "No",
          "Not sure",
        ])}
        <div className="ss-note">
          <Users size={19} /> Household information is saved locally. It does
          not establish eligibility for a real government scheme.
        </div>
      </>
    ) : index === 5 ? (
      <>
        {choices(
          "interests",
          "Areas of interest — choose one or more",
          interests,
          true,
        )}
        <div className="ss-form-grid">
          {[0, 1, 2].map((i) => (
            <SelectField
              key={i}
              id={`profile-goal-${i}`}
              label={`Priority goal ${i + 1}${i ? " (optional)" : ""}`}
              value={p.goals[i] || ""}
              options={allGoals.filter(
                (g) => !p.goals.includes(g) || p.goals[i] === g,
              )}
              onChange={(v) => {
                const goals = [...p.goals];
                goals[i] = v;
                updateProfile({ goals });
              }}
            />
          ))}
        </div>
        {select(
          "preferredLanguage",
          "Preferred communication language",
          ["English", "Tamil", "Hindi", "Other"],
          true,
          "This stores your preference; the interface currently supports English.",
        )}
        {choices(
          "channels",
          "Notification preferences",
          ["In-app", "Email", "SMS", "WhatsApp"],
          true,
        )}
        <p className="ss-field-help">
          Preferences are saved locally. No email, SMS or WhatsApp delivery
          service is connected.
        </p>
      </>
    ) : (
      <>
        <ProfileSummary profile={p} />
        <label className="ss-checkbox">
          <input
            type="checkbox"
            checked={p.consent}
            onChange={(e) => updateProfile({ consent: e.target.checked })}
            required
          />
          <span>
            I confirm these are sample details and understand this profile is
            saved only in this browser.
          </span>
        </label>
      </>
    );
  const Icon = icons[index];
  return (
    <div className="container ss-onboarding-wrap">
      <div className="ss-onboarding-top">
        <Link className="ss-back" to="/dashboard">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <button
          className="ss-inline-link"
          onClick={() => {
            loadDemo();
            notify("Sample profile loaded. You can edit it before continuing.");
          }}
        >
          Use sample details <Sparkles size={16} />
        </button>
      </div>
      <div className="ss-onboarding-grid">
        <aside className="ss-onboarding-sidebar">
          <nav aria-label="Onboarding steps">
            {onboardingSteps.map((s, i) => (
              <Link
                key={s.name}
                to={s.path}
                aria-current={i === index ? "step" : undefined}
                className={`${i === index ? "active" : ""} ${store.completed.includes(i) ? "complete" : ""}`}
              >
                <span>
                  {store.completed.includes(i) ? <Check size={16} /> : i + 1}
                </span>
                <div>
                  <strong>{s.name}</strong>
                  <small>{s.hint}</small>
                </div>
              </Link>
            ))}
          </nav>
          <div className="ss-note">
            <ShieldCheck />
            <p>
              Your progress is saved in this browser. You can come back to any
              step.
            </p>
          </div>
        </aside>
        <section
          className={`ss-onboarding-main ${index === 6 ? "ss-review-main" : ""}`}
        >
          <div className="ss-onboarding-progress">
            <span>Step {index + 1} of 7</span>
            <progress
              value={index + 1}
              max={7}
              aria-label="Onboarding progress"
            />
          </div>
          <div className="ss-mobile-steps" aria-label="Onboarding progress">
            {onboardingSteps.map((s, i) => (
              <Link
                key={s.name}
                to={s.path}
                className={i === index ? "active" : ""}
                aria-label={`Step ${i + 1}: ${s.name}`}
                aria-current={i === index ? "step" : undefined}
              >
                {store.completed.includes(i) ? <Check size={14} /> : i + 1}
              </Link>
            ))}
          </div>
          <h1>{step.name}</h1>
          <p className="ss-onboarding-description">{descriptions[index]}</p>
          <form onSubmit={next} key={index}>
            {body}
            {error && (
              <p className="ss-form-error" role="alert">
                {error}
              </p>
            )}
            <div className="ss-form-navigation">
              {index > 0 ? (
                <Link
                  className="button secondary"
                  to={onboardingSteps[index - 1].path}
                >
                  <ArrowLeft size={16} /> Previous
                </Link>
              ) : (
                <Link className="button secondary" to="/dashboard">
                  Save & exit
                </Link>
              )}
              <button className="button primary" type="submit">
                {index === 6
                  ? "Submit demo profile"
                  : `Next: ${onboardingSteps[index + 1].name}`}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </section>
        <aside className="ss-onboarding-aside">
          <img
            src="/assets/citizens-hero.webp"
            width="1536"
            height="1024"
            alt="A diverse group of Indian citizens"
          />
          <Panel
            title={`Why we ask for ${index === 6 ? "your review" : "these details"}`}
            icon={Icon}
          >
            <CheckList
              items={
                index === 6
                  ? [
                      "Keep your profile clear and consistent",
                      "Correct details before exploring matches",
                      "Understand what is stored locally",
                    ]
                  : [
                      "Explore more relevant example opportunities",
                      "Understand how profile matching works",
                      "Keep the next steps clear and useful",
                    ]
              }
            />
          </Panel>
          <Panel title="Good to know" icon={ShieldCheck}>
            <p>
              Only fictional scheme rules are used here. Your sample information
              stays in this browser. Real eligibility depends on official rules
              and government verification.
            </p>
            <Link className="ss-inline-link" to="/privacy">
              Read the privacy notice <ArrowRight size={15} />
            </Link>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
