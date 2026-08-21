import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function runLandingAnimation(refs, reducedMotion) {
  const ui = [
    refs.title && refs.title.current,
    refs.subtitle && refs.subtitle.current,
    refs.quote && refs.quote.current,
    refs.actions && refs.actions.current,
  ].filter(Boolean);

  if (reducedMotion) {
    gsap.set(ui, { autoAlpha: 1, y: 0 });
    if (refs.overlay && refs.overlay.current) gsap.set(refs.overlay.current, { autoAlpha: 0.28 });
    return () => {};
  }

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Subtle overlay fade
  if (refs.overlay && refs.overlay.current) {
    timeline.fromTo(refs.overlay.current, { autoAlpha: 0 }, { autoAlpha: 0.28, duration: 1.4 }, 0);
  }

  // Staggered entry — translate from below with slight spring feel
  timeline
    .fromTo(
      refs.subtitle.current,
      { autoAlpha: 0, y: 20, letterSpacing: '0.5em' },
      { autoAlpha: 1, y: 0, letterSpacing: '0.28em', duration: 1.1 },
      0.2
    )
    .fromTo(
      refs.title.current,
      { autoAlpha: 0, y: 32, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: 'power4.out' },
      0.45
    )
    .fromTo(
      refs.quote.current,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 1.0 },
      0.95
    )
    .fromTo(
      refs.actions.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.9 },
      1.2
    );

  // Subtle ambient video scale drift — cinematic life
  if (refs.video && refs.video.current) {
    gsap.fromTo(
      refs.video.current,
      { scale: 1.06 },
      { scale: 1.0, duration: 3.5, ease: 'power2.out' }
    );
  }

  return () => {
    timeline.kill();
  };
}

export function runDepartureAnimation(refs, reducedMotion) {
  if (reducedMotion) return gsap.timeline();

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  tl.to(refs.actions.current, { autoAlpha: 0, y: 8, duration: 0.22, ease: 'power2.in' })
    .to(refs.quote.current, { autoAlpha: 0, y: -6, duration: 0.22 }, '<')
    .to(
      [refs.title.current, refs.subtitle.current],
      { autoAlpha: 0, y: -20, scale: 0.97, stagger: 0.06, duration: 0.4 },
      '-=0.1'
    )
    .to(refs.overlay.current, { autoAlpha: 0.9, duration: 0.85 }, '-=0.3')
    .to(
      refs.video.current,
      { scale: 1.08, filter: 'blur(4px)', duration: 1.0 },
      '<'
    );

  return tl;
}
