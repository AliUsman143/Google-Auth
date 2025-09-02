const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 ">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Website</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Discover amazing features and services that will transform your experience. 
          Join thousands of satisfied users today.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;