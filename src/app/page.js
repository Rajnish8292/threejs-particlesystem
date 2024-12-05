'use client'

import { Canvas, useLoader, useThree, useFrame, extend } from "@react-three/fiber"
import { useEffect, useMemo, useState, useRef } from "react";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'


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


const getSurfaceVertices = (mesh)=> {
    const sampler = new MeshSurfaceSampler(mesh).build()

    if(sampler) {
      let vertices = []
      let temp_vertex = new THREE.Vector3()

      for(let i = 0; i < 10000; i++) {
        sampler.sample(temp_vertex)
        vertices.push(temp_vertex.x, temp_vertex.y, temp_vertex.z)
      }

      return new Float32Array(vertices)
    } else {
      console.error('ERROR : ', `'sampler' is not defined`)
    }

    return null
}



function Lights() {
  return (
    <ambientLight color={'white'}/>
  )
}

function SkullModel() {
  const gltf = useLoader(GLTFLoader, '/skull/scene.gltf')
  let vertices = null;
  console.log('scene', gltf.scene)
  gltf.scene.traverse((obj) => {
    if(obj.isMesh) {
      vertices = getSurfaceVertices(obj)
    }
  })

  console.log(vertices)
  return (
    <>
      <points rotation={[-90*3.14/180,0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' array={vertices} itemSize={3} count={vertices.length/3} />
        </bufferGeometry>
        <pointsMaterial size={0.005} color={'white'} sizeAttenuation/>
      </points>
    </>
  )
}


function Scene() {
  return (
    <>
      <SkullModel />
      <Lights />
      <InitiateOrbitControl />
    </>

    
  )
}


export default function Home() {
  return (
    <>
      <Canvas style={{height:'100vh', width: '100vw', background:'black'}}>
        <Scene />
      </Canvas>
    </>
  )
}