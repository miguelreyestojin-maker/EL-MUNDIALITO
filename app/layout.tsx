import type { Metadata } from "next";
import { Barlow, Bebas_Neue } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Torneo Relámpago",
  description: "Llaves y posiciones en tiempo real del torneo de fútbol de eliminación directa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bebas.variable} ${barlow.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-24 pb-10">{children}</main>
      </body>
    </html>
  );
}
