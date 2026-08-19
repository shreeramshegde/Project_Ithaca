import gsap from 'gsap';

export function animateScoreChange(node, direction) {
  if (!node) {
    return;
  }

  gsap.fromTo(
    node,
    { scale: 0.94, color: direction === 'positive' ? '#203113' : '#541d15' },
    {
      scale: 1,
      color: '#231813',
      duration: 0.85,
      ease: 'power2.out',
    }
  );
}
