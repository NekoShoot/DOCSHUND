const TermsPage = () => {
  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 max-w-[1280px] mx-auto">
        <div className="flex justify-between mt-2 mb-6">
          <h1 className="font-bold text-2xl">이용약관</h1>
        </div>
        <div className="bg-white rounded-xl border border-[#E1E1DF]">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="border-t border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="min-h-[200px] whitespace-pre-wrap my-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2">
                  DOCSHUND 서비스 이용약관
                </h2>
                <p className="mb-2">최종 업데이트: 2024년 2월 6일</p>
                <p className="mb-2">
                  본 서비스 이용약관(이하 &quot;약관&quot;)은 DOCSHUND (이하
                  &quot;서비스&quot;)를 제공하는 [운영 주체] (이하
                  &quot;회사&quot;)와 서비스를 이용하는 사용자(이하
                  &quot;회원&quot;) 간의 권리, 의무 및 책임 사항을 규정합니다.
                </p>
                <p className="mb-2">
                  DOCSHUND는 Apache 2.0 라이센스를 기반으로 공식문서 번역 및
                  학습을 지원하는 플랫폼입니다. 본 서비스를 이용하기 전 반드시
                  본 약관을 숙지하시고 동의한 후 이용해 주시기 바랍니다.
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제1조 (목적)
                </h3>
                <p className="mb-2">
                  이 약관은 DOCSHUND 서비스의 이용과 관련하여 회사와 회원 간의
                  권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로
                  합니다.
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제2조 (용어의 정의)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    서비스: 회사가 제공하는 공식문서 번역 및 학습 플랫폼을
                    의미합니다.
                  </li>
                  <li>
                    회원: 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
                  </li>
                  <li>
                    콘텐츠: 서비스 내에서 제공되거나 회원이 생성하는 번역,
                    게시글, 댓글 등의 자료를 의미합니다.
                  </li>
                  <li>
                    관리자: 회사가 지정한 서비스 운영 및 관리를 담당하는 자를
                    의미합니다.
                  </li>
                  <li>
                    Apache 2.0 라이센스: DOCSHUND가 준수하는 오픈소스
                    라이센스로, 공식문서 번역이 허용된 경우에 한해 제공됩니다.
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제3조 (서비스 이용 계약 및 계정 관리)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    회원 가입은 Google 및 GitHub 계정을 이용한 소셜 로그인
                    방식으로만 가능합니다.
                  </li>
                  <li>
                    최초 로그인 시, 회원은 닉네임을 필수 입력해야 하며, 해당
                    닉네임은 유일해야 합니다.
                  </li>
                  <li>
                    회원은 프로필 정보(닉네임, 프로필 사진, 관심 기술 등)를
                    수정할 수 있으며, 닉네임 변경 시 운영 정책에 따라 변경이
                    제한될 수 있습니다.
                  </li>
                  <li>
                    회사는 다음과 같은 사유가 발생할 경우 회원의 서비스 이용을
                    제한할 수 있습니다.
                    <ul className="list-disc list-inside ml-4">
                      <li>타인의 계정을 도용하거나 허위 정보를 입력한 경우</li>
                      <li>
                        부적절한 닉네임을 사용한 경우 (욕설, 혐오 표현, 광고성
                        닉네임 등)
                      </li>
                      <li>기타 본 약관을 위반하는 행위를 한 경우</li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제4조 (서비스 이용 정책 및 제한 사항)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    본 서비스는 공식문서의 번역 및 학습을 목적으로 하며, 회원은
                    이를 상업적 목적으로 이용할 수 없습니다.
                  </li>
                  <li>
                    저작권 및 라이센스 준수:
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        DOCSHUND는 Apache 2.0 라이센스를 기반으로 하며, 해당
                        라이센스에 따라 번역이 허용된 공식문서만을 서비스에
                        포함합니다.
                      </li>
                      <li>
                        번역된 문서의 저작권은 원 저작권자에게 있으며,
                        DOCSHUND는 번역된 문서의 소유권을 주장하지 않습니다.
                      </li>
                      <li>
                        회원이 직접 번역을 제공하는 경우, 해당 번역이 Apache 2.0
                        라이센스 및 원 저작물의 라이센스를 준수하는지 확인해야
                        합니다.
                      </li>
                      <li>
                        저작권 문제 발생 시, 회사는 즉시 해당 문서를 삭제할 수
                        있습니다.
                      </li>
                    </ul>
                  </li>
                  <li>
                    회원이 업로드하는 콘텐츠(번역, 게시글, 댓글, 채팅 등)는
                    다음과 같은 사항을 준수해야 합니다.
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        비속어, 욕설, 혐오 표현, 성희롱, 차별적인 발언을
                        포함하지 않아야 합니다.
                      </li>
                      <li>타인의 저작권을 침해하지 않아야 합니다.</li>
                      <li>허위 정보 및 허위 사실을 유포하지 않아야 합니다.</li>
                      <li>광고, 스팸, 피싱 링크를 포함하지 않아야 합니다.</li>
                      <li>
                        기타 공공질서 및 미풍양속을 해치는 내용이 포함되지
                        않아야 합니다.
                      </li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제5조 (공식문서 라이센스 및 번역 콘텐츠 제공 정책)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    DOCSHUND는 공식문서의 라이센스를 철저히 검토하여, Apache 2.0
                    라이센스가 적용된 문서 또는 재배포 및 번역이 허용된 문서만
                    제공합니다.
                  </li>
                  <li>
                    번역이 허용되지 않는 문서는 제공할 수 없으며, 해당 문서의
                    번역이 필요할 경우 라이센스 보유자의 승인을 받아야 합니다.
                  </li>
                  <li>
                    회원이 요청한 번역 문서는 일정 기준 이상의 요청이 누적될
                    경우, 회사가 라이센스를 검토한 후 제공 여부를 결정합니다.
                  </li>
                  <li>
                    번역된 문서는 공동 작업을 기반으로 하며, 회원들은 번역을
                    제안하고 수정할 수 있습니다.
                  </li>
                  <li>
                    특정 문단에 대한 번역은 투표 시스템을 통해 최적의 번역이
                    선택되며, 최다 추천 번역이 기본 번역으로 반영됩니다.
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제6조 (신고 정책 및 이용 제한)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    서비스 내에서 신고 기능을 통해 부적절한 콘텐츠 및 사용자
                    행동을 신고할 수 있습니다.
                  </li>
                  <li>
                    신고된 콘텐츠는 관리자가 검토하며, 신고 횟수가 일정 기준을
                    초과하면 자동으로 숨김 처리될 수 있습니다.
                  </li>
                  <li>
                    신고 대상이 될 수 있는 항목은 다음과 같습니다.
                    <ul className="list-disc list-inside ml-4">
                      <li>
                        욕설, 비방, 혐오 표현이 포함된 게시글/댓글/번역/채팅
                      </li>
                      <li>저작권을 침해한 콘텐츠</li>
                      <li>광고, 스팸, 피싱 링크 포함 콘텐츠</li>
                      <li>기타 부적절한 콘텐츠</li>
                    </ul>
                  </li>
                  <li>
                    신고가 누적된 사용자는 일정 기간 서비스 이용이 제한되거나
                    계정이 정지될 수 있습니다.
                  </li>
                  <li>
                    신고 처리 과정에서 회원에게 소명 기회가 주어지며, 관리자의
                    최종 판단에 따라 조치가 이루어집니다.
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제7조 (회원 탈퇴 및 서비스 종료)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    회원은 언제든지 서비스 내에서 탈퇴 신청을 할 수 있으며, 탈퇴
                    즉시 계정 정보가 삭제됩니다.
                  </li>
                  <li>
                    다만, 회원이 작성한 번역본, 게시글, 댓글, 채팅은 공익적인
                    목적을 위해 삭제되지 않을 수 있습니다.
                  </li>
                  <li>
                    회사는 다음과 같은 사유로 인해 서비스 운영을 중단할 수
                    있습니다.
                    <ul className="list-disc list-inside ml-4">
                      <li>저작권 문제 또는 라이센스 변경</li>
                      <li>기술적 문제 또는 운영상의 어려움</li>
                      <li>기타 불가항력적인 사유</li>
                    </ul>
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제8조 (책임의 한계 및 면책 조항)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    DOCSHUND는 회원이 제공한 번역본의 정확성, 신뢰성을 보장하지
                    않으며, 회원은 번역을 사용할 때 스스로 검토할 책임이
                    있습니다.
                  </li>
                  <li>
                    회사는 회원 간의 분쟁 및 법적 문제에 개입하지 않으며, 모든
                    책임은 해당 회원에게 있습니다.
                  </li>
                  <li>
                    서비스는 &quot;있는 그대로(AS-IS)&quot; 제공되며, 기술적
                    오류 또는 예기치 못한 장애가 발생할 수 있습니다.
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  제9조 (약관 변경 및 공지사항)
                </h3>
                <ol className="list-decimal list-inside mb-2">
                  <li>
                    본 약관은 서비스 운영 및 법률 변경에 따라 개정될 수 있으며,
                    변경 시 최소 7일 전에 공지됩니다.
                  </li>
                  <li>
                    변경된 약관에 동의하지 않을 경우, 회원은 서비스 이용을
                    중단하고 탈퇴할 수 있습니다.
                  </li>
                  <li>
                    공지 후에도 서비스를 계속 이용할 경우, 변경된 약관에 동의한
                    것으로 간주됩니다.
                  </li>
                </ol>
                <h3 className="text-base sm:text-lg font-bold mt-4 mb-2">
                  부칙
                </h3>
                <p>본 약관은 2024년 2월 6일 부터 적용됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
