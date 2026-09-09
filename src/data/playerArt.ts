export type PlayerAnimationState = "idle" | "move" | "attack" | "hit" | "ko";

export interface PlayerAnimationClipConfig {
  readonly key: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly frameRate: number;
  readonly repeat: number;
}

export interface PlayerArtConfig {
  readonly textureKey: string;
  readonly assetPath: string;
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly baseScale: number;
  readonly feetOriginY: number;
  readonly animations: Readonly<Record<PlayerAnimationState, PlayerAnimationClipConfig>>;
}

export const PLAYER_ART_CONFIG: PlayerArtConfig = {
  textureKey: "quartz",
  assetPath: "/assets/characters/quartz/quartz-spritesheet.png",
  frameWidth: 229,
  frameHeight: 229,
  baseScale: 0.56,
  feetOriginY: 0.93,
  animations: {
    idle: {
      key: "quartz-idle",
      startFrame: 0,
      endFrame: 5,
      frameRate: 6,
      repeat: -1,
    },
    move: {
      key: "quartz-move",
      startFrame: 6,
      endFrame: 11,
      frameRate: 10,
      repeat: -1,
    },
    attack: {
      key: "quartz-attack",
      startFrame: 12,
      endFrame: 17,
      frameRate: 10,
      repeat: 0,
    },
    hit: {
      key: "quartz-hit",
      startFrame: 18,
      endFrame: 23,
      frameRate: 24,
      repeat: 0,
    },
    ko: {
      key: "quartz-ko",
      startFrame: 24,
      endFrame: 29,
      frameRate: 8,
      repeat: 0,
    },
  },
};
