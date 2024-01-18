const Joi = require("joi");
exports.createAchievementPage1 = (achievment) => {
  const schema = Joi.object({
    schoolName: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    fullName: Joi.string().trim().required(),
    age: Joi.string().trim().required(),
    stage: Joi.string().trim().required(),
    academicYear: Joi.string().trim().required(),
    semister: Joi.string().trim().required(),
    grade: Joi.string().trim().required(),
    pageNumber: Joi.number().required().valid(1),
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
exports.createAchievementPage2 = (achievment) => {
  const schema = Joi.object({
    hoopies: Joi.string().trim().required(),
    skills: Joi.string().trim().required(),
    targets: Joi.string().trim().required(),
    pageNumber: Joi.number().required().valid(2),
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
exports.createAchievementPage3 = (achievment) => {
  const schema = Joi.object({
    introduction: Joi.string().trim().allow(""),
    links: Joi.string().allow(),
    externalReadings: Joi.string().allow(""),
    achievements: Joi.string().trim().allow(""),
    volunteerWork: Joi.string().trim().allow(""),
    certificates: Joi.string().trim().allow(""),
    educationalCourses: Joi.string().trim().allow(""),
    competitions: Joi.string().trim().allow(""),
    pageNumber: Joi.number().required().valid(3),
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
exports.createAchievementPage4 = (achievment) => {
  const schema = Joi.object({
    subject: Joi.string().trim().required(),
    activities: Joi.string().trim().required(),
    projects: Joi.string().trim().required(),
    performingTasks: Joi.string().trim().required(),
    comments: Joi.string().trim().allow(""),
    pageNumber: Joi.number().required().valid(4),
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
exports.updateViewSetting = (achievment) => {
  const schema = Joi.object({
    view: Joi.number().required().valid(0, 1, 2, 3),
    departmentId : Joi.number()
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
