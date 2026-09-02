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
