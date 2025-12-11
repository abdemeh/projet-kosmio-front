import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 class="text-7xl font-bold text-blue-700">
        Testing Tailwind, this should be blue!
      </h1>
    </>
  )
}

export default App
