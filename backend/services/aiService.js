import OpenAI from 'openai';

let openai = null;

// Lazy initialization of OpenAI client
function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.warn('OpenAI initialization failed:', error.message);
      return null;
    }
  }
  return openai;
}

/**
 * Analyze sentiment of help request using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @returns {Promise<{sentiment: string, sentimentScore: number}>}
 */
export async function analyzeSentiment(title, description) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackSentimentAnalysis(title, description);
  }

  try {
    const prompt = `Analyze the sentiment of this help request and classify it as one of: Positive, Neutral, Negative, or Urgent.
Also provide a sentiment score between -1 (very negative) and 1 (very positive).

Title: ${title}
Description: ${description}

Respond in JSON format:
{
  "sentiment": "Positive|Neutral|Negative|Urgent",
  "sentimentScore": <number between -1 and 1>,
  "reasoning": "<brief explanation>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis expert. Analyze help requests and determine their emotional tone and urgency level.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      sentiment: result.sentiment,
      sentimentScore: result.sentimentScore
    };
  } catch (error) {
    console.error('AI Sentiment Analysis Error:', error.message);
    // Fallback to keyword-based analysis
    return fallbackSentimentAnalysis(title, description);
  }
}

/**
 * Suggest category for help request using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @returns {Promise<string>}
 */
export async function suggestCategory(title, description) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackCategoryAnalysis(title, description);
  }

  try {
    const prompt = `Categorize this help request into one of these categories:
- Technical Support
- Development
- Design
- Documentation
- General

Title: ${title}
Description: ${description}

Respond in JSON format:
{
  "category": "<category name>",
  "confidence": <number between 0 and 1>,
  "reasoning": "<brief explanation>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a categorization expert. Classify help requests into appropriate categories.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.category;
  } catch (error) {
    console.error('AI Category Suggestion Error:', error.message);
    return fallbackCategoryAnalysis(title, description);
  }
}

/**
 * Suggest priority/urgency level using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @param {string} sentiment - Detected sentiment
 * @returns {Promise<string>}
 */
export async function suggestPriority(title, description, sentiment) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackPriorityAnalysis(title, description, sentiment);
  }

  try {
    const prompt = `Determine the urgency level of this help request. Choose one: Low, Medium, High, or Critical.

Title: ${title}
Description: ${description}
Detected Sentiment: ${sentiment}

Respond in JSON format:
{
  "priority": "Low|Medium|High|Critical",
  "reasoning": "<brief explanation>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an urgency assessment expert. Determine the priority level of help requests based on their content and context.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.priority;
  } catch (error) {
    console.error('AI Priority Suggestion Error:', error.message);
    return fallbackPriorityAnalysis(title, description, sentiment);
  }
}

/**
 * Generate relevant tags using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @param {string} category - Request category
 * @returns {Promise<string[]>}
 */
export async function generateTags(title, description, category) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackTagGeneration(title, description, category);
  }

  try {
    const prompt = `Generate 3-6 relevant tags for this help request. Tags should be lowercase, single words or short phrases.

Title: ${title}
Description: ${description}
Category: ${category}

Respond in JSON format:
{
  "tags": ["tag1", "tag2", "tag3", ...]
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a tagging expert. Generate relevant, concise tags for help requests.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.tags || [];
  } catch (error) {
    console.error('AI Tag Generation Error:', error.message);
    return fallbackTagGeneration(title, description, category);
  }
}

/**
 * Generate suggested response for helpers using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @param {string} category - Request category
 * @param {string} sentiment - Detected sentiment
 * @returns {Promise<string>}
 */
export async function generateSuggestedResponse(title, description, category, sentiment) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackResponseGeneration(title, description, category, sentiment);
  }

  try {
    const prompt = `Generate a helpful, empathetic response template for a helper to use when responding to this help request.

Title: ${title}
Description: ${description}
Category: ${category}
Sentiment: ${sentiment}

The response should:
- Be warm and professional
- Acknowledge the user's situation
- Ask clarifying questions if needed
- Offer to help
- Be 2-4 sentences long

Respond in JSON format:
{
  "response": "<suggested response text>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a customer support expert. Generate helpful, empathetic response templates for community helpers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.response;
  } catch (error) {
    console.error('AI Response Generation Error:', error.message);
    return fallbackResponseGeneration(title, description, category, sentiment);
  }
}

/**
 * Generate insights about the request using OpenAI
 * @param {string} title - Request title
 * @param {string} description - Request description
 * @param {string} category - Request category
 * @param {string} sentiment - Detected sentiment
 * @returns {Promise<string>}
 */
export async function generateInsights(title, description, category, sentiment) {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackInsightGeneration(category, sentiment);
  }

  try {
    const prompt = `Provide a brief insight or summary about this help request for the community platform.

Title: ${title}
Description: ${description}
Category: ${category}
Sentiment: ${sentiment}

The insight should be 1-2 sentences highlighting key aspects or urgency.

Respond in JSON format:
{
  "insight": "<insight text>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant helping to provide insights about community help requests.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.insight;
  } catch (error) {
    console.error('AI Insight Generation Error:', error.message);
    return fallbackInsightGeneration(category, sentiment);
  }
}

// Fallback functions (keyword-based) for when OpenAI API fails
function fallbackSentimentAnalysis(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const negativeWords = ['urgent', 'critical', 'broken', 'error', 'crash', 'fail', 'bug', 'issue', 'problem', 'help', 'stuck', 'frustrated', 'not working', 'please help'];
  const urgentWords = ['asap', 'immediately', 'urgent', 'critical', 'emergency', 'now'];
  const positiveWords = ['thanks', 'appreciate', 'great', 'awesome', 'working', 'solved'];

  let score = 0;
  let sentiment = 'Neutral';

  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 0.1;
  });

  urgentWords.forEach(word => {
    if (text.includes(word)) {
      score -= 0.2;
      sentiment = 'Urgent';
    }
  });

  positiveWords.forEach(word => {
    if (text.includes(word)) score += 0.1;
  });

  if (sentiment !== 'Urgent') {
    if (score < -0.3) sentiment = 'Negative';
    else if (score > 0.1) sentiment = 'Positive';
    else sentiment = 'Neutral';
  }

  return { sentiment, sentimentScore: Math.max(-1, Math.min(1, score)) };
}

function fallbackCategoryAnalysis(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const categoryKeywords = {
    'Technical Support': ['bug', 'error', 'crash', 'not working', 'broken', 'issue', 'problem'],
    'Development': ['code', 'function', 'api', 'database', 'backend', 'frontend', 'react', 'node'],
    'Design': ['ui', 'ux', 'design', 'layout', 'css', 'style', 'interface'],
    'Documentation': ['docs', 'documentation', 'guide', 'tutorial', 'readme'],
    'General': []
  };

  let bestMatch = 'General';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category;
    }
  }

  return bestMatch;
}

function fallbackPriorityAnalysis(title, description, sentiment) {
  const text = (title + ' ' + description).toLowerCase();
  const criticalWords = ['critical', 'emergency', 'production', 'down', 'crash', 'data loss'];
  const highWords = ['urgent', 'asap', 'immediately', 'broken', 'not working'];

  if (criticalWords.some(word => text.includes(word))) return 'Critical';
  if (highWords.some(word => text.includes(word)) || sentiment === 'Urgent') return 'High';
  if (sentiment === 'Negative') return 'Medium';

  return 'Low';
}

function fallbackTagGeneration(title, description, category) {
  const text = (title + ' ' + description).toLowerCase();
  const tags = [category.toLowerCase()];

  const techTags = {
    'react': ['react', 'jsx', 'component'],
    'node': ['node', 'nodejs', 'express'],
    'database': ['database', 'sql', 'mongodb', 'postgres'],
    'api': ['api', 'rest', 'endpoint'],
    'frontend': ['frontend', 'ui', 'css', 'html'],
    'backend': ['backend', 'server'],
    'debugging': ['bug', 'error', 'debug', 'issue'],
    'performance': ['slow', 'performance', 'optimization'],
    'security': ['security', 'auth', 'authentication', 'authorization']
  };

  for (const [tag, keywords] of Object.entries(techTags)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  return [...new Set(tags)];
}

function fallbackResponseGeneration(title, description, category, sentiment) {
  let response = `Thank you for reaching out! `;

  if (sentiment === 'Urgent' || sentiment === 'Negative') {
    response += `I understand this is causing frustration. `;
  }

  response += `I'd be happy to help with your ${category.toLowerCase()} issue. `;

  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('error') || text.includes('bug')) {
    response += `Could you please share:\n- The exact error message you're seeing\n- Steps to reproduce the issue\n- Your environment (browser/OS/versions)\n\nThis will help me diagnose the problem quickly.`;
  } else if (text.includes('how to') || text.includes('how do')) {
    response += `I can guide you through this. Let me know if you need step-by-step instructions or code examples.`;
  } else {
    response += `Could you provide more details about what you're trying to accomplish? This will help me give you the best solution.`;
  }

  return response;
}

function fallbackInsightGeneration(category, sentiment) {
  if (sentiment === 'Urgent') {
    return `⚠️ Urgent request detected. User appears to need immediate assistance with ${category}.`;
  } else if (sentiment === 'Negative') {
    return `User is experiencing frustration. Quick response recommended for ${category} issue.`;
  } else if (sentiment === 'Positive') {
    return `Positive tone detected. User is seeking guidance on ${category}.`;
  }
  return `Standard ${category} request.`;
}
