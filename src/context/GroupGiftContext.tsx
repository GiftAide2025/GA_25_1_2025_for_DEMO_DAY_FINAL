import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GiftOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  url: string;
  votes: number;
  suggestedBy: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  contribution: number;
  status: 'invited' | 'joined' | 'declined';
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  content: string;
  timestamp: string;
  type: 'chat' | 'system' | 'contribution' | 'vote';
}

interface GroupGift {
  id: string;
  title: string;
  recipient: string;
  occasion: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  organizer: string;
  participants: Participant[];
  giftOptions: GiftOption[];
  status: 'active' | 'completed';
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  minContribution?: number;
}

interface GroupGiftContextType {
  groupGifts: GroupGift[];
  createGroupGift: (data: Omit<GroupGift, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'giftOptions'>) => Promise<string>;
  addContribution: (giftId: string, userId: string, amount: number) => Promise<void>;
  addMessage: (giftId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  voteForGift: (giftId: string, optionId: string, userId: string) => Promise<void>;
}

const GroupGiftContext = createContext<GroupGiftContextType | undefined>(undefined);

// Dummy gift options for testing
const dummyGiftOptions: GiftOption[] = [
  {
    id: '1',
    name: 'Premium Leather Wallet',
    price: 79.99,
    description: 'Handcrafted genuine leather wallet with RFID protection',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80',
    url: 'https://amazon.com/wallet',
    votes: 3,
    suggestedBy: 'Sarah'
  },
  {
    id: '2',
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    description: 'Premium sound quality with active noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    url: 'https://amazon.com/headphones',
    votes: 5,
    suggestedBy: 'Mike'
  },
  {
    id: '3',
    name: 'Smart Watch Series 7',
    price: 299.99,
    description: 'Advanced fitness tracking and health monitoring',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80',
    url: 'https://amazon.com/smartwatch',
    votes: 4,
    suggestedBy: 'John'
  }
];

export const GroupGiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupGifts, setGroupGifts] = useState<GroupGift[]>([]);

  const createGroupGift = async (data: Omit<GroupGift, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'giftOptions'>) => {
    const newGift: GroupGift = {
      ...data,
      id: uuidv4(),
      messages: [],
      giftOptions: dummyGiftOptions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGroupGifts(prev => [...prev, newGift]);
    return newGift.id;
  };

  const addContribution = async (giftId: string, userId: string, amount: number) => {
    setGroupGifts(prev => prev.map(gift => {
      if (gift.id === giftId) {
        const updatedParticipants = gift.participants.map(p => 
          p.id === userId ? { ...p, contribution: p.contribution + amount } : p
        );
        
        const newMessage: Message = {
          id: uuidv4(),
          userId,
          userName: gift.participants.find(p => p.id === userId)?.name || 'Unknown',
          content: `Contributed ${amount}`,
          timestamp: new Date().toISOString(),
          type: 'contribution'
        };

        return {
          ...gift,
          currentAmount: gift.currentAmount + amount,
          participants: updatedParticipants,
          messages: [...gift.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return gift;
    }));
  };

  const addMessage = async (giftId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setGroupGifts(prev => prev.map(gift => {
      if (gift.id === giftId) {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          timestamp: new Date().toISOString()
        };
        return {
          ...gift,
          messages: [...gift.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return gift;
    }));
  };

  const voteForGift = async (giftId: string, optionId: string, userId: string) => {
    setGroupGifts(prev => prev.map(gift => {
      if (gift.id === giftId) {
        const updatedOptions = gift.giftOptions.map(option =>
          option.id === optionId ? { ...option, votes: option.votes + 1 } : option
        );

        const userName = gift.participants.find(p => p.id === userId)?.name || 'Unknown';
        const votedOption = gift.giftOptions.find(o => o.id === optionId);

        const newMessage: Message = {
          id: uuidv4(),
          userId,
          userName,
          content: `Voted for ${votedOption?.name}`,
          timestamp: new Date().toISOString(),
          type: 'vote'
        };

        return {
          ...gift,
          giftOptions: updatedOptions,
          messages: [...gift.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return gift;
    }));
  };

  return (
    <GroupGiftContext.Provider
      value={{
        groupGifts,
        createGroupGift,
        addContribution,
        addMessage,
        voteForGift
      }}
    >
      {children}
    </GroupGiftContext.Provider>
  );
};

export const useGroupGift = () => {
  const context = useContext(GroupGiftContext);
  if (context === undefined) {
    throw new Error('useGroupGift must be used within a GroupGiftProvider');
  }
  return context;
};