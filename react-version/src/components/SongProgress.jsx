import './SongProgress.css';

const SongProgress = ({ progress, duration }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * duration;

  return (
    <div className="song-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
      </div>
      
      <div className="time-display">
        <span className="current-time">{formatTime(currentTime)}</span>
        <span className="total-time">{formatTime(duration)}</span>
      </div>
      
      <div className="progress-percentage">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default SongProgress;
