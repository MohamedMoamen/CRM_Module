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
import AdminTickets from './pages/Admin/AdminTickets';
import TicketDetails from './pages/TicketDetails';
import SalesTickets from './pages/Sales/SalesTickets';
import SupportTickets from './pages/Support/SupportTickets';
import SalesDashboard from './pages/Sales/SalesDashboard';
import SupportDashboard from './pages/Support/SupportDashboard';
import AdminLogs from './pages/Admin/AdminLogs';
import AdminLogDetails from './pages/Admin/AdminLogDetails';

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
                <Route path="/admin/tickets" element={<AdminTickets />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
                <Route path="/admin/logs/:id" element={<AdminLogDetails />} />

                {/* Sales Pages */}
                
                <Route path="/sales/dashboard" element={<SalesDashboard />} />
                <Route path="/sales/leads" element={<SalesLeads />} />
                <Route path="/sales/customers" element={<SalesCustomers />} />
                <Route path="/sales/deals" element={<SalesDeals />} />
                <Route path="/sales/tickets" element={<SalesTickets />} />

                 {/* Support Pages */}
                 <Route path="/support/dashboard" element={<SupportDashboard />} />
                 <Route path="/support/tickets" element={<SupportTickets />} />


                {/* Ticket Details Page */}
                <Route path="/ticket/:id" element={<TicketDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
