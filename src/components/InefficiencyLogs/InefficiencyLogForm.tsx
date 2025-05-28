
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateInefficiencyLog, InefficiencyLog } from '@/types/inefficiencyLog';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.enum(['Produto', 'Comercial', 'Pessoas', 'Finanças', 'Tecnologia', 'Jurídico', 'Outro']),
  identified_date: z.string().min(1, 'Data de identificação é obrigatória'),
  estimated_impact: z.enum(['Baixo', 'Médio', 'Alto']),
  recommended_action: z.string().min(1, 'Ação recomendada é obrigatória'),
  status: z.enum(['Aberto', 'Em andamento', 'Resolvido']),
  internal_responsible: z.string().email('E-mail válido é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

interface InefficiencyLogFormProps {
  companyId: string;
  initialData?: InefficiencyLog;
  onSubmit: (data: CreateInefficiencyLog | Partial<InefficiencyLog>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const InefficiencyLogForm = ({ 
  companyId, 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: InefficiencyLogFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'Outro',
      identified_date: initialData?.identified_date || format(new Date(), 'yyyy-MM-dd'),
      estimated_impact: initialData?.estimated_impact || 'Baixo',
      recommended_action: initialData?.recommended_action || '',
      status: initialData?.status || 'Aberto',
      internal_responsible: initialData?.internal_responsible || '',
    },
  });

  const handleSubmit = async (values: FormData) => {
    const submitData = initialData 
      ? values 
      : { ...values, company_id: companyId };
    await onSubmit(submitData);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Produto': 'text-blue-600',
      'Comercial': 'text-green-600',
      'Pessoas': 'text-purple-600',
      'Finanças': 'text-red-600',
      'Tecnologia': 'text-indigo-600',
      'Jurídico': 'text-yellow-600',
      'Outro': 'text-gray-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      'Baixo': 'text-green-600',
      'Médio': 'text-yellow-600',
      'Alto': 'text-red-600'
    };
    return colors[impact as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Aberto': 'text-red-600',
      'Em andamento': 'text-yellow-600',
      'Resolvido': 'text-green-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {initialData ? 'Editar Log de Ineficiência' : 'Novo Log de Ineficiência'}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Problema</FormLabel>
                <FormControl>
                  <Input placeholder="Título curto do problema identificado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva detalhadamente o problema identificado..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Produto">Produto</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Pessoas">Pessoas</SelectItem>
                      <SelectItem value="Finanças">Finanças</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Jurídico">Jurídico</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identified_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da Identificação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="estimated_impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impacto Estimado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o impacto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Baixo">Baixo</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aberto">Aberto</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Resolvido">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="recommended_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ação Recomendada</FormLabel>
                <FormControl>
                  <Input placeholder="Ação recomendada para resolver o problema" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internal_responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável Interno</FormLabel>
                <FormControl>
                  <Input placeholder="email@empresa.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar' : 'Criar Log')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default InefficiencyLogForm;
