
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany, PipelineStatus } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import DataCard from "@/components/ui/DataCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Pipeline = () => {
  const { companies } = useCompany();
  const navigate = useNavigate();

  // Dados para colunas do funil
  const prospects = companies.filter((c) => c.status === "prospect");
  const scheduled = companies.filter((c) => c.status === "agendado");
  const met = companies.filter((c) => c.status === "reunido");
  const diligence = companies.filter((c) => c.status === "diligence");
  const invested = companies.filter((c) => c.status === "investida");

  // Cálculo de taxas de conversão
  const prospectToMeetingRate = prospects.length > 0
    ? Math.round((met.length / prospects.length) * 100)
    : 0;

  const scheduledToMetRate = scheduled.length > 0
    ? Math.round((met.length / scheduled.length) * 100)
    : 0;

  // Dados de segmento para o gráfico de pizza
  const segmentData = useMemo(() => {
    const segmentCounts = companies.reduce((acc, company) => {
      acc[company.segment] = (acc[company.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(segmentCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [companies]);

  const SEGMENT_COLORS = [
    "#C64752", // Atria Red
    "#312F30", // Atria Dark
    "#4F4D4E", // Lighter shade
    "#E36D76", // Lighter red
    "#757475", // Another gray
    "#FFB8BF", // Very light red
    "#AAAAAA", // Another gray shade
  ];

  const renderPipelineColumn = (
    title: string,
    items: typeof companies,
    status: PipelineStatus
  ) => {
    return (
      <div className="flex flex-col h-full bg-card rounded-lg shadow-sm border">
        <div
          className={`
            p-4 border-b rounded-t-lg flex justify-between items-center
            ${status === "prospect" ? "bg-gray-100" : ""}
            ${status === "agendado" ? "bg-purple-100" : ""}
            ${status === "reunido" ? "bg-yellow-100" : ""}
            ${status === "diligence" ? "bg-blue-100" : ""}
            ${status === "investida" ? "bg-green-100" : ""}
          `}
        >
          <h3 className="font-medium">{title}</h3>
          <div
            className={`
              h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium
              ${status === "prospect" ? "bg-gray-200 text-gray-700" : ""}
              ${status === "agendado" ? "bg-purple-200 text-purple-700" : ""}
              ${status === "reunido" ? "bg-yellow-200 text-yellow-700" : ""}
              ${status === "diligence" ? "bg-blue-200 text-blue-700" : ""}
              ${status === "investida" ? "bg-green-200 text-green-700" : ""}
            `}
          >
            {items.length}
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground p-4">
                Nenhuma empresa
              </div>
            ) : (
              items.map((company) => (
                <div
                  key={company.id}
                  className="p-3 bg-card border rounded hover:shadow-sm cursor-pointer transition-shadow flex justify-between items-center"
                  onClick={() => navigate(`/company/${company.id}`)}
                >
                  <div>
                    <h4 className="font-medium text-sm">{company.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {company.segment}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/company/${company.id}`);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Funil de Operação</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso das empresas no funil de operação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {renderPipelineColumn("Prospects", prospects, "prospect")}
        {renderPipelineColumn("Reuniões Agendadas", scheduled, "agendado")}
        {renderPipelineColumn("Reuniões Feitas", met, "reunido")}
        {renderPipelineColumn("Due Diligence", diligence, "diligence")}
        {renderPipelineColumn("Investidas", invested, "investida")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <DataCard
          title="Taxa de Conversão"
          value={`${prospectToMeetingRate}%`}
          info="Prospects para Reuniões Feitas"
        />
        <DataCard
          title="Taxa de Comparecimento"
          value={`${scheduledToMetRate}%`}
          info="Reuniões Agendadas para Feitas"
        />
        <DataCard
          title="Total de Empresas"
          value={companies.length}
          info="Empresas em todo o funil"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Segmentação de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} empresas`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise do Funil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Prospects</span>
                  <span className="font-medium">{prospects.length}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full"
                    style={{
                      width: `${
                        companies.length > 0
                          ? (prospects.length / companies.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reuniões Agendadas</span>
                  <span className="font-medium">{scheduled.length}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{
                      width: `${
                        companies.length > 0
                          ? (scheduled.length / companies.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reuniões Feitas</span>
                  <span className="font-medium">{met.length}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${
                        companies.length > 0
                          ? (met.length / companies.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Due Diligence</span>
                  <span className="font-medium">{diligence.length}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width: `${
                        companies.length > 0
                          ? (diligence.length / companies.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Investidas</span>
                  <span className="font-medium">{invested.length}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{
                      width: `${
                        companies.length > 0
                          ? (invested.length / companies.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pipeline;
