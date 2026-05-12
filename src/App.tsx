import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import AIGenerator from "./pages/AIGenerator";
import DesignStudio from "./pages/DesignStudio";
import ContentCalendar from "./pages/ContentCalendar";
import MediaLibrary from "./pages/MediaLibrary";
import TrendEngine from "./pages/TrendEngine";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/SettingsPage";
import WaitlistPage from "./pages/WaitlistPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import BrandingCRM from "./pages/BrandingCRM";
import TrendingTemplates from "./pages/TrendingTemplates";
import ImageStudio from "./pages/ImageStudio";
import AgentBuilder from "./pages/AgentBuilder";
import NotFound from "./pages/NotFound";
import WorkflowsList from "./pages/workflows/WorkflowsList";
import WorkflowBuilder from "./pages/workflows/WorkflowBuilder";
import WorkflowRuns from "./pages/workflows/WorkflowRuns";
import { AuthProvider } from "./hooks/useAuth";
import { WorkspaceProvider } from "./hooks/useWorkspace";
import { ThemeProvider } from "./hooks/useTheme";
import CommandPalette from "./components/CommandPalette";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminOverview from "./pages/superadmin/SuperAdminOverview";
import SuperAdminUsers from "./pages/superadmin/SuperAdminUsers";
import SuperAdminUserDetail from "./pages/superadmin/SuperAdminUserDetail";
import SuperAdminRoute from "./components/auth/SuperAdminRoute";
import SuperAdminShell from "./components/layout/SuperAdminShell";
import SuperAdminWorkspaces from "./pages/superadmin/SuperAdminWorkspaces";
import SuperAdminAI from "./pages/superadmin/SuperAdminAI";
import SuperAdminBilling from "./pages/superadmin/SuperAdminBilling";
import SuperAdminAnalytics from "./pages/superadmin/SuperAdminAnalytics";
import SuperAdminSupport from "./pages/superadmin/SuperAdminSupport";
import SuperAdminSystem from "./pages/superadmin/SuperAdminSystem";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";
import CreditsPage from "./pages/CreditsPage";
import GrowthHub from "./pages/growth/GrowthHub";
import GoogleAds from "./pages/growth/GoogleAds";
import GoogleAnalyticsAI from "./pages/growth/GoogleAnalyticsAI";
import BusinessProfile from "./pages/growth/BusinessProfile";
import Reviews from "./pages/growth/Reviews";
import LocalSEO from "./pages/growth/LocalSEO";
import GrowthAgent from "./pages/growth/GrowthAgent";
import ConnectGoogle from "./pages/growth/ConnectGoogle";

// Academy — lazy-loaded so it doesn't bloat the main bundle
const AcademyHome = lazy(() => import("./pages/academy/AcademyHome"));
const AcademyTracks = lazy(() => import("./pages/academy/AcademyTracks"));
const TrackDetail = lazy(() => import("./pages/academy/TrackDetail"));
const AcademyCourses = lazy(() => import("./pages/academy/AcademyCourses"));
const CourseDetail = lazy(() => import("./pages/academy/CourseDetail"));
const PracticeLab = lazy(() => import("./pages/academy/PracticeLab"));
const MentorPage = lazy(() => import("./pages/academy/MentorPage"));
const MissionsPage = lazy(() => import("./pages/academy/MissionsPage"));
const AcademyCertificates = lazy(() => import("./pages/academy/AcademyCertificates"));
const CertificatePage = lazy(() => import("./pages/academy/CertificatePage"));
const AcademyVideos = lazy(() => import("./pages/academy/AcademyVideos"));
const AcademyCommunity = lazy(() => import("./pages/academy/AcademyCommunity"));
const AcademyProgress = lazy(() => import("./pages/academy/AcademyProgress"));

const AcademyFallback = () => <div className="p-8 animate-pulse text-muted-foreground text-sm">Loading Academy…</div>;
const A = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>
    <Suspense fallback={<AcademyFallback />}>{children}</Suspense>
  </DashboardLayout>
);

const queryClient = new QueryClient();

const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const SuperAdminPage = ({ children }: { children: React.ReactNode }) => (
  <SuperAdminRoute>
    <SuperAdminShell>{children}</SuperAdminShell>
  </SuperAdminRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <ThemeProvider>
        <WorkspaceProvider>
        <CommandPalette />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<WaitlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<DashboardPage><DashboardHome /></DashboardPage>} />
          <Route path="/dashboard/generator" element={<DashboardPage><AIGenerator /></DashboardPage>} />
          <Route path="/dashboard/image-studio" element={<DashboardPage><ImageStudio /></DashboardPage>} />
          <Route path="/dashboard/images" element={<Navigate to="/dashboard/image-studio" replace />} />
          <Route path="/dashboard/stickers" element={<Navigate to="/dashboard/image-studio?mode=sticker" replace />} />
          <Route path="/dashboard/design" element={<DashboardPage><DesignStudio /></DashboardPage>} />
          <Route path="/dashboard/calendar" element={<DashboardPage><ContentCalendar /></DashboardPage>} />
          <Route path="/dashboard/media" element={<DashboardPage><MediaLibrary /></DashboardPage>} />
          <Route path="/dashboard/trends" element={<DashboardPage><TrendEngine /></DashboardPage>} />
          <Route path="/dashboard/templates" element={<DashboardPage><TrendingTemplates /></DashboardPage>} />
          <Route path="/dashboard/branding" element={<DashboardPage><BrandingCRM /></DashboardPage>} />
          <Route path="/dashboard/agents" element={<DashboardPage><AgentBuilder /></DashboardPage>} />
          <Route path="/dashboard/workflows" element={<DashboardPage><WorkflowsList /></DashboardPage>} />
          <Route path="/dashboard/workflows/runs" element={<DashboardPage><WorkflowRuns /></DashboardPage>} />
          <Route path="/dashboard/workflows/:id" element={<DashboardPage><WorkflowBuilder /></DashboardPage>} />
          <Route path="/dashboard/analytics" element={<DashboardPage><Analytics /></DashboardPage>} />
          <Route path="/dashboard/growth" element={<DashboardPage><GrowthHub /></DashboardPage>} />
          <Route path="/dashboard/growth/ads" element={<DashboardPage><GoogleAds /></DashboardPage>} />
          <Route path="/dashboard/growth/analytics" element={<DashboardPage><GoogleAnalyticsAI /></DashboardPage>} />
          <Route path="/dashboard/growth/profile" element={<DashboardPage><BusinessProfile /></DashboardPage>} />
          <Route path="/dashboard/growth/reviews" element={<DashboardPage><Reviews /></DashboardPage>} />
          <Route path="/dashboard/growth/seo" element={<DashboardPage><LocalSEO /></DashboardPage>} />
          <Route path="/dashboard/growth/agent" element={<DashboardPage><GrowthAgent /></DashboardPage>} />
          <Route path="/dashboard/growth/connect" element={<DashboardPage><ConnectGoogle /></DashboardPage>} />
          <Route path="/dashboard/credits" element={<DashboardPage><CreditsPage /></DashboardPage>} />
          <Route path="/dashboard/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
          {/* Academy */}
          <Route path="/dashboard/academy" element={<A><AcademyHome /></A>} />
          <Route path="/dashboard/academy/tracks" element={<A><AcademyTracks /></A>} />
          <Route path="/dashboard/academy/track/:trackId" element={<A><TrackDetail /></A>} />
          <Route path="/dashboard/academy/courses" element={<A><AcademyCourses /></A>} />
          <Route path="/dashboard/academy/course/:courseId" element={<A><CourseDetail /></A>} />
          <Route path="/dashboard/academy/practice-lab" element={<A><PracticeLab /></A>} />
          <Route path="/dashboard/academy/mentor" element={<A><MentorPage /></A>} />
          <Route path="/dashboard/academy/missions" element={<A><MissionsPage /></A>} />
          <Route path="/dashboard/academy/certificates" element={<A><AcademyCertificates /></A>} />
          <Route path="/dashboard/academy/certificate/:certId" element={<A><CertificatePage /></A>} />
          <Route path="/dashboard/academy/videos" element={<A><AcademyVideos /></A>} />
          <Route path="/dashboard/academy/community" element={<A><AcademyCommunity /></A>} />
          <Route path="/dashboard/academy/progress" element={<A><AcademyProgress /></A>} />
          <Route path="/admin/*" element={<Navigate to="/superadmin" replace />} />
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/superadmin" element={<SuperAdminPage><SuperAdminOverview /></SuperAdminPage>} />
          <Route path="/superadmin/users" element={<SuperAdminPage><SuperAdminUsers /></SuperAdminPage>} />
          <Route path="/superadmin/users/:userId" element={<SuperAdminPage><SuperAdminUserDetail /></SuperAdminPage>} />
          <Route path="/superadmin/workspaces" element={<SuperAdminPage><SuperAdminWorkspaces /></SuperAdminPage>} />
          <Route path="/superadmin/ai" element={<SuperAdminPage><SuperAdminAI /></SuperAdminPage>} />
          <Route path="/superadmin/billing" element={<SuperAdminPage><SuperAdminBilling /></SuperAdminPage>} />
          <Route path="/superadmin/analytics" element={<SuperAdminPage><SuperAdminAnalytics /></SuperAdminPage>} />
          <Route path="/superadmin/support" element={<SuperAdminPage><SuperAdminSupport /></SuperAdminPage>} />
          <Route path="/superadmin/system" element={<SuperAdminPage><SuperAdminSystem /></SuperAdminPage>} />
          <Route path="/superadmin/settings" element={<SuperAdminPage><SuperAdminSettings /></SuperAdminPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </WorkspaceProvider>
        </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
