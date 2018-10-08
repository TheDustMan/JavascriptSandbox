export default class Scene2 {
    constructor(engine, canvas)
    {
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.spawner = null;
        this.extractor = null;

        this.build(engine, canvas);
    }

    render(deltaTime)
    {
        if (this.scene == null) {
            return;
        }
        this.spawner.update(deltaTime);
        this.extractor.update(deltaTime);
        this.scene.render();
    }

    build(engine, canvas)
    {
        this.scene = new BABYLON.Scene(engine);
        this.scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        
        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 0, -500), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(canvas, true);
        
        this.light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), this.scene);

        this.spawner = new Spawner(null,
                                   new BABYLON.Vector3(0, 0, 0),
                                   new BABYLON.Vector3(1, 200, 1),
                                   1,
                                   10,
                                   this.scene);
        this.extractor = new Extractor(this.spawner,
                                       new BABYLON.Vector3(0, 0, 0),
                                       new BABYLON.Vector3(1, 0, 0),
                                       1,
                                       4,
                                       500,
                                       this.scene);
    }
}

class Behavior {
    constructor()
    {

    }

    
}

class Particle {
    constructor(origin, offset)
    {
        this.origin = origin;
        this.offset = offset;
        this.position = origin.add(offset);
    }

    set origin(newOrigin)
    {
        this.origin.copyFrom(newOrigin);
    }

    set offset(newOffset)
    {
        this.offset.copyFrom(newOffset);
    }

    get position()
    {
        this.position.copyFrom(this.origin.add(offset));
        return this.position;
    }
}

class Extractor {
    constructor(spawner, origin, direction, rate, scale, memory, scene)
    {
        this.spawner = spawner;
        this.origin = origin;
        this.direction = direction;
        this.rate = rate;
        this.scale = scale;
        this.memory = memory;
        this.points = [];
        this.colors = [];
        this.lines = null;
        
        this.build(scene);
    }

    build(scene)
    {
        for (let i = 1; i <= this.memory; ++i) {
            let offset = this.direction.scale(this.scale * i);
            let point = this.origin.add(offset);
            this.points.push(point);
            this.colors.push(new BABYLON.Color4(0.5, 0.5, i / this.memory, 1.0));
        }

        this.lines = BABYLON.MeshBuilder.CreateLines("lines",
                                                     {
                                                         points: this.points,
                                                         colors: this.colors,
                                                         updatable: true
                                                     },
                                                     scene);
    }

    update(timeDelta)
    {
        for (let i = this.points.length - 1; i > 0; --i) {
            this.points[i].copyFrom(this.points[i - 1]).addInPlace(this.direction.scale(this.scale));
        }
        this.points[0].copyFrom(this.spawner.currentSpawnerPosition.add(this.origin).addInPlace(this.direction.scale(this.scale)));
        this.lines = BABYLON.MeshBuilder.CreateLines("lines",
                                                     {
                                                         points: this.points,
                                                         instance: this.lines
                                                     });
    }
}

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

            // Figure out where to move to in our grid
            let possiblePositions = this.computePossiblePositions(this.currentSpawnerPosition);
            let index = Math.floor(Math.random() * possiblePositions.length);
            let newPosition = possiblePositions[index];

            this.currentSpawnerPosition.set(newPosition[0], newPosition[1], newPosition[2]);
        }
    }

    computePossiblePositions(currentPosition)
    {
        let cPosArr = currentPosition.asArray();
        let dims = this.dimensions.asArray();
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
