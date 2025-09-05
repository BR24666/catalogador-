import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { pair = 'SOLUSDT', timeframe = '1m', limit = 100 } = req.query

    // Mock data para demonstração - dados mais realistas
    const basePrice = 180 // Preço base do SOL
    const mockCandles = Array.from({ length: Number(limit) }, (_, i) => {
      const timestamp = new Date(Date.now() - i * 60000)
      const priceVariation = (Math.random() - 0.5) * 2 // Variação de -1 a +1
      const openPrice = basePrice + priceVariation
      const closePrice = openPrice + (Math.random() - 0.5) * 1
      const highPrice = Math.max(openPrice, closePrice) + Math.random() * 0.5
      const lowPrice = Math.min(openPrice, closePrice) - Math.random() * 0.5
      
      return {
        id: `candle-${i}`,
        pair: pair as string,
        timeframe: timeframe as string,
        timestamp: timestamp.toISOString(),
        open_price: parseFloat(openPrice.toFixed(2)),
        high_price: parseFloat(highPrice.toFixed(2)),
        low_price: parseFloat(lowPrice.toFixed(2)),
        close_price: parseFloat(closePrice.toFixed(2)),
        volume: Math.random() * 1000 + 100,
        color: closePrice >= openPrice ? 'GREEN' : 'RED',
        hour: timestamp.getHours(),
        minute: timestamp.getMinutes(),
        day: timestamp.getDate(),
        month: timestamp.getMonth() + 1,
        year: timestamp.getFullYear(),
        full_date: timestamp.toISOString().split('T')[0],
        time_key: `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`,
        date_key: timestamp.toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    res.status(200).json({
      success: true,
      candles: mockCandles,
      count: mockCandles.length
    })
  } catch (error) {
    console.error('Erro ao buscar velas:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
