import { useState } from 'react';
import { sharedAudioEngine } from '../services/sharedAudioEngine';
import './SampleLibrary.css';

const SampleLibrary = () => {
  const [playingId, setPlayingId] = useState(null);

  const sampleData = {
    electronic: [
      {
        id: 'electronic-happy',
        title: 'Electronic + Happy',
        description: 'Arpeggiated melody over minor scale with rhythmic bass line',
        features: ['Minor Scale', '128 BPM', 'Arpeggiated', 'Tremolo'],
        params: { genre: 'electronic', bpm: 128, scale: 'minor', duration: 10, instruments: ['piano', 'bass', 'drums'] }
      },
      {
        id: 'electronic-energetic',
        title: 'Electronic + Energetic',
        description: 'High-energy with driving bass and electronic effects',
        features: ['Minor Scale', '165 BPM', 'Driving Bass', 'Digital FX'],
        params: { genre: 'electronic', bpm: 165, scale: 'minor', duration: 10, instruments: ['piano', 'bass', 'drums', 'melody'] }
      },
      {
        id: 'electronic-mysterious',
        title: 'Electronic + Mysterious',
        description: 'Dark ambient electronic with floating melody patterns',
        features: ['Minor Scale', '110 BPM', 'Atmospheric', 'Floating'],
        params: { genre: 'ambient', bpm: 110, scale: 'minor', duration: 10, instruments: ['pad', 'bass'] }
      }
    ],
    kpop: [
      {
        id: 'kpop-energetic',
        title: 'K-Pop + Energetic',
        description: 'APT.-inspired catchy patterns with syncopated rhythms',
        features: ['Major Scale', 'Catchy Pop', 'C-Am-F-G', '120 BPM'],
        params: { genre: 'pop', bpm: 120, scale: 'major', duration: 10, instruments: ['piano', 'bass', 'drums', 'melody'] }
      },
      {
        id: 'kpop-happy',
        title: 'K-Pop + Happy',
        description: 'Bright K-Pop with verse-chorus structure and melodic hooks',
        features: ['Major Scale', 'Syncopated', 'Pop Hooks', 'Bright'],
        params: { genre: 'pop', bpm: 125, scale: 'major', duration: 10, instruments: ['piano', 'bass', 'drums', 'melody'] }
      },
      {
        id: 'kpop-mysterious',
        title: 'K-Pop + Mysterious',
        description: 'Darker K-Pop with atmospheric production and catchy rhythms',
        features: ['Major Scale', 'Atmospheric', 'Catchy', 'Compressed'],
        params: { genre: 'modern', bpm: 115, scale: 'major', duration: 10, instruments: ['piano', 'bass', 'drums', 'pad'] }
      }
    ],
    classical: [
      {
        id: 'classical-happy',
        title: 'Classical + Happy',
        description: 'Stepwise melody in major scale with traditional chord progression',
        features: ['Major Scale', '132 BPM', 'Stepwise', 'I-IV-V-I'],
        params: { genre: 'jazz', bpm: 132, scale: 'major', duration: 10, instruments: ['piano', 'bass'] }
      },
      {
        id: 'classical-sad',
        title: 'Classical + Sad',
        description: 'Melancholic melody with slower tempo and gentle dynamics',
        features: ['Major Scale', '96 BPM', 'Expressive', 'Gentle'],
        params: { genre: 'ambient', bpm: 96, scale: 'minor', duration: 10, instruments: ['piano', 'pad'] }
      },
      {
        id: 'classical-relaxed',
        title: 'Classical + Relaxed',
        description: 'Peaceful classical with flowing melodic lines',
        features: ['Major Scale', '108 BPM', 'Flowing', 'Peaceful'],
        params: { genre: 'ambient', bpm: 108, scale: 'major', duration: 10, instruments: ['piano', 'pad'] }
      }
    ],
    rock: [
      {
        id: 'rock-energetic',
        title: 'Rock + Energetic',
        description: 'High-energy rock with powerful rhythms and driving force',
        features: ['Minor Scale', '182 BPM', 'Powerful', 'Distortion'],
        params: { genre: 'rock', bpm: 182, scale: 'minor', duration: 10, instruments: ['piano', 'bass', 'drums'] }
      },
      {
        id: 'rock-happy',
        title: 'Rock + Happy',
        description: 'Upbeat rock with rhythmic emphasis and bright harmonics',
        features: ['Minor Scale', '168 BPM', 'Rhythmic', 'Bright'],
        params: { genre: 'rock', bpm: 168, scale: 'minor', duration: 10, instruments: ['piano', 'bass', 'drums'] }
      },
      {
        id: 'rock-sad',
        title: 'Rock + Sad',
        description: 'Slower rock ballad with emotional depth and sustained notes',
        features: ['Minor Scale', '112 BPM', 'Ballad', 'Emotional'],
        params: { genre: 'rock', bpm: 112, scale: 'minor', duration: 10, instruments: ['piano', 'bass'] }
      }
    ]
  };

  const playSample = async (sampleId) => {
    // Stop any currently playing music first
    if (playingId) {
      sharedAudioEngine.stop();
    }
    
    if (playingId === sampleId) {
      // Stop if already playing this sample
      setPlayingId(null);
      return;
    }

    try {
      // Find the sample data
      let sample = null;
      for (const genre of Object.values(sampleData)) {
        sample = genre.find(s => s.id === sampleId);
        if (sample) break;
      }

      if (!sample) return;

      setPlayingId(sampleId);
      
      // Initialize audio and generate sample
      await sharedAudioEngine.initializeAudio();
      const song = sharedAudioEngine.generateSong(sample.params);
      
      // Play the generated song
      await sharedAudioEngine.playSong(song);
      
      // Auto-stop after duration
      setTimeout(() => {
        setPlayingId(null);
      }, sample.params.duration * 1000);
      
    } catch (error) {
      console.error('Error playing sample:', error);
      setPlayingId(null);
    }
  };

  const renderGenreSection = (genreKey, genreTitle, genreIcon) => (
    <div key={genreKey} className="genre-section">
      <h3>{genreIcon} {genreTitle}</h3>
      <div className="samples-grid">
        {sampleData[genreKey].map(sample => (
          <div 
            key={sample.id}
            className={`sample-card ${playingId === sample.id ? 'playing' : ''}`}
            onClick={() => playSample(sample.id)}
          >
            <div className="sample-title">{sample.title}</div>
            <div className="sample-description">{sample.description}</div>
            <div className="sample-features">
              {sample.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
            <button 
              className={`play-button ${playingId === sample.id ? 'playing' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                playSample(sample.id);
              }}
            >
              {playingId === sample.id ? '⏹️ Stop' : '▶️ Play'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sample-library">
      <div className="demo-section">
        <h2>🎧 Enhanced Music Samples with Real Melodies</h2>
        <p>Listen to examples with proper musical structure - bass lines, chord progressions, and melodic patterns!</p>
        
        {renderGenreSection('electronic', 'Electronic', '🎛️')}
        {renderGenreSection('kpop', 'K-Pop (APT.-Inspired)', '🎵')}
        {renderGenreSection('classical', 'Classical', '🎼')}
        {renderGenreSection('rock', 'Rock', '🎸')}
      </div>
    </div>
  );
};

export default SampleLibrary;
