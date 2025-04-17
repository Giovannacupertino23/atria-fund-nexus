import React, { createContext, useContext, useState, ReactNode } from "react";

// Tipos
export type PipelineStatus = 
  | "prospect" 
  | "agendado" 
  | "reunido" 
  | "diligence" 
  | "investida";

export type Segment = 
  | "SaaS" 
  | "Marketplace" 
  | "E-commerce" 
  | "Fintech" 
  | "Healthtech" 
  | "Edtech" 
  | "Outros";

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  revenue: number;
  profitMargin: number;
  retention: number;
  churn: number;
  cac: number;
  ltv: number;
  nps: number;
  website: string;
  segment: Segment;
  status: PipelineStatus;
  documents: Document[];
  responsiblePerson?: string; // Novo campo adicionado
  teamMember?: string;
  lastContact?: Date;
  nextMeeting?: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

// Dados de exemplo
const teamMembersData: TeamMember[] = [
  { id: "1", name: "Marcos Silva", avatar: "MS", role: "Sócio Gestor" },
  { id: "2", name: "Ana Luiza Costa", avatar: "AC", role: "Analista Sênior" },
  { id: "3", name: "Rafael Oliveira", avatar: "RO", role: "Analista de Investimentos" },
  { id: "4", name: "Tatiana Santos", avatar: "TS", role: "Diretora de Operações" },
  { id: "5", name: "João Pedro Mendes", avatar: "JM", role: "Analista Júnior" },
  { id: "6", name: "Camila Ferreira", avatar: "CF", role: "Sócia" },
  { id: "7", name: "Bruno Almeida", avatar: "BA", role: "Analista Financeiro" }
];

// Dados de exemplo para empresas
const initialCompanies: Company[] = [
  {
    id: "1",
    name: "TechSoft Sistemas",
    cnpj: "12.345.678/0001-90",
    revenue: 350000,
    profitMargin: 32,
    retention: 87,
    churn: 13,
    cac: 1200,
    ltv: 9600,
    nps: 72,
    website: "https://techsoft.exemplo.com.br",
    segment: "SaaS",
    status: "investida",
    documents: [
      { id: "d1", name: "Contrato", type: "PDF", url: "#", uploadDate: new Date(2023, 5, 12) }
    ],
    responsiblePerson: "Marcos Silva",
    teamMember: "1",
    lastContact: new Date(2023, 9, 15),
    nextMeeting: new Date(2023, 10, 5)
  },
  {
    id: "2",
    name: "Conecta Marketplace",
    cnpj: "23.456.789/0001-01",
    revenue: 820000,
    profitMargin: 18,
    retention: 74,
    churn: 26,
    cac: 950,
    ltv: 5700,
    nps: 68,
    website: "https://conecta.exemplo.com.br",
    segment: "Marketplace",
    status: "diligence",
    documents: [],
    responsiblePerson: "Ana Luiza Costa",
    teamMember: "2",
    lastContact: new Date(2023, 9, 20)
  },
  {
    id: "3",
    name: "FinGroup",
    cnpj: "34.567.890/0001-12",
    revenue: 1250000,
    profitMargin: 41,
    retention: 92,
    churn: 8,
    cac: 2100,
    ltv: 18900,
    nps: 85,
    website: "https://fingroup.exemplo.com.br",
    segment: "Fintech",
    status: "reunido",
    documents: [
      { id: "d2", name: "Apresentação", type: "PPTX", url: "#", uploadDate: new Date(2023, 8, 25) }
    ],
    responsiblePerson: "Rafael Oliveira",
    teamMember: "3"
  },
  {
    id: "4",
    name: "Saúde Digital",
    cnpj: "45.678.901/0001-23",
    revenue: 680000,
    profitMargin: 36,
    retention: 88,
    churn: 12,
    cac: 1500,
    ltv: 12000,
    nps: 78,
    website: "https://saudedigital.exemplo.com.br",
    segment: "Healthtech",
    status: "agendado",
    documents: [],
    responsiblePerson: "Tatiana Santos",
    teamMember: "4",
    nextMeeting: new Date(2023, 10, 8)
  },
  {
    id: "5",
    name: "EduTech Brasil",
    cnpj: "56.789.012/0001-34",
    revenue: 520000,
    profitMargin: 28,
    retention: 83,
    churn: 17,
    cac: 880,
    ltv: 7040,
    nps: 75,
    website: "https://edutech.exemplo.com.br",
    segment: "Edtech",
    status: "prospect",
    documents: [],
    responsiblePerson: "João Pedro Mendes",
    teamMember: "5"
  },
  {
    id: "6",
    name: "ShopNow E-commerce",
    cnpj: "67.890.123/0001-45",
    revenue: 1750000,
    profitMargin: 22,
    retention: 72,
    churn: 28,
    cac: 650,
    ltv: 3900,
    nps: 66,
    website: "https://shopnow.exemplo.com.br",
    segment: "E-commerce",
    status: "prospect",
    documents: [],
    responsiblePerson: "Camila Ferreira",
    teamMember: "6"
  },
  {
    id: "7",
    name: "Logística Express",
    cnpj: "78.901.234/0001-56",
    revenue: 980000,
    profitMargin: 15,
    retention: 79,
    churn: 21,
    cac: 1100,
    ltv: 5500,
    nps: 70,
    website: "https://logisticaexpress.exemplo.com.br",
    segment: "Outros",
    status: "reunido",
    documents: [],
    responsiblePerson: "Bruno Almeida",
    teamMember: "7"
  },
  {
    id: "8",
    name: "CloudStore",
    cnpj: "89.012.345/0001-67",
    revenue: 430000,
    profitMargin: 38,
    retention: 91,
    churn: 9,
    cac: 1800,
    ltv: 16200,
    nps: 82,
    website: "https://cloudstore.exemplo.com.br",
    segment: "SaaS",
    status: "investida",
    documents: [
      { id: "d3", name: "Contrato", type: "PDF", url: "#", uploadDate: new Date(2023, 6, 18) }
    ],
    responsiblePerson: "Marcos Silva",
    teamMember: "1"
  },
  {
    id: "9",
    name: "Investimentos Pro",
    cnpj: "90.123.456/0001-78",
    revenue: 2100000,
    profitMargin: 45,
    retention: 94,
    churn: 6,
    cac: 2500,
    ltv: 25000,
    nps: 88,
    website: "https://investpro.exemplo.com.br",
    segment: "Fintech",
    status: "agendado",
    documents: [],
    responsiblePerson: "Ana Luiza Costa",
    teamMember: "2",
    nextMeeting: new Date(2023, 10, 12)
  },
  {
    id: "10",
    name: "Construtech Soluções",
    cnpj: "01.234.567/0001-89",
    revenue: 1450000,
    profitMargin: 25,
    retention: 81,
    churn: 19,
    cac: 1350,
    ltv: 8100,
    nps: 73,
    website: "https://construtech.exemplo.com.br",
    segment: "Outros",
    status: "prospect",
    documents: [],
    responsiblePerson: "Rafael Oliveira",
    teamMember: "3"
  }
];

// Mock de eventos para o calendário
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  companyId?: string;
  teamMemberId: string;
  type: "meeting" | "deadline" | "follow-up" | "other";
}

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

// Interface do contexto
interface CompanyContextType {
  companies: Company[];
  events: CalendarEvent[];
  teamMembers: TeamMember[];
  addCompany: (company: Omit<Company, "id" | "documents">) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
  addDocument: (companyId: string, document: Omit<Document, "id" | "uploadDate">) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  filterCompaniesByStatus: (status: PipelineStatus) => Company[];
  filterCompaniesByTeamMember: (teamMemberId: string) => Company[];
}

// Criar contexto
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provider
export const CompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Adicionar empresa
  const addCompany = (company: Omit<Company, "id" | "documents">) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      documents: []
    };
    setCompanies((prev) => [...prev, newCompany]);
  };

  // Atualizar empresa
  const updateCompany = (id: string, company: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...company } : c))
    );
  };

  // Excluir empresa
  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  // Obter empresa por ID
  const getCompanyById = (id: string) => {
    return companies.find((company) => company.id === id);
  };

  // Adicionar documento a uma empresa
  const addDocument = (companyId: string, document: Omit<Document, "id" | "uploadDate">) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date()
    };

    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? { ...company, documents: [...company.documents, newDocument] }
          : company
      )
    );
  };

  // Adicionar evento ao calendário
  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  // Atualizar evento
  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...event } : e))
    );
  };

  // Excluir evento
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  // Filtrar empresas por status
  const filterCompaniesByStatus = (status: PipelineStatus) => {
    return companies.filter((company) => company.status === status);
  };

  // Filtrar empresas por membro da equipe
  const filterCompaniesByTeamMember = (teamMemberId: string) => {
    return companies.filter((company) => company.teamMember === teamMemberId);
  };

  // Valor do contexto
  const value = {
    companies,
    events,
    teamMembers: teamMembersData,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    addDocument,
    addEvent,
    updateEvent,
    deleteEvent,
    filterCompaniesByStatus,
    filterCompaniesByTeamMember
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
};
