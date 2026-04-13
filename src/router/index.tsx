import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from '../components/layout/Layout'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBoundary from '../components/common/ErrorBoundary'
import NotFound from '../components/common/NotFound'

const ProfileModule = lazy(() => import('../modules/profile'))
const BaziModule = lazy(() => import('../modules/bazi'))
const ZiweiModule = lazy(() => import('../modules/ziwei'))
const FortuneModule = lazy(() => import('../modules/fortune'))
const NameModule = lazy(() => import('../modules/name'))
const CalendarModule = lazy(() => import('../modules/calendar'))
const LiuyaoModule = lazy(() => import('../modules/liuyao'))

function LazyModule({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="animate-fade-in-up">
        {children}
      </div>
    </ErrorBoundary>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/profile" replace />,
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><ProfileModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'bazi',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><BaziModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'ziwei',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><ZiweiModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'fortune',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><FortuneModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'name',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><NameModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><CalendarModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: 'liuyao',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyModule><LiuyaoModule /></LazyModule>
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

export default router
