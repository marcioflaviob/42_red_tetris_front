const AvatarMedia = ({ src, size = 64, shape = 'circle', ...props }) => {
  const isVideo =
    src &&
    (src.endsWith('.mp4') || src.endsWith('.mov') || src.endsWith('.webm'));
  const style = {
    width: typeof size === 'number' ? size : undefined,
    height: typeof size === 'number' ? size : undefined,
    borderRadius: shape === 'circle' ? '50%' : '8px',
    objectFit: 'cover',
    display: 'block',
  };
  if (isVideo) {
    return (
      <video
        src={src}
        style={style}
        autoPlay
        loop
        muted
        playsInline
        {...props}
      />
    );
  }
  return <img src={src} style={style} alt="avatar" {...props} />;
};

export default AvatarMedia;
