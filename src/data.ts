import {
  GraduationCap,
  HeartPulse,
  BriefcaseBusiness,
  Sprout,
  House,
  Users,
  type LucideIcon,
} from "lucide-react";
export type CategoryName =
  | "Education"
  | "Healthcare"
  | "Employment"
  | "Agriculture"
  | "Housing"
  | "Social Welfare";
export const categoryData: {
  name: CategoryName;
  icon: LucideIcon;
  color: string;
  tint: string;
}[] = [
  { name: "Education", icon: GraduationCap, color: "#0079AA", tint: "#EDF8FE" },
  { name: "Healthcare", icon: HeartPulse, color: "#00836C", tint: "#EEF9F4" },
  {
    name: "Employment",
    icon: BriefcaseBusiness,
    color: "#B85A13",
    tint: "#FFF5EB",
  },
  { name: "Agriculture", icon: Sprout, color: "#08795C", tint: "#EFF8F1" },
  { name: "Housing", icon: House, color: "#7051AD", tint: "#F5F1FC" },
  { name: "Social Welfare", icon: Users, color: "#B23D61", tint: "#FFF1F5" },
];
export type Profile = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  state: string;
  district: string;
  city: string;
  locality: string;
  pincode: string;
  residential: string;
  qualification: string;
  field: string;
  studying: string;
  educationYear: string;
  institutionType: string;
  institution: string;
  status: string;
  occupation: string;
  organization: string;
  experience: string;
  income: string;
  sector: string;
  ownsBusiness: string;
  businessPlan: string;
  marital: string;
  familySize: string;
  dependents: string;
  socialCategory: string;
  disability: string;
  rationCard: string;
  preferredLanguage: string;
  interests: string[];
  skills: string[];
  goals: string[];
  channels: string[];
  consent: boolean;
};
export const blankProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  state: "",
  district: "",
  city: "",
  locality: "",
  pincode: "",
  residential: "",
  qualification: "",
  field: "",
  studying: "",
  educationYear: "",
  institutionType: "",
  institution: "",
  status: "",
  occupation: "",
  organization: "",
  experience: "",
  income: "",
  sector: "",
  ownsBusiness: "",
  businessPlan: "",
  marital: "",
  familySize: "",
  dependents: "",
  socialCategory: "",
  disability: "",
  rationCard: "",
  preferredLanguage: "English",
  interests: [],
  skills: [],
  goals: [],
  channels: ["In-app"],
  consent: false,
};
export const demoProfile: Profile = {
  ...blankProfile,
  name: "Arulselvan",
  email: "citizen@example.com",
  phone: "",
  birthDate: "2000-01-12",
  gender: "Male",
  state: "Tamil Nadu",
  district: "Chennai",
  city: "Chennai",
  pincode: "600001",
  residential: "Urban",
  qualification: "Bachelor's degree",
  field: "Information Technology",
  studying: "Yes",
  educationYear: "3rd year",
  institutionType: "Government",
  institution: "Example College",
  status: "Student",
  income: "250000",
  sector: "Other",
  marital: "Single",
  familySize: "4",
  dependents: "1",
  socialCategory: "Prefer not to say",
  disability: "No",
  rationCard: "No",
  interests: ["Education", "Employment"],
  skills: ["Computer skills"],
  goals: ["Continue my education"],
  consent: true,
};
export type Scheme = {
  id: string;
  name: string;
  category: CategoryName;
  description: string;
  level: "Central" | "State";
  state: string;
  benefit: string;
  minAge: number;
  maxAge: number;
  maxIncome: number;
  occupation?: string;
  requiredDocuments: string[];
  tags: string[];
};
const commonDocs = [
  "Identity document",
  "Address document",
  "Income declaration",
];
export const schemes: Scheme[] = [
  {
    id: "education-loan",
    name: "Higher Education Loan Support",
    category: "Education",
    description:
      "An illustrative path to financial support for higher education and professional learning.",
    level: "Central",
    state: "Across India",
    benefit: "Education financing assistance",
    minAge: 18,
    maxAge: 35,
    maxIncome: 600000,
    occupation: "Student",
    requiredDocuments: [...commonDocs, "Admission letter", "Academic records"],
    tags: ["Loan", "Higher education"],
  },
  {
    id: "student-scholarship",
    name: "Student Opportunity Scholarship",
    category: "Education",
    description:
      "A demonstration scholarship for students who want to continue their studies.",
    level: "State",
    state: "Tamil Nadu",
    benefit: "Illustrative tuition assistance",
    minAge: 16,
    maxAge: 30,
    maxIncome: 350000,
    occupation: "Student",
    requiredDocuments: [...commonDocs, "Academic records"],
    tags: ["Scholarship", "Students"],
  },
  {
    id: "family-health",
    name: "Family Health Coverage",
    category: "Healthcare",
    description:
      "Explore an example of household health coverage and medical support.",
    level: "Central",
    state: "Across India",
    benefit: "Illustrative health coverage",
    minAge: 18,
    maxAge: 100,
    maxIncome: 400000,
    requiredDocuments: [...commonDocs, "Family details"],
    tags: ["Health coverage", "Family"],
  },
  {
    id: "senior-health",
    name: "Senior Wellness Assistance",
    category: "Healthcare",
    description:
      "A sample support opportunity focused on older citizens and preventive care.",
    level: "State",
    state: "Karnataka",
    benefit: "Illustrative care assistance",
    minAge: 60,
    maxAge: 100,
    maxIncome: 500000,
    requiredDocuments: [...commonDocs, "Age document"],
    tags: ["Wellness", "Senior citizens"],
  },
  {
    id: "skills-training",
    name: "Youth Skills & Training",
    category: "Employment",
    description:
      "A sample training programme for building practical skills and career confidence.",
    level: "Central",
    state: "Across India",
    benefit: "Illustrative skills training",
    minAge: 18,
    maxAge: 45,
    maxIncome: 700000,
    requiredDocuments: [...commonDocs, "Education records"],
    tags: ["Training", "Careers"],
  },
  {
    id: "enterprise-support",
    name: "Small Enterprise Starter Support",
    category: "Employment",
    description:
      "A demonstration of assistance for self-employed citizens and business ideas.",
    level: "State",
    state: "Tamil Nadu",
    benefit: "Illustrative enterprise assistance",
    minAge: 21,
    maxAge: 60,
    maxIncome: 900000,
    occupation: "Self-employed",
    requiredDocuments: [...commonDocs, "Business plan"],
    tags: ["Business", "Self-employment"],
  },
  {
    id: "farmer-support",
    name: "Farmer Livelihood Support",
    category: "Agriculture",
    description:
      "Explore a sample farmer assistance programme for agricultural livelihoods.",
    level: "Central",
    state: "Across India",
    benefit: "Illustrative farming assistance",
    minAge: 18,
    maxAge: 75,
    maxIncome: 500000,
    occupation: "Farmer",
    requiredDocuments: [...commonDocs, "Land or tenancy document"],
    tags: ["Farmers", "Livelihood"],
  },
  {
    id: "farm-equipment",
    name: "Agricultural Equipment Assistance",
    category: "Agriculture",
    description:
      "A sample opportunity to support access to equipment and sustainable farming.",
    level: "State",
    state: "Maharashtra",
    benefit: "Illustrative equipment support",
    minAge: 18,
    maxAge: 70,
    maxIncome: 600000,
    occupation: "Farmer",
    requiredDocuments: [...commonDocs, "Farm details"],
    tags: ["Equipment", "Agriculture"],
  },
  {
    id: "urban-housing",
    name: "Urban Housing Support",
    category: "Housing",
    description:
      "An example of a housing assistance pathway for urban households.",
    level: "Central",
    state: "Across India",
    benefit: "Illustrative housing assistance",
    minAge: 21,
    maxAge: 75,
    maxIncome: 600000,
    requiredDocuments: [...commonDocs, "Household declaration"],
    tags: ["Housing", "Urban"],
  },
  {
    id: "rural-housing",
    name: "Rural Home Improvement",
    category: "Housing",
    description:
      "A demonstration of support for safer and more comfortable rural homes.",
    level: "State",
    state: "Tamil Nadu",
    benefit: "Illustrative home improvement",
    minAge: 21,
    maxAge: 75,
    maxIncome: 350000,
    requiredDocuments: [...commonDocs, "Property or tenancy document"],
    tags: ["Housing", "Rural"],
  },
  {
    id: "senior-support",
    name: "Senior Citizen Community Support",
    category: "Social Welfare",
    description:
      "A sample assistance programme for older citizens and everyday wellbeing.",
    level: "Central",
    state: "Across India",
    benefit: "Illustrative welfare assistance",
    minAge: 60,
    maxAge: 100,
    maxIncome: 300000,
    requiredDocuments: [...commonDocs, "Age document"],
    tags: ["Senior citizens", "Welfare"],
  },
  {
    id: "family-opportunity",
    name: "Family Opportunity Assistance",
    category: "Social Welfare",
    description:
      "Explore a demonstration of support for families and dependents.",
    level: "State",
    state: "Tamil Nadu",
    benefit: "Illustrative family assistance",
    minAge: 18,
    maxAge: 65,
    maxIncome: 350000,
    requiredDocuments: [...commonDocs, "Family details"],
    tags: ["Family", "Assistance"],
  },
];
export function getScheme(id?: string) {
  return schemes.find((s) => s.id === id);
}
export function ageFromDate(date: string) {
  if (!date) return null;
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
  )
    age--;
  return age;
}
export type CheckResult = {
  label: string;
  expected: string;
  value: string;
  status: "pass" | "fail" | "missing";
};
export function checkScheme(s: Scheme, p: Profile): CheckResult[] {
  const age = ageFromDate(p.birthDate);
  const income = p.income.trim() ? Number(p.income) : null;
  return [
    {
      label: "Age",
      expected: `${s.minAge}–${s.maxAge} years`,
      value: age === null ? "Not provided" : `${age} years`,
      status:
        age === null
          ? "missing"
          : age >= s.minAge && age <= s.maxAge
            ? "pass"
            : "fail",
    },
    {
      label: "Annual household income",
      expected: `Up to ₹${s.maxIncome.toLocaleString("en-IN")}`,
      value:
        income === null ? "Not provided" : `₹${income.toLocaleString("en-IN")}`,
      status:
        income === null || !Number.isFinite(income)
          ? "missing"
          : income <= s.maxIncome
            ? "pass"
            : "fail",
    },
    {
      label: "Location",
      expected: s.state,
      value: p.state || "Not provided",
      status: !p.state
        ? "missing"
        : s.state === "Across India" || p.state === s.state
          ? "pass"
          : "fail",
    },
    ...(s.occupation
      ? [
          {
            label: "Occupation",
            expected: s.occupation,
            value: p.status || "Not provided",
            status: !p.status
              ? "missing"
              : p.status === s.occupation
                ? "pass"
                : "fail",
          } as CheckResult,
        ]
      : []),
  ];
}
export function profileCompletion(p: Profile) {
  const keys: (keyof Profile)[] = [
    "name",
    "birthDate",
    "gender",
    "state",
    "district",
    "city",
    "pincode",
    "residential",
    "qualification",
    "studying",
    "status",
    "income",
    "familySize",
  ];
  return Math.round((keys.filter((k) => !!p[k]).length / keys.length) * 100);
}
export const onboardingSteps = [
  {
    name: "Basic information",
    path: "/onboarding/personal",
    hint: "A little about you",
  },
  {
    name: "Location details",
    path: "/onboarding/location",
    hint: "Your state and area",
  },
  {
    name: "Educational details",
    path: "/onboarding/education",
    hint: "Education and skills",
  },
  {
    name: "Professional details",
    path: "/onboarding/professional",
    hint: "Occupation and income",
  },
  {
    name: "Family information",
    path: "/onboarding/professional?section=family",
    hint: "Family and dependents",
  },
  {
    name: "Additional preferences",
    path: "/onboarding/preferences",
    hint: "Interests and priorities",
  },
  {
    name: "Review & submit",
    path: "/onboarding/review",
    hint: "Confirm your details",
  },
];
export const pageMap = [
  ["/", "Homepage"],
  ["/login", "Login"],
  ["/register", "Registration"],
  ["/verify-email", "Email verification"],
  ["/forgot-password", "Forgot password"],
  ["/reset-password", "Reset password"],
  ["/onboarding/personal", "Basic information"],
  ["/onboarding/location", "Location details"],
  ["/onboarding/education", "Educational details"],
  ["/onboarding/professional", "Professional and family details"],
  ["/onboarding/preferences", "Additional preferences"],
  ["/onboarding/review", "Review and submit"],
  ["/dashboard", "Dashboard"],
  ["/schemes", "Find schemes"],
  ["/schemes/education-loan", "Scheme details"],
  ["/eligibility/education-loan", "Eligibility checker"],
  ["/eligibility/education-loan/results", "Eligibility results"],
  ["/recommendations", "Recommended schemes"],
  ["/saved", "Saved schemes"],
  ["/compare", "Scheme comparison"],
  ["/guidance/education-loan", "Application guidance"],
  ["/profile", "My profile"],
  ["/notifications", "Notifications"],
  ["/settings", "Settings and privacy"],
  ["/help", "Help and support"],
  ["/about", "About SaharaSetu"],
  ["/how-it-works", "How it works"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
] as const;
export const demoNotice =
  "Demonstration data — fictional schemes and example rules. This prototype cannot determine real eligibility or submit government applications.";
