import type { AttackTimings } from "../data/player";
import type { FighterIntent } from "../input/FighterIntent";

export type FighterState = "idle" | "move" | "attack" | "hit" | "ko";
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
  private hitElapsedMs = 0;

  constructor(
    attackTimings: AttackTimings,
    private readonly hitDurationMs: number,
  ) {
    this.attackTimings = attackTimings;
  }

  update(intent: FighterIntent, deltaMs: number): FighterSnapshot {
    if (this.state === "ko") {
      return this.getSnapshot();
    }

    if (this.state === "hit") {
      this.updateHit(intent, deltaMs);
    } else if (this.state === "attack") {
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

  enterHit(): FighterSnapshot {
    if (this.state !== "ko") {
      this.state = "hit";
      this.attackPhase = null;
      this.attackElapsedMs = 0;
      this.hitElapsedMs = 0;
    }

    return this.getSnapshot();
  }

  enterKo(): FighterSnapshot {
    this.state = "ko";
    this.attackPhase = null;
    this.attackElapsedMs = 0;
    this.hitElapsedMs = 0;
    return this.getSnapshot();
  }

  stop(): FighterSnapshot {
    if (this.state !== "ko") {
      this.state = "idle";
      this.attackPhase = null;
      this.attackElapsedMs = 0;
      this.hitElapsedMs = 0;
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

  private updateHit(intent: FighterIntent, deltaMs: number): void {
    this.hitElapsedMs += deltaMs;

    if (this.hitElapsedMs >= this.hitDurationMs) {
      this.state = this.hasMovement(intent) ? "move" : "idle";
      this.hitElapsedMs = 0;
    }
  }

  private hasMovement(intent: FighterIntent): boolean {
    return intent.moveX !== 0 || intent.moveY !== 0;
  }
}
