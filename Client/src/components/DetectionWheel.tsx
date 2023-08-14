import React, { useState } from "react";
import "./DetectionWheel.css";

const DetectionWheel: React.FC = () => {
  const [currentRotation, setCurrentRotation] = useState(0);

  const numberClick = (id: number) => {
    const angle = calculateAngleForPath(id);
    setCurrentRotation(angle);
  };

  const calculateAngleForPath = (id: number): number => {
    const angleStep = 45;
    const baseAngle = 22.5;
    const calculatedAngle = baseAngle - id * angleStep;
    return calculatedAngle;
  };

  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 800 800"
      fill="unone"
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
      <path
        d="M535.446 85.7094L522.087 117.961L515.268 115.137L525.947 89.3574L525.758 89.2791L516.454 90.8497L518.959 84.8025L529.037 83.0545L535.446 85.7094Z"
        fill="#1D9605"
        onClick={() => numberClick(1)}
      />
      <path
        d="M678.657 269.748L683.57 267.712L698.955 274.79C700.304 275.375 701.494 275.841 702.524 276.19C703.558 276.548 704.509 276.751 705.377 276.797C706.255 276.839 707.12 276.684 707.97 276.332C708.915 275.941 709.64 275.389 710.144 274.675C710.658 273.958 710.945 273.15 711.004 272.253C711.073 271.351 710.912 270.427 710.52 269.483C710.112 268.496 709.556 267.717 708.852 267.148C708.149 266.578 707.342 266.248 706.431 266.158C705.521 266.068 704.551 266.236 703.522 266.662L700.841 260.19C702.951 259.315 704.981 259.034 706.931 259.346C708.88 259.658 710.637 260.499 712.2 261.868C713.764 263.238 715.011 265.046 715.942 267.292C716.898 269.602 717.322 271.782 717.212 273.833C717.116 275.889 716.547 277.693 715.505 279.244C714.462 280.795 713.012 281.956 711.154 282.726C709.936 283.23 708.634 283.487 707.247 283.495C705.865 283.514 704.198 283.215 702.244 282.597C700.302 281.975 697.864 280.974 694.93 279.593L688.366 276.796L688.145 276.887L693.755 290.43L688.18 292.74L678.657 269.748Z"
        fill="#4E8B00"
        onClick={() => numberClick(2)}
      />
      <path
        d="M684.033 516.027C685.007 513.675 686.278 511.748 687.848 510.246C689.423 508.758 691.145 507.78 693.012 507.311C694.885 506.857 696.768 507.003 698.66 507.75L695.816 514.616C695.011 514.332 694.212 514.302 693.418 514.527C692.63 514.766 691.908 515.217 691.252 515.88C690.596 516.544 690.061 517.374 689.648 518.371C689.218 519.411 689.021 520.405 689.058 521.355C689.095 522.305 689.345 523.141 689.809 523.862C690.273 524.583 690.93 525.12 691.78 525.472C692.641 525.829 693.503 525.902 694.364 525.693C695.232 525.499 696.039 525.034 696.787 524.299C697.53 523.573 698.154 522.602 698.658 521.384L699.904 518.376L704.912 520.45L703.666 523.458C703.24 524.487 703.042 525.469 703.073 526.404C703.1 527.35 703.336 528.174 703.784 528.876C704.241 529.582 704.896 530.111 705.746 530.463C706.554 530.798 707.343 530.898 708.113 530.761C708.889 530.64 709.594 530.305 710.227 529.755C710.857 529.216 711.36 528.49 711.739 527.577C712.121 526.653 712.303 525.738 712.285 524.833C712.277 523.931 712.064 523.124 711.647 522.409C711.229 521.695 710.617 521.153 709.811 520.782L712.518 514.247C714.364 515.048 715.782 516.257 716.773 517.873C717.764 519.488 718.298 521.333 718.374 523.406C718.456 525.494 718.04 527.641 717.127 529.846C716.205 532.071 714.994 533.851 713.494 535.186C711.995 536.52 710.366 537.365 708.608 537.719C706.856 538.088 705.132 537.915 703.435 537.2C701.625 536.462 700.351 535.277 699.614 533.643C698.872 532.019 698.712 530.237 699.134 528.297L698.882 528.192C697.595 530.439 696.023 531.903 694.166 532.586C692.315 533.283 690.389 533.211 688.388 532.369C686.547 531.619 685.134 530.413 684.15 528.75C683.161 527.098 682.644 525.169 682.6 522.961C682.555 520.753 683.032 518.441 684.033 516.027Z"
        fill="#6A7F00"
        onClick={() => numberClick(3)}
      />
      <path
        d="M534.15 683.684L536.374 689.054L531.696 715.844L527.066 717.762L523.987 710.329L526.728 709.194L529.652 692.245L529.547 691.993L510.413 699.918L508.15 694.454L534.15 683.684ZM516.321 684.427L519.348 691.734L520.207 694.164L529.554 716.731L523.161 719.379L509.802 687.128L516.321 684.427Z"
        fill="#807000"
        onClick={() => numberClick(4)}
      />
      <path
        d="M283.79 683.957C286.016 684.879 287.831 686.11 289.234 687.651C290.627 689.187 291.535 690.885 291.958 692.746C292.38 694.606 292.228 696.474 291.5 698.349L284.886 695.61C285.33 694.33 285.225 693.099 284.57 691.918C283.915 690.737 282.916 689.868 281.572 689.311C280.502 688.867 279.459 688.712 278.444 688.846C277.415 688.985 276.493 689.384 275.679 690.043C274.85 690.708 274.205 691.597 273.744 692.71C273.274 693.844 273.103 694.942 273.229 696.002C273.345 697.059 273.723 698.003 274.362 698.834C275.002 699.664 275.861 700.309 276.938 700.767C277.883 701.159 278.882 701.345 279.935 701.326C280.978 701.303 281.885 701.058 282.657 700.59L288.27 704.188L279.697 720.563L259.981 712.396L262.29 706.822L276.384 712.66L280.565 704.927L280.376 704.849C279.479 705.412 278.349 705.719 276.988 705.77C275.626 705.82 274.236 705.552 272.819 704.965C270.877 704.161 269.334 702.987 268.19 701.443C267.046 699.899 266.363 698.146 266.142 696.185C265.917 694.235 266.238 692.227 267.105 690.163C267.995 687.986 269.299 686.263 271.017 684.994C272.721 683.732 274.681 682.994 276.897 682.781C279.099 682.573 281.397 682.965 283.79 683.957Z"
        fill="#936000"
        onClick={() => numberClick(5)}
      />
      <path
        d="M116.935 518.363C117.612 520.026 117.997 521.743 118.09 523.512C118.179 525.271 117.862 527.014 117.138 528.74C116.414 530.467 115.187 532.107 113.456 533.66C111.721 535.203 109.379 536.585 106.429 537.807C103.716 538.919 101.167 539.611 98.784 539.885C96.3857 540.153 94.2042 540.023 92.2393 539.496C90.2702 538.959 88.5645 538.048 87.1222 536.764C85.6695 535.483 84.53 533.846 83.7037 531.851C82.8123 529.699 82.4451 527.625 82.6022 525.629C82.7489 523.637 83.3296 521.847 84.3443 520.258C85.3546 518.658 86.7034 517.386 88.3907 516.441L91.176 523.166C90.1614 523.894 89.5078 524.81 89.2153 525.915C88.9228 527.02 89.0331 528.192 89.5462 529.431C90.416 531.531 91.9903 532.748 94.2694 533.084C96.544 533.408 99.2553 532.931 102.403 531.652L102.312 531.431C101.156 531.344 100.073 531.03 99.062 530.49C98.036 529.943 97.1271 529.219 96.3353 528.317C95.5286 527.408 94.8818 526.366 94.3947 525.191C93.6033 523.28 93.3502 521.392 93.6356 519.527C93.9105 517.667 94.6517 515.982 95.8594 514.473C97.0671 512.964 98.6789 511.793 100.695 510.958C102.878 510.053 105.031 509.758 107.154 510.072C109.272 510.375 111.191 511.235 112.909 512.651C114.612 514.061 115.954 515.965 116.935 518.363ZM111.594 520.612C111.159 519.563 110.518 518.727 109.67 518.107C108.823 517.486 107.871 517.118 106.814 517.002C105.758 516.886 104.694 517.05 103.623 517.493C102.552 517.937 101.69 518.571 101.035 519.396C100.376 520.21 99.964 521.131 99.7992 522.159C99.6345 523.186 99.7696 524.225 100.204 525.275C100.531 526.062 100.98 526.731 101.552 527.281C102.12 527.821 102.771 528.234 103.504 528.52C104.234 528.796 105.004 528.933 105.814 528.929C106.614 528.93 107.402 528.769 108.179 528.448C109.218 528.017 110.071 527.387 110.736 526.558C111.397 525.719 111.815 524.783 111.99 523.751C112.161 522.708 112.029 521.662 111.594 520.612Z"
        fill="#A24C00"
        onClick={() => numberClick(6)}
      />
      <path
        d="M111.709 293.007L90.7904 268.678L90.5699 268.587L84.1187 284.162L78.5439 281.853L87.9175 259.223L93.571 261.565L114.625 285.968L111.709 293.007Z"
        fill="#AE3300"
        onClick={() => numberClick(7)}
      />
      <path
        d="M281.269 117.088C278.844 118.092 276.523 118.592 274.307 118.588C272.097 118.568 270.172 118.093 268.532 117.161C266.891 116.229 265.71 114.892 264.988 113.149C264.431 111.805 264.225 110.445 264.369 109.07C264.518 107.679 264.969 106.392 265.721 105.207C266.468 104.012 267.454 103.038 268.68 102.284L268.588 102.064C266.723 102.431 264.981 102.174 263.362 101.295C261.739 100.405 260.562 99.0785 259.832 97.3147C259.14 95.6454 259.013 93.9577 259.45 92.2514C259.883 90.5346 260.795 88.9513 262.187 87.5014C263.585 86.0367 265.371 84.8542 267.544 83.9541C269.718 83.0539 271.811 82.6295 273.825 82.6809C275.849 82.728 277.622 83.2055 279.142 84.1134C280.657 85.0108 281.764 86.2867 282.461 87.9411C283.186 89.7198 283.281 91.4944 282.748 93.2652C282.214 95.0359 281.174 96.4446 279.628 97.4912L279.719 97.7116C281.097 97.3867 282.468 97.3848 283.831 97.7058C285.2 98.012 286.429 98.6037 287.518 99.481C288.613 100.343 289.444 101.444 290.012 102.784C290.723 104.531 290.828 106.314 290.327 108.133C289.826 109.952 288.795 111.652 287.236 113.232C285.683 114.798 283.694 116.083 281.269 117.088ZM279.194 112.08C280.276 111.632 281.14 111.046 281.788 110.323C282.431 109.589 282.835 108.782 282.999 107.903C283.17 107.008 283.066 106.104 282.687 105.19C282.3 104.256 281.723 103.53 280.955 103.011C280.182 102.483 279.307 102.181 278.329 102.106C277.347 102.021 276.331 102.196 275.281 102.631C274.241 103.062 273.399 103.656 272.754 104.416C272.105 105.164 271.694 105.999 271.522 106.919C271.355 107.824 271.466 108.744 271.853 109.678C272.231 110.592 272.792 111.306 273.535 111.823C274.273 112.329 275.134 112.612 276.118 112.671C277.098 112.721 278.124 112.523 279.194 112.08ZM273.226 97.6705C274.129 97.2965 274.856 96.7801 275.407 96.1213C275.958 95.4625 276.299 94.725 276.428 93.9089C276.557 93.0927 276.446 92.2594 276.093 91.409C275.746 90.5691 275.242 89.9169 274.582 89.4522C273.918 88.977 273.165 88.7045 272.324 88.6345C271.479 88.5541 270.595 88.7052 269.671 89.0879C268.758 89.4662 268.025 89.9848 267.474 90.6436C266.918 91.2919 266.574 92.0189 266.44 92.8246C266.313 93.6154 266.423 94.4308 266.771 95.2707C267.123 96.121 267.633 96.7891 268.302 97.2747C268.97 97.7604 269.733 98.0413 270.588 98.1174C271.444 98.1935 272.323 98.0445 273.226 97.6705Z"
        fill="#B60101"
        onClick={() => numberClick(8)}
      />
    </svg>
  );
};

export default DetectionWheel;
