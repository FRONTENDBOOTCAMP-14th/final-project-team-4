"use client"

import Image from "next/image"
import appleIconPath from "@/../public/company-icons/apple.svg"
import googleIconPath from "@/../public/company-icons/google.svg"
import kakaoIconPath from "@/../public/company-icons/kakao.svg"
import imagePath from "@/../public/login-page.png"
import { useAuth } from "@/contexts/AuthContext"
import handleKakaoLogin from "./kakao/actions"
import styles from "./page.module.css"

export default function Login() {
  const { signInWithNaver, loading } = useAuth()

  return (
    <main className={styles.loginPageContainer}>
      <section className={styles.loginSection}>
        <div className={styles.loginPageContents}>
          <div className={styles.subTexts}>
            <p className={styles.brandSubText}>mini motivation</p>
            <p className={styles.subText}>좋은 습관을 만들기 위한 첫걸음</p>
          </div>
          <div className={styles.divider} role="separator" />
          <h2 className={styles.loginTitle}>로그인</h2>
          <p className={styles.loginInfoText}>
            간편 로그인으로 빠르게 시작해보세요!
          </p>
          <ul className={styles.loginButtonsContainer}>
            <li>
              <button
                // 구글 소셜 로그인 구현 후 사용
                // onClick={handleGoogleLogin}
                className={styles.googleLoginButton}
                type="button"
              >
                <Image src={googleIconPath.src} width={24} height={24} alt="" />
                구글로 시작하기
              </button>
            </li>
            <li>
              <button
                onClick={handleKakaoLogin}
                className={styles.kakaoLoginButton}
                type="button"
              >
                <Image src={kakaoIconPath.src} width={26} height={24} alt="" />
                카카오로 시작하기
              </button>
            </li>
            <li>
              <button
                // 애플 소셜 로그인 구현 후 사용
                onClick={signInWithNaver}
                disabled={loading}
                className={styles.naverLoginButton}
                type="button"
              >
                <Image src={appleIconPath.src} width={21} height={26} alt="" />
                네이버로 시작하기
              </button>
            </li>
          </ul>
        </div>
        <Image
          src={imagePath.src}
          className={styles.loginPageImage}
          width={414}
          height={632}
          alt=""
        />
      </section>
    </main>
  )
}
