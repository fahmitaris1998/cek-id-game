const { dataGame } = require('../lib/dataGame');

const getZoneController = (req, res) => {
   const { game } = req.params;
   if (!game) return res.status(400).json({ status: false, message: 'Game is required' });

   const gameData = dataGame.find((item) => item.slug === game);
   if (!gameData) return res.status(404).json({ status: false, message: 'Game not found' });

   return res.status(200).json({ status: true, message: 'Zone ID berhasil ditemukan', data: gameData.dropdown });
};

module.exports = getZoneController;
