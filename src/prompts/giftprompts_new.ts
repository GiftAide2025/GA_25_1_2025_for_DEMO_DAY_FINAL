export const generateGiftPrompt_new = (
  occasion: string,
  recipient: string,
  interests: string[],
  budget: string,
  giftPreference: 'physical' | 'experience',
  additionalPreferences?: string,
  region: 'IN' | 'US' = 'US'
): string => {
  // Convert budget to region-specific currency and format
  const budgetAmount = Number(budget);
  const currencySymbol = region === 'IN' ? '₹' : '$';
  
  // For Indian region, we'll keep the budget in INR as entered
  // For US region, if the input was in INR, convert to USD
  const formattedBudget = region === 'IN' 
    ? `${currencySymbol}${budgetAmount}`
    : `${currencySymbol}${budgetAmount}`;

  const basePrompt = `As an AI gift advisor, I need you to provide 4 ${giftPreference} gift suggestions available on Amazon ${region === 'IN' ? 'India (amazon.in)' : 'US (amazon.com)'} for this scenario. No more, no less than 4 suggestions. The budget is ${formattedBudget} and suggestions must be available in the ${region === 'IN' ? 'Indian' : 'US'} market.

Occasion: ${occasion}
Recipient: ${recipient}
Their Interests: ${interests.join(', ')}
Budget: ${formattedBudget}
Region: ${region === 'IN' ? 'India' : 'United States'}
Marketplace: ${region === 'IN' ? 'amazon.in' : 'amazon.com'}`;

  const customPreference = additionalPreferences 
    ? `\nSpecial Requirements: ${additionalPreferences} (Please prioritize these preferences in the suggestions)`
    : '';

  return `${basePrompt}${customPreference}

Please format each suggestion exactly as follows:

Gift 1:
Name: [gift name]
Description: [brief description in exactly 10 words]

Gift 2:
[same format]

Gift 3:
[same format]

Gift 4:
[same format]

Important Guidelines:
- Provide EXACTLY 4 suggestions
- Each suggestion must be unique and creative
- Focus on items available on ${region === 'IN' ? 'amazon.in' : 'amazon.com'}
- Keep descriptions exactly 10 words
- Focus on personalized gifts that match their interests
- Prioritize any special requirements provided
- Avoid generic suggestions
- CRITICAL: Stay strictly within the budget of ${formattedBudget}
- CRITICAL: All suggestions must be actually available on ${region === 'IN' ? 'amazon.in' : 'amazon.com'}
- CRITICAL: Consider regional pricing and availability
- CRITICAL: For India, suggest products commonly available on amazon.in
- CRITICAL: For US, suggest products commonly available on amazon.com
- Use following as reference examples but adjust prices according to region

Example Gifts:
    1. **Physical Gift**:
       - Gift Name: Wireless Bluetooth Headphones (Sony WH-CH510)
       - Description: Lightweight and comfortable headphones with excellent sound quality for music lovers.
       - Approximate Price: ${region === 'IN' ? '₹4,500' : '$45'}
       - Platform: Available on Amazon ${region === 'IN' ? 'India' : 'US'}.

    2. **Physical Gift**:
       - Gift Name: Smart Mug (Ember Temperature Control Mug)
       - Description: A smart mug that keeps beverages at the perfect temperature, ideal for coffee or tea lovers.
       - Approximate Price: ${region === 'IN' ? '₹12,000' : '$120'}
       - Platform: Available on Amazon ${region === 'IN' ? 'India' : 'US'}.

    3. **Physical Gift**:
       - Gift Name: Kindle Paperwhite
       - Description: A lightweight e-reader perfect for book lovers who enjoy reading on the go.
       - Approximate Price: ${region === 'IN' ? '₹10,999' : '$110'}
       - Platform: Available on Amazon ${region === 'IN' ? 'India' : 'US'}.
        Example Gifts:
    1. **Physical Gift**:
 

    4. **Physical Gift**:
       - Gift Name: Portable Laptop Stand
       - Description: Adjustable and lightweight stand, perfect for improving ergonomics for remote workers.
       - Approximate Price: ₹2,000
       - Platform: Available on Amazon India.

    5. **Experience Gift**:
       - Gift Name: Amazon Gift Card
       - Description: A versatile gift card that allows the recipient to choose their favorite items on Amazon.
       - Approximate Price: Customizable (₹500–₹10,000)
       - Platform: Amazon India.

    6. **Experience Gift**:
       - Gift Name: Spotify Premium Subscription
       - Description: A subscription for ad-free music streaming and offline listening, perfect for music enthusiasts.
       - Approximate Price: ₹1,189 for 3 months
       - Platform: Spotify official website.

    7. **Experience Gift**:
       - Gift Name: Online Language Learning Course (Duolingo Plus)
       - Description: A premium subscription for learning new languages with advanced features and no ads.
       - Approximate Price: ₹3,500 per year
       - Platform: Duolingo official website.

    8. **Experience Gift**:
       - Gift Name: Virtual Escape Room Ticket
       - Description: A fun and interactive virtual experience, ideal for group entertainment or solo adventures.
       - Approximate Price: ₹1,500
       - Platform: Online escape room providers.

    9. **Physical Gift**:
       - Gift Name: Premium Art Supplies Set
       - Description: A complete set of paints, brushes, and sketchbooks for art enthusiasts.
       - Approximate Price: ₹3,000
       - Platform: Amazon India or local art supply stores.

    10. **Physical Gift**:
       - Gift Name: Gourmet Tea Gift Set
       - Description: A curated selection of premium teas, perfect for tea lovers who enjoy a luxurious experience.
       - Approximate Price: ₹2,500
       - Platform: Available on Amazon India or specialty tea websites.

Remember: I need EXACTLY 4 suggestions, formatted precisely as shown above, and all suggestions must be actually available in the ${region === 'IN' ? 'Indian' : 'US'} market within the specified budget of ${formattedBudget}.`;
};