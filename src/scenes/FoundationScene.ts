import Phaser from "phaser";

import { PLAYER_CONFIG } from "../data/player";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/config";
import { KeyboardMovementInput } from "../input/KeyboardMovementInput";

const ARENA_FLOOR_Y = 540;

export class FoundationScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private movementInput!: KeyboardMovementInput;

  constructor() {
    super("foundation");
  }

  create(): void {
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const background = this.add.graphics();
    background.fillStyle(0x07111f);
    background.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    background.fillStyle(0x102a3d);
    background.fillCircle(180, 130, 260);
    background.fillStyle(0x0b2031);
    background.fillCircle(1120, 120, 320);

    background.fillStyle(0x172c36);
    background.fillRect(0, ARENA_FLOOR_Y, GAME_WIDTH, GAME_HEIGHT - ARENA_FLOOR_Y);
    background.fillStyle(0x20d28f);
    background.fillRect(0, ARENA_FLOOR_Y, GAME_WIDTH, 6);

    this.add
      .text(GAME_WIDTH / 2, 170, "DINOSTER ARENA", {
        color: "#f4fbff",
        fontFamily: "Arial, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
        stroke: "#07111f",
        strokeThickness: 10,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 260, "M1 • Движение", {
        color: "#78f0be",
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        360,
        "A / D или ← / →",
        {
          align: "center",
          color: "#b9cbd6",
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 660, "Герой не выходит за границы арены", {
        color: "#8da4b3",
        fontFamily: "monospace",
        fontSize: "20px",
      })
      .setOrigin(0.5);

    this.player = this.add.rectangle(
      GAME_WIDTH / 2,
      ARENA_FLOOR_Y - PLAYER_CONFIG.height / 2,
      PLAYER_CONFIG.width,
      PLAYER_CONFIG.height,
      0x37d6ff,
    );
    this.player.setStrokeStyle(6, 0xf4fbff);
    this.physics.add.existing(this.player);

    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    this.playerBody.setCollideWorldBounds(true);
    this.playerBody.setImmovable(true);

    this.movementInput = new KeyboardMovementInput(this);
  }

  update(): void {
    const { moveX } = this.movementInput.read();
    this.playerBody.setVelocityX(moveX * PLAYER_CONFIG.moveSpeed);
  }
}
