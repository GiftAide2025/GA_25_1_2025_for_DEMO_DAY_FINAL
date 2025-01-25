import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIGuideModal from '../components/AIGuideModal';

const AIGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <AIGuideModal 
        isOpen={true} 
        onClose={() => navigate('/dashboard')} 
      />
    </div>
  );
};

export default AIGuidePage;