const Contact = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">📩 Contact Us</h1>
        <p className="text-gray-700 mb-6">
          We’d love to hear from you! Whether you have questions, feedback, or partnership opportunities, our team is here to help.
        </p>

        <div className="space-y-3 text-gray-800">
          <p>
            📧 Email:{" "}
            <a
              href="mailto:support@agrilink.com"
              className="text-green-600 font-semibold hover:underline"
            >
              support@agrilink.com
            </a>
          </p>
          <p>📞 Phone: +2547-831-074-20</p>
          <p>📍 Location: Nairobi, Kenya</p>
        </div>
        <br/>
        <h2 className="text-2xl font-bold">📝 Send Us a Message</h2>
        <br/>
        <form className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" placeholder="Your Name"
            className="w-full border p-2 rounded-lg focus:ring focus:ring-green-400"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" placeholder="your@email.com"
            className="w-full border p-2 rounded-lg focus:ring focus:ring-green-400"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea rows="5" placeholder="Write your message..."
            className="w-full border p-2 rounded-lg focus:ring focus:ring-green-400"></textarea>
        </div>
        <button type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
          Send Message
        </button>
      </form>
        <p className="mt-6 text-gray-600">
          Our team typically responds within 24–48 hours. 🌱
        </p>
      </div>
    </div>
  );
};

export default Contact;
