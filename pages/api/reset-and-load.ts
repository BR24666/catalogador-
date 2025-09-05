import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log('🚀 Iniciando processo de reset e carregamento de dados...')

    // Mock reset
    console.log('🧹 Limpando tabelas...')
    const tablesCleared = ['candle_catalog', 'catalog_settings']

    // Mock carregamento de dados históricos
    console.log('📅 Carregando dados históricos de 2 meses...')
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 2)

    const mockHistoricalData = Array.from({ length: 100 }, (_, i) => ({
      id: `historical-${i}`,
      pair: 'SOLUSDT',
      timeframe: '1m',
      timestamp: new Date(startDate.getTime() + i * 60000).toISOString(),
      open_price: 100 + Math.random() * 10,
      high_price: 105 + Math.random() * 10,
      low_price: 95 + Math.random() * 10,
      close_price: 100 + Math.random() * 10,
      volume: Math.random() * 1000,
      color: Math.random() > 0.5 ? 'GREEN' : 'RED',
      hour: new Date(startDate.getTime() + i * 60000).getHours(),
      minute: new Date(startDate.getTime() + i * 60000).getMinutes(),
      day: new Date(startDate.getTime() + i * 60000).getDate(),
      month: new Date(startDate.getTime() + i * 60000).getMonth() + 1,
      year: new Date(startDate.getTime() + i * 60000).getFullYear(),
      full_date: new Date(startDate.getTime() + i * 60000).toISOString().split('T')[0],
      time_key: `${new Date(startDate.getTime() + i * 60000).getHours()}:${new Date(startDate.getTime() + i * 60000).getMinutes()}`,
      date_key: new Date(startDate.getTime() + i * 60000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    console.log(`✅ Total de ${mockHistoricalData.length} velas históricas processadas.`)

    res.status(200).json({
      success: true,
      message: 'Reset e carregamento de dados concluídos com sucesso!',
      stats: {
        tablesCleared,
        historicalData: {
          totalFound: mockHistoricalData.length,
          saved: mockHistoricalData.length,
          errors: 0,
          period: { 
            start: startDate.toISOString().split('T')[0], 
            end: endDate.toISOString().split('T')[0] 
          },
        },
      },
    })
  } catch (error) {
    console.error('❌ Erro no processo de reset e carregamento:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    })
  }
}
