import gsap from 'gsap';
export function runLandingAnimation(refs, reducedMotion) {
  // refs: { video, overlay, vignette, title, subtitle, quote, actions }
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

  const timeline = gsap.timeline();
  // subtle overlay fade to improve readability
  if (refs.overlay && refs.overlay.current) {
    timeline.fromTo(refs.overlay.current, { autoAlpha: 0 }, { autoAlpha: 0.28, duration: 1.2 }, 0);
  }

  timeline
    .fromTo(refs.title.current, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1 }, '-=0.25')
    .fromTo(refs.subtitle.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.6')
    .fromTo(refs.quote.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.45')
    .fromTo(refs.actions.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.2');

  return () => {
    timeline.kill();
  };
}

export function runDepartureAnimation(refs, reducedMotion) {
  // For reduced motion, return a simple timeline that completes immediately
  if (reducedMotion) return gsap.timeline();

  const tl = gsap.timeline();

  tl.to(refs.actions.current, { autoAlpha: 0, y: 8, duration: 0.28 })
    .to(refs.quote.current, { autoAlpha: 0, duration: 0.28 }, '<')
    .to([refs.title.current, refs.subtitle.current], { autoAlpha: 0, y: -16, stagger: 0.04, duration: 0.45 }, '<')
    // darken overlay to cinematic black and gently scale the video for depth
    .to(
      refs.overlay.current,
      { autoAlpha: 0.86, duration: 0.9, ease: 'power2.inOut' },
      '-=0.25'
    )
    .to(
      refs.video.current,
      { scale: 1.04, transformOrigin: 'center center', duration: 1.1, ease: 'power2.inOut' },
      '<'
    );

  return tl;
}
