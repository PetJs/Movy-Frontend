import { Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import DashboardPage from "./pages/dashboardPage";
import MoviePage from "./pages/moviePage";
import Login from "./pages/loginPage";
import StreamingPage from "./pages/streamingPage";
import UserProfile from "./pages/porfilePage";
import TVShowPage from "./pages/tvShowPage";
import WatchlistPage from "./pages/watchlistPage";
import ProtectedRoute from "./context/protectedRoute";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moviePage"
        element={
          <ProtectedRoute>
            <MoviePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tv-page"
        element={
          <ProtectedRoute>
            <TVShowPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stream"
        element={
          <ProtectedRoute>
            <StreamingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
