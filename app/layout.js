import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "laptopsellers",
  description: "Buy and sell laptops in Pakistan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="navbar-brand">laptopsellers</Link>
            <div className="navbar-links">
              <Link href="/signup" className="btn-outline">Apply for a Store</Link>
              <Link href="/login" className="btn-primary">Store Owner Login</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}