import Phaser from "phaser";

export interface MovementIntent {
  readonly moveX: -1 | 0 | 1;
}

export class KeyboardMovementInput {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly aKey: Phaser.Input.Keyboard.Key;
  private readonly dKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("Keyboard input is unavailable");
    }

    this.cursors = keyboard.createCursorKeys();
    this.aKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  read(): MovementIntent {
    const leftPressed = this.cursors.left.isDown || this.aKey.isDown;
    const rightPressed = this.cursors.right.isDown || this.dKey.isDown;
    let moveX: MovementIntent["moveX"] = 0;

    if (leftPressed !== rightPressed) {
      moveX = leftPressed ? -1 : 1;
    }

    return { moveX };
  }
}
