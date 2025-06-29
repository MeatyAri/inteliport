import type { Core, EdgeSingular } from 'cytoscape';

type KruskalEdge = {
	source: string;
	target: string;
	weight: number;
	ele: EdgeSingular; // reference to original Cytoscape edge
};

class DisjointSet {
	parent: Map<string, string> = new Map();
	rank: Map<string, number> = new Map();

	makeSet(nodes: string[]) {
		for (const node of nodes) {
			this.parent.set(node, node);
			this.rank.set(node, 0);
		}
	}

	find(u: string): string {
		if (this.parent.get(u) !== u) {
			this.parent.set(u, this.find(this.parent.get(u)!));
		}
		return this.parent.get(u)!;
	}

	union(u: string, v: string): boolean {
		const rootU = this.find(u);
		const rootV = this.find(v);

		if (rootU === rootV) return false;

		const rankU = this.rank.get(rootU)!;
		const rankV = this.rank.get(rootV)!;

		if (rankU < rankV) {
			this.parent.set(rootU, rootV);
		} else if (rankU > rankV) {
			this.parent.set(rootV, rootU);
		} else {
			this.parent.set(rootV, rootU);
			this.rank.set(rootU, rankU + 1);
		}

		return true;
	}
}

export function runKruskal(cy: Core): EdgeSingular[] {
	const edges: KruskalEdge[] = cy.edges().map((edge) => ({
		source: edge.source().id(),
		target: edge.target().id(),
		weight: parseFloat(edge.data('weight')),
		ele: edge
	}));

	edges.sort((a, b) => a.weight - b.weight);

	const ds = new DisjointSet();
	const nodeIds = cy.nodes().map((n) => n.id());
	ds.makeSet(nodeIds);

	const mstEdges: EdgeSingular[] = [];

	for (const edge of edges) {
		if (ds.union(edge.source, edge.target)) {
			mstEdges.push(edge.ele);
		}
	}

	return mstEdges;
}
