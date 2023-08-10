import React, { useState } from 'react';
import './Styles.css'; // Import your CSS file

const Octagon: React.FC = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [angle, setAngle] = useState(0);

  const handleOctagonClick = () => {
    setIsRotating(!isRotating);
  };

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const octagon = event.currentTarget;
    const octagonRect = octagon.getBoundingClientRect();
    const octagonCenterX = octagonRect.left + octagonRect.width / 2;
    const octagonCenterY = octagonRect.top + octagonRect.height / 2;
      
    const mouseX = event.clientX;
    const mouseY = event.clientY;
  
    const deltaX = mouseX - octagonCenterX;
    const deltaY = mouseY - octagonCenterY;
  
    const radians = Math.atan2(deltaY, deltaX);
    const degrees = (radians * 180) / Math.PI;
  
    setAngle(degrees);
  };

  return (
    <svg
  className={`octagon-svg ${isRotating ? 'rotate-center' : ''}`}
  viewBox="0 0 153.63691 153.63691"
  preserveAspectRatio="none"
  onMouseMove={handleMouseMove}
  style={{ transform: `rotate(${angle}deg)` }} // Set the custom property
>
      <polygon
        points="0,108.63691 45,153.63691 108.63691,153.63691 153.63691,108.63691 153.63691,45 108.63691,0 45,0 0,45"
        fill="blue"
      />
    </svg>
  );
};

export default Octagon;