import type { OpponentCombatAIConfig } from "../data/combat";
import type { CombatIntent } from "../input/CombatIntent";

export interface OpponentCombatAIInput {
  readonly playerX: number;
  readonly playerY: number;
  readonly opponentX: number;
  readonly opponentY: number;
  readonly isAttacking: boolean;
  readonly isHit: boolean;
  readonly playerIsKo: boolean;
  readonly opponentIsKo: boolean;
}

export class OpponentCombatAI {
  private elapsedSinceAttackMs: number;

  constructor(private readonly config: OpponentCombatAIConfig) {
    this.elapsedSinceAttackMs = config.cooldownMs;
  }

  update(input: OpponentCombatAIInput, deltaMs: number): CombatIntent {
    this.elapsedSinceAttackMs += deltaMs;

    if (
      input.isAttacking ||
      input.isHit ||
      input.playerIsKo ||
      input.opponentIsKo ||
      !this.canAttack(input)
    ) {
      return { attackPressed: false };
    }

    this.elapsedSinceAttackMs = 0;
    return { attackPressed: true };
  }

  private canAttack(input: OpponentCombatAIInput): boolean {
    const distanceX = Math.abs(input.playerX - input.opponentX);
    const distanceY = Math.abs(input.playerY - input.opponentY);

    return (
      this.elapsedSinceAttackMs >= this.config.cooldownMs &&
      distanceX >= this.config.minAttackDistanceX &&
      distanceX <= this.config.maxAttackDistanceX &&
      distanceY <= this.config.yTolerance
    );
  }
}
