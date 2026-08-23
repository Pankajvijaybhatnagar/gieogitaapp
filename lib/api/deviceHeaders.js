import * as Device from 'expo-device';
import * as Application from 'expo-application';

export default async function getDeviceHeaders() {
  let deviceType = 'unknown';

  if (Device.deviceType === Device.DeviceType.PHONE) {
    deviceType = 'mobile';
  } else if (Device.deviceType === Device.DeviceType.TABLET) {
    deviceType = 'tablet';
  } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
    deviceType = 'desktop';
  } else if (Device.deviceType === Device.DeviceType.TV) {
    deviceType = 'tv';
  }

  return {
    'X-Client-Type': 'app',
    'X-Device-Type': deviceType,
    'X-Device-Brand': Device.brand || '',
    'X-Device-Model': Device.modelName || '',
    'X-Device-OS': Device.osName || '',
    'X-Device-OS-Version': Device.osVersion || '',
    'X-Device-Platform': Device.osName || '',
    'X-Browser': '',
    'X-App-Version': Application.nativeApplicationVersion || '',
    'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };
}
