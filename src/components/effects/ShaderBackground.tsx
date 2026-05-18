import { useEffect, useMemo, useRef } from "react";
import { clsx } from "clsx";

type Props = {
  className?: string;
  paused?: boolean;
  opacity?: number;
};

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || !("matchMedia" in window)) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown link error";
    gl.deleteProgram(program);
    throw new Error(info);
  }
  return program;
}

export function ShaderBackground({ className, paused, opacity = 0.35 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);

  useEffect(() => {
    if (paused) return;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance"
    });
    if (!gl) return;

    const vertex = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    // Shader em estilo "shader playground" (iTime/iResolution), fácil de trocar por um fragment do shaders.com.
    const fragment = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 iResolution;
      uniform float iTime;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      vec3 film(vec2 uv, float t) {
        vec2 p = uv * vec2(iResolution.x / iResolution.y, 1.0);
        float n = noise(p * 2.2 + t * 0.08);
        float g = noise(p * 8.0 - t * 0.25);

        // "Luz" suave com pulsação, puxando pro vermelho da marca
        float sweep = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(t * 0.35 + p.x * 1.6 - p.y * 0.9));
        float bloom = pow(sweep, 2.2) * 0.75;
        vec3 base = vec3(0.02, 0.02, 0.03);
        vec3 red = vec3(1.00, 0.27, 0.33);
        vec3 white = vec3(0.85);

        vec3 col = base;
        col += red * bloom * (0.25 + 0.75 * n);
        col += white * (0.06 * g);

        // vinheta + grão
        float vig = smoothstep(1.05, 0.15, length(uv - 0.5));
        float grain = (hash21(uv * iResolution.xy + t * 60.0) - 0.5) * 0.08;
        col *= (0.70 + 0.30 * vig);
        col += grain;

        return col;
      }

      void main() {
        vec2 uv = vUv;
        float t = iTime;
        vec3 col = film(uv, t);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    let program: WebGLProgram | null = null;
    let raf = 0;
    let start = performance.now();
    let destroyed = false;

    const resize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    try {
      program = createProgram(gl, vertex, fragment);
    } catch {
      return;
    }

    gl.useProgram(program);

    const aPos = gl.getAttribLocation(program, "aPos");
    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Fullscreen triangle strip
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement ?? canvas);

    const frame = (now: number) => {
      if (destroyed) return;
      resize();
      const t = (now - start) / 1000;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        start = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      destroyed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, [paused, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    />
  );
}
