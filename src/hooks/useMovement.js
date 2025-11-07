import { COLLISION, MOVES } from '../utils/constants';
import { Tetromino } from '../utils/tetromino';
import { hasCollided } from '../utils/helper';

const useMovement = ({
  boardRef,
  activePieceRef,
  setActivePiece,
  rotatePiece,
}) => {
  const movePiece = (move) => {
    const piece = activePieceRef.current;
    if (!piece) return COLLISION.NO;

    let proposed = null;
    let coords = [];
    let shape = piece.shape;

    switch (move) {
      case MOVES.DOWN:
        coords = piece.coords?.map(([r, c]) => [r + 1, c]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.RIGHT:
        coords = piece.coords?.map(([r, c]) => [r, c + 1]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.LEFT:
        coords = piece.coords?.map(([r, c]) => [r, c - 1]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.ROTATE:
        proposed = rotatePiece(piece);
        if (!proposed) return COLLISION.CONTINUE;
        setActivePiece(
          new Tetromino({
            shape: proposed.shape,
            color: piece.color,
            coords: proposed.coords,
            pivot: proposed.pivot,
            rotation: proposed.rotation,
          })
        );
        return COLLISION.NO;
      default:
        return COLLISION.NO;
    }

    const collision = hasCollided(move, proposed.coords, boardRef?.current);
    if (!collision) {
      setActivePiece(
        new Tetromino({
          shape: proposed.shape,
          color: piece.color,
          coords: proposed.coords,
          pivot: proposed.pivot,
          rotation: proposed.rotation,
        })
      );
    }
    return collision;
  };

  return { movePiece };
};

export default useMovement;
