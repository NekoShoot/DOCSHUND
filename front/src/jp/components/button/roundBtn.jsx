import PropTypes from "prop-types";

const RoundBtn = ({ onClick, icon = "" }) => {
  // 버튼을 사용할 때 onClick에 실행할 함수와, 이 버튼에 들어갈 아이콘 이미지의 주소를 작성하고 사용

  return (
    <button
      className="box-border bg-[#bc5b39] rounded-full px-[20px] py-[11px] w-[64px] h-[64px] relative flex items-center justify-center hover:bg-[#C96442]"
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
};

RoundBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

export default RoundBtn;
