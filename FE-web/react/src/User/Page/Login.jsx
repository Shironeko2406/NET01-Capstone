import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { LoginActionAsync } from '../../Redux/ReducerAPI/AuthenticationReducer';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { run } = useAsyncAction();

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
                navigate('/login');
            });
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-gray-50 flex items-center justify-center py-12 px-0 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-sky-100 p-8 space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Đăng nhập</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200"
                        >
                            Đăng ký miễn phí
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={loginForm.handleSubmit}>
                    {/* Username Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={loginForm.values.username}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                loginForm.errors.username && loginForm.touched.username
                                    ? 'border-red-500'
                                    : 'border-sky-200'
                            } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 sm:text-sm`}
                            placeholder="Nhập tên đăng nhập"
                        />
                        {loginForm.errors.username && loginForm.touched.username && (
                            <div className="text-sm text-red-600 mt-1">
                                {loginForm.errors.username}
                            </div>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={loginForm.values.password}
                                onChange={loginForm.handleChange}
                                onBlur={loginForm.handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    loginForm.errors.password && loginForm.touched.password
                                        ? 'border-red-500'
                                        : 'border-sky-200'
                                } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 sm:text-sm`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {loginForm.errors.password && loginForm.touched.password && (
                            <div className="text-sm text-red-600 mt-1">
                                {loginForm.errors.password}
                            </div>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-gray-700">
                                Ghi nhớ tôi
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md text-white bg-sky-500 hover:bg-sky-600"
                    >
                        Đăng nhập
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
