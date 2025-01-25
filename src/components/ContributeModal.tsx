import React, { useState } from 'react';
import { 
  X, DollarSign, CreditCard, Smartphone, Globe, 
  QrCode, Copy, CheckCircle2, Edit2, Save
} from 'lucide-react';
import { useGroupGift } from '../context/GroupGiftContext';
import { useUser } from '../context/UserContext';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftId: string;
  minContribution?: number;
  remainingAmount: number;
  organizerPhone?: string;
  organizerUPI?: string;
  isOrganizer?: boolean;
  onUpdatePaymentDetails?: (details: { phone?: string; upi?: string }) => void;
}

type PaymentMethod = 'card' | 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'paypal' | 'venmo' | 'cashapp' | 'zelle';
type Region = 'IN' | 'US';

const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  giftId,
  minContribution,
  remainingAmount,
  organizerPhone = "+1234567890",  // Demo phone number
  organizerUPI = "user@upi",       // Demo UPI ID
  isOrganizer = false,
  onUpdatePaymentDetails
}) => {
  const { user } = useUser();
  const { addContribution } = useGroupGift();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [region, setRegion] = useState<Region>('IN');
  const [copied, setCopied] = useState(false);
  
  // New state for editable fields
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingUPI, setIsEditingUPI] = useState(false);
  const [editedPhone, setEditedPhone] = useState(organizerPhone);
  const [editedUPI, setEditedUPI] = useState(organizerUPI);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePhone = () => {
    if (onUpdatePaymentDetails) {
      onUpdatePaymentDetails({ phone: editedPhone });
    }
    setIsEditingPhone(false);
  };

  const handleSaveUPI = () => {
    if (onUpdatePaymentDetails) {
      onUpdatePaymentDetails({ upi: editedUPI });
    }
    setIsEditingUPI(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const contributionAmount = Number(amount);
    
    if (minContribution && contributionAmount < minContribution) {
      setError(`Minimum contribution is $${minContribution}`);
      return;
    }

    if (contributionAmount > remainingAmount) {
      setError(`Maximum contribution is $${remainingAmount}`);
      return;
    }

    try {
      await addContribution(giftId, user.id, contributionAmount);
      onClose();
    } catch (error) {
      setError('Failed to process contribution');
    }
  };

  const indianPaymentMethods = [
    { id: 'upi', name: 'UPI Direct', icon: QrCode },
    { id: 'gpay', name: 'Google Pay', icon: Smartphone },
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone },
    { id: 'paytm', name: 'Paytm', icon: Smartphone }
  ];

  const usPaymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: Globe },
    { id: 'venmo', name: 'Venmo', icon: Smartphone },
    { id: 'cashapp', name: 'Cash App', icon: DollarSign },
    { id: 'zelle', name: 'Zelle', icon: Smartphone }
  ];

  const getPaymentMethods = () => region === 'IN' ? indianPaymentMethods : usPaymentMethods;

  const getPaymentInstructions = () => {
    const currentPhone = isEditingPhone ? editedPhone : organizerPhone;
    const currentUPI = isEditingUPI ? editedUPI : organizerUPI;

    switch (paymentMethod) {
      case 'upi':
        return {
          title: 'Pay via UPI',
          instructions: [
            'Open your UPI app',
            `Enter UPI ID: ${currentUPI}`,
            `Enter amount: ${amount}`,
            'Complete the payment'
          ],
          copyText: currentUPI
        };
      case 'gpay':
      case 'phonepe':
      case 'paytm':
        return {
          title: `Pay via ${paymentMethod.toUpperCase()}`,
          instructions: [
            `Open your ${paymentMethod.toUpperCase()} app`,
            `Search for number: ${currentPhone}`,
            `Enter amount: ${amount}`,
            'Complete the payment'
          ],
          copyText: currentPhone
        };
      case 'paypal':
      case 'venmo':
      case 'cashapp':
      case 'zelle':
        return {
          title: `Pay via ${paymentMethod}`,
          instructions: [
            `Open your ${paymentMethod} app`,
            `Search for: ${currentPhone}`,
            `Enter amount: ${amount}`,
            'Complete the payment'
          ],
          copyText: currentPhone
        };
      default:
        return null;
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
            <DollarSign className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Make a Contribution</h3>
          <p className="text-gray-600 text-sm">
            {minContribution ? `Minimum contribution: $${minContribution}` : 'Any amount is appreciated'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Region Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRegion('IN')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                region === 'IN'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              India
            </button>
            <button
              type="button"
              onClick={() => setRegion('US')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                region === 'US'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              United States
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contribution Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter amount"
                min={minContribution || 0}
                max={remainingAmount}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-4">Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              {getPaymentMethods().map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="text-rose-500 focus:ring-rose-500"
                  />
                  <div className="ml-3 flex items-center">
                    <method.icon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm">{method.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {amount && paymentMethod !== 'card' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4">
                {getPaymentInstructions()?.title}
              </h4>
              <div className="space-y-4">
                {/* UPI ID Field */}
                {paymentMethod === 'upi' && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-gray-400" />
                      {isEditingUPI && isOrganizer ? (
                        <input
                          type="text"
                          value={editedUPI}
                          onChange={(e) => setEditedUPI(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                          placeholder="Enter UPI ID"
                        />
                      ) : (
                        <span className="font-medium">{editedUPI}</span>
                      )}
                    </div>
                    {isOrganizer ? (
                      isEditingUPI ? (
                        <button
                          type="button"
                          onClick={handleSaveUPI}
                          className="p-2 text-green-500 hover:text-green-600"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingUPI(true)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCopy(editedUPI)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Phone Number Field */}
                {(paymentMethod === 'gpay' || paymentMethod === 'phonepe' || paymentMethod === 'paytm') && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      {isEditingPhone && isOrganizer ? (
                        <input
                          type="tel"
                          value={editedPhone}
                          onChange={(e) => setEditedPhone(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <span className="font-medium">{editedPhone}</span>
                      )}
                    </div>
                    {isOrganizer ? (
                      isEditingPhone ? (
                        <button
                          type="button"
                          onClick={handleSavePhone}
                          className="p-2 text-green-500 hover:text-green-600"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingPhone(true)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCopy(editedPhone)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                <ol className="space-y-2">
                  {getPaymentInstructions()?.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="font-medium">{index + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Contribute {amount ? `$${amount}` : ''}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;