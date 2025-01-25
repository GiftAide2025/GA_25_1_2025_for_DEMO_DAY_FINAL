import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Validate audio blob
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Invalid audio data');
    }

    // Convert blob to file with proper MIME type
    const audioFile = new File([audioBlob], 'audio.webm', { 
      type: audioBlob.type || 'audio/webm'
    });

    // Validate file size (max 25MB for Whisper API)
    if (audioFile.size > 25 * 1024 * 1024) {
      throw new Error('Audio file too large. Maximum size is 25MB.');
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Specify English for better accuracy
      response_format: 'text',
      temperature: 0.3, // Lower temperature for more accurate transcription
    });

    // Validate transcription result
    if (!transcription || typeof transcription !== 'string') {
      throw new Error('Invalid transcription result');
    }

    return transcription.trim();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to transcribe audio');
  }
};

export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  try {
    // Validate input text
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for speech synthesis');
    }

    // Clean and prepare text
    const cleanText = text.trim().replace(/\s+/g, ' ');

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // Use consistent voice for better user experience
      input: cleanText,
      speed: 1.0,
      response_format: 'mp3',
    });

    // Get the binary audio data
    const arrayBuffer = await response.arrayBuffer();
    
    // Validate response
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Invalid speech synthesis response');
    }

    return arrayBuffer;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to convert text to speech');
  }
};