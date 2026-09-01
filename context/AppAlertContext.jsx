import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import AppOverlay from '@/components/common/AppOverlay';

/*
|--------------------------------------------------------------------------
| Context
|--------------------------------------------------------------------------
*/

const AppAlertContext = createContext(null);

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/

export function AppAlertProvider({ children }) {
  const [overlay, setOverlay] = useState({
    visible: false,
    type: 'loading',
    title: '',
    message: '',
    buttonText: 'OK',
    showButton: true,
    icon: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Hide overlay
  |--------------------------------------------------------------------------
  */

  const hide = useCallback(() => {
    setOverlay(previous => ({
      ...previous,
      visible: false,
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Generic show function
  |--------------------------------------------------------------------------
  |
  | This is the main function.
  |
  | Example:
  |
  | show({
  |   type: 'success',
  |   title: 'Success',
  |   message: 'Saved successfully',
  | });
  |
  */

  const show = useCallback(
    ({
      type = 'alert',
      title = '',
      message = '',
      buttonText = 'OK',
      showButton = true,
      icon = null,
    } = {}) => {
      setOverlay({
        visible: true,
        type,
        title,
        message,
        buttonText,
        showButton,
        icon,
      });
    },
    [],
  );

  /*
  |--------------------------------------------------------------------------
  | Alert
  |--------------------------------------------------------------------------
  */

  const alert = useCallback(
    (title = 'Alert', message = '', options = {}) => {
      show({
        type: 'alert',
        title,
        message,
        ...options,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Success
  |--------------------------------------------------------------------------
  */

  const success = useCallback(
    (title = 'Success', message = '', options = {}) => {
      show({
        type: 'success',
        title,
        message,
        ...options,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  const error = useCallback(
    (title = 'Error', message = '', options = {}) => {
      show({
        type: 'error',
        title,
        message,
        ...options,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Warning
  |--------------------------------------------------------------------------
  */

  const warning = useCallback(
    (title = 'Warning', message = '', options = {}) => {
      show({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  |
  | Loading does not show the OK button by default.
  |
  */

  const loading = useCallback(
    (title = 'Please wait...', message = '') => {
      show({
        type: 'loading',
        title,
        message,
        showButton: false,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Custom loading
  |--------------------------------------------------------------------------
  |
  | Useful if you want to control the button manually.
  |
  */

  const showLoading = useCallback(
    (title = 'Please wait...', message = '') => {
      show({
        type: 'loading',
        title,
        message,
        showButton: false,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Generic close
  |--------------------------------------------------------------------------
  */

  const close = hide;

  /*
  |--------------------------------------------------------------------------
  | Context value
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      show,
      alert,
      success,
      error,
      warning,
      loading,
      showLoading,
      hide,
      close,
    }),
    [show, alert, success, error, warning, loading, showLoading, hide, close],
  );

  return (
    <AppAlertContext.Provider value={value}>
      {children}

      <AppOverlay
        visible={overlay.visible}
        type={overlay.type}
        title={overlay.title}
        message={overlay.message}
        buttonText={overlay.buttonText}
        showButton={overlay.showButton}
        icon={overlay.icon}
        onClose={hide}
      />
    </AppAlertContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useAppAlert() {
  const context = useContext(AppAlertContext);

  if (!context) {
    throw new Error('useAppAlert must be used inside AppAlertProvider');
  }

  return context;
}

export default AppAlertContext;
