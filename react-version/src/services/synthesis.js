// Enhanced synthesis functions for realistic instrument sounds
export class EnhancedSynthesis {
  static generateADSR(attack, decay, sustain, release, duration, sampleRate) {
    const totalSamples = Math.floor(duration * sampleRate);
    const attackSamples = Math.floor(attack * sampleRate);
    const decaySamples = Math.floor(decay * sampleRate);
    const releaseSamples = Math.floor(release * sampleRate);
    const sustainSamples = totalSamples - attackSamples - decaySamples - releaseSamples;
    
    const envelope = new Float32Array(totalSamples);
    
    // Attack
    for (let i = 0; i < attackSamples && i < totalSamples; i++) {
      envelope[i] = i / attackSamples;
    }
    
    // Decay
    for (let i = 0; i < decaySamples && (attackSamples + i) < totalSamples; i++) {
      envelope[attackSamples + i] = 1 - (1 - sustain) * (i / decaySamples);
    }
    
    // Sustain
    for (let i = 0; i < sustainSamples && (attackSamples + decaySamples + i) < totalSamples; i++) {
      envelope[attackSamples + decaySamples + i] = sustain;
    }
    
    // Release
    for (let i = 0; i < releaseSamples && (totalSamples - releaseSamples + i) < totalSamples; i++) {
      envelope[totalSamples - releaseSamples + i] = sustain * (1 - i / releaseSamples);
    }
    
    return envelope;
  }
  
  static synthesizePiano(frequency, duration, velocity, sampleRate) {
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    // Multiple harmonics for piano timbre
    const harmonics = [
      {freq: 1.0, amp: 0.8, phase: 0},
      {freq: 2.0, amp: 0.4, phase: 0.1},
      {freq: 3.0, amp: 0.2, phase: 0.2},
      {freq: 4.0, amp: 0.1, phase: 0.3},
      {freq: 5.0, amp: 0.05, phase: 0.4},
      {freq: 6.0, amp: 0.03, phase: 0.5}
    ];
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      for (const harmonic of harmonics) {
        // Add slight inharmonicity for realism
        const inharmonicity = 1 + 0.0001 * harmonic.freq * harmonic.freq;
        const harmonicFreq = frequency * harmonic.freq * inharmonicity;
        
        sample += harmonic.amp * velocity * Math.sin(2 * Math.PI * harmonicFreq * t + harmonic.phase);
      }
      
      signal[i] = sample;
    }
    
    // Piano ADSR envelope
    const envelope = this.generateADSR(0.01, 0.3, 0.3, 0.8, duration, sampleRate);
    
    // Apply envelope
    for (let i = 0; i < samples; i++) {
      signal[i] *= envelope[i];
    }
    
    return signal;
  }
  
  static synthesizeBass(frequency, duration, velocity, sampleRate) {
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Rich bass harmonics
      const fundamental = 0.8 * Math.sin(2 * Math.PI * frequency * t);
      const second = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * t);
      const third = 0.15 * Math.sin(2 * Math.PI * frequency * 3 * t);
      const sub = 0.2 * Math.sin(2 * Math.PI * frequency * 0.5 * t);
      
      signal[i] = velocity * (fundamental + second + third + sub);
    }
    
    // Bass ADSR with punchy attack
    const envelope = this.generateADSR(0.005, 0.1, 0.7, 0.3, duration, sampleRate);
    
    for (let i = 0; i < samples; i++) {
      signal[i] *= envelope[i];
    }
    
    return signal;
  }
  
  static synthesizeElectricPiano(frequency, duration, velocity, sampleRate) {
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Bell-like harmonics for electric piano
      const fundamental = 0.8 * Math.sin(2 * Math.PI * frequency * t);
      const second = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * t);
      const third = 0.15 * Math.sin(2 * Math.PI * frequency * 3 * t);
      
      // Add tremolo for electric piano character
      const tremolo = 1 + 0.1 * Math.sin(2 * Math.PI * 5 * t);
      
      signal[i] = velocity * (fundamental + second + third) * tremolo;
    }
    
    // Electric piano ADSR
    const envelope = this.generateADSR(0.01, 0.5, 0.4, 1.2, duration, sampleRate);
    
    for (let i = 0; i < samples; i++) {
      signal[i] *= envelope[i];
    }
    
    return signal;
  }
  
  static synthesizePad(frequency, duration, velocity, sampleRate) {
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Multiple detuned oscillators for pad thickness
      const osc1 = Math.sin(2 * Math.PI * frequency * t);
      const osc2 = Math.sin(2 * Math.PI * frequency * 1.003 * t);
      const osc3 = Math.sin(2 * Math.PI * frequency * 0.997 * t);
      
      // Filter sweep for movement
      const cutoffSweep = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.1 * t);
      
      signal[i] = velocity * (osc1 + osc2 + osc3) / 3 * cutoffSweep;
    }
    
    // Pad ADSR with slow attack
    const envelope = this.generateADSR(0.5, 0.3, 0.8, 1.0, duration, sampleRate);
    
    for (let i = 0; i < samples; i++) {
      signal[i] *= envelope[i];
    }
    
    return signal;
  }
}

// Enhanced drum synthesis
export class DrumSynthesis {
  static generateKick(sampleRate) {
    const duration = 0.15;
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Frequency sweep from 80Hz to 30Hz
      const freqSweep = 80 * Math.exp(-t * 20);
      const phase = 2 * Math.PI * freqSweep * t;
      
      // Kick drum tone
      const tone = Math.sin(phase);
      
      // Click for punch
      const click = Math.random() * 0.5 * Math.exp(-t * 100);
      
      // Envelope
      const envelope = Math.exp(-t * 15);
      
      signal[i] = (tone + click) * envelope * 0.8;
    }
    
    return signal;
  }
  
  static generateSnare(sampleRate) {
    const duration = 0.1;
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Tone component
      const tone = 0.3 * Math.sin(2 * Math.PI * 200 * t);
      
      // Noise component
      const noise = (Math.random() - 0.5) * 0.7;
      
      // Envelope
      const envelope = Math.exp(-t * 30);
      
      signal[i] = (tone + noise) * envelope * 0.6;
    }
    
    return signal;
  }
  
  static generateHiHat(sampleRate) {
    const duration = 0.05;
    const samples = Math.floor(duration * sampleRate);
    const signal = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // High-frequency noise
      const noise = (Math.random() - 0.5) * 0.8;
      
      // High-pass filter effect (simplified)
      const filtered = i > 0 ? noise - signal[i-1] * 0.5 : noise;
      
      // Envelope
      const envelope = Math.exp(-t * 80);
      
      signal[i] = filtered * envelope * 0.4;
    }
    
    return signal;
  }
}
