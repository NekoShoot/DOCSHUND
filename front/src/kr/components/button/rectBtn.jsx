import PropTypes from "prop-types";

const RectBtn = ({ onClick, text = "", className = "" }) => {
  return (
    <button
      className={`bg-[#bc5b39] rounded-[5px] px-[clamp(15px,1.5vw,4px)] py-[clamp(5px,0.7vw,8px)] text-[clamp(13px,1.5vw,15px)] text-white font-semibold hover:bg-[#C96442] cursor-pointer ${className}`}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
};

RectBtn.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default RectBtn;
