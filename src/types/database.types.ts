export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock: number
          category: string | null
          image_url: string | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock?: number
          category?: string | null
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          category?: string | null
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
        }
      }
    }
  }
}
