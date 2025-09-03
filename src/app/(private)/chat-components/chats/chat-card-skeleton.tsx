import { Skeleton } from 'antd';

function ChatCardSkeleton() {
  return (
    <div className='flex items-center gap-5 py-3 px-2'>
      <Skeleton.Avatar active shape='circle' size='default' />
      <div className='flex-1 min-w-0'>
        <Skeleton.Input className='block !w-full' size='small' active />
      </div>
    </div>
  );
}

export default ChatCardSkeleton;
