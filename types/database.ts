// types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          type: "checking" | "savings";
          balance: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "checking" | "savings";
          balance?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          balance?: number;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          amount: number;
          category: string;
          description: string | null;
          type: "credit" | "debit";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          amount: number;
          category: string;
          description?: string | null;
          type: "credit" | "debit";
          created_at?: string;
        };
        Update: never;
      };
      savings: {
        Row: {
          id: string;
          user_id: string;
          auto_saved_amount: number;
          target_amount: number | null;
          label: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          auto_saved_amount?: number;
          target_amount?: number | null;
          label?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          auto_saved_amount?: number;
          target_amount?: number | null;
          label?: string | null;
          updated_at?: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: "tip" | "alert" | "achievement";
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: "tip" | "alert" | "achievement";
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      account_type: "checking" | "savings";
      transaction_type: "credit" | "debit";
      insight_type: "tip" | "alert" | "achievement";
    };
  };
}

// Convenience row types
export type Profile     = Database["public"]["Tables"]["profiles"]["Row"];
export type Account     = Database["public"]["Tables"]["accounts"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Savings     = Database["public"]["Tables"]["savings"]["Row"];
export type AiInsight   = Database["public"]["Tables"]["ai_insights"]["Row"];
