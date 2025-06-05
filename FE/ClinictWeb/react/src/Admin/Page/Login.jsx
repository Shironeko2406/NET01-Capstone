import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
    Shield,
    Clock,
    Users,
    Heart,
    Phone,
    MapPin,
    Globe,
    User,
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { LoginActionAsync } from '../../Redux/ReducerAPI/AuthenticationReducer';
import { USER_LOGIN } from '../../Utils/Interceptor';
import { getDataJSONStorage } from '../../Utils/UtilFunction';
import { useNavigateByRole } from '../../Hooks/UseNavigateByRole';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { run } = useAsyncAction();
    const navigateByRole = useNavigateByRole();

    const loginForm = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Tên đăng nhập không được để trống'),
            password: Yup.string().required('Mật khẩu không được để trống'),
        }),
        onSubmit: values => {
            run(LoginActionAsync(values), () => {
                const userLogin = getDataJSONStorage(USER_LOGIN);
                if (userLogin) {
                    navigateByRole(userLogin.role);
                } else {
                    navigateByRole(null);
                }
            });
        },
    });

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">UMC Clinic</h1>
                        <p className="text-blue-100 text-xs">Hệ thống quản lý phòng khám</p>
                    </div>
                </div>
            </div>

            {/* Left Branding Section */}
            <div className="w-full lg:w-3/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden hidden lg:block">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
                    {/* Header */}
                    <div>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">UMC Clinic</h1>
                                <p className="text-blue-100 text-sm">Hệ thống quản lý phòng khám</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold leading-tight">
                                Chào mừng đến với
                                <br />
                                <span className="text-yellow-300">Hệ thống quản lý</span>
                                <br />
                                hiện đại
                            </h2>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-blue-100">Tính năng nổi bật</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <Shield className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <p className="font-medium">Bảo mật cao</p>
                                    <p className="text-sm text-blue-100">Dữ liệu được mã hóa</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <Clock className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <p className="font-medium">24/7 Hỗ trợ</p>
                                    <p className="text-sm text-blue-100">Luôn sẵn sàng phục vụ</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <Users className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <p className="font-medium">Đa người dùng</p>
                                    <p className="text-sm text-blue-100">Phân quyền linh hoạt</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <Globe className="w-6 h-6 text-yellow-300" />
                                <div>
                                    <p className="font-medium">Truy cập mọi lúc</p>
                                    <p className="text-sm text-blue-100">Web-based platform</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-blue-100">
                            <Phone className="w-5 h-5" />
                            <span>Hotline: 1900 1234</span>
                        </div>
                        <div className="flex items-center space-x-3 text-blue-100">
                            <MapPin className="w-5 h-5" />
                            <span>123 Đường ABC, Quận 1, TP.HCM</span>
                        </div>
                        <div className="flex items-center space-x-3 text-blue-100">
                            <Mail className="w-5 h-5" />
                            <span>support@umcclinic.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Login Section */}
            <div className="w-full lg:w-2/5 flex items-center justify-center bg-gray-50 relative min-h-screen">
                {/* Decorative gradient line */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500"></div>

                <div className="w-full max-w-md mx-auto px-4 sm:px-0">
                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Đăng nhập</h2>
                            <p className="text-gray-600 text-sm">Truy cập hệ thống quản lý</p>
                        </div>

                        <form className="space-y-5" onSubmit={loginForm.handleSubmit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên đăng nhập
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />{' '}
                                        {/* Bạn có thể đổi icon nếu muốn */}
                                    </div>
                                    <Input
                                        name="username"
                                        type="text"
                                        onChange={loginForm.handleChange}
                                        onBlur={loginForm.handleBlur}
                                        value={loginForm.values.username}
                                        placeholder="Enter your username"
                                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                                {loginForm.touched.username && loginForm.errors.username && (
                                    <p className="text-sm text-red-500">
                                        {loginForm.errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={loginForm.handleChange}
                                        onBlur={loginForm.handleBlur}
                                        value={loginForm.values.password}
                                        placeholder="••••••••"
                                        className="pl-10 pr-12 h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {loginForm.touched.password && loginForm.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {loginForm.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-600">Ghi nhớ</span>
                                </label>
                                <a
                                    href="#"
                                    className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 sm:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                            >
                                <span className="flex items-center justify-center space-x-2">
                                    <span>Đăng nhập</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        {/* <div className="text-center mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{' '}
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                                >
                                    Liên hệ quản trị viên
                                </a>
                            </p>
                        </div> */}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-xs text-gray-500">
                        © 2025 UMC Clinic. Bảo mật và an toàn.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
