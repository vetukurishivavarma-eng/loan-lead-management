import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import * as leadsController from '../controllers/leads.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(authMiddleware);

router.get('/running', leadsController.getRunningLoans);
router.get('/completed', leadsController.getCompletedLoans);
router.post('/running', leadsController.addRunningLoan);
router.post('/completed', leadsController.addCompletedLoan);
router.post('/upload', upload.single('file'), leadsController.uploadExcel);
router.delete('/running/:id', leadsController.deleteRunningLoan);
router.delete('/completed/:id', leadsController.deleteCompletedLoan);

export default router;
