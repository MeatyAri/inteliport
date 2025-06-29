# TODO:

## Phase 1:

- [x] implement a weighted graph
  - [ ] add node function (choose the best fusion point)
  - [ ] delete node function
  - [x] add MST (Minimum Spanning Tree)
  - [ ] make sure every node is accessible by going through at most 2 other nodes

## Phase 2:

- [ ] add Dijkstra to find best possible route
- [x] highlight the selected path
- [ ] a display menu for trip selection
  - [ ] display trip start time
  - [ ] display trip end time
  - [ ] display trip duration
  - [ ] llm function to start the trip
- [ ] heatmap mechanism for weighted graph (probably a JSON with edges and a number assigned to each edge)
- [ ] a priority queue for when a path hits its limit

## Phase 3:

- [ ] add multi-stop trips
  - [ ] Held-Karp for Traveling Salesman Problem (TSP), **Dynamic Programming**, Bitmasking

# Later:

## Phase 4:

- [ ] Divide and Conquer for bigger graphs and computational efficiency
  - [ ] select highest order nodes
  - [ ] group nodes that are within 4 edges of the highest order node
  - [ ] create a higher order graph of the nodes that are in a group
  - [ ] Dijkstra and MST for smaller graphs and then run it on the higher order graph

# Testing:

# Completed:
