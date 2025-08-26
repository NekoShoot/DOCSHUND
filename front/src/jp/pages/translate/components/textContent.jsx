import PropTypes from "prop-types";
import ToastViewer from "./toastViewer";

const TextContent = ({ tag, textContent }) => {
  return (
    <div className="flex flex-col h-[calc(50%)] min-h-0 w-full group">
      <div className="bg-slate-100 w-3/10 min-w-[200px] flex items-center px-4 py-2 rounded-t-xl border border-slate-200 h-10 transition-all duration-300 group-hover:bg-slate-200 relative">
        <svg
          className="w-4 h-4 mr-2 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <span className="font-medium text-slate-700 text-sm tracking-wide">
          {tag}
        </span>
        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-10"></div>
      </div>
      <div className="flex-1 bg-white rounded-b-xl border border-slate-200 border-t-1 overflow-y-auto p-4 transition-all duration-300 group-hover:shadow-md">
        <ToastViewer content={textContent} />
      </div>
    </div>
  );
};

TextContent.propTypes = {
  tag: PropTypes.string,
  textContent: PropTypes.string,
  isHTML: PropTypes.bool,
};

export default TextContent;
