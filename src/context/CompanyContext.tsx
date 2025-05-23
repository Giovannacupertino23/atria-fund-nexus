import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types
export type CompanyStatus = "approved" | "evaluating" | "not_approved";
export type PipelineStatus = "prospect" | "meeting_scheduled" | "meeting_done" | "due_diligence" | "invested";
export type ScoreColor = "green" | "orange" | "red";
export type CashFlow = "positive" | "negative";
export type RiskLevel = "high" | "medium" | "low";

export interface Company {
  id: string;
  name: string;
  sector: string;
  about?: string | null;
  cnpj: string;
  website?: string | null;
  responsible?: string | null;
  cac?: number | null;
  average_ticket?: number | null;
  market_cap?: number | null;
  annual_revenue_2024?: number | null;
  net_margin_2024?: number | null;
  ebitda_2023?: number | null;
  ebitda_2024?: number | null;
  ebitda_2025?: number | null;
  yoy_growth_21_22?: number | null;
  yoy_growth_22_23?: number | null;
  yoy_growth_23_24?: number | null;
  risk_factors?: string | null;
  leverage?: number | null;
  cash_flow?: CashFlow | null;
  dividend_distribution?: boolean | null;
  status?: CompanyStatus | null;
  pipeline_status?: PipelineStatus | null;
  final_score?: number | null;
  score_color?: ScoreColor | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Due Diligence fields
  financial_link?: string | null;
  financial_analysis?: string | null;
  financial_risk?: RiskLevel | null;
  legal_link?: string | null;
  legal_analysis?: string | null;
  legal_risk?: RiskLevel | null;
  governance_link?: string | null;
  governance_analysis?: string | null;
  governance_risk?: RiskLevel | null;
  // Intelligent Analysis field
  intelligent_analysis?: string | null;
}

// Calendar event type
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  companyId?: string;
  teamMemberId: string;
  type: "meeting" | "deadline" | "follow-up" | "other";
}

// Team member type
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

// Updated team members data with the new names and roles
const teamMembersData: TeamMember[] = [
  { id: "1", name: "Giovanna", avatar: "GI", role: "Sócia Gestora" },
  { id: "2", name: "Maria Paula", avatar: "MP", role: "Sócia Gestora" },
  { id: "3", name: "Ester", avatar: "ES", role: "Analista" },
  { id: "4", name: "Nicolle", avatar: "NI", role: "Analista" },
  { id: "5", name: "Giovanna Dangelo", avatar: "GD", role: "Analista" },
  { id: "6", name: "Mel Bayde", avatar: "MB", role: "Analista" },
  { id: "7", name: "Mauro Soledade", avatar: "MS", role: "Analista" }
];

// Mock events for calendar
const todayDate = new Date();
const nextWeek = new Date(todayDate);
nextWeek.setDate(todayDate.getDate() + 7);

const initialEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Reunião com TechSoft",
    start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 3, 14, 0),
    end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 3, 15, 30),
    companyId: "1",
    teamMemberId: "1",
    type: "meeting"
  },
  {
    id: "e2",
    title: "Due Diligence Conecta",
    start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1, 10, 0),
    end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1, 16, 0),
    companyId: "2",
    teamMemberId: "2",
    type: "deadline"
  },
  {
    id: "e3",
    title: "Follow-up FinGroup",
    start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 5, 11, 0),
    end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 5, 12, 0),
    companyId: "3",
    teamMemberId: "3",
    type: "follow-up"
  },
  {
    id: "e4",
    title: "Primeira Reunião Saúde Digital",
    start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 2, 9, 0),
    end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 2, 10, 30),
    companyId: "4",
    teamMemberId: "4",
    type: "meeting"
  },
  {
    id: "e5",
    title: "Análise Preliminar EduTech",
    start: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 4, 13, 0),
    end: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 4, 17, 0),
    companyId: "5",
    teamMemberId: "5",
    type: "other"
  }
];

// Score calculation function
export const calculateCompanyScore = (company: Company): { finalScore: number; scoreColor: ScoreColor } => {
  // Initialize weights
  let ebitdaWeight = 0.35;
  let growthWeight = 0.30;
  let revenueWeight = 0.20;
  let leverageWeight = 0.15;
  
  let totalWeight = 0;
  let scoreSum = 0;
  
  // Helper function to safely calculate averages
  const calculateAverage = (values: (number | null | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  };
  
  // Calculate EBITDA score (35%)
  const ebitdaValues = [company.ebitda_2023, company.ebitda_2024, company.ebitda_2025];
  const ebitdaAvg = calculateAverage(ebitdaValues);
  
  if (ebitdaAvg !== null) {
    let ebitdaScore = 0;
    
    if (ebitdaAvg > 13) {
      ebitdaScore = 1;
    } else if (ebitdaAvg >= 5 && ebitdaAvg <= 13) {
      ebitdaScore = 0.5;
    }
    
    scoreSum += ebitdaScore * ebitdaWeight;
    totalWeight += ebitdaWeight;
  }
  
  // Calculate YoY Growth score (30%)
  const growthValues = [company.yoy_growth_21_22, company.yoy_growth_22_23, company.yoy_growth_23_24];
  const growthAvg = calculateAverage(growthValues);
  
  if (growthAvg !== null) {
    let growthScore = 0;
    
    if (growthAvg > 16) {
      growthScore = 1;
    } else if (growthAvg >= 1 && growthAvg <= 16) {
      growthScore = 0.5;
    }
    
    scoreSum += growthScore * growthWeight;
    totalWeight += growthWeight;
  }
  
  // Calculate Revenue score (20%)
  if (company.annual_revenue_2024 !== undefined && company.annual_revenue_2024 !== null) {
    let revenueScore = 0;
    
    if (company.annual_revenue_2024 > 100000000) { // 100 million
      revenueScore = 1;
    } else if (company.annual_revenue_2024 >= 50000000 && company.annual_revenue_2024 <= 100000000) { // 50-100 million
      revenueScore = 0.5;
    }
    
    scoreSum += revenueScore * revenueWeight;
    totalWeight += revenueWeight;
  }
  
  // Calculate Leverage score (15%)
  if (company.leverage !== undefined && company.leverage !== null) {
    let leverageScore = 0;
    
    if (company.leverage < 50) {
      leverageScore = 1;
    } else if (company.leverage >= 50 && company.leverage <= 100) {
      leverageScore = 0.5;
    }
    
    scoreSum += leverageScore * leverageWeight;
    totalWeight += leverageWeight;
  }
  
  // Normalize score if not all criteria are present
  let finalScore = 0;
  if (totalWeight > 0) {
    finalScore = (scoreSum / totalWeight) * 10; // Scale to 0-10
  }
  
  // Determine score color
  let scoreColor: ScoreColor = "red";
  if (finalScore >= 7.5) {
    scoreColor = "green";
  } else if (finalScore >= 5) {
    scoreColor = "orange";
  }
  
  return { finalScore, scoreColor };
};

// Context interface
interface CompanyContextType {
  companies: Company[];
  events: CalendarEvent[];
  teamMembers: TeamMember[];
  loadCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, "id" | "created_at" | "updated_at" | "final_score" | "score_color">) => Promise<Company | undefined>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompanyById: (id: string) => Company | undefined;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  filterCompaniesByStatus: (status: CompanyStatus) => Company[];
  isLoading: boolean;
  companyLoadError: boolean;
  loadingCompanyId: string | null;
}

// Create context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider
export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [companyLoadError, setCompanyLoadError] = useState(false);
  const [loadingCompanyId, setLoadingCompanyId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load companies from Supabase
  const loadCompanies = useCallback(async () => {
    // Skip if we're already loading
    if (isLoading) return;
    
    setIsLoading(true);
    setCompanyLoadError(false);
    try {
      console.log("Carregando empresas do Supabase...");
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Erro ao carregar empresas (detalhado):', error);
        setCompanyLoadError(true);
        throw error;
      }
      
      console.log("Dados retornados do Supabase:", data);
      
      if (data) {
        setCompanies(data as Company[]);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setCompanyLoadError(true);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível conectar ao banco de dados. Tente novamente mais tarde.",
        variant: "destructive"
      });
      // Set empty array to prevent endless loading state
      setCompanies([]);
    } finally {
      setIsLoading(false);
      setLoadingCompanyId(null);
      setIsInitialized(true);
    }
  }, [toast]);

  // Load data on mount only once
  useEffect(() => {
    if (!isInitialized) {
      loadCompanies();
    }
  }, [isInitialized, loadCompanies]);

  // Add company
  const addCompany = async (company: Omit<Company, "id" | "created_at" | "updated_at" | "final_score" | "score_color">) => {
    try {
      console.log("Adicionando empresa ao Supabase:", company);
      
      // Calculate score
      const { finalScore, scoreColor } = calculateCompanyScore(company as Company);
      
      console.log("Score calculado:", { finalScore, scoreColor });
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('companies')
        .insert([{ 
          ...company, 
          final_score: finalScore,
          score_color: scoreColor
        }])
        .select();
      
      if (error) {
        console.error('Erro ao adicionar empresa (detalhado):', error);
        toast({
          title: "Erro ao cadastrar",
          description: `Ocorreu um erro ao cadastrar a empresa: ${error.message}`,
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Resposta do Supabase após inserção:", data);
      
      if (data && data.length > 0) {
        const newCompany = data[0] as Company;
        setCompanies(prev => [...prev, newCompany]);
        
        toast({
          title: "Empresa cadastrada",
          description: "A empresa foi cadastrada com sucesso no banco de dados."
        });
        
        return newCompany;
      }
      return undefined;
    } catch (error) {
      console.error('Erro ao adicionar empresa:', error);
      return undefined;
    }
  };

  // Update company
  const updateCompany = async (id: string, companyData: Partial<Company>) => {
    try {
      // Get current company data
      const currentCompany = companies.find(c => c.id === id);
      if (!currentCompany) return;
      
      // Merge current and new data
      const updatedCompany = { ...currentCompany, ...companyData };
      
      // Recalculate score if relevant fields changed
      const scoreFields = [
        'ebitda_2023', 'ebitda_2024', 'ebitda_2025',
        'yoy_growth_21_22', 'yoy_growth_22_23', 'yoy_growth_23_24',
        'annual_revenue_2024', 'leverage'
      ];
      
      let finalScore = updatedCompany.final_score;
      let scoreColor = updatedCompany.score_color;
      
      const shouldRecalculate = scoreFields.some(field => 
        field in companyData && companyData[field as keyof typeof companyData] !== currentCompany[field as keyof typeof currentCompany]
      );
      
      if (shouldRecalculate) {
        const result = calculateCompanyScore(updatedCompany);
        finalScore = result.finalScore;
        scoreColor = result.scoreColor;
      }
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...companyData,
          final_score: finalScore,
          score_color: scoreColor
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data[0] } as Company : c));
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  // Delete company
  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCompanies(prev => prev.filter(company => company.id !== id));
      
      toast({
        title: "Empresa excluída",
        description: "A empresa foi removida com sucesso."
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a empresa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Get company by ID
  const getCompanyById = useCallback((id: string) => {
    // Immediately return the company if it exists in the current state
    const foundCompany = companies.find(company => company.id === id);
    
    // If company is not found and we need to load companies (and aren't already loading)
    if (!foundCompany && companies.length === 0 && !isLoading && !loadingCompanyId) {
      loadCompanies();
    }
    
    return foundCompany;
  }, [companies, isLoading, loadingCompanyId, loadCompanies]);

  // Add event
  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  // Update event
  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, ...event } : e))
    );
  };

  // Delete event
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  // Filter companies by status
  const filterCompaniesByStatus = (status: CompanyStatus) => {
    return companies.filter(company => company.status === status);
  };

  // Context value
  const value = {
    companies,
    events,
    teamMembers: teamMembersData,
    loadCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    addEvent,
    updateEvent,
    deleteEvent,
    filterCompaniesByStatus,
    isLoading,
    companyLoadError,
    loadingCompanyId
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

// Custom hook
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
};
