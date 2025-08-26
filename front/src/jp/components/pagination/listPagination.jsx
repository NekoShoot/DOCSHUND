import PropTypes from "prop-types";

// 페이지네이션 컴포넌트
const ListPagination = ({ totalPages, currentPage, setCurrentPage }) => {
  // 페이지 버튼 배열 생성 함수
  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      // 전체 페이지가 5개 이하라면 모두 표시
      startPage = 1;
      endPage = totalPages;
    } else {
      // 현재 페이지가 처음 3개 중 하나일 경우: 1, 2, 3, 4, 5 유지
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      }
      // 현재 페이지가 마지막 3개 중 하나일 경우: totalPages - 4 ~ totalPages 유지
      else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages;
      }
      // 기본적으로 현재 페이지 기준 ±2 유지
      else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // 페이지 버튼 배열 채우기
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    // "<"" 버튼 (이전 페이지 이동)
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        className={`text-gray-500 hover:text-gray-800 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => setCurrentPage(currentPage - 2)} // 이전 페이지로 이동(원래 페이지는 currentPage-1)
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 페이지 숫자 버튼들 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-md cursor-pointer ${
            page === currentPage
              ? "bg-[#bc5b39] text-white font-bold"
              : "text-gray-500 hover:text-[#bc5b39]"
          }`}
          onClick={() => setCurrentPage(page - 1)}
        >
          {page}
        </button>
      ))}

      {/* ">" 버튼 (다음 페이지 이동) */}
      <button
        className={`text-gray-500 hover:text-gray-800 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={() => setCurrentPage(currentPage)} // 다음 페이지로 이동(원래 페이지는 currentPage-1)
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

// props 타입 설정
ListPagination.propTypes = {
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
};

export default ListPagination;
