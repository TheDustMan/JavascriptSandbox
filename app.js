import Scene1 from './scene.js';

export default class Application {
    constructor(renderElementId)
    {
        this.canvas = document.getElementById(renderElementId);
        this.engine = new BABYLON.Engine(this.canvas);
        this.scene = new Scene1(this.engine);

        this.time = new Date().getTime();
    }

    run()
    {
        this.engine.runRenderLoop(() => {
            let currentTime = new Date().getTime();
            let time_delta_ms = currentTime - self.time;
            self.time = currentTime;
            
            this.scene.render(time_delta_ms);
        });
    }
    
    resize()
    {
        this.engine.resize();
    }
}
