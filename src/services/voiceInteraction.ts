import { textToSpeech } from './openaiVoice';
import { generateVoiceGreeting, generateVoicePrompt, generateMissingParamPrompt, generateConfirmationPrompt } from '../prompts/voicesearchprompt';

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  error: string | null;
}

class VoiceInteractionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async requestMicrophonePermission(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      return true;
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    if (!this.stream) {
      const hasPermission = await this.requestMicrophonePermission();
      if (!hasPermission) throw new Error('Microphone permission denied');
    }

    const mimeType = this.getSupportedMimeType();
    if (!mimeType) throw new Error('No supported audio MIME type found');

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream!, {
      mimeType,
      audioBitsPerSecond: 128000
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
  }

  stopRecording(): Blob | null {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.stream = null;
      
      return new Blob(this.audioChunks, { type: this.getSupportedMimeType() });
    }
    return null;
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/wav',
      'audio/mp4'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    throw new Error('No supported audio MIME type found');
  }

  async playResponse(text: string): Promise<void> {
    try {
      const audioBuffer = await textToSpeech(text);
      const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      
      return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        
        audio.onerror = (error) => {
          URL.revokeObjectURL(url);
          reject(error);
        };

        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error playing voice response:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

export const voiceInteraction = new VoiceInteractionService();