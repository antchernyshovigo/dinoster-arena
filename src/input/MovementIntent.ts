export type AxisIntent = -1 | 0 | 1;

export interface MovementIntent {
  readonly moveX: AxisIntent;
  readonly moveY: AxisIntent;
}

export function getAxisIntent(
  negativePressed: boolean,
  positivePressed: boolean,
): AxisIntent {
  if (negativePressed === positivePressed) {
    return 0;
  }

  return negativePressed ? -1 : 1;
}

export function getActiveMovementIntent(
  keyboardIntent: MovementIntent,
  touchIntent: MovementIntent,
  touchIsActive: boolean,
): MovementIntent {
  return touchIsActive ? touchIntent : keyboardIntent;
}

export function getRadialMovementIntent(
  offsetX: number,
  offsetY: number,
  deadZone: number,
): MovementIntent {
  if (Math.hypot(offsetX, offsetY) <= deadZone) {
    return { moveX: 0, moveY: 0 };
  }

  const angle = Math.atan2(offsetY, offsetX);
  return {
    moveX: toAxisIntent(Math.round(Math.cos(angle))),
    moveY: toAxisIntent(Math.round(Math.sin(angle))),
  };
}

function toAxisIntent(value: number): AxisIntent {
  if (value === 0) {
    return 0;
  }

  return value < 0 ? -1 : 1;
}
