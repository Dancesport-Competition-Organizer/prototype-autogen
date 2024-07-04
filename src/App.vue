<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSignupStore from '@/stores/useSignupStore'

const {
  available,
  registerForEvent,
  signupCouples,
  unregisterForEvent,
} = useSignupStore()
const {
  signedUp,
  registeredForEvent,
  numberOfRounds,
} = storeToRefs(useSignupStore())
</script>

<template>
  <main>
    <fieldset>
      <legend>Simulations</legend>
      <button @click="signupCouples(1)">
        Sign Up Couples (1)
      </button>
      <button @click="signupCouples(10)">
        Sign Up Couples (10)
      </button>
      <button @click="signupCouples(100)">
        Sign Up Couples (100)
      </button>
    </fieldset>
    <div style="display: flex">
      <fieldset style="width:50%">
        <legend>Available Pool of Numbers</legend>
        <details>
          <summary>Show/Hide</summary>
          <button v-for="couple in available" :key="couple" disabled>
            {{ couple }}
          </button>
        </details>
      </fieldset>
      <fieldset style="width:50%">
        <legend>Registered for the Competition</legend>
        <p>(Click a number to "register" them for the event)</p>
        <button
          v-for="couple in Array.from(signedUp)"
          :key="couple"
          :disabled="registeredForEvent.has(couple)"
          @click="registerForEvent(couple)"
        >
          {{ couple }}
        </button>
      </fieldset>
    </div>
    <div style="display: flex">
      <fieldset style="width: 50%">
        <legend>Signed Up for an Event</legend>
        <button
          v-for="couple in Array.from(registeredForEvent)"
          :key="couple"
          @click="unregisterForEvent(couple)"
        >
          {{ couple }}
        </button>
      </fieldset>
      <fieldset style="width: 50%">
        <legend>Starting Round For this Current Event:</legend>
        <p>{{ numberOfRounds }}</p>
      </fieldset>
    </div>
  </main>
</template>
