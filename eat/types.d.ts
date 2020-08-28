import { User } from 'koishi/addons'

export type Answer = {
  text: string | textGenerator | string[]
  probability: number
}

export type SpecialItem = {
  name: string
  alias?: string[]
  answers: Answer[]
}

export type textGenerator = (user: User, item: string) => string | string[]
