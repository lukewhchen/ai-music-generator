"""
AI Music Generator Module

This module contains the core music generation functionality with K-Pop support.
Features APT.-inspired rhythmic patterns and melodic structures.
Supports multiple genres including K-Pop with authentic beats and progressions.
"""

import numpy as np
import random
import math
from typing import Optional

def generate_music(genre: str = "Electronic", 
                  mood: str = "Happy", 
                  duration_seconds: int = 10,
                  custom_prompt: Optional[str] = None) -> np.ndarray:
    """
    Generate music with proper melody, chord progressions, and rhythm.
    
    Args:
        genre: The music genre (e.g., 'Electronic', 'K-Pop', 'Classical', 'Lo-fi Hip-Hop', 'Ambient', 'Rock')
        mood: The desired mood (e.g., 'Happy', 'Sad', 'Relaxed', 'Energetic', 'Mysterious')
        duration_seconds: Length of the generated music in seconds (5-30)
        custom_prompt: Optional custom prompt for music generation
    
    Returns:
        numpy.ndarray: Audio data as a 1D array (mono, 44.1kHz sample rate)
    """
    
    # Sample rate (44.1kHz is standard for audio)
    sample_rate = 44100
    samples = duration_seconds * sample_rate
    
    # Note frequencies (in Hz) - 12-tone equal temperament
    note_frequencies = {
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
        'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
        'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
        'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00,
        'A#5': 932.33, 'B5': 987.77,
        'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00,
        'A3': 220.00, 'B3': 246.94
    }
    
    # Define scales and chord progressions for different genres/moods
    scales = {
        'major': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
        'minor': ['C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5'],
        'pentatonic': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
        'blues': ['C4', 'D#4', 'F4', 'F#4', 'G4', 'A#4', 'C5'],
        'dorian': ['C4', 'D4', 'D#4', 'F4', 'G4', 'A4', 'A#4', 'C5']
    }
    
    # Genre-specific settings
    genre_settings = {
        'Electronic': {
            'scale': 'minor',
            'tempo': 128,  # BPM
            'bass_notes': ['C3', 'F3', 'G3', 'D#3'],
            'chord_progression': [['C4', 'D#4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['D#4', 'G4', 'A#4']],
            'melody_style': 'arpeggiated'
        },
        'K-Pop': {
            'scale': 'major',
            'tempo': 120,  # APT. tempo
            'bass_notes': ['C3', 'G3', 'A3', 'F3'],  # APT.-inspired bass pattern
            'chord_progression': [['C4', 'E4', 'G4'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5']],  # C-Am-F-G progression
            'melody_style': 'catchy_pop'
        },
        'Classical': {
            'scale': 'major',
            'tempo': 120,
            'bass_notes': ['C3', 'F3', 'G3', 'C3'],
            'chord_progression': [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']],
            'melody_style': 'stepwise'
        },
        'Lo-fi Hip-Hop': {
            'scale': 'pentatonic',
            'tempo': 85,
            'bass_notes': ['C3', 'D3', 'F3', 'G3'],
            'chord_progression': [['C4', 'E4', 'G4'], ['D4', 'F4', 'A4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5']],
            'melody_style': 'relaxed'
        },
        'Ambient': {
            'scale': 'dorian',
            'tempo': 60,
            'bass_notes': ['C3', 'D3', 'F3', 'G3'],
            'chord_progression': [['C4', 'D#4', 'G4'], ['D4', 'F4', 'A4'], ['F4', 'G#4', 'C5'], ['G4', 'A#4', 'D5']],
            'melody_style': 'floating'
        },
        'Rock': {
            'scale': 'minor',
            'tempo': 140,
            'bass_notes': ['C3', 'D#3', 'F3', 'G3'],
            'chord_progression': [['C4', 'D#4', 'G4'], ['D#4', 'G4', 'A#4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5']],
            'melody_style': 'powerful'
        }
    }
    
    # Mood adjustments
    mood_adjustments = {
        'Happy': {'tempo_mult': 1.1, 'brightness': 1.2, 'energy': 1.0},
        'Sad': {'tempo_mult': 0.8, 'brightness': 0.7, 'energy': 0.6},
        'Relaxed': {'tempo_mult': 0.9, 'brightness': 0.9, 'energy': 0.5},
        'Energetic': {'tempo_mult': 1.3, 'brightness': 1.3, 'energy': 1.4},
        'Mysterious': {'tempo_mult': 0.85, 'brightness': 0.6, 'energy': 0.8}
    }
    
    # Get settings for this genre
    settings = genre_settings.get(genre, genre_settings['Electronic'])
    mood_adj = mood_adjustments.get(mood, mood_adjustments['Happy'])
    
    # Adjust tempo based on mood
    actual_tempo = settings['tempo'] * mood_adj['tempo_mult']
    beat_duration = 60.0 / actual_tempo  # Duration of one beat in seconds
    
    # Initialize audio
    audio = np.zeros(samples)
    
    # Generate bass line
    bass_audio = generate_bass_line(note_frequencies, settings['bass_notes'], 
                                   duration_seconds, sample_rate, beat_duration, mood_adj)
    
    # Generate chord progression
    chord_audio = generate_chord_progression(note_frequencies, settings['chord_progression'],
                                           duration_seconds, sample_rate, beat_duration, mood_adj, genre)
    
    # Generate melody
    melody_audio = generate_melody(note_frequencies, scales[settings['scale']], 
                                 settings['melody_style'], duration_seconds, sample_rate, 
                                 beat_duration, mood_adj, mood)
    
    # Mix the layers with appropriate levels
    bass_level = 0.4 * mood_adj['energy']
    chord_level = 0.3
    melody_level = 0.5 * mood_adj['brightness']
    
    audio = bass_level * bass_audio + chord_level * chord_audio + melody_level * melody_audio
    
    # Add genre-specific effects
    if genre == 'Lo-fi Hip-Hop':
        # Add vinyl crackle and warmth
        noise = np.random.normal(0, 0.01, samples)
        vinyl_crackle = np.random.poisson(0.002, samples) * np.random.normal(0, 0.05, samples)
        audio += noise + vinyl_crackle
        # Add slight low-pass filtering effect
        audio = apply_lowpass_effect(audio, sample_rate)
    
    elif genre == 'K-Pop':
        # Add APT.-inspired effects
        audio = add_kpop_apt_effects(audio, sample_rate, beat_duration, mood_adj)
    
    elif genre == 'Electronic':
        # Add some digital effects
        audio = add_electronic_effects(audio, sample_rate, beat_duration)
    
    elif genre == 'Rock':
        # Add distortion and drive
        audio = add_rock_distortion(audio, mood_adj['energy'])
    
    # Apply envelope (fade in/out)
    fade_samples = int(0.2 * sample_rate)  # 0.2 second fade
    if fade_samples < samples:
        fade_in = np.linspace(0, 1, fade_samples)
        fade_out = np.linspace(1, 0, fade_samples)
        audio[:fade_samples] *= fade_in
        audio[-fade_samples:] *= fade_out
    
    # Normalize to prevent clipping
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.8
    
    # Convert to 16-bit integers for WAV format
    audio = (audio * 32767).astype(np.int16)
    
    return audio


def generate_bass_line(note_freqs, bass_notes, duration, sample_rate, beat_duration, mood_adj):
    """Generate a bass line with rhythm"""
    samples = duration * sample_rate
    audio = np.zeros(samples)
    
    # Bass note pattern - play on beats
    notes_per_measure = len(bass_notes)
    measure_duration = beat_duration * 4  # 4 beats per measure
    
    # APT.-inspired rhythmic pattern (syncopated)
    apt_rhythm = [1.0, 0.5, 0.8, 0.6, 1.0, 0.3, 0.9, 0.4]  # Intensity pattern
    
    for i in range(int(duration / measure_duration) + 1):
        measure_start_time = i * measure_duration
        if measure_start_time >= duration:
            break
            
        for j, note in enumerate(bass_notes):
            # Create APT.-style syncopated rhythm
            beat_subdivision = 2  # Two hits per beat for APT.-style groove
            for sub in range(beat_subdivision):
                note_start_time = measure_start_time + j * beat_duration + sub * (beat_duration / beat_subdivision)
                note_end_time = note_start_time + (beat_duration / beat_subdivision) * 0.7
                
                if note_end_time > duration:
                    break
                    
                start_sample = int(note_start_time * sample_rate)
                end_sample = int(note_end_time * sample_rate)
                
                if end_sample <= samples:
                    note_duration = note_end_time - note_start_time
                    t = np.linspace(0, note_duration, end_sample - start_sample)
                    freq = note_freqs[note] * (0.5 if note.endswith('3') else 1.0)
                    
                    # APT.-style bass intensity
                    rhythm_idx = (j * beat_subdivision + sub) % len(apt_rhythm)
                    intensity = apt_rhythm[rhythm_idx]
                    
                    # Create bass tone with harmonics
                    wave = 0.6 * intensity * np.sin(2 * np.pi * freq * t)
                    wave += 0.2 * intensity * np.sin(2 * np.pi * freq * 2 * t)
                    wave += 0.1 * intensity * np.sin(2 * np.pi * freq * 3 * t)
                    
                    # Apply envelope with APT.-style punch
                    env_attack = int(0.005 * sample_rate)  # Shorter attack for punch
                    env_decay = int(0.08 * sample_rate)    # Quick decay
                    envelope = np.ones(len(wave))
                    
                    if len(wave) > env_attack:
                        envelope[:env_attack] = np.linspace(0, 1, env_attack)
                    if len(wave) > env_decay:
                        envelope[-env_decay:] *= np.linspace(1, 0.2, env_decay)
                    
                    wave *= envelope
                    audio[start_sample:end_sample] += wave
    
    return audio


def generate_chord_progression(note_freqs, chord_progression, duration, sample_rate, beat_duration, mood_adj, genre):
    """Generate chord progression with rhythm"""
    samples = duration * sample_rate
    audio = np.zeros(samples)
    
    chord_duration = beat_duration * 2  # Each chord lasts 2 beats
    
    for i in range(int(duration / chord_duration) + 1):
        chord_start_time = i * chord_duration
        if chord_start_time >= duration:
            break
            
        chord_idx = i % len(chord_progression)
        chord = chord_progression[chord_idx]
        chord_end_time = min(chord_start_time + chord_duration, duration)
        
        start_sample = int(chord_start_time * sample_rate)
        end_sample = int(chord_end_time * sample_rate)
        
        if end_sample <= samples:
            t = np.linspace(0, chord_end_time - chord_start_time, end_sample - start_sample)
            
            chord_wave = np.zeros(len(t))
            for note in chord:
                freq = note_freqs[note]
                # Create chord tones
                wave = 0.3 * np.sin(2 * np.pi * freq * t)
                
                # Add rhythm for certain genres
                if genre in ['Electronic', 'Rock']:
                    # Add rhythmic pulse
                    rhythm = 1 + 0.4 * np.sin(2 * np.pi * (1/beat_duration) * t)
                    wave *= rhythm
                elif genre == 'Lo-fi Hip-Hop':
                    # Add slight swing
                    swing = 1 + 0.2 * np.sin(2 * np.pi * 0.5 * t)
                    wave *= swing
                
                chord_wave += wave
            
            # Apply chord envelope
            if len(chord_wave) > 100:
                attack = int(0.05 * sample_rate)
                chord_wave[:attack] *= np.linspace(0, 1, attack)
            
            audio[start_sample:end_sample] += chord_wave
    
    return audio


def generate_melody(note_freqs, scale, style, duration, sample_rate, beat_duration, mood_adj, mood):
    """Generate a melodic line"""
    samples = duration * sample_rate
    audio = np.zeros(samples)
    
    note_duration = beat_duration / 2  # Eighth notes
    
    # Generate melody based on style
    melody_notes = []
    scale_len = len(scale)
    
    if style == 'stepwise':
        # Classical style - mostly stepwise motion
        current_idx = 0
        for i in range(int(duration / note_duration)):
            melody_notes.append(scale[current_idx])
            # Move mostly by step, occasionally by leap
            if random.random() < 0.8:  # 80% stepwise
                current_idx += random.choice([-1, 1])
            else:  # 20% leap
                current_idx += random.choice([-3, -2, 2, 3])
            current_idx = max(0, min(scale_len - 1, current_idx))
    
    elif style == 'arpeggiated':
        # Electronic style - arpeggiated patterns
        pattern = [0, 2, 4, 2, 1, 3, 5, 3]  # Scale degree pattern
        for i in range(int(duration / note_duration)):
            idx = pattern[i % len(pattern)]
            melody_notes.append(scale[min(idx, scale_len - 1)])
    
    elif style == 'relaxed':
        # Lo-fi style - relaxed, pentatonic-based
        for i in range(int(duration / note_duration)):
            # Favor certain scale degrees
            weights = [3, 1, 2, 1, 3, 2, 1, 2][:scale_len]
            idx = random.choices(range(scale_len), weights=weights)[0]
            melody_notes.append(scale[idx])
    
    elif style == 'floating':
        # Ambient style - floating, ethereal
        for i in range(int(duration / note_duration)):
            # Prefer higher notes and longer holds
            if i % 4 == 0:  # New note every 4th position
                idx = random.randint(scale_len//2, scale_len - 1)
                current_note = scale[idx]
            melody_notes.append(current_note if 'current_note' in locals() else scale[scale_len//2])
    
    elif style == 'catchy_pop':
        # K-Pop style - catchy, memorable patterns with rhythmic emphasis
        # Inspired by APT.'s melodic patterns
        apt_pattern = [0, 2, 4, 2, 0, 4, 2, 0]  # Catchy pop pattern
        for i in range(int(duration / note_duration)):
            # Create variation every 8 notes (like APT.'s verse/chorus structure)
            measure = i // 8
            if measure % 2 == 0:  # Verse-like pattern
                idx = apt_pattern[i % len(apt_pattern)]
            else:  # Chorus-like pattern - higher energy
                idx = (apt_pattern[i % len(apt_pattern)] + 1) % scale_len
            melody_notes.append(scale[min(idx, scale_len - 1)])
    
    elif style == 'powerful':
        # Rock style - powerful, rhythmic
        for i in range(int(duration / note_duration)):
            # Emphasize strong scale degrees (1, 3, 5)
            strong_degrees = [0, 2, 4]
            if i % 2 == 0:  # Strong beats
                idx = random.choice(strong_degrees)
            else:
                idx = random.randint(0, scale_len - 1)
            melody_notes.append(scale[min(idx, scale_len - 1)])
    
    # Generate audio for melody
    for i, note in enumerate(melody_notes):
        note_start_time = i * note_duration
        note_end_time = note_start_time + note_duration * 0.9  # Slight separation
        
        if note_end_time > duration:
            break
            
        start_sample = int(note_start_time * sample_rate)
        end_sample = int(note_end_time * sample_rate)
        
        if end_sample <= samples:
            t = np.linspace(0, note_end_time - note_start_time, end_sample - start_sample)
            freq = note_freqs[note]
            
            # Adjust frequency based on mood
            if mood == 'Sad':
                freq *= 0.95  # Slightly flat
            elif mood == 'Happy':
                freq *= 1.02  # Slightly sharp
            
            # Create melody tone
            wave = 0.4 * np.sin(2 * np.pi * freq * t)
            wave += 0.1 * np.sin(2 * np.pi * freq * 2 * t)  # Add slight harmonic
            
            # Apply note envelope
            if len(wave) > 10:
                attack = min(len(wave)//4, int(0.02 * sample_rate))
                decay = min(len(wave)//3, int(0.1 * sample_rate))
                
                envelope = np.ones(len(wave))
                envelope[:attack] = np.linspace(0, 1, attack)
                envelope[-decay:] *= np.linspace(1, 0.1, decay)
                wave *= envelope
            
            audio[start_sample:end_sample] += wave
    
    return audio


def apply_lowpass_effect(audio, sample_rate):
    """Simple low-pass filter effect for lo-fi sound"""
    # Simple moving average filter
    window_size = int(sample_rate * 0.0001)  # Very short window for subtle effect
    if window_size > 1:
        kernel = np.ones(window_size) / window_size
        filtered = np.convolve(audio, kernel, mode='same')
        return 0.8 * filtered + 0.2 * audio  # Blend with original
    return audio


def add_kpop_apt_effects(audio, sample_rate, beat_duration, mood_adj):
    """Add K-Pop APT.-inspired effects"""
    # Create APT.-style rhythmic emphasis
    t = np.linspace(0, len(audio) / sample_rate, len(audio))
    
    # APT.-style syncopated rhythm emphasis
    beat_freq = 1.0 / beat_duration
    syncopation = 1 + 0.3 * np.sin(2 * np.pi * beat_freq * t) + 0.2 * np.sin(2 * np.pi * beat_freq * 1.5 * t)
    
    # Add subtle brightness (like APT.'s crisp production)
    brightness = 1 + 0.15 * mood_adj['brightness'] * np.sin(2 * np.pi * 8 * t)
    
    # APT.-style punch with slight compression effect
    compressed = np.tanh(audio * 1.2) * 0.9
    
    return compressed * syncopation * brightness


def add_electronic_effects(audio, sample_rate, beat_duration):
    """Add electronic music effects"""
    # Add slight tremolo
    t = np.linspace(0, len(audio) / sample_rate, len(audio))
    tremolo = 1 + 0.1 * np.sin(2 * np.pi * 6 * t)  # 6 Hz tremolo
    return audio * tremolo


def add_rock_distortion(audio, energy):
    """Add rock-style distortion"""
    # Soft clipping distortion
    drive = 1 + energy
    distorted = np.tanh(audio * drive) / drive
    return 0.7 * distorted + 0.3 * audio  # Blend with clean signal

if __name__ == "__main__":
    # Test the function with multiple genres
    print("Testing music generation...")
    
    # Test K-Pop (APT.-inspired)
    print("\n🎵 Generating K-Pop (APT.-inspired) music...")
    apt_audio = generate_music(genre="K-Pop", mood="Energetic", duration_seconds=8)
    print(f"K-Pop audio shape: {apt_audio.shape}")
    print(f"K-Pop audio duration: {len(apt_audio) / 44100:.2f} seconds")
    
    # Test Electronic
    print("\n🎛️ Generating Electronic music...")
    electronic_audio = generate_music(genre="Electronic", mood="Happy", duration_seconds=5)
    print(f"Electronic audio shape: {electronic_audio.shape}")
    print(f"Electronic audio duration: {len(electronic_audio) / 44100:.2f} seconds")
    
    print("\n✨ All tests completed! K-Pop genre with APT.-inspired patterns is ready.")
