import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const ProfileCard = ({
  isEditing,
  editedProfile,
  handleChange,
  handleImageChange,
  handleNicknameCheck,
}) => {
  const profile = editedProfile || {};
  const MAX_NICKNAME_LENGTH = 10;
  const MAX_INTRODUCE_LENGTH = 200;

  const [previewImage, setPreviewImage] = useState(profile.profileImage);
  const [nickname, setNickname] = useState(profile.nickname || "");

  useEffect(() => {
    setPreviewImage(profile.profileImage);
  }, [profile.profileImage]);

  useEffect(() => {
    setNickname(profile.nickname || "");
  }, [profile.nickname]);

  const handleNicknameInputChange = (e) => {
    const { value } = e.target;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
    if (
      value.length <= MAX_NICKNAME_LENGTH &&
      !/\s/.test(value) &&
      !emojiRegex.test(value)
    ) {
      setNickname(value);
      if (handleChange) handleChange(e);
    }
  };

  const handleIntroduceInputChange = (e) => {
    const { value } = e.target;
    if (value.length <= MAX_INTRODUCE_LENGTH) {
      if (handleChange) handleChange(e);
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const MAX_FILE_SIZE = 1 * 1000 * 1000;
    if (file) {
      if (!validTypes.includes(file.type)) {
        toast.warn("올바른 파일형식이 아닙니다.", {
          toastId: "invalidFileType",
        });
        e.target.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.warn("파일 크기는 1MB 이하만 가능합니다.", {
          toastId: "fileSizeExceed",
        });
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleImageChange(e);
    } else {
      setPreviewImage(profile.profileImage);
    }
  };

  return (
    <div className="w-full bg-white p-6 md:p-10 rounded-xl border border-[#E1E1DF] text-[#424242] mb-5">
      <div className="flex mb-4 items-start">
        <h3 className="w-20 font-bold text-sm md:text-base">이미지 |</h3>
        <div className="flex">
          {isEditing ? (
            <>
              <img
                src={previewImage}
                alt="Profile"
                className="w-16 h-16 md:w-32 md:h-32 rounded-full border border-[#E1E1DF]"
              />
              <div className="flex flex-col ml-4 justify-center">
                <label className="cursor-pointer bg-gray-200 p-1 rounded-lg text-xs text-center hover:bg-gray-300">
                  변경
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleImagePreview}
                  />
                </label>
                <div className="mt-1 text-xs text-gray-500">
                  <p>• png, jpg, jpeg</p>
                  <p>• 1MB 이하</p>
                </div>
              </div>
            </>
          ) : (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-16 h-16 md:w-32 md:h-32 rounded-full border border-[#E1E1DF]"
            />
          )}
        </div>
      </div>
      <div className="flex mb-4 items-start">
        <h3 className="w-17 font-bold text-sm md:text-base">닉네임 |</h3>
        {isEditing ? (
          <div className="flex flex-col">
            <div className="flex items-center">
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={handleNicknameInputChange}
                placeholder="닉네임 입력"
                className="border p-1 rounded mr-3 focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm md:text-base w-34"
              />
              <button
                type="button"
                onClick={() => handleNicknameCheck(nickname, profile.nickname)}
                className="cursor-pointer bg-gray-200 p-1 rounded-lg text-xs hover:bg-gray-300"
              >
                중복확인
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              • 최대 10글자, 공백 및 이모지 불가
            </p>
          </div>
        ) : (
          <p className="text-sm md:text-base">{profile.nickname}</p>
        )}
      </div>
      <div className="flex mb-4 items-start">
        <h3 className="w-17 font-bold text-sm md:text-base">이메일 |</h3>
        <p className="text-sm md:text-base">{profile.email}</p>
      </div>
      <div className="flex mb-4 items-start">
        <h3 className="w-20 font-bold text-sm md:text-base">관심분야 |</h3>
        {isEditing ? (
          <select
            name="hobby"
            value={profile.hobby || ""}
            onChange={handleChange}
            className="border p-1 rounded focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm md:text-base"
          >
            <option value="">관심분야 선택</option>
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DEVOPS">DevOps</option>
            <option value="DBSQL">DBSQL</option>
          </select>
        ) : (
          <p className="text-sm md:text-base">{profile.hobby}</p>
        )}
      </div>
      <h3 className="w-20 font-bold mb-2 text-sm md:text-base">자기소개 |</h3>
      {isEditing ? (
        <>
          <textarea
            name="introduce"
            value={profile.introduce || ""}
            onChange={handleIntroduceInputChange}
            placeholder="자기소개 입력"
            className="border p-1 rounded w-full overflow-wrap: anywhere focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-sm md:text-base"
            style={{ height: "60px", resize: "none" }}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {profile.introduce?.length || 0} / {MAX_INTRODUCE_LENGTH}
          </p>
        </>
      ) : (
        <div
          className="text-sm md:text-base break-all break-words"
          style={{ overflowWrap: "anywhere" }}
        >
          {profile.introduce}
        </div>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  editedProfile: PropTypes.shape({
    profileImage: PropTypes.string,
    nickname: PropTypes.string,
    hobby: PropTypes.string,
    introduce: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func,
  handleImageChange: PropTypes.func,
  handleNicknameCheck: PropTypes.func,
};

export default ProfileCard;
