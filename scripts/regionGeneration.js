/**
 * Region
 * handles picking the region, generating the regionName, map
 *
 * region generating nodes depth should look something like this:
 * depth 0: node0, (shrine of the abyss)
 * depth 1: node1, node2,
 * depth 2: node3, node4, node5,
 * depth 3: node6, node7,
 * depth 4: node8, node9, node10,
 * depth 5: node11, node12, node13,
 * depth 6: node14, node15,
 * depth 7: node16, (abyssConfrontation)
 * depth 8: node17, (respite)
 *
 * the first, 2nd to last, and last node should always be fixed
 * with (shrine of abyss, regionCheck, and respite)
 *
 * each node should have a nodeEvent, (see resources > nodeTypes.js)
 * same with each path connecting from and to a node (see resources > pathTypes.js)
 */
const RegionGen = {
  unexpRegs: [],
  expRegs: [],
  depth: 4,
  maxDepth: 14,

  init: function () {
    let regions = [
      "theWasteland",
      "theTundra",
      "theFlickeringForest",
      "theLowlands",
      "theForgottenValley",
    ];
    // making the regions
    for (const region of regions) {
      if (!SM.get("location.regions." + region)) {
        SM.set("location.regions." + region, {});
        //console.log("region made: " + region);
      }
    }
    // checking for undefined
    for (let i = 0; i < regions.length; i++) {
      let region = regions[i];
      if (SM.get("location.regions." + region + ".exp") === undefined) {
        SM.setRegionAttr(region, "exp", false);
        //console.log("region unexplored");
      }
    }
    for (const region of regions) {
      switch (SM.get("location.regions." + region + ".exp")) {
        case true:
          this.expRegs.push(region);
          break;
        default:
          this.unexpRegs.push(region);
          break;
      }
    }
    //console.log(this.unexpRegs);
  },
  getRegName: function () {
    let namePool = this.unexpRegs;
    let rngIndex = Math.floor(Math.random() * namePool.length);
    let chosen = namePool.splice(rngIndex, 1)[0];

    //SM.setRegionAttr()
    this.expRegs.push(chosen);
    SM.set("location.regions." + chosen + ".exp", true);
    return chosen;
  },
  getDepth: function () {
    this.depth += this.randRange(1, 2);
    return this.depth;
  },
  newReg: function () {
    let name = this.getRegName();
    if (name === undefined) {
      name = "theAbyss";
    }
    let depth = this.getDepth();
    if (name === "theAbyss") {
      depth = 3;
    }

    if (depth >= this.maxDepth) {
      depth = this.maxDepth;
      // gonna make the maxdepth be dependent on current sin,
      // with each subsequent sin having a longer maxDepth.
    }
    // in the future will make the getTypesFromPool more complex
    let map = this.genMap(depth);
    this.assignTypesToNodes(map.nodes, NodeTypesPool, depth, name);
    this.assignTypesToPaths(map.paths, PathTypesPool);
    this.lastMinAssignCheck(map);
    console.log(name);

    return { map, name };
  },
  genMap: function (depth) {
    let nodes = this.genNodes(depth);
    let paths = this.genPaths(nodes, depth);
    return { nodes, paths };
  },
  genNodes: function (depth) {
    let nodes = [];
    let id = 1;
    //let prevNodesForDepth = -1;

    for (let d = 0; d <= depth; d++) {
      let nodesForDepth = 0;
      if (d === 0 || d === depth || d === depth - 1) {
        nodesForDepth = 1;
      } else {
        nodesForDepth = this.randRange(2, 3);
      }
      for (let i = 0; i < nodesForDepth; i++) {
        let node = this.createNode(id++, d, null);
        nodes.push(node);
      }
    }

    return nodes;
  },
  genPaths: function (nodes, depth) {
    let paths = [];
    let nodesByDepth = {};
    nodes.forEach((node) => {
      // checks if there are nodes at specific depth level, then makes an empty array,
      // then pushes the nodes at that depth level to that array
      if (!nodesByDepth[node.depth]) {
        nodesByDepth[node.depth] = [];
      }
      nodesByDepth[node.depth].push(node);
    });

    for (let d = 0; d < depth; d++) {
      let currentNodes = nodesByDepth[d] || [];
      let nextNodes = nodesByDepth[d + 1] || [];

      // todo, make this more complex in the future ig
      currentNodes.forEach((currentNode) => {
        nextNodes.forEach((nextNode) => {
          let path = this.createPath(currentNode.id, nextNode.id, null);
          paths.push(path);
        });
      });
    }
    return paths;
  },
  assignTypesToNodes: function (nodes, pool, depth, name) {
    if (name !== "theAbyss") {
      for (const node of nodes) {
        let type;
        switch (node.depth) {
          case 0:
            type = "shrineOfAbyss";
            break;
          case depth:
            type = "respite";
            break;
          case depth - 1:
            type = "regionCheck";
            break;
          default:
            type = this.selectTypeFromPool(pool);
            break;
        }
        if (!node.type !== "undefined") {
          node.type = type;
        }
        //console.log(node);
      }
    } else {
      for (const node of nodes) {
        let type;
        switch (node.depth) {
          case 0:
            type = "shrineOfAbyss";
            break;
          case depth:
            type = "sinBoss";
            break;
          case depth - 1:
            type = "sinMinions";
            break;
          default:
            type = this.selectTypeFromPool(pool);
            break;
        }
        if (!node.type !== "undefined") {
          node.type = type;
        }
        //console.log(node);
      }
    }
  },
  assignTypesToPaths: function (paths, pool) {
    for (const path of paths) {
      let type;
      type = this.selectTypeFromPool(pool);
      path.type = type;
    }
  },
  selectTypeFromPool: function (pool) {
    let random = Math.random();
    let culmination = 0;
    for (const selected of pool) {
      culmination += selected.probability;
      if (random < culmination) {
        return selected.type;
      }
    }
  },
  lastMinAssignCheck: function (map) {
    map.nodes.forEach((node) => {
      if (node.type === undefined) {
        node.type = "encounter";
      }
    });
    map.paths.forEach((path) => {
      if (path.type === undefined) {
        path.type = "nothing";
      }
    });
  },

  createNode: function (id, depth, type) {
    return new Node(id, depth, type);
  },
  createPath: function (from, to, type) {
    return new Path(from, to, type);
  },
  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

//
class Node {
  constructor(id, depth, type) {
    this.id = id;
    this.depth = typeof depth !== "undefined" ? depth : undefined;
    this.type = type;
  }
}
class Path {
  constructor(from, to, type) {
    this.fromId = from;
    this.toId = to;
    this.type = type;
  }
}

/*
const Regions = {
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
    
    return { nodes, paths };
  },
};
*/

/*
  genPaths: function (nodes, depth) {
    let paths = [];
    for (let d = 0; d <= depth; d++) {
      let currentNodes = nodes.filter((node) => node.depth === d);
      let nextNodes = nodes.filter((node) => node.depth + 1 === d + 1);

      console.log("Nodes at Depth", d, ": " + currentNodes);
    }
    return paths;
  },
  */
