export function RandomPlanButton({ selectedMood, onPick }) {
  const isSportMood = selectedMood?.id === "sport"

  return (
    <section className="section-card random-section" aria-labelledby="random-heading">
      <div className="section-copy">
        <h2 id="random-heading">{isSportMood ? "Sportif plan seç" : "Rastgele plan"}</h2>
        <p>
          {selectedMood
            ? `${selectedMood.title} içinden bir öneri getir.`
            : "Mood seçmeden rastgele bir plan seç."}
        </p>
      </div>

      <button type="button" className="random-button" onClick={onPick}>
        <span className="random-button__icon" aria-hidden="true">
          {isSportMood ? "🏃" : "🎲"}
        </span>
        <span className="random-button__content">
          <strong>{isSportMood ? "Spor Planı Seç" : "Bana Bir Plan Seç"}</strong>
          <span>{isSportMood ? "Birlikte hareketli öneri getir" : "Rastgele öneri getir"}</span>
        </span>
      </button>
    </section>
  )
}
