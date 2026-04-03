export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      emergency_access_requests: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          access_token: string | null
          created_at: string
          denial_token: string | null
          id: string
          otp_code: string
          otp_expires_at: string
          otp_verified: boolean
          owner_user_id: string
          security_verified: boolean
          status: string
          trusted_email: string
          waiting_until: string | null
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          access_token?: string | null
          created_at?: string
          denial_token?: string | null
          id?: string
          otp_code: string
          otp_expires_at: string
          otp_verified?: boolean
          owner_user_id: string
          security_verified?: boolean
          status?: string
          trusted_email: string
          waiting_until?: string | null
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          access_token?: string | null
          created_at?: string
          denial_token?: string | null
          id?: string
          otp_code?: string
          otp_expires_at?: string
          otp_verified?: boolean
          owner_user_id?: string
          security_verified?: boolean
          status?: string
          trusted_email?: string
          waiting_until?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string
          joined_at: string | null
          member_email: string
          member_name: string
          member_user_id: string | null
          owner_user_id: string
          status: string
          updated_at: string
          visible_sections: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string
          joined_at?: string | null
          member_email: string
          member_name: string
          member_user_id?: string | null
          owner_user_id: string
          status?: string
          updated_at?: string
          visible_sections?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string
          joined_at?: string | null
          member_email?: string
          member_name?: string
          member_user_id?: string | null
          owner_user_id?: string
          status?: string
          updated_at?: string
          visible_sections?: string[] | null
        }
        Relationships: []
      }
      passports: {
        Row: {
          administrative_completed: boolean | null
          administrative_data: Json | null
          checklists_completed: boolean | null
          checklists_data: Json | null
          contacts_completed: boolean | null
          contacts_data: Json | null
          created_at: string
          digital_access_completed: boolean | null
          digital_access_data: Json | null
          digital_completed: boolean | null
          digital_data: Json | null
          documents_completed: boolean | null
          documents_data: Json | null
          health_completed: boolean | null
          health_data: Json | null
          id: string
          identity_completed: boolean | null
          identity_data: Json | null
          insurance_completed: boolean | null
          insurance_data: Json | null
          legal_docs_completed: boolean | null
          legal_docs_data: Json | null
          personal_message_completed: boolean | null
          personal_message_data: Json | null
          personal_wishes_completed: boolean | null
          personal_wishes_data: Json | null
          pets_completed: boolean | null
          pets_data: Json | null
          trusted_person_completed: boolean | null
          trusted_person_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          administrative_completed?: boolean | null
          administrative_data?: Json | null
          checklists_completed?: boolean | null
          checklists_data?: Json | null
          contacts_completed?: boolean | null
          contacts_data?: Json | null
          created_at?: string
          digital_access_completed?: boolean | null
          digital_access_data?: Json | null
          digital_completed?: boolean | null
          digital_data?: Json | null
          documents_completed?: boolean | null
          documents_data?: Json | null
          health_completed?: boolean | null
          health_data?: Json | null
          id?: string
          identity_completed?: boolean | null
          identity_data?: Json | null
          insurance_completed?: boolean | null
          insurance_data?: Json | null
          legal_docs_completed?: boolean | null
          legal_docs_data?: Json | null
          personal_message_completed?: boolean | null
          personal_message_data?: Json | null
          personal_wishes_completed?: boolean | null
          personal_wishes_data?: Json | null
          pets_completed?: boolean | null
          pets_data?: Json | null
          trusted_person_completed?: boolean | null
          trusted_person_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          administrative_completed?: boolean | null
          administrative_data?: Json | null
          checklists_completed?: boolean | null
          checklists_data?: Json | null
          contacts_completed?: boolean | null
          contacts_data?: Json | null
          created_at?: string
          digital_access_completed?: boolean | null
          digital_access_data?: Json | null
          digital_completed?: boolean | null
          digital_data?: Json | null
          documents_completed?: boolean | null
          documents_data?: Json | null
          health_completed?: boolean | null
          health_data?: Json | null
          id?: string
          identity_completed?: boolean | null
          identity_data?: Json | null
          insurance_completed?: boolean | null
          insurance_data?: Json | null
          legal_docs_completed?: boolean | null
          legal_docs_data?: Json | null
          personal_message_completed?: boolean | null
          personal_message_data?: Json | null
          personal_wishes_completed?: boolean | null
          personal_wishes_data?: Json | null
          pets_completed?: boolean | null
          pets_data?: Json | null
          trusted_person_completed?: boolean | null
          trusted_person_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          health_consent_given: boolean | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          health_consent_given?: boolean | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          health_consent_given?: boolean | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminder_preferences: {
        Row: {
          created_at: string
          frequency: string
          id: string
          last_reminder_sent_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          last_reminder_sent_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          last_reminder_sent_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trusted_access: {
        Row: {
          created_at: string
          id: string
          security_answer: string | null
          security_code: string | null
          security_method: string
          security_question: string | null
          trusted_email: string
          trusted_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          security_answer?: string | null
          security_code?: string | null
          security_method?: string
          security_question?: string | null
          trusted_email: string
          trusted_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          security_answer?: string | null
          security_code?: string | null
          security_method?: string
          security_question?: string | null
          trusted_email?: string
          trusted_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
