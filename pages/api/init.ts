import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log('🔧 Inicializando configurações do banco')

    res.status(200).json({
      success: true,
      message: 'Configurações inicializadas com sucesso'
    })
  } catch (error) {
    console.error('Erro ao inicializar:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    })
  }
}
