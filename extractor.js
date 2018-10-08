export class Extractor {
    constructor(spawner, origin, directions, rate, scale, memory, scene)
    {
        this.spawner = spawner;
        this.origin = origin;
        this.directions = directions;
        this.rate = rate;
        this.scale = scale;
        this.memory = memory;
        this.points = [];
        this.colors = [];
        this.lines = [];
        
        this.build(scene);
    }

    build(scene)
    {
        for (let d in this.directions) {
            let points = [];
            let colors = [];

            for (let i = 1; i <= this.memory; ++i) {
                let offset = this.directions[d].scale(this.scale * i);
                let point = this.origin.add(offset);
                points.push(point);
                colors.push(new BABYLON.Color4(0.5, 0.5, i / this.memory, 1.0));
            }
            this.points.push(points);
            this.colors.push(colors);

            this.lines.push(BABYLON.MeshBuilder.CreateLines("lines",
                                                            {
                                                                points: points,
                                                                colors: colors,
                                                                updatable: true
                                                            },
                                                            scene));
        }
    }

    update(timeDelta)
    {
        for (let d in this.directions) {
            for (let p = this.points[d].length - 1; p > 0; --p) {
                this.points[d][p].copyFrom(this.points[d][p - 1]).addInPlace(this.directions[d].scale(this.scale));
            }
            this.points[d][0].copyFrom(this.spawner.currentSpawnerPosition.add(this.origin).addInPlace(this.directions[d].scale(this.scale)));
            this.lines[d] = BABYLON.MeshBuilder.CreateLines("lines",
                                                            {
                                                                points: this.points[d],
                                                                instance: this.lines[d]
                                                            });
        }
    }
}
