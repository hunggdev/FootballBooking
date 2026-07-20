import { BrowserRouter, Routes, Route } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import {Toaster} from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute";


function App() {

  return <>
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>

        {/* public routes*/}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* protected routes*/}
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<HomePage/>} />
        </Route>



      </Routes>
    </BrowserRouter>
  </>
}

export default App;
