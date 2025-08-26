import { Outlet } from "react-router-dom";
import ArticleItemService from "../../community/services/articleItemService";
import {
  likeDocs,
  likeTranslate,
} from "../../translate/services/translatePostService";
import _ from "lodash";

const ArchivePage = () => {
  const handleLikeToggle = _.debounce(async (type, id, transId = null) => {
    try {
      if (type === "article") {
        await ArticleItemService.likeArticleItem(id);
      } else if (type === "docs") {
        await likeDocs(id);
      } else if (type === "trans" && transId) {
        await likeTranslate(id, transId);
      }
    } catch (error) {
      // console.log("좋아요 실패", error);
    }
  }, 300);

  return (
    <div>
      <Outlet context={{ handleLikeToggle }} />
    </div>
  );
};

export default ArchivePage;
