import { supabase, CandleData } from './supabase'
import { BinanceAPI, ProcessedKline } from './binance-api'

export class CatalogService {
  private binanceAPI: BinanceAPI
  private isRunning: boolean = false
  private intervalId: NodeJS.Timeout | null = null

  constructor() {
    this.binanceAPI = BinanceAPI.getInstance()
  }

  async startCataloging(intervalSeconds: number = 60): Promise<void> {
    if (this.isRunning) {
      console.log('Catalogador já está rodando')
      return
    }

    this.isRunning = true
    console.log('Iniciando catalogador SOL/USD...')

    // Atualizar configurações no banco
    await this.updateSettings(true, intervalSeconds)

    // Executar imediatamente
    await this.catalogCandles()

    // Configurar intervalo para 1 minuto
    this.intervalId = setInterval(async () => {
      await this.catalogCandles()
    }, 60000) // 60 segundos = 1 minuto
  }

  async stopCataloging(): Promise<void> {
    if (!this.isRunning) {
      console.log('Catalogador não está rodando')
      return
    }

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    // Atualizar configurações no banco
    await this.updateSettings(false)

    console.log('Catalogador parado')
  }

  private async catalogCandles(): Promise<void> {
    try {
      console.log('Coletando dados das velas em tempo real...')
      
      const pairs = ['BTCUSDT', 'XRPUSDT', 'SOLUSDT']
      const timeframes = ['1m', '5m', '15m']
      
      const candles = await this.binanceAPI.getLatestCandles(pairs, timeframes)
      
      console.log(`Processando ${candles.length} velas...`)

      for (const candle of candles) {
        await this.saveCandle(candle)
      }

      // Atualizar timestamp da última atualização
      await this.updateLastUpdate()

      console.log('Dados catalogados com sucesso!')
    } catch (error) {
      console.error('Erro ao catalogar velas:', error)
      await this.logError('Erro ao catalogar velas', error)
    }
  }

  private async saveCandle(candle: ProcessedKline): Promise<void> {
    try {
      const { error } = await supabase
        .from('candle_catalog')
        .upsert({
          pair: candle.pair,
          timeframe: candle.timeframe,
          timestamp: candle.timestamp.toISOString(),
          open_price: candle.open_price,
          high_price: candle.high_price,
          low_price: candle.low_price,
          close_price: candle.close_price,
          volume: candle.volume,
          color: candle.color,
          hour: candle.hour,
          minute: candle.minute,
          day: candle.day,
          month: candle.month,
          year: candle.year,
          full_date: candle.full_date,
          time_key: candle.time_key,
          date_key: candle.date_key,
        }, {
          onConflict: 'pair,timeframe,timestamp'
        })

      if (error) {
        console.error(`Erro ao salvar vela ${candle.pair} ${candle.timeframe}:`, error)
      }
    } catch (error) {
      console.error(`Erro ao salvar vela:`, error)
    }
  }

  private async updateSettings(isRunning: boolean, intervalSeconds?: number): Promise<void> {
    try {
      const updateData: any = { 
        is_running: isRunning,
        pairs: ['BTCUSDT', 'XRPUSDT', 'SOLUSDT'],
        timeframes: ['1m', '5m', '15m'],
        updated_at: new Date().toISOString()
      }
      if (intervalSeconds) {
        updateData.update_interval_seconds = intervalSeconds
      }

      const { error } = await supabase
        .from('catalog_settings')
        .upsert({
          id: 1,
          ...updateData,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Erro ao atualizar configurações:', error)
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    }
  }

  private async updateLastUpdate(): Promise<void> {
    try {
      const { error } = await supabase
        .from('catalog_settings')
        .update({ last_update: new Date().toISOString() })
        .eq('id', 1)

      if (error) {
        console.error('Erro ao atualizar timestamp:', error)
      }
    } catch (error) {
      console.error('Erro ao atualizar timestamp:', error)
    }
  }

  private async logError(message: string, error: any): Promise<void> {
    try {
      const { error: logError } = await supabase
        .from('catalog_logs')
        .insert({
          level: 'ERROR',
          message,
          error_details: error,
        })

      if (logError) {
        console.error('Erro ao salvar log:', logError)
      }
    } catch (logError) {
      console.error('Erro ao salvar log:', logError)
    }
  }

  async getCandlesByDateRange(
    pair: string,
    timeframe: string,
    startDate: string,
    endDate: string
  ): Promise<CandleData[]> {
    try {
      const { data, error } = await supabase
        .from('candle_catalog')
        .select('*')
        .eq('pair', pair)
        .eq('timeframe', timeframe)
        .gte('full_date', startDate)
        .lte('full_date', endDate)
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Erro ao buscar velas:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar velas:', error)
      return []
    }
  }

  async getCandlesByHour(
    pair: string,
    timeframe: string,
    date: string,
    hour: number
  ): Promise<CandleData[]> {
    try {
      const { data, error } = await supabase
        .from('candle_catalog')
        .select('*')
        .eq('pair', pair)
        .eq('timeframe', timeframe)
        .eq('full_date', date)
        .eq('hour', hour)
        .order('minute', { ascending: true })

      if (error) {
        console.error('Erro ao buscar velas por hora:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar velas por hora:', error)
      return []
    }
  }

  async getCatalogStatus(): Promise<{ isRunning: boolean; lastUpdate: string | null }> {
    try {
      const { data, error } = await supabase
        .from('catalog_settings')
        .select('is_running, last_update')
        .eq('id', 1)
        .single()

      if (error) {
        console.error('Erro ao buscar status:', error)
        return { isRunning: false, lastUpdate: null }
      }

      return {
        isRunning: data.is_running,
        lastUpdate: data.last_update,
      }
    } catch (error) {
      console.error('Erro ao buscar status:', error)
      return { isRunning: false, lastUpdate: null }
    }
  }

  async collectHistoricalData(
    pairs: string[] = ['SOLUSDT'],
    timeframes: string[] = ['1m'],
    days: number = 7
  ): Promise<{ success: boolean; message: string; count: number }> {
    try {
      console.log(`Iniciando coleta de dados históricos para ${days} dias...`)
      
      const historicalCandles = await this.binanceAPI.getHistoricalCandlesByDays(
        pairs,
        timeframes,
        days
      )

      console.log(`Processando ${historicalCandles.length} velas históricas...`)

      let savedCount = 0
      for (const candle of historicalCandles) {
        try {
          await this.saveCandle(candle)
          savedCount++
        } catch (error) {
          console.error(`Erro ao salvar vela histórica:`, error)
        }
      }

      console.log(`Coleta histórica concluída: ${savedCount} velas salvas`)

      return {
        success: true,
        message: `Coleta histórica concluída: ${savedCount} velas salvas`,
        count: savedCount
      }
    } catch (error) {
      console.error('Erro na coleta histórica:', error)
      await this.logError('Erro na coleta histórica', error)
      return {
        success: false,
        message: 'Erro na coleta histórica',
        count: 0
      }
    }
  }

  async collectHistoricalDataByDateRange(
    pairs: string[] = ['SOLUSDT'],
    timeframes: string[] = ['1m'],
    startDate: Date,
    endDate: Date
  ): Promise<{ success: boolean; message: string; count: number }> {
    try {
      console.log(`Iniciando coleta histórica de ${startDate.toISOString()} até ${endDate.toISOString()}...`)
      
      const historicalCandles = await this.binanceAPI.getHistoricalCandles(
        pairs,
        timeframes,
        startDate,
        endDate
      )

      console.log(`Processando ${historicalCandles.length} velas históricas...`)

      let savedCount = 0
      for (const candle of historicalCandles) {
        try {
          await this.saveCandle(candle)
          savedCount++
        } catch (error) {
          console.error(`Erro ao salvar vela histórica:`, error)
        }
      }

      console.log(`Coleta histórica concluída: ${savedCount} velas salvas`)

      return {
        success: true,
        message: `Coleta histórica concluída: ${savedCount} velas salvas`,
        count: savedCount
      }
    } catch (error) {
      console.error('Erro na coleta histórica:', error)
      await this.logError('Erro na coleta histórica', error)
      return {
        success: false,
        message: 'Erro na coleta histórica',
        count: 0
      }
    }
  }

  async getDataSummary(): Promise<{
    totalCandles: number;
    pairs: string[];
    timeframes: string[];
    dateRange: { start: string; end: string };
  }> {
    try {
      const { data, error } = await supabase
        .from('candle_catalog')
        .select('pair, timeframe, timestamp')
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Erro ao buscar resumo dos dados:', error)
        return {
          totalCandles: 0,
          pairs: [],
          timeframes: [],
          dateRange: { start: '', end: '' }
        }
      }

      const pairs = [...new Set(data.map(c => c.pair))]
      const timeframes = [...new Set(data.map(c => c.timeframe))]
      const timestamps = data.map(c => c.timestamp)
      
      return {
        totalCandles: data.length,
        pairs,
        timeframes,
        dateRange: {
          start: timestamps[0] || '',
          end: timestamps[timestamps.length - 1] || ''
        }
      }
    } catch (error) {
      console.error('Erro ao buscar resumo dos dados:', error)
      return {
        totalCandles: 0,
        pairs: [],
        timeframes: [],
        dateRange: { start: '', end: '' }
      }
    }
  }
}
