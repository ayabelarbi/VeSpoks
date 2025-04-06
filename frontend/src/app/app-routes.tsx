import { UiLayout } from '../components/ui/ui-layout'
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature'))
const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature'))

import HomeFeature from '../components/home/home-feature'
import VerifyFeature from '../components/verify/verify-feature'
// const ConnectFeature = lazy(() => import('../components/connect/connect-feature'))
// const RegisterFeature = lazy(() => import('../components/register/register-feature'))
// const ClaimFeature = lazy(() => import('../components/claim/claim-feature'))  

export function AppRoutes() {
  return (
    <UiLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomeFeature />} />
          <Route path="/verify" element={<VerifyFeature />} />
          <Route path="/account/:address" element={<AccountDetailFeature />} />
          <Route path="/clusters" element={<ClusterFeature />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </UiLayout>
  )
}
