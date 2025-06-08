import React, { memo } from 'react';
import { stepTitles, stepTitlesMobile } from '../../Utils/Data/BookingData';
import { Check } from 'lucide-react';

const ProgressSteps = ({ currentStep }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="w-full overflow-x-auto">
                <div className="flex items-center justify-start min-w-max px-2">
                    {[1, 2, 3, 4, 5, 6].map(step => (
                        <div key={step} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300 ${
                                        currentStep >= step
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : currentStep === step
                                            ? 'bg-emerald-600 border-emerald-600 text-white'
                                            : 'border-gray-300 text-gray-400 bg-white'
                                    }`}
                                >
                                    {currentStep > step ? (
                                        <Check className="h-4 w-4 md:h-5 md:w-5" />
                                    ) : (
                                        <span className="text-xs md:text-sm font-semibold">
                                            {step}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 md:mt-2 text-center">
                                    <span
                                        className={`text-[10px] md:text-xs font-medium whitespace-nowrap ${
                                            currentStep >= step
                                                ? 'text-emerald-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        <span className="hidden sm:inline">
                                            {stepTitles[step - 1]}
                                        </span>
                                        <span className="sm:hidden">
                                            {stepTitlesMobile[step - 1]}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            {step < 6 && (
                                <div
                                    className={`w-6 md:w-12 lg:w-16 h-1 mx-1 md:mx-2 rounded-full transition-all duration-300 ${
                                        currentStep > step ? 'bg-emerald-600' : 'bg-gray-300'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ProgressSteps);
