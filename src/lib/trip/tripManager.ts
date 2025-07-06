import type cytoscape from 'cytoscape';

export interface Trip {
	id: string;
	startTime: number;
	duration: number;
	path: string[];
	edges: cytoscape.EdgeSingular[];
	status: 'pending' | 'active' | 'completed' | 'queued';
	estimatedStartTime?: number;
}

export interface TripRequest {
	source: string;
	target: string;
	path: string[];
	edges: cytoscape.EdgeSingular[];
	distance: number;
	duration: number;
}

export class TripManager {
	private static instance: TripManager;
	private currentTime: number = 0;
	private ongoingTrips: Trip[] = [];
	private queuedTrips: Trip[] = [];
	private pendingTrips: Trip[] = []; // Changed from pendingTrip to pendingTrips
	private clockInterval: NodeJS.Timeout | null = null;
	private graph: cytoscape.Core | null = null;

	private constructor() {
		this.startGlobalClock();
	}

	public static getInstance(): TripManager {
		if (!TripManager.instance) {
			TripManager.instance = new TripManager();
		}
		return TripManager.instance;
	}

	public setGraph(graph: cytoscape.Core) {
		this.graph = graph;
	}

	private startGlobalClock() {
		this.clockInterval = setInterval(() => {
			this.currentTime += 1;
			this.updateTrips();
			this.updateHeatmap();
		}, 1000);
	}

	public stopGlobalClock() {
		if (this.clockInterval) {
			clearInterval(this.clockInterval);
			this.clockInterval = null;
		}
	}

	private updateTrips() {
		// Complete finished trips
		this.ongoingTrips = this.ongoingTrips.filter((trip) => {
			if (this.currentTime >= trip.startTime + trip.duration) {
				trip.status = 'completed';
				return false;
			}
			return true;
		});

		// Start queued trips if edges are available
		this.queuedTrips = this.queuedTrips.filter((trip) => {
			if (this.canStartTrip(trip)) {
				trip.status = 'active';
				trip.startTime = this.currentTime;
				this.ongoingTrips.push(trip);
				return false;
			}
			return true;
		});
	}

	private updateHeatmap() {
		if (!this.graph) return;

		// Reset all edge traffic levels
		this.graph.edges().forEach((edge) => {
			edge.data('traffic', 0);
			edge.removeClass('highlighted-Traffic1 highlighted-Traffic2');
		});

		// Count traffic on each edge
		const edgeTrafficCount: { [edgeId: string]: number } = {};

		this.ongoingTrips.forEach((trip) => {
			trip.edges.forEach((edge) => {
				const edgeId = edge.id();
				edgeTrafficCount[edgeId] = (edgeTrafficCount[edgeId] || 0) + 1;
			});
		});

		// Apply traffic levels and visual styles
		Object.entries(edgeTrafficCount).forEach(([edgeId, count]) => {
			const edge = this.graph?.getElementById(edgeId);
			if (edge && edge.isEdge()) {
				const traffic = Math.min(count, 2); // Cap at 2
				edge.data('traffic', traffic);

				if (traffic === 1) {
					edge.addClass('highlighted-Traffic1');
				} else if (traffic === 2) {
					edge.addClass('highlighted-Traffic2');
				}
			}
		});
	}

	private canStartTrip(trip: Trip): boolean {
		if (!this.graph) return false;

		// Check if all edges in the path have traffic < 2
		for (const edge of trip.edges) {
			const currentTraffic = edge.data('traffic') || 0;
			if (currentTraffic >= 2) {
				return false;
			}
		}
		return true;
	}

	public calculateSoonestStartTime(tripRequest: TripRequest): number {
		if (!this.graph) return this.currentTime;

		const conflictingTrips = this.getConflictingTrips(tripRequest.edges);

		if (conflictingTrips.length === 0) {
			return this.currentTime;
		}

		// Find the earliest time when all conflicting edges will be available
		let earliestAvailableTime = this.currentTime;

		tripRequest.edges.forEach((edge) => {
			const edgeId = edge.id();
			const tripsOnEdge = conflictingTrips.filter((trip) =>
				trip.edges.some((e) => e.id() === edgeId)
			);

			if (tripsOnEdge.length >= 2) {
				// Edge is at capacity, find when it becomes available
				const endTimes = tripsOnEdge.map((trip) => trip.startTime + trip.duration);
				endTimes.sort((a, b) => a - b);
				// Take the second earliest end time (when capacity drops to 1)
				earliestAvailableTime = Math.max(
					earliestAvailableTime,
					endTimes[endTimes.length - 2] || this.currentTime
				);
			}
		});

		return earliestAvailableTime;
	}

	private getConflictingTrips(edges: cytoscape.EdgeSingular[]): Trip[] {
		const conflictingTrips: Trip[] = [];
		const edgeIds = new Set(edges.map((e) => e.id()));

		this.ongoingTrips.forEach((trip) => {
			const hasConflict = trip.edges.some((edge) => edgeIds.has(edge.id()));
			if (hasConflict) {
				conflictingTrips.push(trip);
			}
		});

		this.queuedTrips.forEach((trip) => {
			const hasConflict = trip.edges.some((edge) => edgeIds.has(edge.id()));
			if (hasConflict) {
				conflictingTrips.push(trip);
			}
		});

		return conflictingTrips;
	}

	public requestTrip(tripRequest: TripRequest): Trip {
		const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const soonestStartTime = this.calculateSoonestStartTime(tripRequest);

		const trip: Trip = {
			id: tripId,
			startTime: soonestStartTime,
			duration: tripRequest.duration,
			path: tripRequest.path,
			edges: tripRequest.edges,
			status: soonestStartTime === this.currentTime ? 'pending' : 'queued',
			estimatedStartTime: soonestStartTime
		};

		// Add to pendingTrips instead of setting a single pendingTrip
		this.pendingTrips.push(trip);

		return trip;
	}

	public startTrip(tripId: string): boolean {
		// Check if the trip is in the queued trips
		const tripIndex = this.queuedTrips.findIndex((trip) => trip.id === tripId);
		if (tripIndex !== -1) {
			const trip = this.queuedTrips[tripIndex];

			if (this.canStartTrip(trip)) {
				trip.status = 'active';
				trip.startTime = this.currentTime;
				this.ongoingTrips.push(trip);
				this.queuedTrips.splice(tripIndex, 1);
				return true;
			}

			return false;
		}

		// Check if the trip is in the pendingTrips
		const pendingTripIndex = this.pendingTrips.findIndex((trip) => trip.id === tripId);
		if (pendingTripIndex !== -1) {
			const trip = this.pendingTrips[pendingTripIndex];

			if (this.canStartTrip(trip)) {
				trip.status = 'active';
				trip.startTime = this.currentTime;
				this.ongoingTrips.push(trip);
				this.pendingTrips.splice(pendingTripIndex, 1);
				return true;
			}

			return false;
		}

		return false;
	}

	public getCurrentTime(): number {
		return this.currentTime;
	}

	public getOngoingTrips(): Trip[] {
		return [...this.ongoingTrips];
	}

	public getQueuedTrips(): Trip[] {
		return [...this.queuedTrips];
	}

	public getPendingTrips(): Trip[] {
		return [...this.pendingTrips];
	}

	public getAllTrips(): Trip[] {
		return [...this.ongoingTrips, ...this.queuedTrips, ...this.pendingTrips];
	}

	public formatTime(timestamp: number): string {
		const hours = Math.floor(timestamp / 3600);
		const minutes = Math.floor((timestamp % 3600) / 60);
		const seconds = timestamp % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	public getTimeUntilStart(trip: Trip): number {
		return Math.max(0, (trip.estimatedStartTime || trip.startTime) - this.currentTime);
	}

	// Cleanup method
	public destroy() {
		this.stopGlobalClock();
		this.ongoingTrips = [];
		this.queuedTrips = [];
		this.pendingTrips = [];
	}

	// New method to remove a trip by tripId
	public removeTrip(tripId: string): boolean {
		const removeFromList = (list: Trip[]) => {
			const index = list.findIndex((trip) => trip.id === tripId);
			if (index !== -1) {
				list.splice(index, 1);
				return true;
			}
			return false;
		};

		return (
			removeFromList(this.ongoingTrips) ||
			removeFromList(this.queuedTrips) ||
			removeFromList(this.pendingTrips)
		);
	}
}

// Export singleton instance
export const tripManager = TripManager.getInstance();
