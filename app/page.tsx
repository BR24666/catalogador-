'use client'

import { useState, useEffect } from 'react'
import { CatalogService } from '@/lib/catalog-service'
import { CandleData } from '@/lib/supabase'
import CandleGrid from '@/components/CandleGrid'
import ControlPanel from '@/components/ControlPanel'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Home() {
  const [catalogService] = useState(new CatalogService())
  const [isRunning, setIsRunning] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [selectedPair, setSelectedPair] = useState<'SOLUSDT'>('SOLUSDT')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m'>('1m')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [candles, setCandles] = useState<CandleData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar configurações do banco
        await fetch('/api/init', { method: 'POST' })
        
        // Carregar status e dados
        await loadStatus()
        await loadCandles()
        
        // Iniciar catalogador automaticamente
        const status = await catalogService.getCatalogStatus()
        if (!status.isRunning) {
          console.log('Iniciando catalogador automaticamente...')
          await catalogService.startCataloging(60) // 1 minuto
          setIsRunning(true)
        }
      } catch (error) {
        console.error('Erro na inicialização:', error)
      }
    }
    
    initializeApp()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(() => {
      loadCandles()
      loadStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadCandles()
  }, [selectedPair, selectedTimeframe, selectedDate])

  const loadStatus = async () => {
    const status = await catalogService.getCatalogStatus()
    setIsRunning(status.isRunning)
    setLastUpdate(status.lastUpdate)
  }

  const loadCandles = async () => {
    setLoading(true)
    try {
      const data = await catalogService.getCandlesByDateRange(
        selectedPair,
        selectedTimeframe,
        selectedDate,
        selectedDate
      )
      setCandles(data)
    } catch (error) {
      console.error('Erro ao carregar velas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartStop = async () => {
    if (isRunning) {
      await catalogService.stopCataloging()
      setIsRunning(false)
    } else {
      await catalogService.startCataloging(60)
      setIsRunning(true)
    }
    loadStatus()
  }

  const handleRefresh = () => {
    loadCandles()
    loadStatus()
  }

  const handleTestConnection = async () => {
    try {
      const response = await fetch('/api/test-binance')
      const result = await response.json()
      
      if (result.success) {
        alert('✅ Conexão com Binance OK!\n\nÚltima vela:\n' + 
              `Preço: $${result.data.lastCandle?.close_price}\n` +
              `Timestamp: ${new Date(result.data.lastCandle?.timestamp).toLocaleString('pt-BR')}`)
      } else {
        alert('❌ Erro na conexão com Binance:\n' + result.message)
      }
    } catch (error) {
      alert('❌ Erro ao testar conexão: ' + error)
    }
  }

  return (
    <div className="bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            📊 Catalogador de Velas
          </h1>
          <p className="text-gray-400 text-center">
            SOL/USD | 1 minuto | Coleta automática
          </p>
        </div>

        {/* Control Panel */}
        <ControlPanel
          isRunning={isRunning}
          lastUpdate={lastUpdate}
          selectedPair={selectedPair}
          selectedTimeframe={selectedTimeframe}
          selectedDate={selectedDate}
          onStartStop={handleStartStop}
          onRefresh={handleRefresh}
          onPairChange={setSelectedPair}
          onTimeframeChange={setSelectedTimeframe}
          onDateChange={setSelectedDate}
          onTestConnection={handleTestConnection}
        />

        {/* Candle Grid */}
        <div className="mt-8">
          <CandleGrid
            candles={candles}
            pair={selectedPair}
            timeframe={selectedTimeframe}
            date={selectedDate}
            loading={loading}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className={isRunning ? 'text-green-400' : 'text-red-400'}>
              {isRunning ? '🟢 Ativo' : '🔴 Parado'}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Última Atualização</h3>
            <p className="text-gray-300">
              {lastUpdate 
                ? format(new Date(lastUpdate), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
                : 'Nunca'
              }
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Velas Carregadas</h3>
            <p className="text-gray-300">{candles.length} velas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
