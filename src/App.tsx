import { useState } from 'react'
import { Header } from './components/layout/Header'
import { BottomNav, type TabId } from './components/layout/BottomNav'
import { DashboardView } from './components/dashboard/DashboardView'
import { DinnerGeneratorView } from './components/dinner/DinnerGeneratorView'
import { WeighInView } from './components/checkin/WeighInView'
import { SettingsView } from './components/settings/SettingsView'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  return (
    <div className="flex min-h-screen flex-col bg-cream text-charcoal">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-4">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'dinner' && <DinnerGeneratorView />}
        {activeTab === 'checkin' && <WeighInView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
