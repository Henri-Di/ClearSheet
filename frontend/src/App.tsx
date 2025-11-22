import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { privateRoutes, publicRoutes } from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {privateRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
