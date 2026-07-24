import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smartyard Safety Control",
  description: "조선소 현장 작업자를 위한 안전 업무 프로토타입",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
