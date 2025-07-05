import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { CEREBRAS_API_KEY } from '$env/static/private';
import { tools } from '$lib/tools.server';

const client = new Cerebras({
	apiKey: CEREBRAS_API_KEY // This is the default and can be omitted
});

// Main function to run the agent
export async function runAgent(query: string, graphData?: any) {
	try {
		console.log(`\n👤 User: ${query}`);
		console.log('🤖 Agent: Processing...\n');

		// Build system message with graph context
		let systemMessage = `You are a helpful assistant with access to graph manipulation tools.

When responding to user queries about the graph, consider the current graph structure and provide relevant insights or suggestions. Use the appropriate tools to perform the requested operations.`;

		if (graphData) {
			console.log('📊 Graph context received:', graphData.substring(0, 200) + '...');
			systemMessage += `\n\nCurrent graph context:\n${graphData}`;
		} else {
			console.log('⚠️  No graph context provided');
			systemMessage += `\n\nNote: No graph is currently loaded. You can help users understand graph concepts or suggest loading a graph first.`;
		}

		const chatCompletion = await client.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: systemMessage
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

		// Log system message length for debugging
		console.log(`📝 System message length: ${systemMessage.length} characters`);

		return choices?.[0]?.message;
	} catch (error) {
		console.error('Error running agent:', error);
	}
}
