import './PlaybackControls.css';

const PlaybackControls = ({ isPlaying, onPlay, onStop, onDownload, disabled }) => {
  return (
    <div className="playback-controls">
      <div className="control-buttons">
        <button
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? onStop : onPlay}
          disabled={disabled}
        >
          {isPlaying ? '⏹️ Stop' : '▶️ Play'}
        </button>
        
        <button
          className="download-btn"
          onClick={onDownload}
          disabled={disabled}
        >
          💾 Download
        </button>
      </div>
      
      <div className="playback-info">
        {isPlaying && (
          <div className="status-indicator">
            <span className="pulse"></span>
            Now Playing...
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaybackControls;
