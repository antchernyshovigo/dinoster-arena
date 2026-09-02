export interface ArenaConfig {
  readonly centerX: number;
  readonly farY: number;
  readonly nearY: number;
  readonly farHalfWidth: number;
  readonly nearHalfWidth: number;
  readonly farScale: number;
  readonly nearScale: number;
  readonly depthBase: number;
}

export const ARENA_CONFIG: ArenaConfig = {
  centerX: 640,
  farY: 300,
  nearY: 650,
  farHalfWidth: 340,
  nearHalfWidth: 600,
  farScale: 0.72,
  nearScale: 1,
  depthBase: 100,
};
