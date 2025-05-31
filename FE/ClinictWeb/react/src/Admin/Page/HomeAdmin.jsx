import React from 'react';

const HomeAdmin = () => {
    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="text-center">
                <div className="mx-auto mb-6 h-28 w-28 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg
                        className="h-14 w-14 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2v2m0-2h2m-2 0H10"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                    Hệ thống quản lý phòng khám
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Chọn chức năng từ menu để quản lý hoạt động phòng khám
                </p>
                <div className="mt-6 flex justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-emerald-200">
                        <p className="text-sm text-emerald-600 font-medium">
                            Chào mừng bác sĩ đến với hệ thống quản lý
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomeAdmin;
