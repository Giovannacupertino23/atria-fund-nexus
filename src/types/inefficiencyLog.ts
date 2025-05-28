
export interface InefficiencyLog {
  id: string;
  company_id: string;
  title: string;
  description: string;
  category: 'Produto' | 'Comercial' | 'Pessoas' | 'Finanças' | 'Tecnologia' | 'Jurídico' | 'Operação' | 'Outro';
  identified_date: string;
  estimated_impact: 'Baixo' | 'Médio' | 'Alto';
  recommended_action: string;
  status: 'Aberto' | 'Em andamento' | 'Resolvido';
  internal_responsible: string;
  created_at: string;
  updated_at: string;
}

export type CreateInefficiencyLog = Omit<InefficiencyLog, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInefficiencyLog = Partial<Omit<InefficiencyLog, 'id' | 'company_id' | 'created_at' | 'updated_at'>>;
