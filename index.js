const express = require('express');
const cors = require('cors');
const { cekIdGameController } = require('./controllers/cekIdGameController');
const _ = require('lodash');
const { dataGame } = require('./lib/dataGame');
const getZoneController = require('./controllers/getZoneController');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));
// app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/api', (req, res) => {
   const newDataGame = dataGame.map((item) => {
      return {
         name: item.name,
         slug: item.slug,
         endpoint: `/api/game/${item.slug}`,
         query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
         hasZoneId: item.isZone ? true : false,
         listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
      };
   });

   return res.json({
      name: 'Cek Data Game',
      author: 'KITADIGITAL',
      data: _.orderBy(newDataGame, ['name'], ['asc']),
   });
});

app.get('/api/game/:game', cekIdGameController);
app.get('/api/game/get-zone/:game', getZoneController);

app.get('/*', (req, res) => {
   res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
