import { Button } from "antd";
import Header from "./Header";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ErrorIcon = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="w-52 h-52"
  >
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FF6B6B", stopOpacity: 0.1 }} />
        <stop
          offset="100%"
          style={{ stopColor: "#FF4949", stopOpacity: 0.3 }}
        />
      </linearGradient>

      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <pattern
        id="pattern"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 10 L20 10"
          stroke="#FF0000"
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
      </pattern>
    </defs>

    <g opacity="0.2">
      <path
        d="M20,160 L20,140 L30,140 L30,150 L40,140 L50,140 L50,160"
        fill="#FF4949"
      >
        <animate
          attributeName="opacity"
          values="0.2;0.4;0.2"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M160,160 L160,130 L170,120 L180,130 L180,160" fill="#FF4949">
        <animate
          attributeName="opacity"
          values="0.2;0.4;0.2"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    <g fill="#FF4949" opacity="0.3">
      <path d="M0,50 L15,60 L0,70 L5,60 Z">
        <animateMotion
          path="M 0,0 C 100,-20 150,20 200,0"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M0,50 L15,60 L0,70 L5,60 Z">
        <animateMotion
          path="M 200,100 C 100,80 50,120 0,100"
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    <circle cx="100" cy="100" r="90" fill="url(#bgGradient)" />
    <circle
      cx="100"
      cy="100"
      r="88"
      fill="none"
      stroke="url(#pattern)"
      strokeWidth="4"
    />

    <circle
      cx="100"
      cy="100"
      r="85"
      fill="none"
      stroke="#FF4949"
      strokeWidth="1"
      strokeDasharray="4,6"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 100 100"
        to="360 100 100"
        dur="60s"
        repeatCount="indefinite"
      />
    </circle>

    <g filter="url(#glow)" transform="translate(100 100)">
      <path
        d="M-30,-30 L30,30"
        stroke="#FF4949"
        strokeWidth="10"
        strokeLinecap="round"
      >
        <animate
          attributeName="strokeWidth"
          values="10;12;10"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M30,-30 L-30,30"
        stroke="#FF4949"
        strokeWidth="10"
        strokeLinecap="round"
      >
        <animate
          attributeName="strokeWidth"
          values="10;12;10"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    <path
      d="M40,30 Q45,25 50,30 T60,30 T70,30 Q75,25 70,20"
      fill="#FF4949"
      opacity="0.2"
    >
      <animateMotion
        path="M -20,0 L 220,0"
        dur="15s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M150,50 Q155,45 160,50 T170,50 T180,50 Q185,45 180,40"
      fill="#FF4949"
      opacity="0.2"
    >
      <animateMotion
        path="M 220,0 L -20,0"
        dur="18s"
        repeatCount="indefinite"
      />
    </path>

    <g stroke="#FF4949" strokeWidth="1" opacity="0.3">
      <path d="M10,180 L15,170 L20,180 M15,170 L15,165 L12,160 M15,165 L18,160">
        <animateMotion
          path="M 0,0 L 180,0"
          dur="12s"
          repeatCount="indefinite"
        />
      </path>
      <path d="M170,180 L175,170 L180,180 M175,170 L175,165 L172,160 M175,165 L178,160">
        <animateMotion
          path="M 180,0 L 0,0"
          dur="14s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
);

const Error = ({ message }) => {
  const router = useRouter();
  return (
    <div>
      <div className="fixed top-0 sm:top-4 w-full sm:w-fit 2xl:px-72 xl:px-24 lg:px-16 md:px-12 z-[100]">
        <Header />
      </div>
      <div className="h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="mb-3">
            <ErrorIcon />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mb-3 text-center">
            {message || "Сервертэй холбогдоход алдаа гарлаа."}
          </h1>
          <div className="w-full mt-2">
            <Link href="/" className="grid place-items-center">
              <Button className="grd-btn h-11 w-1/2 sm:w-1/3" asChild>
                Нүүр хуудас
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
