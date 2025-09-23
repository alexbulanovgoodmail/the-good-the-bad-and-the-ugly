import reloadSoundUrl from '@/assets/sounds/reload.mp3'
import shotSoundUrl from '@/assets/sounds/shot-01.mp3'
import emptySoundUrl from '@/assets/sounds/shot-03.mp3'

import { defineStore } from 'pinia'

const INITIAL_ROUND = 1
const INITIAL_SESSION = 1
const INITIAL_CLIP = 6
const INITIAL_BANK = 100
const RELOAD_TIME = 500
const MAX_ROUNDS = 5
const MAX_SESSIONS = 5
const KILL_REWARD = 100

interface State {
  _round: number
  _session: number
  _maxRounds: number
  _maxSessions: number
  _clip: number
  _bank: number
  _reloading: boolean
  _reloadInterval: number | null
}

const shotAudio = new Audio(shotSoundUrl)
const emptyAudio = new Audio(emptySoundUrl)
const reloadAudio = new Audio(reloadSoundUrl)

export const storeGame = defineStore('game', {
  state: (): State => ({
    _round: INITIAL_ROUND,
    _session: INITIAL_SESSION,
    _maxRounds: MAX_ROUNDS,
    _maxSessions: MAX_SESSIONS,
    _reloadInterval: null,
    _reloading: false,
    _clip: INITIAL_CLIP,
    _bank: INITIAL_BANK,
  }),

  getters: {
    round: state => state._round,
    session: state => state._session,
    maxRounds: state => state._maxRounds,
    maxSessions: state => state._maxSessions,
    clip: state => state._clip,
    bank: state => state._bank,
    reloading: state => state._reloading,
  },

  actions: {
    shot() {
      if (this._reloading) return

      if (this._clip > 0) {
        this._clip -= 1

        shotAudio.currentTime = 0
        shotAudio.play().catch(() => {})
      } else {
        emptyAudio.currentTime = 0
        emptyAudio.play().catch(() => {})
      }
    },
    stopReload() {
      if (this._reloadInterval !== null) {
        clearInterval(this._reloadInterval)
        this._reloadInterval = null
      }
      this._reloading = false
    },
    startReload() {
      this._reloading = true

      this._reloadInterval = setInterval(() => {
        if (this._clip < INITIAL_CLIP) {
          this._clip++

          reloadAudio.currentTime = 0
          reloadAudio.play().catch(() => {})
        }

        if (this._clip >= INITIAL_CLIP) {
          this.stopReload()
        }
      }, RELOAD_TIME)
    },
    reload() {
      if (this._reloading) return
      this.startReload()
    },
    increaseRound() {
      this._session = 1
      this._round++
    },
    increaseSession() {
      this._session++
    },
    reset() {
      this._bank = INITIAL_BANK
      this._clip = INITIAL_CLIP
      this._round = INITIAL_ROUND
      this._session = INITIAL_SESSION
      this._reloadInterval = null
      this._reloading = false
    },
    rebootClip() {
      this._clip = INITIAL_CLIP
    },
    rewardForKill(reward = KILL_REWARD) {
      this._bank += reward
    },
  },
})
