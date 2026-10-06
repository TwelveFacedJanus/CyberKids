'use client';

import styles from "@/components/Buttons/PrimaryButton.module.css";

type Props = {
  text: string;
  f?: () => void;
};

export default function PrimaryButton({ text, f }: Props) {
  return (
    <button className={styles.button} onClick={f}>
      <span className={styles.label}>{text}</span>
      <span className={styles.shine} aria-hidden="true" />
    </button>
  );
}
