'use client'

import { Play, Square, RefreshCw, Calendar, Clock, Coins } from 'lucide-react'

interface ControlPanelProps {
  isRunning: boolean
  lastUpdate: string | null
  selectedPair: 'BTCUSDT' | 'XRPUSDT' | 'SOLUSDT'
  selectedTimeframe: '1m' | '5m' | '15m'
  selectedDate: string
  onStartStop: () => void
  onRefresh: () => void
  onPairChange: (pair: 'BTCUSDT' | 'XRPUSDT' | 'SOLUSDT') => void
  onTimeframeChange: (timeframe: '1m' | '5m' | '15m') => void
  onDateChange: (date: string) => void
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
}: ControlPanelProps) {
  const pairs = [
    { value: 'BTCUSDT', label: 'BTC/USDT', icon: '₿' },
    { value: 'XRPUSDT', label: 'XRP/USDT', icon: '💎' },
    { value: 'SOLUSDT', label: 'SOL/USDT', icon: '☀️' },
  ] as const

  const timeframes = [
    { value: '1m', label: '1 Minuto' },
    { value: '5m', label: '5 Minutos' },
    { value: '15m', label: '15 Minutos' },
  ] as const

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Controles Principais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Controles
          </h3>
          
          <div className="flex gap-2">
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
          </div>
        </div>

        {/* Seleção de Par */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Par de Negociação
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            {pairs.map((pair) => (
              <button
                key={pair.value}
                onClick={() => onPairChange(pair.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPair === pair.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <span className="text-lg">{pair.icon}</span>
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Timeframe */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeframe
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => onTimeframeChange(tf.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {tf.label}
              </button>
            ))}
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
      </div>
    </div>
  )
}
