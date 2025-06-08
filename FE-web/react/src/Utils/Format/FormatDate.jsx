import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';
import { DEFAULT_TZ } from '../Interceptor';
import { upperFirst } from 'lodash';

// Kích hoạt plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

// Múi giờ mặc định

// Format ngày: 02/06/2025
const formatDate = dateString => {
    return dayjs(dateString).tz(DEFAULT_TZ).format('DD/MM/YYYY');
};

// Format ngày giờ: 02/06/2025 14:30
const formatDateTime = dateTimeString => {
    return dayjs(dateTimeString).tz(DEFAULT_TZ).format('DD/MM/YYYY HH:mm');
};

// Format theo ISO hoặc format tuỳ ý
const formatCustom = (dateString, format) => {
    return dayjs(dateString).tz(DEFAULT_TZ).format(format);
};

// Lấy đầu tháng (dạng ISO + giờ phút giây)
const getStartOfCurrentMonth = () => {
    return dayjs().tz(DEFAULT_TZ).startOf('month').format('YYYY-MM-DD HH:mm:ss');
};

// Lấy thời điểm hiện tại
const getNow = () => {
    return dayjs().tz(DEFAULT_TZ).format('YYYY-MM-DD HH:mm:ss');
};

const formatAppointmentDate = date => {
    const formatted = dayjs(date).format('dddd, DD/MM/YYYY');
    return upperFirst(formatted);
};

export {
    formatDate,
    formatDateTime,
    formatCustom,
    getStartOfCurrentMonth,
    getNow,
    formatAppointmentDate,
};
