"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import ModelCard from "@/components/ModelCard";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [models, setModels] = useState([]);
  const [myVotes, setMyVotes] = useState({});

  async function load() {
    const { data } = await supabase
      .from("models")
      .select("*")
      .order("total_upvotes", { ascending: false })
      .limit(10);
    setModels(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!user) return setMyVotes({});
    supabase
      .from("votes")
      .select("model_id,vote_type")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const map = {};
        (data || []).forEach((v) => (map[v.model_id] = v.vote_type));
        setMyVotes(map);
      });
  }, [user?.id]);

  return (
    <div>
      <div className="controls-wrap">
        <div className="hero-line">
          <h1 className="hero">
            This week's
            <br />
            <em>verdict board.</em>
          </h1>
          <p className="hero-sub">
            The most upvoted models — real votes from real people, updated live.
          </p>
        </div>
      </div>
      <div className="grid">
        {models.map((m, i) => (
          <ModelCard
            key={m.id}
            model={m}
            rank={i + 1}
            myVote={myVotes[m.id]}
            onVoted={() => { load(); }}
          />
        ))}
      </div>
    </div>
  );
}
