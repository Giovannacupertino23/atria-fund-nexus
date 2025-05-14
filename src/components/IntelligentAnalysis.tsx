
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface IntelligentAnalysisProps {
  companyId: string;
  initialAnalysis: string | null;
  onUpdate: () => void;
}

const IntelligentAnalysis: React.FC<IntelligentAnalysisProps> = ({
  companyId,
  initialAnalysis,
  onUpdate
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Análise Inteligente</CardTitle>
          <CardDescription>
            Análise integrada de dados e insights para a empresa
          </CardDescription>
        </div>
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
