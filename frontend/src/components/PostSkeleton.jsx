import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-2">
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-2 flex gap-4">
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
