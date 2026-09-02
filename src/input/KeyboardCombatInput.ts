import Phaser from "phaser";

import type { CombatIntent } from "./CombatIntent";

export class KeyboardCombatInput {
  private readonly attackKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("Keyboard input is unavailable");
    }

    this.attackKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  read(): CombatIntent {
    return {
      attackPressed: Phaser.Input.Keyboard.JustDown(this.attackKey),
    };
  }
}
