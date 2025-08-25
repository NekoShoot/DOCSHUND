import { axiosJsonInstance } from "../../../utils/axiosInstance";
import propTypes from "prop-types";

const InquiryService = {
  async fetchInquiries(page, size, userId) {
    try {
      const response = await axiosJsonInstance.get(
        `supports/inquiry?page=${page}&size=${size}&userId=${userId}`
      );

      const data = response.data;

      return data;
    } catch (error) {
      // console.error(error);
      return null;
    }
  },
};

InquiryService.fetchInquiries.propTypes = {
  page: propTypes.number.isRequired,
  size: propTypes.number.isRequired,
  userId: propTypes.number.isRequired,
};

export default InquiryService;
