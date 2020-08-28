import { registerCommand, User } from 'koishi/addons'
import { Random } from 'koishi/utils'
import answers from './NormalAnswer'
import specialAnswers from './SpecialAnswer'
import { Answer } from './types'

registerCommand('eat', ({ args, user, send }) => {
  const item = args.join(' ')
  if (!item) {
    return send('四季酱啥都能吃！请问你要给我吃什么？')
  } else if (item.match(/\[cq:at,qq=\d+\]/ig)) {
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
    const answer = getAnswer(sa ? sa.answers : answers, item, user)
    if (Array.isArray(answer)) {
      return answer.forEach((e) => {
        send(e)
      })
    } else {
      send(answer)
    }
  }
})

function getAnswer(answers: Answer[], item: string, user: User) {
  var total = 0
  answers.forEach((e) => {
    total += (e.probability || 1)
  })
  const target = Random.real(Math.max(1, total))
  let pointer = 0
  for (const answer of answers) {
    pointer += (answer.probability || 1)
    if (target < pointer) {
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
