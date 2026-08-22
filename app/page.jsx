"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import ModelCard from "@/components/ModelCard";

const categories = ["All", "Writing", "Image", "Video", "Voice", "Coding", "Resume"];

function pct(m) {
  const t = m.total_upvotes + m.total_downvotes;
  return t ? Math.round((m.total_upvotes / t) * 100) : 0;
}

export default function HomePage() {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [myVotes, setMyVotes] = useState({});
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("trending");
  const [loading, setLoading] = useState(true);

  async function loadModels() {
    setLoading(true);
    const { data } = await supabase
      .from("models")
      .select("*")
      .order("created_at", { ascending: false });
    setModels(data || []);
    setLoading(false);
  }

  async function loadMyVotes(uid) {
    if (!uid) {
      setMyVotes({});
      return;
    }
    const { data } = await supabase.from("votes").select("model_id,vote_type").eq("user_id", uid);
    const map = {};
    (data || []).forEach((v) => (map[v.model_id] = v.vote_type));
    setMyVotes(map);
  }

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    loadMyVotes(user?.id);
  }, [user?.id]);

  function handleVoted(modelId, type) {
    setMyVotes((prev) => ({ ...prev, [modelId]: type }));
    setModels((prev) =>
      prev.map((m) => {
        if (m.id !== modelId) return m;
        const prevVote = myVotes[modelId];
        let up = m.total_upvotes, down = m.total_downvotes;
        if (prevVote === "up") up--;
        if (prevVote === "down") down--;
        if (type === "up") up++;
        if (type === "down") down++;
        return { ...m, total_upvotes: up, total_downvotes: down };
      })
    );
    setTimeout(loadModels, 400);
  }

  const filtered = useMemo(() => {
    let list = models.filter(
      (m) =>
        (activeCat === "All" || m.category === activeCat) &&
        (m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.company_name.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "upvoted") list = [...list].sort((a, b) => b.total_upvotes - a.total_upvotes);
    else if (sort === "downvoted") list = [...list].sort((a, b) => b.total_downvotes - a.total_downvotes);
    else if (sort === "newest") list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else list = [...list].sort((a, b) => pct(b) - pct(a));
    return list;
  }, [models, activeCat, query, sort]);

  const totalVotes = models.reduce((s, m) => s + m.total_upvotes + m.total_downvotes, 0);

  return (
    <div>
      <div className="stats-pill-wrap">
        <div className="stats-pill">
          <span className="dot"></span>
          <b>{models.length} models</b> · {totalVotes} votes cast ·{" "}
          <a href="/leaderboard">see leaderboard →</a>
        </div>
      </div>

      <div className="controls-wrap">
        <div className="hero-line">
          <h1 className="hero">
            Try the tool.
            <br />
            Then <em>cast your verdict.</em>
          </h1>
          <p className="hero-sub">
            Try any AI model here without logging in. Voting just needs a quick Google sign-in — 1 account, 1 vote.
          </p>
        </div>
        <div className="search-row">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5A5D53" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search model or company name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="sortsel" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="trending">Sort: Trending</option>
            <option value="upvoted">Sort: Most Upvoted</option>
            <option value="newest">Sort: Newest</option>
            <option value="downvoted">Sort: Most Downvoted</option>
          </select>
        </div>
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === activeCat ? "active" : ""}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {loading ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>Loading models…</p>
        ) : filtered.length ? (
          filtered.map((m) => (
            <ModelCard key={m.id} model={m} myVote={myVotes[m.id]} onVoted={handleVoted} />
          ))
        ) : (
          <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>No models found.</p>
        )}
      </div>
    </div>
  );
}
