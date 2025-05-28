
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InefficiencyLog, CreateInefficiencyLog, UpdateInefficiencyLog } from '@/types/inefficiencyLog';
import { useToast } from '@/hooks/use-toast';

export const useInefficiencyLogs = (companyId: string) => {
  const [logs, setLogs] = useState<InefficiencyLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const { toast } = useToast();

  const loadLogs = useCallback(async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading inefficiency logs:', error);
      toast({
        title: "Erro ao carregar logs",
        description: "Não foi possível carregar os logs de ineficiência.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [companyId, toast]);

  const createLog = async (logData: CreateInefficiencyLog) => {
    setIsLoadingAction(true);
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      
      setLogs(prev => [data, ...prev]);
      toast({
        title: "Log criado",
        description: "Log de ineficiência criado com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error creating inefficiency log:', error);
      toast({
        title: "Erro ao criar log",
        description: "Não foi possível criar o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoadingAction(false);
    }
  };

  const updateLog = async (logId: string, updates: UpdateInefficiencyLog) => {
    setIsLoadingAction(true);
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .update(updates)
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;
      
      setLogs(prev => prev.map(log => log.id === logId ? data : log));
      toast({
        title: "Log atualizado",
        description: "Log de ineficiência atualizado com sucesso."
      });
      
      return data;
    } catch (error) {
      console.error('Error updating inefficiency log:', error);
      toast({
        title: "Erro ao atualizar log",
        description: "Não foi possível atualizar o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoadingAction(false);
    }
  };

  const deleteLog = async (logId: string) => {
    setIsLoadingAction(true);
    try {
      const { error } = await supabase
        .from('inefficiency_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      setLogs(prev => prev.filter(log => log.id !== logId));
      toast({
        title: "Log excluído",
        description: "Log de ineficiência excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting inefficiency log:', error);
      toast({
        title: "Erro ao excluir log",
        description: "Não foi possível excluir o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoadingAction(false);
    }
  };

  const exportToCsv = () => {
    if (logs.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há logs de ineficiência para exportar.",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Título',
      'Descrição', 
      'Categoria',
      'Data de Identificação',
      'Impacto Estimado',
      'Ação Recomendada',
      'Status',
      'Responsável Interno',
      'Data de Criação'
    ];

    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        `"${log.title}"`,
        `"${log.description}"`,
        `"${log.category}"`,
        `"${new Date(log.identified_date).toLocaleDateString('pt-BR')}"`,
        `"${log.estimated_impact}"`,
        `"${log.recommended_action}"`,
        `"${log.status}"`,
        `"${log.internal_responsible}"`,
        `"${new Date(log.created_at).toLocaleDateString('pt-BR')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs-ineficiencia-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os logs foram exportados para CSV com sucesso."
    });
  };

  return {
    logs,
    isLoading,
    isLoadingAction,
    loadLogs,
    createLog,
    updateLog,
    deleteLog,
    exportToCsv
  };
};
