// Return support advice selected by the user.
const supportAdvice = {
  urgent: {
    title: 'Get urgent support now',
    message: 'If you are in immediate danger, call emergency services or use the 24/7 hotline.',
    action: 'Call 24/7 Hotline'
  },
  talk: {
    title: 'Talk to someone',
    message: 'Online counselling can help you talk through what you are experiencing.',
    action: 'Start Online Counselling'
  },
  appointment: {
    title: 'Plan your next step',
    message: 'Booking an appointment can help you discuss your needs with a support professional.',
    action: 'Book an Appointment'
  }
}

export function onRequestGet(context) {
  const need = new URL(context.request.url).searchParams.get('need')
  const advice = supportAdvice[need] || {
    title: 'Find the right support',
    message: 'Choose an option above to receive a support suggestion.',
    action: 'Choose a support option'
  }

  return new Response(JSON.stringify(advice), {
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    }
  })
}
