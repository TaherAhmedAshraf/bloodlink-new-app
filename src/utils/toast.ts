import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
}

const defaultOptions: ToastOptions = {
  position: 'bottom',
  visibilityTime: 3000,
  autoHide: true,
  topOffset: 40,
  bottomOffset: 40,
};

const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  options?: ToastOptions
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: mergedOptions.position,
    visibilityTime: mergedOptions.visibilityTime,
    autoHide: mergedOptions.autoHide,
    topOffset: mergedOptions.topOffset,
    bottomOffset: mergedOptions.bottomOffset,
  });
};

export const toast = {
  success: (title: string, message?: string, options?: ToastOptions) => 
    showToast('success', title, message, options),
  
  error: (title: string, message?: string, options?: ToastOptions) => 
    showToast('error', title, message, options),
  
  info: (title: string, message?: string, options?: ToastOptions) => 
    showToast('info', title, message, options),
  
  warning: (title: string, message?: string, options?: ToastOptions) => 
    showToast('warning', title, message, options),
  
  hide: () => Toast.hide(),
};

export default toast; 