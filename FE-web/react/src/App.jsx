import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './User/Page/HomePage';
import TempUser from './User/TempUIUser/TempUser';
import Login from './User/Page/Login';
import Register from './User/Page/Register';
import BookingPage from './User/Page/BookingPage';
import BookingSuccessPage from './User/Page/BookingSuccessPage';
import AppointmentManagement from './User/Page/AppoinmentManagement';
import AnonymousRoute from './Utils/AnonymousRoute';
import ProtectedRoute from './Utils/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<TempUser />}>
                    <Route path="" element={<HomePage />} />

                    <Route
                        path="/login"
                        element={
                            <AnonymousRoute>
                                <Login />
                            </AnonymousRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <AnonymousRoute>
                                <Register />
                            </AnonymousRoute>
                        }
                    />

                    <Route
                        path="/booking"
                        element={
                            <ProtectedRoute>
                                <BookingPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/booking/success"
                        element={
                            <ProtectedRoute>
                                <BookingSuccessPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appointment"
                        element={
                            <ProtectedRoute>
                                <AppointmentManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
