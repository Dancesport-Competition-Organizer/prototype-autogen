import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import config from '../config'

const useSignupStore = defineStore('signups', () => {
  const available = ref(generatePool(config.POOL_MIN, config.POOL_MAX))
  const signedUp = ref(new Set<number>())
  const registeredForEvent = ref(new Set<number>())

  const numberOfRounds = computed(() => {
    const size = registeredForEvent.value.size

    if (size <= config.THRESHOLD_FINAL) {
      return 'F'
    }
    else if (size > config.THRESHOLD_FINAL && size <= config.THRESHOLD_SEMIFINAL) {
      return 'SF'
    }
    else if (size > config.THRESHOLD_SEMIFINAL && size <= config.THRESHOLD_QUARTERFINAL) {
      return 'QF'
    }
    else {
      return 'R1'
    }
  })

  function signupCouple(coupleNumber: number) {
    available.value.delete(coupleNumber)
    signedUp.value.add(coupleNumber)
    const sorted = Array.from(signedUp.value).sort()
    signedUp.value = new Set(sorted)
  }

  function signupCouples(n: number = 1) {
    const length = Math.min(n, available.value.size)
    for (let i = 0; i < length; i++) {
      const availableArray = Array.from(available.value)
      const randomIndex = Math.floor(Math.random() * availableArray.length)
      const selected = availableArray[randomIndex]
      signupCouple(selected)
    }
  }

  function registerForEvent(coupleNumber: number) {
    if (signedUp.value.has(coupleNumber)) {
      registeredForEvent.value.add(coupleNumber)
      const sorted = Array.from(registeredForEvent.value).sort()
      registeredForEvent.value = new Set(sorted)
    }
  }

  function unregisterForEvent(coupleNumber: number) {
    if (registeredForEvent.value.has(coupleNumber)) {
      registeredForEvent.value.delete(coupleNumber)
      const sorted = Array.from(registeredForEvent.value).sort()
      registeredForEvent.value = new Set(sorted)
    }
  }

  return {
    available,
    registeredForEvent,
    signedUp,
    numberOfRounds,
    registerForEvent,
    signupCouples,
    unregisterForEvent,
  }
})

export default useSignupStore

function generatePool(min: number, max: number) {
  const pool = new Set<number>()
  for (let i = min; i <= max; i++) {
    pool.add(i)
  }
  return pool
}
