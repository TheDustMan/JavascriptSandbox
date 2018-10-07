export default class Scene2 {
    constructor(engine)
    {
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.spawner = null;

        this.buildScene(engine);        
    }

    render(timeDelta)
    {
        if (this.scene == null) {
            return;
        }
        this.spawner.render(timeDelta);
        this.scene.render();
    }

    buildScene(engine)
    {
        this.scene = new BABYLON.Scene(engine);
        this.scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -50), this.scene);
        this.light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), this.scene);

        this.spawner = new Spawner(null, [0, 0, 0], [1, 20, 1], 1, 10);
        this.spawner.draw(this.scene);        
    }
}

class Behavior {
    constructor()
    {

    }

    
}

class Spawner {
    constructor(behavior, position, dimensions, cellSize, updateRate)
    {
        this.behavior = behavior;
        this.position = position;
        this.dimensions = dimensions;
        this.cellSize = cellSize;
        this.currentSpawnerPosition = [0,0,0];
        this.updateRate = updateRate; // in milliseconds
        this.currentTime = 0;

        this.cells = [];
        for (let i = 0; i < this.dimensions[0]; ++i) {
            this.cells.push([]);
            for (let j = 0; j < this.dimensions[1]; ++j) {
                this.cells[i].push([])
                for (let k = 0; k < this.dimensions[2]; ++k) {
                    this.cells[i][j].push(null)
                }
            }
        }

        this.spawner = null;
    }

    computePosition(timeDelta)
    {
        this.currentTime += timeDelta;
        if (this.currentTime > this.updateRate) {
            this.currentTime -= this.updateRate;

            // Figure out where to move to in our grid
            let possiblePositions = this.computePossiblePositions(this.currentSpawnerPosition);
            let index = Math.floor(Math.random() * possiblePositions.length);
            this.currentSpawnerPosition = possiblePositions[index];
        }
    }

    computePossiblePositions(currentPosition)
    {
        let comps = [];
        for (let p = 0; p < currentPosition.length; p++) {
            let poss = [];
            let pos = currentPosition[p];
            let dmin = 0;
            let dmax = this.dimensions[p] - 1;
            if (pos > dmin) {
                poss.push(pos - 1);
            }
            poss.push(pos);
            if (pos < dmax) {
                poss.push(pos + 1);
            }
            comps.push(poss);
        }
        // Now we have an array of [[x possibles], [y possibles], [z possibles]]
        const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
        const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
        let prod = cartesian(comps[0], comps[1], comps[2]);
        return prod;
    }

    draw(scene)
    {
        let cellMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        cellMaterial.emmisiveColor = new BABYLON.Color3(0, 0.58, 0.86);
        cellMaterial.alpha = 0.1;

        for (let i = 0; i < this.dimensions[0]; ++i) {
            for (let j = 0; j < this.dimensions[1]; ++j) {
                for (let k = 0; k < this.dimensions[2]; ++k) {
                    let name = "box_" + i + "_" + j + "_" + k;
                    let box = BABYLON.Mesh.CreateBox(name, self.cellSize, scene);
                    box.position.x = this.position[0] + (this.cellSize * i);
                    box.position.y = this.position[1] + (this.cellSize * j);
                    box.position.z = this.position[2] + (this.cellSize * k);
                    box.material = cellMaterial;
                    this.cells[i][j][k] = box;
                }
            }
        }

        let spawnerMaterial = new BABYLON.StandardMaterial("spawnerMaterial", scene);
        spawnerMaterial.emmisiveColor = new BABYLON.Color3(0, 0.58, 0.86);
        this.spawner = BABYLON.Mesh.CreateBox(name, self.cellSize, scene);
        this.spawner.material = spawnerMaterial;
    }
    
    render(timeDelta)
    {
        this.computePosition(timeDelta);
        this.spawner.position.x = this.currentSpawnerPosition[0];
        this.spawner.position.y = this.currentSpawnerPosition[1];
        this.spawner.position.z = this.currentSpawnerPosition[2];
    }
}
