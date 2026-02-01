export interface TerminalTheme {
  id: string
  name: string
  type: 'dark' | 'light'
  colors: {
    background: string
    foreground: string
    selection: string
    cursor: string
    titleBar: string
    black: string
    red: string
    green: string
    yellow: string
    blue: string
    magenta: string
    cyan: string
    white: string
    brightBlack: string
    brightRed: string
    brightGreen: string
    brightYellow: string
    brightBlue: string
    brightMagenta: string
    brightCyan: string
    brightWhite: string
  }
  shikiTheme: string
}
