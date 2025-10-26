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
  constructor(shape, color, coords, pivot = null, rotation = 0) {
    this.shape = shape;
    this.color = color;
    this.coords = coords;
    this.pivot = pivot || this.calculatePivot();
    // Rotation state (0,1,2,3) corresponding to the current orientation
    this.rotation = rotation;
  }

  calculatePivot() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;

    // Use SRS-friendly pivot approximations for I piece to improve wall kicks.
    // Reference (Guideline SRS): I piece rotates around a point that is offset
    // from the geometric center. With our minimal bounding boxes, the closest
    // integer pivots that align with kick tables are:
    // - Horizontal I (1x4): pivot at the second block -> [0,1]
    // - Vertical I (4x1): pivot at the third block from top -> [2,0]
    if ((rows === 1 && cols === 4) || (rows === 4 && cols === 1)) {
      if (rows === 1) return [0, 1];
      if (cols === 1) return [2, 0];
    }

    // Default: center of the shape matrix
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    return [centerRow, centerCol];
  }

  moveDown() {}
  moveLeft() {}
  moveRight() {}
  rotate() {
    /* rotation logic */
  }
}
