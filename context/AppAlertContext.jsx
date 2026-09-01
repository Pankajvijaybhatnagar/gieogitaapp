import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import AppOverlay from '@/components/common/AppOverlay';

const AppAlertContext = createContext(null);

export function AppAlertProvider({ children }) {
  const [overlay, setOverlay] = useState({
    visible: false,

    type: 'loading',

    title: '',
    message: '',

    buttonText: 'OK',
    secondaryButtonText: null,

    showButton: true,

    icon: null,

    destructive: false,

    onConfirm: null,
    onCancel: null,
  });

  /*
  |--------------------------------------------------------------------------
  | Hide
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
  | Generic show
  |--------------------------------------------------------------------------
  */

  const show = useCallback(
    ({
      type = 'alert',
      title = '',
      message = '',
      buttonText = 'OK',
      secondaryButtonText = null,
      showButton = true,
      icon = null,
      destructive = false,
      onConfirm = null,
      onCancel = null,
    } = {}) => {
      setOverlay({
        visible: true,

        type,

        title,
        message,

        buttonText,
        secondaryButtonText,

        showButton,

        icon,

        destructive,

        onConfirm,
        onCancel,
      });
    },
    [],
  );

  /*
  |--------------------------------------------------------------------------
  | Normal Alert
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
  | Confirm
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | confirm(
  |   'Logout',
  |   'Are you sure you want to logout?',
  |   async () => {
  |     ...
  |   }
  | );
  |
  */

  const confirm = useCallback(
    (title = 'Are you sure?', message = '', onConfirm = null, options = {}) => {
      show({
        type: 'confirm',

        title,
        message,

        buttonText: options?.buttonText || 'Confirm',

        secondaryButtonText: options?.secondaryButtonText || 'Cancel',

        destructive: options?.destructive || false,

        icon: options?.icon || 'help-circle',

        showButton: true,

        onConfirm,

        onCancel: options?.onCancel || null,
      });
    },
    [show],
  );

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
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
  | Show Loading
  |--------------------------------------------------------------------------
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
  | Overlay button handlers
  |--------------------------------------------------------------------------
  */

  const handleConfirm = useCallback(async () => {
    const callback = overlay?.onConfirm;

    hide();

    if (typeof callback === 'function') {
      try {
        await callback();
      } catch (callbackError) {
        console.error('[AppAlert] Confirm callback error:', callbackError);
      }
    }
  }, [overlay?.onConfirm, hide]);

  const handleCancel = useCallback(async () => {
    const callback = overlay?.onCancel;

    hide();

    if (typeof callback === 'function') {
      try {
        await callback();
      } catch (callbackError) {
        console.error('[AppAlert] Cancel callback error:', callbackError);
      }
    }
  }, [overlay?.onCancel, hide]);

  /*
  |--------------------------------------------------------------------------
  | Context
  |--------------------------------------------------------------------------
  */

  const value = useMemo(
    () => ({
      show,

      alert,

      success,

      error,

      warning,

      confirm,

      loading,

      showLoading,

      hide,

      close: hide,
    }),
    [show, alert, success, error, warning, confirm, loading, showLoading, hide],
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
        secondaryButtonText={overlay.secondaryButtonText}
        showButton={overlay.showButton}
        icon={overlay.icon}
        destructive={overlay.destructive}
        onClose={overlay.type === 'confirm' ? handleConfirm : hide}
        onSecondaryPress={overlay.type === 'confirm' ? handleCancel : hide}
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
