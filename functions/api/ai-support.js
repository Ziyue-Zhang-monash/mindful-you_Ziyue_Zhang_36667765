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

// Generate general wellbeing suggestions from a self-assessment result.
export async function onRequestPost(context) {
  if (!context.env.DEEPSEEK_API_KEY) {
    return jsonResponse({ error: 'The AI service is not configured.' }, 500)
  }

  const body = await context.request.json()
  const result = String(body.result || '').trim()

  if (!result || result.length > 300) {
    return jsonResponse({ error: 'A valid assessment result is required.' }, 400)
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
      temperature: 0.5,
      max_tokens: 450,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Provide brief general wellbeing guidance. Do not diagnose conditions or recommend medication. Return JSON with summary, suggestions containing exactly three practical items, and nextStep. If the result indicates urgent danger, tell the user to contact emergency services or a crisis hotline.'
        },
        {
          role: 'user',
          content: `Self-assessment result: ${result}`
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

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders
  })
}
