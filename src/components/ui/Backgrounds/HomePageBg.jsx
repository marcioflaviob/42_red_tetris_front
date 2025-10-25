import styles from './HomePageBg.module.css';
import LegoPiece from './LegoPiece';
import { useEffect, useRef } from 'react';

const SHAPES = ['O', 'T', 'S', 'Z', 'J', 'L', 'I'];
const PIECE_COUNT = 10;
const ROW_COUNT = 3;

function getRandomColor() {
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
  );
}

function getRandomAngle() {
  return Math.floor(Math.random() * 360);
}

function getRandomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

const Row = ({ pieces, speed }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let position = speed > 0 ? -container.scrollWidth / 2 : 0;

    const animate = () => {
      position += speed / 100;

      if (speed > 0 && position >= 0) {
        position = -container.scrollWidth / 2;
      } else if (speed < 0 && position <= -container.scrollWidth / 2) {
        position = 0;
      }

      container.style.transform = `translateX(${position}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  const renderPieces = () =>
    pieces.map((props) => {
      const { key, ...legoProps } = props;
      return (
        <div key={key} className={styles.block}>
          <LegoPiece {...legoProps} />
        </div>
      );
    });

  return (
    <div className={styles.row} ref={containerRef}>
      {renderPieces()}
      {renderPieces()}
    </div>
  );
};

const HomePageBg = () => {
  const rows = Array.from({ length: ROW_COUNT }, () =>
    Array.from({ length: PIECE_COUNT }, (_, idx) => ({
      color: getRandomColor(),
      angle: getRandomAngle(),
      shape: getRandomShape(),
      size: 80,
      key: idx,
    }))
  );

  return (
    <div className={styles.background}>
      <div className={styles.overlay}></div>
      {rows.map((pieces, idx) => (
        <Row key={idx} pieces={pieces} speed={idx % 2 === 0 ? 60 : -60} />
      ))}
    </div>
  );
};

export default HomePageBg;
