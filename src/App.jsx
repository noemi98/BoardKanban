import { useState } from 'react'
import './App.css'
import { TaskBoard } from './assets/components/TaskBoard'
import { Navbar } from './assets/components/Navbar';
import 'bulma/css/bulma.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <TaskBoard />
    </>
  )
}

export default App
