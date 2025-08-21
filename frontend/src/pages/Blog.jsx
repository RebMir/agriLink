const Blog = () => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-6">🌾 AgriLink Blog</h1>

        <p className="text-lg text-gray-700 mb-6">
          Welcome to the AgriLink Blog, your go-to space for insights, tips, and
          stories from the world of agriculture.
          <br />
          <br />
          Here, we share knowledge that empowers farmers, traders, and
          agribusiness enthusiasts to stay informed and inspired. From smart
          farming techniques to market trends, we bring you content that helps
          you grow.
        </p>

        <h2 className="text-2xl font-bold mb-4">✨ Blog Categories:</h2>

        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-xl font-semibold">🌱 Farming Tips & Best Practices</h3>
            <p>Learn about crop management, irrigation methods, pest control, and soil health.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">🌍 AgriTech & Innovation</h3>
            <p>Discover how AI, data, and digital tools are transforming farming.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">☀️ Weather & Climate Insights</h3>
            <p>Get updates on climate patterns, weather-based farming decisions, and adaptation strategies.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">📈 Market & Finance</h3>
            <p>Explore commodity price trends, financial planning, and microloan opportunities for farmers.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">👩🏾‍🌾 Farmer Stories</h3>
            <p>Real stories from farmers in the AgriLink community, showcasing their challenges and successes.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">🍎 Sustainable Agriculture</h3>
            <p>Learn how eco-friendly farming practices can boost yields while protecting the environment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
