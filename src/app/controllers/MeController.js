const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../util/mongoose");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    const pageSize = 6; // Số lượng mục trên mỗi trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1

    // Tính toán số lượng mục bỏ qua để lấy dữ liệu cho trang hiện tại
    const skip = (page - 1) * pageSize;

    // Lấy dữ liệu cho trang hiện tại từ cơ sở dữ liệu
    const query = Course.find({deleted: false}).skip(skip).limit(pageSize);
    const itemsPromise = query.exec();

    // Đếm tổng số mục trong cơ sở dữ liệu
    const totalCountPromise = Course.countDocuments({deleted: false}).exec();
    
    // Tính toán số trang dựa trên tổng số mục và kích thước trang
    const totalPagesPromise = totalCountPromise.then(totalCount => Math.ceil(totalCount / pageSize));

    // Lấy dữ liệu bị xóa để hiển thị số lượng
    const deletedCountPromise = Course.countDocuments({ deleted: true }).exec();

    Promise.all([itemsPromise, totalCountPromise, totalPagesPromise, deletedCountPromise])
      .then(([items, totalCount, totalPages, deletedCount]) =>{
        // Tạo mảng pages từ 1 đến totalPages
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
      
        res.render("me/stored-courses", {
          deletedCount,
          courses: multipleMongooseToObject(items),
          currentPage: page, 
          totalPages,
          pages,
        })
      })
      .catch(next);
  }

  // [GET] /me/trash/courses
  trashCourses(req, res, next) {
    Course.find({ deleted: true })
      .then((courses) =>
        res.render("me/trash-courses", {
          courses: multipleMongooseToObject(courses),
        })
      )
      .catch(next);
  }

}

module.exports = new MeController();
