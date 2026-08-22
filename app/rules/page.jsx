const clauses = [
  { n: "01", title: "One person, one vote.", body: "Each Google account can vote only once per model. Voting again updates your existing vote instead of adding a new one." },
  { n: "02", title: "Login required only to vote.", body: "Browsing models and viewing vote counts is open to everyone — no login needed. A Google sign-in is only requested the moment you tap Upvote or Downvote." },
  { n: "03", title: "You can change your vote.", body: "Changed your mind? No problem. You can switch between Upvote and Downvote at any time — only your latest vote counts." },
  { n: "04", title: "A reason is optional, respect is not.", body: "Spam, abusive language, or fake reviews will be removed, and repeat offenders may be banned." },
  { n: "05", title: "Submitting your own model.", body: "Any company or creator can list their AI model — sign in with Google and fill out the form. It goes live immediately, no waiting on approval." },
  { n: "06", title: "The leaderboard is open to everyone.", body: "The most upvoted models are shown. Transparency is the point." },
];

export default function RulesPage() {
  return (
    <div className="rules-wrap">
      <div className="rules-head">
        <div className="eyebrow">Voting Charter · Effective for all users</div>
        <h2>The Rules of Verdict</h2>
      </div>
      {clauses.map((c) => (
        <div className="clause" key={c.n}>
          <div className="clause-num">{c.n}</div>
          <div>
            <p className="clause-title">{c.title}</p>
            <p className="clause-body">{c.body}</p>
          </div>
        </div>
      ))}
      <div className="seal">⬢ Verified by AI Verdict · Community Voted</div>
    </div>
  );
}
