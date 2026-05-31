"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function CinematicModelViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20);
    camera.position.z = 2.8;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x86e7ff, 16);
    pointLight.position.set(2, 2, 2);
    camera.add(pointLight);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;

    let model;
    let frameId;

    const mtlLoader = new MTLLoader().setPath("https://threejs.org/examples/models/obj/male02/");
    const objLoader = new OBJLoader().setPath("https://threejs.org/examples/models/obj/male02/");

    mtlLoader.load(
      "male02.mtl",
      (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(
          "male02.obj",
          (object) => {
            model = object;
            object.position.y = -0.95;
            object.scale.setScalar(0.01);
            scene.add(object);
          },
          undefined,
          () => {}
        );
      },
      undefined,
      () => {}
    );

    const onWindowResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const animate = () => {
      controls.update();
      if (model) model.rotation.y += 0.003;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="h-full w-full" ref={mountRef} />;
}
