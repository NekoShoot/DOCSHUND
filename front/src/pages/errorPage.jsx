import { useSearchParams, useNavigate } from "react-router-dom";
import errorImage400 from "../assets/error400.png";
import errorImage500 from "../assets/error500.png";
import { ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusCode = parseInt(searchParams.get("status"), 10) || 500;
  const message =
    searchParams.get("message") || "エラーが発生しました。";

  const getErrorContent = () => {
    switch (statusCode) {
      case 400:
        return {
          title: "無効なリクエストです",
          description: message,
          image: errorImage400,
        };
      case 401:
        return {
          title: "ログインが必要です",
          description: message,
          image: errorImage400,
        };
      case 403:
        return {
          title: "アクセスが禁止されています",
          description: message,
          image: errorImage400,
        };
      case 404:
        return {
          title: "ページが見つかりません",
          description: message,
          image: errorImage400,
        };
      case 410:
        return {
          title: "アカウントが退会されました",
          description: message,
          image: errorImage400,
        };
      case 500:
        return {
          title: "サーバーエラー",
          description: message,
          image: errorImage500,
        };
      default:
        return {
          title: "エラーが発生しました。",
          description: message,
          image: errorImage400,
        };
    }
  };

  const { title, description, image } = getErrorContent();

  return (
    <div className="flex items-center justify-center p-4">
      <div>
        <p className="lg:text-5xl sm:text-3xl font-bold mb-4">{title}</p>
        <p className="lg:text-xl sm:text-lg mb-7">{description}</p>
        <button
          className="bg-[#bc5b39] text-white flex items-center px-5 py-2 rounded-sm"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" />
          <span className="lg:text-md sm:text-sm">ホームに戻る</span>
        </button>
      </div>
      <img src={image} alt="エラー画像" className="w-1/3" />
    </div>
  );
};

export default ErrorPage;
