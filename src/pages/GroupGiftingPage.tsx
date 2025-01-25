import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';
import { useGroupGift } from '../context/GroupGiftContext';
import CreateGroupGiftModal from '../components/CreateGroupGiftModal';
import ContributeModal from '../components/ContributeModal';
import ShareGiftModal from '../components/ShareGiftModal';
import {
  Users,
  Gift,
  DollarSign,
  Calendar,
  ArrowLeft,
  Plus,
  Search,
  MessageSquare,
  Share2,
  Heart,
  X,
  Link
} from 'lucide-react';

interface GroupGift {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  recipient: string;
  occasion: string;
  deadline: string;
  organizer: string;
  participants: Participant[];
  giftOptions: GiftOption[];
  selectedGift?: GiftOption;
  status: 'active' | 'completed' | 'cancelled';
  messages: Message[];
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  contribution: number;
  status: 'invited' | 'joined' | 'declined';
  votedGift?: string;
}

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

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  content: string;
  timestamp: string;
  type: 'chat' | 'system' | 'contribution' | 'vote';
}

const GroupGiftingPage: React.FC = () => {
  const navigate = useNavigate();
  const { region } = useRegion();
  const { groupGifts } = useGroupGift();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedGift, setSelectedGift] = useState<GroupGift | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNewGift = () => {
    setIsCreateModalOpen(true);
  };

  const handleGiftCreated = (giftId: string) => {
    setIsCreateModalOpen(false);
    setIsShareModalOpen(true);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Ended';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(region === 'IN' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: region === 'IN' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const filteredGifts = groupGifts.filter(gift => 
    gift.status === activeTab &&
    (gift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     gift.recipient.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Group Gifting</h1>
                  <p className="text-gray-600">Collaborate with others to give meaningful gifts</p>
                </div>
                <button
                  onClick={handleCreateNewGift}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Gift
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeTab === 'active'
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active Collections
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Completed Gifts
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search group gifts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Gift Cards */}
              <div className="space-y-4">
                {filteredGifts.map((gift) => (
                  <div
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{gift.title}</h3>
                        <p className="text-gray-600">For: {gift.recipient}</p>
                      </div>
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
                        {gift.occasion}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>
                          {formatCurrency(gift.currentAmount)} of {formatCurrency(gift.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-500"
                          style={{
                            width: `${getProgressPercentage(gift.currentAmount, gift.targetAmount)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {gift.participants.slice(0, 3).map((participant) => (
                            <img
                              key={participant.id}
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-8 h-8 rounded-full border-2 border-white"
                            />
                          ))}
                          {gift.participants.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                              +{gift.participants.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-gray-600">
                          {gift.participants.length} participants
                        </span>
                      </div>
                      <span className="text-rose-500">{getDaysRemaining(gift.deadline)}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsContributeModalOpen(true);
                        }}
                        className="flex-1 py-2 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Contribute
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShareModalOpen(true);
                        }}
                        className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}

                {filteredGifts.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No gifts found</h3>
                    <p className="text-gray-600">
                      {searchQuery
                        ? "No gifts match your search"
                        : activeTab === 'active'
                        ? "You haven't created any group gifts yet"
                        : "You don't have any completed gifts"}
                    </p>
                    {!searchQuery && activeTab === 'active' && (
                      <button
                        onClick={handleCreateNewGift}
                        className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Create New Gift
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gift Details Sidebar */}
          {selectedGift && (
            <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedGift.title}</h2>
                  <p className="text-gray-600">Organized by {selectedGift.organizer}</p>
                </div>
                <button
                  onClick={() => setSelectedGift(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Total Collected</span>
                    <span>
                      {formatCurrency(selectedGift.currentAmount)} of{' '}
                      {formatCurrency(selectedGift.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${getProgressPercentage(
                          selectedGift.currentAmount,
                          selectedGift.targetAmount
                        )}%`
                      }}
                    />
                  </div>
                </div>

                {/* Gift Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Gift Options</h3>
                  <div className="space-y-4">
                    {selectedGift.giftOptions.map((option) => (
                      <div
                        key={option.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-rose-200 transition-colors"
                      >
                        <div className="flex gap-4">
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{option.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-rose-500 font-medium">
                                {formatCurrency(option.price)}
                              </span>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{option.votes} votes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Participants</h3>
                  <div className="space-y-3">
                    {selectedGift.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium">{participant.name}</span>
                        </div>
                        <span className="text-gray-600">
                          {formatCurrency(participant.contribution)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Chat */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Chat</h3>
                  <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                    {selectedGift.messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <img
                          src={message.avatar}
                          alt={message.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.userName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <button className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Share Link */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Share Link</span>
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link className="w-4 h-4" />
                    <span className="truncate">
                      {`${window.location.origin}/group-gifting/${selectedGift.id}`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsContributeModalOpen(true)}
                    className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Contribute
                  </button>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateGroupGiftModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleGiftCreated}
      />

      {selectedGift && (
        <>
          <ContributeModal
            isOpen={isContributeModalOpen}
            onClose={() => setIsContributeModalOpen(false)}
            giftId={selectedGift.id}
            remainingAmount={selectedGift.targetAmount - selectedGift.currentAmount}
          />

          <ShareGiftModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            giftId={selectedGift.id}
            giftTitle={selectedGift.title}
          />
        </>
      )}
    </div>
  );
};

export default GroupGiftingPage;