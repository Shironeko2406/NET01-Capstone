import React, { useState } from 'react';
import { Heart, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { footerData } from '@/Utils/Data/NavigationData';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Brand Section - Giảm không gian */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl shadow-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{footerData.brand.name}</h3>
                                <p className="text-sky-400 text-sm">
                                    Hệ thống quản lý y tế thông minh
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
                            {footerData.brand.description}
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm text-gray-300">
                                <MapPin className="h-4 w-4 text-sky-400 flex-shrink-0" />
                                <span>{footerData.contact.address}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-300">
                                <Phone className="h-4 w-4 text-sky-400 flex-shrink-0" />
                                <span>{footerData.contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-300">
                                <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                                <span>{footerData.contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-300">
                                <Clock className="h-4 w-4 text-sky-400 flex-shrink-0" />
                                <span>{footerData.contact.hours}</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections - Tăng không gian và chia thành 3 cột */}
                    <div className="lg:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {footerData.sections.map(section => (
                            <div key={section.title} className="space-y-4">
                                <h4 className="font-semibold text-sky-400 text-sm uppercase tracking-wider">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map(link => (
                                        <li key={link.title}>
                                            <Link
                                                to={link.href}
                                                className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm block"
                                            >
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
