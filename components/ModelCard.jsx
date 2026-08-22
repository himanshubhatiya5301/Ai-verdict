"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

function pct(m) {
  const t = m.total_upvotes + m.total_downvotes;
  return t ? Math.round((m.total_upvotes / t) * 100) : 0;
}

export default function ModelCard({ model, rank, myVote, onVoted }) {
  const { user, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const p = pct(model);
  const total = model.total_upvotes + model.total_downvotes;

  async function castVote(type) {
    if (!user) {
      signInWithGoogle();
      return;
    }
    if (busy || myVote === type) return;
    setBusy(true);

    const { error } = await supabase
      .from("votes")
      .upsert(
        { model_id: model.id, user_id: user.id, vote_type: type },
        { onConflict: "model_id,user_id" }
      );

    setBusy(false);
    if (error) {
      alert("Vote save nahi ho paya: " + error.message);
      return;
    }
    onVoted?.(model.id, type);
  }

  return (
    <div className={`card ${rank === 1 ? "rank1" : ""}`}>
      {rank ? <div className="rank-badge">#{rank}</div> : null}
      <div className="card-top">
        <div className="logo">
          {model.logo_url ? <img src={model.logo_url} alt="" /> : model.name[0]}
        </div>
        <div>
          <div className="card-title">{model.name}</div>
          <div className="card-company">{model.company_name}</div>
        </div>
      </div>
      <div className="cat-pill">{model.category}</div>
      <div className="card-desc">{model.short_description}</div>
      <div className="tally">
        <div className="tally-top">
          <span className="pct">{p}% upvoted</span>
          <span>{total} votes</span>
        </div>
        <div className="tally-bar">
          <div className="tally-fill" style={{ width: `${p}%` }} />
        </div>
        <div className="tally-ticks">
          {Array.from({ length: 11 }).map((_, i) => <i key={i} />)}
        </div>
        <div className="votecount">↑ {model.total_upvotes}   ↓ {model.total_downvotes}</div>
      </div>
      <div className="card-actions">
        <a className="btn-try" href={model.demo_link} target="_blank" rel="noopener noreferrer">
          Try Now
        </a>
        <div className="vote-row">
          <button
            className={myVote === "up" ? "up-active" : ""}
            disabled={busy}
            onClick={() => castVote("up")}
          >
            <span className="ic">👍</span> Upvote
          </button>
          <button
            className={myVote === "down" ? "down-active" : ""}
            disabled={busy}
            onClick={() => castVote("down")}
          >
            <span className="ic">👎</span> Downvote
          </button>
        </div>
      </div>
    </div>
  );
}
