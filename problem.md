# BuSuan 问题与优化清单

> 本文件记录代码审查、架构梳理过程中发现的需要改进的建议与潜在 bug。

---

## 🔴 潜在 Bug

### 1. 八字大运十神为空字符串
- **位置**: `src/modules/bazi/utils/calculation.ts`
- **问题**: 大运数组中 `tenGod` 被硬编码为 `'' as any`，类型与实际数据不符，前端 `DayunChart` 也未显示十神。
- **建议**: 根据大运干支与日主计算真实十神，或移除该字段并更新类型。

### 2. 运势分析年龄计算过于粗略
- **位置**: `src/modules/fortune/utils/calculation.ts`
- **问题**: `const age = year - new Date(birthInfo.date).getFullYear()` 未考虑是否已过生日，可能导致大运/流年匹配年份偏差。
- **建议**: 根据当前日期与出生日期精确计算周岁。

### 3. 姓名笔画 fallback 直接返回 1
- **位置**: `src/modules/name/utils/strokeLookup.ts`
- **问题**: 当 cnchar、本地字典、康熙字典都查不到时，直接返回 1，导致生僻字笔画错误。
- **建议**: 提供“未知字符”提示或允许用户手动修正；对数字/符号做特殊处理。

### 4. `kangxiStrokes.ts` 中的 fallback 实现不合理
- **位置**: `src/modules/name/data/kangxiStrokes.ts`
- **问题**: `getKangxiStroke` 使用 `char.charCodeAt(0)` 作为 fallback，对绝大多数字符都会返回错误笔画。
- **建议**: 移除该 fallback 或改为返回 `null` 并在外层处理。

### 5. 日历八字日课评分未考虑地支刑害
- **位置**: `src/modules/calendar/utils/calculation.ts`
- **问题**: 评分逻辑只处理了冲、合、生、克、喜用神，未处理地支三刑、六害、自刑等关系。
- **建议**: 补充刑害规则，使评分更符合传统择日逻辑。

### 6. Header 中 `activeModule` 与浏览器路由可能不同步
- **位置**: `src/components/layout/Header/index.tsx`
- **问题**: `activeModule` 仅在点击导航时写入 store，用户通过浏览器前进/后退切换路由时，store 中的值可能滞后。
- **建议**: 使用 `useLocation` 在路由变化时自动同步 `activeModule`，或移除 store 中的该状态，直接由路由推导。

### 7. `ErrorBoundary` 重置后无法真正重试懒加载模块
- **位置**: `src/components/common/ErrorBoundary/index.tsx`
- **问题**: 点击“重试”仅清空错误状态，若错误由懒加载抛出（如网络失败），仍需刷新页面才能重新加载。
- **建议**: 在重试时强制重新挂载子树，或提示用户刷新。

---

## 🟡 代码质量与可维护性

### 8. 五行/干支常量大量重复
- **涉及文件**:
  - `src/utils/constants.ts`
  - `src/utils/date.ts`
  - `src/modules/bazi/utils/constants.ts`
  - `src/modules/bazi/utils/calculation.ts`
  - `src/modules/fortune/utils/calculation.ts`
  - `src/modules/calendar/utils/calculation.ts`
  - `src/modules/liuyao/utils/calculation.ts`
- **问题**: `GAN_WUXING`、`ZHI_WUXING`、`WU_XING_SHENG`、`WU_XING_KE` 等映射表在多处重复定义，维护成本高且容易不一致。
- **建议**: 统一抽到 `src/utils/wuxing.ts`，各模块直接引用。

### 9. `getTimeIndex` 函数重复实现
- **位置**: `src/modules/bazi/utils/calculation.ts`、`src/modules/ziwei/utils/calculation.ts`
- **问题**: 两个模块中都有几乎相同的时辰索引转换函数。
- **建议**: 提取到 `src/utils/date.ts` 或 `src/utils/calendar.ts`。

### 10. 类型安全不足
- **位置**:
  - `src/modules/bazi/utils/calculation.ts`: 多处 `as any`，如 `tenGod: eightChar.getYearShiShenGan() as any`
  - `src/modules/ziwei/utils/calculation.ts`: `astrolabe: any`，`palaces.map((p: any) => ...)`
  - `src/modules/fortune/utils/calculation.ts`: `getTenGod` 返回 `string` 而非 `TenGod` 联合类型
- **建议**: 补充 `iztro` 类型声明或自行定义接口，逐步消除 `any`。

### 11. 吉凶颜色/等级常量分散
- **涉及文件**: 各模块 `utils/constants.ts`
- **问题**: 五行颜色、吉凶等级、评分颜色等在各模块重复定义，风格略有差异（如 `text-red` vs `text-red-500`）。
- **建议**: 统一到 `src/utils/constants.ts` 或设计令牌文件。

### 12. 大量硬编码中文文本
- **涉及文件**: 各模块组件与工具函数
- **问题**: 运势评语、姓名解释、模块描述等大量硬编码中文，后续国际化或文案调整成本高。
- **建议**: 将文案集中到 `src/locales/zh-CN.ts`，组件中只引用 key。

### 13. `fortune/index.tsx` 略显臃肿
- **位置**: `src/modules/fortune/index.tsx`
- **问题**: 同时承载八字运势和紫微运势两套数据源、两套子视图和切换逻辑。
- **建议**: 拆分为 `BaziFortuneView` 和 `ZiweiFortuneView` 两个子组件，入口仅负责 tab 切换。

---

## 🟢 性能优化

### 14. 多处无意义的模拟加载
- **涉及文件**:
  - `src/modules/bazi/index.tsx`
  - `src/modules/ziwei/index.tsx`
  - `src/modules/name/index.tsx`
  - 其他使用 `setTimeout(..., 300)` 的模块
- **问题**: 本地计算无需延迟，反而延迟 UI 反馈。
- **建议**: 移除 `setTimeout`，若需要加载动画可在真正耗时时使用。

### 15. 日历模块每次渲染都重新计算整月数据
- **位置**: `src/modules/calendar/index.tsx`
- **问题**: `const monthData: MonthData = useCallback(() => getMonthData(year, month, baziResult), [year, month, baziResult])()` 每次渲染都创建新函数并立即执行。
- **建议**: 改用 `useMemo(() => getMonthData(year, month, baziResult), [year, month, baziResult])`。

### 16. 紫微运势重复排盘
- **位置**: `src/modules/fortune/utils/ziweiCalculation.ts`、`src/modules/ziwei/utils/calculation.ts`
- **问题**: `fortune` 的紫微标签和 `ziwei` 模块各自调用 `iztro` 排盘，同一 `birthInfo` 会被计算多次。
- **建议**: 在 store 中缓存 `ziweiResult`，紫微运势直接消费缓存结果；或封装带 memo 的排盘 hook。

---

## 🔵 其他建议

### 17. 补充 ESLint 配置文件
- **问题**: 项目 `package.json` 已配置 `eslint` 脚本，但根目录缺少 `.eslintrc.*` 或 `eslint.config.*`，导致 `npm run lint` 直接失败。
- **建议**: 添加适合 React + TypeScript 的 ESLint 配置。

### 18. 补充 `package-lock.json`
- **问题**: 项目没有 `package-lock.json`，CI 中只能使用 `npm install` 而非 `npm ci`，依赖版本不可控。
- **建议**: 提交 `package-lock.json`，并将 GitHub Actions 改回 `npm ci`。

### 19. README 版本号可更新
- **位置**: `README.md`、`README_EN.md`
- **问题**: 当前版本 `v1.5.0`、更新日期 `2026-02-13`，与本次新增 GitHub Pages 部署和英文文档不匹配。
- **建议**: 在合适时机更新版本号和日期。
