import { useDispatch } from 'react-redux';
import { useGlobalLoading } from '../Context/LoadingContext';
import { useMessage } from '../Context/MessageContext';

export const useAsyncAction = () => {
    const dispatch = useDispatch();
    const { showLoading, hideLoading } = useGlobalLoading();
    const { showMessage } = useMessage();

    //   const run = async (action, successMessage, onSuccess) => {
    //     try {
    //       showLoading();
    //       const result = await dispatch(action);
    //       console.log(result)
    //       if (result === true || result?.success) {
    //         if (successMessage) showMessage(successMessage, "success");
    //         if (onSuccess) onSuccess();
    //       } else {
    //         showMessage("Action failed!", "error");
    //       }
    //     } catch (err) {
    //       console.error("Error:", err);
    //       showMessage("System error!", "error");
    //     } finally {
    //       hideLoading();
    //     }
    //   };

    //   const run = async (action, successMessage, onSuccess) => {
    //     try {
    //       showLoading();
    //       const result = await dispatch(action);
    //       console.log(result);

    //       if (result.success) {
    //         if (result.data) {
    //           if (successMessage) showMessage(successMessage, "success");
    //           if (onSuccess) onSuccess();
    //         } else {
    //           showMessage(result.message || "Invalid input", "error");
    //         }
    //       } else {
    //         showMessage(result.message || "System error!", "error");
    //       }
    //     } catch (err) {
    //       console.error("Error:", err);
    //       showMessage("System error!", "error");
    //     } finally {
    //       hideLoading();
    //     }
    //   };

    // const run = async (action, onSuccess = null) => {
    //     try {
    //       showLoading();
    //       const result = await dispatch(action);
    //       console.log("result:", result);

    //       if (result?.success) {
    //         // ✅ Thành công (có thể là thành công thật hoặc nghiệp vụ thất bại)
    //         showMessage(result.message || "Thành công!", result.data ? "success" : "error");

    //         if (result.data && onSuccess) {
    //           onSuccess();
    //         }
    //       } else {
    //         // ❌ Lỗi hệ thống
    //         showMessage(result?.message || "Lỗi hệ thống!", "error");
    //       }
    //     } catch (err) {
    //       console.error("System error:", err);
    //       showMessage("System error!", "error");
    //     } finally {
    //       hideLoading();
    //     }
    //   };

    const run = async (action, onSuccess) => {
        try {
            showLoading();
            const result = await dispatch(action);
            console.log(result);

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
