const fs = require('fs')

const raw = JSON.parse(fs.readFileSync('zidian_data.json', 'utf8'))
const rows = raw.tafeng_data

const strokeMap = {}

for (const row of rows) {
  const zi = row.zi
  const bihua = row.bihua
  if (zi && bihua) {
    strokeMap[zi] = Math.round(Number(bihua))
  }
}

const output = `export const ZIDIAN_STROKES: Record<string, number> = {
${Object.entries(strokeMap)
  .sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
  .map(([k, v]) => `  '${k}': ${v},`)
  .join('\n')}
}
`

fs.writeFileSync('src/modules/name/data/zidianStrokes.ts', output, 'utf8')
console.log(`Generated zidianStrokes.ts with ${Object.keys(strokeMap).length} entries`)
