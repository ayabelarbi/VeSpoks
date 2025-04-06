import { UiLayout } from '../components/ui/ui-layout'
import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/home'
import Verify from '../pages/verify'
import SelectApp from '../pages/select-app'
import Claim from "../pages/claim"
import ViewTrips from "../pages/view-trips"
import ConfirmOTP from '@/pages/confirmOTP'

// const ConnectFeature = lazy(() => import('../components/connect/connect-feature'))
// const RegisterFeature = lazy(() => import('../components/register/register-feature'))
// const ClaimFeature = lazy(() => import('../components/claim/claim-feature'))  

export function AppRoutes() {
  return (
    <UiLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/select-app" element={<SelectApp />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/view-trips" element={<ViewTrips />} />
          <Route path="/confirm-otp" element={<ConfirmOTP />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </UiLayout>
  )
}
