const express = require('express');
const router = express.Router();
const questController = require("../controllers/quest");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        // Check if the directory exists
        if (!fs.existsSync(uploadPath)) {
            // Create the directory
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage : storage});

router.post('/create-quest', upload.single('questImage') , questController.createQuest);
router.get('/get-all-quests', questController.getAllQuests)
router.get('/get-quest/:questId', questController.getQuest)
router.delete('/delete-quest/:questId', questController.deleteQuest);
router.post('/edit-quest', questController.editQuest)
router.post('/post-folow-userToken', questController.followUserToken)
router.post('/get-folow-userToken', questController.getFollowUserToken)
router.get('/uploads/:filePath',questController.previewFile)

module.exports = router