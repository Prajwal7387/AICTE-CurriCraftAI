import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { BureauExpertsPage } from '../pages/bureau/BureauExpertsPage';
import { CurriculumWorkspacePage } from '../pages/workspace/CurriculumWorkspacePage';
import { VersionControlPage } from '../pages/version/VersionControlPage';
import { AiAssistantPage } from '../pages/ai/AiAssistantPage';
import { NepCompliancePage } from '../pages/nep/NepCompliancePage';
import { ReviewWorkflowPage } from '../pages/workflow/ReviewWorkflowPage';
import { PublicPortalPage } from '../pages/portal/PublicPortalPage';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { ResourceHubPage } from '../pages/resources/ResourceHubPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Home Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/bureau/experts" element={<BureauExpertsPage />} />
          <Route path="/workspace" element={<CurriculumWorkspacePage />} />
          <Route path="/versions" element={<VersionControlPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/nep-compliance" element={<NepCompliancePage />} />
          <Route path="/workflows" element={<ReviewWorkflowPage />} />
          <Route path="/portal" element={<PublicPortalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/resources" element={<ResourceHubPage />} />
        </Route>
      </Route>

      {/* Default Redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
