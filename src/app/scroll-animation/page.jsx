'use client'
import { Canvas } from '@react-three/fiber'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react';
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import Scene from '@/component/Scene';
import { OrbitControls } from '@react-three/drei';
gsap.registerPlugin(ScrollTrigger);





export default function Page() {
    const canvas = useRef()

    useGSAP(() => {
        if(canvas.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger:canvas.current,
                    pin:true,
                    start:'top top',
                    end: '+=300%',
                    scrub:true,
                    markers: true
                }
            })

        }
    }, [canvas.current])
    return (
        <>
            <div className='canvas_container' ref={canvas}>
                <Canvas style={{height:'100vh', width:'100vw', background:'black'}}>
                    <Scene />
                    <OrbitControls enableDamping/>
                    <axesHelper />
                </Canvas>
            </div>     
        </>

    )
}