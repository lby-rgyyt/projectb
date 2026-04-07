import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import HRRoute from "./routes/HRRoute";

import MainLayout from "./layouts/MainLayout";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import OnboardingApplicationPage from "./pages/OnboardingApplicationPage";
import EmployeeInfoPage from "./pages/EmployeeInfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import EmployeeProfilesPage from "./pages/EmployeeProfilesPage";
import HiringManagementPage from "./pages/HiringManagementPage";
import VisaStatusManagementPage from "./pages/VisaStatusManagementPage";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { fetchCurrentEmployee } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentEmployee());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/onboarding-application"
              element={<OnboardingApplicationPage />}
            />
            <Route path="/personal-info" element={<EmployeeInfoPage />} />
            <Route path="/visa-status" element={<VisaStatusManagementPage />} />

            <Route element={<HRRoute />}>
              <Route path="/employees" element={<EmployeeProfilesPage />} />
              <Route
                path="/employees/onboarding-application/:id"
                element={<OnboardingApplicationPage />}
              />
              <Route path="/employees/:id" element={<EmployeeInfoPage />} />
              <Route path="/hiring" element={<HiringManagementPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
