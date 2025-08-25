import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./myPage/pages/ProfileCard";
import userProfileService from "./myPage/services/userProfileService";
import MyArticleService from "./myPage/services/myArticleService";
import MyCommentService from "./myPage/services/myCommentService";
import MyTranslationService from "./myPage/services/myTranslationService";
import useUserActivityStore from "../store/userActivityStore";
import { FileText, MessageSquare, Edit3 } from "lucide-react";

const UserPage = () => {
  const { userId } = useParams();

  const {
    userProfile,
    articles,
    comments,
    translations,
    setUserId,
    setUserProfile,
    setArticles,
    setComments,
    setTranslations,
    setLoading,
    setError,
  } = useUserActivityStore();

  const defaultProfile = {
    profileImage: "",
    nickname: "",
    hobby: "",
    introduce: "",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setUserId(userId);

        // 유저 프로필 가져오기
        const profileData = await userProfileService.fetchProfile(userId);
        setUserProfile(profileData);

        // 유저 활동 데이터 (게시글, 댓글, 번역본)
        const articlesData = await MyArticleService.fetchArticles(userId, 0, 5);
        const commentsData = await MyCommentService.fetchComments(userId);
        const translationsData = await MyTranslationService.fetchTranslations(
          userId
        );

        setArticles(articlesData.content || []);
        setComments(commentsData || []);
        setTranslations(translationsData || []);
      } catch (error) {
        // console.error(error);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    userId,
    setUserId,
    setUserProfile,
    setArticles,
    setComments,
    setTranslations,
    setLoading,
    setError,
  ]);

  return (
    <div className="w-full px-12 py-5 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mt-4 mb-5 pl-4">프로필</h1>
      <ProfileCard
        isEditing={false}
        editedProfile={userProfile || defaultProfile}
      />
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl pl-4">활동 내역</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-xl border border-[#E1E1DF] flex items-center">
          <div className="bg-[#f5f5f5] rounded-full p-3 mr-4">
            <FileText className="text-[#bc5b39] w-10 h-10" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">작성한 번역본</h2>
            <p className="text-2xl font-bold">{translations.length}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-[#E1E1DF] flex items-center">
          <div className="bg-[#f5f5f5] rounded-full p-3 mr-4">
            <Edit3 className="text-[#bc5b39] w-10 h-10" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">작성한 게시글</h2>
            <p className="text-2xl font-bold">{articles.length}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-[#E1E1DF] flex items-center">
          <div className="bg-[#f5f5f5] rounded-full p-3 mr-4">
            <MessageSquare className="text-[#bc5b39] w-10 h-10" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">작성한 댓글</h2>
            <p className="text-2xl font-bold">{comments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
