const PrivacyPage = () => {
  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 max-w-[1280px] mx-auto">
        <div className="flex justify-between mt-2 mb-6">
          <h1 className="font-bold text-2xl">개인정보처리방침</h1>
        </div>
        <div className="bg-white rounded-xl border border-[#E1E1DF]">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="border-t border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="min-h-[200px] whitespace-pre-wrap my-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2">
                  개인정보 처리방침
                </h2>
                <p className="mb-4">
                  &lt;DOCSHUND&gt;은(는) 정보주체의 자유와 권리 보호를 위해
                  「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여,
                  적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에
                  「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보의
                  처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을
                  신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
                  개인정보 처리방침을 수립·공개합니다.
                </p>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 1조(개인정보의 처리 목적)
                </h3>
                <p className="mb-2">
                  &lt;DOCSHUND&gt;은(는) 다음의 목적을 위하여 개인정보를
                  처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
                  용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                  「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한
                  조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>홈페이지 회원 가입 및 관리</li>
                  <li>서비스 제공</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 2조(개인정보 수집 항목)
                </h3>
                <p className="mb-2">
                  &lt;DOCSHUND&gt;은(는) 「개인정보 보호법」에 따라 서비스
                  제공을 위해 필요 최소한의 범위에서 개인정보를 수집·이용합니다.
                  해당 정보는 최초 로그인 시의 동의 여부 확인을 통해 정보주체의
                  동의 하에 수집됩니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>회원 서비스 운영</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 3조(개인정보의 처리 및 보유기간)
                </h3>
                <p className="mb-2">
                  &lt;DOCSHUND&gt;은(는) 법령에 따른 개인정보 보유·이용기간 또는
                  정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보
                  보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>홈페이지 회원 가입 및 관리 : 홈페이지 탈퇴 후 1년까지</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 4조(정보주체의 권리·의무 및 그 행사 방법)
                </h3>
                <p className="mb-2">
                  정보주체는 &lt;DOCSHUND&gt;에 대해 다음과 같은 권리를 행사할
                  수 있으며, 만14세 미만 아동의 법정대리인은 그 아동의
                  개인정보에 대한 열람, 정정·삭제, 처리정지를 요구할 수
                  있습니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정·삭제 요구</li>
                  <li>개인정보 처리정지 요구</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 5조(개인정보의 파기 절차 및 방법)
                </h3>
                <p className="mb-2">
                  &lt;DOCSHUND&gt;은(는) 개인정보 보유기간의 경과, 처리목적 달성
                  등 개인정보가 불필요하게 되었을 때에는 지체없이 해당
                  개인정보를 파기합니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>파기절차</li>
                  <li>파기방법</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 6조(정보주체의 권익침해에 대한 구제 방법)
                </h3>
                <p className="mb-2">
                  정보주체는 개인정보침해로 인한 구제를 받기 위하여
                  개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터
                  등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
                </p>
                <ul className="list-disc list-inside mt-2 mb-4">
                  <li>
                    개인정보 분쟁조정위원회 : (국번없이) 1833-6972
                    (www.kopico.go.kr)
                  </li>
                  <li>
                    개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
                  </li>
                  <li>대검찰청 : (국번없이) 1301 (www.spo.go.kr)</li>
                  <li>경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제 7조(개인정보 처리방침의 변경에 관한 사항)
                </h3>
                <p>이 개인정보 처리방침은 2025. 01. 22. 부터 적용됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
