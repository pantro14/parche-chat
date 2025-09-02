import { deleteModel, model, models, Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'chats', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    text: { type: String, required: true },
    images: { type: [String], default: '' },
    readBy: { type: [Schema.Types.ObjectId], ref: 'users' },
    unreadCounts: { type: Object, default: {} },
  },
  { timestamps: true }
);

if (models && models['chats']) {
  deleteModel('chats');
}

const MessageModel = model('chats', MessageSchema);
export default MessageModel;
