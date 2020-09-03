import { registerCommand } from 'koishi/addons'

registerCommand('o', ({ args, send }) => {
    send(args.join(' '));
    return args.join(' ').replace(/o/gmi, '[CQ:face,id=107]');
})
