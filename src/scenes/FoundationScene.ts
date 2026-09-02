import Phaser from "phaser";

import { GAME_HEIGHT, GAME_WIDTH } from "../game/config";

export class FoundationScene extends Phaser.Scene {
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
    background.fillRect(0, 540, GAME_WIDTH, 180);
    background.fillStyle(0x20d28f);
    background.fillRect(0, 540, GAME_WIDTH, 6);

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
      .text(GAME_WIDTH / 2, 260, "Phaser-основа готова", {
        color: "#78f0be",
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        360,
        "Следующий шаг: движение одного героя\nна клавиатуре — без боя и графических ассетов",
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
      .text(GAME_WIDTH / 2, 620, "M0  •  desktop + tablet  •  Arcade Physics", {
        color: "#8da4b3",
        fontFamily: "monospace",
        fontSize: "20px",
      })
      .setOrigin(0.5);
  }
}
