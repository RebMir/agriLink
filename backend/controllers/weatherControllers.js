const axios = require('axios');

// @desc    Get current weather for location
// @route   GET /api/weather/:location
// @access  Public
const getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;
    const { units = 'metric' } = req.query;

    if (!process.env.WEATHER_API_KEY) {
      return res.status(503).json({
        error: 'Weather service not configured'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=${units}`
    );

    const weatherData = response.data;

    const formattedWeather = {
      location: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed,
      isGoodForPlanting: weatherData.main.temp >= 15 && weatherData.main.temp <= 30,
      recommendations: getPlantingRecommendations(weatherData)
    };

    res.json({
      success: true,
      data: formattedWeather
    });

  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({
      error: 'Error fetching weather data'
    });
  }
};

const getPlantingRecommendations = (weatherData) => {
  const recommendations = [];

  if (weatherData.main.temp < 15) {
    recommendations.push('Temperature is too low for most crops');
  }

  if (weatherData.main.humidity < 40) {
    recommendations.push('Low humidity - ensure proper irrigation');
  }

  if (weatherData.wind.speed > 20) {
    recommendations.push('High winds - avoid planting delicate crops');
  }

  if (recommendations.length === 0) {
    recommendations.push('Weather conditions are favorable for planting');
  }

  return recommendations;
};

module.exports = {
  getCurrentWeather
}; 