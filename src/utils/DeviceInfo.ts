import DeviceInfo from 'react-native-device-info';

export const getUniqueId = async () => {
  const uniqueId = await DeviceInfo.getUniqueId().then(id => {
    return id;
  });

  return uniqueId;
};

export const getIP = async () => {
  try {
    const ip = await DeviceInfo.getIpAddress();
    if (ip !== null) {
      return ip;
    }
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};
