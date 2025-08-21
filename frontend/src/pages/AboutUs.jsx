const AboutUs = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">🌱 About Us</h1>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <strong>AgriLink!</strong><br/><br/>
          At AgriLink, we believe agriculture is the backbone of our communities and the key to a sustainable future. Our mission is to empower farmers, traders, and agricultural stakeholders by creating a smart digital marketplace that connects everyone in the agriculture ecosystem.
          <br/><br/>
          We provide a platform where farmers can:
          <ul className="list-disc list-inside text-left mt-2">
            <li>Access markets to sell and buy farm produce at fair prices.</li>
            <li>Get AI-powered crop advice on planting, pest control, and soil health.</li>
            <li>Track weather conditions and receive timely alerts.</li>
            <li>Explore microloans and financial support to expand their agribusiness.</li>
            <li>Shop agricultural inputs (seeds, fertilizers, equipment) directly from trusted suppliers.</li>
          </ul>
          <br/>
          With AgriLink, farmers no longer have to struggle with unreliable markets, limited resources, or outdated information. We combine the power of technology, innovation, and community to make farming smarter, more profitable, and more sustainable.
        </p>

        <h2 className="text-2xl font-bold mt-8">🌍 Our Vision</h2>
        <p className="mt-2 text-gray-700">
          To be Africa’s leading digital agriculture marketplace that drives food security, farmer prosperity, and sustainable growth.
        </p>

        <h2 className="text-2xl font-bold mt-8">💡 Our Mission</h2>
        <p className="mt-2 text-gray-700">
          To connect farmers with tools, knowledge, and opportunities that transform agriculture into a thriving and future-ready sector.
        </p>

        <h2 className="text-2xl font-bold mt-8">🤝 Why Choose AgriLink?</h2>
        <ul className="list-disc list-inside text-left mt-2">
          <li>Reliable marketplace with transparent pricing</li>
          <li>AI-powered assistance and weather insights</li>
          <li>Easy access to credit and agri-inputs</li>
          <li>Community-driven support for farmers</li>
        </ul>

        <p className="mt-6 text-gray-700">
          At AgriLink, we are not just building a platform – we are building a future where every farmer thrives, every harvest counts, and every community grows stronger.
        </p>
      </div>
    </div>
  )
}

export default AboutUs
