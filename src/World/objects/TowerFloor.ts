import { BoxGeometry, Camera, Mesh, MeshMatcapMaterial } from "three";
import CANNON from "cannon";
import { Experience } from "../../experience/Experience";
import { PhysicsWorld, Time } from "../../experience/utils";
import { gsap } from "gsap";
import EventEmitter from "../../experience/utils/EventEmitter";

interface Props {
  positionY: number;
}
export default class TowerFloor extends EventEmitter {
  private experience: Experience;
  private camera: Camera;
  private time: Time;
  private geometry: BoxGeometry;
  private material: MeshMatcapMaterial;
  public mesh: Mesh;
  private physics: PhysicsWorld;

  public body: CANNON.Body;

  private swinging: any;
  private isFalling: boolean;
  private hasCollided: boolean;

  //

  positionY: number;

  constructor(props?: Props) {
    super();
    Object.assign(this, props);
    this.experience = new Experience();
    this.camera = this.experience.camera.camera;
    this.time = this.experience.time;
    this.physics = this.experience.physics;

    this.hasCollided = false;
    this.isFalling = false;

    this.createMesh();
    this.time.on("tick", () => this.update());
  }
  private setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
  }
  private setMaterial() {
    const color = Math.floor(Math.random() * 16777215).toString(16);

    this.material = new MeshMatcapMaterial({
      color: `#${color}`,
    });
  }
  private setBody() {
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, this.positionY + 5, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1 * 0.5, 1 * 0.5, 1 * 0.5)),
      allowSleep: true, // Enable sleeping
      sleepSpeedLimit: 0.1,
    });

    this.mesh.userData.body = this.body;
    this.body.position.copy(this.mesh.position as any);
    this.physics.world.addBody(this.body);
  }
  private swingingAnimation() {
    this.swinging = gsap.timeline({ paused: true, duration: 2 });

    this.swinging
      .from(this.mesh.position, {
        x: -2,
      })
      .fromTo(
        this.mesh.position,
        {
          x: -1.2,
          ease: "back",
        },
        {
          x: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "none",
          duration: 1,
          // ease: "power3",
        }
      );
    this.swinging.progress(0.5);
    this.swinging.play();
  }
  private createMesh() {
    this.setGeometry();
    this.setMaterial();
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, this.positionY + 2, 0);

    gsap.to(this.camera.position, {
      y: this.mesh.position.y + this.positionY / 2,
    });

    this.camera.lookAt(this.mesh.position);
    this.swingingAnimation();
  }
  public drop() {
    if (this.isFalling) return;
    this.swinging.pause();
    this.setBody();
    this.isFalling = true;

    this.body.addEventListener("collide", () => this.handleCollision());
  }
  private handleCollision() {
    if (!this.hasCollided) {
      this.hasCollided = true;
      this.isFalling = false;

      this.trigger("handleHasCollided");
    }
  }
  private update() {
    if (this.body) {
      this.mesh.position.copy(this.body.position as any);
      this.mesh.quaternion.copy(this.body.quaternion as any);
    }
  }

  public remove() {
    this.body.removeEventListener("collide", () => this.handleCollision);
  }
}
