// components/tasks/photo_detective/PhotoMap.tsx
import { Box } from "@mui/material";

export default function PhotoMap() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 300,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#F1F5F9",
        border: "1px solid #CBD5E1",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Фон-кварталы */}
        <rect width="800" height="300" fill="#F1F5F9" />

        {/* Зелёный парк */}
        <path
          d="M 550 30 Q 620 40 660 90 Q 680 140 640 200 Q 600 240 520 230 Q 470 200 480 140 Q 490 80 550 30 Z"
          fill="#BBF7D0"
          stroke="#86EFAC"
          strokeWidth="2"
        />
        {/* Деревья в парке */}
        {[
          [520, 80],
          [560, 60],
          [600, 80],
          [630, 120],
          [620, 170],
          [580, 200],
          [540, 190],
          [510, 140],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill="#4ADE80" opacity="0.7" />
        ))}

        {/* Река */}
        <path
          d="M 0 260 Q 80 240 160 250 Q 260 265 340 240 Q 420 215 500 240 Q 580 265 660 250 Q 720 240 800 255"
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Кварталы-домики */}
        {[
          [40, 30, 100, 60],
          [160, 30, 80, 60],
          [260, 30, 120, 60],
          [40, 110, 100, 60],
          [160, 110, 80, 60],
          [260, 110, 120, 60],
          [40, 190, 100, 50],
          [160, 190, 80, 50],
          [260, 190, 120, 50],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="6"
            fill="#E5E7EB"
            stroke="#D1D5DB"
            strokeWidth="1"
          />
        ))}

        {/* Улицы */}
        <line
          x1="0"
          y1="100"
          x2="500"
          y2="100"
          stroke="#FFFFFF"
          strokeWidth="8"
        />
        <line
          x1="0"
          y1="180"
          x2="500"
          y2="180"
          stroke="#FFFFFF"
          strokeWidth="8"
        />
        <line
          x1="150"
          y1="0"
          x2="150"
          y2="240"
          stroke="#FFFFFF"
          strokeWidth="8"
        />
        <line
          x1="250"
          y1="0"
          x2="250"
          y2="240"
          stroke="#FFFFFF"
          strokeWidth="8"
        />

        {/* Названия улиц */}
        <text x="60" y="105" fontSize="9" fill="#6B7280" fontWeight="600">
          ул. Льва Толстого
        </text>
        <text x="60" y="185" fontSize="9" fill="#6B7280" fontWeight="600">
          Комсомольский пр-т
        </text>

        {/* Метки метро */}
        <g transform="translate(440, 200)">
          <circle r="10" fill="#7C4DFF" />
          <text
            x="0"
            y="4"
            fontSize="10"
            fill="#fff"
            textAnchor="middle"
            fontWeight="800"
          >
            М
          </text>
          <text x="18" y="5" fontSize="9" fill="#4B5563" fontWeight="600">
            Парк культуры
          </text>
        </g>

        {/* Маркер «Пятёрочка» */}
        <g transform="translate(180, 130)">
          <circle r="11" fill="#16A34A" stroke="#fff" strokeWidth="2" />
          <text
            x="0"
            y="4"
            fontSize="10"
            fill="#fff"
            textAnchor="middle"
            fontWeight="800"
          >
            П
          </text>
        </g>

        {/* Маркер школы (пульсирующий) */}
        <g transform="translate(400, 120)">
          <circle r="20" fill="#EF4444" opacity="0.25">
            <animate
              attributeName="r"
              values="12;24;12"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="12" fill="#EF4444" stroke="#fff" strokeWidth="3" />
          <text
            x="0"
            y="5"
            fontSize="12"
            fill="#fff"
            textAnchor="middle"
            fontWeight="900"
          >
            🏫
          </text>
          <text
            x="0"
            y="32"
            fontSize="10"
            fill="#7F1D1D"
            textAnchor="middle"
            fontWeight="700"
          >
            Школа №12
          </text>
        </g>

        {/* Маркер остановки */}
        <g transform="translate(480, 130)">
          <circle r="9" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
          <text
            x="0"
            y="4"
            fontSize="9"
            fill="#fff"
            textAnchor="middle"
            fontWeight="800"
          >
            42
          </text>
        </g>

        {/* Зум-контрол */}
        <g transform="translate(755, 20)">
          <rect
            x="0"
            y="0"
            width="26"
            height="50"
            rx="6"
            fill="#fff"
            opacity="0.9"
          />
          <text
            x="13"
            y="18"
            fontSize="14"
            fill="#4B5563"
            textAnchor="middle"
            fontWeight="700"
          >
            +
          </text>
          <line x1="6" y1="25" x2="20" y2="25" stroke="#E5E7EB" />
          <text
            x="13"
            y="42"
            fontSize="14"
            fill="#4B5563"
            textAnchor="middle"
            fontWeight="700"
          >
            −
          </text>
        </g>
      </svg>
    </Box>
  );
}
