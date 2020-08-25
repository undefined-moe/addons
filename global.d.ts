declare module 'koishi' {
  interface User {
    name: string
    id: number
  }

  interface Argv {
    user: User
    options: Record<string, any>
    args: string[]
    send(...args: any[]): Promise<void>
    exec(message: string): Promise<void>
  }

  export function registerCommand(name: string, callback: (argv: Argv) => void | string | Promise<void | string>): void
}
