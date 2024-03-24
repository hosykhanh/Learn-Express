const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../util/mongoose");

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    let courseQuery = Course.find({ deleted: false });

    if(req.query.hasOwnProperty('_sort')){
      courseQuery = courseQuery.sort({
        [req.query.column]: req.query.type
      });
    }else {
        res.json({ message: "No 'sort' query parameter provided!" });
    }

    Promise.all([courseQuery, Course.countDocuments({ deleted: true })])
    .then(([courses, deletedCount]) =>
      res.render("me/stored-courses", {
        deletedCount,
        courses: multipleMongooseToObject(courses),
      })
    )
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
