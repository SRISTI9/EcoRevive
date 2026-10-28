
const scoreValues = {
  battery: {
    Excellent: 100,
    Good: 85,
    Weak: 45,
    Damaged: 0,
  },
  screen: {
    Excellent: 100,
    Good: 90,
    Cracked: 45,
    'Not Working': 0,
  },
  buttons: {
    Working: 100,
    'Partially Working': 55,
    'Not Working': 0,
    'Not Applicable': 100,
  },
  performance: {
    Fast: 100,
    Normal: 80,
    Slow: 45,
    'Not Working': 0,
  },
  damage: {
    None: 100,
    Minor: 80,
    Moderate: 50,
    Severe: 15,
  },
  functional: {
    'Fully Working': 100,
    'Partially Working': 50,
    'Not Working': 0,
  },
}

const weights = {
  battery: 0.20,
  screen: 0.20,
  buttons: 0.10,
  performance: 0.15,
  damage: 0.15,
  functional: 0.20,
}

export function calculateHealth(device) {
  let weightedScore = 0

  for (const field of Object.keys(weights)) {
    const value = scoreValues[field][device[field]]

    weightedScore +=
      (typeof value === 'number' ? value : 50) * weights[field]
  }

  // Battery damage and severe functional problems require
  // additional penalties beyond the weighted average.
  if (device.battery === 'Damaged') {
    weightedScore = Math.min(weightedScore, 35)
  }

  if (device.functional === 'Not Working') {
    weightedScore = Math.min(weightedScore, 25)
  }

  if (device.damage === 'Severe') {
    weightedScore = Math.min(weightedScore, 40)
  }

  const score = Math.round(weightedScore)

  let category

  if (score >= 80) {
    category = 'Good'
  } else if (score >= 60) {
    category = 'Fair'
  } else if (score >= 35) {
    category = 'Needs Repair'
  } else {
    category = 'Poor'
  }

  return { score, category }
}

export function getRecommendation(device, score) {
  const safetyWarning = device.battery === 'Damaged'

  let action
  let explanation

  if (
    device.functional === 'Not Working' &&
    (device.damage === 'Severe' || device.battery === 'Damaged')
  ) {
    action = 'Recycle'
    explanation =
      'The device has serious functional or physical problems. Seek a qualified assessment to determine whether safe repair or authorized e-waste recycling is appropriate.'
  } else if (
    device.functional === 'Not Working' ||
    device.battery === 'Damaged' ||
    device.damage === 'Severe' ||
    device.screen === 'Not Working'
  ) {
    action = 'Repair/Refurbish'
    explanation =
      'The device has a significant fault. Have it assessed by a qualified technician before deciding whether refurbishment is viable.'
  } else if (
    score < 60 ||
    device.functional === 'Partially Working' ||
    device.damage === 'Moderate'
  ) {
    action = 'Repair/Refurbish'
    explanation =
      'Repair or refurbishment may extend the device’s useful life. Compare a professional repair estimate with its potential value.'
  } else if (score >= 85 && device.functional === 'Fully Working') {
    action = 'Sell'
    explanation =
      'The device appears to be in good condition and fully functional, making resale a reasonable option if its market value justifies it.'
  } else if (score >= 70 && device.functional === 'Fully Working') {
    action = 'Donate'
    explanation =
      'The device may still be useful to someone else. Consider donation after securely erasing your personal data.'
  } else {
    action = 'Repair/Refurbish'
    explanation =
      'A professional inspection can help determine whether repair, refurbishment or recycling is the best next step.'
  }

  if (safetyWarning) {
    explanation =
      'SAFETY FIRST: Do not charge, puncture, or attempt DIY repair on a potentially damaged battery. Seek qualified service or authorized e-waste handling.'
  }

  return {
    action,
    explanation,
    safetyWarning,
  }
}

export function getAssessmentFactors(device) {
  const factors = [
    {
      name: 'Battery condition',
      status: device.battery,
      impact:
        device.battery === 'Damaged'
          ? 'Critical'
          : device.battery === 'Weak'
            ? 'Needs attention'
            : 'Acceptable',
    },
    {
      name: 'Screen condition',
      status: device.screen,
      impact:
        ['Cracked', 'Not Working'].includes(device.screen)
          ? 'Needs attention'
          : 'Acceptable',
    },
    {
      name: 'Performance',
      status: device.performance,
      impact:
        ['Slow', 'Not Working'].includes(device.performance)
          ? 'Needs attention'
          : 'Acceptable',
    },
    {
      name: 'Physical damage',
      status: device.damage,
      impact:
        ['Moderate', 'Severe'].includes(device.damage)
          ? 'Needs attention'
          : 'Acceptable',
    },
    {
      name: 'Functional status',
      status: device.functional,
      impact:
        device.functional === 'Fully Working'
          ? 'Acceptable'
          : 'Needs attention',
    },
  ]

  return factors
}
