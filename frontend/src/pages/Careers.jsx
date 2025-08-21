const Careers = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">🌱 Careers at AgriLink</h1>
        <p className="text-gray-700 leading-relaxed">
          At AgriLink, we’re more than just a tech platform – we’re on a mission to transform agriculture through innovation. 
          We bring together farmers, traders, and agricultural stakeholders in one digital ecosystem that drives food security, fair trade, and sustainable growth.
          <br/><br/>
          Joining AgriLink means becoming part of a passionate team that’s shaping the future of farming across Africa and beyond.
        </p>

        <h2 className="text-2xl font-bold mt-8">🚀 Why Work With Us?</h2>
        <ul className="list-disc list-inside text-left mt-2 text-gray-700">
          <li>Purpose-driven impact – Your work directly helps farmers increase yields, access fair markets, and improve livelihoods.</li>
          <li>Innovation & Technology – We harness AI, big data, and modern software to solve real agricultural challenges.</li>
          <li>Collaborative Culture – We value teamwork, inclusivity, and creativity.</li>
          <li>Growth Opportunities – From learning new skills to taking leadership roles, we help you grow with us.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">🌍 Our Core Values</h2>
        <ul className="list-disc list-inside text-left mt-2 text-gray-700">
          <li>Integrity – We build trust with farmers and communities.</li>
          <li>Innovation – We create solutions that matter.</li>
          <li>Sustainability – We support eco-friendly practices.</li>
          <li>Community – We grow stronger together.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">💼 Current Openings</h2>
        <ul className="list-disc list-inside text-left mt-2 text-gray-700">
          <li><strong>Full Stack Developer (MERN Stack)</strong> – Help us scale our platform.</li>
          <li><strong>AI & Data Specialist</strong> – Build smarter crop and weather insights.</li>
          <li><strong>Community Outreach Manager</strong> – Connect with farmers and partners.</li>
          <li><strong>Marketing & Growth Associate</strong> – Spread the word and grow our community.</li>
        </ul>
        <p className="mt-2 text-gray-600 italic">(More roles coming soon – follow us for updates!)</p>

        <h2 className="text-2xl font-bold mt-8">🤝 How to Apply</h2>
        <p className="mt-2 text-gray-700">
          Send your CV and a short cover letter to{" "}
          <a href="mailto:careers@agrilink.com" className="text-green-600 font-semibold">
            careers@agrilink.com
          </a>{" "}
          with the subject line: <em>Application – [Job Title]</em>.
        </p>

        <p className="mt-6 text-gray-700">
          Let’s grow together 🌱. At AgriLink, every line of code, every strategy, and every idea contributes to a future where farmers thrive and communities flourish.
        </p>
      </div>
    </div>
  )
}

export default Careers
