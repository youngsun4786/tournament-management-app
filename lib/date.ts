import { format } from "date-fns"

export const formatDateTime = (date: Date) => {
  return format(date, "yyyy-MM-dd HH:mm")
}

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd")
}

export const convert24to12 = (time: string) => {
  const [hours, minutes] = time.split(":")
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return format(date, "h:mm a")
}

export const dayMap = {
  "Sun": "Sunday",
  "Mon": "Monday",
  "Tue": "Tuesday",
  "Wed": "Wednesday",
  "Thu": "Thursday",
  "Fri": "Friday",
  "Sat": "Saturday",
}

