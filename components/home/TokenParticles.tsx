import React, { useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { Engine } from 'tsparticles-engine'
import { STAKEABLE_TOKENS } from 'utils/constants'
import { loadFull } from 'tsparticles'

const TokenParticles = () => {
  const [mounted, setMounted] = useState(false)

  const particlesInit = async (main: Engine) => {
    console.log(main)
    await loadFull(main)
  }

  useEffect(() => {
    setMounted(true) // No need to set emitters in state separately
  }, [])

  if (!mounted) return null

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: false,
        interactivity: {
          detect_on: 'canvas',
          events: {
            onHover: {
              enable: true,
              mode: 'attract',
            },
          },
        },
        manualParticles: STAKEABLE_TOKENS.map((sym) => ({
          options: {
            shape: {
              type: 'image',
              image: {
                src: `/icons/${sym.toLowerCase()}.svg`,
                width: 48,
                height: 48,
              },
            },
            rotate: {
              value: 0,
              random: true,
              direction: 'clockwise',
              animation: {
                enable: true,
                speed: 15,
                sync: false,
              },
            },
            lineLinked: {
              enable: false,
            },
            opacity: {
              value: 1,
            },
            size: {
              value: 16,
              random: false,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'bottom',
              random: false,
              straight: true,
              out_mode: 'bounce',
              gravity: {
                enable: true,
                acceleration: 1,
                maxSpeed: 1,
              },
            },
            collisions: { enable: true },
          },
        })),
        detectRetina: true,
      }}
    />
  )
}

export default TokenParticles
