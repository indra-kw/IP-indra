import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PublicLayout from "./layouts/publicLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MyFavorite from "./pages/myfavorite";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorite" element={<MyFavorite />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
