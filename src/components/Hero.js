import React, { useState, useRef, useEffect, useCallback } from 'react';

function Hero() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [lastScratchTime, setLastScratchTime] = useState(0);
  const discRef = useRef(null);
  const animationRef = useRef(null);
  const scratchSoundRef = useRef(null);

  const SCRATCH_COOLDOWN = 1500; // Cooldown in milliseconds
  const SCRATCH_THRESHOLD = 70; // Minimum rotation delta to trigger scratch

  useEffect(() => {
    scratchSoundRef.current = new Audio('/sounds/scratch.mp3'); // Replace with your actual sound file path
    scratchSoundRef.current.load(); // Preload the audio

    let lastTime = 0;
    const autoRotateSpeed = 0.05; // Adjust this value to change the auto-rotation speed

    const animate = (time) => {
      if (lastTime !== 0) {
        const deltaTime = time - lastTime;
        if (!isMouseDown) {
          setRotation((prevRotation) => (prevRotation + autoRotateSpeed * deltaTime) % 360);
        }
      }
      lastTime = time;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMouseDown]);

  const playScratching = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastScratchTime > SCRATCH_COOLDOWN) {
      if (scratchSoundRef.current) {
        scratchSoundRef.current.currentTime = 0; // Reset to start
        scratchSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setLastScratchTime(currentTime);
    }
  }, [lastScratchTime]);

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMouseDown && discRef.current) {
      const rect = discRef.current.getBoundingClientRect();
      const discCenterX = rect.left + rect.width / 2;
      const discCenterY = rect.top + rect.height / 2;

      const lastAngle = Math.atan2(lastMousePosition.y - discCenterY, lastMousePosition.x - discCenterX);
      const newAngle = Math.atan2(e.clientY - discCenterY, e.clientX - discCenterX);
      
      let deltaRotation = (newAngle - lastAngle) * (180 / Math.PI);
      
      setRotation((prevRotation) => {
        let newRotation = (prevRotation + deltaRotation) % 360;
        return newRotation < 0 ? newRotation + 360 : newRotation;
      });

      // Check for quick back-and-forth movement
      if (Math.abs(deltaRotation) > SCRATCH_THRESHOLD) {
        playScratching();
      }

      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isMouseDown, lastMousePosition, playScratching]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  return (
    <div className="bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 z-10">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Song</h1>
          <p className="text-xl mb-6">TuneScout helps you find new music based on your preferences and listening history.</p>
          <button className="bg-primary text-white px-6 py-2 rounded-full bg-primary transition duration-300">
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 relative h-96">
          <div 
            ref={discRef}
            className="absolute -right-1/2 top-1/2 transform -translate-y-1/2"
            onMouseDown={handleMouseDown}
            style={{ 
              transform: `translateY(-50%) rotate(${rotation}deg)`,
              cursor: isMouseDown ? 'grabbing' : 'grab'
            }}
          >
            <img
              src="/images/disc.png"
              alt="Rotating Vinyl Disc"
              className="h-full w-auto select-none pointer-events-none"
              style={{ height: '120%' }}
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;