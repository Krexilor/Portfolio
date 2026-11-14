precision mediump float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_click;
uniform float u_time;
uniform float u_clickTime;
uniform float u_hover;
uniform float u_scroll;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
        value += amp * valueNoise(p);
        p *= 2.03;
        amp *= 0.5;
    }
    return value;
}

void main() {
    vec2 res = max(u_resolution, vec2(1.0));
    float aspect = res.x / res.y;

    vec2 uv = v_uv;
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    vec2 mouse = vec2((u_mouse.x - 0.5) * aspect, (1.0 - u_mouse.y) - 0.5);
    vec2 click = vec2((u_click.x - 0.5) * aspect, (1.0 - u_click.y) - 0.5);

    float scrollShift = u_scroll * 0.35;
    float distMouse = length(p - mouse);
    float mouseField = exp(-distMouse * 2.8) * u_hover;

    vec2 warp = p * 2.1 + vec2(u_time * 0.05, -u_time * 0.035 - scrollShift);
    warp += normalize(p - mouse + vec2(0.0001)) * mouseField * 0.16;

    float n1 = fbm(warp);
    float n2 = fbm(warp * 1.45 + vec2(n1 * 0.95, u_time * 0.03));
    float field = mix(n1, n2, 0.55);

    // Analytical topographic contour isolines (WebGL 1 compatible)
    float contourPhase = field * 11.0;
    float contourDist = abs(fract(contourPhase - 0.5) - 0.5);
    float contour = 1.0 - smoothstep(0.0, 0.095, contourDist);

    // Coordinate lattice and node intersections
    vec2 gridUv = (p + vec2(0.0, scrollShift * 0.2)) * 9.5;
    vec2 gridCell = abs(fract(gridUv - 0.5) - 0.5);
    float gridLine = 1.0 - smoothstep(0.0, 0.028, min(gridCell.x, gridCell.y));
    float nodeDot = 1.0 - smoothstep(0.04, 0.095, length(fract(gridUv + 0.5) - 0.5));

    // Expanding click signal wave
    float distClick = length(p - click);
    float waveAge = max(u_clickTime, 0.0);
    float waveRadius = waveAge * 0.75;
    float waveRing = exp(-abs(distClick - waveRadius) * 20.0) * exp(-waveAge * 1.35) * step(0.001, waveAge);

    // Palette tokens matching global.css (#101310, #1B241C, #B8E986)
    vec3 colBg = vec3(0.0627, 0.0745, 0.0627);
    vec3 colSurface = vec3(0.115, 0.160, 0.120);
    vec3 colMuted = vec3(0.32, 0.38, 0.30);
    vec3 colAccent = vec3(0.7216, 0.9137, 0.5255);

    vec3 color = mix(colBg, colSurface, smoothstep(0.22, 0.85, field) * 0.85);
    color = mix(color, colMuted, gridLine * 0.22);
    color = mix(color, colAccent, nodeDot * (0.12 + mouseField * 0.45));

    float contourStrength = 0.22 + mouseField * 0.38 + waveRing * 0.55;
    color = mix(color, colAccent, contour * contourStrength);
    color += colAccent * mouseField * 0.11;
    color += colAccent * waveRing * 0.38;

    // Gentle edge vignette while keeping right/center lattice crisp
    float edgeDist = length((uv - vec2(0.58, 0.48)) * vec2(1.05, 1.05));
    float vignette = smoothstep(0.92, 0.18, edgeDist);
    color = mix(colBg, color, 0.42 + 0.58 * vignette);

    gl_FragColor = vec4(color, 1.0);
}
