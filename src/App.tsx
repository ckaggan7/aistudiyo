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
import AdminOverview from "./pages/admin/AdminOverview";
import AdminShell from "./components/layout/AdminShell";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireRole="super_admin">
    <AdminShell>{children}</AdminShell>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
          <Route path="/dashboard/analytics" element={<DashboardPage><Analytics /></DashboardPage>} />
          <Route path="/dashboard/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
          <Route path="/admin" element={<AdminPage><AdminOverview /></AdminPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
