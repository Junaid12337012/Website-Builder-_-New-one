import mongoose from 'mongoose'

// Define the schema for individual elements
const elementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  // Flexible schema to store different properties for different element types
  text: String,
  level: Number,
  align: String,
  url: String,
  alt: String,
  variant: String,
  height: String,
  color: String,
  // Allow any other properties
}, { _id: false, strict: false })

const projectSettingsSchema = new mongoose.Schema({
  seo: {
    title: String,
    description: String,
    keywords: [String],
    favicon: String
  },
  analytics: {
    googleAnalyticsId: String,
    facebookPixelId: String
  },
  integrations: {
    googleMapsApiKey: String,
    recaptchaSiteKey: String
  },
  domain: {
    customDomain: String,
    subdomain: String
  },
  version: { type: String, default: '1.0.0' }
}, { _id: false })

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    template: {
      id: { type: String, default: 'blank' },
      name: { type: String, default: 'Blank' },
      category: { type: String, default: 'general' }
    },
    thumbnail: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'], 
      default: 'draft' 
    },
    settings: { 
      type: projectSettingsSchema,
      default: () => ({})
    },
    content: {
      elements: [elementSchema],
      styles: { type: Map, of: String, default: {} },
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        // Ensure content is always an object with elements array and styles object
        if (!ret.content) {
          ret.content = { elements: [], styles: {} }
        } else {
          ret.content.elements = ret.content.elements || []
          ret.content.styles = ret.content.styles || {}
        }
        return ret
      }
    }
  }
)

// Add text index for search functionality
projectSchema.index({ name: 'text' })

export default mongoose.model('Project', projectSchema)
