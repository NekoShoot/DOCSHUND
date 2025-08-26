import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);
  const faq = [
    {
      q: "Q: [서비스 이용] Docshund는 어떤 서비스인가요?",
      a: "Docshund는 공식문서를 더 쉽게 읽고 이해할 수 있도록 돕는 서비스입니다. 번역본과 원문을 함께 제공하며, 사용자가 직접 번역을 수정하고 피드백할 수도 있습니다.",
    },
    {
      q: "Q: [서비스 이용] Docshund를 이용하려면 회원가입이 필요한가요?",
      a: "네, Docshund의 모든 기능을 이용하려면 회원가입이 필요합니다. 하지만 일부 문서는 로그인 없이도 확인할 수 있습니다.",
    },
    {
      q: "Q: [번역] 번역된 문서가 100% 정확한가요?",
      a: "Docshund의 번역은 AI 번역을 기반으로 하지만, 커뮤니티 사용자들이 직접 수정하고 피드백할 수 있어 점점 더 정확해집니다.",
    },
    {
      q: "Q: [서비스 이용] 서비스 이용료는 얼마인가요?",
      a: "Docshund는 회원가입만 하면 누구나 무료로 이용할 수 있습니다.",
    },
    {
      q: "Q: [번역] 어떤 프로그래밍 언어를 지원하나요?",
      a: "Spring, Kubernetes, Android, TensorFlow 등 다양한 기술 문서를 지원하며, 점차 늘려가고 있습니다.\n문서 요청을 주시면 검토 후, 더 빠르게 업로드할 수 있으니 [헬프데스크 > 문의하기]를 이용해주시면 됩니다.",
    },
    {
      q: "Q: [번역] 공식문서가 자주 업데이트되는데, Docshund의 번역본도 업데이트되나요?",
      a: "네, Docshund는 공식문서의 최신 업데이트를 반영하여 번역본을 지속적으로 갱신하고 있습니다. 또한 커뮤니티 사용자들이 직접 최신 번역을 반영할 수도 있습니다.",
    },
    {
      q: "Q: [번역] 특정 공식문서를 추가해달라고 요청할 수 있나요?",
      a: "네, 가능합니다! [헬프데스크 > 문의하기]를 통해 원하시는 문서를 요청해주시면 검토 후 최대한 빠르게 지원하도록 하겠습니다.",
    },
    {
      q: "Q: [번역] 번역 수정에 참여하려면 어떻게 해야 하나요?",
      a: "문서를 열람한 후, 수정하고 싶은 문단을 선택하면 '번역하기' 버튼이 나타납니다. 클릭하면 직접 번역을 수정하거나 제안할 수 있습니다.",
    },
  ];

  const renderFAQ = (item, index) => (
    <div
      key={index}
      className={`border-b py-3 border-[#E1E1DF] ${
        openId === index ? "bg-[#F9F8F2]" : ""
      }`}
    >
      <div
        className="flex justify-between items-center text-sm sm:text-lg px-2 sm:px-3 py-1 cursor-pointer"
        onClick={() => setOpenId(openId === index ? null : index)}
      >
        <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all break-words overflow-wrap text-[#7d7c77]">
          {item.q}
        </div>
        <span className="whitespace-nowrap text-[#7d7c77]">
          {openId === index ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </span>
      </div>
      {openId === index && (
        <div className="px-2 sm:px-3 py-1 text-sm sm:text-lg text-[#7d7c77]">
          {item.a}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-10 bg-white rounded-bl-xl rounded-br-xl border border-[#E1E1DF] text-[#7D7C77] mb-">
      <div className="text-xs sm:text-base md:text-xl font-semibold text-[#5a5a5a] rounded-2xl border border-[#eeeeee] p-3 sm:p-5 mb-4 shadow-md">
        ❓ 궁금한 점이 있으신가요? 먼저 아래의 자주 묻는 질문을 확인해 주세요.
      </div>
      {faq.map((item, index) => renderFAQ(item, index))}
      <div className="flex flex-col justify-center items-center mt-10 mb-10 space-y-2.5 text-base sm:text-lg md:text-xl font-semibold text-[#262627]">
        <p>원하는 답변을 찾지 못하셨나요?</p>
        <p>
          그럼 <span className="text-[#bc5b39]">‘문의하기’</span>에서 직접
          문의해 주세요.
        </p>
        <p>최대한 빠르게 답변드리도록 하겠습니다!</p>
      </div>
    </div>
  );
};

export default FAQPage;
