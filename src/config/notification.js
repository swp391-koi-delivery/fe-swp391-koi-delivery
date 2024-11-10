const requestPermissions = async () => {
  await Notification.requestPermission();
};

export default requestPermissions;
