export interface Language {
  id: string
  name: string
  aliases?: string[]
}

export const languages: Language[] = [
  { id: 'auto', name: 'Auto (Detect)' },
  { id: 'astro', name: 'Astro' },
  { id: 'bash', name: 'Bash', aliases: ['sh', 'shell'] },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++', aliases: ['c++'] },
  { id: 'csharp', name: 'C#', aliases: ['c#', 'cs'] },
  { id: 'clojure', name: 'Clojure', aliases: ['clj'] },
  { id: 'console', name: 'Console' },
  { id: 'crystal', name: 'Crystal' },
  { id: 'css', name: 'CSS' },
  { id: 'cypher', name: 'Cypher' },
  { id: 'dart', name: 'Dart' },
  { id: 'diff', name: 'Diff' },
  { id: 'dockerfile', name: 'Dockerfile', aliases: ['docker'] },
  { id: 'elixir', name: 'Elixir' },
  { id: 'elm', name: 'Elm' },
  { id: 'erb', name: 'ERB' },
  { id: 'erlang', name: 'Erlang' },
  { id: 'gleam', name: 'Gleam' },
  { id: 'go', name: 'Go', aliases: ['golang'] },
  { id: 'graphql', name: 'GraphQL', aliases: ['gql'] },
  { id: 'haskell', name: 'Haskell', aliases: ['hs'] },
  { id: 'hcl', name: 'HCL', aliases: ['terraform', 'tf'] },
  { id: 'html', name: 'HTML' },
  { id: 'ini', name: 'INI' },
  { id: 'java', name: 'Java' },
  { id: 'javascript', name: 'JavaScript', aliases: ['js'] },
  { id: 'json', name: 'JSON' },
  { id: 'jsx', name: 'JSX' },
  { id: 'julia', name: 'Julia' },
  { id: 'kotlin', name: 'Kotlin', aliases: ['kt'] },
  { id: 'latex', name: 'LaTeX', aliases: ['tex'] },
  { id: 'lisp', name: 'Lisp' },
  { id: 'lua', name: 'Lua' },
  { id: 'makefile', name: 'Makefile', aliases: ['make'] },
  { id: 'markdown', name: 'Markdown', aliases: ['md'] },
  { id: 'matlab', name: 'MATLAB' },
  { id: 'move', name: 'Move' },
  { id: 'nginx', name: 'Nginx' },
  { id: 'objective-c', name: 'Objective-C', aliases: ['objc', 'objectivec'] },
  { id: 'ocaml', name: 'OCaml' },
  { id: 'perl', name: 'Perl' },
  { id: 'php', name: 'PHP' },
  { id: 'plaintext', name: 'Plain Text', aliases: ['text', 'txt'] },
  { id: 'powershell', name: 'PowerShell', aliases: ['ps1'] },
  { id: 'prisma', name: 'Prisma' },
  { id: 'python', name: 'Python', aliases: ['py'] },
  { id: 'r', name: 'R' },
  { id: 'ruby', name: 'Ruby', aliases: ['rb'] },
  { id: 'rust', name: 'Rust', aliases: ['rs'] },
  { id: 'scala', name: 'Scala' },
  { id: 'scss', name: 'SCSS' },
  { id: 'solidity', name: 'Solidity', aliases: ['sol'] },
  { id: 'sql', name: 'SQL' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'swift', name: 'Swift' },
  { id: 'toml', name: 'TOML' },
  { id: 'tsx', name: 'TSX' },
  { id: 'typescript', name: 'TypeScript', aliases: ['ts'] },
  { id: 'v', name: 'V' },
  { id: 'vue', name: 'Vue' },
  { id: 'xml', name: 'XML' },
  { id: 'yaml', name: 'YAML', aliases: ['yml'] },
  { id: 'zig', name: 'Zig' },
]

export const languageMap = new Map(
  languages.flatMap((lang) => [
    [lang.id, lang],
    ...(lang.aliases?.map((alias) => [alias, lang] as const) ?? []),
  ])
)

export function getLanguage(idOrAlias: string): Language | undefined {
  return languageMap.get(idOrAlias.toLowerCase())
}

export function getLanguageId(idOrAlias: string): string {
  return getLanguage(idOrAlias)?.id ?? 'plaintext'
}

const languagePatterns: { pattern: RegExp; lang: string }[] = [
  { pattern: /^#!.*\b(python|python3)\b/, lang: 'python' },
  { pattern: /^#!.*\b(node|nodejs)\b/, lang: 'javascript' },
  { pattern: /^#!.*\b(bash|sh|zsh)\b/, lang: 'bash' },
  { pattern: /^#!.*\bruby\b/, lang: 'ruby' },
  { pattern: /^#!.*\bperl\b/, lang: 'perl' },
  { pattern: /\bimport\s+.*\s+from\s+['"]|export\s+(default\s+)?(function|class|const|interface|type)\b/, lang: 'typescript' },
  { pattern: /\bconst\s+\w+\s*:\s*\w+|interface\s+\w+\s*\{|type\s+\w+\s*=/, lang: 'typescript' },
  { pattern: /<[A-Z][a-zA-Z]*[\s/>]|className=|onClick=/, lang: 'tsx' },
  { pattern: /\bdef\s+\w+\s*\(.*\)\s*:|import\s+\w+|from\s+\w+\s+import|if\s+__name__\s*==/, lang: 'python' },
  { pattern: /\bfn\s+\w+|let\s+mut\s+|impl\s+\w+|use\s+\w+::|pub\s+(fn|struct|enum)/, lang: 'rust' },
  { pattern: /\bpackage\s+\w+|func\s+\w+\s*\(|import\s+\(|:=/, lang: 'go' },
  { pattern: /\bpublic\s+(class|interface|enum)\s+\w+|private\s+\w+\s+\w+\s*\(|System\.out\.print/, lang: 'java' },
  { pattern: /#include\s*<.*>|int\s+main\s*\(|printf\s*\(|std::/, lang: 'cpp' },
  { pattern: /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s+/i, lang: 'sql' },
  { pattern: /<!DOCTYPE\s+html>|<html|<head|<body|<div|<span/i, lang: 'html' },
  { pattern: /\{[\s\S]*?[\w-]+\s*:\s*[^;]+;[\s\S]*?\}|@media\s|@import\s/, lang: 'css' },
  { pattern: /\$[\w-]+\s*:|@mixin\s+|@include\s+|&\s*\{/, lang: 'scss' },
  { pattern: /^\s*\{[\s\S]*"[\w-]+":\s*[\[{"0-9ntf]/, lang: 'json' },
  { pattern: /^[\w-]+:\s*([\w-]+|\[|\{|\||\>)|^---\s*$/, lang: 'yaml' },
  { pattern: /^#{1,6}\s+|^\*\*.*\*\*|^\[.*\]\(.*\)|^```/, lang: 'markdown' },
  { pattern: /^\s*(if|then|else|fi|for|while|do|done|case|esac)\b|^\s*\$\s|\becho\s+/, lang: 'bash' },
  { pattern: /^(FROM|RUN|CMD|COPY|ADD|ENV|EXPOSE|WORKDIR)\s+/m, lang: 'dockerfile' },
  { pattern: /\bdef\s+\w+|end\b|\bclass\s+\w+\s*<?\s*\w*|require\s+['"]/, lang: 'ruby' },
  { pattern: /<\?php|\$\w+\s*=|function\s+\w+\s*\(.*\)\s*\{/, lang: 'php' },
  { pattern: /\bfunc\s+\w+|var\s+\w+\s*:|let\s+\w+\s*:|import\s+\w+|class\s+\w+\s*:/, lang: 'swift' },
  { pattern: /\bfun\s+\w+|val\s+\w+|var\s+\w+|data\s+class|object\s+\w+/, lang: 'kotlin' },
]

export function detectLanguage(code: string): string {
  const trimmedCode = code.trim()

  if (!trimmedCode) {
    return 'plaintext'
  }

  for (const { pattern, lang } of languagePatterns) {
    if (pattern.test(trimmedCode)) {
      return lang
    }
  }

  return 'plaintext'
}
