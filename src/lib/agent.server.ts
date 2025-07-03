import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { CEREBRAS_API_KEY } from '$env/static/private';
import { tools } from '$lib/tools.server';

const client = new Cerebras({
	apiKey: CEREBRAS_API_KEY // This is the default and can be omitted
});

// Main function to run the agent
export async function runAgent(query: string) {
	try {
		console.log(`\n👤 User: ${query}`);
		console.log('🤖 Agent: Processing...\n');

		const chatCompletion = await client.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: 'You are a helpful assistant with access to graph manipulation tools.'
				},
				{ role: 'user', content: query }
			],
			tools,
			model: 'llama-3.3-70b'
		});

		const choices = chatCompletion?.choices as any[];

		console.log(`🤖 Agent:`);
		console.log(choices?.[0]?.message);
		console.log('---');

		return choices?.[0]?.message;
	} catch (error) {
		console.error('Error running agent:', error);
	}
}
