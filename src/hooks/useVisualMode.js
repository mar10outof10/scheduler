import  { useState } from "react";

export default function useVisualMode(initial) {
  
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([]);
  
  const transition = (newMode, replaceHistory = false) => {
    if (!replaceHistory) {
      setHistory(prev => ([...prev, mode]))
    }
    setMode(newMode)
  }

  const back = () => {
    if (history.length >= 1) {
      setMode(history.pop())
    }
  }

  return { mode, transition, back }
}