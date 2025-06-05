
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Save, X, Calendar, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedAnalysis {
  id: string;
  title: string;
  content: string;
  analysis_type: string;
  created_at: string;
  updated_at: string;
}

interface SavedAnalysesListProps {
  companyId: string;
}

const SavedAnalysesList: React.FC<SavedAnalysesListProps> = ({ companyId }) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
      toast({
        title: "Erro ao carregar análises",
        description: "Não foi possível carregar as análises salvas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, [companyId]);

  const handleEdit = (analysis: SavedAnalysis) => {
    setEditingId(analysis.id);
    setEditTitle(analysis.title);
    setEditContent(analysis.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .update({
          title: editTitle.trim(),
          content: editContent.trim()
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Análise atualizada",
        description: "A análise foi atualizada com sucesso."
      });

      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      loadAnalyses();
    } catch (error) {
      console.error('Erro ao atualizar análise:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar a análise.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (analysisId: string) => {
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .delete()
        .eq('id', analysisId);

      if (error) throw error;

      toast({
        title: "Análise excluída",
        description: "A análise foi excluída com sucesso."
      });

      loadAnalyses();
    } catch (error) {
      console.error('Erro ao excluir análise:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a análise.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Análises Salvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando análises...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Análises Salvas
        </CardTitle>
        <CardDescription>
          {analyses.length > 0 
            ? `${analyses.length} análise${analyses.length > 1 ? 's' : ''} salva${analyses.length > 1 ? 's' : ''}`
            : "Nenhuma análise salva ainda"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma análise foi salva ainda.</p>
            <p className="text-sm">Use a seção "Análise com IA" para gerar e salvar análises.</p>
          </div>
        ) : (
          analyses.map((analysis) => (
            <Card key={analysis.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingId === analysis.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="font-semibold text-lg mb-2"
                        placeholder="Título da análise"
                      />
                    ) : (
                      <CardTitle className="text-lg">{analysis.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Criado: {formatDate(analysis.created_at)}</span>
                      </div>
                      {analysis.updated_at !== analysis.created_at && (
                        <div className="flex items-center gap-1">
                          <span>Editado: {formatDate(analysis.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingId !== analysis.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(analysis)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a análise "{analysis.title}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(analysis.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingId === analysis.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px]"
                      placeholder="Conteúdo da análise"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {analysis.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SavedAnalysesList;
