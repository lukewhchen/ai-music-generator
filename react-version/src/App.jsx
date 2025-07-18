import { useState } from 'react'
import MusicGenerator from './components/MusicGenerator'
import SampleLibrary from './components/SampleLibrary'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('samples');

  return (
    <div className="App">
      <div className="container">
        <h1>🎵 Vibe-Music Generator</h1>
        
        <div className="update-banner">
          <h3>🆕 NEW: Enhanced React Version!</h3>
          <p><strong>Now featuring modern React architecture with professional audio synthesis!</strong> Experience improved performance, better UI components, and all the powerful music generation features from the original version.</p>
        </div>

        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            🎧 Melodic Samples
          </button>
          <button 
            className={`tab-button ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            🎵 Custom Generator
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'samples' ? (
            <SampleLibrary />
          ) : (
            <MusicGenerator />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
