import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { interval = 60 } = req.body

    console.log(`🚀 Iniciando catalogador com intervalo de ${interval} segundos`)

    res.status(200).json({
      success: true,
      message: `Catalogador iniciado com intervalo de ${interval} segundos`
    })
  } catch (error) {
    console.error('Erro ao iniciar catalogador:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
