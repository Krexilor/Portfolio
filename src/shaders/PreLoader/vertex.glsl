varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vLocalPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vLocalPosition = position;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
