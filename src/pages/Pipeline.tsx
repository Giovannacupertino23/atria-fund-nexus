
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCompany, Company, PipelineStatus } from "@/context/CompanyContext";
import { Loader2, BarChart3, Users, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from "recharts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Pipeline = () => {
  const { companies, isLoading, teamMembers } = useCompany();
  const navigate = useNavigate();
  const [sortWorkload, setSortWorkload] = useState<"alphabetical" | "count">("count");
  
  // Filter by pipeline status
  const filterCompaniesByPipelineStatus = (status: PipelineStatus) => {
    return companies.filter(company => company.pipeline_status === status);
  };

  const prospects = filterCompaniesByPipelineStatus("prospect");
  const meetingScheduled = filterCompaniesByPipelineStatus("meeting_scheduled");
  const meetingDone = filterCompaniesByPipelineStatus("meeting_done");
  const dueDiligence = filterCompaniesByPipelineStatus("due_diligence");
  const invested = filterCompaniesByPipelineStatus("invested");

  const getCompanyColor = (company: Company) => {
    switch (company.score_color) {
      case "green": return "border-l-4 border-green-500";
      case "orange": return "border-l-4 border-orange-500";
      case "red": return "border-l-4 border-red-500";
      default: return "border-l-4 border-gray-300";
    }
  };

  // Dashboard data
  const pipelineData = useMemo(() => [
    { name: "Prospecção", value: prospects.length, color: "#6366f1" },
    { name: "Reunião Agendada", value: meetingScheduled.length, color: "#8b5cf6" },
    { name: "Reunião Feita", value: meetingDone.length, color: "#ec4899" },
    { name: "Due Diligence", value: dueDiligence.length, color: "#f97316" },
    { name: "Investidas", value: invested.length, color: "#10b981" },
  ], [prospects.length, meetingScheduled.length, meetingDone.length, dueDiligence.length, invested.length]);
  
  // Calculate score distribution 
  const scoreDistribution = useMemo(() => {
    const greenCompanies = companies.filter(company => company.score_color === "green").length;
    const orangeCompanies = companies.filter(company => company.score_color === "orange").length;
    const redCompanies = companies.filter(company => company.score_color === "red").length;
    const noScoreCompanies = companies.filter(company => !company.score_color).length;
    
    return [
      { name: "Alta Pontuação", value: greenCompanies, color: "#10b981" },
      { name: "Média Pontuação", value: orangeCompanies, color: "#f97316" },
      { name: "Baixa Pontuação", value: redCompanies, color: "#ef4444" },
      { name: "Sem Pontuação", value: noScoreCompanies, color: "#94a3b8" },
    ];
  }, [companies]);

  // Calculate team workload
  const teamWorkload = useMemo(() => {
    const workload: Record<string, { member: any, companies: Company[] }> = {};

    // Initialize with all team members
    teamMembers.forEach(member => {
      workload[member.id] = { member, companies: [] };
    });
    
    // Count companies per responsible
    companies.forEach(company => {
      if (company.responsible) {
        // Find the team member ID from their name
        const member = teamMembers.find(m => m.name === company.responsible);
        if (member && workload[member.id]) {
          workload[member.id].companies.push(company);
        }
      }
    });
    
    // Convert to array for rendering
    let workloadArray = Object.values(workload);
    
    // Sort based on selected criterion
    if (sortWorkload === "alphabetical") {
      workloadArray = workloadArray.sort((a, b) => a.member.name.localeCompare(b.member.name));
    } else { // count
      workloadArray = workloadArray.sort((a, b) => b.companies.length - a.companies.length);
    }
    
    return workloadArray;
  }, [companies, teamMembers, sortWorkload]);

  const renderColumn = (title: string, companies: Company[]) => (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <div className="bg-gray-100 rounded-md p-2 h-full min-h-[200px]">
        {companies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Nenhuma empresa
          </div>
        ) : (
          companies.map(company => (
            <div
              key={company.id}
              className={`bg-white rounded-md p-3 mb-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${getCompanyColor(company)}`}
              onClick={() => navigate(`/company/${company.id}`)}
            >
              <h4 className="font-medium">{company.name}</h4>
              <p className="text-sm text-gray-500">{company.sector}</p>
              {company.final_score !== null && company.final_score !== undefined && (
                <div className="flex justify-between mt-2 text-sm">
                  <span>Nota:</span> 
                  <span className="font-medium">{company.final_score.toFixed(1)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Acompanhe o status das empresas no pipeline de investimentos.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-atria-red" />
        </div>
      ) : (
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <Filter className="h-4 w-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="workload">
              <Users className="h-4 w-4 mr-2" />
              Carga de Trabalho
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição do Pipeline</CardTitle>
                  <CardDescription>
                    Empresas por etapa do processo
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={{
                        prospect: { label: "Prospecção", color: "#6366f1" },
                        meeting_scheduled: { label: "Reunião Agendada", color: "#8b5cf6" },
                        meeting_done: { label: "Reunião Feita", color: "#ec4899" },
                        due_diligence: { label: "Due Diligence", color: "#f97316" },
                        invested: { label: "Investidas", color: "#10b981" }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pipelineData} barCategoryGap={4}>
                          <XAxis dataKey="name" scale="band" />
                          <YAxis />
                          <ChartTooltip
                            content={<ChartTooltipContent formatter={(value) => [`${value} empresas`, "Quantidade"]} />}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {pipelineData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Scores</CardTitle>
                  <CardDescription>
                    Empresas por nível de pontuação
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={{
                        green: { label: "Alta Pontuação", color: "#10b981" },
                        orange: { label: "Média Pontuação", color: "#f97316" },
                        red: { label: "Baixa Pontuação", color: "#ef4444" },
                        none: { label: "Sem Pontuação", color: "#94a3b8" }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scoreDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {scoreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} empresas`, "Quantidade"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de Pipeline</CardTitle>
                <CardDescription>
                  Resumo dos dados do funil de investimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="flex flex-col p-4 bg-purple-50 rounded-md">
                    <span className="text-sm text-gray-500">Total de Empresas</span>
                    <span className="text-2xl font-bold">{companies.length}</span>
                  </div>
                  <div className="flex flex-col p-4 bg-blue-50 rounded-md">
                    <span className="text-sm text-gray-500">Prospects</span>
                    <span className="text-2xl font-bold">{prospects.length}</span>
                    <span className="text-xs text-gray-500">{((prospects.length / companies.length) * 100).toFixed(1)}% do total</span>
                  </div>
                  <div className="flex flex-col p-4 bg-pink-50 rounded-md">
                    <span className="text-sm text-gray-500">Em Reuniões</span>
                    <span className="text-2xl font-bold">{meetingScheduled.length + meetingDone.length}</span>
                    <span className="text-xs text-gray-500">{(((meetingScheduled.length + meetingDone.length) / companies.length) * 100).toFixed(1)}% do total</span>
                  </div>
                  <div className="flex flex-col p-4 bg-orange-50 rounded-md">
                    <span className="text-sm text-gray-500">Due Diligence</span>
                    <span className="text-2xl font-bold">{dueDiligence.length}</span>
                    <span className="text-xs text-gray-500">{((dueDiligence.length / companies.length) * 100).toFixed(1)}% do total</span>
                  </div>
                  <div className="flex flex-col p-4 bg-green-50 rounded-md">
                    <span className="text-sm text-gray-500">Investidas</span>
                    <span className="text-2xl font-bold">{invested.length}</span>
                    <span className="text-xs text-gray-500">{((invested.length / companies.length) * 100).toFixed(1)}% do total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kanban" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline de Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {renderColumn("Prospects", prospects)}
                  {renderColumn("Reunião Agendada", meetingScheduled)}
                  {renderColumn("Reunião Feita", meetingDone)}
                  {renderColumn("Due Diligence", dueDiligence)}
                  {renderColumn("Investida", invested)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workload" className="animate-fade-in space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Carga de Trabalho da Equipe</CardTitle>
                  <CardDescription>
                    Distribuição de empresas por responsável
                  </CardDescription>
                </div>
                <Select
                  value={sortWorkload}
                  onValueChange={(value) => setSortWorkload(value as "alphabetical" | "count")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="count">Volume de Empresas</SelectItem>
                      <SelectItem value="alphabetical">Ordem Alfabética</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teamWorkload.map((item) => (
                    <div key={item.member.id}>
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          {item.member.avatar.includes("/") ? (
                            <AvatarImage src={item.member.avatar} alt={item.member.name} />
                          ) : (
                            <AvatarFallback>{item.member.avatar}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{item.member.name}</h3>
                          <p className="text-sm text-gray-500">{item.member.role}</p>
                        </div>
                        <div className="ml-auto">
                          <Badge variant={item.companies.length > 5 ? "destructive" : item.companies.length > 2 ? "default" : "secondary"}>
                            {item.companies.length} {item.companies.length === 1 ? 'empresa' : 'empresas'}
                          </Badge>
                        </div>
                      </div>
                      
                      {item.companies.length > 0 ? (
                        <div className="ml-12 mt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {item.companies.map(company => (
                              <div 
                                key={company.id}
                                className={`bg-white border rounded-md p-2 text-sm cursor-pointer hover:bg-gray-50 ${getCompanyColor(company)}`}
                                onClick={() => navigate(`/company/${company.id}`)}
                              >
                                <div className="font-medium">{company.name}</div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-gray-500">{company.sector}</span>
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                    {company.pipeline_status === "prospect" && "Prospect"}
                                    {company.pipeline_status === "meeting_scheduled" && "Reunião Agendada"}
                                    {company.pipeline_status === "meeting_done" && "Reunião Feita"}
                                    {company.pipeline_status === "due_diligence" && "Due Diligence"}
                                    {company.pipeline_status === "invested" && "Investida"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="ml-12 text-sm text-gray-500 py-2">
                          Nenhuma empresa atribuída
                        </div>
                      )}
                      
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Pipeline;
