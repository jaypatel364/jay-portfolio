"use client";

// ── Physics node position ─────────────────────────────────────────────────────

interface PhysicsNode {
  x: number; // 0–100 (% of container)
  y: number;
  vx: number; // velocity in % per frame
  vy: number;
}

/** Build initial positions using a Poisson-disc-like spread to guarantee no overlap */
function buildInitialPositions(count: number): PhysicsNode[] {
  const NODE_R = 6; // minimum distance between node centres (%)
  const positions: PhysicsNode[] = [];
  let attempts = 0;

  while (positions.length < count && attempts < 10000) {
    attempts++;
    const x = 8 + Math.random() * 84;
    const y = 8 + Math.random() * 78;

    const tooClose = positions.some((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < NODE_R;
    });

    if (!tooClose) {
      const speed = 0.007 + Math.random() * 0.008;
      const angle = Math.random() * 2 * Math.PI;
      positions.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
    }
  }
  return positions;
}

/** One tick of physics: move, bounce walls, apply soft repulsion */
function tickPhysics(nodes: PhysicsNode[]): PhysicsNode[] {
  const REPULSE_DIST = 9; // %
  const REPULSE_FORCE = 0.0012;
  const DAMPING = 0.995;
  const MAX_SPEED = 0.025;

  return nodes.map((n, i) => {
    let { x, y, vx, vy } = n;

    // Soft repulsion from other nodes
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = x - nodes[j].x;
      const dy = y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      if (dist < REPULSE_DIST) {
        const force = REPULSE_FORCE / (dist * dist);
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
      }
    }

    // Damping
    vx *= DAMPING;
    vy *= DAMPING;

    // Speed cap
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > MAX_SPEED) {
      vx = (vx / speed) * MAX_SPEED;
      vy = (vy / speed) * MAX_SPEED;
    }

    // Move
    x += vx;
    y += vy;

    // Bounce off walls (with node half-size margin ~4%)
    if (x < 5) {
      x = 5;
      vx = Math.abs(vx);
    }
    if (x > 92) {
      x = 92;
      vx = -Math.abs(vx);
    }
    if (y < 5) {
      y = 5;
      vy = Math.abs(vy);
    }
    if (y > 88) {
      y = 88;
      vy = -Math.abs(vy);
    }

    return { x, y, vx, vy };
  });
}

export type { PhysicsNode };
export { buildInitialPositions, tickPhysics };
