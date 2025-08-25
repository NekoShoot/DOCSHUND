import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { axiosJsonInstance } from "../../utils/axiosInstance.jsx";
import ChatStore from "../../store/chatStore.jsx";
import { Flag, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import ReportModal from "../report.jsx";
import useReportStore from "../../store/reportStore.jsx";
import useKeyComposing from "../../hooks/useKeyComposing";
import useKoreanTime from "../../hooks/useKoreanTime";

const Chat = () => {
  const { isChatVisible, toggleChat } = ChatStore();
  const location = useLocation();
  const navigate = useNavigate();
  const docsId = location.pathname.split("/")[4];
  const token = localStorage.getItem("token");
  const { openReport, closeReport, toggleReport } = useReportStore();
  const { isComposing, keyComposingEvents } = useKeyComposing();
  const { convertToKoreanTime } = useKoreanTime();

  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitialMessages, setLoadingInitialMessages] = useState(true);

  const stompClient = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    if (!loadingInitialMessages && isChatVisible) {
      const container = containerRef.current;
      if (container) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceFromBottom < 50) {
          setTimeout(() => {
            scrollToBottom();
          }, 300);
        }
      }
    }
  }, [loadingInitialMessages, isChatVisible, messages]);

  const connect = () => {
    if (stompClient.current && stompClient.current.connected) return;
    const socketFactory = () => {
      const socket = new WebSocket("wss://i12a703.p.ssafy.io/ws-connect");
      socket.onerror = (event) => {
        // console.error("WebSocket Error:", event);
        toast.error("웹소켓 연결 오류가 발생했습니다.", {
          toastId: "websocket-error",
        });
      };
      socket.onclose = (event) => {
        console.warn("WebSocket Closed:", event);
        toast.error("웹소켓 연결이 종료되었습니다.", {
          toastId: "websocket-closed",
        });
      };
      return socket;
    };
    stompClient.current = Stomp.over(socketFactory);
    stompClient.current.debug = () => {};
    stompClient.current.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        stompClient.current.subscribe(`/sub/chats/${docsId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          const container = containerRef.current;
          setMessages((prev) => [...prev, newMessage]);
          if (newMessage.userId === userId) {
            setTimeout(() => {
              scrollToBottom();
            }, 300);
          } else if (
            container &&
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
              50
          ) {
            setTimeout(() => {
              scrollToBottom();
            }, 300);
          }
        });
        stompClient.current.subscribe("/user/queue/errors", (message) => {
          const errorData = JSON.parse(message.body);
          // console.error("STOMP 구독 에러:", errorData);
          toast.error(`${errorData.errorType}: ${errorData.message}`, {
            toastId: "stomp-error",
          });
        });
      },
      (error) => {
        // console.error("STOMP Error:", error);
        const errorMessage =
          (error && error.headers && error.headers.message) ||
          "알 수 없는 STOMP 오류가 발생했습니다.";
        toast.error(errorMessage, {
          toastId: "stomp-error",
        });
      }
    );
  };

  const disconnect = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.disconnect();
    }
  };

  const loadInitialMessages = async () => {
    setLoadingInitialMessages(true);
    try {
      const response = await axiosJsonInstance.get(
        `chats/${docsId}?page=0&size=50`
      );
      const { content, last } = response.data;
      const initialMessages = content.reverse();
      setMessages(initialMessages);
      setCurrentPage(0);
      setHasMore(!last && initialMessages.length > 0);
    } catch (error) {
      // console.error("Error loading initial messages:", error);
    }
    setLoadingInitialMessages(false);
  };

  const loadPreviousMessages = async () => {
    if (!hasMore) return;
    const container = containerRef.current;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;
    try {
      const nextPage = currentPage + 1;
      const response = await axiosJsonInstance.get(
        `chats/${docsId}?page=${nextPage}&size=50`
      );
      const { content, last } = response.data;
      const newMessages = content.reverse();
      setMessages((prev) => [...newMessages, ...prev]);
      setCurrentPage(nextPage);
      setHasMore(!last);
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
      }, 0);
    } catch (error) {
      // console.error("Error loading previous messages:", error);
    }
  };

  const handleInputChange = (event) => {
    if (event.target.value.length <= 200) {
      setInputValue(event.target.value);
    } else {
      toast.warn("200자 이상의 메세지는 보낼 수 없습니다.", {
        toastId: "message-length-warning",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isComposing) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (inputValue.length > 200) {
      toast.warn("200자 이상의 메세지는 보낼 수 없습니다.", {
        toastId: "message-length-warning",
      });
      return;
    }
    if (stompClient.current?.connected && inputValue.trim() !== "") {
      const body = { docsId, content: inputValue };
      stompClient.current.send(
        `/pub/chats/${docsId}`,
        { Authorization: `Bearer ${token}` },
        JSON.stringify(body)
      );
      setInputValue("");
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  };

  useEffect(() => {
    if (!isChatVisible) {
      closeReport();
    }
  }, [isChatVisible, closeReport]);

  useEffect(() => {
    // docsId가 변경될 때마다 기존 연결을 해제하고 상태를 초기화합니다.
    disconnect();
    setMessages([]);
    setCurrentPage(0);
    setHasMore(false);

    // 새로운 docsId에 맞게 연결을 재설정하고 초기 메시지를 로드합니다.
    connect();
    loadInitialMessages();

    // 컴포넌트 언마운트 혹은 docsId 변경 시 연결 해제
    return () => disconnect();
  }, [docsId]);

  return (
    <div>
      {localStorage.getItem("token") && (
        <div className="fixed z-[2600] right-1 flex">
          <AnimatePresence>
            {isChatVisible && (
              <motion.div
                key="chatbot-modal"
                initial={{ opacity: 0, y: 1000 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 1000 }}
                onAnimationComplete={scrollToBottom}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                // className="fixed inset-0 sm:inset-auto sm:bottom-35 sm:right-3.5 w-full h-full sm:w-[400px] sm:h-[95vh] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col z-[2600] sm:-translate-x-[12.5%] sm:translate-y-[16%]"
                className="fixed inset-0 sm:inset-auto sm:bottom-[9vh] sm:right-[1vw] w-full h-full sm:w-[400px] sm:h-[95vh] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col z-[2600] sm:-translate-x-[12.5%] sm:translate-y-[8%]"
                onClick={(e) => e.stopPropagation()}
              >
                <ReportModal />
                <div className="p-2 bg-[#C96442] rounded-t-xl text-white font-semibold flex items-center justify-between">
                  <span>문서 채팅</span>
                  <button
                    onClick={() => {
                      ChatStore.setState({ isChatVisible: false });
                      closeReport();
                    }}
                    className="cursor-pointer"
                  >
                    <X className="h-8 w-8 text-white" />
                  </button>
                </div>

                <div
                  ref={containerRef}
                  className="flex-1 overflow-y-auto p-2 space-y-2"
                >
                  {!loadingInitialMessages && (
                    <div className="text-center mb-2">
                      {hasMore && messages.length > 0 ? (
                        <button
                          onClick={loadPreviousMessages}
                          className="px-2 py-1 text-gray-400 underline rounded hover:text-gray-800"
                        >
                          이전 채팅 더 불러오기
                        </button>
                      ) : (
                        messages.length > 0 && (
                          <span className="text-xs text-gray-500">
                            더 이상 불러올 메세지가 없습니다.
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {loadingInitialMessages ? (
                    <div className="text-center text-gray-500">
                      메시지를 불러오는 중...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">
                      메시지가 없습니다.
                    </div>
                  ) : (
                    messages.map((item, index) =>
                      item.userId !== userId ? (
                        <div key={index} className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            <img
                              src={item.profileImg}
                              alt="Profile"
                              className="w-8 h-8 rounded-full border border-[#c5afa7] cursor-pointer"
                              onClick={() => {
                                toggleChat();
                                setTimeout(() => {
                                  navigate(`/userPage/${item.userId}`);
                                }, 300);
                              }}
                            />
                            <p className="text-xs font-semibold">
                              {item.nickName}
                            </p>
                          </div>
                          <div className="mt-1 ml-10 p-2 rounded-lg bg-gray-100 text-gray-800 max-w-[280px]">
                            <p className="text-sm break-all break-words overflow-wrap">
                              {item.content}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                useReportStore.setState({
                                  originContent: item.content,
                                  reportedUser: item.userId,
                                  commentId: null,
                                  articleId: null,
                                  transId: null,
                                  chatId: item.chatId,
                                });
                                openReport();
                                toggleReport();
                              }}
                              className="mt-1 text-xs text-red-500 flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <Flag size={10} /> 신고
                            </button>
                          </div>
                          <div className="ml-10 mt-1">
                            <span className="text-xs text-gray-500">
                              {convertToKoreanTime(item.createdAt) ||
                                "표시할 수 없는 날짜입니다."}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // 본인 메시지
                        <div key={index} className="flex flex-col items-end">
                          <div className="mt-1 p-2 rounded-lg bg-[#bc5b39] text-white max-w-[280px]">
                            <p className="text-sm break-all break-words overflow-wrap">
                              {item.content}
                            </p>
                          </div>
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              {convertToKoreanTime(item.createdAt) ||
                                "표시할 수 없는 날짜입니다."}
                            </span>
                          </div>
                        </div>
                      )
                    )
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-2 border-t border-gray-200 flex flex-row gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    {...keyComposingEvents}
                    className="flex-1 w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
                    placeholder="메시지를 입력하세요..."
                  />
                  <button
                    onClick={sendMessage}
                    className="sm:w-auto px-3 py-2 bg-[#bc5b39] text-white rounded-full hover:bg-[#C96442] cursor-pointer"
                  >
                    <Send />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Chat;
