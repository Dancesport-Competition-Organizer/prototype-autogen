import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import useSignupStore from '@/stores/useSignupStore'

function checkRunningTotals(
  available: number,
  signedUp: number,
  registeredForEvent: number,
) {
  const store = useSignupStore()
  expect(store.available.size).toBe(available)
  expect(store.signedUp.size).toBe(signedUp)
  expect(store.registeredForEvent.size).toBe(registeredForEvent)
}

function signupAndRegister(numCouples: number) {
  const store = useSignupStore()
  store.signupCouples(numCouples)
  for (const coupleNumber of store.signedUp) {
    store.registerForEvent(coupleNumber)
  }
}

describe('useSignupStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('store defaults', () => {
    checkRunningTotals(900, 0, 0)
  })

  const testCasesGenSignup = [
    { input: 1, want: [899, 1, 0] },
    { input: 10, want: [890, 10, 0] },
    { input: 100, want: [800, 100, 0] },
  ]

  for (let i = 0; i < testCasesGenSignup.length; i++) {
    const tc = testCasesGenSignup[i]
    it(`generate n couples (${tc.input})`, () => {
      const store = useSignupStore()
      store.signupCouples(tc.input)
      checkRunningTotals(tc.want[0], tc.want[1], tc.want[2])
    })
  }

  it(`register n couples (1) (not signed up)`, () => {
    const store = useSignupStore()
    store.registerForEvent(1)
    checkRunningTotals(900, 0, 0)
  })

  it(`unregister n couples (1) (not signed up)`, () => {
    const store = useSignupStore()
    store.unregisterForEvent(1)
    checkRunningTotals(900, 0, 0)
  })

  it(`register n couples (1) (signed up)`, () => {
    const store = useSignupStore()
    store.signupCouples(1)
    const coupleNumber = Array.from(store.signedUp)[0]
    store.registerForEvent(coupleNumber)
    checkRunningTotals(899, 1, 1)
  })

  it(`unregister n couples (1) (signed up)`, () => {
    const store = useSignupStore()
    store.signupCouples(1)
    const coupleNumber = Array.from(store.signedUp)[0]
    store.registerForEvent(coupleNumber)
    store.unregisterForEvent(coupleNumber)
    checkRunningTotals(899, 1, 0)
  })

  it(`default rounds display`, () => {
    const store = useSignupStore()
    expect(store.numberOfRounds).toBe('F')
  })

  const testCasesRegisteringForEvent = [
    { input: 0, want: 'F' },
    { input: 8, want: 'F' },
    { input: 9, want: 'SF' },
    { input: 14, want: 'SF' },
    { input: 15, want: 'QF' },
    { input: 28, want: 'QF' },
    { input: 29, want: 'R1' },
    { input: 99, want: 'R1' },
  ]
  for (let i = 0; i < testCasesRegisteringForEvent.length; i++) {
    const tc = testCasesRegisteringForEvent[i]
    it(`number of rounds (${tc.input} people registered)`, () => {
      signupAndRegister(tc.input)
      const store = useSignupStore()
      expect(store.numberOfRounds).toBe(tc.want)
    })
  }

  it('multiple batches of signup', () => {
    const store = useSignupStore()

    for (let i = 0; i < 9; i++) {
      store.signupCouples(100)
    }

    checkRunningTotals(0, 900, 0)
  })

  it(`doesn't exceed n couples to sign up (n+1)`, () => {
    const store = useSignupStore()

    for (let i = 0; i < 9; i++) {
      store.signupCouples(100)
    }

    store.signupCouples(1)

    checkRunningTotals(0, 900, 0)
  })

  it(`doesn't exceed n couples to sign up (n+10)`, () => {
    const store = useSignupStore()

    for (let i = 0; i < 9; i++) {
      store.signupCouples(100)
    }

    store.signupCouples(10)

    checkRunningTotals(0, 900, 0)
  })

  it(`doesn't exceed n couples to sign up (n+100)`, () => {
    const store = useSignupStore()

    for (let i = 0; i < 9; i++) {
      store.signupCouples(100)
    }

    store.signupCouples(100)

    checkRunningTotals(0, 900, 0)
  })
})
