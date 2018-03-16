import _ from 'lodash'
import moment from 'moment'

export function getEndDateString(integer) {
  return moment.unix(integer).format('YYYY-MM-DD_HH-mm-ss')
}
export function dateHasPassed(unixTimestamp) {
  const date = moment().utc() // moment.utc("2018-03-13T01:24:07.827+00:00")
  // 1520904108 >= unixTimestamp
  return date.unix() >= unixTimestamp
}

// adapted from: https://github.com/AugurProject/augur/tree/seadragon/src/utils
export function convertUnixTimeLeft(integer) {
  if (!_.isNumber(integer)) {
    return new Error('need integer!')
  }
  return timeLeft(moment.unix(integer).toDate())
}
function timeLeft(d) {
  const date = d instanceof Date ? d : new Date(0)
  const timestamp = date.getTime() / 1000

  const timeleft =
    timestamp -
    moment()
      .utc()
      .unix()
  const timesince = moment().utc().unix() - timestamp

  const localTime = [date.getHours(), date.getMinutes()]
  const localAMPM = ampm(localTime[0])
  const localTimeTwelve = getTwelveHour(localTime)

  return {
    formattedLocal: `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} ${localTimeTwelve.join(
      ':'
    )} ${localAMPM}`,
    timeleft,
    timesince,
    timestamp,
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
