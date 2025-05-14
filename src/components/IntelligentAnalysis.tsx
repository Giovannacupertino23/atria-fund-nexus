
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ExportData, { ExportableField } from './ExportData';

interface IntelligentAnalysisProps {
  companyId: string;
  initialAnalysis: string | null;
  onUpdate: () => void;
  companyData?: any; // Dados completos da empresa para exportação
}

const IntelligentAnalysis: React.FC<IntelligentAnalysisProps> = ({
  companyId,
  initialAnalysis,
  onUpdate,
  companyData = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState(initialAnalysis || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({ intelligent_analysis: analysis })
        .eq('id', companyId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Análise salva",
        description: "A análise inteligente foi salva com sucesso."
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a análise. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Definir os campos exportáveis
  const exportableFields: ExportableField[] = [
    {
      id: 'name',
      label: 'Nome da Empresa',
      getValue: (data) => data.name || ''
    },
    {
      id: 'sector',
      label: 'Setor',
      getValue: (data) => data.sector || ''
    },
    {
      id: 'final_score',
      label: 'Nota Final',
      getValue: (data) => data.final_score !== undefined ? data.final_score.toFixed(1) : 'N/A'
    },
    {
      id: 'status',
      label: 'Status',
      getValue: (data) => {
        switch (data.status) {
          case "approved": return "Aprovada";
          case "evaluating": return "Em Avaliação";
          case "not_approved": return "Não Aprovada";
          default: return "Em Avaliação";
        }
      }
    },
    {
      id: 'market_cap',
      label: 'Market Cap',
      getValue: (data) => {
        if (data.market_cap === null || data.market_cap === undefined) return 'N/A';
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.market_cap);
      }
    },
    {
      id: 'annual_revenue',
      label: 'Receita Anual (2024)',
      getValue: (data) => {
        if (data.annual_revenue_2024 === null || data.annual_revenue_2024 === undefined) return 'N/A';
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.annual_revenue_2024);
      }
    },
    {
      id: 'ebitda_avg',
      label: 'EBITDA Médio',
      getValue: (data) => {
        const values = [data.ebitda_2023, data.ebitda_2024, data.ebitda_2025];
        const validValues = values.filter(v => v !== null && v !== undefined);
        if (validValues.length === 0) return 'N/A';
        const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
        return `${avg.toFixed(1)}%`;
      }
    },
    {
      id: 'yoy_avg',
      label: 'Crescimento YoY Médio',
      getValue: (data) => {
        const values = [data.yoy_growth_21_22, data.yoy_growth_22_23, data.yoy_growth_23_24];
        const validValues = values.filter(v => v !== null && v !== undefined);
        if (validValues.length === 0) return 'N/A';
        const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
        return `${avg.toFixed(1)}%`;
      }
    },
    {
      id: 'leverage',
      label: 'Alavancagem',
      getValue: (data) => data.leverage !== null && data.leverage !== undefined ? `${data.leverage}%` : 'N/A'
    },
    {
      id: 'financial_risk',
      label: 'Risco Financeiro',
      getValue: (data) => data.financial_risk || 'N/A'
    },
    {
      id: 'legal_risk',
      label: 'Risco Jurídico',
      getValue: (data) => data.legal_risk || 'N/A'
    },
    {
      id: 'governance_risk',
      label: 'Risco de Governança',
      getValue: (data) => data.governance_risk || 'N/A'
    },
    {
      id: 'intelligent_analysis',
      label: 'Análise Inteligente',
      getValue: (data) => data.intelligent_analysis || 'N/A'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Análise Inteligente</CardTitle>
          <CardDescription>
            Análise integrada de dados e insights para a empresa
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {Object.keys(companyData).length > 0 && (
            <ExportData 
              data={companyData}
              availableFields={exportableFields}
              title="Exportar Relatório de Análise"
              description="Selecione os campos e o formato para exportação do relatório"
              filename={`analise_${companyData.name ? companyData.name.replace(/\s+/g, '_').toLowerCase() : 'empresa'}`}
            />
          )}
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder="Digite a análise inteligente da empresa aqui..."
            className="min-h-[200px]"
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            {analysis ? (
              <p className="whitespace-pre-wrap">{analysis}</p>
            ) : (
              <p className="text-muted-foreground italic">
                Nenhuma análise inteligente registrada para esta empresa.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentAnalysis;
