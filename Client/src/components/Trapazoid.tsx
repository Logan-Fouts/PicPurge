import React from "react";

interface TrapezoidProps {
  rotation: number;
  number: number;
  text: string;
  color: string;
  onClick: () => void;
}

const Trapezoid: React.FC<TrapezoidProps> = ({
  rotation,
  number,
  text,
  color,
  onClick,
}) => {
  return (
    <svg width="800" height="800">
      <g
        className="TrapezoidContainer"
        onClick={onClick}
        style={{
          cursor: "pointer",
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
        }}
      >
        <polygon
          className="Trapezoid"
          points="415,5 667.5,110 607.5,170 412.5,90"
          fill="transparent"
        />
        <text
          x="400"
          y="75"
          className={`Number${number}`}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="40"
          fontWeight={600}
          fill={color}
          style={{
            cursor: "pointer",
            transform: "rotate(22.5deg)",
            transformOrigin: "center",
          }}
        >
          {text}
        </text>
      </g>
    </svg>
  );
};

export default Trapezoid;
