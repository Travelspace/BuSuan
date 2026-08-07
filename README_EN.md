# Traditional Chinese Metaphysics Research Tool (BuSuan)

A fully functional web tool for traditional Chinese metaphysics research, intended for personal local learning only. It includes profile management, Bazi (Four Pillars) chart, Zi Wei Dou Shu (Purple Star Astrology), fortune analysis, name test, auspicious date selection, and Liu Yao (Six Yao) divination.

🌐 **Live Demo**: https://travelspace.github.io/BuSuan/

## 🎯 Features

- 📝 **Profile** - Manage name, gender, birthplace, birth date, and other personal information, automatically shared across modules
- 🏮 **Bazi Chart** - Calculate the Four Pillars chart based on birth time, including Ten Gods, Five Elements, Nayin, Hidden Stems, and Luck Cycles
- ⭐ **Zi Wei Dou Shu** - Plot the twelve-palace Zi Wei chart, including main stars, auxiliary stars, four transformations, and palace interpretations
- 📊 **Fortune Analysis** - Dual-tab analysis combining Bazi macro trends and Zi Wei micro insights, with yearly ratings and palace details
- ✍️ **Name Test** - Five-Grid numerology analysis, Three-Talent configuration, Bazi matching, and layered stroke lookup (predefined rules → cnchar → local database)
- 📅 **Auspicious Date Selection** - Almanac auspicious/inauspicious queries, date filtering, and personalized Bazi recommendations
- ☯️ **Liu Yao Divination** - Manual or time-based hexagram casting, with original, mutual, and changed hexagrams plus body-use analysis

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
│   │   ├── common/          # Button, Card, Input, Modal, Toast, etc.
│   │   └── layout/          # Header, Footer, Layout
│   ├── modules/             # Feature modules
│   │   ├── profile/         # Profile management (province/city data, personal info)
│   │   ├── bazi/            # Bazi chart (pillars, ten gods, five elements, luck cycles)
│   │   ├── ziwei/           # Zi Wei Dou Shu (12 palaces, palace details, four transformations)
│   │   ├── fortune/         # Fortune analysis (Bazi trends + Zi Wei insights)
│   │   ├── name/            # Name test (five-grid numerology, three-talent, Bazi matching)
│   │   │   ├── components/  # NameForm, NameResult, etc.
│   │   │   ├── data/        # kangxiStrokes.ts, zidianStrokes.ts (20,823 characters)
│   │   │   └── utils/       # strokeLookup.ts (layered lookup), calculation.ts
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

### Name Test - Layered Stroke Lookup

The stroke lookup uses a layered fallback strategy to ensure Chinese character coverage:

1. **Predefined rules** - Specific radicals (阝=2, 辶=3, 氵=3, etc.) and Kangxi strokes for numeric characters
2. **cnchar library** - Call cnchar.stroke() to get stroke count
3. **Local database** - 20,823 Chinese character stroke records based on ZiDian.mdb
4. **Kangxi dictionary data** - Fallback for commonly used characters
5. **Final fallback** - Return 1 stroke if all lookups fail

### Timezone Fix

Birth dates are stored as `datetime-local` format strings to avoid UTC+8 offset issues caused by `toISOString()`.

## ⚠️ Disclaimer

This project is purely technical code intended to demonstrate the algorithmic logic in traditional Chinese metaphysics. All chart results are for cultural symbol display only.

This project does not provide any form of fate prediction, fortune judgment, or life guidance.

The code is for learning and research purposes only. Any individual or organization shall not use it for commercial, fraudulent, or illegal activities.

The project author assumes no responsibility for any direct or indirect consequences arising from the use of this project code.

## 📄 License

GNU Affero General Public License v3.0 (AGPL-3.0)

---

**Version**: v1.6.0  
**Updated**: 2026-08-07
