'use client'
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import * as THREE from 'three'
import axios from 'axios'
import { useEffect, useState, useRef } from "react";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {fragment} from './shaders/fragment.glsl'
import {fragment_defines} from './shaders/fragment_defines.glsl'
import {vertex} from './shaders/vertex.glsl'
import {vertex_defines} from './shaders/vertex_defines.glsl'

import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'

extend({OrbitControls})

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

const material = new THREE.MeshStandardMaterial({color: 0xffffff, emissive:0x0000ff , emissiveIntensity:2, toneMapped: false});


const onBeforeCompileHandler = (shaders) => {
    const {fragmentShader, vertexShader} = shaders
    shaders.uniforms.uTime = {value: 0}
    // console.log({uniforms: shaders.uniforms})
    // console.log({fragmentShader, vertexShader})
    shaders.vertexShader = shaders.vertexShader.replace(`#include <displacementmap_pars_vertex>`, `#include <displacementmap_pars_vertex> ${vertex_defines}`)


    shaders.vertexShader = shaders.vertexShader.replace(`#include <displacementmap_vertex>`, `#include <displacementmap_vertex> ${vertex}`)


    shaders.fragmentShader = shaders.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps> ${fragment}`)
    shaders.fragmentShader = shaders.fragmentShader.replace('#include <bumpmap_pars_fragment>', `#include <bumpmap_pars_fragment> ${fragment_defines}`)

    console.log(shaders.fragmentShader)
    material.userData.shaders = shaders



}



material.onBeforeCompile = onBeforeCompileHandler



function Scene() {

    // const [vertexShader, setVertexShader] = useState(null)
    // const [fragmentShader, setFragmentShader] = useState(null)
    // const [vertexShaderDefines, setVertexShaderDefines] = useState(null)
    // const [fragmentShaderDefines, setFragmentShaderDefines] = useState(null)

    const meshRef = useRef()

    // useEffect(() => {
    //     axios.get('/vertex.glsl').then((res) => {setVertexShader(res.data)})
    //     axios.get('/fragment.glsl').then((res) => {setFragmentShader(res.data)})
    //     axios.get('/fragment_defines.glsl').then((res) => {setFragmentShaderDefines(res.data)})
    //     axios.get('/vertex_defines.glsl').then((res) => {setVertexShaderDefines(res.data)})

    // }, [])
     useFrame(({scene, clock}) => {
        const elapsedTime = clock.elapsedTime
        if(material.userData.shaders) {
            material.userData.shaders.uniforms.uTime = {value: elapsedTime}
        }


     })
    // if(!vertexShader || !fragmentShader) return null  /*  */

    return (
        <mesh ref={meshRef} rotation={[0, 0 , 0]} material={material}>
            <icosahedronGeometry args={[1,400]}/>
            {/* <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms}/> */}
            {/* <meshStandardMaterial color={'red'} onBeforeCompile={onBeforeCompileHandler} /> */}
        </mesh>
    )
}

export default function Page() {
    return (
        <Canvas style={{height: '100vh', width: '100vw', background:'black'}} camera={{position: [0, 4, -10]}}>
            <Scene />
            <ambientLight color={'white'} intensity={0.4} />
            <directionalLight color={'white'} position={[2, 2, 2]} intensity={0.6}/>
            <InitiateOrbitControl/>
            <EffectComposer>
            <Bloom
    intensity={5} // The bloom intensity.
    blurPass={undefined} // A blur pass.
    kernelSize={KernelSize.LARGE} // blur kernel size
    luminanceThreshold={0.4} // luminance threshold. Raise this value to mask out darker elements in the scene.
    luminanceSmoothing={0.0025} // smoothness of the luminance threshold. Range is [0, 1]
    mipmapBlur={false} // Enables or disables mipmap blur.
    resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
    resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
  />
            </EffectComposer>
        </Canvas>
    )
}