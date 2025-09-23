export enum GameOverStatus {
  WIN = 'win',
  LOSE = 'lose',
  DEAD = 'dead',
}

export interface Person {
  name: string
  image: string
  type: 'bandit' | 'civilian'
}

export type Slot = {
  person: Person
  alive: boolean
  highlighted?: boolean
} | null
