// controllers/aiController.js

const axios = require('axios');

const generateInsight = async (req, res) => {
  try {
    const { chartType, xAxisLabel, yAxisLabel, dataSummary } = req.body;

    const prompt = `
    You are an expert data analyst. Based on the following chart configuration and dataset, generate a brief but valuable insight (2-3 sentences max) that summarizes trends, patterns, or anomalies. Be specific, concise, and data-driven.
    
    Chart Type: ${chartType}
    X-Axis: ${xAxisLabel}
    Y-Axis: ${yAxisLabel}
    Data Summary:
    ${JSON.stringify(dataSummary, null, 2)}
    
    If there is a noticeable trend, outlier, or business-relevant insight, mention it.
    `;    

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful data analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const insight = response.data.choices[0].message.content;
    res.status(200).json({ insight });

  } catch (error) {
    console.error('AI insight error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
};

module.exports = { generateInsight };
