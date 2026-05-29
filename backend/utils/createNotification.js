import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, link = '') => {
  await Notification.create({ userId, title, message, link });
};
