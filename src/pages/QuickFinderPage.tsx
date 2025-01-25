import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuickFinderModal from '../components/QuickFinderModal';

const QuickFinderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <QuickFinderModal 
        isOpen={true} 
        onClose={() => navigate('/dashboard')} 
      />
    </div>
  );
};

export default QuickFinderPage;