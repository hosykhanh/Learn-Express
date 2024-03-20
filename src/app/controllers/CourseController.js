const Course = require("../models/Course");
const { mongooseToObject } = require("../../util/mongoose");

class CourseController {
  // [GET] /courses/:slug
  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render("courses/show", { course: mongooseToObject(course) });
      })
      .catch(next);
  }

  // [GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  // [POST] /courses/store
  store(req, res, next) {
    // res.json(req.body);

    const course = new Course(req.body);
    course
      .save()
      .then(() => res.redirect("/me/stored/courses"))
      .catch((error) => {});
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) =>
        res.render("courses/edit", {
          course: mongooseToObject(course),
        })
      )
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }

  // [DELETE] /courses/:id
  delete(req, res, next) {
    const currentTime = new Date();
    Course.findByIdAndUpdate(req.params.id, { deleted: true, deletedAt: currentTime })
      .then(() => res.redirect("back"))
      .catch(next);
  }


  // [DELETE] /courses/:id/force
  forceDelete(req, res, next){
    Course.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.findByIdAndUpdate(req.params.id, { deleted: false, deletedAt: null })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  // [POST] /courses/handle-form-action
  handleFormAction(req, res, next) {
    switch (req.body.action) {
        case 'delete':
            const currentTime = new Date();
            Course.updateMany({ _id: { $in: req.body.courseIds } }, { deleted: true, deletedAt: currentTime })
                .then(() => res.redirect("back"))
                .catch(next);
            break;
        default:
            res.json({ message: 'Action is invalid!' });
    }
  }

  handleTrashForm(req, res, next) {
    switch (req.body.action) {
        case 'restore':
            Course.updateMany({ _id: { $in: req.body.trashCourseIds } }, { deleted: false, deletedAt: null })
                .then(() => res.redirect("back"))
                .catch(next);
            break;
        case 'force-delete':
            Course.deleteMany({ _id: { $in: req.body.trashCourseIds } })
              .then(() => res.redirect("back"))
              .catch(next);
            break;
        default:
            res.json({ message: 'Action is invalid!' });
    }
  }

}

module.exports = new CourseController();
