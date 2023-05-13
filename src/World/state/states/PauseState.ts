import GameState from "../GameState";
import { Experience } from "../../../experience/Experience";
import World from "../../World";
import { StatesNames } from "../GameState";

export default class PausedState extends GameState {
  private experience: Experience;
  private world: World;
  constructor() {
    super(StatesNames.RESTART_GAME);

    this.experience = new Experience();
    this.world = this.experience.world;
  }
  public enter(): void {
    this.reset();
  }
  public update(): void {}
  public exit(): void {}

  public createWorld(): void {}
  public intro(): void {}
  public start(): void {}
  public playing(): void {}
  public paused(): void {}
  public gameOver(): void {}
  public reset(): void {}
}