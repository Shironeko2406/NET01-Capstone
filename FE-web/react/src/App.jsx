import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './User/Page/HomePage';
import TempUser from './User/TempUIUser/TempUser';
import Login from './User/Page/Login';
import Register from './User/Page/Register';
import BookingPage from './User/Page/BookingPage';
import BookingSuccessPage from './User/Page/BookingSuccessPage';
import AppointmentManagement from './User/Page/AppoinmentManagement';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="" element={<TempUser />}>
                    <Route path="" element={<HomePage />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/booking" element={<BookingPage />}></Route>
                    <Route path="/booking/success" element={<BookingSuccessPage />}></Route>
                    <Route path="/appointment" element={<AppointmentManagement />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
