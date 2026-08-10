/**
 * 汉字五行分层查询
 * 优先级从高到低：
 *   1. 特殊强规则 SPECIAL_WUXING（品字结构等明确强五行字）
 *   2. 本地字典 WUXING_DICT（用户提供，6773+ 字）
 *   3. 部首/补充推断（RADICAL_WUXING 部首表 + kangxiStrokes 的 CHAR_WUXING 补充字典）
 *   4. 笔画尾数兜底（getStrokeCount 尾数 1/2→木、3/4→火、5/6→土、7/8→金、9/0→水）
 * 各层失败返回 null；笔画也查不到时返回 null。
 */
import cnchar from 'cnchar'
import type { WuXing } from '../../../types'
import { WUXING_DICT } from '../data/wuxingDict'
import { CHAR_WUXING } from '../data/kangxiStrokes'
import { getStrokeCount } from './strokeLookup'
import { NUM_WUXING } from './constants'

/** 特殊强规则：品字结构及明确强五行字 */
const SPECIAL_WUXING: Record<string, WuXing> = {
  '鑫': '金', '淼': '水', '森': '木', '焱': '火', '垚': '土',
  '晶': '火', '磊': '土', '犇': '木', '骉': '水', '羴': '土',
  '麤': '木', '驫': '水', '龘': '火',
  '金': '金', '木': '木', '水': '水', '火': '火', '土': '土',
}

/** 部首→五行映射（用于部首推断层） */
const RADICAL_WUXING: Record<string, WuXing> = {
  '氵': '水', '冫': '水', '水': '水', '雨': '水',
  '木': '木', '艹': '木', '竹': '木', '禾': '木',
  '火': '火', '灬': '火', '日': '火', '光': '火',
  '金': '金', '钅': '金', '刂': '金', '刀': '金', '戈': '金',
  '土': '土', '山': '土', '石': '土', '田': '土',
}

/**
 * 部首推断：尝试用 cnchar.radical（若已加载 radical 插件）获取部首
 * 项目未安装 cnchar-radical 插件时安全返回 null，由后续补充字典兜底
 */
function getRadical(char: string): string | null {
  // 防御性检查：cnchar 基础包不含 radical 方法，插件未加载时跳过
  const radicalFn = (cnchar as unknown as { radical?: unknown }).radical
  if (typeof radicalFn === 'function') {
    try {
      const result = (radicalFn as (c: string) => unknown)(char)
      if (typeof result === 'string' && result) return result
      if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'string') {
        return result[0]
      }
    } catch {
      // cnchar.radical 调用失败，忽略
    }
  }
  // 字符本身即为部首时直接返回
  if (RADICAL_WUXING[char]) return char
  return null
}

/**
 * 查询汉字五行
 * @param char 单个汉字
 * @returns 五行归属，查不到返回 null
 */
export function getCharWuXing(char: string): WuXing | null {
  if (!char || char.length === 0) return null

  // 第 1 层：特殊强规则
  if (SPECIAL_WUXING[char]) return SPECIAL_WUXING[char]

  // 第 2 层：本地主字典
  const dictEntry = WUXING_DICT[char]
  if (dictEntry?.wuxing) return dictEntry.wuxing

  // 第 3 层：部首推断
  const radical = getRadical(char)
  if (radical && RADICAL_WUXING[radical]) return RADICAL_WUXING[radical]

  // 第 3.5 层：补充字典（kangxiStrokes 的 CHAR_WUXING，原基于部首+笔画整理）
  const supplementary = CHAR_WUXING[char]
  if (supplementary) return supplementary

  // 第 4 层：笔画尾数兜底
  const strokes = getStrokeCount(char)
  if (strokes !== null && strokes > 0) {
    const tail = strokes % 10
    // NUM_WUXING 键 0-9，尾数 0 取键 0（水），1/2→木，3/4→火，5/6→土，7/8→金，9/0→水
    return NUM_WUXING[tail] || null
  }

  return null
}
