import { Badge, ItemTypes } from "../ts/globalTs";

const badges: Badge[] = [
  {
    id: 1,
    src: "",
    isCollected: false,
    name: "City Stroller",
    text: "Take your first stroll through the bustling city streets",
    experience: 5,
    typeCollection: false,
    totalToCollect: 0,
    hasCollected: 0,
    type: ItemTypes.ACTIONS,
  },
  {
    id: 2,
    src: "",
    isCollected: false,
    name: "Sky High Challenger",
    text: "Embark on your first tower stacking adventure",
    experience: 5,
    typeCollection: false,
    totalToCollect: 0,
    hasCollected: 0,
    type: ItemTypes.ACTIONS,
  },
  {
    id: 3,
    src: "",
    isCollected: false,
    name: "Treasure Seeker",
    text: "Discover your first hidden treasure item",
    experience: 5,
    typeCollection: true,
    totalToCollect: 1,
    hasCollected: 0,
    type: ItemTypes.FRUIT,
  },
  {
    id: 4,
    src: "",
    isCollected: false,
    name: "Master Collector",
    text: "Collect all the precious treasures",
    experience: 5,
    typeCollection: true,
    totalToCollect: 4,
    hasCollected: 0,
    type: ItemTypes.FRUIT,
  },
  {
    id: 5,
    src: "",
    isCollected: false,
    name: "Key Master",
    text: "Obtain your first mystical key",
    experience: 5,
    typeCollection: true,
    totalToCollect: 1,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
  {
    id: 6,
    src: "",
    isCollected: false,
    name: "Car owner",
    text: "Collect all the keys to unlock the car",
    experience: 5,
    typeCollection: true,
    totalToCollect: 3,
    hasCollected: 0,
    type: ItemTypes.KEY,
  },
  {
    id: 7,
    src: "",
    isCollected: false,
    name: "Tower Novice",
    text: "Reach the 5th level in the challenging tower stacking game",
    experience: 5,
    typeCollection: true,
    totalToCollect: 5,
    hasCollected: 0,
    type: ItemTypes.TOWER_GAME,
  },
  {
    id: 8,
    src: "",
    isCollected: false,
    name: "Tower Pro",
    text: "Show your skills and conquer the 10th level in the tower stacking game",
    experience: 10,
    typeCollection: true,
    totalToCollect: 10,
    hasCollected: 0,
    type: ItemTypes.TOWER_GAME,
  },
  {
    id: 9,
    src: "",
    isCollected: false,
    name: "Tower Champion",
    text: "Climb to the heights and reach the 15th level in the tower stacking game",
    experience: 15,
    typeCollection: true,
    totalToCollect: 15,
    hasCollected: 0,
    type: ItemTypes.TOWER_GAME,
  },
  {
    id: 10,
    src: "",
    isCollected: false,
    name: "Tower Master",
    text: "Prove your tower stacking prowess by conquering the 20th level",
    experience: 20,
    typeCollection: true,
    totalToCollect: 20,
    hasCollected: 0,
    type: ItemTypes.TOWER_GAME,
  },
  {
    id: 11,
    src: "",
    isCollected: false,
    name: "The driver",
    text: "Take your first drive around the city",
    experience: 10,
    typeCollection: false,
    totalToCollect: 0,
    hasCollected: 0,
    type: ItemTypes.ACTIONS,
  },
];

export default badges;
