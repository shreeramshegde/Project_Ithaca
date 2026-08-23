import gsap from 'gsap';

/**
 * mapAnimations.js
 *
 * Cinematic motion handlers for the Project Ithaca Ocean Map & Voyage transitions:
 * - Direct, majestic, slow & smooth ship sailing along the curved ocean journey path
 * - Real-time camera follow tracking the ship as islands scroll smoothly into view
 * - Gentle docking and arrival animations
 */

export function animateMapCamera(_islandSlug) {
  return gsap.to('.ocean-map-world', {
    scale: 1.04,
    duration: 0.5,
    ease: 'power2.out',
  });
}

/**
 * Calculate Cubic Bezier coordinate at progress t (0 to 1)
 * Matching the exact bezier curve in JourneyPath.jsx
 */
export function getBezierPoint(t, p0, p1, p2, p3) {
  const oneMinusT = 1 - t;
  const oneMinusT2 = oneMinusT * oneMinusT;
  const oneMinusT3 = oneMinusT2 * oneMinusT;
  const t2 = t * t;
  const t3 = t2 * t;

  const x = oneMinusT3 * p0.x + 3 * oneMinusT2 * t * p1.x + 3 * oneMinusT * t2 * p2.x + t3 * p3.x;
  const y = oneMinusT3 * p0.y + 3 * oneMinusT2 * t * p1.y + 3 * oneMinusT * t2 * p2.y + t3 * p3.y;

  return { x, y };
}

/**
 * Animate the ship sailing directly along the golden curved ocean track from fromNode to toNode
 * with smooth real-time camera tracking and natural banking.
 * 
 * @param {Object} fromNode - Origin island node containing { pos: { x, y } }
 * @param {Object} toNode - Destination island node containing { pos: { x, y } }
 * @param {React.RefObject} shipRef - Ref to the ship DOM container
 * @param {Function} onComplete - Callback executed upon docking
 */
export function animateShipTravel(fromNode, toNode, shipRef, onComplete) {
  if (!shipRef?.current || !fromNode?.pos || !toNode?.pos) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Cancel any existing running tweens on the ship container
  gsap.killTweensOf(shipRef.current);

  const p0 = { x: fromNode.pos.x, y: fromNode.pos.y };
  const p3 = { x: toNode.pos.x, y: toNode.pos.y };
  
  // Exact control points used by JourneyPath.jsx S-curves
  const cpX = p0.x + (p3.x - p0.x) * 0.5;
  const p1 = { x: cpX, y: p0.y };
  const p2 = { x: cpX, y: p3.y };

  const dx = p3.x - p0.x;
  const maxTilt = dx > 0 ? 6 : -6;

  // Set explicit starting position at origin island
  gsap.set(shipRef.current, {
    left: `${p0.x}%`,
    top: `${p0.y}%`,
    transform: 'translate(-50%, -50%) rotate(0deg)',
  });

  const scrollContainer = document.querySelector('.journey-page-cinematic') || document.documentElement || window;
  const mapWorld = document.querySelector('.ocean-map-world');

  const proxy = { progress: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      // Pin exact final coordinates at destination island
      if (shipRef.current) {
        gsap.set(shipRef.current, {
          left: `${p3.x}%`,
          top: `${p3.y}%`,
          transform: 'translate(-50%, -50%) rotate(0deg)',
        });
      }
      if (typeof onComplete === 'function') {
        onComplete();
      }
    },
  });

  // 4.0 seconds smooth, majestic sailing with continuous sine.inOut easing
  tl.to(proxy, {
    progress: 1,
    duration: 4.0,
    ease: 'sine.inOut',
    onUpdate: () => {
      const t = proxy.progress;
      const point = getBezierPoint(t, p0, p1, p2, p3);

      // Compute heading tilt along the curve
      const currentTilt = Math.sin(t * Math.PI) * maxTilt;

      if (shipRef.current) {
        shipRef.current.style.left = `${point.x}%`;
        shipRef.current.style.top = `${point.y}%`;
        shipRef.current.style.transform = `translate(-50%, -50%) rotate(${currentTilt}deg)`;
      }

      // Camera smoothly tracks the vessel's vertical ocean position in real-time
      if (mapWorld && scrollContainer) {
        const mapHeight = mapWorld.offsetHeight || 1800;
        const targetScrollY = (point.y / 100) * mapHeight - window.innerHeight / 2;
        
        if (typeof scrollContainer.scrollTop !== 'undefined') {
          scrollContainer.scrollTop = Math.max(0, targetScrollY);
        } else if (typeof window.scrollTo === 'function') {
          window.scrollTo({ top: Math.max(0, targetScrollY) });
        }
      }
    },
  });

  return tl;
}

export function animateIslandEntry() {
  const tl = gsap.timeline();
  tl.fromTo('.page-shell', { opacity: 0.8 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  return tl;
}
