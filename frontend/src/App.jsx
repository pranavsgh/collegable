import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Onboarding from "./pages/Onboarding"
import Dashboard from "./pages/Dashboard"
import Resources from "./pages/Resources"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App