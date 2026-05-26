import { PlanCard } from "./PlanCard.jsx"

export function PlanList({
  favoritePlanIds,
  mood,
  onSelectPlan,
  onShufflePlan,
  onToggleFavorite,
  plans,
  activePlanId,
}) {
  if (!plans.length) {
    return (
      <section className="section-card plan-section plan-section--empty">
        <div className="section-copy">
          <h2>Bu mood için plan bulunamadı.</h2>
          <p>Anasayfaya dönüp başka bir mood seçebilirsin.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="plan-section" id="plan-section" aria-labelledby="plan-heading">
      <div className="section-copy">
        <span className="mood-pill" data-tone={mood.tone}>
          {mood.emoji} {mood.title}
        </span>
        <h2 id="plan-heading">{mood.title} için planlar hazır</h2>
        <p>{mood.detailDescription ?? mood.description}</p>
      </div>

      <div className="plan-stack">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={activePlanId === plan.id}
            isFavorite={favoritePlanIds.includes(plan.id)}
            onSelect={onSelectPlan}
            onShuffle={onShufflePlan}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
