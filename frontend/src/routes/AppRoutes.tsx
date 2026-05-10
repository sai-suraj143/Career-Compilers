import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Card } from '../components/ui/Card';

const LoginPage = lazy(() => import('../pages/auth/Login').then((mod) => ({ default: mod.LoginPage })));
const SignupPage = lazy(() => import('../pages/auth/Signup').then((mod) => ({ default: mod.SignupPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword').then((mod) => ({ default: mod.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('../pages/dashboard/Home').then((mod) => ({ default: mod.DashboardPage })));
const TripsPage = lazy(() => import('../pages/trips/Trips').then((mod) => ({ default: mod.TripsPage })));
const CreateTripPage = lazy(() => import('../pages/trips/CreateTrip').then((mod) => ({ default: mod.CreateTripPage })));
const ItineraryPage = lazy(() => import('../pages/itinerary/ItineraryBuilder').then((mod) => ({ default: mod.ItineraryPage })));
const ActivitySearchPage = lazy(() => import('../pages/trips/ActivitySearch').then((mod) => ({ default: mod.ActivitySearchPage })));
const CitySearchPage = lazy(() => import('../pages/trips/CitySearch').then((mod) => ({ default: mod.CitySearchPage })));
const BudgetPage = lazy(() => import('../pages/budget/Budget').then((mod) => ({ default: mod.BudgetPage })));
const ChecklistPage = lazy(() => import('../pages/trips/Checklist').then((mod) => ({ default: mod.ChecklistPage })));
const NotesPage = lazy(() => import('../pages/trips/Notes').then((mod) => ({ default: mod.NotesPage })));
const ProfilePage = lazy(() => import('../pages/profile/Profile').then((mod) => ({ default: mod.ProfilePage })));
const AdminPage = lazy(() => import('../pages/admin/AdminDashboard').then((mod) => ({ default: mod.AdminPage })));
const PublicItineraryPage = lazy(() => import('../pages/shared/PublicItinerary').then((mod) => ({ default: mod.PublicItineraryPage })));

const LoadingFallback = () => (
  <div className="px-6 py-10">
    <Card className="rounded-[32px] border border-white/10 bg-slate-950/90 p-10 text-center text-slate-400">Loading page...</Card>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/share/:tripId" element={<PublicItineraryPage />} />

        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/new" element={<CreateTripPage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="activities" element={<ActivitySearchPage />} />
          <Route path="cities" element={<CitySearchPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
