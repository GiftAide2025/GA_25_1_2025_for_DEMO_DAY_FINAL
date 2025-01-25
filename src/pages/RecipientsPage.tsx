import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft, Search, Filter, UserPlus, Calendar,
  Heart, Gift, MoreVertical, Edit2, Trash2, Star,
  SortAsc, ChevronDown, AlertCircle
} from 'lucide-react';
import AddRecipientForm from '../components/AddRecipientForm';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Recipient {
  id: string;
  name: string;
  relationship: string;
  birthdate: string;
  interests: string[];
  notes: string;
}

const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAddRecipientModalOpen, setIsAddRecipientModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error: fetchError } = await supabase
        .from('recipients')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      setRecipients(data || []);
    } catch (err) {
      console.error('Error fetching recipients:', err);
      setError('Failed to load recipients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: newRecipient, error: insertError } = await supabase
        .from('recipients')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (insertError) throw insertError;

      setRecipients(prev => [...prev, newRecipient]);
      setIsAddRecipientModalOpen(false);
    } catch (err) {
      console.error('Error adding recipient:', err);
      setError('Failed to add recipient');
    }
  };

  const handleEditRecipient = async (data: any) => {
    try {
      if (!editingRecipient) return;

      const { data: updatedRecipient, error: updateError } = await supabase
        .from('recipients')
        .update(data)
        .eq('id', editingRecipient.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRecipients(prev => 
        prev.map(r => r.id === editingRecipient.id ? updatedRecipient : r)
      );
      setEditingRecipient(null);
      setIsAddRecipientModalOpen(false);
    } catch (err) {
      console.error('Error updating recipient:', err);
      setError('Failed to update recipient');
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recipient?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('recipients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setRecipients(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting recipient:', err);
      setError('Failed to delete recipient');
    }
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipient.relationship.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || recipient.relationship === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedRecipients = [...filteredRecipients].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Recipients Database</h1>
              <p className="text-gray-600">Manage your gift recipients and their preferences</p>
            </div>
            <button
              onClick={() => {
                setEditingRecipient(null);
                setIsAddRecipientModalOpen(true);
              }}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add New Recipient
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-5 h-5 text-gray-400" />
                  Filter
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setSortBy(sortBy === 'name' ? 'date' : 'name')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <SortAsc className="w-5 h-5 text-gray-400" />
                  Sort by {sortBy === 'name' ? 'Name' : 'Date'}
                </button>
              </div>
            </div>
          </div>

          {/* Recipients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {recipient.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{recipient.name}</h3>
                      <p className="text-gray-600">{recipient.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRecipient(recipient);
                        setIsAddRecipientModalOpen(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecipient(recipient.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(recipient.birthdate).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {recipient.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {recipient.notes && (
                    <p className="text-sm text-gray-600 mt-2">{recipient.notes}</p>
                  )}
                </div>
              </div>
            ))}

            {sortedRecipients.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No recipients found</h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "No recipients match your search"
                    : "You haven't added any recipients yet"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsAddRecipientModalOpen(true)}
                    className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add New Recipient
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Recipient Modal */}
      <AddRecipientForm
        isOpen={isAddRecipientModalOpen}
        onClose={() => {
          setIsAddRecipientModalOpen(false);
          setEditingRecipient(null);
        }}
        onSubmit={editingRecipient ? handleEditRecipient : handleAddRecipient}
        initialData={editingRecipient}
      />
    </div>
  );
};

export default RecipientsPage;