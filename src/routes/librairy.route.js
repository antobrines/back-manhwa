const express = require('express');
const librairyController = require('../controllers/librairy.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');

router.post('/', isConnected, librairyController.create);
router.get('/', isConnected, librairyController.get);
router.get(
  '/manhwas',
  isConnected,
  librairyController.getManhwasFromLibrairies
);
router.get(
  '/:librairyId',
  isConnected,
  librairyController.getLibrairyWithManhwasInformations
);
router.post(
  '/:librairyId/manhwa/:id',
  isConnected,
  librairyController.addManhwa
);
router.delete(
  '/:librairyId/manhwa/:id',
  isConnected,
  librairyController.removeManhwa
);
router.put('/:fromList/manhwa/:id/new-librairy/:toList', isConnected, librairyController.changeList);

module.exports = router;
