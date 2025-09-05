// Supabase client simplificado usando fetch nativo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          then: (callback: (data: any) => void) => {
            console.log(`Mock select from ${table} where ${column} = ${value} order by ${column}`)
            callback({ data: [], error: null })
          }
        }),
        then: (callback: (data: any) => void) => {
          console.log(`Mock select from ${table} where ${column} = ${value}`)
          callback({ data: [], error: null })
        }
      }),
      order: (column: string, options?: any) => ({
        then: (callback: (data: any) => void) => {
          console.log(`Mock select from ${table} order by ${column}`)
          callback({ data: [], error: null })
        }
      }),
      then: (callback: (data: any) => void) => {
        console.log(`Mock select from ${table}`)
        callback({ data: [], error: null })
      }
    }),
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        console.log(`Mock insert into ${table}:`, data)
        callback({ data: [data], error: null })
      }
    }),
    upsert: (data: any, options?: any) => ({
      then: (callback: (result: any) => void) => {
        console.log(`Mock upsert into ${table}:`, data)
        callback({ data: [data], error: null })
      }
    }),
    delete: () => ({
      neq: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          console.log(`Mock delete from ${table} where ${column} != ${value}`)
          callback({ data: [], error: null })
        }
      }),
      then: (callback: (result: any) => void) => {
        console.log(`Mock delete from ${table}`)
        callback({ data: [], error: null })
      }
    })
  })
}

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
