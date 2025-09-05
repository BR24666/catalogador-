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
  const [selectedPair, setSelectedPair] = useState<'BTCUSDT' | 'XRPUSDT' | 'SOLUSDT'>('BTCUSDT')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '15m'>('1m')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [candles, setCandles] = useState<CandleData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Iniciar catalogador automaticamente
    const autoStart = async () => {
      try {
        const response = await fetch('/api/catalog/auto-start')
        const result = await response.json()
        if (result.success) {
          console.log('✅ Catalogador iniciado automaticamente')
        }
      } catch (error) {
        console.error('Erro ao iniciar catalogador:', error)
      }
    }
    
    autoStart()
    loadStatus()
    loadCandles()
    
    // Atualizar dados a cada 10 segundos
    const interval = setInterval(() => {
      loadCandles()
      loadStatus()
    }, 10000)
    
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
      console.log('🔍 Carregando velas para:', selectedPair, selectedTimeframe, selectedDate)
      
      const data = await catalogService.getCandlesByDateRange(
        selectedPair,
        selectedTimeframe,
        selectedDate,
        selectedDate
      )
      
      console.log('📊 Velas carregadas:', data.length)
      setCandles(data)
      
      // Se não há dados, tentar carregar dados de hoje
      if (data.length === 0) {
        const today = format(new Date(), 'yyyy-MM-dd')
        if (selectedDate !== today) {
          console.log('🔄 Tentando carregar dados de hoje:', today)
          const todayData = await catalogService.getCandlesByDateRange(
            selectedPair,
            selectedTimeframe,
            today,
            today
          )
          console.log('📊 Dados de hoje:', todayData.length)
          if (todayData.length > 0) {
            setCandles(todayData)
            setSelectedDate(today)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar velas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    await catalogService.stopCataloging()
    setIsRunning(false)
    loadStatus()
  }

  const handleRefresh = () => {
    loadCandles()
    loadStatus()
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
            BTC • XRP • SOL | 1min • 5min • 15min
          </p>
        </div>

        {/* Control Panel */}
        <ControlPanel
          isRunning={isRunning}
          lastUpdate={lastUpdate}
          selectedPair={selectedPair}
          selectedTimeframe={selectedTimeframe}
          selectedDate={selectedDate}
          onStop={handleStop}
          onRefresh={handleRefresh}
          onPairChange={setSelectedPair}
          onTimeframeChange={setSelectedTimeframe}
          onDateChange={setSelectedDate}
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Atualização</h3>
            <p className="text-blue-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              A cada 10s
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
