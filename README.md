# InteliPort - Intelligent University Transportation System

**A revolutionary transportation planning system that introduces UII (User Intent Interface) - a new paradigm for human-computer interaction using Large Language Models to transform natural language into actionable application commands.**

## 🚀 Introduction

InteliPort addresses the growing commuting needs of students, professors, and staff across various universities in cities. Our system enables smart travel planning and booking between universities, aiming to reduce costs, save time, and enhance efficiency through advanced graph algorithms and AI-powered interactions.

### 🧠 User Intent Interface (UII)

InteliPort pioneers the **User Intent Interface (UII)** concept - a groundbreaking approach to user interaction that leverages Large Language Models to:

- **Transform natural language into application actions** - Users can say "Find the shortest path from A to C" instead of clicking through menus
- **Provide visual feedback and confirmation** - Every action is visualized on the graph with clear highlights and responses
- **Enable conversational computing** - Complex graph operations become as simple as having a conversation
- **Reduce cognitive load** - No need to learn specific UI patterns or remember button locations

**Example UII Interactions:**

- _"Show me the minimum spanning tree"_ → Automatically calculates and highlights MST
- _"Find the best route from university A to university D"_ → Runs Dijkstra's algorithm and visualizes the path
- _"Add a new university called 'Tech Campus'"_ → Creates a new node in the graph
- _"Delete the connection between B and C"_ → Removes the specified edge

## 🎯 Project Objectives

- **Design graph-based structures** representing real-world university connections
- **Implement smart transportation and reservation systems** using advanced algorithms
- **Analyze various scenarios** using efficient graph algorithms
- **Visualize complex data** through interactive graph representations
- **Pioneer UII technology** for intuitive human-computer interaction

## 🏗️ System Architecture

### Frontend (SvelteKit + TypeScript)

- **Interactive Graph Visualization** using Cytoscape.js
- **Responsive Design** with Tailwind CSS
- **Real-time UII Processing** with natural language input
- **Dynamic Graph Manipulation** with visual feedback

### Backend (Node.js + Cerebras AI)

- **LLM-powered Intent Processing** using Cerebras Cloud SDK
- **Graph Algorithm Implementations** (Dijkstra, MST, TSP)
- **Tool-based Function Calling** for precise graph operations
- **Contextual Graph Serialization** for AI understanding

### Core Technologies

- **SvelteKit 5** - Modern web framework with runes
- **Cytoscape.js** - Graph visualization and manipulation
- **Cerebras AI** - Large language model for intent processing
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Bun** - Fast JavaScript runtime and package manager

## 🌟 Key Features

### Phase 1: Graph Foundation ✅

- **Weighted Graph Structure** representing university connections
- **Minimum Spanning Tree (MST)** using Kruskal's algorithm
- **Two-hop Reachability** ensuring all universities are accessible
- **Dynamic Node Management** with intelligent connection suggestions

### Phase 2: Route Optimization ✅

- **Dijkstra's Algorithm** for shortest path finding
- **Visual Path Highlighting** with different colors for traffic levels
- **Real-time Graph Manipulation** through UII commands
- **Interactive Graph Controls** with zoom, pan, and selection

### Phase 3: Multi-Destination Planning 🚧

- **Traveling Salesman Problem (TSP)** using Held-Karp algorithm
- **Dynamic Programming** with bitmasking for efficiency
- **Multi-stop Trip Optimization** for complex itineraries

### Phase 4: Scalable Architecture 🚧

- **Geographic Graph Partitioning** for large-scale operations
- **Distributed MST Computation** across regions
- **Divide and Conquer** strategies for computational efficiency

## 🛠️ Installation & Setup

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Git** for version control

### Quick Start

1. **Clone the repository**

```bash
git clone <repository-url>
cd inteliport
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Add your CEREBRAS_API_KEY to .env
```

4. **Start development server**

```bash
bun run dev
```

5. **Open in browser**

```
http://localhost:5173
```

### Building for Production

```bash
# Build the application
bun run build

# Preview the build
bun run preview
```

## 🎮 Usage Examples

### Basic Graph Operations

```
User: "Find the shortest path from A to C"
System: Runs Dijkstra's algorithm and highlights the optimal route

User: "Add a new university called 'Engineering Campus'"
System: Creates new node and suggests optimal connections
```

### Advanced Operations

```
User: "Create a minimum spanning tree"
System: Calculates MST using Kruskal's algorithm and highlights connections

User: "Check if all universities are reachable within 2 hops"
System: Analyzes graph connectivity and provides detailed report

User: "Delete the connection between B and D"
System: Removes edge and updates graph visualization
```

## 📊 Algorithm Implementations

### Graph Algorithms

- **Kruskal's MST** - Minimum spanning tree construction
- **Dijkstra's Algorithm** - Shortest path finding
- **BFS Reachability** - Two-hop connectivity analysis
- **Dynamic Graph Updates** - Real-time modifications

### Data Structures

- **Priority Queues** - Efficient algorithm implementations
- **Adjacency Lists** - Graph representation
- **Bitmasking** - TSP optimization (Phase 3)
- **Union-Find** - MST construction

### AI Integration

- **Function Calling** - Precise tool execution
- **Context Serialization** - Graph state representation
- **Intent Recognition** - Natural language processing
- **Visual Feedback** - Action confirmation

## 🔧 Development

### Project Structure

```
inteliport/
├── src/
│   ├── lib/
│   │   ├── graph/           # Graph algorithms
│   │   ├── agent.server.ts  # AI processing
│   │   ├── tools.server.ts  # Available functions
│   │   └── shared.svelte.ts # Global state
│   ├── routes/
│   │   ├── +page.svelte     # Main interface
│   │   ├── DisplayGraph.svelte # Graph visualization
│   │   └── Tools.ts         # Client-side tool handling
│   └── app.html             # HTML template
├── static/                  # Static assets
└── package.json            # Dependencies
```

### Key Components

#### UII Processing Pipeline

1. **Natural Language Input** - User types intent
2. **LLM Analysis** - Cerebras processes and identifies actions
3. **Function Calling** - Specific tools are executed
4. **Visual Feedback** - Graph updates with highlights
5. **Confirmation** - User sees results immediately

#### Graph Visualization

- **Cytoscape.js Integration** - Professional graph rendering
- **Interactive Controls** - Zoom, pan, select functionality
- **Dynamic Styling** - Color-coded paths and highlights
- **Responsive Design** - Works on all screen sizes

## 🎨 UI/UX Features

### Conversational Interface

- **Natural Language Input** - Type commands in plain English
- **Context-Aware Responses** - System understands graph state
- **Visual Confirmations** - Every action shows immediate results
- **Error Handling** - Graceful fallbacks for invalid requests

### Graph Visualization

- **Interactive Nodes** - Click to select, right-click for context
- **Highlighted Paths** - Color-coded routes and connections
- **Zoom & Pan** - Explore large graphs easily
- **Responsive Layout** - Mobile and desktop friendly

### Navigation

- **Tabbed Interface** - Graph, Profile, Settings sections
- **Mobile Navigation** - Collapsible menu for small screens
- **Keyboard Shortcuts** - Enter to submit, Escape to clear
- **Dark Mode Support** - Automatic theme switching

## 🚀 Future Enhancements

### Phase 3 Roadmap

- **TSP Implementation** - Multi-destination optimization
- **Dynamic Programming** - Advanced route planning
- **Capacity Management** - Real-time booking system
- **Time-based Routing** - Schedule-aware pathfinding

### Phase 4 Scalability

- **Geographic Partitioning** - Regional graph management
- **Distributed Computing** - Parallel algorithm execution
- **Performance Optimization** - Large-scale graph handling
- **Real-time Updates** - Live transportation data

### UII Evolution

- **Voice Commands** - Speech-to-text integration
- **Gesture Recognition** - Touch-based graph manipulation
- **Predictive Suggestions** - AI-powered recommendations
- **Multi-modal Input** - Combine text, voice, and gestures

## 🤝 Contributing

We welcome contributions to InteliPort! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- **Use TypeScript** for type safety
- **Follow existing code style** (Prettier configured)
- **Add tests** for new algorithms
- **Document UII functions** for AI integration
- **Update README** for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cytoscape.js** - Powerful graph visualization library
- **SvelteKit** - Modern web framework
- **Cerebras AI** - Advanced language model capabilities
- **Open Source Community** - Inspiration and resources

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please reach out:

- **Project Repository**: [GitHub Link](https://github.com/inteliport/inteliport)
- **Documentation**: [Wiki Link](https://github.com/inteliport/inteliport/wiki)
- **Issues**: [GitHub Issues](https://github.com/inteliport/inteliport/issues)

---

**InteliPort** - Transforming university transportation through intelligent algorithms and revolutionary User Intent Interface technology. 🚀🎓
