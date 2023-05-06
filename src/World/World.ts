import { Group, Mesh, Object3D } from "three";
import { Experience } from "../experience/Experience";
import { Environment } from "./Environment";
import { TowerFloor, GroundArea, GroundFloor, Text2D } from "./objects";
import Debug from "../experience/utils/Debug";
import GUI from "lil-gui";
import { gsap } from "gsap";
import { PhysicsWorld } from "../experience/utils";
import {
  // StartState,
  // PlayingState,
  // GameOverState,
  // ResetState,
  StateMachine,
} from "./state/GameState";
import { PlayingState, StartState } from "./state/states";

export default class World {
  experience: Experience;
  environment: Environment;
  physics: PhysicsWorld;
  world: Group;
  tower: Group;
  addedObjects: TowerFloor[];
  ground: GroundArea;
  groundFloor: GroundFloor;
  debug: Debug;
  debugFolder: GUI;
  floorY: number;
  currentFloor: TowerFloor;

  floorLevel: Text2D;
  gameOver: boolean;

  stateMachine: StateMachine;

  constructor() {
    this.experience = new Experience();
    this.stateMachine = this.experience.stateMachine;
    this.debug = this.experience.debug;
    this.physics = this.experience.physics;
    this.environment = new Environment({
      hasAmbientLight: true,
      hasDirectionalLight: true,
    });

    this.floorLevel = new Text2D({ text: 0, anchorX: -1.5, fontSize: 1 });

    this.tower = new Group();
    this.world = new Group();

    this.gameOver = false;
    this.addedObjects = [];

    this.debugPanel();
  }

  setFloorY(y: number) {
    this.floorY = y;
  }

  addFloor() {
    if (this.currentFloor) this.floorY = this.currentFloor.mesh.position.y;
    this.currentFloor = new TowerFloor({ positionY: this.floorY });
    this.currentFloor.on("handleHasCollided", () => {
      this.addedObjects.push(this.currentFloor);
      this.updateFloorLevelText();

      this.addFloor();
    });
    this.tower.add(this.currentFloor.mesh);
  }

  updateFloorLevelText() {
    this.floorLevel.updateText(this.addedObjects.length);
    this.floorLevel.updatePositionY(-this.currentFloor.mesh.position.y - 0.5);
    this.floorLevel.instance.visible = this.addedObjects.length > 0;
  }
  createWorld() {
    this.groundFloor = new GroundFloor();
    this.ground = new GroundArea();

    this.world.add(
      this.tower,
      this.groundFloor.mesh,
      this.ground.mesh,
      // @ts-ignore
      this.floorLevel.instance
    );
    this.experience.scene.add(this.world);
  }

  startNewGame() {
    this.stateMachine.change(new PlayingState());
  }

  debugPanel() {
    const debugProps = {
      reset: () => this.reset(),
      newGame: () => this.startNewGame(),
    };

    this.debugFolder = this.debug.ui.addFolder("towers");
    this.debugFolder.add(debugProps, "reset");
    this.debugFolder.add(debugProps, "newGame");
  }

  handleGroundCollision(
    callback: (objectInTower: Object3D | undefined) => void
  ) {
    this.ground.groundBody.addEventListener("collide", (event: any) => {
      const collidedBody = event.body;

      if (!collidedBody || this.tower.children.length === 0) return;

      const objectInTower = this.tower.children.find((child) => {
        return child.userData.body === collidedBody;
      });

      callback(objectInTower);
    });
  }

  gameEnded() {
    this.gameOver = true;
    this.tower.remove(this.currentFloor.mesh);
  }

  reset() {
    for (const object of this.addedObjects) {
      object.remove();
      this.physics.world.remove(object.body);
      this.tower.remove(object.mesh);
    }

    this.floorY = 2;
    this.addedObjects.splice(0, this.addedObjects.length);
    this.updateFloorLevelText();
  }

  update() {}
}
