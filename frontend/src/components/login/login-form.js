"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login-form.module.css";

const ALLOWED_DOMAINS = ["@rompecabeza.cl"];

function isInstitutionalEmail(email) {
  return ALLOWED_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(domain.toLowerCase())
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateEmail(value) {
    if (!value.trim()) {
      return "";
    }
    if (!isInstitutionalEmail(value)) {
      return "Solo se permite correo institucional (@rompecabeza.cl).";
    }
    return "";
  }

  function handleEmailBlur() {
    setEmailError(validateEmail(email));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailErr = !email.trim()
      ? "Solo se permite correo institucional (@rompecabeza.cl)."
      : validateEmail(email);
    const passwordErr = !password.trim() ? "Ingresa tu contraseña." : "";

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setFormError("");

    if (emailErr || passwordErr) return;

    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setFormError("Correo o contraseña incorrectos.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/home");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className={styles.alert} role="alert">
          <Image
            src="/icons/error.svg"
            alt=""
            width={16}
            height={16}
            className={styles.alertIcon}
          />
          <span className={styles.alertText}>{formError}</span>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Usa tu correo institucional
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${emailError ? styles.inputError : ""}`}
            placeholder="nombre@rompecabeza.cl"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            onBlur={handleEmailBlur}
            autoComplete="email"
            aria-invalid={emailError ? "true" : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
          />
        </div>
        {emailError && (
          <div id="email-error" className={styles.alert} role="alert">
            <Image
              src="/icons/error.svg"
              alt=""
              width={16}
              height={16}
              className={styles.alertIcon}
            />
            <span className={styles.alertText}>{emailError}</span>
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Contraseña
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`${styles.input} ${styles.inputPassword} ${passwordError ? styles.inputError : ""}`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError("");
            }}
            autoComplete="current-password"
            aria-invalid={passwordError ? "true" : undefined}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <img
              src={
                showPassword
                  ? "/icons/eye-visible.svg"
                  : "/icons/eye-hidden.svg"
              }
              alt=""
              width={20}
              height={showPassword ? 10 : 8}
              className={`${styles.toggleIcon} ${showPassword ? styles.toggleIconVisible : styles.toggleIconHidden}`}
            />
          </button>
        </div>
        {passwordError && (
          <div id="password-error" className={styles.alert} role="alert">
            <Image
              src="/icons/error.svg"
              alt=""
              width={16}
              height={16}
              className={styles.alertIcon}
            />
            <span className={styles.alertText}>{passwordError}</span>
          </div>
        )}
      </div>

      <button type="submit" className={styles.submit} disabled={isLoading}>
        Iniciar sesión
        <Image
          src="/icons/arrow-right.svg"
          alt=""
          width={16}
          height={16}
          className={styles.submitIcon}
        />
      </button>
    </form>
  );
}
