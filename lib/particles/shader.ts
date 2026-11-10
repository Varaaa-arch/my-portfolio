export const particleVertexShader = `
attribute vec3 aPortrait;
attribute vec3 aGlobe;
attribute vec3 aIndonesia;
attribute vec3 aWave;
attribute vec3 aScatter;
attribute float aLuma;
attribute float aPhase;

uniform float uTime;
uniform float uIntro;
uniform float uMorph1;
uniform float uMorph2;
uniform float uWorkMix;
uniform float uWorkSlide;
uniform float uTurbulence;
uniform float uScale;
uniform float uSize;
uniform float uPixelRatio;
uniform float uPortraitFade;
uniform vec2 uPointer;
uniform vec2 uLight;
uniform float uAspect;
uniform float uLightRadius;
uniform float uLightStrength;

varying float vLuma;
varying float vAlpha;

float easeInOut(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float intro = easeInOut(clamp(uIntro, 0.0, 1.0));
  float m1 = easeInOut(clamp(uMorph1, 0.0, 1.0));
  float m2 = easeInOut(clamp(uMorph2, 0.0, 1.0));
  float work = easeInOut(clamp(uWorkMix, 0.0, 1.0));

  vec3 wave = aWave + vec3(uWorkSlide, 0.0, 0.0);
  vec3 pos = mix(aPortrait, aGlobe, m1);
  pos = mix(pos, aIndonesia, m2);
  pos = mix(pos, wave, work);
  pos = mix(aScatter, pos, intro);

  float nonPortrait = clamp(max(max(m1, m2), work), 0.0, 1.0);
  float luma = mix(aLuma, 0.62 + aLuma * 0.38, nonPortrait);

  float t = uTime + aPhase * 6.2831853;
  pos += vec3(sin(t * 0.9), cos(t * 0.8), sin(t * 0.6)) *
    (0.004 + uTurbulence * 0.085);
  pos.x += uPointer.x * 0.025 * (0.3 + aPhase);
  pos.y -= uPointer.y * 0.018 * (0.3 + aPhase);

  float bottomMask = smoothstep(-1.02, -0.42, pos.y);
  float portraitWeight = (1.0 - m1) * (1.0 - work);
  float bottomFade = mix(
    1.0,
    mix(0.08, 1.0, bottomMask),
    portraitWeight * uPortraitFade
  );

  vec4 mvPosition = modelViewMatrix * vec4(pos * uScale, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
  vec2 lightDelta = (ndc - uLight) * vec2(uAspect, 1.0);
  float lightDistance = length(lightDelta);
  float light = smoothstep(uLightRadius, 0.0, lightDistance);
  light = pow(light, 1.35) * uLightStrength;

  luma = clamp(luma + light * 0.55, 0.0, 1.3);

  gl_PointSize = uSize * uPixelRatio * (0.65 + luma * 0.7) *
    (1.0 + light * 0.3) * (2.8 / max(-mvPosition.z, 0.1));

  vLuma = luma;
  vAlpha = (0.12 + 0.88 * min(luma, 1.0)) *
    bottomFade * (1.0 + light * 0.55);
}
`;

export const particleFragmentShader = `
uniform vec3 uColor;
uniform float uExposure;
uniform float uGlow;

varying float vLuma;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  if (dist > 0.5) {
    discard;
  }

  float core = smoothstep(0.5, 0.08, dist);
  float halo = smoothstep(0.5, 0.0, dist) * 0.28;
  float alpha = (core + halo) * vAlpha;
  vec3 color = uColor * (0.55 + vLuma * uExposure) * (1.0 + uGlow * core);

  gl_FragColor = vec4(color, alpha);
}
`;
