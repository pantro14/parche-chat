import { assertAreUsers, assertIsChat } from '@/helpers/type-guards';
import { getChatDataById } from '@/server-actions/chats';
import { getAllUsers } from '@/server-actions/users';
import Link from 'next/link';
import GroupForm from '../../_components/group-form';

interface EditGroupProps {
  params: Promise<{ id: string }>;
}

async function EditGroup({ params }: EditGroupProps) {
  const { id } = await params;
  const chat = await getChatDataById(id);
  assertIsChat(chat);
  const users = await getAllUsers();
  assertAreUsers(users);

  return (
    <div className='p-5'>
      <Link
        className='text-primary border border-primary px-5 py-2 no-underline border-solid'
        href='/'
      >
        Back to Chats
      </Link>
      <h1 className='text-primary text-xl font-bold py-5 uppercase'>
        Create Group Chat
      </h1>
      <GroupForm users={users} chat={chat} />
    </div>
  );
}

export default EditGroup;
