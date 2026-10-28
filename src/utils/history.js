
const STORAGE_KEY = 'ecorevive_assessment_history_v1'

export function getAssessmentHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Could not read assessment history:', error)
    return []
  }
}

export function saveAssessmentHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return true
  } catch (error) {
    console.error('Could not save assessment history:', error)
    return false
  }
}

export function addAssessmentToHistory(assessment) {
  const history = getAssessmentHistory()

  const updatedHistory = [
    assessment,
    ...history.filter((item) => item.id !== assessment.id),
  ]

  const saved = saveAssessmentHistory(updatedHistory)

  return { history: updatedHistory, saved }
}
