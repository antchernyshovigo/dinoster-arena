export interface PlayerConfig {
  readonly width: number;
  readonly height: number;
  readonly moveSpeed: number;
}

export const PLAYER_CONFIG: PlayerConfig = {
  width: 88,
  height: 112,
  moveSpeed: 300,
};
