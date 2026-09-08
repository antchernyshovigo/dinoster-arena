import Phaser from "phaser";

import type { TouchAttackControlConfig } from "../data/touchControls";
import type { CombatIntent } from "./CombatIntent";

export class TouchCombatInput {
  private readonly button: Phaser.GameObjects.Arc;
  private readonly label: Phaser.GameObjects.Text;
  private activePointerId: number | null = null;
  private attackQueued = false;
  private enabled = true;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: TouchAttackControlConfig,
  ) {
    this.button = scene.add
      .circle(
        config.centerX,
        config.centerY,
        config.radius,
        0xff4d6d,
        0.8,
      )
      .setStrokeStyle(6, 0xf4fbff, 0.95)
      .setDepth(config.depth)
      .setInteractive(
        new Phaser.Geom.Circle(config.radius, config.radius, config.radius),
        Phaser.Geom.Circle.Contains,
      );
    this.label = scene.add
      .text(config.centerX, config.centerY, "УДАР", {
        color: "#f4fbff",
        fontFamily: "Arial, sans-serif",
        fontSize: "28px",
        fontStyle: "bold",
        stroke: "#6b1025",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(config.depth + 1);

    this.button.on("pointerdown", this.handlePointerDown, this);
    scene.input.on("pointerup", this.handlePointerUp, this);
    scene.input.on("pointerupoutside", this.handlePointerUp, this);
    scene.game.events.on(Phaser.Core.Events.BLUR, this.reset, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  read(): CombatIntent {
    const attackPressed = this.attackQueued;
    this.attackQueued = false;
    return { attackPressed };
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.reset();

    if (enabled) {
      this.button.setInteractive(
        new Phaser.Geom.Circle(
          this.config.radius,
          this.config.radius,
          this.config.radius,
        ),
        Phaser.Geom.Circle.Contains,
      );
    } else {
      this.button.disableInteractive();
    }

    this.button.setAlpha(enabled ? 1 : 0.25);
    this.label.setAlpha(enabled ? 1 : 0.25);
  }

  reset(): void {
    this.activePointerId = null;
    this.attackQueued = false;
    this.button.setFillStyle(0xff4d6d, 0.8);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.enabled || this.activePointerId !== null) {
      return;
    }

    this.activePointerId = pointer.id;
    this.attackQueued = true;
    this.button.setFillStyle(0xff8ba0, 0.95);
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointerId) {
      this.activePointerId = null;
      this.button.setFillStyle(0xff4d6d, 0.8);
    }
  }

  private destroy(): void {
    this.scene.input.off("pointerup", this.handlePointerUp, this);
    this.scene.input.off("pointerupoutside", this.handlePointerUp, this);
    this.scene.game.events.off(Phaser.Core.Events.BLUR, this.reset, this);
    this.button.removeAllListeners();
  }
}
