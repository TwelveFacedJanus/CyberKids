import { Box } from "@mui/material";

export default function AnimatedBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "radial-gradient(1200px 600px at 10% 0%, #F3EEFF 0%, transparent 60%)," +
          "radial-gradient(1000px 500px at 90% 100%, #E9F3FF 0%, transparent 55%)," +
          "linear-gradient(180deg, #FBFAFF 0%, #F7F7FB 100%)",
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          filter: "blur(80px)",
          opacity: 0.35,
          animation: "floatBlob 18s ease-in-out infinite",
        },
        "&::before": {
          top: -160,
          left: -120,
          background: "radial-gradient(circle, #A78BFA, transparent 70%)",
        },
        "&::after": {
          bottom: -180,
          right: -140,
          background: "radial-gradient(circle, #7DD3FC, transparent 70%)",
          animationDelay: "-6s",
        },
        "@keyframes floatBlob": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(40px,-30px) scale(1.08)" },
        },
      }}
    />
  );
}