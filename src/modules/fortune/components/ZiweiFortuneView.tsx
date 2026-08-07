import React, { useState } from 'react'
import { Card, Modal } from '../../../components/common'
import { LEVEL_COLORS } from '../utils/constants'
import { PALACE_DESCRIPTIONS, MAJOR_STAR_DESCRIPTIONS, MUTAGEN_COLORS } from '../../ziwei/utils/constants'
import { ZIWEI_FORTUNE, PALACE_DOMAIN_LABELS } from '../../../locales/zh-CN'
import type { PalaceFortune, ZiweiFortuneResult } from '../utils/ziweiCalculation'

interface PalaceFortuneCardProps {
  palace: PalaceFortune
}

const PalaceFortuneCard: React.FC<PalaceFortuneCardProps> = ({ palace }) => {
  const [showDetail, setShowDetail] = useState(false)
  const colors = LEVEL_COLORS[palace.level]
  const domain = PALACE_DOMAIN_LABELS[palace.name]

  return (
    <>
      <div
        className={`rounded-lg border p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${colors.border} ${colors.bg}`}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{domain?.icon}</span>
            <div>
              <div className="text-text-primary font-medium text-sm">{palace.name}</div>
              <div className="text-text-muted text-xs">{domain?.domain}</div>
            </div>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
            {palace.level}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {palace.majorStars.map((star, i) => (
            <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
              {star}
              {palace.sihua
                .filter(sh => sh.startsWith(star))
                .map((sh, j) => {
                  const mutagen = sh.split('·')[1]
                  return <span key={j} className="ml-0.5 opacity-70">·{mutagen}</span>
                })}
            </span>
          ))}
          {palace.majorStars.length === 0 && (
            <span className="text-xs text-text-muted">{ZIWEI_FORTUNE.noMajorStar}</span>
          )}
        </div>

        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${palace.score}%`,
              backgroundColor: palace.score >= 65 ? '#27ae60' : palace.score >= 45 ? '#d4af37' : '#e74c3c',
            }}
          />
        </div>
        <div className="text-right text-[10px] text-text-muted mt-1">{palace.score}分</div>
      </div>

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={`${domain?.icon || ''} ${palace.name} · ${domain?.domain || ''}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`text-lg px-3 py-1 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
              {palace.level}
            </span>
            <span className="text-text-secondary text-sm">{ZIWEI_FORTUNE.scoreLabel}：{palace.score}/100</span>
            <span className="text-text-muted text-xs">{palace.heavenlyStem}{palace.earthlyBranch}</span>
            {palace.isBodyPalace && (
              <span className="px-2 py-0.5 rounded bg-fire/20 text-fire text-xs">{ZIWEI_FORTUNE.bodyPalaceLabel}</span>
            )}
          </div>

          <div className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
            <p className="text-text-muted text-xs">{PALACE_DESCRIPTIONS[palace.name] || ''}</p>
          </div>

          {palace.majorStars.length > 0 && (
            <div>
              <h4 className="text-gold text-sm font-medium mb-2">主星</h4>
              <div className="space-y-2">
                {palace.majorStars.map((star, i) => (
                  <div key={i} className="p-2 bg-bg-secondary/30 rounded border border-gold/10">
                    <div className="flex items-center gap-2">
                      <span className="text-gold font-serif">{star}</span>
                      {palace.sihua
                        .filter(sh => sh.startsWith(star))
                        .map((sh, j) => {
                          const mutagen = sh.split('·')[1]
                          const colorClass = MUTAGEN_COLORS[mutagen] || ''
                          return (
                            <span key={j} className={`text-xs px-1.5 py-0.5 rounded border ${colorClass}`}>
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
              <h4 className="text-text-secondary text-sm font-medium mb-2">{ZIWEI_FORTUNE.minorStarsTitle}</h4>
              <div className="flex flex-wrap gap-1.5">
                {palace.minorStars.map((star, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded bg-white/5 text-text-secondary border border-white/10"
                  >
                    {star}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
            <p className="text-text-primary text-sm">{palace.analysis}</p>
          </div>

          <div className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
            <p className="text-gold text-sm">{ZIWEI_FORTUNE.advicePrefix} {palace.advice}</p>
          </div>

          {palace.decadal && palace.decadal.range[0] > 0 && (
            <div className="text-xs text-text-muted">
              {ZIWEI_FORTUNE.decadalPrefix}：{palace.decadal.heavenlyStem}{palace.decadal.earthlyBranch}（{palace.decadal.range[0]}-{palace.decadal.range[1]}{ZIWEI_FORTUNE.ageSuffix}）
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

interface ZiweiFortuneViewProps {
  result: ZiweiFortuneResult
}

const ZiweiFortuneView: React.FC<ZiweiFortuneViewProps> = ({ result }) => {
  const { palaces, sihua, currentDecadal, overallScore, overallLevel, soulStar, bodyStar, fiveElementsClass, currentAge } = result
  const overallColors = LEVEL_COLORS[overallLevel]

  const sortedPalaces = [...palaces].sort((a, b) => b.score - a.score)
  const bestPalace = sortedPalaces[0]
  const worstPalace = sortedPalaces[sortedPalaces.length - 1]

  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-text-muted">{ZIWEI_FORTUNE.soulStarLabel}</span>
              <div className="text-gold font-serif text-lg">{soulStar}</div>
            </div>
            <div>
              <span className="text-text-muted">身主</span>
              <div className="text-gold font-serif text-lg">{bodyStar}</div>
            </div>
            <div>
              <span className="text-text-muted">{ZIWEI_FORTUNE.fiveElementsClassLabel}</span>
              <div className="text-gold font-serif text-lg">{fiveElementsClass}</div>
            </div>
            <div>
              <span className="text-text-muted">{ZIWEI_FORTUNE.currentAgeLabel}</span>
              <div className="text-text-primary text-lg">{currentAge}{ZIWEI_FORTUNE.ageSuffix}</div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-text-muted text-xs">{ZIWEI_FORTUNE.overallScoreLabel}</span>
            <div className={`text-2xl font-serif ${overallColors.text}`}>{overallScore}</div>
            <span className={`text-xs px-2 py-0.5 rounded ${overallColors.bg} ${overallColors.text} border ${overallColors.border}`}>
              {overallLevel}
            </span>
          </div>
        </div>
      </Card>

      {currentDecadal && (
        <Card hover={false}>
          <h3 className="text-xl font-serif text-gold mb-3">{ZIWEI_FORTUNE.currentDecadalTitle}</h3>
          <div className="flex items-center gap-4">
            <div className="text-gold font-serif text-lg">{currentDecadal.ganZhi}</div>
            <div className="text-text-secondary text-sm">
              {currentDecadal.range[0]}-{currentDecadal.range[1]}{ZIWEI_FORTUNE.ageSuffix} · {currentDecadal.palaceName}
            </div>
            <div className="flex gap-1.5">
              {currentDecadal.majorStars.map((star, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-gold/10 text-gold border border-gold/20">
                  {star}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card hover={false}>
        <h3 className="text-xl font-serif text-gold mb-4">{ZIWEI_FORTUNE.sihuaTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { key: '禄', data: sihua.lu, label: ZIWEI_FORTUNE.sihuaLu.label, desc: ZIWEI_FORTUNE.sihuaLu.desc },
            { key: '权', data: sihua.quan, label: ZIWEI_FORTUNE.sihuaQuan.label, desc: ZIWEI_FORTUNE.sihuaQuan.desc },
            { key: '科', data: sihua.ke, label: ZIWEI_FORTUNE.sihuaKe.label, desc: ZIWEI_FORTUNE.sihuaKe.desc },
            { key: '忌', data: sihua.ji, label: ZIWEI_FORTUNE.sihuaJi.label, desc: ZIWEI_FORTUNE.sihuaJi.desc },
          ] as const).map(({ key, data, label, desc }) => {
            const colorClass = MUTAGEN_COLORS[key] || ''
            return (
              <div key={key} className={`p-3 rounded-lg border ${colorClass} text-center`}>
                <div className="text-lg font-serif font-bold mb-1">{label}</div>
                <div className="text-sm font-medium">{data.star || '—'}</div>
                <div className="text-xs opacity-70 mt-1">{data.palaceName || '—'}</div>
                <div className="text-[10px] opacity-50 mt-0.5">{desc}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card hover={false}>
        <h3 className="text-xl font-serif text-gold mb-6">{ZIWEI_FORTUNE.palacesTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {palaces.map((palace) => (
            <PalaceFortuneCard key={palace.name} palace={palace} />
          ))}
        </div>
      </Card>

      <Card hover={false}>
        <h3 className="text-xl font-serif text-gold mb-4">{ZIWEI_FORTUNE.rankingTitle}</h3>
        <div className="space-y-2">
          {sortedPalaces.map((palace, i) => {
            const domain = PALACE_DOMAIN_LABELS[palace.name]
            const colors = LEVEL_COLORS[palace.level]
            return (
              <div key={palace.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary/30 transition-colors">
                <span className={`w-6 text-center text-sm font-medium ${i === 0 ? 'text-wood' : i === sortedPalaces.length - 1 ? 'text-fire' : 'text-text-muted'}`}>
                  {i + 1}
                </span>
                <span className="text-lg w-6 text-center">{domain?.icon}</span>
                <span className="text-text-primary text-sm w-16">{palace.name}</span>
                <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${palace.score}%`,
                      backgroundColor: palace.score >= 65 ? '#27ae60' : palace.score >= 45 ? '#d4af37' : '#e74c3c',
                    }}
                  />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border} w-10 text-center`}>
                  {palace.level}
                </span>
                <span className="text-text-muted text-xs w-8 text-right">{palace.score}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card hover={false} className="border-wood/20">
          <h4 className="text-wood text-sm font-medium mb-2">✨ 最强宫位</h4>
          {bestPalace && (
            <div>
              <div className="text-text-primary font-medium">{bestPalace.name} · {PALACE_DOMAIN_LABELS[bestPalace.name]?.domain}</div>
              <div className="text-text-secondary text-xs mt-1">
                {bestPalace.majorStars.join('、') || '无主星'} · {bestPalace.score}分
              </div>
              <p className="text-text-muted text-xs mt-2">{bestPalace.analysis}</p>
            </div>
          )}
        </Card>
        <Card hover={false} className="border-fire/20">
          <h4 className="text-fire text-sm font-medium mb-2">{ZIWEI_FORTUNE.worstPalaceTitle}</h4>
          {worstPalace && (
            <div>
              <div className="text-text-primary font-medium">{worstPalace.name} · {PALACE_DOMAIN_LABELS[worstPalace.name]?.domain}</div>
              <div className="text-text-secondary text-xs mt-1">
                {worstPalace.majorStars.join('、') || ZIWEI_FORTUNE.noMajorStar} · {worstPalace.score}分
              </div>
              <p className="text-text-muted text-xs mt-2">{worstPalace.advice}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ZiweiFortuneView
