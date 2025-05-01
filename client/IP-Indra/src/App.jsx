import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import PublicLayout from "./layouts/publicLayout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MyFavorite from "./pages/myfavorite";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/myfavorite" element={<MyFavorite />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
