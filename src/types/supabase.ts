export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string | null }
        Insert: { id?: string; email?: string | null }
        Update: { id?: string; email?: string | null }
        Relationships: []
      }
      user_credentials: {
        Row: {
          user_id: string
          provider: string
          encrypted_password: string
        }
        Insert: {
          user_id: string
          provider: string
          encrypted_password: string
        }
        Update: {
          user_id?: string
          provider?: string
          encrypted_password?: string
        }
        Relationships: []
      }
    }
    Views: object
    Functions: object
    Enums: object
    CompositeTypes: object
  }
}
