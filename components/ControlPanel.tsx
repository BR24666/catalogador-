'use client'

import { Play, Square, RefreshCw, Calendar, Clock, Coins, History, Download } from 'lucide-react'
import { useState } from 'react'

interface ControlPanelProps {
  isRunning: boolean
  lastUpdate: string | null
  selectedPair: string
  selectedTimeframe: string
  selectedDate: string
  onStartStop: () => void
  onRefresh: () => void
  onPairChange: (pair: string) => void
  onTimeframeChange: (timeframe: string) => void
  onDateChange: (date: string) => void
  onTestConnection?: () => void
  onTestSupabase?: () => void
  onLoadHistorical?: (startDate: string, endDate: string) => Promise<void>
}

export default function ControlPanel({
  isRunning,
  lastUpdate,
  selectedPair,
  selectedTimeframe,
  selectedDate,
  onStartStop,
  onRefresh,
  onPairChange,
  onTimeframeChange,
  onDateChange,
  onTestConnection,
  onTestSupabase,
  onLoadHistorical,
}: ControlPanelProps) {
  const [historicalStartDate, setHistoricalStartDate] = useState('')
  const [historicalEndDate, setHistoricalEndDate] = useState('')
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
  const [historicalProgress, setHistoricalProgress] = useState('')

  const handleLoadHistorical = async () => {
    if (!onLoadHistorical || !historicalStartDate || !historicalEndDate) {
      alert('Por favor, selecione as datas inicial e final')
      return
    }

    if (new Date(historicalStartDate) >= new Date(historicalEndDate)) {
      alert('A data inicial deve ser anterior à data final')
      return
    }

    setIsLoadingHistorical(true)
    setHistoricalProgress('Carregando dados históricos...')
    
    try {
      await onLoadHistorical(historicalStartDate, historicalEndDate)
      setHistoricalProgress('Dados históricos carregados com sucesso!')
      setTimeout(() => setHistoricalProgress(''), 3000)
    } catch (error) {
      console.error('Erro ao carregar dados históricos:', error)
      setHistoricalProgress('Erro ao carregar dados históricos')
      setTimeout(() => setHistoricalProgress(''), 5000)
    } finally {
      setIsLoadingHistorical(false)
    }
  }

  const handleLoad2Months = async () => {
    if (!onLoadHistorical) return

    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 2)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    setIsLoadingHistorical(true)
    setHistoricalProgress('Carregando dados dos últimos 2 meses...')
    
    try {
      await onLoadHistorical(startDateStr, endDateStr)
      setHistoricalProgress('Dados dos últimos 2 meses carregados com sucesso!')
      setTimeout(() => setHistoricalProgress(''), 3000)
    } catch (error) {
      console.error('Erro ao carregar dados de 2 meses:', error)
      setHistoricalProgress('Erro ao carregar dados de 2 meses')
      setTimeout(() => setHistoricalProgress(''), 5000)
    } finally {
      setIsLoadingHistorical(false)
    }
  }

  const pairs = [
    { value: 'BTCUSDT', label: 'BTC/USDT', icon: '₿' },
    { value: 'XRPUSDT', label: 'XRP/USDT', icon: '💎' },
    { value: 'SOLUSDT', label: 'SOL/USDT', icon: '☀️' },
    { value: 'ETHUSDT', label: 'ETH/USDT', icon: '⟠' },
    { value: 'ADAUSDT', label: 'ADA/USDT', icon: '🔷' },
  ]

  const timeframes = [
    { value: '1m', label: '1 Minuto' },
    { value: '5m', label: '5 Minutos' },
    { value: '15m', label: '15 Minutos' },
    { value: '1h', label: '1 Hora' },
    { value: '4h', label: '4 Horas' },
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Controles Principais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Controles
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onStartStop}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  Parar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Iniciar
                </>
              )}
            </button>
            
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            
            {onTestConnection && (
              <button
                onClick={onTestConnection}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Clock className="w-4 h-4" />
                Testar Binance
              </button>
            )}
            
            {onTestSupabase && (
              <button
                onClick={onTestSupabase}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                <Coins className="w-4 h-4" />
                Testar DB
              </button>
            )}
          </div>
        </div>

        {/* Seleção de Par e Timeframe */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Configurações
          </h3>
          
          {/* Seleção de Par */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Par de Negociação:
            </label>
            <select
              value={selectedPair}
              onChange={(e) => onPairChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pairs.map(pair => (
                <option key={pair.value} value={pair.value}>
                  {pair.icon} {pair.label}
                </option>
              ))}
            </select>
          </div>

          {/* Seleção de Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Timeframe:
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Seleção de Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Data
          </h3>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {lastUpdate && (
            <div className="text-sm text-gray-400">
              <p>Última atualização:</p>
              <p className="font-mono">
                {new Date(lastUpdate).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>

        {/* Dados Históricos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="w-5 h-5" />
            Dados Históricos
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Inicial:
              </label>
              <input
                type="date"
                value={historicalStartDate}
                onChange={(e) => setHistoricalStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingHistorical}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Final:
              </label>
              <input
                type="date"
                value={historicalEndDate}
                onChange={(e) => setHistoricalEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingHistorical}
              />
            </div>
            
            <button
              onClick={handleLoad2Months}
              disabled={isLoadingHistorical}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors mb-2"
            >
              {isLoadingHistorical ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <History className="w-4 h-4" />
                  Carregar 2 Meses
                </>
              )}
            </button>
            
            <button
              onClick={handleLoadHistorical}
              disabled={isLoadingHistorical || !historicalStartDate || !historicalEndDate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isLoadingHistorical ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Carregar Período
                </>
              )}
            </button>
            
            {historicalProgress && (
              <div className="text-sm text-center p-2 bg-gray-700 rounded-lg">
                <p className="text-gray-300">{historicalProgress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
