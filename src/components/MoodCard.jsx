export function MoodCard({ isSelected, mood, onSelect }) {
  return (
    <button
      type="button"
      className={`mood-card${isSelected ? " is-selected" : ""}`}
      data-tone={mood.tone}
      onClick={() => onSelect(mood.id)}
      aria-pressed={isSelected}
    >
      <span className="mood-card__emoji" aria-hidden="true">
        {mood.emoji}
      </span>
      <span className="mood-card__title">{mood.title}</span>
      <span className="mood-card__description">{mood.description}</span>
    </button>
  )
}
