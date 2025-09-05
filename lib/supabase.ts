import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface CandleData {
  id: string
  pair: 'SOLUSDT'
  timeframe: '1m'
  timestamp: string
  open_price: number
  high_price: number
  low_price: number
  close_price: number
  volume: number
  color: 'GREEN' | 'RED'
  hour: number
  minute: number
  day: number
  month: number
  year: number
  full_date: string
  time_key: string
  date_key: string
  created_at: string
  updated_at: string
}

export interface CatalogSettings {
  id: number
  is_running: boolean
  last_update: string | null
  update_interval_seconds: number
  pairs: string[]
  timeframes: string[]
  created_at: string
  updated_at: string
}
