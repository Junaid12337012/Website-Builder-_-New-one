import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
