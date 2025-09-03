import uploadNewImage from '@/helpers/image';
import { assertUserIsUpdated } from '@/helpers/type-guards';
import { RootState } from '@/redux/store';
import { SetCurrentUser, UserState } from '@/redux/userSlice';
import { updateUserProfilePicture } from '@/server-actions/users';
import { useClerk } from '@clerk/nextjs';
import { Button, Divider, Drawer, message, Upload } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CurrentUserInfoProps {
  showCurrentUserInfo: boolean;
  setShowCurrentUserInfo: Dispatch<React.SetStateAction<boolean>>;
}

function CurrentUserInfo({
  showCurrentUserInfo,
  setShowCurrentUserInfo,
}: CurrentUserInfoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { signOut } = useClerk();
  const router = useRouter();
  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

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
      message.success('Logged out successfully');
      router.push('/sign-in');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onUploadPicture = async () => {
    setLoading(true);
    try {
      const { secure_url: url } = await uploadNewImage(selectedFile as File);
      const userReponse = await updateUserProfilePicture(
        currentUserData!._id as string,
        url
      );
      assertUserIsUpdated(userReponse);
      message.success('Profile picture updated successfully');
      dispatch(SetCurrentUser(userReponse));
      setSelectedFile(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
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
            {!selectedFile && (
              <Image
                src={currentUserData?.profilePicture}
                width={120}
                height={120}
                alt='profile'
                className='rounded-full object-cover'
              />
            )}

            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              listType={selectedFile ? 'picture-circle' : 'text'}
              showUploadList={selectedFile ? { showPreviewIcon: true } : false}
              maxCount={1}
            >
              <span className='text-gray-500 cursor-pointer'>
                Change Profile Picture
              </span>
            </Upload>
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
          <div className='mt-5 flex flex-col gap-3'>
            {selectedFile && (
              <Button
                className='w-full'
                color='primary'
                variant='outlined'
                loading={loading}
                onClick={() => onUploadPicture()}
              >
                Upload Picture
              </Button>
            )}
            <Button
              className='w-full'
              color='danger'
              variant='solid'
              loading={!selectedFile && loading}
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
