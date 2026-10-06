import Image from "next/image";
import styles from "./Security.module.css";

export default function Security() {
  return (
    <div className={styles.wrapper}>
      <Image
        src="/security.png"
        alt=""
        width={120}
        height={120}
        priority
        unoptimized
        className={styles.security}
      />
    </div>
  );
}
