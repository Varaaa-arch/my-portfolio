self.onmessage = () => {
  let result = "animated";

  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(1, 1);
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = debugInfo
          ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
          : "";

        gl.getExtension("WEBGL_lose_context")?.loseContext();

        if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
          result = "static";
        }
      }
    }
  } catch {
    result = "animated";
  }

  self.postMessage(result);
  self.close();
};
