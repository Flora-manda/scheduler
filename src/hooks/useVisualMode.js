import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace) {
      setHistory((prev) => {
        prev.pop();
        return [...prev, mode];
      });
    } else {
      setHistory((prev) => [...prev, mode]);
    }
    setMode(mode);
  }

  function back() {
    if (history.length > 1) {
      let new_history = history;
      new_history.pop();
      setMode(new_history[new_history.length - 1]);
    }
  }

  return {
    mode,
    transition,
    back,
  };
}
