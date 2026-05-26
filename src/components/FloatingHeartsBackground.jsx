const FLOATERS = [
  "heart-one",
  "heart-two",
  "heart-three",
  "heart-four",
  "heart-five",
  "heart-six",
]

export function FloatingHeartsBackground() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {FLOATERS.map((heart) => (
        <span key={heart} className={`ambient-heart ${heart}`} />
      ))}
    </div>
  )
}
