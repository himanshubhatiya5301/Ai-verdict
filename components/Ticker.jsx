"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function pct(m) {
  const t = m.total_upvotes + m.total_downvotes;
  return t ? Math.round((m.total_upvotes / t) * 100) : 0;
}

export default function Ticker() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("models")
      .select("name,total_upvotes,total_downvotes")
      .then(({ data }) => {
        if (active && data) setModels([...data].sort((a, b) => pct(b) - pct(a)));
      });
    return () => (active = false);
  }, []);

  if (!models.length) return <div className="ticker-wrap">&nbsp;</div>;

  const items = models.map((m) => {
    const p = pct(m);
    const isUp = p >= 50;
    return (
      <span key={m.name}>
        {m.name} <span className={isUp ? "up" : "down"}>{p}% {isUp ? "↑" : "↓"}</span>
      </span>
    );
  });

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items}
        {items}
      </div>
    </div>
  );
}
