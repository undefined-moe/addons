interface Stat {
  species?: number
  iv?: number
  base?: number
  level?: number
  fix?: number
}

interface DamageOptions {
  stab?: number
  rel?: number
  fix?: number
}

export function getHp ({ species = 100, iv = 31, base = 252, level = 50 }: Stat) {
  return Math.floor((species * 2 + iv + base / 4) * level / 100 + 10 + level)
}

export function getStat ({ species = 100, iv = 31, base = 252, level = 50, fix = 1 }: Stat) {
  return Math.floor(((species * 2 + iv + base / 4) * level / 100 + 5) * fix)
}

export function calcDamage (power: number, attacker: { atk: Stat, level?: number }, defender: { hp: Stat, dfs: Stat, level?: number }, { stab, rel, fix }: DamageOptions = {}) {
  attacker.level = attacker.level || 50
  defender.level = defender.level || 50

  stab = stab || 1
  rel = rel || 1
  fix = fix || 1

  const atk = this.getStat(Object.assign({}, attacker.atk, { level: attacker.level }))
  const dfs = this.getStat(Object.assign({}, defender.dfs, { level: defender.level }))
  const hp = this.getHp(Object.assign({}, defender.hp, { level: defender.level }))

  const baseDamage = ((2 * attacker.level + 10) / 250 * atk / dfs * power + 2) * stab * rel * fix
  const infDamage = Math.max(Math.floor(baseDamage * 0.85), 1)
  const supDamage = Math.max(Math.floor(baseDamage), 1)
  const infRatio = infDamage / hp
  const supRatio = supDamage / hp
  const killPossib = supRatio < 1 ? 0 : infRatio >= 1 ? 1 : (supRatio - 1) / (supRatio - infRatio)

  return `伤害区间：${infDamage} ~ ${supDamage}  ( / ${hp})\n伤害比例：${(infRatio * 100).toFixed(2)}% ~ ${(supRatio * 100).toFixed(2)}%\n击杀概率：${(killPossib * 100).toFixed(2)}%`
}
