import type Phaser from "phaser";

export type FacingDirection = "left" | "right";

export function getFacingDirection(
  current: FacingDirection,
  moveX: number,
): FacingDirection {
  if (moveX < 0) {
    return "left";
  }

  if (moveX > 0) {
    return "right";
  }

  return current;
}

export interface AttackHitboxConfig {
  readonly width: number;
  readonly height: number;
  readonly forwardOffset: number;
  readonly verticalOffset: number;
  readonly debugColor: number;
}

export interface AttackHitboxPose {
  readonly playerX: number;
  readonly playerY: number;
  readonly playerScale: number;
  readonly playerDepth: number;
  readonly facing: FacingDirection;
  readonly active: boolean;
}

export const PLAYER_ATTACK_HITBOX_CONFIG: AttackHitboxConfig = {
  width: 112,
  height: 70,
  forwardOffset: 92,
  verticalOffset: 0,
  debugColor: 0xff4d6d,
};

export class AttackHitbox {
  private readonly zone: Phaser.GameObjects.Zone;
  private readonly body: Phaser.Physics.Arcade.Body;
  private readonly debugFrame: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    private readonly config: AttackHitboxConfig,
  ) {
    this.zone = scene.add.zone(0, 0, config.width, config.height);
    scene.physics.add.existing(this.zone);

    this.body = this.zone.body as Phaser.Physics.Arcade.Body;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.debugShowBody = false;
    this.body.enable = false;

    this.debugFrame = scene.add
      .rectangle(0, 0, config.width, config.height, config.debugColor, 0.12)
      .setStrokeStyle(3, config.debugColor)
      .setVisible(false);
  }

  sync(pose: AttackHitboxPose): void {
    const direction = pose.facing === "right" ? 1 : -1;
    const width = this.config.width * pose.playerScale;
    const height = this.config.height * pose.playerScale;
    const x =
      pose.playerX + direction * this.config.forwardOffset * pose.playerScale;
    const y = pose.playerY + this.config.verticalOffset * pose.playerScale;

    this.zone.setPosition(x, y).setSize(width, height);
    this.body.setSize(width, height);
    this.body.reset(x, y);
    this.body.enable = pose.active;

    this.debugFrame
      .setPosition(x, y)
      .setDisplaySize(width, height)
      .setDepth(pose.playerDepth + 1)
      .setVisible(pose.active);
  }
}
