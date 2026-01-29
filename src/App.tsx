import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout'
import { ActualsPage } from './pages/actuals'
import { TrendPage } from './pages/trend'
import { PlaceholderPage } from './pages/placeholder'
import { IntegrationOverviewPage } from './pages/integrations'
import { AudienceBuilderPage } from './pages/audience'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default redirect to Actuals */}
          <Route index element={<Navigate to="/reports/actuals" replace />} />

          {/* Tracking Link */}
          <Route path="tracking-link">
            <Route path="generation" element={<PlaceholderPage />} />
            <Route path="management" element={<PlaceholderPage />} />
            <Route path="custom-domain" element={<PlaceholderPage />} />
            <Route path="deep-links" element={<PlaceholderPage />} />
          </Route>

          {/* Reports */}
          <Route path="reports">
            <Route path="actuals" element={<ActualsPage />} />
            <Route path="trend" element={<TrendPage />} />
            <Route path="active-users" element={<PlaceholderPage />} />
            <Route path="funnel" element={<PlaceholderPage />} />
            <Route path="retention" element={<PlaceholderPage />} />
            <Route path="revenue" element={<PlaceholderPage />} />
          </Route>

          {/* Integrations */}
          <Route path="integrations">
            <Route path="overview" element={<IntegrationOverviewPage />} />
            <Route path="ad-channel" element={<PlaceholderPage />} />
            <Route path="third-party" element={<PlaceholderPage />} />
          </Route>

          {/* Raw Data */}
          <Route path="raw-data">
            <Route path="export/app" element={<PlaceholderPage />} />
            <Route path="export/web" element={<PlaceholderPage />} />
            <Route path="real-time/app" element={<PlaceholderPage />} />
            <Route path="real-time/web" element={<PlaceholderPage />} />
          </Route>

          {/* Management */}
          <Route path="management">
            <Route path="attribution-rules" element={<PlaceholderPage />} />
            <Route path="skan-conversion" element={<PlaceholderPage />} />
          </Route>

          {/* Audience */}
          <Route path="audience">
            <Route path="create" element={<AudienceBuilderPage />} />
            <Route path="list" element={<PlaceholderPage />} />
          </Route>

          {/* Settings */}
          <Route path="settings">
            <Route path="app-settings" element={<PlaceholderPage />} />
            <Route path="tokens" element={<PlaceholderPage />} />
            <Route path="user-management" element={<PlaceholderPage />} />
            <Route path="activity-history" element={<PlaceholderPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
