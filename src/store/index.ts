import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  BirthInfo,
  BaziResult,
  ZiweiResult,
  LiuyaoResult,
  ModuleType
} from '../types'

export type Language = 'zh-CN' | 'en-US'

interface AppState {
  birthInfo: BirthInfo
  baziResult: BaziResult | null
  ziweiResult: ZiweiResult | null
  liuyaoResult: LiuyaoResult | null
  activeModule: ModuleType
  language: Language

  setBirthInfo: (info: Partial<BirthInfo>) => void
  setBaziResult: (result: BaziResult | null) => void
  setZiweiResult: (result: ZiweiResult | null) => void
  setLiuyaoResult: (result: LiuyaoResult | null) => void
  setActiveModule: (module: ModuleType) => void
  setLanguage: (language: Language) => void
  resetAll: () => void
}

const initialState = {
  birthInfo: {
    name: '',
    date: '',
    calendar: 'solar' as const,
    gender: 'male' as const,
    location: '',
  },
  baziResult: null,
  ziweiResult: null,
  liuyaoResult: null,
  activeModule: 'profile' as ModuleType,
  language: 'zh-CN' as Language,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setBirthInfo: (info) =>
        set((state) => ({
          birthInfo: { ...state.birthInfo, ...info },
        })),
      
      setBaziResult: (result) => set({ baziResult: result }),
      
      setZiweiResult: (result) => set({ ziweiResult: result }),
      
      setLiuyaoResult: (result) => set({ liuyaoResult: result }),

      setActiveModule: (module) => set({ activeModule: module }),

      setLanguage: (language) => set({ language }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'busuan-storage',
      partialize: (state) => ({
        birthInfo: state.birthInfo,
        baziResult: state.baziResult,
        ziweiResult: state.ziweiResult,
        language: state.language,
      }),
    }
  )
)
