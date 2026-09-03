import Phaser from "phaser";

import type { RestartIntent } from "./RestartIntent";

export class KeyboardRestartInput {
  private readonly enterKey: Phaser.Input.Keyboard.Key;
  private readonly rKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("Keyboard input is unavailable");
    }

    this.enterKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.rKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  read(): RestartIntent {
    return {
      restartPressed:
        Phaser.Input.Keyboard.JustDown(this.enterKey) ||
        Phaser.Input.Keyboard.JustDown(this.rKey),
    };
  }
}
