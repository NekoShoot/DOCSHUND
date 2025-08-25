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
    "공식문서를\n내것으로 만드는 가장 쉬운 방법",
    "개발자들이 함께 만드는\n최고의 공식문서 비공식번역",
    "공식문서\n더 쉽고, 더 빠르게",
    "공식문서\n최고의 번역 플랫폼",
  ];

  const testimonials = [
    {
      text: "DOCSHUND 덕분에 복잡한 문서를\n쉽게 이해할 수 있게 되었어요!",
      name: "김개발",
      role: "프론트엔드 개발자",
      company: "네이버",
    },
    {
      text: "실시간 번역과 피드백 덕분에\n학습이 훨씬 수월해졌습니다.",
      name: "이코딩",
      role: "백엔드 개발자",
      company: "카카오",
    },
  ];

  const stats = [
    { number: "100+", label: "번역 중인 문서" },
    { number: "1,000+", label: "참여 개발자" },
    { number: "5,000+", label: "번역본" },
  ];

  const faqs = [
    {
      q: "DOCSHUND는 어떤 서비스인가요?",
      a: "DOCSHUND는 공식문서를 쉽게 읽고 이해할 수 있도록 번역과 커뮤니티 피드백을 제공하는 플랫폼입니다.",
    },
    {
      q: "서비스 이용료는 얼마인가요?",
      a: "회원가입 후 무료로 이용할 수 있습니다.",
    },
    {
      q: "어떤 문서를 지원하나요?",
      a: "Spring, Kubernetes, Android, TensorFlow 등 다양한 기술 문서를 지원합니다.",
    },
    {
      q: "번역 수정에 참여하려면 어떻게 하나요?",
      a: "문서를 열람 후, 수정할 부분을 선택해 번역 제안을 하실 수 있습니다.",
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
            이미 많은 개발자가 DOCSHUND를 사용 중입니다.
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
            공식문서 번역과 커뮤니티 피드백으로 빠르고 정확한 개발 지식을
            제공합니다.
          </p>
          <RectBtn
            onClick={() => navigate("/translate")}
            text="지금 시작하기"
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
            개발자가 겪는 문제
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="text-xl font-bold text-red-600 mb-3">
                ❌ 기존 방식
              </h3>
              <ul className="space-y-2 text-[#424242] text-sm">
                <li>복잡한 영어 문서를 번역기에 의존</li>
                <li>필요 정보 탐색에 시간 소요</li>
                <li>부정확한 번역으로 혼란</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-600 mb-3">
                ✅ DOCSHUND의 해결책
              </h3>
              <ul className="space-y-2 text-[#424242] text-sm">
                <li>원문과 번역을 한눈에 비교</li>
                <li>커뮤니티 피드백을 통한 개선</li>
                <li>빠르고 정확한 정보 제공</li>
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
          <h2 className="text-3xl font-bold mb-8 text-[#424242]">사용 방법</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "문서 선택",
                description: "관심 있는 기술 문서를 선택하세요.",
                image:
                  "https://i.pinimg.com/736x/73/cc/eb/73ccebda620a66cc7e0d57edaaf92418.jpg",
              },
              {
                step: "2",
                title: "번역 참여",
                description: "직접 번역에 참여하거나 비교해보세요.",
                image:
                  "https://i.pinimg.com/736x/55/37/40/553740a0c11fd9afb5b83be406fe7b69.jpg",
              },
              {
                step: "3",
                title: "커뮤니티 개선",
                description: "실시간 피드백으로 번역을 함께 개선합니다.",
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
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="w-7 h-7 text-[#bc5b39]" />,
                title: "번역본 보기",
                desc: "원문과 다양한 번역본을 비교하며 학습",
              },
              {
                icon: <Edit className="w-7 h-7 text-[#bc5b39]" />,
                title: "번역 제안 & 투표",
                desc: "직접 번역을 제안하고 개선에 참여",
              },
              {
                icon: <Users className="w-7 h-7 text-[#bc5b39]" />,
                title: "커뮤니티 토론",
                desc: "문서별 토론과 피드백을 실시간 제공",
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
          <h2 className="text-3xl font-bold mb-8 text-[#424242]">지원 문서</h2>
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
            사용자 후기
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
            자주 묻는 질문
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
                text="FAQ 더보기 +"
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
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="mb-6 text-base text-[#424242]">
            필요한 문서를 검색하고 원하시는 문서가 없다면 신청해주세요.
          </p>
          <div className="flex justify-center items-center gap-4">
            <RectBtn
              onClick={() => navigate("/translate")}
              text="번역문서 보기"
            />
            <RectBtn
              onClick={() => navigate("/helpDesk/inquiryForm")}
              text="문서 제안하기"
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
