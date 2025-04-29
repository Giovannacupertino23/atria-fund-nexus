
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany, Company, PipelineStatus } from "@/context/CompanyContext";
import { Loader2 } from "lucide-react";

const Pipeline = () => {
  const { companies, isLoading } = useCompany();
  const navigate = useNavigate();
  
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
      )}
    </div>
  );
};

export default Pipeline;
