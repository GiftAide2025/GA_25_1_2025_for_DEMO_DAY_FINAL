import React, { useState } from 'react';
import { X, Copy, Share2, Mail, MessageSquare, QrCode, CheckCircle2 } from 'lucide-react';

interface ShareGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: string;
  giftTitle: string;
}

const ShareGiftModal: React.FC<ShareGiftModalProps> = ({
  isOpen,
  onClose,
  giftId,
  giftTitle
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = localStorage.getItem('lastCreatedGiftShare') || 
                  `${window.location.origin}/group-gifting/${giftId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Group Gift: ${giftTitle}`,
          text: `Join me in contributing to a group gift for ${giftTitle}!`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Join Group Gift: ${giftTitle}`);
    const body = encodeURIComponent(
      `Join me in contributing to a group gift!\n\nClick here to participate: ${shareUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
            <Share2 className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Share Group Gift</h3>
          <p className="text-gray-600 text-sm">Invite others to contribute</p>
        </div>

        <div className="space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
              />
              <button
                onClick={handleCopy}
                className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleEmailShare}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareGiftModal;