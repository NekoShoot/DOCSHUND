import PropTypes from "prop-types";

const SettingsCard = ({ isEditing, editedProfile, handleThemeChange }) => {
  return (
    <div className="w-full bg-white p-6 md:p-10 rounded-xl border border-[#E1E1DF] text-[#424242]">
      <div className="flex items-center mb-4">
        <h3 className="w-20 font-bold text-sm md:text-base">이메일 |</h3>
        <p className="font-semibold text-sm md:text-base">
          {editedProfile.email}
        </p>
      </div>
      <div className="flex items-center">
        <h3 className="w-20 font-bold text-sm md:text-base">모드설정 |</h3>
        <div className="flex items-center">
          <label className="mr-6 text-sm md:text-base">
            <input
              type="radio"
              className="mr-1 cursor-pointer"
              name="theme"
              value="light"
              checked={!editedProfile.isDarkmode}
              onChange={handleThemeChange}
              disabled={!isEditing}
            />
            라이트 모드
          </label>
          <label className="text-sm md:text-base">
            <input
              type="radio"
              className="mr-1 cursor-pointer"
              name="theme"
              value="dark"
              checked={editedProfile.isDarkmode}
              onChange={handleThemeChange}
              disabled={!isEditing}
            />
            다크 모드
          </label>
        </div>
      </div>
    </div>
  );
};

SettingsCard.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  editedProfile: PropTypes.shape({
    email: PropTypes.string.isRequired,
    isDarkmode: PropTypes.bool.isRequired,
  }).isRequired,
  handleThemeChange: PropTypes.func.isRequired,
};

export default SettingsCard;
