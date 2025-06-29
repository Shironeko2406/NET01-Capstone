import { useState, useRef, useCallback, useEffect } from 'react';
import { Form, message } from 'antd';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentOverview from '../Components/AppointmentOverview';
import AppointmentInfoDetailCard from '../Components/AppointmentInfoDetailCard';
import AppointmentStepTabs from '../Components/AppointmentStepTabs';
import ExaminationTab from '../Components/ExaminationTab';
import {
    GetAppointmentDetailByIdActionAsync,
    setPrescription,
    UpdateConclusionAppointmentByIdActionAsync,
    UpdateStatusAppointmentByIdActionAsync,
    UpdateSymptomAppointmentByIdActionAsync,
} from '../../Redux/ReducerAPI/AppointmentReducer';
import LabServiceList from '../Components/LabServiceList';
import LabServiceHistory from '../Components/LabServiceHistory';
import AddLabServiceModal from '../Modal/AddLabServiceModal';
import DiagnosisTab from '../Components/DiagnosisTab';
import PrescriptionTab from '../Components/PrescriptionTab';
import AddPrescriptionModal from '../Modal/AddPrescriptionModal';
import useQueryParam from '../../Hooks/UseQueryParam';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { GetAllServicesActionAsync } from '../../Redux/ReducerAPI/ServiceReducer';
import {
    CreateLabServicesForAppointmentByIdActionAsync,
    DeleteLabServicesByIdActionAsync,
    UpdateNoteLabServicesByIdActionAsync,
    UpdateStatusLabServicesByIdActionAsync,
} from '../../Redux/ReducerAPI/AppointmentServiceReducer';
import { GetAllMedicineActionAsync } from '../../Redux/ReducerAPI/MedicineReducer';
import { UpdatePrescriptionByAppointmentIdActionAsync } from '../../Redux/ReducerAPI/PrescriptionReducer';
import { getMedicineUnitTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';
import PaymentSummaryTab from '../Components/PaymentSummaryTab';

const AppointmentDetail = () => {
    // ==================== REDUX & HOOKS ====================
    const { appointmentInfo, appointmentService, prescription } = useSelector(
        state => state.AppointmentReducer
    );
    const dispatch = useDispatch();
    const appointmentId = useQueryParam('id');
    const { run } = useAsyncAction();

    // ==================== CORE STATE ====================
    const [activeTab, setActiveTab] = useState('examination');

    // ==================== FORM INSTANCES ====================
    const [examinationForm] = Form.useForm();
    const [diagnosisForm] = Form.useForm();
    const [prescriptionForm] = Form.useForm();

    // ==================== LAB SERVICE MANAGEMENT ====================
    // Lab service dialog state
    const [isLabServiceDialogOpen, setIsLabServiceDialogOpen] = useState(false);
    const [selectedServicesInDialog, setSelectedServicesInDialog] = useState([]);
    const serviceNotesRef = useRef({});
    const [editingServiceId, setEditingServiceId] = useState(null);
    const editNoteRef = useRef('');

    // ==================== PRESCRIPTION MANAGEMENT ====================
    // Prescription dialog state
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
    const [medicineQuantities, setMedicineQuantities] = useState({});
    const [searchMedicine, setSearchMedicine] = useState('');
    const dosageInstructionsRef = useRef({});

    // ==================== INITIALIZATION ====================
    useEffect(() => {
        dispatch(GetAppointmentDetailByIdActionAsync(appointmentId));
        dispatch(GetAllServicesActionAsync());
        dispatch(GetAllMedicineActionAsync());
    }, [appointmentId]);

    // ==================== LAB SERVICE EDIT HANDLERS ====================
    const handleEditNote = service => {
        setEditingServiceId(service.appointmentServiceId);
        editNoteRef.current = service.note || '';
    };

    const handleSaveNote = appointmentServiceId => {
        run(
            UpdateNoteLabServicesByIdActionAsync(
                appointmentServiceId,
                editNoteRef.current,
                appointmentId
            ),
            () => {
                setEditingServiceId(null);
            }
        );
    };

    const handleCancelEdit = () => {
        setEditingServiceId(null);
        editNoteRef.current = '';
    };

    const handleNoteInputChange = e => {
        editNoteRef.current = e.target.value;
    };

    // ==================== LAB SERVICE DIALOG HANDLERS ====================
    const handleOpenLabServiceDialog = () => {
        setSelectedServicesInDialog([...appointmentService]);
        setIsLabServiceDialogOpen(true);
    };

    const handleSaveSelectedServices = () => {
        const newlyAddedServices = selectedServicesInDialog.filter(
            s => !appointmentService.some(as => as.serviceId === s.serviceId)
        );
        run(
            CreateLabServicesForAppointmentByIdActionAsync(appointmentId, newlyAddedServices),
            () => {
                setIsLabServiceDialogOpen(false);
            }
        );
    };

    const handleServiceSelectionChange = (service, checked) => {
        if (checked) {
            const newService = {
                serviceId: service.serviceId,
                note: serviceNotesRef.current[service.serviceId] || '',
            };
            setSelectedServicesInDialog(prev => [...prev, newService]);
        } else {
            const isOriginalService = appointmentService.some(
                s => s.serviceId === service.serviceId
            );
            if (!isOriginalService) {
                setSelectedServicesInDialog(prev =>
                    prev.filter(s => s.serviceId !== service.serviceId)
                );
                // Remove note when unchecking
                delete serviceNotesRef.current[service.serviceId];
            }
        }
    };

    const handleNoteBlur = useCallback((serviceId, value) => {
        serviceNotesRef.current[serviceId] = value;
        setSelectedServicesInDialog(prev =>
            prev.map(service =>
                service.serviceId === serviceId ? { ...service, note: value } : service
            )
        );
    }, []);

    const handleNoteChange = useCallback((serviceId, value) => {
        serviceNotesRef.current[serviceId] = value;
    }, []);

    // ==================== LAB SERVICE CRUD HANDLERS ====================
    const handleRemoveLabService = appointmentServiceId => {
        run(DeleteLabServicesByIdActionAsync(appointmentServiceId, appointmentId), () => {});
    };

    const handleSendRequestLabService = appointmentServiceId => {
        run(
            UpdateStatusLabServicesByIdActionAsync(
                appointmentServiceId,
                'InProgress',
                appointmentId
            ),
            () => {}
        );
    };

    // ==================== PRESCRIPTION HANDLERS ====================
    const handleAddMedication = (medication, quantity) => {
        if (quantity <= 0) {
            message.error('Số lượng phải lớn hơn 0');
            return;
        }

        if (medication.status === 'OutOfStock') {
            message.error('Thuốc này hiện đã hết hàng');
            return;
        }

        if (quantity > medication.stockQuantity) {
            message.error(
                `Số lượng vượt quá tồn kho (${medication.stockQuantity} ${medication.unit})`
            );
            return;
        }

        const currentPrescription = prescription; // from Redux
        const existingIndex = currentPrescription?.prescriptionDetails.findIndex(
            m => m.medicineId === medication.medicineId
        );

        let updatedPrescriptionDetails;

        if (existingIndex !== -1) {
            // Cộng thêm số lượng thuốc đã có
            updatedPrescriptionDetails = [...currentPrescription.prescriptionDetails];
            updatedPrescriptionDetails[existingIndex] = {
                ...updatedPrescriptionDetails[existingIndex],
                quantity: updatedPrescriptionDetails[existingIndex].quantity + quantity,
                dosageInstructions:
                    dosageInstructionsRef.current[medication.medicineId] ||
                    updatedPrescriptionDetails[existingIndex].dosageInstructions,
            };
            message.success(
                `Đã cộng thêm ${quantity} ${getMedicineUnitTranslate(medication.unit)} ${
                    medication.name
                }`
            );
        } else {
            // Thêm thuốc mới
            const newMedication = {
                medicineId: medication.medicineId,
                medicineName: medication.name,
                quantity,
                dosageInstructions:
                    dosageInstructionsRef.current[medication.medicineId] || '1 lần/ngày',
                unit: medication.unit,
                price: medication.price,
            };
            updatedPrescriptionDetails = [
                ...currentPrescription.prescriptionDetails,
                newMedication,
            ];
            message.success(
                `Đã thêm ${quantity} ${getMedicineUnitTranslate(medication.unit)} ${
                    medication.name
                }`
            );
        }

        // Dispatch cập nhật prescription mới
        dispatch(
            setPrescription({
                ...currentPrescription,
                prescriptionDetails: updatedPrescriptionDetails,
            })
        );

        // Reset lại form input
        setMedicineQuantities(prev => ({
            ...prev,
            [medication.medicineId]: 1,
        }));
        delete dosageInstructionsRef.current[medication.medicineId];
    };

    const handleRemoveMedication = medicineId => {
        const updatedPrescriptionDetails = prescription.prescriptionDetails.filter(
            m => m.medicineId !== medicineId
        );

        dispatch(
            setPrescription({
                ...prescription,
                prescriptionDetails: updatedPrescriptionDetails,
            })
        );

        message.success('Đã xoá thuốc khỏi đơn thuốc');
    };

    const handleDosageInstructionsChange = useCallback((medicineId, value) => {
        dosageInstructionsRef.current[medicineId] = value;
    }, []);

    const handleDosageInstructionsBlur = useCallback((medicineId, value) => {
        // Save to ref
        dosageInstructionsRef.current[medicineId] = value;
    }, []);

    // ==================== FORM SAVE HANDLERS ====================
    const handleSaveExamination = values => {
        run(UpdateSymptomAppointmentByIdActionAsync(appointmentId, values), () => {});
    };

    const handleSaveDiagnosis = values => {
        run(UpdateConclusionAppointmentByIdActionAsync(appointmentId, values), () => {});
    };

    const handleSavePrescription = values => {
        const dataSend = {
            notes: values.notes,
            medicines: prescription.prescriptionDetails.map(med => ({
                medicineId: med.medicineId,
                quantity: med.quantity,
                dosageInstructions: med.dosageInstructions,
            })),
        };

        run(UpdatePrescriptionByAppointmentIdActionAsync(dataSend, appointmentId), () => {});
    };

    // ==================== PAYMENT & COMPLETION HANDLERS ====================

    const handleCompleteTreatment = () => {
        if (!appointmentInfo.symptoms || !appointmentInfo.generalConclusion) {
            message.error(
                'Vui lòng điền đầy đủ triệu chứng và kết luận chung trước khi gởi yêu cầu thanh toán.'
            );
            return;
        }

        if (!prescription) {
            message.error('Chưa có đơn thuốc.');
            return;
        }

        const incompleteServices = appointmentService.filter(service => {
            return (
                service.status !== 'Completed' ||
                !service.testResult ||
                service.testResult.result === null ||
                service.testResult.result?.trim() === ''
            );
        });

        if (incompleteServices && incompleteServices.length > 0) {
            message.error(
                'Tất cả dịch vụ xét nghiệm phải hoàn thành và có kết quả gởi yêu cầu thanh toán.'
            );
            return;
        }
        run(UpdateStatusAppointmentByIdActionAsync(appointmentId, 'PendingPayment'), () => {});
    };

    return (
        <div className="mx-auto space-y-6">
            {/* Enhanced Header */}
            <AppointmentOverview />

            {/* Enhanced Patient Summary Card */}
            <AppointmentInfoDetailCard />

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <AppointmentStepTabs />

                {/* Examination Tab */}
                <TabsContent value="examination">
                    <ExaminationTab
                        examinationForm={examinationForm}
                        handleSaveExamination={handleSaveExamination}
                    />
                </TabsContent>

                {/* Lab Services Tab */}
                <TabsContent value="lab-services">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LabServiceList
                            handleOpenLabServiceDialog={handleOpenLabServiceDialog}
                            handleRemoveLabService={handleRemoveLabService}
                            handleSendRequestLabService={handleSendRequestLabService}
                            editingServiceId={editingServiceId}
                            handleEditNote={handleEditNote}
                            handleSaveNote={handleSaveNote}
                            handleCancelEdit={handleCancelEdit}
                            handleNoteInputChange={handleNoteInputChange}
                        />
                        <LabServiceHistory />
                    </div>
                </TabsContent>

                {/* Other tabs remain the same... */}
                <TabsContent value="diagnosis">
                    <DiagnosisTab
                        diagnosisForm={diagnosisForm}
                        handleSaveDiagnosis={handleSaveDiagnosis}
                    />
                </TabsContent>

                <TabsContent value="prescription">
                    <PrescriptionTab
                        prescriptionForm={prescriptionForm}
                        setIsPrescriptionDialogOpen={setIsPrescriptionDialogOpen}
                        handleRemoveMedication={handleRemoveMedication}
                        handleSavePrescription={handleSavePrescription}
                    />
                </TabsContent>

                <TabsContent value="payment">
                    <PaymentSummaryTab handleCompleteTreatment={handleCompleteTreatment} />
                </TabsContent>
            </Tabs>

            {/* Lab Service Selection Dialog */}
            <AddLabServiceModal
                open={isLabServiceDialogOpen}
                onOpenChange={setIsLabServiceDialogOpen}
                selectedServicesInDialog={selectedServicesInDialog}
                handleServiceSelectionChange={handleServiceSelectionChange}
                handleNoteChange={handleNoteChange}
                handleNoteBlur={handleNoteBlur}
                handleSaveSelectedServices={handleSaveSelectedServices}
            />

            {/* Enhanced Medication Selection Dialog */}
            <AddPrescriptionModal
                isOpen={isPrescriptionDialogOpen}
                onOpenChange={setIsPrescriptionDialogOpen}
                searchMedicine={searchMedicine}
                setSearchMedicine={setSearchMedicine}
                medicineQuantities={medicineQuantities}
                setMedicineQuantities={setMedicineQuantities}
                handleAddMedication={handleAddMedication}
                handleDosageInstructionsChange={handleDosageInstructionsChange}
                handleDosageInstructionsBlur={handleDosageInstructionsBlur}
            />
        </div>
    );
};

export default AppointmentDetail;
