import cytoscape from 'cytoscape';
import { findEdgesByIds } from './alterGraph';
import { highlightEdges } from './highlights';

interface TSPResult {
    path: string[];
    totalDistance: number;
    edges: string[];
}

interface CostMatrix {
    matrix: number[][];
    nodeIds: string[];
    idToIndex: Map<string, number>;
}

/**
 * Builds cost matrix from Cytoscape graph
 * @param cy - Cytoscape instance
 * @param nodeIds - Array of node IDs to include
 * @param weightProperty - Edge property containing weights
 * @returns Cost matrix with mappings
 */
function buildCostMatrix(
    cy: cytoscape.Core,
    nodeIds: string[],
    weightProperty: string
): CostMatrix {
    const n = nodeIds.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(Infinity));
    const idToIndex = new Map<string, number>();

    // Map node IDs to matrix indices
    nodeIds.forEach((id, i) => {
        idToIndex.set(id, i);
        matrix[i][i] = 0; // Distance to self is 0
    });

    // Fill matrix with edge weights
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const nodeA = nodeIds[i];
            const nodeB = nodeIds[j];

            const edge = cy.edges(`[source="${nodeA}"][target="${nodeB}"], [source="${nodeB}"][target="${nodeA}"]`);
            if (edge.length > 0) {
                const weight = edge.data(weightProperty) || 1;
                matrix[i][j] = weight;
                matrix[j][i] = weight; // Symmetric
            }
        }
    }

    return { matrix, nodeIds, idToIndex };
}

/**
 * Solves TSP using dynamic programming with bitmasking
 * @param cy - Cytoscape instance
 * @param nodeIds - Array of node IDs to visit (optional - uses all nodes if not provided)
 * @param startNodeId - Starting node ID (must be in nodeIds)
 * @param weightProperty - Edge property containing weights
 * @returns TSP solution
 */
export function findTSPPath(
    cy: cytoscape.Core,
    nodeIds?: string[],
    startNodeId?: string,
    weightProperty: string = 'weight'
): TSPResult {
    // Use provided nodes or all nodes
    const targetNodes = nodeIds || cy.nodes().map(n => n.id());

    if (targetNodes.length < 2) {
        throw new Error('Need at least 2 nodes for TSP');
    }

    // Determine start node
    const startId = startNodeId || targetNodes[0];
    if (!targetNodes.includes(startId)) {
        throw new Error(`Start node ${startId} not in target nodes`);
    }

    const costMatrix = buildCostMatrix(cy, targetNodes, weightProperty);
    const n = targetNodes.length;
    const startIndex = costMatrix.idToIndex.get(startId)!;

    // DP with bitmasking
    // dp[mask][i] = minimum cost to visit all nodes in mask ending at node i
    const dp: number[][] = Array(1 << n).fill(0).map(() => Array(n).fill(Infinity));
    const parent: number[][] = Array(1 << n).fill(0).map(() => Array(n).fill(-1));

    // Base case: start at startIndex
    dp[1 << startIndex][startIndex] = 0;

    // Fill DP table
    for (let mask = 0; mask < (1 << n); mask++) {
        for (let u = 0; u < n; u++) {
            if (!(mask & (1 << u)) || dp[mask][u] === Infinity) continue;

            for (let v = 0; v < n; v++) {
                if (mask & (1 << v)) continue; // Already visited

                const newMask = mask | (1 << v);
                const newCost = dp[mask][u] + costMatrix.matrix[u][v];

                if (newCost < dp[newMask][v]) {
                    dp[newMask][v] = newCost;
                    parent[newMask][v] = u;
                }
            }
        }
    }

    // Find best ending node and add return cost
    const fullMask = (1 << n) - 1;
    let bestCost = Infinity;
    let bestEnd = -1;

    for (let i = 0; i < n; i++) {
        if (i === startIndex) continue;
        const totalCost = dp[fullMask][i] + costMatrix.matrix[i][startIndex];
        if (totalCost < bestCost) {
            bestCost = totalCost;
            bestEnd = i;
        }
    }

    if (bestEnd === -1) {
        throw new Error('No valid TSP path found');
    }

    // Reconstruct path
    const pathIndices: number[] = [];
    let currentMask = fullMask;
    let currentNode = bestEnd;

    while (currentNode !== -1) {
        pathIndices.unshift(currentNode);
        const prevNode = parent[currentMask][currentNode];
        if (prevNode !== -1) {
            currentMask ^= (1 << currentNode);
        }
        currentNode = prevNode;
    }

    // Convert to node IDs and add return to start
    const path = pathIndices.map(i => targetNodes[i]);
    path.push(startId); // Complete the cycle

    // Find edges for the path
    const edges: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = cy.edges(`[source="${from}"][target="${to}"], [source="${to}"][target="${from}"]`);
        if (edge.length > 0) {
            edges.push(edge[0].id());
        }
    }

    // Find and highlight edges in the path
    const listOfEdges = findEdgesByIds(cy, edges);
    highlightEdges(listOfEdges);



    return {
        path,
        totalDistance: bestCost,
        edges
    };
}