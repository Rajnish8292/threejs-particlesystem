export  const vertex = /* glsl */`



    vec3 coords = position;
    coords.y += uTime / 10.0;
    coords.y += noise(coords) * 0.8;
    float pattern = fit(smoothMod(coords.y*6.0, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);

    vPosition = position;
    vNormal = normal;
    vUv = uv;
    vDisplacement = pattern;
    


    vec3 newPosition = position + normal * pattern/0.5;
    transformed += newPosition;
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
`;