// Music theory utilities and patterns
export class MusicTheory {
  static getScale(root, scaleType) {
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      pentatonic: [0, 2, 4, 7, 9]
    };
    
    const noteNumbers = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
      'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    const rootNumber = noteNumbers[root];
    return scales[scaleType].map(interval => (rootNumber + interval) % 12);
  }
  
  static generateChordProgression(scale, progressionType) {
    const progressions = {
      pop: [0, 5, 3, 4], // I-vi-IV-V
      jazz: [0, 3, 4, 0], // I-IV-V-I
      blues: [0, 0, 3, 0, 4, 3, 0, 4], // 12-bar blues
      modern: [5, 3, 0, 4], // vi-IV-I-V
      ambient: [0, 2, 4, 1] // I-iii-V-ii
    };
    
    return progressions[progressionType] || progressions.pop;
  }
  
  static getChordNotes(root, chordType, scale) {
    const chordTypes = {
      triad: [0, 2, 4],
      seventh: [0, 2, 4, 6],
      ninth: [0, 2, 4, 6, 1],
      sus2: [0, 1, 4],
      sus4: [0, 3, 4]
    };
    
    const intervals = chordTypes[chordType] || chordTypes.triad;
    return intervals.map(interval => scale[(root + interval) % scale.length]);
  }
  
  static noteToFrequency(noteNumber, octave = 4) {
    // A4 = 440Hz
    const A4 = 440;
    const noteInOctave = noteNumber % 12;
    const octaveNumber = octave + Math.floor(noteNumber / 12);
    
    // Calculate semitones from A4
    const semitonesFromA4 = (octaveNumber - 4) * 12 + (noteInOctave - 9);
    
    return A4 * Math.pow(2, semitonesFromA4 / 12);
  }
  
  static generateMelody(scale, length, style = 'balanced') {
    const melody = [];
    const styles = {
      ascending: () => Math.random() > 0.3 ? 1 : 0,
      descending: () => Math.random() > 0.3 ? -1 : 0,
      balanced: () => Math.floor(Math.random() * 3) - 1,
      stepwise: () => Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : -2) : (Math.random() > 0.5 ? 1 : -1)
    };
    
    let currentNote = Math.floor(scale.length / 2); // Start in middle
    melody.push(currentNote);
    
    const directionFn = styles[style] || styles.balanced;
    
    for (let i = 1; i < length; i++) {
      const direction = directionFn();
      currentNote = Math.max(0, Math.min(scale.length - 1, currentNote + direction));
      melody.push(currentNote);
    }
    
    return melody.map(index => scale[index]);
  }
}

// Rhythm and pattern generators
export class RhythmPatterns {
  static getDrumPattern(style, measures = 1) {
    const patterns = {
      rock: {
        kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      },
      funk: {
        kick: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        hihat: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0]
      },
      jazz: {
        kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        snare: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        hihat: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0]
      },
      electronic: {
        kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        hihat: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
      },
      latin: {
        kick: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      }
    };
    
    const pattern = patterns[style] || patterns.rock;
    
    // Extend pattern for multiple measures
    if (measures > 1) {
      const extended = {
        kick: [],
        snare: [],
        hihat: []
      };
      
      for (let m = 0; m < measures; m++) {
        extended.kick = extended.kick.concat(pattern.kick);
        extended.snare = extended.snare.concat(pattern.snare);
        extended.hihat = extended.hihat.concat(pattern.hihat);
      }
      
      return extended;
    }
    
    return pattern;
  }
  
  static generateRhythm(length, density = 0.5, syncopation = 0.2) {
    const rhythm = new Array(length).fill(0);
    
    // Add downbeats
    for (let i = 0; i < length; i += 4) {
      if (Math.random() < 0.8) rhythm[i] = 1;
    }
    
    // Add other beats based on density
    for (let i = 0; i < length; i++) {
      if (rhythm[i] === 0) {
        // Regular beats
        if (i % 2 === 0 && Math.random() < density) {
          rhythm[i] = 1;
        }
        // Syncopated beats
        else if (Math.random() < syncopation) {
          rhythm[i] = 1;
        }
      }
    }
    
    return rhythm;
  }
}
