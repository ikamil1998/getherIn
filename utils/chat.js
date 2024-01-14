const Model = require("../models");
exports.getLastMessages = async (room, user_id) => {
  try {
    const data = await Model.Chat.findAll({
      where: { room }, attributes: ["img", "msg", "video", "record", "type", "senderId", "senderName", "senderImage", "room", 'id'],
      include: {
        model: Model.Question,
        attributes: ["body", 'type', "id"],
        require: false,
        include: {
          model: Model.Option,
          require: false,
          attributes: ["body", "id"],
          include: { model: Model.OptionGroup, attributes: ["optionId", "userId", "selected", "groupId", "id"] }
        }
      }
    })
    const handle = []
    for (const item of data) {
      if (item.dataValues.type === "question") {
        const { id, body, type, Options } = item.dataValues.Question.dataValues
        const isAnswer = await Model.Answer.findOne({ where: { groupId: room, questionId: id } })
        // console.log(item.dataValues)
        const options = []
        for (const item of Options) {
          const { body, OptionGroups } = item.dataValues
          let counter = 0, handelSelected = false, id = null;
          for (const OptionGroup of OptionGroups) {
            id = OptionGroup.dataValues.optionId
            const { selected, userId } = OptionGroup.dataValues
            if (selected) counter++;
            if (userId === user_id && selected)
              handelSelected = true;
          }
          options.push({ body, counter, selected: handelSelected, id })
        }
        // console.log(Options)
        if (options.length)
          handle.push({ ...item.dataValues, Question: { id, type, body, isAnswer: !!isAnswer, options } })
        else
          handle.push({ ...item.dataValues, Question: { id, type, body, isAnswer: !!isAnswer } })
      }
      else handle.push(item)
    }
    return handle
  }
  catch (err) {
    console.log(err)
  }
};
exports.getLastMessagesPM = async (room) => {
  try {
    const data = await Model.ChatPM.findAll({
      where: { room }, attributes: ["img", "msg", "video", "record", "type", "senderId", "senderName", "senderImage", "room", "id"],
    })
    return data
  }
  catch (err) {
    console.log(err)
  }
};

