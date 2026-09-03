export type RoundState = "fighting" | "playerWon" | "playerLost";
export type KnockedOutFighter = "player" | "opponent";

export class RoundController {
  private state: RoundState = "fighting";

  finishForKnockout(knockedOut: KnockedOutFighter): RoundState {
    if (this.state === "fighting") {
      this.state = knockedOut === "opponent" ? "playerWon" : "playerLost";
    }

    return this.state;
  }

  getState(): RoundState {
    return this.state;
  }

  isFighting(): boolean {
    return this.state === "fighting";
  }
}
