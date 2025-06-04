
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InefficiencyLog, CreateInefficiencyLog, UpdateInefficiencyLog } from '@/types/inefficiencyLog';
import { useToast } from '@/hooks/use-toast';

export const useInefficiencyLogs = (companyId: string) => {
  const [logs, setLogs] = useState<InefficiencyLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion para garantir que os dados estão no formato correto
      setLogs(data as InefficiencyLog[]);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast({
        title: "Erro ao carregar logs",
        description: "Não foi possível carregar os logs de ineficiência.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createLog = async (logData: CreateInefficiencyLog) => {
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => [data as InefficiencyLog, ...prev]);
      
      toast({
        title: "Log criado",
        description: "Log de ineficiência criado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      toast({
        title: "Erro ao criar log",
        description: "Não foi possível criar o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateLog = async (id: string, updates: UpdateInefficiencyLog) => {
    try {
      const { data, error } = await supabase
        .from('inefficiency_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => prev.map(log => 
        log.id === id ? { ...log, ...data } as InefficiencyLog : log
      ));

      toast({
        title: "Log atualizado",
        description: "Log de ineficiência atualizado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar log:', error);
      toast({
        title: "Erro ao atualizar log",
        description: "Não foi possível atualizar o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inefficiency_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLogs(prev => prev.filter(log => log.id !== id));

      toast({
        title: "Log excluído",
        description: "Log de ineficiência excluído com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir log:', error);
      toast({
        title: "Erro ao excluir log",
        description: "Não foi possível excluir o log de ineficiência.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [companyId]);

  return {
    logs,
    isLoading,
    createLog,
    updateLog,
    deleteLog,
    refetch: fetchLogs
  };
};
