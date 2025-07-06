import cytoscape from 'cytoscape';
import { tripManager, type Trip } from './trip/tripManager';

export const shared = $state({
	graph: null as cytoscape.Core | null,
	agentResponse: '',
	tripManager: tripManager,
	currentTime: 0,
	pendingTrip: null as Trip | null
});

export function updateAgentResponse(message: string) {
	if (message === '') {
		shared.agentResponse = '';
		return;
	}

	const regex = /^(\d+)x (.+)$/;
	const match = message.match(regex);

	if (match) {
		const count = parseInt(match[1], 10);
		const text = match[2];

		if (shared.agentResponse === `${count}x ${text}`) {
			shared.agentResponse = `${count + 1}x ${text}`;
		} else {
			shared.agentResponse = `2x ${text}`;
		}
	} else {
		if (shared.agentResponse === message) {
			shared.agentResponse = `2x ${message}`;
		} else {
			shared.agentResponse = message;
		}
	}
}
