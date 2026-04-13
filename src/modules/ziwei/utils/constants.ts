export const PALACE_NAMES: string[] = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫',
  '财帛宫', '疾厄宫', '迁移宫', '仆役宫',
  '官禄宫', '田宅宫', '福德宫', '父母宫',
]

export const PALACE_DESCRIPTIONS: Record<string, string> = {
  '命宫': '代表个人性格、外貌、才华、一生运势的总体方向',
  '兄弟宫': '代表兄弟姐妹关系、同事朋友关系、合伙运势',
  '夫妻宫': '代表婚姻状况、配偶特征、感情生活',
  '子女宫': '代表子女状况、生育运势、晚辈关系',
  '财帛宫': '代表财运、理财能力、收入来源',
  '疾厄宫': '代表健康状况、灾厄、体质特征',
  '迁移宫': '代表外出运势、旅行、社交、变动',
  '仆役宫': '代表下属、朋友、人际关系',
  '官禄宫': '代表事业、学业、社会地位',
  '田宅宫': '代表房产、家庭环境、固定资产',
  '福德宫': '代表精神生活、兴趣爱好、福分',
  '父母宫': '代表父母关系、长辈缘、相貌遗传',
}

export const MAJOR_STAR_DESCRIPTIONS: Record<string, string> = {
  '紫微': '帝星，主尊贵、权威、领导力',
  '天机': '智慧星，主聪明、谋略、变动',
  '太阳': '光明星，主博爱、光明、贵气',
  '武曲': '财星，主刚毅、决断、财利',
  '天同': '福星，主温和、享福、安逸',
  '廉贞': '囚星，主是非、桃花、官禄',
  '天府': '库星，主稳重、保守、财库',
  '太阴': '阴柔星，主柔顺、田宅、女性',
  '贪狼': '桃花星，主欲望、才艺、交际',
  '巨门': '暗星，主口舌、是非、分析',
  '天相': '印星，主文书、辅佐、衣食',
  '天梁': '荫星，主清高、长辈、化解',
  '七杀': '将星，主刚烈、冲劲、开创',
  '破军': '耗星，主变动、破坏、重建',
}

export const SIHUA_LABELS: Record<string, string> = {
  '禄': '化禄 — 主财缘、机遇、顺遂',
  '权': '化权 — 主权力、掌控、竞争',
  '科': '化科 — 主名声、学业、贵人',
  '忌': '化忌 — 主执念、阻碍、是非',
}

export const STAR_TYPE_LABELS: Record<string, string> = {
  'major': '主星',
  'soft': '吉星',
  'tough': '煞星',
  'adjective': '杂耀',
  'helper': '辅星',
  'flower': '桃花星',
  'lucun': '禄存',
  'tianma': '天马',
}

export const BRIGHTNESS_LABELS: Record<string, string> = {
  '庙': '庙旺 — 星曜力量最强',
  '旺': '旺 — 星曜力量强',
  '得': '得地 — 星曜力量中等偏上',
  '利': '利 — 星曜力量中等',
  '平': '平 — 星曜力量一般',
  '不': '不得地 — 星曜力量弱',
  '陷': '落陷 — 星曜力量最弱',
}

export const MUTAGEN_COLORS: Record<string, string> = {
  '禄': 'bg-wood/30 text-wood border-wood/40',
  '权': 'bg-fire/30 text-fire border-fire/40',
  '科': 'bg-water/30 text-water border-water/40',
  '忌': 'bg-earth/30 text-earth border-earth/40',
}

export const MUTAGEN_BORDER: Record<string, string> = {
  '禄': 'border-wood/40',
  '权': 'border-fire/40',
  '科': 'border-water/40',
  '忌': 'border-earth/40',
}
