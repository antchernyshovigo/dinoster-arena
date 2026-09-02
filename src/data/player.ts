export interface AttackTimings {
  readonly startupMs: number;
  readonly activeMs: number;
  readonly recoveryMs: number;
}

export interface PlayerConfig {
  readonly width: number;
  readonly height: number;
  readonly moveSpeed: number;
  readonly attackTimings: AttackTimings;
}

export const PLAYER_CONFIG: PlayerConfig = {
  width: 88,
  height: 112,
  moveSpeed: 300,
  attackTimings: {
    startupMs: 180,
    activeMs: 100,
    recoveryMs: 320,
  },
};
