import { COLOR, SPAWN_CELL_COL, MOVES, COLLISION, SHAPES } from './constants';
import { getRandom, hasCollided } from './helper';

export function PieceBag() {
  const pieceBag = {
    colorBag: [],
    reset: () => {
      pieceBag.colorBag = [];
    },
    getState: () => ({
      colorBag: [...pieceBag.colorBag],
    }),
    setState: (state) => {
      pieceBag.colorBag = state.colorBag ? [...state.colorBag] : [];
    },
    getNextColor: (rng) => {
      if (pieceBag.colorBag.length === 0) {
        pieceBag.colorBag = Object.values(COLOR);
        // Shuffle the bag
        for (let i = pieceBag.colorBag.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [pieceBag.colorBag[i], pieceBag.colorBag[j]] = [pieceBag.colorBag[j], pieceBag.colorBag[i]];
        }
      }
      return pieceBag.colorBag.pop();
    },
  };

  return pieceBag;
}

export function Tetromino({
  shape = null,
  color = null,
  coords = null, // Array of tuples ex: [[0, 2], [1, 9]]
  pivot = null,
  rng = null,
  colorRng = null,
  colorBag = null,
  rotation = 0,
} = {}) {
  const tetromino = {
    shape: shape || getRandom(SHAPES, rng),
    color: color || (colorBag ? colorBag.getNextColor(colorRng) : null),
    coords: null,
    pivot: null,
    rotation,
    getInitialCoords: () => {
      let initialCoords = [];
      tetromino.shape?.map((row, rowIdx) =>
        row?.map((cell, cellIdx) => {
          if (cell) initialCoords.push([rowIdx, SPAWN_CELL_COL + cellIdx]);
        })
      );
      return initialCoords;
    },
    calculatePivot: () => {
      const rows = tetromino.shape.length;
      const cols = tetromino.shape[0].length;

      if ((rows === 1 && cols === 4) || (rows === 4 && cols === 1)) {
        if (rows === 1) return [0, 1];
        if (cols === 1) return [2, 0];
      }

      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(cols / 2);
      return [centerRow, centerCol];
    },
    getPredictCoords: (board) => {
      if (!tetromino.coords || !tetromino.coords.length) return [];

      let prediction = tetromino.coords.map(([r, c]) => [r, c]);

      while (true) {
        const next = prediction.map(([r, c]) => [r + 1, c]);
        const collision = hasCollided(MOVES.DOWN, next, board);

        if (collision === COLLISION.LOCK || collision === COLLISION.CONTINUE) break;

        prediction = next;
      }

      return prediction;
    },
  };

  tetromino.coords = coords || tetromino.getInitialCoords();
  tetromino.pivot = pivot || tetromino.calculatePivot();

  return tetromino;
}
