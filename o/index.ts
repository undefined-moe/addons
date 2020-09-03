import { registerCommand } from 'koishi/addons'

registerCommand('o', ({ args }) => {
    return args.join(' ').replace(/o/gmi, '[CQ:face,id=107]');
})
