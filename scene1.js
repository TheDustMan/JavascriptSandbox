export default class Scene1 {
    constructor(engine)
    {
        this.scene = null;

        this.camera = null;
        this.light = null;
        this.box = null;

        this.build(engine);

        self.progress = 0;
    }

    render(deltaTime)
    {
        self.progress += deltaTime / 100;
        this.box.rotation.y = self.progress * 2;
        this.box.position.x = Math.sin(self.progress % 1);
        this.scene.render();
    }

    build(engine)
    {
        this.scene = new BABYLON.Scene(engine);
        this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -10), this.scene);
        this.light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), this.scene);
        
        var boxMaterial = new BABYLON.StandardMaterial("material", this.scene);
        boxMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86);
        
        this.box = BABYLON.Mesh.CreateBox("box", 2, this.scene);
        this.box.rotation.x = -0.2;
        this.box.rotation.y = -0.4;
        this.box.material = boxMaterial;
    }
}    
