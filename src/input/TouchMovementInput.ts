import Phaser from "phaser";

import type { TouchMovementControlConfig } from "../data/touchControls";
import {
  getRadialMovementIntent,
  type MovementIntent,
} from "./MovementIntent";

const IDLE_MOVEMENT: MovementIntent = { moveX: 0, moveY: 0 };

export class TouchMovementInput {
  private readonly base: Phaser.GameObjects.Arc;
  private readonly knob: Phaser.GameObjects.Arc;
  private activePointerId: number | null = null;
  private intent: MovementIntent = IDLE_MOVEMENT;
  private enabled = true;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly config: TouchMovementControlConfig,
  ) {
    this.base = scene.add
      .circle(
        config.centerX,
        config.centerY,
        config.outerRadius,
        0x102a3d,
        0.72,
      )
      .setStrokeStyle(5, 0x78f0be, 0.9)
      .setDepth(config.depth)
      .setInteractive(
        new Phaser.Geom.Circle(
          config.outerRadius,
          config.outerRadius,
          config.outerRadius,
        ),
        Phaser.Geom.Circle.Contains,
      );
    this.knob = scene.add
      .circle(
        config.centerX,
        config.centerY,
        config.knobRadius,
        0x78f0be,
        0.75,
      )
      .setStrokeStyle(4, 0xf4fbff, 0.9)
      .setDepth(config.depth + 1);

    this.base.on("pointerdown", this.handlePointerDown, this);
    scene.input.on("pointermove", this.handlePointerMove, this);
    scene.input.on("pointerup", this.handlePointerUp, this);
    scene.input.on("pointerupoutside", this.handlePointerUp, this);
    scene.game.events.on(Phaser.Core.Events.BLUR, this.reset, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  read(): MovementIntent {
    return this.intent;
  }

  isActive(): boolean {
    return this.activePointerId !== null;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.reset();

    if (enabled) {
      this.base.setInteractive(
        new Phaser.Geom.Circle(
          this.config.outerRadius,
          this.config.outerRadius,
          this.config.outerRadius,
        ),
        Phaser.Geom.Circle.Contains,
      );
    } else {
      this.base.disableInteractive();
    }

    this.base.setAlpha(enabled ? 1 : 0.25);
    this.knob.setAlpha(enabled ? 1 : 0.25);
  }

  reset(): void {
    this.activePointerId = null;
    this.intent = IDLE_MOVEMENT;
    this.knob.setPosition(this.config.centerX, this.config.centerY);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.enabled || this.activePointerId !== null) {
      return;
    }

    this.activePointerId = pointer.id;
    this.updateFromPointer(pointer);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointerId) {
      this.updateFromPointer(pointer);
    }
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.activePointerId) {
      this.reset();
    }
  }

  private updateFromPointer(pointer: Phaser.Input.Pointer): void {
    const offsetX = pointer.x - this.config.centerX;
    const offsetY = pointer.y - this.config.centerY;
    const distance = Math.hypot(offsetX, offsetY);
    const travelScale =
      distance === 0 ? 0 : Math.min(1, this.config.maxTravel / distance);

    this.knob.setPosition(
      this.config.centerX + offsetX * travelScale,
      this.config.centerY + offsetY * travelScale,
    );
    this.intent = getRadialMovementIntent(
      offsetX,
      offsetY,
      this.config.deadZone,
    );
  }

  private destroy(): void {
    this.scene.input.off("pointermove", this.handlePointerMove, this);
    this.scene.input.off("pointerup", this.handlePointerUp, this);
    this.scene.input.off("pointerupoutside", this.handlePointerUp, this);
    this.scene.game.events.off(Phaser.Core.Events.BLUR, this.reset, this);
    this.base.removeAllListeners();
  }
}
