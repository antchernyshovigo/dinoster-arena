export interface MovementVelocity {
  readonly x: number;
  readonly y: number;
}

export function getMovementVelocity(
  moveX: number,
  moveY: number,
  speed: number,
): MovementVelocity {
  const magnitude = Math.hypot(moveX, moveY);

  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: (moveX / magnitude) * speed,
    y: (moveY / magnitude) * speed,
  };
}
