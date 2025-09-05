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
    console.log('Iniciando catalogador...')

    // Atualizar configurações no banco
    await this.updateSettings(true, intervalSeconds)

    // Executar imediatamente
    await this.catalogCandles()

    // Configurar intervalo
    this.intervalId = setInterval(async () => {
      await this.catalogCandles()
    }, intervalSeconds * 1000)
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
      console.log('Coletando dados das velas...')
      
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
      const updateData: any = { is_running: isRunning }
      if (intervalSeconds) {
        updateData.update_interval_seconds = intervalSeconds
      }

      const { error } = await supabase
        .from('catalog_settings')
        .update(updateData)
        .eq('id', 1)

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
}
