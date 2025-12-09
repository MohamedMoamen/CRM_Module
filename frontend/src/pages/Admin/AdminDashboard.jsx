import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

export default function AdminDashboard() {
    return (
        <div>
            <AdminNavbar/>
            <h1>Admin Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/sales">Manage Sales Users</Link></li>
                    <li><Link to="/admin/support">Manage Support Users</Link></li>
                </ul>
            </nav>
        </div>
    );
}
