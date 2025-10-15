import PropTypes from 'prop-types';
import styles from './LegoPiece.module.css';

// Define Tetris shapes as 2D arrays
const SHAPES = {
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

function rotateMatrix(matrix, times = 1) {
  let result = matrix;
  for (let t = 0; t < times; t++) {
    result = result[0].map((_, i) => result.map((row) => row[i]).reverse());
  }
  return result;
}

function lightenColor(hex, percent) {
  hex = hex.replace(/^#/, '');

  if (hex.length === 8) {
    hex = hex.substring(0, 6);
  }

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((x) => x + x)
      .join('');
  }
  if (hex.length !== 6) return '#000000';

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (percent > 0) {
    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));
  } else {
    const factor = 1 + percent / 100;
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
  }

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const LegoPiece = ({
  shape = 'I',
  color = '#FFD700',
  angle = 0,
  size = 32,
  ...props
}) => {
  const shapeMatrix = SHAPES[shape] || SHAPES.I;
  const isRightAngle = angle % 90 === 0;
  const rotationSteps = isRightAngle ? ((angle % 360) / 90) % 4 : 0;
  const rotated = rotateMatrix(shapeMatrix, rotationSteps);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateRows: `repeat(${rotated.length}, ${size}px)`,
        gridTemplateColumns: `repeat(${rotated[0].length}, ${size}px)`,
        transform: isRightAngle ? undefined : `rotate(${angle}deg)`,
      }}
      {...props}
    >
      {rotated.map((row, y) =>
        row.map(
          (cell, x) =>
            cell && (
              <div
                key={`${y}-${x}`}
                className={styles.legoBlock}
                style={{
                  background: color,
                  width: size,
                  height: size,
                  boxShadow: `0px 8px 0px 0px ${lightenColor(color, -20)}`,
                }}
              >
                <div
                  className={styles.legoStud}
                  style={{
                    width: size * 0.5,
                    height: size * 0.5,
                    background: color,
                    border: `2px solid ${color}`,
                    fontSize: size * 0.13,
                    color: lightenColor(color, -10),
                  }}
                >
                  LEGO
                </div>
              </div>
            )
        )
      )}
    </div>
  );
};

LegoPiece.propTypes = {
  shape: PropTypes.oneOf(Object.keys(SHAPES)),
  color: PropTypes.string,
  angle: PropTypes.oneOf([0, 90, 180, 270]),
  size: PropTypes.number,
  className: PropTypes.string,
};

export default LegoPiece;
