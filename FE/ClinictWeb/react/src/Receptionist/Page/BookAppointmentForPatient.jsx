import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { GetCityDataActionAsync } from '../../Redux/ReducerAPI/CityReducer';
import ProgressSteps from '../Components/ProgressSteps';
import SpecialtySelection from '../Components/SpecialtySelection';
import AppointmentDateSelection from '../Components/AppointmentDateSelection';
import AppointmentTimeSelection from '../Components/AppointmentTimeSelection';
import DoctorSelection from '../Components/DoctorSelection';
import SelectedInfoSummary from '../Components/SelectedInfoSummary';
import AppointmentConfirmation from '../Components/AppointmentConfirmation';
import PatientInfoStep from '../Components/PatientInfoStep';
import { GetSpecialtiesActionAsync } from '../../Redux/ReducerAPI/SpecialtyReducer';
import { GetDoctorAvailableActionAsync } from '../../Redux/ReducerAPI/UsersReducer';
import { useNavigate } from 'react-router-dom';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateAppointmentForPatientActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';

const BookAppointmentForPatient = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [patientInfo, setPatientInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: null,
        gender: '',
        address: '',
    });
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentNote, setAppointmentNote] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [streetAddress, setStreetAddress] = useState('');
    const { cityData } = useSelector(state => state.CityReducer);
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { run } = useAsyncAction();

    useEffect(() => {
        if (!cityData.length) {
            dispatch(GetCityDataActionAsync());
        }
        if (!specialties.length) {
            dispatch(GetSpecialtiesActionAsync());
        }

        if (currentStep === 5 && selectedSpecialty && selectedDate && selectedTimeSlot) {
            const filter = {
                specialtyId: selectedSpecialty.specialtyId,
                date: selectedDate.format('YYYY-MM-DD'),
                startTime: selectedTimeSlot.startTime,
                endTime: selectedTimeSlot.endTime,
            };
            dispatch(GetDoctorAvailableActionAsync(filter));
        }
    }, [currentStep, selectedSpecialty, selectedDate, selectedTimeSlot, dispatch]);

    useEffect(() => {
        const fullAddress = [streetAddress, selectedWard, selectedDistrict, selectedCity]
            .filter(Boolean)
            .join(', ');
        setPatientInfo(prev => ({ ...prev, address: fullAddress }));
    }, [streetAddress, selectedWard, selectedDistrict, selectedCity]);

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return (
                    patientInfo.fullName &&
                    patientInfo.phoneNumber &&
                    patientInfo.dateOfBirth &&
                    patientInfo.gender &&
                    patientInfo.email
                );
            case 2:
                return selectedSpecialty !== null;
            case 3:
                return selectedDate !== null;
            case 4:
                return selectedTimeSlot !== null;
            case 5:
                return selectedDoctor !== null;
            case 6:
                return appointmentNote.trim() !== '';
            default:
                return false;
        }
    };

    const handleBooking = () => {
        const dataSend = {
            fullName: patientInfo.fullName,
            email: patientInfo.email,
            phoneNumber: patientInfo.phoneNumber,
            dateOfBirth: patientInfo.dateOfBirth,
            gender: patientInfo.gender,
            address: patientInfo.address,
            doctorId: selectedDoctor.userId,
            specialtyId: selectedSpecialty.specialtyId,
            appointmentDate: selectedDate,
            startTime: selectedTimeSlot.startTime,
            endTime: selectedTimeSlot.endTime,
            note: appointmentNote,
        };
        run(CreateAppointmentForPatientActionAsync(dataSend), () => {
            navigate('/');
        });
    };
    return (
        <>
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Đặt lịch hẹn</h1>
                    <p className="text-sm text-gray-500">
                        Tạo lịch hẹn khám bệnh mới cho bệnh nhân
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStep} />

            {/* Step Content */}
            {currentStep === 1 && (
                <PatientInfoStep
                    patientInfo={patientInfo}
                    setPatientInfo={setPatientInfo}
                    cityData={cityData}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedWard={selectedWard}
                    setSelectedWard={setSelectedWard}
                    streetAddress={streetAddress}
                    setStreetAddress={setStreetAddress}
                />
            )}

            {currentStep === 2 && (
                <SpecialtySelection
                    selectedSpecialty={selectedSpecialty}
                    onSpecialtySelect={setSelectedSpecialty}
                />
            )}

            {currentStep === 3 && (
                <AppointmentDateSelection
                    patientInfo={patientInfo}
                    selectedSpecialty={selectedSpecialty}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            )}

            {currentStep === 4 && (
                <AppointmentTimeSelection
                    patientInfo={patientInfo}
                    selectedSpecialty={selectedSpecialty}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    setSelectedTimeSlot={setSelectedTimeSlot}
                />
            )}

            {currentStep === 5 && (
                <DoctorSelection
                    patientInfo={patientInfo}
                    selectedSpecialty={selectedSpecialty}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    selectedDoctor={selectedDoctor}
                    setSelectedDoctor={setSelectedDoctor}
                />
            )}

            {currentStep === 6 && (
                <AppointmentConfirmation
                    patientInfo={patientInfo}
                    selectedSpecialty={selectedSpecialty}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    selectedDoctor={selectedDoctor}
                    appointmentNote={appointmentNote}
                    setAppointmentNote={setAppointmentNote}
                />
            )}

            {/* Navigation Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="flex items-center justify-center gap-1 text-sm h-10 border-gray-300 w-full sm:w-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>

                    {currentStep < 6 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-sm h-10 w-full sm:w-auto"
                        >
                            Tiếp tục
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            disabled={!canProceed()}
                            onClick={handleBooking}
                            className="bg-emerald-600 hover:bg-emerald-700 text-sm h-10 w-full sm:w-auto"
                        >
                            Xác nhận đặt lịch
                        </Button>
                    )}
                </div>
            </div>

            {/* Selected Info Summary */}
            {currentStep > 1 && currentStep < 6 && (
                <SelectedInfoSummary
                    currentStep={currentStep}
                    patientInfo={patientInfo}
                    selectedSpecialty={selectedSpecialty}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    selectedDoctor={selectedDoctor}
                />
            )}
        </>
    );
};

export default BookAppointmentForPatient;
