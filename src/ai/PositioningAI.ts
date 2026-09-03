import type { AIPositioningConfig } from "../data/combat";
import type { AxisIntent, MovementIntent } from "../input/MovementIntent";

export interface AIPositioningInput {
  readonly playerX: number;
  readonly playerY: number;
  readonly opponentX: number;
  readonly opponentY: number;
  readonly playerIsKo: boolean;
  readonly opponentIsKo: boolean;
}

type HorizontalMode = "approach" | "hold" | "retreat";

export class PositioningAI {
  private horizontalMode: HorizontalMode = "hold";

  constructor(private readonly config: AIPositioningConfig) {}

  update(input: AIPositioningInput): MovementIntent {
    if (input.playerIsKo || input.opponentIsKo) {
      return { moveX: 0, moveY: 0 };
    }

    const deltaX = input.playerX - input.opponentX;
    const distanceX = Math.abs(deltaX);
    this.updateHorizontalMode(distanceX);

    let moveX: AxisIntent = 0;
    if (this.horizontalMode === "approach") {
      moveX = deltaX < 0 ? -1 : 1;
    } else if (this.horizontalMode === "retreat") {
      moveX = deltaX < 0 ? 1 : -1;
    }

    const deltaY = input.playerY - input.opponentY;
    const moveY: AxisIntent =
      Math.abs(deltaY) <= this.config.yTolerance
        ? 0
        : deltaY < 0
          ? -1
          : 1;

    return { moveX, moveY };
  }

  private updateHorizontalMode(distanceX: number): void {
    if (this.horizontalMode === "approach") {
      if (distanceX <= this.config.preferredMaxDistanceX) {
        this.horizontalMode = "hold";
      }
      return;
    }

    if (this.horizontalMode === "retreat") {
      if (distanceX >= this.config.preferredMinDistanceX) {
        this.horizontalMode = "hold";
      }
      return;
    }

    if (distanceX > this.config.preferredMaxDistanceX) {
      this.horizontalMode = "approach";
    } else if (distanceX < this.config.tooCloseDistanceX) {
      this.horizontalMode = "retreat";
    }
  }
}
