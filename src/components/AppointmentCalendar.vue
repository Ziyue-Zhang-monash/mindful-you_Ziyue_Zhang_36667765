<script setup>
import { computed, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

// Load all appointments so different local accounts can use the same browser.
const savedAppointments = localStorage.getItem('mindfulYouAppointments')
const appointments = ref(savedAppointments ? JSON.parse(savedAppointments) : [])
const bookingMessage = ref('')

// Only show appointments that belong to the signed-in user.
const userAppointments = computed(() =>
  appointments.value.filter((appointment) => appointment.userEmail === props.currentUser.email)
)

const calendarEvents = computed(() =>
  userAppointments.value.map((appointment) => ({
    id: appointment.id,
    title: 'My Appointment',
    start: appointment.start,
    end: appointment.end
  }))
)

const saveAppointments = () => {
  localStorage.setItem('mindfulYouAppointments', JSON.stringify(appointments.value))
}

// Reject past times, selections longer than one hour and overlapping personal bookings.
const canBookTime = (start, end) => {
  const oneHour = 60 * 60 * 1000

  if (start < new Date() || end - start !== oneHour) {
    return false
  }

  return !userAppointments.value.some((appointment) => {
    const existingStart = new Date(appointment.start)
    const existingEnd = new Date(appointment.end)
    return start < existingEnd && end > existingStart
  })
}

// Save the selected time after the user confirms the booking.
const bookAppointment = (selectionInfo) => {
  bookingMessage.value = ''

  if (!canBookTime(selectionInfo.start, selectionInfo.end)) {
    bookingMessage.value = 'Choose one future hour that does not overlap your existing appointments.'
    selectionInfo.view.calendar.unselect()
    return
  }

  if (!window.confirm(`Book an appointment for ${selectionInfo.start.toLocaleString()}?`)) {
    selectionInfo.view.calendar.unselect()
    return
  }

  appointments.value.push({
    id: String(Date.now()),
    userEmail: props.currentUser.email,
    start: selectionInfo.start.toISOString(),
    end: selectionInfo.end.toISOString()
  })
  saveAppointments()
  bookingMessage.value = 'Appointment booked successfully.'
  selectionInfo.view.calendar.unselect()
}

// Users can cancel only an appointment displayed on their own calendar.
const cancelAppointment = (clickInfo) => {
  if (!window.confirm('Cancel this appointment?')) {
    return
  }

  appointments.value = appointments.value.filter((appointment) => appointment.id !== clickInfo.event.id)
  saveAppointments()
  bookingMessage.value = 'Appointment cancelled.'
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  events: calendarEvents.value,
  selectable: true,
  selectMirror: true,
  selectOverlap: false,
  selectConstraint: 'businessHours',
  selectAllow: (selectionInfo) => canBookTime(selectionInfo.start, selectionInfo.end),
  select: bookAppointment,
  eventClick: cancelAppointment,
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00'
  },
  slotMinTime: '09:00:00',
  slotMaxTime: '17:00:00',
  slotDuration: '01:00:00',
  snapDuration: '01:00:00',
  allDaySlot: false,
  height: 'auto',
  nowIndicator: true
}))
</script>

<template>
  <div class="calendar-container">
    <FullCalendar :options="calendarOptions" />
    <p class="calendar-help">Select one hour to book. Click your appointment to cancel it.</p>
    <p v-if="bookingMessage" class="calendar-message" role="status" aria-live="polite">
      {{ bookingMessage }}
    </p>
  </div>
</template>
