export function FavoriteButton({ isFavorite, onToggle, title }) {
  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? " is-active" : ""}`}
      aria-label={isFavorite ? `${title} favorilerden cikar` : `${title} favorilere ekle`}
      aria-pressed={isFavorite}
      onClick={onToggle}
    >
      <span className="favorite-button__heart" aria-hidden="true">
        {isFavorite ? "♥" : "♡"}
      </span>
      <span className="favorite-button__spark" aria-hidden="true">
        ✨
      </span>
    </button>
  )
}
