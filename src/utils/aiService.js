
const AI_API_URL = 'http://127.0.0.1:8000'

export async function analyzeDevicePhoto(file) {
  if (!(file instanceof File)) {
    throw new Error('Please select a valid device photo.')
  }

  const formData = new FormData()
  formData.append('file', file)

  let response

  try {
    response = await fetch(`${AI_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error(
      'Could not connect to the AI service. Please make sure the Python server is running.',
    )
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      result.detail || 'Image analysis failed. Please try again.',
    )
  }

  return result
}

export async function checkAIService() {
  try {
    const response = await fetch(`${AI_API_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
