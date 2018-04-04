import { differenceInSeconds, format } from 'date-fns'
import _ from 'lodash/fp'
import moment from 'moment'

// https://github.com/aragon/aragon-ui/blob/master/src/utils/date.js
const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

export const difference = (date1, date2) => {
  const totalInSeconds = differenceInSeconds(date1, date2)
  let seconds = totalInSeconds
  const days = Math.floor(seconds / DAY_IN_SECONDS)
  seconds = seconds % DAY_IN_SECONDS
  const hours = Math.floor(seconds / HOUR_IN_SECONDS)
  seconds = seconds % HOUR_IN_SECONDS
  const minutes = Math.floor(seconds / MINUTE_IN_SECONDS)
  seconds = seconds % MINUTE_IN_SECONDS
  return { days, hours, minutes, seconds, totalInSeconds }
}
export const formatHtmlDatetime = date => format(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
export function getEndDateString(integer) {
  return moment.unix(integer).format('MM/DD/YY__HH:mm:ss')
}
export function dateHasPassed(unixTimestamp) {
  const date = moment().utc() // moment.utc("2018-03-13T01:24:07.827+00:00")
  // 1520904108 >= unixTimestamp
  return date.unix() >= unixTimestamp
}
export function timestampToExpiry(integer) {
  if (!_.isNumber(integer)) {
    return new Error('need integer!')
  }
  return buildTimeObject(integer)
}
// adapted from: https://github.com/AugurProject/augur/tree/seadragon/src/utils
export function buildTimeObject(integer) {
  const date = moment.unix(integer).toDate()
  const timestamp = date.getTime() / 1000

  // prettier-ignore
  const now = moment().utc().unix()

  const timeleft = timestamp - now
  const timesince = now - timestamp

  const localTime = [date.getHours(), date.getMinutes()]
  const localAMPM = ampm(localTime[0])
  const localTimeTwelve = getTwelveHour(localTime)

  return {
    date,
    timeleft,
    timesince,
    timestamp,
    expired: dateHasPassed(timestamp),
    formattedLocal: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(':')} ${localAMPM}`,
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
