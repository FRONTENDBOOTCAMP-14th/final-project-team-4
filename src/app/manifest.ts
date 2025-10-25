import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Minimo",
    // 앱의 전체 이름 (설치 시 표시)
    short_name: "Minimo",
    // 홈 화면에 표시될 짧은 이름
    description:
      "An interactive social platform for small challenges, achievements, and sharing.",
    start_url: "/",
    display: "standalone",
    // "standalone"으로 설정하면 브라우저 UI 없이 앱처럼 실행
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      // 유저 디바이스에 다운로드 될 아이콘
      {
        src: "/pwa-icon.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
