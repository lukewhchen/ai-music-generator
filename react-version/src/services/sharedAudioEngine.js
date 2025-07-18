import { AudioEngine } from './audioEngine.js';

// Create a singleton AudioEngine instance that can be shared across components
export const sharedAudioEngine = new AudioEngine();
