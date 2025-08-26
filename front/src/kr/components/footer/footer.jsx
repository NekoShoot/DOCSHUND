import { Link } from "react-router-dom";

const Footer = () => {
  const footerChild = "text-[#f8f8f7] text-left text-[14px] font-semibold";
  return (
    <div className="box-border bg-black px-4 md:px-[120px] py-6 md:py-[90px] flex flex-col gap-2 md:gap-[10px] items-center justify-center h-auto md:h-[190px] relative">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-4 md:gap-[47px] items-center justify-center shrink-0 relative">
        <div className="bg-white border-b border-white opacity-60 self-stretch relative"></div>
        <div className="flex flex-col md:flex-row items-center justify-center self-stretch shrink-0 space-y-2 md:space-y-0 md:space-x-9">
          <Link to="/terms" className={footerChild}>
            이용약관
          </Link>
          <Link to="/privacy" className={footerChild}>
            개인정보처리방침
          </Link>
          <Link to="/helpDesk/notices" className={footerChild}>
            공지사항
          </Link>
          <Link to="/helpDesk/faq" className={footerChild}>
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
