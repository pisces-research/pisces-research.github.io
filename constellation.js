// Wait for images to load
window.addEventListener('load', onLoad)

function onLoad() {
  gsap.to('.star', {
    opacity: 0,
    duration: 'random(3,6)',
    ease: 'bounce.in',
    stagger: {
      amount: 1,
      from: 'random',
      repeat: -1,
    },
  })

  animateFish()

  gsap
    .timeline()
    .fromTo(
      '#logo-species path',
      { opacity: 0, x: -700 },
      { opacity: 0.5, duration: 0.7, stagger: 0.7, x: 0 },
      '+=1'
    )
    .fromTo('#logo-words', { opacity: 0 }, { opacity: 0.5, duration: 3 }, '+=1')
    .to('#byline-text-intro', { autoAlpha: 1, duration: 3 }, '+=0.2')
    .to('#logo-species path', { autoAlpha: 1, duration: 3 })
    .to('#logo-words', { autoAlpha: 1, duration: 3 }, '<')
    .to('#byline-text', { autoAlpha: 1, duration: 3 }, '<')
    .to('#byline-text-intro', { autoAlpha: 0.5, duration: 3 }, '<')
}

function animateFish() {
  document.querySelectorAll('#logo-species path').forEach((link) => {
    let tween = gsap
      .timeline()
      .to(link, {
        // duration: 0.2,
        // scale: 1.2,
        // rotation: 10,
        duration: 0.4,
        scale: 1.1,
        rotation: 5,
        transformOrigin: 'center center',
        ease: 'back.inout',
      })
      .to(
        link.id.padStart(4, '#').concat('-txt'),
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: 'power4.in',
        },
        '<'
      )
      .reversed(true)
    link.anim = tween
    link.addEventListener('mouseenter', () => link.anim.play())
    link.addEventListener('mouseleave', () => link.anim.reverse())
  })
}
