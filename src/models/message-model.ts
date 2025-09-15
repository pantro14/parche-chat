import { deleteModel, model, models, Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    socketMessageId: { type: String, default: '' },
    chat: { type: Schema.Types.ObjectId, ref: 'chats', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    text: { type: String, required: true },
    images: { type: [String], default: '' },
    readBy: { type: [Schema.Types.ObjectId], ref: 'users' },
  },
  { timestamps: true }
);

if (models && models['messages']) {
  deleteModel('messages');
}

const MessageModel = model('messages', MessageSchema);
export default MessageModel;
