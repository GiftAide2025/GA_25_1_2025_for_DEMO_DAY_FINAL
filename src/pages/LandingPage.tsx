import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gift, Heart, Calendar, Clock, ShoppingBag, 
  Sparkles, Zap, ArrowRight, Star, 
  PartyPopper, Package, Rocket
} from 'lucide-react';

const FloatingIcon = ({ children, delay = 0 }) => (
  <div 
    className="animate-float"
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, items, color = "rose" }) => (
  <div className="group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition-all duration-500"></div>
    <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl">
      <div className="relative mb-6">
        <div className={`absolute -top-4 -left-4 w-16 h-16 bg-${color}-100 rounded-xl transform -rotate-6 group-hover:rotate-12 transition-transform duration-500`}></div>
        <Icon className={`w-12 h-12 text-${color}-500 relative z-10`} />
      </div>
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start transform transition-all duration-300 hover:translate-x-2">
            <Sparkles className={`w-5 h-5 text-${color}-400 mr-3 mt-1 flex-shrink-0`} />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Original background with higher opacity */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15"
          style={{
            backgroundBlendMode: 'overlay',
            mixBlendMode: 'multiply'
          }}
        ></div>
        
        {/* Floating icons background */}
        <div className="absolute inset-0 overflow-hidden">
          {[Gift, Heart, Star, PartyPopper].map((Icon, idx) => (
            <div
              key={idx}
              className="absolute animate-float opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${idx * 0.5}s`,
              }}
            >
              <Icon className="w-12 h-12" />
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative container mx-auto px-4 pt-24 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex flex-col items-center mb-6">
                <div className="relative flex justify-center w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 blur-lg opacity-50"></div>
                  <FloatingIcon>
                    <Gift className="w-20 h-20 text-rose-500 relative" />
                  </FloatingIcon>
                </div>
                <h2 className="text-4xl font-black mt-4 py-2 leading-relaxed bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 text-transparent bg-clip-text animate-gradient">
                  gifts<span className="font-black">AI</span>de
                </h2>
              </div>
              
              <h1 className="text-3xl md:text-7xl font-extrabold mb-8 leading-[1.2] tracking-tight">
                <span className="inline-block py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">
                  Never Miss a Moment.
                  <br />
                  Gift Smarter, Gift Better.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                Your AI-powered gifting companion that ensures every celebration becomes unforgettable. From timely reminders to perfect gift suggestions—we make thoughtful gifting effortless.
              </p>
              
              <button
                onClick={() => navigate('/login')}
                className="group relative inline-flex items-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Start Your Gifting Journey</span>
                <ArrowRight className="relative z-10 ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the components remain unchanged */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text inline-block">
            The Magic Behind Perfect Gifts
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover how AI transforms your gifting experience into something extraordinary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Calendar}
            title="Smart Calendar Integration"
            items={[
              "Seamless sync with your calendar",
              "AI-powered event detection",
              "Personalized reminder schedule"
            ]}
          />
          
          <FeatureCard
            icon={Rocket}
            title="Last-Minute Hero"
            items={[
              "Instant local gift suggestions",
              "Same-day pickup options",
              "Emergency gift solutions"
            ]}
            color="purple"
          />
          
          <FeatureCard
            icon={Package}
            title="Personalized Suggestions"
            items={[
              "AI-curated gift recommendations",
              "Personality-based matching",
              "Budget-friendly options"
            ]}
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="relative bg-white/80 backdrop-blur-sm py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">
            Your Journey to Perfect Gifting
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Gift,
                title: "Sign Up",
                desc: "Create your magical gifting account"
              },
              {
                icon: Calendar,
                title: "Connect",
                desc: "Sync your calendar and preferences"
              },
              {
                icon: Sparkles,
                title: "Discover",
                desc: "Get personalized gift suggestions"
              },
              {
                icon: PartyPopper,
                title: "Celebrate",
                desc: "Make every moment memorable"
              }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-full p-6 shadow-xl transform transition-all duration-300 group-hover:scale-110">
                    <step.icon className="w-10 h-10 text-rose-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-rose-300 to-purple-300 transform -translate-y-1/2 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <FloatingIcon>
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-8" />
          </FloatingIcon>
          <h2 className="text-4xl font-bold mb-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">
            Ready to Make Every Gift Special?
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            Join thousands of thoughtful gifters who never miss a special moment. Start your journey to becoming a gifting expert today.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10">Join GiftAIde Now</span>
            <ArrowRight className="relative z-10 ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;