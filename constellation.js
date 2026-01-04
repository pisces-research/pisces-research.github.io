
const hasVisited = sessionStorage.getItem('hasVisitedPage');

// Wait for images to load
window.addEventListener('load', onLoad)

function onLoad() {
  gsap.fromTo('.star', {opacity: 0}, {
    opacity: (index, target, targets) => target.dataset.bv,
    duration: 'random(3,6)',
    ease: 'bounce.out',
    repeatRefresh: true,
    stagger: {
      amount: 3,
      from: 'random',
      repeat: 20,
      yoyo: true,
    },
  })

  animateFish()

  if (!hasVisited) {
    gsap.timeline()
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
      .then(()=>sessionStorage.setItem('hasVisitedPage', 'true'))
  }
  else {
    gsap.set(['#logo-species path', '#logo-words', '#byline-text'], { opacity: 1 });
    gsap.set('#byline-text-intro', { opacity: 0.5 })
  }  
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
