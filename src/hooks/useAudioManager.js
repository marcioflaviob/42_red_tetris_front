import { useEffect, useRef, useState, useCallback } from 'react';

const AUDIO_PATHS = {
  LOBBY: '/music/lobby_loop.ogg',
  GAME: '/music/begin_game_alt.ogg',
  INTRO: '/music/intro.ogg',
};

const AUDIO_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
};

const useAudioManager = (autoPlay = false) => {
  const audioContextRef = useRef(null);
  const buffersRef = useRef({});
  const sourceRef = useRef(null);
  const [audioState, setAudioState] = useState(AUDIO_STATES.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const loopStartTimeRef = useRef(0);

  const loadAudioBuffer = useCallback(async (path) => {
    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContextRef.current.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(`Failed to load audio: ${path}`, error);
      throw error;
    }
  }, []);

  const stopCurrentSource = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.onended = null;
      try {
        sourceRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      sourceRef.current = null;
    }
  }, []);

  const playAudio = useCallback(
    async (bufferKey, loop = false, onEnded = null) => {
      const buffer = buffersRef.current[bufferKey];
      if (!buffer || !audioContextRef.current) return;

      try {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        stopCurrentSource();

        sourceRef.current = audioContextRef.current.createBufferSource();
        sourceRef.current.buffer = buffer;
        sourceRef.current.loop = loop;
        sourceRef.current.connect(audioContextRef.current.destination);

        if (onEnded) {
          sourceRef.current.onended = onEnded;
        }

        if (loop) {
          loopStartTimeRef.current = audioContextRef.current.currentTime;
        }

        sourceRef.current.start();
        setAudioState(AUDIO_STATES.PLAYING);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    },
    [stopCurrentSource]
  );

  const playLobbyMusic = useCallback(() => {
    playAudio('lobby', true);
  }, [playAudio]);

  useEffect(() => {
    const initAudio = async () => {
      try {
        setIsLoading(true);
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        const [lobbyBuffer, gameBuffer, introBuffer] = await Promise.all([
          loadAudioBuffer(AUDIO_PATHS.LOBBY),
          loadAudioBuffer(AUDIO_PATHS.GAME),
          loadAudioBuffer(AUDIO_PATHS.INTRO),
        ]);

        buffersRef.current = {
          lobby: lobbyBuffer,
          game: gameBuffer,
          intro: introBuffer,
        };

        setIsLoading(false);

        if (autoPlay) {
          setTimeout(() => playLobbyMusic(), 100);
        }
      } catch (error) {
        console.error('Audio initialization failed:', error);
        setIsLoading(false);
      }
    };

    initAudio();

    return () => {
      stopCurrentSource();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [autoPlay, loadAudioBuffer, playLobbyMusic, stopCurrentSource]);

  const playIntroMusic = useCallback(() => {
    playAudio('intro', false, playLobbyMusic);
  }, [playAudio, playLobbyMusic]);

  const playGameMusic = useCallback(() => {
    playAudio('game', false, playIntroMusic);
  }, [playAudio, playIntroMusic]);

  const scheduleGameMusicTransition = useCallback(() => {
    const lobbyBuffer = buffersRef.current.lobby;
    if (!lobbyBuffer || !audioContextRef.current || !sourceRef.current) return;

    const lobbyDuration = lobbyBuffer.duration;
    const currentTime = audioContextRef.current.currentTime;
    const elapsedTime = currentTime - loopStartTimeRef.current;
    const timeInCurrentLoop = elapsedTime % lobbyDuration;
    const timeUntilLoopEnd = lobbyDuration - timeInCurrentLoop;

    setTimeout(
      () => {
        playGameMusic();
      },
      Math.max(0, timeUntilLoopEnd * 1000)
    );
  }, [playGameMusic]);

  const play = useCallback(async () => {
    if (isLoading) return;
    await playLobbyMusic();
  }, [playLobbyMusic, isLoading]);

  const pause = useCallback(() => {
    stopCurrentSource();
    setAudioState(AUDIO_STATES.PAUSED);
  }, [stopCurrentSource]);

  const startGameTransition = useCallback(() => {
    if (audioState === AUDIO_STATES.PLAYING && sourceRef.current) {
      scheduleGameMusicTransition();
    } else {
      playGameMusic();
    }
  }, [audioState, scheduleGameMusicTransition, playGameMusic]);

  return {
    isPlaying: audioState === AUDIO_STATES.PLAYING,
    isLoading,
    audioState,
    play,
    pause,
    startGameTransition,
  };
};

export default useAudioManager;
