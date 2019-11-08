import React, { useEffect, useRef } from "react";

import "./App.css";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

import Stats from "stats.js";

import {
  ThreeInit,
  DrawSlabFix,
  DrawRamenFix,
  SlabRebar,
  ramenBeamRebar,
  ramenColumnRebar   
} from "./threeFuncs";

var camera, scene, renderer;

var stats = new Stats();
stats.showPanel(0); // 0:fps, 1:ms, 2: mb, 3+: custom

function App() {
  var threeRef = useRef(null);

  function init() {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      30000
    );
    camera.position.set(-10, -10, 10);
    // y z axis exchange
    camera.up = new THREE.Vector3(0, 0, 1);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.screenSpacePanning = true;
    threeRef.current.appendChild(renderer.domElement);
    threeRef.current.appendChild(stats.dom);

    ThreeInit(camera, scene, renderer);

    var {pivotPoint , slabObj} = DrawSlabFix(100, 100, 10, 50, 1, 40, 80);
    //slab.rotation.set(Math.PI/2, 0 , 0)

    scene.add(pivotPoint);



    var rebarSlabMesh = SlabRebar(slabObj, 1,10,1,10,2);
    pivotPoint.add(rebarSlabMesh)

   
    var {pivotPoint, ramenBeamObj} = DrawRamenFix(150, 15, 15, 50, 0, 0, 1, 50);

    scene.add(pivotPoint);

  

    var rebarBeamMesh = ramenBeamRebar(ramenBeamObj, 0.2, 5, 0.2, 3, 1);

    pivotPoint.children[0].add(rebarBeamMesh);

    var rebarColumnMesh = ramenColumnRebar(ramenBeamObj, 0.2, 5, 0.2, 3, 1, 0);

    console.log(pivotPoint.children);
    pivotPoint.children[1].add(rebarColumnMesh)


    var rebarColumnMesh1 = ramenColumnRebar(ramenBeamObj, 0.2, 5, 0.2, 3, 1, 1);

    pivotPoint.children[2].add(rebarColumnMesh1)



  }

  function animate() {
    stats.begin();
    stats.end();

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return <div ref={threeRef} className="App"></div>;
}

export default App;
