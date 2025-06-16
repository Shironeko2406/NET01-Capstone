import { timeSlots } from './Data/BookingData';

export const getSelectedTimeSlotId = (startTime, endTime) => {
    if (!startTime || !endTime) return '';

    const selectedSlot = timeSlots.find(
        slot => slot.startTime === startTime && slot.endTime === endTime
    );
    return selectedSlot.id;
};
