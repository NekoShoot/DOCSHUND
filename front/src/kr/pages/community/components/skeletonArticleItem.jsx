const SkeletonArticleItem = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default SkeletonArticleItem;
