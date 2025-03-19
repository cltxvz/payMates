import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Event from "./pages/Event";
import JoinEvent from "./pages/JoinEvent"; // Import Join Event page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:eventId" element={<Event />} />
        <Route path="/join/:inviteCode" element={<JoinEvent />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;
