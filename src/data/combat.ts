export interface DummyConfig {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly maxHealth: number;
  readonly hitFlashMs: number;
  readonly color: number;
  readonly hitColor: number;
}

export interface CombatConfig {
  readonly attackDamage: number;
}

export const DUMMY_CONFIG: DummyConfig = {
  x: 800,
  y: 540,
  width: 80,
  height: 108,
  maxHealth: 5,
  hitFlashMs: 120,
  color: 0xb86cff,
  hitColor: 0xffffff,
};

export const COMBAT_CONFIG: CombatConfig = {
  attackDamage: 1,
};
