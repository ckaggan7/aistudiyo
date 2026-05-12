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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip: string | null
          metadata: Json
          target: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json
          target?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip?: string | null
          metadata?: Json
          target?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_reports: {
        Row: {
          agent_id: string | null
          content_md: string
          created_at: string
          id: string
          metadata: Json
          pinned: boolean
          run_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          content_md?: string
          created_at?: string
          id?: string
          metadata?: Json
          pinned?: boolean
          run_id?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          content_md?: string
          created_at?: string
          id?: string
          metadata?: Json
          pinned?: boolean
          run_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agent_runs: {
        Row: {
          agent_id: string | null
          finished_at: string | null
          id: string
          logs: Json | null
          output: string | null
          started_at: string
          status: string
        }
        Insert: {
          agent_id?: string | null
          finished_at?: string | null
          id?: string
          logs?: Json | null
          output?: string | null
          started_at?: string
          status?: string
        }
        Update: {
          agent_id?: string | null
          finished_at?: string | null
          id?: string
          logs?: Json | null
          output?: string | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          enabled: boolean | null
          goal: string | null
          id: string
          name: string
          schedule_cron: string | null
          system_prompt: string | null
          tools: Json | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean | null
          goal?: string | null
          id?: string
          name: string
          schedule_cron?: string | null
          system_prompt?: string | null
          tools?: Json | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          goal?: string | null
          id?: string
          name?: string
          schedule_cron?: string | null
          system_prompt?: string | null
          tools?: Json | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          context_window: number
          created_at: string
          enabled: boolean
          id: string
          input_cost_per_1k: number
          name: string
          output_cost_per_1k: number
          provider_id: string
          slug: string
        }
        Insert: {
          context_window?: number
          created_at?: string
          enabled?: boolean
          id?: string
          input_cost_per_1k?: number
          name: string
          output_cost_per_1k?: number
          provider_id: string
          slug: string
        }
        Update: {
          context_window?: number
          created_at?: string
          enabled?: boolean
          id?: string
          input_cost_per_1k?: number
          name?: string
          output_cost_per_1k?: number
          provider_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          name: string
          slug: string
          status: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          slug: string
          status?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          slug?: string
          status?: string
        }
        Relationships: []
      }
      ai_request_logs: {
        Row: {
          cost_usd: number
          created_at: string
          id: string
          latency_ms: number
          model_slug: string
          provider_slug: string | null
          status: string
          tokens_in: number
          tokens_out: number
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          id?: string
          latency_ms?: number
          model_slug: string
          provider_slug?: string | null
          status?: string
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string
          id?: string
          latency_ms?: number
          model_slug?: string
          provider_slug?: string | null
          status?: string
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_request_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_assets: {
        Row: {
          brand_id: string | null
          created_at: string
          id: string
          kind: string
          meta: Json
          name: string | null
          url: string
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          meta?: Json
          name?: string | null
          url: string
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          meta?: Json
          name?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_assets_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_profile: {
        Row: {
          address: string | null
          audience: string | null
          category: string | null
          created_at: string
          email: string | null
          font_pair: string | null
          id: string
          logo_url: string | null
          memory: Json
          name: string
          palette: Json | null
          phone: string | null
          scan_summary: Json
          score: Json
          socials: Json
          sources: Json
          style_prompt: string | null
          tagline: string | null
          updated_at: string
          user_id: string
          voice: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          audience?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          font_pair?: string | null
          id?: string
          logo_url?: string | null
          memory?: Json
          name?: string
          palette?: Json | null
          phone?: string | null
          scan_summary?: Json
          score?: Json
          socials?: Json
          sources?: Json
          style_prompt?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          voice?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          audience?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          font_pair?: string | null
          id?: string
          logo_url?: string | null
          memory?: Json
          name?: string
          palette?: Json | null
          phone?: string | null
          scan_summary?: Json
          score?: Json
          socials?: Json
          sources?: Json
          style_prompt?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          voice?: string | null
          website?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          color: string | null
          created_at: string
          ends_at: string | null
          goal: string | null
          id: string
          kpi: string | null
          name: string
          starts_at: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          ends_at?: string | null
          goal?: string | null
          id?: string
          kpi?: string | null
          name: string
          starts_at?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          ends_at?: string | null
          goal?: string | null
          id?: string
          kpi?: string | null
          name?: string
          starts_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          issued_at: string
          score: number
          share_slug: string
          title: string
          track_id: string
          user_id: string
        }
        Insert: {
          id?: string
          issued_at?: string
          score?: number
          share_slug: string
          title: string
          track_id: string
          user_id: string
        }
        Update: {
          id?: string
          issued_at?: string
          score?: number
          share_slug?: string
          title?: string
          track_id?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          body: string
          content_pack_id: string | null
          created_at: string
          id: string
          image_url: string | null
          kind: string
          user_id: string
        }
        Insert: {
          body: string
          content_pack_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind?: string
          user_id: string
        }
        Update: {
          body?: string
          content_pack_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind?: string
          user_id?: string
        }
        Relationships: []
      }
      content_packs: {
        Row: {
          content_type: string
          created_at: string
          id: string
          pack_json: Json
          platform: string
          prompt: string
          scores_json: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content_type?: string
          created_at?: string
          id?: string
          pack_json?: Json
          platform?: string
          prompt: string
          scores_json?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          pack_json?: Json
          platform?: string
          prompt?: string
          scores_json?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          cadence: string | null
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          cadence?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          cadence?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      creator_missions: {
        Row: {
          claimed_at: string
          id: string
          mission_id: string
          rewards: Json
          status: string
          user_id: string
          xp: number
        }
        Insert: {
          claimed_at?: string
          id?: string
          mission_id: string
          rewards?: Json
          status?: string
          user_id: string
          xp?: number
        }
        Update: {
          claimed_at?: string
          id?: string
          mission_id?: string
          rewards?: Json
          status?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      creator_profile: {
        Row: {
          business_type: string | null
          created_at: string
          goals: Json
          niche: string | null
          skill_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          goals?: Json
          niche?: string | null
          skill_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          goals?: Json
          niche?: string | null
          skill_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          actor_id: string | null
          agent_id: string | null
          amount: number
          created_at: string
          id: string
          reason: string
          run_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          agent_id?: string | null
          amount: number
          created_at?: string
          id?: string
          reason: string
          run_id?: string | null
          type?: string
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          agent_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          run_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          key: string
          rollout_pct: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          rollout_pct?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          rollout_pct?: number
          updated_at?: string
        }
        Relationships: []
      }
      generations: {
        Row: {
          created_at: string
          generated_prompt: string | null
          id: string
          image_url: string
          mode: string
          prompt: string
          style: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          generated_prompt?: string | null
          id?: string
          image_url: string
          mode?: string
          prompt: string
          style?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          generated_prompt?: string | null
          id?: string
          image_url?: string
          mode?: string
          prompt?: string
          style?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meta_connections: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          ig_user_id: string | null
          page_id: string | null
          provider: string
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ig_user_id?: string | null
          page_id?: string | null
          provider?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ig_user_id?: string | null
          page_id?: string | null
          provider?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          approval_status: string
          campaign_id: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string | null
          platform: string
          scheduled_for: string
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approval_status?: string
          campaign_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string
          scheduled_for?: string
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approval_status?: string
          campaign_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string
          scheduled_for?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_presets: {
        Row: {
          created_at: string
          id: string
          name: string
          sample: string | null
          tone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sample?: string | null
          tone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sample?: string | null
          tone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      workflow_run_steps: {
        Row: {
          created_at: string
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          input: Json | null
          node_id: string
          node_label: string | null
          node_type: string
          output: Json | null
          run_id: string
          started_at: string | null
          status: string
          step_index: number
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json | null
          node_id: string
          node_label?: string | null
          node_type: string
          output?: Json | null
          run_id: string
          started_at?: string | null
          status?: string
          step_index?: number
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json | null
          node_id?: string
          node_label?: string | null
          node_type?: string
          output?: Json | null
          run_id?: string
          started_at?: string | null
          status?: string
          step_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_run_steps_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "workflow_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error: string | null
          finished_at: string | null
          id: string
          input: Json
          output: Json | null
          started_at: string | null
          status: string
          trigger_source: string
          user_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json
          output?: Json | null
          started_at?: string | null
          status?: string
          trigger_source?: string
          user_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error?: string | null
          finished_at?: string | null
          id?: string
          input?: Json
          output?: Json | null
          started_at?: string | null
          status?: string
          trigger_source?: string
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          graph: Json
          id: string
          is_template: boolean
          last_run_at: string | null
          name: string
          run_count: number
          schedule_cron: string | null
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          graph?: Json
          id?: string
          is_template?: boolean
          last_run_at?: string | null
          name: string
          run_count?: number
          schedule_cron?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          graph?: Json
          id?: string
          is_template?: boolean
          last_run_at?: string | null
          name?: string
          run_count?: number
          schedule_cron?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          credits: number
          id: string
          name: string
          owner_id: string
          plan: string
          slug: string
          status: string
          storage_used_mb: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          name: string
          owner_id: string
          plan?: string
          slug: string
          status?: string
          storage_used_mb?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          name?: string
          owner_id?: string
          plan?: string
          slug?: string
          status?: string
          storage_used_mb?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      creator_xp: {
        Row: {
          user_id: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      adjust_user_credits: {
        Args: { _delta: number; _reason: string; _user_id: string }
        Returns: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "wallet"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_public_certificate: {
        Args: { _slug: string }
        Returns: {
          display_name: string
          id: string
          issued_at: string
          score: number
          title: string
          track_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "manager" | "creator" | "user"
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
      app_role: ["super_admin", "admin", "manager", "creator", "user"],
    },
  },
} as const
