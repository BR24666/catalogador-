import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log('🛑 Parando catalogador')

    res.status(200).json({
      success: true,
      message: 'Catalogador parado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao parar catalogador:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
