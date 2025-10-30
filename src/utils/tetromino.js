import { COLOR, SPAWN_CELL_COL, MOVES, COLLISION, SHAPES } from './constants';
import { getRandom, hasCollided } from './helper';

class PieceBag {
  constructor() {
    this.shapeBag = [];
    this.colorBag = [];
  }

  getNextShape() {
    if (this.shapeBag.length === 0) {
      this.shapeBag = Object.keys(SHAPES);
      // Shuffle the bag
      for (let i = this.shapeBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.shapeBag[i], this.shapeBag[j]] = [
          this.shapeBag[j],
          this.shapeBag[i],
        ];
      }
    }
    return SHAPES[this.shapeBag.pop()];
  }

  getNextColor() {
    if (this.colorBag.length === 0) {
      this.colorBag = Object.values(COLOR);
      // Shuffle the bag
      for (let i = this.colorBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.colorBag[i], this.colorBag[j]] = [
          this.colorBag[j],
          this.colorBag[i],
        ];
      }
    }
    return this.colorBag.pop();
  }
}

const pieceBag = new PieceBag();

export class Tetromino {
  constructor({
    shape = null,
    color = null,
    coords = null, // Array of tuples ex: [[0, 2], [1, 9]]
    pivot = null,
    rotation = 0,
  }) {
    this.shape = shape || getRandom(SHAPES);
    this.color = color || pieceBag.getNextColor();
    this.coords = coords || this.getInitialCoords();
    this.pivot = pivot || this.calculatePivot();
    this.rotation = rotation;
  }

  getInitialCoords() {
    let coords = [];
    this.shape?.map((row, rowIdx) =>
      row?.map((cell, cellIdx) => {
        if (cell) coords.push([rowIdx, SPAWN_CELL_COL + cellIdx]);
      })
    );
    return coords;
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

  /**
   * Calculate the predicted landing coordinates for this tetromino
   * @param {Array} board - The game board state
   * @returns {Array} Array of [row, col] tuples representing where the piece will land
   */
  getPredictCoords(board) {
    if (!this.coords || !this.coords.length) return [];

    let prediction = this.coords.map(([r, c]) => [r, c]);

    while (true) {
      const next = prediction.map(([r, c]) => [r + 1, c]);
      const collision = hasCollided(MOVES.DOWN, next, board);

      if (collision === COLLISION.LOCK || collision === COLLISION.CONTINUE)
        break;

      prediction = next;
    }

    return prediction;
  }

  moveDown() {}
  moveLeft() {}
  moveRight() {}
  rotate() {}
}
