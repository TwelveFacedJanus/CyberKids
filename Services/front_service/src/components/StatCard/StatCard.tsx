'use client';

import styles from "./StatCard.module.css";

type Props = {
  label: string;
  value: number;
  suffix?: string;
};

export default function StatCard({ label, value, suffix }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>
        {value}
        {suffix && <span className={styles.suffix}> {suffix}</span>}
      </p>
      <span className={styles.corner} />
    </div>
  );
}
