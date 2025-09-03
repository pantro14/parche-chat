import { RootState } from '@/redux/store';
import { SetCurrentUser, UserState } from '@/redux/userSlice';
import { getCurrentinUserFromDB } from '@/server-actions/users';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CurrentUserInfo from './current-user-info';

function Header() {
  const [showCurrentUserInfo, setShowCurrentUserInfo] =
    useState<boolean>(false);

  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await getCurrentinUserFromDB();
      dispatch(SetCurrentUser(response));
      if (response.error) throw new Error(response.error);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className='bg-primary w-full p-5 flex justify-between items-center border-b border-solid border-gray-300'>
      <div className='gap-5 flex items-center border-radius-md'>
        <div className='bg-white'>
          <Avatar src='https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzMxeFBzM0NuWTg0N29QVThuTzUyRHMxT25OUiJ9?width=400'></Avatar>
        </div>
        <h1 className='text-2xl font-semibold text-white'>Parche Chat</h1>
      </div>
      <div className='gap-5 flex items-center'>
        <span className='text-white'>{currentUserData?.name}</span>
        <Avatar
          className='cursor-pointer'
          src={currentUserData?.profilePicture}
          onClick={() => {
            setShowCurrentUserInfo(true);
          }}
        />
      </div>
      {showCurrentUserInfo && (
        <CurrentUserInfo
          showCurrentUserInfo={showCurrentUserInfo}
          setShowCurrentUserInfo={setShowCurrentUserInfo}
        />
      )}
    </div>
  );
}

export default Header;
