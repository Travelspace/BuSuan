# Traditional Chinese Metaphysics Research Tool (BuSuan)

A fully functional web tool for traditional Chinese metaphysics research, intended for personal local learning only. It includes profile management, Bazi (Four Pillars) chart, Zi Wei Dou Shu (Purple Star Astrology), fortune analysis, name test, auspicious date selection, and Liu Yao (Six Yao) divination.

🌐 **Live Demo**: https://travelspace.github.io/BuSuan/

## 🎯 Features

- 📝 **Profile** - Manage name, gender, birthplace, birth date, and other personal information, automatically shared across modules
- 🏮 **Bazi Chart** - Calculate the Four Pillars chart based on birth time, including Ten Gods, Five Elements, Nayin, Hidden Stems, and Luck Cycles
- ⭐ **Zi Wei Dou Shu** - Plot the twelve-palace Zi Wei chart, including main stars, auxiliary stars, four transformations, and palace interpretations
- 📊 **Fortune Analysis** - Dual-tab analysis combining Bazi macro trends and Zi Wei micro insights, with yearly ratings and palace details
- ✍️ **Name Test** - Bazi-primary with hexagram-secondary and 五格 (Wǔ Gé) as reference: layered 五行 (Wǔ Xíng) lookup, hexagram casting & body-use analysis, 喜用神 (Xǐ Yòng Shén) matching, overall score (Bazi 60% / hexagram 25% / 五格 15%)
- 📅 **Auspicious Date Selection** - Almanac auspicious/inauspicious queries, date filtering, and personalized Bazi recommendations
- ☯️ **Liu Yao Divination** - Manual or time-based hexagram casting, with original, mutual, and changed hexagrams plus body-use analysis
- 🌐 **Bilingual (CN/EN)** - Full Chinese/English switching across the app; metaphysics terms keep the "Chinese (Pinyin)" form
- ☀️ **True Solar Time Correction** - Auto-corrects true solar time from birthplace longitude and timezone, supporting global cities and daylight saving time
- 🧭 **Interaction UX** - After calculation, the profile form auto-hides/collapses and results display full-width; when info is missing, pages show a full-page guide to jump to fill-in or casting

## 🛠️ Tech Stack

| Category | Technology | Version |
| -------- | ---------- | ------- |
| Frontend Framework | React + TypeScript | 18 / 5 |
| Build Tool | Vite | 5 |
| Styling | Tailwind CSS | 3 |
| State Management | Zustand | 4 |
| Routing | React Router | 6 |
| Charts | Recharts | 2 |
| Metaphysics Calculation | iztro | 2 |
| Lunar Calendar | lunar-typescript | 1 |
| True Solar Time | true-solar-time | 1 |
| Chinese Character Strokes | cnchar | 3 |
| Date Handling | dayjs | 1 |
| Icons | Lucide React | 0.294+ |

## 📦 Installation & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:5173 in your browser.

## 🚀 Deploy to GitHub Pages

The project is configured with a GitHub Actions workflow. Pushing to the `main` branch will automatically build and deploy the site.

Live URL: **https://travelspace.github.io/BuSuan/**

### Enable Auto Deployment

1. Open the GitHub repository → **Settings** → **Pages**
2. Set **Source** to **GitHub Actions**
3. Push the code to the `main` branch
4. Check deployment progress in the **Actions** tab

Related configuration:

- `vite.config.ts` sets `base: '/BuSuan/'`
- `src/router/index.tsx` sets `basename: '/BuSuan'`
- `.github/workflows/deploy.yml` defines the build and deployment pipeline

## 📁 Project Structure

```
BuSuan/
├── .github/
│   └── workflows/           # GitHub Actions deployment workflows
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Common components
│   │   ├── common/          # Button, Card, Input, Modal, Toast, BirthSummaryForm, etc.
│   │   └── layout/          # Header, Footer, Layout
│   ├── modules/             # Feature modules
│   │   ├── profile/         # Profile management (province/city data, personal info)
│   │   ├── bazi/            # Bazi chart (pillars, ten gods, five elements, luck cycles)
│   │   ├── ziwei/           # Zi Wei Dou Shu (12 palaces, palace details, four transformations)
│   │   ├── fortune/         # Fortune analysis (Bazi trends + Zi Wei insights)
│   │   ├── name/            # Name test (Bazi-primary + hexagram-secondary + 五格 reference)
│   │   │   ├── components/  # NameForm, NameResult, BaziMatchSection, GuaAnalysisSection, WugeReferenceSection
│   │   │   ├── data/        # wuxingDict.ts (6773 chars 五行), guaInterpretation.ts (64 hexagrams), kangxiStrokes.ts, zidianStrokes.ts
│   │   │   └── utils/       # wuxingLookup.ts (layered 五行 lookup), baziMatch.ts, guaAnalysis.ts, wugeCalculation.ts, scoreCalculator.ts, calculation.ts
│   │   ├── calendar/        # Auspicious date selection (almanac, date filtering, Bazi combo)
│   │   └── liuyao/          # Liu Yao divination (manual/time casting, 64 hexagrams data)
│   ├── store/               # Zustand state management
│   ├── router/              # Route configuration
│   ├── utils/               # Utility functions
│   ├── types/               # Global type definitions
│   ├── App.tsx              # App entry
│   └── main.tsx             # Render entry
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Project configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## 🎨 Design Guidelines

### Color Scheme

- **Primary background**: Deep black (#0a0a0f)
- **Secondary background**: #1a1a2e
- **Card background**: #16213e
- **Accent color**: Gold (#d4af37)
- **Five Element colors**: Metal(#c0c0c0) Wood(#27ae60) Water(#3498db) Fire(#e74c3c) Earth(#d4a574)

### Fonts

- Main font: Noto Serif SC (serif)
- Auxiliary font: Noto Sans SC (sans-serif)

## 🔧 Key Technical Implementations

### Name Test - Bazi-Primary with Hexagram-Secondary

The name analysis core follows "Bazi-primary, hexagram-secondary", with 五格 (Wǔ Gé) demoted to reference info:

1. **Layered 五行 (Wǔ Xíng) lookup** (`wuxingLookup.ts`) - four-tier fallback for coverage:
   - Special strong rules (品字 structure: 鑫→金, 森→木, 淼→水, 焱→火, 垚→土)
   - Local dictionary (`wuxingDict.ts`, 6773 characters of 五行 data)
   - Radical inference + `kangxiStrokes` supplementary dictionary
   - Stroke-tail fallback (1/2→木, 3/4→火, 5/6→土, 7/8→金, 9/0→水)
2. **Hexagram casting** (`guaAnalysis.ts`) - cast via Kangxi strokes: upper trigram = surname strokes % 8, lower = given-name total strokes % 8, moving line = total strokes % 6; body-use relation (用生体/体克用/比和 etc.) by 五行 generation/restriction; 64 hexagram names & texts from `guaInterpretation.ts`
3. **Bazi matching** (`baziMatch.ts`) - reuses the `baziResult` already in store; scores per-character 五行 against 喜用神 (Xi Shen +12, Yong Shen +15, Ji Shen -10, missing-fill +5)
4. **Overall score** (`scoreCalculator.ts`) - Bazi×0.6 + hexagram×0.25 + 五格×0.15; **a Bazi chart must be cast before the name test** (casting is disabled without it, with a prompt guiding to the Bazi page; no fallback mode)
5. **五格 reference** (`wugeCalculation.ts`) - preserves the original five-grid numerology, three-talent config & score, shown as a collapsible reference section

### Calculation Flow UX

- **Info missing** - Bazi / Zi Wei / Name / Fortune pages show a full-page empty state with 「Go to Fill / Go to Calculate」 buttons that jump to the profile or casting page
- **After calculation** - The profile form auto-hides (Bazi / Zi Wei / Name) or collapses into a left sidebar bar (Liu Yao), results display full-width with a 「Re-calculate」 button on top
- **Bazi prerequisite** - The name test requires a completed Bazi chart first
- **Auto fortune analysis** - Once Bazi and Zi Wei charts are ready, the fortune page computes automatically: the Bazi side reuses cached results, the Zi Wei side auto-casts when missing

### Timezone Fix

Birth dates are stored as `datetime-local` format strings to avoid UTC+8 offset issues caused by `toISOString()`.

### True Solar Time Correction

Once a birthplace is selected, the true solar time is auto-corrected; both Bazi and Zi Wei charts use the corrected time:

1. **Location data** - Chinese provinces/cities come from the `true-solar-time` library's built-in data; overseas cities supplement longitude and IANA timezone
2. **Timezone & DST** - Wall-clock time is converted to absolute UTC via the browser's `Intl.DateTimeFormat` (IANA timezone database), which automatically handles DST transitions (e.g., America/New_York's EST/EDT)
3. **Solar time calculation** - Based on the `true-solar-time` library (Jean Meeus astronomical algorithm) for the equation of time and longitude correction: True Solar Time = Standard Time + (longitude − standard meridian)×4 + Equation of Time
4. **Standard meridian derivation** - The standard meridian is derived from the actual UTC offset at that moment (including DST), so winter/summer switch automatically
5. **Language adaptation** - When switched to English, provinces show standard English names, Chinese cities show Pinyin, and overseas cities show English names

## ⚠️ Disclaimer

This project is purely technical code intended to demonstrate the algorithmic logic in traditional Chinese metaphysics. All chart results are for cultural symbol display only.

This project does not provide any form of fate prediction, fortune judgment, or life guidance.

The code is for learning and research purposes only. Any individual or organization shall not use it for commercial, fraudulent, or illegal activities.

The project author assumes no responsibility for any direct or indirect consequences arising from the use of this project code.

## 📄 License

MIT

---

**Version**: v2.0.0  
**Updated**: 2026-08-11
