import type Phaser from "phaser";

import type { FighterSnapshot } from "../actors/FighterStateMachine";
import type { ArenaConfig } from "../data/arena";
import type { OpponentConfig } from "../data/combat";
import { clampActorToArena } from "../game/arenaPerspective";
import { applyDamage, type DamageResult } from "./health";

export class OpponentActor {
  readonly hurtbox: Phaser.GameObjects.Zone;

  private readonly body: Phaser.Physics.Arcade.Body;
  private readonly visual: Phaser.GameObjects.Rectangle;
  private readonly healthLabel: Phaser.GameObjects.Text;
  private health: number;
  private pose: { x: number; y: number; scale: number; depth: number };
  private stateText = "IDLE";

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: OpponentConfig,
    private readonly arenaConfig: ArenaConfig,
  ) {
    this.health = config.maxHealth;

    const position = clampActorToArena(
      config.x,
      config.y,
      config.width,
      config.height,
      arenaConfig,
    );
    this.pose = position;

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

  takeDamage(amount: number): DamageResult {
    const result = applyDamage(this.health, this.config.maxHealth, amount);
    if (result.damageApplied) {
      this.health = result.remainingHealth;
      this.updateHealthLabel();
    }

    return result;
  }

  updateStatePresentation(snapshot: FighterSnapshot): void {
    if (snapshot.state === "ko") {
      this.stateText = "KO";
      this.visual.setFillStyle(this.config.koColor);
    } else if (snapshot.state === "hit") {
      this.stateText = "HIT";
      this.visual.setFillStyle(this.config.hitColor);
    } else if (snapshot.state === "attack") {
      this.stateText = `ATTACK ${snapshot.attackPhase ?? "startup"}`.toUpperCase();
      this.visual.setFillStyle(this.config.color);
    } else {
      this.stateText = snapshot.state.toUpperCase();
      this.visual.setFillStyle(this.config.color);
    }
    this.updateHealthLabel();
  }

  move(velocityX: number, velocityY: number, deltaMs: number): void {
    const deltaSeconds = deltaMs / 1000;
    const position = clampActorToArena(
      this.pose.x + velocityX * deltaSeconds,
      this.pose.y + velocityY * deltaSeconds,
      this.config.width,
      this.config.height,
      this.arenaConfig,
    );
    const width = this.config.width * position.scale;
    const height = this.config.height * position.scale;
    this.pose = position;

    this.hurtbox.setPosition(position.x, position.y).setSize(width, height);
    this.body.setSize(width, height);
    this.body.reset(position.x, position.y);

    this.visual
      .setPosition(position.x, position.y)
      .setScale(position.scale)
      .setDepth(position.depth);
    this.healthLabel
      .setPosition(position.x, position.y - height / 2 - 24)
      .setDepth(position.depth + 1);
  }

  getPosition(): { readonly x: number; readonly y: number } {
    return this.pose;
  }

  getPose(): {
    readonly x: number;
    readonly y: number;
    readonly scale: number;
    readonly depth: number;
  } {
    return this.pose;
  }

  private updateHealthLabel(): void {
    this.healthLabel.setText(
      `OPPONENT ${this.health}/${this.config.maxHealth} • ${this.stateText}`,
    );
  }
}
