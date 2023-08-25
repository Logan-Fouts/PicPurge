import React, { useState } from "react";
import "./DetectionWheel.css";

interface DetectionWheelProps {
  onDetectionSelect: (selected: number | null) => void;
}

const DetectionWheel: React.FC<DetectionWheelProps> = ({
  onDetectionSelect,
}) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(0);

  const numberClick = (id: number) => {
    const angle = calculateAngleForPath(id);
    setSelectedNumber(id);
    setCurrentRotation(angle);
    onDetectionSelect(id);
  };

  const calculateAngleForPath = (id: number): number => {
    const angleStep = 45;
    const baseAngle = 22.5;
    const calculatedAngle = baseAngle - id * angleStep;
    return calculatedAngle;
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="DetectionWheelSection"
      transform={`rotate(${currentRotation})`}
    >
      <path
        d="M361.732 15.8513C386.234 5.70189 413.766 5.70187 438.268 15.8513L644.574 101.306C669.077 111.455 688.545 130.923 698.694 155.426L784.149 361.732C794.298 386.234 794.298 413.766 784.149 438.268L698.694 644.574C688.545 669.077 669.077 688.545 644.574 698.694L438.268 784.149C413.766 794.298 386.234 794.298 361.732 784.149L155.426 698.694C130.923 688.545 111.455 669.077 101.306 644.574L15.8513 438.268C5.70189 413.766 5.70187 386.234 15.8513 361.732L101.306 155.426C111.455 130.923 130.923 111.455 155.426 101.306L361.732 15.8513Z"
        fill="#1F2B35"
      />
      <rect x="384" width="32" height="800" fill="#FCEFEF" />
      <rect
        x="671.383"
        y="105.708"
        width="32"
        height="800"
        transform="rotate(44.9715 671.383 105.708)"
        fill="#FCEFEF"
      />
      <rect
        x="800"
        y="384"
        width="32"
        height="800"
        transform="rotate(90 800 384)"
        fill="#FCEFEF"
      />
      <rect
        x="694.156"
        y="671.529"

        width="32"
        height="800"
        transform="rotate(135 694.156 671.529)"
        fill="#FCEFEF"
      />
      <path
        d="M400 84L623.446 176.554L716 400L623.446 623.446L400 716L176.554 623.446L84 400L176.554 176.554L400 84Z"
        fill="#FCEFEF"
      />
      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(1)}
          style={{cursor: "pointer", transformOrigin: "center"}}
        >
        <polygon 
          className="Trapezoid"
          points="415,5 667.5,110 607.5,170 412.5,90"
          fill="transparent"
        />
        <text 
            x="400"
            y="75"
            className="Number1"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#00FF00"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            1
          </text>
        </g>
      </svg>
      
      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(2)}
          style={{
            cursor: "pointer",
            transform: "rotate(45deg)",
            transformOrigin: "center"
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
            className="Number2"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#20DF00"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            2
          </text>
        </g>
      </svg>

      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(3)}
          style={{
            cursor: "pointer",
            transform: "rotate(90deg)",
            transformOrigin: "center"
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
            className="Number3"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#40BF00"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            3
          </text>
        </g>
      </svg>


      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(4)}
          style={{
            cursor: "pointer",
            transform: "rotate(135deg)",
            transformOrigin: "center"
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
            className="Number4"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#6F9000"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            4
          </text>
        </g>
      </svg>


      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(5)}
          style={{
            cursor: "pointer",
            transform: "rotate(180deg)",
            transformOrigin: "center"
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
            className="Number5"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#936C00"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            5
          </text>
        </g>
      </svg>


      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(6)}
          style={{
            cursor: "pointer",
            transform: "rotate(225deg)",
            transformOrigin: "center"
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
            className="Number6"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#B74800"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            6
          </text>
        </g>
      </svg>

      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(7)}
          style={{
            cursor: "pointer",
            transform: "rotate(270deg)",
            transformOrigin: "center"
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
            className="Number7"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#DB2400"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            7
          </text>
        </g>
      </svg>


      <svg width="800" height="800">
        <g
          className="TrapezoidContainer"
          onClick={() => numberClick(8)}
          style={{
            cursor: "pointer",
            transform: "rotate(315deg)",
            transformOrigin: "center"
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
            className="Number8"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="58"
            fontWeight={600}
            fill="#FF0000"
            style={{
              cursor: "pointer",
              transform: "rotate(22.5deg)",
              transformOrigin: "center"
            }}
          >
            8
          </text>
        </g>
      </svg>
    </svg>
  );
};

export default DetectionWheel;