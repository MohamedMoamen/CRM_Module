import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SalesUsers from './pages/Admin/SalesUsers';
import SupportUsers from './pages/Admin/SupportUsers';
import SalesLeads from './pages/Sales/SalesLeads';
import SalesCustomers from './pages/Sales/SalesCustomers';
import SalesDeals from './pages/Sales/SalesDeals';
import AdminLeads from './pages/Admin/AdminLeads';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AdminDeals from './pages/Admin/AdminDeals';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* Admin Pages */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/sales" element={<SalesUsers />} />               
                <Route path="/admin/support" element={<SupportUsers />} />
                <Route path="/admin/leads" element={<AdminLeads />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/deals" element={<AdminDeals />} />
                {/* Sales Pages */}
                <Route path="/sales/leads" element={<SalesLeads />} />
                <Route path="/sales/customers" element={<SalesCustomers />} />
                <Route path="/sales/deals" element={<SalesDeals />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
