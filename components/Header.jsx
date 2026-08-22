"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

const tabs = [
  { href: "/", label: "Models" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/submit", label: "List Your Model" },
  { href: "/rules", label: "Rules" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="site">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect x="4" y="20" width="7" height="14" rx="2" fill="var(--ink)" />
              <rect x="15.5" y="12" width="7" height="22" rx="2" fill="var(--ink)" />
              <rect x="27" y="5" width="7" height="29" rx="2" fill="var(--gold)" />
            </svg>
          </div>
          <div>
            <div className="brand-name">AI VERDICT</div>
            <div className="brand-tag">One vote at a time, decided by the people</div>
          </div>
        </div>

        <nav className="pagetabs">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className={pathname === t.href ? "active" : ""}>
              {t.label}
            </Link>
          ))}
        </nav>

        {!loading && (
          user ? (
            <button className="signin-btn" onClick={signOut} title={user.email}>
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  style={{ width: 18, height: 18, borderRadius: "50%" }}
                />
              )}
              Sign out
            </button>
          ) : (
            <button className="signin-btn" onClick={signInWithGoogle}>
              <svg className="gicon" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3c-7.4 0-13.8 4.1-17.1 10.2z" />
                <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.4 26.9 37.3 24 37.3c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.9 40.9 16.4 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.5 35.5 45 30.2 45 24c0-1.4-.1-2.7-.4-3.5z" />
              </svg>
              Sign in
            </button>
          )
        )}
      </div>
    </header>
  );
}
