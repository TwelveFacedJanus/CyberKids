'use client';

import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "@/app/login/page.module.css";
import HackTransition from "@/components/HackTransition/HackTransition";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const handleLogin = () => {
    setTransitioning(true);
  };

  return (
    <div className={styles.login_page}>
      {/* Левая часть — форма */}
      <div className={styles.login_form}>
        <div className={`${styles.logo} ${styles.fadeUp}`} style={{ animationDelay: "0ms" }}>
          <h1>Лаборатория</h1>
          <h1>Кибербезопасности</h1>
        </div>

        <div className={`${styles.subtitle} ${styles.fadeUp}`} style={{ animationDelay: "150ms" }}>
          <p>Авторизация</p>
          <p>Учись кибербезопасности выполняя задания</p>
        </div>

        <div className={`${styles.input_form} ${styles.fadeUp}`} style={{ animationDelay: "300ms" }}>
          <input id="login" placeholder=" " />
          <label htmlFor="login">Логин</label>
          <span className={styles.input_line} />
        </div>

        <div className={`${styles.input_form} ${styles.fadeUp}`} style={{ animationDelay: "450ms" }}>
          <input id="password" type="password" placeholder=" " />
          <label htmlFor="password">Пароль</label>
          <span className={styles.input_line} />
        </div>

        <div className={styles.fadeUp} style={{ animationDelay: "600ms" }}>
          <PrimaryButton text="Войти" f={handleLogin}/>
        </div>

        <div className={`${styles.register} ${styles.fadeUp}`} style={{ animationDelay: "750ms" }}>
          <p>Еще нет аккаунта?</p>
          <a href="/register">Создать аккаунт</a>
        </div>
      </div>

      {/* Правая часть — видео */}
      <div className={styles.video_section}>
        <video
          className={styles.video}
          src="/simple_video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      {transitioning && (
        <HackTransition onComplete={() => router.push("/dashboard")} />
      )}
    </div>
  );
}
