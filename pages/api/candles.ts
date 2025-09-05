import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { pair = 'SOLUSDT', timeframe = '1m', limit = 100 } = req.query

    // Mock data para demonstração
    const mockCandles = Array.from({ length: Number(limit) }, (_, i) => ({
      id: `candle-${i}`,
      pair: pair as string,
      timeframe: timeframe as string,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      open_price: 100 + Math.random() * 10,
      high_price: 105 + Math.random() * 10,
      low_price: 95 + Math.random() * 10,
      close_price: 100 + Math.random() * 10,
      volume: Math.random() * 1000,
      color: Math.random() > 0.5 ? 'GREEN' : 'RED',
      hour: new Date(Date.now() - i * 60000).getHours(),
      minute: new Date(Date.now() - i * 60000).getMinutes(),
      day: new Date(Date.now() - i * 60000).getDate(),
      month: new Date(Date.now() - i * 60000).getMonth() + 1,
      year: new Date(Date.now() - i * 60000).getFullYear(),
      full_date: new Date(Date.now() - i * 60000).toISOString().split('T')[0],
      time_key: `${new Date(Date.now() - i * 60000).getHours()}:${new Date(Date.now() - i * 60000).getMinutes()}`,
      date_key: new Date(Date.now() - i * 60000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

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
