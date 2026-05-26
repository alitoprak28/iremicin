import { MoodCard } from "./MoodCard.jsx"

export function MoodSelector({ moods, onSelect, selectedMoodId }) {
  return (
    <section className="section-card mood-section" aria-labelledby="mood-heading">
      <div className="section-copy">
        <h2 id="mood-heading">Bugün ne yapmak istiyorsun?</h2>
      </div>

      <div className="mood-grid">
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            isSelected={selectedMoodId === mood.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
