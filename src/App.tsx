
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "@/context/CompanyContext";
import Header from "@/components/layout/Header";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Pipeline from "./pages/Pipeline";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import IntelligenceReport from "./pages/IntelligenceReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompanyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Companies />} />
                <Route path="/company/:id" element={<CompanyDetails />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/intelligence-report" element={<IntelligenceReport />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
