const mongoose = require("mongoose");
const slugify = require("slugify");

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

//custom query helpers
CourseSchema.query.sortable = function (req) {
    if(req.query.hasOwnProperty('_sort')){
      const inValidtype =  ['asc', 'desc'].includes(req.query.type);
      return this.sort({
        [req.query.column]: inValidtype ? req.query.type : 'desc',
      });
    }else {
        return this;
    }
}

// Tạo slug từ trường 'name' trước khi lưu vào cơ sở dữ liệu
CourseSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Course", CourseSchema);

