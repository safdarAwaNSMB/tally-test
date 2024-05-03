const Quest = require('../models/quest');
const path = require('path')
const mimeTypes = require('mime-types');
const fs = require('fs')

module.exports.createQuest = async (req, res) => {
  try {  
      const newQuest = new Quest({
        ...req.body,
        questImage: req.file.path
      });
      await newQuest.save();
      console.log('Added successfully!');
      res.status(200).send({
        status: true, message: "The ques is added!", data: newQuest
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: error.message });
  }
}


module.exports.editQuest = async (req, res) => {
  console.log(req.body);
  try {
    const updatedQuest = await Quest.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    console.log(updatedQuest);
    console.log('Updated successfully!');
    return res.status(200).send({
      status: true,
      message: 'The Quest is Updated!',
      data: updatedQuest
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};



module.exports.deleteQuest = async (req, res) => {
  try {
    const deletedQuest = await Quest.findByIdAndDelete(req.params.questId);
    return res.status(200).send({
      status: true,
      message: 'The Quest is Deleted!',
      data: deletedQuest
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};



module.exports.getAllQuests = async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(200).send({ status: true, message: "The Following are the Quests!", data: quests });
  } catch (error) {
    res.status(400).send({ status: false, message: error.message });
  }
}

module.exports.getQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.questId);
    res.status(200).send({ status: true, message: "The Following is the Quest!", data: quest });
  } catch (error) {
    res.status(400).send({ status: false, message: error.message });
  }
}

module.exports.previewFile = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/', req.params.filePath);
    console.log(filePath);
    res.set({
      'Content-Type': mimeTypes.contentType(filePath)
    });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: 'File not found on the server' });
  }
}

