export function filterPlans(plans, selectedFilters) {
  return plans.filter((plan) =>
    Object.entries(selectedFilters).every(([groupId, selectedValue]) => {
      if (!selectedValue) {
        return true
      }

      return plan[`${groupId}Tags`].includes(selectedValue)
    }),
  )
}

export function getRandomItem(items) {
  if (!items.length) {
    return null
  }

  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

export function reorderPlans(plans, activePlanId) {
  if (!activePlanId) {
    return plans
  }

  const activePlan = plans.find((plan) => plan.id === activePlanId)

  if (!activePlan) {
    return plans
  }

  return [activePlan, ...plans.filter((plan) => plan.id !== activePlanId)]
}

export function findMood(moods, moodId) {
  return moods.find((mood) => mood.id === moodId) ?? null
}

export function findPlan(plans, planId) {
  return plans.find((plan) => plan.id === planId) ?? null
}
