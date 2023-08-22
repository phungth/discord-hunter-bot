import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import path from 'path';
import firebase from './src/firebase/index.js';
import _ from 'lodash';
import { getDatabase, ref, onValue } from 'firebase/database';
let db = getDatabase(firebase);
import { members } from './src/constant.js';

import bot from './src/bot.js';
config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;
const server = express();

server.disable('x-powered-by');
server.use(cors());

server.use(express.static(path.resolve(path.join(__dirname, 'public'))));

server.get('/api/users', function (req, res, next) {
	res.json({ data: members });
});

server.get('/api/history', function (req, res, next) {
	onValue(
		ref(db, '/ledger'),
		(snapshot) => {
			let data = snapshot.val();
			data = _.values(data).map((item) => {
				const records = _.values(item);
				return {
					date: _.get(records, '[0].date', ''),
					dateString: _.get(records, '[0].dateString', ''),
					rank1: records.find((r) => r.rank === 1).name,
					rank2: records.find((r) => r.rank === 2).name,
					rank3: records.find((r) => r.rank === 3).name,
					rank4: records.find((r) => r.rank === 4).name,
					isDouble: !!(records.find((r) => r.rank === 1).score % 2 === 0),
					scoreDetails: records,
				};
			});
			res.json({ data });
		},
		{
			onlyOnce: true,
		},
	);
});

server.get('/api/ledger', function (req, res, next) {
	onValue(
		ref(db, '/ledger'),
		(snapshot) => {
			const data = snapshot.val();
			let arr = _.values(data).map((item) => {
				return _.values(item);
			});

			const ledgerByUser = [];
			arr.forEach((dataByDate) => {
				dataByDate.forEach((data) => {
					ledgerByUser.push(data);
				});
			});

			const newArr = _.values(_.groupBy(ledgerByUser, 'name')).map((item) => {
				return {
					name: _.get(item, '[0].name', ''),
					scoreDetails: item,
				};
			});
			res.json({ data: newArr });
		},
		{
			onlyOnce: true,
		},
	);
});

server.get('*', (_req, res) => {
	res.sendFile(path.resolve(path.join(__dirname, 'public/index.html')));
});

server.listen(port, () => {
	bot();
	console.log(`🚀 Server is running on port ${port} ✨`);
});
