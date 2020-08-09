# 四季酱扩展仓库

这里是四季酱扩展仓库。你向这里提交的代码**将直接被四季酱执行**并作为其功能的一部分。允许扩展的功能包括：

- 指令
- 全局方法

## 提交流程

### 编写代码

将你想要的功能用 TypeScript 写成一个模块文件。在这个文件中，你可以访问：

- ES2019 的语法特性 + Buffer
- 下面的 [API](#api) 文档中所定义的方法

下面是一个简单的例子：

```ts
import { command } from 'shiki'

command('foo', ({ session }) => {
  // 懒得编了，看着办吧
})

export function hello() {
  return send('hello world!')
}
```

### 编写 manifest.yml

用一个文件来描述这个库的功能。它的基本格式如下：

```yml
version: 1
export: true
groups:
  - 123456789
commands:
  - name: foo
    desc: 一个我也不知道有啥用的指令
    authority: 2
    options:
      - name: bar
        desc: -b <arg> 一个我也不知道有啥用的选项
```

### 拉取请求

创建一个新的拉取请求，等待审核程序和管理人员的审核。你的项目结构应该大致如下：

```
root
└ my-addon
  ├ index.ts
  └ manifest.yml
```

## API

### command

### middleware

## 配置项

### version

manifest 的版本号，当前为 1。

### export

此模块的导出方式，支持 `true`, `false` 和 `default`。这将决定在 eval 指令中通过 `require('my-addon')` 是否能够访问到这里的导出。如果是 `true`，则上述表达式返回此模块；如果是 `false`，则上述表达式将报错；如果是 `default`，则上述表达式返回此模块的默认导出。

### commands

扩展的指令列表。
