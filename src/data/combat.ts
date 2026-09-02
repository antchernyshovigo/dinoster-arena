import type { AttackTimings } from "./player";

export interface OpponentConfig {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly maxHealth: number;
  readonly hitFlashMs: number;
  readonly color: number;
  readonly hitColor: number;
  readonly attackTimings: AttackTimings;
}

export interface CombatConfig {
  readonly attackDamage: number;
  readonly opponentAttackDamage: number;
}

export interface AIPositioningConfig {
  readonly moveSpeed: number;
  readonly preferredMinDistanceX: number;
  readonly preferredMaxDistanceX: number;
  readonly tooCloseDistanceX: number;
  readonly yTolerance: number;
}

export interface OpponentCombatAIConfig {
  readonly cooldownMs: number;
  readonly minAttackDistanceX: number;
  readonly maxAttackDistanceX: number;
  readonly yTolerance: number;
}

export const OPPONENT_CONFIG: OpponentConfig = {
  x: 800,
  y: 540,
  width: 80,
  height: 108,
  maxHealth: 5,
  hitFlashMs: 120,
  color: 0xb86cff,
  hitColor: 0xffffff,
  attackTimings: {
    startupMs: 180,
    activeMs: 100,
    recoveryMs: 320,
  },
};

export const COMBAT_CONFIG: CombatConfig = {
  attackDamage: 1,
  opponentAttackDamage: 1,
};

export const AI_POSITIONING_CONFIG: AIPositioningConfig = {
  moveSpeed: 180,
  preferredMinDistanceX: 130,
  preferredMaxDistanceX: 170,
  tooCloseDistanceX: 100,
  yTolerance: 40,
};

export const OPPONENT_COMBAT_AI_CONFIG: OpponentCombatAIConfig = {
  cooldownMs: 1000,
  minAttackDistanceX: 100,
  maxAttackDistanceX: 170,
  yTolerance: 40,
};
