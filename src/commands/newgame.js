import { SlashCommandBuilder } from 'discord.js';
import firebase from '../firebase/index.js';
import { getDatabase, ref, set } from 'firebase/database';
import { members } from '../constant.js';

export default {
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Lưu lại thông tin trận đấu')
		.addStringOption((option) =>
			option
				.setName('rank_1')
				.setDescription('Hạng 1 -  Về nhất')
				.setRequired(true)
				.addChoices(members[0], members[1], members[2], members[3], members[4], members[5]),
		)
		.addStringOption((option) =>
			option
				.setName('rank_2')
				.setDescription('Hạng 2 -  Về nhì')
				.setRequired(true)
				.addChoices(members[0], members[1], members[2], members[3], members[4], members[5]),
		)
		.addStringOption((option) =>
			option
				.setName('rank_3')
				.setDescription('Hạng 3 -  Về ba')
				.setRequired(true)
				.addChoices(members[0], members[1], members[2], members[3], members[4], members[5]),
		)
		.addStringOption((option) =>
			option
				.setName('rank_4')
				.setDescription('Hạng 4 -  Về bét')
				.setRequired(true)
				.addChoices(members[0], members[1], members[2], members[3], members[4], members[5]),
		)
		.addBooleanOption((option) => option.setName('is_double').setDescription('Có x2 hay không?').setRequired(true))
		.setDefaultMemberPermissions(3),
	async execute(interaction) {
		const rank1 = interaction.options.getString('rank_1');
		const rank2 = interaction.options.getString('rank_2');
		const rank3 = interaction.options.getString('rank_3');
		const rank4 = interaction.options.getString('rank_4');
		const isDouble = interaction.options.getBoolean('is_double');
		const temp = [];
		let isError = false;
		const membersData = {
			rank1,
			rank2,
			rank3,
			rank4,
		};
		Object.values(membersData).forEach((mem) => {
			if (temp.includes(mem)) {
				isError = true;
			} else {
				temp.push(mem);
			}
		});
		if (isError) {
			await interaction.reply('❌ **Thông tin chưa chính xác, vui lòng kiểm tra lại nha! **');
			return;
		}

		const today = new Date().getTime();

		const rank1Data = {
			name: rank1,
			rank: 1,
			debtorName: rank4,
			score: !!isDouble ? 2 : 1,
			date: today,
			dateString: new Date().toLocaleString(),
		};
		const rank2Data = {
			name: rank2,
			rank: 2,
			debtorName: rank3,
			score: 1,
			date: today,
			dateString: new Date().toLocaleString(),
		};
		const rank3Data = {
			name: rank3,
			rank: 3,
			debtorName: rank2,
			score: -1,
			date: today,
			dateString: new Date().toLocaleString(),
		};
		const rank4Data = {
			name: rank4,
			rank: 4,
			debtorName: rank1,
			score: !!isDouble ? -2 : -1,
			date: today,
			dateString: new Date().toLocaleString(),
		};
		const ledgerByUserData = {
			[rank1]: rank1Data,
			[rank2]: rank2Data,
			[rank3]: rank3Data,
			[rank4]: rank4Data,
		};

		let db = getDatabase(firebase);
		await set(ref(db, 'ledger/' + today), ledgerByUserData);
		await interaction.reply(`✅ Đã lưu lại thông tin trận đấu! \n🆔 **ID: ${today}** \n🍻 Have fun!`);
	},
};
