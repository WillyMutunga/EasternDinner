import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Checkout from './pages/Checkout';
import AdminTickets from './pages/AdminTickets';
import CheckTicket from './pages/CheckTicket';
import AdminDocuments from './pages/AdminDocuments';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/check-ticket" element={<CheckTicket />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
