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
      content: "使い方を簡単に案内します。",
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
        "サイドバーでは文書一覧、通知、メモを確認できます。戻るボタンを使って文書一覧に戻ることができます。",
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
        "各文段をクリックするとベスト翻訳の内容が表示され、右クリックすると翻訳を作成したり、記録を表示したりできます。",
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
        "原文書の内容を検索できます。検索結果は原文データをレンダリングした形式で表示されます。",
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
      content: "翻訳全体表示ボタンを使って、全翻訳内容を表示できます。",
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
      content: "チャットボットボタンを通じて翻訳ボットと会話できます。",
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
      content: "チャットボタンを通じて他のユーザーと会話できます。",
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
      content: "開始ボタンを押すと、サイトの利用規約に同意したことになります。",
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
              back: "以前",
              close: "閉じる",
              last: "開始",
              next: "次へ",
              skip: "スキップ",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Information;
