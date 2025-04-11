export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          password_hash: string
          last_login: string | null
          email_verified: boolean
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          password_hash: string
          last_login?: string | null
          email_verified?: boolean
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          password_hash?: string
          last_login?: string | null
          email_verified?: boolean
          active?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          bio: string | null
          role: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          user_agent: string | null
          ip_address: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          expires_at?: string
        }
      }
      password_reset_tokens: {
        Row: {
          id: string
          created_at: string
          expires_at: string
          user_id: string
          token: string
          is_used: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          expires_at: string
          user_id: string
          token: string
          is_used?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          expires_at?: string
          user_id?: string
          token?: string
          is_used?: boolean
        }
      }
      verification_tokens: {
        Row: {
          id: string
          created_at: string
          expires_at: string
          user_id: string
          token: string
          is_used: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          expires_at: string
          user_id: string
          token: string
          is_used?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          expires_at?: string
          user_id?: string
          token?: string
          is_used?: boolean
        }
      }
      migrations: {
        Row: {
          id: number
          name: string
          applied_at: string
        }
        Insert: {
          id?: number
          name: string
          applied_at?: string
        }
        Update: {
          id?: number
          name?: string
          applied_at?: string
        }
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
  }
}
