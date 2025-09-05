import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Mock status
    const status = {
      isRunning: true,
      lastUpdate: new Date().toISOString(),
      updateIntervalSeconds: 60,
      pairs: ['SOLUSDT'],
      timeframes: ['1m']
    }

    res.status(200).json({
      success: true,
      status
    })
  } catch (error) {
    console.error('Erro ao buscar status:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
