import { useState, useEffect } from 'react'
import Head from 'next/head'
import CandleGrid from '../components/CandleGrid'
import ControlPanel from '../components/ControlPanel'
import Navigation from '../components/Navigation'

export default function Home() {
  const [candles, setCandles] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [selectedPair, setSelectedPair] = useState('SOLUSDT')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const loadCandles = async () => {
    try {
      const response = await fetch('/api/candles')
      const data = await response.json()
      if (data.success) {
        setCandles(data.candles)
        setLastUpdate(new Date().toLocaleString())
      }
    } catch (error) {
      console.error('Erro ao carregar velas:', error)
    }
  }

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/catalog/status')
      const data = await response.json()
      if (data.success) {
        setIsRunning(data.status.isRunning)
        setLastUpdate(data.status.lastUpdate)
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error)
    }
  }

  const handleStartStop = async () => {
    try {
      if (isRunning) {
        await fetch('/api/catalog/stop', { method: 'POST' })
        setIsRunning(false)
      } else {
        await fetch('/api/catalog/start', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interval: 60 })
        })
        setIsRunning(true)
      }
    } catch (error) {
      console.error('Erro ao controlar catalogador:', error)
    }
  }

  const handleRefresh = () => {
    loadCandles()
    loadStatus()
  }

  const handleTestConnection = async () => {
    try {
      const response = await fetch('/api/test-collect')
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert('Erro ao testar conexão')
    }
  }

  const handleTestSupabase = async () => {
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert('Erro ao testar Supabase')
    }
  }


  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Inicializando aplicação...')
        await fetch('/api/init', { method: 'POST' })
        console.log('✅ Configurações do banco inicializadas')

        // Carregar apenas dados existentes na tabela
        await loadStatus()
        await loadCandles()
        console.log('✅ Status e dados carregados')

        // Verificar se o catalogador está rodando
        const status = await fetch('/api/catalog/status').then(r => r.json())
        if (status.success && !status.status.isRunning) {
          console.log('🔄 Iniciando catalogador automaticamente...')
          await fetch('/api/catalog/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interval: 60 })
          })
          setIsRunning(true)
          console.log('✅ Catalogador iniciado automaticamente')
        } else {
          console.log('✅ Catalogador já estava rodando')
          setIsRunning(true)
        }

        console.log('🎉 Aplicação inicializada com sucesso!')
      } catch (error) {
        console.error('❌ Erro na inicialização:', error)
        setTimeout(() => {
          console.log('🔄 Tentando reinicializar...')
          initializeApp()
        }, 5000)
      }
    }

    initializeApp()
    const interval = setInterval(() => {
      loadCandles()
      loadStatus()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Catalogador de Velas - SOL/USDT</title>
        <meta name="description" content="Sistema de catalogação de velas de criptomoedas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
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
                onTestSupabase={handleTestSupabase}
              />
            </div>
            
            <div className="lg:col-span-3">
              <CandleGrid
                candles={candles}
                selectedPair={selectedPair}
                selectedTimeframe={selectedTimeframe}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
