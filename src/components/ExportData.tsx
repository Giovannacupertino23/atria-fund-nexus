
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Definição de tipos para os dados exportáveis
export interface ExportableField {
  id: string;
  label: string;
  getValue: (data: any) => string | number | null | undefined;
}

export interface ExportDataProps {
  data: any;
  title?: string;
  description?: string;
  availableFields: ExportableField[];
  filename?: string;
}

export type ExportFormat = 'csv' | 'txt';

const ExportData: React.FC<ExportDataProps> = ({
  data,
  title = "Exportar Dados",
  description = "Selecione os campos e o formato para exportação",
  availableFields,
  filename = "dados_exportados"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { toast } = useToast();

  // Inicializar com todos os campos selecionados quando o modal abre
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedFields(availableFields.map(field => field.id));
    }
    setIsOpen(open);
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map(field => field.id));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const exportToCSV = (data: any, fields: ExportableField[]) => {
    // Criar cabeçalho
    const header = fields.map(field => `"${field.label}"`).join(',');
    
    // Criar linhas de dados
    const rows = [data].map(item => {
      return fields.map(field => {
        const value = field.getValue(item);
        // Tratar valores especiais para CSV
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return `"${value}"`;
      }).join(',');
    }).join('\n');

    // Combinar cabeçalho e linhas
    return header + '\n' + rows;
  };

  const exportToTXT = (data: any, fields: ExportableField[]) => {
    // Criar um texto formatado com quebras de linha
    let result = '';
    
    fields.forEach(field => {
      const value = field.getValue(data);
      const displayValue = value !== null && value !== undefined ? value : 'N/A';
      result += `${field.label}: ${displayValue}\n`;
    });
    
    return result;
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Nenhum campo selecionado",
        description: "Por favor, selecione pelo menos um campo para exportar.",
        variant: "destructive"
      });
      return;
    }

    // Filtrar apenas os campos selecionados
    const fieldsToExport = availableFields.filter(
      field => selectedFields.includes(field.id)
    );

    try {
      let content = '';
      let mimeType = '';
      let fileExtension = '';

      if (selectedFormat === 'csv') {
        content = exportToCSV(data, fieldsToExport);
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        content = exportToTXT(data, fieldsToExport);
        mimeType = 'text/plain';
        fileExtension = 'txt';
      }

      // Criar e baixar o arquivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsOpen(false);
      toast({
        title: "Exportação concluída",
        description: `Dados exportados com sucesso no formato ${selectedFormat.toUpperCase()}`
      });
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-base font-semibold">Formato de Exportação</Label>
              <RadioGroup 
                value={selectedFormat} 
                onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
                className="flex items-center gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="txt" id="txt" />
                  <Label htmlFor="txt" className="flex items-center cursor-pointer">
                    <FileText className="h-4 w-4 mr-1" />
                    TXT
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Campos para Exportação</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllFields}
                  >
                    Selecionar Todos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={deselectAllFields}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <div className="space-y-2 pr-4">
                  {availableFields.map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`field-${field.id}`} 
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <Label 
                        htmlFor={`field-${field.id}`}
                        className="cursor-pointer"
                      >
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleExport}>Exportar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportData;
