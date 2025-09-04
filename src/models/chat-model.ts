import { deleteModel, model, models, Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
    users: { type: [Schema.Types.ObjectId], ref: 'users' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'messages' },
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String, default: '' },
    groupProfilePicture: { type: String, default: '' },
    groupBio: { type: String, default: '' },
    groupAdmins: { type: [Schema.Types.ObjectId], ref: 'users' },
    unreadCounts: { type: Object, default: {} },
  },
  { timestamps: true }
);

if (models && models['chats']) {
  deleteModel('chats');
}

const ChatModel = model('chats', ChatSchema);
export default ChatModel;
