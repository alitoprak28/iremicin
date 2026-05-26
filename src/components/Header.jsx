export function Header({ favoriteCount, statusMessage, totalPlans }) {
  return (
    <header className="app-header">
      <div className="hero-copy-wrap">
        <p className="eyebrow">KKTC date planları</p>
        <p className="hero-script">Irem edition</p>
        <h1>İremin Canı Ne İstiyor? 💭</h1>
        <p className="hero-copy">Mood&apos;unu seç, uygun planları gör.</p>

        <div className="header-meta">
          <span>{totalPlans} plan</span>
          <span>{favoriteCount} favori</span>
          <span>KKTC</span>
        </div>
      </div>

      <aside className="love-note-card" aria-label="Seçim özeti">
        <div className="love-note-heart" aria-hidden="true" />
        <p className="note-kicker">Seçim</p>
        <p className="status-pill">{statusMessage}</p>
      </aside>
    </header>
  )
}
