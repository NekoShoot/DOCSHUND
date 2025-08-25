import { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const Information = () => {
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("hasAgreed");
    if (hasAgreed === "true") {
      setAgree(true);
    } else {
      setAgree(false);
    }
  }, []);

  const handleAgree = () => {
    if (!localStorage.getItem("hasAgreed")) {
      setAgree(true);
      localStorage.setItem("hasAgreed", "true");
    }
  };

  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      handleAgree();
      // setRun(false); // Joyride 종료
    }
  };

  const steps = [
    {
      target: "body",
      content: "사용법을 간단하게 안내하겠습니다.",
      placement: "center",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          fontSize: "1rem",
          color: "#424242",
        },
      },
    },
    {
      target: "#upperBtns",
      content:
        "사이드바에서는 문서 목록, 알림, 메모를 조회할 수 있습니다. 뒤로 나가기 버튼을 통해 문서 목록으로 돌아 갈 수 있습니다.",
      placement: "bottom",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
    {
      target: "#mainContent",
      content:
        "각 문단을 클릭하면 베스트 번역본의 내용을 볼 수 있고, 우클릭하면 번역을 작성하거나 기록을 볼 수 있습니다.",
      placement: "bottom",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
    {
      target: "#searchBox",
      content:
        "원본 문서의 내용을 검색할 수 있습니다. 검색 결과는 원본 데이터를 렌더링한 형태로 표시됩니다.",
      placement: "bottom",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
    {
      target: "#translateAllBtn",
      content: "번역 전체보기 버튼을 통해 전체 번역 내용을 볼 수 있습니다.",
      placement: "top-start",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
    {
      target: "#chatBotBtn",
      content: "챗봇 버튼을 통해 번역봇과 대화할 수 있습니다.",
      placement: "top-start",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
    {
      target: "#chatBtn",
      content: "채팅 버튼을 통해 다른 사용자들과 대화할 수 있습니다.",
      placement: "top-start",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",

          color: "#424242",
        },
      },
    },
    {
      target: "body",
      content: "시작 버튼을 누르면 사이트의 사용약관에 동의하게 됩니다.",
      placement: "center",
      styles: {
        options: {
          backgroundColor: "#E4DCD4",
          textAlign: "center",
          arrowColor: "#E4DCD4",
          color: "#424242",
        },
      },
    },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {!agree && (
        <div className="flex items-center inset-0 justify-center z-[3000] w-full h-full overflow-hidden">
          {/* Joyride를 상단에서 렌더링하여 UI 위에 나타나도록 변경 */}
          <Joyride
            steps={steps}
            continuous={true}
            showProgress={false}
            showSkipButton={true}
            hideCloseButton={true}
            allowClickThruHole={true}
            spotlightClicks={false} // 스포트라이트 영역 클릭 방지
            disableCloseOnEsc={true} // ESC 키로 종료 방지
            disableOverlayClose={true}
            run={true}
            callback={handleJoyrideCallback} // 스텝 완료 이벤트 감지
            disableScroll={true}
            styles={{
              options: {
                zIndex: 20000,
                primaryColor: "#BC5B39",
                overlay: {
                  position: "fixed",
                },
              },
            }}
            locale={{
              back: "이전",
              close: "닫기",
              last: "시작",
              next: "다음",
              skip: "건너뛰기",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Information;
