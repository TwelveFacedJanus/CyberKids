import styles from "./FillOverlay.module.css";

export default function FillOverlay() {
  return (
    <div className={styles.overlay}>
      <svg
        className={styles.svg}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="roughEdge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="2"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="2" />
          </filter>
        </defs>

        {/* Клякса на кривых Безье — 8 контрольных точек, гладкий контур */}
        <path
          d="M 50 25
             C 62 22, 78 32, 76 48
             C 75 60, 68 72, 54 74
             C 42 76, 30 68, 26 55
             C 22 42, 30 30, 42 26
             C 45 25, 47 25, 50 25 Z"
          fill="#A35139"
          filter="url(#roughEdge)"
          className={styles.blob}
        />
      </svg>
    </div>
  );
}
