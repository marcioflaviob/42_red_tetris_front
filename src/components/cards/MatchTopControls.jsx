const MatchTopControls = ({ onBackToMenu, isPlaying, onToggleAudio, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 group bg-red-500/10 border-red-500/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:scale-105 active:scale-95">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 group-hover:animate-pulse">
          <i className="pi pi-home text-lg"></i>
        </div>
        <span className="font-semibold tracking-wide uppercase text-xs">Return to Menu</span>
      </button>
      <button
        onClick={onToggleAudio}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 group ${
          isPlaying
            ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
            : 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        } hover:scale-105 active:scale-95`}>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isPlaying ? 'bg-green-500/20' : 'bg-blue-500/20'
          } group-hover:animate-pulse`}>
          <i className={`${isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'} text-lg`}></i>
        </div>
        <span className="font-semibold tracking-wide uppercase text-xs">
          {isPlaying ? 'Now Playing' : 'Play Music'}
        </span>
      </button>
    </div>
  );
};

export default MatchTopControls;
