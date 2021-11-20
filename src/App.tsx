import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomeDemo } from "./pages/Home";
import { Page1 } from "./pages/Page1";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDemo />} />
        <Route path="page1" element={<Page1 />} />
        {/* <Route path="sent" element={<SentInvoices />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
