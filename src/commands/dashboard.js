import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('dashboard')
		.setDescription('Xem Dashboard'),
	async execute(interaction) {
		await interaction.reply(`👉 https://business-tour.vercel.app/`);
	}
};
