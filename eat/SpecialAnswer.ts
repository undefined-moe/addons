import { SpecialItem } from './types'
const sa: SpecialItem[] = [
  {
    name: "仁义道德",
    answers: [
      {
        text: "别吃书了，快写文",
        probability: 0.9
      },
      {
        text: "别吃书了，快吃人",
        probability: 0.9
      }
    ]
  },
  {
    name: "毛玉",
    answers: [
      {
        text: ["你想吃掉毛玉，但是毛玉却想吃掉你。那炸成一团直扎手的毛玉狠狠地咬了你一大口，消失在了旁边的灌木丛中。", "过了一会，那只毛玉又悄悄溜回来了，果然还是舍不得你呢。"],
        probability: 0.9
      },
      {
        text: "你想吃掉毛玉，但是毛玉却想吃掉你。那炸成一团直扎手的毛玉狠狠地咬了你一大口，真的消失在了旁边的灌木丛中。",
        probability: 0.9
      }
    ]
  },
  {
    name: "尾翼稳定脱壳穿甲弹",
    answers: [
      {
        text: "四季酱轻轻接住了钢针，并开心地塞进嘴里大嚼特嚼！",
        probability: 0.3
      },
      {
        text: "四季酱轻轻接住了钢针，并反手丢了回去",
        probability: 0.7
      }
    ]
  },
  {
    name: "四季酱",
    answers: [
      {
        text: "正当你来到四季酱背后准备尝试捉住四季酱的时候，四季酱光速转身在你脸上划下两道爪印",
        probability: 1
      }
    ]
  },
  {
    name: "人",
    answers: [
      {
        text() {
          return "仁义道德".repeat(Math.floor(Math.random() * 5 + 1))
        },
        probability: 0.5
      },
      {
        text() {
          return "生吃了人，我很饱歉"
        },
        probability: 0.5
      }
    ]
  }
]

export default sa;