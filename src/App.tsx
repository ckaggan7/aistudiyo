import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
          <Route path="/dashboard/credits" element={<DashboardPage><CreditsPage /></DashboardPage>} />
          <Route path="/dashboard/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
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
