import { Skeleton } from 'antd';

function ChatCardSkeleton() {
  return (
    <div className='flex justify-between py-3 px-2'>
      <div className='flex flex-row items-center gap-5'>
        <Skeleton.Avatar active shape='circle' size='default' />
        <div className='flex-1 flex flex-col justify-between'>
          <Skeleton.Node active style={{ height: 10, width: 150 }} />
          <Skeleton.Node active style={{ height: 10, width: 250 }} />
        </div>
      </div>
      <div className='flex flex-col'>
        <Skeleton.Node active style={{ height: 10 }} />
      </div>
    </div>
  );
}

export default ChatCardSkeleton;
