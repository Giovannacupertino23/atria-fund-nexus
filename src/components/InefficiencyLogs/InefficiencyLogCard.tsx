
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { InefficiencyLog } from '@/types/inefficiencyLog';

interface InefficiencyLogCardProps {
  log: InefficiencyLog;
  onEdit: (log: InefficiencyLog) => void;
  onDelete: (logId: string) => void;
  isDeleting: boolean;
}

const InefficiencyLogCard = ({ log, onEdit, onDelete, isDeleting }: InefficiencyLogCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Produto': 'bg-blue-100 text-blue-800',
      'Comercial': 'bg-green-100 text-green-800',
      'Pessoas': 'bg-purple-100 text-purple-800',
      'Finanças': 'bg-red-100 text-red-800',
      'Tecnologia': 'bg-indigo-100 text-indigo-800',
      'Jurídico': 'bg-yellow-100 text-yellow-800',
      'Outro': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      'Baixo': 'bg-green-100 text-green-800',
      'Médio': 'bg-yellow-100 text-yellow-800',
      'Alto': 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Aberto': 'bg-red-100 text-red-800',
      'Em andamento': 'bg-yellow-100 text-yellow-800',
      'Resolvido': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h3 className="text-lg font-semibold text-left">{log.title}</h3>
              </Button>
            </CollapsibleTrigger>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(log)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(log.id)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getCategoryColor(log.category)}>
              {log.category}
            </Badge>
            <Badge className={getImpactColor(log.estimated_impact)}>
              Impacto: {log.estimated_impact}
            </Badge>
            <Badge className={getStatusColor(log.status)}>
              {log.status}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2">
            Identificado em: {format(new Date(log.identified_date), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground">{log.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Ação Recomendada</h4>
                <p className="text-sm text-muted-foreground">{log.recommended_action}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Responsável Interno</h4>
                <p className="text-sm text-muted-foreground">{log.internal_responsible}</p>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Criado em: {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                {log.updated_at !== log.created_at && (
                  <span className="ml-4">
                    Atualizado em: {format(new Date(log.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InefficiencyLogCard;
