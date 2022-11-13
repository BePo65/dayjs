import moment from 'moment'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import dayjs from '../src'
import '../src/locale/ja'
import '../src/locale/th'
import { expectSame } from './_util'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date())
})

afterEach(() => {
  vi.useRealTimers()
})

test('Format no formatStr', () => {
  expectSame((dayjs) => dayjs().format())
})

test.each(['', 'otherString'])(
  'Format invalid date created from "%s"',
  (value) => {
    expect(dayjs(value).format()).toBe('Invalid Date')
  }
)

test.each(['YY', 'YYYY'])('Format year as "%s"', (formatString) => {
  expectSame((dayjs) => dayjs().format(formatString))
})

test.each(['M', 'MM', 'MMM', 'MMMM'])(
  'Format month as "%s"',
  (formatString) => {
    expectSame((dayjs) => dayjs().format(formatString))
  }
)

test.each(['D', 'DD'])(
  'Format Day of Month (1 - 31) as "%s"',
  (formatString) => {
    expectSame((dayjs) => dayjs().format(formatString))
  }
)

test.each(['d', 'dd', 'ddd', 'dddd'])(
  'Format Day of Week (Sun - Sat) as "%s"',
  (formatString) => {
    expectSame((dayjs) => dayjs().format(formatString))
  }
)

test.each(['H', 'HH'])('Format Hour as "%s" (24-hour)', (formatString) => {
  expectSame((dayjs) => dayjs().format(formatString))
})

describe.each([
  { dateString: '2018-05-02T00:00:00.000', outputFormat: 'h', expected: '12' },
  { dateString: '2018-05-02T00:00:00.000', outputFormat: 'hh', expected: '12' },
  { dateString: '2018-05-02T01:00:00.000', outputFormat: 'h', expected: '1' },
  { dateString: '2018-05-02T01:00:00.000', outputFormat: 'hh', expected: '01' },
  { dateString: '2018-05-02T23:00:00.000', outputFormat: 'h', expected: '11' },
  { dateString: '2018-05-02T23:00:00.000', outputFormat: 'hh', expected: '11' },
])(
  'Format "$dateString" as Hour with "$outputFormat" (12-hour)',
  ({ dateString, outputFormat, expected }) => {
    test('Format Hour (12-hour) to "${expected}"', () => {
      expect(dayjs(dateString).format(outputFormat)).toBe(expected)
      expectSame((dayjs) => dayjs(dateString).format(outputFormat))
    })
  }
)

describe.each([
  { dateString: '2018-05-02T01:00:00.000', outputFormat: 'a', expected: 'am' },
  { dateString: '2018-05-02T01:00:00.000', outputFormat: 'A', expected: 'AM' },
  { dateString: '2018-05-02T23:00:00.000', outputFormat: 'a', expected: 'pm' },
  { dateString: '2018-05-02T23:00:00.000', outputFormat: 'A', expected: 'PM' },
])(
  'Format "$dateString" as meridiens with "$outputFormat" (12-hour)',
  ({ dateString, outputFormat, expected }) => {
    test('Format meridiens (am / pm) to "${expected}"', () => {
      expect(dayjs(dateString).format(outputFormat)).toBe(expected)
      expectSame((dayjs) => dayjs(dateString).format(outputFormat))
    })
  }
)

describe.each([
  {
    dateString: '2018-05-02T01:00:00.000',
    outputFormat: 'a',
    localeId: 'ja',
    expected: '午前',
  },
  {
    dateString: '2018-05-02T01:00:00.000',
    outputFormat: 'A',
    localeId: 'ja',
    expected: '午前',
  },
  {
    dateString: '2018-05-02T23:00:00.000',
    outputFormat: 'a',
    localeId: 'ja',
    expected: '午後',
  },
  {
    dateString: '2018-05-02T23:00:00.000',
    outputFormat: 'A',
    localeId: 'ja',
    expected: '午後',
  },
])(
  'Format "$dateString" as meridiens with "$outputFormat" (12-hour) and locale "$localeId"',
  ({ dateString, outputFormat, localeId, expected }) => {
    test('Format meridiens (am / pm) to "${expected}"', () => {
      expect(dayjs(dateString).locale(localeId).format(outputFormat)).toBe(
        expected
      )
      expectSame((dayjs) =>
        dayjs(dateString).locale(localeId).format(outputFormat)
      )
    })
  }
)

test.each(['m', 'mm'])('Format Minute as "%s"', (formatString) => {
  expectSame((dayjs) => dayjs().format(formatString))
})

test.each(['s', 'ss', 'SSS'])('Format Second as "%s"', (formatString) => {
  expectSame((dayjs) => dayjs().format(formatString))
})

test.each(['s', 'ss', 'SSS'])(
  'Format Second as "%s" for specific date',
  (formatString) => {
    const date = '2011-11-05T14:48:01.002Z'
    expectSame((dayjs) => dayjs(date).format(formatString))
  }
)

test.each([
  '2018-05-02T23:00:00.000+08:00',
  '2018-05-02T23:00:00.000-08:00',
  '2018-05-02T23:00:00.000Z',
  '2018-05-02T23:00:00.000+10:00',
  '2018-05-02T23:00:00.000-11:00',
  '2018-05-02T23:00:00.000-05:30',
])('Format Time Zone from "%s"', (dateString) => {
  // should set time with defined offset
  vi.setSystemTime(new Date(dateString))
  expectSame((dayjs) => dayjs().format('Z'))
  expectSame((dayjs) => dayjs().format('ZZZ'))
})

test.each(['dd', 'ddd', 'MMM'])(
  'Format with short locale "th" as "%s"',
  (formatString) => {
    expectSame((dayjs) => dayjs().locale('th').format(formatString))
  }
)

test('Format token value is 0', () => {
  const sundayDate = '2000-01-02'
  const sundayStr = 'd H m s'
  expectSame((dayjs) => dayjs(sundayDate).format(sundayStr))
})

test('Format Complex with other string - : / ', () => {
  const formatString = 'YY-M-D / HH:mm:ss'
  expectSame((dayjs) => dayjs().format(formatString))
})

test.each(['[Z] Z', '[Z] Z [Z]'])(
  'Format Escaping characters',
  (formatString) => {
    expectSame((dayjs) => dayjs().format(formatString))
  }
)

describe('Diff', () => {
  test('empty -> default milliseconds', () => {
    const dateString = '20110101'
    expectSame((dayjs) => dayjs().diff(dayjs(dateString)))
  })

  test('diff -> none dayjs object', () => {
    const dateString = '2013-02-08'
    expectSame((dayjs) => dayjs().diff(dayjs(dateString)))
  })

  const allDiffUnits = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'months',
    'years',
  ] as const
  test.each(allDiffUnits)('diff -> unit "%s"', (unit) => {
    expectSame((dayjs) => dayjs().diff(dayjs().add(1000, 'days'), unit))
    expectSame((dayjs) => dayjs().diff(dayjs().add(1000, 'days'), unit, true))

    expectSame((dayjs) => dayjs().diff(dayjs().subtract(1000, 'days'), unit))
    expectSame((dayjs) =>
      dayjs().diff(dayjs().subtract(1000, 'days'), unit, true)
    )
  })

  const specialDiffUnits = ['months', 'years'] as const
  test.each(specialDiffUnits)(
    'Special diff according to moment.js -> unit "%s"',
    (unit) => {
      expectSame((dayjs) => dayjs('20160115').diff(dayjs('20160215'), unit))
      expectSame((dayjs) =>
        dayjs('20160115').diff(dayjs('20160215'), unit, true)
      )

      expectSame((dayjs) => dayjs('20160115').diff(dayjs('20170115'), unit))
      expectSame((dayjs) =>
        dayjs('20160115').diff(dayjs('20170115'), unit, true)
      )
    }
  )

  test('MonthDiff', () => {
    expect(dayjs('2018-08-08').diff(dayjs('2018-08-08'), 'month')).toEqual(0)
    expect(dayjs('2018-09-08').diff(dayjs('2018-08-08'), 'month')).toEqual(1)
    expect(dayjs('2018-08-08').diff(dayjs('2018-09-08'), 'month')).toEqual(-1)
    expect(dayjs('2018-01-01').diff(dayjs('2018-01-01'), 'month')).toEqual(0)
  })

  test('undefined edge case', () => {
    expect(dayjs().diff(undefined, 'seconds')).toBeDefined()
  })
})

test('Unix Timestamp (milliseconds)', () => {
  expectSame((dayjs) => dayjs().valueOf())
})

test('Unix Timestamp (seconds)', () => {
  expectSame((dayjs) => dayjs().unix())
})

test('Days in Month', () => {
  expectSame((dayjs) => dayjs().daysInMonth())
  expectSame((dayjs) => dayjs('20140201').daysInMonth())
})

test.each(['2013-01-01T00:00:00.000', '2013-01-01T05:00:00.000'])(
  'Utc Offset from "%s"',
  (dateString) => {
    expectSame((dayjs) => dayjs(dateString).utcOffset())
  }
)

test('As Javascript Date -> toDate', () => {
  const base = dayjs()
  const jsDate = base.toDate()

  // expectSame((dayjs) => dayjs().toDate())
  const momentBase = moment()
  expect(jsDate).toEqual(momentBase.toDate())

  expect(jsDate).toEqual(new Date())

  jsDate.setFullYear(1970)
  expect(jsDate.toUTCString()).not.toBe(base.toString())
})

test('As JSON -> toJSON', () => {
  expectSame((dayjs) => dayjs().toJSON())
  expect(dayjs('otherString').toJSON()).toBe(null)
})

describe('toString', () => {
  test('should convert date to long date string', () => {
    const dateAsString = dayjs('2021-02-03T12:13:14.543Z').toString()
    expect(dateAsString).toBe('Wed, 03 Feb 2021 12:13:14 GMT')
  })
})

describe('toISOString', () => {
  test('should convert date to a long date string', () => {
    const dateAsString = dayjs('2021-02-03 12:13:14.543Z').toISOString()
    expect(dateAsString).toBe('2021-02-03T12:13:14.543Z')
  })

  test.each([
    '2021-02-03 12:13:14.543Z',
    '2021-06-21T01:02:03.456+01:00',
    '2021-11-13T15:26:37.890Z',
  ])('should convert "%s" to a string', (dateString) => {
    expectSame((dayjs) => dayjs(dateString).toISOString())
  })
})
