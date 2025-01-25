import React, { useState } from 'react';
import { X, Calendar, Gift } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface AddRecipientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecipientData) => void;
}

export interface RecipientData {
  name: string;
  relationship: string;
  birthdate: string;
  interests: string[];
  notes: string;
}

const AddRecipientForm: React.FC<AddRecipientFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RecipientData>({
    name: '',
    relationship: '',
    birthdate: '',
    interests: [],
    notes: ''
  });

  const [interest, setInterest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No user logged in');

      // Validate required fields
      if (!formData.name || !formData.relationship || !formData.birthdate) {
        throw new Error('Please fill in all required fields');
      }

      // Insert data into Supabase
      const { data, error: insertError } = await supabase
        .from('recipients')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          relationship: formData.relationship,
          birthdate: formData.birthdate,
          interests: formData.interests,
          notes: formData.notes?.trim() || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to save recipient. Please try again.');
      }

      if (!data) {
        throw new Error('No data returned after insert');
      }

      // Call the onSubmit prop with the form data
      onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        relationship: '',
        birthdate: '',
        interests: [],
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving recipient:', error);
      setError(error instanceof Error ? error.message : 'Failed to save recipient');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = () => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest.trim()]
      });
      setInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
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
          <h3 className="text-xl font-semibold text-gray-800">Add New Recipient</h3>
          <p className="text-gray-600 text-sm">Add someone special to your gift list</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter recipient's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              <option value="">Select relationship</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Partner">Partner</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthdate
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Add an interest"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((int, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-700"
                >
                  {int}
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="ml-2 text-rose-500 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Add Recipient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipientForm;