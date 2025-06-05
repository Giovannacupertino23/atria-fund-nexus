
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, Save, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SavedAnalysesList from "./SavedAnalysesList";

interface AIAnalysisProps {
  companyData: any;
  companyId: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({
  companyData,
  companyId
}) => {
  const [response, setResponse] = useState('');
  const [analysisTitle, setAnalysisTitle] = useState('');
  const [isSendingToWebhook, setIsSendingToWebhook] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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
        // Sugerir um título automático baseado na data
        const now = new Date();
        const defaultTitle = `Análise IA - ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        setAnalysisTitle(defaultTitle);
      }

      toast({
        title: "Análise concluída",
        description: "A análise foi processada e a resposta foi gerada."
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

  const handleSaveToList = async () => {
    if (!response.trim()) {
      toast({
        title: "Nada para salvar",
        description: "Não há análise para salvar.",
        variant: "destructive"
      });
      return;
    }

    if (!analysisTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe um título para a análise.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Salvando análise para empresa:', companyId);
      console.log('Título:', analysisTitle.trim());
      console.log('Conteúdo:', response.trim());

      const { data, error } = await supabase
        .from('saved_analyses')
        .insert({
          company_id: companyId,
          title: analysisTitle.trim(),
          content: response.trim(),
          analysis_type: 'ai_analysis'
        })
        .select();
      
      if (error) {
        console.error('Erro ao salvar análise:', error);
        throw error;
      }
      
      console.log('Análise salva com sucesso:', data);
      
      toast({
        title: "Análise salva",
        description: "A análise foi salva na lista de análises."
      });

      // Limpar o formulário
      setResponse('');
      setAnalysisTitle('');
      setShowSaveForm(false);
      
      // Forçar atualização da lista
      setRefreshTrigger(prev => prev + 1);
      
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
      const title = analysisTitle.trim() || 'Análise IA';
      const content = `${title.toUpperCase()}\n` +
                     `Empresa: ${companyData.name || 'Empresa'}\n` +
                     `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
                     `${'-'.repeat(50)}\n\n` +
                     response;

      // Criar e baixar o arquivo
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${companyData.name ? companyData.name.replace(/\s+/g, '_').toLowerCase() : 'empresa'}_${new Date().toISOString().split('T')[0]}.txt`;
      
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Nova Análise com IA
          </CardTitle>
          <CardDescription>
            Gere uma nova análise contextualizada baseada em IA
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
                Gerar Nova Análise
              </>
            )}
          </Button>

          {response.trim() && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Análise Gerada:</label>
                <Textarea
                  placeholder="A resposta da análise aparecerá aqui..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {showSaveForm && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título da Análise:</label>
                  <Input
                    placeholder="Digite um título para identificar esta análise"
                    value={analysisTitle}
                    onChange={(e) => setAnalysisTitle(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-2">
                {!showSaveForm ? (
                  <Button
                    onClick={() => setShowSaveForm(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Salvar na Lista
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowSaveForm(false)}
                      variant="outline"
                      className="flex-1"
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveToList}
                      disabled={isSaving}
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
                          Confirmar Salvamento
                        </>
                      )}
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleExportAnalysis}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <SavedAnalysesList companyId={companyId} key={refreshTrigger} />
    </div>
  );
};

export default AIAnalysis;
