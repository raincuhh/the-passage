const Region = {
  regions: [
    "theEnamelZone",
    "the tundra",
    "theFlickeringForest",
    "theLowlands",
  ],
  visited: [],
  depth: 4,
  generateFullRegion: function () {
    let regionName = this.chooseRegion();
    let regionEnemies = this.getRegionEnemyTypes(regionName);
    //let regionMap = this.generateRegionMap();
    console.log("region: " + regionName);
    console.log("enemies: " + regionEnemies);
    //console.log("map: "+ regionMap)
  },
  chooseRegion() {
    let randRegion =
      this.regions[Math.floor(Math.random() * this.regions.length)];
    let region = this.regions.pop(randRegion);
    this.visited.push(region);

    return region;
  },
  getRegionEnemyTypes(region) {
    let regionalEnemies = RegionEnemies[region];
    return regionalEnemies;
  },
  generateRegionMap: function () {
    let map = [];
    let depth = this.depth;

    depth += randomNumberBetween2Values(1, 2); // increase depth by 1-2 randomly for each subsequent region
    map.push(this.generateMap(depth));

    return map;
  },
  generateMap: function (depth) {
    let nodes = [];
    let paths = [];

    // first node will always be a shrine of the abyss
    let startNode = this.createNode(
      nodes.length + 1,
      undefined,
      "shrineOfAbyss"
    );
    nodes.push(startNode);

    // making the inbetween Nodes based on depth,
    for (let d = 1; d <= depth; d++) {
      let numOfNodes = randomNumberBetween2Values(1, 3); // number of nodes between 1-3
      let dCounter = d;
      for (let i = 1; i <= numOfNodes; i++) {
        let nodeType = this.getNodeType();
        let node = this.createNode(nodes.length + 1, dCounter, nodeType);
        nodes.push(node);
      }
    }

    let endNode = this.createNode(
      nodes.length + 1,
      undefined,
      "pathfinderRespite"
    );
    nodes.push(endNode);
    //console.log(nodes);

    // making paths
    /*
    for (let d = 1; d < depth; d++) {
      let currentNodes = nodes.filter(
        (node) => Math.ceil(node.id / Math.pow(2, d - 1)) === 1
      );
      let nextNodes = nodes.filter(
        (node) => Math.ceil(node.id / Math.pow(2, d)) === 1
      );

      let numConnections = Math.floor(Math.random() * 3) + 1; // Randomly connect to 1-3 next nodes
      if (numConnections === nextNodes.length) {
        currentNodes.forEach((currentNode) => {
          nextNodes.forEach((nextNode) => {
            paths.push(new Path(currentNode.id, nextNode.id));
          });
        });
      } else {
        currentNodes.forEach((currentNode) => {
          let connectedNodes = [];
          for (let i = 0; i < numConnections; i++) {
            let nextNode =
              nextNodes[Math.floor(Math.random() * nextNodes.length)];
            while (connectedNodes.includes(nextNode)) {
              nextNode =
                nextNodes[Math.floor(Math.random() * nextNodes.length)];
            }
            connectedNodes.push(nextNode);
            paths.push(new Path(currentNode.id, nextNode.id));
          }
        });
      }
    }
    */
    return { nodes, paths };
  },
  createNode: function (id, depth, type) {
    return new Node(id, depth, type);
  },
  getNodeType: function () {
    // will in the future make this, populate a array with a % of each types,
    // encounter being the largest percent of the array based on the amount of nodes in the graph node array
    // then just remove a [i] in the array based off of a math.floor .random or sum
    let nodeTypeLib = NodeTypes;
    let nodeType =
      nodeTypeLib[Math.floor(Math.random() * nodeTypeLib.length)].type;
    return nodeType;
  },
  getPathType: function () {
    let pathTypeLib = PathTypes;
    let pathType =
      pathTypeLib[Math.floor(Math.random() * pathTypeLib.length)].type;
    return pathType;
  },
};

class Node {
  constructor(id, depth, type) {
    this.id = id;
    this.children = [];
    this.type = type;
    this.depth = typeof depth !== "undefined" ? depth : undefined;
  }
}

class Path {
  constructor(from, to, type) {
    this.from = from;
    this.to = to;
    this.type = type;
  }
}
