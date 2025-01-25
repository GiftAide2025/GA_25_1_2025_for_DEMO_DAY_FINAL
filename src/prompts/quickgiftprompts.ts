// Gift Recommendation Prompts for Two Modes
const GIFT_MODES = {
  PHYSICAL: `## Mode 1: Physical Gifts (Available in Local Stores)

### Description:
These are tangible items that can be quickly collected from nearby shops, making them ideal for last-minute gifting.

### Examples:
1. **Flowers**
   - Fresh bouquets (roses, lilies, carnations).
   - Pre-arranged floral baskets.
   - Exotic flower arrangements with orchids or tulips.

2. **Chocolates**
   - Branded options like Ferrero Rocher, Lindt, or Cadbury.
   - Gourmet or local handmade chocolate boxes.
   - Chocolate truffle assortments or dark chocolate bars.

3. **Scented Candles**
   - Popular choices like vanilla, lavender, or sandalwood.
   - Gift sets with multiple scents.
   - Aromatherapy candle jars for relaxation.

4. **Greeting Cards**
   - Handcrafted cards with thoughtful messages.
   - Cards paired with a small token, like a bookmark or pen.
   - Pop-up or musical cards for a fun twist.

5. **Personal Care Kits**
   - Travel-size skincare kits (Nivea, L'Occitane, etc.).
   - Spa kits or bath bombs.
   - Beard grooming kits or unisex self-care packages.

6. **Snacks and Beverage Hampers**
   - Wine bottles, artisanal coffee, or tea sets.
   - A mix of cookies, nuts, or healthy snack baskets.
   - Cheese and cracker gift boxes.

7. **Books or Magazines**
   - Bestseller novels or self-help books.
   - Coffee table books on art, travel, or photography.
   - Monthly magazine subscriptions available locally.

8. **Quick Electronics**
   - Earbuds, phone stands, or portable chargers.
   - LED nightlights or digital photo frames.
   - Smart key finders (e.g., Tile or Airtag).

9. **Miscellaneous**
   - Gift wrapping paper or reusable gift bags.
   - Local specialty items or artisanal crafts.
   - Small potted plants like succulents or bonsai trees.`,

  EXPERIENCE: `## Mode 2: Experience Gifts (Available Online)

### Description:
Digital gifts that can be purchased and delivered instantly, making them suitable for last-minute gifting or distant recipients.

### Examples:
1. **Gift Cards**
   - Amazon gift cards (customizable amounts).
   - Restaurant gift cards (UberEats, DoorDash, Zomato).
   - Spa or wellness gift cards.

2. **Subscription Services**
   - Streaming platforms like Netflix, Spotify, or Audible.
   - Hobby-based subscriptions (craft kits, cooking classes, etc.).
   - Language learning subscriptions like Rosetta Stone or Duolingo Plus.

3. **E-Courses or Workshops**
   - Udemy or MasterClass courses in their areas of interest.
   - Art, photography, or yoga classes online.
   - Skillshare memberships for creative learning.

4. **E-Books or Audiobooks**
   - Kindle books on topics like fiction, self-help, or business.
   - Audible credits for audiobooks or podcasts.
   - Personalized e-book gift collections.

5. **Experience Vouchers**
   - Online gaming or VR experiences.
   - Virtual escape rooms or trivia nights.
   - Digital cooking or mixology classes.

6. **Charity Donations**
   - Donate to a cause in their name (e.g., wildlife conservation, child education).
   - Gift trees planted in their honor through organizations like One Tree Planted.

7. **Custom Digital Gifts**
   - Personalized video messages from celebrities (via platforms like Cameo).
   - Custom photo or video slideshows created online.
   - Digital caricatures or portraits from online artists.

8. **Event Tickets**
   - Digital passes to concerts, sports games, or online events.
   - Tickets to virtual theater performances or comedy shows.
   - Access to online conferences or motivational seminars.`
};

export const generateQuickGiftPrompt = (
  occasion: string,
  recipient: string,
  interests: string[],
  budget: string,
  giftPreference: 'physical' | 'experience',
  additionalPreferences?: string,
  age?: string,
  region: 'IN' | 'US' = 'US'
): string => {
  const selectedMode = giftPreference === 'physical' ? GIFT_MODES.PHYSICAL : GIFT_MODES.EXPERIENCE;

  // Format budget based on region
  const budgetAmount = Number(budget);
  const currencySymbol = region === 'IN' ? '₹' : '$';
  const formattedBudget = `${currencySymbol}${budgetAmount}`;

  return `You are a highly skilled gift recommendation expert. Based on the following details and the provided gift categories above, suggest 5-6 specific, thoughtful gifts that perfectly match the recipient's profile and occasion. Each suggestion must be practical, available for immediate purchase, and align with the given budget and preferences.

${selectedMode}

Recipient Profile:
- Occasion: ${occasion}
- Recipient: ${recipient}
- Interests: ${interests.join(', ')}
- Budget: ${formattedBudget}
${age ? `- Age: ${age} years old` : ''}
${additionalPreferences ? `- Additional Notes: ${additionalPreferences}` : ''}
- Region: ${region === 'IN' ? 'India' : 'United States'}
- Marketplace: ${region === 'IN' ? 'amazon.in' : 'amazon.com'}

For each gift suggestion, provide the following details in a clear, structured format:

1. Gift name: [Specific product name or experience]
2. Estimated price: [Price in ${region === 'IN' ? 'INR' : 'USD'}]
3. Why it's perfect: [2-3 sentences explaining why this gift matches the recipient's interests and occasion]
4. Where to buy: [Specific store names or online platforms where this can be purchased immediately]
5. Description: [Brief description including key features or details]

Important Guidelines:
- All suggestions must come from the approved category list above
- Focus on gifts that are readily available for immediate purchase
- CRITICAL: Ensure each suggestion fits within the specified budget of ${formattedBudget}
- Consider the recipient's age and interests when making recommendations
- Include a mix of popular and unique options
- For physical gifts, prioritize items available in major retail stores
- For experiences, focus on instantly accessible digital options
- CRITICAL: For India region, suggest products commonly available on amazon.in and local stores
- CRITICAL: For US region, suggest products commonly available on amazon.com and local stores
- CRITICAL: Consider regional pricing and availability
- CRITICAL: All prices must be in ${region === 'IN' ? 'INR (₹)' : 'USD ($)'}

Please provide detailed, actionable suggestions that can be purchased today. Each suggestion should feel personal and thoughtful, demonstrating clear consideration of the recipient's interests and the occasion.`;
};