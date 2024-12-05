'use client'
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { OrbitControls, useHelper, MeshReflectorMaterial, PerspectiveCamera,CubeCamera,Environment } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Suspense, useRef, useEffect } from "react";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";

import { BlurPass, Resizer, KernelSize, Resolution, BlendFunction } from 'postprocessing'

// function Ring() {
//     return (
//         <mesh position={[0, 3, 0]} rotation={[-Math.PI*0.5, 0, 0]}>
//             <ringGeometry args={[2.75, 3, 100]}/>
//             <meshStandardMaterial emissive={0xffffff} color={[0, 0, 0]} side={THREE.DoubleSide}/>
//         </mesh>
//     )
// }

function Rings() {
    const ringsArray = new Array(14).fill(0)
    console.log({ringsArray})
    return (
        <>
            {
                ringsArray.map((elem, index) => <mesh key={index} scale={[1-(Math.abs(7-index)*(1/7)), 1-(Math.abs(7-index)*(1/7)), 1-(Math.abs(7-index)*(1/7))]} position={[0, 0, (7 - index)*4]}>
                        <torusGeometry args={[4, 0.030, 16, 100]}  />
                        <meshStandardMaterial emissive={(index % 2 == 0) ? new THREE.Color(6, 0.15, 0.7).multiplyScalar(1-(Math.abs(7-index)*(1/7))) : new THREE.Color(0.1, 0.7, 3).multiplyScalar(1-(Math.abs(7-index)*(1/7))*2)}  color={[0, 0, 0]}/>
                    </mesh>
                )
            }
        </>

    )
}

function Plane(props) {
    const [normal, roughness] = useLoader(THREE.TextureLoader, ['/texture/normal.jpg', 'texture/roughness.jpg'])

    const meshRef = useRef()

    // useEffect(() => {

    // }, )
    // useFrame((state , clock, delta) => {
    //     // const t = -state.clock.getElapsedTime()*0.001
    //     roughness.offset.set(0, t)
    //     normal.offset.set(0, t)
    // })
    useEffect(() => {
        if(meshRef.current) {
            console.log({material: meshRef.current.material})
            // meshRef.current.material.envMap = null;
            // meshRef.current.material.envMapIntensity  = 0;
            // meshRef.current.material.emmissive = null
        }
    }, [meshRef.current])


    return (
        <mesh ref={meshRef} envMap={null} envMapIntensity={0} {...props} rotation={[-90*3.14/180, 0, 0]} receiveShadow >
            <planeGeometry args={[30, 30, 50, 50]} />
            <MeshReflectorMaterial
                normalMap={normal}
                roughnessMap={roughness}
                dithering={true}
                envMap={null}
                envMapIntensity={0.01}
                color={[0.015, 0.015, 0.015]}
                roughness={0.6}
                blur={[1000, 400]}
                mixBlur={30}
                mixStrength={100}
                mixContrast={1}
                resolution={1024}
                mirror={0}
                depthScale={0.01}
                minDepthThreshold={0.9}
                maxDepthThreshold={1}
                depthToBlurRatioBias={0.25}
                debug={0}
                reflectorOffset={0.2}

             />
        </mesh>
    )
}

function Light() {
    const rect1Ref = useRef()
    useHelper(rect1Ref, RectAreaLightHelper)
    return (
        <>
        {/* <ambientLight color={'white'} intensity={0.4} /> */}
        {/* <directionalLight color={'white'} intensity={10} position={[2, 2, 0]} /> */}
        {/* <rectAreaLight rotation={[0, 90*3.14/180, 0]} ref={rect1Ref} color={0xff0000} intensity={50} height={3} width={1} position={[4, 1.5, -2]}/> */}

        <spotLight
            color={[1, 0.25, 0.7]}
            intensity={1.5*150}
            angle={0.6}
            penumbra={0.5}
            position={[5, 5, 0]}
            castShadow
         />

        <spotLight
            color={[0.14, 0.5, 1]}
            intensity={2*150}
            angle={0.6}
            penumbra={0.5}
            position={[-5, 5, 0]}
            castShadow
         />
        </>

    )
}

function McLaren(props) {
    const gltf = useLoader(GLTFLoader, '/mclaren.glb')

    useEffect(() => {
        gltf.scene.traverse((obj) => {
            if(obj.type == 'Mesh') {
                obj.castShadow = true
                obj.recieveShadow = true
                obj.material.envMapIntensity = 20
            }
        } )
    }, [gltf])
    return <primitive {...props} object={gltf.scene} />
}

function Scene() {
    return (
        <>
        <Plane />
        <Light />
        <Rings />
        <Suspense fallback={null}>
        <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <McLaren />
          </>
        )}
      </CubeCamera>
      {/* <McLaren /> */}
      {/* <McLaren /> */}
        </Suspense>
        <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />
        </>

    )
}


export default function Page() {
    return (
        <Canvas style={{background:'black', height: '100vh', width:'100vw'}} camera={{position: [0, 5, -5]}} shadows>
            <Scene />
            <OrbitControls makeDefault  />
            <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={200} />
            <Noise opacity={0.08} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>

    )
}