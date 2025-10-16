export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badge_definitions: {
        Row: {
          condition_type: Json
          description: string
          id: string
          name: string
        }
        Insert: {
          condition_type: Json
          description: string
          id?: string
          name: string
        }
        Update: {
          condition_type?: Json
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          completed_days: number
          id: string
          is_progress: boolean
          is_successful: boolean | null
          required_success_rate: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_days: number
          id?: string
          is_progress?: boolean
          is_successful?: boolean | null
          required_success_rate: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_days?: number
          id?: string
          is_progress?: boolean
          is_successful?: boolean | null
          required_success_rate?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_records: {
        Row: {
          challenge_id: string
          comment_count: number
          content: string | null
          created_at: string
          id: string
          image_urls: string[] | null
          like_count: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          comment_count?: number
          content?: string | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          like_count?: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          comment_count?: number
          content?: string | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          like_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_record_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_record_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_wishlist: {
        Row: {
          challenge_id: string
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_wishlist_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string
          created_by_id: string | null
          description: string
          end_at: string
          id: string
          is_finished: boolean
          is_public: boolean
          participants_count: number
          start_at: string
          success_threshold_percent: number | null
          tags: string[] | null
          thumbnail: string
          title: string
          uploading_type: string
        }
        Insert: {
          category?: string
          created_by_id?: string | null
          description?: string
          end_at: string
          id?: string
          is_finished?: boolean
          is_public?: boolean
          participants_count?: number
          start_at?: string
          success_threshold_percent?: number | null
          tags?: string[] | null
          thumbnail?: string
          title?: string
          uploading_type?: string
        }
        Update: {
          category?: string
          created_by_id?: string | null
          description?: string
          end_at?: string
          id?: string
          is_finished?: boolean
          is_public?: boolean
          participants_count?: number
          start_at?: string
          success_threshold_percent?: number | null
          tags?: string[] | null
          thumbnail?: string
          title?: string
          uploading_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      record_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          record_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          record_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          record_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "record_comment_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "challenge_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "record_comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      record_likes: {
        Row: {
          id: string
          record_id: string
          user_id: string
        }
        Insert: {
          id?: string
          record_id: string
          user_id: string
        }
        Update: {
          id?: string
          record_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "record_like_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "challenge_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "record_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          challenge_id: string | null
          id: string
          record_comment_id: string | null
          record_id: string | null
          report_reason: string
          reporter_id: string
        }
        Insert: {
          challenge_id?: string | null
          id?: string
          record_comment_id?: string | null
          record_id?: string | null
          report_reason: string
          reporter_id: string
        }
        Update: {
          challenge_id?: string | null
          id?: string
          record_comment_id?: string | null
          record_id?: string | null
          report_reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_record_comment_id_fkey"
            columns: ["record_comment_id"]
            isOneToOne: false
            referencedRelation: "record_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "challenge_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          email: string
          id: string
          is_public: boolean
          profile_image: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          email: string
          id?: string
          is_public?: boolean
          profile_image?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          email?: string
          id?: string
          is_public?: boolean
          profile_image?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      get_user_public_profile: {
        Args: { target_user_id: string }
        Returns: {
          bio: string
          id: string
          is_public: boolean
          profile_image: string
          username: string
        }[]
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
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
