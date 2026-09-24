import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

const PRODUCTS = [
  { image: 'products/deck.png', name: 'Apex 8.25 Deck', type: 'Deck / 8.25', price: '$72' },
  { image: 'products/complete.png', name: 'Street Complete', type: 'Complete / 8.0', price: '$168' },
  { image: 'products/hardware.png', name: 'Core Hardware Kit', type: 'Components / Set', price: '$64' },
  { image: 'products/complete.png', name: 'Nightline Complete', type: 'Complete / 8.25', price: '$184' },
  { image: 'products/deck.png', name: 'Orbit 8.5 Deck', type: 'Deck / 8.5', price: '$78' },
  { image: 'products/hardware.png', name: 'Precision Setup', type: 'Components / Pro', price: '$92' },
]

function App() {
  const cursor = useRef<HTMLDivElement>(null)
  const scrubSection = useRef<HTMLElement>(null)
  const scrubVideo = useRef<HTMLVideoElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (!cursor.current) return
      cursor.current.style.left = `${event.clientX}px`
      cursor.current.style.top = `${event.clientY}px`
    }
    addEventListener('mousemove', move)
    return () => removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const section = scrubSection.current
    const video = scrubVideo.current
    if (!section || !video) return

    let frame = 0
    let targetProgress = 0
    let displayProgress = 0
    let duration = 0
    let lastTouchY = 0

    const updateDuration = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0
      video.pause()
    }

    const onWheel = (event: WheelEvent) => {
      if (scrollY > 2) return
      const movingForward = event.deltaY > 0
      const movingBackward = event.deltaY < 0
      const isScrubbing = (movingForward && targetProgress < 0.999) || (movingBackward && targetProgress > 0.001)

      if (!isScrubbing) return
      event.preventDefault()
      const delta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 100)
      targetProgress = Math.min(1, Math.max(0, targetProgress + delta * 0.0018))
    }

    const onTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event: TouchEvent) => {
      if (scrollY > 2 || event.touches.length === 0) return
      const currentY = event.touches[0].clientY
      const delta = lastTouchY - currentY
      lastTouchY = currentY
      const movingForward = delta > 0
      const movingBackward = delta < 0
      const isScrubbing = (movingForward && targetProgress < 0.999) || (movingBackward && targetProgress > 0.001)

      if (!isScrubbing) return
      event.preventDefault()
      targetProgress = Math.min(1, Math.max(0, targetProgress + delta * 0.0032))
    }

    const tick = () => {
      displayProgress += (targetProgress - displayProgress) * 0.14
      const displayTime = displayProgress * duration

      if (progressBar.current) progressBar.current.style.transform = `scaleX(${displayProgress})`
      if (duration > 0 && Math.abs(video.currentTime - displayTime) > 0.008 && !video.seeking) {
        video.currentTime = Math.min(duration, Math.max(0, displayTime))
      }

      frame = requestAnimationFrame(tick)
    }

    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('durationchange', updateDuration)
    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: false })
    if (video.readyState >= 1) updateDuration()
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('durationchange', updateDuration)
      removeEventListener('wheel', onWheel)
      removeEventListener('touchstart', onTouchStart)
      removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return <main className="min-h-screen overflow-hidden bg-black text-white">
    <div ref={cursor} className="pointer-events-none fixed left-0 top-0 z-50 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white mix-blend-difference lg:flex"><span className="text-sm">＋</span></div>

    <section ref={scrubSection} className="relative h-screen min-h-[540px] overflow-hidden overscroll-none bg-black sm:min-h-[620px]">
      <div className="relative h-full w-full overflow-hidden">
      <video ref={scrubVideo} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" src="skate-hero.mp4" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/65" />
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="absolute left-4 top-4 z-10 sm:left-8 sm:top-7">
        <div className="text-[clamp(1.85rem,10vw,2.7rem)] font-medium leading-[.72] tracking-[-.06em] sm:text-[clamp(3.4rem,9vw,8rem)] sm:tracking-[-.075em]">XTRALID<span className="align-top text-[.14em] tracking-normal">®</span></div>
      </motion.div>
      <motion.nav initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="absolute right-4 top-5 z-10 flex items-center gap-7 text-xs uppercase tracking-[.08em] sm:right-8 sm:top-8 sm:text-sm">
        <span className="hidden sm:block">Collection 01</span><span>Menu</span><span>[ Cart 0 ]</span>
      </motion.nav>
      <div className="absolute bottom-6 left-4 right-4 z-10 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8">
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.35,duration:.7}} className="max-w-md">
          <p className="mb-4 text-xs uppercase tracking-[.16em] text-white/70">Skate systems / 2026</p>
          <h1 className="text-[clamp(2.8rem,7vw,7rem)] leading-[.82] tracking-[-.065em]">Built to move.<br/>Made to last.</h1>
        </motion.div>
        <div className="hidden text-right text-xs uppercase leading-relaxed tracking-[.1em] text-white/70 md:block">Scroll to play<br/>↓</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/20"><div ref={progressBar} className="h-full origin-left scale-x-0 bg-[#e8ff34]" /></div>
      </div>
    </section>

    <section className="border-b border-white/15 bg-[#050505] px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1fr_2fr]">
        <p className="text-xs uppercase tracking-[.16em] text-white/50">01 / The collection</p>
        <h2 className="max-w-5xl text-[clamp(2.8rem,6.5vw,7rem)] leading-[.9] tracking-[-.06em]">Boards and hardware engineered for the city.</h2>
      </div>
    </section>

    <section className="bg-[#050505] px-4 pb-28 sm:px-8 sm:pb-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-x-4 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product, index) => <motion.article key={`${product.name}-${index}`} initial={{opacity:0,y:42}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.6,delay:(index%3)*.08}} className={index === 1 || index === 4 ? 'lg:translate-y-28' : ''}>
          <div className="group relative aspect-[2/3] overflow-hidden bg-[#0b0b0b]">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035] group-hover:opacity-80" />
            <span className="absolute right-4 top-4 rounded-full border border-white/40 px-3 py-1 text-[10px] uppercase tracking-[.1em]">View</span>
          </div>
          <div className="mt-4 flex items-start justify-between border-t border-white/25 pt-3 uppercase">
            <div><h3 className="text-base tracking-[-.02em]">{product.name}</h3><p className="mt-1 text-xs tracking-[.08em] text-white/45">{product.type}</p></div>
            <span className="text-sm">{product.price}</span>
          </div>
        </motion.article>)}
      </div>
    </section>

    <section className="bg-[#e8ff34] px-4 py-20 text-black sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1600px]">
        <p className="mb-16 text-xs uppercase tracking-[.16em]">02 / Built different</p>
        <div className="grid gap-px bg-black/25 md:grid-cols-3">
          {[
            ['7-ply','Cold-pressed maple'],
            ['99A','Street urethane'],
            ['365','Days built to ride'],
          ].map(([big,small]) => <div key={big} className="bg-[#e8ff34] py-10 md:px-8"><div className="text-[clamp(4rem,8vw,8rem)] leading-none tracking-[-.07em]">{big}</div><div className="mt-4 text-sm uppercase tracking-[.12em]">{small}</div></div>)}
        </div>
      </div>
    </section>

    <footer className="bg-black px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 text-xs uppercase tracking-[.12em] sm:flex-row sm:items-end sm:justify-between">
        <div className="text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-[-.07em]">XTRALID</div>
        <div className="flex gap-8 text-white/55"><span>Instagram</span><span>Shipping</span><span>© 2026</span></div>
      </div>
    </footer>
  </main>
}

export default App

