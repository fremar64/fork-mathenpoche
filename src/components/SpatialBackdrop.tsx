'use client'

import { useEffect, useRef } from 'react'

const fullTurn = 2 * Math.PI

function makeStar() {
  return {
    x: Math.random(),
    y: Math.random(),
    radius: 0.55 + Math.random() * 0.9,
    phase: Math.random() * fullTurn,
    speed: 0.7 + Math.random() * 1.8,
  }
}

function makeTrail(index: number) {
  return {
    side: index % 2,
    phase: Math.random(),
    angle: Math.random() * fullTurn,
    speed: 0.06 + Math.random() * 0.08,
    hue: 208 + Math.random() * 87,
  }
}

export function SpatialBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stars = Array.from({ length: 120 }, makeStar)
    const trails = Array.from({ length: 105 }, (_, index) => makeTrail(index))
    let width = 0
    let height = 0
    let frame = 0
    let lastPaint = -Infinity

    const draw = (seconds: number, reduced: boolean) => {
      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        const brightness = reduced ? 0.68 : 0.38 + 0.59 * (0.5 + 0.5 * Math.sin(seconds * star.speed + star.phase))
        context.beginPath()
        context.fillStyle = `rgba(230, 239, 255, ${brightness})`
        context.arc(star.x * width, star.y * height, star.radius, 0, fullTurn)
        context.fill()
      }

      context.lineCap = 'round'
      const reach = Math.min(width * 0.44, height * 0.77)
      for (const trail of trails) {
        const progress = (trail.phase + seconds * trail.speed) % 1
        const direction = trail.side ? 1 : -1
        const radius = reach * (0.12 + 0.88 * progress)
        const angle = trail.angle + direction * (progress * 2.3 + seconds * 0.18)
        const originX = width * (trail.side ? 0.83 : 0.15)
        const originY = height * (trail.side ? 0.77 : 0.81)
        const lead = direction * (0.014 + progress * 0.038)
        const opacity = (reduced ? 0.3 : 0.69) * Math.sin(Math.PI * progress)

        context.strokeStyle = `hsla(${trail.hue}, 93%, 72%, ${opacity})`
        context.lineWidth = 1 + 0.9 * progress
        context.beginPath()
        context.ellipse(originX, originY, radius, radius * 0.38, direction * 0.14, angle, angle + lead, lead < 0)
        context.stroke()
      }
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastPaint >= 32) {
        draw(timestamp / 1000, false)
        lastPaint = timestamp
      }
      frame = window.requestAnimationFrame(animate)
    }

    const syncAnimation = () => {
      window.cancelAnimationFrame(frame)
      draw(motionPreference.matches ? 0 : performance.now() / 1000, motionPreference.matches)
      if (!motionPreference.matches) frame = window.requestAnimationFrame(animate)
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      syncAnimation()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    motionPreference.addEventListener('change', syncAnimation)
    resize()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      motionPreference.removeEventListener('change', syncAnimation)
    }
  }, [])

  return (
    <div aria-hidden="true" className="spatial-backdrop">
      <div className="nebula-glow nebula-glow-one" />
      <div className="nebula-glow nebula-glow-two" />
      <canvas className="starfield-canvas" ref={canvasRef} />
    </div>
  )
}
