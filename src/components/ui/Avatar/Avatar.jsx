import React, { useRef } from 'react';
import { Avatar as PrimeReactAvatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useDispatch } from 'react-redux';
import { selectAvatar, setAvatar } from '../../../store/slices/userSlice';
import styles from './Avatar.module.css';
import { useAppSelector } from '../../../store/hooks';

const isVideo = (src) => {
  return (
    src &&
    (src.endsWith('.mp4') || src.endsWith('.mov') || src.endsWith('.webm'))
  );
};

const AvatarMedia = ({ src, size, shape, className, onClick }) => {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: shape === 'circle' ? '50%' : '8px',
        }}
      />
    );
  }
  return (
    <PrimeReactAvatar
      image={src}
      size={size}
      shape={shape}
      className={className}
      onClick={onClick}
    />
  );
};

const Avatar = ({
  size,
  shape = 'circle',
  className = '',
  editable = false,
  avatar: avatarProp,
}) => {
  const overlayRef = useRef(null);
  const dispatch = useDispatch();
  const selectedAvatar = useAppSelector(selectAvatar);
  const avatar = avatarProp || selectedAvatar;

  const avatarOptions = [
    '/assets/avatars/default.webp',
    ...Array.from(
      { length: 13 },
      (_, i) => `/assets/avatars/avatar${i + 1}.webp`
    ),
    '/assets/anakin/idle/anakin-idle-animation.mov',
  ];

  const handleEditClick = (event) => {
    if (editable && overlayRef.current) {
      overlayRef.current.toggle(event);
    }
  };

  const handleAvatarSelect = (avatarPath) => {
    dispatch(setAvatar(avatarPath));
    overlayRef.current?.hide();
  };

  return (
    <div className="relative inline-block">
      <AvatarMedia
        src={avatar}
        size={size}
        shape={shape}
        className={`${editable ? styles.avatarEditable : styles.avatar} ${className}`}
        onClick={handleEditClick}
      />
      {editable && (
        <>
          <div className={styles.pencilButton} onClick={handleEditClick}>
            <i className="pi pi-pencil text-white text-xs" />
          </div>
          <OverlayPanel ref={overlayRef} className={styles.avatarSelector}>
            <div className={styles.avatarGrid}>
              <h4 className={styles.selectorTitle}>Choose Avatar</h4>
              <div className={styles.avatarOptions}>
                {avatarOptions.map((avatarPath, index) => (
                  <div
                    key={index}
                    className={`${styles.avatar} cursor-pointer ${avatar === avatarPath ? styles.selectedAvatar : ''}`}
                    onClick={() => handleAvatarSelect(avatarPath)}
                  >
                    <AvatarMedia
                      src={avatarPath}
                      size="xlarge"
                      shape="circle"
                    />
                  </div>
                ))}
              </div>
            </div>
          </OverlayPanel>
        </>
      )}
    </div>
  );
};

export default Avatar;
