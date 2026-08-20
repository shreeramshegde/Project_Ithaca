import gsap from 'gsap';

export function animateScoreChange(node, direction) {
  if (!node) {
    return;
  }

  gsap.fromTo(
    node,
    { scale: 0.94, color: direction === 'positive' ? '#89ab76' : '#f87171' },
    {
      scale: 1,
      color: '#f5f2e8',
      duration: 0.85,
      ease: 'power2.out',
    }
  );
}
