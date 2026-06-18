import { useLayoutEffect, useRef, useState } from 'react'

const BOTTOM_MARGIN_PX = 24 // kleine marge onderaan; de paginering mag prima net buiten beeld vallen en even scrollen
const FALLBACK_ROW_HEIGHT_PX = 500 // schatting (dag-header + max-height van het lijf + padding/gap), totdat er echt iets gerenderd is

// Meet hoeveel grid-kolommen én -rijen daadwerkelijk passen, gegeven dezelfde
// minimale kolombreedte + gap als de CSS grid (`auto-fill, minmax(minColumnWidth, 1fr)`).
// Zo bepaalt de layout zelf de paginagrootte (kolommen × rijen), in plaats van
// een vast aantal dagen of alleen de breedte.
export function useColumnsPerRow(minColumnWidth, gapPx, fallback = 5) {
  const containerRef = useRef(null)
  const [pageSize, setPageSize] = useState(fallback)

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return

    function measure() {
      const width = element.clientWidth
      const columns = Math.max(1, Math.floor((width + gapPx) / (minColumnWidth + gapPx)))

      const firstDay = element.querySelector('.agenda-day')
      const rowHeight = firstDay ? firstDay.offsetHeight : FALLBACK_ROW_HEIGHT_PX

      // Naar boven afronden: bij twijfel een rij té veel (een beetje scrollen
      // is prima) in plaats van een rij te weinig die bijna paste.
      const top = element.getBoundingClientRect().top
      const availableHeight = window.innerHeight - top - BOTTOM_MARGIN_PX
      const rows = Math.max(1, Math.ceil((availableHeight + gapPx) / (rowHeight + gapPx)))

      setPageSize(columns * rows)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [minColumnWidth, gapPx])

  return [containerRef, pageSize]
}
