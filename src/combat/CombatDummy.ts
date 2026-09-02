import type Phaser from "phaser";

import type { ArenaConfig } from "../data/arena";
import type { DummyConfig } from "../data/combat";
import { clampActorToArena } from "../game/arenaPerspective";

export class CombatDummy {
  readonly hurtbox: Phaser.GameObjects.Zone;

  private readonly body: Phaser.Physics.Arcade.Body;
  private readonly visual: Phaser.GameObjects.Rectangle;
  private readonly healthLabel: Phaser.GameObjects.Text;
  private health: number;
  private hitFlash?: Phaser.Time.TimerEvent;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: DummyConfig,
    arenaConfig: ArenaConfig,
  ) {
    this.health = config.maxHealth;

    const position = clampActorToArena(
      config.x,
      config.y,
      config.width,
      config.height,
      arenaConfig,
    );

    this.visual = scene.add
      .rectangle(
        position.x,
        position.y,
        config.width,
        config.height,
        config.color,
      )
      .setStrokeStyle(5, 0xf4fbff)
      .setScale(position.scale)
      .setDepth(position.depth);

    this.hurtbox = scene.add.zone(
      position.x,
      position.y,
      config.width * position.scale,
      config.height * position.scale,
    );
    scene.physics.add.existing(this.hurtbox);
    this.body = this.hurtbox.body as Phaser.Physics.Arcade.Body;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(
      config.width * position.scale,
      config.height * position.scale,
    );
    this.body.reset(position.x, position.y);

    this.healthLabel = scene.add
      .text(
        position.x,
        position.y - (config.height * position.scale) / 2 - 24,
        "",
        {
          color: "#f4fbff",
          fontFamily: "monospace",
          fontSize: "20px",
          stroke: "#07111f",
          strokeThickness: 5,
        },
      )
      .setOrigin(0.5)
      .setDepth(position.depth + 1);
    this.updateHealthLabel();
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.updateHealthLabel();

    this.hitFlash?.remove(false);
    this.visual.setFillStyle(this.config.hitColor);
    this.hitFlash = this.scene.time.delayedCall(this.config.hitFlashMs, () => {
      this.visual.setFillStyle(this.config.color);
      this.hitFlash = undefined;
    });
  }

  private updateHealthLabel(): void {
    this.healthLabel.setText(`DUMMY ${this.health}/${this.config.maxHealth}`);
  }
}
