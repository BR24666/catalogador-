import axios from 'axios'

const BINANCE_API_URL = 'https://api.binance.com/api/v3'

export interface BinanceKline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignore: string
}

export interface ProcessedKline {
  pair: string
  timeframe: string
  timestamp: Date
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
}

export class BinanceAPI {
  private static instance: BinanceAPI
  private baseURL: string

  private constructor() {
    this.baseURL = BINANCE_API_URL
  }

  public static getInstance(): BinanceAPI {
    if (!BinanceAPI.instance) {
      BinanceAPI.instance = new BinanceAPI()
    }
    return BinanceAPI.instance
  }

  async getKlines(
    symbol: string,
    interval: string,
    limit: number = 1,
    startTime?: number,
    endTime?: number
  ): Promise<BinanceKline[]> {
    try {
      const params: any = {
        symbol,
        interval,
        limit,
      }

      if (startTime) {
        params.startTime = startTime
      }
      if (endTime) {
        params.endTime = endTime
      }

      const response = await axios.get(`${this.baseURL}/klines`, {
        params,
      })

      return response.data
    } catch (error) {
      console.error(`Erro ao buscar dados do ${symbol}:`, error)
      throw error
    }
  }

  processKline(
    kline: BinanceKline,
    pair: string,
    timeframe: string
  ): ProcessedKline {
    const timestamp = new Date(kline.openTime)
    const openPrice = parseFloat(kline.open)
    const closePrice = parseFloat(kline.close)
    const color: 'GREEN' | 'RED' = closePrice >= openPrice ? 'GREEN' : 'RED'

    return {
      pair,
      timeframe,
      timestamp,
      open_price: openPrice,
      high_price: parseFloat(kline.high),
      low_price: parseFloat(kline.low),
      close_price: closePrice,
      volume: parseFloat(kline.volume),
      color,
      hour: timestamp.getHours(),
      minute: timestamp.getMinutes(),
      day: timestamp.getDate(),
      month: timestamp.getMonth() + 1,
      year: timestamp.getFullYear(),
      full_date: timestamp.toISOString().split('T')[0],
      time_key: timestamp.toTimeString().slice(0, 5),
      date_key: timestamp.toISOString().split('T')[0],
    }
  }

  async getLatestCandles(
    pairs: string[] = ['SOLUSDT'],
    timeframes: string[] = ['1m']
  ): Promise<ProcessedKline[]> {
    const results: ProcessedKline[] = []

    for (const pair of pairs) {
      for (const timeframe of timeframes) {
        try {
          const klines = await this.getKlines(pair, timeframe, 1)
          if (klines.length > 0) {
            const processed = this.processKline(klines[0], pair, timeframe)
            results.push(processed)
          }
        } catch (error) {
          console.error(`Erro ao processar ${pair} ${timeframe}:`, error)
        }
      }
    }

    return results
  }

  async getHistoricalCandles(
    pairs: string[] = ['SOLUSDT'],
    timeframes: string[] = ['1m'],
    startDate: Date,
    endDate: Date
  ): Promise<ProcessedKline[]> {
    const results: ProcessedKline[] = []
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()

    for (const pair of pairs) {
      for (const timeframe of timeframes) {
        try {
          console.log(`Coletando dados históricos para ${pair} ${timeframe} de ${startDate.toISOString()} até ${endDate.toISOString()}`)
          
          // A Binance tem limite de 1000 velas por requisição
          // Vamos dividir em chunks se necessário
          const chunkSize = 1000
          let currentStartTime = startTime
          
          while (currentStartTime < endTime) {
            const currentEndTime = Math.min(currentStartTime + (this.getTimeframeMs(timeframe) * chunkSize), endTime)
            
            const klines = await this.getKlines(
              pair, 
              timeframe, 
              chunkSize, 
              currentStartTime, 
              currentEndTime
            )
            
            if (klines.length > 0) {
              for (const kline of klines) {
                const processed = this.processKline(kline, pair, timeframe)
                results.push(processed)
              }
            }
            
            // Próximo chunk
            currentStartTime = currentEndTime + this.getTimeframeMs(timeframe)
            
            // Pequena pausa para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          console.log(`Coletadas ${results.length} velas históricas para ${pair} ${timeframe}`)
        } catch (error) {
          console.error(`Erro ao processar dados históricos ${pair} ${timeframe}:`, error)
        }
      }
    }

    return results
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframeMap: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
    }
    
    return timeframeMap[timeframe] || 60 * 1000
  }

  async getHistoricalCandlesByDays(
    pairs: string[] = ['SOLUSDT'],
    timeframes: string[] = ['1m'],
    days: number = 7
  ): Promise<ProcessedKline[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    return this.getHistoricalCandles(pairs, timeframes, startDate, endDate)
  }
}
