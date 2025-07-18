import { useState, useRef } from 'react';
import { sharedAudioEngine } from '../services/sharedAudioEngine';
import './MusicGenerator.css';

const MusicGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const [generationTime, setGenerationTime] = useState(0);

  const progressInterval = useRef(null);

  const [musicParams, setMusicParams] = useState({
    genre: 'Electronic',
    mood: 'Happy',
    duration: 10,
    prompt: ''
  });

  const genreOptions = [
    { value: 'Electronic', label: 'Electronic - Minor scale, arpeggiated melodies' },
    { value: 'K-Pop', label: 'K-Pop - Major scale, APT.-inspired catchy patterns' },
    { value: 'Classical', label: 'Classical - Major scale, stepwise motion' },
    { value: 'Lo-fi Hip-Hop', label: 'Lo-fi Hip-Hop - Pentatonic, relaxed feel' },
    { value: 'Ambient', label: 'Ambient - Dorian mode, floating tones' },
    { value: 'Rock', label: 'Rock - Minor scale, powerful rhythms' }
  ];

  const moodOptions = [
    { value: 'Happy', label: 'Happy - Brighter, faster tempo' },
    { value: 'Sad', label: 'Sad - Deeper tones, slower tempo' },
    { value: 'Relaxed', label: 'Relaxed - Gentle, moderate pace' },
    { value: 'Energetic', label: 'Energetic - High energy, driving rhythm' },
    { value: 'Mysterious', label: 'Mysterious - Dark, atmospheric' }
  ];

  const handleParamChange = (param, value) => {
    setMusicParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const mapToAudioParams = (genre, mood) => {
    const genreMap = {
      'Electronic': { genre: 'electronic', scale: 'minor', bpm: 128, instruments: ['piano', 'bass', 'drums'] },
      'K-Pop': { genre: 'pop', scale: 'major', bpm: 120, instruments: ['piano', 'bass', 'drums', 'melody'] },
      'Classical': { genre: 'jazz', scale: 'major', bpm: 120, instruments: ['piano', 'bass'] },
      'Lo-fi Hip-Hop': { genre: 'ambient', scale: 'pentatonic', bpm: 90, instruments: ['piano', 'bass', 'drums'] },
      'Ambient': { genre: 'ambient', scale: 'dorian', bpm: 80, instruments: ['pad', 'piano'] },
      'Rock': { genre: 'rock', scale: 'minor', bpm: 140, instruments: ['piano', 'bass', 'drums'] }
    };

    const moodMap = {
      'Happy': { bpmMultiplier: 1.1, key: 'C' },
      'Sad': { bpmMultiplier: 0.8, key: 'Dm' },
      'Relaxed': { bpmMultiplier: 0.9, key: 'F' },
      'Energetic': { bpmMultiplier: 1.3, key: 'G' },
      'Mysterious': { bpmMultiplier: 0.85, key: 'Am' }
    };

    const baseParams = genreMap[genre] || genreMap['Electronic'];
    const moodParams = moodMap[mood] || moodMap['Happy'];

    return {
      ...baseParams,
      bpm: Math.round(baseParams.bpm * moodParams.bpmMultiplier),
      key: moodParams.key.charAt(0),
      duration: musicParams.duration
    };
  };

  const generateMusic = async (e) => {
    e.preventDefault();
    
    // Stop any currently playing music first
    if (isPlaying) {
      sharedAudioEngine.stop();
      setIsPlaying(false);
      clearInterval(progressInterval.current);
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    const startTime = Date.now();
    
    try {
      // Initialize audio context
      await sharedAudioEngine.initializeAudio();
      
      // Map form params to audio engine params
      const audioParams = mapToAudioParams(musicParams.genre, musicParams.mood);
      
      // Generate the song
      const song = sharedAudioEngine.generateSong(audioParams);
      setCurrentSong(song);
      
      const endTime = Date.now();
      setGenerationTime(endTime - startTime);
      
    } catch (error) {
      console.error('Error generating music:', error);
      alert('Error generating music. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const playMusic = async () => {
    if (!currentSong) return;
    
    try {
      // Stop any currently playing music first
      if (isPlaying) {
        sharedAudioEngine.stop();
        clearInterval(progressInterval.current);
      }
      
      setIsPlaying(true);
      setProgress(0);
      
      // Start progress tracking
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (currentSong.totalDuration * 10));
          if (newProgress >= 100) {
            clearInterval(progressInterval.current);
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      // Play the song
      await sharedAudioEngine.playSong(currentSong);
      
    } catch (error) {
      console.error('Error playing music:', error);
      setIsPlaying(false);
      clearInterval(progressInterval.current);
    }
  };

  const stopMusic = () => {
    sharedAudioEngine.stop();
    setIsPlaying(false);
    setProgress(0);
    clearInterval(progressInterval.current);
  };

  return (
    <div className="music-generator">
      <div className="form-section">
        <h2>🎵 Create Your Own Melodic Music</h2>
        <p>Generate custom music with real melodies, chord progressions, and musical structure:</p>
        
        <form onSubmit={generateMusic}>
          <div className="form-group">
            <label htmlFor="genre">🎸 Genre:</label>
            <select
              id="genre"
              value={musicParams.genre}
              onChange={(e) => handleParamChange('genre', e.target.value)}
              disabled={isGenerating || isPlaying}
            >
              {genreOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mood">😊 Mood:</label>
            <select
              id="mood"
              value={musicParams.mood}
              onChange={(e) => handleParamChange('mood', e.target.value)}
              disabled={isGenerating || isPlaying}
            >
              {moodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              ⏱️ Duration: <span id="durationLabel">{musicParams.duration}</span> seconds
            </label>
            <input
              type="range"
              id="duration"
              min="5"
              max="20"
              value={musicParams.duration}
              onChange={(e) => handleParamChange('duration', parseInt(e.target.value))}
              disabled={isGenerating || isPlaying}
            />
            <div className="slider-labels">
              <span>5s</span>
              <span>20s</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">✨ Custom Prompt:</label>
            <input
              type="text"
              id="prompt"
              value={musicParams.prompt}
              onChange={(e) => handleParamChange('prompt', e.target.value)}
              placeholder="e.g., 'Upbeat morning music with strong bass and bright melody'"
              disabled={isGenerating || isPlaying}
            />
          </div>

          <button 
            type="submit" 
            className="generate-button"
            disabled={isGenerating || isPlaying}
          >
            🎵 Generate Melodic Music
          </button>
        </form>

        {isGenerating && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Composing your melodic music...</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {currentSong && (
          <div className="result">
            <h3>🎉 Melodic Music Generated!</h3>
            <p>Generated in {generationTime}ms - {musicParams.genre} + {musicParams.mood}</p>
            
            {/* Progress bar for playback */}
            {isPlaying && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            )}
            
            {/* Playback controls */}
            <div className="playback-controls">
              <button
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={isPlaying ? stopMusic : playMusic}
                disabled={isGenerating}
              >
                {isPlaying ? '⏹️ Stop' : '▶️ Play'}
              </button>
            </div>
            
            <div className="music-info">
              <strong>Musical Structure:</strong>
              <div className="music-properties">
                <p><strong>Genre:</strong> {musicParams.genre}</p>
                <p><strong>Mood:</strong> {musicParams.mood}</p>
                <p><strong>Duration:</strong> {musicParams.duration} seconds</p>
                <p><strong>Tracks:</strong> {currentSong.tracks.length}</p>
                <p><strong>Generation Time:</strong> {generationTime}ms</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGenerator;
