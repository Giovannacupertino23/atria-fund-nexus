
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CircleAlert, CircleCheck, ExternalLink, FileText, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/context/CompanyContext";

interface DueDiligenceViewProps {
  dueDiligenceData: {
    financial_link?: string | null;
    financial_analysis?: string | null;
    financial_risk?: RiskLevel | null;
    legal_link?: string | null;
    legal_analysis?: string | null;
    legal_risk?: RiskLevel | null;
    governance_link?: string | null;
    governance_analysis?: string | null;
    governance_risk?: RiskLevel | null;
  };
  onEdit: () => void;
  onEditFinancial: () => void;
  onEditLegal: () => void;
  onEditGovernance: () => void;
}

export default function DueDiligenceView({ 
  dueDiligenceData, 
  onEdit, 
  onEditFinancial,
  onEditLegal,
  onEditGovernance 
}: DueDiligenceViewProps) {
  // Função para renderizar o badge de risco com a cor e ícone corretos
  const RiskBadge = ({ risk }: { risk: string | null | undefined }) => {
    if (!risk) return <Badge variant="outline">Não avaliado</Badge>;
    
    switch (risk) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Alto Risco
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex items-center gap-1">
            <CircleAlert className="h-3 w-3" />
            Médio Risco
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <CircleCheck className="h-3 w-3" />
            Baixo Risco
          </Badge>
        );
      default:
        return <Badge variant="outline">Não avaliado</Badge>;
    }
  };

  // Função para renderizar o bloco de cada due diligence
  const DueDiligenceBlock = ({ 
    title, 
    analysis, 
    link, 
    risk,
    borderColor,
    onEditBlock
  }: { 
    title: string; 
    analysis: string | null | undefined; 
    link: string | null | undefined;
    risk: string | null | undefined;
    borderColor: string;
    onEditBlock: () => void;
  }) => (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <RiskBadge risk={risk} />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEditBlock}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {analysis ? (
          <div className="prose max-w-none text-sm text-gray-700 mt-4">
            <p>{analysis}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Nenhuma análise registrada.</p>
        )}
        
        {link && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm" 
              onClick={() => window.open(link, "_blank")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documentação
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resultado das Análises</h2>
        <Button onClick={onEdit} variant="outline" size="sm">
          Editar Todas as Informações
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DueDiligenceBlock 
          title="Due Diligence Financeira"
          analysis={dueDiligenceData.financial_analysis}
          link={dueDiligenceData.financial_link}
          risk={dueDiligenceData.financial_risk}
          borderColor="border-l-blue-500"
          onEditBlock={onEditFinancial}
        />
        
        <DueDiligenceBlock 
          title="Due Diligence Jurídica"
          analysis={dueDiligenceData.legal_analysis}
          link={dueDiligenceData.legal_link}
          risk={dueDiligenceData.legal_risk}
          borderColor="border-l-purple-500"
          onEditBlock={onEditLegal}
        />
        
        <DueDiligenceBlock 
          title="Due Diligence de Governança"
          analysis={dueDiligenceData.governance_analysis}
          link={dueDiligenceData.governance_link}
          risk={dueDiligenceData.governance_risk}
          borderColor="border-l-emerald-500"
          onEditBlock={onEditGovernance}
        />
      </div>
    </div>
  );
}
