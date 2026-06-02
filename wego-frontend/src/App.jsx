import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {Home} from "./pages/Home";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import MyReservations from "./pages/MyReservations";
import AddVehicle from "./pages/AddVehicle";
import RideDetail from "./pages/RideDetail";
import Profile from "./pages/Profile";

function App() {
  return (
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-ride" element={<CreateRide />} />
              <Route path="/my-rides" element={<MyRides />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
              <Route path="/rides/:id" element={<RideDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;