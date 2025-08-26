import PropTypes from "prop-types";

const RoundCornerBtn = ({ onClick, text = "" }) => {
  // 버튼을 사용할 때 onClick에 실행할 함수와, 버튼의 이름인 text를 작성하고 사용(초기값은 빈칸)

  return (
    <button
      className="box-border bg-[#bc5b39] rounded-[12px] px-[20px] py-[11px] w-fit min-w-fit h-10 relative flex flex-nowrap items-center justify-center hover:bg-[#C96442] cursor-pointer"
      onClick={onClick}
      type="button"
    >
      <div className="text-white font-semibold min-w-fit flex flex-nowrap">
        {text}
      </div>
    </button>
  );
};

RoundCornerBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
};

export default RoundCornerBtn;
