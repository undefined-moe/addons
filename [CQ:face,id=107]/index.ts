import { registerCommand } from 'koishi/addons'

registerCommand('[CQ:face,id=107]', ({ args }) => {
    return args[0].replace(/o/gmi, '[CQ:face,id=107]');
})
