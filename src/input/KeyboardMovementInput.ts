import Phaser from "phaser";

import { getAxisIntent, type MovementIntent } from "./MovementIntent";

export class KeyboardMovementInput {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly aKey: Phaser.Input.Keyboard.Key;
  private readonly dKey: Phaser.Input.Keyboard.Key;
  private readonly wKey: Phaser.Input.Keyboard.Key;
  private readonly sKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("Keyboard input is unavailable");
    }

    this.cursors = keyboard.createCursorKeys();
    this.aKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.wKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.sKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  read(): MovementIntent {
    const leftPressed = this.cursors.left.isDown || this.aKey.isDown;
    const rightPressed = this.cursors.right.isDown || this.dKey.isDown;
    const upPressed = this.cursors.up.isDown || this.wKey.isDown;
    const downPressed = this.cursors.down.isDown || this.sKey.isDown;

    return {
      moveX: getAxisIntent(leftPressed, rightPressed),
      moveY: getAxisIntent(upPressed, downPressed),
    };
  }
}
