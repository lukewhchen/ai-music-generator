import { useState } from 'react';
import './ControlPanel.css';

const ControlPanel = ({ params, onParamChange, onInstrumentToggle, audioEngine, disabled }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const genres = audioEngine.getAvailableGenres();
  const keys = audioEngine.getAvailableKeys();
  const scales = audioEngine.getAvailableScales();
  const instruments = audioEngine.getAvailableInstruments();

  return (
    <div className="control-panel">
      <h2>🎛️ Music Controls</h2>
      
      <div className="controls-grid">
        {/* Basic Controls */}
        <div className="control-group">
          <label>
            Genre
            <select
              value={params.genre}
              onChange={(e) => onParamChange('genre', e.target.value)}
              disabled={disabled}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            Key
            <select
              value={params.key}
              onChange={(e) => onParamChange('key', e.target.value)}
              disabled={disabled}
            >
              {keys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            Scale
            <select
              value={params.scale}
              onChange={(e) => onParamChange('scale', e.target.value)}
              disabled={disabled}
            >
              {scales.map(scale => (
                <option key={scale} value={scale}>
                  {scale.charAt(0).toUpperCase() + scale.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            BPM
            <input
              type="range"
              min="60"
              max="180"
              value={params.bpm}
              onChange={(e) => onParamChange('bpm', parseInt(e.target.value))}
              disabled={disabled}
            />
            <span className="value">{params.bpm}</span>
          </label>
        </div>

        <div className="control-group">
          <label>
            Duration (seconds)
            <input
              type="range"
              min="10"
              max="120"
              value={params.duration}
              onChange={(e) => onParamChange('duration', parseInt(e.target.value))}
              disabled={disabled}
            />
            <span className="value">{params.duration}s</span>
          </label>
        </div>
      </div>

      {/* Instruments */}
      <div className="instruments-section">
        <h3>🎹 Instruments</h3>
        <div className="instruments-grid">
          {instruments.map(instrument => (
            <label key={instrument} className="instrument-checkbox">
              <input
                type="checkbox"
                checked={params.instruments.includes(instrument)}
                onChange={() => onInstrumentToggle(instrument)}
                disabled={disabled}
              />
              <span className="checkmark"></span>
              {getInstrumentLabel(instrument)}
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="advanced-section">
        <button
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          type="button"
        >
          {showAdvanced ? '🔼 Hide Advanced' : '🔽 Show Advanced'}
        </button>
        
        {showAdvanced && (
          <div className="advanced-controls">
            <div className="control-group">
              <label>
                Complexity
                <select
                  value={params.complexity || 'medium'}
                  onChange={(e) => onParamChange('complexity', e.target.value)}
                  disabled={disabled}
                >
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </select>
              </label>
            </div>
            
            <div className="control-group">
              <label>
                Variation
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={params.variation || 50}
                  onChange={(e) => onParamChange('variation', parseInt(e.target.value))}
                  disabled={disabled}
                />
                <span className="value">{params.variation || 50}%</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="presets-section">
        <h3>🎯 Quick Presets</h3>
        <div className="presets-grid">
          <button
            onClick={() => applyPreset('chill', onParamChange)}
            disabled={disabled}
            className="preset-btn"
          >
            😌 Chill
          </button>
          <button
            onClick={() => applyPreset('upbeat', onParamChange)}
            disabled={disabled}
            className="preset-btn"
          >
            🚀 Upbeat
          </button>
          <button
            onClick={() => applyPreset('ambient', onParamChange)}
            disabled={disabled}
            className="preset-btn"
          >
            🌌 Ambient
          </button>
          <button
            onClick={() => applyPreset('jazz', onParamChange)}
            disabled={disabled}
            className="preset-btn"
          >
            🎷 Jazz
          </button>
        </div>
      </div>
    </div>
  );
};

const getInstrumentLabel = (instrument) => {
  const labels = {
    piano: '🎹 Piano',
    bass: '🎸 Bass',
    drums: '🥁 Drums',
    melody: '🎵 Melody',
    pad: '🌊 Pad'
  };
  return labels[instrument] || instrument;
};

const applyPreset = (preset, onParamChange) => {
  const presets = {
    chill: {
      genre: 'ambient',
      bpm: 85,
      scale: 'minor',
      instruments: ['piano', 'pad', 'bass']
    },
    upbeat: {
      genre: 'electronic',
      bpm: 128,
      scale: 'major',
      instruments: ['piano', 'bass', 'drums', 'melody']
    },
    ambient: {
      genre: 'ambient',
      bpm: 70,
      scale: 'dorian',
      instruments: ['pad', 'piano']
    },
    jazz: {
      genre: 'jazz',
      bpm: 120,
      scale: 'mixolydian',
      instruments: ['piano', 'bass', 'drums']
    }
  };

  const presetParams = presets[preset];
  if (presetParams) {
    Object.entries(presetParams).forEach(([key, value]) => {
      onParamChange(key, value);
    });
  }
};

export default ControlPanel;
