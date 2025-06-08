import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { navigationData } from '../../Utils/Data/NavigationData';

const MobileMenu = ({ setMobileMenuOpen, loggedInPatient, onLogout }) => {
    const [openItems, setOpenItems] = useState([]);
    const navigate = useNavigate();

    const toggleItem = title => {
        setOpenItems(prev =>
            prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]
        );
    };

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        setMobileMenuOpen(false);
    };

    const getUserInitials = name => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setMobileMenuOpen(false);
    };

    const handleSettingsClick = () => {
        navigate('/settings');
        setMobileMenuOpen(false);
    };

    const handleAuthClick = path => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-sky-100 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="container mx-auto px-4 py-6">
                {loggedInPatient && (
                    <div className="pb-6 mb-6 border-b border-sky-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={loggedInPatient?.Avatar}
                                    alt={loggedInPatient?.FullName || 'User'}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {loggedInPatient?.name ||
                                        loggedInPatient?.fullName ||
                                        'Người dùng'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {loggedInPatient?.email || 'email@example.com'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                                onClick={handleProfileClick}
                            >
                                <User className="mr-3 h-4 w-4" />
                                Thông tin tài khoản
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                                onClick={handleSettingsClick}
                            >
                                <Settings className="mr-3 h-4 w-4" />
                                Cài đặt
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex flex-col space-y-2">
                    {navigationData.map(item => (
                        <div key={item.title}>
                            {item.subItems ? (
                                <Collapsible
                                    open={openItems.includes(item.title)}
                                    onOpenChange={() => toggleItem(item.title)}
                                >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 px-4 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200 group">
                                        <div className="flex items-center space-x-3">
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        {openItems.includes(item.title) ? (
                                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                        )}
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-4 mt-2 space-y-1">
                                        {item.subItems.map(subItem => (
                                            <Link
                                                key={subItem.title}
                                                to={subItem.href}
                                                className="flex items-start space-x-3 py-2 px-4 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors duration-200"
                                                onClick={handleLinkClick}
                                            >
                                                {subItem.icon && (
                                                    <subItem.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {subItem.title}
                                                    </div>
                                                    {subItem.description && (
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {subItem.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <Link
                                    to={item.href}
                                    className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200 font-medium"
                                    onClick={handleLinkClick}
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {!loggedInPatient && (
                    <div className="flex flex-col space-y-3 pt-6 mt-6 border-t border-sky-100">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 w-full justify-center font-medium"
                            onClick={() => handleAuthClick('/login')}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 w-full justify-center font-medium"
                            onClick={() => handleAuthClick('/register')}
                        >
                            Đăng ký miễn phí
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileMenu;
