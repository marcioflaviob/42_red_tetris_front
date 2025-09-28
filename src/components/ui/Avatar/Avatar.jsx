import React, { useRef, useState } from 'react';
import { Avatar as PrimeReactAvatar  } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useDispatch } from 'react-redux';
import { selectAvatar, setAvatar } from '../../../store/slices/userSlice';
import styles from './Avatar.module.css'
import { useAppSelector } from '../../../store/hooks';

const Avatar = ({
    size,
    shape = 'circle',
    className = '',
    editable = false,
    avatar = useAppSelector(selectAvatar),
}) => {
    const overlayRef = useRef(null);
    const dispatch = useDispatch();
    
    const avatarOptions = [
        '/assets/avatars/default.webp',
        ...Array.from({ length: 13 }, (_, i) => `/assets/avatars/avatar${i + 1}.webp`)
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
            <PrimeReactAvatar 
                image={avatar}
                size={size} 
                shape={shape} 
                className={`${editable ? styles.avatarEditable : styles.avatar} ${className}`}
                onClick={handleEditClick}
            />
            {editable && (
                <>
                    <div 
                        className={styles.pencilButton}
                        onClick={handleEditClick}
                    >
                        <i className='pi pi-pencil text-white text-xs' />
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
                                        <PrimeReactAvatar 
                                            image={avatarPath} 
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