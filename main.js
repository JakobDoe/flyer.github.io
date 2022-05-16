import {loadGLTF} from "/loader.js";
import { CSS3DObject } from "/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js"; 
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    // Marker für Anzeige des Hauses laden
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: 'houseNew2.mind'
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
    //const {renderer, scene, camera} = mindarThree;


    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);



    // Haus hinzufügen
    const house = await loadGLTF('/NeuHouse/scene.gltf');
    house.scene.scale.set(0.05, 0.05, 0.05);
    house.scene.position.set(0, 0, 0);
    house.scene.rotation.x += 1.5;
    house.scene.rotation.y += 1.5;
    house.scene.userData.clickable = true

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(house.scene);

    // eventlistener für Click auf Haus

    document.body.addEventListener('click', (e) => {
      // normalize to -1 to 1
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	      let o = intersects[0].object; 
	      while (o.parent && !o.userData.clickable) {
	        o = o.parent;
	      }
	      if (o.userData.clickable) {
	         if (o === house.scene) {
            // openCSSButton();
	          }
	      }
      }
    });
    
    //CSS Element hinzufügen
    
    const objButton = new CSS3DObject(document.querySelector("#ar-div"));
    objButton.rotation.x += 1.5;
    objButton.position.set(100, 200, 140);

    const objButton2 = new CSS3DObject(document.querySelector("#ar-div2"));
    objButton2.rotation.x += 1.5;
    objButton2.position.set(-200, 200, 280);


    
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(objButton);
    cssAnchor.group.add(objButton2);




    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  };
  start();
});
