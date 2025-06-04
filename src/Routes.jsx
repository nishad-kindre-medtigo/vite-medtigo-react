import React, { Suspense, Fragment } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import NewLayout from './layouts/NewLayout';
import LoadingScreen from './components/LoadingScreen';
import { AdminGuard, AuthGuard, CMEGuard, CountryGuard, ExpiryGuard, GuestGuard, MedtigoOrangeGuard, PaymentGuard, SchedulingGuard } from './guards';
import ImageViewer from './views/ImageViewer';
import Error404View from './views/pages/Error404View';
import LoginView from './views/auth/LoginView';
import RegenerateView from './views/regenerate';
import OnboardingLicenseEmail from './views/onboardingLicenseEmail';
import ServiceRegistrationForm from './views/serviceRegistrationForm';
import Feedback from './views/feedback';
import LeadConfirmationPage from './views/leadConfirmationPage';
import ClerkChat from './views/clerkChat';
import Redirections from './views/redirections/index';
import Dashboard from './views/dashboard';
import SendForSignatureComponent from './views/esign/SendForSignatureComponent';
import HistoryPage from './views/esign/HistoryPage';
import AddSignatureComponent from './views/esign/AddSignatureComponent';
import SignedDoc from './views/esign/SignedDoc';
import AdminDashboard from './views/AdminDashboard';
import AdminAcquisition from './views/AdminAcquisition';
import UserViewStateLicense from './views/AdminAcquisition/StateLicense/UserView';
import AdminView from './views/AdminView';
import UserViewClinicalCertificate from './views/AdminView/ClinicalCertificate/UserView';
import UserViewDEA from './views/AdminView/DEA/UserView';
import UserViewStateCSR from './views/AdminView/StateCSR/UserView';
import UserViewLicenseReports from './views/AdminView/LicenseReports/UserView';
import MonitoringRenewal from './views/MonitoringRenewal';
import StateCompliance from './views/StateCompliance';
import ToolsResources from './views/ToolsResources';
import Acquisition from './views/Acquisition';
import CourseSyllabus from './views/Acquisition/MyLearning/courseSyllabus';
import TeamCompliance from './views/AdminView/TeamCompliance';
import NewSetting from './views/newSetting';
import CourseLearning from './views/CourseLearning';
import CMESurveyForm from './views/CMESurvey';
import SwapRequest from './views/Scheduling/SwapRequest';
import MySchedule from './views/Scheduling/MySchedule';
import Availability from './views/Scheduling/Availability';
import GroupSchedule from './views/Scheduling/GroupSchedule';
import DraftSchedule from './views/Scheduling/DraftSchedule';
import RequestPayment from './views/Scheduling/PaymentRequest/pages/RequestPayment';
import RequestHistory from './views/Scheduling/PaymentRequest/pages/RequestHistory';
import RequestDurationTable from './views/Scheduling/PaymentRequest/pages/RequestDurationTable';
import TravelExpense from './views/new_expenses/pages/TravelExpense';
import MealExpense from './views/new_expenses/pages/MealExpense';
import SiteExpense from './views/new_expenses/pages/SiteExpense';
import ExpensesSubmissionPopUp from './views/new_expenses/pages/ExpensesSubmissionPopUp';
import Locums from './views/new_staffing/pages/Locums';
import JobBoard from './views/new_staffing/pages/JobBoard';
import MedtigoOrange from './views/medtigoOrange';
import SimulationRedirection from './views/simulation/simulationRedirection';
import SimulationNoAccessView from './views/simulation/simulationNoAccessView';
import SyllabusReader from './views/SyllabusReader';

const ServicesRedirect = () => {
  React.useEffect(() => {
    history.replace('/dashboard');
  }, [history]);
  return null;
};

// AUTH ROUTES
const routesConfig = [
  {
    path: '/',
    element: () => Navigate({ to: '/login' })
  },
  {
    path: '/404',
    element: Error404View
  },
  {
    guard: GuestGuard,
    path: '/login',
    element: LoginView
  },
  {
    path: '/regenerate',
    element: RegenerateView
  },
  {
    path: '/onBoardingResendEmail',
    element: OnboardingLicenseEmail
  },
  {
    path: '/serviceForm',
    element: ServiceRegistrationForm
  },
  {
    path: '/feedback',
    element: Feedback
  },
  {
    path: '/lead-confirmation/:token',
    element: LeadConfirmationPage
  },
  {
    path: '/clerk-chat-consent',
    element: ClerkChat
  },
  {
    path: '/services',
    element: ServicesRedirect
  }
];

// ROUTES ON CONNECT PLATFORM
const serviceRoutes = [
  {
    path: '/redirect/:place',
    element: Redirections
  },
  {
    path: '/home',
    element: () => Navigate({ to: '/dashboard' })
  },
  {
    path: '/notifications',
    element: () => Navigate({ to: '/state-licensing' })
  },
  {
    path: '/dashboard',
    element: Dashboard
  },
  {
    path: '/certificates',
    element: () => Navigate({ to: '/monitoring-renewal/clinical-certificate' })
  },
  {
    path: '/e-sign',
    element: SendForSignatureComponent
  },
  {
    path: '/e-sign/history',
    element: HistoryPage
  },
  {
    path: '/addsignature',
    element: AddSignatureComponent
  },
  {
    path: '/signed',
    element: SignedDoc
  },
  {
    path: '/cme-compliance',
    element: () => Navigate({ to: '/monitoring-renewal/ce-cme' })
  },
  {
    guard: AdminGuard,
    path: '/admin/dashboard',
    element: AdminDashboard
  },
  {
    guard: AdminGuard,
    path: '/admin/acquisition/:type',
    element: AdminAcquisition
  },
  {
    guard: AdminGuard,
    path: '/admin/acquisition/state-license/:deptID/:userID',
    element: UserViewStateLicense
  },
  {
    guard: AdminGuard,
    path: '/admin/reports/:type',
    element: AdminView
  },
  {
    guard: AdminGuard,
    path: '/admin/reports/clinical-certificate/:deptID/:userID',
    element: UserViewClinicalCertificate
  },
  {
    guard: AdminGuard,
    path: '/admin/reports/dea/:deptID/:userID',
    element: UserViewDEA
  },
  {
    guard: AdminGuard,
    path: '/admin/reports/state-csr/:deptID/:userID',
    element: UserViewStateCSR
  },
  {
    guard: AdminGuard,
    path: '/admin/reports/license/details/:userId',
    element: UserViewLicenseReports
  },
  {
    path: '/monitoring-renewal/:type',
    element: MonitoringRenewal
  },
  {
    path: '/monitoring-renewal/:type/report',
    element: MonitoringRenewal
  },
  {
    path: '/monitoring-renewal/ce-cme/report/:type',
    element: StateCompliance
  },
  {
    guard: SchedulingGuard,
    path: '/tools/expense',
    element: ToolsResources
  },
  {
    path: '/tools/:type',
    element: ToolsResources
  },
  {
    path: '/acquisition/:type',
    element: Acquisition
  },
  {
    path: '/state-compliance',
    element: StateCompliance
  },
  {
    path: '/state-compliance/:type',
    element: StateCompliance
  },
  {
    path: '/team-compliance',
    element: TeamCompliance
  },
  {
    path: '/admin/reports/ce_cme/:type',
    element: TeamCompliance
  },
  {
    path: '/setting',
    element: NewSetting
  },
  {
    path: '/state-licensing',
    element: Acquisition
  },
  {
    path: '/my-learning',
    element: Acquisition
  },
  {
    path: '/course-syllabi',
    element: CourseSyllabus
  },
  {
    path: '/learning/course/:courseID',
    element: CourseLearning
  },
  {
    guard: CMEGuard,
    path: '/learning/cme-survey',
    element: CMESurveyForm
  },
  {
    guard: SchedulingGuard,
    path: '/schedule/swap-request',
    element: SwapRequest
  },
  {
    guard: SchedulingGuard,
    path: '/schedule/my-schedule',
    element: MySchedule
  },
  {
    path: '/schedule/availability',
    guard: SchedulingGuard,
    element: Availability
  },
  {
    path: '/schedule/group-schedule',
    guard: SchedulingGuard,
    element: GroupSchedule
  },
  {
    path: '/schedule/draft-schedule',
    guard: SchedulingGuard,
    element: DraftSchedule
  },
  {
    guard: PaymentGuard,
    path: '/schedule/payment-request',
    element: RequestPayment
  },
  {
    guard: PaymentGuard,
    path: '/schedule/payment-history',
    element: RequestHistory
  },
  {
    guard: PaymentGuard,
    path: '/schedule/payment-request-details/:requestId',
    element: RequestDurationTable
  },
  {
    path: '/expenses/travel-expense',
    guard: SchedulingGuard,
    element: TravelExpense
  },
  {
    path: '/expenses/meal-expense',
    guard: SchedulingGuard,
    element: MealExpense
  },
  {
    path: '/expenses/site-expense',
    guard: SchedulingGuard,
    element: SiteExpense
  },
  {
    path: '/expenses/submissions',
    guard: SchedulingGuard,
    element: ExpensesSubmissionPopUp
  },
  {
    path: '/career/contact',
    guard: CountryGuard,
    element: Locums
  },
  {
    path: '/career/locums',
    guard: CountryGuard,
    element: Locums
  },
  {
    path: '/career/job-board',
    guard: CountryGuard,
    element: JobBoard
  },
  {
    path: '/medtigo-orange',
    guard: MedtigoOrangeGuard,
    element: MedtigoOrange
  },
  {
    path: '/imageViewer',
    element: ImageViewer
  },
  {
    path: '/simulationRedirection/:Case/:Source',
    element: SimulationRedirection
  },
  {
    path: '/noSimulationCaseAccess/:productId',
    element: SimulationNoAccessView
  },
  {
    path: '/syllabusReader/:syllabusName',
    element: SyllabusReader
  },
  {
    path: '/',
    element: () => Navigate({ to: '/home' })
  },
  {
    path: '*',
    element: () => Navigate({ to: '/404' })
  }
];

// OPEN ROUTES ACCESSIBLE WITHOUT LOGGING IN
const openRoutes = [
  {
    path: '/imageViewer',
    element: ImageViewer
  },
  {
    path: '/feedback',
    element: Feedback
  },
  {
    path: '/onBoardingResendEmail',
    element: OnboardingLicenseEmail
  },
  {
    path: '/clerk-chat-consent',
    element: ClerkChat
  }
];

// RENDER ROUTES
// CONDITIONALLY ADD GUARD & LAYOUT WRAPPER FOR COMPONENTS
const renderRoutes = (routes, serviceRoutes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {routes.map((route, index) => {
          const Element = route.element || Fragment;
          const Guard = route.guard || Fragment;

          return (
            <Route
              key={route.path || index}
              path={route.path}
              element={
                <Guard>
                  <Element />
                </Guard>
              }
            />
          );
        })}

        {serviceRoutes &&
          serviceRoutes.map((route, index) => {
            const Guard = route.guard || Fragment;
            const Element = route.element || Fragment;

            return (
              <Route
                key={route.path || index} // Use a unique key (path preferred)
                path={route.path}
                element={
                  <AuthGuard>
                    <ExpiryGuard>
                      <Guard>
                        <NewLayout>
                          <Element />
                        </NewLayout>
                      </Guard>
                    </ExpiryGuard>
                  </AuthGuard>
                }
              />
            );
          })}
      </Routes>
    </Suspense>
  ) : null;

function PageRoutes() {
  if (localStorage.getItem('open_route')) {
    localStorage.removeItem('open_route');
    return renderRoutes(openRoutes, null);
  } else {
    return renderRoutes(routesConfig, serviceRoutes);
  }
}

export default PageRoutes;
