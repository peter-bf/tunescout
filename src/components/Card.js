import React from 'react';

function Hero() {
  return (
    <div className="bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 z-10">
          <h1 className="text-5xl font-bold mb-6 text-primary">Discover Your Next Favorite Song</h1>
          <p className="text-xl mb-8">TuneScout helps you find new music based on your preferences and listening history.</p>
          <button className="bg-primary text-background px-8 py-3 rounded-full hover:bg-accent transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 relative h-96">
          <div className="absolute -right-1/2 top-1/2 transform -translate-y-1/2">
            <img 
              src="/images/vinyl-disc.png" 
              alt="Rotating Vinyl Disc" 
              className="h-full w-auto animate-spin-slow"
              style={{ height: '140%' }}
            />
          </div>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
  );
}

export default Hero;