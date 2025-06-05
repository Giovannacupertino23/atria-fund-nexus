
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, Save, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAnalysisProps {
  companyData: any;
  companyId: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({
  companyData,
  companyId
}) => {
  const [response, setResponse] = useState('');
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSendToWebhook = async () => {
    setIsSendingToWebhook(true);
    try {
      // Coletar todas as informações da empresa
      const allCompanyData = {
        ...companyData
      };
      console.log('Enviando dados para webhook:', allCompanyData);

      // Chamar a edge function que fará a integração com o webhook
      const { data, error } = await supabase.functions.invoke('webhook-integration', {
        body: {
          companyId: companyId,
          companyData: allCompanyData
        }
      });

      if (error) throw error;

      // Exibir a resposta no campo de texto
      if (data && data.webhookResponse) {
        setResponse(data.webhookResponse);
      }

      toast({
        title: "Análise concluída",
        description: "A análise foi processada e a resposta foi salva."
      });

      console.log('Resposta do webhook salva:', data);
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Erro ao processar análise",
        description: "Ocorreu um erro ao processar a análise.",
        variant: "destructive"
      });
    } finally {
      setIsSendingToWebhook(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!response.trim()) {
      toast({
        title: "Nada para salvar",
        description: "Não há análise para salvar.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({ intelligent_analysis: response })
        .eq('id', companyId);
      
      if (error) throw error;
      
      toast({
        title: "Análise salva",
        description: "A análise inteligente foi salva com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a análise.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportAnalysis = () => {
    if (!response.trim()) {
      toast({
        title: "Nada para exportar",
        description: "Não há análise para exportar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Criar conteúdo do arquivo
      const content = `ANÁLISE INTELIGENTE - ${companyData.name || 'Empresa'}\n` +
                     `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
                     `${'-'.repeat(50)}\n\n` +
                     response;

      // Criar e baixar o arquivo
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const fileName = `analise_ia_${companyData.name ? companyData.name.replace(/\s+/g, '_').toLowerCase() : 'empresa'}_${new Date().toISOString().split('T')[0]}.txt`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: "A análise foi exportada com sucesso."
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar a análise.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Análise Inteligente com IA
        </CardTitle>
        <CardDescription>
          Clique em analisar e receba análises contextualizadas baseadas em IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSendToWebhook} 
          disabled={isSendingToWebhook} 
          className="w-full"
        >
          {isSendingToWebhook ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analisar
            </>
          )}
        </Button>

        <div className="space-y-2">
          <Textarea
            placeholder="A resposta da análise aparecerá aqui..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[200px]"
            readOnly={false}
          />
        </div>

        {response.trim() && (
          <div className="flex gap-2">
            <Button
              onClick={handleSaveAnalysis}
              disabled={isSaving}
              variant="outline"
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Análise
                </>
              )}
            </Button>

            <Button
              onClick={handleExportAnalysis}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Análise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;
