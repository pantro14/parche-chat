import { RootState } from '@/redux/store';
import { UserState } from '@/redux/user/userSlice';
import { useClerk } from '@clerk/nextjs';
import { Button, Divider, Drawer, message } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, useState } from 'react';
import { useSelector } from 'react-redux';

interface CurrentUserInfoProps {
  showCurrentUserInfo: boolean;
  setShowCurrentUserInfo: Dispatch<React.SetStateAction<boolean>>;
}

function CurrentUserInfo({
  showCurrentUserInfo,
  setShowCurrentUserInfo,
}: CurrentUserInfoProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const getProperty = (key: string, value: string) => {
    return (
      <div className='flex flex-col'>
        <span className='font-semibold text-gray-700'>{key}</span>
        <span className='text-gray-600'>{value}</span>
      </div>
    );
  };

  const onLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      setShowCurrentUserInfo(false);
      router.push('/sign-in');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={showCurrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title='Profile'
    >
      {currentUserData && (
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image
              src={currentUserData?.profilePicture}
              width={120}
              height={120}
              alt='profile'
              className='rounded-full object-cover'
            />
            <span className='text-gray-500 cursor-pointer'>
              Change Profile Picture
            </span>
          </div>
          <Divider className='my-1 border-gray-200' />

          <div className='flex flex-col gap-5'>
            {getProperty('Name', currentUserData.name)}
            {getProperty('Username', currentUserData.username)}
            {getProperty('Id', currentUserData._id)}
            {getProperty(
              'Joined On',
              dayjs(currentUserData.createdAt.toString()).format(
                'DD MMM YYYY HH:mm'
              )
            )}
          </div>
          <div className='mt-5'>
            <Button
              className='w-full'
              color='danger'
              variant='solid'
              loading={loading}
              onClick={() => onLogout()}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default CurrentUserInfo;
