import { registerCommand } from 'koishi/addons'

registerCommand('o', ({ args }) => {
    return args[0].replace(/o/gmi, '[CQ:face,id=107]');
})
