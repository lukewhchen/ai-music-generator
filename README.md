# AI Music Generator - Melodic Version

A browser-based AI music generator that creates melodic music with proper chord progressions, bass lines, and authentic musical structure.

## 🎵 Features

- **Real Melodies**: Generates actual melodic music with proper musical structure
- **Genre Selection**: Choose from Electronic, Classical, Lo-fi Hip-Hop, Ambient, and Rock
- **Mood Control**: Generate music with different moods (Happy, Sad, Relaxed, Energetic, Mysterious)
- **Musical Scales**: Uses proper musical scales (Major, Minor, Pentatonic, Dorian)
- **Chord Progressions**: Authentic chord progressions for each genre
- **Bass Lines**: Rhythmic bass patterns that follow musical theory
- **Melody Styles**: Different melodic approaches per genre (stepwise, arpeggiated, floating, etc.)
- **Audio Effects**: Genre-specific effects (vinyl crackle, distortion, tremolo)
- **Duration Control**: Set music duration from 5 to 20 seconds
- **Custom Prompts**: Add optional custom prompts for more specific music generation
- **Real-time Audio Player**: Play generated music directly in the browser
- **Sample Library**: Pre-generated samples showcasing all genre/mood combinations
- **No Dependencies**: Runs entirely in the browser using Web Audio API

## 🛠️ Tech Stack

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Web Audio API**: Browser-native audio generation and processing
- **Musical Theory Implementation**: Proper scales, chord progressions, and rhythm
- **Responsive Design**: Beautiful, mobile-friendly interface

## 🚀 Quick Start

### Option 1: Simple Browser Demo
1. Open `melodic-demo.html` directly in any modern web browser
2. Click on any sample card to hear pre-generated music
3. Use the "Custom Generator" tab to create your own music

### Option 2: Local Server (Optional)
```bash
# Serve the file locally (optional)
python3 -m http.server 8000
# Then open http://localhost:8000/melodic-demo.html
```

## 🎼 Musical Features

### Genres & Characteristics

#### 🎛️ **Electronic**
- **Scale**: Natural Minor
- **Tempo**: 128 BPM (adjustable by mood)
- **Melody Style**: Arpeggiated patterns
- **Effects**: Tremolo, rhythmic modulation
- **Bass**: Driving electronic bass patterns

#### 🎼 **Classical**
- **Scale**: Major
- **Tempo**: 120 BPM
- **Melody Style**: Stepwise motion with occasional leaps
- **Progression**: Traditional I-IV-V-I harmony
- **Bass**: Classical bass line patterns

#### 🎤 **Lo-fi Hip-Hop**
- **Scale**: Pentatonic
- **Tempo**: 85 BPM
- **Melody Style**: Relaxed, weighted toward certain scale degrees
- **Effects**: Vinyl crackle, swing rhythm
- **Bass**: Laid-back hip-hop patterns

#### 🌙 **Ambient**
- **Scale**: Dorian Mode
- **Tempo**: 60 BPM
- **Melody Style**: Floating, sustained tones
- **Effects**: LFO modulation, atmospheric textures
- **Bass**: Deep, resonant drones

#### 🎸 **Rock**
- **Scale**: Natural Minor
- **Tempo**: 140 BPM
- **Melody Style**: Powerful, emphasizing strong scale degrees
- **Effects**: Distortion, driving rhythm
- **Bass**: Energetic rock patterns

### Mood Adjustments
- **Happy**: Faster tempo (1.1x), brighter tones (1.2x)
- **Sad**: Slower tempo (0.8x), darker tones (0.7x), lower energy
- **Relaxed**: Moderate tempo (0.9x), gentle energy (0.5x)
- **Energetic**: Fast tempo (1.3x), high brightness and energy (1.3x-1.4x)
- **Mysterious**: Slower tempo (0.85x), dark atmosphere (0.6x brightness)

## 📁 Project Structure

## 🎨 Usage

### Sample Library
1. Open the **"🎧 Melodic Samples"** tab
2. Browse through different genres (Electronic, Classical, Lo-fi Hip-Hop, Ambient, Rock)
3. Click any sample card to hear the music instantly
4. Each sample shows the musical characteristics (scale, tempo, style, effects)

### Custom Generator
1. Switch to the **"🎵 Custom Generator"** tab
2. Select your preferred genre and mood
3. Adjust the duration (5-20 seconds)
4. Optionally add a custom prompt
5. Click **"🎵 Generate Melodic Music"** to create your unique track

## 🎼 Musical Theory Implementation

The generator implements proper musical theory:

- **Scales**: Uses authentic musical scales for each genre
- **Chord Progressions**: Real harmonic progressions (I-IV-V-I, etc.)
- **Bass Lines**: Rhythmic bass patterns following music theory
- **Melody**: Genre-appropriate melodic styles
- **Rhythm**: Proper tempo and beat patterns
- **Effects**: Genre-specific audio processing

## 🚀 Future Development

The included `generate_music_local.py` file contains the same melodic generation algorithm implemented in Python using NumPy. This can be used for:

- Server-side music generation
- Batch processing
- Integration with AI/ML models
- Desktop applications

To use the Python version:
```bash
python3 generate_music_local.py
```

## 🔧 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

Requires a modern browser with Web Audio API support.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Web Audio API for browser-native audio generation
- Musical theory principles for authentic sound generation
- Modern web standards for cross-platform compatibility

## 🎯 Running the Application

### Option 1: Using the Start Scripts
1. Start the backend server:
```bash
./start_backend.sh
```

2. In a new terminal, start the frontend:
```bash
./start_frontend.sh
```

### Option 2: Manual Start
1. Start the backend server:
```bash
source venv/bin/activate
python main.py
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎼 How It Works

1. **User Input**: Select genre, mood, duration, and optionally add a custom prompt
2. **API Request**: Frontend sends a POST request to `/generate_music` endpoint
3. **Music Generation**: Backend processes the request using the `generate_music` function
4. **Audio Processing**: Generated NumPy audio array is converted to WAV format and encoded as base64
5. **Response**: Backend returns the audio data as a JSON response
6. **Audio Playback**: Frontend decodes the base64 audio and plays it using HTML5 audio player

## 🧪 API Endpoints

### POST `/generate_music`
Generate music based on specified parameters.

**Request Body:**
```json
{
  "genre": "Electronic",
  "mood": "Happy",
  "duration_seconds": 10,
  "custom_prompt": "Optional custom prompt"
}
```

**Response:**
```json
{
  "audio_data": "base64_encoded_wav_data",
  "duration": 10,
  "genre": "Electronic",
  "mood": "Happy",
  "message": "Music generated successfully"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "AI Music Generator API is running"
}
```

## 📁 Project Structure

```
ai-music-generator/
├── main.py                 # FastAPI backend server
├── generate_music_local.py # AI music generation function
├── requirements.txt        # Python dependencies
├── setup.sh               # Automated setup script
├── start_backend.sh       # Backend start script
├── start_frontend.sh      # Frontend start script
├── README.md              # This file
└── frontend/
    ├── package.json       # Node.js dependencies
    ├── tailwind.config.js # Tailwind CSS configuration
    ├── postcss.config.js  # PostCSS configuration
    ├── public/
    │   ├── index.html     # HTML template
    │   └── manifest.json  # PWA manifest
    └── src/
        ├── index.js       # React app entry point
        ├── index.css      # Global styles
        ├── App.js         # Main React component
        └── App.css        # Component styles
```

## 🎨 Customization

### Adding New Genres
1. Update the `GENRES` array in `frontend/src/App.js`
2. Add genre-specific logic in `generate_music_local.py`

### Adding New Moods
1. Update the `MOODS` array in `frontend/src/App.js`
2. Add mood-specific logic in `generate_music_local.py`

### Styling
- Modify `frontend/src/App.css` for custom styles
- Update `frontend/tailwind.config.js` for Tailwind customization

## 🔧 Development

### Backend Development
- The backend uses FastAPI with automatic OpenAPI documentation
- Visit http://localhost:8000/docs for interactive API documentation
- Add new endpoints in `main.py`
- Modify music generation logic in `generate_music_local.py`

### Frontend Development
- The frontend uses React with hot reloading
- Components are in `frontend/src/`
- Styles use Tailwind CSS utility classes
- API calls are made using Axios

## 📝 Environment Variables

Create a `.env` file in the root directory to customize settings:

```env
# Backend settings
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend settings
REACT_APP_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change the port in `main.py` or kill the process using port 8000
- **Module not found**: Ensure virtual environment is activated and dependencies are installed
- **CORS errors**: Check that the frontend URL is allowed in the CORS middleware

### Frontend Issues
- **Cannot connect to backend**: Ensure the backend server is running on port 8000
- **Build errors**: Delete `node_modules` and run `npm install` again
- **Styling issues**: Ensure Tailwind CSS is properly configured

### Common Solutions
1. **Restart both servers** if you encounter connection issues
2. **Check browser console** for detailed error messages
3. **Verify API endpoints** using the FastAPI documentation at `/docs`

## 📦 Dependencies

### Backend Dependencies
- `fastapi`: Web framework for building APIs
- `uvicorn`: ASGI server implementation
- `numpy`: Scientific computing library
- `pydantic`: Data validation using Python type hints

### Frontend Dependencies
- `react`: JavaScript library for building user interfaces
- `axios`: Promise-based HTTP client
- `tailwindcss`: Utility-first CSS framework
- `postcss`: Tool for transforming CSS with JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- FastAPI for the excellent web framework
- React team for the fantastic frontend library
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools
An AI-powered web application for generating short musical pieces from text prompts.
