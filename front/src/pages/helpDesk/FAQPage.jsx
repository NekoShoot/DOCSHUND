import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQPage = () => {
  const [openId, setOpenId] = useState(null);
  const faq = [
    {
      q: "Q: [サービス利用] Docshundは どのようなサービスですか?",
      a: "Docshundは公式文書をより簡単に読み、理解できるように支援するサービスです。翻訳版と原文を同時に提供し、ユーザーが直接翻訳を修正し、フィードバックを行うこともできます。",
    },
    {
      q: "Q: [サービス利用] Docshundを利用するには会員登録が必要ですか？",
      a: "はい、Docshundのすべての機能を利用するには会員登録が必要です。ただし、一部の文書はログインなしでも確認できます。",
    },
    {
      q: "Q: [翻訳] 翻訳された文書は100%正確ですか？",
      a: "Docshundの翻訳はAI翻訳を基にしていますが、コミュニティユーザーが直接修正し、フィードバックを行うことで、徐々に正確性が向上しています。",
    },
    {
      q: "Q: [サービス利用] サービス利用料はどのくらいですか？",
      a: "Docshundは会員登録をするだけで誰でも無料で利用できます。",
    },
    {
      q: "Q: [翻訳] どのプログラミング言語をサポートしていますか？",
      a: "Spring, Kubernetes, Android, TensorFlowなど、さまざまな技術文書をサポートしており、徐々に増やしています。\n文書リクエストをいただければ、検討の上、より早くアップロードできるように[ヘルプデスク > お問い合わせ]をご利用ください。",
    },
    {
      q: "Q: [翻訳] 公式文書が頻繁に更新される場合、Docshundの翻訳版も更新されますか？",
      a: "はい、Docshundは公式文書の最新の更新を反映して翻訳版を継続的に更新しています。また、コミュニティユーザーが直接最新の翻訳を反映させることもできます。",
    },
    {
      q: "Q: [翻訳] 特定の公式文書を追加してほしいとリクエストできますか？",
      a: "はい、可能です！ [ヘルプデスク > お問い合わせ]を通じてご希望の文書をリクエストいただければ、検討の上、できるだけ早く対応いたします。",
    },
    {
      q: "Q: [翻訳] 翻訳修正に参加するにはどうすればよいですか？",
      a: "文書を閲覧した後、修正したい段落を選択すると「翻訳する」ボタンが表示されます。クリックすると直接翻訳を修正したり提案したりできます。",
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
        ❓知らないところや気になるところがございますか？まずは下記のよくある質問をご確認ください。
      </div>
      {faq.map((item, index) => renderFAQ(item, index))}
      <div className="flex flex-col justify-center items-center mt-10 mb-10 space-y-2.5 text-base sm:text-lg md:text-xl font-semibold text-[#262627]">
        <p>お探しの回答が見つかりませんでしたか？</p>
        <p>
          それでは <span className="text-[#bc5b39]">‘お問い合わせ’</span>から直接
          お問い合わせください。
        </p>
        <p>できるだけ早くお返事いたします！</p>
      </div>
    </div>
  );
};

export default FAQPage;
