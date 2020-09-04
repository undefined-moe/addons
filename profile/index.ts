import { registerCommand } from 'koishi/addons'
import { items } from 'shiki'

const DEFAULT_BASE = 0.98
const ALLOWANCE_LIMIT = 10

function getProb(prob: number, lucky: number, base = DEFAULT_BASE) {
  return 1 / (1 + (1 / prob - 1) * base ** -lucky)
}

function getWeightedProb<T extends string>(weights: Readonly<Record<T, number>>, lucky: number, scale = 1) {
  const entries = Object.entries<number>(weights)
  const total = entries.reduce((prev, [_, curr]) => prev + curr, 0)
  let pointer = 0, lastProb = 0
  return entries.map(([key, value]) => {
    pointer += value
    const prob = getProb(pointer / total, lucky)
    const offset = prob - lastProb
    lastProb = prob
    return [key, offset * scale]
  }) as [T, number][]
}

function getAverageValue(names: string[]) {
  let total = 0
  for (const name of names) {
    total += items[name].value
  }
  return total / names.length
}

const vHeavy = getAverageValue(['婴儿石像', '御柱', '要石', '洩矢铁轮'])
const vEngine = getAverageValue(['手电筒', '电脑', '御柱', '河童之臂', '光学迷彩服', '翻盖相机'])

const probNR = { N: 0.5, R: 0.3 }
const probSE = { SR: 0.15, SSR: 0.049, EX: 0.001 }
const probNS = { NR: 0.8, SE: 0.2 }
const probGeneral = { ...probNR, ...probSE }

const avatar = items['替身地藏'].bid * 0.6

registerCommand('income', ({ user }) => {
  /** 每天期望的抽卡次数 */
  const lotteryCount = Math.floor(user.affinity / 30) + 5
  const output: string[] = []
  let total = 0

  let vGain = 0
  for (const [rarity, prob] of getWeightedProb(probGeneral, user.lucky)) {
    let pointer = 0, totalValue = 0
    for (const { value = 0 } of items[rarity]) {
      pointer += 1
      totalValue += value
    }
    vGain += totalValue / pointer * prob
  }
  output.push(`剧情中获得物品期望收益：${+vGain.toFixed(1)}￥`)

  // 计算抽卡，考虑保底的影响
  const [, [, pSE]] = getWeightedProb(probNS, user.lucky)
  const qSE = pSE / (1 - (1 - pSE) ** ALLOWANCE_LIMIT), qNR = 1 - qSE
  const weights = [
    ...getWeightedProb(probNR, user.lucky, qNR),
    ...getWeightedProb(probSE, user.lucky, qSE),
  ]
  let vlottery = 0
  for (const [rarity, prob] of weights) {
    let pointer = 0, totalValue = 0
    for (const { lottery = 1, value = 0 } of items[rarity]) {
      pointer += lottery
      totalValue += value * lottery
    }
    vlottery += totalValue / pointer * prob
  }
  total += lotteryCount * vlottery
  output.push(`抽卡期望收益：${+vlottery.toFixed(1)}￥`)

  // 钓鱼
  if (user.warehouse['鱼竿']) {
    const { warehouse } = user
    let vFish = 0
    for (const [rarity, prob] of getWeightedProb(probGeneral, user.lucky)) {
      let pointer = 0, totalValue = 0
      for (const { fishing = 0, value = 0 } of items[rarity]) {
        pointer += fishing
        totalValue += value * fishing
      }
      vFish += totalValue / pointer * prob
    }
    const fishing0 = 0.87 * vFish + 0.04 * 0.2 * vEngine + 0.02 * (items['损坏的鱼竿'].value + 0.5 * vFish)
    const fishing1 = fishing0 - 0.01 * 4 * vGain
    const fishing2 = fishing1 - 0.01 * avatar
    const fishing1A = fishing1 + 0.06 * (0.4 * vHeavy - 0.2 * 3 * vGain + 0.3 * items['河鲜煲'].value)
    const fishing1B = fishing1 + 0.06 * 0.2 * vEngine
    const fishing2A = fishing2 + 0.06 * (0.4 * vHeavy - 0.2 * (3 * vGain + avatar) + 0.3 * items['河鲜煲'].value)
    const fishing2B = fishing2 + 0.06 * 0.2 * vEngine
    total += warehouse['鱼竿'] * fishing1B
    output.push(`钓鱼期望收益：A ${+fishing1A.toFixed(1)}￥ / B ${+fishing1B.toFixed(1)}￥（不考虑地藏）`)
    output.push(`钓鱼期望收益：A ${+fishing2A.toFixed(1)}￥ / B ${+fishing2B.toFixed(1)}￥（考虑地藏）`)
  }

  // 隙间剧情
  if (user.warehouse['折叠伞']) {
    const vTicket = 4 * vGain - items['时停怀表'].value
    output.push(`隙间期望收益：${+(vTicket - items['废线列车车票'].value).toFixed(1)}￥`)
  }

  output.unshift(`你的每天期望收入为：${+total.toFixed(1)}￥`)
  output.push('幸运值降低，无法交互不计入负收益')
  return output.join('\n')
})
