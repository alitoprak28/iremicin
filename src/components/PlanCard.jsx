import { FavoriteButton } from "./FavoriteButton.jsx"

function PlanInfoRow({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <div className="plan-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function PlanCard({
  isActive,
  isFavorite,
  onSelect,
  onShuffle,
  onToggleFavorite,
  plan,
}) {
  const isSportPlan = plan.moodId === "sport"

  return (
    <article
      className={`plan-card${isActive ? " is-active" : ""}`}
      data-kind={plan.kind ?? "plan"}
    >
      <div className="plan-card__top">
        <h3>{plan.title}</h3>

        <FavoriteButton
          isFavorite={isFavorite}
          title={plan.title}
          onToggle={() => onToggleFavorite(plan.id)}
        />
      </div>

      {(plan.place || plan.moodLabel || plan.timeLabel) && (
        <div className="plan-info-grid">
          <PlanInfoRow label="Yer" value={plan.place} />
          <PlanInfoRow label="Mood" value={plan.moodLabel ?? plan.moodTitle} />
          <PlanInfoRow label="Saat önerisi" value={plan.timeLabel} />
        </div>
      )}

      {plan.vibe && <p className="plan-vibe">{plan.vibe}</p>}

      <ul className="plan-steps">
        {plan.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <div className="plan-actions">
        <button type="button" className="select-button" onClick={() => onSelect(plan.id)}>
          {isActive ? "Seçildi" : isSportPlan ? "🏃 Spor Planı Seç" : "Bu planı seç"}
        </button>
        <button type="button" className="shuffle-button" onClick={onShuffle}>
          {isSportPlan ? "Başka Sportif Plan Ver 😭" : "Başka plan"}
        </button>
      </div>
    </article>
  )
}
