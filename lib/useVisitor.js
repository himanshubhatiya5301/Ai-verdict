"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function getVisitorId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("av_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("av_visitor_id", id);
  }
  return id;
}

export function useVisitorStats() {
  const [onlineCount, setOnlineCount] = useState(1);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    supabase
      .from("visitors")
      .upsert({ visitor_id: visitorId, last_seen: new Date().toISOString() })
      .then();

    async function loadTotal() {
      const { count } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });
      setTotalVisitors(count || 0);
    }
    loadTotal();

    const visitorsChannel = supabase
      .channel("visitors-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "visitors" }, () => {
        loadTotal();
      })
      .subscribe();

    const presenceChannel = supabase.channel("online-users", {
      config: { presence: { key: visitorId } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setOnlineCount(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(visitorsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  return { onlineCount, totalVisitors };
}
