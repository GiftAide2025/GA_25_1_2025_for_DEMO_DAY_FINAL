export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getRandomWelcomeMessage = (): string => {
  const messages = [
    "Ready to make someone's day special?",
    "Let's find the perfect gift together!",
    "Time to spread some joy!",
    "Looking for gift inspiration?",
    "Let's make memorable moments happen!",
    "Ready to discover thoughtful gifts?"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};