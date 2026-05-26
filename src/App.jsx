import { useEffect, useState } from "react"
import "./App.css"
import { FloatingHeartsBackground } from "./components/FloatingHeartsBackground.jsx"
import { Header } from "./components/Header.jsx"
import { MoodSelector } from "./components/MoodSelector.jsx"
import { PlanList } from "./components/PlanList.jsx"
import { RandomPlanButton } from "./components/RandomPlanButton.jsx"
import { allPlans, moods, statusMessages } from "./data/moods.js"
import { findMood, getRandomItem, reorderPlans } from "./utils/planFilters.js"

const FAVORITES_STORAGE_KEY = "iremin-cani-favoriler"

function readFavoriteIds() {
  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function App() {
  const [selectedMoodId, setSelectedMoodId] = useState(null)
  const [activePlanId, setActivePlanId] = useState(null)
  const [statusMessage, setStatusMessage] = useState(statusMessages[1])
  const [favoritePlanIds, setFavoritePlanIds] = useState(readFavoriteIds)

  const selectedMood = selectedMoodId ? findMood(moods, selectedMoodId) : null
  const selectedMoodPlans = selectedMood ? selectedMood.plans : []
  const resolvedActivePlanId =
    selectedMoodPlans.find((plan) => plan.id === activePlanId)?.id ??
    selectedMoodPlans[0]?.id ??
    null
  const orderedPlans = reorderPlans(selectedMoodPlans, resolvedActivePlanId)
  const favoritePlans = favoritePlanIds
    .map((planId) => allPlans.find((plan) => plan.id === planId))
    .filter(Boolean)
  const headerTotalPlans = selectedMood ? selectedMood.plans.length : allPlans.length

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritePlanIds))
  }, [favoritePlanIds])

  function handleMoodSelect(moodId) {
    const mood = findMood(moods, moodId)

    if (!mood) {
      return
    }

    const nextPlan = getRandomItem(mood.plans)

    setSelectedMoodId(moodId)
    setActivePlanId(nextPlan?.id ?? null)
    setStatusMessage(getRandomItem(statusMessages) ?? statusMessages[0])
  }

  function handleSelectPlan(planId) {
    setActivePlanId(planId)
    setStatusMessage("Plan seçildi.")
  }

  function handleShufflePlan() {
    if (!selectedMood) {
      handleRandomPlan()
      return
    }

    const pool = selectedMoodPlans.length ? selectedMoodPlans : selectedMood.plans
    const nextPool = pool.filter((plan) => plan.id !== resolvedActivePlanId)
    const nextPlan = getRandomItem(nextPool.length ? nextPool : pool)

    if (!nextPlan) {
      return
    }

    setActivePlanId(nextPlan.id)
    setStatusMessage("Yeni plan seçildi.")
  }

  function handleRandomPlan() {
    if (selectedMood) {
      handleShufflePlan()
      return
    }

    const nextPlan = getRandomItem(allPlans)

    if (!nextPlan) {
      return
    }

    setSelectedMoodId(nextPlan.moodId)
    setActivePlanId(nextPlan.id)
    setStatusMessage("Rastgele plan seçildi.")
  }

  function handleToggleFavorite(planId) {
    const selectedPlan = allPlans.find((plan) => plan.id === planId)

    setFavoritePlanIds((currentIds) => {
      const isAlreadyFavorite = currentIds.includes(planId)

      if (isAlreadyFavorite) {
        setStatusMessage("Favoriler güncellendi.")
        return currentIds.filter((id) => id !== planId)
      }

      setStatusMessage(`${selectedPlan?.title ?? "Bu plan"} favorilere eklendi.`)
      return [planId, ...currentIds]
    })
  }

  function handleJumpToFavorite(plan) {
    setSelectedMoodId(plan.moodId)
    setActivePlanId(plan.id)
    setStatusMessage("Favori plan açıldı.")
  }

  function handleGoHome() {
    setSelectedMoodId(null)
    setActivePlanId(null)
    setStatusMessage("Anasayfaya dönüldü.")
  }

  return (
    <main className="app-shell">
      <FloatingHeartsBackground />

      <div className="phone-frame">
        <Header
          favoriteCount={favoritePlanIds.length}
          statusMessage={statusMessage}
          totalPlans={headerTotalPlans}
        />

        {selectedMood ? (
          <div className="detail-view">
            <nav className="detail-nav" aria-label="Mood detay gezinme">
              <button type="button" className="back-button" onClick={handleGoHome}>
                <span aria-hidden="true">←</span>
                Anasayfaya dön
              </button>

              <span className="detail-nav__mood" data-tone={selectedMood.tone}>
                {selectedMood.emoji} {selectedMood.title}
              </span>
            </nav>

            <RandomPlanButton selectedMood={selectedMood} onPick={handleRandomPlan} />

            <PlanList
              favoritePlanIds={favoritePlanIds}
              mood={selectedMood}
              plans={orderedPlans}
              activePlanId={resolvedActivePlanId}
              onSelectPlan={handleSelectPlan}
              onShufflePlan={handleShufflePlan}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        ) : (
          <div className="home-view">
            <RandomPlanButton selectedMood={selectedMood} onPick={handleRandomPlan} />

            {favoritePlans.length > 0 && (
              <section className="section-card favorites-section" aria-labelledby="favorites-heading">
                <div className="section-copy">
                  <h2 id="favorites-heading">Kalbe attıkların 💘</h2>
                  <p>Kaydettiğin planlar burada.</p>
                </div>

                <div className="favorite-pills">
                  {favoritePlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      className="favorite-plan-pill"
                      data-tone={findMood(moods, plan.moodId)?.tone}
                      onClick={() => handleJumpToFavorite(plan)}
                    >
                      <span>{plan.moodEmoji}</span>
                      <span>{plan.title}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <MoodSelector moods={moods} onSelect={handleMoodSelect} selectedMoodId={selectedMoodId} />

            <section className="section-card empty-section">
              <div className="section-copy">
                <h2>Bir mood seç.</h2>
                <p>
                  Seçtiğin mood’a uygun planlar bir sonraki ekranda görünecek.
                </p>
              </div>

              <div className="empty-section__stickers" aria-hidden="true">
                <span>💞</span>
                <span>☕</span>
                <span>🌊</span>
                <span>🎧</span>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
