import Phaser from "phaser";

import { ARENA_CONFIG } from "../data/arena";
import { PLAYER_CONFIG } from "../data/player";
import { clampActorToArena } from "../game/arenaPerspective";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/config";
import { getMovementVelocity } from "../game/movement";
import { KeyboardMovementInput } from "../input/KeyboardMovementInput";

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

    const arenaPoints = [
      new Phaser.Math.Vector2(
        ARENA_CONFIG.centerX - ARENA_CONFIG.farHalfWidth,
        ARENA_CONFIG.farY,
      ),
      new Phaser.Math.Vector2(
        ARENA_CONFIG.centerX + ARENA_CONFIG.farHalfWidth,
        ARENA_CONFIG.farY,
      ),
      new Phaser.Math.Vector2(
        ARENA_CONFIG.centerX + ARENA_CONFIG.nearHalfWidth,
        ARENA_CONFIG.nearY,
      ),
      new Phaser.Math.Vector2(
        ARENA_CONFIG.centerX - ARENA_CONFIG.nearHalfWidth,
        ARENA_CONFIG.nearY,
      ),
    ];

    background.fillStyle(0x173542);
    background.fillPoints(arenaPoints, true);
    background.lineStyle(7, 0x20d28f, 1);
    background.strokePoints(arenaPoints, true);

    background.lineStyle(2, 0x2c5860, 0.8);
    for (const progress of [0.25, 0.5, 0.75]) {
      const y = Phaser.Math.Linear(ARENA_CONFIG.farY, ARENA_CONFIG.nearY, progress);
      const halfWidth = Phaser.Math.Linear(
        ARENA_CONFIG.farHalfWidth,
        ARENA_CONFIG.nearHalfWidth,
        progress,
      );
      background.lineBetween(
        ARENA_CONFIG.centerX - halfWidth,
        y,
        ARENA_CONFIG.centerX + halfWidth,
        y,
      );
    }

    this.add
      .text(GAME_WIDTH / 2, 82, "DINOSTER ARENA", {
        color: "#f4fbff",
        fontFamily: "Arial, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
        stroke: "#07111f",
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setDepth(1000);

    this.add
      .text(GAME_WIDTH / 2, 155, "M1.5 • 2.5D-арена", {
        color: "#78f0be",
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
      })
      .setOrigin(0.5)
      .setDepth(1000);

    this.add
      .text(
        GAME_WIDTH / 2,
        215,
        "WASD или стрелки",
        {
          align: "center",
          color: "#b9cbd6",
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5)
      .setDepth(1000);

    this.player = this.add.rectangle(
      GAME_WIDTH / 2,
      ARENA_CONFIG.nearY - PLAYER_CONFIG.height / 2,
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
    const position = clampActorToArena(
      this.player.x,
      this.player.y,
      PLAYER_CONFIG.width,
      PLAYER_CONFIG.height,
      ARENA_CONFIG,
    );
    this.player.setPosition(position.x, position.y);
    this.player.setScale(position.scale);
    this.player.setDepth(position.depth);

    const { moveX, moveY } = this.movementInput.read();
    const velocity = getMovementVelocity(moveX, moveY, PLAYER_CONFIG.moveSpeed);
    this.playerBody.setVelocity(velocity.x, velocity.y);
  }
}
