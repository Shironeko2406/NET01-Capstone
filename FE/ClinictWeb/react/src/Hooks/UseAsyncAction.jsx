import { useDispatch } from 'react-redux';
import { useGlobalLoading } from '../Context/LoadingContext';
import { useMessage } from '../Context/MessageContext';

export const useAsyncAction = () => {
    const dispatch = useDispatch();
    const { showLoading, hideLoading } = useGlobalLoading();
    const { showMessage } = useMessage();

    const run = async (action, onSuccess) => {
        try {
            showLoading();
            const result = await dispatch(action);
            if (result.success) {
                showMessage(result.message || 'Thành công!', 'success');
                if (onSuccess) onSuccess(result.data);
            } else {
                showMessage(result.message || 'Đã xảy ra lỗi!', 'error');
            }
        } catch (err) {
            console.error('Error:', err);
            showMessage('Hệ thống lỗi!', 'error');
        } finally {
            hideLoading();
        }
    };

    return { run };
};
