import { registerCommand, User } from 'koishi/addons'
import { Random } from 'koishi/utils'
import answers from './NormalAnswer'
import specialAnswers from './SpecialAnswer'
import { Answer, FoodLevel } from './types'
import { fa } from './FullAnswer'


const foodLevel: { [key: number]: FoodLevel } = {}

const 中文 = '一二三四五六七八九十'.split('')

registerCommand('eat', ({ args, user, send, group }) => {
  const item = args.join(' ')
  if (!item) {
    return send('四季酱啥都能吃！请问你要给我吃什么？')
  }

  if (typeof foodLevel[group.id || '0'] !== 'object') {
    foodLevel[group.id || '0'] = {
      level: 0,
      last: Date.now(),
      lock: false,
    }
  }

  let CurrentFoodLevel: FoodLevel = foodLevel[group.id || '0']
  calcFoodLevel(CurrentFoodLevel)
  if (CurrentFoodLevel.lock) {
    const answer = getAnswer(fa, item, user, CurrentFoodLevel)
    if (Array.isArray(answer)) {
      return answer.forEach((e) => {
        send(e)
      })
    } else {
      return send(answer)
    }
  }

  if (item.match(/\[cq:at,qq=\d+\]/ig)) {
    return send('仁义道德'.repeat(Math.floor(Math.random() * 15 + 1)))
  } else if (item.length > 50) {
    return send('这什么鬼东西啊，名字那么长，总感觉有毒，要不你先吃一个？我6个小时后来看看你是否还活着。。。')
  } else {
    const sa = specialAnswers.find((e) => {
      if (e.name === item) {
        return true
      } else if (e.alias) {
        return e.alias.indexOf(item) !== -1
      }
    })
    const answer = getAnswer(sa ? sa.answers : answers, item, user, CurrentFoodLevel)
    if (Array.isArray(answer)) {
      return answer.forEach((e) => {
        send(e)
      })
    } else {
      send(answer)
    }
  }
})

registerCommand('foodlevel', ({ send, group }) => {
  if (typeof foodLevel[group.id || '0'] !== 'object') {
    foodLevel[group.id || '0'] = {
      level: 0,
      last: Date.now(),
      lock: false,
    }
  }
  let CurrentFoodLevel: FoodLevel = foodLevel[group.id || '0']
  calcFoodLevel(CurrentFoodLevel)
  if (CurrentFoodLevel.lock) {
    return send('四季酱小肚子鼓鼓的！让她慢慢消化一下吧！')
  } else if (CurrentFoodLevel.level <= 30) {
    return send('四季酱要肚皮都要贴到后背去了！快给四季酱东西吃！')
  } else {
    return send('四季酱现在吃了' + 中文[Math.floor(CurrentFoodLevel.level / 10) - 1] + '分饱，还能再吃点')
  }
  return
})

function getAnswer(answers: Answer[], item: string, user: User, foodLevel: FoodLevel) {
  var total = 0
  answers.forEach((e) => {
    total += (e.probability || 1)
  })
  const target = Random.real(Math.max(1, total))
  let pointer = 0
  for (const answer of answers) {
    pointer += (answer.probability || 1)
    if (target < pointer) {
      if (answer.eat) {
        foodLevel.level = Math.min(Math.random() * 10 + foodLevel.level, 100)
        foodLevel.last = Date.now()
        if (foodLevel.level > 95) {
          foodLevel.lock = true
        }
      }
      switch (typeof answer.text) {
      case 'function':
        return answer.text(user, item)
      case 'string':
        return answer.text.replace(/\%user\%/g, user.name).replace(/\%name\%/g, item)
      default:
        return answer.text.map((e) => {
          return e.replace(/\%user\%/g, user.name).replace(/\%name\%/g, item)
        })
      }
    }
  }
}

function calcFoodLevel(foodLevel: FoodLevel) {
  var delta = Date.now() - foodLevel.last
  foodLevel.level = Math.max(foodLevel.level - delta / (60 * 1000), 0)
  foodLevel.last = Date.now()
  if (foodLevel.lock && foodLevel.level <= 60) {
    foodLevel.lock = false
  }
}
