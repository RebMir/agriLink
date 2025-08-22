const OpenAI = require("openai");
const { validationResult } = require("express-validator");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Helper function to call OpenAI Chat Completions
 */
const generateAIResponse = async ({ systemPrompt, userPrompt, max_tokens = 1000, temperature = 0.7 }) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens,
    temperature,
  });

  return completion.choices[0].message.content;
};

/**
 * @desc    Get AI crop recommendations
 * @route   POST /api/ai/crop-recommendation
 * @access  Private
 */
const getCropRecommendation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      location,
      soilType,
      season,
      farmSize,
      waterAvailability,
      budget,
      experience,
      previousCrops,
    } = req.body;

    const userPrompt = `As an agricultural expert, provide crop recommendations for a farmer with the following details:
    
Location: ${location}
Soil Type: ${soilType}
Season: ${season}
Farm Size: ${farmSize} acres
Water Availability: ${waterAvailability}
Budget: ${budget}
Farming Experience: ${experience} years
Previous Crops: ${previousCrops || "None"}

Please provide:
1. Top 3–5 recommended crops with reasons
2. Expected yield per acre
3. Market demand and pricing
4. Required inputs and estimated costs
5. Risk factors and mitigation strategies
6. Best practices for cultivation

Format the response in a clear, structured manner suitable for farmers.`;

    const recommendation = await generateAIResponse({
      systemPrompt:
        "You are an expert agricultural consultant with deep knowledge of farming practices, crop selection, and market analysis. Provide practical, actionable advice for farmers.",
      userPrompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    res.json({
      success: true,
      data: {
        recommendation,
        metadata: {
          location,
          soilType,
          season,
          farmSize,
          waterAvailability,
          budget,
          experience,
          previousCrops,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("AI crop recommendation error:", error);
    if (error.code === "insufficient_quota") {
      return res.status(503).json({ error: "AI service temporarily unavailable. Please try again later." });
    }
    res.status(500).json({
      error: "Error generating crop recommendation",
      message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

/**
 * @desc    Get AI planting advice
 * @route   POST /api/ai/planting-advice
 * @access  Private
 */
const getPlantingAdvice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { crop, location, soilType, season, weatherConditions, farmSize, irrigationType } = req.body;

    const userPrompt = `As an agricultural expert, provide detailed planting advice for ${crop} cultivation with the following details:

Crop: ${crop}
Location: ${location}
Soil Type: ${soilType}
Season: ${season}
Weather Conditions: ${weatherConditions}
Farm Size: ${farmSize} acres
Irrigation Type: ${irrigationType}

Please provide:
1. Optimal planting time and conditions
2. Seed selection and treatment
3. Land preparation requirements
4. Spacing and planting density
5. Irrigation schedule and water requirements
6. Fertilizer application plan
7. Pest and disease management
8. Expected timeline from planting to harvest
9. Common mistakes to avoid
10. Tips for maximizing yield

Format the response in a clear, step-by-step manner suitable for farmers.`;

    const advice = await generateAIResponse({
      systemPrompt:
        "You are an expert agricultural consultant specializing in crop cultivation and best practices. Provide detailed, practical planting advice that farmers can implement immediately.",
      userPrompt,
      max_tokens: 1200,
      temperature: 0.6,
    });

    res.json({
      success: true,
      data: {
        advice,
        metadata: {
          crop,
          location,
          soilType,
          season,
          weatherConditions,
          farmSize,
          irrigationType,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("AI planting advice error:", error);
    if (error.code === "insufficient_quota") {
      return res.status(503).json({ error: "AI service temporarily unavailable. Please try again later." });
    }
    res.status(500).json({
      error: "Error generating planting advice",
      message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

/**
 * @desc    Get AI pest and disease diagnosis
 * @route   POST /api/ai/pest-diagnosis
 * @access  Private
 */
const getPestDiagnosis = async (req, res) => {
  try {
    const { crop, symptoms, affectedArea, weatherConditions, stage } = req.body;

    const userPrompt = `As an agricultural expert, help diagnose potential pest or disease issues for ${crop} with the following symptoms:
    
Crop: ${crop}
Symptoms: ${symptoms}
Affected Area: ${affectedArea}
Weather Conditions: ${weatherConditions}
Growth Stage: ${stage}

Please provide:
1. Likely pest or disease identification
2. Causes and contributing factors
3. Immediate treatment recommendations
4. Preventive measures
5. Organic and chemical control options
6. When to seek professional help
7. Expected recovery timeline

Format the response in a clear, actionable manner.`;

    const diagnosis = await generateAIResponse({
      systemPrompt:
        "You are an expert agricultural consultant specializing in pest and disease management. Provide accurate diagnosis and treatment recommendations.",
      userPrompt,
      max_tokens: 800,
      temperature: 0.5,
    });

    res.json({
      success: true,
      data: {
        diagnosis,
        metadata: {
          crop,
          symptoms,
          affectedArea,
          weatherConditions,
          stage,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("AI pest diagnosis error:", error);
    res.status(500).json({
      error: "Error generating pest diagnosis",
      message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

module.exports = {
  getCropRecommendation,
  getPlantingAdvice,
  getPestDiagnosis,
};
