import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeAdmin from './Admin/Page/HomeAdmin';
import TempAdmin from './Admin/TempUIAdmin/TempAdmin';
import Login from './Admin/Page/Login';
import Register from './Admin/Page/Register';
import TempDoctor from './Doctor/TempUIDoctor/TempDoctor';
import HomeDoctor from './Doctor/Page/HomeDoctor';
import TempLabTechnician from './LabTechnician/TemUILabTechnician/TempLabTechnician';
import HomeLabTechnician from './LabTechnician/Page/HomeLabTechnician';
import TempReceptionist from './Receptionist/TempUIReceptionist/TempReceptionist';
import HomeReceptionist from './Receptionist/Page/HomeReceptionist';
import ProtectedRoute from './Utils/ProtectedRoute';
import AnonymousRoute from './Utils/AnonymousRoute';
import ServiceManagement from './Admin/Page/ServiceManagement';
import SpecialtyManagement from './Admin/Page/SpecialtyManagement';
import UserManagement from './Admin/Page/UserManager';
import MedicineTypeManagement from './Admin/Page/MedicineTypeManagement';
import CreateUser from './Admin/Page/CreateUser';
import MedicineManagement from './Admin/Page/MedicineManagement';
import MedicineStockHistoryManagement from './Admin/Page/MedicineStockHistoryManagement';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route element={<AnonymousRoute />}>
                    <Route path="/" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute requiredRole="Administrator" />}>
                    <Route path="admin" element={<TempAdmin />}>
                        <Route path="" element={<HomeAdmin />} />
                        <Route path="services" element={<ServiceManagement />} />
                        <Route path="specialty" element={<SpecialtyManagement />} />
                        <Route path="user" element={<UserManagement />} />
                        <Route path="user/create" element={<CreateUser />} />
                        <Route path="medicine-type" element={<MedicineTypeManagement />} />
                        <Route path="medicine" element={<MedicineManagement />} />
                        <Route
                            path="medicine/history"
                            element={<MedicineStockHistoryManagement />}
                        />
                    </Route>
                </Route>

                {/* Doctor routes */}
                <Route element={<ProtectedRoute requiredRole="Doctor" />}>
                    <Route path="doctor" element={<TempDoctor />}>
                        <Route index element={<HomeDoctor />} />
                    </Route>
                </Route>

                {/* Lab Technician routes */}
                <Route element={<ProtectedRoute requiredRole="LabTechnician" />}>
                    <Route path="labTech" element={<TempLabTechnician />}>
                        <Route index element={<HomeLabTechnician />} />
                    </Route>
                </Route>

                {/* Receptionist routes */}
                <Route element={<ProtectedRoute requiredRole="Receptionist" />}>
                    <Route path="receptionist" element={<TempReceptionist />}>
                        <Route index element={<HomeReceptionist />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
