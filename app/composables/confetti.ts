import confetti from 'canvas-confetti'

export default function launchConfettiOnCard(
  cardId: string,
  options?: confetti.Options,
  bursts: number = 2,
  delay: number = 200
) {
  const card = document.getElementById(cardId)
  if (!card) return

  const prevPosition = getComputedStyle(card).position
  if (prevPosition === 'static') {
    card.style.position = 'relative'
  }

  const rect = card.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = rect.width
  canvas.height = rect.height
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  card.appendChild(canvas)

  const myConfetti = confetti.create(canvas, { resize: true })

  for (let i = 0; i < bursts; i++) {
    setTimeout(() => {
      myConfetti({
        particleCount: 15 + Math.floor(Math.random() * 10),
        spread: 50 + Math.random() * 20,
        origin: { y: 0.9 },
        gravity: 0.8 + Math.random() * 0.2,
        ...options
      })
    }, i * delay)
  }

  setTimeout(() => {
    if (canvas.parentNode) card.removeChild(canvas)
    if (prevPosition === 'static') card.style.position = prevPosition
  }, bursts * delay + 3000)
}
