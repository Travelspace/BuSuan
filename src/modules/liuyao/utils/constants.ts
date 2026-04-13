export const TRIGRAM_WUXING: Record<string, string> = {
  '乾': '金', '坤': '土', '震': '木', '巽': '木',
  '坎': '水', '离': '火', '艮': '土', '兑': '金',
}

export const YAO_POSITIONS = [
  { position: 1, label: '初爻' },
  { position: 2, label: '二爻' },
  { position: 3, label: '三爻' },
  { position: 4, label: '四爻' },
  { position: 5, label: '五爻' },
  { position: 6, label: '上爻' },
]

export const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  '吉': { label: '吉', color: 'text-wood' },
  '中吉': { label: '中吉', color: 'text-water' },
  '平': { label: '平', color: 'text-gold' },
  '小凶': { label: '小凶', color: 'text-fire' },
  '凶': { label: '凶', color: 'text-red-500' },
}

export const TI_YONG_RELATIONS: Record<string, string> = {
  '生': '体生用，泄气之象，事情费力难成',
  '克': '体克用，费力可成，需付出努力',
  '比和': '体用比和，顺遂如意，事情易成',
  '被生': '用生体，有助力，事情易成且得人相助',
  '被克': '用克体，受制之象，事情难成需防凶',
}
