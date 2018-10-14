import { Spawner, RandomBehavior, SawtoothBehavior } from './spawner.js';
import { Extractor } from './extractor.js';

export default class Scene2 {
    constructor(engine, canvas)
    {
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.spawners = [];
        this.extractors = [];

        this.build(engine, canvas);
    }

    render(deltaTime)
    {
        if (this.scene == null) {
            return;
        }

        for (let i = 0; i < this.spawners.length; ++i) {
            this.spawners[i].update(deltaTime);
        }
        for (let i = 0; i < this.extractors.length; ++i) {
            this.extractors[i].update(deltaTime);
        }

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

        let spawner1 = new Spawner(new SawtoothBehavior(new BABYLON.Vector3(0, 5, 0)),
                                   new BABYLON.Vector3(0, 0, 0),
                                   new BABYLON.Vector3(1, 200, 1),
                                   1,
                                   10,
                                   this.scene);
        let extractor1 = new Extractor(spawner1,
                                       new BABYLON.Vector3(0, 0, 0),
                                       [new BABYLON.Vector3(1, 0, 0),
                                        new BABYLON.Vector3(1, 0, 1),
                                        new BABYLON.Vector3(0, 0, 1),
                                        new BABYLON.Vector3(-1, 0, 1),
                                        new BABYLON.Vector3(-1, 0, 0),
                                        new BABYLON.Vector3(-1, 0, -1),
                                        new BABYLON.Vector3(0, 0, -1),
                                        new BABYLON.Vector3(1, 0, -1)],
                                       1,
                                       4,
                                       500,
                                       10,
                                       this.scene);

        let spawner2 = new Spawner(new RandomBehavior(new BABYLON.Vector3(0, 5, 0)),
                                   new BABYLON.Vector3(0, 0, 0),
                                   new BABYLON.Vector3(1, 200, 1),
                                   1,
                                   10,
                                   this.scene);
        let extractor2 = new Extractor(spawner2,
                                       new BABYLON.Vector3(0, 0, 0),
                                       [new BABYLON.Vector3(1, 0, 0),
                                        new BABYLON.Vector3(1, 0, 1),
                                        new BABYLON.Vector3(0, 0, 1),
                                        new BABYLON.Vector3(-1, 0, 1),
                                        new BABYLON.Vector3(-1, 0, 0),
                                        new BABYLON.Vector3(-1, 0, -1),
                                        new BABYLON.Vector3(0, 0, -1),
                                        new BABYLON.Vector3(1, 0, -1)],
                                       1,
                                       4,
                                       500,
                                       500,
                                       this.scene);

        
        this.spawners.push(spawner1);
        this.extractors.push(extractor1);
        this.spawners.push(spawner2);
        this.extractors.push(extractor2);
        
    }
}
