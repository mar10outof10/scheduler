import  { useState } from "react";

export default function useVisualMode(initial) {
  
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([]);
  /**
   * Transitions mode to newMode 
   * @param {*} newMode A string to be used to set the mode state.
   * @param {*} replaceHistory Optional parameter. Set to true to skip adding current mode to history state.
   */
  const transition = (newMode, replaceHistory = false) => {
    if (!replaceHistory) {
      setHistory(prev => ([...prev, mode]))
    }
    setMode(newMode)
  }
  /**
   * Moves back to the mode most recently added to the history state. Removes mode from history.
   */
  const back = () => {
    if (history.length >= 1) {
      setMode(history.pop())
    }
  }

  return { mode, transition, back }
}