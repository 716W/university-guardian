import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import Claims from "./pages/Claims";
import Handover from "./pages/Handover";
import UsersPage from "./pages/Users";
import MasterData from "./pages/MasterData";
import AuditLogs from "./pages/AuditLogs";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/handover" element={<Handover />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/master-data" element={<MasterData />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
