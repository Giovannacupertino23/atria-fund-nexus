export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          about: string | null
          annual_revenue_2024: number | null
          average_ticket: number | null
          cac: number | null
          cash_flow: string | null
          cnpj: string
          created_at: string | null
          dividend_distribution: boolean | null
          ebitda_2023: number | null
          ebitda_2024: number | null
          ebitda_2025: number | null
          final_score: number | null
          financial_analysis: string | null
          financial_link: string | null
          financial_risk: string | null
          governance_analysis: string | null
          governance_link: string | null
          governance_risk: string | null
          id: string
          intelligent_analysis: string | null
          legal_analysis: string | null
          legal_link: string | null
          legal_risk: string | null
          leverage: number | null
          market_cap: number | null
          name: string
          net_margin_2024: number | null
          pipeline_status: string | null
          responsible: string | null
          risk_factors: string | null
          score_color: string | null
          sector: string
          status: string | null
          updated_at: string | null
          valuation: number | null
          website: string | null
          yoy_growth_21_22: number | null
          yoy_growth_22_23: number | null
          yoy_growth_23_24: number | null
        }
        Insert: {
          about?: string | null
          annual_revenue_2024?: number | null
          average_ticket?: number | null
          cac?: number | null
          cash_flow?: string | null
          cnpj: string
          created_at?: string | null
          dividend_distribution?: boolean | null
          ebitda_2023?: number | null
          ebitda_2024?: number | null
          ebitda_2025?: number | null
          final_score?: number | null
          financial_analysis?: string | null
          financial_link?: string | null
          financial_risk?: string | null
          governance_analysis?: string | null
          governance_link?: string | null
          governance_risk?: string | null
          id?: string
          intelligent_analysis?: string | null
          legal_analysis?: string | null
          legal_link?: string | null
          legal_risk?: string | null
          leverage?: number | null
          market_cap?: number | null
          name: string
          net_margin_2024?: number | null
          pipeline_status?: string | null
          responsible?: string | null
          risk_factors?: string | null
          score_color?: string | null
          sector: string
          status?: string | null
          updated_at?: string | null
          valuation?: number | null
          website?: string | null
          yoy_growth_21_22?: number | null
          yoy_growth_22_23?: number | null
          yoy_growth_23_24?: number | null
        }
        Update: {
          about?: string | null
          annual_revenue_2024?: number | null
          average_ticket?: number | null
          cac?: number | null
          cash_flow?: string | null
          cnpj?: string
          created_at?: string | null
          dividend_distribution?: boolean | null
          ebitda_2023?: number | null
          ebitda_2024?: number | null
          ebitda_2025?: number | null
          final_score?: number | null
          financial_analysis?: string | null
          financial_link?: string | null
          financial_risk?: string | null
          governance_analysis?: string | null
          governance_link?: string | null
          governance_risk?: string | null
          id?: string
          intelligent_analysis?: string | null
          legal_analysis?: string | null
          legal_link?: string | null
          legal_risk?: string | null
          leverage?: number | null
          market_cap?: number | null
          name?: string
          net_margin_2024?: number | null
          pipeline_status?: string | null
          responsible?: string | null
          risk_factors?: string | null
          score_color?: string | null
          sector?: string
          status?: string | null
          updated_at?: string | null
          valuation?: number | null
          website?: string | null
          yoy_growth_21_22?: number | null
          yoy_growth_22_23?: number | null
          yoy_growth_23_24?: number | null
        }
        Relationships: []
      }
      inefficiency_logs: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string
          estimated_impact: string
          id: string
          identified_date: string
          internal_responsible: string
          recommended_action: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          description: string
          estimated_impact: string
          id?: string
          identified_date: string
          internal_responsible: string
          recommended_action: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          estimated_impact?: string
          id?: string
          identified_date?: string
          internal_responsible?: string
          recommended_action?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inefficiency_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_analyses: {
        Row: {
          analysis_type: string
          company_id: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          analysis_type?: string
          company_id: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          analysis_type?: string
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_saved_analyses_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_responses: {
        Row: {
          company_id: string
          created_at: string
          id: string
          request_data: Json
          response_data: string | null
          response_status: number | null
          status: string
          updated_at: string
          webhook_url: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          request_data: Json
          response_data?: string | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_url: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          request_data?: Json
          response_data?: string | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
