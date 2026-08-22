import "./globals.css";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";

export const metadata = {
  title: "AI Verdict — The People's Verdict on AI",
  description: "Try AI models and cast your verdict. One vote at a time, decided by the people.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Ticker />
        <Header />
        {children}
        <footer className="site">
          <div className="footer-inner">
            <div className="left">© 2026 AI Verdict — The people decide which AI is best.</div>
            <div className="credit">
              Built by <b>Himanshu Bhatiya</b>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
