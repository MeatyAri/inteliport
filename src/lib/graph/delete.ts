export function deleteNode(cy: cytoscape.Core, nodeId: string): void {
  if (cy) {
    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      if (node.length > 0) {
        node.remove();
      } else {
      }
    } else {
      console.log(`Node with ID ${nodeId} not found.`);
    }
  }
}