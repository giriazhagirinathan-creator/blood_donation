import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import PatientDetails from './pages/PatientDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<RequestForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
