import { registerCommand, User } from 'koishi/addons'
import answers from './NormalAnswer'
import specialAnswers from './SpecialAnswer'
import { Answer } from './types'

registerCommand('eat', ({ args, user }) => {
  const item = args.join(' ')
  if (!item) {
    return '请输入要喂食的物品名。'
  } else if (item.match(/\[cq:at,qq=\d+\]/ig)) {
    return '仁义道德'.repeat(Math.floor(Math.random() * 15 + 1))
  } else if (item.length > 50) {
    return '这什么鬼东西啊，名字那么长，总感觉有毒，要不你先吃一个?我6个小时后来看看你是否还活着。。。'
  } else {
    const sa = specialAnswers.find((e) => {
      return e.name === item
    })
    const answer = getAnswer(sa ? sa.answers : answers, item, user)
    if (Array.isArray(answer)) {
      return answer.join('\n')
    } else {
      return answer
    }
  }
})

function getAnswer(answers: Answer[], item: string, user: User) {
  var total = 0
  answers.forEach((e) => {
    total += (e.probability || 1)
  })
  const target = Math.random() * Math.max(1, total)
  let pointer = 0
  for (const answer of answers) {
    pointer += (answer.probability || 1)
    if (target < pointer) {
      switch (typeof answer.text) {
        case 'function':
          return answer.text(user)
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
