import React, { useState } from 'react';
import { X, Gift, Calendar, DollarSign, Users } from 'lucide-react';
import { useGroupGift } from '../context/GroupGiftContext';
import { useUser } from '../context/UserContext';
import { useRegion } from '../context/RegionContext';

interface CreateGroupGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (giftId: string) => void;
}

interface FormData {
  title: string;
  recipient: string;
  occasion: string;
  targetAmount: string;
  deadline: string;
  minContribution?: string;
}

const CreateGroupGiftModal: React.FC<CreateGroupGiftModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useUser();
  const { region, currencySymbol } = useRegion();
  const { createGroupGift } = useGroupGift();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    recipient: '',
    occasion: '',
    targetAmount: '',
    deadline: '',
    minContribution: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const giftId = await createGroupGift({
        title: formData.title,
        recipient: formData.recipient,
        occasion: formData.occasion,
        targetAmount: Number(formData.targetAmount),
        currentAmount: 0,
        deadline: formData.deadline,
        organizer: user.name,
        participants: [{
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          contribution: 0,
          status: 'joined'
        }],
        status: 'active',
        minContribution: formData.minContribution ? Number(formData.minContribution) : undefined
      });

      // Generate share link
      const shareUrl = `${window.location.origin}/group-gifting/${giftId}`;
      localStorage.setItem('lastCreatedGiftShare', shareUrl);

      onSuccess(giftId);
      onClose();
    } catch (error) {
      setError('Failed to create group gift. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
            <Gift className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Create Group Gift</h3>
          <p className="text-gray-600 text-sm">Set up a new group gift collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gift Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="E.g., Dad's 60th Birthday Gift"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Who is this gift for?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasion
            </label>
            <select
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              <option value="">Select occasion</option>
              <option value="Birthday">Birthday</option>
              <option value="Wedding">Wedding</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Baby Shower">Baby Shower</option>
              <option value="Graduation">Graduation</option>
              <option value="Farewell">Farewell</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter target amount"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Contribution ({currencySymbol}) (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={formData.minContribution}
                onChange={(e) => setFormData({ ...formData, minContribution: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter minimum contribution"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Create Group Gift
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupGiftModal;