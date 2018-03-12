import moment from 'moment'

export function getEndDateString(integer) {
  return moment.unix(integer).format('YYYY-MM-DD_HH-mm-ss')
}
export function dateHasPassed(unixTimestamp) {
  const date = moment().utc()
  return date.unix() >= unixTimestamp
}

// adapted from: https://github.com/AugurProject/augur/tree/seadragon/src/utils
export function convertUnixTimeLeft(integer) {
  return timeLeft(moment.unix(integer).toDate())
}
export function timeLeft(d) {
  const date = d instanceof Date ? d : new Date(0)

  const rightNow = moment()
    .utc()
    .unix()
  const dd = date.getTime() / 1000
  const diff = dd - rightNow

  // UTC Time Formatting
  // const utcTime = [date.getUTCHours(), date.getUTCMinutes()]
  // const utcAMPM = ampm(utcTime[0])
  // const utcTimeTwelve = getTwelveHour(utcTime)

  // Local Time Formatting
  const localTime = [date.getHours(), date.getMinutes()]
  const localAMPM = ampm(localTime[0])
  const localTimeTwelve = getTwelveHour(localTime)
  // const localOffset = date.getTimezoneOffset() / 60 * -1

  return {
    // "February 17, 2018 1:42 PM (UTC -7)"
    formattedLocal: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ':'
    )} ${localAMPM}`,
    // 1518900156
    timestamp: date.getTime() / 1000,
    timeleft: diff,
    date,
  }
}

function ampm(time) {
  return time < 12 ? 'AM' : 'PM'
}

function getTwelveHour(time) {
  time[0] = time[0] < 12 ? time[0] : time[0] - 12
  time[0] = time[0] || 12
  if (time[1] < 10) time[1] = '0' + time[1]

  return time
}

// periodString: 'week', 'month', 'all'
export function getBeginDate(periodString) {
  const date = moment()
  let beginDate = date.subtract(1, 'day')
  if (periodString === 'week') {
    beginDate = date.subtract(7, 'day')
  }
  if (periodString === 'month') {
    beginDate = date.subtract(1, 'month')
  }
  if (periodString === 'all') {
    return null
  }
  return beginDate.unix()
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
