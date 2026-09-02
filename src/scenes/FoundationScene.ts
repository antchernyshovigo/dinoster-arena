import Phaser from "phaser";

import { OpponentCombatAI } from "../ai/OpponentCombatAI";
import { PositioningAI } from "../ai/PositioningAI";
import {
  FighterStateMachine,
  type FighterSnapshot,
} from "../actors/FighterStateMachine";
import {
  AttackHitbox,
  type FacingDirection,
  getFacingDirection,
  OPPONENT_ATTACK_HITBOX_CONFIG,
  PLAYER_ATTACK_HITBOX_CONFIG,
} from "../combat/AttackHitbox";
import { OpponentActor } from "../combat/OpponentActor";
import { ARENA_CONFIG } from "../data/arena";
import {
  AI_POSITIONING_CONFIG,
  COMBAT_CONFIG,
  OPPONENT_COMBAT_AI_CONFIG,
  OPPONENT_CONFIG,
} from "../data/combat";
import { PLAYER_CONFIG } from "../data/player";
import { clampActorToArena } from "../game/arenaPerspective";
import { GAME_HEIGHT, GAME_WIDTH } from "../game/config";
import { getMovementVelocity } from "../game/movement";
import type { FighterIntent } from "../input/FighterIntent";
import { KeyboardCombatInput } from "../input/KeyboardCombatInput";
import { KeyboardMovementInput } from "../input/KeyboardMovementInput";

export class FoundationScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private playerBody!: Phaser.Physics.Arcade.Body;
  private movementInput!: KeyboardMovementInput;
  private combatInput!: KeyboardCombatInput;
  private fighterState!: FighterStateMachine;
  private attackHitbox!: AttackHitbox;
  private opponent!: OpponentActor;
  private opponentPositioningAI!: PositioningAI;
  private opponentCombatAI!: OpponentCombatAI;
  private opponentState!: FighterStateMachine;
  private opponentAttackHitbox!: AttackHitbox;
  private stateLabel!: Phaser.GameObjects.Text;
  private playerHealthLabel!: Phaser.GameObjects.Text;
  private playerHealth = 0;
  private playerHitFlash?: Phaser.Time.TimerEvent;
  private facing: FacingDirection = "right";
  private opponentFacing: FacingDirection = "left";

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
      .text(GAME_WIDTH / 2, 155, "M3.2a • Player damage", {
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
        "WASD / стрелки • Пробел — атака",
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

    this.stateLabel = this.add
      .text(GAME_WIDTH / 2, 258, "СТОИТ", {
        color: "#b9cbd6",
        fontFamily: "monospace",
        fontSize: "20px",
      })
      .setOrigin(0.5)
      .setDepth(1000);

    this.playerHealth = Math.min(
      PLAYER_CONFIG.maxHealth,
      Math.max(0, PLAYER_CONFIG.initialHealth),
    );
    this.playerHealthLabel = this.add
      .text(32, 32, "", {
        color: "#f4fbff",
        fontFamily: "monospace",
        fontSize: "24px",
        stroke: "#07111f",
        strokeThickness: 6,
      })
      .setDepth(1000);
    this.updatePlayerHealthLabel();

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
    this.combatInput = new KeyboardCombatInput(this);
    this.fighterState = new FighterStateMachine(PLAYER_CONFIG.attackTimings);
    this.attackHitbox = new AttackHitbox(
      this,
      PLAYER_ATTACK_HITBOX_CONFIG,
    );
    this.opponent = new OpponentActor(this, OPPONENT_CONFIG, ARENA_CONFIG);
    this.opponentPositioningAI = new PositioningAI(AI_POSITIONING_CONFIG);
    this.opponentCombatAI = new OpponentCombatAI(OPPONENT_COMBAT_AI_CONFIG);
    this.opponentState = new FighterStateMachine(OPPONENT_CONFIG.attackTimings);
    this.opponentAttackHitbox = new AttackHitbox(
      this,
      OPPONENT_ATTACK_HITBOX_CONFIG,
    );
  }

  update(_time: number, delta: number): void {
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
    this.playerBody.updateFromGameObject();

    const opponentPosition = this.opponent.getPosition();
    const previousOpponentSnapshot = this.opponentState.getSnapshot();
    const opponentMovementIntent =
      previousOpponentSnapshot.state === "attack"
        ? { moveX: 0, moveY: 0 } as const
        : this.opponentPositioningAI.update({
            playerX: position.x,
            playerY: position.y,
            opponentX: opponentPosition.x,
            opponentY: opponentPosition.y,
          });
    const opponentCombatIntent = this.opponentCombatAI.update(
      {
        playerX: position.x,
        playerY: position.y,
        opponentX: opponentPosition.x,
        opponentY: opponentPosition.y,
        isAttacking: previousOpponentSnapshot.state === "attack",
      },
      delta,
    );
    if (previousOpponentSnapshot.state !== "attack") {
      this.opponentFacing = getFacingDirection(
        this.opponentFacing,
        position.x - opponentPosition.x,
      );
    }
    const opponentIntent: FighterIntent = {
      ...opponentMovementIntent,
      ...opponentCombatIntent,
    };
    const opponentSnapshot = this.opponentState.update(opponentIntent, delta);
    const opponentVelocity =
      opponentSnapshot.state === "attack"
        ? { x: 0, y: 0 }
        : getMovementVelocity(
            opponentIntent.moveX,
            opponentIntent.moveY,
            AI_POSITIONING_CONFIG.moveSpeed,
          );
    this.opponent.move(opponentVelocity.x, opponentVelocity.y, delta);
    this.opponent.updateStatePresentation(opponentSnapshot);
    const opponentPose = this.opponent.getPose();
    this.opponentAttackHitbox.sync({
      playerX: opponentPose.x,
      playerY: opponentPose.y,
      playerScale: opponentPose.scale,
      playerDepth: opponentPose.depth,
      facing: this.opponentFacing,
      active:
        opponentSnapshot.state === "attack" &&
        opponentSnapshot.attackPhase === "active",
    });
    if (this.opponentAttackHitbox.tryHit(this.player)) {
      this.takePlayerDamage(COMBAT_CONFIG.opponentAttackDamage);
    }

    const movementIntent = this.movementInput.read();
    const combatIntent = this.combatInput.read();
    const intent: FighterIntent = { ...movementIntent, ...combatIntent };
    const previousSnapshot = this.fighterState.getSnapshot();
    if (previousSnapshot.state !== "attack" && intent.moveX !== 0) {
      this.facing = getFacingDirection(this.facing, intent.moveX);
    }

    const snapshot = this.fighterState.update(intent, delta);
    const velocity =
      snapshot.state === "attack"
        ? { x: 0, y: 0 }
        : getMovementVelocity(intent.moveX, intent.moveY, PLAYER_CONFIG.moveSpeed);
    this.playerBody.setVelocity(velocity.x, velocity.y);
    this.updateFighterPresentation(snapshot);
    this.attackHitbox.sync({
      playerX: position.x,
      playerY: position.y,
      playerScale: position.scale,
      playerDepth: position.depth,
      facing: this.facing,
      active: snapshot.state === "attack" && snapshot.attackPhase === "active",
    });
    if (this.attackHitbox.tryHit(this.opponent.hurtbox)) {
      this.opponent.takeDamage(COMBAT_CONFIG.attackDamage);
    }
  }

  private updateFighterPresentation(snapshot: FighterSnapshot): void {
    if (snapshot.state === "attack") {
      const phaseLabels = {
        startup: "АТАКА • ПОДГОТОВКА",
        active: "АТАКА • УДАР",
        recovery: "АТАКА • ВОССТАНОВЛЕНИЕ",
      } as const;
      const phase = snapshot.attackPhase ?? "startup";

      this.player.setFillStyle(0xffb43c);
      this.stateLabel.setText(phaseLabels[phase]);
      return;
    }

    if (snapshot.state === "move") {
      this.player.setFillStyle(0x54e6a2);
      this.stateLabel.setText("ДВИЖЕНИЕ");
      return;
    }

    this.player.setFillStyle(0x37d6ff);
    this.stateLabel.setText("СТОИТ");
  }

  private takePlayerDamage(amount: number): void {
    this.playerHealth = Math.min(
      PLAYER_CONFIG.maxHealth,
      Math.max(0, this.playerHealth - amount),
    );
    this.updatePlayerHealthLabel();

    this.playerHitFlash?.remove(false);
    this.player.setStrokeStyle(12, 0xffffff);
    this.playerHitFlash = this.time.delayedCall(PLAYER_CONFIG.hitFlashMs, () => {
      this.player.setStrokeStyle(6, 0xf4fbff);
      this.playerHitFlash = undefined;
    });
  }

  private updatePlayerHealthLabel(): void {
    this.playerHealthLabel.setText(
      `PLAYER ${this.playerHealth}/${PLAYER_CONFIG.maxHealth}`,
    );
  }
}
