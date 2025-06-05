// src/components/Header.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { brandData, navigationData } from '../../Utils/Data/NavigationData';
import MobileMenu from './MobileMenu';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation(); // Get current route
    const navigate = useNavigate(); // For navigation

    const isBookingPage = location.pathname === '/booking';

    return (
        <>
            <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-sky-100 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo and Brand */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                                <brandData.logo className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                                    {brandData.name}
                                </h1>
                                <p className="text-xs text-gray-600 hidden sm:block leading-tight">
                                    {brandData.tagline}
                                </p>
                            </div>
                        </Link>

                        {isBookingPage ? (
                            /* Booking Page Header Content */
                            <Link to="/">
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Quay về
                                </Button>
                            </Link>
                        ) : (
                            /* Default Header Content */
                            <>
                                {/* Desktop Navigation */}
                                <nav className="hidden lg:flex items-center space-x-1">
                                    {navigationData.map(item => (
                                        <div key={item.title}>
                                            {item.subItems ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="text-gray-700 hover:text-sky-600 hover:bg-sky-50 font-medium px-4 py-2 h-auto"
                                                        >
                                                            <span className="flex items-center space-x-1">
                                                                <span>{item.title}</span>
                                                                <ChevronDown className="h-3 w-3" />
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="start"
                                                        className="w-80 p-2 bg-white/95 backdrop-blur-md border-sky-100"
                                                    >
                                                        {item.subItems.map((subItem, index) => (
                                                            <React.Fragment key={subItem.title}>
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        to={subItem.href}
                                                                        className="flex items-start space-x-3 p-3 rounded-md hover:bg-sky-50 cursor-pointer"
                                                                    >
                                                                        {subItem.icon && (
                                                                            <subItem.icon className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                                                                        )}
                                                                        <div className="flex-1">
                                                                            <div className="font-medium text-gray-900">
                                                                                {subItem.title}
                                                                            </div>
                                                                            {subItem.description && (
                                                                                <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                                                                                    {
                                                                                        subItem.description
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {index <
                                                                    item.subItems.length - 1 && (
                                                                    <DropdownMenuSeparator />
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <Link
                                                    to={item.href}
                                                    className="text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-all duration-200 font-medium px-4 py-2 rounded-md"
                                                >
                                                    {item.title}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </nav>

                                {/* Desktop Auth Buttons */}
                                <div className="hidden lg:flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/login')}
                                        className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 font-medium px-6"
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium px-6"
                                    >
                                        Đăng ký miễn phí
                                    </Button>
                                </div>

                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden p-2"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && !isBookingPage && (
                <MobileMenu setMobileMenuOpen={setMobileMenuOpen} />
            )}
        </>
    );
};

export default Header;
