import { COLOR } from './constants';
import { getRandom } from './helper';

export const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export class Tetromino {
  constructor({
    shape = null,
    color = null,
    coords,
    predictCoords,
    pivot = null,
    rotation = 0,
  }) {
    this.shape = shape || getRandom(SHAPES);
    this.color = color || getRandom(COLOR);
    this.coords = coords;
    this.predictCoords = predictCoords;
    this.pivot = pivot || this.calculatePivot();
    this.rotation = rotation;
  }

  calculatePivot() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;

    if ((rows === 1 && cols === 4) || (rows === 4 && cols === 1)) {
      if (rows === 1) return [0, 1];
      if (cols === 1) return [2, 0];
    }

    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    return [centerRow, centerCol];
  }

  moveDown() {}
  moveLeft() {}
  moveRight() {}
  rotate() {}
}
