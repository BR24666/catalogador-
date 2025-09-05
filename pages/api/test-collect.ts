import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log('🧪 Testando coleta de dados')

    res.status(200).json({
      success: true,
      message: 'Teste de coleta realizado com sucesso'
    })
  } catch (error) {
    console.error('Erro no teste:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
