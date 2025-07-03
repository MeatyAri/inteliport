import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { runAgent } from '$lib/agent.server';

export const POST: RequestHandler = async ({ request }) => {
	const { query } = await request.json();
	const response = await runAgent(query);

	return json(response);
};
