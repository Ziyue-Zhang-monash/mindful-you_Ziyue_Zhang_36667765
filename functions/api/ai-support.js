const responseHeaders = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type'
}

// Allow the browser to send a request from the website.
export function onRequestOptions() {
  return new Response(null, { headers: responseHeaders })
}

const assessmentTopics = {
  mood: {
    label: 'Low mood or worry',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  sleep: {
    label: 'Difficult sleep',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  energy: {
    label: 'Low energy',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  connection: {
    label: 'Feeling disconnected',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  support: {
    label: 'Comfort asking for support',
    options: ['Comfortable', 'Not sure', 'Uncomfortable']
  }
}

const planThemes = [
  'calming and emotional balance',
  'sleep and daily routine',
  'gentle activity and energy',
  'social connection',
  'preparing to ask for support'
]

// Generate general wellbeing suggestions from the complete assessment.
export async function onRequestPost(context) {
  if (!context.env.DEEPSEEK_API_KEY) {
    return jsonResponse({ error: 'The AI service is not configured.' }, 500)
  }

  const body = await context.request.json()
  const result = String(body.result || '').trim()
  const answers = formatAnswers(body.answers)
  const theme = String(body.theme || '').trim()

  if (!result || result.length > 300 || !answers || !planThemes.includes(theme)) {
    return jsonResponse({ error: 'A complete assessment is required.' }, 400)
  }

  const apiResponse = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${context.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      thinking: { type: 'disabled' },
      temperature: 0.9,
      max_tokens: 450,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Provide brief general wellbeing guidance. Do not diagnose conditions or recommend medication. Return JSON with summary, suggestions containing exactly three practical items, and nextStep. Use the complete assessment answers to personalise the plan. Give a fresh plan that clearly uses the requested focus and does not reuse generic wording. If the result indicates urgent danger, tell the user to contact emergency services or a crisis hotline.'
        },
        {
          role: 'user',
          content: `Self-assessment result: ${result}\nAssessment answers:\n${answers}\nRequested focus for this plan: ${theme}`
        }
      ]
    })
  })

  if (!apiResponse.ok) {
    return jsonResponse({ error: 'The AI service could not create a support plan.' }, 502)
  }

  const apiData = await apiResponse.json()
  const plan = JSON.parse(apiData.choices[0].message.content)

  return jsonResponse(plan, 200)
}

// Check each answer against the choices used by the assessment form.
function formatAnswers(rawAnswers) {
  if (!rawAnswers || typeof rawAnswers !== 'object') {
    return null
  }

  const answerLines = []

  for (const [id, topic] of Object.entries(assessmentTopics)) {
    const answer = String(rawAnswers[id] || '').trim()

    if (!topic.options.includes(answer)) {
      return null
    }

    answerLines.push(`${topic.label}: ${answer}`)
  }

  return answerLines.join('\n')
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders
  })
}
