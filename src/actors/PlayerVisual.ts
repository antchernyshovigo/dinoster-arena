import Phaser from "phaser";

import type { FighterSnapshot } from "./FighterStateMachine";
import type { FacingDirection } from "../combat/AttackHitbox";
import {
  PLAYER_ART_CONFIG,
  type PlayerAnimationState,
} from "../data/playerArt";

export interface PlayerVisualPose {
  readonly bodyX: number;
  readonly bodyY: number;
  readonly bodyHeight: number;
  readonly arenaScale: number;
  readonly depth: number;
  readonly facing: FacingDirection;
  readonly hitFlashing: boolean;
}

export function preloadPlayerVisual(scene: Phaser.Scene): void {
  scene.load.spritesheet(
    PLAYER_ART_CONFIG.textureKey,
    PLAYER_ART_CONFIG.assetPath,
    {
      frameWidth: PLAYER_ART_CONFIG.frameWidth,
      frameHeight: PLAYER_ART_CONFIG.frameHeight,
    },
  );
}

export class PlayerVisual {
  private readonly sprite: Phaser.GameObjects.Sprite;
  private currentAnimationState?: PlayerAnimationState;

  constructor(private readonly scene: Phaser.Scene) {
    this.createAnimations();
    this.sprite = scene.add
      .sprite(0, 0, PLAYER_ART_CONFIG.textureKey, 0)
      .setOrigin(0.5, PLAYER_ART_CONFIG.feetOriginY);
  }

  sync(snapshot: FighterSnapshot, pose: PlayerVisualPose): void {
    this.sprite
      .setPosition(
        pose.bodyX,
        pose.bodyY + (pose.bodyHeight * pose.arenaScale) / 2,
      )
      .setScale(PLAYER_ART_CONFIG.baseScale * pose.arenaScale)
      .setDepth(pose.depth)
      .setFlipX(pose.facing === "left");

    const animationState = this.getAnimationState(snapshot);
    if (animationState !== this.currentAnimationState) {
      this.sprite.play(PLAYER_ART_CONFIG.animations[animationState].key);
      this.currentAnimationState = animationState;
    }

    if (pose.hitFlashing) {
      this.sprite.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    } else if (snapshot.state === "ko") {
      this.sprite
        .setTint(0x77808c)
        .setTintMode(Phaser.TintModes.MULTIPLY);
    } else if (snapshot.state === "hit") {
      this.sprite
        .setTint(0xff8a9d)
        .setTintMode(Phaser.TintModes.MULTIPLY);
    } else {
      this.sprite.clearTint();
    }
  }

  private createAnimations(): void {
    for (const clip of Object.values(PLAYER_ART_CONFIG.animations)) {
      if (this.scene.anims.exists(clip.key)) {
        continue;
      }

      this.scene.anims.create({
        key: clip.key,
        frames: this.scene.anims.generateFrameNumbers(
          PLAYER_ART_CONFIG.textureKey,
          {
            start: clip.startFrame,
            end: clip.endFrame,
          },
        ),
        frameRate: clip.frameRate,
        repeat: clip.repeat,
      });
    }
  }

  private getAnimationState(snapshot: FighterSnapshot): PlayerAnimationState {
    return snapshot.state;
  }
}
