import { registerCommand } from 'koishi'

const answers = [{
  text: '四季酱一口吃掉了%name%',
  probability: 0.1,
}, {
  text: '四季酱拒绝投食，并从你身上撕咬下了一大块肉。%user%死得不能再死了，12 小时之内无法与四季酱交互了！',
  probability: 0.1,
}, {
  text: '四季酱端起%name%闻了闻，%name%独特的香味让人食欲大增，从中间切开来，饱满的汁水流了出来。四季酱看了你一眼，把一整盘%name%扫到了自己碗里，抱着碗跑到了角落里慢慢品了起来。。。',
  probability: 0.1,
}, {
  text: '四季酱瞄了一眼%user%，上前闻了闻，走开了。。。',
  probability: 0.1,
}, {
  text: '四季酱看到%name%就双眼冒光，不知道从哪里摸出一副刀叉，吃了起来。\n过了一会儿，咦%user%去哪了？大概是被一块吃了吧。',
  probability: 0.1,
}, {
  text: '%name%消失了。去哪了呢？在四季酱的肚子里！',
  probability: 0.1,
}, {
  text: '四季酱慢慢吃完了%name%，很满意的舔了你一下',
  probability: 0.1,
}, {
  text: '四季酱想吃%name%很久了，这次终于摆到了四季酱面前，但她并没有直接冲上去开吃，他掏出了筷子精细的调整了摆盘，把6台Red架设在自己面前，开始了吃播。',
  probability: 0.1,
}, {
  text: '四季酱把%name%去掉头，再去掉尾，一口咬下去，说：鸡肉味，嘎嘣脆！',
  probability: 0.1,
}, {
  text: '四季酱把自己抹到%name%上，并就着吃了起来',
  probability: 0.1,
}, {
  text: '这种%user%在幻想乡地区很有名气。建议与%name%一起食用。',
  probability: 0.1,
}, {
  text: '在这个时代，每一个人都经历了太多的苦痛和喜悦，幻想乡的人们总会将苦涩藏在心里，而把幸福变成食物，呈现在四季的餐桌之上。今天这一道%name%，集齐了大自然的馈赠，蕴含了%user%的智慧，表达了对四季酱浓浓的爱意。然而四季酱不想吃！并掏出了40米长的大刀',
  probability: 0.1,
}]

registerCommand('eat', ({ args, user }) => {
  const name = args.join(' ')
  if (name.match(/\[cq:at,qq=\d+\]/ig)) {
    return '仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德仁义道德'
  } else if (name.length > 50) {
    return '这什么鬼东西啊，名字那么长，总感觉有毒，要不你先吃一个?我6个小时后来看看你是否还活着。。。'
  } else {
    var total = 0
    answers.forEach((e) => {
      total += (e.probability || 1)
    })
    const target = Math.random() * Math.max(1, total)
    let pointer = 0
    for (const answer of answers) {
      pointer += (answer.probability || 1)
      if (target < pointer) {
        return (typeof answer === 'string' ? answer : answer.text).replace(/\%user\%/g, user.name).replace(/\%name\%/g, name)
      }
    }
  }
})
