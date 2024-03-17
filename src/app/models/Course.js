const mongoose = require("mongoose");
const slugify = require("slugify");
// const mongooseDelete = require("mongoose-delete");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    level: { type: String },
    slug: { type: String, unique: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true, 
  }
);

// Tạo slug từ trường 'name' trước khi lưu vào cơ sở dữ liệu
CourseSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// CourseSchema.plugin(mongooseDelete, {
//   deletedAt: true,
//   overrideMethods: "all",
// });

module.exports = mongoose.model("Course", CourseSchema);

