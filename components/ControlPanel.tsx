'use client'

import { Play, Square, RefreshCw, Calendar, Clock, Coins } from 'lucide-react'

interface ControlPanelProps {
  isRunning: boolean
  lastUpdate: string | null
  selectedPair: 'SOLUSDT'
  selectedTimeframe: '1m'
  selectedDate: string
  onStartStop: () => void
  onRefresh: () => void
  onPairChange: (pair: 'SOLUSDT') => void
  onTimeframeChange: (timeframe: '1m') => void
  onDateChange: (date: string) => void
  onTestConnection?: () => void
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
}: ControlPanelProps) {
  const pairs = [
    { value: 'SOLUSDT', label: 'SOL/USDT', icon: '☀️' },
  ] as const

  const timeframes = [
    { value: '1m', label: '1 Minuto' },
  ] as const

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Testar
              </button>
            )}
          </div>
        </div>

        {/* Informações do Par */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Par de Negociação
          </h3>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg">
            <span className="text-lg">☀️</span>
            <span className="font-medium">SOL/USD</span>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Timeframe: 1 minuto</p>
            <p>Coleta automática ativa</p>
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
