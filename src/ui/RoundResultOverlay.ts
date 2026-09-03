import Phaser from "phaser";

import type { RoundState } from "../game/RoundController";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/config";

export class RoundResultOverlay {
  private readonly container: Phaser.GameObjects.Container;
  private readonly resultLabel: Phaser.GameObjects.Text;
  private readonly restartButton: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, onRestart: () => void) {
    const backdrop = scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x030913,
      0.72,
    );
    this.resultLabel = scene.add
      .text(GAME_WIDTH / 2, 315, "", {
        color: "#f4fbff",
        fontFamily: "Arial, sans-serif",
        fontSize: "76px",
        fontStyle: "bold",
        stroke: "#07111f",
        strokeThickness: 10,
      })
      .setOrigin(0.5);
    this.restartButton = scene.add
      .rectangle(GAME_WIDTH / 2, 455, 420, 104, 0x20d28f)
      .setStrokeStyle(6, 0xf4fbff);
    const buttonLabel = scene.add
      .text(GAME_WIDTH / 2, 455, "ИГРАТЬ ЕЩЁ", {
        color: "#07111f",
        fontFamily: "Arial, sans-serif",
        fontSize: "36px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    const keyboardHint = scene.add
      .text(GAME_WIDTH / 2, 535, "Enter или R", {
        color: "#b9cbd6",
        fontFamily: "monospace",
        fontSize: "22px",
      })
      .setOrigin(0.5);

    this.restartButton
      .on("pointerover", () => this.restartButton.setFillStyle(0x78f0be))
      .on("pointerout", () => this.restartButton.setFillStyle(0x20d28f))
      .on("pointerdown", onRestart);

    this.container = scene.add
      .container(0, 0, [
        backdrop,
        this.resultLabel,
        this.restartButton,
        buttonLabel,
        keyboardHint,
      ])
      .setDepth(2000)
      .setVisible(false);
  }

  show(state: RoundState): void {
    if (state === "fighting") {
      return;
    }

    this.resultLabel
      .setText(state === "playerWon" ? "ПОБЕДА!" : "ПОРАЖЕНИЕ")
      .setColor(state === "playerWon" ? "#78f0be" : "#ff6b7f");
    this.restartButton
      .setFillStyle(0x20d28f)
      .setInteractive({ useHandCursor: true });
    this.container.setVisible(true);
  }
}
