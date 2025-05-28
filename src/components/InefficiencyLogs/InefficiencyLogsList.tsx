
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Download, FileText } from 'lucide-react';
import { useInefficiencyLogs } from '@/hooks/useInefficiencyLogs';
import { InefficiencyLog, CreateInefficiencyLog } from '@/types/inefficiencyLog';
import InefficiencyLogForm from './InefficiencyLogForm';
import InefficiencyLogCard from './InefficiencyLogCard';

interface InefficiencyLogsListProps {
  companyId: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const InefficiencyLogsList = ({ companyId, isVisible, onToggleVisibility }: InefficiencyLogsListProps) => {
  const {
    logs,
    isLoading,
    isLoadingAction,
    loadLogs,
    createLog,
    updateLog,
    deleteLog,
    exportToCsv
  } = useInefficiencyLogs(companyId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<InefficiencyLog | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  const handleLoadLogs = async () => {
    if (!isVisible) {
      await loadLogs();
      onToggleVisibility();
    } else {
      onToggleVisibility();
    }
  };

  const handleCreateLog = async (data: CreateInefficiencyLog) => {
    try {
      await createLog(data);
      setIsFormOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleUpdateLog = async (data: Partial<InefficiencyLog>) => {
    if (!editingLog) return;
    
    try {
      await updateLog(editingLog.id, data);
      setEditingLog(null);
      setIsFormOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteLog(logId);
      setDeletingLogId(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEditLog = (log: InefficiencyLog) => {
    setEditingLog(log);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingLog(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs de Ineficiência
              </CardTitle>
              <CardDescription>
                Registre e acompanhe problemas identificados na empresa
              </CardDescription>
            </div>
            <Button onClick={handleLoadLogs} variant="outline">
              {isVisible ? 'Ocultar logs' : 'Ver logs de ineficiência'}
            </Button>
          </div>
        </CardHeader>

        {isVisible && (
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Carregando logs...</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {logs.length} {logs.length === 1 ? 'log encontrado' : 'logs encontrados'}
                  </div>
                  <div className="flex gap-2">
                    {logs.length > 0 && (
                      <Button variant="outline" size="sm" onClick={exportToCsv}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar CSV
                      </Button>
                    )}
                    <Button size="sm" onClick={() => setIsFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Log
                    </Button>
                  </div>
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando o primeiro log de ineficiência para esta empresa.
                    </p>
                    <Button onClick={() => setIsFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar primeiro log
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <InefficiencyLogCard
                        key={log.id}
                        log={log}
                        onEdit={handleEditLog}
                        onDelete={(logId) => setDeletingLogId(logId)}
                        isDeleting={isLoadingAction}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <InefficiencyLogForm
            companyId={companyId}
            initialData={editingLog || undefined}
            onSubmit={editingLog ? handleUpdateLog : handleCreateLog}
            onCancel={handleCancelForm}
            isSubmitting={isLoadingAction}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingLogId} onOpenChange={() => setDeletingLogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este log de ineficiência? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLogId && handleDeleteLog(deletingLogId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InefficiencyLogsList;
