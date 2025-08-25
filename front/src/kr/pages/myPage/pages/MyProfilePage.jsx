import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import authService from "../../../services/authService";
import useUserProfileStore from "../../../store/myPageStore/userProfileStore";
import userProfileService from "../services/userProfileService";
import ProfileCard from "./ProfileCard";
// import SettingsCard from "./SettingsCard";
import ConfirmModal from "../../../components/alertModal/confirmModal";
import useAlertStore from "../../../store/alertStore";

const MyProfilePage = () => {
  const { profile, error, fetchProfile, updateProfile, deleteAccount } =
    useUserProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    nickname: "",
    hobby: "",
    introduce: "",
    profileImage: "",
    email: "",
    isDarkmode: false,
    ...profile,
  });
  const [userId, setUserId] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { logout } = authService();
  const { isAlertOpen, toggleAlert } = useAlertStore();

  // 1. 토큰 디코딩 및 userId 설정
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  // 2. userId가 설정되거나 편집 모드가 종료될 때 프로필 호출
  useEffect(() => {
    if (userId && !isEditing) {
      fetchProfile(userId);
    }
  }, [userId, isEditing, fetchProfile]);

  // 3. 프로필 변경 시 편집 중이 아닐 때만 로컬 상태 업데이트
  useEffect(() => {
    if (profile && !isEditing) {
      setEditedProfile({ ...profile });
    }
  }, [profile, isEditing]);

  // 4. 에러 발생 시 토스트 표시
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, {
        toastId: "profileError",
      });
    }
  }, [error]);

  // 편집 모드 시작 / 취소
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setProfileImageFile(null);
  };

  // 닉네임 중복 체크
  const checkNickname = async (showSuccessToast = true) => {
    if (!editedProfile.nickname) {
      toast.warn("닉네임을 입력해주세요.", {
        toastId: "emptyNickname",
      });
      return false;
    }
    try {
      const isAvailable = await userProfileService.checkNickname(
        editedProfile.nickname,
        profile.nickname
      );
      if (isAvailable) {
        if (showSuccessToast) {
          toast.success("사용 가능한 닉네임입니다.", {
            toastId: "availableNickname",
          });
        }
        return true;
      } else {
        toast.error("사용할 수 없는 닉네임입니다.", {
          toastId: "unavailableNickname",
        });
        return false;
      }
    } catch (error) {
      // console.error("닉네임 중복 체크 중 오류 발생:", error);
      return false;
    }
  };

  // 편집 모드 저장
  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (
      !editedProfile.nickname ||
      !editedProfile.hobby ||
      !editedProfile.introduce ||
      !editedProfile.email
    ) {
      toast.warn("모든 필드를 입력해주세요.", {
        toastId: "emptyField",
      });
      return;
    }

    const isUnique = await checkNickname(false);
    if (!isUnique) return;

    const formData = new FormData();
    formData.append(
      "profile",
      new Blob([JSON.stringify(editedProfile)], { type: "application/json" })
    );
    if (profileImageFile) {
      formData.append("file", profileImageFile);
    }

    const response = await updateProfile(userId, formData);
    if (!response) {
      setEditedProfile((prev) => ({
        ...prev,
        profileImage: profile.profileImage,
      }));
    }
    setIsEditing(false);
  };

  // 이미지 변경 처리 (최대 1MB)
  const MAX_FILE_SIZE = 1 * 1000 * 1000;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!file) return;

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
      setEditedProfile((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
      setProfileImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // 계정 탈퇴 처리
  const handleDeleteAccount = async () => {
    toggleAlert();
  };

  // 계정 탈퇴 확인 (debounce 제거)
  const confirmDeleteAccount = async () => {
    try {
      const success = await deleteAccount(userId);
      if (success) {
        toast.success("계정이 성공적으로 탈퇴되었습니다.", {
          toastId: "successDelete",
        });
        toggleAlert();
        logout();
      } else {
        toast.error("계정 탈퇴 중 오류가 발생했습니다.", {
          toastId: "failedDelete",
        });
        toggleAlert();
      }
    } catch (error) {
      toast.error("계정 탈퇴 중 오류가 발생했습니다.", {
        toastId: "failedDelete",
      });
      // console.error("계정 탈퇴 실패", error);
      toggleAlert();
    }
  };

  // 입력 값 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex justify-between mt-4 mb-5">
        <h1 className="font-bold text-2xl">내 프로필</h1>
        {!isEditing ? (
          <button
            className="bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 relative flex items-center justify-center text-white hover:bg-[#C96442] cursor-pointer"
            onClick={handleEditClick}
          >
            편집
          </button>
        ) : (
          <div className="flex space-x-5">
            <button
              className="border-box rounded-[12px] px-[20px] w-fit h-10 hover:text-[#ffffff] hover:bg-[#bc5b39] cursor-pointer"
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button
              className="border-box bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442] cursor-pointer"
              onClick={handleSaveClick}
            >
              저장
            </button>
          </div>
        )}
      </div>

      <ProfileCard
        isEditing={isEditing}
        editedProfile={editedProfile}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleNicknameCheck={checkNickname}
      />

      <div className="mt-5 mr-2 flex justify-end">
        <button
          className="flex items-center text-gray-500 hover:text-red-600 hover:underline cursor-pointer"
          onClick={handleDeleteAccount}
        >
          <p className="text-bold">계정탈퇴</p>
          <ChevronRight />
        </button>
      </div>
      {isAlertOpen && (
        <ConfirmModal
          message={{
            title: "정말로 계정을 탈퇴하시겠습니까?",
            content: [
              "1. 탈퇴시 계정과 관련된 모든 권한이 사라지며 복구할 수 없습니다.",
              "2. 직접 작성한 콘텐츠(번역본, 게시물, 댓글 등)는 자동으로 삭제되지 않으며, 만일 삭제를 원하시면 탈퇴 이전에 삭제가 필요합니다.",
              "3. 탈퇴 후 1년 뒤 동일한 메일로 재가입이 가능하나, 탈퇴한 계정과 연동되지 않습니다.",
            ],
          }}
          onConfirm={confirmDeleteAccount}
          onCancel={toggleAlert}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
