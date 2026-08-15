import gsap from 'gsap';

export function animateMapCamera(islandSlug) {
  // A real implementation would find the island's coordinates and pan/zoom to it.
  // We'll just do a subtle zoom on the container for the cinematic effect.
  return gsap.to('.ocean-map-world', {
    scale: 1.15,
    duration: 1.5,
    ease: 'power2.inOut',
  });
}

export function animateShipTravel(fromNode, toNode, shipRef) {
  if (!shipRef.current) return;
  
  return gsap.to(shipRef.current, {
    left: `${toNode.pos.x}%`,
    top: `${toNode.pos.y}%`,
    duration: 2.5,
    ease: 'power1.inOut',
  });
}

export function animateIslandEntry() {
  const tl = gsap.timeline();
  tl.to('.page-shell', { opacity: 0, duration: 0.5 })
    .to('.page-shell', { opacity: 1, duration: 0.8 }, '+=0.2');
  return tl;
}
