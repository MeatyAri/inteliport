import { runDijkstra } from '$lib/graph/dijkstra';
import { tripManager, type TripRequest } from './tripManager';
import type cytoscape from 'cytoscape';

export function planTrip(
	graph: cytoscape.Core,
	source: string,
	target: string,
	duration?: number
): {
	success: boolean;
	trip?: any;
	message: string;
	tripDetails?: {
		source: string;
		target: string;
		distance: number;
		duration: number;
		path: string[];
		estimatedStartTime: number;
		currentTime: number;
		canStartImmediately: boolean;
		trafficStatus: string;
	};
} {
	try {
		// Run Dijkstra to find the shortest path
		const dijkstraResult = runDijkstra(graph, source, target);

		if (typeof dijkstraResult === 'string') {
			return {
				success: false,
				message: dijkstraResult
			};
		}

		const { path, distance, edges } = dijkstraResult;
		const tripDuration = duration || Math.max(Math.ceil(distance * 10), 30); // Default: 10 seconds per unit distance, minimum 30 seconds

		// Create trip request
		const tripRequest: TripRequest = {
			source,
			target,
			path,
			edges,
			distance,
			duration: tripDuration
		};

		// Request the trip from trip manager
		const trip = tripManager.requestTrip(tripRequest);
		const currentTime = tripManager.getCurrentTime();
		const estimatedStartTime = trip.estimatedStartTime || trip.startTime;
		const canStartImmediately = estimatedStartTime === currentTime;
		const waitTime = estimatedStartTime - currentTime;

		// Analyze traffic status
		let trafficStatus = 'Clear';
		const conflictingEdges = edges.filter((edge) => {
			const traffic = edge.data('traffic') || 0;
			return traffic > 0;
		});

		if (conflictingEdges.length > 0) {
			const maxTraffic = Math.max(...conflictingEdges.map((edge) => edge.data('traffic') || 0));
			if (maxTraffic >= 2) {
				trafficStatus = 'Heavy Traffic - Route at capacity';
			} else if (maxTraffic >= 1) {
				trafficStatus = 'Moderate Traffic - Some congestion';
			}
		}

		const pathNodes = path.filter((p) => p.length === 1).map((p) => p.toUpperCase());
		const routeDisplay = pathNodes.join(' → ');

		return {
			success: true,
			trip,
			message: `Trip planned successfully from ${source.toUpperCase()} to ${target.toUpperCase()}! Route: ${routeDisplay}. Distance: ${distance} units. Duration: ${Math.floor(tripDuration / 60)}m ${tripDuration % 60}s. ${canStartImmediately ? 'Ready to start immediately.' : `Estimated start time: ${formatTime(estimatedStartTime)} (wait ${waitTime} seconds)`}. Traffic: ${trafficStatus}`,
			tripDetails: {
				source: source.toUpperCase(),
				target: target.toUpperCase(),
				distance,
				duration: tripDuration,
				path: pathNodes,
				estimatedStartTime,
				currentTime,
				canStartImmediately,
				trafficStatus
			}
		};
	} catch (error) {
		return {
			success: false,
			message: `Error planning trip: ${error}`
		};
	}
}

export function startTrip(tripId: string): { success: boolean; message: string } {
	const success = tripManager.startTrip(tripId);

	if (success) {
		return {
			success: true,
			message: 'Trip started successfully!'
		};
	} else {
		return {
			success: false,
			message: 'Failed to start trip. Trip may not exist or route may be at capacity.'
		};
	}
}

export function getTripStatus(): {
	currentTime: string;
	ongoingTrips: any[];
	queuedTrips: any[];
	totalTrips: number;
} {
	const currentTime = tripManager.getCurrentTime();
	const ongoingTrips = tripManager.getOngoingTrips();
	const queuedTrips = tripManager.getQueuedTrips();

	return {
		currentTime: formatTime(currentTime),
		ongoingTrips: ongoingTrips.map((trip) => {
			const pathNodes = trip.path.filter((p: string) => p.length === 1);
			return {
				id: trip.id,
				source: pathNodes[0]?.toUpperCase() || 'Unknown',
				target: pathNodes[pathNodes.length - 1]?.toUpperCase() || 'Unknown',
				startTime: formatTime(trip.startTime),
				duration: trip.duration,
				remainingTime: Math.max(0, trip.startTime + trip.duration - currentTime),
				status: trip.status
			};
		}),
		queuedTrips: queuedTrips.map((trip) => {
			const pathNodes = trip.path.filter((p: string) => p.length === 1);
			return {
				id: trip.id,
				source: pathNodes[0]?.toUpperCase() || 'Unknown',
				target: pathNodes[pathNodes.length - 1]?.toUpperCase() || 'Unknown',
				estimatedStartTime: formatTime(trip.estimatedStartTime || trip.startTime),
				duration: trip.duration,
				waitTime: tripManager.getTimeUntilStart(trip),
				status: trip.status
			};
		}),
		totalTrips: ongoingTrips.length + queuedTrips.length
	};
}

export function formatTime(timestamp: number): string {
	const hours = Math.floor(timestamp / 3600);
	const minutes = Math.floor((timestamp % 3600) / 60);
	const seconds = timestamp % 60;
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getCurrentTime(): string {
	return formatTime(tripManager.getCurrentTime());
}
