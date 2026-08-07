export const MODULE_NAMES = {
  profile: '信息填写',
  bazi: '八字排盘',
  ziwei: '紫微斗数',
  fortune: '运势分析',
  name: '姓名测试',
  calendar: '择吉日',
  liuyao: '六爻测算',
} as const

export const MODULE_DESCRIPTIONS = {
  profile: '录入个人信息，各功能模块自动读取',
  bazi: '基于出生时间计算八字四柱命盘',
  ziwei: '排布紫微斗数十二宫命盘',
  fortune: '查看流年运势与人生趋势',
  name: '分析姓名五格数理与八字匹配',
  calendar: '查询黄历宜忌与吉日推荐',
  liuyao: '传统六爻占卜与解卦分析',
} as const

export const COMMON = {
  appName: 'BuSuan',
  appSlogan: '传统命理文化研究工具',
  loading: '正在计算...',
  retry: '重试',
  backHome: '返回首页',
  refreshPage: '刷新页面',
  goFill: '前往填写',
  errorTitle: '页面出现了问题',
  errorGeneric: '抱歉，页面渲染时发生了错误',
  errorChunk: '资源加载失败，请刷新页面重试',
} as const

export const FORTUNE = {
  title: '运势分析',
  subtitle: '基于八字与紫微斗数的运势预测',
  tabBazi: '八字运势',
  tabZiwei: '紫微斗数',
  baziDesc: '八字：宏观人生蓝图，描绘大趋势、格局高低、运势起伏',
  ziweiDesc: '紫微斗数：微观高清地图，十二宫位精细分析各领域运势',
  emptyNoBirthInfo: '请先在「信息填写」模块中录入出生信息',
  emptyNoBazi: '请先完成八字排盘以获取运势分析',
  goFill: '前往填写',
  goBazi: '前往排盘',
  loading: '正在计算运势...',
  chartTitle: '运势趋势图',
  bestYear: '最佳年份',
  worstYear: '最低年份',
  keyYearsTitle: '关键年份提醒',
  decadesTitle: '十年流年运势',
  currentYear: '今年',
  scoreLabel: '综合评分',
  keyYearPrefix: '⚡ 关键年份',
  detailTitle: '运势详情',
} as const

export const FORTUNE_DIMENSIONS = {
  career: '事业运',
  wealth: '财运',
  love: '感情运',
  health: '健康运',
} as const

export const FORTUNE_DIMENSION_ICONS = {
  career: '💼',
  wealth: '💰',
  love: '❤️',
  health: '🏥',
} as const

export const FORTUNE_TREND = {
  '上升': { text: '📈 上升趋势', desc: '未来运势逐步走高，把握机遇' },
  '平稳': { text: '➡️ 平稳趋势', desc: '运势起伏不大，稳中求进' },
  '波动': { text: '〰️ 波动趋势', desc: '运势起伏较大，需灵活应对' },
  '下降': { text: '📉 下降趋势', desc: '运势逐步走低，宜守不宜攻' },
} as const

export const FORTUNE_TEN_GOD = {
  '比肩': { score: 60, tags: ['竞争', '合作'], desc: '比肩助力，竞争与合作并存' },
  '劫财': { score: 45, tags: ['破财', '争夺'], desc: '劫财当值，需防破财争夺' },
  '食神': { score: 80, tags: ['才艺', '口福'], desc: '食神生财，才艺得展' },
  '伤官': { score: 50, tags: ['创新', '是非'], desc: '伤官见官，创新与是非并存' },
  '正财': { score: 85, tags: ['稳定', '收入'], desc: '正财入命，收入稳定增长' },
  '偏财': { score: 70, tags: ['横财', '投资'], desc: '偏财降临，投资需谨慎' },
  '正官': { score: 75, tags: ['升迁', '名誉'], desc: '正官护身，事业有望升迁' },
  '七杀': { score: 40, tags: ['压力', '突破'], desc: '七杀压身，压力中求突破' },
  '正印': { score: 80, tags: ['学业', '贵人'], desc: '正印护佑，学业有贵人助' },
  '偏印': { score: 55, tags: ['偏门', '孤独'], desc: '偏印当值，偏门技艺可得' },
  '日主': { score: 65, tags: ['自我', '根基'], desc: '日主当值，自我意识增强' },
} as const

export const FORTUNE_LEVEL_TEXT = {
  '大吉': { career: '事业大顺，贵人相助，宜大展宏图', wealth: '财运亨通，正偏财皆旺，可适度投资', love: '感情甜蜜，单身有望脱单，已婚和谐', health: '身体健康，精力充沛，宜适度运动' },
  '吉': { career: '事业顺遂，稳步上升，可适度进取', wealth: '财运不错，正财为主，量入为出', love: '感情融洽，多沟通增进理解', health: '健康状况良好，注意作息规律' },
  '平': { career: '事业平稳，按部就班，不宜冒进', wealth: '财运平稳，收支平衡，不宜投机', love: '感情平淡，需用心经营', health: '健康一般，注意饮食与休息' },
  '凶': { career: '事业受阻，需防小人，谨慎行事', wealth: '财运欠佳，需防破财，减少开支', love: '感情波折，需防口角误会', health: '健康欠佳，注意体检与调养' },
  '大凶': { career: '事业多艰，宜守不宜攻，韬光养晦', wealth: '财运低迷，切忌投资，守住本金', love: '感情危机，冷静处理，避免冲动', health: '健康需警惕，及时就医检查' },
} as const

export const FORTUNE_KEY_REASON = {
  best: '运势极佳，把握机遇',
  worst: '运势低迷，谨慎行事',
  current: '当前年份',
} as const

export const ZIWEI_FORTUNE = {
  soulStarLabel: '命主',
  bodyStarLabel: '身主',
  fiveElementsClassLabel: '五行局',
  currentAgeLabel: '当前年龄',
  ageSuffix: '岁',
  overallScoreLabel: '综合评分',
  currentDecadalTitle: '当前大限',
  sihuaTitle: '四化飞星',
  palacesTitle: '十二宫位运势',
  rankingTitle: '宫位运势排行',
  bestPalaceTitle: '✨ 最强宫位',
  worstPalaceTitle: '⚠️ 需关注宫位',
  noMajorStar: '无主星',
  majorStarsTitle: '主星',
  minorStarsTitle: '辅星',
  bodyPalaceLabel: '身宫',
  scoreLabel: '评分',
  advicePrefix: '💡',
  decadalPrefix: '大限',
  sihuaLu: { label: '化禄', desc: '财缘·机遇' },
  sihuaQuan: { label: '化权', desc: '权力·掌控' },
  sihuaKe: { label: '化科', desc: '名声·贵人' },
  sihuaJi: { label: '化忌', desc: '阻碍·执念' },
} as const

export const PALACE_DOMAIN_LABELS: Record<string, { domain: string; icon: string }> = {
  '命宫': { domain: '性格命运', icon: '👤' },
  '兄弟宫': { domain: '人际社交', icon: '🤝' },
  '夫妻宫': { domain: '婚姻感情', icon: '❤️' },
  '子女宫': { domain: '子女晚辈', icon: '👶' },
  '财帛宫': { domain: '财运理财', icon: '💰' },
  '疾厄宫': { domain: '健康体质', icon: '🏥' },
  '迁移宫': { domain: '外出变动', icon: '✈️' },
  '仆役宫': { domain: '朋友下属', icon: '👥' },
  '官禄宫': { domain: '事业学业', icon: '💼' },
  '田宅宫': { domain: '房产家庭', icon: '🏠' },
  '福德宫': { domain: '精神福分', icon: '🧘' },
  '父母宫': { domain: '长辈缘份', icon: '👨‍👩‍👧' },
}
