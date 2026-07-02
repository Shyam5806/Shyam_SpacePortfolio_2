// lib/shaders.ts — GLSL shaders for the space environment

// ── Nebula Background (animated FBM noise) ────
export const NEBULA_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const NEBULA_FRAG = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float t = uTime * 0.04;

    vec2 q = vec2(fbm(uv + t * 0.3), fbm(uv + vec2(1.7, 9.2)));
    vec2 r = vec2(fbm(uv + 2.0 * q + vec2(1.7, 9.2) + t * 0.15),
                  fbm(uv + 2.0 * q + vec2(8.3, 2.8)));
    float n = fbm(uv + 2.8 * r + t * 0.05);

    vec3 deepBlack  = vec3(0.02, 0.01, 0.05);
    vec3 deepPurple = vec3(0.12, 0.02, 0.28);
    vec3 navyBlue   = vec3(0.0,  0.05, 0.38);
    vec3 teal       = vec3(0.0,  0.22, 0.42);
    vec3 hotPink    = vec3(0.28, 0.0,  0.18);

    vec3 col = deepBlack;
    col = mix(col, deepPurple, smoothstep(0.15, 0.45, n));
    col = mix(col, navyBlue,   smoothstep(0.35, 0.60, n));
    col = mix(col, teal,       smoothstep(0.55, 0.75, n));
    col = mix(col, hotPink,    smoothstep(0.70, 0.85, n) * 0.5);

    float alpha = smoothstep(0.08, 0.5, n) * 0.45;
    gl_FragColor = vec4(col, alpha);
  }
`

// ── Planet Atmosphere (Fresnel glow) ──────────
export const ATMO_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

export const ATMO_FRAG = `
  uniform vec3  uColor;
  uniform float uIntensity;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  void main() {
    float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    rim = pow(rim, 2.5);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`

// ── Holographic scan material ─────────────────
export const HOLO_VERT = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv    = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const HOLO_FRAG = `
  uniform float uTime;
  uniform vec3  uColor;
  varying vec2  vUv;
  varying vec3  vNormal;

  void main() {
    float scan = sin(vUv.y * 60.0 - uTime * 4.0) * 0.5 + 0.5;
    float rim  = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    rim = pow(rim, 1.5);

    float flicker = 0.88 + 0.12 * sin(uTime * 17.3);
    float alpha   = (rim * 0.6 + scan * 0.15) * flicker;

    gl_FragColor = vec4(uColor, alpha);
  }
`

// ── Star twinkle (vertex displacement) ────────
export const STAR_VERT = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  void main() {
    float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + aPhase * 6.28);
    gl_PointSize = aSize * twinkle;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const STAR_FRAG = `
  void main() {
    vec2  coord = gl_PointCoord - 0.5;
    float d     = length(coord);
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`

// ── Dust particle ─────────────────────────────
export const DUST_VERT = `
  attribute float aOpacity;
  uniform float uTime;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity * (0.5 + 0.5 * sin(uTime * 0.8 + aOpacity * 10.0));
    gl_PointSize = 1.5;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const DUST_FRAG = `
  uniform vec3 uColor;
  varying float vOpacity;
  void main() {
    vec2  c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    gl_FragColor = vec4(uColor, vOpacity * 0.4);
  }
`
