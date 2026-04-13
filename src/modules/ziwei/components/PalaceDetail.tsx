import React from 'react'
import { Modal } from '../../../components/common'
import { PALACE_DESCRIPTIONS, MAJOR_STAR_DESCRIPTIONS, MUTAGEN_COLORS } from '../utils/constants'
import type { ZiweiPalaceData } from '../utils/calculation'

const PALACE_INTERPRETATIONS: Record<string, { aspects: string[]; keyPoints: string[]; tips: string[] }> = {
  '命宫': {
    aspects: ['性格特质', '外貌气质', '才华能力', '一生总运'],
    keyPoints: ['命宫主星决定核心性格', '命宫干支影响先天禀赋', '身宫同度则后天努力更重要'],
    tips: ['了解自身优势与短板', '顺应天赋选择方向', '注意命宫化忌的负面影响'],
  },
  '兄弟宫': {
    aspects: ['兄弟关系', '同事朋友', '合伙运势', '人际网络'],
    keyPoints: ['主星吉则兄弟和睦', '煞星入则易有争执', '也代表平辈间的竞争与合作'],
    tips: ['善用人脉资源', '合伙需谨慎评估', '注意与同事的相处之道'],
  },
  '夫妻宫': {
    aspects: ['婚姻状况', '配偶特征', '感情生活', '恋爱模式'],
    keyPoints: ['主星决定配偶类型', '化禄则感情顺遂', '化忌则感情波折'],
    tips: ['选择适合的相处模式', '注意沟通与包容', '感情波折期需冷静对待'],
  },
  '子女宫': {
    aspects: ['子女状况', '生育运势', '晚辈关系', '桃花'],
    keyPoints: ['主星吉则子女孝顺', '也反映与晚辈的缘分', '间接影响桃花运势'],
    tips: ['因材施教培养子女', '注意与晚辈的沟通', '善用桃花运势发展人际'],
  },
  '财帛宫': {
    aspects: ['财运状况', '理财能力', '收入来源', '消费习惯'],
    keyPoints: ['化禄则财源广进', '化忌则财来财去', '主星决定赚钱方式'],
    tips: ['根据主星特性选择理财方式', '化忌年需防破财', '注意开源节流'],
  },
  '疾厄宫': {
    aspects: ['健康状况', '体质特征', '灾厄预防', '心理健康'],
    keyPoints: ['主星反映易患疾病类型', '煞星入则需注意意外', '也反映心理状态'],
    tips: ['定期体检关注健康', '注意星曜对应的身体部位', '保持良好心态'],
  },
  '迁移宫': {
    aspects: ['外出运势', '旅行安全', '社交能力', '环境变动'],
    keyPoints: ['化禄则外出有利', '化忌则出行不顺', '也代表在外的人际关系'],
    tips: ['把握外出发展机遇', '化忌年减少远行', '善用社交拓展人脉'],
  },
  '仆役宫': {
    aspects: ['下属关系', '朋友缘分', '人际交往', '服务他人'],
    keyPoints: ['主星吉则得力助手多', '煞星入则易被拖累', '也反映交友质量'],
    tips: ['慎重选择合作伙伴', '注意辨别真假朋友', '善待下属得人心'],
  },
  '官禄宫': {
    aspects: ['事业发展', '学业成就', '社会地位', '职业方向'],
    keyPoints: ['主星决定适合的职业', '化禄则事业顺遂', '化权则掌控力强'],
    tips: ['根据主星选择职业方向', '把握化禄年的事业机遇', '化忌年需防事业波折'],
  },
  '田宅宫': {
    aspects: ['房产运势', '家庭环境', '固定资产', '居住品质'],
    keyPoints: ['化禄则房产运佳', '主星吉则家庭和睦', '也反映祖产继承'],
    tips: ['把握化禄年购置房产', '注意家庭关系维护', '合理规划固定资产'],
  },
  '福德宫': {
    aspects: ['精神生活', '兴趣爱好', '福分深浅', '内心世界'],
    keyPoints: ['主星决定精神追求', '化禄则精神富足', '化忌则内心纠结'],
    tips: ['培养健康的兴趣爱好', '注重精神层面的满足', '化忌年需调节心态'],
  },
  '父母宫': {
    aspects: ['父母关系', '长辈缘分', '相貌遗传', '庇荫之福'],
    keyPoints: ['主星吉则父母安康', '化禄则得长辈庇荫', '化忌则与父母有隔阂'],
    tips: ['珍惜与父母的缘分', '善用长辈资源与指导', '化忌年需多沟通化解'],
  },
}

interface PalaceDetailProps {
  palace: ZiweiPalaceData | null
  isOpen: boolean
  onClose: () => void
}

const PalaceDetail: React.FC<PalaceDetailProps> = ({ palace, isOpen, onClose }) => {
  if (!palace) return null

  const interpretation = PALACE_INTERPRETATIONS[palace.name]
  const desc = PALACE_DESCRIPTIONS[palace.name] || ''

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={palace.name} size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-secondary">宫位干支：</span>
          <span className="text-gold font-serif">{palace.heavenlyStem}{palace.earthlyBranch}</span>
          {palace.isBodyPalace && (
            <span className="px-2 py-0.5 rounded bg-fire/20 text-fire text-xs">身宫</span>
          )}
        </div>

        <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
          <p className="text-text-primary text-sm">{desc}</p>
        </div>

        {interpretation && (
          <>
            <div>
              <h4 className="text-gold text-sm font-medium mb-2">涵盖领域</h4>
              <div className="flex flex-wrap gap-2">
                {interpretation.aspects.map((aspect, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-bg-secondary/50 text-text-secondary border border-white/10">
                    {aspect}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gold text-sm font-medium mb-2">核心要点</h4>
              <ul className="space-y-1">
                {interpretation.keyPoints.map((point, i) => (
                  <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {palace.majorStars.length > 0 && (
          <div>
            <h4 className="text-gold text-sm font-medium mb-2">主星</h4>
            <div className="space-y-2">
              {palace.majorStars.map((star, i) => (
                <div key={i} className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-serif text-lg">{star}</span>
                    {palace.sihua
                      .filter(sh => sh.startsWith(star))
                      .map((sh, j) => {
                        const mutagen = sh.split('·')[1]
                        const colorClass = MUTAGEN_COLORS[mutagen] || ''
                        return (
                          <span key={j} className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
                            化{mutagen}
                          </span>
                        )
                      })}
                  </div>
                  <p className="text-text-muted text-xs mt-1">
                    {MAJOR_STAR_DESCRIPTIONS[star] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {palace.minorStars.length > 0 && (
          <div>
            <h4 className="text-text-secondary text-sm font-medium mb-2">辅星</h4>
            <div className="flex flex-wrap gap-1.5">
              {palace.minorStars.map((star, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded bg-white/5 text-text-secondary border border-white/10"
                >
                  {star}
                  {palace.sihua
                    .filter(sh => sh.startsWith(star))
                    .map((sh, j) => {
                      const mutagen = sh.split('·')[1]
                      return (
                        <span key={j} className="ml-1 text-fire">·{mutagen}</span>
                      )
                    })}
                </span>
              ))}
            </div>
          </div>
        )}

        {palace.decadal && palace.decadal.range[0] > 0 && (
          <div className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
            <h4 className="text-text-secondary text-sm font-medium mb-1">大限</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gold font-serif">{palace.decadal.heavenlyStem}{palace.decadal.earthlyBranch}</span>
              <span className="text-text-muted">
                {palace.decadal.range[0]}-{palace.decadal.range[1]}岁
              </span>
            </div>
          </div>
        )}

        {palace.ages.length > 0 && (
          <div>
            <h4 className="text-text-secondary text-sm font-medium mb-2">小限年龄</h4>
            <div className="flex flex-wrap gap-1">
              {palace.ages.map((age, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-bg-secondary/30 text-text-muted">
                  {age}
                </span>
              ))}
            </div>
          </div>
        )}

        {interpretation && (
          <div className="p-3 bg-wood/5 rounded-lg border border-wood/20">
            <h4 className="text-wood text-sm font-medium mb-2">💡 实用建议</h4>
            <ul className="space-y-1">
              {interpretation.tips.map((tip, i) => (
                <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                  <span className="text-wood mt-1">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default PalaceDetail
