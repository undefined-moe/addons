import { User } from 'koishi/addons'

export type Answer = {
  text: string | textGenerator | string[]
  probability: number
  eat: boolean
}

export type SpecialItem = {
  name: string
  alias?: string[]
  answers: Answer[],
  foodLevel?: number
}

export type FoodLevel = {
  level: number,
  last: number,
  lock: boolean
}

export type textGenerator = (user: User, item: string) => string | string[]
