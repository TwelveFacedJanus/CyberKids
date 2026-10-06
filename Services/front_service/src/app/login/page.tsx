'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import HackTransition from "@/components/HackTransition/HackTransition";
import { useAuth } from "@/lib/context/AuthContext";
import { ApiError } from "@/lib/api/client";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!username.trim() || !password) {
      setError("Введите логин и пароль");
      return;
    }

    setPending(true);
    try {
      await login(username.trim(), password);
      // Успех — запускаем хакерский переход
      setTransitioning(true);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Не удалось войти";
      setError(msg);
    } finally {
      setPending(false);
    }
  };

  return (
      <div className={styles.login_page}>
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
            <input
              id="login"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <label htmlFor="login">Логин</label>
            <span className={styles.input_line} />
          </div>

          <div className={`${styles.input_form} ${styles.fadeUp}`} style={{ animationDelay: "450ms" }}>
            <input
              id="password"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <label htmlFor="password">Пароль</label>
            <span className={styles.input_line} />
          </div>

          {error && (
            <p className={`${styles.error} ${styles.fadeUp}`} style={{ animationDelay: "500ms" }}>
              {error}
            </p>
          )}

          <div className={styles.fadeUp} style={{ animationDelay: "600ms" }}>
            <PrimaryButton
              text={pending ? "Проверка..." : "Войти"}
              f={pending ? undefined : handleLogin}
            />
          </div>

          <div className={`${styles.register} ${styles.fadeUp}`} style={{ animationDelay: "750ms" }}>
            <p>Еще нет аккаунта?</p>
            <a href="/register">Создать аккаунт</a>
          </div>
        </div>

        <div className={styles.video_section}>
          <video className={styles.video} src="/simple_video.mp4" autoPlay loop muted playsInline />
      </div>

      {transitioning && (
        <HackTransition onComplete={() => router.push("/dashboard")} />
      )}
      </div>


  );
}
