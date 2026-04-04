import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import HRRoute from "./routes/HRRoutes";

import MainLayout from "./layouts/MainLayout";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import OnboardingApplicationPage from "./pages/OnboardingApplicationPage";
import EmployeeInfoPage from "./pages/EmployeeInfoPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
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
              path="/onboardingApplication"
              element={<OnboardingApplicationPage />}
            />
            <Route path="/personal-info" element={<EmployeeInfoPage />} />

            <Route element={<HRRoute />}>
              <Route path="/employees/:id" element={<EmployeeInfoPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
