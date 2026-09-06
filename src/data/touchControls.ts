export interface TouchMovementControlConfig {
  readonly centerX: number;
  readonly centerY: number;
  readonly outerRadius: number;
  readonly knobRadius: number;
  readonly maxTravel: number;
  readonly deadZone: number;
  readonly depth: number;
}

export interface TouchAttackControlConfig {
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly depth: number;
}

export const TOUCH_MOVEMENT_CONFIG: TouchMovementControlConfig = {
  centerX: 145,
  centerY: 575,
  outerRadius: 92,
  knobRadius: 40,
  maxTravel: 54,
  deadZone: 16,
  depth: 1200,
};

export const TOUCH_ATTACK_CONFIG: TouchAttackControlConfig = {
  centerX: 1135,
  centerY: 575,
  radius: 78,
  depth: 1200,
};
