import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./kr/pages/landingPage.jsx";

// 비회원 접근 제어 라우터
import ProtectedRoute from "./utils/protectedRoute.jsx";

// 마이페이지 관련 페이지
import MyPage from "./kr/pages/myPage/myPage.jsx";
import MyProfilePage from "./kr/pages/myPage/pages/MyProfilePage.jsx";
import ArchivePage from "./kr/pages/myPage/pages/ArchivePage.jsx";
import LikeArticlePage from "./kr/pages/myPage/pages/archive/LikeArticlePage.jsx";
import LikeTranslationPage from "./kr/pages/myPage/pages/archive/LikeTranslationPage.jsx";
import LikeDocsPage from "./kr/pages/myPage/pages/archive/LikeDocsPage.jsx";
import ActivityPage from "./kr/pages/myPage/pages/ActivityPage.jsx";
import MyTranslationPage from "./kr/pages/myPage/pages/activity/MyTranslationPage.jsx";
import MyArticlePage from "./kr/pages/myPage/pages/activity/MyArticlePage.jsx";
import MyCommentPage from "./kr/pages/myPage/pages/activity/MyCommentPage.jsx";
import MemoPage from "./kr/pages/myPage/pages/MemoPage.jsx";
import InquiryPage from "./kr/pages/myPage/pages/InquiryPage.jsx";

// 도움말 관련 페이지
import HelpDeskPage from "./kr/pages/helpDesk/HelpDeskPage.jsx";
import NoticePage from "./kr/pages/helpDesk/NoticePage.jsx";
import NoticeDetail from "./kr/pages/helpDesk/NoticeDetail.jsx";
import FAQPage from "./kr/pages/helpDesk/FAQPage.jsx";
import InquiryFormPage from "./kr/pages/helpDesk/InquiryFormPage.jsx";
import TermsPage from "./kr/pages/helpDesk/TermsPage.jsx";
import PrivacyPage from "./kr/pages/helpDesk/PrivacyPage.jsx";

// 번역 관련 페이지
import ViewerMainPage from "./kr/pages/translate/viewerMainPage.jsx";
import TranslatePage from "./kr/pages/translate/translate.jsx";
import TranslateViewer from "./kr/pages/translate/translateViewer.jsx";
import BestTransViewer from "./kr/pages/translate/bestTransViewer.jsx";

// Community 관련 페이지
import CommunityPage from "./kr/pages/community/community.jsx";
import ArticleList from "./kr/pages/community/articleList.jsx";
import WriteArticle from "./kr/pages/community/writeArticle.jsx";
import ModifyArticle from "./kr/pages/community/modifyArticle.jsx";
import ArticleItem from "./kr/pages/community/articleItem.jsx";

//admin 관련 페이지
import Admin from "./kr/pages/admin/admin.jsx";
import ManageUser from "./kr/pages/admin/manageUser.jsx";
import ManageInquiry from "./kr/pages/admin/manageInquiry.jsx";
import ManageDocs from "./kr/pages/admin/manageDocs.jsx";
import ManageReport from "./kr/pages/admin/manageReport.jsx";
import ManageNotification from "./kr/pages/admin/manageNotification.jsx";

// error 페이지
import ErrorPage from "./kr/pages/errorPage.jsx";

// 유어마이페이지
import UserPage from "./kr/pages/userPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* UpperNav 바로가기 주소 */}
      <Route path="/" element={<LandingPage />} />
      {/* 번역 관련 주소 */}
      <Route path="/translate" element={<TranslatePage />} />
      <Route path="/translate/main" element={<ViewerMainPage />}>
        <Route path="viewer/:docsId" element={<TranslateViewer />} />
        <Route path="viewer/:docsId/best" element={<BestTransViewer />} />
      </Route>

      {/* 커뮤니티 관련 주소 */}
      <Route path="/community" element={<CommunityPage />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<ArticleList />} />
        <Route path="article/:articleId" element={<ArticleItem />} />
        <Route path="modify/:articleId" element={<ModifyArticle />} />
        <Route path="write" element={<WriteArticle />} />
      </Route>

      {/* 도움말 관련 주소 */}
      <Route path="/helpDesk" element={<HelpDeskPage />}>
        <Route index element={<Navigate to="notices" replace />} />
        <Route path="notices" element={<NoticePage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="inquiryForm" element={<InquiryFormPage />} />
      </Route>
      <Route path="/helpDesk/notices/:noticeId" element={<NoticeDetail />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* 관리자 관련 주소 */}
      <Route element={<ProtectedRoute isAdminRoute={true} />}>
        <Route path="/admin" element={<Admin />}>
          <Route path="manageUser" element={<ManageUser />} />
          <Route path="manageInquiry" element={<ManageInquiry />} />
          <Route path="manageDocs" element={<ManageDocs />} />
          <Route path="manageReport" element={<ManageReport />} />
          <Route path="manageNotification" element={<ManageNotification />} />
        </Route>
      </Route>

      {/* 유어마이페이지 */}
      <Route path="/userPage/:userId" element={<UserPage />}></Route>

      {/* 에러페이지 */}
      <Route path="/error" element={<ErrorPage />} />
      <Route
        path="*"
        element={
          <Navigate
            to="/error?status=404&message=페이지를 찾을 수 없습니다."
            replace
          />
        }
      />

      {/* 유어마이페이지 */}
      <Route path="/userPage/:userId" element={<UserPage />}></Route>

      {/* 비로그인 접근 불가 */}
      <Route element={<ProtectedRoute isAdminRoute={false} />}>
        {/* 마이페이지 관련 주소 */}
        <Route path="/myPage" element={<MyPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="archive" element={<ArchivePage />}>
            <Route path="likeTrans" element={<LikeTranslationPage />} />
            <Route path="likeArticle" element={<LikeArticlePage />} />
            <Route path="likeDocs" element={<LikeDocsPage />} />
          </Route>
          <Route path="activity" element={<ActivityPage />}>
            <Route path="myTrans" element={<MyTranslationPage />} />
            <Route path="myArticle" element={<MyArticlePage />} />
            <Route path="myComment" element={<MyCommentPage />} />
          </Route>
          <Route path="memo" element={<MemoPage />} />
          <Route path="inquiry" element={<InquiryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
