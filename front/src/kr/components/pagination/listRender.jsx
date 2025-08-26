import PropTypes from "prop-types";

import ListPagination from "./listPagination";

// 게시글 리스트 렌더링 컴포넌트
// data: 리스트 데이터
// renderItem: 각 아이템을 렌더링하는 함수 <- articleList.jsx에서 정의
// totalPages: 전체 페이지 수 <- 페이지네이션 필요 없을 시 0으로
// currentPage: 현재 페이지 <- 페이지네이션 필요 없을 시 0으로
// setCurrentPage: 현재 페이지 변경 함수
// itemCategory: 아이템 카테고리. 게시글, 댓글, 문의, 공지사항 등
const ListRender = ({
  data,
  renderItem,
  totalPages,
  currentPage,
  setCurrentPage,
  itemCategory,
}) => {
  return (
    // 리스트 아이템 렌더링
    <div>
      {/* 데이터가 있을 때 */}
      {data.length > 0 ? (
        data.map((item) => (
          <div
            // 게시글, 문의글, 댓글 등의 리스트를 렌더링할 때 key 값이 중복되지 않도록
            // itemCategory를 통해 key 값에 해당하는 아이템의 id를 구분
            key={item[itemCategory + "Id"]}
            className="border-b border-[#E4DCD4] py-3"
          >
            {/* // renderItem 함수를 통해 각 아이템 렌더링 */}
            {renderItem(item)}
          </div>
        ))
      ) : (
        // 데이터가 없을 때
        <p className="text-gray-500 text-center mt-6">데이터가 없습니다.</p>
      )}
      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <ListPagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

// props 타입 설정
ListRender.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  itemsPerPage: PropTypes.number,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  itemCategory: PropTypes.string,
};

export default ListRender;
