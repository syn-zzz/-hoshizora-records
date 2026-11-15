/* hero-rings.js — 波打つ溝ヒーロー（WebGL LINES）
   依存: なし（ライブラリ不使用）
   対応要素: id="hero" のセクション、id="c" のキャンバス
   data-ink="sumi" でキャンバス要素に設定するとインクを墨色に切り替え */
(function () {
  var hero = document.getElementById('hero');
  var c    = document.getElementById('c');
  if (!hero || !c) return;

  var fb     = hero.querySelector('.hr-hero-j__fallback');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ink    = c.dataset.ink === 'sumi' ? [0.165, 0.149, 0.133] : [0, 0, 0];

  var RINGS = 72, SEG = 360;
  var cx = 0, cy = 0, R = 0;

  function layout() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (w >= 960) {
      cx = w * 0.73; cy = h * 0.50; R = Math.min(h * 0.44, w * 0.27);
    } else {
      cx = w * 0.58; cy = h * 0.47; R = Math.min(w * 0.66, h * 0.40);
    }
    if (fb) {
      fb.style.setProperty('--cx', cx + 'px');
      fb.style.setProperty('--cy', cy + 'px');
      fb.style.setProperty('--r',  R  + 'px');
    }
  }
  layout();
  addEventListener('resize', layout, { passive: true });

  var VS = [
    'attribute vec2 a;',
    'uniform vec2 uRes,uC,uM;',
    'uniform float uR,uT,uE;',
    'varying float vA;',
    'float h(float n){return fract(sin(n)*43758.5453);}',
    'float pn(float x,float per){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
    '  return mix(h(mod(i,per)),h(mod(i+1.,per)),f);}',
    'void main(){',
    '  float th=a.x*6.2831853, k=a.y;',
    '  vec2 dir=vec2(cos(th),sin(th));',
    '  float base=mix(.44,1.,k);',
    '  float env=pow(pn(a.x*4.+k*.25+uT*.015,4.),3.)*1.8;',
    '  float n1=pn(a.x*36.+k*1.2+uT*.06,36.)-.5;',
    '  float n2=pn(a.x*110.+k*2.5-uT*.04,110.)-.5;',
    '  float sp=pow(pn(a.x*70.+k*.8,70.),5.);',
    '  float amp=(.004+.16*env)*(.2+k*1.1);',
    '  vec2 p0=uC+dir*base*uR;',
    '  float d=distance(p0,uM)/uR;',
    '  float near=exp(-d*d*6.);',
    '  amp*=1.+uE*4.*near;',
    '  float r=base+amp*(n1+n2*.4+sp*1.4)+uE*near*.06*sin(d*34.-uT*9.);',
    '  vec2 p=uC+dir*r*uR;',
    '  vec2 ndc=p/uRes*2.-1.;',
    '  gl_Position=vec4(ndc.x,-ndc.y,0.,1.);',
    '  vA=(.10+.6*pow(h(floor(k*72.)*13.1),2.))*(.6+.4*k);',
    '}'
  ].join('\n');
  var FS = 'precision mediump float;uniform vec3 uInk;varying float vA;void main(){gl_FragColor=vec4(uInk,vA);}';

  var gl = c.getContext('webgl', { antialias: true, premultipliedAlpha: false, alpha: true });
  if (!gl) return;

  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);

  var verts = new Float32Array(RINGS * SEG * 4), off = 0;
  for (var ri = 0; ri < RINGS; ri++) {
    var kv = ri / (RINGS - 1);
    for (var si = 0; si < SEG; si++) {
      verts[off++] = si / SEG; verts[off++] = kv;
      verts[off++] = (si + 1) / SEG; verts[off++] = kv;
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  var aloc = gl.getAttribLocation(pr, 'a');
  gl.enableVertexAttribArray(aloc);
  gl.vertexAttribPointer(aloc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var U = {};
  ['uRes', 'uC', 'uM', 'uR', 'uT', 'uE', 'uInk'].forEach(function (n) {
    U[n] = gl.getUniformLocation(pr, n);
  });

  var dpr = 1, mobile = false;
  function size() {
    mobile = innerWidth < 600;
    dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
    c.width  = hero.clientWidth  * dpr | 0;
    c.height = hero.clientHeight * dpr | 0;
    gl.viewport(0, 0, c.width, c.height);
  }
  size();
  addEventListener('resize', size, { passive: true });

  var mx = -9999, my = -9999, tx = -9999, ty = -9999, energy = 0, lastX = null, lastY = null;
  function move(x, y) {
    var b = hero.getBoundingClientRect();
    tx = x - b.left; ty = y - b.top;
    if (lastX !== null) energy = Math.min(1, energy + Math.hypot(tx - lastX, ty - lastY) / 160);
    lastX = tx; lastY = ty;
    if (mx < -9000) { mx = tx; my = ty; }
  }
  hero.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); }, { passive: true });
  hero.addEventListener('pointerleave', function () { lastX = lastY = null; }, { passive: true });

  var running = true, raf = 0, t0 = performance.now(), last = 0;
  var interval = mobile ? 1000 / 30 : 0;

  function draw(now) {
    raf = requestAnimationFrame(draw);
    if (interval && now - last < interval) return;
    last = now;
    mx += (tx - mx) * 0.12; my += (ty - my) * 0.12;
    energy *= 0.965;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uRes, c.width, c.height);
    gl.uniform2f(U.uC,   cx * dpr, cy * dpr);
    gl.uniform2f(U.uM,   mx * dpr, my * dpr);
    gl.uniform1f(U.uR,   R * dpr);
    gl.uniform1f(U.uT,   reduce ? 0 : (now - t0) / 1000);
    gl.uniform1f(U.uE,   reduce ? 0 : energy);
    gl.uniform3f(U.uInk, ink[0], ink[1], ink[2]);
    gl.drawArrays(gl.LINES, 0, RINGS * SEG * 2);
    if (reduce) cancelAnimationFrame(raf);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
  function stop()  { running = false; cancelAnimationFrame(raf); }

  function begin() {
    hero.classList.add('is-gl');
    running = false; start();
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }, { threshold: 0.05 }).observe(hero);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  }

  if (document.readyState === 'complete') begin(); else addEventListener('load', begin);
}());
