'use client';
import uploadNewImage from '@/helpers/image';
import { assertIsChat } from '@/helpers/type-guards';
import { UserType } from '@/interfaces';
import { ChatGrouptForm, ChatType } from '@/interfaces/chat';
import { RootState } from '@/redux/store';
import { UserState } from '@/redux/userSlice';
import { createNewChat, updateChat } from '@/server-actions/chats';
import { Avatar, Button, Checkbox, Form, Input, message, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface GroupFormProps {
  users: UserType[];
  chat?: ChatType;
}

function GroupForm({ users, chat }: GroupFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    chat ? (chat?.users as UserType[]).map((user) => user._id) : []
  );
  const [selectedGroupPricture, setSelectedGroupPicture] =
    useState<File | null>(null);

  const router = useRouter();

  const { currentUserData }: UserState = useSelector(
    (state: RootState) => state.user
  );

  const onFinish = async (values: ChatGrouptForm) => {
    try {
      setLoading(true);
      const payload: Partial<ChatType> = {
        groupName: values.groupName,
        groupBio: values.groupBio,
        users: [
          ...(chat ? [] : [currentUserData?._id]),
          ...selectedUserIds,
        ] as string[],
        createdBy: currentUserData?._id,
        isGroupChat: true,
        groupProfilePicture: chat ? chat.groupProfilePicture : '',
      };

      if (selectedGroupPricture) {
        const { secure_url: groupProfilePicture } = await uploadNewImage(
          selectedGroupPricture
        );
        payload.groupProfilePicture = groupProfilePicture;
      }

      let response = null;
      if (chat) {
        response = await updateChat(chat._id, payload);
      } else {
        response = await createNewChat(payload);
      }
      assertIsChat(response);
      message.success(`Group ${chat ? 'updated' : 'created'} successfully`);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-2'>
      <div className='flex flex-col gap-5'>
        <span className='text-gray-500 text-xs'>
          Select members to add to the group
        </span>
        {users
          .filter((user) => user._id !== currentUserData?._id)
          .map((user) => (
            <div key={user._id} className='flex gap-5 items-center'>
              <Checkbox
                checked={selectedUserIds.includes(user._id)}
                onChange={() => {
                  if (selectedUserIds.includes(user._id)) {
                    setSelectedUserIds(
                      selectedUserIds.filter((id) => id !== user._id)
                    );
                  } else {
                    setSelectedUserIds([...selectedUserIds, user._id]);
                  }
                }}
              />
              <Avatar alt={user.name} src={user?.profilePicture} />
              <span className='text-gray-500 text-sm'>{user.name}</span>
            </div>
          ))}
      </div>
      <div>
        <Form layout='vertical' onFinish={onFinish} initialValues={chat}>
          <Form.Item
            label='Group Name'
            name='groupName'
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder='Enter group name' />
          </Form.Item>
          <Form.Item label='Group Description' name='groupBio'>
            <Input.TextArea placeholder='Enter group description' />
          </Form.Item>

          <Upload
            beforeUpload={(file) => {
              setSelectedGroupPicture(file);
              return false;
            }}
            maxCount={1}
            listType='picture-card'
            defaultFileList={
              chat
                ? [
                    {
                      uid: '-1',
                      name: 'group-picture',
                      url: chat.groupProfilePicture,
                    },
                  ]
                : []
            }
          >
            <span className='p-3 text-xs'>Upload group picture</span>
          </Upload>

          <div className='flex justify-end gap-5'>
            <Button
              onClick={() => {
                router.refresh();
                router.push('/');
              }}
            >
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              {chat ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GroupForm;
