'use client'

import { Play, Square, RefreshCw, Calendar, Clock, Coins } from 'lucide-react'

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
}: ControlPanelProps) {

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

        {/* Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Status
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">Status do Catalogador:</p>
              <p className={`font-semibold ${isRunning ? 'text-green-400' : 'text-red-400'}`}>
                {isRunning ? '🟢 Rodando' : '🔴 Parado'}
              </p>
            </div>
            
            {lastUpdate && (
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">Última Atualização:</p>
                <p className="font-mono text-sm">
                  {new Date(lastUpdate).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
