import React from 'react';
import { Bell, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { logout } from '../../Utils/UtilFunction';

const Navbar = ({ onMenuButtonClick, sidebarOpen }) => {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-emerald-200 bg-white/90 backdrop-blur-md px-4 shadow-sm dark:border-blue-800 dark:bg-gray-950/80">
            {/* Menu toggle button */}
            <Button
                variant="ghost"
                size="icon"
                className="mr-4 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-8 w-8"
                onClick={onMenuButtonClick}
            >
                {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Empty space for flex layout */}
            <div className="flex-1"></div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-8 w-8"
                >
                    <Sun
                        size={18}
                        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <Moon
                        size={18}
                        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-8 w-8"
                        >
                            <Bell size={18} />
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-0 text-xs text-white">
                                3
                            </Badge>
                            <span className="sr-only">Thông báo</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="text-emerald-900">
                            Thông báo mới
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-80 overflow-y-auto">
                            {[1, 2, 3].map(i => (
                                <DropdownMenuItem
                                    key={i}
                                    className="cursor-pointer p-4 hover:bg-emerald-50"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                U{i}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-emerald-900">
                                                Thông báo mới #{i}
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                                Bạn có một thông báo mới từ hệ thống.
                                            </p>
                                            <p className="text-xs text-emerald-400">
                                                {i * 2} giờ trước
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer justify-center">
                            <Button
                                variant="ghost"
                                className="w-full text-emerald-600 hover:text-emerald-700"
                            >
                                Xem tất cả
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative flex items-center gap-2 rounded-full px-2 hover:bg-emerald-50 h-8"
                        >
                            <Avatar className="h-7 w-7 ring-2 ring-emerald-200">
                                <AvatarImage src="/placeholder.svg?height=28&width=28" />
                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs">
                                    BS
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium text-emerald-900 md:inline">
                                Dr. Nguyễn Văn A
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-emerald-900">
                            Tài khoản của tôi
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                            <span className="text-emerald-700">Hồ sơ cá nhân</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                            <span className="text-emerald-700">Cài đặt tài khoản</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-emerald-50">
                            <span className="text-emerald-700">Trợ giúp</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer hover:bg-red-50"
                            onClick={logout}
                        >
                            <span className="text-red-600">Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Navbar;
