'use client'

import { useState } from 'react'

interface HistoricalDataCollectorProps {
  onDataCollected?: (count: number) => void
}

export default function HistoricalDataCollector({ onDataCollected }: HistoricalDataCollectorProps) {
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectingProgress, setCollectingProgress] = useState('')
  const [days, setDays] = useState(7)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedPairs, setSelectedPairs] = useState(['BTCUSDT', 'XRPUSDT', 'SOLUSDT'])
  const [selectedTimeframes, setSelectedTimeframes] = useState(['1m', '5m', '15m'])
  const [dataSummary, setDataSummary] = useState<any>(null)

  const pairs = [
    { value: 'BTCUSDT', label: 'BTC/USDT' },
    { value: 'XRPUSDT', label: 'XRP/USDT' },
    { value: 'SOLUSDT', label: 'SOL/USDT' },
    { value: 'ETHUSDT', label: 'ETH/USDT' },
    { value: 'ADAUSDT', label: 'ADA/USDT' }
  ]

  const timeframes = [
    { value: '1m', label: '1 Minuto' },
    { value: '5m', label: '5 Minutos' },
    { value: '15m', label: '15 Minutos' },
    { value: '1h', label: '1 Hora' },
    { value: '4h', label: '4 Horas' }
  ]

  const collectHistoricalData = async (type: 'days' | 'range') => {
    setIsCollecting(true)
    setCollectingProgress('Iniciando coleta...')

    try {
      const payload = {
        action: type === 'days' ? 'collect_by_days' : 'collect_by_range',
        pairs: selectedPairs,
        timeframes: selectedTimeframes,
        ...(type === 'days' ? { days } : { startDate, endDate })
      }

      const response = await fetch('/api/historical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setCollectingProgress(`✅ ${result.message}`)
        onDataCollected?.(result.count)
        await loadDataSummary()
      } else {
        setCollectingProgress(`❌ Erro: ${result.message}`)
      }
    } catch (error) {
      console.error('Erro na coleta:', error)
      setCollectingProgress('❌ Erro na coleta de dados')
    } finally {
      setIsCollecting(false)
    }
  }

  const loadDataSummary = async () => {
    try {
      const response = await fetch('/api/historical')
      const result = await response.json()
      if (result.success) {
        setDataSummary(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar resumo:', error)
    }
  }

  const togglePair = (pair: string) => {
    setSelectedPairs(prev => 
      prev.includes(pair) 
        ? prev.filter(p => p !== pair)
        : [...prev, pair]
    )
  }

  const toggleTimeframe = (timeframe: string) => {
    setSelectedTimeframes(prev => 
      prev.includes(timeframe) 
        ? prev.filter(t => t !== timeframe)
        : [...prev, timeframe]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Coleta de Dados Históricos
      </h2>

      {/* Resumo dos Dados Atuais */}
      {dataSummary && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">📈 Dados Atuais no Catálogo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de Velas:</span>
              <p className="text-blue-600 font-bold">{dataSummary.totalCandles.toLocaleString()}</p>
            </div>
            <div>
              <span className="font-medium">Pares:</span>
              <p className="text-blue-600">{dataSummary.pairs.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium">Timeframes:</span>
              <p className="text-blue-600">{dataSummary.timeframes.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium">Período:</span>
              <p className="text-blue-600">
                {dataSummary.dateRange.start && dataSummary.dateRange.end 
                  ? `${new Date(dataSummary.dateRange.start).toLocaleDateString()} - ${new Date(dataSummary.dateRange.end).toLocaleDateString()}`
                  : 'Nenhum dado'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seleção de Pares */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione os Pares de Negociação:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {pairs.map(pair => (
            <label key={pair.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedPairs.includes(pair.value)}
                onChange={() => togglePair(pair.value)}
                className="mr-2"
              />
              <span className="text-sm">{pair.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seleção de Timeframes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione os Timeframes:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {timeframes.map(timeframe => (
            <label key={timeframe.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTimeframes.includes(timeframe.value)}
                onChange={() => toggleTimeframe(timeframe.value)}
                className="mr-2"
              />
              <span className="text-sm">{timeframe.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Coleta por Dias */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Coleta por Período (Dias)</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Últimos</span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 7)}
              min="1"
              max="30"
              className="w-20 px-2 py-1 border rounded"
              disabled={isCollecting}
            />
            <span className="text-sm font-medium">dias</span>
          </label>
          <button
            onClick={() => collectHistoricalData('days')}
            disabled={isCollecting || selectedPairs.length === 0 || selectedTimeframes.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCollecting ? 'Coletando...' : 'Coletar Dados'}
          </button>
        </div>
      </div>

      {/* Coleta por Intervalo de Datas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📆 Coleta por Intervalo de Datas</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">De:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded"
              disabled={isCollecting}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Até:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded"
              disabled={isCollecting}
            />
          </div>
          <button
            onClick={() => collectHistoricalData('range')}
            disabled={isCollecting || !startDate || !endDate || selectedPairs.length === 0 || selectedTimeframes.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCollecting ? 'Coletando...' : 'Coletar Dados'}
          </button>
        </div>
      </div>

      {/* Status da Coleta */}
      {collectingProgress && (
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-700">{collectingProgress}</p>
        </div>
      )}

      {/* Botão para Atualizar Resumo */}
      <div className="mt-4">
        <button
          onClick={loadDataSummary}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🔄 Atualizar Resumo dos Dados
        </button>
      </div>
    </div>
  )
}
