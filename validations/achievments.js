const Joi = require("joi");
export const createAchievementPage1 = (achievment) => {
  const schema = Joi.object({
    schoolName: Joi.string().trim().allow(""),
    city: Joi.string().trim().allow(""),
    fullName: Joi.string().trim().allow(""),
    age: Joi.string().trim().allow(""),
    stage: Joi.string().trim().allow(""),
    academicYear: Joi.string().trim().allow(""),
    semister: Joi.string().trim().allow(""),
    grade: Joi.string().trim().allow(""),
    pageNumber: Joi.number().trim().required().valid(1),
  });
  const { error } = schema.validate(achievment);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    throw error;
  }
  return;
};
export const createAchievementPage2 = (achievment) => {
    const schema = Joi.object({
      hoopies: Joi.string().trim().allow(""),
      skills: Joi.string().trim().allow(""),
      targets: Joi.string().trim().allow(""),
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
  export const createAchievementPage3 = (achievment) => {
    const schema = Joi.object({
      introduction: Joi.string().trim().allow(""),
      skills: Joi.string().trim().allow(""),
      links: Joi.array().items(Joi.string().trim()),
      externalReadings: Joi.array().items(Joi.string().trim()),
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
  export const createAchievementPage4 = (achievment) => {
    const schema = Joi.object({
      subject: Joi.string().trim().allow(""),
      activities: Joi.string().trim().allow(""),
      projects: Joi.string().trim().allow(""),
      performingTasks: Joi.string().trim().allow(""),
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
