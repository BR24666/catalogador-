import './globals.css'
import Navigation from '@/components/Navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Catalogador de Velas - BTC, XRP, SOL</title>
        <meta name="description" content="Sistema de catalogação de velas de criptomoedas em tempo real" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
