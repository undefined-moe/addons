import { registerCommand } from 'koishi/addons'
import { items, probs } from 'shiki'

const DEFAULT_BASE = 0.98

function getProb(prob: number, lucky: number, base = DEFAULT_BASE) {
  return 1 / (1 + (1 / prob - 1) * base ** -lucky)
}

function getWeightedProb<T extends string>(weights: Readonly<Record<T, number>>, lucky: number) {
  const entries = Object.entries<number>(weights)
  const total = entries.reduce((prev, [_, curr]) => prev + curr, 0)
  let pointer = 0, lastProb = 0
  return entries.map(([key, value]) => {
    pointer += value
    const prob = getProb(pointer / total, lucky)
    const offset = prob - lastProb
    lastProb = prob
    return [key, offset]
  }) as [T, number][]
}

registerCommand('income', ({ user }) => {
  const weights = getWeightedProb(probs, user.lucky)
  const lotteryCount = Math.floor(user.affinity / 30) + 5
  let total = 0
  for (const [rarity, prob] of weights) {
    let pointer = 0, totalValue = 0
    for (const { lottery = 1, value = 0 } of items[rarity]) {
      pointer += lottery
      totalValue += value * lottery
    }
    total += totalValue / pointer * prob
  }
  return [
    `你的每天期望收入为：${(total * lotteryCount).toFixed(1)}￥`,
  ].join('\n')
})
