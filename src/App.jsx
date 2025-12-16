import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth } from './hooks/useAuth'
import { canPerformAction } from './utils/permissions'
import { AuthProvider } from './context/AuthContext'
import AuthDevSwitcher from './components/dev/AuthDevSwitcher'
import ThemeDevToggleButton from './components/dev/ThemeDevToggleButton'
import { ThemeProvider } from './context/ThemeContext'
import ValidateDevButton from './components/dev/ValidateDevButton'

function App() {

  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <ValidateDevButton/>
          <ThemeDevToggleButton></ThemeDevToggleButton>
          <AuthDevSwitcher/>
        </ThemeProvider>
      </AuthProvider>
    </>
  )
}

export default App
