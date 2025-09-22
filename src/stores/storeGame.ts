import reloadSoundUrl from '@/assets/sounds/reload.mp3'
import shotSoundUrl from '@/assets/sounds/shot-01.mp3'
import emptySoundUrl from '@/assets/sounds/shot-03.mp3'

import { defineStore } from 'pinia'

const INITIAL_CLIP = 6
const INITIAL_BANK = 6
const RELOAD_TIME = 500

interface State {
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
    _reloadInterval: null,
    _reloading: false,
    _clip: INITIAL_CLIP,
    _bank: INITIAL_BANK,
  }),

  getters: {
    clip: state => state._clip,
    bank: state => state._bank,
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
  },
})
