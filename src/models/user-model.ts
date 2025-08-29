import { deleteModel, model, models, Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String },
    profilePicture: { type: String, required: false },
    bio: { type: String, required: false },
  },
  { timestamps: true }
);

if (models && models['users']) {
  deleteModel('users');
}

const UserModel = model('users', UserSchema);
export default UserModel;
