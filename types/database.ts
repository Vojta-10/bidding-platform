export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      auctions: {
        Row: {
          bid_count: number
          created_at: string
          current_price: number
          deadline: string
          description: string
          id: string
          image_url: string | null
          seller_id: string
          starting_price: number
          status: string
          title: string
          winner_id: string | null
        }
        Insert: {
          bid_count?: number
          created_at?: string
          current_price: number
          deadline: string
          description: string
          id?: string
          image_url?: string | null
          seller_id: string
          starting_price: number
          status?: string
          title: string
          winner_id?: string | null
        }
        Update: {
          bid_count?: number
          created_at?: string
          current_price?: number
          deadline?: string
          description?: string
          id?: string
          image_url?: string | null
          seller_id?: string
          starting_price?: number
          status?: string
          title?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'auctions_seller_id_fkey'
            columns: ['seller_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'auctions_winner_id_fkey'
            columns: ['winner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      bids: {
        Row: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at: string
          id: string
        }
        Insert: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          auction_id?: string
          bidder_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bids_auction_id_fkey'
            columns: ['auction_id']
            isOneToOne: false
            referencedRelation: 'auctions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bids_bidder_id_fkey'
            columns: ['bidder_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_expired_auctions: { Args: never; Returns: undefined }
      place_bid: {
        Args: { p_amount: number; p_auction_id: string; p_bidder_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ─── Auction status ──────────────────────────────────────────────────────────

export type AuctionStatus = 'active' | 'closed'

// ─── Row interfaces ──────────────────────────────────────────────────────────

export interface Profile {
  id: string               // uuid — references auth.users.id
  username: string
  avatar_url: string | null
  created_at: string       // timestamptz as ISO-8601 string
}

export interface Auction {
  id: string               // uuid
  seller_id: string        // uuid — references profiles.id
  title: string            // 3–200 chars
  description: string      // min 10 chars
  image_url: string | null
  starting_price: number   // numeric, > 0
  current_price: number    // numeric
  deadline: string         // timestamptz as ISO-8601 string
  status: AuctionStatus    // check: 'active' | 'closed'
  winner_id: string | null // uuid — references profiles.id
  bid_count: number        // int4, default 0
  created_at: string       // timestamptz as ISO-8601 string
}

export interface Bid {
  id: string               // uuid
  auction_id: string       // uuid — references auctions.id
  bidder_id: string        // uuid — references profiles.id
  amount: number           // numeric, > 0
  created_at: string       // timestamptz as ISO-8601 string
}

// ─── Insert / Update helpers ─────────────────────────────────────────────────

export type AuctionInsert = TablesInsert<'auctions'>
export type AuctionUpdate = TablesUpdate<'auctions'>
export type BidInsert = TablesInsert<'bids'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

// ─── place_bid RPC return type ───────────────────────────────────────────────

export interface PlaceBidResult {
  success: boolean
  bid_id: string
  new_price: number
  error?: string
}
