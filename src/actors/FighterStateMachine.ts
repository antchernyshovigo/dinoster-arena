import type { AttackTimings } from "../data/player";
import type { FighterIntent } from "../input/FighterIntent";

export type FighterState = "idle" | "move" | "attack";
export type AttackPhase = "startup" | "active" | "recovery";

export interface FighterSnapshot {
  readonly state: FighterState;
  readonly attackPhase: AttackPhase | null;
}

export class FighterStateMachine {
  private readonly attackTimings: AttackTimings;
  private state: FighterState = "idle";
  private attackPhase: AttackPhase | null = null;
  private attackElapsedMs = 0;

  constructor(attackTimings: AttackTimings) {
    this.attackTimings = attackTimings;
  }

  update(intent: FighterIntent, deltaMs: number): FighterSnapshot {
    if (this.state === "attack") {
      this.updateAttack(intent, deltaMs);
    } else if (intent.attackPressed) {
      this.state = "attack";
      this.attackPhase = "startup";
      this.attackElapsedMs = 0;
    } else {
      this.state = this.hasMovement(intent) ? "move" : "idle";
    }

    return this.getSnapshot();
  }

  getSnapshot(): FighterSnapshot {
    return {
      state: this.state,
      attackPhase: this.attackPhase,
    };
  }

  private updateAttack(intent: FighterIntent, deltaMs: number): void {
    this.attackElapsedMs += deltaMs;

    const activeStartsAt = this.attackTimings.startupMs;
    const recoveryStartsAt = activeStartsAt + this.attackTimings.activeMs;
    const attackEndsAt = recoveryStartsAt + this.attackTimings.recoveryMs;

    if (this.attackElapsedMs >= attackEndsAt) {
      this.state = this.hasMovement(intent) ? "move" : "idle";
      this.attackPhase = null;
      this.attackElapsedMs = 0;
    } else if (this.attackElapsedMs >= recoveryStartsAt) {
      this.attackPhase = "recovery";
    } else if (this.attackElapsedMs >= activeStartsAt) {
      this.attackPhase = "active";
    }
  }

  private hasMovement(intent: FighterIntent): boolean {
    return intent.moveX !== 0 || intent.moveY !== 0;
  }
}
