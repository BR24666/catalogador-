import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { startDate, endDate, limit = 1000 } = req.body

    console.log(`📅 Carregando dados históricos de ${startDate} até ${endDate}`)

    // Mock dados históricos
    const mockData = Array.from({ length: Math.min(Number(limit), 100) }, (_, i) => ({
      id: `historical-${i}`,
      pair: 'SOLUSDT',
      timeframe: '1m',
      timestamp: new Date(Date.now() - (i + 100) * 60000).toISOString(),
      open_price: 100 + Math.random() * 10,
      high_price: 105 + Math.random() * 10,
      low_price: 95 + Math.random() * 10,
      close_price: 100 + Math.random() * 10,
      volume: Math.random() * 1000,
      color: Math.random() > 0.5 ? 'GREEN' : 'RED',
      hour: new Date(Date.now() - (i + 100) * 60000).getHours(),
      minute: new Date(Date.now() - (i + 100) * 60000).getMinutes(),
      day: new Date(Date.now() - (i + 100) * 60000).getDate(),
      month: new Date(Date.now() - (i + 100) * 60000).getMonth() + 1,
      year: new Date(Date.now() - (i + 100) * 60000).getFullYear(),
      full_date: new Date(Date.now() - (i + 100) * 60000).toISOString().split('T')[0],
      time_key: `${new Date(Date.now() - (i + 100) * 60000).getHours()}:${new Date(Date.now() - (i + 100) * 60000).getMinutes()}`,
      date_key: new Date(Date.now() - (i + 100) * 60000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    res.status(200).json({
      success: true,
      message: 'Dados históricos carregados com sucesso',
      stats: {
        saved: mockData.length,
        period: { start: startDate, end: endDate }
      }
    })
  } catch (error) {
    console.error('Erro ao carregar dados históricos:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
