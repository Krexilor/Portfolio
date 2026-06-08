precision highp float;

uniform float uTime;
uniform int uType;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

float hash(vec3 p) {
    p = fract(p * 0.3183 + vec3(0.1,0.2,0.3));
    p *= 17.0;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f*f*(3.0-2.0*f);

    float n = mix(
        mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
        f.z
    );

    return n;
}

float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;

    for(int i=0;i<3;i++){
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }

    return v;
}

vec3 flowField(vec3 p, float t) {
    vec3 dir;
    dir.x = fbm(p + vec3(0.0, t, 0.0));
    dir.y = fbm(p + vec3(t, 0.0, 0.0));
    dir.z = fbm(p + vec3(0.0, 0.0, t));
    return normalize(dir - 0.5);
}

void main() {
    float t = uTime * 0.5;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorldPosition);

    vec3 p = normalize(vLocalPosition);

    if (uType == 0) {
        float dist = length(vLocalPosition);
        float density = 1.0 - dist * 1.4;
        density = clamp(density, 0.0, 1.0);

        vec3 q = p * 3.0;
        vec3 flow = flowField(q, t * 0.6);
        q += flow * 1.2;

        float n1 = fbm(q);
        float n2 = fbm(q * 1.7 - t * 0.3);

        float energy = mix(n1, n2, 0.5);
        float brightness = density + energy * 0.6;

        vec3 colA = vec3(0.02, 0.03, 0.08);
        vec3 colB = vec3(0.2, 0.5, 1.0);
        vec3 color = mix(colA, colB, brightness);

        float boosted = pow(brightness, 0.7);
        vec3 emission = color * boosted * 6.0;

        gl_FragColor = vec4(emission, 1.0);
        return;
    }

    if (uType == 1) {
        float fresnel = 1.0 - dot(N, V);
        fresnel = pow(fresnel, 2.0);

        vec3 q = p * 2.0;
        vec3 flow = flowField(q, t * 0.6);
        q += flow * 1.5;

        float n = fbm(q);
        vec3 cell = fract(q * 3.0);
        float vor = length(cell - 0.5);
        vor = smoothstep(0.2, 0.5, vor);

        float motion = mix(n, vor, 0.5);
        motion = sin(motion * 8.0 + t * 3.0);

        motion = 0.3 * motion + 0.7;

        float shell = fresnel * (0.6 + motion * 0.9);

        vec3 base = vec3(0.01, 0.02, 0.05);
        vec3 glow = vec3(0.3, 0.7, 1.2);
        vec3 color = mix(base, glow, shell);

        vec3 emission = color * shell * 1.5;
        float alpha = clamp(shell, 0.0, 1.0);

        gl_FragColor = vec4(emission, alpha);
        return;
    }

    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
