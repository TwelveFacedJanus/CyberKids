"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Tail from "@/compontents/Decoration/Tail";
import FillOverlay from "@/compontents/FillOverlay";
import FloatingPotion from "@/compontents/Decoration/FloatingPotion";
import Security from "@/compontents/Decoration/Security";

type BearPosition = "peek" | "hands" | "look" | "fly" | "text" | "potion";
type Anchor = "button" | "text" | "none";

type Frame = {
  src: string;
  delay: number;
  position: BearPosition;
  anchor: Anchor;
};

const FRAMES: Frame[] = [
  { src: "/bear_ws/Sprite-0001.png", delay: 800,  position: "peek",   anchor: "button" },
  { src: "/bear_ws/Sprite-0002.png", delay: 800,  position: "hands",  anchor: "button" },
  { src: "/bear_ws/Sprite-0003.png", delay: 600,  position: "look",   anchor: "button" },
  { src: "/bear_ws/Sprite-0004.png", delay: 600,  position: "look",   anchor: "button" },
  { src: "/bear_ws/Sprite-0005.png", delay: 600,  position: "fly",    anchor: "none"   },
  { src: "/bear_ws/Sprite-0006.png", delay: 900,  position: "fly",    anchor: "none"   },
  { src: "/bear_ws/Sprite-0007.png", delay: 1500, position: "text",   anchor: "text"   },
  { src: "/bear_ws/Sprite-0008.png", delay: 2000, position: "potion", anchor: "text"   },
];

const START_DELAY = 3000;
const FLY_START = 4;
const FLY_END = 5;

export default function Home() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [flying, setFlying] = useState(false);
  const [filling, setFilling] = useState(false);

  const frame = FRAMES[frameIndex];


  useEffect(() => {
    const t = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || flying || filling) return;
    if (frameIndex >= FRAMES.length - 1) return;

    const t = setTimeout(() => {
      setFrameIndex((i) => i + 1);
    }, frame.delay);

    return () => clearTimeout(t);
  }, [frameIndex, started, flying, filling, frame.delay]);


  useEffect(() => {
    if (!flying) return;
    if (frameIndex < FLY_START || frameIndex >= FLY_END) return;

    const t = setTimeout(() => {
      setFrameIndex((i) => i + 1);
    }, frame.delay);

    return () => clearTimeout(t);
  }, [flying, frameIndex, frame.delay]);


  const handleStart = () => {
    setStarted(false);
    setFlying(true);
    setFrameIndex(FLY_START);
  };


  useEffect(() => {
    if (!flying) return;
    if (frameIndex !== FLY_END) return;

    const t = setTimeout(() => {
      setFilling(true);
    }, FRAMES[FLY_END].delay);

    return () => clearTimeout(t);
  }, [flying, frameIndex]);

  const bear = (
    <Image
      key={frame.src}
      src={frame.src}
      alt=""
      width={200}
      height={200}
      priority
      unoptimized
      className={`${styles.bear} ${styles[`bear_${frame.position}`]}`}
    />
  );

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} aria-hidden="true" />
      <Tail />
      <FloatingPotion />
      <Security/>
      <div className={styles.primaryName}>
        <h1 className={styles.laboratoryName}>Лаборатория</h1>
        <h1 className={styles.securityName}>Безопасности</h1>
        {started && frame.anchor === "text" && bear}
      </div>

      <div className={styles.buttons}>
        {started && frame.anchor === "button" && bear}
        <button
          className={`${styles.primaryButton} ${filling ? styles.filling : ""}`}
          onClick={handleStart}
          disabled={flying || filling}
        >
          Приступить
        </button>
      </div>

      {flying && frame.anchor === "none" && bear}
      {filling && <div className={styles.fillOverlay} />}
    </div>
  );
}
