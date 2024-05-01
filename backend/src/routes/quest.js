const express = require('express');
const router = express.Router();
const questController = require("../controllers/quest");
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage : storage});

router.post('/create-quest',upload.single('questImage') ,questController.createQuest);
router.get('/get-all-quests', questController.getAllQuests)
router.get('/get-quest/:questId', questController.getQuest)
router.delete('/delete-quest/:questId', questController.deleteQuest);
router.post('/edit-quest', questController.editQuest)

module.exports = router