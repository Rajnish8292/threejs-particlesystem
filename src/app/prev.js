'use client'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, useLoader, useThree, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three'
import { useState, useEffect, useMemo } from 'react';

import { useRef } from 'react';
import { PointMaterial } from '@react-three/drei';
extend({OrbitControls})








//////////////////////////////////////////////////////
////////// Orbit control
function InitiateOrbitControl(props)
{
  const orbitControlsRef = useRef()
  const {camera, gl, scene} = useThree()

  useFrame((state, delta, xFrame) => {
      if(orbitControlsRef.current)
      {
        orbitControlsRef.current.update()
      }
  })
  return (
    <>
      <orbitControls ref={orbitControlsRef} args = {[camera, gl.domElement]} enableDamping {...props}/>
    </>
    
  )
}


//////////////////////////////////////////////////////////////////
//////////// Load 3d model
function model(props) {
  const { samplerHandler } = props;

  const model = useLoader(GLTFLoader, '/skull/scene.gltf');
  useEffect(() => {
    if (model) {
      model.scene.traverse((obj) => {
        if (obj.isMesh) {
          const sampler = new MeshSurfaceSampler(obj).build();
          samplerHandler(sampler);
        }
      });
    }
  }, [model, samplerHandler]);


}

const samplerHandler = (sampler) => {
  if (sampler) {
    // const pointGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const tempVertex = new THREE.Vector3();

    for (let i = 0; i < 10000; i++) {
      // console.log(i)
      sampler.sample(tempVertex);
      vertices.push(tempVertex.x, tempVertex.y, tempVertex.z);
    }

    setVertices(vertices)

    // pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // setPointsGeometry(pointGeometry);
  } else {
    throw new Error('Sampler not found!');
  }
}

//////////////////////////////////////////////////////////////////
/////////// Lights for the scene
function Lights() {
  return (
    <>
      <ambientLight color={'white'} />
      <directionalLight color={'white'} />
    </>
  )
}



/////////////////////////////////////////////////////////////////
/////////// Scene
function Scene() {
  // const [pointsGeometry, setPointsGeometry] = useState(null);
  const [vertices, setVertices] = useState(null)
  // const [pointsMaterial] = useState(new THREE.PointsMaterial({
  //   color: 'red',
  //   size: 0.01,
  // }));





  ////////////////////////////////////////////////////
  ///////  build sampler for the 3d model
  model({samplerHandler})


  // console.log(vertices)

  return (
    <>
      {vertices && <points rotation={[-90*3.14/180, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach={'attributes-position'} count={vertices.lenght/3} array={new Float32Array(vertices)} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={'white'} size={0.05} />
      </points>}

    </>
  )
}

export default function Home() {
  return (
    <Canvas style={{ height: '100vh', width: '100vw', background: 'black' }}>
      <Scene />
      <Lights />
      <InitiateOrbitControl />
    </Canvas>
  );
}
