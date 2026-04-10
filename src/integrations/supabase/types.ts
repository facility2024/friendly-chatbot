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
      call_access_log: {
        Row: {
          config_id: string
          created_at: string
          device_fingerprint: string
          id: string
        }
        Insert: {
          config_id: string
          created_at?: string
          device_fingerprint: string
          id?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          device_fingerprint?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_access_log_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      call_analytics: {
        Row: {
          config_id: string
          created_at: string
          device_type: string
          duration_seconds: number
          ended_at: string | null
          id: string
          region: string | null
          session_id: string | null
          started_at: string
        }
        Insert: {
          config_id: string
          created_at?: string
          device_type?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          region?: string | null
          session_id?: string | null
          started_at?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          device_type?: string
          duration_seconds?: number
          ended_at?: string | null
          id?: string
          region?: string | null
          session_id?: string | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_analytics_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      call_messages: {
        Row: {
          config_id: string
          created_at: string
          id: string
          message: string
          sender_name: string
        }
        Insert: {
          config_id: string
          created_at?: string
          id?: string
          message: string
          sender_name?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_messages_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "live_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      live_configs: {
        Row: {
          access_mode: string
          banner_image_url: string
          chat_messages_arrival: Json
          chat_messages_engagement: Json
          chat_messages_purchase: Json
          created_at: string
          cta_color_solid: string
          cta_delay_minutes: number
          cta_link: string
          cta_text: string
          cta_text_color: string
          end_timer_enabled: boolean
          end_timer_minutes: number
          ends_at: string | null
          id: string
          name: string
          short_code: string | null
          show_banner: boolean
          started_at: string | null
          subtitle: string
          theme: string
          title: string
          updated_at: string
          user_id: string
          video_type: string
          video_url: string
          viewers_increment: number
          viewers_initial: number
          viewers_interval: number
          viewers_max: number
        }
        Insert: {
          access_mode?: string
          banner_image_url?: string
          chat_messages_arrival?: Json
          chat_messages_engagement?: Json
          chat_messages_purchase?: Json
          created_at?: string
          cta_color_solid?: string
          cta_delay_minutes?: number
          cta_link?: string
          cta_text?: string
          cta_text_color?: string
          end_timer_enabled?: boolean
          end_timer_minutes?: number
          ends_at?: string | null
          id?: string
          name?: string
          short_code?: string | null
          show_banner?: boolean
          started_at?: string | null
          subtitle?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id: string
          video_type?: string
          video_url?: string
          viewers_increment?: number
          viewers_initial?: number
          viewers_interval?: number
          viewers_max?: number
        }
        Update: {
          access_mode?: string
          banner_image_url?: string
          chat_messages_arrival?: Json
          chat_messages_engagement?: Json
          chat_messages_purchase?: Json
          created_at?: string
          cta_color_solid?: string
          cta_delay_minutes?: number
          cta_link?: string
          cta_text?: string
          cta_text_color?: string
          end_timer_enabled?: boolean
          end_timer_minutes?: number
          ends_at?: string | null
          id?: string
          name?: string
          short_code?: string | null
          show_banner?: boolean
          started_at?: string | null
          subtitle?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_type?: string
          video_url?: string
          viewers_increment?: number
          viewers_initial?: number
          viewers_interval?: number
          viewers_max?: number
        }
        Relationships: []
      }
      recipes: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          prep_time: string
          published: boolean
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          prep_time?: string
          published?: boolean
          thumbnail_url?: string
          title: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          prep_time?: string
          published?: boolean
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          created_at: string
          id: string
          maps_link: string
          name: string
          phone: string
          photo_url: string
          published: boolean
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string
          created_at?: string
          id?: string
          maps_link?: string
          name: string
          phone?: string
          photo_url?: string
          published?: boolean
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          maps_link?: string
          name?: string
          phone?: string
          photo_url?: string
          published?: boolean
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      tips_pdf: {
        Row: {
          created_at: string
          description: string
          file_url: string
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          file_url?: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          file_url?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_videos: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          id: string
          published: boolean
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          published?: boolean
          thumbnail_url?: string
          title: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          published?: boolean
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_approved: boolean
          license_expires_at: string | null
          license_starts_at: string | null
          max_lives: number
          name: string
          trial_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          license_expires_at?: string | null
          license_starts_at?: string | null
          max_lives?: number
          name?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          license_expires_at?: string | null
          license_starts_at?: string | null
          max_lives?: number
          name?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      walk_logs: {
        Row: {
          calories: number
          created_at: string
          distance_km: number
          duration_seconds: number
          id: string
          steps: number
          user_id: string
        }
        Insert: {
          calories?: number
          created_at?: string
          distance_km?: number
          duration_seconds?: number
          id?: string
          steps?: number
          user_id: string
        }
        Update: {
          calories?: number
          created_at?: string
          distance_km?: number
          duration_seconds?: number
          id?: string
          steps?: number
          user_id?: string
        }
        Relationships: []
      }
      water_logs: {
        Row: {
          created_at: string
          cups: number
          date: string
          goal_ml: number
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cups?: number
          date?: string
          goal_ml?: number
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cups?: number
          date?: string
          goal_ml?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          source?: string
          status?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: {
        Args: { _caller_id: string; _target_user_id: string }
        Returns: boolean
      }
      cleanup_old_chat_messages: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
