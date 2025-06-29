import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const usePaymentCalculation = () => {
    const { appointmentInfo, appointmentService, prescription } = useSelector(
        state => state.AppointmentReducer
    );

    const paymentData = useMemo(() => {
        // Tính phí khám bệnh từ appointmentInfo
        const examinationFee = 350000;

        // Tính phí xét nghiệm từ appointmentService
        const labFees =
            appointmentService?.reduce((sum, service) => {
                return sum + (service.price || 0);
            }, 0) || 0;

        // Tính tiền thuốc từ prescription
        const medicationFees =
            prescription?.prescriptionDetails?.reduce((sum, med) => {
                return sum + (med.price || 0) * (med.quantity || 0);
            }, 0) || 0;

        // Tính tổng
        const total = examinationFee + labFees + medicationFees;

        return {
            examinationFee,
            labFees,
            medicationFees,
            total,
        };
    }, [appointmentInfo, appointmentService, prescription]);

    return paymentData;
};
