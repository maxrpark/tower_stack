import { Group } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";

import { TowerFloor, GroundArea, GroundFloor, Text2D } from "./objects";
import { PhysicsWorld } from "../experience/utils";
import { StateMachine } from "./state/GameState";
import { GameOverState, IntroState, PlayingState } from "./state/states";
import { Controllers, Modal, MenuIcon } from "./utils/";

export default class World {
  private experience: Experience;
  public environment: Environment;
  private physics: PhysicsWorld;
  public debug: Debug;
  public debugFolder: GUI;

  private world: Group;
  private tower: Group;
  private addedObjects: TowerFloor[];
  private groundFloor: GroundFloor;
  private ground: GroundArea;
  private floorLevel: Text2D;
  private stateMachine: StateMachine;
  private controllers: Controllers;
  private modal: Modal;
  private menuIcon: MenuIcon;

  public currentFloor: TowerFloor | null;

  private floorY: number = 1;
  private isGameOver: boolean = false;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.physics = this.experience.physics;
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
    });

    this.floorLevel = new Text2D({
      text: 0,
      anchorX: -1.5,
      fontSize: 1,
      visible: false,
    });

    this.tower = new Group();
    this.world = new Group();
    this.addedObjects = [];

    this.createModal();
  }

  private set floorPositionY(value: number) {
    this.floorY = value;
  }

  private get floorPositionY(): number {
    return this.floorY;
  }

  private set setGameOver(value: boolean) {
    this.isGameOver = value;
  }

  private get setGameOver(): boolean {
    return this.isGameOver;
  }

  private addFloor() {
    if (this.currentFloor)
      this.floorPositionY = this.currentFloor.mesh.position.y;
    this.currentFloor = new TowerFloor({ positionY: this.floorPositionY });

    this.currentFloor.on("handleHasCollided", () => {
      this.addedObjects.push(this.currentFloor!);
      this.updateFloorLevelText();
      this.addFloor();
    });

    this.tower.add(this.currentFloor.mesh);
  }

  private updateFloorLevelText() {
    this.floorLevel.updateText(this.addedObjects.length);
    this.floorLevel.updatePositionY(-this.currentFloor!.mesh.position.y - 0.5);
    this.floorLevel.isVisible(this.addedObjects.length > 0);
  }
  public createWorld() {
    this.groundFloor = new GroundFloor();
    this.ground = new GroundArea();
    this.createMenuIcon();
    this.gameControllers();
    this.handleGroundCollision();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      this.ground.mesh,
      // @ts-ignore
      this.floorLevel.instance
    );
    this.experience.scene.add(this.world);
  }

  public worldIntro() {}

  private handleGroundCollision() {
    this.ground.groundBody.addEventListener("collide", (event: any) => {
      const collidedBody = event.body;

      if (!collidedBody || this.tower.children.length === 0) return;
      const objectInTower = this.tower.children.find((child) => {
        return child.userData.body === collidedBody;
      });

      if (!this.isGameOver && objectInTower) {
        this.gameEnded();

        this.stateMachine.change(new GameOverState());
      }
    });
  }

  createModal() {
    this.modal = new Modal();
    this.modal.on("handleGameStartClick", () => this.startNewGame());

    // Game Over Modal
    this.modal.on("handleGameRestart", () => this.resetGame());
  }

  createMenuIcon() {
    this.menuIcon = new MenuIcon();
    this.menuIcon.classAdd("hide-icon");

    this.menuIcon.on("handleMenuClick", () => {
      this.modal.display("flex");
      this.menuIcon.classRemove("hide-icon");
    });
  }

  private gameControllers() {
    this.controllers = new Controllers();

    this.controllers.on("controllerDrop", () => {
      if (this.isGameOver) return;
      this.currentFloor!.drop();
    });
    this.controllers.on("controllerPause", () => {
      if (this.isGameOver) return;
    });

    this.controllers.on("controllerPlay", () => {
      if (this.isGameOver) {
        this.resetGame();
      } else {
        this.startNewGame();
      }
    });

    this.modal.on("handleContinue", () => {
      this.menuIcon.classRemove("hide-icon");
      this.modal.display("none");
    });

    this.modal.on("handleExit", () => {
      this.menuIcon.classRemove("hide-icon");
      this.stateMachine.change(new IntroState());
    });
  }

  startNewGame() {
    this.modal.pauseMode();
    this.modal.display("none");
    this.menuIcon.classAdd("hide-icon");
    this.floorLevel.isVisible(false);
    this.stateMachine.change(new PlayingState());
  }

  public setGameStart(): void {
    this.floorPositionY = 1;

    this.addFloor();
    this.setGameOver = false;
    this.controllers.showPlayButtons();
    this.floorLevel.updatePositionY(-1);
  }

  gameEnded() {
    this.tower.remove(this.currentFloor!.mesh);

    if (!this.isGameOver) {
      this.controllers.hidePlayButtons();
      this.setGameOver = true;
    }

    this.modal.gameOver({ score: this.addedObjects.length });
  }

  resetGame() {
    for (const object of this.addedObjects) {
      object.remove();
      this.physics.world.remove(object.body);
      this.tower.remove(object.mesh);
    }

    for (const object of this.tower.children) {
      this.tower.remove(object);
    }

    this.currentFloor = null;
    this.addedObjects.splice(0, this.addedObjects.length);
    this.floorLevel.updateText(0);

    this.startNewGame(); // Move to it own state
    // this.stateMachine.change(new PlayingState());
  }

  update() {}
}
