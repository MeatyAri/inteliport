import cytoscape from 'cytoscape';
import { tripManager } from './trip/tripManager';

export const shared = $state({
	graph: null as cytoscape.Core | null,
	agentResponse: '',
	tripManager: tripManager,
	currentTime: 0,
	pendingTrip: null as any
	// prevGraph: null as cytoscape.Core | null
});
