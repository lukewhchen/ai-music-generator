import { EnhancedSynthesis, DrumSynthesis } from './synthesis.js';
import { MusicTheory, RhythmPatterns } from './musicTheory.js';

export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.currentSequence = null;
    this.sampleRate = 44100;
    this.activeSources = new Set(); // Track active audio sources
  }

  async initializeAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.sampleRate = this.audioContext.sampleRate;
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  createAudioBuffer(audioData) {
    const buffer = this.audioContext.createBuffer(1, audioData.length, this.sampleRate);
    buffer.copyToChannel(audioData, 0);
    return buffer;
  }

  playBuffer(buffer, when = 0, volume = 1.0) {
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Track this source
    this.activeSources.add(source);
    
    // Remove from tracking when it ends
    source.onended = () => {
      this.activeSources.delete(source);
    };
    
    source.start(when);
    return source;
  }

  generateSong(params) {
    const {
      bpm = 120,
      key = 'C',
      scale = 'major',
      genre = 'pop',
      duration = 30,
      instruments = ['piano', 'bass', 'drums']
    } = params;

    // Calculate timing
    const beatDuration = 60 / bpm;
    const measureDuration = beatDuration * 4;
    const totalMeasures = Math.ceil(duration / measureDuration);

    // Generate musical elements
    const scaleNotes = MusicTheory.getScale(key, scale);
    const chordProgression = MusicTheory.generateChordProgression(scaleNotes, genre);
    const drumPattern = RhythmPatterns.getDrumPattern(genre, totalMeasures);

    const sequence = {
      bpm,
      totalDuration: duration,
      measures: totalMeasures,
      tracks: []
    };

    // Generate piano track
    if (instruments.includes('piano')) {
      sequence.tracks.push(this.generatePianoTrack(scaleNotes, chordProgression, totalMeasures, beatDuration));
    }

    // Generate bass track
    if (instruments.includes('bass')) {
      sequence.tracks.push(this.generateBassTrack(scaleNotes, chordProgression, totalMeasures, beatDuration));
    }

    // Generate drum track
    if (instruments.includes('drums')) {
      sequence.tracks.push(this.generateDrumTrack(drumPattern, totalMeasures, beatDuration));
    }

    // Generate melody if requested
    if (instruments.includes('melody')) {
      sequence.tracks.push(this.generateMelodyTrack(scaleNotes, totalMeasures, beatDuration, genre));
    }

    return sequence;
  }

  generatePianoTrack(scale, progression, measures, beatDuration) {
    const events = [];
    const chordDuration = beatDuration * 2; // Half notes

    for (let measure = 0; measure < measures; measure++) {
      const chordIndex = progression[measure % progression.length];
      const chordNotes = MusicTheory.getChordNotes(chordIndex, 'triad', scale);
      
      for (let beat = 0; beat < 4; beat += 2) {
        const startTime = measure * beatDuration * 4 + beat * beatDuration;
        
        // Generate chord
        for (const noteNumber of chordNotes) {
          const frequency = MusicTheory.noteToFrequency(noteNumber, 4);
          const velocity = 0.3 + Math.random() * 0.2;
          
          events.push({
            type: 'note',
            instrument: 'piano',
            frequency,
            duration: chordDuration,
            velocity,
            startTime
          });
        }
      }
    }

    return {
      name: 'Piano',
      instrument: 'piano',
      events
    };
  }

  generateBassTrack(scale, progression, measures, beatDuration) {
    const events = [];
    const noteDuration = beatDuration; // Quarter notes

    for (let measure = 0; measure < measures; measure++) {
      const chordIndex = progression[measure % progression.length];
      const rootNote = scale[chordIndex];
      
      for (let beat = 0; beat < 4; beat++) {
        if (beat === 0 || (beat === 2 && Math.random() > 0.3)) {
          const startTime = measure * beatDuration * 4 + beat * beatDuration;
          const frequency = MusicTheory.noteToFrequency(rootNote, 2);
          const velocity = 0.6 + Math.random() * 0.2;
          
          events.push({
            type: 'note',
            instrument: 'bass',
            frequency,
            duration: noteDuration,
            velocity,
            startTime
          });
        }
      }
    }

    return {
      name: 'Bass',
      instrument: 'bass',
      events
    };
  }

  generateDrumTrack(pattern, measures, beatDuration) {
    const events = [];
    const stepDuration = beatDuration / 4; // 16th notes

    const drumSounds = ['kick', 'snare', 'hihat'];
    
    for (const drumType of drumSounds) {
      const drumPattern = pattern[drumType];
      
      for (let measure = 0; measure < measures; measure++) {
        for (let step = 0; step < drumPattern.length; step++) {
          if (drumPattern[step]) {
            const startTime = measure * beatDuration * 4 + step * stepDuration;
            const velocity = 0.7 + Math.random() * 0.2;
            
            events.push({
              type: 'drum',
              instrument: drumType,
              velocity,
              startTime
            });
          }
        }
      }
    }

    return {
      name: 'Drums',
      instrument: 'drums',
      events
    };
  }

  generateMelodyTrack(scale, measures, beatDuration, style) {
    const events = [];
    const melodyLength = measures * 4; // One note per beat
    const melody = MusicTheory.generateMelody(scale, melodyLength, style);
    
    for (let i = 0; i < melody.length; i++) {
      const startTime = i * beatDuration;
      const noteNumber = melody[i];
      const frequency = MusicTheory.noteToFrequency(noteNumber, 5);
      const velocity = 0.4 + Math.random() * 0.3;
      const duration = beatDuration * (0.7 + Math.random() * 0.3);
      
      events.push({
        type: 'note',
        instrument: 'electricpiano',
        frequency,
        duration,
        velocity,
        startTime
      });
    }

    return {
      name: 'Melody',
      instrument: 'electricpiano',
      events
    };
  }

  async playSong(sequence) {
    await this.initializeAudio();
    
    this.isPlaying = true;
    this.currentSequence = sequence;
    
    const startTime = this.audioContext.currentTime + 0.1;
    
    // Schedule all events
    for (const track of sequence.tracks) {
      for (const event of track.events) {
        this.scheduleEvent(event, startTime);
      }
    }
    
    // Stop playing after song duration
    setTimeout(() => {
      this.isPlaying = false;
    }, sequence.totalDuration * 1000);
  }

  scheduleEvent(event, startTime) {
    const eventTime = startTime + event.startTime;
    
    if (event.type === 'note') {
      let audioData;
      
      switch (event.instrument) {
        case 'piano':
          audioData = EnhancedSynthesis.synthesizePiano(
            event.frequency, 
            event.duration, 
            event.velocity, 
            this.sampleRate
          );
          break;
        case 'bass':
          audioData = EnhancedSynthesis.synthesizeBass(
            event.frequency, 
            event.duration, 
            event.velocity, 
            this.sampleRate
          );
          break;
        case 'electricpiano':
          audioData = EnhancedSynthesis.synthesizeElectricPiano(
            event.frequency, 
            event.duration, 
            event.velocity, 
            this.sampleRate
          );
          break;
        case 'pad':
          audioData = EnhancedSynthesis.synthesizePad(
            event.frequency, 
            event.duration, 
            event.velocity, 
            this.sampleRate
          );
          break;
        default:
          return;
      }
      
      const buffer = this.createAudioBuffer(audioData);
      this.playBuffer(buffer, eventTime, event.velocity);
      
    } else if (event.type === 'drum') {
      let audioData;
      
      switch (event.instrument) {
        case 'kick':
          audioData = DrumSynthesis.generateKick(this.sampleRate);
          break;
        case 'snare':
          audioData = DrumSynthesis.generateSnare(this.sampleRate);
          break;
        case 'hihat':
          audioData = DrumSynthesis.generateHiHat(this.sampleRate);
          break;
        default:
          return;
      }
      
      const buffer = this.createAudioBuffer(audioData);
      this.playBuffer(buffer, eventTime, event.velocity);
    }
  }

  stop() {
    this.isPlaying = false;
    
    // Stop all active audio sources
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch {
        // Source might already be stopped
      }
    });
    
    // Clear the active sources set
    this.activeSources.clear();
  }

  getAvailableGenres() {
    return ['pop', 'jazz', 'blues', 'modern', 'ambient', 'rock', 'funk', 'electronic', 'latin'];
  }

  getAvailableKeys() {
    return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }

  getAvailableScales() {
    return ['major', 'minor', 'dorian', 'mixolydian', 'pentatonic'];
  }

  getAvailableInstruments() {
    return ['piano', 'bass', 'drums', 'melody', 'pad'];
  }
}
