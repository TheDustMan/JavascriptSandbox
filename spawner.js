class Spawner {
    constructor(behavior, position, dimensions, cellSize, updateRate, scene)
    {
        this.behavior = behavior;
        this.position = position;
        this.dimensions = dimensions;
        this.cellSize = cellSize;
        this.currentSpawnerPosition = new BABYLON.Vector3(0, 0, 0);
        this.updateRate = updateRate; // in milliseconds
        this.currentTime = 0;

        this.cells = [];
        for (let i = 0; i < this.dimensions.x; ++i) {
            this.cells.push([]);
            for (let j = 0; j < this.dimensions.y; ++j) {
                this.cells[i].push([])
                for (let k = 0; k < this.dimensions.z; ++k) {
                    this.cells[i][j].push(null)
                }
            }
        }

        this.spawner = null;
        this.build(scene);
    }

    computePosition(deltaTime)
    {
        this.currentTime += deltaTime;
        if (this.currentTime > this.updateRate) {
            this.currentTime -= this.updateRate;

            let nextPosition = this.behavior.determineNextPosition(this.currentSpawnerPosition,
                                                                   this.dimensions);
            this.currentSpawnerPosition.copyFrom(nextPosition);
        }
    }

    build(scene)
    {
        let cellMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        cellMaterial.emmisiveColor = new BABYLON.Color3(0, 0.58, 0.86);
        cellMaterial.alpha = 0.1;

        for (let i = 0; i < this.dimensions.x; ++i) {
            for (let j = 0; j < this.dimensions.y; ++j) {
                for (let k = 0; k < this.dimensions.z; ++k) {
                    let name = "box_" + i + "_" + j + "_" + k;
                    let box = BABYLON.Mesh.CreateBox(name, self.cellSize, scene);
                    box.position.x = this.position.x + (this.cellSize * i);
                    box.position.y = this.position.y + (this.cellSize * j);
                    box.position.z = this.position.z + (this.cellSize * k);
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
    
    update(deltaTime)
    {
        this.computePosition(deltaTime);
        this.spawner.position.x = this.currentSpawnerPosition.x;
        this.spawner.position.y = this.currentSpawnerPosition.y;
        this.spawner.position.z = this.currentSpawnerPosition.z;
    }
}

class SawtoothBehavior {
    constructor(velocity)
    {
        this.velocity = velocity;
    }

    determineNextPosition(currentPosition, dimensions)
    {
        let nextX = currentPosition.x;
        let nextY = currentPosition.y;
        let nextZ = currentPosition.z;
        let rawNextPosition = currentPosition.add(this.velocity);

        if (rawNextPosition.x < dimensions.x &&
            rawNextPosition.x >= 0) {
            nextX = rawNextPosition.x;
        } else {
            this.velocity.x *= -1;
        }
       
        if (rawNextPosition.y < dimensions.y &&
            rawNextPosition.y >= 0) {
            nextY = rawNextPosition.y;
        } else {
            this.velocity.y *= -1;
        }

        if (rawNextPosition.z < dimensions.z &&
            rawNextPosition.z >= 0) {
            nextZ = rawNextPosition.z;
        } else {
            this.velocity.z *= -1;
        }

        return new BABYLON.Vector3(nextX, nextY, nextZ);
    }
}

class RandomBehavior {
    constructor()
    {
    }

    determineNextPosition(currentPosition, dimensions)
    {
        let possiblePositions = this.computePossiblePositions(currentPosition, dimensions);
        let index = Math.floor(Math.random() * possiblePositions.length);
        let newPosition = possiblePositions[index];

        return BABYLON.Vector3.FromArray(newPosition);
    }

    computePossiblePositions(currentPosition, dimensions)
    {
        let cPosArr = currentPosition.asArray();
        let dims = dimensions.asArray();
        let comps = [];
        
        for (let p = 0; p < cPosArr.length; p++) {
            let poss = [];
            let pos = cPosArr[p];
            let dmin = 0;
            let dmax = dims[p] - 1;
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

        return cartesian(comps[0], comps[1], comps[2]);
    }

}

export { Spawner, RandomBehavior, SawtoothBehavior };
