const EARTH_HOURS_IN_JTH_DAY = 22.14
const EARTH_HOURS_IN_EARTH_DAY = 24

const JTH_DAYS_IN_YEAR = 295.6651
const EARTH_DAYS_IN_YEAR = 365.2425
const EARTH_DAYS_IN_JTH_YEAR = 272.75106

const AE_YEARS_PER_CY_YEAR = 295 / 295.665

const systems: {
  name: string
  currentYear: number
  yearLengthInJTHDays?: number
}[] = [
  {
    name: 'BP',
    currentYear: 0,
    yearLengthInJTHDays: JTH_DAYS_IN_YEAR,
  },
  {
    name: 'CY',
    currentYear: 4627,
    yearLengthInJTHDays: 295.665,
  },
  {
    name: 'AE',
    currentYear: 839,
    yearLengthInJTHDays: 295,
  },
  {
    name: 'GA',
    currentYear: 5160,
    yearLengthInJTHDays: 295,
  },
]

const getSystem = (year: string) => {
  return systems.find(({ name }) => year.endsWith(name.toUpperCase()))
}

const getValue = (year: string) => {
  const content = year.match(/^-?\d+/)?.[0]
  if (!content) {
    return undefined
  } else {
    return Number(content)
  }
}

const parse = (year: string) => ({
  system: getSystem(year),
  value: getValue(year),
})

const y = (year: number, startSystemName: string, endSystemName: string) => {
  const startSystem = systems.find(({ name }) => name === startSystemName)
  const endSystem = systems.find(({ name }) => name === endSystemName)

  if (!startSystem || !endSystem) return undefined

  const yearsAgo = startSystem.currentYear - year
  const jthDaysAgo =
    yearsAgo * (startSystem.yearLengthInJTHDays || JTH_DAYS_IN_YEAR)

  const yearsAgoInEndSystem =
    jthDaysAgo / (endSystem.yearLengthInJTHDays || JTH_DAYS_IN_YEAR)

  if (endSystemName === 'BP') {
    return Math.abs(Math.round(yearsAgoInEndSystem))
  }
  return Math.round(endSystem.currentYear - yearsAgoInEndSystem)
}

export const convertYear = (year: string) => {
  let { system, value } = parse(year)
  if (year === 'now') {
    system = systems[0]
    value = 0
  }
  if (system === undefined) return undefined
  if (value === undefined) return undefined

  if (system.name === 'BP') {
    value = -value
  }

  return systems.map((sys) => ({
    value: y(value!, system!.name, sys.name)!,
    system: sys,
  }))
}

export const jthYearsToEarthYears = (n: number) =>
  n / (EARTH_DAYS_IN_YEAR / EARTH_DAYS_IN_JTH_YEAR)

export const earthYearsToJthYears = (n: number) =>
  n * (EARTH_DAYS_IN_YEAR / EARTH_DAYS_IN_JTH_YEAR)
