export class Extractor {
    constructor(spawner, origin, directions, rate, scale, memory, latitudeSpacing, scene)
    {
        this.spawner = spawner;
        this.origin = origin;
        this.directions = directions;
        this.rate = rate;
        this.scale = scale;
        this.memory = memory;
        this.points = [];
        this.colors = [];
        this.lineMeshes = [];

        this.latitudeSpacing = latitudeSpacing;
        this.latitudeLines = []
        this.latitudeLineColors = []
        this.latitudePointColors = []
        this.latitudeLineMeshes = [];
        
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

            this.lineMeshes.push(BABYLON.MeshBuilder.CreateLines("lines",
                                                            {
                                                                points: points,
                                                                colors: colors,
                                                                useVertexAlpha: false,
                                                                updatable: true
                                                            },
                                                            scene));
        }

        // Construct the lines that constructing the lateral web of lines spanning
        // all directions.
        if (this.directions.length > 1) {
            for (let i = 0; i < this.memory; i += this.latitudeSpacing) {
                let lineColor = new BABYLON.Color4(0.5, 0.5, 0.5, 1.0)
                let latitudeLinePoints = [];
                let colors = [];
                for (let d = 0; d < this.directions.length; ++d) {
                    latitudeLinePoints.push(this.points[d][i]);
                    if (d == this.directions.length - 1) {
                        latitudeLinePoints.push(this.points[0][i]);
                    } else {
                        latitudeLinePoints.push(this.points[d + 1][i]);
                    }
                    colors.push(lineColor);
                    colors.push(lineColor);
                }
                this.latitudeLineColors.push(colors);
                this.latitudeLines.push(latitudeLinePoints);
                this.latitudePointColors.push(colors);
                this.latitudeLineMeshes.push(BABYLON.MeshBuilder.CreateLines("lat_lines",
                                                                             {
                                                                                 points: latitudeLinePoints,
                                                                                 colors: colors,
                                                                                 useVertexAlpha: false,
                                                                                 updatable: true
                                                                             },
                                                                             scene));
            }
        }
    }

    update(timeDelta)
    {
        for (let d in this.directions) {
            for (let p = this.points[d].length - 1; p > 0; --p) {
                this.points[d][p].copyFrom(this.points[d][p - 1]).addInPlace(this.directions[d].scale(this.scale));
            }
            this.points[d][0].copyFrom(this.spawner.currentSpawnerPosition.add(this.origin).addInPlace(this.directions[d].scale(this.scale)));
            this.lineMeshes[d] = BABYLON.MeshBuilder.CreateLines("lines",
                                                                 {
                                                                     points: this.points[d],
                                                                     instance: this.lineMeshes[d]
                                                                 });
        }

        for (let ll = 0; ll < this.latitudeLines.length; ++ll) {
            let newColor = this.latitudeLines[ll][0].y / 255;
            this.latitudePointColors[ll][0].copyFromFloats(newColor, 1.0, 0.5, 1.0);
            this.latitudeLineMeshes[ll] = BABYLON.MeshBuilder.CreateLines("lat_lines",
                                                                         {
                                                                             points: this.latitudeLines[ll],
                                                                             colors: this.latitudePointColors[ll],
                                                                             instance: this.latitudeLineMeshes[ll]
                                                                         });           
        }        
    }
}
