import Image from "next/image";
import styles from "./FloatingPotion.module.css";

export default function FloatingPotion() {
  return (
    <div className={styles.wrapper}>
      <Image
        src="/potion.png"
        alt=""
        width={120}
        height={120}
        priority
        unoptimized
        className={styles.potion}
      />
    </div>
  );
}
