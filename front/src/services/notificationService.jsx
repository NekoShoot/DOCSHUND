import { axiosJsonInstance } from "../utils/axiosInstance";
import propTypes from "prop-types";

const NotificationService = {
  // 알림 데이터 전체 불러오기
  async fetchNotifications() {
    try {
      const response = await axiosJsonInstance.get(
        `https://docshund.site/api/v1/docshund/alerts` // 유저 ID로 알림 불러오기
      );

      const data = response.data;

      // 알림 데이터 store에 저장
      return data;
    } catch (err) {
      // console.error(err);
    }
  },

  // 알림 단일 읽음 처리
  async readNotification(alertId) {
    try {
      const response = await axiosJsonInstance.patch(
        `https://docshund.site/api/v1/docshund/alerts/${alertId}` // 알림 ID로 알림 불러오기
      );

      const status = response.status;

      // 알림 데이터 store에 저장
      return status;
    } catch (err) {
      // console.error(err);
    }
  },

  // 알림 전체 읽음 처리
  async readAllNotifications() {
    try {
      const response = await axiosJsonInstance.patch(
        `https://docshund.site/api/v1/docshund/alerts` // 유저 ID로 알림 전체 읽음 처리
      );

      const status = response.status;

      // 알림 데이터 store에 저장
      return status;
    } catch (err) {
      // console.error(err);
    }
  },

  // 알림 단일 삭제 처리
  async deleteNotification(alertId) {
    try {
      const response = await axiosJsonInstance.delete(
        `https://docshund.site/api/v1/docshund/alerts/${alertId}` // 알림 ID로 알림 삭제
      );

      const status = response.status;

      // 알림 데이터 store에 저장
      return status;
    } catch (err) {
      // console.error(err);
    }
  },

  // 알림 전체 삭제 처리
  async deleteAllNotifications() {
    try {
      const response = await axiosJsonInstance.delete(
        `https://docshund.site/api/v1/docshund/alerts` // 유저 ID로 알림 전체 삭제
      );

      const status = response.status;

      // 알림 데이터 store에 저장
      return status;
    } catch (err) {
      // console.error(err);
    }
  },
};

NotificationService.deleteAllNotifications.propTypes = {
  alertId: propTypes.number.isRequired,
};

NotificationService.deleteNotification.propTypes = {
  alertId: propTypes.number.isRequired,
};

NotificationService.readAllNotifications.propTypes = {
  alertId: propTypes.number.isRequired,
};

NotificationService.readNotification.propTypes = {
  alertId: propTypes.number.isRequired,
};

NotificationService.fetchNotifications.propTypes = {
  alertId: propTypes.number.isRequired,
};

export default NotificationService;
