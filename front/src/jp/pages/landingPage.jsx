import { useNavigate } from "react-router-dom";
import RectBtn from "../components/button/rectBtn";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Edit } from "lucide-react";
import Marquee from "react-fast-marquee";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlogan, setCurrentSlogan] = useState(0);

const slogans = [
    "公式ドキュメントを\n自分のものにする最も簡単な方法",
    "開発者たちが共に作る\n最高の公式ドキュメント非公式翻訳",
    "公式ドキュメント\nより簡単に、より速く",
    "公式ドキュメント\n最高の翻訳プラットフォーム",
  ];

const testimonials = [
    {
      text: "DOCSHUNDのおかげで複雑な文書を\n簡単に理解できるようになりました！",
      name: "木村開発",
      role: "フロントエンド開発者",
      company: "ネイバー",
    },
    {
      text: "リアルタイム翻訳とフィードバックのおかげで\n学習がとてもスムーズになりました。",
      name: "佐藤コーディング",
      role: "バックエンド開発者",
      company: "カカオ",
    },
  ];

  const stats = [
    { number: "100+", label: "翻訳中のドキュメント" },
    { number: "1,000+", label: "参加開発者" },
    { number: "5,000+", label: "翻訳数" },
  ];

  const faqs = [
    {
      q: "DOCSHUNDはどんなサービスですか？",
      a: "DOCSHUNDは公式ドキュメントを簡単に読んで理解できるように翻訳とコミュニティフィードバックを提供するプラットフォームです。",
    },
    {
      q: "サービス利用料はいくらですか？",
      a: "会員登録後、無料でご利用いただけます。",
    },
    {
      q: "どのようなドキュメントに対応していますか？",
      a: "Spring、Kubernetes、Android、TensorFlowなど、様々な技術文書に対応しています。",
    },
    {
      q: "翻訳の修正に参加するにはどうすればいいですか？",
      a: "文書を閲覧後、修正したい箇所を選択して翻訳を提案することができます。",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-[#FAF9F5]">
      {/* Hero Section */}
      <motion.section
        className="py-24 px-4 bg-gradient-to-b from-white to-[#FAF9F5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            className="mb-2 text-[#bc5b39] font-semibold text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            すでに多くの開発者がDOCSHUNDを使用しています。
          </motion.div>
          <motion.h1
            className="mb-4 bg-gradient-to-r from-[#bc5b39] to-[#C96442] text-transparent bg-clip-text font-bold"
            key={currentSlogan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.3",
              fontSize: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            {slogans[currentSlogan]}
          </motion.h1>
          <p className="text-base text-[#424242] mb-6 max-w-2xl mx-auto">
            公式ドキュメントの翻訳とコミュニティフィードバックで、迅速で正確な開発知識を提供します。
          </p>
          <RectBtn
            onClick={() => navigate("/translate")}
            text="今すぐ始める"
          />
        </div>
      </motion.section>

      {/* Problem Section */}
      <motion.section
        className="py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
         <h2 className="text-3xl font-bold text-center mb-8 text-[#424242]">
            開発者が抱える問題
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-xl font-bold text-red-600 mb-3">
                ❌ 従来の方法
              </h3>
              <ul className="space-y-2 text-[#424242] text-sm">
                <li>複雑な英語文書を翻訳機に依存</li>
                <li>必要な情報の検索に時間がかかる</li>
                <li>不正確な翻訳による混乱</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-600 mb-3">
                ✅ DOCSHUNDの解決策
              </h3>
              <ul className="space-y-2 text-[#424242] text-sm">
                <li>原文と翻訳を一目で比較</li>
                <li>コミュニティフィードバックによる改善</li>
                <li>迅速で正確な情報提供</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#424242]">使用方法</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
                {
                step: "1",
                title: "文書選択",
                description: "興味のある技術文書を選択してください。",
                image:
                  "https://i.pinimg.com/736x/73/cc/eb/73ccebda620a66cc7e0d57edaaf92418.jpg",
              },
              {
                step: "2",
                title: "翻訳参加",
                description: "直接翻訳に参加するか比較してみましょう。",
                image:
                  "https://i.pinimg.com/736x/55/37/40/553740a0c11fd9afb5b83be406fe7b69.jpg",
              },
              {
                step: "3",
                title: "コミュニティ改善",
                description: "リアルタイムフィードバックで翻訳を共に改善します。",
                image:
                  "https://i.pinimg.com/736x/b1/ef/95/b1ef956e67434f44cdd2b8bba3438f50.jpg",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative mb-4 mx-auto">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#bc5b39] text-white rounded-full flex items-center justify-center text-xs">
                    {item.step}
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-md shadow-sm mx-auto"
                    style={{ maxWidth: "60px", padding: "10px" }}
                  />
                </div>
                <h3 className="text-lg font-bold mb-1 text-[#424242]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#7d7c77]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 bg-[#FAF9F5]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#424242]">
            主な機能
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
               {
                icon: <BookOpen className="w-7 h-7 text-[#bc5b39]" />,
                title: "翻訳閲覧",
                desc: "原文と様々な翻訳を比較しながら学習",
              },
              {
                icon: <Edit className="w-7 h-7 text-[#bc5b39]" />,
                title: "翻訳提案＆投票",
                desc: "直接翻訳を提案し改善に参加",
              },
              {
                icon: <Users className="w-7 h-7 text-[#bc5b39]" />,
                title: "コミュニティ討論",
                desc: "文書別の討論とリアルタイムフィードバック",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white rounded-md shadow-md transition duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold mb-1 text-[#424242]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#7d7c77]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="p-4"
              >
                <h3 className="text-3xl font-bold text-[#bc5b39] mb-1">
                  {stat.number}
                </h3>
                <p className="text-sm text-[#424242]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tech Stack Section with Marquee */}
      <motion.section
        className="py-16 bg-[#FAF9F5]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#424242]">
            対応文書
          </h2>
          <Marquee gradient={false} speed={40} pauseOnHover={false}>
            {[
              "Spring",
              "Docker",
              "Kafka",
              "Android",
              "Kubernetes",
              "TensorFlow",
              "React",
            ].map((tech, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-md shadow-sm flex items-center justify-center mx-2"
                style={{ minWidth: "150px", minHeight: "35px" }}
              >
                <span className="text-xs md:text-sm">{tech}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-16 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#424242]">
            ユーザーレビュー
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white rounded-md shadow-md transition duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}
              >
                <p className="text-sm mb-3 text-[#424242]">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#bc5b39] rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-bold text-[#424242]">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[#7d7c77]">
                      {testimonial.role} &bull; {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#424242]">
            よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}
                className="p-4 bg-[#FAF9F5] rounded-md"
              >
                <h3 className="text-xl font-bold mb-2 text-[#424242]">
                  {faq.q}
                </h3>
                <p className="text-sm text-[#7d7c77]">{faq.a}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: faqs.length * 0.2 }}
              className="flex justify-center"
            >
              <RectBtn
                onClick={() => navigate("/helpDesk/faq")}
                text="FAQ もっと見る +"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-16 bg-[#FAF9F5]"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="mb-6 text-base text-[#424242]">
            必要な文書を検索し、お探しの文書がない場合はリクエストしてください。
          </p>
          <div className="flex justify-center items-center gap-4">
            <RectBtn
              onClick={() => navigate("/translate")}
              text="翻訳文書を見る"
            />
            <RectBtn
              onClick={() => navigate("/helpDesk/inquiryForm")}
              text="文書を提案する"
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
