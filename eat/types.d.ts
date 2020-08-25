import { User } from "koishi"

export type Answer = {
  text: string | textGenerator | string[]
  probability: number
}

export type SpecialItem = {
  name: string,
  answers: Answer[]
}

export type textGenerator = (user: User) => string | string[]