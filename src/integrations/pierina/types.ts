// Types for the pierina-archive-transfer backend (foubruudcsrbfucuavob).
// Hand-maintained because the auto-generated src/integrations/supabase/types.ts
// is bound to the original Lovable Cloud project. Do not edit that file.

export type PierinaDatabase = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          featured_image: string | null
          published_at: string | null
          wp_id: number | null
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          published_at?: string | null
          wp_id?: number | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["posts"]["Insert"]>
      }
      books: {
        Row: {
          id: string
          title: string
          year: number | null
          price: number | null
          description: string | null
          buy_url: string | null
          youtube_id: string | null
          type: string | null
          cover_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          year?: number | null
          price?: number | null
          description?: string | null
          buy_url?: string | null
          youtube_id?: string | null
          type?: string | null
          cover_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["books"]["Insert"]>
      }
      fiabe_tracks: {
        Row: {
          id: string
          collection_id: string | null
          title: string
          mp3_url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          collection_id?: string | null
          title: string
          mp3_url: string
          sort_order?: number
          created_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["fiabe_tracks"]["Insert"]>
      }
      poems: {
        Row: {
          id: string
          title: string
          slug: string
          content_friulian: string | null
          content_italian: string | null
          written_at: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content_friulian?: string | null
          content_italian?: string | null
          written_at?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["poems"]["Insert"]>
      }
      gallery_photos: {
        Row: {
          id: string
          title: string | null
          image_url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          image_url: string
          sort_order?: number
          created_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["gallery_photos"]["Insert"]>
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          created_at?: string
        }
        Update: Partial<PierinaDatabase["public"]["Tables"]["contact_messages"]["Insert"]>
      }
      newsletter_subscribers: {
        Row: { id: string; email: string; created_at: string }
        Insert: { id?: string; email: string; created_at?: string }
        Update: Partial<PierinaDatabase["public"]["Tables"]["newsletter_subscribers"]["Insert"]>
      }
      site_visits: {
        Row: { id: string; path: string | null; created_at: string }
        Insert: { id?: string; path?: string | null; created_at?: string }
        Update: Partial<PierinaDatabase["public"]["Tables"]["site_visits"]["Insert"]>
      }
    }
  }
}
