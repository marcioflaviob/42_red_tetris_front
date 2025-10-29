export const USERNAME_REGEX = /^[a-zA-Z0-9]*$/;

export const MOVE_DELAY = 100;
export const FRAMES_PER_SECOND = 60;

export const BUFFER_ZONE_ROWS = 2;
export const BOARD_ROWS = 20;
export const BOARD_COLS = 10;
export const SPAWN_CELL_COL = 3;

export const MOVES = {
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  ROTATE: 4,
};

export const COLLISION = {
  NO: 0,
  CONTINUE: 1,
  LOCK: 2,
};

export const CLASS = {
  TILE: 1,
  PREDICT: 2,
  EMPTY: 0,
};

export const SCORED_ACTION = {
  SOFT_DROP: 1,
  HARD_DROP: 2,
  TETRIS: 3,
  TETRIS_B2B: 4,
};

export const SCORE = {
  SOFT_DROP: 1,
  HARD_DROP: 2,
  SINGLE: 10,
  DOUBLE: 30,
  TRIPLE: 50,
  TETRIS: 100,
  TETRIS_B2B: 120,
};

export const COLOR = {
  PURPLE: 1,
  MUSTARD: 2,
  PANTHER: 3,
  WINE: 4,
  GRASS: 5,
  ROYAL: 6,
  TURK: 7,
};

export const LEVEL = {
  1: 5, // Lines to be cleared to move to the next level
  2: 10,
  3: 15,
  4: 20,
  5: 25,
  6: 30,
  7: 35,
  8: 40,
  9: 45,
  10: 50,
  11: 55,
  12: 60,
  13: 65,
  14: 70,
  15: 999,
};
