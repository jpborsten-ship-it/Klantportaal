import { useEffect, useState } from 'react'

// Telt op van 0 naar de waarde bij het laden van de pagina — geeft de cijfers
// op het dashboard wat leven in plaats van statisch te verschijnen.
export default function AnimatedNumber({ value, format = (n) => String(Math.round(n)), duration = 800 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame
    const startTime = performance.now()

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(value * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return format(display)
}
