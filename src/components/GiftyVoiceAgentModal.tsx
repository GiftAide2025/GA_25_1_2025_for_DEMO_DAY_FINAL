import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mic, Brain, StopCircle } from 'lucide-react';
import { transcribeAudio } from '../services/openaiVoice';
import { generateVoiceGreeting, generateVoicePrompt, generateMissingParamPrompt } from '../prompts/voicesearchprompt';
import { voiceInteraction } from '../services/voiceInteraction';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ExtractedParameters {
  occasion?: string;
  recipient?: string;
  interests?: string[];
  budget?: string;
  giftPreference?: 'physical' | 'experience';
  additionalPreferences?: string;
}

const GiftyVoiceAgentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedParams, setExtractedParams] = useState<ExtractedParameters>({});
  const [interactionCount, setInteractionCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const checkRequiredParams = (params: ExtractedParameters): string[] => {
    const missing: string[] = [];
    if (!params.occasion || params.occasion === 'missing') missing.push('occasion');
    if (!params.recipient || params.recipient === 'missing') missing.push('recipient');
    if (!params.interests || params.interests === 'missing' || params.interests.length === 0) missing.push('interests');
    if (!params.budget || params.budget === 'missing') missing.push('budget');
    return missing;
  };

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(console.error);
      const greeting = generateVoiceGreeting();
      addMessage(greeting, false);
      voiceInteraction.playResponse(greeting);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        setIsProcessing(true);
        const audioBlob = voiceInteraction.stopRecording();
        
        if (audioBlob) {
          const transcription = await transcribeAudio(audioBlob);
          addMessage(transcription, true);
          await processUserInput(transcription);
        }
      } else {
        await voiceInteraction.startRecording();
        setIsRecording(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserInput = async (input: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: generateVoicePrompt(input)
            }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      const parsedResponse = JSON.parse(data.choices[0].message.content);
      
      const updatedParams = {
        ...extractedParams,
        ...parsedResponse.parameters,
        interests: [
          ...(extractedParams.interests || []),
          ...(Array.isArray(parsedResponse.parameters.interests) ? parsedResponse.parameters.interests : [])
        ].filter((v, i, a) => a.indexOf(v) === i)
      };
      
      setExtractedParams(updatedParams);
      
      const missingParams = checkRequiredParams(updatedParams);
      const hasAllParams = missingParams.length === 0;

      if (hasAllParams) {
        const searchResponse = "Perfect! Let me search for gift suggestions based on what you've told me.";
        addMessage(searchResponse, false);
        await voiceInteraction.playResponse(searchResponse);
        localStorage.setItem('user_input', JSON.stringify(updatedParams));
        navigate('/gift-suggestions');
      } else if (interactionCount < 1) {
        setInteractionCount(prev => prev + 1);
        const nextPrompt = generateMissingParamPrompt(missingParams[0]);
        addMessage(nextPrompt, false);
        voiceInteraction.playResponse(nextPrompt);
      } else {
        const finalResponse = "I'll do my best to find gift suggestions with the information you've provided.";
        addMessage(finalResponse, false);
        await voiceInteraction.playResponse(finalResponse);
        localStorage.setItem('user_input', JSON.stringify(updatedParams));
        navigate('/gift-suggestions');
      }
    } catch (err) {
      console.error('Error processing input:', err);
      setError('Failed to process input. Please try again.');
    }
  };

  useEffect(() => {
    return () => {
      voiceInteraction.cleanup();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-rose-200 to-purple-200 bg-opacity-100 z-50 flex items-center justify-center">
      <div className="bg-white/95 backdrop-tranparent rounded-2xl shadow-xl w-[95vw] max-w-5xl h-[85vh] p-8 relative flex flex-col">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-rose-300 to-purple-300 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gifty-Voice Agent</h2>
              <p className="text-sm text-gray-600">Your voice-powered gift finding assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none bg-opacity-100"
            src="https://cdn.dribbble.com/userupload/17085736/file/original-fd209178ae722b727cc77d04549943e7.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          
          <div className="absolute inset-0 backdrop-transparent pointer-events-none"></div>

          <div className="relative z-10 h-full p-6 overflow-y-auto">
            <div className="space-y-4 pb-20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg backdrop-transparent ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-rose-400/90 to-purple-400/90 text-white'
                        : 'backdrop-transparent '
                    }`}
                  >
                    <p className="text-base leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20">
            <div className="mx-4 p-4 bg-red-50 border border-red-100 rounded-xl shadow-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={toggleRecording}
            disabled={isProcessing || interactionCount >= 2}
            className={`p-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-rose-400 to-purple-400'
            } ${(isProcessing || interactionCount >= 2) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? (
              <StopCircle className="w-10 h-10 text-white" />
            ) : (
              <Mic className={`w-10 h-10 text-white ${isProcessing ? 'animate-pulse' : ''}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftyVoiceAgentModal;