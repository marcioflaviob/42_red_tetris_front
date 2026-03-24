import React, { useMemo, useState, useEffect } from 'react';
import { Avatar as PrimeReactAvatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { useDispatch } from 'react-redux';
import { selectAvatar, setAvatar } from '../../../store/slices/userSlice';
import styles from './Avatar.module.css';
import { useAppSelector } from '../../../store/hooks';
import Card from '../Card/Card';

const Avatar = ({ shape = 'circle', className = '', editable = false, avatar: avatarProp }) => {
  const dispatch = useDispatch();
  const selectedAvatar = useAppSelector(selectAvatar);
  const avatar = avatarProp || selectedAvatar;
  const [filteredAvatars, setFilteredAvatars] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [characterSelectionVisible, setCharacterSelectionVisible] = useState(false);

  const avatarOptions = useMemo(() => {
    const modules = import.meta.glob('/public/avatarsCircled/*.{webp,png,jpg,jpeg,webm}', { eager: true });
    const avatars = Object.entries(modules).map(([path, module]) => {
      const imagePath = typeof module === 'string' ? module : module.default;
      const filename = path.split('/').pop();
      const filenameWithoutExt = filename.replace(/\.[^.]+$/, '');
      const category = filenameWithoutExt.toLowerCase().includes('evil') ? 'evil' : 'good';
      return {
        path: imagePath,
        name: filename,
        category: category,
        default: filenameWithoutExt.toLowerCase().includes('default'),
      };
    });
    return avatars;
  }, []);

  useEffect(() => {
    setFilteredAvatars(avatarOptions);
  }, [avatarOptions]);

  const handleEditClick = () => {
    setCharacterSelectionVisible(true);
  };

  const handleAvatarSelect = (filename) => {
    const uiAvatarPath = `/avatarsUi/${filename}`;
    dispatch(setAvatar(uiAvatarPath));
    setCharacterSelectionVisible(false);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setFilteredAvatars(avatarOptions);
      return;
    }
    setFilteredAvatars(
      avatarOptions.filter((avatarObj) => {
        if (category === 'good') {
          return avatarObj.category !== 'evil';
        } else if (category === 'evil') {
          return avatarObj.category === 'evil';
        }
        return true;
      })
    );
    setSelectedCategory(category);
  };

  return (
    <div className={`${styles.avatarContainer}`}>
      <div className={`${styles.avatar3d} ${className} ${styles.avatarImg} `} onClick={handleEditClick}>
        <img src={avatar} alt="avatar" />
      </div>
      {editable && (
        <>
          <div className={styles.pencilButton} onClick={handleEditClick}>
            <i className="pi pi-pencil text-white text-xl" />
          </div>
          <Dialog
            modal={false}
            position="top-left"
            visible={characterSelectionVisible}
            header="Choose your character"
            className={styles.avatarSelector}
            onHide={() => setCharacterSelectionVisible(false)}>
            <div className={styles.overlayPanelHeader}>
              <div className={styles.category} onClick={() => handleCategoryClick('good')}>
                <img
                  className={selectedCategory === 'good' ? styles.selectedCategory : ''}
                  src="/icons/good-class.png"
                  alt="good-class"
                />
              </div>
              <div className={styles.category} onClick={() => handleCategoryClick('evil')}>
                <img
                  className={selectedCategory === 'evil' ? styles.selectedCategory : ''}
                  src="/icons/evil-class.png"
                  alt="evil-class"
                />
              </div>
            </div>
            <div className={styles.avatarGrid}>
              <div className={styles.avatarOptions}>
                {filteredAvatars.map((avatarObj, index) => (
                  <div
                    className={`${styles.avatarWrapper} ${avatarObj.category === 'evil' ? styles.evilAvatarWrapper : ''} ${avatar?.includes(avatarObj.name) ? styles.selectedAvatar : ''}`}
                    key={index}>
                    <div
                      className={`${styles.avatar} ${editable ? 'cursor-pointer' : ''} ${avatarObj.category === 'evil' ? styles.evilAvatar : ''} ${avatarObj.default ? styles.defaultAvatar : ''}`}
                      onClick={() => handleAvatarSelect(avatarObj.name)}>
                      <PrimeReactAvatar
                        image={avatarObj.path}
                        size="xlarge"
                        shape={shape}
                        onClick={() => handleAvatarSelect(avatarObj.name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Avatar;
