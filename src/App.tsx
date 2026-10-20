import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { PrototypeProvider } from "./state";
import { AppShell, PublicLayout } from "./components/ui";
import "./portal.css";
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPages"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const DashboardPage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.DashboardPage })),
);
const CataloguePage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.CataloguePage })),
);
const SchemeDetailsPage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.SchemeDetailsPage })),
);
const EligibilityPage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.EligibilityPage })),
);
const GuidancePage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.GuidancePage })),
);
const ComparisonPage = lazy(() =>
  import("./pages/SchemePages").then((m) => ({ default: m.ComparisonPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/AccountPages").then((m) => ({ default: m.ProfilePage })),
);
const SettingsPage = lazy(() =>
  import("./pages/AccountPages").then((m) => ({ default: m.SettingsPage })),
);
const NotificationsPage = lazy(() =>
  import("./pages/AccountPages").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const HelpPage = lazy(() =>
  import("./pages/AccountPages").then((m) => ({ default: m.HelpPage })),
);
const UtilityPage = lazy(() =>
  import("./pages/AccountPages").then((m) => ({ default: m.UtilityPage })),
);
function RouteLifecycle() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `SaharaSetu · ${location.pathname === "/" ? "Government Schemes Made Simple" : location.pathname.split("/").filter(Boolean).join(" · ").replace(/-/g, " ")}`;
  }, [location.pathname]);
  return null;
}
export default function App() {
  return (
    <PrototypeProvider>
      <RouteLifecycle />
      <Suspense
        fallback={
          <div className="ss-route-loading" role="status">
            Loading your next step…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<PublicLayout />}>
            {(
              [
                "login",
                "register",
                "verify-email",
                "forgot-password",
                "reset-password",
              ] as const
            ).map((path, i) => (
              <Route
                path={path}
                key={path}
                element={
                  <AuthPage
                    key={path}
                    mode={
                      (
                        [
                          "login",
                          "register",
                          "verify",
                          "forgot",
                          "reset",
                        ] as const
                      )[i]
                    }
                  />
                }
              />
            ))}
            {[
              "personal",
              "location",
              "education",
              "professional",
              "preferences",
              "review",
            ].map((step) => (
              <Route
                path={`onboarding/${step}`}
                key={step}
                element={<OnboardingPage />}
              />
            ))}
            {(["about", "how-it-works", "privacy", "terms"] as const).map(
              (kind) => (
                <Route
                  path={kind}
                  key={kind}
                  element={<UtilityPage kind={kind} />}
                />
              ),
            )}
          </Route>
          <Route element={<AppShell />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="schemes" element={<CataloguePage />} />
            <Route path="schemes/:id" element={<SchemeDetailsPage />} />
            <Route
              path="recommendations"
              element={<CataloguePage mode="recommendations" />}
            />
            <Route path="saved" element={<CataloguePage mode="saved" />} />
            <Route path="compare" element={<ComparisonPage />} />
            <Route path="eligibility/:id" element={<EligibilityPage />} />
            <Route
              path="eligibility/:id/results"
              element={<EligibilityPage results />}
            />
            <Route path="guidance/:id" element={<GuidancePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="ss-not-found">
                <img src="/favicon.svg" width="50" height="50" alt="" />
                <h1>This page hasn’t found its way here.</h1>
                <p>Use the homepage or scheme catalogue to continue.</p>
                <Link className="button primary" to="/">
                  Back to homepage
                </Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </PrototypeProvider>
  );
}
