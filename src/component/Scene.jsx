import { useLoader } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { extend } from "@react-three/fiber";
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { Sphere } from "@react-three/drei";

extend({TextGeometry})



const getSurfaceVertices = (mesh, points) => {
    const sampler = new MeshSurfaceSampler(mesh).build()

    const vertices = []
    const point = new THREE.Vector3()
    for(let i = 0 ; i < points; i++) {
        sampler.sample(point)

        vertices.push(point.x, point.y, point.z)
    }


    return new Float32Array(vertices)
}

function Light() {
    return <>
        {/* <spotLight position={[2, 2, 0]} color={'white'} intensity={1.5}/> */}
        <ambientLight color={'white'}/>
    </>
}


function Asset() {
    const gltf = useLoader(GLTFLoader, '/models/grieving_angel/scene.gltf')
    gltf.scene.scale.set(5, 5,5 )
    return <primitive object={gltf.scene}></primitive>
}

export default function Scene() {
    const angelAttribute = useMemo(() => {
        const gltf = useLoader(GLTFLoader, '/models/grieving_angel/scene.gltf')
        let vertices = null

        gltf.scene.traverse((obj) => {
            if(obj.isMesh) {
                vertices = getSurfaceVertices(obj, 10000)
            }
        })

        return vertices
    }, [])


    const pegasusAttribute = useMemo(() => {
        const gltf = useLoader(GLTFLoader, '/models/courage_the_cowardly_dog_house.glb')
        gltf.scene.scale.set(2,2, 2)
        console.log('scene 2', gltf.scene)
        let vertices = null

        gltf.scene.traverse((obj) => {
            if(obj.isMesh) {
                console.log(obj.name)
                vertices = getSurfaceVertices(obj, 100000)
            }
        })

        return vertices
    }, [])

    const sphereAttribute = useMemo(() => {
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        const material = new THREE.MeshStandardMaterial({color: 'white'})
        const mesh = new THREE.Mesh(geometry, material)

        return getSurfaceVertices(mesh, 10000)
    }, [])


    
    // console.log({angelAttribute, pegasusAttribute, sphereAttribute})
    
    if(!sphereAttribute && !angelAttribute && !pegasusAttribute) {
        return null
    }

    if(!angelAttribute) {
        console.error('could not found angelAttribute')
        return null;
    } else {
        console.log('angel attribute', angelAttribute)
    }
    return <>
        <Light />
        <points position={[0, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute attach={'attributes-position'} itemSize={3} count={pegasusAttribute.length/3} array={pegasusAttribute}></bufferAttribute>
            </bufferGeometry>
            <pointsMaterial size={0.001} color={0xffffff} sizeAttenuation  />
        </points>
        {/* <Asset /> */}
        {/* <Sphere args={[0.3, 64, 64]} /> */}
    </>
}