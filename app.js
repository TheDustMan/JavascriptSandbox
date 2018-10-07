import Scene1 from './scene1.js';
import Scene2 from './scene2.js';

const Stats = require('stats-js')

export default class Application {
    constructor(renderElementId)
    {
        this.canvas = document.getElementById(renderElementId);
        this.engine = new BABYLON.Engine(this.canvas);
        this.scene = new Scene2(this.engine);
        this.time = new Date().getTime();

        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '10px';
        this.stats.domElement.style.top = '10px';
        document.body.appendChild(this.stats.domElement);
    }

    run()
    {
        this.engine.runRenderLoop(() => {
            this.stats.begin();
            
            let currentTime = new Date().getTime();
            let deltaTime = currentTime - this.time;
            this.time = currentTime;
            
            this.scene.render(deltaTime);

            this.stats.end();
        });
    }
    
    resize()
    {
        this.engine.resize();
    }
}
