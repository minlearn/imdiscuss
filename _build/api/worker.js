var Ug = Object.defineProperty;
var El = (t) => {
  throw TypeError(t);
};
var Fg = (t, e, s) => e in t ? Ug(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var p = (t, e, s) => Fg(t, typeof e != "symbol" ? e + "" : e, s), _o = (t, e, s) => e.has(t) || El("Cannot " + s);
var A = (t, e, s) => (_o(t, e, "read from private field"), s ? s.call(t) : e.get(t)), re = (t, e, s) => e.has(t) ? El("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), Z = (t, e, s, n) => (_o(t, e, "write to private field"), n ? n.call(t, s) : e.set(t, s), s), pe = (t, e, s) => (_o(t, e, "access private method"), s);
var Al = (t, e, s, n) => ({
  set _(r) {
    Z(t, e, r, s);
  },
  get _() {
    return A(t, e, n);
  }
});
import { DurableObject as $g } from "cloudflare:workers";
var xl = (t, e, s) => (n, r) => {
  let a = -1;
  return i(0);
  async function i(o) {
    if (o <= a)
      throw new Error("next() called multiple times");
    a = o;
    let c, d = !1, l;
    if (t[o] ? (l = t[o][0][0], n.req.routeIndex = o) : l = o === t.length && r || void 0, l)
      try {
        c = await l(n, () => i(o + 1));
      } catch (u) {
        if (u instanceof Error && e)
          n.error = u, c = await e(u, n), d = !0;
        else
          throw u;
      }
    else
      n.finalized === !1 && s && (c = await s(n));
    return c && (n.finalized === !1 || d) && (n.res = c), n;
  }
}, Lg = /* @__PURE__ */ Symbol(), Hg = (t, e) => new Response(t, {
  headers: {
    // Normalize the media type (case-insensitive) while keeping parameters like the boundary
    "Content-Type": e.replace(/^[^;]+/, (n) => n.toLowerCase())
  }
}).formData(), _i = (t) => "headers" in t, jg = async (t, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: s = !1, dot: n = !1 } = e, a = (_i(t) ? t.headers : t.raw.headers).get("Content-Type"), i = a == null ? void 0 : a.split(";")[0].trim().toLowerCase();
  return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? qg(t, { all: s, dot: n }) : {};
};
async function qg(t, e) {
  if (!_i(t) && t.bodyCache.formData)
    return Cl(
      await t.bodyCache.formData,
      e
    );
  const s = _i(t) ? t.headers : t.raw.headers, n = await t.arrayBuffer(), r = Hg(n, s.get("Content-Type") || "");
  _i(t) || (t.bodyCache.formData = r);
  const a = await r;
  return a ? Cl(a, e) : {};
}
function Cl(t, e) {
  const s = /* @__PURE__ */ Object.create(null);
  return t.forEach((n, r) => {
    e.all || r.endsWith("[]") ? zg(s, r, n) : s[r] = n;
  }), e.dot && Object.entries(s).forEach(([n, r]) => {
    n.includes(".") && (Kg(s, n, r), delete s[n]);
  }), s;
}
var zg = (t, e, s) => {
  t[e] !== void 0 ? Array.isArray(t[e]) ? t[e].push(s) : t[e] = [t[e], s] : e.endsWith("[]") ? t[e] = [s] : t[e] = s;
}, Kg = (t, e, s) => {
  if (/(?:^|\.)__proto__\./.test(e))
    return;
  let n = t;
  const r = e.split(".");
  r.forEach((a, i) => {
    i === r.length - 1 ? n[a] = s : ((!n[a] || typeof n[a] != "object" || Array.isArray(n[a]) || n[a] instanceof File) && (n[a] = /* @__PURE__ */ Object.create(null)), n = n[a]);
  });
}, zf = (t) => {
  const e = t.split("/");
  return e[0] === "" && e.shift(), e;
}, Wg = (t) => {
  const { groups: e, path: s } = Vg(t), n = zf(s);
  return Gg(n, e);
}, Vg = (t) => {
  const e = [];
  return t = t.replace(/\{[^}]+\}/g, (s, n) => {
    const r = `@${n}`;
    return e.push([r, s]), r;
  }), { groups: e, path: t };
}, Gg = (t, e) => {
  for (let s = e.length - 1; s >= 0; s--) {
    const [n] = e[s];
    for (let r = t.length - 1; r >= 0; r--)
      if (t[r].includes(n)) {
        t[r] = t[r].replace(n, e[s][1]);
        break;
      }
  }
  return t;
}, Xa = {}, Jg = (t, e) => {
  if (t === "*")
    return "*";
  const s = t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (s) {
    const n = `${t}#${e}`;
    return Xa[n] || (s[2] ? Xa[n] = e && e[0] !== ":" && e[0] !== "*" ? [n, s[1], new RegExp(`^${s[2]}(?=/${e})`)] : [t, s[1], new RegExp(`^${s[2]}$`)] : Xa[n] = [t, s[1], !0]), Xa[n];
  }
  return null;
}, md = (t, e) => {
  try {
    return e(t);
  } catch {
    return t.replace(/(?:%[0-9A-Fa-f]{2})+/g, (s) => {
      try {
        return e(s);
      } catch {
        return s;
      }
    });
  }
}, Zg = (t) => md(t, decodeURI), Kf = (t) => {
  const e = t.url, s = e.indexOf("/", e.indexOf(":") + 4);
  let n = s;
  for (; n < e.length; n++) {
    const r = e.charCodeAt(n);
    if (r === 37) {
      const a = e.indexOf("?", n), i = e.indexOf("#", n), o = a === -1 ? i === -1 ? void 0 : i : i === -1 ? a : Math.min(a, i), c = e.slice(s, o);
      return Zg(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (r === 63 || r === 35)
      break;
  }
  return e.slice(s, n);
}, Yg = (t) => {
  const e = Kf(t);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, vn = (t, e, ...s) => (s.length && (e = vn(e, ...s)), `${(t == null ? void 0 : t[0]) === "/" ? "" : "/"}${t}${e === "/" ? "" : `${(t == null ? void 0 : t.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), Wf = (t) => {
  if (t.charCodeAt(t.length - 1) !== 63 || !t.includes(":"))
    return null;
  const e = t.split("/"), s = [];
  let n = "";
  return e.forEach((r) => {
    if (r !== "" && !/\:/.test(r))
      n += "/" + r;
    else if (/\:/.test(r))
      if (/\?/.test(r)) {
        s.length === 0 && n === "" ? s.push("/") : s.push(n);
        const a = r.replace("?", "");
        n += "/" + a, s.push(n);
      } else
        n += "/" + r;
  }), s.filter((r, a, i) => i.indexOf(r) === a);
}, vo = (t) => /[%+]/.test(t) ? (t.indexOf("+") !== -1 && (t = t.replace(/\+/g, " ")), t.indexOf("%") !== -1 ? md(t, Gf) : t) : t, Vf = (t, e, s) => {
  let n;
  if (!s && e && !/[%+]/.test(e)) {
    let i = t.indexOf("?", 8);
    if (i === -1)
      return;
    for (t.startsWith(e, i + 1) || (i = t.indexOf(`&${e}`, i + 1)); i !== -1; ) {
      const o = t.charCodeAt(i + e.length + 1);
      if (o === 61) {
        const c = i + e.length + 2, d = t.indexOf("&", c);
        return vo(t.slice(c, d === -1 ? void 0 : d));
      } else if (o == 38 || isNaN(o))
        return "";
      i = t.indexOf(`&${e}`, i + 1);
    }
    if (n = /[%+]/.test(t), !n)
      return;
  }
  const r = {};
  n ?? (n = /[%+]/.test(t));
  let a = t.indexOf("?", 8);
  for (; a !== -1; ) {
    const i = t.indexOf("&", a + 1);
    let o = t.indexOf("=", a);
    o > i && i !== -1 && (o = -1);
    let c = t.slice(
      a + 1,
      o === -1 ? i === -1 ? void 0 : i : o
    );
    if (n && (c = vo(c)), a = i, c === "")
      continue;
    let d;
    o === -1 ? d = "" : (d = t.slice(o + 1, i === -1 ? void 0 : i), n && (d = vo(d))), s ? (r[c] && Array.isArray(r[c]) || (r[c] = []), r[c].push(d)) : r[c] ?? (r[c] = d);
  }
  return e ? r[e] : r;
}, Xg = Vf, Qg = (t, e) => Vf(t, e, !0), Gf = decodeURIComponent, Il = (t) => md(t, Gf), _r, Ut, Ps, Jf, Zf, $c, Is, Uf, ey = (Uf = class {
  constructor(t, e = "/", s = [[]]) {
    re(this, Ps);
    /**
     * `.raw` can get the raw Request object.
     *
     * @see {@link https://hono.dev/docs/api/request#raw}
     *
     * @example
     * ```ts
     * // For Cloudflare Workers
     * app.post('/', async (c) => {
     *   const metadata = c.req.raw.cf?.hostMetadata?
     *   ...
     * })
     * ```
     */
    p(this, "raw");
    re(this, _r);
    // Short name of validatedData
    re(this, Ut);
    p(this, "routeIndex", 0);
    /**
     * `.path` can get the pathname of the request.
     *
     * @see {@link https://hono.dev/docs/api/request#path}
     *
     * @example
     * ```ts
     * app.get('/about/me', (c) => {
     *   const pathname = c.req.path // `/about/me`
     * })
     * ```
     */
    p(this, "path");
    p(this, "bodyCache", {});
    re(this, Is, (t) => {
      const { bodyCache: e, raw: s } = this, n = e[t];
      if (n)
        return n;
      const r = Object.keys(e)[0];
      return r ? e[r].then((a) => (r === "json" && (a = JSON.stringify(a)), new Response(a)[t]())) : e[t] = s[t]();
    });
    this.raw = t, this.path = e, Z(this, Ut, s), Z(this, _r, {});
  }
  param(t) {
    return t ? pe(this, Ps, Jf).call(this, t) : pe(this, Ps, Zf).call(this);
  }
  query(t) {
    return Xg(this.url, t);
  }
  queries(t) {
    return Qg(this.url, t);
  }
  header(t) {
    if (t)
      return this.raw.headers.get(t) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((s, n) => {
      e[n] = s;
    }), e;
  }
  async parseBody(t) {
    return jg(this, t);
  }
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return A(this, Is).call(this, "text").then((t) => JSON.parse(t));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return A(this, Is).call(this, "text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return A(this, Is).call(this, "arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return A(this, Is).call(this, "arrayBuffer").then((t) => new Uint8Array(t));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return A(this, Is).call(this, "blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return A(this, Is).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(t, e) {
    A(this, _r)[t] = e;
  }
  valid(t) {
    return A(this, _r)[t];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [Lg]() {
    return A(this, Ut);
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return A(this, Ut)[0].map(([[, t]]) => t);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return A(this, Ut)[0].map(([[, t]]) => t)[this.routeIndex].path;
  }
}, _r = new WeakMap(), Ut = new WeakMap(), Ps = new WeakSet(), Jf = function(t) {
  const e = A(this, Ut)[0][this.routeIndex][1][t], s = pe(this, Ps, $c).call(this, e);
  return s && /\%/.test(s) ? Il(s) : s;
}, Zf = function() {
  const t = {}, e = Object.keys(A(this, Ut)[0][this.routeIndex][1]);
  for (const s of e) {
    const n = pe(this, Ps, $c).call(this, A(this, Ut)[0][this.routeIndex][1][s]);
    n !== void 0 && (t[s] = /\%/.test(n) ? Il(n) : n);
  }
  return t;
}, $c = function(t) {
  return A(this, Ut)[1] ? A(this, Ut)[1][t] : t;
}, Is = new WeakMap(), Uf), ty = {
  Stringify: 1
}, Yf = async (t, e, s, n, r) => {
  typeof t == "object" && !(t instanceof String) && (t instanceof Promise || (t = t.toString()), t instanceof Promise && (t = await t));
  const a = t.callbacks;
  return a != null && a.length ? (r ? r[0] += t : r = [t], Promise.all(a.map((o) => o({ phase: e, buffer: r, context: n }))).then(
    (o) => Promise.all(
      o.filter(Boolean).map((c) => Yf(c, e, !1, n, r))
    ).then(() => r[0])
  )) : Promise.resolve(t);
}, sy = "text/plain; charset=UTF-8", bo = (t, e) => ({
  "Content-Type": t,
  ...e
}), Vr = (t, e) => new Response(t, e), Ea, Aa, Ts, vr, ks, lt, xa, br, Sr, Cn, Ca, Ia, Ys, ur, Ff, ny = (Ff = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(t, e) {
    re(this, Ys);
    re(this, Ea);
    re(this, Aa);
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/docs/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    p(this, "env", {});
    re(this, Ts);
    p(this, "finalized", !1);
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/docs/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    p(this, "error");
    re(this, vr);
    re(this, ks);
    re(this, lt);
    re(this, xa);
    re(this, br);
    re(this, Sr);
    re(this, Cn);
    re(this, Ca);
    re(this, Ia);
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    p(this, "render", (...t) => (A(this, br) ?? Z(this, br, (e) => this.html(e)), A(this, br).call(this, ...t)));
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    p(this, "setLayout", (t) => Z(this, xa, t));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    p(this, "getLayout", () => A(this, xa));
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    p(this, "setRenderer", (t) => {
      Z(this, br, t);
    });
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/docs/api/context#header}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    p(this, "header", (t, e, s) => {
      this.finalized && Z(this, lt, Vr(A(this, lt).body, A(this, lt)));
      const n = A(this, lt) ? A(this, lt).headers : A(this, Cn) ?? Z(this, Cn, new Headers());
      e === void 0 ? n.delete(t) : s != null && s.append ? n.append(t, e) : n.set(t, e);
    });
    p(this, "status", (t) => {
      Z(this, vr, t);
    });
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is hot!!')
     *   await next()
     * })
     * ```
     */
    p(this, "set", (t, e) => {
      A(this, Ts) ?? Z(this, Ts, /* @__PURE__ */ new Map()), A(this, Ts).set(t, e);
    });
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/docs/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    p(this, "get", (t) => A(this, Ts) ? A(this, Ts).get(t) : void 0);
    p(this, "newResponse", (...t) => pe(this, Ys, ur).call(this, ...t));
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/docs/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    p(this, "body", (t, e, s) => pe(this, Ys, ur).call(this, t, e, s));
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/docs/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    p(this, "text", (t, e, s) => !A(this, Cn) && !A(this, vr) && !e && !s && !this.finalized ? new Response(t) : pe(this, Ys, ur).call(this, t, e, bo(sy, s)));
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/docs/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    p(this, "json", (t, e, s) => pe(this, Ys, ur).call(this, JSON.stringify(t), e, bo("application/json", s)));
    p(this, "html", (t, e, s) => {
      const n = (r) => pe(this, Ys, ur).call(this, r, e, bo("text/html; charset=UTF-8", s));
      return typeof t == "object" ? Yf(t, ty.Stringify, !1, {}).then(n) : n(t);
    });
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/docs/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    p(this, "redirect", (t, e) => {
      const s = String(t);
      return this.header(
        "Location",
        // Multibyes should be encoded
        // eslint-disable-next-line no-control-regex
        /[^\x00-\xFF]/.test(s) ? encodeURI(s) : s
      ), this.newResponse(null, e ?? 302);
    });
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    p(this, "notFound", () => (A(this, Sr) ?? Z(this, Sr, () => Vr()), A(this, Sr).call(this, this)));
    Z(this, Ea, t), e && (Z(this, ks, e.executionCtx), this.env = e.env, Z(this, Sr, e.notFoundHandler), Z(this, Ia, e.path), Z(this, Ca, e.matchResult));
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return A(this, Aa) ?? Z(this, Aa, new ey(A(this, Ea), A(this, Ia), A(this, Ca))), A(this, Aa);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (A(this, ks) && "respondWith" in A(this, ks))
      return A(this, ks);
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (A(this, ks))
      return A(this, ks);
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return A(this, lt) || Z(this, lt, Vr(null, {
      headers: A(this, Cn) ?? Z(this, Cn, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(t) {
    if (A(this, lt) && t) {
      t = Vr(t.body, t);
      for (const [e, s] of A(this, lt).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const n = A(this, lt).headers.getSetCookie();
            t.headers.delete("set-cookie");
            for (const r of n)
              t.headers.append("set-cookie", r);
          } else
            t.headers.set(e, s);
    }
    Z(this, lt, t), this.finalized = !0;
  }
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    return A(this, Ts) ? Object.fromEntries(A(this, Ts)) : {};
  }
}, Ea = new WeakMap(), Aa = new WeakMap(), Ts = new WeakMap(), vr = new WeakMap(), ks = new WeakMap(), lt = new WeakMap(), xa = new WeakMap(), br = new WeakMap(), Sr = new WeakMap(), Cn = new WeakMap(), Ca = new WeakMap(), Ia = new WeakMap(), Ys = new WeakSet(), ur = function(t, e, s) {
  const n = A(this, lt) ? new Headers(A(this, lt).headers) : A(this, Cn) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const a = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [i, o] of a)
      i.toLowerCase() === "set-cookie" ? n.append(i, o) : n.set(i, o);
  }
  if (s)
    for (const [a, i] of Object.entries(s))
      if (typeof i == "string")
        n.set(a, i);
      else {
        n.delete(a);
        for (const o of i)
          n.append(a, o);
      }
  const r = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? A(this, vr);
  return Vr(t, { status: r, headers: n });
}, Ff), qe = "ALL", ry = "all", ay = ["get", "post", "put", "delete", "options", "patch"], Xf = "Can not add a route since the matcher is already built.", Qf = class extends Error {
}, iy = "__COMPOSED_HANDLER", oy = (t) => t.text("404 Not Found", 404), Tl = (t, e) => {
  if ("getResponse" in t) {
    const s = t.getResponse();
    return e.newResponse(s.body, s);
  }
  return console.error(t), e.text("Internal Server Error", 500);
}, Xt, ze, ep, Qt, bn, vi, bi, Er, cy = (Er = class {
  constructor(e = {}) {
    re(this, ze);
    p(this, "get");
    p(this, "post");
    p(this, "put");
    p(this, "delete");
    p(this, "options");
    p(this, "patch");
    p(this, "all");
    p(this, "on");
    p(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    p(this, "router");
    p(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    p(this, "_basePath", "/");
    re(this, Xt, "/");
    p(this, "routes", []);
    re(this, Qt, oy);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    p(this, "errorHandler", Tl);
    /**
     * `.onError()` handles an error and returns a customized Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#error-handling}
     *
     * @param {ErrorHandler} handler - request Handler for error
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.onError((err, c) => {
     *   console.error(`${err}`)
     *   return c.text('Custom Error Message', 500)
     * })
     * ```
     */
    p(this, "onError", (e) => (this.errorHandler = e, this));
    /**
     * `.notFound()` allows you to customize a Not Found Response.
     *
     * @see {@link https://hono.dev/docs/api/hono#not-found}
     *
     * @param {NotFoundHandler} handler - request handler for not-found
     * @returns {Hono} changed Hono instance
     *
     * @example
     * ```ts
     * app.notFound((c) => {
     *   return c.text('Custom 404 Message', 404)
     * })
     * ```
     */
    p(this, "notFound", (e) => (Z(this, Qt, e), this));
    /**
     * `.fetch()` will be entry point of your app.
     *
     * @see {@link https://hono.dev/docs/api/hono#fetch}
     *
     * @param {Request} request - request Object of request
     * @param {Env} Env - env Object
     * @param {ExecutionContext} - context of execution
     * @returns {Response | Promise<Response>} response of request
     *
     */
    p(this, "fetch", (e, ...s) => pe(this, ze, bi).call(this, e, s[1], s[0], e.method));
    /**
     * `.request()` is a useful method for testing.
     * You can pass a URL or pathname to send a GET request.
     * app will return a Response object.
     * ```ts
     * test('GET /hello is ok', async () => {
     *   const res = await app.request('/hello')
     *   expect(res.status).toBe(200)
     * })
     * ```
     * @see https://hono.dev/docs/api/hono#request
     */
    p(this, "request", (e, s, n, r) => e instanceof Request ? this.fetch(s ? new Request(e, s) : e, n, r) : (e = e.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(e) ? e : `http://localhost${vn("/", e)}`,
        s
      ),
      n,
      r
    )));
    /**
     * `.fire()` automatically adds a global fetch event listener.
     * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
     * @deprecated
     * Use `fire` from `hono/service-worker` instead.
     * ```ts
     * import { Hono } from 'hono'
     * import { fire } from 'hono/service-worker'
     *
     * const app = new Hono()
     * // ...
     * fire(app)
     * ```
     * @see https://hono.dev/docs/api/hono#fire
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
     * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
     */
    p(this, "fire", () => {
      addEventListener("fetch", (e) => {
        e.respondWith(pe(this, ze, bi).call(this, e.request, e, void 0, e.request.method));
      });
    });
    [...ay, ry].forEach((a) => {
      this[a] = (i, ...o) => (typeof i == "string" ? Z(this, Xt, i) : pe(this, ze, bn).call(this, a, A(this, Xt), i), o.forEach((c) => {
        pe(this, ze, bn).call(this, a, A(this, Xt), c);
      }), this);
    }), this.on = (a, i, ...o) => {
      for (const c of [i].flat()) {
        Z(this, Xt, c);
        for (const d of [a].flat())
          o.map((l) => {
            pe(this, ze, bn).call(this, d.toUpperCase(), A(this, Xt), l);
          });
      }
      return this;
    }, this.use = (a, ...i) => (typeof a == "string" ? Z(this, Xt, a) : (Z(this, Xt, "*"), i.unshift(a)), i.forEach((o) => {
      pe(this, ze, bn).call(this, qe, A(this, Xt), o);
    }), this);
    const { strict: n, ...r } = e;
    Object.assign(this, r), this.getPath = n ?? !0 ? e.getPath ?? Kf : Yg;
  }
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(e, s) {
    const n = this.basePath(e);
    return s.routes.map((r) => {
      var i;
      let a;
      s.errorHandler === Tl ? a = r.handler : (a = async (o, c) => (await xl([], s.errorHandler)(o, () => r.handler(o, c))).res, a[iy] = r.handler), pe(i = n, ze, bn).call(i, r.method, r.path, a, r.basePath);
    }), this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(e) {
    const s = pe(this, ze, ep).call(this);
    return s._basePath = vn(this._basePath, e), s;
  }
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(e, s, n) {
    let r, a;
    n && (typeof n == "function" ? a = n : (a = n.optionHandler, n.replaceRequest === !1 ? r = (c) => c : r = n.replaceRequest));
    const i = a ? (c) => {
      const d = a(c);
      return Array.isArray(d) ? d : [d];
    } : (c) => {
      let d;
      try {
        d = c.executionCtx;
      } catch {
      }
      return [c.env, d];
    };
    r || (r = (() => {
      const c = vn(this._basePath, e), d = c === "/" ? 0 : c.length;
      return (l) => {
        const u = new URL(l.url);
        return u.pathname = this.getPath(l).slice(d) || "/", new Request(u, l);
      };
    })());
    const o = async (c, d) => {
      const l = await s(r(c.req.raw), ...i(c));
      if (l)
        return l;
      await d();
    };
    return pe(this, ze, bn).call(this, qe, vn(e, "*"), o), this;
  }
}, Xt = new WeakMap(), ze = new WeakSet(), ep = function() {
  const e = new Er({
    router: this.router,
    getPath: this.getPath
  });
  return e.errorHandler = this.errorHandler, Z(e, Qt, A(this, Qt)), e.routes = this.routes, e;
}, Qt = new WeakMap(), bn = function(e, s, n, r) {
  e = e.toUpperCase(), s = vn(this._basePath, s);
  const a = {
    basePath: r !== void 0 ? vn(this._basePath, r) : this._basePath,
    path: s,
    method: e,
    handler: n
  };
  this.router.add(e, s, [n, a]), this.routes.push(a);
}, vi = function(e, s) {
  if (e instanceof Error)
    return this.errorHandler(e, s);
  throw e;
}, bi = function(e, s, n, r) {
  if (r === "HEAD")
    return (async () => new Response(null, await pe(this, ze, bi).call(this, e, s, n, "GET")))();
  const a = this.getPath(e, { env: n }), i = this.router.match(r, a), o = new ny(e, {
    path: a,
    matchResult: i,
    env: n,
    executionCtx: s,
    notFoundHandler: A(this, Qt)
  });
  if (i[0].length === 1) {
    let d;
    try {
      d = i[0][0][0][0](o, async () => {
        o.res = await A(this, Qt).call(this, o);
      });
    } catch (l) {
      return pe(this, ze, vi).call(this, l, o);
    }
    return d instanceof Promise ? d.then(
      (l) => l || (o.finalized ? o.res : A(this, Qt).call(this, o))
    ).catch((l) => pe(this, ze, vi).call(this, l, o)) : d ?? A(this, Qt).call(this, o);
  }
  const c = xl(i[0], this.errorHandler, A(this, Qt));
  return (async () => {
    try {
      const d = await c(o);
      if (!d.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return d.res;
    } catch (d) {
      return pe(this, ze, vi).call(this, d, o);
    }
  })();
}, Er), tp = [];
function dy(t, e) {
  const s = this.buildAllMatchers(), n = (r, a) => {
    const i = s[r] || s[qe], o = i[2][a];
    if (o)
      return o;
    const c = a.match(i[0]);
    if (!c)
      return [[], tp];
    const d = c.indexOf("", 1);
    return [i[1][d], c];
  };
  return this.match = n, n(t, e);
}
var Pi = "[^/]+", ca = ".*", da = "(?:|/.*)", hr = /* @__PURE__ */ Symbol(), ly = new Set(".\\+*[^]$()");
function uy(t, e) {
  return t.length === 1 ? e.length === 1 ? t < e ? -1 : 1 : -1 : e.length === 1 || t === ca || t === da ? 1 : e === ca || e === da ? -1 : t === Pi ? 1 : e === Pi ? -1 : t.length === e.length ? t < e ? -1 : 1 : e.length - t.length;
}
var In, Tn, es, Pn, hy = (Pn = class {
  constructor() {
    re(this, In);
    re(this, Tn);
    re(this, es, /* @__PURE__ */ Object.create(null));
  }
  insert(e, s, n, r, a) {
    if (e.length === 0) {
      if (A(this, In) !== void 0)
        throw hr;
      if (a)
        return;
      Z(this, In, s);
      return;
    }
    const [i, ...o] = e, c = i === "*" ? o.length === 0 ? ["", "", ca] : ["", "", Pi] : i === "/*" ? ["", "", da] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let d;
    if (c) {
      const l = c[1];
      let u = c[2] || Pi;
      if (l && c[2] && (u === ".*" || (u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(u))))
        throw hr;
      if (d = A(this, es)[u], !d) {
        if (Object.keys(A(this, es)).some(
          (h) => h !== ca && h !== da
        ))
          throw hr;
        if (a)
          return;
        d = A(this, es)[u] = new Pn(), l !== "" && Z(d, Tn, r.varIndex++);
      }
      !a && l !== "" && n.push([l, A(d, Tn)]);
    } else if (d = A(this, es)[i], !d) {
      if (Object.keys(A(this, es)).some(
        (l) => l.length > 1 && l !== ca && l !== da
      ))
        throw hr;
      if (a)
        return;
      d = A(this, es)[i] = new Pn();
    }
    d.insert(o, s, n, r, a);
  }
  buildRegExpStr() {
    const s = Object.keys(A(this, es)).sort(uy).map((n) => {
      const r = A(this, es)[n];
      return (typeof A(r, Tn) == "number" ? `(${n})@${A(r, Tn)}` : ly.has(n) ? `\\${n}` : n) + r.buildRegExpStr();
    });
    return typeof A(this, In) == "number" && s.unshift(`#${A(this, In)}`), s.length === 0 ? "" : s.length === 1 ? s[0] : "(?:" + s.join("|") + ")";
  }
}, In = new WeakMap(), Tn = new WeakMap(), es = new WeakMap(), Pn), no, Ta, $f, fy = ($f = class {
  constructor() {
    re(this, no, { varIndex: 0 });
    re(this, Ta, new hy());
  }
  insert(t, e, s) {
    const n = [], r = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (t = t.replace(/\{[^}]+\}/g, (c) => {
        const d = `@\\${i}`;
        return r[i] = [d, c], i++, o = !0, d;
      }), !o)
        break;
    }
    const a = t.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = r.length - 1; i >= 0; i--) {
      const [o] = r[i];
      for (let c = a.length - 1; c >= 0; c--)
        if (a[c].indexOf(o) !== -1) {
          a[c] = a[c].replace(o, r[i][1]);
          break;
        }
    }
    return A(this, Ta).insert(a, e, n, A(this, no), s), n;
  }
  buildRegExp() {
    let t = A(this, Ta).buildRegExpStr();
    if (t === "")
      return [/^$/, [], []];
    let e = 0;
    const s = [], n = [];
    return t = t.replace(/#(\d+)|@(\d+)|\.\*\$/g, (r, a, i) => a !== void 0 ? (s[++e] = Number(a), "$()") : (i !== void 0 && (n[Number(i)] = ++e), "")), [new RegExp(`^${t}`), s, n];
  }
}, no = new WeakMap(), Ta = new WeakMap(), $f), py = [/^$/, [], /* @__PURE__ */ Object.create(null)], Si = /* @__PURE__ */ Object.create(null);
function sp(t) {
  return Si[t] ?? (Si[t] = new RegExp(
    t === "*" ? "" : `^${t.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (e, s) => s ? `\\${s}` : "(?:|/.*)"
    )}$`
  ));
}
function my() {
  Si = /* @__PURE__ */ Object.create(null);
}
function gy(t) {
  var d;
  const e = new fy(), s = [];
  if (t.length === 0)
    return py;
  const n = t.map(
    (l) => [!/\*|\/:/.test(l[0]), ...l]
  ).sort(
    ([l, u], [h, f]) => l ? 1 : h ? -1 : u.length - f.length
  ), r = /* @__PURE__ */ Object.create(null);
  for (let l = 0, u = -1, h = n.length; l < h; l++) {
    const [f, g, _] = n[l];
    f ? r[g] = [_.map(([b]) => [b, /* @__PURE__ */ Object.create(null)]), tp] : u++;
    let w;
    try {
      w = e.insert(g, u, f);
    } catch (b) {
      throw b === hr ? new Qf(g) : b;
    }
    f || (s[u] = _.map(([b, I]) => {
      const D = /* @__PURE__ */ Object.create(null);
      for (I -= 1; I >= 0; I--) {
        const [M, z] = w[I];
        D[M] = z;
      }
      return [b, D];
    }));
  }
  const [a, i, o] = e.buildRegExp();
  for (let l = 0, u = s.length; l < u; l++)
    for (let h = 0, f = s[l].length; h < f; h++) {
      const g = (d = s[l][h]) == null ? void 0 : d[1];
      if (!g)
        continue;
      const _ = Object.keys(g);
      for (let w = 0, b = _.length; w < b; w++)
        g[_[w]] = o[g[_[w]]];
    }
  const c = [];
  for (const l in i)
    c[l] = s[i[l]];
  return [a, c, r];
}
function sr(t, e) {
  if (t) {
    for (const s of Object.keys(t).sort((n, r) => r.length - n.length))
      if (sp(s).test(e))
        return [...t[s]];
  }
}
var Xs, Qs, ro, np, Lf, yy = (Lf = class {
  constructor() {
    re(this, ro);
    p(this, "name", "RegExpRouter");
    re(this, Xs);
    re(this, Qs);
    p(this, "match", dy);
    Z(this, Xs, { [qe]: /* @__PURE__ */ Object.create(null) }), Z(this, Qs, { [qe]: /* @__PURE__ */ Object.create(null) });
  }
  add(t, e, s) {
    var o;
    const n = A(this, Xs), r = A(this, Qs);
    if (!n || !r)
      throw new Error(Xf);
    n[t] || [n, r].forEach((c) => {
      c[t] = /* @__PURE__ */ Object.create(null), Object.keys(c[qe]).forEach((d) => {
        c[t][d] = [...c[qe][d]];
      });
    }), e === "/*" && (e = "*");
    const a = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const c = sp(e);
      t === qe ? Object.keys(n).forEach((d) => {
        var l;
        (l = n[d])[e] || (l[e] = sr(n[d], e) || sr(n[qe], e) || []);
      }) : (o = n[t])[e] || (o[e] = sr(n[t], e) || sr(n[qe], e) || []), Object.keys(n).forEach((d) => {
        (t === qe || t === d) && Object.keys(n[d]).forEach((l) => {
          c.test(l) && n[d][l].push([s, a]);
        });
      }), Object.keys(r).forEach((d) => {
        (t === qe || t === d) && Object.keys(r[d]).forEach(
          (l) => c.test(l) && r[d][l].push([s, a])
        );
      });
      return;
    }
    const i = Wf(e) || [e];
    for (let c = 0, d = i.length; c < d; c++) {
      const l = i[c];
      Object.keys(r).forEach((u) => {
        var h;
        (t === qe || t === u) && ((h = r[u])[l] || (h[l] = [
          ...sr(n[u], l) || sr(n[qe], l) || []
        ]), r[u][l].push([s, a - d + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const t = /* @__PURE__ */ Object.create(null);
    return Object.keys(A(this, Qs)).concat(Object.keys(A(this, Xs))).forEach((e) => {
      t[e] || (t[e] = pe(this, ro, np).call(this, e));
    }), Z(this, Xs, Z(this, Qs, void 0)), my(), t;
  }
}, Xs = new WeakMap(), Qs = new WeakMap(), ro = new WeakSet(), np = function(t) {
  const e = [];
  let s = t === qe;
  return [A(this, Xs), A(this, Qs)].forEach((n) => {
    const r = n[t] ? Object.keys(n[t]).map((a) => [a, n[t][a]]) : [];
    r.length !== 0 ? (s || (s = !0), e.push(...r)) : t !== qe && e.push(
      ...Object.keys(n[qe]).map((a) => [a, n[qe][a]])
    );
  }), s ? gy(e) : null;
}, Lf), en, Rs, Hf, wy = (Hf = class {
  constructor(t) {
    p(this, "name", "SmartRouter");
    re(this, en, []);
    re(this, Rs, []);
    Z(this, en, t.routers);
  }
  add(t, e, s) {
    if (!A(this, Rs))
      throw new Error(Xf);
    A(this, Rs).push([t, e, s]);
  }
  match(t, e) {
    if (!A(this, Rs))
      throw new Error("Fatal error");
    const s = A(this, en), n = A(this, Rs), r = s.length;
    let a = 0, i;
    for (; a < r; a++) {
      const o = s[a];
      try {
        for (let c = 0, d = n.length; c < d; c++)
          o.add(...n[c]);
        i = o.match(t, e);
      } catch (c) {
        if (c instanceof Qf)
          continue;
        throw c;
      }
      this.match = o.match.bind(o), Z(this, en, [o]), Z(this, Rs, void 0);
      break;
    }
    if (a === r)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (A(this, Rs) || A(this, en).length !== 1)
      throw new Error("No active router has been determined yet.");
    return A(this, en)[0];
  }
}, en = new WeakMap(), Rs = new WeakMap(), Hf), Gr = /* @__PURE__ */ Object.create(null), _y = (t) => {
  for (const e in t)
    return !0;
  return !1;
}, tn, Ze, kn, Ar, Ye, ds, zs, xr, vy = (xr = class {
  constructor(e, s, n) {
    re(this, ds);
    re(this, tn);
    re(this, Ze);
    re(this, kn);
    re(this, Ar, 0);
    re(this, Ye, Gr);
    if (Z(this, Ze, n || /* @__PURE__ */ Object.create(null)), Z(this, tn, []), e && s) {
      const r = /* @__PURE__ */ Object.create(null);
      r[e] = { handler: s, possibleKeys: [], score: 0 }, Z(this, tn, [r]);
    }
    Z(this, kn, []);
  }
  insert(e, s, n) {
    Z(this, Ar, ++Al(this, Ar)._);
    let r = this;
    const a = Wg(s), i = [];
    for (let o = 0, c = a.length; o < c; o++) {
      const d = a[o], l = a[o + 1], u = Jg(d, l), h = Array.isArray(u) ? u[0] : d;
      if (h in A(r, Ze)) {
        r = A(r, Ze)[h], u && i.push(u[1]);
        continue;
      }
      A(r, Ze)[h] = new xr(), u && (A(r, kn).push(u), i.push(u[1])), r = A(r, Ze)[h];
    }
    return A(r, tn).push({
      [e]: {
        handler: n,
        possibleKeys: i.filter((o, c, d) => d.indexOf(o) === c),
        score: A(this, Ar)
      }
    }), r;
  }
  search(e, s) {
    var l;
    const n = [];
    Z(this, Ye, Gr);
    let a = [this];
    const i = zf(s), o = [], c = i.length;
    let d = null;
    for (let u = 0; u < c; u++) {
      const h = i[u], f = u === c - 1, g = [];
      for (let w = 0, b = a.length; w < b; w++) {
        const I = a[w], D = A(I, Ze)[h];
        D && (Z(D, Ye, A(I, Ye)), f ? (A(D, Ze)["*"] && pe(this, ds, zs).call(this, n, A(D, Ze)["*"], e, A(I, Ye)), pe(this, ds, zs).call(this, n, D, e, A(I, Ye))) : g.push(D));
        for (let M = 0, z = A(I, kn).length; M < z; M++) {
          const te = A(I, kn)[M], E = A(I, Ye) === Gr ? {} : { ...A(I, Ye) };
          if (te === "*") {
            const Ce = A(I, Ze)["*"];
            Ce && (pe(this, ds, zs).call(this, n, Ce, e, A(I, Ye)), Z(Ce, Ye, E), g.push(Ce));
            continue;
          }
          const [we, Pe, j] = te;
          if (!h && !(j instanceof RegExp))
            continue;
          const he = A(I, Ze)[we];
          if (j instanceof RegExp) {
            if (d === null) {
              d = new Array(c);
              let Ee = s[0] === "/" ? 1 : 0;
              for (let xe = 0; xe < c; xe++)
                d[xe] = Ee, Ee += i[xe].length + 1;
            }
            const Ce = s.substring(d[u]), We = j.exec(Ce);
            if (We) {
              if (E[Pe] = We[0], pe(this, ds, zs).call(this, n, he, e, A(I, Ye), E), We[0].length === Ce.length && A(he, Ze)["*"] && pe(this, ds, zs).call(this, n, A(he, Ze)["*"], e, A(I, Ye), E), _y(A(he, Ze))) {
                Z(he, Ye, E);
                const Ee = ((l = We[0].match(/\//)) == null ? void 0 : l.length) ?? 0;
                (o[Ee] || (o[Ee] = [])).push(he);
              }
              continue;
            }
          }
          (j === !0 || j.test(h)) && (E[Pe] = h, f ? (pe(this, ds, zs).call(this, n, he, e, E, A(I, Ye)), A(he, Ze)["*"] && pe(this, ds, zs).call(this, n, A(he, Ze)["*"], e, E, A(I, Ye))) : (Z(he, Ye, E), g.push(he)));
        }
      }
      const _ = o.shift();
      a = _ ? g.concat(_) : g;
    }
    return n.length > 1 && n.sort((u, h) => u.score - h.score), [n.map(({ handler: u, params: h }) => [u, h])];
  }
}, tn = new WeakMap(), Ze = new WeakMap(), kn = new WeakMap(), Ar = new WeakMap(), Ye = new WeakMap(), ds = new WeakSet(), zs = function(e, s, n, r, a) {
  for (let i = 0, o = A(s, tn).length; i < o; i++) {
    const c = A(s, tn)[i], d = c[n] || c[qe], l = {};
    if (d !== void 0 && (d.params = /* @__PURE__ */ Object.create(null), e.push(d), r !== Gr || a && a !== Gr))
      for (let u = 0, h = d.possibleKeys.length; u < h; u++) {
        const f = d.possibleKeys[u], g = l[d.score];
        d.params[f] = a != null && a[f] && !g ? a[f] : r[f] ?? (a == null ? void 0 : a[f]), l[d.score] = !0;
      }
  }
}, xr), Rn, jf, by = (jf = class {
  constructor() {
    p(this, "name", "TrieRouter");
    re(this, Rn);
    Z(this, Rn, new vy());
  }
  add(t, e, s) {
    const n = Wf(e);
    if (n) {
      for (let r = 0, a = n.length; r < a; r++)
        A(this, Rn).insert(t, n[r], s);
      return;
    }
    A(this, Rn).insert(t, e, s);
  }
  match(t, e) {
    return A(this, Rn).search(t, e);
  }
}, Rn = new WeakMap(), jf), Nt = class extends cy {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(t = {}) {
    super(t), this.router = t.router ?? new wy({
      routers: [new yy(), new by()]
    });
  }
}, Sy = (t) => {
  const e = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...t
  }, s = /* @__PURE__ */ ((r) => typeof r == "string" ? r === "*" ? () => r : (a) => r === a ? a : null : typeof r == "function" ? r : (a) => r.includes(a) ? a : null)(e.origin), n = ((r) => typeof r == "function" ? r : Array.isArray(r) ? () => r : () => [])(e.allowMethods);
  return async function(a, i) {
    var d;
    function o(l, u) {
      a.res.headers.set(l, u);
    }
    const c = await s(a.req.header("origin") || "", a);
    if (c && o("Access-Control-Allow-Origin", c), e.credentials && o("Access-Control-Allow-Credentials", "true"), (d = e.exposeHeaders) != null && d.length && o("Access-Control-Expose-Headers", e.exposeHeaders.join(",")), a.req.method === "OPTIONS") {
      e.origin !== "*" && o("Vary", "Origin"), e.maxAge != null && o("Access-Control-Max-Age", e.maxAge.toString());
      const l = await n(a.req.header("origin") || "", a);
      l.length && o("Access-Control-Allow-Methods", l.join(","));
      let u = e.allowHeaders;
      if (!(u != null && u.length)) {
        const h = a.req.header("Access-Control-Request-Headers");
        h && (u = h.split(/\s*,\s*/));
      }
      return u != null && u.length && (o("Access-Control-Allow-Headers", u.join(",")), a.res.headers.append("Vary", "Access-Control-Request-Headers")), a.res.headers.delete("Content-Length"), a.res.headers.delete("Content-Type"), new Response(null, {
        headers: a.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), e.origin !== "*" && a.header("Vary", "Origin", { append: !0 });
  };
}, fe;
(function(t) {
  t.assertEqual = (r) => {
  };
  function e(r) {
  }
  t.assertIs = e;
  function s(r) {
    throw new Error();
  }
  t.assertNever = s, t.arrayToEnum = (r) => {
    const a = {};
    for (const i of r)
      a[i] = i;
    return a;
  }, t.getValidEnumValues = (r) => {
    const a = t.objectKeys(r).filter((o) => typeof r[r[o]] != "number"), i = {};
    for (const o of a)
      i[o] = r[o];
    return t.objectValues(i);
  }, t.objectValues = (r) => t.objectKeys(r).map(function(a) {
    return r[a];
  }), t.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const a = [];
    for (const i in r)
      Object.prototype.hasOwnProperty.call(r, i) && a.push(i);
    return a;
  }, t.find = (r, a) => {
    for (const i of r)
      if (a(i))
        return i;
  }, t.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function n(r, a = " | ") {
    return r.map((i) => typeof i == "string" ? `'${i}'` : i).join(a);
  }
  t.joinValues = n, t.jsonStringifyReplacer = (r, a) => typeof a == "bigint" ? a.toString() : a;
})(fe || (fe = {}));
var kl;
(function(t) {
  t.mergeShapes = (e, s) => ({
    ...e,
    ...s
    // second overwrites first
  });
})(kl || (kl = {}));
const L = fe.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Vs = (t) => {
  switch (typeof t) {
    case "undefined":
      return L.undefined;
    case "string":
      return L.string;
    case "number":
      return Number.isNaN(t) ? L.nan : L.number;
    case "boolean":
      return L.boolean;
    case "function":
      return L.function;
    case "bigint":
      return L.bigint;
    case "symbol":
      return L.symbol;
    case "object":
      return Array.isArray(t) ? L.array : t === null ? L.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? L.promise : typeof Map < "u" && t instanceof Map ? L.map : typeof Set < "u" && t instanceof Set ? L.set : typeof Date < "u" && t instanceof Date ? L.date : L.object;
    default:
      return L.unknown;
  }
}, R = fe.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class fs extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const s = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, s) : this.__proto__ = s, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const s = e || function(a) {
      return a.message;
    }, n = { _errors: [] }, r = (a) => {
      for (const i of a.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(r);
        else if (i.code === "invalid_return_type")
          r(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          r(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(s(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(s(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return r(this), n;
  }
  static assert(e) {
    if (!(e instanceof fs))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, fe.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (s) => s.message) {
    const s = {}, n = [];
    for (const r of this.issues)
      if (r.path.length > 0) {
        const a = r.path[0];
        s[a] = s[a] || [], s[a].push(e(r));
      } else
        n.push(e(r));
    return { formErrors: n, fieldErrors: s };
  }
  get formErrors() {
    return this.flatten();
  }
}
fs.create = (t) => new fs(t);
const Lc = (t, e) => {
  let s;
  switch (t.code) {
    case R.invalid_type:
      t.received === L.undefined ? s = "Required" : s = `Expected ${t.expected}, received ${t.received}`;
      break;
    case R.invalid_literal:
      s = `Invalid literal value, expected ${JSON.stringify(t.expected, fe.jsonStringifyReplacer)}`;
      break;
    case R.unrecognized_keys:
      s = `Unrecognized key(s) in object: ${fe.joinValues(t.keys, ", ")}`;
      break;
    case R.invalid_union:
      s = "Invalid input";
      break;
    case R.invalid_union_discriminator:
      s = `Invalid discriminator value. Expected ${fe.joinValues(t.options)}`;
      break;
    case R.invalid_enum_value:
      s = `Invalid enum value. Expected ${fe.joinValues(t.options)}, received '${t.received}'`;
      break;
    case R.invalid_arguments:
      s = "Invalid function arguments";
      break;
    case R.invalid_return_type:
      s = "Invalid function return type";
      break;
    case R.invalid_date:
      s = "Invalid date";
      break;
    case R.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (s = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (s = `${s} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? s = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? s = `Invalid input: must end with "${t.validation.endsWith}"` : fe.assertNever(t.validation) : t.validation !== "regex" ? s = `Invalid ${t.validation}` : s = "Invalid";
      break;
    case R.too_small:
      t.type === "array" ? s = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? s = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? s = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "bigint" ? s = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? s = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : s = "Invalid input";
      break;
    case R.too_big:
      t.type === "array" ? s = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? s = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? s = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? s = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? s = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : s = "Invalid input";
      break;
    case R.custom:
      s = "Invalid input";
      break;
    case R.invalid_intersection_types:
      s = "Intersection results could not be merged";
      break;
    case R.not_multiple_of:
      s = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case R.not_finite:
      s = "Number must be finite";
      break;
    default:
      s = e.defaultError, fe.assertNever(t);
  }
  return { message: s };
};
let Ey = Lc;
function Ay() {
  return Ey;
}
const xy = (t) => {
  const { data: e, path: s, errorMaps: n, issueData: r } = t, a = [...s, ...r.path || []], i = {
    ...r,
    path: a
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: a,
      message: r.message
    };
  let o = "";
  const c = n.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...r,
    path: a,
    message: o
  };
};
function P(t, e) {
  const s = Ay(), n = xy({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      // contextual error map is first priority
      t.schemaErrorMap,
      // then schema-bound map if available
      s,
      // then global override map
      s === Lc ? void 0 : Lc
      // then global default map
    ].filter((r) => !!r)
  });
  t.common.issues.push(n);
}
class ht {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, s) {
    const n = [];
    for (const r of s) {
      if (r.status === "aborted")
        return Q;
      r.status === "dirty" && e.dirty(), n.push(r.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, s) {
    const n = [];
    for (const r of s) {
      const a = await r.key, i = await r.value;
      n.push({
        key: a,
        value: i
      });
    }
    return ht.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, s) {
    const n = {};
    for (const r of s) {
      const { key: a, value: i } = r;
      if (a.status === "aborted" || i.status === "aborted")
        return Q;
      a.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof i.value < "u" || r.alwaysSet) && (n[a.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const Q = Object.freeze({
  status: "aborted"
}), oa = (t) => ({ status: "dirty", value: t }), jt = (t) => ({ status: "valid", value: t }), Rl = (t) => t.status === "aborted", Ol = (t) => t.status === "dirty", Cr = (t) => t.status === "valid", Bi = (t) => typeof Promise < "u" && t instanceof Promise;
var H;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(H || (H = {}));
class ps {
  constructor(e, s, n, r) {
    this._cachedPath = [], this.parent = e, this.data = s, this._path = n, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Nl = (t, e) => {
  if (Cr(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const s = new fs(t.common.issues);
      return this._error = s, this._error;
    }
  };
};
function ne(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: s, required_error: n, description: r } = t;
  if (e && (s || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (i, o) => {
    const { message: c } = t;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? s ?? o.defaultError };
  }, description: r };
}
class ue {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Vs(e.data);
  }
  _getOrReturnCtx(e, s) {
    return s || {
      common: e.parent.common,
      data: e.data,
      parsedType: Vs(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new ht(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Vs(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const s = this._parse(e);
    if (Bi(s))
      throw new Error("Synchronous parse encountered promise.");
    return s;
  }
  _parseAsync(e) {
    const s = this._parse(e);
    return Promise.resolve(s);
  }
  parse(e, s) {
    const n = this.safeParse(e, s);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, s) {
    const n = {
      common: {
        issues: [],
        async: (s == null ? void 0 : s.async) ?? !1,
        contextualErrorMap: s == null ? void 0 : s.errorMap
      },
      path: (s == null ? void 0 : s.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Vs(e)
    }, r = this._parseSync({ data: e, path: n.path, parent: n });
    return Nl(n, r);
  }
  "~validate"(e) {
    var n, r;
    const s = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Vs(e)
    };
    if (!this["~standard"].async)
      try {
        const a = this._parseSync({ data: e, path: [], parent: s });
        return Cr(a) ? {
          value: a.value
        } : {
          issues: s.common.issues
        };
      } catch (a) {
        (r = (n = a == null ? void 0 : a.message) == null ? void 0 : n.toLowerCase()) != null && r.includes("encountered") && (this["~standard"].async = !0), s.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: s }).then((a) => Cr(a) ? {
      value: a.value
    } : {
      issues: s.common.issues
    });
  }
  async parseAsync(e, s) {
    const n = await this.safeParseAsync(e, s);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, s) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: s == null ? void 0 : s.errorMap,
        async: !0
      },
      path: (s == null ? void 0 : s.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Vs(e)
    }, r = this._parse({ data: e, path: n.path, parent: n }), a = await (Bi(r) ? r : Promise.resolve(r));
    return Nl(n, a);
  }
  refine(e, s) {
    const n = (r) => typeof s == "string" || typeof s > "u" ? { message: s } : typeof s == "function" ? s(r) : s;
    return this._refinement((r, a) => {
      const i = e(r), o = () => a.addIssue({
        code: R.custom,
        ...n(r)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, s) {
    return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof s == "function" ? s(n, r) : s), !1));
  }
  _refinement(e) {
    return new kr({
      schema: this,
      typeName: X.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (s) => this["~validate"](s)
    };
  }
  optional() {
    return sn.create(this, this._def);
  }
  nullable() {
    return Rr.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ls.create(this);
  }
  promise() {
    return Hi.create(this, this._def);
  }
  or(e) {
    return Fi.create([this, e], this._def);
  }
  and(e) {
    return $i.create(this, e, this._def);
  }
  transform(e) {
    return new kr({
      ...ne(this._def),
      schema: this,
      typeName: X.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const s = typeof e == "function" ? e : () => e;
    return new zc({
      ...ne(this._def),
      innerType: this,
      defaultValue: s,
      typeName: X.ZodDefault
    });
  }
  brand() {
    return new Gy({
      typeName: X.ZodBranded,
      type: this,
      ...ne(this._def)
    });
  }
  catch(e) {
    const s = typeof e == "function" ? e : () => e;
    return new Kc({
      ...ne(this._def),
      innerType: this,
      catchValue: s,
      typeName: X.ZodCatch
    });
  }
  describe(e) {
    const s = this.constructor;
    return new s({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return gd.create(this, e);
  }
  readonly() {
    return Wc.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Cy = /^c[^\s-]{8,}$/i, Iy = /^[0-9a-z]+$/, Ty = /^[0-9A-HJKMNP-TV-Z]{26}$/i, ky = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Ry = /^[a-z0-9_-]{21}$/i, Oy = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ny = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, My = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Dy = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let So;
const Py = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, By = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Uy = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Fy = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, $y = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ly = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, rp = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Hy = new RegExp(`^${rp}$`);
function ap(t) {
  let e = "[0-5]\\d";
  t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`);
  const s = t.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${s}`;
}
function jy(t) {
  return new RegExp(`^${ap(t)}$`);
}
function qy(t) {
  let e = `${rp}T${ap(t)}`;
  const s = [];
  return s.push(t.local ? "Z?" : "Z"), t.offset && s.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${s.join("|")})`, new RegExp(`^${e}$`);
}
function zy(t, e) {
  return !!((e === "v4" || !e) && Py.test(t) || (e === "v6" || !e) && Uy.test(t));
}
function Ky(t, e) {
  if (!Oy.test(t))
    return !1;
  try {
    const [s] = t.split(".");
    if (!s)
      return !1;
    const n = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + (4 - s.length % 4) % 4, "="), r = JSON.parse(atob(n));
    return !(typeof r != "object" || r === null || "typ" in r && (r == null ? void 0 : r.typ) !== "JWT" || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function Wy(t, e) {
  return !!((e === "v4" || !e) && By.test(t) || (e === "v6" || !e) && Fy.test(t));
}
class Ns extends ue {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== L.string) {
      const a = this._getOrReturnCtx(e);
      return P(a, {
        code: R.invalid_type,
        expected: L.string,
        received: a.parsedType
      }), Q;
    }
    const n = new ht();
    let r;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (r = this._getOrReturnCtx(e, r), P(r, {
          code: R.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (r = this._getOrReturnCtx(e, r), P(r, {
          code: R.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), n.dirty());
      else if (a.kind === "length") {
        const i = e.data.length > a.value, o = e.data.length < a.value;
        (i || o) && (r = this._getOrReturnCtx(e, r), i ? P(r, {
          code: R.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : o && P(r, {
          code: R.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), n.dirty());
      } else if (a.kind === "email")
        My.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "email",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "emoji")
        So || (So = new RegExp(Dy, "u")), So.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "emoji",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "uuid")
        ky.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "uuid",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "nanoid")
        Ry.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "nanoid",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid")
        Cy.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "cuid",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "cuid2")
        Iy.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "cuid2",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "ulid")
        Ty.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
          validation: "ulid",
          code: R.invalid_string,
          message: a.message
        }), n.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), P(r, {
            validation: "url",
            code: R.invalid_string,
            message: a.message
          }), n.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "regex",
        code: R.invalid_string,
        message: a.message
      }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), n.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), n.dirty()) : a.kind === "datetime" ? qy(a).test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: "datetime",
        message: a.message
      }), n.dirty()) : a.kind === "date" ? Hy.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: "date",
        message: a.message
      }), n.dirty()) : a.kind === "time" ? jy(a).test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.invalid_string,
        validation: "time",
        message: a.message
      }), n.dirty()) : a.kind === "duration" ? Ny.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "duration",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "ip" ? zy(e.data, a.version) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "ip",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "jwt" ? Ky(e.data, a.alg) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "jwt",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "cidr" ? Wy(e.data, a.version) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "cidr",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64" ? $y.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "base64",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : a.kind === "base64url" ? Ly.test(e.data) || (r = this._getOrReturnCtx(e, r), P(r, {
        validation: "base64url",
        code: R.invalid_string,
        message: a.message
      }), n.dirty()) : fe.assertNever(a);
    return { status: n.value, value: e.data };
  }
  _regex(e, s, n) {
    return this.refinement((r) => e.test(r), {
      validation: s,
      code: R.invalid_string,
      ...H.errToObj(n)
    });
  }
  _addCheck(e) {
    return new Ns({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...H.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...H.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...H.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...H.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...H.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...H.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...H.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...H.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...H.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...H.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...H.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...H.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...H.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...H.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...H.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...H.errToObj(e) });
  }
  regex(e, s) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...H.errToObj(s)
    });
  }
  includes(e, s) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: s == null ? void 0 : s.position,
      ...H.errToObj(s == null ? void 0 : s.message)
    });
  }
  startsWith(e, s) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...H.errToObj(s)
    });
  }
  endsWith(e, s) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...H.errToObj(s)
    });
  }
  min(e, s) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...H.errToObj(s)
    });
  }
  max(e, s) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...H.errToObj(s)
    });
  }
  length(e, s) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...H.errToObj(s)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, H.errToObj(e));
  }
  trim() {
    return new Ns({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Ns({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Ns({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
}
Ns.create = (t) => new Ns({
  checks: [],
  typeName: X.ZodString,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...ne(t)
});
function Vy(t, e) {
  const s = (t.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, r = s > n ? s : n, a = Number.parseInt(t.toFixed(r).replace(".", "")), i = Number.parseInt(e.toFixed(r).replace(".", ""));
  return a % i / 10 ** r;
}
class Ir extends ue {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== L.number) {
      const a = this._getOrReturnCtx(e);
      return P(a, {
        code: R.invalid_type,
        expected: L.number,
        received: a.parsedType
      }), Q;
    }
    let n;
    const r = new ht();
    for (const a of this._def.checks)
      a.kind === "int" ? fe.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), r.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), r.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), r.dirty()) : a.kind === "multipleOf" ? Vy(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), r.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.not_finite,
        message: a.message
      }), r.dirty()) : fe.assertNever(a);
    return { status: r.value, value: e.data };
  }
  gte(e, s) {
    return this.setLimit("min", e, !0, H.toString(s));
  }
  gt(e, s) {
    return this.setLimit("min", e, !1, H.toString(s));
  }
  lte(e, s) {
    return this.setLimit("max", e, !0, H.toString(s));
  }
  lt(e, s) {
    return this.setLimit("max", e, !1, H.toString(s));
  }
  setLimit(e, s, n, r) {
    return new Ir({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: s,
          inclusive: n,
          message: H.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ir({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: H.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, s) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(s)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: H.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: H.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: H.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && fe.isInteger(e.value));
  }
  get isFinite() {
    let e = null, s = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (s === null || n.value > s) && (s = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(s) && Number.isFinite(e);
  }
}
Ir.create = (t) => new Ir({
  checks: [],
  typeName: X.ZodNumber,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...ne(t)
});
class pa extends ue {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== L.bigint)
      return this._getInvalidInput(e);
    let n;
    const r = new ht();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), r.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), r.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), P(n, {
        code: R.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), r.dirty()) : fe.assertNever(a);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const s = this._getOrReturnCtx(e);
    return P(s, {
      code: R.invalid_type,
      expected: L.bigint,
      received: s.parsedType
    }), Q;
  }
  gte(e, s) {
    return this.setLimit("min", e, !0, H.toString(s));
  }
  gt(e, s) {
    return this.setLimit("min", e, !1, H.toString(s));
  }
  lte(e, s) {
    return this.setLimit("max", e, !0, H.toString(s));
  }
  lt(e, s) {
    return this.setLimit("max", e, !1, H.toString(s));
  }
  setLimit(e, s, n, r) {
    return new pa({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: s,
          inclusive: n,
          message: H.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new pa({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, s) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(s)
    });
  }
  get minValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
}
pa.create = (t) => new pa({
  checks: [],
  typeName: X.ZodBigInt,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...ne(t)
});
class Hc extends ue {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== L.boolean) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.boolean,
        received: n.parsedType
      }), Q;
    }
    return jt(e.data);
  }
}
Hc.create = (t) => new Hc({
  typeName: X.ZodBoolean,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...ne(t)
});
class Ui extends ue {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== L.date) {
      const a = this._getOrReturnCtx(e);
      return P(a, {
        code: R.invalid_type,
        expected: L.date,
        received: a.parsedType
      }), Q;
    }
    if (Number.isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return P(a, {
        code: R.invalid_date
      }), Q;
    }
    const n = new ht();
    let r;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (r = this._getOrReturnCtx(e, r), P(r, {
        code: R.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), n.dirty()) : fe.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Ui({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, s) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: H.toString(s)
    });
  }
  max(e, s) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: H.toString(s)
    });
  }
  get minDate() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e != null ? new Date(e) : null;
  }
}
Ui.create = (t) => new Ui({
  checks: [],
  coerce: (t == null ? void 0 : t.coerce) || !1,
  typeName: X.ZodDate,
  ...ne(t)
});
class Ml extends ue {
  _parse(e) {
    if (this._getType(e) !== L.symbol) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.symbol,
        received: n.parsedType
      }), Q;
    }
    return jt(e.data);
  }
}
Ml.create = (t) => new Ml({
  typeName: X.ZodSymbol,
  ...ne(t)
});
class Dl extends ue {
  _parse(e) {
    if (this._getType(e) !== L.undefined) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.undefined,
        received: n.parsedType
      }), Q;
    }
    return jt(e.data);
  }
}
Dl.create = (t) => new Dl({
  typeName: X.ZodUndefined,
  ...ne(t)
});
class Pl extends ue {
  _parse(e) {
    if (this._getType(e) !== L.null) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.null,
        received: n.parsedType
      }), Q;
    }
    return jt(e.data);
  }
}
Pl.create = (t) => new Pl({
  typeName: X.ZodNull,
  ...ne(t)
});
class Bl extends ue {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return jt(e.data);
  }
}
Bl.create = (t) => new Bl({
  typeName: X.ZodAny,
  ...ne(t)
});
class jc extends ue {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return jt(e.data);
  }
}
jc.create = (t) => new jc({
  typeName: X.ZodUnknown,
  ...ne(t)
});
class cn extends ue {
  _parse(e) {
    const s = this._getOrReturnCtx(e);
    return P(s, {
      code: R.invalid_type,
      expected: L.never,
      received: s.parsedType
    }), Q;
  }
}
cn.create = (t) => new cn({
  typeName: X.ZodNever,
  ...ne(t)
});
class Ul extends ue {
  _parse(e) {
    if (this._getType(e) !== L.undefined) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.void,
        received: n.parsedType
      }), Q;
    }
    return jt(e.data);
  }
}
Ul.create = (t) => new Ul({
  typeName: X.ZodVoid,
  ...ne(t)
});
class ls extends ue {
  _parse(e) {
    const { ctx: s, status: n } = this._processInputParams(e), r = this._def;
    if (s.parsedType !== L.array)
      return P(s, {
        code: R.invalid_type,
        expected: L.array,
        received: s.parsedType
      }), Q;
    if (r.exactLength !== null) {
      const i = s.data.length > r.exactLength.value, o = s.data.length < r.exactLength.value;
      (i || o) && (P(s, {
        code: i ? R.too_big : R.too_small,
        minimum: o ? r.exactLength.value : void 0,
        maximum: i ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), n.dirty());
    }
    if (r.minLength !== null && s.data.length < r.minLength.value && (P(s, {
      code: R.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), n.dirty()), r.maxLength !== null && s.data.length > r.maxLength.value && (P(s, {
      code: R.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), n.dirty()), s.common.async)
      return Promise.all([...s.data].map((i, o) => r.type._parseAsync(new ps(s, i, s.path, o)))).then((i) => ht.mergeArray(n, i));
    const a = [...s.data].map((i, o) => r.type._parseSync(new ps(s, i, s.path, o)));
    return ht.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, s) {
    return new ls({
      ...this._def,
      minLength: { value: e, message: H.toString(s) }
    });
  }
  max(e, s) {
    return new ls({
      ...this._def,
      maxLength: { value: e, message: H.toString(s) }
    });
  }
  length(e, s) {
    return new ls({
      ...this._def,
      exactLength: { value: e, message: H.toString(s) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ls.create = (t, e) => new ls({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: X.ZodArray,
  ...ne(e)
});
function fr(t) {
  if (t instanceof Fe) {
    const e = {};
    for (const s in t.shape) {
      const n = t.shape[s];
      e[s] = sn.create(fr(n));
    }
    return new Fe({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof ls ? new ls({
    ...t._def,
    type: fr(t.element)
  }) : t instanceof sn ? sn.create(fr(t.unwrap())) : t instanceof Rr ? Rr.create(fr(t.unwrap())) : t instanceof Bn ? Bn.create(t.items.map((e) => fr(e))) : t;
}
class Fe extends ue {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), s = fe.objectKeys(e);
    return this._cached = { shape: e, keys: s }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== L.object) {
      const d = this._getOrReturnCtx(e);
      return P(d, {
        code: R.invalid_type,
        expected: L.object,
        received: d.parsedType
      }), Q;
    }
    const { status: n, ctx: r } = this._processInputParams(e), { shape: a, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof cn && this._def.unknownKeys === "strip"))
      for (const d in r.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const l = a[d], u = r.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new ps(r, u, r.path, d)),
        alwaysSet: d in r.data
      });
    }
    if (this._def.catchall instanceof cn) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: r.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (P(r, {
          code: R.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const u = r.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new ps(r, u, r.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const u = await l.key, h = await l.value;
        d.push({
          key: u,
          value: h,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => ht.mergeObjectSync(n, d)) : ht.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return H.errToObj, new Fe({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (s, n) => {
          var a, i;
          const r = ((i = (a = this._def).errorMap) == null ? void 0 : i.call(a, s, n).message) ?? n.defaultError;
          return s.code === "unrecognized_keys" ? {
            message: H.errToObj(e).message ?? r
          } : {
            message: r
          };
        }
      } : {}
    });
  }
  strip() {
    return new Fe({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new Fe({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new Fe({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new Fe({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: X.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, s) {
    return this.augment({ [e]: s });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new Fe({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const s = {};
    for (const n of fe.objectKeys(e))
      e[n] && this.shape[n] && (s[n] = this.shape[n]);
    return new Fe({
      ...this._def,
      shape: () => s
    });
  }
  omit(e) {
    const s = {};
    for (const n of fe.objectKeys(this.shape))
      e[n] || (s[n] = this.shape[n]);
    return new Fe({
      ...this._def,
      shape: () => s
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return fr(this);
  }
  partial(e) {
    const s = {};
    for (const n of fe.objectKeys(this.shape)) {
      const r = this.shape[n];
      e && !e[n] ? s[n] = r : s[n] = r.optional();
    }
    return new Fe({
      ...this._def,
      shape: () => s
    });
  }
  required(e) {
    const s = {};
    for (const n of fe.objectKeys(this.shape))
      if (e && !e[n])
        s[n] = this.shape[n];
      else {
        let a = this.shape[n];
        for (; a instanceof sn; )
          a = a._def.innerType;
        s[n] = a;
      }
    return new Fe({
      ...this._def,
      shape: () => s
    });
  }
  keyof() {
    return ip(fe.objectKeys(this.shape));
  }
}
Fe.create = (t, e) => new Fe({
  shape: () => t,
  unknownKeys: "strip",
  catchall: cn.create(),
  typeName: X.ZodObject,
  ...ne(e)
});
Fe.strictCreate = (t, e) => new Fe({
  shape: () => t,
  unknownKeys: "strict",
  catchall: cn.create(),
  typeName: X.ZodObject,
  ...ne(e)
});
Fe.lazycreate = (t, e) => new Fe({
  shape: t,
  unknownKeys: "strip",
  catchall: cn.create(),
  typeName: X.ZodObject,
  ...ne(e)
});
class Fi extends ue {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = this._def.options;
    function r(a) {
      for (const o of a)
        if (o.result.status === "valid")
          return o.result;
      for (const o of a)
        if (o.result.status === "dirty")
          return s.common.issues.push(...o.ctx.common.issues), o.result;
      const i = a.map((o) => new fs(o.ctx.common.issues));
      return P(s, {
        code: R.invalid_union,
        unionErrors: i
      }), Q;
    }
    if (s.common.async)
      return Promise.all(n.map(async (a) => {
        const i = {
          ...s,
          common: {
            ...s.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await a._parseAsync({
            data: s.data,
            path: s.path,
            parent: i
          }),
          ctx: i
        };
      })).then(r);
    {
      let a;
      const i = [];
      for (const c of n) {
        const d = {
          ...s,
          common: {
            ...s.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: s.data,
          path: s.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !a && (a = { result: l, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (a)
        return s.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((c) => new fs(c));
      return P(s, {
        code: R.invalid_union,
        unionErrors: o
      }), Q;
    }
  }
  get options() {
    return this._def.options;
  }
}
Fi.create = (t, e) => new Fi({
  options: t,
  typeName: X.ZodUnion,
  ...ne(e)
});
function qc(t, e) {
  const s = Vs(t), n = Vs(e);
  if (t === e)
    return { valid: !0, data: t };
  if (s === L.object && n === L.object) {
    const r = fe.objectKeys(e), a = fe.objectKeys(t).filter((o) => r.indexOf(o) !== -1), i = { ...t, ...e };
    for (const o of a) {
      const c = qc(t[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (s === L.array && n === L.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let a = 0; a < t.length; a++) {
      const i = t[a], o = e[a], c = qc(i, o);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return s === L.date && n === L.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class $i extends ue {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e), r = (a, i) => {
      if (Rl(a) || Rl(i))
        return Q;
      const o = qc(a.value, i.value);
      return o.valid ? ((Ol(a) || Ol(i)) && s.dirty(), { status: s.value, value: o.data }) : (P(n, {
        code: R.invalid_intersection_types
      }), Q);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([a, i]) => r(a, i)) : r(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
$i.create = (t, e, s) => new $i({
  left: t,
  right: e,
  typeName: X.ZodIntersection,
  ...ne(s)
});
class Bn extends ue {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== L.array)
      return P(n, {
        code: R.invalid_type,
        expected: L.array,
        received: n.parsedType
      }), Q;
    if (n.data.length < this._def.items.length)
      return P(n, {
        code: R.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), Q;
    !this._def.rest && n.data.length > this._def.items.length && (P(n, {
      code: R.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), s.dirty());
    const a = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new ps(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(a).then((i) => ht.mergeArray(s, i)) : ht.mergeArray(s, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Bn({
      ...this._def,
      rest: e
    });
  }
}
Bn.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Bn({
    items: t,
    typeName: X.ZodTuple,
    rest: null,
    ...ne(e)
  });
};
class Li extends ue {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== L.object)
      return P(n, {
        code: R.invalid_type,
        expected: L.object,
        received: n.parsedType
      }), Q;
    const r = [], a = this._def.keyType, i = this._def.valueType;
    for (const o in n.data)
      r.push({
        key: a._parse(new ps(n, o, n.path, o)),
        value: i._parse(new ps(n, n.data[o], n.path, o)),
        alwaysSet: o in n.data
      });
    return n.common.async ? ht.mergeObjectAsync(s, r) : ht.mergeObjectSync(s, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, s, n) {
    return s instanceof ue ? new Li({
      keyType: e,
      valueType: s,
      typeName: X.ZodRecord,
      ...ne(n)
    }) : new Li({
      keyType: Ns.create(),
      valueType: e,
      typeName: X.ZodRecord,
      ...ne(s)
    });
  }
}
class Fl extends ue {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== L.map)
      return P(n, {
        code: R.invalid_type,
        expected: L.map,
        received: n.parsedType
      }), Q;
    const r = this._def.keyType, a = this._def.valueType, i = [...n.data.entries()].map(([o, c], d) => ({
      key: r._parse(new ps(n, o, n.path, [d, "key"])),
      value: a._parse(new ps(n, c, n.path, [d, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return Q;
          (d.status === "dirty" || l.status === "dirty") && s.dirty(), o.set(d.value, l.value);
        }
        return { status: s.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return Q;
        (d.status === "dirty" || l.status === "dirty") && s.dirty(), o.set(d.value, l.value);
      }
      return { status: s.value, value: o };
    }
  }
}
Fl.create = (t, e, s) => new Fl({
  valueType: e,
  keyType: t,
  typeName: X.ZodMap,
  ...ne(s)
});
class ma extends ue {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== L.set)
      return P(n, {
        code: R.invalid_type,
        expected: L.set,
        received: n.parsedType
      }), Q;
    const r = this._def;
    r.minSize !== null && n.data.size < r.minSize.value && (P(n, {
      code: R.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), s.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (P(n, {
      code: R.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), s.dirty());
    const a = this._def.valueType;
    function i(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return Q;
        l.status === "dirty" && s.dirty(), d.add(l.value);
      }
      return { status: s.value, value: d };
    }
    const o = [...n.data.values()].map((c, d) => a._parse(new ps(n, c, n.path, d)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, s) {
    return new ma({
      ...this._def,
      minSize: { value: e, message: H.toString(s) }
    });
  }
  max(e, s) {
    return new ma({
      ...this._def,
      maxSize: { value: e, message: H.toString(s) }
    });
  }
  size(e, s) {
    return this.min(e, s).max(e, s);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ma.create = (t, e) => new ma({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: X.ZodSet,
  ...ne(e)
});
class $l extends ue {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    return this._def.getter()._parse({ data: s.data, path: s.path, parent: s });
  }
}
$l.create = (t, e) => new $l({
  getter: t,
  typeName: X.ZodLazy,
  ...ne(e)
});
class Ll extends ue {
  _parse(e) {
    if (e.data !== this._def.value) {
      const s = this._getOrReturnCtx(e);
      return P(s, {
        received: s.data,
        code: R.invalid_literal,
        expected: this._def.value
      }), Q;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Ll.create = (t, e) => new Ll({
  value: t,
  typeName: X.ZodLiteral,
  ...ne(e)
});
function ip(t, e) {
  return new Tr({
    values: t,
    typeName: X.ZodEnum,
    ...ne(e)
  });
}
class Tr extends ue {
  _parse(e) {
    if (typeof e.data != "string") {
      const s = this._getOrReturnCtx(e), n = this._def.values;
      return P(s, {
        expected: fe.joinValues(n),
        received: s.parsedType,
        code: R.invalid_type
      }), Q;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const s = this._getOrReturnCtx(e), n = this._def.values;
      return P(s, {
        received: s.data,
        code: R.invalid_enum_value,
        options: n
      }), Q;
    }
    return jt(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  get Values() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  get Enum() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  extract(e, s = this._def) {
    return Tr.create(e, {
      ...this._def,
      ...s
    });
  }
  exclude(e, s = this._def) {
    return Tr.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...s
    });
  }
}
Tr.create = ip;
class Hl extends ue {
  _parse(e) {
    const s = fe.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== L.string && n.parsedType !== L.number) {
      const r = fe.objectValues(s);
      return P(n, {
        expected: fe.joinValues(r),
        received: n.parsedType,
        code: R.invalid_type
      }), Q;
    }
    if (this._cache || (this._cache = new Set(fe.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = fe.objectValues(s);
      return P(n, {
        received: n.data,
        code: R.invalid_enum_value,
        options: r
      }), Q;
    }
    return jt(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Hl.create = (t, e) => new Hl({
  values: t,
  typeName: X.ZodNativeEnum,
  ...ne(e)
});
class Hi extends ue {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    if (s.parsedType !== L.promise && s.common.async === !1)
      return P(s, {
        code: R.invalid_type,
        expected: L.promise,
        received: s.parsedType
      }), Q;
    const n = s.parsedType === L.promise ? s.data : Promise.resolve(s.data);
    return jt(n.then((r) => this._def.type.parseAsync(r, {
      path: s.path,
      errorMap: s.common.contextualErrorMap
    })));
  }
}
Hi.create = (t, e) => new Hi({
  type: t,
  typeName: X.ZodPromise,
  ...ne(e)
});
class kr extends ue {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === X.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e), r = this._def.effect || null, a = {
      addIssue: (i) => {
        P(n, i), i.fatal ? s.abort() : s.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), r.type === "preprocess") {
      const i = r.transform(n.data, a);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (s.value === "aborted")
            return Q;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? Q : c.status === "dirty" || s.value === "dirty" ? oa(c.value) : c;
        });
      {
        if (s.value === "aborted")
          return Q;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? Q : o.status === "dirty" || s.value === "dirty" ? oa(o.value) : o;
      }
    }
    if (r.type === "refinement") {
      const i = (o) => {
        const c = r.refinement(o, a);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? Q : (o.status === "dirty" && s.dirty(), i(o.value), { status: s.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? Q : (o.status === "dirty" && s.dirty(), i(o.value).then(() => ({ status: s.value, value: o.value }))));
    }
    if (r.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Cr(i))
          return Q;
        const o = r.transform(i.value, a);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: s.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => Cr(i) ? Promise.resolve(r.transform(i.value, a)).then((o) => ({
          status: s.value,
          value: o
        })) : Q);
    fe.assertNever(r);
  }
}
kr.create = (t, e, s) => new kr({
  schema: t,
  typeName: X.ZodEffects,
  effect: e,
  ...ne(s)
});
kr.createWithPreprocess = (t, e, s) => new kr({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: X.ZodEffects,
  ...ne(s)
});
class sn extends ue {
  _parse(e) {
    return this._getType(e) === L.undefined ? jt(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
sn.create = (t, e) => new sn({
  innerType: t,
  typeName: X.ZodOptional,
  ...ne(e)
});
class Rr extends ue {
  _parse(e) {
    return this._getType(e) === L.null ? jt(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Rr.create = (t, e) => new Rr({
  innerType: t,
  typeName: X.ZodNullable,
  ...ne(e)
});
class zc extends ue {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    let n = s.data;
    return s.parsedType === L.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: s.path,
      parent: s
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
zc.create = (t, e) => new zc({
  innerType: t,
  typeName: X.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...ne(e)
});
class Kc extends ue {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = {
      ...s,
      common: {
        ...s.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return Bi(r) ? r.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new fs(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new fs(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Kc.create = (t, e) => new Kc({
  innerType: t,
  typeName: X.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...ne(e)
});
class jl extends ue {
  _parse(e) {
    if (this._getType(e) !== L.nan) {
      const n = this._getOrReturnCtx(e);
      return P(n, {
        code: R.invalid_type,
        expected: L.nan,
        received: n.parsedType
      }), Q;
    }
    return { status: "valid", value: e.data };
  }
}
jl.create = (t) => new jl({
  typeName: X.ZodNaN,
  ...ne(t)
});
class Gy extends ue {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = s.data;
    return this._def.type._parse({
      data: n,
      path: s.path,
      parent: s
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class gd extends ue {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const a = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? Q : a.status === "dirty" ? (s.dirty(), oa(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const r = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return r.status === "aborted" ? Q : r.status === "dirty" ? (s.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, s) {
    return new gd({
      in: e,
      out: s,
      typeName: X.ZodPipeline
    });
  }
}
class Wc extends ue {
  _parse(e) {
    const s = this._def.innerType._parse(e), n = (r) => (Cr(r) && (r.value = Object.freeze(r.value)), r);
    return Bi(s) ? s.then((r) => n(r)) : n(s);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Wc.create = (t, e) => new Wc({
  innerType: t,
  typeName: X.ZodReadonly,
  ...ne(e)
});
var X;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(X || (X = {}));
const O = Ns.create, mt = Ir.create, Ct = Hc.create, op = jc.create;
cn.create;
const co = ls.create, oe = Fe.create;
Fi.create;
$i.create;
Bn.create;
const cp = Li.create, Ur = Tr.create;
Hi.create;
sn.create;
Rr.create;
class v extends Error {
  constructor(e, s, n = 400, r) {
    super(s), this.code = e, this.status = n, this.details = r;
  }
}
function Jy(t) {
  return t instanceof v;
}
function Eo(t, e, s = {}) {
  const n = JSON.stringify({
    level: t,
    event: e,
    ...s
  });
  if (t === "error") {
    console.error(n);
    return;
  }
  if (t === "warn") {
    console.warn(n);
    return;
  }
  console.log(n);
}
const ts = {
  info: (t, e) => Eo("info", t, e),
  warn: (t, e) => Eo("warn", t, e),
  error: (t, e) => Eo("error", t, e)
};
function Zy() {
  return async (t, e) => {
    try {
      await e();
    } catch (s) {
      return dp(s, t);
    }
  };
}
function dp(t, e) {
  const s = e.get("requestId");
  return Jy(t) ? (ts.warn("app_error", { requestId: s, code: t.code, message: t.message }), e.json({ error: { code: t.code, message: t.message, details: t.details } }, t.status)) : t instanceof fs ? (ts.warn("validation_error", { requestId: s, issues: t.issues }), e.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: t.flatten() } },
    400
  )) : (ts.error("unhandled_error", {
    requestId: s,
    message: t instanceof Error ? t.message : String(t)
  }), e.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500));
}
function Ie(t) {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const s = Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("");
  return `${t}_${s}`;
}
function Yy() {
  return async (t, e) => {
    const s = t.req.header("x-request-id") || Ie("req");
    t.set("requestId", s), t.header("x-request-id", s), await e();
  };
}
class Xy {
  constructor(e) {
    this.adapters = e;
  }
  get(e) {
    const s = this.adapters.find((n) => n.type === e);
    if (!s)
      throw new v("CHANNEL_NOT_SUPPORTED", `Unsupported channel: ${e}`, 400);
    return s;
  }
}
async function ql(t) {
  const e = new TextEncoder().encode(t), s = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(s), (n) => n.toString(16).padStart(2, "0")).join("");
}
async function zl(t, e) {
  const s = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(t),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", s, new TextEncoder().encode(e));
  return Array.from(new Uint8Array(n), (r) => r.toString(16).padStart(2, "0")).join("");
}
async function Un(t, e) {
  const s = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(t),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", s, new TextEncoder().encode(e));
  return Ht(new Uint8Array(n));
}
function Fr(t, e) {
  if (t.length !== e.length) return !1;
  let s = 0;
  for (let n = 0; n < t.length; n += 1)
    s |= t.charCodeAt(n) ^ e.charCodeAt(n);
  return s === 0;
}
function Ht(t) {
  const e = typeof t == "string" ? new TextEncoder().encode(t) : t;
  let s = "";
  for (const n of e) s += String.fromCharCode(n);
  return btoa(s).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function yd(t) {
  return new TextDecoder().decode(lp(t));
}
function lp(t) {
  const e = t.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(t.length / 4) * 4, "="), s = atob(e), n = new Uint8Array(s.length);
  for (let r = 0; r < s.length; r += 1)
    n[r] = s.charCodeAt(r);
  return n;
}
async function up(t, e = crypto.getRandomValues(new Uint8Array(16))) {
  const n = await crypto.subtle.importKey("raw", new TextEncoder().encode(t), "PBKDF2", !1, ["deriveBits"]), r = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: e, iterations: 1e5, hash: "SHA-256" },
    n,
    256
  );
  return `pbkdf2_sha256$100000$${Ht(e)}$${Ht(new Uint8Array(r))}`;
}
async function Vc(t, e) {
  if (!e) return !1;
  const [s, n, r, a] = e.split("$");
  if (s !== "pbkdf2_sha256" || !n || !r || !a) return !1;
  const i = Number(n);
  if (!Number.isInteger(i) || i < 1e4) return !1;
  const o = await crypto.subtle.importKey("raw", new TextEncoder().encode(t), "PBKDF2", !1, ["deriveBits"]), c = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: lp(r), iterations: i, hash: "SHA-256" },
    o,
    256
  );
  return Fr(Ht(new Uint8Array(c)), a);
}
function V() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
const Qy = oe({
  event_id: O().optional(),
  event_type: O().default("message.created"),
  contact: oe({
    external_id: O().optional(),
    name: O().optional(),
    avatar_url: O().optional()
  }).optional(),
  message: oe({
    external_id: O().optional(),
    type: Ur(["text", "image", "file", "audio", "video", "event"]).default("text"),
    text: O().optional(),
    attachments: co(cp(op())).default([])
  }),
  timestamp: O().optional()
});
class ew {
  constructor() {
    p(this, "type", "custom_webhook");
  }
  async verify(e, s) {
    if (!s.webhookSecretCiphertext) return;
    const n = e.headers.get("x-supportly-signature");
    if (!n)
      throw new v("SIGNATURE_INVALID", "Missing webhook signature", 401);
    const r = await e.text(), a = await zl(s.webhookSecretCiphertext, r);
    if (!Fr(n, a))
      throw new v("SIGNATURE_INVALID", "Invalid webhook signature", 401);
  }
  async parseInbound(e, s) {
    var i, o, c, d, l;
    const n = Qy.parse(await e.json()), r = ((i = n.contact) == null ? void 0 : i.external_id) ?? n.event_id ?? await ql(JSON.stringify(n)), a = ((o = n.contact) == null ? void 0 : o.external_id) ?? `anonymous:${await ql(`${s.id}:${r}`)}`;
    return [
      {
        externalMessageId: n.message.external_id ?? n.event_id,
        externalContactId: a,
        externalThreadId: r,
        contactName: (c = n.contact) == null ? void 0 : c.name,
        contactAvatarUrl: (d = n.contact) == null ? void 0 : d.avatar_url,
        isAnonymous: !((l = n.contact) != null && l.external_id),
        messageType: n.message.type,
        content: n.message.text,
        attachments: n.message.attachments.map((u) => ({
          type: typeof u.type == "string" ? u.type : "file",
          url: typeof u.url == "string" ? u.url : void 0,
          fileId: typeof u.file_id == "string" ? u.file_id : void 0,
          mimeType: typeof u.mime_type == "string" ? u.mime_type : void 0,
          fileName: typeof u.file_name == "string" ? u.file_name : void 0,
          size: typeof u.size == "number" ? u.size : void 0
        })),
        rawPayload: n,
        receivedAt: n.timestamp ?? V()
      }
    ];
  }
  async sendMessage(e, s) {
    if (!e.outboundUrl)
      return { externalMessageId: s.messageId };
    const n = {
      event_type: "message.send",
      conversation_id: s.conversationId,
      message_id: s.messageId,
      message: {
        type: s.messageType,
        text: s.content,
        attachments: s.attachments ?? []
      }
    }, r = JSON.stringify(n), a = new Headers({ "content-type": "application/json" });
    e.webhookSecretCiphertext && a.set("x-supportly-signature", await zl(e.webhookSecretCiphertext, r));
    const i = await fetch(e.outboundUrl, {
      method: "POST",
      headers: a,
      body: r
    });
    if (!i.ok)
      throw new v("MESSAGE_SEND_FAILED", `Outbound webhook failed: ${i.status}`, 502);
    return { externalMessageId: s.messageId };
  }
}
class tw {
  constructor() {
    p(this, "type", "forum");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, s) {
    return { externalMessageId: s.messageId };
  }
}
const hp = oe({
  id: mt(),
  is_bot: Ct().optional(),
  first_name: O().optional(),
  last_name: O().optional(),
  username: O().optional()
}), sw = oe({
  id: mt(),
  type: O(),
  first_name: O().optional(),
  last_name: O().optional(),
  username: O().optional(),
  title: O().optional()
}), nw = oe({
  file_id: O(),
  file_unique_id: O(),
  file_size: mt().optional(),
  width: mt(),
  height: mt()
}), rw = oe({
  message_id: mt(),
  date: mt(),
  chat: sw,
  from: hp.optional(),
  text: O().optional(),
  caption: O().optional(),
  photo: co(nw).optional(),
  reply_to_message: oe({
    message_id: mt(),
    text: O().optional(),
    caption: O().optional()
  }).optional()
}), aw = oe({
  update_id: mt(),
  message: rw.optional()
}), Kl = oe({
  ok: Ct(),
  result: oe({
    message_id: mt()
  }).optional(),
  description: O().optional()
}), iw = oe({
  ok: Ct(),
  result: Ct().optional(),
  description: O().optional()
}), ow = oe({
  ok: Ct(),
  result: hp.extend({
    can_join_groups: Ct().optional(),
    can_read_all_group_messages: Ct().optional(),
    supports_inline_queries: Ct().optional()
  }).optional(),
  description: O().optional()
}), cw = oe({
  ok: Ct(),
  result: oe({
    url: O(),
    has_custom_certificate: Ct().optional(),
    pending_update_count: mt(),
    ip_address: O().optional(),
    last_error_date: mt().optional(),
    last_error_message: O().optional(),
    last_synchronization_error_date: mt().optional(),
    max_connections: mt().optional(),
    allowed_updates: co(O()).optional()
  }).optional(),
  description: O().optional()
});
class fp {
  constructor() {
    p(this, "type", "telegram");
  }
  async verify(e, s) {
    if (!s.webhookSecretCiphertext) return;
    const n = e.headers.get("x-telegram-bot-api-secret-token");
    if (!n || !Fr(n, s.webhookSecretCiphertext))
      throw new v("SIGNATURE_INVALID", "Invalid Telegram webhook secret", 401);
  }
  async parseInbound(e, s, n) {
    var c, d;
    const r = aw.parse(await e.json()), a = r.message;
    if (!a || !a.from)
      return [];
    const i = String(a.from.id), o = String(a.chat.id);
    return n && (i === n || o === n) ? this.parseAdminReply(r, a, s, n) : (c = a.text) != null && c.trim() ? [
      {
        externalMessageId: String(r.update_id),
        externalContactId: i,
        externalThreadId: String(a.chat.id),
        contactName: Jr(a.from) ?? Jr(a.chat),
        isAnonymous: !1,
        messageType: "text",
        content: a.text,
        attachments: [],
        rawPayload: r,
        receivedAt: new Date(a.date * 1e3).toISOString()
      }
    ] : (d = a.photo) != null && d.length ? this.parsePhotoInbound(r, a, s) : [];
  }
  async parseAdminReply(e, s, n, r) {
    const a = s.reply_to_message;
    if (!(a != null && a.text))
      return await this.sendWarning(n, r, s.message_id), [];
    const i = a.text.match(/#conv_(\w+)/);
    return i ? [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(s.from.id),
        externalThreadId: String(s.chat.id),
        contactName: Jr(s.from) ?? "Admin",
        isAnonymous: !1,
        messageType: "text",
        content: s.text,
        attachments: [],
        rawPayload: e,
        receivedAt: new Date(s.date * 1e3).toISOString(),
        agentReply: {
          replyToConversationId: i[1]
        }
      }
    ] : (await this.sendWarning(n, r, s.message_id), []);
  }
  async parsePhotoInbound(e, s, n) {
    const r = n.credentialCiphertext;
    if (!r) return [];
    const a = s.photo.reduce((o, c) => (o.file_size ?? 0) > (c.file_size ?? 0) ? o : c), i = await this.getFileUrl(r, a.file_id);
    return [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(s.from.id),
        externalThreadId: String(s.chat.id),
        contactName: Jr(s.from) ?? Jr(s.chat),
        isAnonymous: !1,
        messageType: "image",
        content: s.caption ?? "",
        attachments: [{ type: "image", url: i.url, mimeType: i.mimeType, fileName: i.fileName, size: a.file_size ?? 0 }],
        rawPayload: e,
        receivedAt: new Date(s.date * 1e3).toISOString()
      }
    ];
  }
  async getFileUrl(e, s) {
    var l, u;
    const a = (l = (await (await fetch(`https://api.telegram.org/bot${e}/getFile?file_id=${s}`)).json()).result) == null ? void 0 : l.file_path;
    if (!a) throw new Error("Telegram getFile failed: no file_path");
    const i = a.split("/").pop() ?? "photo.jpg", o = ((u = i.split(".").pop()) == null ? void 0 : u.toLowerCase()) ?? "", d = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[o] ?? "image/jpeg";
    return { url: `https://api.telegram.org/file/bot${e}/${a}`, fileName: i, mimeType: d };
  }
  async sendWarning(e, s, n) {
    const r = e.credentialCiphertext;
    if (r)
      try {
        await fetch(`https://api.telegram.org/bot${r}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: s,
            reply_to_message_id: n,
            text: "⚠️ 普通回复无效，请<b>引用回复</b>通知消息，否则客户不会收到任何回复。",
            parse_mode: "HTML"
          })
        });
      } catch {
      }
  }
  async sendMessage(e, s) {
    const n = e.credentialCiphertext;
    if (!n)
      throw new v("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    if (s.messageType === "image" && s.fileData)
      return this.sendPhoto(e, s);
    if (s.messageType !== "text")
      throw new v("MESSAGE_TYPE_NOT_SUPPORTED", "Telegram media outbound is not supported yet", 400);
    const r = await fetch(`https://api.telegram.org/bot${n}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: s.externalThreadId,
        text: s.content ?? ""
      })
    }), a = Kl.parse(await r.json().catch(() => ({ ok: !1 })));
    if (!r.ok || !a.ok || !a.result)
      throw new v(
        "MESSAGE_SEND_FAILED",
        `Telegram sendMessage failed: ${r.status}${a.description ? ` ${a.description}` : ""}`,
        502
      );
    return { externalMessageId: String(a.result.message_id) };
  }
  async sendPhoto(e, s) {
    const n = e.credentialCiphertext, r = new FormData();
    r.append("chat_id", s.externalThreadId), r.append("photo", new Blob([s.fileData]), s.fileName ?? "photo.jpg"), s.content && (r.append("caption", s.content), r.append("parse_mode", "HTML"));
    const a = await fetch(`https://api.telegram.org/bot${n}/sendPhoto`, {
      method: "POST",
      body: r
    }), i = Kl.parse(await a.json().catch(() => ({ ok: !1 })));
    if (!a.ok || !i.ok || !i.result)
      throw new v(
        "MESSAGE_SEND_FAILED",
        `Telegram sendPhoto failed: ${a.status}${i.description ? ` ${i.description}` : ""}`,
        502
      );
    return { externalMessageId: String(i.result.message_id) };
  }
  async setWebhook(e, s) {
    const n = iw.parse(
      await this.callTelegram(e, "setWebhook", {
        url: s.webhookUrl,
        secret_token: e.webhookSecretCiphertext || void 0,
        allowed_updates: ["message"],
        drop_pending_updates: s.dropPendingUpdates ?? !1
      })
    );
    if (!n.ok || !n.result)
      throw new v("TELEGRAM_SET_WEBHOOK_FAILED", n.description ?? "Telegram setWebhook failed", 502);
    return {
      ok: !0,
      description: n.description,
      webhookUrl: s.webhookUrl,
      webhookInfo: await this.getWebhookInfo(e)
    };
  }
  async testConnection(e, s) {
    const n = await this.getMe(e), r = await this.getWebhookInfo(e);
    return {
      bot: n,
      webhookInfo: r,
      webhookUrlMatches: s ? r.url === s : !!r.url,
      expectedWebhookUrl: s
    };
  }
  async getMe(e) {
    const s = ow.parse(await this.callTelegram(e, "getMe"));
    if (!s.ok || !s.result)
      throw new v("TELEGRAM_GET_ME_FAILED", s.description ?? "Telegram getMe failed", 502);
    return {
      id: s.result.id,
      isBot: s.result.is_bot,
      firstName: s.result.first_name,
      username: s.result.username
    };
  }
  async getWebhookInfo(e) {
    const s = cw.parse(await this.callTelegram(e, "getWebhookInfo"));
    if (!s.ok || !s.result)
      throw new v("TELEGRAM_GET_WEBHOOK_INFO_FAILED", s.description ?? "Telegram getWebhookInfo failed", 502);
    return {
      url: s.result.url,
      pendingUpdateCount: s.result.pending_update_count,
      lastErrorDate: s.result.last_error_date,
      lastErrorMessage: s.result.last_error_message,
      allowedUpdates: s.result.allowed_updates
    };
  }
  async callTelegram(e, s, n) {
    const r = e.credentialCiphertext;
    if (!r)
      throw new v("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const a = await fetch(`https://api.telegram.org/bot${r}/${s}`, {
      method: n ? "POST" : "GET",
      headers: n ? { "content-type": "application/json" } : void 0,
      body: n ? JSON.stringify(n) : void 0
    }), i = await a.json().catch(() => ({ ok: !1 }));
    if (!a.ok) {
      const o = typeof i == "object" && i && "description" in i ? String(i.description) : `HTTP ${a.status}`;
      throw new v("TELEGRAM_API_FAILED", `Telegram ${s} failed: ${o}`, 502);
    }
    return i;
  }
}
function Jr(t) {
  return [t.first_name, t.last_name].filter(Boolean).join(" ").trim() || t.username || t.title || void 0;
}
class dw {
  constructor() {
    p(this, "type", "web_chat");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, s) {
    return { externalMessageId: s.messageId };
  }
}
class lw {
  constructor(e, s) {
    this.search = e, this.instanceName = s;
  }
  async uploadDocument(e) {
    return this.search.items.upload(e.path, e.content, {
      metadata: e.metadata
    });
  }
  async uploadDocumentAndPoll(e) {
    return this.search.items.uploadAndPoll(e.path, e.content, {
      metadata: e.metadata,
      timeoutMs: 3e4
    });
  }
  async deleteDocument(e) {
    await this.search.items.delete(e);
  }
  async listDocuments() {
    const e = [];
    let n = 1;
    for (; ; ) {
      const r = await this.search.items.list({
        page: n,
        per_page: 50,
        sort_by: "modified_at"
      }), a = r.result ?? [];
      e.push(...a);
      const i = r.result_info, o = (i == null ? void 0 : i.total_count) ?? e.length, c = (i == null ? void 0 : i.page) ?? n, d = (i == null ? void 0 : i.per_page) ?? 50;
      if (e.length >= o || a.length === 0 || (n = c + 1, n > Math.ceil(o / d) + 1)) break;
    }
    return e;
  }
  async searchKnowledge(e) {
    try {
      return ((await this.search.search({
        messages: [{ role: "user", content: e }],
        ai_search_options: {
          retrieval: {
            retrieval_type: "vector",
            max_num_results: 5,
            match_threshold: 0.35
          }
        }
      })).chunks ?? []).map((n) => {
        var r, a, i, o, c;
        return {
          id: n.id,
          title: String(((a = (r = n.item) == null ? void 0 : r.metadata) == null ? void 0 : a.filename) ?? ((i = n.item) == null ? void 0 : i.key) ?? "Knowledge"),
          path: ((o = n.item) == null ? void 0 : o.key) ?? "",
          score: n.score ?? 0,
          text: n.text ?? "",
          metadata: ((c = n.item) == null ? void 0 : c.metadata) ?? {}
        };
      });
    } catch {
      return [];
    }
  }
}
const uw = "@cf/meta/llama-3.1-8b-instruct", hw = "kb/", fw = 4 * 1024 * 1024, pw = "media/", mw = 10 * 1024 * 1024, gw = 50 * 1024 * 1024;
class yw {
  constructor(e, s) {
    this.ai = e, this.env = s;
  }
  async generateKnowledgeReply(e) {
    const s = this.env.DEFAULT_AI_MODEL || uw, n = Date.now(), r = ww(e.question, e.references), a = await this.ai.run(s, { prompt: r });
    return {
      text: _w(a),
      metadata: {
        model: s,
        latencyMs: Date.now() - n,
        referencesCount: e.references.length
      }
    };
  }
}
function ww(t, e) {
  const s = e.map((n, r) => `Source ${r + 1}: ${n.title}
${n.text}`).join(`

`);
  return [
    "You are a customer support assistant.",
    "Answer the customer only using the knowledge context.",
    "If the answer is not in the context, say you are not sure and ask a human agent to help.",
    "",
    `Question: ${t}`,
    "",
    `Knowledge context:
${s}`
  ].join(`
`);
}
function _w(t) {
  if (typeof t == "string") return t;
  if (t && typeof t == "object") {
    const e = t;
    if (typeof e.response == "string") return e.response;
    if (typeof e.result == "string") return e.result;
    if (typeof e.text == "string") return e.text;
  }
  return "抱歉，我暂时无法根据知识库生成回答。";
}
class vw {
  constructor(e, s, n) {
    this.aiSearch = e, this.workersAi = s, this.messages = n;
  }
  async maybeCreateReply(e) {
    var s;
    if (e.handoffStatus === "agent" || !((s = e.messageContent) != null && s.trim()) || !this.aiSearch || !this.workersAi) return null;
    try {
      const n = await this.aiSearch.searchKnowledge(e.messageContent);
      if (n.length === 0) return null;
      const r = await this.workersAi.generateKnowledgeReply({
        question: e.messageContent,
        references: n
      });
      return this.messages.createOutbound({
        conversationId: e.conversationId,
        channelAccountId: e.channelAccountId,
        senderType: "ai",
        content: r.text,
        status: "sending",
        aiMetadata: r.metadata,
        aiReferences: n.map((a) => ({
          id: a.id,
          title: a.title,
          path: a.path,
          score: a.score
        }))
      });
    } catch {
      return null;
    }
  }
}
function Ao(t) {
  return {
    id: t.id,
    channelType: t.channel_type,
    displayName: t.display_name,
    externalAccountId: t.external_account_id,
    credentialCiphertext: t.credential_ciphertext,
    webhookSecretCiphertext: t.webhook_secret_ciphertext,
    outboundUrl: t.outbound_url,
    status: t.status,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
class bw {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        ORDER BY created_at DESC
        `
    ).all()).results.map(Ao);
  }
  async findById(e) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE id = ?
        LIMIT 1
        `
    ).bind(e).first();
    return s ? Ao(s) : null;
  }
  async findByType(e) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE channel_type = ? AND status = 'active'
        LIMIT 1
        `
    ).bind(e).first();
    return s ? Ao(s) : null;
  }
  async create(e) {
    const s = Ie("ch"), n = V();
    await this.db.prepare(
      `
        INSERT INTO channel_accounts (
          id,
          channel_type,
          display_name,
          external_account_id,
          credential_ciphertext,
          webhook_secret_ciphertext,
          outbound_url,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        `
    ).bind(
      s,
      e.channelType,
      e.displayName,
      e.externalAccountId ?? null,
      e.credentialCiphertext ?? null,
      e.webhookSecretCiphertext ?? null,
      e.outboundUrl ?? null,
      n,
      n
    ).run();
    const r = await this.findById(s);
    if (!r) throw new Error("Created channel account not found");
    return r;
  }
  async update(e, s) {
    const n = V(), r = [], a = [];
    if (s.displayName !== void 0 && (r.push("display_name = ?"), a.push(s.displayName)), s.externalAccountId !== void 0 && (r.push("external_account_id = ?"), a.push(s.externalAccountId)), s.credentialCiphertext !== void 0 && (r.push("credential_ciphertext = ?"), a.push(s.credentialCiphertext)), s.webhookSecretCiphertext !== void 0 && (r.push("webhook_secret_ciphertext = ?"), a.push(s.webhookSecretCiphertext)), s.outboundUrl !== void 0 && (r.push("outbound_url = ?"), a.push(s.outboundUrl)), r.length === 0) {
      const o = await this.findById(e);
      if (!o) throw new Error("Channel account not found");
      return o;
    }
    r.push("updated_at = ?"), a.push(n), a.push(e), await this.db.prepare(`UPDATE channel_accounts SET ${r.join(", ")} WHERE id = ?`).bind(...a).run();
    const i = await this.findById(e);
    if (!i) throw new Error("Channel account not found after update");
    return i;
  }
}
class Sw {
  constructor(e, s) {
    this.channels = e, this.adapters = s;
  }
  listAccounts() {
    return this.channels.list();
  }
  createAccount(e) {
    return this.adapters.get(e.channelType), this.channels.create(e);
  }
  async getAccount(e) {
    const s = await this.channels.findById(e);
    if (!s)
      throw new v("CHANNEL_NOT_FOUND", "Channel account not found", 404);
    return s;
  }
  async getAccountByType(e) {
    return this.channels.findByType(e);
  }
  async updateAccount(e, s) {
    return await this.getAccount(e), this.channels.update(e, s);
  }
  getAdapter(e) {
    return this.adapters.get(e.channelType);
  }
}
function $s(t) {
  return {
    id: t.id,
    channelAccountId: t.channel_account_id,
    externalContactId: t.external_contact_id,
    externalThreadId: t.external_thread_id,
    contactName: t.contact_name,
    contactAvatarUrl: t.contact_avatar_url,
    isAnonymous: t.is_anonymous === 1,
    status: t.status,
    handoffStatus: t.handoff_status,
    assigneeAdminUserId: t.assignee_admin_user_id,
    lastMessageId: t.last_message_id,
    lastMessageAt: t.last_message_at,
    unreadCount: t.unread_count,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    resolvedAt: t.resolved_at
  };
}
class Ew {
  constructor(e) {
    this.db = e;
  }
  async listOpen(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'open'
        ORDER BY last_message_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map($s);
  }
  async listResolved(e = 50) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE status = 'resolved'
        ORDER BY resolved_at DESC
        LIMIT ?
        `
    ).bind(e).all()).results.map($s);
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM conversations WHERE id = ? LIMIT 1").bind(e).first();
    return s ? $s(s) : null;
  }
  async findByExternalThread(e, s) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
          AND external_thread_id = ?
        LIMIT 1
        `
    ).bind(e, s).first();
    return n ? $s(n) : null;
  }
  async findLatestByExternalContact(e, s) {
    const n = await this.db.prepare(
      "SELECT * FROM conversations WHERE channel_account_id = ? AND external_contact_id = ? ORDER BY last_message_at DESC LIMIT 1"
    ).bind(e, s).first();
    return n ? $s(n) : null;
  }
  async create(e) {
    const s = Ie("conv"), n = V();
    await this.db.prepare(
      `
        INSERT INTO conversations (
          id,
          channel_account_id,
          external_contact_id,
          external_thread_id,
          contact_name,
          contact_avatar_url,
          is_anonymous,
          status,
          handoff_status,
          unread_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'open', 'bot', 0, ?, ?)
        `
    ).bind(
      s,
      e.channelAccountId,
      e.externalContactId,
      e.externalThreadId,
      e.contactName ?? null,
      e.contactAvatarUrl ?? null,
      e.isAnonymous ? 1 : 0,
      n,
      n
    ).run();
    const r = await this.findById(s);
    if (!r) throw new Error("Created conversation not found");
    return r;
  }
  async findOrCreateByExternalThread(e) {
    return await this.findByExternalThread(e.channelAccountId, e.externalThreadId) ?? this.create(e);
  }
  async touchAfterInbound(e, s, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            unread_count = unread_count + 1,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(s, n, n, e).run();
  }
  async touchAfterOutbound(e, s, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(s, n, n, e).run();
  }
  async markRead(e) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET unread_count = 0,
            updated_at = ?
        WHERE id = ?
          AND unread_count > 0
        `
    ).bind(V(), e).run();
  }
  async setHandoffStatus(e, s) {
    await this.db.prepare("UPDATE conversations SET handoff_status = ?, updated_at = ? WHERE id = ?").bind(s, V(), e).run();
  }
  async resolve(e) {
    const s = V();
    await this.db.prepare("UPDATE conversations SET status = 'resolved', resolved_at = ?, updated_at = ? WHERE id = ?").bind(s, s, e).run();
  }
  async reopen(e) {
    await this.db.prepare("UPDATE conversations SET status = 'open', resolved_at = NULL, updated_at = ? WHERE id = ?").bind(V(), e).run();
  }
  async listByChannel(e, s = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
        ORDER BY last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, s, n).all()).results.map($s);
  }
  async listByExternalContact(e, s) {
    let n = "SELECT c.* FROM conversations c";
    const r = [];
    return s && (n += " INNER JOIN channel_accounts ca ON ca.id = c.channel_account_id AND ca.channel_type = ?", r.push(s)), n += " WHERE c.external_contact_id = ? ORDER BY c.last_message_at DESC", r.push(e), (await this.db.prepare(n).bind(...r).all()).results.map($s);
  }
  async countByChannel(e) {
    const s = await this.db.prepare("SELECT COUNT(*) as cnt FROM conversations WHERE channel_account_id = ?").bind(e).first();
    return (s == null ? void 0 : s.cnt) ?? 0;
  }
  async listByChannelWithFirstMessage(e, s = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT c.*, m.raw_payload_json AS first_message_raw_payload
        FROM conversations c
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at ASC
          LIMIT 1
        )
        WHERE c.channel_account_id = ?
        ORDER BY c.last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, s, n).all()).results.map((a) => ({
      ...$s(a),
      firstMessageRawPayload: a.first_message_raw_payload
    }));
  }
}
class Aw {
  constructor(e, s, n) {
    this.conversations = e, this.messages = s, this.ai = n;
  }
  listOpenConversations() {
    return this.conversations.listOpen();
  }
  listResolvedConversations() {
    return this.conversations.listResolved();
  }
  async getConversation(e) {
    const s = await this.conversations.findById(e);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return s;
  }
  async receiveInboundMessage(e, s = {}) {
    if (e.inbound.externalMessageId) {
      const o = await this.messages.findByExternalMessageId(
        e.channelAccount.id,
        e.inbound.externalMessageId
      );
      if (o)
        return {
          conversationId: o.conversationId,
          inboundMessage: o,
          aiMessage: null,
          duplicate: !0
        };
    }
    const n = await this.conversations.findOrCreateByExternalThread({
      channelAccountId: e.channelAccount.id,
      externalContactId: e.inbound.externalContactId,
      externalThreadId: e.inbound.externalThreadId,
      contactName: e.inbound.contactName,
      contactAvatarUrl: e.inbound.contactAvatarUrl,
      isAnonymous: e.inbound.isAnonymous
    });
    n.status === "resolved" && await this.conversations.reopen(n.id);
    const r = await this.messages.createInbound({
      id: e.messageId,
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      inbound: e.inbound
    }), a = r.message;
    if (!r.created)
      return {
        conversationId: a.conversationId,
        inboundMessage: a,
        aiMessage: null,
        duplicate: !0
      };
    if (await this.conversations.touchAfterInbound(n.id, a.id, a.createdAt), s.createAiReply === !1)
      return {
        conversationId: n.id,
        inboundMessage: a,
        aiMessage: null,
        duplicate: !1
      };
    const i = await this.createAiReply({
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      messageContent: a.content,
      handoffStatus: n.handoffStatus
    });
    return {
      conversationId: n.id,
      inboundMessage: a,
      aiMessage: i,
      duplicate: !1
    };
  }
  async createAiReply(e) {
    try {
      const s = await this.ai.maybeCreateReply(e);
      return s && await this.conversations.touchAfterOutbound(e.conversationId, s.id, s.createdAt), s;
    } catch {
      return null;
    }
  }
  async setHandoff(e, s) {
    return await this.getConversation(e), await this.conversations.setHandoffStatus(e, s), this.getConversation(e);
  }
  async resolve(e) {
    return await this.getConversation(e), await this.conversations.resolve(e), this.getConversation(e);
  }
}
function xo(t) {
  return {
    id: t.id,
    title: t.title,
    sourceType: t.source_type,
    aiSearchInstanceId: t.ai_search_instance_id,
    aiSearchItemId: t.ai_search_item_id,
    aiSearchPath: t.ai_search_path,
    status: t.status,
    fileName: t.file_name,
    fileSize: t.file_size,
    mimeType: t.mime_type,
    checksum: t.checksum,
    metadataJson: t.metadata_json,
    errorMessage: t.error_message,
    createdByAdminUserId: t.created_by_admin_user_id,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    indexedAt: t.indexed_at,
    deletedAt: t.deleted_at
  };
}
class xw {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE deleted_at IS NULL
        ORDER BY updated_at DESC
        `
    ).all()).results.map(xo);
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM kb_documents WHERE id = ? AND deleted_at IS NULL LIMIT 1").bind(e).first();
    return s ? xo(s) : null;
  }
  async findByAiSearchItem(e, s) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE ai_search_instance_id = ?
          AND ai_search_item_id = ?
        LIMIT 1
        `
    ).bind(e, s).first();
    return n ? xo(n) : null;
  }
  async create(e) {
    const s = Ie("kb"), n = V();
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          checksum,
          metadata_json,
          created_by_admin_user_id,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      s,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId ?? null,
      e.aiSearchPath,
      e.status ?? "processing",
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.checksum ?? null,
      e.metadataJson ?? "{}",
      e.createdByAdminUserId ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const r = await this.findById(s);
    if (!r) throw new Error("Created knowledge document not found");
    return r;
  }
  async markDeleted(e) {
    const s = V();
    await this.db.prepare("UPDATE kb_documents SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?").bind(s, s, e).run();
  }
  async upsertFromAiSearchItem(e) {
    const s = await this.findByAiSearchItem(e.aiSearchInstanceId, e.aiSearchItemId), n = V();
    if (s) {
      await this.db.prepare(
        `
          UPDATE kb_documents
          SET title = ?,
              source_type = 'upload',
              ai_search_path = ?,
              status = ?,
              file_name = ?,
              file_size = ?,
              mime_type = ?,
              metadata_json = ?,
              error_message = ?,
              updated_at = ?,
              indexed_at = ?,
              deleted_at = NULL
          WHERE id = ?
          `
      ).bind(
        e.title,
        e.aiSearchPath,
        e.status,
        e.fileName ?? null,
        e.fileSize ?? 0,
        e.mimeType ?? null,
        e.metadataJson ?? "{}",
        e.errorMessage ?? null,
        n,
        e.indexedAt ?? (e.status === "indexed" ? s.indexedAt ?? n : s.indexedAt),
        s.id
      ).run();
      const i = await this.findById(s.id);
      if (!i) throw new Error("Updated knowledge document not found");
      return { document: i, action: "updated" };
    }
    const r = Ie("kb");
    await this.db.prepare(
      `
        INSERT INTO kb_documents (
          id,
          title,
          source_type,
          ai_search_instance_id,
          ai_search_item_id,
          ai_search_path,
          status,
          file_name,
          file_size,
          mime_type,
          metadata_json,
          error_message,
          created_at,
          updated_at,
          indexed_at
        )
        VALUES (?, ?, 'upload', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      r,
      e.title,
      e.aiSearchInstanceId,
      e.aiSearchItemId,
      e.aiSearchPath,
      e.status,
      e.fileName ?? null,
      e.fileSize ?? 0,
      e.mimeType ?? null,
      e.metadataJson ?? "{}",
      e.errorMessage ?? null,
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const a = await this.findById(r);
    if (!a) throw new Error("Created knowledge document not found");
    return { document: a, action: "created" };
  }
}
function En(t) {
  return JSON.stringify(t ?? null);
}
class Cw {
  constructor(e, s) {
    this.knowledge = e, this.aiSearch = s;
  }
  listDocuments() {
    return this.knowledge.list();
  }
  requireAiSearch() {
    if (!this.aiSearch)
      throw new v("AI_SEARCH_NOT_CONFIGURED", "AI Search is not configured", 503);
    return this.aiSearch;
  }
  async uploadDocument(e) {
    const s = this.requireAiSearch();
    if (e.file.size > fw)
      throw new v("KNOWLEDGE_FILE_TOO_LARGE", "Knowledge file is larger than 4MB", 400);
    const n = Ie("kb"), r = e.file.name.replace(/[^\w.\-]+/g, "_"), a = `${hw}${n}/${r}`, i = await Tw(e.file), o = await this.uploadToAiSearch(s, a, i), c = await this.knowledge.create({
      title: e.title || e.file.name,
      aiSearchInstanceId: s.instanceName,
      aiSearchItemId: o.id,
      aiSearchPath: o.key || a,
      status: Co(o.status),
      fileName: e.file.name,
      fileSize: e.file.size,
      mimeType: e.file.type || void 0,
      metadataJson: En({ filename: e.file.name, source: "upload" }),
      indexedAt: Co(o.status) === "indexed" ? o.last_seen_at ?? o.created_at : void 0,
      createdByAdminUserId: e.createdByAdminUserId
    });
    try {
      return await this.syncFromAiSearch(), await this.knowledge.findById(c.id) ?? c;
    } catch {
      return c;
    }
  }
  async uploadToAiSearch(e, s, n) {
    try {
      return await e.uploadDocument({ path: s, content: n });
    } catch (r) {
      throw new v(
        "KNOWLEDGE_UPLOAD_FAILED",
        `AI Search upload failed: ${r instanceof Error ? r.message : String(r)}`,
        502
      );
    }
  }
  async deleteDocument(e) {
    const s = this.requireAiSearch(), n = await this.knowledge.findById(e);
    if (!n)
      throw new v("KNOWLEDGE_DOCUMENT_NOT_FOUND", "Knowledge document not found", 404);
    n.aiSearchItemId && await s.deleteDocument(n.aiSearchItemId), await this.knowledge.markDeleted(e);
  }
  async syncFromAiSearch() {
    const e = this.requireAiSearch(), s = await e.listDocuments(), n = {
      instanceName: e.instanceName,
      scanned: s.length,
      created: 0,
      updated: 0,
      failed: 0
    };
    for (const r of s)
      try {
        const a = Co(r.status), i = r.metadata ?? {}, o = Qa(i.filename) ?? Iw(r.key), c = await this.knowledge.upsertFromAiSearchItem({
          title: Qa(i.title) ?? o ?? r.key,
          aiSearchInstanceId: e.instanceName,
          aiSearchItemId: r.id,
          aiSearchPath: r.key,
          status: a,
          fileName: o,
          fileSize: r.file_size ?? 0,
          mimeType: Qa(i.mime_type) ?? Qa(i.content_type),
          metadataJson: En({
            ...i,
            ai_search_source_id: r.source_id,
            ai_search_status: r.status,
            chunks_count: r.chunks_count,
            created_at: r.created_at,
            last_seen_at: r.last_seen_at
          }),
          errorMessage: a === "failed" ? `AI Search item status: ${r.status ?? "unknown"}` : void 0,
          indexedAt: a === "indexed" ? r.last_seen_at ?? r.created_at : void 0
        });
        c.action === "created" && (n.created += 1), c.action === "updated" && (n.updated += 1);
      } catch {
        n.failed += 1;
      }
    return n;
  }
}
function Co(t) {
  switch (t) {
    case "completed":
      return "indexed";
    case "error":
    case "skipped":
      return "failed";
    case "queued":
    case "running":
    case "outdated":
    default:
      return "processing";
  }
}
function Qa(t) {
  return typeof t == "string" && t.trim() ? t : void 0;
}
function Iw(t) {
  return t.split("/").filter(Boolean).at(-1) ?? t;
}
async function Tw(t) {
  return kw(t) ? t.text() : t.arrayBuffer();
}
function kw(t) {
  const e = t.name.toLowerCase(), s = t.type.toLowerCase();
  return s.startsWith("text/") || s === "application/json" || s === "application/xml" || s === "application/x-yaml" || e.endsWith(".md") || e.endsWith(".mdx") || e.endsWith(".txt") || e.endsWith(".html") || e.endsWith(".htm") || e.endsWith(".json") || e.endsWith(".csv") || e.endsWith(".yaml") || e.endsWith(".yml");
}
function Zr(t) {
  return {
    id: t.id,
    conversationId: t.conversation_id,
    channelAccountId: t.channel_account_id,
    externalMessageId: t.external_message_id,
    direction: t.direction,
    senderType: t.sender_type,
    senderAdminUserId: t.sender_admin_user_id,
    clientMessageId: t.client_message_id,
    messageType: t.message_type,
    content: t.content,
    attachmentsJson: t.attachments_json,
    rawPayloadJson: t.raw_payload_json,
    aiMetadataJson: t.ai_metadata_json,
    aiReferencesJson: t.ai_references_json,
    status: t.status,
    errorMessage: t.error_message,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
function wd(t) {
  if (!t) return [];
  try {
    const e = JSON.parse(t);
    return Array.isArray(e) ? e.filter(Rw) : [];
  } catch {
    return [];
  }
}
function Rw(t) {
  if (!t || typeof t != "object") return !1;
  const e = t;
  return e.type !== "image" && e.type !== "file" && e.type !== "audio" && e.type !== "video" ? !1 : nr(e.url) && nr(e.fileId) && nr(e.r2Key) && nr(e.mimeType) && nr(e.fileName) && ei(e.size) && ei(e.width) && ei(e.height) && ei(e.durationMs) && nr(e.thumbnailR2Key);
}
function nr(t) {
  return t === void 0 || typeof t == "string";
}
function ei(t) {
  return t === void 0 || typeof t == "number";
}
const Wl = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]), Vl = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/quicktime"]);
class Ow {
  constructor(e, s) {
    this.bucket = e, this.messages = s;
  }
  async storeUpload(e) {
    var l;
    const s = this.requireBucket(), n = ((l = e.fileName) == null ? void 0 : l.trim()) || e.file.name || "upload", r = Nw(e.mimeType || e.file.type, n), a = Mw(r), i = a === "image" ? mw : gw;
    if (e.file.size > i)
      throw new v(
        "MEDIA_FILE_TOO_LARGE",
        `${a === "image" ? "Image" : "Video"} file is too large`,
        400,
        { maxBytes: i }
      );
    const o = Ie("att"), c = pp(n || o), d = `${pw}${e.conversationId}/${e.messageId}/${o}/${c}`;
    return await s.put(d, e.file.stream(), {
      httpMetadata: {
        contentType: r,
        contentDisposition: Gl(n || c)
      },
      customMetadata: {
        conversationId: e.conversationId,
        messageId: e.messageId,
        attachmentId: o,
        fileName: n || c
      }
    }), {
      messageType: a,
      attachment: {
        type: a,
        r2Key: d,
        fileName: n || c,
        mimeType: r,
        size: e.file.size
      }
    };
  }
  async getMessageAttachmentResponse(e) {
    const s = await this.messages.findById(e.messageId);
    if (!s || s.conversationId !== e.conversationId)
      throw new v("MESSAGE_NOT_FOUND", "Message not found", 404);
    const n = wd(s.attachmentsJson)[e.attachmentIndex];
    if (!n)
      throw new v("ATTACHMENT_NOT_FOUND", "Attachment not found", 404);
    if (!n.r2Key) {
      if (n.url) return Response.redirect(n.url, 302);
      throw new v("ATTACHMENT_NOT_FOUND", "Attachment is not stored in Supportly", 404);
    }
    const r = this.requireBucket(), a = e.request.headers.get("range"), i = await r.get(
      n.r2Key,
      a ? { range: e.request.headers } : void 0
    );
    if (!i)
      throw new v("ATTACHMENT_NOT_FOUND", "Attachment file not found", 404);
    const o = new Headers();
    if (i.writeHttpMetadata(o), o.set("etag", i.httpEtag), o.set("accept-ranges", "bytes"), o.set("cache-control", "private, max-age=300"), o.set("content-type", n.mimeType || o.get("content-type") || "application/octet-stream"), n.fileName && !o.has("content-disposition") && o.set("content-disposition", Gl(n.fileName)), i.range) {
      const c = Pw(i.range, i.size);
      return o.set("content-range", `bytes ${c.start}-${c.end}/${i.size}`), o.set("content-length", String(c.length)), new Response(i.body, { status: 206, headers: o });
    }
    return o.set("content-length", String(i.size)), new Response(i.body, { headers: o });
  }
  requireBucket() {
    if (!this.bucket)
      throw new v("MEDIA_STORAGE_NOT_CONFIGURED", "Media storage is not configured", 500);
    return this.bucket;
  }
}
function Nw(t, e) {
  const s = t.trim().toLowerCase();
  if (s && s !== "application/octet-stream")
    return s;
  const n = Dw(e);
  if (!n)
    throw new v("MEDIA_MIME_TYPE_REQUIRED", "Media file type is required", 400);
  return n;
}
function Mw(t) {
  if (Wl.has(t)) return "image";
  if (Vl.has(t)) return "video";
  throw new v("MEDIA_TYPE_NOT_SUPPORTED", "Only image and video files are supported", 400, {
    allowedMimeTypes: [...Wl, ...Vl]
  });
}
function pp(t) {
  return t.trim().replace(/[^\w.\-]+/g, "_").replace(/^_+|_+$/g, "") || "upload";
}
function Dw(t) {
  const e = t.toLowerCase();
  if (e.endsWith(".jpg") || e.endsWith(".jpeg")) return "image/jpeg";
  if (e.endsWith(".png")) return "image/png";
  if (e.endsWith(".gif")) return "image/gif";
  if (e.endsWith(".webp")) return "image/webp";
  if (e.endsWith(".mp4")) return "video/mp4";
  if (e.endsWith(".webm")) return "video/webm";
  if (e.endsWith(".mov") || e.endsWith(".qt")) return "video/quicktime";
}
function Gl(t) {
  return `inline; filename="${pp(t).replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(t)}`;
}
function Pw(t, e) {
  const s = t;
  if (typeof s.offset == "number" && typeof s.length == "number") {
    const a = s.offset, i = Math.min(e - 1, s.offset + s.length - 1);
    return { start: a, end: i, length: i - a + 1 };
  }
  if (typeof s.offset == "number" && typeof s.end == "number") {
    const a = s.offset, i = Math.min(e - 1, s.end);
    return { start: a, end: i, length: i - a + 1 };
  }
  const n = Math.min(e, s.suffix ?? e);
  return { start: Math.max(0, e - n), end: e - 1, length: n };
}
class Bw {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM messages WHERE id = ? LIMIT 1").bind(e).first();
    return s ? Zr(s) : null;
  }
  async findByExternalMessageId(e, s) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE channel_account_id = ?
          AND external_message_id = ?
        LIMIT 1
        `
    ).bind(e, s).first();
    return n ? Zr(n) : null;
  }
  async findByClientMessageId(e) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND sender_type = ?
          AND (
            (? IS NULL AND sender_admin_user_id IS NULL)
            OR sender_admin_user_id = ?
          )
          AND client_message_id = ?
        LIMIT 1
        `
    ).bind(
      e.conversationId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.senderAdminUserId ?? null,
      e.clientMessageId
    ).first();
    return s ? Zr(s) : null;
  }
  async listByConversation(e, s = 100) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT ?
        `
    ).bind(e, s).all()).results.map(Zr);
  }
  async listByConversationAfter(e, s, n = 100) {
    if (!s)
      return this.listByConversation(e, n);
    const r = await this.findById(s);
    return !r || r.conversationId !== e ? [] : (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
          AND (
            created_at > ?
            OR (created_at = ? AND id > ?)
          )
        ORDER BY created_at ASC, id ASC
        LIMIT ?
        `
    ).bind(e, r.createdAt, r.createdAt, r.id, n).all()).results.map(Zr);
  }
  async createInbound(e) {
    const s = e.id ?? Ie("msg"), n = e.inbound.receivedAt || V();
    await this.db.prepare(
      `
        INSERT OR IGNORE INTO messages (
          id,
          conversation_id,
          channel_account_id,
          external_message_id,
          direction,
          sender_type,
          message_type,
          content,
          attachments_json,
          raw_payload_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 'inbound', 'customer', ?, ?, ?, ?, 'received', ?, ?)
        `
    ).bind(
      s,
      e.conversationId,
      e.channelAccountId,
      e.inbound.externalMessageId ?? null,
      e.inbound.messageType,
      e.inbound.content ?? null,
      En(e.inbound.attachments),
      En(e.inbound.rawPayload),
      n,
      n
    ).run();
    const r = await this.findById(s);
    if (r) return { message: r, created: !0 };
    if (e.inbound.externalMessageId) {
      const a = await this.findByExternalMessageId(e.channelAccountId, e.inbound.externalMessageId);
      if (a) return { message: a, created: !1 };
    }
    throw new Error("Created inbound message not found");
  }
  async createOutbound(e) {
    const s = e.id ?? Ie("msg"), n = V();
    await this.db.prepare(
      `
        INSERT INTO messages (
          id,
          conversation_id,
          channel_account_id,
          direction,
          sender_type,
          sender_admin_user_id,
          client_message_id,
          message_type,
          content,
          attachments_json,
          ai_metadata_json,
          ai_references_json,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, 'outbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      s,
      e.conversationId,
      e.channelAccountId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.clientMessageId ?? null,
      e.messageType ?? "text",
      e.content,
      En(e.attachments ?? []),
      En(e.aiMetadata ?? {}),
      En(e.aiReferences ?? []),
      e.status,
      n,
      n
    ).run();
    const r = await this.findById(s);
    if (!r) throw new Error("Created outbound message not found");
    return r;
  }
  async updateRawPayload(e, s) {
    await this.db.prepare("UPDATE messages SET raw_payload_json = ? WHERE id = ?").bind(s, e).run();
  }
  async updateContent(e, s) {
    await this.db.prepare("UPDATE messages SET content = ?, updated_at = ? WHERE id = ?").bind(s, V(), e).run();
  }
  async markSent(e, s) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'sent',
            external_message_id = COALESCE(?, external_message_id),
            updated_at = ?
        WHERE id = ?
        `
    ).bind(s ?? null, V(), e).run();
  }
  async markFailed(e, s) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(s, V(), e).run();
  }
}
class Uw {
  constructor(e, s, n, r, a) {
    this.channels = e, this.conversations = s, this.messages = n, this.realtime = r, this.media = a;
  }
  async listConversationMessages(e, s) {
    if (!await this.conversations.findById(e))
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return await this.conversations.markRead(e), this.messages.listByConversationAfter(e, s);
  }
  async sendAgentMessage(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const i = await this.messages.findByClientMessageId({
        conversationId: s.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (i) return i;
    }
    const n = await this.channels.getAccount(s.channelAccountId), r = this.channels.getAdapter(n), a = await this.messages.createOutbound({
      conversationId: s.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      content: e.content,
      attachments: [],
      status: "sending"
    });
    try {
      const i = await r.sendMessage(n, {
        conversationId: s.id,
        externalThreadId: s.externalThreadId,
        messageId: a.id,
        messageType: "text",
        content: e.content,
        attachments: []
      });
      await this.messages.markSent(a.id, i.externalMessageId), await this.conversations.touchAfterOutbound(s.id, a.id, a.createdAt);
      const o = await this.messages.findById(a.id), c = await this.conversations.findById(s.id);
      return o && c && await this.realtime.notifyMessageCreated({
        conversation: c,
        message: o
      }), o ?? { ...a, status: "sent", externalMessageId: i.externalMessageId ?? null };
    } catch (i) {
      throw await this.messages.markFailed(a.id, i instanceof Error ? i.message : "Message send failed"), i;
    }
  }
  async sendAgentMediaMessage(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const d = await this.messages.findByClientMessageId({
        conversationId: s.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (d) return d;
    }
    const n = await this.channels.getAccount(s.channelAccountId), r = this.channels.getAdapter(n), a = Ie("msg"), i = await this.media.storeUpload({
      conversationId: s.id,
      messageId: a,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), o = Fw(e.content), c = await this.messages.createOutbound({
      id: a,
      conversationId: s.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      messageType: i.messageType,
      content: o,
      attachments: [i.attachment],
      status: "sending"
    });
    try {
      const d = await r.sendMessage(n, {
        conversationId: s.id,
        externalThreadId: s.externalThreadId,
        messageId: c.id,
        messageType: i.messageType,
        content: o,
        attachments: [i.attachment],
        fileData: await e.file.arrayBuffer(),
        fileName: e.fileName ?? e.file.name
      });
      await this.messages.markSent(c.id, d.externalMessageId), await this.conversations.touchAfterOutbound(s.id, c.id, c.createdAt);
      const l = await this.messages.findById(c.id), u = await this.conversations.findById(s.id);
      return l && u && await this.realtime.notifyMessageCreated({
        conversation: u,
        message: l
      }), l ?? { ...c, status: "sent", externalMessageId: d.externalMessageId ?? null };
    } catch (d) {
      throw await this.messages.markFailed(c.id, d instanceof Error ? d.message : "Message send failed"), d;
    }
  }
  markSent(e, s) {
    return this.messages.markSent(e, s);
  }
  markFailed(e, s) {
    return this.messages.markFailed(e, s);
  }
}
function Fw(t) {
  const e = t == null ? void 0 : t.trim();
  return e || null;
}
function Os(t, e) {
  return {
    id: t.id,
    conversationId: t.conversationId,
    direction: t.direction,
    senderType: t.senderType,
    messageType: t.messageType,
    content: t.content,
    attachments: wd(t.attachmentsJson),
    status: t.status,
    createdAt: t.createdAt,
    externalMessageId: t.externalMessageId,
    avatarUrl: e ?? null
  };
}
const $w = "admin", Jl = "end_user", Io = "https://supportly.internal/__notify";
class Lw {
  constructor(e) {
    this.env = e;
  }
  async notifyMessageCreated(e) {
    const s = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: Os(e.message)
    }, n = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: e.message
    }, r = {
      type: "conversation.updated",
      conversation: e.conversation
    }, a = await Promise.allSettled([
      this.notifyVisitor(e.conversation.id, s),
      this.notifyAdmin(n),
      this.notifyAdmin(r)
    ]);
    for (const i of a)
      i.status === "rejected" && ts.warn("realtime_notify_failed", {
        conversationId: e.conversation.id,
        messageId: e.message.id,
        error: i.reason instanceof Error ? i.reason.message : String(i.reason)
      });
  }
  async notifyVisitor(e, s) {
    const n = this.env.VISITOR_STREAM.idFromName(e), r = this.env.VISITOR_STREAM.get(n);
    await this.notify(r, s);
  }
  async notifyAdmin(e) {
    const s = this.env.ADMIN_STREAM.idFromName($w), n = this.env.ADMIN_STREAM.get(s);
    await this.notify(n, e);
  }
  async notifyEndUserPresence() {
    try {
      const e = this.env.END_USER_STREAM.idFromName(Jl);
      await this.env.END_USER_STREAM.get(e).fetch(Io, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "refresh_presence" })
      });
    } catch {
    }
  }
  async notifyEndUserMessage(e, s) {
    try {
      const n = this.env.END_USER_STREAM.idFromName(Jl);
      await this.env.END_USER_STREAM.get(n).fetch(Io, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "message.new", targetUserId: e, payload: s })
      });
    } catch {
    }
  }
  async notify(e, s) {
    const n = await e.fetch(Io, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(s)
    });
    if (!n.ok)
      throw new Error(`Realtime notify failed with status ${n.status}`);
  }
}
function Zl(t) {
  return {
    id: t.id,
    email: t.email,
    name: t.name,
    passwordHash: t.password_hash,
    role: t.role,
    status: t.status,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
class Hw {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return s ? Zl(s) : null;
  }
  async findByEmail(e) {
    const s = await this.db.prepare("SELECT * FROM admin_users WHERE lower(email) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return s ? Zl(s) : null;
  }
}
const jw = 60 * 60 * 24 * 7;
class qw {
  constructor(e, s) {
    this.adminUsers = e, this.jwtSecret = s;
  }
  async login(e, s) {
    const n = await this.adminUsers.findByEmail(e), r = n ? await Vc(s, n.passwordHash) : !1;
    if (!n || !r)
      throw new v("INVALID_CREDENTIALS", "Invalid email or password", 401);
    const a = Math.floor(Date.now() / 1e3) + jw;
    return {
      token: await this.signToken({
        sub: n.id,
        email: n.email,
        name: n.name,
        role: n.role,
        exp: a
      }),
      tokenType: "Bearer",
      expiresAt: new Date(a * 1e3).toISOString(),
      adminUser: Kw(n)
    };
  }
  async requireAdminUser(e) {
    const s = zw(e.authorization);
    if (s) {
      const r = await this.verifyToken(s), a = await this.adminUsers.findById(r.sub);
      if (!a)
        throw new v("UNAUTHORIZED", "Admin user not found", 401);
      return a;
    }
    if (!e.adminUserId)
      throw new v("UNAUTHORIZED", "Missing admin user", 401);
    const n = await this.adminUsers.findById(e.adminUserId);
    if (!n)
      throw new v("UNAUTHORIZED", "Admin user not found", 401);
    return n;
  }
  async tryGetAdminUser(e) {
    try {
      return await this.requireAdminUser({ authorization: e });
    } catch {
      return null;
    }
  }
  async signToken(e) {
    const s = Ht(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = Ht(JSON.stringify(e)), r = await Un(this.jwtSecret, `${s}.${n}`);
    return `${s}.${n}.${r}`;
  }
  async verifyToken(e) {
    const [s, n, r] = e.split(".");
    if (!s || !n || !r)
      throw new v("UNAUTHORIZED", "Invalid auth token", 401);
    const a = await Un(this.jwtSecret, `${s}.${n}`);
    if (!Fr(r, a))
      throw new v("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(yd(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new v("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function zw(t) {
  if (!t) return null;
  const [e, s] = t.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !s ? null : s;
}
function Kw(t) {
  return {
    id: t.id,
    email: t.email,
    name: t.name,
    role: t.role
  };
}
function Yr(t) {
  return {
    id: t.id,
    username: t.username,
    email: t.email,
    passwordHash: t.password_hash,
    displayName: t.display_name,
    status: t.status,
    rawPayloadJson: t.raw_payload_json,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
class Ww {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM end_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return s ? Yr(s) : null;
  }
  async findByIds(e) {
    if (e.length === 0) return [];
    const s = e.map(() => "?").join(",");
    return (await this.db.prepare(`SELECT * FROM end_users WHERE id IN (${s}) AND status = 'active'`).bind(...e).all()).results.map(Yr);
  }
  async findByUsername(e) {
    const s = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return s ? Yr(s) : null;
  }
  async findByUsernameAny(e) {
    const s = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) LIMIT 1").bind(e).first();
    return s ? Yr(s) : null;
  }
  async listAll() {
    return (await this.db.prepare("SELECT * FROM end_users ORDER BY created_at DESC LIMIT 200").all()).results.map(Yr);
  }
  async approve(e) {
    const s = V();
    return await this.db.prepare("UPDATE end_users SET status = 'active', updated_at = ? WHERE id = ? AND status = 'pending'").bind(s, e).run(), this.findById(e);
  }
  async deactivate(e) {
    const s = V();
    await this.db.prepare("UPDATE end_users SET status = 'pending', updated_at = ? WHERE id = ?").bind(s, e).run();
  }
  async anonymizeConversations(e) {
    const s = V();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 1, contact_name = '匿名访客', updated_at = ? WHERE external_contact_id = ?"
    ).bind(s, e).run();
  }
  async restoreConversations(e, s) {
    const n = V();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 0, contact_name = ?, updated_at = ? WHERE external_contact_id = ?"
    ).bind(s, n, e).run();
  }
  async getConversationCounts() {
    const e = await this.db.prepare("SELECT external_contact_id, COUNT(*) as count FROM conversations GROUP BY external_contact_id").all();
    return new Map(e.results.map((s) => [s.external_contact_id, s.count]));
  }
  async create(e) {
    var i;
    const s = Ie("eu"), n = await up(e.password), r = V(), a = ((i = e.displayName) == null ? void 0 : i.trim()) || e.username;
    return await this.db.prepare(
      "INSERT INTO end_users (id, username, email, password_hash, display_name, status, raw_payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)"
    ).bind(s, e.username, e.email ?? null, n, a, null, r, r).run(), {
      id: s,
      username: e.username,
      email: e.email ?? null,
      displayName: a,
      passwordHash: n,
      status: "pending",
      rawPayloadJson: null,
      createdAt: r,
      updatedAt: r
    };
  }
  async updateRawPayload(e, s) {
    const n = V();
    await this.db.prepare("UPDATE end_users SET raw_payload_json = ?, updated_at = ? WHERE id = ?").bind(s, n, e).run();
  }
  async updatePassword(e, s) {
    const n = V();
    await this.db.prepare("UPDATE end_users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(s, n, e).run();
  }
  async updateDisplayName(e, s) {
    const n = V();
    await this.db.prepare("UPDATE end_users SET display_name = ?, updated_at = ? WHERE id = ?").bind(s, n, e).run();
  }
}
const Vw = 60 * 60 * 24 * 7;
class Gw {
  constructor(e, s) {
    this.endUsers = e, this.jwtSecret = s;
  }
  async login(e, s) {
    const n = await this.endUsers.findByUsername(e), r = n ? await Vc(s, n.passwordHash) : !1;
    if (!n || !r)
      throw new v("INVALID_CREDENTIALS", "Invalid username or password", 401);
    const a = Math.floor(Date.now() / 1e3) + Vw;
    return {
      token: await this.signToken({
        sub: n.id,
        username: n.username,
        displayName: n.displayName,
        exp: a
      }),
      tokenType: "Bearer",
      expiresAt: new Date(a * 1e3).toISOString(),
      user: ti(n)
    };
  }
  async register(e) {
    if (await this.endUsers.findByUsernameAny(e.username))
      throw new v("USERNAME_TAKEN", "Username is already taken", 409);
    const n = await this.endUsers.create(e);
    return ti(n);
  }
  async listUsers() {
    const [e, s] = await Promise.all([
      this.endUsers.listAll(),
      this.endUsers.getConversationCounts()
    ]);
    return e.map((n) => ({
      ...ti(n),
      conversationCount: s.get(n.id) ?? 0
    }));
  }
  async approveUser(e) {
    const s = await this.endUsers.approve(e);
    if (!s)
      throw new v("END_USER_NOT_FOUND", "End user not found or already approved", 404);
    return await this.endUsers.restoreConversations(s.id, s.displayName), ti(s);
  }
  async deactivateUser(e) {
    await this.endUsers.anonymizeConversations(e), await this.endUsers.deactivate(e);
  }
  async requireEndUser(e) {
    const s = Jw(e);
    if (!s)
      throw new v("UNAUTHORIZED", "Missing auth token", 401);
    const n = await this.verifyToken(s), r = await this.endUsers.findById(n.sub);
    if (!r)
      throw new v("UNAUTHORIZED", "End user not found", 401);
    return r;
  }
  async tryGetEndUser(e) {
    try {
      return await this.requireEndUser(e);
    } catch {
      return null;
    }
  }
  async tryGetEndUserById(e) {
    try {
      return await this.endUsers.findById(e);
    } catch {
      return null;
    }
  }
  async getUserProfile(e) {
    const s = await this.endUsers.findById(e);
    if (!s)
      throw new v("END_USER_NOT_FOUND", "End user not found", 404);
    let n = {};
    if (s.rawPayloadJson)
      try {
        n = JSON.parse(s.rawPayloadJson);
      } catch {
      }
    return {
      id: s.id,
      username: s.username,
      displayName: s.displayName,
      email: s.email,
      settings: n.settings || {},
      isMediator: n.is_mediator === !0
    };
  }
  async updateSettings(e, s) {
    const n = await this.endUsers.findById(e);
    if (!n)
      throw new v("END_USER_NOT_FOUND", "End user not found", 404);
    let r = {};
    if (n.rawPayloadJson)
      try {
        r = JSON.parse(n.rawPayloadJson);
      } catch {
      }
    r.settings = { ...r.settings || {}, ...s }, await this.endUsers.updateRawPayload(e, JSON.stringify(r));
  }
  async changePassword(e, s, n) {
    const r = await this.endUsers.findById(e);
    if (!r)
      throw new v("END_USER_NOT_FOUND", "End user not found", 404);
    if (!await Vc(s, r.passwordHash))
      throw new v("INVALID_PASSWORD", "Current password is incorrect", 400);
    const i = await up(n);
    await this.endUsers.updatePassword(e, i);
  }
  async updateDisplayName(e, s) {
    await this.endUsers.updateDisplayName(e, s);
  }
  async signToken(e) {
    const s = Ht(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = Ht(JSON.stringify(e)), r = await Un(this.jwtSecret, `${s}.${n}`);
    return `${s}.${n}.${r}`;
  }
  async verifyToken(e) {
    const [s, n, r] = e.split(".");
    if (!s || !n || !r)
      throw new v("UNAUTHORIZED", "Invalid auth token", 401);
    const a = await Un(this.jwtSecret, `${s}.${n}`);
    if (!Fr(r, a))
      throw new v("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(yd(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new v("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function Jw(t) {
  if (!t) return null;
  const [e, s] = t.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !s ? null : s;
}
function ti(t) {
  return {
    id: t.id,
    username: t.username,
    displayName: t.displayName,
    email: t.email,
    status: t.status,
    createdAt: t.createdAt
  };
}
const Zw = "supportly-dev-storage-key-change-before-deploy";
async function mp(t) {
  const e = t || Zw, s = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e));
  return crypto.subtle.importKey("raw", s, "AES-GCM", !1, ["encrypt", "decrypt"]);
}
async function si(t, e) {
  const s = await mp(e), n = crypto.getRandomValues(new Uint8Array(12)), r = await crypto.subtle.encrypt({ name: "AES-GCM", iv: n }, s, new TextEncoder().encode(t));
  return `${Array.from(n, (i) => i.toString(16).padStart(2, "0")).join("")}:${Ht(new Uint8Array(r))}`;
}
async function Yl(t, e) {
  const s = t.indexOf(":");
  if (s <= 0)
    throw new v("INVALID_SECRET_STORE", "Stored secret is malformed", 500);
  const n = t.slice(0, s), r = t.slice(s + 1);
  let a, i;
  try {
    a = Yw(n), i = Xw(r);
  } catch {
    throw new v("INVALID_SECRET_STORE", "Stored secret is malformed", 500);
  }
  const o = await mp(e), c = await crypto.subtle.decrypt({ name: "AES-GCM", iv: a }, o, i);
  return new TextDecoder().decode(c);
}
function Yw(t) {
  const e = new Uint8Array(t.length / 2);
  for (let s = 0; s < e.length; s += 1)
    e[s] = Number.parseInt(t.slice(s * 2, s * 2 + 2), 16);
  return e;
}
function Xw(t) {
  const e = t.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(t.length / 4) * 4, "="), s = atob(e), n = new Uint8Array(s.length);
  for (let r = 0; r < s.length; r += 1)
    n[r] = s.charCodeAt(r);
  return n;
}
function ni(t) {
  const e = Date.now(), s = t.expires_at ? new Date(t.expires_at).getTime() : null;
  return {
    id: t.id,
    mountId: t.mount_id,
    filePath: t.file_path,
    token: t.token,
    slug: t.slug,
    expiresAt: t.expires_at,
    revokedAt: t.revoked_at,
    createdAt: t.created_at,
    permanent: s === null,
    revoked: !!t.revoked_at,
    expired: s !== null && e >= s
  };
}
function Xl(t) {
  return {
    id: t.id,
    name: t.name,
    providerType: t.provider_type,
    endpointUrl: t.endpoint_url,
    region: t.region,
    bucketName: t.bucket_name,
    forcePathStyle: t.force_path_style === 1,
    rootPrefix: t.root_prefix,
    publicBaseUrl: t.public_base_url,
    description: t.description,
    isDefault: t.is_default === 1,
    hasAccessKey: !!t.access_key_ciphertext,
    hasSecretKey: !!t.secret_key_ciphertext,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
function ri(t) {
  return {
    id: t.id,
    sourceId: t.source_id,
    name: t.name,
    rootPath: t.root_path,
    isActive: t.is_active === 1,
    description: t.description,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
}
class Qw {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT sm.*, ss.name AS source_name, ss.provider_type
        FROM mounts sm
        LEFT JOIN sources ss ON ss.id = sm.source_id
        ORDER BY sm.created_at ASC
        `
    ).all()).results.map((s) => ({
      ...ri(s),
      sourceName: s.source_name,
      providerType: s.provider_type
    }));
  }
  async findById(e) {
    const s = await this.db.prepare(
      `
        SELECT sm.*, ss.name AS source_name, ss.provider_type
        FROM mounts sm
        LEFT JOIN sources ss ON ss.id = sm.source_id
        WHERE sm.id = ?
        LIMIT 1
        `
    ).bind(e).first();
    return s ? {
      ...ri(s),
      sourceName: s.source_name,
      providerType: s.provider_type
    } : null;
  }
  async findActiveById(e) {
    const s = await this.db.prepare(
      `
        SELECT sm.*, ss.name AS source_name, ss.provider_type
        FROM mounts sm
        LEFT JOIN sources ss ON ss.id = sm.source_id
        WHERE sm.id = ? AND sm.is_active = 1
        LIMIT 1
        `
    ).bind(e).first();
    return s ? {
      ...ri(s),
      sourceName: s.source_name,
      providerType: s.provider_type
    } : null;
  }
  async listBySource(e) {
    return (await this.db.prepare("SELECT * FROM mounts WHERE source_id = ?").bind(e).all()).results.map(ri);
  }
  async create(e) {
    const s = Ie("mnt"), n = V();
    await this.db.prepare(
      `
        INSERT INTO mounts (id, source_id, name, root_path, is_active, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
    ).bind(
      s,
      e.sourceId,
      e.name,
      e.rootPath || "/",
      e.isActive === !1 ? 0 : 1,
      e.description || null,
      n,
      n
    ).run();
    const r = await this.findById(s);
    if (!r) throw new Error("Created storage mount not found");
    return r;
  }
  async update(e, s) {
    const n = V(), r = [], a = [];
    s.sourceId !== void 0 && (r.push("source_id = ?"), a.push(s.sourceId)), s.name !== void 0 && (r.push("name = ?"), a.push(s.name)), s.rootPath !== void 0 && (r.push("root_path = ?"), a.push(s.rootPath)), s.isActive !== void 0 && (r.push("is_active = ?"), a.push(s.isActive ? 1 : 0)), s.description !== void 0 && (r.push("description = ?"), a.push(s.description || null)), r.length > 0 && (r.push("updated_at = ?"), a.push(n), a.push(e), await this.db.prepare(`UPDATE mounts SET ${r.join(", ")} WHERE id = ?`).bind(...a).run());
    const i = await this.findById(e);
    if (!i) throw new Error("Storage mount not found");
    return i;
  }
  async setActive(e, s) {
    await this.db.prepare("UPDATE mounts SET is_active = ?, updated_at = ? WHERE id = ?").bind(s ? 1 : 0, V(), e).run();
  }
  async delete(e) {
    await this.db.prepare("DELETE FROM mounts WHERE id = ?").bind(e).run();
  }
  async deleteBySource(e) {
    await this.db.prepare("DELETE FROM mounts WHERE source_id = ?").bind(e).run();
  }
}
class e_ {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM share_links WHERE id = ? LIMIT 1").bind(e).first();
    return s ? ni(s) : null;
  }
  async findByToken(e) {
    const s = await this.db.prepare("SELECT * FROM share_links WHERE token = ? LIMIT 1").bind(e).first();
    return s ? ni(s) : null;
  }
  async findBySlug(e) {
    const s = await this.db.prepare("SELECT * FROM share_links WHERE slug = ? LIMIT 1").bind(e).first();
    return s ? ni(s) : null;
  }
  async listByMount(e) {
    return (await this.db.prepare("SELECT * FROM share_links WHERE mount_id = ? ORDER BY created_at DESC").bind(e).all()).results.map(ni);
  }
  async create(e) {
    const s = V();
    return await this.db.prepare(
      `
        INSERT INTO share_links (id, mount_id, file_path, token, slug, expires_at, revoked_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NULL, ?)
        `
    ).bind(e.id, e.mountId, e.filePath, e.token, e.slug, e.expiresAt, s).run(), await this.findById(e.id);
  }
  async revoke(e) {
    await this.db.prepare("UPDATE share_links SET revoked_at = ? WHERE id = ?").bind(V(), e).run();
  }
}
const Gc = new TextEncoder(), t_ = new TextDecoder(), gp = "supportly-dev-share-token-change-before-deploy", Ql = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
function eu(t = 8) {
  const e = crypto.getRandomValues(new Uint8Array(t));
  let s = "";
  for (let n = 0; n < t; n++) s += Ql[e[n] % Ql.length];
  return s;
}
function yp(t) {
  let e = "";
  for (const s of t) e += String.fromCharCode(s);
  return btoa(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function s_(t) {
  const e = t.replace(/-/g, "+").replace(/_/g, "/"), s = e + "=".repeat((4 - e.length % 4) % 4), n = atob(s), r = new Uint8Array(n.length);
  for (let a = 0; a < n.length; a++) r[a] = n.charCodeAt(a);
  return r;
}
async function wp(t, e) {
  const s = await crypto.subtle.importKey(
    "raw",
    Gc.encode(e),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", s, Gc.encode(t));
  return yp(new Uint8Array(n));
}
async function n_(t, e) {
  const s = yp(Gc.encode(JSON.stringify(t))), n = await wp(s, e || gp);
  return `${s}.${n}`;
}
async function tu(t, e) {
  const s = t.split(".");
  if (s.length !== 2) return null;
  const [n, r] = s, a = await wp(n, e || gp);
  if (r.length !== a.length || r !== a) return null;
  try {
    const i = JSON.parse(t_.decode(s_(n)));
    return typeof i.sub != "string" || typeof i.exp == "number" && Date.now() >= i.exp ? null : i;
  } catch {
    return null;
  }
}
class r_ {
  constructor(e) {
    this.db = e;
  }
  async list() {
    return (await this.db.prepare(
      `
        SELECT *
        FROM sources
        ORDER BY created_at ASC
        `
    ).all()).results.map(Xl);
  }
  async findById(e) {
    const s = await this.db.prepare("SELECT * FROM sources WHERE id = ? LIMIT 1").bind(e).first();
    return s ? Xl(s) : null;
  }
  async findRowById(e) {
    return this.db.prepare("SELECT * FROM sources WHERE id = ? LIMIT 1").bind(e).first();
  }
  async create(e, s) {
    const n = Ie("src"), r = V();
    await this.db.prepare(
      `
        INSERT INTO sources (
          id, name, provider_type, endpoint_url, region, bucket_name,
          access_key_ciphertext, secret_key_ciphertext, force_path_style, root_prefix,
          public_base_url, description, is_default, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
        `
    ).bind(
      n,
      e.name,
      e.providerType,
      e.endpointUrl || null,
      e.region || "auto",
      e.bucketName,
      s.accessKeyCiphertext ?? null,
      s.secretKeyCiphertext ?? null,
      e.forcePathStyle ? 1 : 0,
      e.rootPrefix || "",
      e.publicBaseUrl || null,
      e.description || null,
      r,
      r
    ).run();
    const a = await this.findById(n);
    if (!a) throw new Error("Created storage source not found");
    return a;
  }
  async update(e, s, n) {
    const r = V(), a = [], i = [];
    if (s.name !== void 0 && (a.push("name = ?"), i.push(s.name)), s.providerType !== void 0 && (a.push("provider_type = ?"), i.push(s.providerType)), s.endpointUrl !== void 0 && (a.push("endpoint_url = ?"), i.push(s.endpointUrl || null)), s.region !== void 0 && (a.push("region = ?"), i.push(s.region)), s.bucketName !== void 0 && (a.push("bucket_name = ?"), i.push(s.bucketName)), s.forcePathStyle !== void 0 && (a.push("force_path_style = ?"), i.push(s.forcePathStyle ? 1 : 0)), s.rootPrefix !== void 0 && (a.push("root_prefix = ?"), i.push(s.rootPrefix || "")), s.publicBaseUrl !== void 0 && (a.push("public_base_url = ?"), i.push(s.publicBaseUrl || null)), s.description !== void 0 && (a.push("description = ?"), i.push(s.description || null)), n.accessKeyCiphertext !== void 0 && (a.push("access_key_ciphertext = ?"), i.push(n.accessKeyCiphertext)), n.secretKeyCiphertext !== void 0 && (a.push("secret_key_ciphertext = ?"), i.push(n.secretKeyCiphertext)), a.length === 0) {
      const c = await this.findById(e);
      if (!c) throw new Error("Storage source not found");
      return c;
    }
    a.push("updated_at = ?"), i.push(r), i.push(e), await this.db.prepare(`UPDATE sources SET ${a.join(", ")} WHERE id = ?`).bind(...i).run();
    const o = await this.findById(e);
    if (!o) throw new Error("Storage source not found after update");
    return o;
  }
  async delete(e) {
    await this.db.prepare("DELETE FROM sources WHERE id = ?").bind(e).run();
  }
}
const _p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", su = Object.entries(_p).reduce((t, [e, s]) => (t[s] = Number(e), t), {}), a_ = _p.split(""), mr = 6, la = 8, i_ = 63, vp = (t) => {
  let e = t.length / 4 * 3;
  t.slice(-2) === "==" ? e -= 2 : t.slice(-1) === "=" && e--;
  const s = new ArrayBuffer(e), n = new DataView(s);
  for (let r = 0; r < t.length; r += 4) {
    let a = 0, i = 0;
    for (let d = r, l = r + 3; d <= l; d++)
      if (t[d] !== "=") {
        if (!(t[d] in su))
          throw new TypeError(`Invalid character ${t[d]} in base64 string.`);
        a |= su[t[d]] << (l - d) * mr, i += mr;
      } else
        a >>= mr;
    const o = r / 4 * 3;
    a >>= i % la;
    const c = Math.floor(i / la);
    for (let d = 0; d < c; d++) {
      const l = (c - d - 1) * la;
      n.setUint8(o + d, (a & 255 << l) >> l);
    }
  }
  return new Uint8Array(s);
}, Or = (t) => new TextEncoder().encode(t);
function lo(t) {
  let e;
  typeof t == "string" ? e = Or(t) : e = t;
  const s = typeof e == "object" && typeof e.length == "number", n = typeof e == "object" && typeof e.byteOffset == "number" && typeof e.byteLength == "number";
  if (!s && !n)
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  let r = "";
  for (let a = 0; a < e.length; a += 3) {
    let i = 0, o = 0;
    for (let d = a, l = Math.min(a + 3, e.length); d < l; d++)
      i |= e[d] << (l - d - 1) * la, o += la;
    const c = Math.ceil(o / mr);
    i <<= c * mr - o;
    for (let d = 1; d <= c; d++) {
      const l = (c - d) * mr;
      r += a_[(i & i_ << l) >> l];
    }
    r += "==".slice(0, 4 - c);
  }
  return r;
}
function o_(t, e, s, n) {
  return class Ei extends Uint8Array {
    static fromString(a, i = "utf-8") {
      if (typeof a == "string")
        return i === "base64" ? Ei.mutate(n(a)) : Ei.mutate(e(a));
      throw new Error(`Unsupported conversion from ${typeof a} to Uint8ArrayBlobAdapter.`);
    }
    static mutate(a) {
      return Object.setPrototypeOf(a, Ei.prototype), a;
    }
    transformToString(a = "utf-8") {
      return a === "base64" ? s(this) : t(this);
    }
  };
}
const _d = (t) => {
  if (typeof t == "string")
    return t;
  if (typeof t != "object" || typeof t.byteOffset != "number" || typeof t.byteLength != "number")
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  return new TextDecoder("utf-8").decode(t);
}, tt = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function c_(t) {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? () => crypto.randomUUID() : () => {
    const e = new Uint8Array(16);
    return t(e), e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, tt[e[0]] + tt[e[1]] + tt[e[2]] + tt[e[3]] + "-" + tt[e[4]] + tt[e[5]] + "-" + tt[e[6]] + tt[e[7]] + "-" + tt[e[8]] + tt[e[9]] + "-" + tt[e[10]] + tt[e[11]] + tt[e[12]] + tt[e[13]] + tt[e[14]] + tt[e[15]];
  };
}
var ga;
(function(t) {
  t.HTTP = "http", t.HTTPS = "https";
})(ga || (ga = {}));
var gr;
(function(t) {
  t.MD5 = "md5", t.CRC32 = "crc32", t.CRC32C = "crc32c", t.SHA1 = "sha1", t.SHA256 = "sha256";
})(gr || (gr = {}));
const ji = "__smithy_context", $r = (t) => t[ji] || (t[ji] = {});
function Et(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
class De {
  constructor(e) {
    p(this, "method");
    p(this, "protocol");
    p(this, "hostname");
    p(this, "port");
    p(this, "path");
    p(this, "query");
    p(this, "headers");
    p(this, "username");
    p(this, "password");
    p(this, "fragment");
    p(this, "body");
    this.method = e.method || "GET", this.hostname = e.hostname || "localhost", this.port = e.port, this.query = e.query || {}, this.headers = e.headers || {}, this.body = e.body, this.protocol = e.protocol ? e.protocol.slice(-1) !== ":" ? `${e.protocol}:` : e.protocol : "https:", this.path = e.path ? e.path.charAt(0) !== "/" ? `/${e.path}` : e.path : "/", this.username = e.username, this.password = e.password, this.fragment = e.fragment;
  }
  static clone(e) {
    const s = new De({
      ...e,
      headers: { ...e.headers }
    });
    return s.query && (s.query = d_(s.query)), s;
  }
  static isInstance(e) {
    if (!e)
      return !1;
    const s = e;
    return "method" in s && "protocol" in s && "hostname" in s && "path" in s && typeof s.query == "object" && typeof s.headers == "object";
  }
  clone() {
    return De.clone(this);
  }
}
function d_(t) {
  return Object.keys(t).reduce((e, s) => {
    const n = t[s];
    return {
      ...e,
      [s]: Array.isArray(n) ? [...n] : n
    };
  }, {});
}
class Fn {
  constructor(e) {
    p(this, "statusCode");
    p(this, "reason");
    p(this, "headers");
    p(this, "body");
    this.statusCode = e.statusCode, this.reason = e.reason, this.headers = e.headers || {}, this.body = e.body;
  }
  static isInstance(e) {
    if (!e)
      return !1;
    const s = e;
    return typeof s.statusCode == "number" && typeof s.headers == "object";
  }
}
const l_ = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), uo = (t, e = !1) => {
  if (!e)
    return l_.test(t);
  const s = t.split(".");
  for (const n of s)
    if (!uo(n))
      return !1;
  return !0;
}, us = (t) => {
  if (typeof t == "function")
    return t;
  const e = Promise.resolve(t);
  return () => e;
};
function u_(t) {
  const e = {};
  if (t = t.replace(/^\?/, ""), t)
    for (const s of t.split("&")) {
      let [n, r = null] = s.split("=");
      n = decodeURIComponent(n), r && (r = decodeURIComponent(r)), n in e ? Array.isArray(e[n]) ? e[n].push(r) : e[n] = [e[n], r] : e[n] = r;
    }
  return e;
}
const qi = (t) => {
  if (typeof t == "string")
    return qi(new URL(t));
  const { hostname: e, pathname: s, port: n, protocol: r, search: a } = t;
  let i;
  return a && (i = u_(a)), {
    hostname: e,
    port: n ? parseInt(n) : void 0,
    protocol: r,
    path: s,
    query: i
  };
}, vd = (t) => {
  if (typeof t == "object") {
    if ("url" in t) {
      const e = qi(t.url);
      if (t.headers) {
        e.headers = {};
        for (const s in t.headers)
          Et(t.headers, s) && (e.headers[s.toLowerCase()] = t.headers[s].join(", "));
      }
      return e;
    }
    return t;
  }
  return qi(t);
}, Tt = (t) => {
  switch (t) {
    case "true":
      return !0;
    case "false":
      return !1;
    default:
      throw new Error(`Unable to parse boolean value "${t}"`);
  }
}, h_ = (t) => {
  if (t != null) {
    if (typeof t == "string") {
      const e = parseFloat(t);
      if (!Number.isNaN(e))
        return String(e) !== String(t) && Sp.warn(bp(`Expected number but observed string: ${t}`)), e;
    }
    if (typeof t == "number")
      return t;
    throw new TypeError(`Expected number, got ${typeof t}: ${t}`);
  }
}, f_ = Math.ceil(2 ** 127 * (2 - 2 ** -23)), nu = (t) => {
  const e = h_(t);
  if (e !== void 0 && !Number.isNaN(e) && e !== 1 / 0 && e !== -1 / 0 && Math.abs(e) > f_)
    throw new TypeError(`Expected 32-bit float, got ${t}`);
  return e;
}, Jc = (t) => {
  if (t != null) {
    if (Number.isInteger(t) && !Number.isNaN(t))
      return t;
    throw new TypeError(`Expected integer, got ${typeof t}: ${t}`);
  }
}, ru = (t) => bd(t, 32), au = (t) => bd(t, 16), iu = (t) => bd(t, 8), bd = (t, e) => {
  const s = Jc(t);
  if (s !== void 0 && p_(s, e) !== s)
    throw new TypeError(`Expected ${e}-bit integer, got ${t}`);
  return s;
}, p_ = (t, e) => {
  switch (e) {
    case 32:
      return Int32Array.of(t)[0];
    case 16:
      return Int16Array.of(t)[0];
    case 8:
      return Int8Array.of(t)[0];
  }
}, Ke = (t, e) => {
  if (t == null)
    throw e ? new TypeError(`Expected a non-null value for ${e}`) : new TypeError("Expected a non-null value");
  return t;
}, ka = (t) => {
  if (t == null)
    return;
  if (typeof t == "object" && !Array.isArray(t))
    return t;
  const e = Array.isArray(t) ? "array" : typeof t;
  throw new TypeError(`Expected object, got ${e}: ${t}`);
}, de = (t) => {
  if (t != null) {
    if (typeof t == "string")
      return t;
    if (["boolean", "number", "bigint"].includes(typeof t))
      return Sp.warn(bp(`Expected string, got ${typeof t}: ${t}`)), String(t);
    throw new TypeError(`Expected string, got ${typeof t}: ${t}`);
  }
}, m_ = (t) => nu(typeof t == "string" ? Ra(t) : t), g_ = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g, Ra = (t) => {
  const e = t.match(g_);
  if (e === null || e[0].length !== t.length)
    throw new TypeError("Expected real number, got implicit NaN");
  return parseFloat(t);
}, ho = (t) => Jc(typeof t == "string" ? Ra(t) : t), On = (t) => ru(typeof t == "string" ? Ra(t) : t), zi = (t) => au(typeof t == "string" ? Ra(t) : t), y_ = (t) => iu(typeof t == "string" ? Ra(t) : t), bp = (t) => String(new TypeError(t).stack || t).split(`
`).slice(0, 5).filter((e) => !e.includes("stackTraceWarning")).join(`
`), Sp = {
  warn: console.warn
}, w_ = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], Sd = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function It(t) {
  const e = t.getUTCFullYear(), s = t.getUTCMonth(), n = t.getUTCDay(), r = t.getUTCDate(), a = t.getUTCHours(), i = t.getUTCMinutes(), o = t.getUTCSeconds(), c = r < 10 ? `0${r}` : `${r}`, d = a < 10 ? `0${a}` : `${a}`, l = i < 10 ? `0${i}` : `${i}`, u = o < 10 ? `0${o}` : `${o}`;
  return `${w_[n]}, ${c} ${Sd[s]} ${e} ${d}:${l}:${u} GMT`;
}
const __ = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}:\d{2})|[zZ])$/), Lr = (t) => {
  if (t == null)
    return;
  if (typeof t != "string")
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  const e = __.exec(t);
  if (!e)
    throw new TypeError("Invalid RFC-3339 date-time value");
  const [s, n, r, a, i, o, c, d, l] = e, u = zi(ya(n)), h = nn(r, "month", 1, 12), f = nn(a, "day", 1, 31), g = Ai(u, h, f, { hours: i, minutes: o, seconds: c, fractionalMilliseconds: d });
  return l.toUpperCase() != "Z" && g.setTime(g.getTime() - R_(l)), g;
}, v_ = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), b_ = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/), S_ = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/), $n = (t) => {
  if (t == null)
    return;
  if (typeof t != "string")
    throw new TypeError("RFC-7231 date-times must be expressed as strings");
  let e = v_.exec(t);
  if (e) {
    const [s, n, r, a, i, o, c, d] = e;
    return Ai(zi(ya(a)), To(r), nn(n, "day", 1, 31), { hours: i, minutes: o, seconds: c, fractionalMilliseconds: d });
  }
  if (e = b_.exec(t), e) {
    const [s, n, r, a, i, o, c, d] = e;
    return x_(Ai(E_(a), To(r), nn(n, "day", 1, 31), {
      hours: i,
      minutes: o,
      seconds: c,
      fractionalMilliseconds: d
    }));
  }
  if (e = S_.exec(t), e) {
    const [s, n, r, a, i, o, c, d] = e;
    return Ai(zi(ya(d)), To(n), nn(r.trimLeft(), "day", 1, 31), { hours: a, minutes: i, seconds: o, fractionalMilliseconds: c });
  }
  throw new TypeError("Invalid RFC-7231 date-time value");
}, Ai = (t, e, s, n) => {
  const r = e - 1;
  return I_(t, r, s), new Date(Date.UTC(t, r, s, nn(n.hours, "hour", 0, 23), nn(n.minutes, "minute", 0, 59), nn(n.seconds, "seconds", 0, 60), k_(n.fractionalMilliseconds)));
}, E_ = (t) => {
  const e = (/* @__PURE__ */ new Date()).getUTCFullYear(), s = Math.floor(e / 100) * 100 + zi(ya(t));
  return s < e ? s + 100 : s;
}, A_ = 50 * 365 * 24 * 60 * 60 * 1e3, x_ = (t) => t.getTime() - (/* @__PURE__ */ new Date()).getTime() > A_ ? new Date(Date.UTC(t.getUTCFullYear() - 100, t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds())) : t, To = (t) => {
  const e = Sd.indexOf(t);
  if (e < 0)
    throw new TypeError(`Invalid month: ${t}`);
  return e + 1;
}, C_ = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], I_ = (t, e, s) => {
  let n = C_[e];
  if (e === 1 && T_(t) && (n = 29), s > n)
    throw new TypeError(`Invalid day for ${Sd[e]} in ${t}: ${s}`);
}, T_ = (t) => t % 4 === 0 && (t % 100 !== 0 || t % 400 === 0), nn = (t, e, s, n) => {
  const r = y_(ya(t));
  if (r < s || r > n)
    throw new TypeError(`${e} must be between ${s} and ${n}, inclusive`);
  return r;
}, k_ = (t) => t == null ? 0 : m_("0." + t) * 1e3, R_ = (t) => {
  const e = t[0];
  let s = 1;
  if (e == "+")
    s = 1;
  else if (e == "-")
    s = -1;
  else
    throw new TypeError(`Offset direction, ${e}, must be "+" or "-"`);
  const n = Number(t.substring(1, 3)), r = Number(t.substring(4, 6));
  return s * (n * 60 + r) * 60 * 1e3;
}, ya = (t) => {
  let e = 0;
  for (; e < t.length - 1 && t.charAt(e) === "0"; )
    e++;
  return e === 0 ? t : t.slice(e);
};
function O_(t) {
  return (t.includes(",") || t.includes('"')) && (t = `"${t.replace(/"/g, '\\"')}"`), t;
}
const Ep = {}, Zc = {};
for (let t = 0; t < 256; t++) {
  let e = t.toString(16).toLowerCase();
  e.length === 1 && (e = `0${e}`), Ep[t] = e, Zc[e] = t;
}
function Ap(t) {
  if (t.length % 2 !== 0)
    throw new Error("Hex encoded strings must have an even number length");
  const e = new Uint8Array(t.length / 2);
  for (let s = 0; s < t.length; s += 2) {
    const n = t.slice(s, s + 2).toLowerCase();
    if (n in Zc)
      e[s / 2] = Zc[n];
    else
      throw new Error(`Cannot decode unrecognized sequence ${n} as hexadecimal`);
  }
  return e;
}
function pt(t) {
  let e = "";
  for (let s = 0; s < t.byteLength; s++)
    e += Ep[t[s]];
  return e;
}
const ou = typeof TextEncoder == "function" ? new TextEncoder() : null, N_ = (t) => {
  if (typeof t == "string") {
    if (ou)
      return ou.encode(t).byteLength;
    let e = t.length;
    for (let s = e - 1; s >= 0; s--) {
      const n = t.charCodeAt(s);
      n > 127 && n <= 2047 ? e++ : n > 2047 && n <= 65535 && (e += 2), n >= 56320 && n <= 57343 && s--;
    }
    return e;
  } else {
    if (typeof t.byteLength == "number")
      return t.byteLength;
    if (typeof t.size == "number")
      return t.size;
  }
  throw new Error(`Body Length computation failed for ${t}`);
}, Ln = (t) => t instanceof Uint8Array ? t : typeof t == "string" ? Or(t) : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(t);
function M_(t, e) {
  if (e === void 0) {
    e = 0;
    for (const r of t)
      e += r.byteLength;
  }
  const s = new Uint8Array(e);
  let n = 0;
  for (const r of t)
    s.set(r, n), n += r.byteLength;
  return s;
}
const xp = (t) => typeof ArrayBuffer == "function" && t instanceof ArrayBuffer || Object.prototype.toString.call(t) === "[object ArrayBuffer]", D_ = (t, e) => (s, n) => async (r) => {
  var i, o, c, d;
  const { response: a } = await s(r);
  try {
    const l = await e(a, t);
    return {
      response: a,
      output: l
    };
  } catch (l) {
    if (Object.defineProperty(l, "$response", {
      value: a,
      enumerable: !1,
      writable: !1,
      configurable: !1
    }), !("$metadata" in l)) {
      const u = "Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.";
      try {
        l.message += `
  ` + u;
      } catch {
        !n.logger || ((o = (i = n.logger) == null ? void 0 : i.constructor) == null ? void 0 : o.name) === "NoOpLogger" ? console.warn(u) : (d = (c = n.logger) == null ? void 0 : c.warn) == null || d.call(c, u);
      }
      typeof l.$responseBodyText < "u" && l.$response && (l.$response.body = l.$responseBodyText);
      try {
        if (Fn.isInstance(a)) {
          const { headers: h = {} } = a, f = Object.entries(h);
          l.$metadata = {
            httpStatusCode: a.statusCode,
            requestId: ko(/^x-[\w-]+-request-?id$/, f),
            extendedRequestId: ko(/^x-[\w-]+-id-2$/, f),
            cfId: ko(/^x-[\w-]+-cf-id$/, f)
          };
        }
      } catch {
      }
    }
    throw l;
  }
}, ko = (t, e) => (e.find(([s]) => s.match(t)) || [void 0, void 0])[1], Ed = async (t) => {
}, P_ = async (t) => {
  const e = (t == null ? void 0 : t.Bucket) || "";
  if (typeof t.Bucket == "string" && (t.Bucket = e.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"))), L_(e)) {
    if (t.ForcePathStyle === !0)
      throw new Error("Path-style addressing cannot be used with ARN buckets");
  } else (!$_(e) || e.indexOf(".") !== -1 && !String(t.Endpoint).startsWith("http:") || e.toLowerCase() !== e || e.length < 3) && (t.ForcePathStyle = !0);
  return t.DisableMultiRegionAccessPoints && (t.disableMultiRegionAccessPoints = !0, t.DisableMRAP = !0), t;
}, B_ = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, U_ = /(\d+\.){3}\d+/, F_ = /\.\./, $_ = (t) => B_.test(t) && !U_.test(t) && !F_.test(t), L_ = (t) => {
  const [e, s, n, , , r] = t.split(":"), a = e === "arn" && t.split(":").length >= 6, i = !!(a && s && n && r);
  if (a && !i)
    throw new Error(`Invalid ARN: ${t} was an invalid ARN.`);
  return i;
}, H_ = (t, e, s, n = !1) => {
  const r = async () => {
    let a;
    if (n) {
      const i = s.clientContextParams;
      a = (i == null ? void 0 : i[t]) ?? s[t] ?? s[e];
    } else
      a = s[t] ?? s[e];
    return typeof a == "function" ? a() : a;
  };
  return t === "credentialScope" || e === "CredentialScope" ? async () => {
    const a = typeof s.credentials == "function" ? await s.credentials() : s.credentials;
    return (a == null ? void 0 : a.credentialScope) ?? (a == null ? void 0 : a.CredentialScope);
  } : t === "accountId" || e === "AccountId" ? async () => {
    const a = typeof s.credentials == "function" ? await s.credentials() : s.credentials;
    return (a == null ? void 0 : a.accountId) ?? (a == null ? void 0 : a.AccountId);
  } : t === "endpoint" || e === "endpoint" ? async () => {
    if (s.isCustomEndpoint === !1)
      return;
    const a = await r();
    if (a && typeof a == "object") {
      if ("url" in a)
        return a.url.href;
      if ("hostname" in a) {
        const { protocol: i, hostname: o, port: c, path: d } = a;
        return `${i}//${o}${c ? ":" + c : ""}${d}`;
      }
    }
    return a;
  } : r;
};
function Cp(t) {
  return async (e, s, n, r) => {
    var o, c;
    if (!n.isCustomEndpoint && !n.ignoreConfiguredEndpointUrls) {
      let d;
      n.serviceConfiguredEndpoint ? d = await n.serviceConfiguredEndpoint() : d = await t(n.serviceId), d && (n.endpoint = () => Promise.resolve(vd(d)), n.isCustomEndpoint = !0, (c = (o = r == null ? void 0 : r.logger) == null ? void 0 : o.debug) == null || c.call(o, `@smithy/core/endpoints - resolved endpoint from config: ${d}`));
    }
    const a = await Ip(e, s, n);
    if (typeof n.endpointProvider != "function")
      throw new Error("config.endpointProvider is not set.");
    const i = n.endpointProvider(a, r);
    if (n.isCustomEndpoint && n.endpoint) {
      const d = await n.endpoint();
      if (d != null && d.headers) {
        i.headers ?? (i.headers = {});
        for (const [l, u] of Object.entries(d.headers))
          i.headers[l] = Array.isArray(u) ? u : [u];
      }
    }
    return i;
  };
}
const Ip = async (t, e, s) => {
  var a;
  const n = {}, r = ((a = e == null ? void 0 : e.getEndpointParameterInstructions) == null ? void 0 : a.call(e)) || {};
  for (const [i, o] of Object.entries(r))
    switch (o.type) {
      case "staticContextParams":
        n[i] = o.value;
        break;
      case "contextParams":
        n[i] = t[o.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        n[i] = await H_(o.name, i, s, o.type !== "builtInParams")();
        break;
      case "operationContextParams":
        n[i] = o.get(t);
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(o));
    }
  return Object.keys(r).length === 0 && Object.assign(n, s), String(s.serviceId).toLowerCase() === "s3" && await P_(n), n;
};
function j_(t, e, s) {
  t.__smithy_context ? t.__smithy_context.features || (t.__smithy_context.features = {}) : t.__smithy_context = { features: {} }, t.__smithy_context.features[e] = s;
}
function q_(t) {
  const e = Cp(t);
  return ({ config: s, instructions: n }) => (r, a) => async (i) => {
    var d, l, u;
    s.isCustomEndpoint && j_(a, "ENDPOINT_OVERRIDE", "N");
    const o = await e(i.input, {
      getEndpointParameterInstructions() {
        return n;
      }
    }, { ...s }, a);
    a.endpointV2 = o, a.authSchemes = (d = o.properties) == null ? void 0 : d.authSchemes;
    const c = (l = a.authSchemes) == null ? void 0 : l[0];
    if (c) {
      a.signing_region = c.signingRegion, a.signing_service = c.signingName;
      const h = $r(a), f = (u = h == null ? void 0 : h.selectedHttpAuthScheme) == null ? void 0 : u.httpAuthOption;
      f && (f.signingProperties = Object.assign(f.signingProperties || {}, {
        signing_region: c.signingRegion,
        signingRegion: c.signingRegion,
        signing_service: c.signingName,
        signingName: c.signingName,
        signingRegionSet: c.signingRegionSet
      }, c.properties));
    }
    return r({
      ...i
    });
  };
}
const z_ = {
  name: "serializerMiddleware"
}, K_ = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: !0,
  relation: "before",
  toMiddleware: z_.name
};
function W_(t) {
  const e = q_(t);
  return (s, n) => ({
    applyToStack: (r) => {
      r.addRelativeTo(e({
        config: s,
        instructions: n
      }), K_);
    }
  });
}
function V_(t) {
  return (e) => {
    const s = e.tls ?? !0, { endpoint: n, useDualstackEndpoint: r, useFipsEndpoint: a } = e, i = n != null ? async () => vd(await us(n)()) : void 0, c = Object.assign(e, {
      endpoint: i,
      tls: s,
      isCustomEndpoint: !!n,
      useDualstackEndpoint: us(r ?? !1),
      useFipsEndpoint: us(a ?? !1),
      ignoreConfiguredEndpointUrls: !!e.ignoreConfiguredEndpointUrls
    });
    let d;
    return c.serviceConfiguredEndpoint = async () => (e.serviceId && !d && (d = t(e.serviceId)), d), c;
  };
}
class G_ {
  constructor({ size: e, params: s }) {
    p(this, "capacity");
    p(this, "data", /* @__PURE__ */ new Map());
    p(this, "parameters", []);
    this.capacity = e ?? 50, s && (this.parameters = s);
  }
  get(e, s) {
    const n = this.hash(e);
    if (n === !1)
      return s();
    if (!this.data.has(n)) {
      if (this.data.size > this.capacity + 10) {
        const r = this.data.keys();
        let a = 0;
        for (; ; ) {
          const { value: i, done: o } = r.next();
          if (this.data.delete(i), o || ++a > 10)
            break;
        }
      }
      this.data.set(n, s());
    }
    return this.data.get(n);
  }
  size() {
    return this.data.size;
  }
  hash(e) {
    let s = "";
    const { parameters: n } = this;
    if (n.length === 0)
      return !1;
    for (const r of n) {
      const a = e[r], i = a == null ? "\0" : String(a);
      if (i.includes("|;"))
        return !1;
      s += i + "|;";
    }
    return s;
  }
}
class kt extends Error {
  constructor(e) {
    super(e), this.name = "EndpointError";
  }
}
const wa = "endpoints";
function dn(t) {
  return typeof t != "object" || t == null ? t : "ref" in t ? `$${dn(t.ref)}` : "fn" in t ? `${t.fn}(${(t.argv || []).map(dn).join(", ")})` : JSON.stringify(t, null, 2);
}
const Ad = {}, J_ = (t, e) => t === e;
function Z_(...t) {
  for (const e of t)
    if (e != null)
      return e;
}
const Y_ = (t) => {
  const e = t.split("."), s = [];
  for (const n of e) {
    const r = n.indexOf("[");
    if (r !== -1) {
      if (n.indexOf("]") !== n.length - 1)
        throw new kt(`Path: '${t}' does not end with ']'`);
      const a = n.slice(r + 1, -1);
      if (Number.isNaN(parseInt(a)))
        throw new kt(`Invalid array index: '${a}' in path: '${t}'`);
      r !== 0 && s.push(n.slice(0, r)), s.push(a);
    } else
      s.push(n);
  }
  return s;
}, Tp = (t, e) => Y_(e).reduce((s, n) => {
  if (typeof s != "object")
    throw new kt(`Index '${n}' in '${e}' not found in '${JSON.stringify(t)}'`);
  if (Array.isArray(s)) {
    const r = parseInt(n);
    return s[r < 0 ? s.length + r : r];
  }
  return s[n];
}, t), X_ = (t) => t != null;
function Q_(t, e, s) {
  return t ? e : s;
}
const ev = (t) => !t, tv = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), kp = (t) => tv.test(t) || t.startsWith("[") && t.endsWith("]"), Ro = {
  [ga.HTTP]: 80,
  [ga.HTTPS]: 443
}, sv = (t) => {
  const e = (() => {
    try {
      if (t instanceof URL)
        return t;
      if (typeof t == "object" && "hostname" in t) {
        const { hostname: h, port: f, protocol: g = "", path: _ = "", query: w = {} } = t, b = new URL(`${g}//${h}${f ? `:${f}` : ""}${_}`);
        return b.search = Object.entries(w).map(([I, D]) => `${I}=${D}`).join("&"), b;
      }
      return new URL(t);
    } catch {
      return null;
    }
  })();
  if (!e)
    return console.error(`Unable to parse ${JSON.stringify(t)} as a whatwg URL.`), null;
  const s = e.href, { host: n, hostname: r, pathname: a, protocol: i, search: o } = e;
  if (o)
    return null;
  const c = i.slice(0, -1);
  if (!Object.values(ga).includes(c))
    return null;
  const d = kp(r), l = s.includes(`${n}:${Ro[c]}`) || typeof t == "string" && t.includes(`${n}:${Ro[c]}`), u = `${n}${l ? `:${Ro[c]}` : ""}`;
  return {
    scheme: c,
    authority: u,
    path: a,
    normalizedPath: a.endsWith("/") ? a : `${a}/`,
    isIp: d
  };
};
function nv(t, e, s) {
  if (s === 1)
    return [t];
  if (t === "")
    return [""];
  const n = t.split(e);
  return s === 0 ? n : n.slice(0, s - 1).concat(n.slice(1).join(e));
}
const rv = (t, e) => t === e, av = (t, e, s, n) => t == null || e >= s || t.length < s || /[^\u0000-\u007f]/.test(t) ? null : n ? t.substring(t.length - s, t.length - e) : t.substring(e, s), iv = (t) => encodeURIComponent(t).replace(/[!*'()]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), ov = {
  booleanEquals: J_,
  coalesce: Z_,
  getAttr: Tp,
  isSet: X_,
  isValidHostLabel: uo,
  ite: Q_,
  not: ev,
  parseURL: sv,
  split: nv,
  stringEquals: rv,
  substring: av,
  uriEncode: iv
}, Rp = (t, e) => {
  const s = [], { referenceRecord: n, endpointParams: r } = e;
  let a = 0;
  for (; a < t.length; ) {
    const i = t.indexOf("{", a);
    if (i === -1) {
      s.push(t.slice(a));
      break;
    }
    s.push(t.slice(a, i));
    const o = t.indexOf("}", i);
    if (o === -1) {
      s.push(t.slice(i));
      break;
    }
    t[i + 1] === "{" && t[o + 1] === "}" && (s.push(t.slice(i + 1, o)), a = o + 2);
    const c = t.substring(i + 1, o);
    if (c.includes("#")) {
      const [d, l] = c.split("#");
      s.push(Tp(n[d] ?? r[d], l));
    } else
      s.push(n[c] ?? r[c]);
    a = o + 1;
  }
  return s.join("");
}, cv = ({ ref: t }, e) => e.referenceRecord[t] ?? e.endpointParams[t], fo = (t, e, s) => {
  if (typeof t == "string")
    return Rp(t, s);
  if (t.fn)
    return Np.callFunction(t, s);
  if (t.ref)
    return cv(t, s);
  throw new kt(`'${e}': ${String(t)} is not a string, function or reference.`);
}, Op = ({ fn: t, argv: e }, s) => {
  const n = Array(e.length);
  for (let i = 0; i < n.length; ++i) {
    const o = e[i];
    typeof o == "boolean" || typeof o == "number" ? n[i] = o : n[i] = Np.evaluateExpression(o, "arg", s);
  }
  const r = t.indexOf(".");
  if (r !== -1) {
    const i = Ad[t.slice(0, r)], o = i == null ? void 0 : i[t.slice(r + 1)];
    if (typeof o == "function")
      return o(...n);
  }
  const a = ov[t];
  if (typeof a == "function")
    return a(...n);
  throw new Error(`function ${t} not loaded in endpointFunctions.`);
}, Np = {
  evaluateExpression: fo,
  callFunction: Op
}, dv = (t, e) => {
  var a, i;
  const { assign: s } = t;
  if (s && s in e.referenceRecord)
    throw new kt(`'${s}' is already defined in Reference Record.`);
  const n = Op(t, e);
  (i = (a = e.logger) == null ? void 0 : a.debug) == null || i.call(a, `${wa} evaluateCondition: ${dn(t)} = ${dn(n)}`);
  const r = n === "" ? !0 : !!n;
  return s != null ? { result: r, toAssign: { name: s, value: n } } : { result: r };
}, lv = (t, e) => Object.entries(t ?? {}).reduce((s, [n, r]) => (s[n] = r.map((a) => {
  const i = fo(a, "Header value entry", e);
  if (typeof i != "string")
    throw new kt(`Header '${n}' value '${i}' is not a string`);
  return i;
}), s), {}), Mp = (t, e) => Object.entries(t).reduce((s, [n, r]) => (s[n] = Pp.getEndpointProperty(r, e), s), {}), Dp = (t, e) => {
  if (Array.isArray(t))
    return t.map((s) => Dp(s, e));
  switch (typeof t) {
    case "string":
      return Rp(t, e);
    case "object":
      if (t === null)
        throw new kt(`Unexpected endpoint property: ${t}`);
      return Pp.getEndpointProperties(t, e);
    case "boolean":
      return t;
    default:
      throw new kt(`Unexpected endpoint property type: ${typeof t}`);
  }
}, Pp = {
  getEndpointProperty: Dp,
  getEndpointProperties: Mp
}, uv = (t, e) => {
  const s = fo(t, "Endpoint URL", e);
  if (typeof s == "string")
    try {
      return new URL(s);
    } catch (n) {
      throw console.error(`Failed to construct URL with ${s}`, n), n;
    }
  throw new kt(`Endpoint URL must be a string, got ${typeof s}`);
}, xd = (t = [], e) => {
  var a, i;
  const s = {}, n = {
    ...e,
    referenceRecord: { ...e.referenceRecord }
  };
  let r = !1;
  for (const o of t) {
    const { result: c, toAssign: d } = dv(o, n);
    if (!c)
      return { result: c };
    d && (r = !0, s[d.name] = d.value, n.referenceRecord[d.name] = d.value, (i = (a = e.logger) == null ? void 0 : a.debug) == null || i.call(a, `${wa} assign: ${d.name} := ${dn(d.value)}`));
  }
  return r ? { result: !0, referenceRecord: s } : { result: !0 };
}, hv = (t, e) => {
  var u, h;
  const { conditions: s, endpoint: n } = t, { result: r, referenceRecord: a } = xd(s, e);
  if (!r)
    return;
  const i = a ? {
    ...e,
    referenceRecord: { ...e.referenceRecord, ...a }
  } : e, { url: o, properties: c, headers: d } = n;
  (h = (u = e.logger) == null ? void 0 : u.debug) == null || h.call(u, `${wa} Resolving endpoint from template: ${dn(n)}`);
  const l = { url: uv(o, i) };
  return d != null && (l.headers = lv(d, i)), c != null && (l.properties = Mp(c, i)), l;
}, fv = (t, e) => {
  const { conditions: s, error: n } = t, { result: r, referenceRecord: a } = xd(s, e);
  if (!r)
    return;
  const i = a ? {
    ...e,
    referenceRecord: { ...e.referenceRecord, ...a }
  } : e;
  throw new kt(fo(n, "Error", i));
}, Bp = (t, e) => {
  for (const s of t)
    if (s.type === "endpoint") {
      const n = hv(s, e);
      if (n)
        return n;
    } else if (s.type === "error")
      fv(s, e);
    else if (s.type === "tree") {
      const n = Up.evaluateTreeRule(s, e);
      if (n)
        return n;
    } else
      throw new kt(`Unknown endpoint rule: ${s}`);
  throw new kt("Rules evaluation failed");
}, pv = (t, e) => {
  const { conditions: s, rules: n } = t, { result: r, referenceRecord: a } = xd(s, e);
  if (!r)
    return;
  const i = a ? { ...e, referenceRecord: { ...e.referenceRecord, ...a } } : e;
  return Up.evaluateRules(n, i);
}, Up = {
  evaluateRules: Bp,
  evaluateTreeRule: pv
}, mv = (t, e) => {
  var o, c, d, l;
  const { endpointParams: s, logger: n } = e, { parameters: r, rules: a } = t;
  (c = (o = e.logger) == null ? void 0 : o.debug) == null || c.call(o, `${wa} Initial EndpointParams: ${dn(s)}`);
  for (const u in r) {
    if (!Et(r, u))
      continue;
    const h = r[u], f = s[u];
    if (f == null && h.default != null) {
      s[u] = h.default;
      continue;
    }
    if (h.required && f == null)
      throw new kt(`Missing required parameter: '${u}'`);
  }
  const i = Bp(a, { endpointParams: s, logger: n, referenceRecord: {} });
  return (l = (d = e.logger) == null ? void 0 : d.debug) == null || l.call(d, `${wa} Resolved endpoint: ${dn(i)}`), i;
}, gv = Cp(Ed), yv = V_(Ed), ns = W_(Ed), wv = (t, e) => (s, n) => async (r) => {
  const a = t, i = n.endpointV2 ? async () => vd(n.endpointV2) : a.endpoint;
  if (!i)
    throw new Error("No valid endpoint provider available.");
  const o = await e(r.input, { ...t, endpoint: i });
  return s({
    ...r,
    request: o
  });
}, _v = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: !0
}, vv = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: !0
};
function rs(t, e, s) {
  return {
    applyToStack: (n) => {
      n.add(D_(t, s), _v), n.add(wv(t, e), vv);
    }
  };
}
const bv = typeof ReadableStream == "function" ? ReadableStream : function() {
};
class Sv extends bv {
}
const Yc = (t) => {
  var e;
  return typeof ReadableStream == "function" && (((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name) === ReadableStream.name || t instanceof ReadableStream);
}, Ev = (t) => {
  var e;
  return typeof Blob == "function" && (((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name) === Blob.name || t instanceof Blob);
}, Av = ({ expectedChecksum: t, checksum: e, source: s, checksumSourceLocation: n, base64Encoder: r }) => {
  var c;
  if (!Yc(s))
    throw new Error(`@smithy/util-stream: unsupported source type ${((c = s == null ? void 0 : s.constructor) == null ? void 0 : c.name) ?? s} in ChecksumStream.`);
  const a = r ?? lo;
  if (typeof TransformStream != "function")
    throw new Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
  const i = new TransformStream({
    start() {
    },
    async transform(d, l) {
      e.update(d), l.enqueue(d);
    },
    async flush(d) {
      const l = await e.digest(), u = a(l);
      if (t !== u) {
        const h = new Error(`Checksum mismatch: expected "${t}" but received "${u}" in response header "${n}".`);
        d.error(h);
      } else
        d.terminate();
    }
  });
  s.pipeThrough(i);
  const o = i.readable;
  return Object.setPrototypeOf(o, Sv.prototype), o;
}, xv = (t, e) => {
  const { base64Encoder: s, bodyLengthChecker: n, checksumAlgorithmFn: r, checksumLocationName: a, streamHasher: i } = e, o = s !== void 0 && n !== void 0 && r !== void 0 && a !== void 0 && i !== void 0, c = o ? i(r, t) : void 0;
  Promise.resolve(c).catch(() => {
  });
  const d = t.getReader();
  return new ReadableStream({
    async pull(l) {
      const { value: u, done: h } = await d.read();
      if (h) {
        if (l.enqueue(`0\r
`), o) {
          const f = s(await c);
          l.enqueue(`${a}:${f}\r
`), l.enqueue(`\r
`);
        }
        l.close();
      } else
        l.enqueue(`${(n(u) || 0).toString(16)}\r
${u}\r
`);
    }
  });
};
async function Cv(t, e) {
  let s = 0;
  const n = [], r = t.getReader();
  let a = !1;
  for (; !a; ) {
    const { done: c, value: d } = await r.read();
    if (d && (n.push(d), s += (d == null ? void 0 : d.byteLength) ?? 0), s >= e)
      break;
    a = c;
  }
  r.releaseLock();
  const i = new Uint8Array(Math.min(e, s));
  let o = 0;
  for (const c of n) {
    if (c.byteLength > i.byteLength - o) {
      i.set(c.subarray(0, i.byteLength - o), o);
      break;
    } else
      i.set(c, o);
    o += c.length;
  }
  return i;
}
const Fp = async (t) => Ev(t) ? Iv(t) : Tv(t);
async function Iv(t) {
  return t.arrayBuffer().then((e) => new Uint8Array(e));
}
async function Tv(t) {
  const e = [], s = t.getReader();
  let n = 0;
  for (; ; ) {
    const { done: r, value: a } = await s.read();
    if (a && (e.push(a), n += a.length), r)
      break;
  }
  return M_(e, n);
}
const cu = "The stream has already been transformed.", kv = (t) => {
  var r, a;
  if (!du(t) && !Yc(t)) {
    const i = ((a = (r = t == null ? void 0 : t.__proto__) == null ? void 0 : r.constructor) == null ? void 0 : a.name) || t;
    throw new Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${i}`);
  }
  let e = !1;
  const s = async () => {
    if (e)
      throw new Error(cu);
    return e = !0, await Fp(t);
  }, n = (i) => {
    if (typeof i.stream != "function")
      throw new Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
    return i.stream();
  };
  return Object.assign(t, {
    transformToByteArray: s,
    transformToString: async (i) => {
      const o = await s();
      if (i === "base64")
        return lo(o);
      if (i === "hex")
        return pt(o);
      if (i === void 0 || i === "utf8" || i === "utf-8")
        return _d(o);
      if (typeof TextDecoder == "function")
        return new TextDecoder(i).decode(o);
      throw new Error("TextDecoder is not available, please make sure polyfill is provided.");
    },
    transformToWebStream: () => {
      if (e)
        throw new Error(cu);
      if (e = !0, du(t))
        return n(t);
      if (Yc(t))
        return t;
      throw new Error(`Cannot transform payload to web stream, got ${t}`);
    }
  });
}, du = (t) => typeof Blob == "function" && t instanceof Blob;
async function Rv(t) {
  return typeof t.stream == "function" && (t = t.stream()), t.tee();
}
class Oo extends o_(_d, Or, lo, vp) {
}
const Ov = (t) => crypto.getRandomValues(t), Nv = c_(Ov), Hr = async (t = new Uint8Array(), e) => {
  if (t instanceof Uint8Array)
    return Oo.mutate(t);
  if (!t)
    return Oo.mutate(new Uint8Array());
  const s = e.streamCollector(t);
  return Oo.mutate(await s);
};
function lu(t) {
  return encodeURIComponent(t).replace(/[!'()*]/g, function(e) {
    return "%" + e.charCodeAt(0).toString(16).toUpperCase();
  });
}
const No = (t) => typeof t == "function" ? t() : t, Mo = [];
function ai(t) {
  if (typeof t == "object")
    return t;
  if (t = t | 0, Mo[t])
    return Mo[t];
  const e = {};
  let s = 0;
  for (const n of [
    "httpLabel",
    "idempotent",
    "idempotencyToken",
    "sensitive",
    "httpPayload",
    "httpResponseCode",
    "httpQueryParams"
  ])
    (t >> s++ & 1) === 1 && (e[n] = 1);
  return Mo[t] = e;
}
const Xr = {
  it: Symbol.for("@smithy/nor-struct-it"),
  ns: Symbol.for("@smithy/ns")
}, Do = [], Po = {}, Gs = class Gs {
  constructor(e, s) {
    p(this, "ref");
    p(this, "memberName");
    p(this, "symbol", Gs.symbol);
    p(this, "name");
    p(this, "schema");
    p(this, "_isMemberSchema");
    p(this, "traits");
    p(this, "memberTraits");
    p(this, "normalizedTraits");
    this.ref = e, this.memberName = s;
    const n = [];
    let r = e, a = e;
    for (this._isMemberSchema = !1; Bo(r); )
      n.push(r[1]), r = r[0], a = No(r), this._isMemberSchema = !0;
    if (n.length > 0) {
      this.memberTraits = {};
      for (let i = n.length - 1; i >= 0; --i) {
        const o = n[i];
        Object.assign(this.memberTraits, ai(o));
      }
    } else
      this.memberTraits = 0;
    if (a instanceof Gs) {
      const i = this.memberTraits;
      Object.assign(this, a), this.memberTraits = Object.assign({}, i, a.getMemberTraits(), this.getMemberTraits()), this.normalizedTraits = void 0, this.memberName = s ?? a.memberName;
      return;
    }
    if (this.schema = No(a), Mv(this.schema) ? (this.name = `${this.schema[1]}#${this.schema[2]}`, this.traits = this.schema[3]) : (this.name = this.memberName ?? String(a), this.traits = 0), this._isMemberSchema && !s)
      throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(!0)} missing member name.`);
  }
  static [Symbol.hasInstance](e) {
    const s = this.prototype.isPrototypeOf(e);
    return !s && typeof e == "object" && e !== null ? e.symbol === this.symbol : s;
  }
  static of(e) {
    const s = typeof e == "function" || typeof e == "object" && e !== null;
    if (typeof e == "number") {
      if (Do[e])
        return Do[e];
    } else if (typeof e == "string") {
      if (Po[e])
        return Po[e];
    } else if (s && e[Xr.ns])
      return e[Xr.ns];
    const n = No(e);
    if (n instanceof Gs)
      return n;
    if (Bo(n)) {
      const [a, i] = n;
      if (a instanceof Gs)
        return Object.assign(a.getMergedTraits(), ai(i)), a;
      throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(e, null, 2)}.`);
    }
    const r = new Gs(n);
    return s ? e[Xr.ns] = r : typeof n == "string" ? Po[n] = r : typeof n == "number" ? Do[n] = r : r;
  }
  getSchema() {
    const e = this.schema;
    return Array.isArray(e) && e[0] === 0 ? e[4] : e;
  }
  getName(e = !1) {
    const { name: s } = this;
    return !e && s && s.includes("#") ? s.split("#")[1] : s || void 0;
  }
  getMemberName() {
    return this.memberName;
  }
  isMemberSchema() {
    return this._isMemberSchema;
  }
  isListSchema() {
    const e = this.getSchema();
    return typeof e == "number" ? e >= 64 && e < 128 : e[0] === 1;
  }
  isMapSchema() {
    const e = this.getSchema();
    return typeof e == "number" ? e >= 128 && e <= 255 : e[0] === 2;
  }
  isStructSchema() {
    const e = this.getSchema();
    if (typeof e != "object")
      return !1;
    const s = e[0];
    return s === 3 || s === -3 || s === 4;
  }
  isUnionSchema() {
    const e = this.getSchema();
    return typeof e != "object" ? !1 : e[0] === 4;
  }
  isBlobSchema() {
    const e = this.getSchema();
    return e === 21 || e === 42;
  }
  isTimestampSchema() {
    const e = this.getSchema();
    return typeof e == "number" && e >= 4 && e <= 7;
  }
  isUnitSchema() {
    return this.getSchema() === "unit";
  }
  isDocumentSchema() {
    return this.getSchema() === 15;
  }
  isStringSchema() {
    return this.getSchema() === 0;
  }
  isBooleanSchema() {
    return this.getSchema() === 2;
  }
  isNumericSchema() {
    return this.getSchema() === 1;
  }
  isBigIntegerSchema() {
    return this.getSchema() === 17;
  }
  isBigDecimalSchema() {
    return this.getSchema() === 19;
  }
  isStreaming() {
    const { streaming: e } = this.getMergedTraits();
    return !!e || this.getSchema() === 42;
  }
  isIdempotencyToken() {
    return !!this.getMergedTraits().idempotencyToken;
  }
  getMergedTraits() {
    return this.normalizedTraits ?? (this.normalizedTraits = {
      ...this.getOwnTraits(),
      ...this.getMemberTraits()
    });
  }
  getMemberTraits() {
    return ai(this.memberTraits);
  }
  getOwnTraits() {
    return ai(this.traits);
  }
  getKeySchema() {
    const [e, s] = [this.isDocumentSchema(), this.isMapSchema()];
    if (!e && !s)
      throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(!0)}`);
    const n = this.getSchema(), r = e ? 15 : n[4] ?? 0;
    return Qr([r, 0], "key");
  }
  getValueSchema() {
    const e = this.getSchema(), [s, n, r] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()], a = typeof e == "number" ? 63 & e : e && typeof e == "object" && (n || r) ? e[3 + e[0]] : s ? 15 : void 0;
    if (a != null)
      return Qr([a, 0], n ? "value" : "member");
    throw new Error(`@smithy/core/schema - ${this.getName(!0)} has no value member.`);
  }
  getMemberSchema(e) {
    const s = this.getSchema();
    if (this.isStructSchema() && s[4].includes(e)) {
      const n = s[4].indexOf(e), r = s[5][n];
      return Qr(Bo(r) ? r : [r, 0], e);
    }
    if (this.isDocumentSchema())
      return Qr([15, 0], e);
    throw new Error(`@smithy/core/schema - ${this.getName(!0)} has no member=${e}.`);
  }
  getMemberSchemas() {
    const e = {};
    try {
      for (const [s, n] of this.structIterator())
        e[s] = n;
    } catch {
    }
    return e;
  }
  getEventStreamMember() {
    if (this.isStructSchema()) {
      for (const [e, s] of this.structIterator())
        if (s.isStreaming() && s.isStructSchema())
          return e;
    }
    return "";
  }
  *structIterator() {
    if (this.isUnitSchema())
      return;
    if (!this.isStructSchema())
      throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
    const e = this.getSchema(), s = e[4].length;
    let n = e[Xr.it];
    if (n && s === n.length) {
      yield* n;
      return;
    }
    n = Array(s);
    for (let r = 0; r < s; ++r) {
      const a = e[4][r], i = Qr([e[5][r], 0], a);
      yield n[r] = [a, i];
    }
    e[Xr.it] = n;
  }
};
p(Gs, "symbol", Symbol.for("@smithy/nor"));
let _a = Gs;
function Qr(t, e) {
  if (t instanceof _a)
    return Object.assign(t, {
      memberName: e,
      _isMemberSchema: !0
    });
  const s = _a;
  return new s(t, e);
}
const Bo = (t) => Array.isArray(t) && t.length === 2, Mv = (t) => Array.isArray(t) && t.length >= 5, Dv = (t, e, s, n, r, a) => {
  if (e != null && e[s] !== void 0) {
    const i = n();
    if (i == null || i.length <= 0)
      throw new Error("Empty value provided for input HTTP label: " + s + ".");
    t = t.replace(r, a ? i.split("/").map((o) => lu(o)).join("/") : lu(i));
  } else
    throw new Error("No value provided for input HTTP label: " + s + ".");
  return t;
};
function as(t, e) {
  return new Pv(t, e);
}
class Pv {
  constructor(e, s) {
    p(this, "input");
    p(this, "context");
    p(this, "query", {});
    p(this, "method", "");
    p(this, "headers", {});
    p(this, "path", "");
    p(this, "body", null);
    p(this, "hostname", "");
    p(this, "resolvePathStack", []);
    this.input = e, this.context = s;
  }
  async build() {
    const { hostname: e, protocol: s = "https", port: n, path: r } = await this.context.endpoint();
    this.path = r;
    for (const a of this.resolvePathStack)
      a(this.path);
    return new De({
      protocol: s,
      hostname: this.hostname || e,
      port: n,
      method: this.method,
      path: this.path,
      query: this.query,
      body: this.body,
      headers: this.headers
    });
  }
  hn(e) {
    return this.hostname = e, this;
  }
  bp(e) {
    return this.resolvePathStack.push((s) => {
      this.path = `${s != null && s.endsWith("/") ? s.slice(0, -1) : s || ""}` + e;
    }), this;
  }
  p(e, s, n, r) {
    return this.resolvePathStack.push((a) => {
      this.path = Dv(a, this.input, e, s, n, r);
    }), this;
  }
  h(e) {
    return this.headers = e, this;
  }
  q(e) {
    return this.query = e, this;
  }
  b(e) {
    return this.body = e, this;
  }
  m(e) {
    return this.method = e, this;
  }
}
const Bv = (t) => {
  var e, s, n;
  return t.logger && ((e = t.logger.constructor) == null ? void 0 : e.name) !== "NoOpLogger" && ((n = (s = t.requestHandler) == null ? void 0 : s.updateHttpClientConfig) == null || n.call(s, Symbol.for("logger"), t.logger)), {
    setHttpHandler(r) {
      t.requestHandler = r;
    },
    httpHandler() {
      return t.requestHandler;
    },
    updateHttpClientConfig(r, a) {
      var i;
      (i = t.requestHandler) == null || i.updateHttpClientConfig(r, a);
    },
    httpHandlerConfigs() {
      return t.requestHandler.httpHandlerConfigs();
    }
  };
}, Uv = (t) => ({
  requestHandler: t.httpHandler()
}), uu = "content-length";
function Fv(t) {
  return (e) => async (s) => {
    const n = s.request;
    if (De.isInstance(n)) {
      const { body: r, headers: a } = n;
      if (r && Object.keys(a).map((i) => i.toLowerCase()).indexOf(uu) === -1)
        try {
          const i = t(r);
          i != null && (n.headers = {
            ...n.headers,
            [uu]: String(i)
          });
        } catch {
        }
    }
    return e({
      ...s,
      request: n
    });
  };
}
const $v = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: !0
}, Lv = (t) => ({
  applyToStack: (e) => {
    e.add(Fv(t.bodyLengthChecker), $v);
  }
}), Nn = (t) => encodeURIComponent(t).replace(/[!'()*]/g, Hv), Hv = (t) => `%${t.charCodeAt(0).toString(16).toUpperCase()}`;
function $p(t) {
  const e = [];
  for (let s of Object.keys(t).sort()) {
    const n = t[s];
    if (s = Nn(s), Array.isArray(n))
      for (let r = 0, a = n.length; r < a; r++)
        e.push(`${s}=${Nn(n[r])}`);
    else {
      let r = s;
      (n || typeof n == "string") && (r += `=${Nn(n)}`), e.push(r);
    }
  }
  return e.join("&");
}
function jv(t) {
  return (e) => async (s) => {
    var r, a;
    const { request: n } = s;
    return De.isInstance(n) && n.body && t.runtime === "node" && ((a = (r = t.requestHandler) == null ? void 0 : r.constructor) == null ? void 0 : a.name) !== "FetchHttpHandler" && (n.headers = {
      ...n.headers,
      Expect: "100-continue"
    }), e({
      ...s,
      request: n
    });
  };
}
const qv = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: !0
}, zv = (t) => ({
  applyToStack: (e) => {
    e.add(jv(t), qv);
  }
}), Lp = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED"
}, Kv = Lp.WHEN_SUPPORTED, Wv = Lp.WHEN_SUPPORTED;
var Te;
(function(t) {
  t.MD5 = "MD5", t.CRC32 = "CRC32", t.CRC32C = "CRC32C", t.SHA1 = "SHA1", t.SHA256 = "SHA256";
})(Te || (Te = {}));
var hu;
(function(t) {
  t.HEADER = "header", t.TRAILER = "trailer";
})(hu || (hu = {}));
const Vv = Te.MD5, Gv = Te.CRC32;
var fu;
(function(t) {
  t.ENV = "env", t.CONFIG = "shared config entry";
})(fu || (fu = {}));
function Jv(t, e, s) {
  return t.$source || (t.$source = {}), t.$source[e] = s, t;
}
function ut(t, e, s) {
  t.__aws_sdk_context ? t.__aws_sdk_context.features || (t.__aws_sdk_context.features = {}) : t.__aws_sdk_context = {
    features: {}
  }, t.__aws_sdk_context.features[e] = s;
}
const pu = (t) => {
  var e, s;
  return Fn.isInstance(t) ? ((e = t.headers) == null ? void 0 : e.date) ?? ((s = t.headers) == null ? void 0 : s.Date) : void 0;
}, Cd = (t) => new Date(Date.now() + t), Zv = (t, e) => Math.abs(Cd(e).getTime() - t) >= 3e5, mu = (t, e) => {
  const s = Date.parse(t);
  return Zv(s, e) ? s - Date.now() : e;
}, ua = (t, e) => {
  if (!e)
    throw new Error(`Property \`${t}\` is not resolved for AWS SDK SigV4Auth`);
  return e;
}, Hp = async (t) => {
  var d, l, u;
  const e = ua("context", t.context), s = ua("config", t.config), n = (u = (l = (d = e.endpointV2) == null ? void 0 : d.properties) == null ? void 0 : l.authSchemes) == null ? void 0 : u[0], a = await ua("signer", s.signer)(n), i = t == null ? void 0 : t.signingRegion, o = t == null ? void 0 : t.signingRegionSet, c = t == null ? void 0 : t.signingName;
  return {
    config: s,
    signer: a,
    signingRegion: i,
    signingRegionSet: o,
    signingName: c
  };
};
class jp {
  async sign(e, s, n) {
    var u;
    if (!De.isInstance(e))
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    const r = await Hp(n), { config: a, signer: i } = r;
    let { signingRegion: o, signingName: c } = r;
    const d = n.context;
    if (((u = d == null ? void 0 : d.authSchemes) == null ? void 0 : u.length) ?? !1) {
      const [h, f] = d.authSchemes;
      (h == null ? void 0 : h.name) === "sigv4a" && (f == null ? void 0 : f.name) === "sigv4" && (o = (f == null ? void 0 : f.signingRegion) ?? o, c = (f == null ? void 0 : f.signingName) ?? c);
    }
    return await i.sign(e, {
      signingDate: Cd(a.systemClockOffset),
      signingRegion: o,
      signingService: c
    });
  }
  errorHandler(e) {
    return (s) => {
      const n = s.ServerTime ?? pu(s.$response);
      if (n) {
        const r = ua("config", e.config), a = r.systemClockOffset;
        r.systemClockOffset = mu(n, r.systemClockOffset), r.systemClockOffset !== a && s.$metadata && (s.$metadata.clockSkewCorrected = !0);
      }
      throw s;
    };
  }
  successHandler(e, s) {
    const n = pu(e);
    if (n) {
      const r = ua("config", s.config);
      r.systemClockOffset = mu(n, r.systemClockOffset);
    }
  }
}
class Yv extends jp {
  async sign(e, s, n) {
    var h;
    if (!De.isInstance(e))
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    const { config: r, signer: a, signingRegion: i, signingRegionSet: o, signingName: c } = await Hp(n), l = (await ((h = r.sigv4aSigningRegionSet) == null ? void 0 : h.call(r)) ?? o ?? [i]).join(",");
    return await a.sign(e, {
      signingDate: Cd(r.systemClockOffset),
      signingRegion: l,
      signingService: c
    });
  }
}
const Xv = (t, e) => {
  if (!e || e.length === 0)
    return t;
  const s = [];
  for (const n of e)
    for (const r of t)
      r.schemeId.split("#")[1] === n && s.push(r);
  for (const n of t)
    s.find(({ schemeId: r }) => r === n.schemeId) || s.push(n);
  return s;
};
function Qv(t) {
  const e = /* @__PURE__ */ new Map();
  for (const s of t)
    e.set(s.schemeId, s);
  return e;
}
const e0 = (t, e) => (s, n) => async (r) => {
  var u;
  const a = t.httpAuthSchemeProvider(await e.httpAuthSchemeParametersProvider(t, n, r.input)), i = t.authSchemePreference ? await t.authSchemePreference() : [], o = Xv(a, i), c = Qv(t.httpAuthSchemes), d = $r(n), l = [];
  for (const h of o) {
    const f = c.get(h.schemeId);
    if (!f) {
      l.push(`HttpAuthScheme \`${h.schemeId}\` was not enabled for this service.`);
      continue;
    }
    const g = f.identityProvider(await e.identityProviderConfigProvider(t));
    if (!g) {
      l.push(`HttpAuthScheme \`${h.schemeId}\` did not have an IdentityProvider configured.`);
      continue;
    }
    const { identityProperties: _ = {}, signingProperties: w = {} } = ((u = h.propertiesExtractor) == null ? void 0 : u.call(h, t, n)) || {};
    h.identityProperties = Object.assign(h.identityProperties || {}, _), h.signingProperties = Object.assign(h.signingProperties || {}, w), d.selectedHttpAuthScheme = {
      httpAuthOption: h,
      identity: await g(h.identityProperties),
      signer: f.signer
    };
    break;
  }
  if (!d.selectedHttpAuthScheme)
    throw new Error(l.join(`
`));
  return s(r);
}, t0 = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: !0,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
}, s0 = (t, { httpAuthSchemeParametersProvider: e, identityProviderConfigProvider: s }) => ({
  applyToStack: (n) => {
    n.addRelativeTo(e0(t, {
      httpAuthSchemeParametersProvider: e,
      identityProviderConfigProvider: s
    }), t0);
  }
}), n0 = (t) => (e) => {
  throw e;
}, r0 = (t, e) => {
}, a0 = (t) => (e, s) => async (n) => {
  if (!De.isInstance(n.request))
    return e(n);
  const a = $r(s).selectedHttpAuthScheme;
  if (!a)
    throw new Error("No HttpAuthScheme was selected: unable to sign request");
  const { httpAuthOption: { signingProperties: i = {} }, identity: o, signer: c } = a, d = await e({
    ...n,
    request: await c.sign(n.request, o, i)
  }).catch((c.errorHandler || n0)(i));
  return (c.successHandler || r0)(d.response, i), d;
}, qp = {
  step: "finalizeRequest",
  tags: ["HTTP_SIGNING"],
  name: "httpSigningMiddleware",
  aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
  override: !0,
  relation: "after",
  toMiddleware: "retryMiddleware"
}, i0 = (t) => ({
  applyToStack: (e) => {
    e.addRelativeTo(a0(), qp);
  }
}), pr = (t) => {
  if (typeof t == "function")
    return t;
  const e = Promise.resolve(t);
  return () => e;
};
class o0 {
  constructor(e) {
    p(this, "authSchemes", /* @__PURE__ */ new Map());
    for (const s in e) {
      if (!Et(e, s))
        continue;
      const n = e[s];
      n !== void 0 && this.authSchemes.set(s, n);
    }
  }
  getIdentityProvider(e) {
    return this.authSchemes.get(e);
  }
}
const c0 = (t) => function(s) {
  return zp(s) && s.expiration.getTime() - Date.now() < t;
}, d0 = 3e5, l0 = c0(d0), zp = (t) => t.expiration !== void 0, u0 = (t, e, s) => {
  if (t === void 0)
    return;
  const n = typeof t != "function" ? async () => Promise.resolve(t) : t;
  let r, a, i, o = !1;
  const c = async (d) => {
    a || (a = n(d));
    try {
      r = await a, i = !0, o = !1;
    } finally {
      a = void 0;
    }
    return r;
  };
  return e === void 0 ? async (d) => ((!i || d != null && d.forceRefresh) && (r = await c(d)), r) : async (d) => ((!i || d != null && d.forceRefresh) && (r = await c(d)), o ? r : s(r) ? (e(r) && await c(d), r) : (o = !0, r));
}, h0 = (t, e, s) => {
  let n, r, a, i = !1;
  const o = async () => {
    r || (r = t());
    try {
      n = await r, a = !0, i = !1;
    } finally {
      r = void 0;
    }
    return n;
  };
  return async (c) => ((!a || c != null && c.forceRefresh) && (n = await o()), n);
}, yn = (t, e) => {
  const s = [];
  if (t && s.push(t), e)
    for (const n of e)
      s.push(n);
  return s;
}, Ls = (t, e) => `${t || "anonymous"}${e && e.length > 0 ? ` (a.k.a. ${e.join(",")})` : ""}`, Ki = () => {
  let t = [], e = [], s = !1;
  const n = /* @__PURE__ */ new Set(), r = (u) => u.sort((h, f) => gu[f.step] - gu[h.step] || yu[f.priority || "normal"] - yu[h.priority || "normal"]), a = (u) => {
    let h = !1;
    const f = (g) => {
      const _ = yn(g.name, g.aliases);
      if (_.includes(u)) {
        h = !0;
        for (const w of _)
          n.delete(w);
        return !1;
      }
      return !0;
    };
    return t = t.filter(f), e = e.filter(f), h;
  }, i = (u) => {
    let h = !1;
    const f = (g) => {
      if (g.middleware === u) {
        h = !0;
        for (const _ of yn(g.name, g.aliases))
          n.delete(_);
        return !1;
      }
      return !0;
    };
    return t = t.filter(f), e = e.filter(f), h;
  }, o = (u) => {
    var h;
    return t.forEach((f) => {
      u.add(f.middleware, { ...f });
    }), e.forEach((f) => {
      u.addRelativeTo(f.middleware, { ...f });
    }), (h = u.identifyOnResolve) == null || h.call(u, l.identifyOnResolve()), u;
  }, c = (u) => {
    const h = [];
    return u.before.forEach((f) => {
      f.before.length === 0 && f.after.length === 0 ? h.push(f) : h.push(...c(f));
    }), h.push(u), u.after.reverse().forEach((f) => {
      f.before.length === 0 && f.after.length === 0 ? h.push(f) : h.push(...c(f));
    }), h;
  }, d = (u = !1) => {
    const h = [], f = [], g = {};
    return t.forEach((w) => {
      const b = {
        ...w,
        before: [],
        after: []
      };
      for (const I of yn(b.name, b.aliases))
        g[I] = b;
      h.push(b);
    }), e.forEach((w) => {
      const b = {
        ...w,
        before: [],
        after: []
      };
      for (const I of yn(b.name, b.aliases))
        g[I] = b;
      f.push(b);
    }), f.forEach((w) => {
      if (w.toMiddleware) {
        const b = g[w.toMiddleware];
        if (b === void 0) {
          if (u)
            return;
          throw new Error(`${w.toMiddleware} is not found when adding ${Ls(w.name, w.aliases)} middleware ${w.relation} ${w.toMiddleware}`);
        }
        w.relation === "after" && b.after.push(w), w.relation === "before" && b.before.push(w);
      }
    }), r(h).map(c).reduce((w, b) => (w.push(...b), w), []);
  }, l = {
    add: (u, h = {}) => {
      const { name: f, override: g, aliases: _ } = h, w = {
        step: "initialize",
        priority: "normal",
        middleware: u,
        ...h
      }, b = yn(f, _);
      if (b.length > 0) {
        if (b.some((I) => n.has(I))) {
          if (!g)
            throw new Error(`Duplicate middleware name '${Ls(f, _)}'`);
          for (const I of b) {
            const D = t.findIndex((z) => {
              var te;
              return z.name === I || ((te = z.aliases) == null ? void 0 : te.some((E) => E === I));
            });
            if (D === -1)
              continue;
            const M = t[D];
            if (M.step !== w.step || w.priority !== M.priority)
              throw new Error(`"${Ls(M.name, M.aliases)}" middleware with ${M.priority} priority in ${M.step} step cannot be overridden by "${Ls(f, _)}" middleware with ${w.priority} priority in ${w.step} step.`);
            t.splice(D, 1);
          }
        }
        for (const I of b)
          n.add(I);
      }
      t.push(w);
    },
    addRelativeTo: (u, h) => {
      const { name: f, override: g, aliases: _ } = h, w = {
        middleware: u,
        ...h
      }, b = yn(f, _);
      if (b.length > 0) {
        if (b.some((I) => n.has(I))) {
          if (!g)
            throw new Error(`Duplicate middleware name '${Ls(f, _)}'`);
          for (const I of b) {
            const D = e.findIndex((z) => {
              var te;
              return z.name === I || ((te = z.aliases) == null ? void 0 : te.some((E) => E === I));
            });
            if (D === -1)
              continue;
            const M = e[D];
            if (M.toMiddleware !== w.toMiddleware || M.relation !== w.relation)
              throw new Error(`"${Ls(M.name, M.aliases)}" middleware ${M.relation} "${M.toMiddleware}" middleware cannot be overridden by "${Ls(f, _)}" middleware ${w.relation} "${w.toMiddleware}" middleware.`);
            e.splice(D, 1);
          }
        }
        for (const I of b)
          n.add(I);
      }
      e.push(w);
    },
    clone: () => o(Ki()),
    use: (u) => {
      u.applyToStack(l);
    },
    remove: (u) => typeof u == "string" ? a(u) : i(u),
    removeByTag: (u) => {
      let h = !1;
      const f = (g) => {
        const { tags: _, name: w, aliases: b } = g;
        if (_ && _.includes(u)) {
          const I = yn(w, b);
          for (const D of I)
            n.delete(D);
          return h = !0, !1;
        }
        return !0;
      };
      return t = t.filter(f), e = e.filter(f), h;
    },
    concat: (u) => {
      var f;
      const h = o(Ki());
      return h.use(u), h.identifyOnResolve(s || h.identifyOnResolve() || (((f = u.identifyOnResolve) == null ? void 0 : f.call(u)) ?? !1)), h;
    },
    applyToStack: o,
    identify: () => d(!0).map((u) => {
      const h = u.step ?? u.relation + " " + u.toMiddleware;
      return Ls(u.name, u.aliases) + " - " + h;
    }),
    identifyOnResolve(u) {
      return typeof u == "boolean" && (s = u), s;
    },
    resolve: (u, h) => {
      for (const f of d().map((g) => g.middleware).reverse())
        u = f(u, h);
      return s && console.log(l.identify()), u;
    }
  };
  return l;
}, gu = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
}, yu = {
  high: 3,
  normal: 2,
  low: 1
}, f0 = (t) => () => Promise.reject(t);
class p0 {
  constructor(e) {
    p(this, "config");
    p(this, "middlewareStack", Ki());
    p(this, "initConfig");
    p(this, "handlers");
    this.config = e;
    const { protocol: s, protocolSettings: n } = e;
    n && typeof s == "function" && (e.protocol = new s(n));
  }
  send(e, s, n) {
    const r = typeof s != "function" ? s : void 0, a = typeof s == "function" ? s : n, i = r === void 0 && this.config.cacheMiddleware === !0;
    let o;
    if (i) {
      this.handlers || (this.handlers = /* @__PURE__ */ new WeakMap());
      const c = this.handlers;
      c.has(e.constructor) ? o = c.get(e.constructor) : (o = e.resolveMiddleware(this.middlewareStack, this.config, r), c.set(e.constructor, o));
    } else
      delete this.handlers, o = e.resolveMiddleware(this.middlewareStack, this.config, r);
    if (a)
      o(e).then((c) => a(null, c.output), (c) => a(c)).catch(() => {
      });
    else
      return o(e).then((c) => c.output);
  }
  destroy() {
    var e, s, n;
    (n = (s = (e = this.config) == null ? void 0 : e.requestHandler) == null ? void 0 : s.destroy) == null || n.call(s), delete this.handlers;
  }
}
const Uo = "***SensitiveInformation***";
function Xc(t, e) {
  if (e == null)
    return e;
  const s = _a.of(t);
  if (s.getMergedTraits().sensitive)
    return Uo;
  if (s.isListSchema()) {
    if (!!s.getValueSchema().getMergedTraits().sensitive)
      return Uo;
  } else if (s.isMapSchema()) {
    if (!!s.getKeySchema().getMergedTraits().sensitive || !!s.getValueSchema().getMergedTraits().sensitive)
      return Uo;
  } else if (s.isStructSchema() && typeof e == "object") {
    const n = e, r = {};
    for (const [a, i] of s.structIterator())
      n[a] != null && (r[a] = Xc(i, n[a]));
    return r;
  }
  return e;
}
class qt {
  constructor() {
    p(this, "middlewareStack", Ki());
    p(this, "schema");
  }
  static classBuilder() {
    return new m0();
  }
  resolveMiddlewareWithContext(e, s, n, { middlewareFn: r, clientName: a, commandName: i, inputFilterSensitiveLog: o, outputFilterSensitiveLog: c, smithyContext: d, additionalContext: l, CommandCtor: u }) {
    for (const I of r.bind(this)(u, e, s, n))
      this.middlewareStack.use(I);
    const h = e.concat(this.middlewareStack), { logger: f } = s, g = l[ji], _ = {
      logger: f,
      clientName: a,
      commandName: i,
      inputFilterSensitiveLog: o,
      outputFilterSensitiveLog: c,
      ...l,
      [ji]: {
        ...g,
        commandInstance: this,
        ...d,
        ...(n == null ? void 0 : n.metricsRecorder) === void 0 ? {} : { metricsRecorder: n.metricsRecorder }
      }
    }, { requestHandler: w } = s;
    let b = n ?? {};
    return b.metricsRecorder && (b = { ...b }, delete b.metricsRecorder), d.eventStream && (b = {
      isEventStream: !0,
      ...b
    }), h.resolve((I) => w.handle(I.request, b), _);
  }
}
class m0 {
  constructor() {
    p(this, "_init", () => {
    });
    p(this, "_ep", {});
    p(this, "_middlewareFn", () => []);
    p(this, "_commandName", "");
    p(this, "_clientName", "");
    p(this, "_additionalContext", {});
    p(this, "_smithyContext", {});
    p(this, "_inputFilterSensitiveLog");
    p(this, "_outputFilterSensitiveLog");
    p(this, "_serializer", null);
    p(this, "_deserializer", null);
    p(this, "_operationSchema");
  }
  init(e) {
    this._init = e;
  }
  ep(e) {
    return this._ep = e, this;
  }
  m(e) {
    return this._middlewareFn = e, this;
  }
  s(e, s, n = {}) {
    return this._smithyContext = {
      service: e,
      operation: s,
      ...n
    }, this;
  }
  c(e = {}) {
    return this._additionalContext = e, this;
  }
  n(e, s) {
    return this._clientName = e, this._commandName = s, this;
  }
  f(e = (n) => n, s = (n) => n) {
    return this._inputFilterSensitiveLog = e, this._outputFilterSensitiveLog = s, this;
  }
  ser(e) {
    return this._serializer = e, this;
  }
  de(e) {
    return this._deserializer = e, this;
  }
  sc(e) {
    return this._operationSchema = e, this._smithyContext.operationSchema = e, this;
  }
  build() {
    const e = this;
    let s;
    return s = class extends qt {
      constructor(...[r]) {
        super();
        p(this, "input");
        p(this, "serialize", e._serializer);
        p(this, "deserialize", e._deserializer);
        this.input = r ?? {}, e._init(this), this.schema = e._operationSchema;
      }
      static getEndpointParameterInstructions() {
        return e._ep;
      }
      resolveMiddleware(r, a, i) {
        const o = e._operationSchema, c = (o == null ? void 0 : o[4]) ?? (o == null ? void 0 : o.input), d = (o == null ? void 0 : o[5]) ?? (o == null ? void 0 : o.output);
        return this.resolveMiddlewareWithContext(r, a, i, {
          CommandCtor: s,
          middlewareFn: e._middlewareFn,
          clientName: e._clientName,
          commandName: e._commandName,
          inputFilterSensitiveLog: e._inputFilterSensitiveLog ?? (o ? Xc.bind(null, c) : (l) => l),
          outputFilterSensitiveLog: e._outputFilterSensitiveLog ?? (o ? Xc.bind(null, d) : (l) => l),
          smithyContext: e._smithyContext,
          additionalContext: e._additionalContext
        });
      }
    };
  }
}
const me = "***SensitiveInformation***", Js = class Js extends Error {
  constructor(s) {
    super(s.message);
    p(this, "$fault");
    p(this, "$response");
    p(this, "$retryable");
    p(this, "$metadata");
    Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = s.name, this.$fault = s.$fault, this.$metadata = s.$metadata;
  }
  static isInstance(s) {
    if (!s)
      return !1;
    const n = s;
    return Js.prototype.isPrototypeOf(n) || !!n.$fault && !!n.$metadata && (n.$fault === "client" || n.$fault === "server");
  }
  static [Symbol.hasInstance](s) {
    var r;
    if (!s)
      return !1;
    const n = s;
    if (this === Js)
      return Js.isInstance(s);
    if (Js.isInstance(s)) {
      if (this.prototype.isPrototypeOf(s))
        return !0;
      const a = Object.prototype.hasOwnProperty.call(this, "shapeId") ? this.shapeId : void 0;
      let i = !1;
      if (a) {
        let c = Object.getPrototypeOf(n);
        for (; c && c !== Object.prototype; ) {
          const d = c.constructor, l = d !== Js && Object.prototype.hasOwnProperty.call(d, "shapeId") ? d == null ? void 0 : d.shapeId : void 0;
          if (l && (i = !0, l === a))
            return !0;
          c = Object.getPrototypeOf(c);
        }
      }
      if (a && i)
        return !1;
      const o = this.name;
      if (o && o.length >= 6) {
        if (n.name === o)
          return !0;
        let c = Object.getPrototypeOf(n);
        for (; c && c !== Object.prototype; ) {
          const d = (r = c.constructor) == null ? void 0 : r.name;
          if (d && d !== "Error" && d === o)
            return !0;
          c = Object.getPrototypeOf(c);
        }
      }
    }
    return !1;
  }
};
p(Js, "shapeId", "smithy.ts.sdk.synthetic.nonamespace.client#ServiceException");
let Qc = Js;
const At = (t, e = {}) => {
  Object.entries(e).filter(([, n]) => n !== void 0).forEach(([n, r]) => {
    (t[n] == null || t[n] === "") && (t[n] = r);
  });
  const s = t.message || t.Message || "UnknownError";
  return t.message = s, delete t.Message, t;
}, g0 = ({ output: t, parsedBody: e, exceptionCtor: s, errorCode: n }) => {
  const r = w0(t), a = r.httpStatusCode ? r.httpStatusCode + "" : void 0, i = new s({
    name: (e == null ? void 0 : e.code) || (e == null ? void 0 : e.Code) || n || a || "UnknownError",
    $fault: "client",
    $metadata: r
  });
  throw At(i, e);
}, y0 = (t) => ({ output: e, parsedBody: s, errorCode: n }) => {
  g0({ output: e, parsedBody: s, exceptionCtor: t, errorCode: n });
}, w0 = (t) => ({
  httpStatusCode: t.statusCode,
  requestId: t.headers["x-amzn-requestid"] ?? t.headers["x-amzn-request-id"] ?? t.headers["x-amz-request-id"],
  extendedRequestId: t.headers["x-amz-id-2"],
  cfId: t.headers["x-amz-cf-id"]
}), _0 = (t) => {
  switch (t) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
}, Kp = Object.values(gr), v0 = (t) => {
  const e = [];
  for (const s in gr) {
    if (!Et(gr, s))
      continue;
    const n = gr[s];
    t[n] !== void 0 && e.push({
      algorithmId: () => n,
      checksumConstructor: () => t[n]
    });
  }
  for (const [s, n] of Object.entries(t.checksumAlgorithms ?? {}))
    e.push({
      algorithmId: () => s,
      checksumConstructor: () => n
    });
  return {
    addChecksumAlgorithm(s) {
      t.checksumAlgorithms = t.checksumAlgorithms ?? {};
      const n = s.algorithmId(), r = s.checksumConstructor();
      Kp.includes(n) ? t.checksumAlgorithms[n.toUpperCase()] = r : t.checksumAlgorithms[n] = r, e.push(s);
    },
    checksumAlgorithms() {
      return e;
    }
  };
}, b0 = (t) => {
  const e = {};
  return t.checksumAlgorithms().forEach((s) => {
    const n = s.algorithmId();
    Kp.includes(n) && (e[n] = s.checksumConstructor());
  }), e;
}, S0 = (t) => ({
  setRetryStrategy(e) {
    t.retryStrategy = e;
  },
  retryStrategy() {
    return t.retryStrategy;
  }
}), E0 = (t) => {
  const e = {};
  return e.retryStrategy = t.retryStrategy(), e;
}, A0 = (t) => Object.assign(v0(t), S0(t)), x0 = (t) => Object.assign(b0(t), E0(t)), ed = (t) => Array.isArray(t) ? t : [t], Wp = (t) => {
  const e = "#text";
  for (const s in t)
    Et(t, s) && (t[s][e] !== void 0 ? t[s] = t[s][e] : typeof t[s] == "object" && t[s] !== null && (t[s] = Wp(t[s])));
  return t;
}, le = (t) => t != null;
class Id {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
}
function Y(t, e, s) {
  let n, r, a;
  if (typeof e > "u" && typeof s > "u")
    n = {}, a = t;
  else {
    if (n = t, typeof e == "function")
      return r = e, a = s, C0(n, r, a);
    a = e;
  }
  for (const i in a)
    if (Et(a, i)) {
      if (!Array.isArray(a[i])) {
        n[i] = a[i];
        continue;
      }
      I0(n, null, a, i);
    }
  return n;
}
const C0 = (t, e, s) => Y(t, Object.entries(s).reduce((n, [r, a]) => (Array.isArray(a) ? n[r] = a : typeof a == "function" ? n[r] = [e, a()] : n[r] = [e, a], n), {})), I0 = (t, e, s, n) => {
  let [r, a] = s[n];
  if (typeof a == "function") {
    let i;
    const o = r === void 0 && (i = a()) != null, c = typeof r == "function" && !!r(void 0) || typeof r != "function" && !!r;
    o ? t[n] = i : c && (t[n] = a());
  } else {
    const i = r === void 0 && a != null, o = typeof r == "function" && !!r(a) || typeof r != "function" && !!r;
    (i || o) && (t[n] = a);
  }
}, Td = (t) => t.toISOString().replace(".000Z", "Z"), wu = /* @__PURE__ */ new Set(), T0 = (t, e = uo) => {
  if (!wu.has(t) && !e(t))
    if (t === "*")
      console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
    else
      throw new Error(`Region not accepted: region="${t}" is not a valid hostname component.`);
  else
    wu.add(t);
}, Vp = (t) => typeof t == "string" && (t.startsWith("fips-") || t.endsWith("-fips")), k0 = (t) => Vp(t) ? ["fips-aws-global", "aws-fips"].includes(t) ? "us-east-1" : t.replace(/fips-(dkr-|prod-)?|-fips/, "") : t, R0 = (t) => {
  const { region: e, useFipsEndpoint: s } = t;
  if (!e)
    throw new Error("Region is missing");
  return Object.assign(t, {
    region: async () => {
      const n = typeof e == "function" ? await e() : e, r = k0(n);
      return T0(r), r;
    },
    useFipsEndpoint: async () => {
      const n = typeof e == "string" ? e : await e();
      return Vp(n) ? !0 : typeof s != "function" ? Promise.resolve(!!s) : s();
    }
  });
}, O0 = ["in-region", "cross-region", "mobile", "standard", "legacy"], N0 = ({ defaultsMode: t } = {}) => h0(async () => {
  const e = typeof t == "function" ? await t() : t;
  switch (e == null ? void 0 : e.toLowerCase()) {
    case "auto":
      return Promise.resolve(M0() ? "mobile" : "standard");
    case "mobile":
    case "in-region":
    case "cross-region":
    case "standard":
    case "legacy":
      return Promise.resolve(e == null ? void 0 : e.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${O0.join(", ")}, got ${e}`);
  }
}), M0 = () => {
  var e;
  const t = window == null ? void 0 : window.navigator;
  if (t != null && t.connection) {
    const { effectiveType: s, rtt: n, downlink: r } = t.connection;
    if (typeof s == "string" && s !== "4g" || Number(n) > 100 || Number(r) < 10)
      return !0;
  }
  return ((e = t == null ? void 0 : t.userAgentData) == null ? void 0 : e.mobile) || typeof (t == null ? void 0 : t.maxTouchPoints) == "number" && (t == null ? void 0 : t.maxTouchPoints) > 1;
}, D0 = !1, P0 = !1, B0 = (t) => (t.sigv4aSigningRegionSet = pr(t.sigv4aSigningRegionSet), t);
class U0 {
  format(e) {
    const s = [];
    for (const a in e) {
      if (!Et(e, a))
        continue;
      const i = Or(a);
      s.push(Uint8Array.from([i.byteLength]), i, this.formatHeaderValue(e[a]));
    }
    const n = new Uint8Array(s.reduce((a, i) => a + i.byteLength, 0));
    let r = 0;
    for (const a of s)
      n.set(a, r), r += a.byteLength;
    return n;
  }
  formatHeaderValue(e) {
    switch (e.type) {
      case "boolean":
        return Uint8Array.from([e.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, e.value]);
      case "short":
        const s = new DataView(new ArrayBuffer(3));
        return s.setUint8(0, 3), s.setInt16(1, e.value, !1), new Uint8Array(s.buffer);
      case "integer":
        const n = new DataView(new ArrayBuffer(5));
        return n.setUint8(0, 4), n.setInt32(1, e.value, !1), new Uint8Array(n.buffer);
      case "long":
        const r = new Uint8Array(9);
        return r[0] = 5, r.set(e.value.bytes, 1), r;
      case "binary":
        const a = new DataView(new ArrayBuffer(3 + e.value.byteLength));
        a.setUint8(0, 6), a.setUint16(1, e.value.byteLength, !1);
        const i = new Uint8Array(a.buffer);
        return i.set(e.value, 3), i;
      case "string":
        const o = Or(e.value), c = new DataView(new ArrayBuffer(3 + o.byteLength));
        c.setUint8(0, 7), c.setUint16(1, o.byteLength, !1);
        const d = new Uint8Array(c.buffer);
        return d.set(o, 3), d;
      case "timestamp":
        const l = new Uint8Array(9);
        return l[0] = 8, l.set($0.fromNumber(e.value.valueOf()).bytes, 1), l;
      case "uuid":
        if (!F0.test(e.value))
          throw new Error(`Invalid UUID received: ${e.value}`);
        const u = new Uint8Array(17);
        return u[0] = 9, u.set(Ap(e.value.replace(/-/g, "")), 1), u;
    }
  }
}
var _u;
(function(t) {
  t[t.boolTrue = 0] = "boolTrue", t[t.boolFalse = 1] = "boolFalse", t[t.byte = 2] = "byte", t[t.short = 3] = "short", t[t.integer = 4] = "integer", t[t.long = 5] = "long", t[t.byteArray = 6] = "byteArray", t[t.string = 7] = "string", t[t.timestamp = 8] = "timestamp", t[t.uuid = 9] = "uuid";
})(_u || (_u = {}));
const F0 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
let $0 = class Gp {
  constructor(e) {
    p(this, "bytes");
    if (this.bytes = e, e.byteLength !== 8)
      throw new Error("Int64 buffers must be exactly 8 bytes");
  }
  static fromNumber(e) {
    if (e > 9223372036854776e3 || e < -9223372036854776e3)
      throw new Error(`${e} is too large (or, if negative, too small) to represent as an Int64`);
    const s = new Uint8Array(8);
    for (let n = 7, r = Math.abs(Math.round(e)); n > -1 && r > 0; n--, r /= 256)
      s[n] = r;
    return e < 0 && vu(s), new Gp(s);
  }
  valueOf() {
    const e = this.bytes.slice(0), s = e[0] & 128;
    return s && vu(e), parseInt(pt(e), 16) * (s ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function vu(t) {
  for (let e = 0; e < 8; e++)
    t[e] ^= 255;
  for (let e = 7; e > -1 && (t[e]++, t[e] === 0); e--)
    ;
}
const L0 = "X-Amz-Algorithm", H0 = "X-Amz-Credential", Jp = "X-Amz-Date", j0 = "X-Amz-SignedHeaders", q0 = "X-Amz-Expires", Zp = "X-Amz-Signature", Yp = "X-Amz-Security-Token", Xp = "authorization", Qp = Jp.toLowerCase(), z0 = "date", K0 = [Xp, Qp, z0], W0 = Zp.toLowerCase(), td = "x-amz-content-sha256", V0 = Yp.toLowerCase(), G0 = {
  authorization: !0,
  "cache-control": !0,
  connection: !0,
  expect: !0,
  from: !0,
  "keep-alive": !0,
  "max-forwards": !0,
  pragma: !0,
  referer: !0,
  te: !0,
  trailer: !0,
  "transfer-encoding": !0,
  upgrade: !0,
  "user-agent": !0,
  "x-amzn-trace-id": !0
}, J0 = /^proxy-/, Z0 = /^sec-/, Fo = "AWS4-HMAC-SHA256", Y0 = "AWS4-HMAC-SHA256-PAYLOAD", X0 = "UNSIGNED-PAYLOAD", Q0 = 50, em = "aws4_request", eb = 60 * 60 * 24 * 7, tb = ({ query: t = {} }) => {
  const e = [], s = {};
  for (const n in t) {
    if (!Et(t, n) || n.toLowerCase() === W0)
      continue;
    const r = Nn(n);
    e.push(r);
    const a = t[n];
    typeof a == "string" ? s[r] = `${r}=${Nn(a)}` : Array.isArray(a) && (s[r] = a.slice(0).reduce((i, o) => i.concat([`${r}=${Nn(o)}`]), []).sort().join("&"));
  }
  return e.sort().map((n) => s[n]).filter((n) => n).join("&");
}, sb = (t) => nb(t).toISOString().replace(/\.\d{3}Z$/, "Z"), nb = (t) => typeof t == "number" ? new Date(t * 1e3) : typeof t == "string" ? Number(t) ? new Date(Number(t) * 1e3) : new Date(t) : t;
class rb {
  constructor({ applyChecksum: e, credentials: s, region: n, service: r, sha256: a, uriEscapePath: i = !0 }) {
    p(this, "service");
    p(this, "regionProvider");
    p(this, "credentialProvider");
    p(this, "sha256");
    p(this, "uriEscapePath");
    p(this, "applyChecksum");
    this.service = r, this.sha256 = a, this.uriEscapePath = i, this.applyChecksum = typeof e == "boolean" ? e : !0, this.regionProvider = us(n), this.credentialProvider = us(s);
  }
  createCanonicalRequest(e, s, n) {
    const r = Object.keys(s).sort();
    return `${e.method}
${this.getCanonicalPath(e)}
${tb(e)}
${r.map((a) => `${a}:${s[a]}`).join(`
`)}

${r.join(";")}
${n}`;
  }
  async createStringToSign(e, s, n, r) {
    const a = new this.sha256();
    a.update(Ln(n));
    const i = await a.digest();
    return `${r}
${e}
${s}
${pt(i)}`;
  }
  getCanonicalPath({ path: e }) {
    if (this.uriEscapePath) {
      const s = [];
      for (const a of e.split("/"))
        (a == null ? void 0 : a.length) !== 0 && a !== "." && (a === ".." ? s.pop() : s.push(a));
      const n = `${e != null && e.startsWith("/") ? "/" : ""}${s.join("/")}${s.length > 0 && (e != null && e.endsWith("/")) ? "/" : ""}`;
      return Nn(n).replace(/%2F/g, "/");
    }
    return e;
  }
  validateResolvedCredentials(e) {
    if (typeof e != "object" || typeof e.accessKeyId != "string" || typeof e.secretAccessKey != "string")
      throw new Error("Resolved credential object is not valid");
  }
  formatDate(e) {
    const s = sb(e).replace(/[-:]/g, "");
    return {
      longDate: s,
      shortDate: s.slice(0, 8)
    };
  }
  getCanonicalHeaderList(e) {
    return Object.keys(e).sort().join(";");
  }
}
const ii = {}, $o = [], Lo = (t, e, s) => `${t}/${e}/${s}/${em}`, ab = async (t, e, s, n, r) => {
  const a = await bu(t, e.secretAccessKey, e.accessKeyId), i = `${s}:${n}:${r}:${pt(a)}:${e.sessionToken}`;
  if (i in ii)
    return ii[i];
  for ($o.push(i); $o.length > Q0; )
    delete ii[$o.shift()];
  let o = `AWS4${e.secretAccessKey}`;
  for (const c of [s, n, r, em])
    o = await bu(t, o, c);
  return ii[i] = o;
}, bu = (t, e, s) => {
  const n = new t(e);
  return n.update(Ln(s)), n.digest();
}, Su = ({ headers: t }, e, s) => {
  const n = {};
  for (const r of Object.keys(t).sort()) {
    if (t[r] == null)
      continue;
    const a = r.toLowerCase();
    (a in G0 || e != null && e.has(a) || J0.test(a) || Z0.test(a)) && (!s || s && !s.has(a)) || (n[a] = t[r].replace(/[\r\n]/g, " ").replace(/[ \t]+/g, " ").replace(/^ | $/g, ""));
  }
  return n;
}, Ho = async ({ headers: t, body: e }, s) => {
  for (const n in t)
    if (Et(t, n) && n.toLowerCase() === td)
      return t[n];
  if (e == null)
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  if (typeof e == "string" || ArrayBuffer.isView(e) || xp(e)) {
    const n = new s();
    return n.update(Ln(e)), pt(await n.digest());
  }
  return X0;
}, ib = (t, e) => {
  t = t.toLowerCase();
  for (const s in e)
    if (Et(e, s) && t === s.toLowerCase())
      return !0;
  return !1;
}, ob = (t, e = {}) => {
  var r, a;
  const { headers: s, query: n = {} } = De.clone(t);
  for (const i in s) {
    if (!Et(s, i))
      continue;
    const o = i.toLowerCase();
    (o.slice(0, 6) === "x-amz-" && !((r = e.unhoistableHeaders) != null && r.has(o)) || (a = e.hoistableHeaders) != null && a.has(o)) && (n[i] = s[i], delete s[i]);
  }
  return {
    ...t,
    headers: s,
    query: n
  };
}, Eu = (t) => {
  t = De.clone(t);
  for (const e in t.headers)
    Et(t.headers, e) && K0.indexOf(e.toLowerCase()) > -1 && delete t.headers[e];
  return t;
};
class Wi extends rb {
  constructor({ applyChecksum: s, credentials: n, region: r, service: a, sha256: i, uriEscapePath: o = !0 }) {
    super({
      applyChecksum: s,
      credentials: n,
      region: r,
      service: a,
      sha256: i,
      uriEscapePath: o
    });
    p(this, "headerFormatter", new U0());
  }
  async presign(s, n = {}) {
    const { signingDate: r = /* @__PURE__ */ new Date(), expiresIn: a = 3600, unsignableHeaders: i, unhoistableHeaders: o, signableHeaders: c, hoistableHeaders: d, signingRegion: l, signingService: u } = n, h = await this.credentialProvider();
    this.validateResolvedCredentials(h);
    const f = l ?? await this.regionProvider(), { longDate: g, shortDate: _ } = this.formatDate(r);
    if (a > eb)
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    const w = Lo(_, f, u ?? this.service), b = ob(Eu(s), { unhoistableHeaders: o, hoistableHeaders: d });
    h.sessionToken && (b.query[Yp] = h.sessionToken), b.query[L0] = Fo, b.query[H0] = `${h.accessKeyId}/${w}`, b.query[Jp] = g, b.query[q0] = a.toString(10);
    const I = Su(b, i, c);
    return b.query[j0] = this.getCanonicalHeaderList(I), b.query[Zp] = await this.getSignature(g, w, this.getSigningKey(h, f, _, u), this.createCanonicalRequest(b, I, await Ho(s, this.sha256))), b;
  }
  async sign(s, n) {
    return typeof s == "string" ? this.signString(s, n) : s.headers && s.payload ? this.signEvent(s, n) : s.message ? this.signMessage(s, n) : this.signRequest(s, n);
  }
  async signEvent({ headers: s, payload: n }, { signingDate: r = /* @__PURE__ */ new Date(), priorSignature: a, signingRegion: i, signingService: o, eventStreamCredentials: c }) {
    const d = i ?? await this.regionProvider(), { shortDate: l, longDate: u } = this.formatDate(r), h = Lo(l, d, o ?? this.service), f = await Ho({ headers: {}, body: n }, this.sha256), g = new this.sha256();
    g.update(s);
    const _ = pt(await g.digest()), w = [
      Y0,
      u,
      h,
      a,
      _,
      f
    ].join(`
`);
    return this.signString(w, {
      signingDate: r,
      signingRegion: d,
      signingService: o,
      eventStreamCredentials: c
    });
  }
  async signMessage(s, { signingDate: n = /* @__PURE__ */ new Date(), signingRegion: r, signingService: a, eventStreamCredentials: i }) {
    return this.signEvent({
      headers: this.headerFormatter.format(s.message.headers),
      payload: s.message.body
    }, {
      signingDate: n,
      signingRegion: r,
      signingService: a,
      priorSignature: s.priorSignature,
      eventStreamCredentials: i
    }).then((c) => ({ message: s.message, signature: c }));
  }
  async signString(s, { signingDate: n = /* @__PURE__ */ new Date(), signingRegion: r, signingService: a, eventStreamCredentials: i } = {}) {
    const o = i ?? await this.credentialProvider();
    this.validateResolvedCredentials(o);
    const c = r ?? await this.regionProvider(), { shortDate: d } = this.formatDate(n), l = new this.sha256(await this.getSigningKey(o, c, d, a));
    return l.update(Ln(s)), pt(await l.digest());
  }
  async signRequest(s, { signingDate: n = /* @__PURE__ */ new Date(), signableHeaders: r, unsignableHeaders: a, signingRegion: i, signingService: o } = {}) {
    const c = await this.credentialProvider();
    this.validateResolvedCredentials(c);
    const d = i ?? await this.regionProvider(), l = Eu(s), { longDate: u, shortDate: h } = this.formatDate(n), f = Lo(h, d, o ?? this.service);
    l.headers[Qp] = u, c.sessionToken && (l.headers[V0] = c.sessionToken);
    const g = await Ho(l, this.sha256);
    !ib(td, l.headers) && this.applyChecksum && (l.headers[td] = g);
    const _ = Su(l, a, r), w = await this.getSignature(u, f, this.getSigningKey(c, d, h, o), this.createCanonicalRequest(l, _, g));
    return l.headers[Xp] = `${Fo} Credential=${c.accessKeyId}/${f}, SignedHeaders=${this.getCanonicalHeaderList(_)}, Signature=${w}`, l;
  }
  async getSignature(s, n, r, a) {
    const i = await this.createStringToSign(s, n, a, Fo), o = new this.sha256(await r);
    return o.update(Ln(i)), pt(await o.digest());
  }
  getSigningKey(s, n, r, a) {
    return ab(this.sha256, s, r, n, a || this.service);
  }
}
const cb = (t) => {
  let e = !1, s;
  t.credentials && (e = !0, s = u0(t.credentials, l0, zp)), s || (t.credentialDefaultProvider ? s = pr(t.credentialDefaultProvider(Object.assign({}, t, {
    parentClientConfig: t
  }))) : s = async () => {
    throw new Error("`credentials` is missing");
  });
  const n = async () => s({ callerClientConfig: t }), { signingEscapePath: r = !0, systemClockOffset: a = t.systemClockOffset || 0, sha256: i } = t;
  let o;
  return t.signer ? o = pr(t.signer) : t.regionInfoProvider ? o = () => pr(t.region)().then(async (c) => [
    await t.regionInfoProvider(c, {
      useFipsEndpoint: await t.useFipsEndpoint(),
      useDualstackEndpoint: await t.useDualstackEndpoint()
    }) || {},
    c
  ]).then(([c, d]) => {
    const { signingRegion: l, signingService: u } = c;
    t.signingRegion = t.signingRegion || l || d, t.signingName = t.signingName || u || t.serviceId;
    const h = {
      ...t,
      credentials: n,
      region: t.signingRegion,
      service: t.signingName,
      sha256: i,
      uriEscapePath: r
    }, f = t.signerConstructor || Wi;
    return new f(h);
  }) : o = async (c) => {
    c = Object.assign({}, {
      name: "sigv4",
      signingName: t.signingName || t.defaultSigningName,
      signingRegion: await pr(t.region)(),
      properties: {}
    }, c);
    const d = c.signingRegion, l = c.signingName;
    t.signingRegion = t.signingRegion || d, t.signingName = t.signingName || l || t.serviceId;
    const u = {
      ...t,
      credentials: n,
      region: t.signingRegion,
      service: t.signingName,
      sha256: i,
      uriEscapePath: r
    }, h = t.signerConstructor || Wi;
    return new h(u);
  }, {
    ...t,
    systemClockOffset: a,
    signingEscapePath: r,
    credentials: e ? async () => n().then((c) => Jv(c, "CREDENTIALS_CODE", "e")) : n,
    signer: o
  };
}, db = (t, e) => Hr(t, e).then((s) => e.utf8Encoder(s));
var tm = {}, po = {};
(function(t) {
  const e = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", s = e + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040", n = "[" + e + "][" + s + "]*", r = new RegExp("^" + n + "$"), a = function(o, c) {
    const d = [];
    let l = c.exec(o);
    for (; l; ) {
      const u = [];
      u.startIndex = c.lastIndex - l[0].length;
      const h = l.length;
      for (let f = 0; f < h; f++)
        u.push(l[f]);
      d.push(u), l = c.exec(o);
    }
    return d;
  }, i = function(o) {
    const c = r.exec(o);
    return !(c === null || typeof c > "u");
  };
  t.isExist = function(o) {
    return typeof o < "u";
  }, t.isEmptyObject = function(o) {
    return Object.keys(o).length === 0;
  }, t.merge = function(o, c, d) {
    if (c) {
      const l = Object.keys(c), u = l.length;
      for (let h = 0; h < u; h++)
        d === "strict" ? o[l[h]] = [c[l[h]]] : o[l[h]] = c[l[h]];
    }
  }, t.getValue = function(o) {
    return t.isExist(o) ? o : "";
  }, t.isName = i, t.getAllMatches = a, t.nameRegexp = n;
})(po);
const kd = po, lb = {
  allowBooleanAttributes: !1,
  //A tag can have attributes without any value
  unpairedTags: []
};
tm.validate = function(t, e) {
  e = Object.assign({}, lb, e);
  const s = [];
  let n = !1, r = !1;
  t[0] === "\uFEFF" && (t = t.substr(1));
  for (let a = 0; a < t.length; a++)
    if (t[a] === "<" && t[a + 1] === "?") {
      if (a += 2, a = xu(t, a), a.err) return a;
    } else if (t[a] === "<") {
      let i = a;
      if (a++, t[a] === "!") {
        a = Cu(t, a);
        continue;
      } else {
        let o = !1;
        t[a] === "/" && (o = !0, a++);
        let c = "";
        for (; a < t.length && t[a] !== ">" && t[a] !== " " && t[a] !== "	" && t[a] !== `
` && t[a] !== "\r"; a++)
          c += t[a];
        if (c = c.trim(), c[c.length - 1] === "/" && (c = c.substring(0, c.length - 1), a--), !wb(c)) {
          let u;
          return c.trim().length === 0 ? u = "Invalid space after '<'." : u = "Tag '" + c + "' is an invalid name.", Oe("InvalidTag", u, ct(t, a));
        }
        const d = fb(t, a);
        if (d === !1)
          return Oe("InvalidAttr", "Attributes for '" + c + "' have open quote.", ct(t, a));
        let l = d.value;
        if (a = d.index, l[l.length - 1] === "/") {
          const u = a - l.length;
          l = l.substring(0, l.length - 1);
          const h = Iu(l, e);
          if (h === !0)
            n = !0;
          else
            return Oe(h.err.code, h.err.msg, ct(t, u + h.err.line));
        } else if (o)
          if (d.tagClosed) {
            if (l.trim().length > 0)
              return Oe("InvalidTag", "Closing tag '" + c + "' can't have attributes or invalid starting.", ct(t, i));
            if (s.length === 0)
              return Oe("InvalidTag", "Closing tag '" + c + "' has not been opened.", ct(t, i));
            {
              const u = s.pop();
              if (c !== u.tagName) {
                let h = ct(t, u.tagStartPos);
                return Oe(
                  "InvalidTag",
                  "Expected closing tag '" + u.tagName + "' (opened in line " + h.line + ", col " + h.col + ") instead of closing tag '" + c + "'.",
                  ct(t, i)
                );
              }
              s.length == 0 && (r = !0);
            }
          } else return Oe("InvalidTag", "Closing tag '" + c + "' doesn't have proper closing.", ct(t, a));
        else {
          const u = Iu(l, e);
          if (u !== !0)
            return Oe(u.err.code, u.err.msg, ct(t, a - l.length + u.err.line));
          if (r === !0)
            return Oe("InvalidXml", "Multiple possible root nodes found.", ct(t, a));
          e.unpairedTags.indexOf(c) !== -1 || s.push({ tagName: c, tagStartPos: i }), n = !0;
        }
        for (a++; a < t.length; a++)
          if (t[a] === "<")
            if (t[a + 1] === "!") {
              a++, a = Cu(t, a);
              continue;
            } else if (t[a + 1] === "?") {
              if (a = xu(t, ++a), a.err) return a;
            } else
              break;
          else if (t[a] === "&") {
            const u = gb(t, a);
            if (u == -1)
              return Oe("InvalidChar", "char '&' is not expected.", ct(t, a));
            a = u;
          } else if (r === !0 && !Au(t[a]))
            return Oe("InvalidXml", "Extra text at the end", ct(t, a));
        t[a] === "<" && a--;
      }
    } else {
      if (Au(t[a]))
        continue;
      return Oe("InvalidChar", "char '" + t[a] + "' is not expected.", ct(t, a));
    }
  if (n) {
    if (s.length == 1)
      return Oe("InvalidTag", "Unclosed tag '" + s[0].tagName + "'.", ct(t, s[0].tagStartPos));
    if (s.length > 0)
      return Oe("InvalidXml", "Invalid '" + JSON.stringify(s.map((a) => a.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  } else return Oe("InvalidXml", "Start tag expected.", 1);
  return !0;
};
function Au(t) {
  return t === " " || t === "	" || t === `
` || t === "\r";
}
function xu(t, e) {
  const s = e;
  for (; e < t.length; e++)
    if (t[e] == "?" || t[e] == " ") {
      const n = t.substr(s, e - s);
      if (e > 5 && n === "xml")
        return Oe("InvalidXml", "XML declaration allowed only at the start of the document.", ct(t, e));
      if (t[e] == "?" && t[e + 1] == ">") {
        e++;
        break;
      } else
        continue;
    }
  return e;
}
function Cu(t, e) {
  if (t.length > e + 5 && t[e + 1] === "-" && t[e + 2] === "-") {
    for (e += 3; e < t.length; e++)
      if (t[e] === "-" && t[e + 1] === "-" && t[e + 2] === ">") {
        e += 2;
        break;
      }
  } else if (t.length > e + 8 && t[e + 1] === "D" && t[e + 2] === "O" && t[e + 3] === "C" && t[e + 4] === "T" && t[e + 5] === "Y" && t[e + 6] === "P" && t[e + 7] === "E") {
    let s = 1;
    for (e += 8; e < t.length; e++)
      if (t[e] === "<")
        s++;
      else if (t[e] === ">" && (s--, s === 0))
        break;
  } else if (t.length > e + 9 && t[e + 1] === "[" && t[e + 2] === "C" && t[e + 3] === "D" && t[e + 4] === "A" && t[e + 5] === "T" && t[e + 6] === "A" && t[e + 7] === "[") {
    for (e += 8; e < t.length; e++)
      if (t[e] === "]" && t[e + 1] === "]" && t[e + 2] === ">") {
        e += 2;
        break;
      }
  }
  return e;
}
const ub = '"', hb = "'";
function fb(t, e) {
  let s = "", n = "", r = !1;
  for (; e < t.length; e++) {
    if (t[e] === ub || t[e] === hb)
      n === "" ? n = t[e] : n !== t[e] || (n = "");
    else if (t[e] === ">" && n === "") {
      r = !0;
      break;
    }
    s += t[e];
  }
  return n !== "" ? !1 : {
    value: s,
    index: e,
    tagClosed: r
  };
}
const pb = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function Iu(t, e) {
  const s = kd.getAllMatches(t, pb), n = {};
  for (let r = 0; r < s.length; r++) {
    if (s[r][1].length === 0)
      return Oe("InvalidAttr", "Attribute '" + s[r][2] + "' has no space in starting.", ea(s[r]));
    if (s[r][3] !== void 0 && s[r][4] === void 0)
      return Oe("InvalidAttr", "Attribute '" + s[r][2] + "' is without value.", ea(s[r]));
    if (s[r][3] === void 0 && !e.allowBooleanAttributes)
      return Oe("InvalidAttr", "boolean attribute '" + s[r][2] + "' is not allowed.", ea(s[r]));
    const a = s[r][2];
    if (!yb(a))
      return Oe("InvalidAttr", "Attribute '" + a + "' is an invalid name.", ea(s[r]));
    if (!n.hasOwnProperty(a))
      n[a] = 1;
    else
      return Oe("InvalidAttr", "Attribute '" + a + "' is repeated.", ea(s[r]));
  }
  return !0;
}
function mb(t, e) {
  let s = /\d/;
  for (t[e] === "x" && (e++, s = /[\da-fA-F]/); e < t.length; e++) {
    if (t[e] === ";")
      return e;
    if (!t[e].match(s))
      break;
  }
  return -1;
}
function gb(t, e) {
  if (e++, t[e] === ";")
    return -1;
  if (t[e] === "#")
    return e++, mb(t, e);
  let s = 0;
  for (; e < t.length; e++, s++)
    if (!(t[e].match(/\w/) && s < 20)) {
      if (t[e] === ";")
        break;
      return -1;
    }
  return e;
}
function Oe(t, e, s) {
  return {
    err: {
      code: t,
      msg: e,
      line: s.line || s,
      col: s.col
    }
  };
}
function yb(t) {
  return kd.isName(t);
}
function wb(t) {
  return kd.isName(t);
}
function ct(t, e) {
  const s = t.substring(0, e).split(/\r?\n/);
  return {
    line: s.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: s[s.length - 1].length + 1
  };
}
function ea(t) {
  return t.startIndex + t[1].length;
}
var Rd = {};
const sm = {
  preserveOrder: !1,
  attributeNamePrefix: "@_",
  attributesGroupName: !1,
  textNodeName: "#text",
  ignoreAttributes: !0,
  removeNSPrefix: !1,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: !1,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: !0,
  parseAttributeValue: !1,
  trimValues: !0,
  //Trim string values of tag and attributes
  cdataPropName: !1,
  numberParseOptions: {
    hex: !0,
    leadingZeros: !0,
    eNotation: !0
  },
  tagValueProcessor: function(t, e) {
    return e;
  },
  attributeValueProcessor: function(t, e) {
    return e;
  },
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: !1,
  isArray: () => !1,
  commentPropName: !1,
  unpairedTags: [],
  processEntities: !0,
  htmlEntities: !1,
  ignoreDeclaration: !1,
  ignorePiTags: !1,
  transformTagName: !1,
  transformAttributeName: !1,
  updateTag: function(t, e, s) {
    return t;
  }
  // skipEmptyListItem: false
}, _b = function(t) {
  return Object.assign({}, sm, t);
};
Rd.buildOptions = _b;
Rd.defaultOptions = sm;
let vb = class {
  constructor(e) {
    this.tagname = e, this.child = [], this[":@"] = {};
  }
  add(e, s) {
    e === "__proto__" && (e = "#__proto__"), this.child.push({ [e]: s });
  }
  addChild(e) {
    e.tagname === "__proto__" && (e.tagname = "#__proto__"), e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({ [e.tagname]: e.child, ":@": e[":@"] }) : this.child.push({ [e.tagname]: e.child });
  }
};
var bb = vb;
const Sb = po;
function Eb(t, e) {
  const s = {};
  if (t[e + 3] === "O" && t[e + 4] === "C" && t[e + 5] === "T" && t[e + 6] === "Y" && t[e + 7] === "P" && t[e + 8] === "E") {
    e = e + 9;
    let n = 1, r = !1, a = !1, i = "";
    for (; e < t.length; e++)
      if (t[e] === "<" && !a) {
        if (r && Cb(t, e))
          e += 7, [entityName, val, e] = Ab(t, e + 1), val.indexOf("&") === -1 && (s[Rb(entityName)] = {
            regx: RegExp(`&${entityName};`, "g"),
            val
          });
        else if (r && Ib(t, e)) e += 8;
        else if (r && Tb(t, e)) e += 8;
        else if (r && kb(t, e)) e += 9;
        else if (xb) a = !0;
        else throw new Error("Invalid DOCTYPE");
        n++, i = "";
      } else if (t[e] === ">") {
        if (a ? t[e - 1] === "-" && t[e - 2] === "-" && (a = !1, n--) : n--, n === 0)
          break;
      } else t[e] === "[" ? r = !0 : i += t[e];
    if (n !== 0)
      throw new Error("Unclosed DOCTYPE");
  } else
    throw new Error("Invalid Tag instead of DOCTYPE");
  return { entities: s, i: e };
}
function Ab(t, e) {
  let s = "";
  for (; e < t.length && t[e] !== "'" && t[e] !== '"'; e++)
    s += t[e];
  if (s = s.trim(), s.indexOf(" ") !== -1) throw new Error("External entites are not supported");
  const n = t[e++];
  let r = "";
  for (; e < t.length && t[e] !== n; e++)
    r += t[e];
  return [s, r, e];
}
function xb(t, e) {
  return t[e + 1] === "!" && t[e + 2] === "-" && t[e + 3] === "-";
}
function Cb(t, e) {
  return t[e + 1] === "!" && t[e + 2] === "E" && t[e + 3] === "N" && t[e + 4] === "T" && t[e + 5] === "I" && t[e + 6] === "T" && t[e + 7] === "Y";
}
function Ib(t, e) {
  return t[e + 1] === "!" && t[e + 2] === "E" && t[e + 3] === "L" && t[e + 4] === "E" && t[e + 5] === "M" && t[e + 6] === "E" && t[e + 7] === "N" && t[e + 8] === "T";
}
function Tb(t, e) {
  return t[e + 1] === "!" && t[e + 2] === "A" && t[e + 3] === "T" && t[e + 4] === "T" && t[e + 5] === "L" && t[e + 6] === "I" && t[e + 7] === "S" && t[e + 8] === "T";
}
function kb(t, e) {
  return t[e + 1] === "!" && t[e + 2] === "N" && t[e + 3] === "O" && t[e + 4] === "T" && t[e + 5] === "A" && t[e + 6] === "T" && t[e + 7] === "I" && t[e + 8] === "O" && t[e + 9] === "N";
}
function Rb(t) {
  if (Sb.isName(t))
    return t;
  throw new Error(`Invalid entity name ${t}`);
}
var Ob = Eb;
const Nb = /^[-+]?0x[a-fA-F0-9]+$/, Mb = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, Db = {
  hex: !0,
  // oct: false,
  leadingZeros: !0,
  decimalPoint: ".",
  eNotation: !0
  //skipLike: /regex/
};
function Pb(t, e = {}) {
  if (e = Object.assign({}, Db, e), !t || typeof t != "string") return t;
  let s = t.trim();
  if (e.skipLike !== void 0 && e.skipLike.test(s)) return t;
  if (t === "0") return 0;
  if (e.hex && Nb.test(s))
    return Ub(s, 16);
  if (s.search(/[eE]/) !== -1) {
    const n = s.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
    if (n) {
      if (e.leadingZeros)
        s = (n[1] || "") + n[3];
      else if (!(n[2] === "0" && n[3][0] === ".")) return t;
      return e.eNotation ? Number(s) : t;
    } else
      return t;
  } else {
    const n = Mb.exec(s);
    if (n) {
      const r = n[1], a = n[2];
      let i = Bb(n[3]);
      if (!e.leadingZeros && a.length > 0 && r && s[2] !== ".") return t;
      if (!e.leadingZeros && a.length > 0 && !r && s[1] !== ".") return t;
      if (e.leadingZeros && a === t) return 0;
      {
        const o = Number(s), c = "" + o;
        return c.search(/[eE]/) !== -1 ? e.eNotation ? o : t : s.indexOf(".") !== -1 ? c === "0" && i === "" || c === i || r && c === "-" + i ? o : t : a ? i === c || r + i === c ? o : t : s === c || s === r + c ? o : t;
      }
    } else
      return t;
  }
}
function Bb(t) {
  return t && t.indexOf(".") !== -1 && (t = t.replace(/0+$/, ""), t === "." ? t = "0" : t[0] === "." ? t = "0" + t : t[t.length - 1] === "." && (t = t.substr(0, t.length - 1))), t;
}
function Ub(t, e) {
  if (parseInt) return parseInt(t, e);
  if (Number.parseInt) return Number.parseInt(t, e);
  if (window && window.parseInt) return window.parseInt(t, e);
  throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
var Fb = Pb;
const nm = po, ta = bb, $b = Ob, Lb = Fb;
let Hb = class {
  constructor(e) {
    this.options = e, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
      apos: { regex: /&(apos|#39|#x27);/g, val: "'" },
      gt: { regex: /&(gt|#62|#x3E);/g, val: ">" },
      lt: { regex: /&(lt|#60|#x3C);/g, val: "<" },
      quot: { regex: /&(quot|#34|#x22);/g, val: '"' }
    }, this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" }, this.htmlEntities = {
      space: { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      cent: { regex: /&(cent|#162);/g, val: "¢" },
      pound: { regex: /&(pound|#163);/g, val: "£" },
      yen: { regex: /&(yen|#165);/g, val: "¥" },
      euro: { regex: /&(euro|#8364);/g, val: "€" },
      copyright: { regex: /&(copy|#169);/g, val: "©" },
      reg: { regex: /&(reg|#174);/g, val: "®" },
      inr: { regex: /&(inr|#8377);/g, val: "₹" },
      num_dec: { regex: /&#([0-9]{1,7});/g, val: (s, n) => String.fromCharCode(Number.parseInt(n, 10)) },
      num_hex: { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (s, n) => String.fromCharCode(Number.parseInt(n, 16)) }
    }, this.addExternalEntities = jb, this.parseXml = Vb, this.parseTextData = qb, this.resolveNameSpace = zb, this.buildAttributesMap = Wb, this.isItStopNode = Yb, this.replaceEntitiesValue = Jb, this.readStopNodeData = Qb, this.saveTextToParentTag = Zb, this.addChild = Gb;
  }
};
function jb(t) {
  const e = Object.keys(t);
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    this.lastEntities[n] = {
      regex: new RegExp("&" + n + ";", "g"),
      val: t[n]
    };
  }
}
function qb(t, e, s, n, r, a, i) {
  if (t !== void 0 && (this.options.trimValues && !n && (t = t.trim()), t.length > 0)) {
    i || (t = this.replaceEntitiesValue(t));
    const o = this.options.tagValueProcessor(e, t, s, r, a);
    return o == null ? t : typeof o != typeof t || o !== t ? o : this.options.trimValues ? nd(t, this.options.parseTagValue, this.options.numberParseOptions) : t.trim() === t ? nd(t, this.options.parseTagValue, this.options.numberParseOptions) : t;
  }
}
function zb(t) {
  if (this.options.removeNSPrefix) {
    const e = t.split(":"), s = t.charAt(0) === "/" ? "/" : "";
    if (e[0] === "xmlns")
      return "";
    e.length === 2 && (t = s + e[1]);
  }
  return t;
}
const Kb = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function Wb(t, e, s) {
  if (!this.options.ignoreAttributes && typeof t == "string") {
    const n = nm.getAllMatches(t, Kb), r = n.length, a = {};
    for (let i = 0; i < r; i++) {
      const o = this.resolveNameSpace(n[i][1]);
      let c = n[i][4], d = this.options.attributeNamePrefix + o;
      if (o.length)
        if (this.options.transformAttributeName && (d = this.options.transformAttributeName(d)), d === "__proto__" && (d = "#__proto__"), c !== void 0) {
          this.options.trimValues && (c = c.trim()), c = this.replaceEntitiesValue(c);
          const l = this.options.attributeValueProcessor(o, c, e);
          l == null ? a[d] = c : typeof l != typeof c || l !== c ? a[d] = l : a[d] = nd(
            c,
            this.options.parseAttributeValue,
            this.options.numberParseOptions
          );
        } else this.options.allowBooleanAttributes && (a[d] = !0);
    }
    if (!Object.keys(a).length)
      return;
    if (this.options.attributesGroupName) {
      const i = {};
      return i[this.options.attributesGroupName] = a, i;
    }
    return a;
  }
}
const Vb = function(t) {
  t = t.replace(/\r\n?/g, `
`);
  const e = new ta("!xml");
  let s = e, n = "", r = "";
  for (let a = 0; a < t.length; a++)
    if (t[a] === "<")
      if (t[a + 1] === "/") {
        const o = An(t, ">", a, "Closing Tag is not closed.");
        let c = t.substring(a + 2, o).trim();
        if (this.options.removeNSPrefix) {
          const u = c.indexOf(":");
          u !== -1 && (c = c.substr(u + 1));
        }
        this.options.transformTagName && (c = this.options.transformTagName(c)), s && (n = this.saveTextToParentTag(n, s, r));
        const d = r.substring(r.lastIndexOf(".") + 1);
        if (c && this.options.unpairedTags.indexOf(c) !== -1)
          throw new Error(`Unpaired tag can not be used as closing tag: </${c}>`);
        let l = 0;
        d && this.options.unpairedTags.indexOf(d) !== -1 ? (l = r.lastIndexOf(".", r.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : l = r.lastIndexOf("."), r = r.substring(0, l), s = this.tagsNodeStack.pop(), n = "", a = o;
      } else if (t[a + 1] === "?") {
        let o = sd(t, a, !1, "?>");
        if (!o) throw new Error("Pi Tag is not closed.");
        if (n = this.saveTextToParentTag(n, s, r), !(this.options.ignoreDeclaration && o.tagName === "?xml" || this.options.ignorePiTags)) {
          const c = new ta(o.tagName);
          c.add(this.options.textNodeName, ""), o.tagName !== o.tagExp && o.attrExpPresent && (c[":@"] = this.buildAttributesMap(o.tagExp, r, o.tagName)), this.addChild(s, c, r);
        }
        a = o.closeIndex + 1;
      } else if (t.substr(a + 1, 3) === "!--") {
        const o = An(t, "-->", a + 4, "Comment is not closed.");
        if (this.options.commentPropName) {
          const c = t.substring(a + 4, o - 2);
          n = this.saveTextToParentTag(n, s, r), s.add(this.options.commentPropName, [{ [this.options.textNodeName]: c }]);
        }
        a = o;
      } else if (t.substr(a + 1, 2) === "!D") {
        const o = $b(t, a);
        this.docTypeEntities = o.entities, a = o.i;
      } else if (t.substr(a + 1, 2) === "![") {
        const o = An(t, "]]>", a, "CDATA is not closed.") - 2, c = t.substring(a + 9, o);
        n = this.saveTextToParentTag(n, s, r);
        let d = this.parseTextData(c, s.tagname, r, !0, !1, !0, !0);
        d == null && (d = ""), this.options.cdataPropName ? s.add(this.options.cdataPropName, [{ [this.options.textNodeName]: c }]) : s.add(this.options.textNodeName, d), a = o + 2;
      } else {
        let o = sd(t, a, this.options.removeNSPrefix), c = o.tagName;
        const d = o.rawTagName;
        let l = o.tagExp, u = o.attrExpPresent, h = o.closeIndex;
        this.options.transformTagName && (c = this.options.transformTagName(c)), s && n && s.tagname !== "!xml" && (n = this.saveTextToParentTag(n, s, r, !1));
        const f = s;
        if (f && this.options.unpairedTags.indexOf(f.tagname) !== -1 && (s = this.tagsNodeStack.pop(), r = r.substring(0, r.lastIndexOf("."))), c !== e.tagname && (r += r ? "." + c : c), this.isItStopNode(this.options.stopNodes, r, c)) {
          let g = "";
          if (l.length > 0 && l.lastIndexOf("/") === l.length - 1)
            c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), r = r.substr(0, r.length - 1), l = c) : l = l.substr(0, l.length - 1), a = o.closeIndex;
          else if (this.options.unpairedTags.indexOf(c) !== -1)
            a = o.closeIndex;
          else {
            const w = this.readStopNodeData(t, d, h + 1);
            if (!w) throw new Error(`Unexpected end of ${d}`);
            a = w.i, g = w.tagContent;
          }
          const _ = new ta(c);
          c !== l && u && (_[":@"] = this.buildAttributesMap(l, r, c)), g && (g = this.parseTextData(g, c, r, !0, u, !0, !0)), r = r.substr(0, r.lastIndexOf(".")), _.add(this.options.textNodeName, g), this.addChild(s, _, r);
        } else {
          if (l.length > 0 && l.lastIndexOf("/") === l.length - 1) {
            c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), r = r.substr(0, r.length - 1), l = c) : l = l.substr(0, l.length - 1), this.options.transformTagName && (c = this.options.transformTagName(c));
            const g = new ta(c);
            c !== l && u && (g[":@"] = this.buildAttributesMap(l, r, c)), this.addChild(s, g, r), r = r.substr(0, r.lastIndexOf("."));
          } else {
            const g = new ta(c);
            this.tagsNodeStack.push(s), c !== l && u && (g[":@"] = this.buildAttributesMap(l, r, c)), this.addChild(s, g, r), s = g;
          }
          n = "", a = h;
        }
      }
    else
      n += t[a];
  return e.child;
};
function Gb(t, e, s) {
  const n = this.options.updateTag(e.tagname, s, e[":@"]);
  n === !1 || (typeof n == "string" && (e.tagname = n), t.addChild(e));
}
const Jb = function(t) {
  if (this.options.processEntities) {
    for (let e in this.docTypeEntities) {
      const s = this.docTypeEntities[e];
      t = t.replace(s.regx, s.val);
    }
    for (let e in this.lastEntities) {
      const s = this.lastEntities[e];
      t = t.replace(s.regex, s.val);
    }
    if (this.options.htmlEntities)
      for (let e in this.htmlEntities) {
        const s = this.htmlEntities[e];
        t = t.replace(s.regex, s.val);
      }
    t = t.replace(this.ampEntity.regex, this.ampEntity.val);
  }
  return t;
};
function Zb(t, e, s, n) {
  return t && (n === void 0 && (n = Object.keys(e.child).length === 0), t = this.parseTextData(
    t,
    e.tagname,
    s,
    !1,
    e[":@"] ? Object.keys(e[":@"]).length !== 0 : !1,
    n
  ), t !== void 0 && t !== "" && e.add(this.options.textNodeName, t), t = ""), t;
}
function Yb(t, e, s) {
  const n = "*." + s;
  for (const r in t) {
    const a = t[r];
    if (n === a || e === a) return !0;
  }
  return !1;
}
function Xb(t, e, s = ">") {
  let n, r = "";
  for (let a = e; a < t.length; a++) {
    let i = t[a];
    if (n)
      i === n && (n = "");
    else if (i === '"' || i === "'")
      n = i;
    else if (i === s[0])
      if (s[1]) {
        if (t[a + 1] === s[1])
          return {
            data: r,
            index: a
          };
      } else
        return {
          data: r,
          index: a
        };
    else i === "	" && (i = " ");
    r += i;
  }
}
function An(t, e, s, n) {
  const r = t.indexOf(e, s);
  if (r === -1)
    throw new Error(n);
  return r + e.length - 1;
}
function sd(t, e, s, n = ">") {
  const r = Xb(t, e + 1, n);
  if (!r) return;
  let a = r.data;
  const i = r.index, o = a.search(/\s/);
  let c = a, d = !0;
  o !== -1 && (c = a.substring(0, o), a = a.substring(o + 1).trimStart());
  const l = c;
  if (s) {
    const u = c.indexOf(":");
    u !== -1 && (c = c.substr(u + 1), d = c !== r.data.substr(u + 1));
  }
  return {
    tagName: c,
    tagExp: a,
    closeIndex: i,
    attrExpPresent: d,
    rawTagName: l
  };
}
function Qb(t, e, s) {
  const n = s;
  let r = 1;
  for (; s < t.length; s++)
    if (t[s] === "<")
      if (t[s + 1] === "/") {
        const a = An(t, ">", s, `${e} is not closed`);
        if (t.substring(s + 2, a).trim() === e && (r--, r === 0))
          return {
            tagContent: t.substring(n, s),
            i: a
          };
        s = a;
      } else if (t[s + 1] === "?")
        s = An(t, "?>", s + 1, "StopNode is not closed.");
      else if (t.substr(s + 1, 3) === "!--")
        s = An(t, "-->", s + 3, "StopNode is not closed.");
      else if (t.substr(s + 1, 2) === "![")
        s = An(t, "]]>", s, "StopNode is not closed.") - 2;
      else {
        const a = sd(t, s, ">");
        a && ((a && a.tagName) === e && a.tagExp[a.tagExp.length - 1] !== "/" && r++, s = a.closeIndex);
      }
}
function nd(t, e, s) {
  if (e && typeof t == "string") {
    const n = t.trim();
    return n === "true" ? !0 : n === "false" ? !1 : Lb(t, s);
  } else
    return nm.isExist(t) ? t : "";
}
var eS = Hb, rm = {};
function tS(t, e) {
  return am(t, e);
}
function am(t, e, s) {
  let n;
  const r = {};
  for (let a = 0; a < t.length; a++) {
    const i = t[a], o = sS(i);
    let c = "";
    if (s === void 0 ? c = o : c = s + "." + o, o === e.textNodeName)
      n === void 0 ? n = i[o] : n += "" + i[o];
    else {
      if (o === void 0)
        continue;
      if (i[o]) {
        let d = am(i[o], e, c);
        const l = rS(d, e);
        i[":@"] ? nS(d, i[":@"], c, e) : Object.keys(d).length === 1 && d[e.textNodeName] !== void 0 && !e.alwaysCreateTextNode ? d = d[e.textNodeName] : Object.keys(d).length === 0 && (e.alwaysCreateTextNode ? d[e.textNodeName] = "" : d = ""), r[o] !== void 0 && r.hasOwnProperty(o) ? (Array.isArray(r[o]) || (r[o] = [r[o]]), r[o].push(d)) : e.isArray(o, c, l) ? r[o] = [d] : r[o] = d;
      }
    }
  }
  return typeof n == "string" ? n.length > 0 && (r[e.textNodeName] = n) : n !== void 0 && (r[e.textNodeName] = n), r;
}
function sS(t) {
  const e = Object.keys(t);
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    if (n !== ":@") return n;
  }
}
function nS(t, e, s, n) {
  if (e) {
    const r = Object.keys(e), a = r.length;
    for (let i = 0; i < a; i++) {
      const o = r[i];
      n.isArray(o, s + "." + o, !0, !0) ? t[o] = [e[o]] : t[o] = e[o];
    }
  }
}
function rS(t, e) {
  const { textNodeName: s } = e, n = Object.keys(t).length;
  return !!(n === 0 || n === 1 && (t[s] || typeof t[s] == "boolean" || t[s] === 0));
}
rm.prettify = tS;
const { buildOptions: aS } = Rd, iS = eS, { prettify: oS } = rm, cS = tm;
let dS = class {
  constructor(e) {
    this.externalEntities = {}, this.options = aS(e);
  }
  /**
   * Parse XML dats to JS object 
   * @param {string|Buffer} xmlData 
   * @param {boolean|Object} validationOption 
   */
  parse(e, s) {
    if (typeof e != "string") if (e.toString)
      e = e.toString();
    else
      throw new Error("XML data is accepted in String or Bytes[] form.");
    if (s) {
      s === !0 && (s = {});
      const a = cS.validate(e, s);
      if (a !== !0)
        throw Error(`${a.err.msg}:${a.err.line}:${a.err.col}`);
    }
    const n = new iS(this.options);
    n.addExternalEntities(this.externalEntities);
    const r = n.parseXml(e);
    return this.options.preserveOrder || r === void 0 ? r : oS(r, this.options);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key 
   * @param {string} value 
   */
  addEntity(e, s) {
    if (s.indexOf("&") !== -1)
      throw new Error("Entity value can't have '&'");
    if (e.indexOf("&") !== -1 || e.indexOf(";") !== -1)
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    if (s === "&")
      throw new Error("An entity with value '&' is not permitted");
    this.externalEntities[e] = s;
  }
};
var lS = dS;
const uS = lS;
var hS = {
  XMLParser: uS
};
const jr = (t, e) => db(t, e).then((s) => {
  if (s.length) {
    const n = new hS.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: !0,
      ignoreAttributes: !1,
      ignoreDeclaration: !0,
      parseTagValue: !1,
      trimValues: !1,
      tagValueProcessor: (c, d) => d.trim() === "" && d.includes(`
`) ? "" : void 0
    });
    n.addEntity("#xD", "\r"), n.addEntity("#10", `
`);
    let r;
    try {
      r = n.parse(s, !0);
    } catch (c) {
      throw c && typeof c == "object" && Object.defineProperty(c, "$responseBodyText", {
        value: s
      }), c;
    }
    const a = "#text", i = Object.keys(r)[0], o = r[i];
    return o[a] && (o[i] = o[a], delete o[a]), Wp(o);
  }
  return {};
}), fS = async (t, e) => {
  const s = await jr(t, e);
  return s.Error && (s.Error.message = s.Error.message ?? s.Error.Message), s;
}, pS = (t, e) => {
  var s;
  if (((s = e == null ? void 0 : e.Error) == null ? void 0 : s.Code) !== void 0)
    return e.Error.Code;
  if ((e == null ? void 0 : e.Code) !== void 0)
    return e.Code;
  if (t.statusCode == 404)
    return "NotFound";
}, rd = [
  Te.CRC32,
  Te.CRC32C,
  Te.SHA1,
  Te.SHA256
], mS = [
  Te.SHA256,
  Te.SHA1,
  Te.CRC32,
  Te.CRC32C
], gS = (t, { requestChecksumRequired: e, requestAlgorithmMember: s }, n) => {
  const r = n ? Gv : Vv;
  if (!s || !t[s])
    return e ? r : void 0;
  const a = t[s];
  if (!rd.includes(a))
    throw new Error(`The checksum algorithm "${a}" is not supported by the client. Select one of ${rd}.`);
  return a;
}, Od = (t) => t === Te.MD5 ? "content-md5" : `x-amz-checksum-${t.toLowerCase()}`, yS = (t, e) => {
  const s = t.toLowerCase();
  for (const n of Object.keys(e))
    if (s === n.toLowerCase())
      return !0;
  return !1;
}, wS = (t, e) => {
  const s = t.toLowerCase();
  for (const n of Object.keys(e))
    if (n.toLowerCase().startsWith(s))
      return !0;
  return !1;
}, Nd = (t) => t !== void 0 && typeof t != "string" && !ArrayBuffer.isView(t) && !xp(t);
function Md(t, e, s, n) {
  function r(a) {
    return a instanceof s ? a : new s(function(i) {
      i(a);
    });
  }
  return new (s || (s = Promise))(function(a, i) {
    function o(l) {
      try {
        d(n.next(l));
      } catch (u) {
        i(u);
      }
    }
    function c(l) {
      try {
        d(n.throw(l));
      } catch (u) {
        i(u);
      }
    }
    function d(l) {
      l.done ? a(l.value) : r(l.value).then(o, c);
    }
    d((n = n.apply(t, e || [])).next());
  });
}
function Dd(t, e) {
  var s = { label: 0, sent: function() {
    if (a[0] & 1) throw a[1];
    return a[1];
  }, trys: [], ops: [] }, n, r, a, i = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return i.next = o(0), i.throw = o(1), i.return = o(2), typeof Symbol == "function" && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function o(d) {
    return function(l) {
      return c([d, l]);
    };
  }
  function c(d) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; i && (i = 0, d[0] && (s = 0)), s; ) try {
      if (n = 1, r && (a = d[0] & 2 ? r.return : d[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, d[1])).done) return a;
      switch (r = 0, a && (d = [d[0] & 2, a.value]), d[0]) {
        case 0:
        case 1:
          a = d;
          break;
        case 4:
          return s.label++, { value: d[1], done: !1 };
        case 5:
          s.label++, r = d[1], d = [0];
          continue;
        case 7:
          d = s.ops.pop(), s.trys.pop();
          continue;
        default:
          if (a = s.trys, !(a = a.length > 0 && a[a.length - 1]) && (d[0] === 6 || d[0] === 2)) {
            s = 0;
            continue;
          }
          if (d[0] === 3 && (!a || d[1] > a[0] && d[1] < a[3])) {
            s.label = d[1];
            break;
          }
          if (d[0] === 6 && s.label < a[1]) {
            s.label = a[1], a = d;
            break;
          }
          if (a && s.label < a[2]) {
            s.label = a[2], s.ops.push(d);
            break;
          }
          a[2] && s.ops.pop(), s.trys.pop();
          continue;
      }
      d = e.call(t, s);
    } catch (l) {
      d = [6, l], r = 0;
    } finally {
      n = a = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
  }
}
function im(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, s = e && t[e], n = 0;
  if (s) return s.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
const _S = (t) => new TextEncoder().encode(t);
var vS = typeof Buffer < "u" && Buffer.from ? function(t) {
  return Buffer.from(t, "utf8");
} : _S;
function ln(t) {
  return t instanceof Uint8Array ? t : typeof t == "string" ? vS(t) : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(t);
}
function va(t) {
  return typeof t == "string" ? t.length === 0 : t.byteLength === 0;
}
function om(t) {
  return new Uint8Array([
    (t & 4278190080) >> 24,
    (t & 16711680) >> 16,
    (t & 65280) >> 8,
    t & 255
  ]);
}
function cm(t) {
  if (!Uint32Array.from) {
    for (var e = new Uint32Array(t.length), s = 0; s < t.length; )
      e[s] = t[s], s += 1;
    return e;
  }
  return Uint32Array.from(t);
}
var bS = (
  /** @class */
  function() {
    function t() {
      this.crc32c = new Tu();
    }
    return t.prototype.update = function(e) {
      va(e) || this.crc32c.update(ln(e));
    }, t.prototype.digest = function() {
      return Md(this, void 0, void 0, function() {
        return Dd(this, function(e) {
          return [2, om(this.crc32c.digest())];
        });
      });
    }, t.prototype.reset = function() {
      this.crc32c = new Tu();
    }, t;
  }()
), Tu = (
  /** @class */
  function() {
    function t() {
      this.checksum = 4294967295;
    }
    return t.prototype.update = function(e) {
      var s, n;
      try {
        for (var r = im(e), a = r.next(); !a.done; a = r.next()) {
          var i = a.value;
          this.checksum = this.checksum >>> 8 ^ ES[(this.checksum ^ i) & 255];
        }
      } catch (o) {
        s = { error: o };
      } finally {
        try {
          a && !a.done && (n = r.return) && n.call(r);
        } finally {
          if (s) throw s.error;
        }
      }
      return this;
    }, t.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    }, t;
  }()
), SS = [
  0,
  4067132163,
  3778769143,
  324072436,
  3348797215,
  904991772,
  648144872,
  3570033899,
  2329499855,
  2024987596,
  1809983544,
  2575936315,
  1296289744,
  3207089363,
  2893594407,
  1578318884,
  274646895,
  3795141740,
  4049975192,
  51262619,
  3619967088,
  632279923,
  922689671,
  3298075524,
  2592579488,
  1760304291,
  2075979607,
  2312596564,
  1562183871,
  2943781820,
  3156637768,
  1313733451,
  549293790,
  3537243613,
  3246849577,
  871202090,
  3878099393,
  357341890,
  102525238,
  4101499445,
  2858735121,
  1477399826,
  1264559846,
  3107202533,
  1845379342,
  2677391885,
  2361733625,
  2125378298,
  820201905,
  3263744690,
  3520608582,
  598981189,
  4151959214,
  85089709,
  373468761,
  3827903834,
  3124367742,
  1213305469,
  1526817161,
  2842354314,
  2107672161,
  2412447074,
  2627466902,
  1861252501,
  1098587580,
  3004210879,
  2688576843,
  1378610760,
  2262928035,
  1955203488,
  1742404180,
  2511436119,
  3416409459,
  969524848,
  714683780,
  3639785095,
  205050476,
  4266873199,
  3976438427,
  526918040,
  1361435347,
  2739821008,
  2954799652,
  1114974503,
  2529119692,
  1691668175,
  2005155131,
  2247081528,
  3690758684,
  697762079,
  986182379,
  3366744552,
  476452099,
  3993867776,
  4250756596,
  255256311,
  1640403810,
  2477592673,
  2164122517,
  1922457750,
  2791048317,
  1412925310,
  1197962378,
  3037525897,
  3944729517,
  427051182,
  170179418,
  4165941337,
  746937522,
  3740196785,
  3451792453,
  1070968646,
  1905808397,
  2213795598,
  2426610938,
  1657317369,
  3053634322,
  1147748369,
  1463399397,
  2773627110,
  4215344322,
  153784257,
  444234805,
  3893493558,
  1021025245,
  3467647198,
  3722505002,
  797665321,
  2197175160,
  1889384571,
  1674398607,
  2443626636,
  1164749927,
  3070701412,
  2757221520,
  1446797203,
  137323447,
  4198817972,
  3910406976,
  461344835,
  3484808360,
  1037989803,
  781091935,
  3705997148,
  2460548119,
  1623424788,
  1939049696,
  2180517859,
  1429367560,
  2807687179,
  3020495871,
  1180866812,
  410100952,
  3927582683,
  4182430767,
  186734380,
  3756733383,
  763408580,
  1053836080,
  3434856499,
  2722870694,
  1344288421,
  1131464017,
  2971354706,
  1708204729,
  2545590714,
  2229949006,
  1988219213,
  680717673,
  3673779818,
  3383336350,
  1002577565,
  4010310262,
  493091189,
  238226049,
  4233660802,
  2987750089,
  1082061258,
  1395524158,
  2705686845,
  1972364758,
  2279892693,
  2494862625,
  1725896226,
  952904198,
  3399985413,
  3656866545,
  731699698,
  4283874585,
  222117402,
  510512622,
  3959836397,
  3280807620,
  837199303,
  582374963,
  3504198960,
  68661723,
  4135334616,
  3844915500,
  390545967,
  1230274059,
  3141532936,
  2825850620,
  1510247935,
  2395924756,
  2091215383,
  1878366691,
  2644384480,
  3553878443,
  565732008,
  854102364,
  3229815391,
  340358836,
  3861050807,
  4117890627,
  119113024,
  1493875044,
  2875275879,
  3090270611,
  1247431312,
  2660249211,
  1828433272,
  2141937292,
  2378227087,
  3811616794,
  291187481,
  34330861,
  4032846830,
  615137029,
  3603020806,
  3314634738,
  939183345,
  1776939221,
  2609017814,
  2295496738,
  2058945313,
  2926798794,
  1545135305,
  1330124605,
  3173225534,
  4084100981,
  17165430,
  307568514,
  3762199681,
  888469610,
  3332340585,
  3587147933,
  665062302,
  2042050490,
  2346497209,
  2559330125,
  1793573966,
  3190661285,
  1279665062,
  1595330642,
  2910671697
], ES = cm(SS), AS = (
  /** @class */
  function() {
    function t() {
      this.crc32 = new ku();
    }
    return t.prototype.update = function(e) {
      va(e) || this.crc32.update(ln(e));
    }, t.prototype.digest = function() {
      return Md(this, void 0, void 0, function() {
        return Dd(this, function(e) {
          return [2, om(this.crc32.digest())];
        });
      });
    }, t.prototype.reset = function() {
      this.crc32 = new ku();
    }, t;
  }()
), ku = (
  /** @class */
  function() {
    function t() {
      this.checksum = 4294967295;
    }
    return t.prototype.update = function(e) {
      var s, n;
      try {
        for (var r = im(e), a = r.next(); !a.done; a = r.next()) {
          var i = a.value;
          this.checksum = this.checksum >>> 8 ^ CS[(this.checksum ^ i) & 255];
        }
      } catch (o) {
        s = { error: o };
      } finally {
        try {
          a && !a.done && (n = r.return) && n.call(r);
        } finally {
          if (s) throw s.error;
        }
      }
      return this;
    }, t.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    }, t;
  }()
), xS = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
], CS = cm(xS);
const IS = () => AS, dm = (t, e) => {
  switch (t) {
    case Te.MD5:
      return e.md5;
    case Te.CRC32:
      return IS();
    case Te.CRC32C:
      return bS;
    case Te.SHA1:
      return e.sha1;
    case Te.SHA256:
      return e.sha256;
    default:
      throw new Error(`Unsupported checksum algorithm: ${t}`);
  }
}, lm = (t, e) => {
  const s = new t();
  return s.update(Ln(e || "")), s.digest();
}, TS = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: !0
}, kS = (t, e) => (s, n) => async (r) => {
  if (!De.isInstance(r.request) || wS("x-amz-checksum-", r.request.headers))
    return s(r);
  const { request: a, input: i } = r, { body: o, headers: c } = a, { base64Encoder: d, streamHasher: l } = t, { requestChecksumRequired: u, requestAlgorithmMember: h } = e, f = gS(i, {
    requestChecksumRequired: u,
    requestAlgorithmMember: h == null ? void 0 : h.name
  }, !!n.isS3ExpressBucket);
  let g = o, _ = c;
  if (f) {
    switch (f) {
      case Te.CRC32:
        ut(n, "FLEXIBLE_CHECKSUMS_REQ_CRC32", "U");
        break;
      case Te.CRC32C:
        ut(n, "FLEXIBLE_CHECKSUMS_REQ_CRC32C", "V");
        break;
      case Te.SHA1:
        ut(n, "FLEXIBLE_CHECKSUMS_REQ_SHA1", "X");
        break;
      case Te.SHA256:
        ut(n, "FLEXIBLE_CHECKSUMS_REQ_SHA256", "Y");
        break;
    }
    const b = Od(f), I = dm(f, t);
    if (Nd(o)) {
      const { getAwsChunkedEncodingStream: D, bodyLengthChecker: M } = t;
      g = D(o, {
        base64Encoder: d,
        bodyLengthChecker: M,
        checksumLocationName: b,
        checksumAlgorithmFn: I,
        streamHasher: l
      }), _ = {
        ...c,
        "content-encoding": c["content-encoding"] ? `${c["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": c["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": b
      }, delete _["content-length"];
    } else if (!yS(b, c)) {
      const D = await lm(I, o);
      _ = {
        ...c,
        [b]: d(D)
      };
    }
  }
  return await s({
    ...r,
    request: {
      ...a,
      headers: _,
      body: g
    }
  });
}, um = (t = []) => {
  const e = [];
  for (const s of mS)
    !t.includes(s) || !rd.includes(s) || e.push(s);
  return e;
}, RS = (t) => {
  const e = t.lastIndexOf("-");
  if (e !== -1) {
    const s = t.slice(e + 1);
    if (!s.startsWith("0")) {
      const n = parseInt(s, 10);
      if (!isNaN(n) && n >= 1 && n <= 1e4)
        return !0;
    }
  }
  return !1;
};
function Ru(t) {
  return new Blob([t]).stream();
}
const OS = async (t, { checksumAlgorithmFn: e, base64Encoder: s }) => s(await lm(e, t)), NS = async (t, { config: e, responseAlgorithms: s }) => {
  const n = um(s), { body: r, headers: a } = t;
  for (const i of n) {
    const o = Od(i), c = a[o];
    if (c) {
      const d = dm(i, e), { base64Encoder: l } = e;
      if (Nd(r)) {
        t.body = Av({
          expectedChecksum: c,
          checksumSourceLocation: o,
          checksum: new d(),
          source: r,
          base64Encoder: l
        });
        return;
      }
      const u = await OS(r, { checksumAlgorithmFn: d, base64Encoder: l });
      if (u === c)
        break;
      throw new Error(`Checksum mismatch: expected "${u}" but received "${c}" in response header "${o}".`);
    }
  }
}, MS = {
  name: "flexibleChecksumsResponseMiddleware",
  toMiddleware: "deserializerMiddleware",
  relation: "after",
  tags: ["BODY_CHECKSUM"],
  override: !0
}, DS = (t, e) => (s, n) => async (r) => {
  if (!De.isInstance(r.request))
    return s(r);
  const a = r.input, i = await s(r), o = i.response;
  let c;
  const { requestValidationModeMember: d, responseAlgorithms: l } = e;
  if (d && a[d] === "ENABLED") {
    const { clientName: u, commandName: h } = n;
    if (u === "S3Client" && h === "GetObjectCommand" && um(l).every((_) => {
      const w = Od(_), b = o.headers[w];
      return !b || RS(b);
    }))
      return i;
    const g = Nd(o.body);
    g && (c = await t.streamCollector(o.body), o.body = Ru(c)), await NS(i.response, {
      config: t,
      responseAlgorithms: l
    }), g && c && (o.body = Ru(c));
  }
  return i;
}, Pd = (t, e) => ({
  applyToStack: (s) => {
    s.add(kS(t, e), TS), s.addRelativeTo(DS(t, e), MS);
  }
}), PS = (t) => ({
  ...t,
  requestChecksumCalculation: us(t.requestChecksumCalculation ?? Kv),
  responseChecksumValidation: us(t.responseChecksumValidation ?? Wv)
});
const BS = (t) => (e) => async (s) => {
  if (!De.isInstance(s.request))
    return e(s);
  const { request: n } = s, { handlerProtocol: r = "" } = t.requestHandler.metadata || {};
  if (r.indexOf("h2") >= 0 && !n.headers[":authority"])
    delete n.headers.host, n.headers[":authority"] = n.hostname + (n.port ? ":" + n.port : "");
  else if (!n.headers.host) {
    let a = n.hostname;
    n.port != null && (a += `:${n.port}`), n.headers.host = a;
  }
  return e(s);
}, US = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: !0
}, FS = (t) => ({
  applyToStack: (e) => {
    e.add(BS(t), US);
  }
}), $S = () => (t, e) => async (s) => {
  var n, r;
  try {
    const a = await t(s), { clientName: i, commandName: o, logger: c, dynamoDbDocumentClientOptions: d = {} } = e, { overrideInputFilterSensitiveLog: l, overrideOutputFilterSensitiveLog: u } = d, h = l ?? e.inputFilterSensitiveLog, f = u ?? e.outputFilterSensitiveLog, { $metadata: g, ..._ } = a.output;
    return (n = c == null ? void 0 : c.info) == null || n.call(c, {
      clientName: i,
      commandName: o,
      input: h(s.input),
      output: f(_),
      metadata: g
    }), a;
  } catch (a) {
    const { clientName: i, commandName: o, logger: c, dynamoDbDocumentClientOptions: d = {} } = e, { overrideInputFilterSensitiveLog: l } = d, u = l ?? e.inputFilterSensitiveLog;
    throw (r = c == null ? void 0 : c.error) == null || r.call(c, {
      clientName: i,
      commandName: o,
      input: u(s.input),
      error: a,
      metadata: a.$metadata
    }), a;
  }
}, LS = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: !0
}, HS = (t) => ({
  applyToStack: (e) => {
    e.add($S(), LS);
  }
}), Ou = "X-Amzn-Trace-Id", jS = "AWS_LAMBDA_FUNCTION_NAME", qS = "_X_AMZN_TRACE_ID", zS = (t) => (e) => async (s) => {
  const { request: n } = s;
  if (!De.isInstance(n) || t.runtime !== "node" || n.headers.hasOwnProperty(Ou))
    return e(s);
  const r = process.env[jS], a = process.env[qS], i = (o) => typeof o == "string" && o.length > 0;
  return i(r) && i(a) && (n.headers[Ou] = a), e({
    ...s,
    request: n
  });
}, KS = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: !0,
  priority: "low"
}, WS = (t) => ({
  applyToStack: (e) => {
    e.add(zS(t), KS);
  }
}), VS = "content-length";
function GS() {
  return (t, e) => async (s) => {
    var r;
    const { request: n } = s;
    if (De.isInstance(n) && !(VS in n.headers)) {
      const a = "Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.";
      typeof ((r = e == null ? void 0 : e.logger) == null ? void 0 : r.warn) == "function" && !(e.logger instanceof Id) ? e.logger.warn(a) : console.warn(a);
    }
    return t({ ...s });
  };
}
const JS = {
  step: "finalizeRequest",
  tags: ["CHECK_CONTENT_LENGTH_HEADER"],
  name: "getCheckContentLengthHeaderPlugin",
  override: !0
}, ZS = (t) => ({
  applyToStack: (e) => {
    e.add(GS(), JS);
  }
}), YS = (t) => (e, s) => async (n) => {
  const r = await t.region(), a = t.region;
  let i = () => {
  };
  s.__s3RegionRedirect && (Object.defineProperty(t, "region", {
    writable: !1,
    value: async () => s.__s3RegionRedirect
  }), i = () => Object.defineProperty(t, "region", {
    writable: !0,
    value: a
  }));
  try {
    const o = await e(n);
    if (s.__s3RegionRedirect) {
      i();
      const c = await t.region();
      if (r !== c)
        throw new Error("Region was not restored following S3 region redirect.");
    }
    return o;
  } catch (o) {
    throw i(), o;
  }
}, XS = {
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectEndpointMiddleware",
  override: !0,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
function QS(t) {
  return (e, s) => async (n) => {
    var r, a, i;
    try {
      return await e(n);
    } catch (o) {
      if (t.followRegionRedirects && (((r = o == null ? void 0 : o.$metadata) == null ? void 0 : r.httpStatusCode) === 301 || ((a = o == null ? void 0 : o.$metadata) == null ? void 0 : a.httpStatusCode) === 400 && (o == null ? void 0 : o.name) === "IllegalLocationConstraintException")) {
        try {
          const c = o.$response.headers["x-amz-bucket-region"];
          (i = s.logger) == null || i.debug(`Redirecting from ${await t.region()} to ${c}`), s.__s3RegionRedirect = c;
        } catch (c) {
          throw new Error("Region redirect failed: " + c);
        }
        return e(n);
      }
      throw o;
    }
  };
}
const eE = {
  step: "initialize",
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectMiddleware",
  override: !0
}, tE = (t) => ({
  applyToStack: (e) => {
    e.add(QS(t), eE), e.addRelativeTo(YS(t), XS);
  }
}), sE = (t) => (e, s) => async (n) => {
  var i;
  const r = await e(n), { response: a } = r;
  if (Fn.isInstance(a) && a.headers.expires) {
    a.headers.expiresstring = a.headers.expires;
    try {
      $n(a.headers.expires);
    } catch (o) {
      (i = s.logger) == null || i.warn(`AWS SDK Warning for ${s.clientName}::${s.commandName} response parsing (${a.headers.expires}): ${o}`), delete a.headers.expires;
    }
  }
  return r;
}, nE = {
  tags: ["S3"],
  name: "s3ExpiresMiddleware",
  override: !0,
  relation: "after",
  toMiddleware: "deserializerMiddleware"
}, hm = (t) => ({
  applyToStack: (e) => {
    e.addRelativeTo(sE(), nE);
  }
}), ao = class ao {
  constructor(e = {}) {
    p(this, "data");
    p(this, "lastPurgeTime", Date.now());
    this.data = e;
  }
  get(e) {
    const s = this.data[e];
    if (s)
      return s;
  }
  set(e, s) {
    return this.data[e] = s, s;
  }
  delete(e) {
    delete this.data[e];
  }
  async purgeExpired() {
    const e = Date.now();
    if (!(this.lastPurgeTime + ao.EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS > e))
      for (const s in this.data) {
        const n = this.data[s];
        if (!n.isRefreshing) {
          const r = await n.identity;
          r.expiration && r.expiration.getTime() < e && delete this.data[s];
        }
      }
  }
};
p(ao, "EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS", 3e4);
let ad = ao;
class jo {
  constructor(e, s = !1, n = Date.now()) {
    p(this, "_identity");
    p(this, "isRefreshing");
    p(this, "accessed");
    this._identity = e, this.isRefreshing = s, this.accessed = n;
  }
  get identity() {
    return this.accessed = Date.now(), this._identity;
  }
}
const io = class io {
  constructor(e, s = new ad()) {
    p(this, "createSessionFn");
    p(this, "cache");
    this.createSessionFn = e, this.cache = s;
  }
  async getS3ExpressIdentity(e, s) {
    const n = s.Bucket, { cache: r } = this, a = r.get(n);
    return a ? a.identity.then((i) => {
      var d, l;
      return (((d = i.expiration) == null ? void 0 : d.getTime()) ?? 0) < Date.now() ? r.set(n, new jo(this.getIdentity(n))).identity : ((((l = i.expiration) == null ? void 0 : l.getTime()) ?? 0) < Date.now() + io.REFRESH_WINDOW_MS && !a.isRefreshing && (a.isRefreshing = !0, this.getIdentity(n).then((u) => {
        r.set(n, new jo(Promise.resolve(u)));
      })), i);
    }) : r.set(n, new jo(this.getIdentity(n))).identity;
  }
  async getIdentity(e) {
    var r, a;
    await this.cache.purgeExpired().catch((i) => {
      console.warn(`Error while clearing expired entries in S3ExpressIdentityCache: 
` + i);
    });
    const s = await this.createSessionFn(e);
    if (!((r = s.Credentials) != null && r.AccessKeyId) || !((a = s.Credentials) != null && a.SecretAccessKey))
      throw new Error("s3#createSession response credential missing AccessKeyId or SecretAccessKey.");
    return {
      accessKeyId: s.Credentials.AccessKeyId,
      secretAccessKey: s.Credentials.SecretAccessKey,
      sessionToken: s.Credentials.SessionToken,
      expiration: s.Credentials.Expiration ? new Date(s.Credentials.Expiration) : void 0
    };
  }
};
p(io, "REFRESH_WINDOW_MS", 6e4);
let id = io;
const rE = "Directory", aE = "S3Express", iE = "sigv4-s3express", od = "X-Amz-S3session-Token", cd = od.toLowerCase();
class oE extends Wi {
  async signWithCredentials(e, s, n) {
    const r = Nu(s);
    e.headers[cd] = s.sessionToken;
    const a = this;
    return Mu(a, r), a.signRequest(e, n ?? {});
  }
  async presignWithCredentials(e, s, n) {
    const r = Nu(s);
    return delete e.headers[cd], e.headers[od] = s.sessionToken, e.query = e.query ?? {}, e.query[od] = s.sessionToken, Mu(this, r), this.presign(e, n);
  }
}
function Nu(t) {
  return {
    accessKeyId: t.accessKeyId,
    secretAccessKey: t.secretAccessKey,
    expiration: t.expiration
  };
}
function Mu(t, e) {
  const s = setTimeout(() => {
    throw new Error("SignatureV4S3Express credential override was created but not called.");
  }, 10), n = t.credentialProvider, r = () => (clearTimeout(s), t.credentialProvider = n, Promise.resolve(e));
  t.credentialProvider = r;
}
const cE = (t) => (e, s) => async (n) => {
  var r, a, i, o, c;
  if (s.endpointV2) {
    const d = s.endpointV2, l = ((i = (a = (r = d.properties) == null ? void 0 : r.authSchemes) == null ? void 0 : a[0]) == null ? void 0 : i.name) === iE;
    if ((((o = d.properties) == null ? void 0 : o.backend) === aE || ((c = d.properties) == null ? void 0 : c.bucketType) === rE) && (ut(s, "S3_EXPRESS_BUCKET", "J"), s.isS3ExpressBucket = !0), l) {
      const h = n.input.Bucket;
      if (h) {
        const f = await t.s3ExpressIdentityProvider.getS3ExpressIdentity(await t.credentials(), {
          Bucket: h
        });
        s.s3ExpressIdentity = f, De.isInstance(n.request) && f.sessionToken && (n.request.headers[cd] = f.sessionToken);
      }
    }
  }
  return e(n);
}, dE = {
  name: "s3ExpressMiddleware",
  step: "build",
  tags: ["S3", "S3_EXPRESS"],
  override: !0
}, lE = (t) => ({
  applyToStack: (e) => {
    e.add(cE(t), dE);
  }
}), uE = async (t, e, s, n) => {
  const r = await n.signWithCredentials(s, t, {});
  if (r.headers["X-Amz-Security-Token"] || r.headers["x-amz-security-token"])
    throw new Error("X-Amz-Security-Token must not be set for s3-express requests.");
  return r;
}, hE = (t) => (e) => {
  throw e;
}, fE = (t, e) => {
}, pE = (t) => (e, s) => async (n) => {
  if (!De.isInstance(n.request))
    return e(n);
  const a = $r(s).selectedHttpAuthScheme;
  if (!a)
    throw new Error("No HttpAuthScheme was selected: unable to sign request");
  const { httpAuthOption: { signingProperties: i = {} }, identity: o, signer: c } = a;
  let d;
  s.s3ExpressIdentity ? d = await uE(s.s3ExpressIdentity, i, n.request, await t.signer()) : d = await c.sign(n.request, o, i);
  const l = await e({
    ...n,
    request: d
  }).catch((c.errorHandler || hE)(i));
  return (c.successHandler || fE)(l.response, i), l;
}, mE = (t) => ({
  applyToStack: (e) => {
    e.addRelativeTo(pE(t), qp);
  }
}), gE = (t, { session: e }) => {
  const [s, n] = e;
  return {
    ...t,
    forcePathStyle: t.forcePathStyle ?? !1,
    useAccelerateEndpoint: t.useAccelerateEndpoint ?? !1,
    disableMultiregionAccessPoints: t.disableMultiregionAccessPoints ?? !1,
    followRegionRedirects: t.followRegionRedirects ?? !1,
    s3ExpressIdentityProvider: t.s3ExpressIdentityProvider ?? new id(async (r) => s().send(new n({
      Bucket: r,
      SessionMode: "ReadWrite"
    }))),
    bucketEndpoint: t.bucketEndpoint ?? !1
  };
}, yE = {
  CopyObjectCommand: !0,
  UploadPartCopyCommand: !0,
  CompleteMultipartUploadCommand: !0
}, wE = 3e3, _E = (t) => (e, s) => async (n) => {
  const r = await e(n), { response: a } = r;
  if (!Fn.isInstance(a))
    return r;
  const { statusCode: i, body: o } = a;
  if (i < 200 || i >= 300 || !(typeof (o == null ? void 0 : o.stream) == "function" || typeof (o == null ? void 0 : o.pipe) == "function" || typeof (o == null ? void 0 : o.tee) == "function"))
    return r;
  let d = o, l = o;
  o && typeof o == "object" && !(o instanceof Uint8Array) && ([d, l] = await Rv(o)), a.body = l;
  const u = await vE(d, {
    streamCollector: async (f) => Cv(f, wE)
  });
  typeof (d == null ? void 0 : d.destroy) == "function" && d.destroy();
  const h = t.utf8Encoder(u.subarray(u.length - 16));
  if (u.length === 0 && yE[s.commandName]) {
    const f = new Error("S3 aborted request");
    throw f.name = "InternalError", f;
  }
  return h && h.endsWith("</Error>") && (a.statusCode = 400), r;
}, vE = (t = new Uint8Array(), e) => t instanceof Uint8Array ? Promise.resolve(t) : e.streamCollector(t) || Promise.resolve(new Uint8Array()), bE = {
  relation: "after",
  toMiddleware: "deserializerMiddleware",
  tags: ["THROW_200_EXCEPTIONS", "S3"],
  name: "throw200ExceptionsMiddleware",
  override: !0
}, ms = (t) => ({
  applyToStack: (e) => {
    e.addRelativeTo(_E(t), bE);
  }
}), SE = (t) => typeof t == "string" && t.indexOf("arn:") === 0 && t.split(":").length >= 6;
function EE(t) {
  return (e, s) => async (n) => {
    var r, a, i, o;
    if (t.bucketEndpoint) {
      const c = s.endpointV2;
      if (c) {
        const d = n.input.Bucket;
        if (typeof d == "string")
          try {
            const l = new URL(d);
            s.endpointV2 = {
              ...c,
              url: l
            };
          } catch (l) {
            const u = `@aws-sdk/middleware-sdk-s3: bucketEndpoint=true was set but Bucket=${d} could not be parsed as URL.`;
            throw ((a = (r = s.logger) == null ? void 0 : r.constructor) == null ? void 0 : a.name) === "NoOpLogger" ? console.warn(u) : (o = (i = s.logger) == null ? void 0 : i.warn) == null || o.call(i, u), l;
          }
      }
    }
    return e(n);
  };
}
const AE = {
  name: "bucketEndpointMiddleware",
  override: !0,
  relation: "after",
  toMiddleware: "endpointV2Middleware"
};
function xE({ bucketEndpoint: t }) {
  return (e) => async (s) => {
    const { input: { Bucket: n } } = s;
    if (!t && typeof n == "string" && !SE(n) && n.indexOf("/") >= 0) {
      const r = new Error(`Bucket name shouldn't contain '/', received '${n}'`);
      throw r.name = "InvalidBucketName", r;
    }
    return e({ ...s });
  };
}
const CE = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: !0
}, IE = (t) => ({
  applyToStack: (e) => {
    e.add(xE(t), CE), e.addRelativeTo(EE(t), AE);
  }
}), TE = void 0;
function kE(t) {
  return t === void 0 ? !0 : typeof t == "string" && t.length <= 50;
}
function RE(t) {
  const e = pr(t.userAgentAppId ?? TE);
  return {
    ...t,
    customUserAgent: typeof t.customUserAgent == "string" ? [[t.customUserAgent]] : t.customUserAgent,
    userAgentAppId: async () => {
      var n, r;
      const s = await e();
      if (!kE(s)) {
        const a = ((r = (n = t.logger) == null ? void 0 : n.constructor) == null ? void 0 : r.name) === "NoOpLogger" || !t.logger ? console : t.logger;
        typeof s != "string" ? a == null || a.warn("userAgentAppId must be a string or undefined.") : s.length > 50 && (a == null || a.warn("The provided userAgentAppId exceeds the maximum length of 50 characters."));
      }
      return s;
    }
  };
}
const fm = (t, e = !1) => {
  if (e) {
    for (const s of t.split("."))
      if (!fm(s))
        return !1;
    return !0;
  }
  return !(!uo(t) || t.length < 3 || t.length > 63 || t !== t.toLowerCase() || kp(t));
}, Du = ":", OE = "/", NE = (t) => {
  const e = t.split(Du);
  if (e.length < 6)
    return null;
  const [s, n, r, a, i, ...o] = e;
  if (s !== "arn" || n === "" || r === "" || o.join(Du) === "")
    return null;
  const c = o.map((d) => d.split(OE)).flat();
  return {
    partition: n,
    service: r,
    region: a,
    accountId: i,
    resourceId: c
  };
}, ME = [
  {
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-east-1",
      name: "aws",
      supportsDualStack: !0,
      supportsFIPS: !0
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "ap-southeast-5": {
        description: "Asia Pacific (Malaysia)"
      },
      "ap-southeast-7": {
        description: "Asia Pacific (Thailand)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "ca-west-1": {
        description: "Canada West (Calgary)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "il-central-1": {
        description: "Israel (Tel Aviv)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  },
  {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      implicitGlobalRegion: "cn-northwest-1",
      name: "aws-cn",
      supportsDualStack: !0,
      supportsFIPS: !0
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  },
  {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-gov-west-1",
      name: "aws-us-gov",
      supportsDualStack: !0,
      supportsFIPS: !0
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  },
  {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      implicitGlobalRegion: "us-iso-east-1",
      name: "aws-iso",
      supportsDualStack: !1,
      supportsFIPS: !0
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  },
  {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      implicitGlobalRegion: "us-isob-east-1",
      name: "aws-iso-b",
      supportsDualStack: !1,
      supportsFIPS: !0
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  },
  {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      implicitGlobalRegion: "eu-isoe-west-1",
      name: "aws-iso-e",
      supportsDualStack: !1,
      supportsFIPS: !0
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {
      "eu-isoe-west-1": {
        description: "EU ISOE West"
      }
    }
  },
  {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      implicitGlobalRegion: "us-isof-south-1",
      name: "aws-iso-f",
      supportsDualStack: !1,
      supportsFIPS: !0
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {}
  }
], DE = {
  partitions: ME
};
let PE = DE;
const BE = (t) => {
  const { partitions: e } = PE;
  for (const n of e) {
    const { regions: r, outputs: a } = n;
    for (const [i, o] of Object.entries(r))
      if (i === t)
        return {
          ...a,
          ...o
        };
  }
  for (const n of e) {
    const { regionRegex: r, outputs: a } = n;
    if (new RegExp(r).test(t))
      return {
        ...a
      };
  }
  const s = e.find((n) => n.id === "aws");
  if (!s)
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  return {
    ...s.outputs
  };
}, pm = {
  isVirtualHostableS3Bucket: fm,
  parseArn: NE,
  partition: BE
};
Ad.aws = pm;
const UE = /\d{12}\.ddb/;
async function FE(t, e, s) {
  var a, i, o, c, d, l, u;
  const n = s.request;
  if (((a = n == null ? void 0 : n.headers) == null ? void 0 : a["smithy-protocol"]) === "rpc-v2-cbor" && ut(t, "PROTOCOL_RPC_V2_CBOR", "M"), typeof e.retryStrategy == "function") {
    const h = await e.retryStrategy();
    typeof h.acquireInitialRetryToken == "function" ? (o = (i = h.constructor) == null ? void 0 : i.name) != null && o.includes("Adaptive") ? ut(t, "RETRY_MODE_ADAPTIVE", "F") : ut(t, "RETRY_MODE_STANDARD", "E") : ut(t, "RETRY_MODE_LEGACY", "D");
  }
  if (typeof e.accountIdEndpointMode == "function") {
    const h = t.endpointV2;
    switch (String((c = h == null ? void 0 : h.url) == null ? void 0 : c.hostname).match(UE) && ut(t, "ACCOUNT_ID_ENDPOINT", "O"), await ((d = e.accountIdEndpointMode) == null ? void 0 : d.call(e))) {
      case "disabled":
        ut(t, "ACCOUNT_ID_MODE_DISABLED", "Q");
        break;
      case "preferred":
        ut(t, "ACCOUNT_ID_MODE_PREFERRED", "P");
        break;
      case "required":
        ut(t, "ACCOUNT_ID_MODE_REQUIRED", "R");
        break;
    }
  }
  const r = (u = (l = t.__smithy_context) == null ? void 0 : l.selectedHttpAuthScheme) == null ? void 0 : u.identity;
  if (r != null && r.$source) {
    const h = r;
    h.accountId && ut(t, "RESOLVED_ACCOUNT_ID", "T");
    for (const [f, g] of Object.entries(h.$source ?? {}))
      ut(t, f, g);
  }
}
const Pu = "user-agent", qo = "x-amz-user-agent", Bu = " ", zo = "/", $E = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g, LE = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g, Uu = "-", HE = 1024;
function jE(t) {
  let e = "";
  for (const s in t) {
    const n = t[s];
    if (e.length + n.length + 1 <= HE) {
      e.length ? e += "," + n : e += n;
      continue;
    }
    break;
  }
  return e;
}
const qE = (t) => (e, s) => async (n) => {
  var f, g, _, w;
  const { request: r } = n;
  if (!De.isInstance(r))
    return e(n);
  const { headers: a } = r, i = ((f = s == null ? void 0 : s.userAgent) == null ? void 0 : f.map(oi)) || [], o = (await t.defaultUserAgentProvider()).map(oi);
  await FE(s, t, n);
  const c = s;
  o.push(`m/${jE(Object.assign({}, (g = s.__smithy_context) == null ? void 0 : g.features, (_ = c.__aws_sdk_context) == null ? void 0 : _.features))}`);
  const d = ((w = t == null ? void 0 : t.customUserAgent) == null ? void 0 : w.map(oi)) || [], l = await t.userAgentAppId();
  l && o.push(oi([`app/${l}`]));
  const u = [].concat([...o, ...i, ...d]).join(Bu), h = [
    ...o.filter((b) => b.startsWith("aws-sdk-")),
    ...d
  ].join(Bu);
  return t.runtime !== "browser" ? (h && (a[qo] = a[qo] ? `${a[Pu]} ${h}` : h), a[Pu] = u) : a[qo] = u, e({
    ...n,
    request: r
  });
}, oi = (t) => {
  var i;
  const e = t[0].split(zo).map((o) => o.replace($E, Uu)).join(zo), s = (i = t[1]) == null ? void 0 : i.replace(LE, Uu), n = e.indexOf(zo), r = e.substring(0, n);
  let a = e.substring(n + 1);
  return r === "api" && (a = a.toLowerCase()), [r, a, s].filter((o) => o && o.length > 0).reduce((o, c, d) => {
    switch (d) {
      case 0:
        return c;
      case 1:
        return `${o}/${c}`;
      default:
        return `${o}#${c}`;
    }
  }, "");
}, zE = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: !0
}, KE = (t) => ({
  applyToStack: (e) => {
    e.add(qE(t), zE);
  }
});
async function WE(t, e, s = 1024 * 1024) {
  const n = t.size;
  let r = 0;
  for (; r < n; ) {
    const a = t.slice(r, Math.min(n, r + s));
    e(new Uint8Array(await a.arrayBuffer())), r += a.size;
  }
}
const VE = async function(e, s) {
  const n = new e();
  return await WE(s, (r) => {
    n.update(r);
  }), n.digest();
};
class GE {
  constructor() {
    p(this, "digestLength", 16);
    p(this, "state", Uint32Array.from(Fu));
    p(this, "writeBuffer", new DataView(new ArrayBuffer(64)));
    p(this, "bufferLength", 0);
    p(this, "bytesHashed", 0);
  }
  update(e) {
    const s = Ln(e);
    let n = 0, r = s.byteLength;
    for (this.bytesHashed += r; r > 0; )
      this.writeBuffer.setUint8(this.bufferLength++, s[n++]), --r, this.bufferLength === 64 && (Ko(this.state, this.writeBuffer), this.bufferLength = 0);
  }
  async digest() {
    const e = Uint32Array.from(this.state), s = new DataView(this.writeBuffer.buffer.slice(0));
    let n = this.bufferLength;
    const r = this.bytesHashed * 8;
    if (s.setUint8(n++, 128), this.bufferLength % 64 >= 56) {
      for (let o = n; o < 64; ++o)
        s.setUint8(o, 0);
      Ko(e, s), n = 0;
    }
    for (let o = n; o < 56; ++o)
      s.setUint8(o, 0);
    s.setUint32(56, r >>> 0, !0), s.setUint32(60, Math.floor(r / 2 ** 32), !0), Ko(e, s);
    const a = new Uint8Array(16), i = new DataView(a.buffer);
    for (let o = 0; o < 4; ++o)
      i.setUint32(o * 4, e[o], !0);
    return a;
  }
  reset() {
    this.state.set(Fu), this.writeBuffer = new DataView(new ArrayBuffer(64)), this.bufferLength = 0, this.bytesHashed = 0;
  }
}
const Fu = [1732584193, 4023233417, 2562383102, 271733878], Hs = 4294967295, JE = Uint8Array.of(7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21), ZE = Array.from({ length: 64 }, (t, e) => Math.abs(Math.sin(e + 1)) * 2 ** 32 >>> 0);
function Ko(t, e) {
  let s = t[0], n = t[1], r = t[2], a = t[3];
  for (let i = 0; i < 64; ++i) {
    let o, c;
    i < 16 ? (o = n & r | ~n & a, c = i) : i < 32 ? (o = a & n | r & ~a, c = (5 * i + 1) % 16) : i < 48 ? (o = n ^ r ^ a, c = (3 * i + 5) % 16) : (o = r ^ (n | ~a), c = 7 * i % 16);
    const d = e.getUint32(c * 4, !0), l = a;
    a = r, r = n;
    const u = JE[(i >> 4) * 4 + (i & 3)], h = (s + o & Hs) + (d + ZE[i] & Hs) & Hs;
    n = n + ((h << u | h >>> 32 - u) >>> 0) & Hs, s = l;
  }
  t[0] = t[0] + s & Hs, t[1] = t[1] + n & Hs, t[2] = t[2] + r & Hs, t[3] = t[3] + a & Hs;
}
const mm = new Uint32Array(256);
for (let t = 0; t < 256; ++t) {
  let e = t;
  for (let s = 0; s < 8; ++s)
    e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
  mm[t] = e >>> 0;
}
const Wo = 4294967295;
class gm {
  constructor() {
    p(this, "digestLength", 4);
    p(this, "checksum", Wo);
  }
  update(e) {
    for (let s = 0; s < e.length; ++s)
      this.checksum = this.checksum >>> 8 ^ mm[(this.checksum ^ e[s]) & 255];
  }
  digestSync() {
    return (this.checksum ^ Wo) >>> 0;
  }
  async digest() {
    const e = this.digestSync(), s = new Uint8Array(4);
    return new DataView(s.buffer).setUint32(0, e, !1), s;
  }
  reset() {
    this.checksum = Wo;
  }
}
class ha {
  constructor(e) {
    p(this, "bytes");
    if (this.bytes = e, e.byteLength !== 8)
      throw new Error("Int64 buffers must be exactly 8 bytes");
  }
  static fromNumber(e) {
    if (e > 9223372036854776e3 || e < -9223372036854776e3)
      throw new Error(`${e} is too large (or, if negative, too small) to represent as an Int64`);
    const s = new Uint8Array(8);
    for (let n = 7, r = Math.abs(Math.round(e)); n > -1 && r > 0; n--, r /= 256)
      s[n] = r;
    return e < 0 && $u(s), new ha(s);
  }
  valueOf() {
    const e = this.bytes.slice(0), s = e[0] & 128;
    return s && $u(e), parseInt(pt(e), 16) * (s ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
}
function $u(t) {
  for (let e = 0; e < 8; e++)
    t[e] ^= 255;
  for (let e = 7; e > -1 && (t[e]++, t[e] === 0); e--)
    ;
}
class YE {
  constructor(e, s) {
    p(this, "toUtf8");
    p(this, "fromUtf8");
    this.toUtf8 = e, this.fromUtf8 = s;
  }
  format(e) {
    const s = [];
    for (const a in e) {
      if (!Et(e, a))
        continue;
      const i = this.fromUtf8(a);
      s.push(Uint8Array.from([i.byteLength]), i, this.formatHeaderValue(e[a]));
    }
    const n = new Uint8Array(s.reduce((a, i) => a + i.byteLength, 0));
    let r = 0;
    for (const a of s)
      n.set(a, r), r += a.byteLength;
    return n;
  }
  formatHeaderValue(e) {
    switch (e.type) {
      case "boolean":
        return Uint8Array.from([e.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, e.value]);
      case "short":
        const s = new DataView(new ArrayBuffer(3));
        return s.setUint8(0, 3), s.setInt16(1, e.value, !1), new Uint8Array(s.buffer);
      case "integer":
        const n = new DataView(new ArrayBuffer(5));
        return n.setUint8(0, 4), n.setInt32(1, e.value, !1), new Uint8Array(n.buffer);
      case "long":
        const r = new Uint8Array(9);
        return r[0] = 5, r.set(e.value.bytes, 1), r;
      case "binary":
        const a = new DataView(new ArrayBuffer(3 + e.value.byteLength));
        a.setUint8(0, 6), a.setUint16(1, e.value.byteLength, !1);
        const i = new Uint8Array(a.buffer);
        return i.set(e.value, 3), i;
      case "string":
        const o = this.fromUtf8(e.value), c = new DataView(new ArrayBuffer(3 + o.byteLength));
        c.setUint8(0, 7), c.setUint16(1, o.byteLength, !1);
        const d = new Uint8Array(c.buffer);
        return d.set(o, 3), d;
      case "timestamp":
        const l = new Uint8Array(9);
        return l[0] = 8, l.set(ha.fromNumber(e.value.valueOf()).bytes, 1), l;
      case "uuid":
        if (!iA.test(e.value))
          throw new Error(`Invalid UUID received: ${e.value}`);
        const u = new Uint8Array(17);
        return u[0] = 9, u.set(Ap(e.value.replace(/-/g, "")), 1), u;
    }
  }
  parse(e) {
    const s = {};
    let n = 0;
    for (; n < e.byteLength; ) {
      const r = e.getUint8(n++), a = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r));
      switch (n += r, e.getUint8(n++)) {
        case 0:
          s[a] = {
            type: Hu,
            value: !0
          };
          break;
        case 1:
          s[a] = {
            type: Hu,
            value: !1
          };
          break;
        case 2:
          s[a] = {
            type: XE,
            value: e.getInt8(n++)
          };
          break;
        case 3:
          s[a] = {
            type: QE,
            value: e.getInt16(n, !1)
          }, n += 2;
          break;
        case 4:
          s[a] = {
            type: eA,
            value: e.getInt32(n, !1)
          }, n += 4;
          break;
        case 5:
          s[a] = {
            type: tA,
            value: new ha(new Uint8Array(e.buffer, e.byteOffset + n, 8))
          }, n += 8;
          break;
        case 6:
          const i = e.getUint16(n, !1);
          n += 2, s[a] = {
            type: sA,
            value: new Uint8Array(e.buffer, e.byteOffset + n, i)
          }, n += i;
          break;
        case 7:
          const o = e.getUint16(n, !1);
          n += 2, s[a] = {
            type: nA,
            value: this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, o))
          }, n += o;
          break;
        case 8:
          s[a] = {
            type: rA,
            value: new Date(new ha(new Uint8Array(e.buffer, e.byteOffset + n, 8)).valueOf())
          }, n += 8;
          break;
        case 9:
          const c = new Uint8Array(e.buffer, e.byteOffset + n, 16);
          n += 16, s[a] = {
            type: aA,
            value: `${pt(c.subarray(0, 4))}-${pt(c.subarray(4, 6))}-${pt(c.subarray(6, 8))}-${pt(c.subarray(8, 10))}-${pt(c.subarray(10))}`
          };
          break;
        default:
          throw new Error("Unrecognized header type tag");
      }
    }
    return s;
  }
}
var Lu;
(function(t) {
  t[t.boolTrue = 0] = "boolTrue", t[t.boolFalse = 1] = "boolFalse", t[t.byte = 2] = "byte", t[t.short = 3] = "short", t[t.integer = 4] = "integer", t[t.long = 5] = "long", t[t.byteArray = 6] = "byteArray", t[t.string = 7] = "string", t[t.timestamp = 8] = "timestamp", t[t.uuid = 9] = "uuid";
})(Lu || (Lu = {}));
const Hu = "boolean", XE = "byte", QE = "short", eA = "integer", tA = "long", sA = "binary", nA = "string", rA = "timestamp", aA = "uuid", iA = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/, ym = 4, Ks = ym * 2, Sn = 4, oA = Ks + Sn * 2;
function cA({ byteLength: t, byteOffset: e, buffer: s }) {
  if (t < oA)
    throw new Error("Provided message too short to accommodate event stream message overhead");
  const n = new DataView(s, e, t), r = n.getUint32(0, !1);
  if (t !== r)
    throw new Error("Reported message length does not match received message length");
  const a = n.getUint32(ym, !1), i = n.getUint32(Ks, !1), o = n.getUint32(t - Sn, !1), c = new gm();
  if (c.update(new Uint8Array(s, e, Ks)), i !== c.digestSync())
    throw new Error(`The prelude checksum specified in the message (${i}) does not match the calculated CRC32 checksum (${c.digestSync()})`);
  if (c.update(new Uint8Array(s, e + Ks, t - (Ks + Sn))), o !== c.digestSync())
    throw new Error(`The message checksum (${c.digestSync()}) did not match the expected value of ${o}`);
  return {
    headers: new DataView(s, e + Ks + Sn, a),
    body: new Uint8Array(s, e + Ks + Sn + a, r - a - (Ks + Sn + Sn))
  };
}
class dA {
  constructor(e, s) {
    p(this, "headerMarshaller");
    p(this, "messageBuffer");
    p(this, "isEndOfStream");
    this.headerMarshaller = new YE(e, s), this.messageBuffer = [], this.isEndOfStream = !1;
  }
  feed(e) {
    this.messageBuffer.push(this.decode(e));
  }
  endOfStream() {
    this.isEndOfStream = !0;
  }
  getMessage() {
    const e = this.messageBuffer.pop(), s = this.isEndOfStream;
    return {
      getMessage() {
        return e;
      },
      isEndOfStream() {
        return s;
      }
    };
  }
  getAvailableMessages() {
    const e = this.messageBuffer;
    this.messageBuffer = [];
    const s = this.isEndOfStream;
    return {
      getMessages() {
        return e;
      },
      isEndOfStream() {
        return s;
      }
    };
  }
  encode({ headers: e, body: s }) {
    const n = this.headerMarshaller.format(e), r = n.byteLength + s.byteLength + 16, a = new Uint8Array(r), i = new DataView(a.buffer, a.byteOffset, a.byteLength), o = new gm();
    return i.setUint32(0, r, !1), i.setUint32(4, n.byteLength, !1), o.update(a.subarray(0, 8)), i.setUint32(8, o.digestSync(), !1), a.set(n, 12), a.set(s, n.byteLength + 12), o.update(a.subarray(8, r - 4)), i.setUint32(r - 4, o.digestSync(), !1), a;
  }
  decode(e) {
    const { headers: s, body: n } = cA(e);
    return { headers: this.headerMarshaller.parse(s), body: n };
  }
  formatHeaders(e) {
    return this.headerMarshaller.format(e);
  }
}
class lA {
  constructor(e) {
    p(this, "options");
    this.options = e;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const e of this.options.inputStream)
      yield this.options.decoder.decode(e);
  }
}
class uA {
  constructor(e) {
    p(this, "options");
    this.options = e;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const e of this.options.messageStream)
      yield this.options.encoder.encode(e);
    this.options.includeEndFrame && (yield new Uint8Array(0));
  }
}
class hA {
  constructor(e) {
    p(this, "options");
    this.options = e;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const e of this.options.messageStream) {
      const s = await this.options.deserializer(e);
      s !== void 0 && (yield s);
    }
  }
}
class fA {
  constructor(e) {
    p(this, "options");
    this.options = e;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const e of this.options.inputStream)
      yield this.options.serializer(e);
  }
}
function pA(t) {
  let e = 0, s = 0, n = null, r = null;
  const a = (o) => {
    if (typeof o != "number")
      throw new Error("Attempted to allocate an event message where size was not a number: " + o);
    e = o, s = 4, n = new Uint8Array(o), new DataView(n.buffer).setUint32(0, o, !1);
  }, i = async function* () {
    const o = t[Symbol.asyncIterator]();
    for (; ; ) {
      const { value: c, done: d } = await o.next();
      if (d) {
        if (e)
          if (e === s)
            yield n;
          else
            throw new Error("Truncated event message received.");
        else return;
        return;
      }
      const l = c.length;
      let u = 0;
      for (; u < l; ) {
        if (!n) {
          const f = l - u;
          r || (r = new Uint8Array(4));
          const g = Math.min(4 - s, f);
          if (r.set(c.slice(u, u + g), s), s += g, u += g, s < 4)
            break;
          a(new DataView(r.buffer).getUint32(0, !1)), r = null;
        }
        const h = Math.min(e - s, l - u);
        n.set(c.slice(u, u + h), s), s += h, u += h, e && e === s && (yield n, n = null, e = 0, s = 0);
      }
    }
  };
  return {
    [Symbol.asyncIterator]: i
  };
}
function mA(t, e) {
  return async function(s) {
    const { value: n } = s.headers[":message-type"];
    if (n === "error") {
      const r = new Error(s.headers[":error-message"].value || "UnknownError");
      throw r.name = s.headers[":error-code"].value, r;
    } else if (n === "exception") {
      const r = s.headers[":exception-type"].value, a = { [r]: s }, i = await t(a);
      if (i.$unknown) {
        const o = new Error(e(s.body));
        throw o.name = r, o;
      }
      throw i[r];
    } else if (n === "event") {
      const r = {
        [s.headers[":event-type"].value]: s
      }, a = await t(r);
      return a.$unknown ? void 0 : a;
    } else
      throw Error(`Unrecognizable event type: ${s.headers[":event-type"].value}`);
  };
}
let gA = class {
  constructor({ utf8Encoder: e, utf8Decoder: s }) {
    p(this, "eventStreamCodec");
    p(this, "utfEncoder");
    this.eventStreamCodec = new dA(e, s), this.utfEncoder = e;
  }
  deserialize(e, s) {
    const n = pA(e);
    return new hA({
      messageStream: new lA({ inputStream: n, decoder: this.eventStreamCodec }),
      deserializer: mA(s, this.utfEncoder)
    });
  }
  serialize(e, s) {
    return new uA({
      messageStream: new fA({ inputStream: e, serializer: s }),
      encoder: this.eventStreamCodec,
      includeEndFrame: !0
    });
  }
};
const yA = (t) => ({
  [Symbol.asyncIterator]: async function* () {
    const e = t.getReader();
    try {
      for (; ; ) {
        const { done: s, value: n } = await e.read();
        if (s)
          return;
        yield n;
      }
    } finally {
      e.releaseLock();
    }
  }
}), wA = (t) => {
  const e = t[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(s) {
      const { done: n, value: r } = await e.next();
      if (n)
        return s.close();
      s.enqueue(r);
    }
  });
};
class _A {
  constructor({ utf8Encoder: e, utf8Decoder: s }) {
    p(this, "universalMarshaller");
    this.universalMarshaller = new gA({
      utf8Decoder: s,
      utf8Encoder: e
    });
  }
  deserialize(e, s) {
    const n = vA(e) ? yA(e) : e;
    return this.universalMarshaller.deserialize(n, s);
  }
  serialize(e, s) {
    const n = this.universalMarshaller.serialize(e, s);
    return typeof ReadableStream == "function" ? wA(n) : n;
  }
}
const vA = (t) => typeof ReadableStream == "function" && t instanceof ReadableStream, bA = (t) => new _A(t), SA = (t) => Object.assign(t, {
  eventStreamMarshaller: t.eventStreamSerdeProvider(t)
}), EA = (t) => (t == null ? void 0 : t.body) instanceof ReadableStream, AA = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
], xA = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"], CA = [500, 502, 503, 504], IA = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"], TA = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND", "EAI_AGAIN"], kA = (t) => (t == null ? void 0 : t.$retryable) !== void 0, RA = (t) => {
  var e;
  return (e = t.$metadata) == null ? void 0 : e.clockSkewCorrected;
}, OA = (t) => {
  const e = /* @__PURE__ */ new Set([
    "Failed to fetch",
    "NetworkError when attempting to fetch resource",
    "The Internet connection appears to be offline",
    "Load failed",
    "Network request failed"
  ]);
  return t && t instanceof TypeError ? e.has(t.message) : !1;
}, wm = (t) => {
  var e, s;
  return ((e = t.$metadata) == null ? void 0 : e.httpStatusCode) === 429 || AA.includes(t.name) || ((s = t.$retryable) == null ? void 0 : s.throttling) == !0;
}, Bd = (t, e = 0) => {
  var s, n;
  return (t == null ? void 0 : t.name) !== "AbortError" && (kA(t) || RA(t) || t.name === "InvalidSignatureException" && ((s = t.message) == null ? void 0 : s.includes("Signature expired")) || xA.includes(t.name) || IA.includes((t == null ? void 0 : t.code) || "") || TA.includes((t == null ? void 0 : t.code) || "") || CA.includes(((n = t.$metadata) == null ? void 0 : n.httpStatusCode) || 0) || OA(t) || MA(t) || t.cause !== void 0 && e <= 10 && Bd(t.cause, e + 1));
}, NA = (t) => {
  var e;
  if (((e = t.$metadata) == null ? void 0 : e.httpStatusCode) !== void 0) {
    const s = t.$metadata.httpStatusCode;
    return 500 <= s && s <= 599 && !Bd(t);
  }
  return !1;
};
function MA(t) {
  return t.code === "ERR_HTTP2_STREAM_ERROR" && t.message.includes("NGHTTP2_REFUSED_STREAM");
}
const _m = 20 * 1e3, ju = 500, DA = 1, PA = "amz-sdk-invocation-id", BA = "amz-sdk-request";
function UA(t, e) {
  var s, n, r, a;
  if (Fn.isInstance(t))
    for (const i in t.headers) {
      if (!Et(t.headers, i))
        continue;
      const o = i.toLowerCase();
      if (o === "retry-after") {
        const c = t.headers[i];
        let d = NaN;
        if (c.endsWith("GMT"))
          try {
            d = ($n(c).getTime() - Date.now()) / 1e3;
          } catch (l) {
            (s = e == null ? void 0 : e.trace) == null || s.call(e, "Failed to parse retry-after header"), (n = e == null ? void 0 : e.trace) == null || n.call(e, l);
          }
        else c.match(/ GMT, ((\d+)|(\d+\.\d+))$/) ? d = Number((r = c.match(/ GMT, ([\d.]+)$/)) == null ? void 0 : r[1]) : c.match(/^((\d+)|(\d+\.\d+))$/) ? d = Number(c) : Date.parse(c) >= Date.now() && (d = (Date.parse(c) - Date.now()) / 1e3);
        return isNaN(d) ? void 0 : new Date(Date.now() + d * 1e3);
      } else if (o === "x-amz-retry-after") {
        const c = t.headers[i], d = Number(c);
        if (isNaN(d)) {
          (a = e == null ? void 0 : e.trace) == null || a.call(e, `Failed to parse x-amz-retry-after=${c}`);
          return;
        }
        return new Date(Date.now() + d);
      }
    }
}
const FA = (t) => t instanceof Error ? t : t instanceof Object ? Object.assign(new Error(), t) : typeof t == "string" ? new Error(t) : new Error(`AWS SDK error wrapper for ${t}`);
function $A(t) {
  return (e) => (s, n) => async (r) => {
    var o, c;
    let a = await e.retryStrategy();
    const i = await e.maxAttempts();
    if (HA(a)) {
      a = a;
      let d = await a.acquireInitialRetryToken((n.partition_id ?? "") + (n.__retryLongPoll ? ":longpoll" : "")), l = new Error(), u = 0, h = 0;
      const { request: f } = r, g = De.isInstance(f);
      for (g && (f.headers[PA] = Nv()); ; )
        try {
          g && (f.headers[BA] = `attempt=${u + 1}; max=${i}`);
          const { response: _, output: w } = await s(r);
          return a.recordSuccess(d), w.$metadata.attempts = u + 1, w.$metadata.totalRetryDelay = h, { response: _, output: w };
        } catch (_) {
          const w = jA(_, e.logger);
          if (l = FA(_), g && t(f))
            throw (o = n.logger instanceof Id ? console : n.logger) == null || o.warn("An error was encountered in a non-retryable streaming request."), l;
          try {
            d = await a.refreshRetryTokenForRetry(d, w);
          } catch {
            throw l.$metadata || (l.$metadata = {}), l.$metadata.attempts = u + 1, l.$metadata.totalRetryDelay = h, l;
          }
          u = d.getRetryCount();
          const b = d.getRetryDelay();
          h += (((c = d == null ? void 0 : d.$retryLog) == null ? void 0 : c.acquisitionDelay) ?? 0) + b, b > 0 && await LA(b);
        }
    } else
      return a = a, a != null && a.mode && (n.userAgent = [...n.userAgent || [], ["cfg/retry-mode", a.mode]]), a.retry(s, r);
  };
}
const LA = (t) => new Promise((e) => setTimeout(e, t)), HA = (t) => typeof t.acquireInitialRetryToken < "u" && typeof t.refreshRetryTokenForRetry < "u" && typeof t.recordSuccess < "u", jA = (t, e) => {
  const s = {
    error: t,
    errorType: qA(t)
  }, n = UA(t.$response, e);
  return n && (s.retryAfterHint = n), s;
}, qA = (t) => wm(t) ? "THROTTLING" : Bd(t) ? "TRANSIENT" : NA(t) ? "SERVER_ERROR" : "CLIENT_ERROR", zA = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: !0
};
function KA(t) {
  const e = $A(t);
  return (s) => ({
    applyToStack: (n) => {
      n.add(e(s), zA);
    }
  });
}
const oo = class oo {
  constructor(e) {
    p(this, "beta");
    p(this, "minCapacity");
    p(this, "minFillRate");
    p(this, "scaleConstant");
    p(this, "smooth");
    p(this, "enabled", !1);
    p(this, "availableTokens", 0);
    p(this, "lastMaxRate", 0);
    p(this, "measuredTxRate", 0);
    p(this, "requestCount", 0);
    p(this, "fillRate");
    p(this, "lastThrottleTime");
    p(this, "lastTimestamp", 0);
    p(this, "lastTxRateBucket");
    p(this, "maxCapacity");
    p(this, "timeWindow", 0);
    this.beta = (e == null ? void 0 : e.beta) ?? 0.7, this.minCapacity = (e == null ? void 0 : e.minCapacity) ?? 1, this.minFillRate = (e == null ? void 0 : e.minFillRate) ?? 0.5, this.scaleConstant = (e == null ? void 0 : e.scaleConstant) ?? 0.4, this.smooth = (e == null ? void 0 : e.smooth) ?? 0.8, this.lastThrottleTime = this.getCurrentTimeInSeconds(), this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  updateClientSendingRate(e) {
    let s;
    this.updateMeasuredRate();
    const n = e;
    if ((n == null ? void 0 : n.errorType) === "THROTTLING" || wm((n == null ? void 0 : n.error) ?? e)) {
      const i = this.enabled ? Math.min(this.measuredTxRate, this.fillRate) : this.measuredTxRate;
      this.lastMaxRate = i, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), s = this.cubicThrottle(i), this.enableTokenBucket();
    } else
      this.calculateTimeWindow(), s = this.cubicSuccess(this.getCurrentTimeInSeconds());
    const a = Math.min(s, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(a);
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async acquireTokenBucket(e) {
    if (this.enabled) {
      for (this.refillTokenBucket(); e > this.availableTokens; ) {
        const s = (e - this.availableTokens) / this.fillRate * 1e3;
        await new Promise((n) => oo.setTimeoutFn(n, s)), this.refillTokenBucket();
      }
      this.availableTokens = this.availableTokens - e;
    }
  }
  refillTokenBucket() {
    const e = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = e;
      return;
    }
    const s = (e - this.lastTimestamp) * this.fillRate;
    this.availableTokens = Math.min(this.maxCapacity, this.availableTokens + s), this.lastTimestamp = e;
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(e) {
    return this.getPrecise(e * this.beta);
  }
  cubicSuccess(e) {
    return this.getPrecise(this.scaleConstant * Math.pow(e - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = !0;
  }
  updateTokenBucketRate(e) {
    this.refillTokenBucket(), this.fillRate = Math.max(e, this.minFillRate), this.maxCapacity = Math.max(e, this.minCapacity), this.availableTokens = Math.min(this.availableTokens, this.maxCapacity);
  }
  updateMeasuredRate() {
    const e = this.getCurrentTimeInSeconds(), s = Math.floor(e * 2) / 2;
    if (this.requestCount++, s > this.lastTxRateBucket) {
      const n = this.requestCount / (s - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(n * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = s;
    }
  }
  getPrecise(e) {
    return parseFloat(e.toFixed(8));
  }
};
p(oo, "setTimeoutFn", (e, s) => setTimeout(e, s));
let dd = oo;
var qf;
const Zs = class Zs {
  static delay() {
    return Zs.v2026 ? 50 : 100;
  }
  static throttlingDelay() {
    return Zs.v2026 ? 1e3 : 500;
  }
  static cost() {
    return Zs.v2026 ? 14 : 5;
  }
  static throttlingCost() {
    return Zs.v2026 ? 5 : 10;
  }
  static modifiedCostType() {
    return Zs.v2026 ? "THROTTLING" : "TRANSIENT";
  }
};
p(Zs, "v2026", typeof process < "u" && ((qf = process.env) == null ? void 0 : qf.SMITHY_NEW_RETRIES_2026) === "true");
let Ft = Zs;
class WA {
  constructor() {
    p(this, "x", Ft.delay());
  }
  computeNextBackoffDelay(e) {
    const r = Math.random() * Math.min(this.x * 2 ** e, _m);
    return Math.floor(r);
  }
  setDelayBase(e) {
    this.x = e;
  }
}
class qu {
  constructor(e, s, n, r) {
    p(this, "delay");
    p(this, "count");
    p(this, "cost");
    p(this, "longPoll");
    p(this, "$retryLog", {
      acquisitionDelay: 0
    });
    this.delay = e, this.count = s, this.cost = n, this.longPoll = r;
  }
  getRetryCount() {
    return this.count;
  }
  getRetryDelay() {
    return Math.min(_m, this.delay);
  }
  getRetryCost() {
    return this.cost;
  }
  isLongPoll() {
    return this.longPoll;
  }
}
var Nr;
(function(t) {
  t.STANDARD = "standard", t.ADAPTIVE = "adaptive";
})(Nr || (Nr = {}));
const fa = 3, VA = Nr.STANDARD, ci = {
  incompatible: 1,
  attempts: 2,
  capacity: 3
};
class ld {
  constructor(e) {
    p(this, "mode", Nr.STANDARD);
    p(this, "retryBackoffStrategy");
    p(this, "capacity", ju);
    p(this, "maxAttemptsProvider");
    p(this, "baseDelay");
    typeof e == "number" ? this.maxAttemptsProvider = async () => e : typeof e == "function" ? this.maxAttemptsProvider = e : e && typeof e == "object" && (this.maxAttemptsProvider = async () => e.maxAttempts, this.baseDelay = e.baseDelay, this.retryBackoffStrategy = e.backoff), this.maxAttemptsProvider ?? (this.maxAttemptsProvider = async () => fa), this.baseDelay ?? (this.baseDelay = Ft.delay()), this.retryBackoffStrategy ?? (this.retryBackoffStrategy = new WA());
  }
  async acquireInitialRetryToken(e) {
    return new qu(Ft.delay(), 0, void 0, Ft.v2026 && e.includes(":longpoll"));
  }
  async refreshRetryTokenForRetry(e, s) {
    var o, c;
    const n = await this.getMaxAttempts(), r = this.retryCode(e, s, n), a = r === 0, i = (o = e.isLongPoll) == null ? void 0 : o.call(e);
    if (a || i) {
      const d = s.errorType;
      this.retryBackoffStrategy.setDelayBase(d === "THROTTLING" ? Ft.throttlingDelay() : this.baseDelay);
      const l = this.retryBackoffStrategy.computeNextBackoffDelay(e.getRetryCount());
      let u = l;
      if (s.retryAfterHint instanceof Date && (u = Math.max(l, Math.min(s.retryAfterHint.getTime() - Date.now(), l + 5e3))), a) {
        const h = this.getCapacityCost(d);
        this.capacity -= h;
        const f = new qu(0, e.getRetryCount() + 1, h, ((c = e.isLongPoll) == null ? void 0 : c.call(e)) ?? !1);
        return await new Promise((g) => setTimeout(g, u)), f.$retryLog.acquisitionDelay = u, f;
      } else {
        const h = Ft.v2026 && r === ci.capacity && i ? u : 0;
        h > 0 && await new Promise((f) => setTimeout(f, h));
      }
    }
    throw new Error("No retry token available");
  }
  recordSuccess(e) {
    this.capacity = Math.min(ju, this.capacity + (e.getRetryCost() ?? DA));
  }
  getCapacity() {
    return this.capacity;
  }
  async maxAttempts() {
    return this.maxAttemptsProvider();
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch {
      return console.warn(`Max attempts provider could not resolve. Using default of ${fa}`), fa;
    }
  }
  retryCode(e, s, n) {
    const r = e.getRetryCount() + 1, a = this.isRetryableError(s.errorType) ? 0 : ci.incompatible, i = r < n ? 0 : ci.attempts, o = this.capacity >= this.getCapacityCost(s.errorType) ? 0 : ci.capacity;
    return a || i || o;
  }
  getCapacityCost(e) {
    return e === Ft.modifiedCostType() ? Ft.throttlingCost() : Ft.cost();
  }
  isRetryableError(e) {
    return e === "THROTTLING" || e === "TRANSIENT";
  }
}
class GA {
  constructor(e, s) {
    p(this, "mode", Nr.ADAPTIVE);
    p(this, "rateLimiter");
    p(this, "standardRetryStrategy");
    const { rateLimiter: n } = s ?? {};
    this.rateLimiter = n ?? new dd(), this.standardRetryStrategy = s ? new ld({
      maxAttempts: typeof e == "number" ? e : 3,
      ...s
    }) : new ld(e);
  }
  async acquireInitialRetryToken(e) {
    const s = await this.standardRetryStrategy.acquireInitialRetryToken(e);
    return await this.rateLimiter.getSendToken(), s;
  }
  async refreshRetryTokenForRetry(e, s) {
    this.rateLimiter.updateClientSendingRate(s);
    const n = await this.standardRetryStrategy.refreshRetryTokenForRetry(e, s);
    return await this.rateLimiter.getSendToken(), n;
  }
  recordSuccess(e) {
    this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(e);
  }
  async maxAttemptsProvider() {
    return this.standardRetryStrategy.maxAttempts();
  }
}
const JA = (t, e) => {
  const { retryStrategy: s, retryMode: n } = t, { defaultMaxAttempts: r = fa, defaultBaseDelay: a = Ft.delay() } = {}, i = us(t.maxAttempts ?? r);
  let o = s ? Promise.resolve(s) : void 0;
  const c = async () => {
    const d = await i();
    return await us(n)() === Nr.ADAPTIVE ? new GA(i, {
      maxAttempts: d,
      baseDelay: a
    }) : new ld({
      maxAttempts: d,
      baseDelay: a
    });
  };
  return Object.assign(t, {
    maxAttempts: i,
    retryStrategy: () => o ?? (o = c())
  });
}, ZA = KA(EA), YA = {
  CrtSignerV4: null
};
let XA = class {
  constructor(e) {
    p(this, "sigv4aSigner");
    p(this, "sigv4Signer");
    p(this, "signerOptions");
    this.sigv4Signer = new oE(e), this.signerOptions = e;
  }
  async sign(e, s = {}) {
    if (s.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().sign(e, s);
    }
    return this.sigv4Signer.sign(e, s);
  }
  async signWithCredentials(e, s, n = {}) {
    if (n.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().signWithCredentials(e, s, n);
    }
    return this.sigv4Signer.signWithCredentials(e, s, n);
  }
  async presign(e, s = {}) {
    if (s.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().presign(e, s);
    }
    return this.sigv4Signer.presign(e, s);
  }
  async presignWithCredentials(e, s, n = {}) {
    if (n.signingRegion === "*")
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    return this.sigv4Signer.presignWithCredentials(e, s, n);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      let e = null;
      try {
        if (e = YA.CrtSignerV4, typeof e != "function")
          throw new Error();
      } catch (s) {
        throw s.message = `${s.message}
Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. 
You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`, s;
      }
      this.sigv4aSigner = new e({
        ...this.signerOptions,
        signingAlgorithm: 1
      });
    }
    return this.sigv4aSigner;
  }
};
const Ud = "required", m = "type", y = "conditions", x = "fn", C = "argv", K = "ref", ye = "assign", B = "url", U = "properties", vm = "backend", is = "authSchemes", Rt = "disableDoubleEncoding", Ot = "signingName", gs = "signingRegion", F = "headers", Fd = "signingRegionSet", QA = 6, ex = !1, Zt = !0, Lt = "isSet", Xe = "booleanEquals", $ = "error", Vi = "aws.partition", ge = "stringEquals", Ne = "getAttr", at = "name", nt = "substring", zu = "bucketSuffix", bm = "parseURL", Ku = "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", k = "endpoint", T = "tree", Sm = "aws.isVirtualHostableS3Bucket", xi = "{url#scheme}://{Bucket}.{url#authority}{url#path}", hs = "not", Ci = "{url#scheme}://{url#authority}{url#path}", Em = "hardwareType", Am = "regionPrefix", Wu = "bucketAliasSuffix", ud = "outpostId", zn = "isValidHostLabel", $d = "sigv4a", ba = "s3-outposts", Mr = "s3", xm = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", Cm = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", Vu = "https://{Bucket}.s3.{partitionResult#dnsSuffix}", Im = "aws.parseArn", Tm = "bucketArn", km = "arnType", Gi = "", Ld = "s3-object-lambda", Rm = "accesspoint", Hd = "accessPointName", Gu = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}", Ju = "mrapPartition", Zu = "outpostType", Yu = "arnPrefix", Om = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", Xu = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", Qu = "https://s3.{partitionResult#dnsSuffix}", rr = { [Ud]: !1, [m]: "String" }, ar = { [Ud]: !0, default: !1, [m]: "Boolean" }, sa = { [Ud]: !1, [m]: "Boolean" }, Yt = { [x]: Xe, [C]: [{ [K]: "Accelerate" }, !0] }, ve = { [x]: Xe, [C]: [{ [K]: "UseFIPS" }, !0] }, _e = { [x]: Xe, [C]: [{ [K]: "UseDualStack" }, !0] }, Ue = { [x]: Lt, [C]: [{ [K]: "Endpoint" }] }, Nm = { [x]: Vi, [C]: [{ [K]: "Region" }], [ye]: "partitionResult" }, eh = { [x]: ge, [C]: [{ [x]: Ne, [C]: [{ [K]: "partitionResult" }, at] }, "aws-cn"] }, Ji = { [x]: Lt, [C]: [{ [K]: "Bucket" }] }, Me = { [K]: "Bucket" }, dt = { [x]: bm, [C]: [{ [K]: "Endpoint" }], [ye]: "url" }, Ii = { [x]: Xe, [C]: [{ [x]: Ne, [C]: [{ [K]: "url" }, "isIp"] }, !0] }, Mm = { [K]: "url" }, Dm = { [x]: "uriEncode", [C]: [Me], [ye]: "uri_encoded_bucket" }, Cs = { [vm]: "S3Express", [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: "s3express", [gs]: "{Region}" }] }, G = {}, Pm = { [x]: Sm, [C]: [Me, !1] }, Vo = { [$]: "S3Express bucket name is not a valid virtual hostable name.", [m]: $ }, Zi = { [vm]: "S3Express", [is]: [{ [Rt]: !0, [at]: "sigv4-s3express", [Ot]: "s3express", [gs]: "{Region}" }] }, th = { [x]: Lt, [C]: [{ [K]: "UseS3ExpressControlEndpoint" }] }, sh = { [x]: Xe, [C]: [{ [K]: "UseS3ExpressControlEndpoint" }, !0] }, ee = { [x]: hs, [C]: [Ue] }, nh = { [$]: "Unrecognized S3Express bucket name format.", [m]: $ }, rh = { [x]: hs, [C]: [Ji] }, ah = { [K]: Em }, ih = { [y]: [ee], [$]: "Expected a endpoint to be specified but no endpoint was found", [m]: $ }, di = { [is]: [{ [Rt]: !0, [at]: $d, [Ot]: ba, [Fd]: ["*"] }, { [Rt]: !0, [at]: "sigv4", [Ot]: ba, [gs]: "{Region}" }] }, Go = { [x]: Xe, [C]: [{ [K]: "ForcePathStyle" }, !1] }, tx = { [K]: "ForcePathStyle" }, Be = { [x]: Xe, [C]: [{ [K]: "Accelerate" }, !1] }, je = { [x]: ge, [C]: [{ [K]: "Region" }, "aws-global"] }, Ve = { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Mr, [gs]: "us-east-1" }] }, ie = { [x]: hs, [C]: [je] }, Ge = { [x]: Xe, [C]: [{ [K]: "UseGlobalEndpoint" }, !0] }, oh = { [B]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [U]: { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Mr, [gs]: "{Region}" }] }, [F]: {} }, $e = { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Mr, [gs]: "{Region}" }] }, Je = { [x]: Xe, [C]: [{ [K]: "UseGlobalEndpoint" }, !1] }, ae = { [x]: Xe, [C]: [{ [K]: "UseDualStack" }, !1] }, ch = { [B]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, se = { [x]: Xe, [C]: [{ [K]: "UseFIPS" }, !1] }, dh = { [B]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, lh = { [B]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, Jo = { [x]: Xe, [C]: [{ [x]: Ne, [C]: [Mm, "isIp"] }, !1] }, Zo = { [B]: xm, [U]: $e, [F]: {} }, hd = { [B]: xi, [U]: $e, [F]: {} }, uh = { [k]: hd, [m]: k }, Yo = { [B]: Cm, [U]: $e, [F]: {} }, hh = { [B]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, li = { [$]: "Invalid region: region was not a valid DNS name.", [m]: $ }, gt = { [K]: Tm }, Bm = { [K]: km }, Xo = { [x]: Ne, [C]: [gt, "service"] }, jd = { [K]: Hd }, fh = { [y]: [_e], [$]: "S3 Object Lambda does not support Dual-stack", [m]: $ }, ph = { [y]: [Yt], [$]: "S3 Object Lambda does not support S3 Accelerate", [m]: $ }, mh = { [y]: [{ [x]: Lt, [C]: [{ [K]: "DisableAccessPoints" }] }, { [x]: Xe, [C]: [{ [K]: "DisableAccessPoints" }, !0] }], [$]: "Access points are not supported for this operation", [m]: $ }, Qo = { [y]: [{ [x]: Lt, [C]: [{ [K]: "UseArnRegion" }] }, { [x]: Xe, [C]: [{ [K]: "UseArnRegion" }, !1] }, { [x]: hs, [C]: [{ [x]: ge, [C]: [{ [x]: Ne, [C]: [gt, "region"] }, "{Region}"] }] }], [$]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [m]: $ }, Um = { [x]: Ne, [C]: [{ [K]: "bucketPartition" }, at] }, Fm = { [x]: Ne, [C]: [gt, "accountId"] }, ec = { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Ld, [gs]: "{bucketArn#region}" }] }, gh = { [$]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [m]: $ }, tc = { [$]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [m]: $ }, sc = { [$]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [m]: $ }, nc = { [$]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [m]: $ }, yh = { [$]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [m]: $ }, wh = { [$]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [m]: $ }, na = { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Mr, [gs]: "{bucketArn#region}" }] }, _h = { [is]: [{ [Rt]: !0, [at]: $d, [Ot]: ba, [Fd]: ["*"] }, { [Rt]: !0, [at]: "sigv4", [Ot]: ba, [gs]: "{bucketArn#region}" }] }, vh = { [x]: Im, [C]: [Me] }, bh = { [B]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: $e, [F]: {} }, Sh = { [B]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: $e, [F]: {} }, Eh = { [B]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: $e, [F]: {} }, rc = { [B]: Om, [U]: $e, [F]: {} }, Ah = { [B]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: $e, [F]: {} }, xh = { [K]: "UseObjectLambdaEndpoint" }, ac = { [is]: [{ [Rt]: !0, [at]: "sigv4", [Ot]: Ld, [gs]: "{Region}" }] }, Ch = { [B]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, Ih = { [B]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, Th = { [B]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, ic = { [B]: Ci, [U]: $e, [F]: {} }, kh = { [B]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [U]: $e, [F]: {} }, oc = [{ [K]: "Region" }], sx = [{ [K]: "Endpoint" }], nx = [Me], cc = [_e], ui = [Yt], wn = [Ue, dt], Rh = [{ [x]: Lt, [C]: [{ [K]: "DisableS3ExpressSessionAuth" }] }, { [x]: Xe, [C]: [{ [K]: "DisableS3ExpressSessionAuth" }, !0] }], Oh = [Ii], dc = [Dm], lc = [Pm], ir = [ve], Nh = [{ [x]: nt, [C]: [Me, 6, 14, !0], [ye]: "s3expressAvailabilityZoneId" }, { [x]: nt, [C]: [Me, 14, 16, !0], [ye]: "s3expressAvailabilityZoneDelim" }, { [x]: ge, [C]: [{ [K]: "s3expressAvailabilityZoneDelim" }, "--"] }], ra = [{ [y]: [ve], [k]: { [B]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [U]: Cs, [F]: {} }, [m]: k }, { [k]: { [B]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [U]: Cs, [F]: {} }, [m]: k }], Mh = [{ [x]: nt, [C]: [Me, 6, 15, !0], [ye]: "s3expressAvailabilityZoneId" }, { [x]: nt, [C]: [Me, 15, 17, !0], [ye]: "s3expressAvailabilityZoneDelim" }, { [x]: ge, [C]: [{ [K]: "s3expressAvailabilityZoneDelim" }, "--"] }], Dh = [{ [x]: nt, [C]: [Me, 6, 19, !0], [ye]: "s3expressAvailabilityZoneId" }, { [x]: nt, [C]: [Me, 19, 21, !0], [ye]: "s3expressAvailabilityZoneDelim" }, { [x]: ge, [C]: [{ [K]: "s3expressAvailabilityZoneDelim" }, "--"] }], Ph = [{ [x]: nt, [C]: [Me, 6, 20, !0], [ye]: "s3expressAvailabilityZoneId" }, { [x]: nt, [C]: [Me, 20, 22, !0], [ye]: "s3expressAvailabilityZoneDelim" }, { [x]: ge, [C]: [{ [K]: "s3expressAvailabilityZoneDelim" }, "--"] }], Bh = [{ [x]: nt, [C]: [Me, 6, 26, !0], [ye]: "s3expressAvailabilityZoneId" }, { [x]: nt, [C]: [Me, 26, 28, !0], [ye]: "s3expressAvailabilityZoneDelim" }, { [x]: ge, [C]: [{ [K]: "s3expressAvailabilityZoneDelim" }, "--"] }], aa = [{ [y]: [ve], [k]: { [B]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [U]: Zi, [F]: {} }, [m]: k }, { [k]: { [B]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.amazonaws.com", [U]: Zi, [F]: {} }, [m]: k }], rx = [Ji], Uh = [{ [x]: zn, [C]: [{ [K]: ud }, !1] }], Fh = [{ [x]: ge, [C]: [{ [K]: Am }, "beta"] }], ax = ["*"], js = [Nm], $h = [{ [x]: zn, [C]: [{ [K]: "Region" }, !1] }], qs = [{ [x]: ge, [C]: [{ [K]: "Region" }, "us-east-1"] }], uc = [{ [x]: ge, [C]: [Bm, Rm] }], Lh = [{ [x]: Ne, [C]: [gt, "resourceId[1]"], [ye]: Hd }, { [x]: hs, [C]: [{ [x]: ge, [C]: [jd, Gi] }] }], ix = [gt, "resourceId[1]"], hc = [{ [x]: hs, [C]: [{ [x]: ge, [C]: [{ [x]: Ne, [C]: [gt, "region"] }, Gi] }] }], Hh = [{ [x]: hs, [C]: [{ [x]: Lt, [C]: [{ [x]: Ne, [C]: [gt, "resourceId[2]"] }] }] }], ox = [gt, "resourceId[2]"], fc = [{ [x]: Vi, [C]: [{ [x]: Ne, [C]: [gt, "region"] }], [ye]: "bucketPartition" }], jh = [{ [x]: ge, [C]: [Um, { [x]: Ne, [C]: [{ [K]: "partitionResult" }, at] }] }], pc = [{ [x]: zn, [C]: [{ [x]: Ne, [C]: [gt, "region"] }, !0] }], mc = [{ [x]: zn, [C]: [Fm, !1] }], qh = [{ [x]: zn, [C]: [jd, !1] }], zh = [{ [x]: zn, [C]: [{ [K]: "Region" }, !0] }], cx = { parameters: { Bucket: rr, Region: rr, UseFIPS: ar, UseDualStack: ar, Endpoint: rr, ForcePathStyle: ar, Accelerate: ar, UseGlobalEndpoint: ar, UseObjectLambdaEndpoint: sa, Key: rr, Prefix: rr, CopySource: rr, DisableAccessPoints: sa, DisableMultiRegionAccessPoints: ar, UseArnRegion: sa, UseS3ExpressControlEndpoint: sa, DisableS3ExpressSessionAuth: sa }, rules: [{ [y]: [{ [x]: Lt, [C]: oc }], rules: [{ [y]: [Yt, ve], error: "Accelerate cannot be used with FIPS", [m]: $ }, { [y]: [_e, Ue], error: "Cannot set dual-stack in combination with a custom endpoint.", [m]: $ }, { [y]: [Ue, ve], error: "A custom endpoint cannot be combined with FIPS", [m]: $ }, { [y]: [Ue, Yt], error: "A custom endpoint cannot be combined with S3 Accelerate", [m]: $ }, { [y]: [ve, Nm, eh], error: "Partition does not support FIPS", [m]: $ }, { [y]: [Ji, { [x]: nt, [C]: [Me, 0, QA, Zt], [ye]: zu }, { [x]: ge, [C]: [{ [K]: zu }, "--x-s3"] }], rules: [{ [y]: cc, error: "S3Express does not support Dual-stack.", [m]: $ }, { [y]: ui, error: "S3Express does not support S3 Accelerate.", [m]: $ }, { [y]: wn, rules: [{ [y]: Rh, rules: [{ [y]: Oh, rules: [{ [y]: dc, rules: [{ endpoint: { [B]: Ku, [U]: Cs, [F]: G }, [m]: k }], [m]: T }], [m]: T }, { [y]: lc, rules: [{ endpoint: { [B]: xi, [U]: Cs, [F]: G }, [m]: k }], [m]: T }, Vo], [m]: T }, { [y]: Oh, rules: [{ [y]: dc, rules: [{ endpoint: { [B]: Ku, [U]: Zi, [F]: G }, [m]: k }], [m]: T }], [m]: T }, { [y]: lc, rules: [{ endpoint: { [B]: xi, [U]: Zi, [F]: G }, [m]: k }], [m]: T }, Vo], [m]: T }, { [y]: [th, sh], rules: [{ [y]: [Dm, ee], rules: [{ [y]: ir, endpoint: { [B]: "https://s3express-control-fips.{Region}.amazonaws.com/{uri_encoded_bucket}", [U]: Cs, [F]: G }, [m]: k }, { endpoint: { [B]: "https://s3express-control.{Region}.amazonaws.com/{uri_encoded_bucket}", [U]: Cs, [F]: G }, [m]: k }], [m]: T }], [m]: T }, { [y]: lc, rules: [{ [y]: Rh, rules: [{ [y]: Nh, rules: ra, [m]: T }, { [y]: Mh, rules: ra, [m]: T }, { [y]: Dh, rules: ra, [m]: T }, { [y]: Ph, rules: ra, [m]: T }, { [y]: Bh, rules: ra, [m]: T }, nh], [m]: T }, { [y]: Nh, rules: aa, [m]: T }, { [y]: Mh, rules: aa, [m]: T }, { [y]: Dh, rules: aa, [m]: T }, { [y]: Ph, rules: aa, [m]: T }, { [y]: Bh, rules: aa, [m]: T }, nh], [m]: T }, Vo], [m]: T }, { [y]: [rh, th, sh], rules: [{ [y]: wn, endpoint: { [B]: Ci, [U]: Cs, [F]: G }, [m]: k }, { [y]: ir, endpoint: { [B]: "https://s3express-control-fips.{Region}.amazonaws.com", [U]: Cs, [F]: G }, [m]: k }, { endpoint: { [B]: "https://s3express-control.{Region}.amazonaws.com", [U]: Cs, [F]: G }, [m]: k }], [m]: T }, { [y]: [Ji, { [x]: nt, [C]: [Me, 49, 50, Zt], [ye]: Em }, { [x]: nt, [C]: [Me, 8, 12, Zt], [ye]: Am }, { [x]: nt, [C]: [Me, 0, 7, Zt], [ye]: Wu }, { [x]: nt, [C]: [Me, 32, 49, Zt], [ye]: ud }, { [x]: Vi, [C]: oc, [ye]: "regionPartition" }, { [x]: ge, [C]: [{ [K]: Wu }, "--op-s3"] }], rules: [{ [y]: Uh, rules: [{ [y]: [{ [x]: ge, [C]: [ah, "e"] }], rules: [{ [y]: Fh, rules: [ih, { [y]: wn, endpoint: { [B]: "https://{Bucket}.ec2.{url#authority}", [U]: di, [F]: G }, [m]: k }], [m]: T }, { endpoint: { [B]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [U]: di, [F]: G }, [m]: k }], [m]: T }, { [y]: [{ [x]: ge, [C]: [ah, "o"] }], rules: [{ [y]: Fh, rules: [ih, { [y]: wn, endpoint: { [B]: "https://{Bucket}.op-{outpostId}.{url#authority}", [U]: di, [F]: G }, [m]: k }], [m]: T }, { endpoint: { [B]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [U]: di, [F]: G }, [m]: k }], [m]: T }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [m]: $ }], [m]: T }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [m]: $ }], [m]: T }, { [y]: rx, rules: [{ [y]: [Ue, { [x]: hs, [C]: [{ [x]: Lt, [C]: [{ [x]: bm, [C]: sx }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [m]: $ }, { [y]: [Go, Pm], rules: [{ [y]: js, rules: [{ [y]: $h, rules: [{ [y]: [Yt, eh], error: "S3 Accelerate cannot be used in this region", [m]: $ }, { [y]: [_e, ve, Be, ee, je], endpoint: { [B]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [_e, ve, Be, ee, ie, Ge], rules: [{ endpoint: oh, [m]: k }], [m]: T }, { [y]: [_e, ve, Be, ee, ie, Je], endpoint: oh, [m]: k }, { [y]: [ae, ve, Be, ee, je], endpoint: { [B]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, ve, Be, ee, ie, Ge], rules: [{ endpoint: ch, [m]: k }], [m]: T }, { [y]: [ae, ve, Be, ee, ie, Je], endpoint: ch, [m]: k }, { [y]: [_e, se, Yt, ee, je], endpoint: { [B]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [_e, se, Yt, ee, ie, Ge], rules: [{ endpoint: dh, [m]: k }], [m]: T }, { [y]: [_e, se, Yt, ee, ie, Je], endpoint: dh, [m]: k }, { [y]: [_e, se, Be, ee, je], endpoint: { [B]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [_e, se, Be, ee, ie, Ge], rules: [{ endpoint: lh, [m]: k }], [m]: T }, { [y]: [_e, se, Be, ee, ie, Je], endpoint: lh, [m]: k }, { [y]: [ae, se, Be, Ue, dt, Ii, je], endpoint: { [B]: xm, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, se, Be, Ue, dt, Jo, je], endpoint: { [B]: xi, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, se, Be, Ue, dt, Ii, ie, Ge], rules: [{ [y]: qs, endpoint: Zo, [m]: k }, { endpoint: Zo, [m]: k }], [m]: T }, { [y]: [ae, se, Be, Ue, dt, Jo, ie, Ge], rules: [{ [y]: qs, endpoint: hd, [m]: k }, uh], [m]: T }, { [y]: [ae, se, Be, Ue, dt, Ii, ie, Je], endpoint: Zo, [m]: k }, { [y]: [ae, se, Be, Ue, dt, Jo, ie, Je], endpoint: hd, [m]: k }, { [y]: [ae, se, Yt, ee, je], endpoint: { [B]: Cm, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, se, Yt, ee, ie, Ge], rules: [{ [y]: qs, endpoint: Yo, [m]: k }, { endpoint: Yo, [m]: k }], [m]: T }, { [y]: [ae, se, Yt, ee, ie, Je], endpoint: Yo, [m]: k }, { [y]: [ae, se, Be, ee, je], endpoint: { [B]: Vu, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, se, Be, ee, ie, Ge], rules: [{ [y]: qs, endpoint: { [B]: Vu, [U]: $e, [F]: G }, [m]: k }, { endpoint: hh, [m]: k }], [m]: T }, { [y]: [ae, se, Be, ee, ie, Je], endpoint: hh, [m]: k }], [m]: T }, li], [m]: T }], [m]: T }, { [y]: [Ue, dt, { [x]: ge, [C]: [{ [x]: Ne, [C]: [Mm, "scheme"] }, "http"] }, { [x]: Sm, [C]: [Me, Zt] }, Go, se, ae, Be], rules: [{ [y]: js, rules: [{ [y]: $h, rules: [uh], [m]: T }, li], [m]: T }], [m]: T }, { [y]: [Go, { [x]: Im, [C]: nx, [ye]: Tm }], rules: [{ [y]: [{ [x]: Ne, [C]: [gt, "resourceId[0]"], [ye]: km }, { [x]: hs, [C]: [{ [x]: ge, [C]: [Bm, Gi] }] }], rules: [{ [y]: [{ [x]: ge, [C]: [Xo, Ld] }], rules: [{ [y]: uc, rules: [{ [y]: Lh, rules: [fh, ph, { [y]: hc, rules: [mh, { [y]: Hh, rules: [Qo, { [y]: fc, rules: [{ [y]: js, rules: [{ [y]: jh, rules: [{ [y]: pc, rules: [{ [y]: [{ [x]: ge, [C]: [Fm, Gi] }], error: "Invalid ARN: Missing account id", [m]: $ }, { [y]: mc, rules: [{ [y]: qh, rules: [{ [y]: wn, endpoint: { [B]: Gu, [U]: ec, [F]: G }, [m]: k }, { [y]: ir, endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: ec, [F]: G }, [m]: k }, { endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: ec, [F]: G }, [m]: k }], [m]: T }, gh], [m]: T }, tc], [m]: T }, sc], [m]: T }, nc], [m]: T }], [m]: T }], [m]: T }, yh], [m]: T }, { error: "Invalid ARN: bucket ARN is missing a region", [m]: $ }], [m]: T }, wh], [m]: T }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [m]: $ }], [m]: T }, { [y]: uc, rules: [{ [y]: Lh, rules: [{ [y]: hc, rules: [{ [y]: uc, rules: [{ [y]: hc, rules: [mh, { [y]: Hh, rules: [Qo, { [y]: fc, rules: [{ [y]: js, rules: [{ [y]: [{ [x]: ge, [C]: [Um, "{partitionResult#name}"] }], rules: [{ [y]: pc, rules: [{ [y]: [{ [x]: ge, [C]: [Xo, Mr] }], rules: [{ [y]: mc, rules: [{ [y]: qh, rules: [{ [y]: ui, error: "Access Points do not support S3 Accelerate", [m]: $ }, { [y]: [ve, _e], endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: na, [F]: G }, [m]: k }, { [y]: [ve, ae], endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: na, [F]: G }, [m]: k }, { [y]: [se, _e], endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: na, [F]: G }, [m]: k }, { [y]: [se, ae, Ue, dt], endpoint: { [B]: Gu, [U]: na, [F]: G }, [m]: k }, { [y]: [se, ae], endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: na, [F]: G }, [m]: k }], [m]: T }, gh], [m]: T }, tc], [m]: T }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [m]: $ }], [m]: T }, sc], [m]: T }, nc], [m]: T }], [m]: T }], [m]: T }, yh], [m]: T }], [m]: T }], [m]: T }, { [y]: [{ [x]: zn, [C]: [jd, Zt] }], rules: [{ [y]: cc, error: "S3 MRAP does not support dual-stack", [m]: $ }, { [y]: ir, error: "S3 MRAP does not support FIPS", [m]: $ }, { [y]: ui, error: "S3 MRAP does not support S3 Accelerate", [m]: $ }, { [y]: [{ [x]: Xe, [C]: [{ [K]: "DisableMultiRegionAccessPoints" }, Zt] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [m]: $ }, { [y]: [{ [x]: Vi, [C]: oc, [ye]: Ju }], rules: [{ [y]: [{ [x]: ge, [C]: [{ [x]: Ne, [C]: [{ [K]: Ju }, at] }, { [x]: Ne, [C]: [gt, "partition"] }] }], rules: [{ endpoint: { [B]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [U]: { [is]: [{ [Rt]: Zt, name: $d, [Ot]: Mr, [Fd]: ax }] }, [F]: G }, [m]: k }], [m]: T }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [m]: $ }], [m]: T }], [m]: T }, { error: "Invalid Access Point Name", [m]: $ }], [m]: T }, wh], [m]: T }, { [y]: [{ [x]: ge, [C]: [Xo, ba] }], rules: [{ [y]: cc, error: "S3 Outposts does not support Dual-stack", [m]: $ }, { [y]: ir, error: "S3 Outposts does not support FIPS", [m]: $ }, { [y]: ui, error: "S3 Outposts does not support S3 Accelerate", [m]: $ }, { [y]: [{ [x]: Lt, [C]: [{ [x]: Ne, [C]: [gt, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [m]: $ }, { [y]: [{ [x]: Ne, [C]: ix, [ye]: ud }], rules: [{ [y]: Uh, rules: [Qo, { [y]: fc, rules: [{ [y]: js, rules: [{ [y]: jh, rules: [{ [y]: pc, rules: [{ [y]: mc, rules: [{ [y]: [{ [x]: Ne, [C]: ox, [ye]: Zu }], rules: [{ [y]: [{ [x]: Ne, [C]: [gt, "resourceId[3]"], [ye]: Hd }], rules: [{ [y]: [{ [x]: ge, [C]: [{ [K]: Zu }, Rm] }], rules: [{ [y]: wn, endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [U]: _h, [F]: G }, [m]: k }, { endpoint: { [B]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [U]: _h, [F]: G }, [m]: k }], [m]: T }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [m]: $ }], [m]: T }, { error: "Invalid ARN: expected an access point name", [m]: $ }], [m]: T }, { error: "Invalid ARN: Expected a 4-component resource", [m]: $ }], [m]: T }, tc], [m]: T }, sc], [m]: T }, nc], [m]: T }], [m]: T }], [m]: T }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [m]: $ }], [m]: T }, { error: "Invalid ARN: The Outpost Id was not set", [m]: $ }], [m]: T }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [m]: $ }], [m]: T }, { error: "Invalid ARN: No ARN type specified", [m]: $ }], [m]: T }, { [y]: [{ [x]: nt, [C]: [Me, 0, 4, ex], [ye]: Yu }, { [x]: ge, [C]: [{ [K]: Yu }, "arn:"] }, { [x]: hs, [C]: [{ [x]: Lt, [C]: [vh] }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [m]: $ }, { [y]: [{ [x]: Xe, [C]: [tx, Zt] }, vh], error: "Path-style addressing cannot be used with ARN buckets", [m]: $ }, { [y]: dc, rules: [{ [y]: js, rules: [{ [y]: [Be], rules: [{ [y]: [_e, ee, ve, je], endpoint: { [B]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [_e, ee, ve, ie, Ge], rules: [{ endpoint: bh, [m]: k }], [m]: T }, { [y]: [_e, ee, ve, ie, Je], endpoint: bh, [m]: k }, { [y]: [ae, ee, ve, je], endpoint: { [B]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, ee, ve, ie, Ge], rules: [{ endpoint: Sh, [m]: k }], [m]: T }, { [y]: [ae, ee, ve, ie, Je], endpoint: Sh, [m]: k }, { [y]: [_e, ee, se, je], endpoint: { [B]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [_e, ee, se, ie, Ge], rules: [{ endpoint: Eh, [m]: k }], [m]: T }, { [y]: [_e, ee, se, ie, Je], endpoint: Eh, [m]: k }, { [y]: [ae, Ue, dt, se, je], endpoint: { [B]: Om, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, Ue, dt, se, ie, Ge], rules: [{ [y]: qs, endpoint: rc, [m]: k }, { endpoint: rc, [m]: k }], [m]: T }, { [y]: [ae, Ue, dt, se, ie, Je], endpoint: rc, [m]: k }, { [y]: [ae, ee, se, je], endpoint: { [B]: Xu, [U]: Ve, [F]: G }, [m]: k }, { [y]: [ae, ee, se, ie, Ge], rules: [{ [y]: qs, endpoint: { [B]: Xu, [U]: $e, [F]: G }, [m]: k }, { endpoint: Ah, [m]: k }], [m]: T }, { [y]: [ae, ee, se, ie, Je], endpoint: Ah, [m]: k }], [m]: T }, { error: "Path-style addressing cannot be used with S3 Accelerate", [m]: $ }], [m]: T }], [m]: T }], [m]: T }, { [y]: [{ [x]: Lt, [C]: [xh] }, { [x]: Xe, [C]: [xh, Zt] }], rules: [{ [y]: js, rules: [{ [y]: zh, rules: [fh, ph, { [y]: wn, endpoint: { [B]: Ci, [U]: ac, [F]: G }, [m]: k }, { [y]: ir, endpoint: { [B]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [U]: ac, [F]: G }, [m]: k }, { endpoint: { [B]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [U]: ac, [F]: G }, [m]: k }], [m]: T }, li], [m]: T }], [m]: T }, { [y]: [rh], rules: [{ [y]: js, rules: [{ [y]: zh, rules: [{ [y]: [ve, _e, ee, je], endpoint: { [B]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [ve, _e, ee, ie, Ge], rules: [{ endpoint: Ch, [m]: k }], [m]: T }, { [y]: [ve, _e, ee, ie, Je], endpoint: Ch, [m]: k }, { [y]: [ve, ae, ee, je], endpoint: { [B]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [ve, ae, ee, ie, Ge], rules: [{ endpoint: Ih, [m]: k }], [m]: T }, { [y]: [ve, ae, ee, ie, Je], endpoint: Ih, [m]: k }, { [y]: [se, _e, ee, je], endpoint: { [B]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [U]: Ve, [F]: G }, [m]: k }, { [y]: [se, _e, ee, ie, Ge], rules: [{ endpoint: Th, [m]: k }], [m]: T }, { [y]: [se, _e, ee, ie, Je], endpoint: Th, [m]: k }, { [y]: [se, ae, Ue, dt, je], endpoint: { [B]: Ci, [U]: Ve, [F]: G }, [m]: k }, { [y]: [se, ae, Ue, dt, ie, Ge], rules: [{ [y]: qs, endpoint: ic, [m]: k }, { endpoint: ic, [m]: k }], [m]: T }, { [y]: [se, ae, Ue, dt, ie, Je], endpoint: ic, [m]: k }, { [y]: [se, ae, ee, je], endpoint: { [B]: Qu, [U]: Ve, [F]: G }, [m]: k }, { [y]: [se, ae, ee, ie, Ge], rules: [{ [y]: qs, endpoint: { [B]: Qu, [U]: $e, [F]: G }, [m]: k }, { endpoint: kh, [m]: k }], [m]: T }, { [y]: [se, ae, ee, ie, Je], endpoint: kh, [m]: k }], [m]: T }, li], [m]: T }], [m]: T }], [m]: T }, { error: "A region must be set when sending requests to S3.", [m]: $ }] }, dx = cx, lx = new G_({
  size: 50,
  params: [
    "Accelerate",
    "Bucket",
    "DisableAccessPoints",
    "DisableMultiRegionAccessPoints",
    "DisableS3ExpressSessionAuth",
    "Endpoint",
    "ForcePathStyle",
    "Region",
    "UseArnRegion",
    "UseDualStack",
    "UseFIPS",
    "UseGlobalEndpoint",
    "UseObjectLambdaEndpoint",
    "UseS3ExpressControlEndpoint"
  ]
}), $m = (t, e = {}) => lx.get(t, () => mv(dx, {
  endpointParams: t,
  logger: e.logger
}));
Ad.aws = pm;
const ux = (t) => async (e, s, n) => {
  var o, c, d;
  if (!n)
    throw new Error("Could not find `input` for `defaultEndpointRuleSetHttpAuthSchemeParametersProvider`");
  const r = await t(e, s, n), a = (d = (c = (o = $r(s)) == null ? void 0 : o.commandInstance) == null ? void 0 : c.constructor) == null ? void 0 : d.getEndpointParameterInstructions;
  if (!a)
    throw new Error(`getEndpointParameterInstructions() is not defined on \`${s.commandName}\``);
  const i = await Ip(n, { getEndpointParameterInstructions: a }, e);
  return Object.assign(r, i);
}, hx = async (t, e, s) => ({
  operation: $r(e).operation,
  region: await us(t.region)() || (() => {
    throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
  })()
}), fx = ux(hx);
function Lm(t) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "s3",
      region: t.region
    },
    propertiesExtractor: (e, s) => ({
      signingProperties: {
        config: e,
        context: s
      }
    })
  };
}
function Hm(t) {
  return {
    schemeId: "aws.auth#sigv4a",
    signingProperties: {
      name: "s3",
      region: t.region
    },
    propertiesExtractor: (e, s) => ({
      signingProperties: {
        config: e,
        context: s
      }
    })
  };
}
const px = (t, e, s) => (r) => {
  var c;
  const i = (c = t(r).properties) == null ? void 0 : c.authSchemes;
  if (!i)
    return e(r);
  const o = [];
  for (const d of i) {
    const { name: l, properties: u = {}, ...h } = d, f = l.toLowerCase();
    l !== f && console.warn(`HttpAuthScheme has been normalized with lowercasing: \`${l}\` to \`${f}\``);
    let g;
    if (f === "sigv4a") {
      if (g = "aws.auth#sigv4a", i.find((I) => {
        const D = I.name.toLowerCase();
        return D !== "sigv4a" && D.startsWith("sigv4");
      }))
        continue;
    } else if (f.startsWith("sigv4"))
      g = "aws.auth#sigv4";
    else
      throw new Error(`Unknown HttpAuthScheme found in \`@smithy.rules#endpointRuleSet\`: \`${f}\``);
    const _ = s[g];
    if (!_)
      throw new Error(`Could not find HttpAuthOption create function for \`${g}\``);
    const w = _(r);
    w.schemeId = g, w.signingProperties = { ...w.signingProperties || {}, ...h, ...u }, o.push(w);
  }
  return o;
}, mx = (t) => {
  const e = [];
  switch (t.operation) {
    default:
      e.push(Lm(t)), e.push(Hm(t));
  }
  return e;
}, gx = px($m, mx, {
  "aws.auth#sigv4": Lm,
  "aws.auth#sigv4a": Hm
}), yx = (t) => {
  const e = cb(t);
  return {
    ...B0(e)
  };
}, wx = (t) => ({
  ...t,
  useFipsEndpoint: t.useFipsEndpoint ?? !1,
  useDualstackEndpoint: t.useDualstackEndpoint ?? !1,
  forcePathStyle: t.forcePathStyle ?? !1,
  useAccelerateEndpoint: t.useAccelerateEndpoint ?? !1,
  useGlobalEndpoint: t.useGlobalEndpoint ?? !1,
  disableMultiregionAccessPoints: t.disableMultiregionAccessPoints ?? !1,
  defaultSigningName: "s3"
}), os = {
  ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
  UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
  DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
  Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
  DisableS3ExpressSessionAuth: { type: "clientContextParams", name: "disableS3ExpressSessionAuth" },
  UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};
class ot extends Qc {
  constructor(e) {
    super(e), Object.setPrototypeOf(this, ot.prototype);
  }
}
class qd extends ot {
  constructor(s) {
    super({
      name: "NoSuchUpload",
      $fault: "client",
      ...s
    });
    p(this, "name", "NoSuchUpload");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, qd.prototype);
  }
}
class zd extends ot {
  constructor(s) {
    super({
      name: "ObjectNotInActiveTierError",
      $fault: "client",
      ...s
    });
    p(this, "name", "ObjectNotInActiveTierError");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, zd.prototype);
  }
}
class Kd extends ot {
  constructor(s) {
    super({
      name: "BucketAlreadyExists",
      $fault: "client",
      ...s
    });
    p(this, "name", "BucketAlreadyExists");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Kd.prototype);
  }
}
class Wd extends ot {
  constructor(s) {
    super({
      name: "BucketAlreadyOwnedByYou",
      $fault: "client",
      ...s
    });
    p(this, "name", "BucketAlreadyOwnedByYou");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Wd.prototype);
  }
}
class Vd extends ot {
  constructor(s) {
    super({
      name: "NoSuchBucket",
      $fault: "client",
      ...s
    });
    p(this, "name", "NoSuchBucket");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Vd.prototype);
  }
}
var Kh;
(function(t) {
  t.visit = (e, s) => e.Prefix !== void 0 ? s.Prefix(e.Prefix) : e.Tag !== void 0 ? s.Tag(e.Tag) : e.And !== void 0 ? s.And(e.And) : s._(e.$unknown[0], e.$unknown[1]);
})(Kh || (Kh = {}));
var Wh;
(function(t) {
  t.visit = (e, s) => e.Prefix !== void 0 ? s.Prefix(e.Prefix) : e.Tag !== void 0 ? s.Tag(e.Tag) : e.AccessPointArn !== void 0 ? s.AccessPointArn(e.AccessPointArn) : e.And !== void 0 ? s.And(e.And) : s._(e.$unknown[0], e.$unknown[1]);
})(Wh || (Wh = {}));
class Gd extends ot {
  constructor(s) {
    super({
      name: "InvalidObjectState",
      $fault: "client",
      ...s
    });
    p(this, "name", "InvalidObjectState");
    p(this, "$fault", "client");
    p(this, "StorageClass");
    p(this, "AccessTier");
    Object.setPrototypeOf(this, Gd.prototype), this.StorageClass = s.StorageClass, this.AccessTier = s.AccessTier;
  }
}
class Jd extends ot {
  constructor(s) {
    super({
      name: "NoSuchKey",
      $fault: "client",
      ...s
    });
    p(this, "name", "NoSuchKey");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Jd.prototype);
  }
}
class Zd extends ot {
  constructor(s) {
    super({
      name: "NotFound",
      $fault: "client",
      ...s
    });
    p(this, "name", "NotFound");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Zd.prototype);
  }
}
const _x = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me }
}), vx = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me }
}), bx = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), Sx = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me },
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me },
  ...t.CopySourceSSECustomerKey && { CopySourceSSECustomerKey: me }
}), Ex = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), Ax = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me },
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), xx = (t) => ({
  ...t,
  ...t.SecretAccessKey && { SecretAccessKey: me },
  ...t.SessionToken && { SessionToken: me }
}), Cx = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me },
  ...t.Credentials && { Credentials: xx(t.Credentials) }
}), Ix = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), Tx = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me }
}), kx = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me }
}), Rx = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me }
}), Ox = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me }
});
function Nx(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Mx(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;");
}
class Dx {
  constructor(e) {
    p(this, "value");
    this.value = e;
  }
  toString() {
    return Mx("" + this.value);
  }
}
class Mn {
  constructor(e, s = []) {
    p(this, "name");
    p(this, "children");
    p(this, "attributes", {});
    this.name = e, this.children = s;
  }
  static of(e, s, n) {
    const r = new Mn(e);
    return s !== void 0 && r.addChildNode(new Dx(s)), n !== void 0 && r.withName(n), r;
  }
  withName(e) {
    return this.name = e, this;
  }
  addAttribute(e, s) {
    return this.attributes[e] = s, this;
  }
  addChildNode(e) {
    return this.children.push(e), this;
  }
  removeAttribute(e) {
    return delete this.attributes[e], this;
  }
  n(e) {
    return this.name = e, this;
  }
  c(e) {
    return this.children.push(e), this;
  }
  a(e, s) {
    return s != null && (this.attributes[e] = s), this;
  }
  cc(e, s, n = s) {
    if (e[s] != null) {
      const r = Mn.of(s, e[s]).withName(n);
      this.c(r);
    }
  }
  l(e, s, n, r) {
    e[s] != null && r().map((i) => {
      i.withName(n), this.c(i);
    });
  }
  lc(e, s, n, r) {
    if (e[s] != null) {
      const a = r(), i = new Mn(n);
      a.map((o) => {
        i.c(o);
      }), this.c(i);
    }
  }
  toString() {
    const e = !!this.children.length;
    let s = `<${this.name}`;
    const n = this.attributes;
    for (const r of Object.keys(n)) {
      const a = n[r];
      a != null && (s += ` ${r}="${Nx("" + a)}"`);
    }
    return s += e ? `>${this.children.map((r) => r.toString()).join("")}</${this.name}>` : "/>";
  }
}
class Yd extends ot {
  constructor(s) {
    super({
      name: "EncryptionTypeMismatch",
      $fault: "client",
      ...s
    });
    p(this, "name", "EncryptionTypeMismatch");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Yd.prototype);
  }
}
class Xd extends ot {
  constructor(s) {
    super({
      name: "InvalidRequest",
      $fault: "client",
      ...s
    });
    p(this, "name", "InvalidRequest");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Xd.prototype);
  }
}
class Qd extends ot {
  constructor(s) {
    super({
      name: "InvalidWriteOffset",
      $fault: "client",
      ...s
    });
    p(this, "name", "InvalidWriteOffset");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, Qd.prototype);
  }
}
class el extends ot {
  constructor(s) {
    super({
      name: "TooManyParts",
      $fault: "client",
      ...s
    });
    p(this, "name", "TooManyParts");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, el.prototype);
  }
}
class tl extends ot {
  constructor(s) {
    super({
      name: "ObjectAlreadyInActiveTierError",
      $fault: "client",
      ...s
    });
    p(this, "name", "ObjectAlreadyInActiveTierError");
    p(this, "$fault", "client");
    Object.setPrototypeOf(this, tl.prototype);
  }
}
var Vh;
(function(t) {
  t.visit = (e, s) => e.Records !== void 0 ? s.Records(e.Records) : e.Stats !== void 0 ? s.Stats(e.Stats) : e.Progress !== void 0 ? s.Progress(e.Progress) : e.Cont !== void 0 ? s.Cont(e.Cont) : e.End !== void 0 ? s.End(e.End) : s._(e.$unknown[0], e.$unknown[1]);
})(Vh || (Vh = {}));
const Px = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), Bx = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me },
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me },
  ...t.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: me }
}), Ux = (t) => ({
  ...t,
  ...t.SSEKMSKeyId && { SSEKMSKeyId: me }
}), Fx = (t) => ({
  ...t,
  ...t.SSECustomerKey && { SSECustomerKey: me }
}), $x = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [Ss]: t[_s],
    [vs]: t[ys],
    [CI]: [() => le(t[Yh]), () => It(t[Yh]).toString()]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "AbortMultipartUpload"],
    [ll]: [, Ke(t[wr], "UploadId")]
  });
  return s.m("DELETE").h(n).q(r).b(void 0), s.build();
}, Lx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    "content-type": "application/xml",
    [Wn]: t[yt],
    [Vn]: t[wt],
    [Gn]: t[_t],
    [Jn]: t[vt],
    [Ss]: t[_s],
    [vs]: t[ys],
    [Ka]: t[Ba],
    [yo]: t[mo],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [ll]: [, Ke(t[wr], "UploadId")]
  });
  let a, i;
  return t.MultipartUpload !== void 0 && (i = bC(t.MultipartUpload), i = i.n("CompleteMultipartUpload"), a = hI, i.a("xmlns", "http://s3.amazonaws.com/doc/2006-03-01/"), a += i.toString()), s.m("POST").h(n).q(r).b(a), s.build();
}, Hx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [hl]: t[sl],
    [La]: t[Oa],
    [fl]: t[Ms],
    [Ha]: t[Na],
    [ja]: t[Ma],
    [qa]: t[Da],
    [za]: t[Pa],
    [gI]: t[$C],
    [yI]: t[LC],
    [wI]: [() => le(t[Jh]), () => It(t[Jh]).toString()],
    [_I]: t[HC],
    [vI]: [() => le(t[Zh]), () => It(t[Zh]).toString()],
    [Hn]: [() => le(t[un]), () => It(t[un]).toString()],
    [pl]: t[rl],
    [ml]: t[al],
    [gl]: t[il],
    [yl]: t[ol],
    [RI]: t[GC],
    [MI]: t[QC],
    [Wt]: t[zt],
    [Ja]: t[ss],
    [Za]: t[$a],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Vt]: t[Kt],
    [pn]: t[fn],
    [Le]: [() => le(t[it]), () => t[it].toString()],
    [SI]: t[jC],
    [EI]: t[qC],
    [AI]: t[zC],
    [Ss]: t[_s],
    [wl]: t[cl],
    [Ga]: t[Fa],
    [jn]: [() => le(t[hn]), () => Td(t[hn]).toString()],
    [Va]: t[Ua],
    [vs]: t[ys],
    [NI]: t[WC],
    ...t.Metadata !== void 0 && Object.keys(t.Metadata).reduce((i, o) => (i[`x-amz-meta-${o.toLowerCase()}`] = t.Metadata[o], i), {})
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "CopyObject"]
  });
  return s.m("PUT").h(n).q(r).b(void 0), s.build();
}, jx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [hl]: t[sl],
    [La]: t[Oa],
    [Ha]: t[Na],
    [ja]: t[Ma],
    [qa]: t[Da],
    [za]: t[Pa],
    [Hn]: [() => le(t[un]), () => It(t[un]).toString()],
    [pl]: t[rl],
    [ml]: t[al],
    [gl]: t[il],
    [yl]: t[ol],
    [Wt]: t[zt],
    [Ja]: t[ss],
    [Za]: t[$a],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Vt]: t[Kt],
    [pn]: t[fn],
    [Le]: [() => le(t[it]), () => t[it].toString()],
    [Ss]: t[_s],
    [wl]: t[cl],
    [Ga]: t[Fa],
    [jn]: [() => le(t[hn]), () => Td(t[hn]).toString()],
    [Va]: t[Ua],
    [vs]: t[ys],
    [fl]: t[Ms],
    ...t.Metadata !== void 0 && Object.keys(t.Metadata).reduce((i, o) => (i[`x-amz-meta-${o.toLowerCase()}`] = t.Metadata[o], i), {})
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [uI]: [, ""]
  });
  return s.m("POST").h(n).q(r).b(void 0), s.build();
}, qx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [bI]: t[YC],
    [Wt]: t[zt],
    [Vt]: t[Kt],
    [pn]: t[fn],
    [Le]: [() => le(t[it]), () => t[it].toString()]
  });
  s.bp("/"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1);
  const r = Y({
    [dI]: [, ""]
  });
  return s.m("GET").h(n).q(r).b(void 0), s.build();
}, zx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [kI]: t[JC],
    [Ss]: t[_s],
    [mI]: [() => le(t[Gh]), () => t[Gh].toString()],
    [vs]: t[ys],
    [Ka]: t[Ba],
    [II]: [() => le(t[Xh]), () => It(t[Xh]).toString()],
    [TI]: [() => le(t[Qh]), () => t[Qh].toString()]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "DeleteObject"],
    [ul]: [, t[Bs]]
  });
  return s.m("DELETE").h(n).q(r).b(void 0), s.build();
}, Kx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [Ka]: t[Ba],
    [ig]: [() => le(t[Yi]), () => It(t[Yi]).toString()],
    [yo]: t[mo],
    [og]: [() => le(t[Xi]), () => It(t[Xi]).toString()],
    [cg]: t[Gm],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Ss]: t[_s],
    [vs]: t[ys],
    [mg]: t[qm]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "GetObject"],
    [dg]: [, t[Jm]],
    [lg]: [, t[Zm]],
    [ug]: [, t[Ym]],
    [hg]: [, t[Xm]],
    [fg]: [, t[Qm]],
    [pg]: [() => t.ResponseExpires !== void 0, () => It(t[eg]).toString()],
    [ul]: [, t[Bs]],
    [dl]: [() => t.PartNumber !== void 0, () => t[xn].toString()]
  });
  return s.m("GET").h(n).q(r).b(void 0), s.build();
}, Wx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [Ka]: t[Ba],
    [ig]: [() => le(t[Yi]), () => It(t[Yi]).toString()],
    [yo]: t[mo],
    [og]: [() => le(t[Xi]), () => It(t[Xi]).toString()],
    [cg]: t[Gm],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Ss]: t[_s],
    [vs]: t[ys],
    [mg]: t[qm]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [dg]: [, t[Jm]],
    [lg]: [, t[Zm]],
    [ug]: [, t[Ym]],
    [hg]: [, t[Xm]],
    [fg]: [, t[Qm]],
    [pg]: [() => t.ResponseExpires !== void 0, () => It(t[eg]).toString()],
    [ul]: [, t[Bs]],
    [dl]: [() => t.PartNumber !== void 0, () => t[xn].toString()]
  });
  return s.m("HEAD").h(n).q(r).b(void 0), s.build();
}, Vx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [Ss]: t[_s],
    [vs]: t[ys],
    [OI]: [() => le(t[ef]), () => (t[ef] || []).map(O_).join(", ")]
  });
  s.bp("/"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1);
  const r = Y({
    [aI]: [, "2"],
    [sI]: [, t[ki]],
    [nI]: [, t[Ri]],
    [oI]: [() => t.MaxKeys !== void 0, () => t[Oi].toString()],
    [cI]: [, t[Dn]],
    [tI]: [, t[Ti]],
    [rI]: [() => t.FetchOwner !== void 0, () => t[VC].toString()],
    [lI]: [, t[Ni]]
  });
  return s.m("GET").h(n).q(r).b(void 0), s.build();
}, Gx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    [za]: t[Pa] || "application/octet-stream",
    [hl]: t[sl],
    [La]: t[Oa],
    [Ha]: t[Na],
    [ja]: t[Ma],
    [qa]: t[Da],
    [Pr]: [() => le(t[Dr]), () => t[Dr].toString()],
    [rg]: t[zm],
    [wg]: t[Ms],
    [Wn]: t[yt],
    [Vn]: t[wt],
    [Gn]: t[_t],
    [Jn]: t[vt],
    [Hn]: [() => le(t[un]), () => It(t[un]).toString()],
    [Ka]: t[Ba],
    [yo]: t[mo],
    [pl]: t[rl],
    [ml]: t[al],
    [gl]: t[il],
    [yl]: t[ol],
    [DI]: [() => le(t[tf]), () => t[tf].toString()],
    [Wt]: t[zt],
    [Ja]: t[ss],
    [Za]: t[$a],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Vt]: t[Kt],
    [pn]: t[fn],
    [Le]: [() => le(t[it]), () => t[it].toString()],
    [Ss]: t[_s],
    [wl]: t[cl],
    [Ga]: t[Fa],
    [jn]: [() => le(t[hn]), () => Td(t[hn]).toString()],
    [Va]: t[Ua],
    [vs]: t[ys],
    ...t.Metadata !== void 0 && Object.keys(t.Metadata).reduce((o, c) => (o[`x-amz-meta-${c.toLowerCase()}`] = t.Metadata[c], o), {})
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "PutObject"]
  });
  let a, i;
  return t.Body !== void 0 && (i = t.Body, a = i), s.m("PUT").h(n).q(r).b(a), s.build();
}, Jx = async (t, e) => {
  const s = as(t, e), n = Y({}, le, {
    "content-type": "application/octet-stream",
    [Pr]: [() => le(t[Dr]), () => t[Dr].toString()],
    [rg]: t[zm],
    [wg]: t[Ms],
    [Wn]: t[yt],
    [Vn]: t[wt],
    [Gn]: t[_t],
    [Jn]: t[vt],
    [Pt]: t[Mt],
    [Zn]: t[Kn],
    [Bt]: t[Dt],
    [Ss]: t[_s],
    [vs]: t[ys]
  });
  s.bp("/{Key+}"), s.p("Bucket", () => t.Bucket, "{Bucket}", !1), s.p("Key", () => t.Key, "{Key+}", !0);
  const r = Y({
    [zr]: [, "UploadPart"],
    [dl]: [Ke(t.PartNumber, "PartNumber") != null, () => t[xn].toString()],
    [ll]: [, Ke(t[wr], "UploadId")]
  });
  let a, i;
  return t.Body !== void 0 && (i = t.Body, a = i), s.m("PUT").h(n).q(r).b(a), s.build();
}, Zx = async (t, e) => {
  if (t.statusCode !== 204 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [ws]: [, t.headers[bs]]
  });
  return await Hr(t.body, e), s;
}, Yx = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [rn]: [, t.headers[Wa]],
    [zt]: [, t.headers[Wt]],
    [Bs]: [, t.headers[qr]],
    [Kt]: [, t.headers[Vt]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ws]: [, t.headers[bs]]
  }), n = Ke(ka(await jr(t.body, e)), "body");
  return n[yr] != null && (s[yr] = de(n[yr])), n[yt] != null && (s[yt] = de(n[yt])), n[wt] != null && (s[wt] = de(n[wt])), n[_t] != null && (s[_t] = de(n[_t])), n[vt] != null && (s[vt] = de(n[vt])), n[bt] != null && (s[bt] = de(n[bt])), n[Ds] != null && (s[Ds] = de(n[Ds])), n[Ac] != null && (s[Ac] = de(n[Ac])), s;
}, Xx = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [rn]: [, t.headers[Wa]],
    [KC]: [, t.headers[xI]],
    [Bs]: [, t.headers[qr]],
    [zt]: [, t.headers[Wt]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [fn]: [, t.headers[pn]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ws]: [, t.headers[bs]]
  }), n = ka(await jr(t.body, e));
  return s.CopyObjectResult = IC(n), s;
}, Qx = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [MC]: [
      () => t.headers[sf] !== void 0,
      () => Ke($n(t.headers[sf]))
    ],
    [DC]: [, t.headers[fI]],
    [zt]: [, t.headers[Wt]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [fn]: [, t.headers[pn]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ws]: [, t.headers[bs]],
    [Ms]: [, t.headers[fl]]
  }), n = Ke(ka(await jr(t.body, e)), "body");
  return n[yr] != null && (s[yr] = de(n[yr])), n[Ds] != null && (s[Ds] = de(n[Ds])), n[wr] != null && (s[wr] = de(n[wr])), s;
}, eC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [zt]: [, t.headers[Wt]],
    [Kt]: [, t.headers[Vt]],
    [fn]: [, t.headers[pn]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])]
  }), n = Ke(ka(await jr(t.body, e)), "body");
  return n[wc] != null && (s[wc] = NC(n[wc])), s;
}, tC = async (t, e) => {
  if (t.statusCode !== 204 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [nl]: [() => t.headers[Br] !== void 0, () => Tt(t.headers[Br])],
    [Bs]: [, t.headers[qr]],
    [ws]: [, t.headers[bs]]
  });
  return await Hr(t.body, e), s;
}, sC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [nl]: [() => t.headers[Br] !== void 0, () => Tt(t.headers[Br])],
    [jm]: [, t.headers[ng]],
    [rn]: [, t.headers[Wa]],
    [sg]: [, t.headers[gg]],
    [an]: [() => t.headers[Qi] !== void 0, () => Ke($n(t.headers[Qi]))],
    [Dr]: [() => t.headers[Pr] !== void 0, () => ho(t.headers[Pr])],
    [bt]: [, t.headers[go]],
    [yt]: [, t.headers[Wn]],
    [wt]: [, t.headers[Vn]],
    [_t]: [, t.headers[Gn]],
    [vt]: [, t.headers[Jn]],
    [Wm]: [() => t.headers[eo] !== void 0, () => On(t.headers[eo])],
    [Bs]: [, t.headers[qr]],
    [Oa]: [, t.headers[La]],
    [Na]: [, t.headers[Ha]],
    [Ma]: [, t.headers[ja]],
    [Da]: [, t.headers[qa]],
    [FC]: [, t.headers[eI]],
    [Pa]: [, t.headers[za]],
    [un]: [() => t.headers[Hn] !== void 0, () => Ke($n(t.headers[Hn]))],
    [Km]: [, t.headers[ag]],
    [$a]: [, t.headers[Za]],
    [zt]: [, t.headers[Wt]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ss]: [, t.headers[Ja]],
    [ws]: [, t.headers[bs]],
    [tg]: [, t.headers[yg]],
    [Vm]: [() => t.headers[to] !== void 0, () => On(t.headers[to])],
    [XC]: [() => t.headers[rf] !== void 0, () => On(t.headers[rf])],
    [Fa]: [, t.headers[Ga]],
    [hn]: [
      () => t.headers[jn] !== void 0,
      () => Ke(Lr(t.headers[jn]))
    ],
    [Ua]: [, t.headers[Va]],
    Metadata: [
      ,
      Object.keys(t.headers).filter((r) => r.startsWith("x-amz-meta-")).reduce((r, a) => (r[a.substring(11)] = t.headers[a], r), {})
    ]
  }), n = t.body;
  return e.sdkStreamMixin(n), s.Body = n, s;
}, nC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [nl]: [() => t.headers[Br] !== void 0, () => Tt(t.headers[Br])],
    [jm]: [, t.headers[ng]],
    [rn]: [, t.headers[Wa]],
    [sg]: [, t.headers[gg]],
    [PC]: [, t.headers[pI]],
    [an]: [() => t.headers[Qi] !== void 0, () => Ke($n(t.headers[Qi]))],
    [Dr]: [() => t.headers[Pr] !== void 0, () => ho(t.headers[Pr])],
    [yt]: [, t.headers[Wn]],
    [wt]: [, t.headers[Vn]],
    [_t]: [, t.headers[Gn]],
    [vt]: [, t.headers[Jn]],
    [bt]: [, t.headers[go]],
    [Wm]: [() => t.headers[eo] !== void 0, () => On(t.headers[eo])],
    [Bs]: [, t.headers[qr]],
    [Oa]: [, t.headers[La]],
    [Na]: [, t.headers[Ha]],
    [Ma]: [, t.headers[ja]],
    [Da]: [, t.headers[qa]],
    [Pa]: [, t.headers[za]],
    [un]: [() => t.headers[Hn] !== void 0, () => Ke($n(t.headers[Hn]))],
    [Km]: [, t.headers[ag]],
    [$a]: [, t.headers[Za]],
    [zt]: [, t.headers[Wt]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ss]: [, t.headers[Ja]],
    [ws]: [, t.headers[bs]],
    [tg]: [, t.headers[yg]],
    [Vm]: [() => t.headers[to] !== void 0, () => On(t.headers[to])],
    [Fa]: [, t.headers[Ga]],
    [hn]: [
      () => t.headers[jn] !== void 0,
      () => Ke(Lr(t.headers[jn]))
    ],
    [Ua]: [, t.headers[Va]],
    Metadata: [
      ,
      Object.keys(t.headers).filter((n) => n.startsWith("x-amz-meta-")).reduce((n, r) => (n[r.substring(11)] = t.headers[r], n), {})
    ]
  });
  return await Hr(t.body, e), s;
}, rC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [ws]: [, t.headers[bs]]
  }), n = Ke(ka(await jr(t.body, e)), "body");
  return n.CommonPrefixes === "" ? s[hi] = [] : n[hi] != null && (s[hi] = CC(ed(n[hi]))), n.Contents === "" ? s[fi] = [] : n[fi] != null && (s[fi] = kC(ed(n[fi]))), n[Ti] != null && (s[Ti] = de(n[Ti])), n[ki] != null && (s[ki] = de(n[ki])), n[Ri] != null && (s[Ri] = de(n[Ri])), n[Sc] != null && (s[Sc] = Tt(n[Sc])), n[Ec] != null && (s[Ec] = On(n[Ec])), n[Oi] != null && (s[Oi] = On(n[Oi])), n[xc] != null && (s[xc] = de(n[xc])), n[Cc] != null && (s[Cc] = de(n[Cc])), n[Dn] != null && (s[Dn] = de(n[Dn])), n[Ni] != null && (s[Ni] = de(n[Ni])), s;
}, aC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [rn]: [, t.headers[Wa]],
    [bt]: [, t.headers[go]],
    [yt]: [, t.headers[Wn]],
    [wt]: [, t.headers[Vn]],
    [_t]: [, t.headers[Gn]],
    [vt]: [, t.headers[Jn]],
    [zt]: [, t.headers[Wt]],
    [Bs]: [, t.headers[qr]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [fn]: [, t.headers[pn]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [Mi]: [() => t.headers[nf] !== void 0, () => ho(t.headers[nf])],
    [ws]: [, t.headers[bs]]
  });
  return await Hr(t.body, e), s;
}, iC = async (t, e) => {
  if (t.statusCode !== 200 && t.statusCode >= 300)
    return cs(t, e);
  const s = Y({
    $metadata: Ae(t),
    [zt]: [, t.headers[Wt]],
    [bt]: [, t.headers[go]],
    [yt]: [, t.headers[Wn]],
    [wt]: [, t.headers[Vn]],
    [_t]: [, t.headers[Gn]],
    [vt]: [, t.headers[Jn]],
    [Mt]: [, t.headers[Pt]],
    [Dt]: [, t.headers[Bt]],
    [Kt]: [, t.headers[Vt]],
    [it]: [() => t.headers[Le] !== void 0, () => Tt(t.headers[Le])],
    [ws]: [, t.headers[bs]]
  });
  return await Hr(t.body, e), s;
}, cs = async (t, e) => {
  const s = {
    ...t,
    body: await fS(t.body, e)
  }, n = pS(t, s.body);
  switch (n) {
    case "NoSuchUpload":
    case "com.amazonaws.s3#NoSuchUpload":
      throw await gC(s);
    case "ObjectNotInActiveTierError":
    case "com.amazonaws.s3#ObjectNotInActiveTierError":
      throw await _C(s);
    case "BucketAlreadyExists":
    case "com.amazonaws.s3#BucketAlreadyExists":
      throw await cC(s);
    case "BucketAlreadyOwnedByYou":
    case "com.amazonaws.s3#BucketAlreadyOwnedByYou":
      throw await dC(s);
    case "NoSuchBucket":
    case "com.amazonaws.s3#NoSuchBucket":
      throw await pC(s);
    case "InvalidObjectState":
    case "com.amazonaws.s3#InvalidObjectState":
      throw await uC(s);
    case "NoSuchKey":
    case "com.amazonaws.s3#NoSuchKey":
      throw await mC(s);
    case "NotFound":
    case "com.amazonaws.s3#NotFound":
      throw await yC(s);
    case "EncryptionTypeMismatch":
    case "com.amazonaws.s3#EncryptionTypeMismatch":
      throw await lC(s);
    case "InvalidRequest":
    case "com.amazonaws.s3#InvalidRequest":
      throw await hC(s);
    case "InvalidWriteOffset":
    case "com.amazonaws.s3#InvalidWriteOffset":
      throw await fC(s);
    case "TooManyParts":
    case "com.amazonaws.s3#TooManyParts":
      throw await vC(s);
    case "ObjectAlreadyInActiveTierError":
    case "com.amazonaws.s3#ObjectAlreadyInActiveTierError":
      throw await wC(s);
    default:
      const r = s.body;
      return oC({
        output: t,
        parsedBody: r,
        errorCode: n
      });
  }
}, oC = y0(ot), cC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Kd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, dC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Wd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, lC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Yd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, uC = async (t, e) => {
  const s = Y({}), n = t.body;
  n[yc] != null && (s[yc] = de(n[yc])), n[ss] != null && (s[ss] = de(n[ss]));
  const r = new Gd({
    $metadata: Ae(t),
    ...s
  });
  return At(r, t.body);
}, hC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Xd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, fC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Qd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, pC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Vd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, mC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Jd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, gC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new qd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, yC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new Zd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, wC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new tl({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, _C = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new zd({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, vC = async (t, e) => {
  const s = Y({});
  t.body;
  const n = new el({
    $metadata: Ae(t),
    ...s
  });
  return At(n, t.body);
}, bC = (t, e) => {
  const s = new Mn(BC);
  return s.l(t, "Parts", "Part", () => EC(t[ZC])), s;
}, SC = (t, e) => {
  const s = new Mn(UC);
  return s.cc(t, bt), s.cc(t, yt), s.cc(t, wt), s.cc(t, _t), s.cc(t, vt), t[xn] != null && s.c(Mn.of(xn, String(t[xn])).n(xn)), s;
}, EC = (t, e) => t.filter((s) => s != null).map((s) => SC(s).n(iI)), AC = (t, e) => (t || []).filter((s) => s != null).map((s) => de(s)), xC = (t, e) => {
  const s = {};
  return t[Dn] != null && (s[Dn] = de(t[Dn])), s;
}, CC = (t, e) => (t || []).filter((s) => s != null).map((s) => xC(s)), IC = (t, e) => {
  const s = {};
  return t[bt] != null && (s[bt] = de(t[bt])), t[an] != null && (s[an] = Ke(Lr(t[an]))), t[yt] != null && (s[yt] = de(t[yt])), t[wt] != null && (s[wt] = de(t[wt])), t[_t] != null && (s[_t] = de(t[_t])), t[vt] != null && (s[vt] = de(t[vt])), s;
}, TC = (t, e) => {
  const s = {};
  return t[Ds] != null && (s[Ds] = de(t[Ds])), t[an] != null && (s[an] = Ke(Lr(t[an]))), t[bt] != null && (s[bt] = de(t[bt])), t.ChecksumAlgorithm === "" ? s[Ms] = [] : t[Ms] != null && (s[Ms] = AC(ed(t[Ms]))), t[Mi] != null && (s[Mi] = ho(t[Mi])), t[ss] != null && (s[ss] = de(t[ss])), t[Ic] != null && (s[Ic] = RC(t[Ic])), t[kc] != null && (s[kc] = OC(t[kc])), s;
}, kC = (t, e) => (t || []).filter((s) => s != null).map((s) => TC(s)), RC = (t, e) => {
  const s = {};
  return t[_c] != null && (s[_c] = de(t[_c])), t[vc] != null && (s[vc] = de(t[vc])), s;
}, OC = (t, e) => {
  const s = {};
  return t[bc] != null && (s[bc] = Tt(t[bc])), t[Tc] != null && (s[Tc] = Ke(Lr(t[Tc]))), s;
}, NC = (t, e) => {
  const s = {};
  return t[gc] != null && (s[gc] = de(t[gc])), t[Rc] != null && (s[Rc] = de(t[Rc])), t[Oc] != null && (s[Oc] = de(t[Oc])), t[rn] != null && (s[rn] = Ke(Lr(t[rn]))), s;
}, Ae = (t) => ({
  httpStatusCode: t.statusCode,
  requestId: t.headers["x-amzn-requestid"] ?? t.headers["x-amzn-request-id"] ?? t.headers["x-amz-request-id"],
  extendedRequestId: t.headers["x-amz-id-2"],
  cfId: t.headers["x-amz-cf-id"]
}), sl = "ACL", MC = "AbortDate", gc = "AccessKeyId", jm = "AcceptRanges", DC = "AbortRuleId", PC = "ArchiveStatus", yc = "AccessTier", yr = "Bucket", Gh = "BypassGovernanceRetention", it = "BucketKeyEnabled", wc = "Credentials", Ms = "ChecksumAlgorithm", Oa = "CacheControl", yt = "ChecksumCRC32", wt = "ChecksumCRC32C", Na = "ContentDisposition", Ma = "ContentEncoding", Da = "ContentLanguage", Dr = "ContentLength", qm = "ChecksumMode", zm = "ContentMD5", BC = "CompletedMultipartUpload", hi = "CommonPrefixes", UC = "CompletedPart", FC = "ContentRange", $C = "CopySource", _t = "ChecksumSHA1", vt = "ChecksumSHA256", LC = "CopySourceIfMatch", Jh = "CopySourceIfModifiedSince", HC = "CopySourceIfNoneMatch", Zh = "CopySourceIfUnmodifiedSince", jC = "CopySourceSSECustomerAlgorithm", qC = "CopySourceSSECustomerKey", zC = "CopySourceSSECustomerKeyMD5", KC = "CopySourceVersionId", Pa = "ContentType", Ti = "ContinuationToken", fi = "Contents", ki = "Delimiter", nl = "DeleteMarker", _c = "DisplayName", un = "Expires", ys = "ExpectedBucketOwner", Km = "ExpiresString", WC = "ExpectedSourceBucketOwner", Ri = "EncodingType", bt = "ETag", rn = "Expiration", VC = "FetchOwner", rl = "GrantFullControl", al = "GrantRead", il = "GrantReadACP", ol = "GrantWriteACP", vc = "ID", Ba = "IfMatch", Yh = "IfMatchInitiatedTime", Xh = "IfMatchLastModifiedTime", Qh = "IfMatchSize", Yi = "IfModifiedSince", mo = "IfNoneMatch", bc = "IsRestoreInProgress", Sc = "IsTruncated", Xi = "IfUnmodifiedSince", Ds = "Key", Ec = "KeyCount", Ac = "Location", an = "LastModified", GC = "MetadataDirective", JC = "MFA", Oi = "MaxKeys", Wm = "MissingMeta", xc = "Name", Cc = "NextContinuationToken", Ic = "Owner", Ua = "ObjectLockLegalHoldStatus", Fa = "ObjectLockMode", hn = "ObjectLockRetainUntilDate", ef = "OptionalObjectAttributes", Dn = "Prefix", Vm = "PartsCount", xn = "PartNumber", ZC = "Parts", Gm = "Range", ws = "RequestCharged", Jm = "ResponseCacheControl", Zm = "ResponseContentDisposition", Ym = "ResponseContentEncoding", Xm = "ResponseContentLanguage", Qm = "ResponseContentType", eg = "ResponseExpires", Tc = "RestoreExpiryDate", _s = "RequestPayer", tg = "ReplicationStatus", kc = "RestoreStatus", sg = "Restore", Ni = "StartAfter", Rc = "SecretAccessKey", ss = "StorageClass", YC = "SessionMode", zt = "ServerSideEncryption", Mt = "SSECustomerAlgorithm", Kn = "SSECustomerKey", Dt = "SSECustomerKeyMD5", fn = "SSEKMSEncryptionContext", Kt = "SSEKMSKeyId", Oc = "SessionToken", Mi = "Size", cl = "Tagging", XC = "TagCount", QC = "TaggingDirective", wr = "UploadId", Bs = "VersionId", tf = "WriteOffsetBytes", $a = "WebsiteRedirectLocation", ng = "accept-ranges", La = "cache-control", Ha = "content-disposition", ja = "content-encoding", qa = "content-language", Pr = "content-length", rg = "content-md5", eI = "content-range", za = "content-type", tI = "continuation-token", sI = "delimiter", Hn = "expires", nI = "encoding-type", go = "etag", ag = "expiresstring", rI = "fetch-owner", Ka = "if-match", ig = "if-modified-since", yo = "if-none-match", og = "if-unmodified-since", Qi = "last-modified", aI = "list-type", iI = "member", oI = "max-keys", dl = "partNumber", cI = "prefix", cg = "range", dg = "response-cache-control", lg = "response-content-disposition", ug = "response-content-encoding", hg = "response-content-language", fg = "response-content-type", pg = "response-expires", dI = "session", lI = "start-after", uI = "uploads", ll = "uploadId", ul = "versionId", hI = '<?xml version="1.0" encoding="UTF-8"?>', hl = "x-amz-acl", sf = "x-amz-abort-date", fI = "x-amz-abort-rule-id", pI = "x-amz-archive-status", mI = "x-amz-bypass-governance-retention", fl = "x-amz-checksum-algorithm", Wn = "x-amz-checksum-crc32", Vn = "x-amz-checksum-crc32c", mg = "x-amz-checksum-mode", Gn = "x-amz-checksum-sha1", Jn = "x-amz-checksum-sha256", gI = "x-amz-copy-source", yI = "x-amz-copy-source-if-match", wI = "x-amz-copy-source-if-modified-since", _I = "x-amz-copy-source-if-none-match", vI = "x-amz-copy-source-if-unmodified-since", bI = "x-amz-create-session-mode", SI = "x-amz-copy-source-server-side-encryption-customer-algorithm", EI = "x-amz-copy-source-server-side-encryption-customer-key", AI = "x-amz-copy-source-server-side-encryption-customer-key-md5", xI = "x-amz-copy-source-version-id", Br = "x-amz-delete-marker", Wa = "x-amz-expiration", vs = "x-amz-expected-bucket-owner", pl = "x-amz-grant-full-control", ml = "x-amz-grant-read", gl = "x-amz-grant-read-acp", yl = "x-amz-grant-write-acp", CI = "x-amz-if-match-initiated-time", II = "x-amz-if-match-last-modified-time", TI = "x-amz-if-match-size", kI = "x-amz-mfa", RI = "x-amz-metadata-directive", eo = "x-amz-missing-meta", to = "x-amz-mp-parts-count", Va = "x-amz-object-lock-legal-hold", Ga = "x-amz-object-lock-mode", jn = "x-amz-object-lock-retain-until-date", OI = "x-amz-optional-object-attributes", nf = "x-amz-object-size", gg = "x-amz-restore", bs = "x-amz-request-charged", Ss = "x-amz-request-payer", yg = "x-amz-replication-status", Ja = "x-amz-storage-class", wg = "x-amz-sdk-checksum-algorithm", NI = "x-amz-source-expected-bucket-owner", Wt = "x-amz-server-side-encryption", Vt = "x-amz-server-side-encryption-aws-kms-key-id", Le = "x-amz-server-side-encryption-bucket-key-enabled", pn = "x-amz-server-side-encryption-context", Pt = "x-amz-server-side-encryption-customer-algorithm", Zn = "x-amz-server-side-encryption-customer-key", Bt = "x-amz-server-side-encryption-customer-key-md5", wl = "x-amz-tagging", rf = "x-amz-tagging-count", MI = "x-amz-tagging-directive", qr = "x-amz-version-id", DI = "x-amz-write-offset-bytes", Za = "x-amz-website-redirect-location", zr = "x-id";
class PI extends qt.classBuilder().ep({
  ...os,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: !0 },
  Bucket: { type: "contextParams", name: "Bucket" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n)
  ];
}).s("AmazonS3", "CreateSession", {}).n("S3Client", "CreateSessionCommand").f(Ix, Cx).ser(qx).de(eC).build() {
}
const BI = "3.726.1", UI = {
  version: BI
}, FI = (t) => new TextEncoder().encode(t);
function af(t) {
  return typeof t == "string" ? t.length === 0 : t.byteLength === 0;
}
var _g = { name: "SHA-1" }, of = {
  name: "HMAC",
  hash: _g
}, $I = new Uint8Array([
  218,
  57,
  163,
  238,
  94,
  107,
  75,
  13,
  50,
  85,
  191,
  239,
  149,
  96,
  24,
  144,
  175,
  216,
  7,
  9
]);
const LI = {};
function on() {
  return typeof window < "u" ? window : typeof self < "u" ? self : LI;
}
var HI = (
  /** @class */
  function() {
    function t(e) {
      this.toHash = new Uint8Array(0), e !== void 0 && (this.key = new Promise(function(s, n) {
        on().crypto.subtle.importKey("raw", cf(e), of, !1, ["sign"]).then(s, n);
      }), this.key.catch(function() {
      }));
    }
    return t.prototype.update = function(e) {
      if (!af(e)) {
        var s = cf(e), n = new Uint8Array(this.toHash.byteLength + s.byteLength);
        n.set(this.toHash, 0), n.set(s, this.toHash.byteLength), this.toHash = n;
      }
    }, t.prototype.digest = function() {
      var e = this;
      return this.key ? this.key.then(function(s) {
        return on().crypto.subtle.sign(of, s, e.toHash).then(function(n) {
          return new Uint8Array(n);
        });
      }) : af(this.toHash) ? Promise.resolve($I) : Promise.resolve().then(function() {
        return on().crypto.subtle.digest(_g, e.toHash);
      }).then(function(s) {
        return Promise.resolve(new Uint8Array(s));
      });
    }, t.prototype.reset = function() {
      this.toHash = new Uint8Array(0);
    }, t;
  }()
);
function cf(t) {
  return typeof t == "string" ? FI(t) : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength / Uint8Array.BYTES_PER_ELEMENT) : new Uint8Array(t);
}
var jI = [
  "decrypt",
  "digest",
  "encrypt",
  "exportKey",
  "generateKey",
  "importKey",
  "sign",
  "verify"
];
function vg(t) {
  if (qI(t) && typeof t.crypto.subtle == "object") {
    var e = t.crypto.subtle;
    return zI(e);
  }
  return !1;
}
function qI(t) {
  if (typeof t == "object" && typeof t.crypto == "object") {
    var e = t.crypto.getRandomValues;
    return typeof e == "function";
  }
  return !1;
}
function zI(t) {
  return t && jI.every(function(e) {
    return typeof t[e] == "function";
  });
}
var KI = (
  /** @class */
  function() {
    function t(e) {
      if (vg(on()))
        this.hash = new HI(e);
      else
        throw new Error("SHA1 not supported");
    }
    return t.prototype.update = function(e, s) {
      this.hash.update(ln(e));
    }, t.prototype.digest = function() {
      return this.hash.digest();
    }, t.prototype.reset = function() {
      this.hash.reset();
    }, t;
  }()
), bg = { name: "SHA-256" }, df = {
  name: "HMAC",
  hash: bg
}, WI = new Uint8Array([
  227,
  176,
  196,
  66,
  152,
  252,
  28,
  20,
  154,
  251,
  244,
  200,
  153,
  111,
  185,
  36,
  39,
  174,
  65,
  228,
  100,
  155,
  147,
  76,
  164,
  149,
  153,
  27,
  120,
  82,
  184,
  85
]), VI = (
  /** @class */
  function() {
    function t(e) {
      this.toHash = new Uint8Array(0), this.secret = e, this.reset();
    }
    return t.prototype.update = function(e) {
      if (!va(e)) {
        var s = ln(e), n = new Uint8Array(this.toHash.byteLength + s.byteLength);
        n.set(this.toHash, 0), n.set(s, this.toHash.byteLength), this.toHash = n;
      }
    }, t.prototype.digest = function() {
      var e = this;
      return this.key ? this.key.then(function(s) {
        return on().crypto.subtle.sign(df, s, e.toHash).then(function(n) {
          return new Uint8Array(n);
        });
      }) : va(this.toHash) ? Promise.resolve(WI) : Promise.resolve().then(function() {
        return on().crypto.subtle.digest(bg, e.toHash);
      }).then(function(s) {
        return Promise.resolve(new Uint8Array(s));
      });
    }, t.prototype.reset = function() {
      var e = this;
      this.toHash = new Uint8Array(0), this.secret && this.secret !== void 0 && (this.key = new Promise(function(s, n) {
        on().crypto.subtle.importKey("raw", ln(e.secret), df, !1, ["sign"]).then(s, n);
      }), this.key.catch(function() {
      }));
    }, t;
  }()
), $t = 64, GI = 32, JI = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), ZI = [
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
], YI = Math.pow(2, 53) - 1, Di = (
  /** @class */
  function() {
    function t() {
      this.state = Int32Array.from(ZI), this.temp = new Int32Array(64), this.buffer = new Uint8Array(64), this.bufferLength = 0, this.bytesHashed = 0, this.finished = !1;
    }
    return t.prototype.update = function(e) {
      if (this.finished)
        throw new Error("Attempted to update an already finished hash.");
      var s = 0, n = e.byteLength;
      if (this.bytesHashed += n, this.bytesHashed * 8 > YI)
        throw new Error("Cannot hash more than 2^53 - 1 bits");
      for (; n > 0; )
        this.buffer[this.bufferLength++] = e[s++], n--, this.bufferLength === $t && (this.hashBuffer(), this.bufferLength = 0);
    }, t.prototype.digest = function() {
      if (!this.finished) {
        var e = this.bytesHashed * 8, s = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength), n = this.bufferLength;
        if (s.setUint8(this.bufferLength++, 128), n % $t >= $t - 8) {
          for (var r = this.bufferLength; r < $t; r++)
            s.setUint8(r, 0);
          this.hashBuffer(), this.bufferLength = 0;
        }
        for (var r = this.bufferLength; r < $t - 8; r++)
          s.setUint8(r, 0);
        s.setUint32($t - 8, Math.floor(e / 4294967296), !0), s.setUint32($t - 4, e), this.hashBuffer(), this.finished = !0;
      }
      for (var a = new Uint8Array(GI), r = 0; r < 8; r++)
        a[r * 4] = this.state[r] >>> 24 & 255, a[r * 4 + 1] = this.state[r] >>> 16 & 255, a[r * 4 + 2] = this.state[r] >>> 8 & 255, a[r * 4 + 3] = this.state[r] >>> 0 & 255;
      return a;
    }, t.prototype.hashBuffer = function() {
      for (var e = this, s = e.buffer, n = e.state, r = n[0], a = n[1], i = n[2], o = n[3], c = n[4], d = n[5], l = n[6], u = n[7], h = 0; h < $t; h++) {
        if (h < 16)
          this.temp[h] = (s[h * 4] & 255) << 24 | (s[h * 4 + 1] & 255) << 16 | (s[h * 4 + 2] & 255) << 8 | s[h * 4 + 3] & 255;
        else {
          var f = this.temp[h - 2], g = (f >>> 17 | f << 15) ^ (f >>> 19 | f << 13) ^ f >>> 10;
          f = this.temp[h - 15];
          var _ = (f >>> 7 | f << 25) ^ (f >>> 18 | f << 14) ^ f >>> 3;
          this.temp[h] = (g + this.temp[h - 7] | 0) + (_ + this.temp[h - 16] | 0);
        }
        var w = (((c >>> 6 | c << 26) ^ (c >>> 11 | c << 21) ^ (c >>> 25 | c << 7)) + (c & d ^ ~c & l) | 0) + (u + (JI[h] + this.temp[h] | 0) | 0) | 0, b = ((r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10)) + (r & a ^ r & i ^ a & i) | 0;
        u = l, l = d, d = c, c = o + w | 0, o = i, i = a, a = r, r = w + b | 0;
      }
      n[0] += r, n[1] += a, n[2] += i, n[3] += o, n[4] += c, n[5] += d, n[6] += l, n[7] += u;
    }, t;
  }()
), XI = (
  /** @class */
  function() {
    function t(e) {
      this.secret = e, this.hash = new Di(), this.reset();
    }
    return t.prototype.update = function(e) {
      if (!(va(e) || this.error))
        try {
          this.hash.update(ln(e));
        } catch (s) {
          this.error = s;
        }
    }, t.prototype.digestSync = function() {
      if (this.error)
        throw this.error;
      return this.outer ? (this.outer.finished || this.outer.update(this.hash.digest()), this.outer.digest()) : this.hash.digest();
    }, t.prototype.digest = function() {
      return Md(this, void 0, void 0, function() {
        return Dd(this, function(e) {
          return [2, this.digestSync()];
        });
      });
    }, t.prototype.reset = function() {
      if (this.hash = new Di(), this.secret) {
        this.outer = new Di();
        var e = QI(this.secret), s = new Uint8Array($t);
        s.set(e);
        for (var n = 0; n < $t; n++)
          e[n] ^= 54, s[n] ^= 92;
        this.hash.update(e), this.outer.update(s);
        for (var n = 0; n < e.byteLength; n++)
          e[n] = 0;
      }
    }, t;
  }()
);
function QI(t) {
  var e = ln(t);
  if (e.byteLength > $t) {
    var s = new Di();
    s.update(e), e = s.digest();
  }
  var n = new Uint8Array($t);
  return n.set(e), n;
}
var eT = (
  /** @class */
  function() {
    function t(e) {
      vg(on()) ? this.hash = new VI(e) : this.hash = new XI(e);
    }
    return t.prototype.update = function(e, s) {
      this.hash.update(ln(e));
    }, t.prototype.digest = function() {
      return this.hash.digest();
    }, t.prototype.reset = function() {
      this.hash.reset();
    }, t;
  }()
);
const tT = {
  AmazonBot: "amazonbot",
  "Amazon Silk": "amazon_silk",
  "Android Browser": "android",
  BaiduSpider: "baiduspider",
  Bada: "bada",
  BingCrawler: "bingcrawler",
  Brave: "brave",
  BlackBerry: "blackberry",
  "ChatGPT-User": "chatgpt_user",
  Chrome: "chrome",
  ClaudeBot: "claudebot",
  Chromium: "chromium",
  Diffbot: "diffbot",
  DuckDuckBot: "duckduckbot",
  DuckDuckGo: "duckduckgo",
  Electron: "electron",
  Epiphany: "epiphany",
  FacebookExternalHit: "facebookexternalhit",
  Firefox: "firefox",
  Focus: "focus",
  Generic: "generic",
  "Google Search": "google_search",
  Googlebot: "googlebot",
  GPTBot: "gptbot",
  "Internet Explorer": "ie",
  InternetArchiveCrawler: "internetarchivecrawler",
  "K-Meleon": "k_meleon",
  LibreWolf: "librewolf",
  Linespider: "linespider",
  Maxthon: "maxthon",
  "Meta-ExternalAds": "meta_externalads",
  "Meta-ExternalAgent": "meta_externalagent",
  "Meta-ExternalFetcher": "meta_externalfetcher",
  "Meta-WebIndexer": "meta_webindexer",
  "Microsoft Edge": "edge",
  "MZ Browser": "mz",
  "NAVER Whale Browser": "naver",
  "OAI-SearchBot": "oai_searchbot",
  Omgilibot: "omgilibot",
  Opera: "opera",
  "Opera Coast": "opera_coast",
  "Pale Moon": "pale_moon",
  PerplexityBot: "perplexitybot",
  "Perplexity-User": "perplexity_user",
  PhantomJS: "phantomjs",
  PingdomBot: "pingdombot",
  Puffin: "puffin",
  QQ: "qq",
  QQLite: "qqlite",
  QupZilla: "qupzilla",
  Roku: "roku",
  Safari: "safari",
  Sailfish: "sailfish",
  "Samsung Internet for Android": "samsung_internet",
  SlackBot: "slackbot",
  SeaMonkey: "seamonkey",
  Sleipnir: "sleipnir",
  "Sogou Browser": "sogou",
  Swing: "swing",
  Tizen: "tizen",
  "UC Browser": "uc",
  Vivaldi: "vivaldi",
  "WebOS Browser": "webos",
  WeChat: "wechat",
  YahooSlurp: "yahooslurp",
  "Yandex Browser": "yandex",
  YandexBot: "yandexbot",
  YouBot: "youbot"
}, Sg = {
  amazonbot: "AmazonBot",
  amazon_silk: "Amazon Silk",
  android: "Android Browser",
  baiduspider: "BaiduSpider",
  bada: "Bada",
  bingcrawler: "BingCrawler",
  blackberry: "BlackBerry",
  brave: "Brave",
  chatgpt_user: "ChatGPT-User",
  chrome: "Chrome",
  claudebot: "ClaudeBot",
  chromium: "Chromium",
  diffbot: "Diffbot",
  duckduckbot: "DuckDuckBot",
  duckduckgo: "DuckDuckGo",
  edge: "Microsoft Edge",
  electron: "Electron",
  epiphany: "Epiphany",
  facebookexternalhit: "FacebookExternalHit",
  firefox: "Firefox",
  focus: "Focus",
  generic: "Generic",
  google_search: "Google Search",
  googlebot: "Googlebot",
  gptbot: "GPTBot",
  ie: "Internet Explorer",
  internetarchivecrawler: "InternetArchiveCrawler",
  k_meleon: "K-Meleon",
  librewolf: "LibreWolf",
  linespider: "Linespider",
  maxthon: "Maxthon",
  meta_externalads: "Meta-ExternalAds",
  meta_externalagent: "Meta-ExternalAgent",
  meta_externalfetcher: "Meta-ExternalFetcher",
  meta_webindexer: "Meta-WebIndexer",
  mz: "MZ Browser",
  naver: "NAVER Whale Browser",
  oai_searchbot: "OAI-SearchBot",
  omgilibot: "Omgilibot",
  opera: "Opera",
  opera_coast: "Opera Coast",
  pale_moon: "Pale Moon",
  perplexitybot: "PerplexityBot",
  perplexity_user: "Perplexity-User",
  phantomjs: "PhantomJS",
  pingdombot: "PingdomBot",
  puffin: "Puffin",
  qq: "QQ Browser",
  qqlite: "QQ Browser Lite",
  qupzilla: "QupZilla",
  roku: "Roku",
  safari: "Safari",
  sailfish: "Sailfish",
  samsung_internet: "Samsung Internet for Android",
  seamonkey: "SeaMonkey",
  slackbot: "SlackBot",
  sleipnir: "Sleipnir",
  sogou: "Sogou Browser",
  swing: "Swing",
  tizen: "Tizen",
  uc: "UC Browser",
  vivaldi: "Vivaldi",
  webos: "WebOS Browser",
  wechat: "WeChat",
  yahooslurp: "YahooSlurp",
  yandex: "Yandex Browser",
  yandexbot: "YandexBot",
  youbot: "YouBot"
}, W = {
  bot: "bot",
  desktop: "desktop",
  mobile: "mobile",
  tablet: "tablet",
  tv: "tv"
}, st = {
  Android: "Android",
  Bada: "Bada",
  BlackBerry: "BlackBerry",
  ChromeOS: "Chrome OS",
  HarmonyOS: "HarmonyOS",
  iOS: "iOS",
  Linux: "Linux",
  MacOS: "macOS",
  PlayStation4: "PlayStation 4",
  Roku: "Roku",
  Tizen: "Tizen",
  WebOS: "WebOS",
  Windows: "Windows",
  WindowsPhone: "Windows Phone"
}, Ws = {
  Blink: "Blink",
  EdgeHTML: "EdgeHTML",
  Gecko: "Gecko",
  Presto: "Presto",
  Trident: "Trident",
  WebKit: "WebKit"
};
class S {
  /**
   * Get first matched item for a string
   * @param {RegExp} regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getFirstMatch(e, s) {
    const n = s.match(e);
    return n && n.length > 0 && n[1] || "";
  }
  /**
   * Get second matched item for a string
   * @param regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getSecondMatch(e, s) {
    const n = s.match(e);
    return n && n.length > 1 && n[2] || "";
  }
  /**
   * Match a regexp and return a constant or undefined
   * @param {RegExp} regexp
   * @param {String} ua
   * @param {*} _const Any const that will be returned if regexp matches the string
   * @return {*}
   */
  static matchAndReturnConst(e, s, n) {
    if (e.test(s))
      return n;
  }
  static getWindowsVersionName(e) {
    switch (e) {
      case "NT":
        return "NT";
      case "XP":
        return "XP";
      case "NT 5.0":
        return "2000";
      case "NT 5.1":
        return "XP";
      case "NT 5.2":
        return "2003";
      case "NT 6.0":
        return "Vista";
      case "NT 6.1":
        return "7";
      case "NT 6.2":
        return "8";
      case "NT 6.3":
        return "8.1";
      case "NT 10.0":
        return "10";
      default:
        return;
    }
  }
  /**
   * Get macOS version name
   *    10.5 - Leopard
   *    10.6 - Snow Leopard
   *    10.7 - Lion
   *    10.8 - Mountain Lion
   *    10.9 - Mavericks
   *    10.10 - Yosemite
   *    10.11 - El Capitan
   *    10.12 - Sierra
   *    10.13 - High Sierra
   *    10.14 - Mojave
   *    10.15 - Catalina
   *    11 - Big Sur
   *    12 - Monterey
   *    13 - Ventura
   *    14 - Sonoma
   *    15 - Sequoia
   *
   * @example
   *   getMacOSVersionName("10.14") // 'Mojave'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getMacOSVersionName(e) {
    const s = e.split(".").splice(0, 2).map((a) => parseInt(a, 10) || 0);
    s.push(0);
    const n = s[0], r = s[1];
    if (n === 10)
      switch (r) {
        case 5:
          return "Leopard";
        case 6:
          return "Snow Leopard";
        case 7:
          return "Lion";
        case 8:
          return "Mountain Lion";
        case 9:
          return "Mavericks";
        case 10:
          return "Yosemite";
        case 11:
          return "El Capitan";
        case 12:
          return "Sierra";
        case 13:
          return "High Sierra";
        case 14:
          return "Mojave";
        case 15:
          return "Catalina";
        default:
          return;
      }
    switch (n) {
      case 11:
        return "Big Sur";
      case 12:
        return "Monterey";
      case 13:
        return "Ventura";
      case 14:
        return "Sonoma";
      case 15:
        return "Sequoia";
      default:
        return;
    }
  }
  /**
   * Get Android version name
   *    1.5 - Cupcake
   *    1.6 - Donut
   *    2.0 - Eclair
   *    2.1 - Eclair
   *    2.2 - Froyo
   *    2.x - Gingerbread
   *    3.x - Honeycomb
   *    4.0 - Ice Cream Sandwich
   *    4.1 - Jelly Bean
   *    4.4 - KitKat
   *    5.x - Lollipop
   *    6.x - Marshmallow
   *    7.x - Nougat
   *    8.x - Oreo
   *    9.x - Pie
   *
   * @example
   *   getAndroidVersionName("7.0") // 'Nougat'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getAndroidVersionName(e) {
    const s = e.split(".").splice(0, 2).map((n) => parseInt(n, 10) || 0);
    if (s.push(0), !(s[0] === 1 && s[1] < 5)) {
      if (s[0] === 1 && s[1] < 6) return "Cupcake";
      if (s[0] === 1 && s[1] >= 6) return "Donut";
      if (s[0] === 2 && s[1] < 2) return "Eclair";
      if (s[0] === 2 && s[1] === 2) return "Froyo";
      if (s[0] === 2 && s[1] > 2) return "Gingerbread";
      if (s[0] === 3) return "Honeycomb";
      if (s[0] === 4 && s[1] < 1) return "Ice Cream Sandwich";
      if (s[0] === 4 && s[1] < 4) return "Jelly Bean";
      if (s[0] === 4 && s[1] >= 4) return "KitKat";
      if (s[0] === 5) return "Lollipop";
      if (s[0] === 6) return "Marshmallow";
      if (s[0] === 7) return "Nougat";
      if (s[0] === 8) return "Oreo";
      if (s[0] === 9) return "Pie";
    }
  }
  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  static getVersionPrecision(e) {
    return e.split(".").length;
  }
  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
   *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
   *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
   *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
   *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
   *
   * @param {String} versionA versions versions to compare
   * @param {String} versionB versions versions to compare
   * @param {boolean} [isLoose] enable loose comparison
   * @return {Number} comparison result: -1 when versionA is lower,
   * 1 when versionA is bigger, 0 when both equal
   */
  /* eslint consistent-return: 1 */
  static compareVersions(e, s, n = !1) {
    const r = S.getVersionPrecision(e), a = S.getVersionPrecision(s);
    let i = Math.max(r, a), o = 0;
    const c = S.map([e, s], (d) => {
      const l = i - S.getVersionPrecision(d), u = d + new Array(l + 1).join(".0");
      return S.map(u.split("."), (h) => new Array(20 - h.length).join("0") + h).reverse();
    });
    for (n && (o = i - Math.min(r, a)), i -= 1; i >= o; ) {
      if (c[0][i] > c[1][i])
        return 1;
      if (c[0][i] === c[1][i]) {
        if (i === o)
          return 0;
        i -= 1;
      } else if (c[0][i] < c[1][i])
        return -1;
    }
  }
  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  static map(e, s) {
    const n = [];
    let r;
    if (Array.prototype.map)
      return Array.prototype.map.call(e, s);
    for (r = 0; r < e.length; r += 1)
      n.push(s(e[r]));
    return n;
  }
  /**
   * Array::find polyfill
   *
   * @param  {Array} arr
   * @param  {Function} predicate
   * @return {Array}
   */
  static find(e, s) {
    let n, r;
    if (Array.prototype.find)
      return Array.prototype.find.call(e, s);
    for (n = 0, r = e.length; n < r; n += 1) {
      const a = e[n];
      if (s(a, n))
        return a;
    }
  }
  /**
   * Object::assign polyfill
   *
   * @param  {Object} obj
   * @param  {Object} ...objs
   * @return {Object}
   */
  static assign(e, ...s) {
    const n = e;
    let r, a;
    if (Object.assign)
      return Object.assign(e, ...s);
    for (r = 0, a = s.length; r < a; r += 1) {
      const i = s[r];
      typeof i == "object" && i !== null && Object.keys(i).forEach((c) => {
        n[c] = i[c];
      });
    }
    return e;
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('Microsoft Edge') // edge
   *
   * @param  {string} browserName
   * @return {string}
   */
  static getBrowserAlias(e) {
    return tT[e];
  }
  /**
   * Get browser name for a short version/alias
   *
   * @example
   *   getBrowserTypeByAlias('edge') // Microsoft Edge
   *
   * @param  {string} browserAlias
   * @return {string}
   */
  static getBrowserTypeByAlias(e) {
    return Sg[e] || "";
  }
}
const J = /version\/(\d+(\.?_?\d+)+)/i, sT = [
  /* GPTBot */
  {
    test: [/gptbot/i],
    describe(t) {
      const e = {
        name: "GPTBot"
      }, s = S.getFirstMatch(/gptbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* ChatGPT-User */
  {
    test: [/chatgpt-user/i],
    describe(t) {
      const e = {
        name: "ChatGPT-User"
      }, s = S.getFirstMatch(/chatgpt-user\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* OAI-SearchBot */
  {
    test: [/oai-searchbot/i],
    describe(t) {
      const e = {
        name: "OAI-SearchBot"
      }, s = S.getFirstMatch(/oai-searchbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* ClaudeBot */
  {
    test: [/claudebot/i, /claude-web/i, /claude-user/i, /claude-searchbot/i],
    describe(t) {
      const e = {
        name: "ClaudeBot"
      }, s = S.getFirstMatch(/(?:claudebot|claude-web|claude-user|claude-searchbot)\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Omgilibot */
  {
    test: [/omgilibot/i, /webzio-extended/i],
    describe(t) {
      const e = {
        name: "Omgilibot"
      }, s = S.getFirstMatch(/(?:omgilibot|webzio-extended)\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Diffbot */
  {
    test: [/diffbot/i],
    describe(t) {
      const e = {
        name: "Diffbot"
      }, s = S.getFirstMatch(/diffbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* PerplexityBot */
  {
    test: [/perplexitybot/i],
    describe(t) {
      const e = {
        name: "PerplexityBot"
      }, s = S.getFirstMatch(/perplexitybot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Perplexity-User */
  {
    test: [/perplexity-user/i],
    describe(t) {
      const e = {
        name: "Perplexity-User"
      }, s = S.getFirstMatch(/perplexity-user\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* YouBot */
  {
    test: [/youbot/i],
    describe(t) {
      const e = {
        name: "YouBot"
      }, s = S.getFirstMatch(/youbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Meta-WebIndexer */
  {
    test: [/meta-webindexer/i],
    describe(t) {
      const e = {
        name: "Meta-WebIndexer"
      }, s = S.getFirstMatch(/meta-webindexer\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Meta-ExternalAds */
  {
    test: [/meta-externalads/i],
    describe(t) {
      const e = {
        name: "Meta-ExternalAds"
      }, s = S.getFirstMatch(/meta-externalads\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Meta-ExternalAgent */
  {
    test: [/meta-externalagent/i],
    describe(t) {
      const e = {
        name: "Meta-ExternalAgent"
      }, s = S.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Meta-ExternalFetcher */
  {
    test: [/meta-externalfetcher/i],
    describe(t) {
      const e = {
        name: "Meta-ExternalFetcher"
      }, s = S.getFirstMatch(/meta-externalfetcher\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe(t) {
      const e = {
        name: "Googlebot"
      }, s = S.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Linespider */
  {
    test: [/linespider/i],
    describe(t) {
      const e = {
        name: "Linespider"
      }, s = S.getFirstMatch(/(?:linespider)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* AmazonBot */
  {
    test: [/amazonbot/i],
    describe(t) {
      const e = {
        name: "AmazonBot"
      }, s = S.getFirstMatch(/amazonbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* BingCrawler */
  {
    test: [/bingbot/i],
    describe(t) {
      const e = {
        name: "BingCrawler"
      }, s = S.getFirstMatch(/bingbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* BaiduSpider */
  {
    test: [/baiduspider/i],
    describe(t) {
      const e = {
        name: "BaiduSpider"
      }, s = S.getFirstMatch(/baiduspider\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* DuckDuckBot */
  {
    test: [/duckduckbot/i],
    describe(t) {
      const e = {
        name: "DuckDuckBot"
      }, s = S.getFirstMatch(/duckduckbot\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* InternetArchiveCrawler */
  {
    test: [/ia_archiver/i],
    describe(t) {
      const e = {
        name: "InternetArchiveCrawler"
      }, s = S.getFirstMatch(/ia_archiver\/(\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* FacebookExternalHit */
  {
    test: [/facebookexternalhit/i, /facebookcatalog/i],
    describe() {
      return {
        name: "FacebookExternalHit"
      };
    }
  },
  /* SlackBot */
  {
    test: [/slackbot/i, /slack-imgProxy/i],
    describe(t) {
      const e = {
        name: "SlackBot"
      }, s = S.getFirstMatch(/(?:slackbot|slack-imgproxy)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* YahooSlurp */
  {
    test: [/yahoo!?[\s/]*slurp/i],
    describe() {
      return {
        name: "YahooSlurp"
      };
    }
  },
  /* YandexBot */
  {
    test: [/yandexbot/i, /yandexmobilebot/i],
    describe() {
      return {
        name: "YandexBot"
      };
    }
  },
  /* PingdomBot */
  {
    test: [/pingdom/i],
    describe() {
      return {
        name: "PingdomBot"
      };
    }
  },
  /* Opera < 13.0 */
  {
    test: [/opera/i],
    describe(t) {
      const e = {
        name: "Opera"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* Opera > 13.0 */
  {
    test: [/opr\/|opios/i],
    describe(t) {
      const e = {
        name: "Opera"
      }, s = S.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/SamsungBrowser/i],
    describe(t) {
      const e = {
        name: "Samsung Internet for Android"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/Whale/i],
    describe(t) {
      const e = {
        name: "NAVER Whale Browser"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/PaleMoon/i],
    describe(t) {
      const e = {
        name: "Pale Moon"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:PaleMoon)[\s/](\d+(?:\.\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/MZBrowser/i],
    describe(t) {
      const e = {
        name: "MZ Browser"
      }, s = S.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/focus/i],
    describe(t) {
      const e = {
        name: "Focus"
      }, s = S.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/swing/i],
    describe(t) {
      const e = {
        name: "Swing"
      }, s = S.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/coast/i],
    describe(t) {
      const e = {
        name: "Opera Coast"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe(t) {
      const e = {
        name: "Opera Touch"
      }, s = S.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/yabrowser/i],
    describe(t) {
      const e = {
        name: "Yandex Browser"
      }, s = S.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/ucbrowser/i],
    describe(t) {
      const e = {
        name: "UC Browser"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/Maxthon|mxios/i],
    describe(t) {
      const e = {
        name: "Maxthon"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/epiphany/i],
    describe(t) {
      const e = {
        name: "Epiphany"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/puffin/i],
    describe(t) {
      const e = {
        name: "Puffin"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/sleipnir/i],
    describe(t) {
      const e = {
        name: "Sleipnir"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/k-meleon/i],
    describe(t) {
      const e = {
        name: "K-Meleon"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/micromessenger/i],
    describe(t) {
      const e = {
        name: "WeChat"
      }, s = S.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/qqbrowser/i],
    describe(t) {
      const e = {
        name: /qqbrowserlite/i.test(t) ? "QQ Browser Lite" : "QQ Browser"
      }, s = S.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/msie|trident/i],
    describe(t) {
      const e = {
        name: "Internet Explorer"
      }, s = S.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/\sedg\//i],
    describe(t) {
      const e = {
        name: "Microsoft Edge"
      }, s = S.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/edg([ea]|ios)/i],
    describe(t) {
      const e = {
        name: "Microsoft Edge"
      }, s = S.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/vivaldi/i],
    describe(t) {
      const e = {
        name: "Vivaldi"
      }, s = S.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/seamonkey/i],
    describe(t) {
      const e = {
        name: "SeaMonkey"
      }, s = S.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/sailfish/i],
    describe(t) {
      const e = {
        name: "Sailfish"
      }, s = S.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/silk/i],
    describe(t) {
      const e = {
        name: "Amazon Silk"
      }, s = S.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/phantom/i],
    describe(t) {
      const e = {
        name: "PhantomJS"
      }, s = S.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/slimerjs/i],
    describe(t) {
      const e = {
        name: "SlimerJS"
      }, s = S.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(t) {
      const e = {
        name: "BlackBerry"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/(web|hpw)[o0]s/i],
    describe(t) {
      const e = {
        name: "WebOS Browser"
      }, s = S.getFirstMatch(J, t) || S.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/bada/i],
    describe(t) {
      const e = {
        name: "Bada"
      }, s = S.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/tizen/i],
    describe(t) {
      const e = {
        name: "Tizen"
      }, s = S.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/qupzilla/i],
    describe(t) {
      const e = {
        name: "QupZilla"
      }, s = S.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/librewolf/i],
    describe(t) {
      const e = {
        name: "LibreWolf"
      }, s = S.getFirstMatch(/(?:librewolf)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/firefox|iceweasel|fxios/i],
    describe(t) {
      const e = {
        name: "Firefox"
      }, s = S.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/electron/i],
    describe(t) {
      const e = {
        name: "Electron"
      }, s = S.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/sogoumobilebrowser/i, /metasr/i, /se 2\.[x]/i],
    describe(t) {
      const e = {
        name: "Sogou Browser"
      }, s = S.getFirstMatch(/(?:sogoumobilebrowser)[\s/](\d+(\.?_?\d+)+)/i, t), n = S.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, t), r = S.getFirstMatch(/se ([\d.]+)x/i, t), a = s || n || r;
      return a && (e.version = a), e;
    }
  },
  {
    test: [/MiuiBrowser/i],
    describe(t) {
      const e = {
        name: "Miui"
      }, s = S.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* DuckDuckGo Browser */
  {
    test(t) {
      return t.hasBrand("DuckDuckGo") ? !0 : t.test(/\sDdg\/[\d.]+$/i);
    },
    describe(t, e) {
      const s = {
        name: "DuckDuckGo"
      };
      if (e) {
        const r = e.getBrandVersion("DuckDuckGo");
        if (r)
          return s.version = r, s;
      }
      const n = S.getFirstMatch(/\sDdg\/([\d.]+)$/i, t);
      return n && (s.version = n), s;
    }
  },
  /* Brave Browser */
  {
    test(t) {
      return t.hasBrand("Brave");
    },
    describe(t, e) {
      const s = {
        name: "Brave"
      };
      if (e) {
        const n = e.getBrandVersion("Brave");
        if (n)
          return s.version = n, s;
      }
      return s;
    }
  },
  {
    test: [/chromium/i],
    describe(t) {
      const e = {
        name: "Chromium"
      }, s = S.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, t) || S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/chrome|crios|crmo/i],
    describe(t) {
      const e = {
        name: "Chrome"
      }, s = S.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  {
    test: [/GSA/i],
    describe(t) {
      const e = {
        name: "Google Search"
      }, s = S.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* Android Browser */
  {
    test(t) {
      const e = !t.test(/like android/i), s = t.test(/android/i);
      return e && s;
    },
    describe(t) {
      const e = {
        name: "Android Browser"
      }, s = S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* PlayStation 4 */
  {
    test: [/playstation 4/i],
    describe(t) {
      const e = {
        name: "PlayStation 4"
      }, s = S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Safari */
  {
    test: [/safari|applewebkit/i],
    describe(t) {
      const e = {
        name: "Safari"
      }, s = S.getFirstMatch(J, t);
      return s && (e.version = s), e;
    }
  },
  /* Something else */
  {
    test: [/.*/i],
    describe(t) {
      const e = /^(.*)\/(.*) /, s = /^(.*)\/(.*)[ \t]\((.*)/, r = t.search("\\(") !== -1 ? s : e;
      return {
        name: S.getFirstMatch(r, t),
        version: S.getSecondMatch(r, t)
      };
    }
  }
], nT = [
  /* Roku */
  {
    test: [/Roku\/DVP/],
    describe(t) {
      const e = S.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, t);
      return {
        name: st.Roku,
        version: e
      };
    }
  },
  /* Windows Phone */
  {
    test: [/windows phone/i],
    describe(t) {
      const e = S.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, t);
      return {
        name: st.WindowsPhone,
        version: e
      };
    }
  },
  /* Windows */
  {
    test: [/windows /i],
    describe(t) {
      const e = S.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, t), s = S.getWindowsVersionName(e);
      return {
        name: st.Windows,
        version: e,
        versionName: s
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe(t) {
      const e = {
        name: st.iOS
      }, s = S.getSecondMatch(/(Version\/)(\d[\d.]+)/, t);
      return s && (e.version = s), e;
    }
  },
  /* macOS */
  {
    test: [/macintosh/i],
    describe(t) {
      const e = S.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, t).replace(/[_\s]/g, "."), s = S.getMacOSVersionName(e), n = {
        name: st.MacOS,
        version: e
      };
      return s && (n.versionName = s), n;
    }
  },
  /* iOS */
  {
    test: [/(ipod|iphone|ipad)/i],
    describe(t) {
      const e = S.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, t).replace(/[_\s]/g, ".");
      return {
        name: st.iOS,
        version: e
      };
    }
  },
  /* HarmonyOS */
  {
    test: [/OpenHarmony/i],
    describe(t) {
      const e = S.getFirstMatch(/OpenHarmony\s+(\d+(\.\d+)*)/i, t);
      return {
        name: st.HarmonyOS,
        version: e
      };
    }
  },
  /* Android */
  {
    test(t) {
      const e = !t.test(/like android/i), s = t.test(/android/i);
      return e && s;
    },
    describe(t) {
      const e = S.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, t), s = S.getAndroidVersionName(e), n = {
        name: st.Android,
        version: e
      };
      return s && (n.versionName = s), n;
    }
  },
  /* WebOS */
  {
    test: [/(web|hpw)[o0]s/i],
    describe(t) {
      const e = S.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, t), s = {
        name: st.WebOS
      };
      return e && e.length && (s.version = e), s;
    }
  },
  /* BlackBerry */
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(t) {
      const e = S.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, t) || S.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, t) || S.getFirstMatch(/\bbb(\d+)/i, t);
      return {
        name: st.BlackBerry,
        version: e
      };
    }
  },
  /* Bada */
  {
    test: [/bada/i],
    describe(t) {
      const e = S.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, t);
      return {
        name: st.Bada,
        version: e
      };
    }
  },
  /* Tizen */
  {
    test: [/tizen/i],
    describe(t) {
      const e = S.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, t);
      return {
        name: st.Tizen,
        version: e
      };
    }
  },
  /* Linux */
  {
    test: [/linux/i],
    describe() {
      return {
        name: st.Linux
      };
    }
  },
  /* Chrome OS */
  {
    test: [/CrOS/],
    describe() {
      return {
        name: st.ChromeOS
      };
    }
  },
  /* Playstation 4 */
  {
    test: [/PlayStation 4/],
    describe(t) {
      const e = S.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, t);
      return {
        name: st.PlayStation4,
        version: e
      };
    }
  }
], rT = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Google"
      };
    }
  },
  /* LineSpider */
  {
    test: [/linespider/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Line"
      };
    }
  },
  /* AmazonBot */
  {
    test: [/amazonbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Amazon"
      };
    }
  },
  /* GPTBot */
  {
    test: [/gptbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "OpenAI"
      };
    }
  },
  /* ChatGPT-User */
  {
    test: [/chatgpt-user/i],
    describe() {
      return {
        type: W.bot,
        vendor: "OpenAI"
      };
    }
  },
  /* OAI-SearchBot */
  {
    test: [/oai-searchbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "OpenAI"
      };
    }
  },
  /* Baidu */
  {
    test: [/baiduspider/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Baidu"
      };
    }
  },
  /* Bingbot */
  {
    test: [/bingbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Bing"
      };
    }
  },
  /* DuckDuckBot */
  {
    test: [/duckduckbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "DuckDuckGo"
      };
    }
  },
  /* ClaudeBot */
  {
    test: [/claudebot/i, /claude-web/i, /claude-user/i, /claude-searchbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Anthropic"
      };
    }
  },
  /* Omgilibot */
  {
    test: [/omgilibot/i, /webzio-extended/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Webz.io"
      };
    }
  },
  /* Diffbot */
  {
    test: [/diffbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Diffbot"
      };
    }
  },
  /* PerplexityBot */
  {
    test: [/perplexitybot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Perplexity AI"
      };
    }
  },
  /* Perplexity-User */
  {
    test: [/perplexity-user/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Perplexity AI"
      };
    }
  },
  /* YouBot */
  {
    test: [/youbot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "You.com"
      };
    }
  },
  /* Internet Archive Crawler */
  {
    test: [/ia_archiver/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Internet Archive"
      };
    }
  },
  /* Meta-WebIndexer */
  {
    test: [/meta-webindexer/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Meta"
      };
    }
  },
  /* Meta-ExternalAds */
  {
    test: [/meta-externalads/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Meta"
      };
    }
  },
  /* Meta-ExternalAgent */
  {
    test: [/meta-externalagent/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Meta"
      };
    }
  },
  /* Meta-ExternalFetcher */
  {
    test: [/meta-externalfetcher/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Meta"
      };
    }
  },
  /* Meta Web Crawler */
  {
    test: [/facebookexternalhit/i, /facebookcatalog/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Meta"
      };
    }
  },
  /* SlackBot */
  {
    test: [/slackbot/i, /slack-imgProxy/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Slack"
      };
    }
  },
  /* Yahoo! Slurp */
  {
    test: [/yahoo/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Yahoo"
      };
    }
  },
  /* Yandex */
  {
    test: [/yandexbot/i, /yandexmobilebot/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Yandex"
      };
    }
  },
  /* Pingdom */
  {
    test: [/pingdom/i],
    describe() {
      return {
        type: W.bot,
        vendor: "Pingdom"
      };
    }
  },
  /* Huawei */
  {
    test: [/huawei/i],
    describe(t) {
      const e = S.getFirstMatch(/(can-l01)/i, t) && "Nova", s = {
        type: W.mobile,
        vendor: "Huawei"
      };
      return e && (s.model = e), s;
    }
  },
  /* Nexus Tablet */
  {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe() {
      return {
        type: W.tablet,
        vendor: "Nexus"
      };
    }
  },
  /* iPad */
  {
    test: [/ipad/i],
    describe() {
      return {
        type: W.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe() {
      return {
        type: W.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Amazon Kindle Fire */
  {
    test: [/kftt build/i],
    describe() {
      return {
        type: W.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  },
  /* Another Amazon Tablet with Silk */
  {
    test: [/silk/i],
    describe() {
      return {
        type: W.tablet,
        vendor: "Amazon"
      };
    }
  },
  /* Tablet */
  {
    test: [/tablet(?! pc)/i],
    describe() {
      return {
        type: W.tablet
      };
    }
  },
  /* iPod/iPhone */
  {
    test(t) {
      const e = t.test(/ipod|iphone/i), s = t.test(/like (ipod|iphone)/i);
      return e && !s;
    },
    describe(t) {
      const e = S.getFirstMatch(/(ipod|iphone)/i, t);
      return {
        type: W.mobile,
        vendor: "Apple",
        model: e
      };
    }
  },
  /* Nexus Mobile */
  {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe() {
      return {
        type: W.mobile,
        vendor: "Nexus"
      };
    }
  },
  /* Nokia */
  {
    test: [/Nokia/i],
    describe(t) {
      const e = S.getFirstMatch(/Nokia\s+([0-9]+(\.[0-9]+)?)/i, t), s = {
        type: W.mobile,
        vendor: "Nokia"
      };
      return e && (s.model = e), s;
    }
  },
  /* Mobile */
  {
    test: [/[^-]mobi/i],
    describe() {
      return {
        type: W.mobile
      };
    }
  },
  /* BlackBerry */
  {
    test(t) {
      return t.getBrowserName(!0) === "blackberry";
    },
    describe() {
      return {
        type: W.mobile,
        vendor: "BlackBerry"
      };
    }
  },
  /* Bada */
  {
    test(t) {
      return t.getBrowserName(!0) === "bada";
    },
    describe() {
      return {
        type: W.mobile
      };
    }
  },
  /* Windows Phone */
  {
    test(t) {
      return t.getBrowserName() === "windows phone";
    },
    describe() {
      return {
        type: W.mobile,
        vendor: "Microsoft"
      };
    }
  },
  /* Android Tablet */
  {
    test(t) {
      const e = Number(String(t.getOSVersion()).split(".")[0]);
      return t.getOSName(!0) === "android" && e >= 3;
    },
    describe() {
      return {
        type: W.tablet
      };
    }
  },
  /* Android Mobile */
  {
    test(t) {
      return t.getOSName(!0) === "android";
    },
    describe() {
      return {
        type: W.mobile
      };
    }
  },
  /* Smart TV */
  {
    test: [/smart-?tv|smarttv/i],
    describe() {
      return {
        type: W.tv
      };
    }
  },
  /* NetCast (LG Smart TV) */
  {
    test: [/netcast/i],
    describe() {
      return {
        type: W.tv
      };
    }
  },
  /* desktop */
  {
    test(t) {
      return t.getOSName(!0) === "macos";
    },
    describe() {
      return {
        type: W.desktop,
        vendor: "Apple"
      };
    }
  },
  /* Windows */
  {
    test(t) {
      return t.getOSName(!0) === "windows";
    },
    describe() {
      return {
        type: W.desktop
      };
    }
  },
  /* Linux */
  {
    test(t) {
      return t.getOSName(!0) === "linux";
    },
    describe() {
      return {
        type: W.desktop
      };
    }
  },
  /* PlayStation 4 */
  {
    test(t) {
      return t.getOSName(!0) === "playstation 4";
    },
    describe() {
      return {
        type: W.tv
      };
    }
  },
  /* Roku */
  {
    test(t) {
      return t.getOSName(!0) === "roku";
    },
    describe() {
      return {
        type: W.tv
      };
    }
  }
], aT = [
  /* EdgeHTML */
  {
    test(t) {
      return t.getBrowserName(!0) === "microsoft edge";
    },
    describe(t) {
      if (/\sedg\//i.test(t))
        return {
          name: Ws.Blink
        };
      const s = S.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, t);
      return {
        name: Ws.EdgeHTML,
        version: s
      };
    }
  },
  /* Trident */
  {
    test: [/trident/i],
    describe(t) {
      const e = {
        name: Ws.Trident
      }, s = S.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* Presto */
  {
    test(t) {
      return t.test(/presto/i);
    },
    describe(t) {
      const e = {
        name: Ws.Presto
      }, s = S.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* Gecko */
  {
    test(t) {
      const e = t.test(/gecko/i), s = t.test(/like gecko/i);
      return e && !s;
    },
    describe(t) {
      const e = {
        name: Ws.Gecko
      }, s = S.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  },
  /* Blink */
  {
    test: [/(apple)?webkit\/537\.36/i],
    describe() {
      return {
        name: Ws.Blink
      };
    }
  },
  /* WebKit */
  {
    test: [/(apple)?webkit/i],
    describe(t) {
      const e = {
        name: Ws.WebKit
      }, s = S.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, t);
      return s && (e.version = s), e;
    }
  }
];
class lf {
  /**
   * Create instance of Parser
   *
   * @param {String} UA User-Agent string
   * @param {Boolean|ClientHints} [skipParsingOrHints=false] Either a boolean to skip parsing,
   * or a ClientHints object containing User-Agent Client Hints data
   * @param {ClientHints} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
   *
   * @throw {Error} in case of empty UA String
   *
   * @constructor
   */
  constructor(e, s = !1, n = null) {
    if (e == null || e === "")
      throw new Error("UserAgent parameter can't be empty");
    this._ua = e;
    let r = !1;
    typeof s == "boolean" ? (r = s, this._hints = n) : s != null && typeof s == "object" ? this._hints = s : this._hints = null, this.parsedResult = {}, r !== !0 && this.parse();
  }
  /**
   * Get Client Hints data
   * @return {ClientHints|null}
   *
   * @public
   * @example
   * const parser = Bowser.getParser(UA, clientHints);
   * const hints = parser.getHints();
   * console.log(hints.platform); // 'Windows'
   * console.log(hints.mobile); // false
   */
  getHints() {
    return this._hints;
  }
  /**
   * Check if a brand exists in Client Hints brands array
   * @param {string} brandName The brand name to check for
   * @return {boolean}
   *
   * @public
   * @example
   * const parser = Bowser.getParser(UA, clientHints);
   * if (parser.hasBrand('Google Chrome')) {
   *   console.log('Chrome detected!');
   * }
   */
  hasBrand(e) {
    if (!this._hints || !Array.isArray(this._hints.brands))
      return !1;
    const s = e.toLowerCase();
    return this._hints.brands.some(
      (n) => n.brand && n.brand.toLowerCase() === s
    );
  }
  /**
   * Get brand version from Client Hints
   * @param {string} brandName The brand name to get version for
   * @return {string|undefined}
   *
   * @public
   * @example
   * const parser = Bowser.getParser(UA, clientHints);
   * const version = parser.getBrandVersion('Google Chrome');
   * console.log(version); // '131'
   */
  getBrandVersion(e) {
    if (!this._hints || !Array.isArray(this._hints.brands))
      return;
    const s = e.toLowerCase(), n = this._hints.brands.find(
      (r) => r.brand && r.brand.toLowerCase() === s
    );
    return n ? n.version : void 0;
  }
  /**
   * Get UserAgent string of current Parser instance
   * @return {String} User-Agent String of the current <Parser> object
   *
   * @public
   */
  getUA() {
    return this._ua;
  }
  /**
   * Test a UA string for a regexp
   * @param {RegExp} regex
   * @return {Boolean}
   */
  test(e) {
    return e.test(this._ua);
  }
  /**
   * Get parsed browser object
   * @return {Object}
   */
  parseBrowser() {
    this.parsedResult.browser = {};
    const e = S.find(sT, (s) => {
      if (typeof s.test == "function")
        return s.test(this);
      if (Array.isArray(s.test))
        return s.test.some((n) => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.browser = e.describe(this.getUA(), this)), this.parsedResult.browser;
  }
  /**
   * Get parsed browser object
   * @return {Object}
   *
   * @public
   */
  getBrowser() {
    return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser();
  }
  /**
   * Get browser's name
   * @return {String} Browser's name or an empty string
   *
   * @public
   */
  getBrowserName(e) {
    return e ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || "";
  }
  /**
   * Get browser's version
   * @return {String} version of browser
   *
   * @public
   */
  getBrowserVersion() {
    return this.getBrowser().version;
  }
  /**
   * Get OS
   * @return {Object}
   *
   * @example
   * this.getOS();
   * {
   *   name: 'macOS',
   *   version: '10.11.12'
   * }
   */
  getOS() {
    return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
  }
  /**
   * Parse OS and save it to this.parsedResult.os
   * @return {*|{}}
   */
  parseOS() {
    this.parsedResult.os = {};
    const e = S.find(nT, (s) => {
      if (typeof s.test == "function")
        return s.test(this);
      if (Array.isArray(s.test))
        return s.test.some((n) => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.os = e.describe(this.getUA())), this.parsedResult.os;
  }
  /**
   * Get OS name
   * @param {Boolean} [toLowerCase] return lower-cased value
   * @return {String} name of the OS — macOS, Windows, Linux, etc.
   */
  getOSName(e) {
    const { name: s } = this.getOS();
    return e ? String(s).toLowerCase() || "" : s || "";
  }
  /**
   * Get OS version
   * @return {String} full version with dots ('10.11.12', '5.6', etc)
   */
  getOSVersion() {
    return this.getOS().version;
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  getPlatform() {
    return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform();
  }
  /**
   * Get platform name
   * @param {Boolean} [toLowerCase=false]
   * @return {*}
   */
  getPlatformType(e = !1) {
    const { type: s } = this.getPlatform();
    return e ? String(s).toLowerCase() || "" : s || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parsePlatform() {
    this.parsedResult.platform = {};
    const e = S.find(rT, (s) => {
      if (typeof s.test == "function")
        return s.test(this);
      if (Array.isArray(s.test))
        return s.test.some((n) => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.platform = e.describe(this.getUA())), this.parsedResult.platform;
  }
  /**
   * Get parsed engine
   * @return {{}}
   */
  getEngine() {
    return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
  }
  /**
   * Get engines's name
   * @return {String} Engines's name or an empty string
   *
   * @public
   */
  getEngineName(e) {
    return e ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parseEngine() {
    this.parsedResult.engine = {};
    const e = S.find(aT, (s) => {
      if (typeof s.test == "function")
        return s.test(this);
      if (Array.isArray(s.test))
        return s.test.some((n) => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.engine = e.describe(this.getUA())), this.parsedResult.engine;
  }
  /**
   * Parse full information about the browser
   * @returns {Parser}
   */
  parse() {
    return this.parseBrowser(), this.parseOS(), this.parsePlatform(), this.parseEngine(), this;
  }
  /**
   * Get parsed result
   * @return {ParsedResult}
   */
  getResult() {
    return S.assign({}, this.parsedResult);
  }
  /**
   * Check if parsed browser matches certain conditions
   *
   * @param {Object} checkTree It's one or two layered object,
   * which can include a platform or an OS on the first layer
   * and should have browsers specs on the bottom-laying layer
   *
   * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
   * Returns `undefined` when the browser is no described in the checkTree object.
   *
   * @example
   * const browser = Bowser.getParser(window.navigator.userAgent);
   * if (browser.satisfies({chrome: '>118.01.1322' }))
   * // or with os
   * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
   * // or with platforms
   * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
   */
  satisfies(e) {
    const s = {};
    let n = 0;
    const r = {};
    let a = 0;
    if (Object.keys(e).forEach((o) => {
      const c = e[o];
      typeof c == "string" ? (r[o] = c, a += 1) : typeof c == "object" && (s[o] = c, n += 1);
    }), n > 0) {
      const o = Object.keys(s), c = S.find(o, (l) => this.isOS(l));
      if (c) {
        const l = this.satisfies(s[c]);
        if (l !== void 0)
          return l;
      }
      const d = S.find(
        o,
        (l) => this.isPlatform(l)
      );
      if (d) {
        const l = this.satisfies(s[d]);
        if (l !== void 0)
          return l;
      }
    }
    if (a > 0) {
      const o = Object.keys(r), c = S.find(o, (d) => this.isBrowser(d, !0));
      if (c !== void 0)
        return this.compareVersion(r[c]);
    }
  }
  /**
   * Check if the browser name equals the passed string
   * @param {string} browserName The string to compare with the browser name
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {boolean}
   */
  isBrowser(e, s = !1) {
    const n = this.getBrowserName().toLowerCase();
    let r = e.toLowerCase();
    const a = S.getBrowserTypeByAlias(r);
    return s && a && (r = a.toLowerCase()), r === n;
  }
  compareVersion(e) {
    let s = [0], n = e, r = !1;
    const a = this.getBrowserVersion();
    if (typeof a == "string")
      return e[0] === ">" || e[0] === "<" ? (n = e.substr(1), e[1] === "=" ? (r = !0, n = e.substr(2)) : s = [], e[0] === ">" ? s.push(1) : s.push(-1)) : e[0] === "=" ? n = e.substr(1) : e[0] === "~" && (r = !0, n = e.substr(1)), s.indexOf(
        S.compareVersions(a, n, r)
      ) > -1;
  }
  /**
   * Check if the OS name equals the passed string
   * @param {string} osName The string to compare with the OS name
   * @returns {boolean}
   */
  isOS(e) {
    return this.getOSName(!0) === String(e).toLowerCase();
  }
  /**
   * Check if the platform type equals the passed string
   * @param {string} platformType The string to compare with the platform type
   * @returns {boolean}
   */
  isPlatform(e) {
    return this.getPlatformType(!0) === String(e).toLowerCase();
  }
  /**
   * Check if the engine name equals the passed string
   * @param {string} engineName The string to compare with the engine name
   * @returns {boolean}
   */
  isEngine(e) {
    return this.getEngineName(!0) === String(e).toLowerCase();
  }
  /**
   * Is anything? Check if the browser is called "anything",
   * the OS called "anything" or the platform called "anything"
   * @param {String} anything
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {Boolean}
   */
  is(e, s = !1) {
    return this.isBrowser(e, s) || this.isOS(e) || this.isPlatform(e);
  }
  /**
   * Check if any of the given values satisfies this.is(anything)
   * @param {String[]} anythings
   * @returns {Boolean}
   */
  some(e = []) {
    return e.some((s) => this.is(s));
  }
}
/*!
 * Bowser - a browser detector
 * https://github.com/bowser-js/bowser
 * MIT License | (c) Dustin Diaz 2012-2015
 * MIT License | (c) Denis Demchenko 2015-2019
 */
class iT {
  /**
   * Creates a {@link Parser} instance
   *
   * @param {String} UA UserAgent string
   * @param {Boolean|Object} [skipParsingOrHints=false] Either a boolean to skip parsing,
   * or a ClientHints object (navigator.userAgentData)
   * @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
   * @returns {Parser}
   * @throws {Error} when UA is not a String
   *
   * @example
   * const parser = Bowser.getParser(window.navigator.userAgent);
   * const result = parser.getResult();
   *
   * @example
   * // With User-Agent Client Hints
   * const parser = Bowser.getParser(
   *   window.navigator.userAgent,
   *   window.navigator.userAgentData
   * );
   */
  static getParser(e, s = !1, n = null) {
    if (typeof e != "string")
      throw new Error("UserAgent should be a string");
    return new lf(e, s, n);
  }
  /**
   * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
   *
   * @param {String} UA UserAgent string
   * @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
   * @return {ParsedResult}
   *
   * @example
   * const result = Bowser.parse(window.navigator.userAgent);
   *
   * @example
   * // With User-Agent Client Hints
   * const result = Bowser.parse(
   *   window.navigator.userAgent,
   *   window.navigator.userAgentData
   * );
   */
  static parse(e, s = null) {
    return new lf(e, s).getResult();
  }
  static get BROWSER_MAP() {
    return Sg;
  }
  static get ENGINE_MAP() {
    return Ws;
  }
  static get OS_MAP() {
    return st;
  }
  static get PLATFORMS_MAP() {
    return W;
  }
}
const oT = ({ serviceId: t, clientVersion: e }) => async (s) => {
  var i, o, c, d, l, u;
  const n = typeof window < "u" && ((i = window == null ? void 0 : window.navigator) != null && i.userAgent) ? iT.parse(window.navigator.userAgent) : void 0, r = [
    ["aws-sdk-js", e],
    ["ua", "2.1"],
    [`os/${((o = n == null ? void 0 : n.os) == null ? void 0 : o.name) || "other"}`, (c = n == null ? void 0 : n.os) == null ? void 0 : c.version],
    ["lang/js"],
    ["md/browser", `${((d = n == null ? void 0 : n.browser) == null ? void 0 : d.name) ?? "unknown"}_${((l = n == null ? void 0 : n.browser) == null ? void 0 : l.version) ?? "unknown"}`]
  ];
  t && r.push([`api/${t}`, e]);
  const a = await ((u = s == null ? void 0 : s.userAgentAppId) == null ? void 0 : u.call(s));
  return a && r.push([`app/${a}`]), r;
};
function uf(t, e) {
  return new Request(t, e);
}
function cT(t = 0) {
  return new Promise((e, s) => {
    t && setTimeout(() => {
      const n = new Error(`Request did not complete within ${t} ms`);
      n.name = "TimeoutError", s(n);
    }, t);
  });
}
const Nc = {
  supported: void 0
};
class _l {
  constructor(e) {
    p(this, "config");
    p(this, "configProvider");
    typeof e == "function" ? this.configProvider = e().then((s) => s || {}) : (this.config = e ?? {}, this.configProvider = Promise.resolve(this.config)), Nc.supported === void 0 && (Nc.supported = typeof Request < "u" && "keepalive" in uf("https://[::1]"));
  }
  static create(e) {
    return typeof (e == null ? void 0 : e.handle) == "function" ? e : new _l(e);
  }
  destroy() {
  }
  async handle(e, { abortSignal: s, requestTimeout: n } = {}) {
    var D;
    this.config || (this.config = await this.configProvider);
    const r = n ?? this.config.requestTimeout, a = this.config.keepAlive === !0, i = this.config.credentials, o = this.config.customFetch ?? fetch;
    if (s != null && s.aborted) {
      const M = hf(s);
      return Promise.reject(M);
    }
    let c = e.path;
    const d = $p(e.query || {});
    d && (c += `?${d}`), e.fragment && (c += `#${e.fragment}`);
    let l = "";
    if (e.username != null || e.password != null) {
      const M = e.username ?? "", z = e.password ?? "";
      l = `${M}:${z}@`;
    }
    const { port: u, method: h } = e, f = `${e.protocol}//${l}${e.hostname}${u ? `:${u}` : ""}${c}`, g = h === "GET" || h === "HEAD" ? void 0 : e.body, _ = {
      body: g,
      headers: new Headers(e.headers),
      method: h,
      credentials: i
    };
    (D = this.config) != null && D.cache && (_.cache = this.config.cache), g && (_.duplex = "half"), typeof AbortController < "u" && (_.signal = s), Nc.supported && (_.keepalive = a), typeof this.config.requestInit == "function" && Object.assign(_, this.config.requestInit(e));
    let w = () => {
    };
    const b = uf(f, _), I = [
      o(b).then((M) => {
        const z = M.headers, te = {};
        for (const we of z.entries())
          te[we[0]] = we[1];
        return M.body != null ? {
          response: new Fn({
            headers: te,
            reason: M.statusText,
            statusCode: M.status,
            body: M.body
          })
        } : M.blob().then((we) => ({
          response: new Fn({
            headers: te,
            reason: M.statusText,
            statusCode: M.status,
            body: we
          })
        }));
      }),
      cT(r)
    ];
    return s && I.push(new Promise((M, z) => {
      const te = () => {
        const E = hf(s);
        z(E);
      };
      if (typeof s.addEventListener == "function") {
        const E = s;
        E.addEventListener("abort", te, { once: !0 }), w = () => E.removeEventListener("abort", te);
      } else
        s.onabort = te;
    })), Promise.race(I).finally(w);
  }
  updateHttpClientConfig(e, s) {
    this.config = void 0, this.configProvider = this.configProvider.then((n) => (n[e] = s, n));
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
}
function hf(t) {
  const e = t && typeof t == "object" && "reason" in t ? t.reason : void 0;
  if (e) {
    if (e instanceof Error) {
      const r = new Error("Request aborted");
      return r.name = "AbortError", r.cause = e, r;
    }
    const n = new Error(String(e));
    return n.name = "AbortError", n;
  }
  const s = new Error("Request aborted");
  return s.name = "AbortError", s;
}
const dT = (t) => ({
  apiVersion: "2006-03-01",
  base64Decoder: (t == null ? void 0 : t.base64Decoder) ?? vp,
  base64Encoder: (t == null ? void 0 : t.base64Encoder) ?? lo,
  disableHostPrefix: (t == null ? void 0 : t.disableHostPrefix) ?? !1,
  endpointProvider: (t == null ? void 0 : t.endpointProvider) ?? $m,
  extensions: (t == null ? void 0 : t.extensions) ?? [],
  getAwsChunkedEncodingStream: (t == null ? void 0 : t.getAwsChunkedEncodingStream) ?? xv,
  httpAuthSchemeProvider: (t == null ? void 0 : t.httpAuthSchemeProvider) ?? gx,
  httpAuthSchemes: (t == null ? void 0 : t.httpAuthSchemes) ?? [
    {
      schemeId: "aws.auth#sigv4",
      identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4"),
      signer: new jp()
    },
    {
      schemeId: "aws.auth#sigv4a",
      identityProvider: (e) => e.getIdentityProvider("aws.auth#sigv4a"),
      signer: new Yv()
    }
  ],
  logger: (t == null ? void 0 : t.logger) ?? new Id(),
  sdkStreamMixin: (t == null ? void 0 : t.sdkStreamMixin) ?? kv,
  serviceId: (t == null ? void 0 : t.serviceId) ?? "S3",
  signerConstructor: (t == null ? void 0 : t.signerConstructor) ?? XA,
  signingEscapePath: (t == null ? void 0 : t.signingEscapePath) ?? !1,
  urlParser: (t == null ? void 0 : t.urlParser) ?? qi,
  useArnRegion: (t == null ? void 0 : t.useArnRegion) ?? !1,
  utf8Decoder: (t == null ? void 0 : t.utf8Decoder) ?? Or,
  utf8Encoder: (t == null ? void 0 : t.utf8Encoder) ?? _d
}), lT = (t) => {
  const e = N0(t), s = () => e().then(_0), n = dT(t);
  return {
    ...n,
    ...t,
    runtime: "browser",
    defaultsMode: e,
    bodyLengthChecker: (t == null ? void 0 : t.bodyLengthChecker) ?? N_,
    credentialDefaultProvider: (t == null ? void 0 : t.credentialDefaultProvider) ?? ((r) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: (t == null ? void 0 : t.defaultUserAgentProvider) ?? oT({ serviceId: n.serviceId, clientVersion: UI.version }),
    eventStreamSerdeProvider: (t == null ? void 0 : t.eventStreamSerdeProvider) ?? bA,
    maxAttempts: (t == null ? void 0 : t.maxAttempts) ?? fa,
    md5: (t == null ? void 0 : t.md5) ?? GE,
    region: (t == null ? void 0 : t.region) ?? f0("Region is missing"),
    requestHandler: _l.create((t == null ? void 0 : t.requestHandler) ?? s),
    retryMode: (t == null ? void 0 : t.retryMode) ?? (async () => (await s()).retryMode || VA),
    sha1: (t == null ? void 0 : t.sha1) ?? KI,
    sha256: (t == null ? void 0 : t.sha256) ?? eT,
    streamCollector: (t == null ? void 0 : t.streamCollector) ?? Fp,
    streamHasher: (t == null ? void 0 : t.streamHasher) ?? VE,
    useDualstackEndpoint: (t == null ? void 0 : t.useDualstackEndpoint) ?? (() => Promise.resolve(D0)),
    useFipsEndpoint: (t == null ? void 0 : t.useFipsEndpoint) ?? (() => Promise.resolve(P0))
  };
}, uT = (t) => {
  let e = async () => {
    if (t.region === void 0)
      throw new Error("Region is missing from runtimeConfig");
    const s = t.region;
    return typeof s == "string" ? s : s();
  };
  return {
    setRegion(s) {
      e = s;
    },
    region() {
      return e;
    }
  };
}, hT = (t) => ({
  region: t.region()
}), fT = (t) => {
  const e = t.httpAuthSchemes;
  let s = t.httpAuthSchemeProvider, n = t.credentials;
  return {
    setHttpAuthScheme(r) {
      const a = e.findIndex((i) => i.schemeId === r.schemeId);
      a === -1 ? e.push(r) : e.splice(a, 1, r);
    },
    httpAuthSchemes() {
      return e;
    },
    setHttpAuthSchemeProvider(r) {
      s = r;
    },
    httpAuthSchemeProvider() {
      return s;
    },
    setCredentials(r) {
      n = r;
    },
    credentials() {
      return n;
    }
  };
}, pT = (t) => ({
  httpAuthSchemes: t.httpAuthSchemes(),
  httpAuthSchemeProvider: t.httpAuthSchemeProvider(),
  credentials: t.credentials()
}), pi = (t) => t, mT = (t, e) => {
  const s = {
    ...pi(uT(t)),
    ...pi(A0(t)),
    ...pi(Bv(t)),
    ...pi(fT(t))
  };
  return e.forEach((n) => n.configure(s)), {
    ...t,
    ...hT(s),
    ...x0(s),
    ...Uv(s),
    ...pT(s)
  };
};
class gT extends p0 {
  constructor(...[s]) {
    const n = lT(s || {}), r = wx(n), a = RE(r), i = PS(a), o = JA(i), c = R0(o), d = c, l = yv(d), u = SA(l), h = yx(u), f = gE(h, { session: [() => this, PI] }), g = mT(f, (s == null ? void 0 : s.extensions) || []);
    super(g);
    p(this, "config");
    this.config = g, this.middlewareStack.use(KE(this.config)), this.middlewareStack.use(ZA(this.config)), this.middlewareStack.use(Lv(this.config)), this.middlewareStack.use(FS(this.config)), this.middlewareStack.use(HS(this.config)), this.middlewareStack.use(WS(this.config)), this.middlewareStack.use(s0(this.config, {
      httpAuthSchemeParametersProvider: fx,
      identityProviderConfigProvider: async (_) => new o0({
        "aws.auth#sigv4": _.credentials,
        "aws.auth#sigv4a": _.credentials
      })
    })), this.middlewareStack.use(i0(this.config)), this.middlewareStack.use(IE(this.config)), this.middlewareStack.use(zv(this.config)), this.middlewareStack.use(tE(this.config)), this.middlewareStack.use(lE(this.config)), this.middlewareStack.use(mE(this.config));
  }
  destroy() {
    super.destroy();
  }
}
class yT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n)
  ];
}).s("AmazonS3", "AbortMultipartUpload", {}).n("S3Client", "AbortMultipartUploadCommand").f(void 0, void 0).ser($x).de(Zx).build() {
}
function wT(t) {
  return (e) => async (s) => {
    const n = { ...s.input }, r = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const a of r) {
      const i = n[a.target];
      if (i) {
        let o;
        typeof i == "string" ? vT(i, t) ? o = t.base64Decoder(i) : (o = t.utf8Decoder(i), n[a.target] = t.base64Encoder(o)) : (o = ArrayBuffer.isView(i) ? new Uint8Array(i.buffer, i.byteOffset, i.byteLength) : new Uint8Array(i), n[a.target] = t.base64Encoder(o));
        const c = new t.md5();
        c.update(o), n[a.hash] = t.base64Encoder(await c.digest());
      }
    }
    return e({
      ...s,
      input: n
    });
  };
}
const _T = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: !0
}, Yn = (t) => ({
  applyToStack: (e) => {
    e.add(wT(t), _T);
  }
});
function vT(t, e) {
  if (!/^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))
    return !1;
  try {
    return e.base64Decoder(t).length === 32;
  } catch {
    return !1;
  }
}
class bT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n),
    Yn(n)
  ];
}).s("AmazonS3", "CompleteMultipartUpload", {}).n("S3Client", "CompleteMultipartUploadCommand").f(vx, _x).ser(Lx).de(Yx).build() {
}
class ST extends qt.classBuilder().ep({
  ...os,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: !0 },
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" },
  CopySource: { type: "contextParams", name: "CopySource" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n),
    Yn(n)
  ];
}).s("AmazonS3", "CopyObject", {}).n("S3Client", "CopyObjectCommand").f(Sx, bx).ser(Hx).de(Xx).build() {
}
class ET extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n),
    Yn(n)
  ];
}).s("AmazonS3", "CreateMultipartUpload", {}).n("S3Client", "CreateMultipartUploadCommand").f(Ax, Ex).ser(jx).de(Qx).build() {
}
class AT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n)
  ];
}).s("AmazonS3", "DeleteObject", {}).n("S3Client", "DeleteObjectCommand").f(void 0, void 0).ser(zx).de(tC).build() {
}
class Eg extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    Pd(n, {
      requestChecksumRequired: !1,
      requestValidationModeMember: "ChecksumMode",
      responseAlgorithms: ["CRC32", "CRC32C", "SHA256", "SHA1"]
    }),
    Yn(n),
    hm()
  ];
}).s("AmazonS3", "GetObject", {}).n("S3Client", "GetObjectCommand").f(kx, Tx).ser(Kx).de(sC).build() {
}
class xT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n),
    Yn(n),
    hm()
  ];
}).s("AmazonS3", "HeadObject", {}).n("S3Client", "HeadObjectCommand").f(Ox, Rx).ser(Wx).de(nC).build() {
}
class Ag extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Prefix: { type: "contextParams", name: "Prefix" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    ms(n)
  ];
}).s("AmazonS3", "ListObjectsV2", {}).n("S3Client", "ListObjectsV2Command").f(void 0, void 0).ser(Vx).de(rC).build() {
}
class CT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    Pd(n, {
      requestAlgorithmMember: { httpHeader: "x-amz-sdk-checksum-algorithm", name: "ChecksumAlgorithm" },
      requestChecksumRequired: !1
    }),
    ZS(),
    ms(n),
    Yn(n)
  ];
}).s("AmazonS3", "PutObject", {}).n("S3Client", "PutObjectCommand").f(Bx, Px).ser(Gx).de(aC).build() {
}
class IT extends qt.classBuilder().ep({
  ...os,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(e, s, n, r) {
  return [
    rs(n, this.serialize, this.deserialize),
    ns(n, e.getEndpointParameterInstructions()),
    Pd(n, {
      requestAlgorithmMember: { httpHeader: "x-amz-sdk-checksum-algorithm", name: "ChecksumAlgorithm" },
      requestChecksumRequired: !1
    }),
    ms(n),
    Yn(n)
  ];
}).s("AmazonS3", "UploadPart", {}).n("S3Client", "UploadPartCommand").f(Fx, Ux).ser(Jx).de(iC).build() {
}
function TT(t) {
  const { port: e, query: s } = t;
  let { protocol: n, path: r, hostname: a } = t;
  n && n.slice(-1) !== ":" && (n += ":"), e && (a += `:${e}`), r && r.charAt(0) !== "/" && (r = `/${r}`);
  let i = s ? $p(s) : "";
  i && i[0] !== "?" && (i = `?${i}`);
  let o = "";
  if (t.username != null || t.password != null) {
    const d = t.username ?? "", l = t.password ?? "";
    o = `${d}:${l}@`;
  }
  let c = "";
  return t.fragment && (c = `#${t.fragment}`), `${n}//${o}${a}${r}${i}${c}`;
}
const fd = "X-Amz-S3session-Token", ff = fd.toLowerCase();
class kT extends Wi {
  async signWithCredentials(e, s, n) {
    const r = pf(s);
    e.headers[ff] = s.sessionToken;
    const a = this;
    return mf(a, r), a.signRequest(e, n ?? {});
  }
  async presignWithCredentials(e, s, n) {
    const r = pf(s);
    return delete e.headers[ff], e.headers[fd] = s.sessionToken, e.query = e.query ?? {}, e.query[fd] = s.sessionToken, mf(this, r), this.presign(e, n);
  }
}
function pf(t) {
  return {
    accessKeyId: t.accessKeyId,
    secretAccessKey: t.secretAccessKey,
    expiration: t.expiration
  };
}
function mf(t, e) {
  const s = t.credentialProvider;
  t.credentialProvider = () => (t.credentialProvider = s, Promise.resolve(e));
}
class RT {
  constructor(e) {
    p(this, "sigv4aSigner");
    p(this, "sigv4Signer");
    p(this, "signerOptions");
    this.sigv4Signer = new kT(e), this.signerOptions = e;
  }
  static sigv4aDependency() {
    return "none";
  }
  async sign(e, s = {}) {
    return s.signingRegion === "*" ? this.getSigv4aSigner().sign(e, s) : this.sigv4Signer.sign(e, s);
  }
  async signWithCredentials(e, s, n = {}) {
    if (n.signingRegion === "*")
      throw this.getSigv4aSigner(), new Error(`signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
    return this.sigv4Signer.signWithCredentials(e, s, n);
  }
  async presign(e, s = {}) {
    if (s.signingRegion === "*")
      throw this.getSigv4aSigner(), new Error(`presign with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
    return this.sigv4Signer.presign(e, s);
  }
  async presignWithCredentials(e, s, n = {}) {
    if (n.signingRegion === "*")
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    return this.sigv4Signer.presignWithCredentials(e, s, n);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner)
      throw this.signerOptions.runtime === "node" ? new Error("Neither CRT nor JS SigV4a implementation is available. Please load either @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt") : new Error("JS SigV4a implementation is not available or not a valid constructor. Please check whether you have installed the @aws-sdk/signature-v4a package explicitly. The CRT implementation is not available for browsers. You must also register the package by calling [require('@aws-sdk/signature-v4a');] or an ESM equivalent such as [import '@aws-sdk/signature-v4a';]. For more information please go to https://github.com/aws/aws-sdk-js-v3#using-javascript-non-crt-implementation-of-sigv4a");
    return this.sigv4aSigner;
  }
}
const OT = "UNSIGNED-PAYLOAD", NT = "X-Amz-Content-Sha256";
class gf {
  constructor(e) {
    p(this, "signer");
    const s = {
      service: e.signingName || e.service || "s3",
      uriEscapePath: e.uriEscapePath || !1,
      applyChecksum: e.applyChecksum || !1,
      ...e
    };
    this.signer = new RT(s);
  }
  presign(e, { unsignableHeaders: s = /* @__PURE__ */ new Set(), hoistableHeaders: n = /* @__PURE__ */ new Set(), unhoistableHeaders: r = /* @__PURE__ */ new Set(), ...a } = {}) {
    return this.prepareRequest(e, {
      unsignableHeaders: s,
      unhoistableHeaders: r,
      hoistableHeaders: n
    }), this.signer.presign(e, {
      expiresIn: 900,
      unsignableHeaders: s,
      unhoistableHeaders: r,
      ...a
    });
  }
  presignWithCredentials(e, s, { unsignableHeaders: n = /* @__PURE__ */ new Set(), hoistableHeaders: r = /* @__PURE__ */ new Set(), unhoistableHeaders: a = /* @__PURE__ */ new Set(), ...i } = {}) {
    return this.prepareRequest(e, {
      unsignableHeaders: n,
      unhoistableHeaders: a,
      hoistableHeaders: r
    }), this.signer.presignWithCredentials(e, s, {
      expiresIn: 900,
      unsignableHeaders: n,
      unhoistableHeaders: a,
      ...i
    });
  }
  prepareRequest(e, { unsignableHeaders: s = /* @__PURE__ */ new Set(), unhoistableHeaders: n = /* @__PURE__ */ new Set(), hoistableHeaders: r = /* @__PURE__ */ new Set() } = {}) {
    s.add("content-type"), Object.keys(e.headers).map((c) => c.toLowerCase()).filter((c) => c.startsWith("x-amz-server-side-encryption")).forEach((c) => {
      r.has(c) || n.add(c);
    }), e.headers[NT] = OT;
    const a = e.headers.host, i = e.port, o = `${e.hostname}${e.port != null ? ":" + i : ""}`;
    (!a || a === e.hostname && e.port != null) && (e.headers.host = o);
  }
}
const MT = async (t, e, s = {}) => {
  var u, h, f;
  let n, r;
  if (typeof t.config.endpointProvider == "function") {
    const _ = (h = (u = (await gv(e.input, e.constructor, t.config)).properties) == null ? void 0 : u.authSchemes) == null ? void 0 : h[0];
    (_ == null ? void 0 : _.name) === "sigv4a" ? r = (f = _ == null ? void 0 : _.signingRegionSet) == null ? void 0 : f.join(",") : r = _ == null ? void 0 : _.signingRegion, n = new gf({
      ...t.config,
      signingName: _ == null ? void 0 : _.signingName,
      region: async () => r
    });
  } else
    n = new gf(t.config);
  const a = (g, _) => async (w) => {
    const { request: b } = w;
    if (!De.isInstance(b))
      throw new Error("Request to be presigned is not an valid HTTP request.");
    delete b.headers["amz-sdk-invocation-id"], delete b.headers["amz-sdk-request"], delete b.headers["x-amz-user-agent"];
    let I;
    const D = {
      ...s,
      signingRegion: s.signingRegion ?? _.signing_region ?? r,
      signingService: s.signingService ?? _.signing_service
    };
    return _.s3ExpressIdentity ? I = await n.presignWithCredentials(b, _.s3ExpressIdentity, D) : I = await n.presign(b, D), {
      response: {},
      output: {
        $metadata: { httpStatusCode: 200 },
        presigned: I
      }
    };
  }, i = "presignInterceptMiddleware", o = t.middlewareStack.clone();
  o.addRelativeTo(a, {
    name: i,
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: !0
  });
  const c = e.resolveMiddleware(o, t.config, {}), { output: d } = await c({ input: e.input }), { presigned: l } = d;
  return TT(l);
};
function ft(t) {
  const e = t.region || "auto";
  if (t.providerType === "r2" && !t.endpointUrl)
    throw new v(
      "STORAGE_SOURCE_ENDPOINT_REQUIRED",
      "Cloudflare R2 需要填写 Account Endpoint URL（形如 https://<account-id>.r2.cloudflarestorage.com），保存后重试",
      400
    );
  const s = t.endpointUrl || void 0;
  return new gT({
    region: e,
    endpoint: s,
    forcePathStyle: t.providerType === "r2" ? !0 : !!t.forcePathStyle,
    credentials: {
      accessKeyId: t.accessKeyId,
      secretAccessKey: t.secretAccessKey
    }
  });
}
function yf(t) {
  const e = t || "";
  return e ? e.startsWith("/") ? e.slice(1) : e : "";
}
function Re(t, e) {
  const s = yf(t), n = yf(e);
  return s ? n ? `${s.replace(/\/+$/, "")}/${n}`.replace(/\/{2,}/g, "/") : s.endsWith("/") ? s : `${s}/` : n;
}
async function wf(t, e, s, n, r = 500) {
  const a = new Ag({
    Bucket: e,
    Prefix: s,
    Delimiter: "/",
    MaxKeys: r,
    ContinuationToken: n || void 0
  });
  let i;
  try {
    i = await t.send(a);
  } catch (d) {
    throw St(d);
  }
  const o = (i.CommonPrefixes ?? []).map((d) => d.Prefix ?? "").filter(Boolean), c = (i.Contents ?? []).filter((d) => d.Key && d.Key !== s).map((d) => ({
    key: d.Key,
    size: d.Size ?? 0,
    lastModified: d.LastModified
  }));
  return {
    folders: o,
    files: c,
    nextToken: i.IsTruncated ? i.NextContinuationToken : void 0
  };
}
async function DT(t, e, s) {
  const n = new Eg({ Bucket: e, Key: s });
  let r;
  try {
    r = await t.send(n);
  } catch (a) {
    throw St(a);
  }
  return { body: r.Body, contentType: r.ContentType };
}
async function _f(t, e, s, n = 3600) {
  try {
    const r = new Eg({ Bucket: e, Key: s });
    return await MT(t, r, { expiresIn: n });
  } catch (r) {
    throw St(r);
  }
}
async function PT(t, e, s) {
  try {
    return { size: (await t.send(new xT({ Bucket: e, Key: s }))).ContentLength };
  } catch (n) {
    throw St(n);
  }
}
async function vf(t, e, s, n, r) {
  try {
    await t.send(
      new CT({
        Bucket: e,
        Key: s,
        Body: n,
        ContentType: r
      })
    );
  } catch (a) {
    throw St(a);
  }
}
async function or(t, e, s) {
  try {
    await t.send(new AT({ Bucket: e, Key: s }));
  } catch (n) {
    throw St(n);
  }
}
async function Mc(t, e, s, n) {
  try {
    await t.send(
      new ST({
        Bucket: e,
        CopySource: `/${e}/${encodeURIComponent(s)}`,
        Key: n
      })
    );
  } catch (r) {
    throw St(r);
  }
}
async function BT(t, e, s, n) {
  try {
    const r = await t.send(
      new ET({ Bucket: e, Key: s, ContentType: n })
    );
    if (!r.UploadId) throw St(new Error("S3 did not return an UploadId"));
    return r.UploadId;
  } catch (r) {
    throw St(r);
  }
}
async function UT(t, e, s, n, r, a) {
  try {
    const i = await t.send(
      new IT({
        Bucket: e,
        Key: s,
        UploadId: n,
        PartNumber: r,
        Body: a,
        ContentLength: a.byteLength
      })
    );
    if (!i.ETag) throw St(new Error("S3 did not return an ETag"));
    return i.ETag;
  } catch (i) {
    throw St(i);
  }
}
async function FT(t, e, s, n, r) {
  try {
    await t.send(
      new bT({
        Bucket: e,
        Key: s,
        UploadId: n,
        MultipartUpload: { Parts: r }
      })
    );
  } catch (a) {
    throw St(a);
  }
}
async function $T(t, e, s, n) {
  try {
    await t.send(
      new yT({ Bucket: e, Key: s, UploadId: n })
    );
  } catch (r) {
    throw St(r);
  }
}
async function bf(t, e, s) {
  const n = [];
  let r;
  do {
    const a = new Ag({
      Bucket: e,
      Prefix: s,
      ContinuationToken: r
    });
    let i;
    try {
      i = await t.send(a);
    } catch (o) {
      throw St(o);
    }
    for (const o of i.Contents ?? [])
      o.Key && n.push(o.Key);
    r = i.IsTruncated ? i.NextContinuationToken : void 0;
  } while (r);
  return n;
}
function St(t) {
  var a;
  if (t instanceof v) return t;
  const e = t, s = (a = e == null ? void 0 : e.$metadata) == null ? void 0 : a.httpStatusCode, n = e == null ? void 0 : e.name, r = (e == null ? void 0 : e.message) || String(t);
  return s === 404 ? new v("S3_NOT_FOUND", "存储桶或对象不存在（HTTP 404）", 400) : s === 403 ? new v("S3_ACCESS_DENIED", "访问被拒绝（HTTP 403），请检查 Access Key / Secret Key 权限及桶策略", 403) : s === 401 ? new v("S3_INVALID_CREDENTIALS", "凭据无效（HTTP 401），请检查 Access Key / Secret Key", 401) : s && s >= 400 ? new v("S3_REQUEST_FAILED", `存储服务返回 HTTP ${s}${n ? `（${n}）` : ""}`, 400) : r.includes("NoSuchBucket") ? new v("S3_BUCKET_NOT_FOUND", "存储桶不存在或没有访问权限", 400) : r.includes("AccessDenied") || r.includes("Forbidden") || n === "AccessDenied" ? new v("S3_ACCESS_DENIED", "访问被拒绝，请检查 Access Key / Secret Key 权限及桶策略", 403) : r.includes("InvalidAccessKeyId") || r.includes("SignatureDoesNotMatch") ? new v("S3_INVALID_CREDENTIALS", "凭据无效，请检查 Access Key / Secret Key", 401) : new v("S3_ERROR", LT(n, r, e == null ? void 0 : e.$fault), 500);
}
function LT(t, e, s) {
  const n = [], r = s === "client" || t ? t : void 0, a = (e == null ? void 0 : e.toLowerCase()) === "unknown" || (e == null ? void 0 : e.toLowerCase()) === "unknownerror" ? void 0 : e;
  return r && r.toLowerCase() !== "unknown" && r.toLowerCase() !== "unknownerror" && n.push(r), a && n.push(a), n.join("：") || "连接失败，请检查 Endpoint、Region 与凭据后重试";
}
function mi(t) {
  const s = t.replace(/\/+$/, "").split("/");
  return s[s.length - 1] || "";
}
function Dc(t) {
  const e = t.trim();
  return !e || e === "/" ? "" : t.startsWith("/") ? t.slice(1) : t;
}
function Sf(t) {
  return t.endsWith("/") ? t : `${t}/`;
}
class HT {
  constructor(e, s, n) {
    p(this, "sources");
    p(this, "mounts");
    p(this, "shareLinks");
    this.encryptionKey = s, this.shareTokenSecret = n, this.sources = new r_(e), this.mounts = new Qw(e), this.shareLinks = new e_(e);
  }
  // ── 存储源 ──
  async listStorageSources() {
    return this.sources.list();
  }
  async getStorageSource(e) {
    const s = await this.sources.findById(e);
    if (!s) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    return s;
  }
  async createStorageSource(e) {
    if (!e.name || !e.bucketName)
      throw new v("VALIDATION_ERROR", "name 和 bucketName 为必填", 400);
    if (!e.accessKeyId || !e.secretAccessKey)
      throw new v("VALIDATION_ERROR", "Access Key 和 Secret Key 为必填", 400);
    const s = await si(e.accessKeyId, this.encryptionKey), n = await si(e.secretAccessKey, this.encryptionKey);
    return this.sources.create(e, { accessKeyCiphertext: s, secretKeyCiphertext: n });
  }
  async updateStorageSource(e, s) {
    if (!await this.sources.findById(e)) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    let r, a;
    if (s.accessKeyId !== void 0 || s.secretAccessKey !== void 0) {
      if (!s.accessKeyId || !s.secretAccessKey)
        throw new v("VALIDATION_ERROR", "更新凭据时必须同时提供 Access Key 和 Secret Key", 400);
      r = await si(s.accessKeyId, this.encryptionKey), a = await si(s.secretAccessKey, this.encryptionKey);
    }
    return this.sources.update(e, s, { accessKeyCiphertext: r, secretKeyCiphertext: a });
  }
  async deleteStorageSource(e) {
    if (!await this.sources.findById(e)) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    await this.mounts.deleteBySource(e), await this.sources.delete(e);
  }
  async testStorageSource(e) {
    let s;
    try {
      s = await this.resolveCredentials(e);
    } catch (n) {
      return { ok: !1, message: n instanceof Error ? n.message : "无可用的凭据" };
    }
    try {
      const n = ft(s);
      return await wf(n, s.bucketName, "", void 0, 1), { ok: !0, message: "连接成功" };
    } catch (n) {
      const r = n instanceof v || n instanceof Error ? n.message : String(n);
      return (n instanceof v ? n.code === "S3_ACCESS_DENIED" || n.code === "S3_INVALID_CREDENTIALS" || n.code === "S3_BUCKET_NOT_FOUND" || n.code === "S3_REQUEST_FAILED" : /denied|credentials|auth/i.test(r)) ? { ok: !1, message: r } : { ok: !0, message: `${r}（连接已建立，但访问受限）` };
    }
  }
  // ── 挂载 ──
  async listMounts() {
    return this.mounts.list();
  }
  async createMount(e) {
    if (!e.sourceId || !e.name)
      throw new v("VALIDATION_ERROR", "sourceId 和 name 为必填", 400);
    if (!await this.sources.findById(e.sourceId)) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    return this.mounts.create(e);
  }
  async updateMount(e, s) {
    if (!await this.mounts.findById(e)) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    return this.mounts.update(e, s);
  }
  async setMountActive(e, s) {
    if (!await this.mounts.findById(e)) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    await this.mounts.setActive(e, s);
  }
  async deleteMount(e) {
    if (!await this.mounts.findById(e)) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    await this.mounts.delete(e);
  }
  // ── 文件浏览 ──
  async browse(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId), a = Dc(s.path ?? "/"), i = a ? Re(n.rootPath, jT(a)) : Re(n.rootPath, ""), o = Re(r.rootPrefix, i), c = ft(r), d = await wf(c, r.bucketName, o, s.nextToken), l = [
      ...d.folders.map((u) => {
        const h = mi(u);
        return { name: h, path: `${a ? `${a}/` : ""}${h}/`, type: "folder" };
      }),
      ...d.files.map((u) => {
        const h = mi(u.key);
        return {
          name: h,
          path: `${a ? `${a}/` : ""}${h}`,
          type: "file",
          size: u.size,
          lastModified: u.lastModified ? u.lastModified.getTime() : void 0
        };
      })
    ];
    return {
      currentPath: a,
      nodes: l,
      nextToken: d.nextToken,
      hasMore: !!d.nextToken
    };
  }
  async uploadFile(e, s, n) {
    const r = await this.resolveUploadCtx(e, s, n.name || "unnamed"), a = ft(r.source);
    return await vf(a, r.source.bucketName, r.s3Key, n.stream(), n.type || void 0), r.node(n.size);
  }
  // ── 分片上传 ──
  async createMultipartUpload(e, s) {
    const n = await this.resolveUploadCtx(e, s, s.fileName), r = ft(n.source);
    return { uploadId: await BT(
      r,
      n.source.bucketName,
      n.s3Key,
      s.contentType || void 0
    ) };
  }
  async uploadPart(e, s, n) {
    const r = await this.resolveUploadCtx(e, s, s.fileName), a = ft(r.source), i = await UT(
      a,
      r.source.bucketName,
      r.s3Key,
      s.uploadId,
      s.partNumber,
      n
    );
    return { partNumber: s.partNumber, etag: i };
  }
  async completeMultipartUpload(e, s, n) {
    const r = await this.resolveUploadCtx(e, s, s.fileName), a = ft(r.source), i = [...n].sort((o, c) => (o.PartNumber ?? 0) - (c.PartNumber ?? 0));
    return await FT(a, r.source.bucketName, r.s3Key, s.uploadId, i), r.node(s.totalSize);
  }
  async abortMultipartUpload(e, s) {
    const n = await this.resolveUploadCtx(e, s, s.fileName), r = ft(n.source);
    await $T(r, n.source.bucketName, n.s3Key, s.uploadId);
  }
  async resolveUploadCtx(e, s, n) {
    const r = await this.mounts.findById(e);
    if (!r) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const a = await this.resolveCredentials(r.sourceId), i = Dc(s.path ?? "/"), o = `${i ? `${i}/` : ""}${n}`, c = Re(Re(a.rootPrefix, r.rootPath), o);
    return {
      mount: r,
      source: a,
      virtualPath: i,
      virtualKey: o,
      s3Key: c,
      node: (d) => ({
        name: n,
        path: o,
        type: "file",
        size: d,
        lastModified: Date.now()
      })
    };
  }
  async createFolder(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId);
    if (!s.name) throw new v("VALIDATION_ERROR", "文件夹名称不能为空", 400);
    const a = Dc(s.path ?? "/"), i = Sf(`${a ? `${a}/` : ""}${s.name}`), o = Re(Re(r.rootPrefix, n.rootPath), i), c = ft(r);
    return await vf(c, r.bucketName, o, ""), { name: s.name, path: i, type: "folder" };
  }
  async deletePath(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId);
    if (!s.path) throw new v("VALIDATION_ERROR", "path 不能为空", 400);
    const a = ft(r), i = s.path.endsWith("/"), o = Re(n.rootPath, s.path), c = Re(r.rootPrefix, o);
    if (i) {
      const d = await bf(a, r.bucketName, c);
      for (const l of d)
        await or(a, r.bucketName, l);
      d.includes(c) || await or(a, r.bucketName, c);
    } else
      await or(a, r.bucketName, c);
  }
  async renamePath(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId);
    if (!s.path || !s.newName) throw new v("VALIDATION_ERROR", "path 和 newName 为必填", 400);
    const a = ft(r), i = s.path.endsWith("/"), o = i ? s.path.slice(0, s.path.indexOf(s.path.split("/").filter(Boolean).pop())).replace(/\/+$/, "") : s.path.split("/").slice(0, -1).join("/"), c = o ? `${o}/` : "", d = Re(n.rootPath, s.path), l = Re(c, s.newName), u = Re(r.rootPrefix, d), h = Re(r.rootPrefix, l);
    if (i) {
      const f = await bf(a, r.bucketName, u);
      for (const g of f) {
        const _ = g.slice(u.length);
        await Mc(a, r.bucketName, g, `${h}${_}`);
      }
      for (const g of f)
        await or(a, r.bucketName, g);
      f.includes(u) || (await Mc(a, r.bucketName, u, u.endsWith("/") ? h : Sf(h)), await or(a, r.bucketName, u));
    } else
      await Mc(a, r.bucketName, u, h), await or(a, r.bucketName, u);
  }
  async stat(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId), a = ft(r), i = Re(n.rootPath, s.path), o = Re(r.rootPrefix, i), { size: c } = await PT(a, r.bucketName, o);
    return { name: mi(s.path), size: c };
  }
  async download(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.resolveCredentials(n.sourceId);
    if (!s.path) throw new v("VALIDATION_ERROR", "path 不能为空", 400);
    const a = ft(r), i = Re(n.rootPath, s.path), o = Re(r.rootPrefix, i);
    return {
      key: o,
      name: mi(s.path),
      ...await DT(a, r.bucketName, o)
    };
  }
  async getPublicUrl(e, s) {
    const n = await this.mounts.findById(e);
    if (!n) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    const r = await this.sources.findById(n.sourceId);
    if (!r) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    if (!s.path) throw new v("VALIDATION_ERROR", "path 不能为空", 400);
    const a = Re(n.rootPath, s.path), i = Re(r.rootPrefix, a);
    if (r.publicBaseUrl) {
      const l = r.publicBaseUrl.replace(/\/+$/, ""), u = i.split("/").map((h) => encodeURIComponent(h)).join("/");
      return { url: `${l}/${u}`, permanent: !0 };
    }
    const o = await this.resolveCredentials(r.id), c = ft(o);
    return { url: await _f(c, r.bucketName, i, 3600), permanent: !1, expiresInSeconds: 3600 };
  }
  // ── 302 分享链接（永久/限时，可吊销） ──
  async createShareLink(e, s, n) {
    const r = await this.mounts.findById(e);
    if (!r) throw new v("STORAGE_MOUNT_NOT_FOUND", "挂载不存在", 404);
    if (!r.isActive) throw new v("STORAGE_MOUNT_INACTIVE", "挂载未启用", 400);
    if (!s.path) throw new v("VALIDATION_ERROR", "path 不能为空", 400);
    if (!await this.sources.findById(r.sourceId)) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    const i = n == null ? void 0 : n.ttlMs, o = typeof i == "number" && i > 0, c = o ? new Date(Date.now() + i).toISOString() : null, d = o ? Date.now() + i : null, l = Ie("shl");
    let u = eu();
    for (let g = 0; g < 5 && await this.shareLinks.findBySlug(u); g++)
      u = eu();
    const h = await n_({ sub: l, exp: d, iat: Date.now() }, this.shareTokenSecret);
    return await this.shareLinks.create({ id: l, mountId: e, filePath: s.path, token: h, slug: u, expiresAt: c }), { ...await this.shareLinks.findById(l), url: `/api/share/${Ef(s.path, u)}` };
  }
  async listShareLinks(e) {
    return (e ? await this.shareLinks.listByMount(e) : []).map((n) => ({
      ...n,
      url: n.slug ? `/api/share/${Ef(n.filePath, n.slug)}` : `/api/share/${n.token}`
    }));
  }
  async revokeShareLink(e) {
    const s = await tu(e, this.shareTokenSecret);
    if (!s) throw new v("SHARE_LINK_INVALID", "分享链接无效", 404);
    const n = await this.shareLinks.findById(s.sub);
    if (!n) throw new v("SHARE_LINK_INVALID", "分享链接无效", 404);
    n.revoked || await this.shareLinks.revoke(n.id);
  }
  async resolveShare(e) {
    let s = e ? await this.shareLinks.findBySlug(e) : null;
    if (!s && e.includes("-")) {
      const l = e.split("-")[0];
      l && (s = await this.shareLinks.findBySlug(l));
    }
    if (!s) {
      const l = await tu(e, this.shareTokenSecret);
      if (!l) throw new v("SHARE_LINK_INVALID", "分享链接无效", 404);
      s = await this.shareLinks.findById(l.sub);
    }
    if (!s) throw new v("SHARE_LINK_INVALID", "分享链接无效", 404);
    if (s.revoked) throw new v("SHARE_LINK_REVOKED", "分享链接已吊销", 410);
    if (s.expired) throw new v("SHARE_LINK_EXPIRED", "分享链接已过期", 410);
    const n = await this.mounts.findById(s.mountId);
    if (!n || !n.isActive) throw new v("SHARE_LINK_REVOKED", "挂载不可用，链接已失效", 410);
    const r = await this.sources.findById(n.sourceId);
    if (!r) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    const a = Re(n.rootPath, s.filePath), i = Re(r.rootPrefix, a), o = await this.resolveCredentials(r.id), c = ft(o);
    return { url: await _f(c, r.bucketName, i, 3600) };
  }
  async resolveCredentials(e) {
    const s = await this.sources.findRowById(e);
    if (!s) throw new v("STORAGE_SOURCE_NOT_FOUND", "存储源不存在", 404);
    if (!s.access_key_ciphertext || !s.secret_key_ciphertext)
      throw new v("STORAGE_SOURCE_MISSING_CREDENTIALS", "存储源缺少凭据", 400);
    const n = await Yl(s.access_key_ciphertext, this.encryptionKey), r = await Yl(s.secret_key_ciphertext, this.encryptionKey);
    return {
      providerType: s.provider_type,
      endpointUrl: s.endpoint_url,
      region: s.region,
      bucketName: s.bucket_name,
      forcePathStyle: s.force_path_style === 1,
      rootPrefix: s.root_prefix,
      accessKeyId: n,
      secretAccessKey: r
    };
  }
}
function jT(t) {
  return t.startsWith("/") ? t.slice(1) : t;
}
function Ef(t, e) {
  const s = (t.split("/").filter(Boolean).pop() || "").trim();
  if (!s) return e;
  const n = s.replace(/[?#]/g, "_");
  return n ? `${e}-${n}` : e;
}
class qT {
  constructor(e) {
    this.channelService = e;
  }
  async notify(e) {
    const s = await this.channelService.getAccountByType("telegram");
    if (!(s != null && s.credentialCiphertext)) return;
    const n = s.externalAccountId;
    if (n)
      try {
        const r = await fetch(`https://api.telegram.org/bot${s.credentialCiphertext}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: n,
            text: e,
            parse_mode: "HTML",
            disable_web_page_preview: !0
          })
        });
        if (!r.ok) {
          const a = await r.text().catch(() => "");
          ts.warn("tg_notification_failed", {
            status: r.status,
            body: a.substring(0, 200)
          });
        }
      } catch (r) {
        ts.warn("tg_notification_error", {
          error: r instanceof Error ? r.message : String(r)
        });
      }
  }
}
async function N(t) {
  const e = new Xy([new ew(), new tw(), new fp(), new dw()]), s = new bw(t.DB), n = new Ew(t.DB), r = new Bw(t.DB), a = new xw(t.DB), i = new Hw(t.DB), o = t.KB_INSTANCE_NAME ?? "supportly-dev";
  let c = null;
  if (t.AI_SEARCH)
    try {
      c = new lw(t.AI_SEARCH.get(o), o);
    } catch (E) {
      console.warn("ai_search_unavailable", E instanceof Error ? E.message : String(E));
    }
  const d = t.AI ? new yw(t.AI, t) : null, l = new vw(c, d, r), u = new Sw(s, e), h = new Aw(n, r, l), f = new Lw(t), g = new Ow(t.MEDIA_BUCKET, r), _ = new Uw(
    u,
    n,
    r,
    f,
    g
  ), w = new Cw(a, c), b = new qw(i, t.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"), I = new Ww(t.DB), D = new Gw(
    I,
    t.END_USER_JWT_SECRET ?? "supportly-dev-enduser-secret-change-before-deploy"
  );
  let M = null, z = null;
  {
    const { WidgetService: E } = await Promise.resolve().then(() => sR);
    M = new E(
      u,
      n,
      r,
      h,
      f,
      g,
      I,
      t.WIDGET_TOKEN_SECRET ?? t.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
    );
  }
  {
    const { ForumService: E } = await Promise.resolve().then(() => aR);
    z = new E(
      u,
      n,
      r,
      h,
      f,
      g,
      I,
      D,
      b,
      t.WIDGET_TOKEN_SECRET ?? t.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
    );
  }
  const te = new qT(u);
  return {
    adapters: e,
    channels: u,
    conversations: h,
    messages: _,
    media: g,
    realtime: f,
    knowledge: w,
    auth: b,
    endUserAuth: D,
    widget: M,
    forum: z,
    fileBrowser: new HT(
      t.DB,
      t.S3_ENCRYPTION_KEY,
      t.S3_SHARE_KEY
    ),
    notification: te
  };
}
function Us() {
  return async (t, e) => {
    const s = t.req.header("x-admin-user-id"), n = t.req.header("authorization"), a = await (await N(t.env)).auth.requireAdminUser({ adminUserId: s, authorization: n });
    t.set("adminUserId", a.id), t.set("adminUser", {
      id: a.id,
      email: a.email,
      name: a.name,
      role: a.role
    }), await e();
  };
}
function q(t, e) {
  return Response.json({ data: t }, e);
}
function Gt(t) {
  return q(t, { status: 201 });
}
function mn() {
  return new Response(null, { status: 204 });
}
const Fs = new Nt(), zT = oe({
  email: O().email(),
  password: O().min(1)
});
Fs.post("/login", async (t) => {
  const e = zT.parse(await t.req.json()), s = await N(t.env);
  return q(await s.auth.login(e.email, e.password));
});
Fs.get("/me", Us(), (t) => q(t.get("adminUser")));
const KT = oe({
  username: O().trim().min(2).max(50),
  password: O().min(6).max(128),
  email: O().email().optional(),
  displayName: O().trim().max(100).optional()
}), WT = oe({
  username: O().trim().min(1),
  password: O().min(1)
});
Fs.post("/end-user/register", async (t) => {
  const e = KT.parse(await t.req.json()), s = await N(t.env);
  return q(await s.endUserAuth.register(e));
});
Fs.post("/end-user/login", async (t) => {
  const e = WT.parse(await t.req.json()), s = await N(t.env);
  return q(await s.endUserAuth.login(e.username, e.password));
});
Fs.get("/end-user/me", async (t) => {
  const s = await (await N(t.env)).endUserAuth.requireEndUser(t.req.header("authorization"));
  return q({
    id: s.id,
    username: s.username,
    displayName: s.displayName,
    email: s.email,
    rawPayloadJson: s.rawPayloadJson
  });
});
const VT = oe({
  displayName: O().trim().max(100).optional(),
  oldPassword: O().min(1).optional(),
  newPassword: O().min(6).max(128).optional(),
  settings: cp(op()).optional()
});
Fs.patch("/end-user/me", async (t) => {
  const e = VT.parse(await t.req.json()), s = await N(t.env), n = await s.endUserAuth.requireEndUser(t.req.header("authorization"));
  if (e.settings && await s.endUserAuth.updateSettings(n.id, e.settings), e.newPassword) {
    if (!e.oldPassword)
      throw new v("MISSING_OLD_PASSWORD", "Old password is required", 400);
    await s.endUserAuth.changePassword(n.id, e.oldPassword, e.newPassword);
  }
  return e.displayName && await s.endUserAuth.updateDisplayName(n.id, e.displayName), q({ success: !0 });
});
const xg = "avatars/", GT = 2 * 1024 * 1024, JT = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
Fs.post("/end-user/avatar", async (t) => {
  const s = await (await N(t.env)).endUserAuth.requireEndUser(t.req.header("authorization")), r = (await t.req.formData()).get("file");
  if (!ZT(r))
    throw new v("NO_FILE", "No file uploaded", 400);
  const a = (r.type || "image/png").toLowerCase();
  if (!JT.has(a))
    throw new v("INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, WebP images are allowed", 400);
  if (r.size > GT)
    throw new v("FILE_TOO_LARGE", "Avatar image must be under 2MB", 400);
  const i = t.env.MEDIA_BUCKET;
  if (!i)
    throw new v("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const o = `${xg}${s.id}`;
  await i.put(o, r.stream(), {
    httpMetadata: { contentType: a, cacheControl: "no-cache" }
  });
  const c = `/api/auth/end-user/avatar/${s.id}`;
  return q({ avatarUrl: c });
});
Fs.get("/end-user/avatar/:userId", async (t) => {
  const e = t.env.MEDIA_BUCKET;
  if (!e)
    throw new v("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const s = t.req.param("userId"), n = `${xg}${s}`, r = await e.get(n);
  if (!r)
    throw new v("AVATAR_NOT_FOUND", "Avatar not found", 404);
  const a = new Headers();
  return r.writeHttpMetadata(a), a.set("cache-control", "no-cache"), a.set("etag", r.httpEtag), new Response(r.body, { headers: a });
});
function ZT(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "stream" in t;
}
const YT = oe({
  channelType: Ur(["custom_webhook", "telegram", "whatsapp", "wechat", "web_chat", "forum"]),
  displayName: O().min(1),
  externalAccountId: O().optional(),
  credentialCiphertext: O().optional(),
  webhookSecretCiphertext: O().optional(),
  outboundUrl: O().url().optional()
}), XT = oe({
  displayName: O().min(1).optional(),
  externalAccountId: O().optional().nullable(),
  credentialCiphertext: O().optional().nullable(),
  webhookSecretCiphertext: O().optional().nullable(),
  outboundUrl: O().url().optional().nullable()
}), Cg = oe({
  webhookUrl: O().url().optional(),
  dropPendingUpdates: Ct().optional()
}), Xn = new Nt();
Xn.use("*", Us());
Xn.get("/", async (t) => {
  const e = await N(t.env);
  return q((await e.channels.listAccounts()).map(vl));
});
Xn.post("/", async (t) => {
  const e = YT.parse(await t.req.json()), s = await N(t.env);
  return Gt(vl(await s.channels.createAccount(e)));
});
Xn.patch("/:id", async (t) => {
  const e = XT.parse(await t.req.json()), s = await N(t.env);
  return q(vl(await s.channels.updateAccount(t.req.param("id"), {
    displayName: e.displayName,
    externalAccountId: e.externalAccountId ?? void 0,
    credentialCiphertext: e.credentialCiphertext ?? void 0,
    webhookSecretCiphertext: e.webhookSecretCiphertext ?? void 0,
    outboundUrl: e.outboundUrl ?? void 0
  })));
});
Xn.post("/:id/telegram/set-webhook", async (t) => {
  const e = Cg.parse(await t.req.json().catch(() => ({}))), s = await N(t.env), n = await s.channels.getAccount(t.req.param("id")), r = Ig(s.channels.getAdapter(n));
  return q(
    await r.setWebhook(n, {
      webhookUrl: e.webhookUrl ?? Tg(t.req.url, n.id),
      dropPendingUpdates: e.dropPendingUpdates
    })
  );
});
Xn.post("/:id/telegram/test", async (t) => {
  const e = Cg.pick({ webhookUrl: !0 }).parse(await t.req.json().catch(() => ({}))), s = await N(t.env), n = await s.channels.getAccount(t.req.param("id")), r = Ig(s.channels.getAdapter(n));
  return q(await r.testConnection(n, e.webhookUrl ?? Tg(t.req.url, n.id)));
});
function vl(t) {
  return {
    ...t,
    credentialCiphertext: null
  };
}
function Ig(t) {
  if (t instanceof fp) return t;
  throw new v("CHANNEL_NOT_TELEGRAM", "Channel is not a Telegram channel", 400);
}
function Tg(t, e) {
  return `${new URL(t).origin}/webhooks/${e}`;
}
const QT = oe({
  clientMessageId: O().trim().min(1).max(128).optional(),
  content: O().min(1)
}), ek = oe({
  status: Ur(["bot", "agent"])
}), Es = new Nt();
Es.get("/:id/messages/:messageId/attachments/:index", async (t) => {
  var n, r;
  const e = await N(t.env), s = (n = t.req.query("token")) == null ? void 0 : n.trim();
  return await e.auth.requireAdminUser({
    adminUserId: ((r = t.req.query("adminUserId")) == null ? void 0 : r.trim()) || t.req.header("x-admin-user-id"),
    authorization: s ? `Bearer ${s}` : t.req.header("authorization")
  }), e.media.getMessageAttachmentResponse({
    conversationId: t.req.param("id"),
    messageId: t.req.param("messageId"),
    attachmentIndex: sk(t.req.param("index")),
    request: t.req.raw
  });
});
Es.use("*", Us());
Es.get("/", async (t) => {
  const e = await N(t.env);
  return t.req.query("status") === "resolved" ? q(await e.conversations.listResolvedConversations()) : q(await e.conversations.listOpenConversations());
});
Es.get("/:id", async (t) => {
  const e = await N(t.env);
  return q(await e.conversations.getConversation(t.req.param("id")));
});
Es.get("/:id/messages", async (t) => {
  const e = await N(t.env);
  return q(await e.messages.listConversationMessages(t.req.param("id"), t.req.query("after") || void 0));
});
Es.post("/:id/messages", async (t) => {
  const e = QT.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.messages.sendAgentMessage({
      conversationId: t.req.param("id"),
      adminUserId: t.get("adminUserId"),
      clientMessageId: e.clientMessageId,
      content: e.content
    })
  );
});
Es.post("/:id/messages/media", async (t) => {
  const e = await t.req.formData(), s = e.get("file");
  if (!tk(s))
    throw new v("VALIDATION_ERROR", "file is required", 400);
  const n = await N(t.env);
  return q(
    await n.messages.sendAgentMediaMessage({
      conversationId: t.req.param("id"),
      adminUserId: t.get("adminUserId"),
      clientMessageId: gi(e, "clientMessageId", 128),
      content: gi(e, "content", 2e3),
      file: s,
      fileName: gi(e, "fileName", 300),
      mimeType: gi(e, "mimeType", 100)
    })
  );
});
Es.post("/:id/handoff", async (t) => {
  const e = ek.parse(await t.req.json()), s = await N(t.env);
  return q(await s.conversations.setHandoff(t.req.param("id"), e.status));
});
Es.post("/:id/resolve", async (t) => {
  const e = await N(t.env);
  return q(await e.conversations.resolve(t.req.param("id")));
});
function tk(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "stream" in t;
}
function gi(t, e, s) {
  const n = t.get(e);
  if (typeof n != "string") return;
  const r = n.trim();
  if (r) {
    if (r.length > s)
      throw new v("VALIDATION_ERROR", `${e} is too long`, 400);
    return r;
  }
}
function sk(t) {
  const e = Number(t);
  if (!Number.isInteger(e) || e < 0)
    throw new v("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
const kg = new Nt();
kg.get("/", (t) => t.json({ ok: !0 }));
const Kr = new Nt();
Kr.use("*", Us());
function nk(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "arrayBuffer" in t;
}
Kr.get("/documents", async (t) => {
  const e = await N(t.env);
  return q(await e.knowledge.listDocuments());
});
Kr.post("/documents", async (t) => {
  const e = await t.req.formData(), s = e.get("file");
  if (!nk(s))
    throw new v("VALIDATION_ERROR", "file is required", 400);
  const n = e.get("title"), r = await N(t.env);
  return Gt(
    await r.knowledge.uploadDocument({
      file: s,
      title: typeof n == "string" ? n : void 0,
      createdByAdminUserId: t.get("adminUserId")
    })
  );
});
Kr.post("/sync/ai-search", async (t) => {
  const e = await N(t.env);
  return q(await e.knowledge.syncFromAiSearch());
});
Kr.delete("/documents/:id", async (t) => (await (await N(t.env)).knowledge.deleteDocument(t.req.param("id")), mn()));
const be = new Nt();
be.use("*", Us());
be.get("/sources", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.listStorageSources());
});
be.post("/sources", async (t) => {
  const e = await N(t.env);
  return Gt(await e.fileBrowser.createStorageSource(await t.req.json()));
});
be.put("/sources/:id", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.updateStorageSource(t.req.param("id"), await t.req.json()));
});
be.delete("/sources/:id", async (t) => (await (await N(t.env)).fileBrowser.deleteStorageSource(t.req.param("id")), mn()));
be.post("/sources/:id/test", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.testStorageSource(t.req.param("id")));
});
be.get("/mounts", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.listMounts());
});
be.post("/mounts", async (t) => {
  const e = await N(t.env);
  return Gt(await e.fileBrowser.createMount(await t.req.json()));
});
be.put("/mounts/:id", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.updateMount(t.req.param("id"), await t.req.json()));
});
be.patch("/mounts/:id/active", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  return await e.fileBrowser.setMountActive(t.req.param("id"), !!s.isActive), mn();
});
be.delete("/mounts/:id", async (t) => (await (await N(t.env)).fileBrowser.deleteMount(t.req.param("id")), mn()));
be.get("/mounts/:id/browse", async (t) => {
  const e = await N(t.env), s = t.req.param("id"), n = {
    path: t.req.query("path") ?? "/",
    nextToken: t.req.query("nextToken") || void 0
  };
  return q(await e.fileBrowser.browse(s, n));
});
be.post("/mounts/:id/upload", async (t) => {
  const e = await N(t.env), s = await t.req.formData(), n = s.get("file");
  if (!rk(n))
    throw new v("VALIDATION_ERROR", "file is required", 400);
  const r = await e.fileBrowser.uploadFile(t.req.param("id"), {
    path: s.get("path") ?? "/"
  }, n);
  return Gt(r);
});
be.post("/mounts/:id/multipart", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  if (!s.fileName) throw new v("VALIDATION_ERROR", "fileName is required", 400);
  const { uploadId: n } = await e.fileBrowser.createMultipartUpload(t.req.param("id"), {
    path: s.path ?? "/",
    fileName: s.fileName,
    contentType: s.contentType
  });
  return Gt({ uploadId: n });
});
be.put("/mounts/:id/multipart/:uploadId/part", async (t) => {
  const e = await N(t.env), s = Number(t.req.query("partNumber")), n = t.req.query("fileName"), r = t.req.query("path") ?? "/";
  if (!Number.isInteger(s) || s < 1)
    throw new v("VALIDATION_ERROR", "invalid partNumber", 400);
  if (!n) throw new v("VALIDATION_ERROR", "fileName is required", 400);
  const a = await t.req.arrayBuffer(), { etag: i } = await e.fileBrowser.uploadPart(t.req.param("id"), {
    path: r,
    fileName: n,
    uploadId: t.req.param("uploadId"),
    partNumber: s
  }, new Uint8Array(a));
  return q({ partNumber: s, etag: i });
});
be.post("/mounts/:id/multipart/:uploadId/complete", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  if (!s.fileName || !Array.isArray(s.parts))
    throw new v("VALIDATION_ERROR", "fileName and parts are required", 400);
  const n = await e.fileBrowser.completeMultipartUpload(t.req.param("id"), {
    path: s.path ?? "/",
    fileName: s.fileName,
    uploadId: t.req.param("uploadId"),
    totalSize: s.totalSize ?? 0
  }, s.parts);
  return Gt(n);
});
be.post("/mounts/:id/multipart/:uploadId/abort", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  return await e.fileBrowser.abortMultipartUpload(t.req.param("id"), {
    path: s.path ?? "/",
    fileName: s.fileName,
    uploadId: t.req.param("uploadId")
  }), mn();
});
be.post("/mounts/:id/folder", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  return Gt(
    await e.fileBrowser.createFolder(t.req.param("id"), {
      path: s.path ?? "/",
      name: s.name
    })
  );
});
be.delete("/mounts/:id/path", async (t) => {
  const e = await N(t.env), s = t.req.query("path");
  if (!s) throw new v("VALIDATION_ERROR", "path is required", 400);
  return await e.fileBrowser.deletePath(t.req.param("id"), { path: s }), mn();
});
be.post("/mounts/:id/rename", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  return await e.fileBrowser.renamePath(t.req.param("id"), s), mn();
});
be.get("/mounts/:id/url", async (t) => {
  const e = await N(t.env), s = t.req.query("path");
  if (!s) throw new v("VALIDATION_ERROR", "path is required", 400);
  return q(await e.fileBrowser.getPublicUrl(t.req.param("id"), { path: s }));
});
be.get("/mounts/:id/raw", async (t) => {
  const e = await N(t.env), s = t.req.query("path");
  if (!s) throw new v("VALIDATION_ERROR", "path is required", 400);
  const n = await e.fileBrowser.download(t.req.param("id"), { path: s }), r = new Headers();
  n.contentType && r.set("content-type", n.contentType);
  const a = n.name.replace(/["\\]/g, "_");
  return r.set(
    "content-disposition",
    `inline; filename="${a}"; filename*=UTF-8''${encodeURIComponent(n.name)}`
  ), r.set("cache-control", "private, max-age=300"), new Response(n.body, { headers: r });
});
be.post("/mounts/:id/share", async (t) => {
  const e = await N(t.env), s = await t.req.json();
  if (!s.path) throw new v("VALIDATION_ERROR", "path is required", 400);
  return Gt(
    await e.fileBrowser.createShareLink(t.req.param("id"), { path: s.path }, { ttlMs: s.ttlMs })
  );
});
be.get("/mounts/:id/shares", async (t) => {
  const e = await N(t.env);
  return q(await e.fileBrowser.listShareLinks(t.req.param("id")));
});
be.delete("/shares/:token", async (t) => (await (await N(t.env)).fileBrowser.revokeShareLink(t.req.param("token")), mn()));
function rk(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "arrayBuffer" in t;
}
const Rg = new Nt();
Rg.get("/:identifier", async (t) => {
  const e = await N(t.env);
  try {
    const { url: s } = await e.fileBrowser.resolveShare(t.req.param("identifier"));
    return t.redirect(s, 302);
  } catch (s) {
    const n = s instanceof v, r = n ? s.status : 500, a = n ? r >= 500 ? "服务器错误" : "链接不可用" : "服务器错误", i = n ? s.message : "内部错误，请稍后再试", o = `<!doctype html><meta charset="utf-8"><title>分享链接</title><body style="font-family:system-ui,sans-serif;padding:48px;text-align:center;color:#0f172a"><h3>${a}</h3><p style="color:#64748b">${i}</p></body>`;
    return new Response(o, { status: r, headers: { "content-type": "text/html; charset=utf-8" } });
  }
});
const Og = new Nt();
Og.post("/:channelAccountId", async (t) => {
  try {
    const e = await N(t.env), s = await e.channels.getAccount(t.req.param("channelAccountId")), n = e.channels.getAdapter(s);
    await n.verify(t.req.raw.clone(), s);
    const r = await e.channels.getAccountByType("telegram"), a = (r == null ? void 0 : r.externalAccountId) ?? void 0, i = await n.parseInbound(t.req.raw.clone(), s, a);
    let o = 0, c = 0, d = 0, l = 0, u = 0, h = 0;
    for (const g of i) {
      if (g.agentReply) {
        try {
          await e.messages.sendAgentMessage({
            conversationId: g.agentReply.replyToConversationId,
            content: g.content ?? ""
          }), u += 1;
        } catch (w) {
          h += 1, ts.warn("agent_reply_send_failed", {
            requestId: t.get("requestId"),
            conversationId: g.agentReply.replyToConversationId,
            error: w instanceof Error ? w.message : String(w)
          });
        }
        continue;
      }
      const _ = await e.conversations.receiveInboundMessage({ channelAccount: s, inbound: g });
      if (_.duplicate)
        c += 1;
      else {
        o += 1;
        const b = (g.messageType === "image" ? "[图片] " : "") + (g.content ?? "").substring(0, 300);
        t.executionCtx.waitUntil(
          e.notification.notify(
            `📩 <b>${s.channelType === "telegram" ? "Telegram" : "Webhook"} 新消息</b>
来自：${g.contactName}

${b}${(g.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${_.conversationId}`
          )
        );
      }
      if (_.aiMessage) {
        d += 1;
        try {
          const w = await n.sendMessage(s, {
            conversationId: _.conversationId,
            externalThreadId: g.externalThreadId,
            messageId: _.aiMessage.id,
            messageType: "text",
            content: _.aiMessage.content ?? ""
          });
          await e.messages.markSent(_.aiMessage.id, w.externalMessageId), ts.info("ai_reply_sent", {
            requestId: t.get("requestId"),
            conversationId: _.conversationId,
            messageId: _.aiMessage.id,
            externalMessageId: w.externalMessageId
          });
        } catch (w) {
          await e.messages.markFailed(
            _.aiMessage.id,
            w instanceof Error ? w.message : "AI reply send failed"
          ), l += 1, ts.warn("ai_reply_send_failed", {
            requestId: t.get("requestId"),
            conversationId: _.conversationId,
            messageId: _.aiMessage.id,
            error: w instanceof Error ? w.message : String(w)
          });
        }
      }
    }
    const f = {
      received: i.length,
      accepted: o,
      duplicates: c,
      aiReplies: d,
      aiReplySendFailures: l,
      agentReplies: u,
      agentReplySendFailures: h
    };
    return q(f);
  } catch (e) {
    const s = e instanceof Error ? e.message : String(e);
    return ts.error("webhook_unhandled_error", { message: s }), t.json({
      error: {
        code: "WEBHOOK_ERROR",
        message: s
      }
    }, 500);
  }
});
const rt = new Nt();
rt.use("*", Yy());
rt.use(
  "*",
  Sy({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "Range",
      "X-Admin-User-Id",
      "X-Debug-Response",
      "X-Request-Id",
      "X-Supportly-Signature",
      "X-Telegram-Bot-Api-Secret-Token"
    ],
    exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Range", "Content-Type", "X-Request-Id"],
    maxAge: 86400
  })
);
rt.use("*", Zy());
rt.route("/health", kg);
rt.route("/api/auth", Fs);
rt.route("/api/channels", Xn);
rt.route("/api/conversations", Es);
rt.route("/api/knowledge", Kr);
rt.route("/api/storage", be);
rt.route("/api/share", Rg);
(async () => {
  {
    const { adminRoutes: t } = await Promise.resolve().then(() => cR);
    rt.route("/api/admin", t);
  }
  {
    const { widgetRoutes: t } = await Promise.resolve().then(() => mR);
    rt.route("/api/widget", t);
  }
  {
    const { forumRoutes: t } = await Promise.resolve().then(() => TR);
    rt.route("/api/forum", t);
  }
})();
rt.route("/webhooks", Og);
rt.onError((t, e) => dp(t, e));
rt.notFound((t) => t.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
class UR {
  constructor(e, s) {
    this.state = e, this.env = s;
  }
  async fetch(e) {
    var n;
    const s = new URL(e.url);
    return e.method === "POST" && s.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, s) {
    if (typeof s != "string") {
      cr(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(s).type === "ping") {
        cr(e, { type: "pong", serverTime: V() });
        return;
      }
      cr(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      cr(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const s = e.headers.get("x-supportly-admin-user-id");
    if (!s)
      return new Response("Missing admin identity", { status: 400 });
    const n = new WebSocketPair(), r = n[0], a = n[1], i = {
      kind: "admin",
      adminUserId: s,
      connectedAt: V()
    };
    return a.serializeAttachment(i), this.state.acceptWebSocket(a), cr(a, { type: "connected", connectionKind: "admin", serverTime: V() }), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const s = await e.json().catch(() => null);
    return !s || s.type !== "message.new" && s.type !== "conversation.updated" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(s), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const s of this.state.getWebSockets())
      cr(s, e);
  }
}
function cr(t, e) {
  if (t.readyState === 1)
    try {
      t.send(JSON.stringify(e));
    } catch {
      t.close(1011, "Send failed");
    }
}
class FR {
  constructor(e, s) {
    this.state = e, this.env = s;
  }
  async fetch(e) {
    var n;
    const s = new URL(e.url);
    return e.method === "POST" && s.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, s) {
    if (typeof s != "string") {
      dr(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(s).type === "ping") {
        dr(e, { type: "pong", serverTime: V() });
        return;
      }
      dr(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      dr(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const s = e.headers.get("x-supportly-conversation-id"), n = e.headers.get("x-supportly-visitor-id");
    if (!s || !n)
      return new Response("Missing connection identity", { status: 400 });
    const r = new WebSocketPair(), a = r[0], i = r[1], o = {
      kind: "visitor",
      conversationId: s,
      visitorId: n,
      connectedAt: V()
    };
    return i.serializeAttachment(o), this.state.acceptWebSocket(i), dr(i, { type: "connected", connectionKind: "visitor", serverTime: V() }), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const s = await e.json().catch(() => null);
    return !s || s.type !== "message.new" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(s), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const s of this.state.getWebSockets())
      dr(s, e);
  }
}
function dr(t, e) {
  if (t.readyState === 1)
    try {
      t.send(JSON.stringify(e));
    } catch {
      t.close(1011, "Send failed");
    }
}
const Af = 3e4, ak = 6e4;
class $R {
  constructor(e, s) {
    p(this, "onlineUsers", /* @__PURE__ */ new Set());
    p(this, "heartbeatMap", /* @__PURE__ */ new Map());
    this.state = e, this.env = s;
  }
  async fetch(e) {
    var n;
    const s = new URL(e.url);
    return e.method === "POST" && s.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  async alarm() {
    const e = Date.now();
    let s = !1;
    for (const [n, r] of this.heartbeatMap)
      e - r > ak && (this.heartbeatMap.delete(n), this.onlineUsers.delete(n), s = !0);
    s && this.broadcastPresence(), this.heartbeatMap.size > 0 && await this.state.storage.setAlarm(Date.now() + Af);
  }
  webSocketMessage(e, s) {
    if (typeof s != "string") {
      _n(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(s).type === "ping") {
        const r = e.deserializeAttachment();
        r != null && r.userId && this.heartbeatMap.set(r.userId, Date.now()), _n(e, { type: "pong", serverTime: V() });
        return;
      }
      _n(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      _n(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketClose(e, s, n, r) {
    const a = e.deserializeAttachment();
    a != null && a.userId && (this.onlineUsers.delete(a.userId), this.heartbeatMap.delete(a.userId), this.broadcastPresence());
  }
  webSocketError(e) {
    const s = e.deserializeAttachment();
    s != null && s.userId && (this.onlineUsers.delete(s.userId), this.heartbeatMap.delete(s.userId), this.broadcastPresence()), e.close(1011, "WebSocket error");
  }
  async handleWebSocket(e) {
    const s = e.headers.get("x-supportly-end-user-id");
    if (!s)
      return new Response("Missing end user identity", { status: 400 });
    const n = new WebSocketPair(), r = n[0], a = n[1], i = {
      kind: "end_user",
      userId: s,
      connectedAt: V()
    };
    return a.serializeAttachment(i), this.state.acceptWebSocket(a), this.onlineUsers.add(s), this.heartbeatMap.set(s, Date.now()), _n(a, { type: "connected", connectionKind: "end_user", serverTime: V() }), this.broadcastPresence(), await this.state.storage.setAlarm(Date.now() + Af), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const s = await e.json().catch(() => null);
    return s ? (s.type === "message.new" && s.targetUserId && s.payload && this.sendToUser(s.targetUserId, s.payload), this.broadcastPresence(), new Response(null, { status: 204 })) : new Response("Invalid notify event", { status: 400 });
  }
  sendToUser(e, s) {
    for (const n of this.state.getWebSockets()) {
      const r = n.deserializeAttachment();
      (r == null ? void 0 : r.userId) === e && _n(n, s);
    }
  }
  broadcastPresence() {
    const e = {
      type: "end_user.presence",
      onlineUserIds: Array.from(this.onlineUsers)
    };
    for (const s of this.state.getWebSockets())
      _n(s, e);
  }
}
function _n(t, e) {
  if (t.readyState === 1)
    try {
      t.send(JSON.stringify(e));
    } catch {
      t.close(1011, "Send failed");
    }
}
async function ik(t, e) {
  return await t.prepare("SELECT * FROM qhost_nodes WHERE id = ? AND enabled = 1").bind(e).first() || null;
}
class xf extends Error {
  constructor(s, n, r = "", a = null) {
    super(s);
    p(this, "status");
    p(this, "detail");
    p(this, "data");
    this.name = "PveRequestError", this.status = n, this.detail = r, this.data = a;
  }
}
function ok(t) {
  const e = (t.verify_ssl, "https"), s = t.host.includes(":") && !t.host.startsWith("[") ? `[${t.host}]` : t.host;
  return `${e}://${s}:${t.port}/api2/json`;
}
async function ck(t) {
  const e = `${ok(t)}/access/ticket`, s = `${t.user}@${t.realm}`;
  let n;
  try {
    n = await fetch(e, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: s, password: t.password || "" }).toString()
    });
  } catch (a) {
    throw new xf(`PVE login unreachable: ${a.message}`, 0);
  }
  const r = await n.json().catch(() => null);
  if (!n.ok || !(r != null && r.data))
    throw new xf(`PVE login failed: ${(r == null ? void 0 : r.message) || n.status}`, n.status);
  return { ticket: r.data.ticket, csrf: r.data.CSRFPreventionToken };
}
class LR extends $g {
  async fetch(e) {
    const n = new URL(e.url).pathname.match(/^\/console\/(\d+)\/(\d+)$/);
    if (!n)
      return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    const r = parseInt(n[1], 10), a = parseInt(n[2], 10);
    return !Number.isInteger(r) || !Number.isInteger(a) ? new Response(JSON.stringify({ error: "invalid node/vmid" }), { status: 400 }) : this.openConsole(e, r, a);
  }
  async openConsole(e, s, n) {
    const r = await ik(this.env.DB, s);
    if (!r)
      return new Response(JSON.stringify({ error: "node not found or disabled" }), { status: 404 });
    let a;
    try {
      a = (await ck(r)).ticket;
    } catch (w) {
      return new Response(JSON.stringify({ error: `PVE login failed: ${w.message}` }), { status: 502 });
    }
    let i;
    try {
      const w = await fetch(
        `https://${r.host}:${r.port}/api2/json/nodes/${r.name}/lxc/${n}/termproxy`,
        {
          method: "POST",
          headers: {
            Cookie: `PVEAuthCookie=${a}`,
            CSRFPreventionToken: ""
          }
        }
      ), b = await w.json().catch(() => null);
      if (!w.ok || !(b != null && b.data))
        return new Response(JSON.stringify({ error: `termproxy failed: ${(b == null ? void 0 : b.message) || w.status}` }), { status: 502 });
      i = b.data;
    } catch (w) {
      return new Response(JSON.stringify({ error: `termproxy unreachable: ${w.message}` }), { status: 502 });
    }
    const o = new WebSocketPair(), [c, d] = Object.values(o);
    this.ctx.accept(d);
    const l = d, h = `${dk(r.verify_ssl)}://${r.host}:${r.port}/api2/json/nodes/${r.name}/lxc/${n}/termproxy?port=${i.port}&vncticket=${encodeURIComponent(i.ticket)}`;
    let f = null;
    const g = (w) => {
      try {
        l.send(w);
      } catch {
      }
    }, _ = (w) => {
      try {
        f == null || f.send(w);
      } catch {
      }
    };
    l.onmessage = (w) => {
      if (typeof w.data == "string" && w.data.startsWith("__close__")) {
        l.close(), f == null || f.close();
        return;
      }
      _(w.data);
    }, l.onclose = () => {
      try {
        f == null || f.close();
      } catch {
      }
    }, l.onerror = () => {
      try {
        f == null || f.close();
      } catch {
      }
    };
    try {
      f = new WebSocket(h);
    } catch {
      return l.close(1011, "failed to reach pve termproxy"), new Response(null, { status: 101 });
    }
    return f.onopen = () => {
      g("__connected__");
    }, f.onmessage = (w) => {
      g(w.data);
    }, f.onclose = () => {
      try {
        l.close();
      } catch {
      }
    }, f.onerror = () => {
      try {
        l.close();
      } catch {
      }
    }, new Response(null, { status: 101, webSocket: c });
  }
}
function dk(t) {
  return "wss";
}
async function lk(t, e) {
  const s = await t.prepare(
    `INSERT INTO qtrade_decisions (inst_id, action, confidence, leverage, margin_usdt, entry_price, take_profit_price, stop_loss_price, risk_reward_ratio, reason, strategy_tag, llm_model, llm_provider, cycle_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`
  ).bind(
    e.inst_id,
    e.action,
    e.confidence,
    e.leverage,
    e.margin_usdt || null,
    e.entry_price || null,
    e.take_profit_price || null,
    e.stop_loss_price || null,
    e.risk_reward_ratio || null,
    e.summary_reason || null,
    e.strategy_tag || "default",
    e.llm_model || null,
    e.llm_provider || null,
    e.cycle_id || null
  ).first();
  return (s == null ? void 0 : s.id) ?? 0;
}
async function uk(t, e) {
  const s = await t.prepare(
    `INSERT INTO qtrade_orders (order_id, inst_id, side, pos_side, order_type, price, size, leverage, venue, strategy_tag, decision_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id`
  ).bind(
    e.order_id || null,
    e.inst_id,
    e.side,
    e.pos_side,
    e.order_type || "market",
    e.price || null,
    e.size,
    e.leverage || 1,
    e.venue || "paper",
    e.strategy_tag || "default",
    e.decision_id || null
  ).first();
  return (s == null ? void 0 : s.id) ?? 0;
}
async function hk(t) {
  return (await t.prepare(
    `SELECT * FROM qtrade_orders WHERE state IN ('pending','open','partially_filled')
     ORDER BY created_at DESC`
  ).all()).results || [];
}
async function fk(t, e = 100) {
  return (await t.prepare(
    "SELECT * FROM qtrade_trades WHERE status = 'closed' ORDER BY close_time DESC LIMIT ?"
  ).bind(e).all()).results || [];
}
async function pk(t) {
  return (await t.prepare(
    "SELECT * FROM qtrade_trades WHERE status = 'open'"
  ).all()).results || [];
}
async function mk(t, e, s, n, r) {
  await t.prepare(
    `UPDATE qtrade_trades SET status = 'closed', close_price = ?, pnl = ?, net_pnl = ? - fees, fees = ?, close_time = datetime('now')
     WHERE id = ? AND status = 'open'`
  ).bind(s, n, n, r, e).run();
}
async function gk(t, e = 14) {
  return ((await t.prepare(
    `SELECT date(snapshot_time) as date, total_eq FROM qtrade_equity_snapshots
     WHERE snapshot_time >= datetime('now', ?)
     GROUP BY date(snapshot_time)
     ORDER BY date ASC`
  ).bind(`-${e} days`).all()).results || []).map((n) => ({ date: n.date, equity: n.total_eq }));
}
async function He(t, e, s, n) {
  await t.prepare(
    "INSERT INTO qtrade_logs (level, message, source) VALUES (?, ?, ?)"
  ).bind(e, s, n).run();
}
async function yk(t, e = 60) {
  return ((await t.prepare(
    "SELECT level, message, created_at FROM qtrade_logs ORDER BY created_at DESC LIMIT ?"
  ).bind(e).all()).results || []).map((n) => `[${n.created_at}] [${n.level.toUpperCase()}] ${n.message}`);
}
async function wk(t, e = 60) {
  return (await t.prepare(
    "SELECT created_at, level, message, source FROM qtrade_logs ORDER BY created_at DESC LIMIT ?"
  ).bind(e).all()).results || [];
}
async function _k(t, e) {
  const s = await t.prepare("SELECT value FROM qtrade_config WHERE key = ?").bind(e).first();
  return (s == null ? void 0 : s.value) ?? null;
}
async function vk(t) {
  const e = await t.prepare("SELECT key, value FROM qtrade_config").all(), s = {};
  for (const n of e.results || [])
    s[n.key] = n.value;
  return s;
}
async function bk(t, e = !0) {
  let s = "SELECT * FROM qtrade_instruments";
  return e && (s += " WHERE enabled = 1"), s += " ORDER BY inst_id ASC", (await t.prepare(s).all()).results || [];
}
async function Sk(t) {
  const e = await t.prepare(
    "SELECT * FROM qtrade_strategies WHERE enabled = 1 ORDER BY priority DESC LIMIT 1"
  ).first();
  if (!e) return null;
  const s = e;
  return s.config_json = typeof s.config_json == "string" ? JSON.parse(s.config_json) : s.config_json || {}, s;
}
async function Ek(t) {
  return (await t.prepare(
    "SELECT * FROM qtrade_llm_providers WHERE enabled = 1 ORDER BY priority DESC"
  ).all()).results || [];
}
async function Ak(t) {
  const e = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), n = await t.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN status = 'closed' THEN net_pnl ELSE 0 END), 0) as net_realized,
       COALESCE(SUM(fees), 0) as fees_paid,
       COUNT(CASE WHEN status = 'closed' AND net_pnl > 0 THEN 1 END) as win_trades,
       COUNT(CASE WHEN status = 'closed' AND net_pnl < 0 THEN 1 END) as loss_trades
     FROM qtrade_trades
     WHERE date(close_time) = ?`
  ).bind(e).first() || {}, r = n.net_realized || 0, a = (n.win_trades || 0) + (n.loss_trades || 0);
  return {
    realized_gross: r + n.fees_paid,
    fees_paid: n.fees_paid || 0,
    net_realized: r,
    win_trades: n.win_trades || 0,
    loss_trades: n.loss_trades || 0,
    win_rate: a > 0 ? (n.win_trades || 0) / a : 0,
    source: "db"
  };
}
async function xk(t) {
  const s = await t.prepare(
    `SELECT
       COALESCE(SUM(net_pnl), 0) as total_pnl,
       COUNT(CASE WHEN net_pnl > 0 THEN 1 END) as wins,
       COUNT(CASE WHEN net_pnl < 0 THEN 1 END) as losses,
       COALESCE(AVG(CASE WHEN net_pnl > 0 THEN net_pnl END), 0) as avg_win,
       COALESCE(AVG(CASE WHEN net_pnl < 0 THEN net_pnl END), 0) as avg_loss,
       COALESCE(SUM(CASE WHEN net_pnl > 0 THEN net_pnl END), 0) as total_wins,
       COALESCE(ABS(SUM(CASE WHEN net_pnl < 0 THEN net_pnl END)), 0) as total_losses
     FROM qtrade_trades WHERE status = 'closed'`
  ).first() || {}, n = s.total_pnl || 0, r = s.wins || 0, a = s.losses || 0, i = r + a, o = parseFloat(await _k(t, "initial_capital") || "10000");
  return {
    total_cum_net_pnl: n,
    total_cum_realized_pnl: n,
    cum_roi_pct: o > 0 ? n / o * 100 : 0,
    profit_factor: s.total_losses > 0 ? (s.total_wins || 0) / s.total_losses : r > 0 ? 1 / 0 : 0,
    avg_win: s.avg_win || 0,
    avg_loss: Math.abs(s.avg_loss || 0),
    win_rate: i > 0 ? r / i : 0
  };
}
const Wr = new Nt();
Wr.get("/", async (t) => {
  try {
    const e = await t.env.DB.prepare(
      `SELECT id, venue, display_name, enabled, testnet,
              api_key IS NOT NULL AND api_key != '' AS has_key,
              created_at, updated_at
       FROM qtrade_venues ORDER BY venue`
    ).all();
    return t.json({ venues: e.results || [] });
  } catch (e) {
    return t.json({ error: e.message }, 500);
  }
});
Wr.get("/:id", async (t) => {
  const e = parseInt(t.req.param("id"), 10);
  if (isNaN(e)) return t.json({ error: "invalid id" }, 400);
  try {
    const s = await t.env.DB.prepare(
      "SELECT * FROM qtrade_venues WHERE id = ?"
    ).bind(e).first();
    if (!s) return t.json({ error: "Venue not found" }, 404);
    const n = { ...s };
    return n.api_key && (n.api_key = Pc(n.api_key)), n.api_secret && (n.api_secret = Pc(n.api_secret)), n.api_passphrase && (n.api_passphrase = Pc(n.api_passphrase)), t.json({ venue: n });
  } catch (s) {
    return t.json({ error: s.message }, 500);
  }
});
Wr.post("/", async (t) => {
  try {
    const e = await t.req.json(), { id: s, venue: n, display_name: r, enabled: a, testnet: i, api_key: o, api_secret: c, api_passphrase: d, extra_config: l } = e;
    if (!n || !r)
      return t.json({ error: "venue and display_name are required" }, 400);
    if (s) {
      const u = ["venue = ?", "display_name = ?"], h = [n, r];
      a !== void 0 && (u.push("enabled = ?"), h.push(a ? 1 : 0)), i !== void 0 && (u.push("testnet = ?"), h.push(i ? 1 : 0)), o && (u.push("api_key = ?"), h.push(o)), c && (u.push("api_secret = ?"), h.push(c)), d && (u.push("api_passphrase = ?"), h.push(d)), l && (u.push("extra_config = ?"), h.push(typeof l == "string" ? l : JSON.stringify(l))), u.push("updated_at = datetime('now')"), await t.env.DB.prepare(
        `UPDATE qtrade_venues SET ${u.join(", ")} WHERE id = ?`
      ).bind(...h, s).run();
    } else
      await t.env.DB.prepare(
        `INSERT INTO qtrade_venues (venue, display_name, enabled, testnet, api_key, api_secret, api_passphrase, extra_config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        n,
        r,
        a !== void 0 ? a ? 1 : 0 : 1,
        i !== void 0 && i ? 1 : 0,
        o || null,
        c || null,
        d || null,
        l ? typeof l == "string" ? l : JSON.stringify(l) : null
      ).run();
    return await t.env.DB.prepare(
      "INSERT INTO qtrade_logs (level, message, source) VALUES ('info', ?, 'venues')"
    ).bind(`Venue '${n}' ${s ? "updated" : "created"}`).run(), t.json({ success: !0, venue: n });
  } catch (e) {
    return t.json({ error: e.message }, 500);
  }
});
Wr.delete("/:id", async (t) => {
  var s;
  const e = parseInt(t.req.param("id"), 10);
  if (isNaN(e)) return t.json({ error: "invalid id" }, 400);
  try {
    const n = await t.env.DB.prepare("SELECT venue FROM qtrade_venues WHERE id = ?").bind(e).first();
    return (n == null ? void 0 : n.venue) === "paper" ? t.json({ error: "Cannot delete paper trading venue" }, 400) : (s = (await t.env.DB.prepare("DELETE FROM qtrade_venues WHERE id = ?").bind(e).run()).meta) != null && s.changes ? (await t.env.DB.prepare(
      "INSERT INTO qtrade_logs (level, message, source) VALUES ('warn', ?, 'venues')"
    ).bind(`Venue '${(n == null ? void 0 : n.venue) || e}' deleted`).run(), t.json({ success: !0 })) : t.json({ error: "Venue not found" }, 404);
  } catch (n) {
    return t.json({ error: n.message }, 500);
  }
});
async function Sa(t, e) {
  const s = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    s.encode(t),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), r = await crypto.subtle.sign("HMAC", n, s.encode(e));
  return btoa(String.fromCharCode(...new Uint8Array(r)));
}
async function qn(t, e) {
  const s = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    s.encode(t),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), r = await crypto.subtle.sign("HMAC", n, s.encode(e));
  return [...new Uint8Array(r)].map((a) => a.toString(16).padStart(2, "0")).join("");
}
async function Ng(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(e)].map((s) => s.toString(16).padStart(2, "0")).join("");
}
async function Ck(t) {
  var l, u, h, f, g, _;
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim(), n = (t.api_passphrase || "").trim();
  if (!e || !s || !n)
    return { ok: !1, message: `OKX: API Key(${e ? "✓" : "✗"}) Secret(${s ? "✓" : "✗"}) Passphrase(${n ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const r = "GET", a = "/api/v5/account/balance?ccy=USDT", i = (/* @__PURE__ */ new Date()).toISOString(), o = await Sa(s, i + r + a), d = await (await fetch(`https://www.okx.com${a}`, {
    method: r,
    headers: {
      "OK-ACCESS-KEY": e,
      "OK-ACCESS-SIGN": o,
      "OK-ACCESS-TIMESTAMP": i,
      "OK-ACCESS-PASSPHRASE": n,
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(8e3)
  })).json();
  if (d.code === "0") {
    const w = (u = (l = d.data) == null ? void 0 : l[0]) == null ? void 0 : u.totalEq, b = ((_ = (g = (f = (h = d.data) == null ? void 0 : h[0]) == null ? void 0 : f.details) == null ? void 0 : g[0]) == null ? void 0 : _.ccy) || "USDT", I = w ? parseFloat(w) : void 0;
    return {
      ok: !0,
      balance: I,
      currency: b,
      message: `OKX 验证通过，账户总权益 $${(I == null ? void 0 : I.toFixed(2)) ?? "?"}`
    };
  }
  return { ok: !1, message: `OKX 认证失败 (${d.code}): ${d.msg || "请检查 API Key/Secret/Passphrase 是否正确"}` };
}
async function Ik(t) {
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim();
  if (!e || !s)
    return { ok: !1, message: `Binance: API Key(${e ? "✓" : "✗"}) Secret(${s ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const n = Date.now(), r = await qn(s, `timestamp=${n}`), a = await fetch(`https://fapi.binance.com/fapi/v1/account?timestamp=${n}&signature=${r}`, {
    headers: { "X-MBX-APIKEY": e, Accept: "application/json" },
    signal: AbortSignal.timeout(8e3)
  });
  if (a.ok) {
    const o = await a.json(), c = (o == null ? void 0 : o.totalWalletBalance) || "?";
    return { ok: !0, message: `Binance 验证通过，账户余额 $${parseFloat(c).toFixed(2)}` };
  }
  const i = await a.text();
  return { ok: !1, message: `Binance 认证失败 (${a.status}): ${i.slice(0, 200)}` };
}
async function Tk(t) {
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim();
  if (!e || !s)
    return { ok: !1, message: `Gate.io: API Key(${e ? "✓" : "✗"}) Secret(${s ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const n = "GET", r = "/api/v4/futures/usdt/accounts", a = "", i = await Ng(""), o = Math.floor(Date.now() / 1e3).toString(), c = `${n}
${r}
${a}
${i}
${o}`, d = await qn(s, c), l = await fetch(`https://api.gateio.ws${r}`, {
    method: n,
    headers: {
      KEY: e,
      SIGN: d,
      Timestamp: o,
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(8e3)
  });
  if (l.ok) {
    const h = await l.json();
    return { ok: !0, message: `Gate.io 验证通过，账户权益 $${(h == null ? void 0 : h.total) ?? "?"}` };
  }
  const u = await l.text();
  return { ok: !1, message: `Gate.io 认证失败 (${l.status}): ${u.slice(0, 200)}` };
}
const so = {
  okx: Ck,
  binance: Ik,
  gate: Tk
};
Wr.post("/:id/test", async (t) => {
  const e = parseInt(t.req.param("id"), 10);
  if (isNaN(e)) return t.json({ error: "invalid id" }, 400);
  try {
    const s = await t.env.DB.prepare(
      "SELECT * FROM qtrade_venues WHERE id = ?"
    ).bind(e).first();
    if (!s) return t.json({ error: "Venue not found" }, 404);
    const n = s;
    if (n.venue === "paper")
      return t.json({ success: !0, message: "Paper trading is always available" });
    const r = so[n.venue];
    if (!r)
      return t.json({
        success: !1,
        message: `Unsupported venue: ${n.venue}`
      });
    const a = await r(n);
    return await t.env.DB.prepare(
      "INSERT INTO qtrade_logs (level, message, source) VALUES (?, ?, 'venues')"
    ).bind(a.ok ? "info" : "error", a.message).run(), t.json({ success: a.ok, message: a.message });
  } catch (s) {
    return t.json({ error: s.message }, 500);
  }
});
async function pd(t, e = 6e3) {
  const s = Date.now();
  try {
    let n = "";
    if (t === "okx") n = "https://www.okx.com/api/v5/public/time";
    else if (t === "binance") n = "https://fapi.binance.com/fapi/v1/time";
    else if (t === "gate") n = "https://api.gateio.ws/api/v4/futures/usdt/contracts";
    else return { ok: !1, latency_ms: null, message: `Unknown venue: ${t}` };
    const r = await fetch(n, { method: "GET", signal: AbortSignal.timeout(e) }), a = Date.now() - s;
    return r.ok ? { ok: !0, latency_ms: a, message: `${t} 公共 API 可达（延迟 ${a}ms）` } : { ok: !1, latency_ms: a, message: `${t} 返回 HTTP ${r.status}` };
  } catch (n) {
    return { ok: !1, latency_ms: Date.now() - s, message: `${t} 连接失败: ${n.name}` };
  }
}
Wr.get("/health", async (t) => {
  try {
    const e = await t.env.DB.prepare(
      "SELECT value FROM qtrade_config WHERE key = 'venue_health'"
    ).first(), s = Date.now();
    if (e) {
      const o = JSON.parse(e.value);
      if (s - (o._checked_at || 0) < 6e4) {
        const { _checked_at: d, ...l } = o;
        return t.json({ health: l });
      }
    }
    const n = await t.env.DB.prepare(
      `SELECT venue, display_name, api_key, api_secret, api_passphrase
       FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper'`
    ).all(), r = {}, a = (n.results || []).map(async (o) => {
      const c = o.venue, d = !!(o.api_key && o.api_secret), l = so[c];
      if (d && l) {
        const u = Date.now();
        try {
          const h = await l(o), f = Date.now() - u;
          r[c] = {
            venue: c,
            display_name: o.display_name,
            ok: h.ok,
            latency_ms: f,
            message: h.message,
            balance: h.balance,
            currency: h.currency,
            mode: h.ok ? "authenticated" : "network_error",
            checked_at: (/* @__PURE__ */ new Date()).toISOString(),
            has_key: !0
          };
        } catch (h) {
          const f = Date.now() - u;
          r[c] = {
            venue: c,
            display_name: o.display_name,
            ok: !1,
            latency_ms: f,
            message: `测试异常: ${h.name}`,
            mode: "network_error",
            checked_at: (/* @__PURE__ */ new Date()).toISOString(),
            has_key: !0
          };
        }
      } else {
        const u = await pd(c);
        r[c] = {
          venue: c,
          display_name: o.display_name,
          ok: u.ok,
          latency_ms: u.latency_ms,
          message: u.message,
          mode: u.ok ? "public_fallback" : "network_error",
          checked_at: (/* @__PURE__ */ new Date()).toISOString(),
          has_key: !1
        };
      }
    });
    await Promise.allSettled(a);
    const i = { ...r, _checked_at: s };
    return await t.env.DB.prepare(
      "INSERT OR REPLACE INTO qtrade_config (key, value) VALUES ('venue_health', ?)"
    ).bind(JSON.stringify(i)).run(), t.json({ health: r });
  } catch (e) {
    return t.json({ error: e.message }, 500);
  }
});
function Pc(t) {
  return !t || t.length < 6 ? "******" : t.slice(0, 4) + "****" + t.slice(-4);
}
const kk = {
  "1m": "1m",
  "3m": "3m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1H": "1H",
  "2H": "2H",
  "4H": "4H",
  "6H": "6H",
  "12H": "12H",
  "1D": "1D"
}, Rk = {
  "1m": "1m",
  "3m": "3m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1H": "1h",
  "2H": "2h",
  "4H": "4h",
  "6H": "6h",
  "12H": "12h",
  "1D": "1d"
}, Ok = {
  "1m": "1m",
  "3m": "3m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1H": "1h",
  "2H": "2h",
  "4H": "4h",
  "6H": "6h",
  "12H": "12h",
  "1D": "1d"
};
function bl(t, e) {
  switch (e) {
    case "okx":
      return t;
    case "binance":
      return t.replace(/-/g, "").replace("SWAP", "");
    case "gate":
      return t.replace("-SWAP", "_USDT");
    default:
      return t;
  }
}
async function Nk(t, e, s) {
  var c;
  const n = bl(t, "okx"), r = kk[e] || "15m", a = `https://www.okx.com/api/v5/market/candles?instId=${n}&bar=${r}&limit=${s}`, i = await fetch(a, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8e3)
  });
  if (!i.ok) throw new Error(`OKX API ${i.status}`);
  const o = await i.json();
  if (o.code !== "0" || !((c = o.data) != null && c.length)) throw new Error(`OKX API error: ${o.msg}`);
  return o.data.map((d) => ({
    ts: Math.floor(parseInt(d[0]) / 1e3),
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
    vol: parseFloat(d[5])
  })).reverse();
}
async function Mk(t, e, s) {
  const n = bl(t, "binance"), r = Rk[e] || "15m", a = `https://fapi.binance.com/fapi/v1/klines?symbol=${n}&interval=${r}&limit=${s}`, i = await fetch(a, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8e3)
  });
  if (!i.ok) {
    const c = await i.text();
    throw new Error(`Binance API ${i.status}: ${c.slice(0, 200)}`);
  }
  return (await i.json()).map((c) => ({
    ts: Math.floor(c[0] / 1e3),
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    vol: parseFloat(c[5])
  }));
}
async function Dk(t, e, s) {
  const n = bl(t, "gate"), r = Ok[e] || "15m", a = `https://api.gateio.ws/api/v4/futures/usdt/candlesticks?contract=${n}&interval=${r}&limit=${s}`, i = await fetch(a, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8e3)
  });
  if (!i.ok) {
    const c = await i.text();
    throw new Error(`Gate API ${i.status}: ${c.slice(0, 200)}`);
  }
  return (await i.json()).map((c) => ({
    ts: parseInt(c[0]),
    open: parseFloat(c[5]),
    high: parseFloat(c[3]),
    low: parseFloat(c[4]),
    close: parseFloat(c[2]),
    vol: parseFloat(c[1])
  }));
}
const Pk = {
  okx: Nk,
  binance: Mk,
  gate: Dk
};
async function Bc(t, e, s, n) {
  const r = await t.prepare(
    "SELECT venue FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper' ORDER BY venue LIMIT 1"
  ).first();
  if (!r) return null;
  const a = r.venue, i = Pk[a];
  return i ? i(e, s, n) : null;
}
class HR {
  constructor(e, s) {
    p(this, "state");
    p(this, "env");
    p(this, "storage");
    p(this, "initialized", !1);
    /** 所有活跃的 WebSocket 连接 */
    p(this, "webSockets", /* @__PURE__ */ new Set());
    /** 客户端订阅的品种/周期，key: ws → "instId:bar" */
    p(this, "candleSub", /* @__PURE__ */ new Map());
    /** K 线内存缓存：key → { data, ts }，防 429 */
    p(this, "candleCache", /* @__PURE__ */ new Map());
    p(this, "CANDLE_CACHE_TTL", 3e5);
    // 5 分钟
    /** Factor 缓存（算好的）—— buildFactors 只读此缓存，不碰交易所 */
    p(this, "factorsCache", null);
    p(this, "FACTORS_CACHE_TTL", 3e5);
    // 5 分钟
    /** instruments 缓存（D1 数据极少变更，缓存避免高频查询） */
    p(this, "instrumentsCache", null);
    p(this, "INSTRUMENTS_CACHE_TTL", 3e5);
    // 5 分钟
    /** config / equity / logs / logMsgs 缓存 —— 每 10s alarm 不重复读 D1 */
    p(this, "configCache", null);
    p(this, "CONFIG_CACHE_TTL", 3e5);
    // 5 分钟
    p(this, "equityHistoryCache", null);
    p(this, "EQUITY_CACHE_TTL", 3e5);
    // 5 分钟
    p(this, "logsCache", null);
    p(this, "LOGS_CACHE_TTL", 6e4);
    // 1 分钟
    p(this, "logMsgsCache", null);
    p(this, "LOGMSGS_CACHE_TTL", 6e4);
    // 1 分钟
    p(this, "tradesCache", null);
    p(this, "TRADES_CACHE_TTL", 3e5);
    // 5 分钟
    /** AI 提供商健康缓存（alarm 驱动，5 分钟刷新） */
    p(this, "aiProviderHealthCache", null);
    p(this, "_lastAIProviderCheck", 0);
    /** 交易所仓位同步缓存（从交易所 API 拉取，非本地 orders/trades 表） */
    p(this, "exchangePositionsCache", null);
    p(this, "exchangeOrdersCache", null);
    p(this, "_lastExchangeSync", 0);
    /** ── DO 内存缓存（高频动态数据不重复读 D1，由事件驱动更新） ── */
    p(this, "positionsCache", []);
    // open trades
    p(this, "ordersCache", []);
    // pending orders
    p(this, "todayStatsCache", {
      realized_gross: 0,
      fees_paid: 0,
      net_realized: 0,
      win_trades: 0,
      loss_trades: 0,
      win_rate: 0,
      source: "memory"
    });
    p(this, "exchangeBalance", null);
    // 交易所余额缓存
    p(this, "venueHealthCache", null);
    /** DRYRUN 模式相关 */
    p(this, "dryrunOrders", []);
    // DRYRUN mode simulated orders
    p(this, "dryrunMode", !1);
    // current DRYRUN/LIVE mode
    /** 错峰拉取：当前轮到的索引 */
    p(this, "staggerIndex", 0);
    /** 预拉取 K 线缓存错峰索引 */
    p(this, "_prefetchIndex", 0);
    /** ── 止盈止损（SL/TP）价跟踪：key = inst_id:venue，用于 auto-close ── */
    p(this, "sltpMap", /* @__PURE__ */ new Map());
    /** 自动交易所健康检查（alarm 驱动，用公开 ping，无需 API key） */
    p(this, "_lastHealthCheck", 0);
    this.state = e, this.env = s, this.storage = /* @__PURE__ */ new Map();
  }
  async initialize() {
    var r, a, i;
    if (this.initialized) return;
    this.initialized = !0;
    const e = await ((r = this.state.storage) == null ? void 0 : r.get("trader_state"));
    if (e)
      for (const [o, c] of Object.entries(e))
        this.storage.set(o, c);
    const s = await ((a = this.state.storage) == null ? void 0 : a.get("dryrun_orders"));
    if (s)
      try {
        this.dryrunOrders = JSON.parse(s);
      } catch {
        this.dryrunOrders = [];
      }
    const n = await ((i = this.state.storage) == null ? void 0 : i.get("dryrun_mode"));
    this.dryrunMode = n === "true";
    try {
      this.positionsCache = await pk(this.env.DB), this.ordersCache = await hk(this.env.DB);
      const o = await Ak(this.env.DB);
      o && (this.todayStatsCache = o);
    } catch {
    }
    await this.loadExchangeSyncCache(), await He(this.env.DB, "info", "TraderDO initialized", "trader-do");
  }
  /** 缓存版 getInstruments —— 避免每 10s alarm 重复读 D1 */
  async getCachedInstruments(e) {
    if (this.instrumentsCache && Date.now() - this.instrumentsCache.ts < this.INSTRUMENTS_CACHE_TTL)
      return this.instrumentsCache.data;
    const s = await bk(e);
    return s.length > 0 && (this.instrumentsCache = { data: s, ts: Date.now() }), s;
  }
  // ── Main request handler ──
  async fetch(e) {
    if (await this.initialize(), e.headers.get("Upgrade") === "websocket") {
      const s = new WebSocketPair(), [n, r] = Object.values(s);
      return this.state.acceptWebSocket(r), this.webSockets.add(r), r.send(JSON.stringify({ type: "connected", message: "TraderDO Hibernation WebSocket" })), this.state.storage.getAlarm().then((a) => {
        a === null && this.state.storage.setAlarm(Date.now() + 15e3);
      }), new Response(null, { status: 101, webSocket: n });
    }
    if (e.method === "POST") {
      const s = await e.json();
      return this.handleCommand(s);
    }
    if (e.method === "GET") {
      const s = new URL(e.url);
      if (s.pathname === "/api/dashboard") {
        const n = await this.assembleDashboardData();
        return new Response(JSON.stringify(n), {
          headers: { "Content-Type": "application/json" }
        });
      }
      return s.pathname === "/status" || s.pathname === "/api/status" ? this.getAutoRunStatus() : this.getState();
    }
    return new Response("Method not allowed", { status: 405 });
  }
  // ── DO Hibernation 钩子 ──────────────────────────────────
  /**
   * DO 从休眠中唤醒，收到 WebSocket 消息时调用此方法。
   * Hibernation API 接管后，所有消息均通过此钩子处理（无论休眠/活跃态）。
   */
  async webSocketMessage(e, s) {
    try {
      await this.initialize(), await this.handleWSMessage(e, s);
    } catch (n) {
      try {
        e.send(JSON.stringify({ type: "error", message: `webSocketMessage: ${String(n)}` }));
      } catch {
      }
    }
  }
  /** WebSocket 关闭时清理 */
  async webSocketClose(e, s, n, r) {
    this.webSockets.delete(e), this.candleSub.delete(e);
  }
  /** Alarm 驱动：定时从交易所拉取最新 K 线 → 内存缓存 → WS 推送 + 心跳 */
  async alarm() {
    if (await this.initialize(), await this.prefetchAllCandleCaches(), this.webSockets.size > 0 && await this.broadcastAllCandles(), this.webSockets.size > 0) {
      const r = JSON.stringify({ type: "ping" });
      for (const a of this.webSockets)
        try {
          a.send(r);
        } catch {
          this.webSockets.delete(a), this.candleSub.delete(a);
        }
    }
    if (!this.factorsCache || Date.now() - this.factorsCache.ts >= this.FACTORS_CACHE_TTL)
      try {
        const r = await this.getCachedInstruments(this.env.DB), a = await this.computeFactors(r);
        a.length > 0 && (this.factorsCache = { factors: a, ts: Date.now() });
      } catch {
      }
    if (!this.venueHealthCache || Date.now() - this._lastHealthCheck >= 3e5)
      try {
        await this.autoHealthCheck();
      } catch {
      }
    if (await this.autoAIProviderHealthCheck(), await this.syncExchangeData(), this.storage.get("auto_run") === !0) {
      const r = this.storage.get("auto_run_interval_seconds") || 60, a = this.storage.get("last_auto_run_time") || 0;
      Date.now() - a >= r * 1e3 && (this.storage.set("last_auto_run_time", Date.now()), this.processStrategy({ _auto: !0 }).then((i) => {
        this.webSockets.size > 0 && i.json().then((o) => {
          const c = JSON.stringify({ type: "auto_run_result", data: o });
          for (const d of this.webSockets)
            try {
              d.send(c);
            } catch {
            }
        }).catch(() => {
        });
      }).catch(() => {
      }));
    }
    await this.checkAutoClose(), this.state.storage.setAlarm(Date.now() + 1e4);
  }
  async autoHealthCheck() {
    const e = this.env.DB, s = Date.now(), n = await e.prepare(
      `SELECT venue, display_name, api_key, api_secret, api_passphrase
       FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper'`
    ).all(), r = {}, a = (n.results || []).map(async (i) => {
      const o = Date.now();
      if (i.api_key) {
        const d = so[i.venue];
        if (d) {
          try {
            const l = await d(i);
            r[i.venue] = {
              venue: i.venue,
              display_name: i.display_name,
              ok: l.ok,
              latency_ms: Date.now() - o,
              message: l.message,
              balance: l.balance,
              currency: l.currency,
              mode: l.ok ? "authenticated" : "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          } catch (l) {
            r[i.venue] = {
              venue: i.venue,
              display_name: i.display_name,
              ok: !1,
              latency_ms: Date.now() - o,
              message: `异常: ${l.name}`,
              mode: "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          }
          return;
        }
      }
      const c = await pd(i.venue);
      r[i.venue] = {
        venue: i.venue,
        display_name: i.display_name,
        ok: c.ok,
        latency_ms: c.latency_ms,
        message: c.message,
        mode: c.ok ? "public_fallback" : "network_error",
        checked_at: (/* @__PURE__ */ new Date()).toISOString(),
        has_key: !1
      };
    });
    await Promise.allSettled(a), this.venueHealthCache = r, this.exchangeBalance = null, this._lastHealthCheck = s;
  }
  /** 自动 AI 提供商健康检查（alarm 驱动，用 POST /messages 等 /models 轻量探测） */
  async autoAIProviderHealthCheck() {
    const e = Date.now();
    if (!(e - this._lastAIProviderCheck < 3e5)) {
      this._lastAIProviderCheck = e;
      try {
        const s = await this.env.DB.prepare(
          `SELECT id, name, provider_type, api_key, api_url, models, enabled
         FROM qtrade_llm_providers WHERE enabled = 1`
        ).all(), n = {}, r = (s.results || []).map(async (a) => {
          const i = Date.now(), o = (a.api_url || "").replace(/\/+$/, "") || "https://api.openai.com/v1", c = a.api_key || "";
          try {
            let d = !1, l = "";
            if (["openai_chat", "openai_compat", "deepseek_chat"].includes(a.provider_type)) {
              const u = await fetch(`${o}/models`, {
                headers: { Authorization: `Bearer ${c}` },
                signal: AbortSignal.timeout(8e3)
              });
              d = u.ok, l = d ? `HTTP ${u.status}` : `HTTP ${u.status} ${u.statusText}`;
            } else if (a.provider_type === "anthropic_chat") {
              const u = await fetch(`${o}/messages`, {
                method: "POST",
                headers: { "x-api-key": c, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
                body: JSON.stringify({ model: "claude-3-haiku-20240307", max_tokens: 1, messages: [{ role: "user", content: "ping" }] }),
                signal: AbortSignal.timeout(8e3)
              });
              d = u.ok, l = d ? `HTTP ${u.status}` : `HTTP ${u.status} ${u.statusText}`;
            } else {
              const u = await fetch(o, { signal: AbortSignal.timeout(8e3) });
              d = u.ok, l = d ? `HTTP ${u.status}` : `HTTP ${u.status} ${u.statusText}`;
            }
            n[a.name] = {
              name: a.name,
              provider_type: a.provider_type,
              models: a.models,
              ok: d,
              latency_ms: Date.now() - i,
              message: l,
              checked_at: (/* @__PURE__ */ new Date()).toISOString()
            };
          } catch (d) {
            n[a.name] = {
              name: a.name,
              provider_type: a.provider_type,
              models: a.models,
              ok: !1,
              latency_ms: Date.now() - i,
              message: d.name === "TimeoutError" ? "超时" : d.message,
              checked_at: (/* @__PURE__ */ new Date()).toISOString()
            };
          }
        });
        await Promise.allSettled(r), this.aiProviderHealthCache = n;
      } catch {
      }
    }
  }
  /** 从已连接交易所同步仓位 & 挂单（alarm 驱动，5 分钟一次） */
  async syncExchangeData() {
    var s;
    const e = Date.now();
    if (!(e - this._lastExchangeSync < 3e5)) {
      this._lastExchangeSync = e;
      try {
        const n = await this.env.DB.prepare(
          `SELECT venue, display_name, api_key, api_secret, api_passphrase
         FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper' AND api_key IS NOT NULL AND api_key != ''`
        ).all();
        if (!((s = n.results) != null && s.length)) return;
        const r = [], a = [], i = (n.results || []).map(async (o) => {
          try {
            const { positions: c, orders: d } = await zk(o);
            r.push(...c.map((l) => ({ ...l, _venue: o.venue }))), a.push(...d.map((l) => ({ ...l, _venue: o.venue })));
          } catch {
          }
        });
        await Promise.allSettled(i), this.exchangePositionsCache = r.length > 0 ? r : null, this.exchangeOrdersCache = a.length > 0 ? a : null, await this.env.DB.prepare(
          "INSERT OR REPLACE INTO qtrade_config (key, value) VALUES ('exchange_positions', ?)"
        ).bind(JSON.stringify({ positions: r, orders: a, _synced_at: e })).run();
      } catch {
      }
    }
  }
  /** 从 D1 恢复交易所仓位缓存 */
  async loadExchangeSyncCache() {
    if (!(this.exchangePositionsCache || this.exchangeOrdersCache))
      try {
        const e = await this.env.DB.prepare(
          "SELECT value FROM qtrade_config WHERE key = 'exchange_positions'"
        ).first();
        if (e) {
          const s = JSON.parse(e.value);
          Date.now() - (s._synced_at || 0) < 3e5 && (this.exchangePositionsCache = s.positions || null, this.exchangeOrdersCache = s.orders || null);
        }
      } catch {
      }
  }
  // ── WebSocket 消息分发 ──────────────────────────────────
  async handleWSMessage(e, s) {
    var r, a, i;
    let n;
    try {
      n = JSON.parse(typeof s == "string" ? s : new TextDecoder().decode(s));
    } catch {
      return;
    }
    switch (n.type) {
      case "subscribe_candles":
        n.instId && (this.candleSub.set(e, `${n.instId}:${n.bar || "15m"}`), await this.pushCandles(e, n.instId, n.bar || "15m"));
        break;
      case "unsubscribe_candles":
        this.candleSub.delete(e);
        break;
      case "refresh":
        await this.pushDashboard(e);
        break;
      case "health_check":
        await this.handleHealthCheck(e);
        break;
      case "ai_health_check":
        await this.autoAIProviderHealthCheck();
        try {
          e.send(JSON.stringify({ type: "ai_health_checked", health: this.aiProviderHealthCache ?? {} }));
        } catch {
        }
        break;
      case "task": {
        const o = this.storage.get("auto_run") === !0, c = this.storage.get("auto_run_interval_seconds") || 900, d = this.storage.get("last_auto_run_time") || null;
        let l = "—";
        try {
          const h = await this.env.DB.prepare(
            "SELECT name FROM qtrade_strategies WHERE enabled = 1 ORDER BY priority DESC LIMIT 1"
          ).first();
          h && (l = h.name);
        } catch {
        }
        e.send(JSON.stringify({
          type: "task",
          data: {
            auto_run: o,
            interval_seconds: c,
            last_auto_run_time: d,
            strategy_name: l
          }
        }));
        break;
      }
      case "start_auto_run": {
        const o = typeof n == "object" ? n.payload : void 0;
        try {
          await this.startAutoRun(o), e.send(JSON.stringify({ type: "start_auto_run", status: "started", auto_run: !0 }));
        } catch (c) {
          e.send(JSON.stringify({ type: "start_auto_run", status: "error", message: c.message }));
        }
        break;
      }
      case "stop_auto_run": {
        try {
          await this.stopAutoRun(), e.send(JSON.stringify({ type: "stop_auto_run", status: "stopped", auto_run: !1 }));
        } catch (o) {
          e.send(JSON.stringify({ type: "stop_auto_run", status: "error", message: o.message }));
        }
        break;
      }
      case "dryrun": {
        const o = n.mode;
        this.dryrunMode = o === "dryrun", await ((r = this.state.storage) == null ? void 0 : r.put("dryrun_mode", String(this.dryrunMode))), this.dryrunMode || (this.dryrunOrders = [], await ((a = this.state.storage) == null ? void 0 : a.put("dryrun_orders", "[]"))), e.send(JSON.stringify({ type: "dryrun", mode: this.dryrunMode ? "dryrun" : "live" })), await this.pushDashboard(e);
        break;
      }
      case "clear_dryrun": {
        this.dryrunOrders = [], await ((i = this.state.storage) == null ? void 0 : i.put("dryrun_orders", "[]")), await this.pushDashboard(e);
        break;
      }
      case "ping":
        e.send(JSON.stringify({ type: "pong" }));
        break;
    }
  }
  // ── 数据推送 ─────────────────────────────────────────────
  /**
   * 预加载所有启用品种的 K 线缓存。
   * 即使没有 WS 订阅者也运行，确保 computeFactors / processStrategy
   * 能拿到所有品种的数据，而不仅是 K 线图当前选中的品种。
   *
   * 首次运行（>50% 品种无有效缓存）批量拉取前 N 个，快速填充；
   * 后续错峰：每次 alarm 只拉一个品种，其余用已有缓存。
   */
  async prefetchAllCandleCaches() {
    const e = "1H", s = this.CANDLE_CACHE_TTL, n = await this.getCachedInstruments(this.env.DB), r = n.length;
    if (r === 0) return;
    const a = [];
    for (const c of n) {
      const d = `${c.inst_id}:${e}`, l = this.candleCache.get(d);
      (!l || Date.now() - l.ts >= s) && a.push(c.inst_id);
    }
    if (a.length === 0) return;
    const o = a.length > r / 2 ? Math.min(5, a.length) : 1;
    for (let c = 0; c < o; c++) {
      const d = (this._prefetchIndex + c) % a.length, l = a[d];
      try {
        const u = await Bc(this.env.DB, l, e, 150);
        u && u.length >= 2 && this.candleCache.set(`${l}:${e}`, { data: u, ts: Date.now() });
      } catch {
      }
    }
    this._prefetchIndex += o;
  }
  /** 向所有订阅的客户端广播所有品种的最新 K 线（错峰拉取，防 429） */
  async broadcastAllCandles() {
    const e = /* @__PURE__ */ new Map();
    for (const [r, a] of this.candleSub)
      e.has(a) || e.set(a, /* @__PURE__ */ new Set()), e.get(a).add(r);
    const s = [...e.keys()];
    if (s.length === 0) return;
    this.staggerIndex = this.staggerIndex % s.length;
    const n = s[this.staggerIndex];
    this.staggerIndex++;
    for (const r of s) {
      const [a, i] = r.split(":"), o = e.get(r), c = `${a}:${i}`;
      let d = [];
      const l = this.candleCache.get(c);
      if (l && (d = l.data), r === n)
        try {
          const h = await Bc(this.env.DB, a, i, 150);
          h && h.length >= 2 && (d = h, this.candleCache.set(c, { data: d, ts: Date.now() }));
        } catch (h) {
          console.error(`[TraderDO] broadcastAllCandles error: ${a}/${i} -`, h);
        }
      if (!d.length) continue;
      const u = JSON.stringify({ type: "candles", instId: a, bar: i, candles: d });
      for (const h of o)
        try {
          h.send(u);
        } catch {
          this.webSockets.delete(h), this.candleSub.delete(h);
        }
    }
  }
  /** 向单个客户端推送指定品种的 K 线（有缓存直接发，alarm 负责刷新） */
  async pushCandles(e, s, n) {
    try {
      const r = `${s}:${n}`, a = this.candleCache.get(r);
      if (a) {
        e.send(JSON.stringify({ type: "candles", instId: s, bar: n, candles: a.data }));
        return;
      }
      const i = await Bc(this.env.DB, s, n, 150);
      i && i.length >= 2 ? (this.candleCache.set(r, { data: i, ts: Date.now() }), e.send(JSON.stringify({ type: "candles", instId: s, bar: n, candles: i }))) : e.send(JSON.stringify({ type: "candles", instId: s, bar: n, candles: [] }));
    } catch (r) {
      console.error(`[TraderDO] pushCandles error: ${s}/${n} -`, r);
      try {
        e.send(JSON.stringify({ type: "error", message: `pushCandles failed: ${String(r)}` }));
      } catch {
      }
    }
  }
  /** 向单个客户端推送完整的仪表盘数据 */
  async pushDashboard(e) {
    try {
      const s = await this.assembleDashboardData();
      e.send(JSON.stringify({ type: "dashboard", data: s }));
    } catch (s) {
      try {
        e.send(JSON.stringify({ type: "error", message: `pushDashboard: ${String(s)}` }));
      } catch {
      }
    }
  }
  /** 交易所健康检查（WS 版，替代 HTTP /api/venues/health） */
  async handleHealthCheck(e) {
    try {
      const s = this.env.DB, n = Date.now(), r = await s.prepare(
        `SELECT venue, display_name, api_key, api_secret, api_passphrase
         FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper'`
      ).all(), a = {}, i = (r.results || []).map(async (c) => {
        const d = c.venue, l = !!(c.api_key && c.api_secret), u = so[d];
        if (l && u) {
          const h = Date.now();
          try {
            const f = await u(c), g = Date.now() - h;
            a[d] = {
              venue: d,
              display_name: c.display_name,
              ok: f.ok,
              latency_ms: g,
              message: f.message,
              balance: f.balance,
              currency: f.currency,
              mode: f.ok ? "authenticated" : "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          } catch (f) {
            const g = Date.now() - h;
            a[d] = {
              venue: d,
              display_name: c.display_name,
              ok: !1,
              latency_ms: g,
              message: `测试异常: ${f.name}`,
              mode: "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          }
        } else {
          const h = await pd(d);
          a[d] = {
            venue: d,
            display_name: c.display_name,
            ok: h.ok,
            latency_ms: h.latency_ms,
            message: h.message,
            mode: h.ok ? "public_fallback" : "network_error",
            checked_at: (/* @__PURE__ */ new Date()).toISOString(),
            has_key: !1
          };
        }
      });
      await Promise.allSettled(i), this.venueHealthCache = a, this.exchangeBalance = null;
      const o = { ...a, _checked_at: n };
      await s.prepare(
        "INSERT OR REPLACE INTO qtrade_config (key, value) VALUES ('venue_health', ?)"
      ).bind(JSON.stringify(o)).run(), e.send(JSON.stringify({ type: "health_checked", health: a })), await this.pushDashboard(e);
    } catch (s) {
      try {
        e.send(JSON.stringify({ type: "error", message: `health_check: ${s.message}` }));
      } catch {
      }
    }
  }
  // ── Assemble full dashboard response（动态数据读 DO 内存缓存）──
  async assembleDashboardData() {
    const e = this.env.DB, s = await this.getCachedInstruments(e);
    let n;
    this.configCache && Date.now() - this.configCache.ts < this.CONFIG_CACHE_TTL ? n = this.configCache.data : (n = await vk(e), this.configCache = { data: n, ts: Date.now() });
    let r;
    this.tradesCache && Date.now() - this.tradesCache.ts < this.TRADES_CACHE_TTL ? r = this.tradesCache.data : (r = await fk(e, 10), this.tradesCache = { data: r, ts: Date.now() });
    let a;
    this.equityHistoryCache && Date.now() - this.equityHistoryCache.ts < this.EQUITY_CACHE_TTL ? a = this.equityHistoryCache.data : (a = await gk(e, 30), this.equityHistoryCache = { data: a, ts: Date.now() });
    let i;
    this.logsCache && Date.now() - this.logsCache.ts < this.LOGS_CACHE_TTL ? i = this.logsCache.data : (i = await yk(e, 30), this.logsCache = { data: i, ts: Date.now() });
    let o;
    this.logMsgsCache && Date.now() - this.logMsgsCache.ts < this.LOGMSGS_CACHE_TTL ? o = this.logMsgsCache.data : (o = await wk(e, 30), this.logMsgsCache = { data: o, ts: Date.now() });
    const c = parseFloat(n.initial_capital || "10000"), d = parseFloat(n.current_equity || String(c));
    let l = { total_cum_net_pnl: 0, total_cum_realized_pnl: 0, cum_roi_pct: 0, profit_factor: 0, avg_win: 0, avg_loss: 0, win_rate: 0 };
    try {
      l = await xk(e);
    } catch {
    }
    const u = await this.buildFactors(s), h = this.positionsCache, f = this.ordersCache, g = this.todayStatsCache, _ = this.exchangePositionsCache ?? [], w = [...h, ..._], b = this.exchangeOrdersCache ?? [], I = [...f, ...b.map((E) => ({
      order_id: E.ordId || E.order_id || "",
      inst_id: E.instId || E.inst_id,
      side: E.side,
      pos_side: E.posSide || E.pos_side || (E.side === "buy" ? "long" : "short"),
      price: E.price || E.px || 0,
      size: E.size || E.sz || 0,
      state: E.state,
      created_at: E.createdAt || E.cTime || E.created_at || "",
      leverage: E.leverage || E.lever || 1,
      _venue: E._venue || E.venue || "exchange"
    }))];
    let D = this.exchangeBalance;
    if (D === null && this.venueHealthCache)
      for (const E of Object.values(this.venueHealthCache)) {
        const we = E;
        if (we.ok && we.balance != null) {
          D = we.balance;
          break;
        }
      }
    const M = D ?? d, z = {
      total_eq: M,
      avail_eq: M * 0.8,
      cash_bal: M * 0.3,
      upl: h.reduce((E, we) => E + (parseFloat(we.upl || "0") || 0), 0),
      pos_upl_total: h.reduce((E, we) => E + (parseFloat(we.upl || "0") || 0), 0),
      margin_usage_pct: h.length > 0 ? 20 : 0,
      initial_capital: c,
      cum_net_pnl: l.total_cum_net_pnl,
      cum_realized_pnl: l.total_cum_realized_pnl,
      cum_roi_pct: c > 0 ? (M - c) / c * 100 : 0,
      cum_total_fees: g.fees_paid
    }, te = {
      total_cum_net_pnl: l.total_cum_net_pnl,
      total_cum_realized_pnl: l.total_cum_realized_pnl,
      cum_roi_pct: l.cum_roi_pct,
      profit_factor: l.profit_factor,
      avg_win: l.avg_win,
      avg_loss: l.avg_loss,
      win_rate: l.win_rate
      // 小数 (0.0~1.0)，前端 * 100 显示
    };
    return {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      account: z,
      positions_summary: {
        total_count: w.length,
        long_count: w.filter((E) => E.pos_side === "long" || E.side === "long").length,
        short_count: w.filter((E) => E.pos_side === "short" || E.side === "short").length,
        items: w.map((E) => {
          var we;
          return {
            instId: E.inst_id || E.instId,
            name: ((we = E.inst_id || E.instId || "") == null ? void 0 : we.split("-")[0]) || "",
            side: E.pos_side || E.side || "long",
            pos: String(E.size || E.pos || "0"),
            lever: String(E.leverage || E.lever || "1"),
            margin: String(E.margin || (E.size || 0) * (E.open_price || 0) / (E.leverage || 1)),
            avgPx: String(E.open_price || E.avgPx || "0"),
            last: String(E.mark_price || E.last || E.open_price || "0"),
            upl: String(E.upl || "0"),
            uplRatio: String(E.upl_ratio || E.uplRatio || "0"),
            venue: E._venue || E.venue || "",
            notional_usdt: E.notional_usdt || 0
          };
        })
      },
      pending_orders: [
        ...I.map((E) => ({
          ordId: E.order_id || E.ordId || String(E.id),
          instId: E.inst_id || E.instId,
          side: E.side,
          posSide: E.pos_side || E.posSide || (E.side === "buy" ? "long" : "short"),
          px: String(E.price || E.px || "0"),
          sz: String(E.size || E.sz || "0"),
          state: E.state,
          cTime: E.created_at || E.cTime || E.createdAt || "",
          lever: String(E.leverage || E.lever || "1"),
          venue: E._venue || E.venue || ""
        })),
        // DRYRUN mode 模拟挂单
        ...(this.dryrunOrders || []).map((E) => ({
          ordId: E.ordId,
          instId: E.instId,
          side: E.side,
          posSide: E.posSide,
          px: E.px,
          sz: E.sz,
          state: E.state,
          cTime: E.cTime,
          lever: E.lever,
          venue: E.venue,
          tag: E.tag || "DRYRUN"
        }))
      ],
      factors: u,
      today_stats: g,
      performance: te,
      equity_history: a,
      logs: o,
      trades: r.slice(0, 20),
      data_health: { status: "ok" },
      venue_health: this.venueHealthCache ?? {},
      ai_provider_health: this.aiProviderHealthCache ?? {},
      dryrun_mode: this.dryrunMode
    };
  }
  /** buildFactors —— 仅读缓存，不碰交易所 API */
  async buildFactors(e) {
    if (this.factorsCache && Date.now() - this.factorsCache.ts < this.FACTORS_CACHE_TTL)
      return this.factorsCache.factors;
    const s = await this.computeFactors(e);
    return s.length > 0 && (this.factorsCache = { factors: s, ts: Date.now() }), s;
  }
  /** 计算 factor：只读 DO 内存缓存，不碰交易所 API */
  async computeFactors(e) {
    var n;
    const s = [];
    for (const r of e)
      try {
        const a = `${r.inst_id}:1H`, i = this.candleCache.get(a);
        if (!i || Date.now() - i.ts >= this.CANDLE_CACHE_TTL)
          continue;
        const o = i.data;
        if (o.length < 2) continue;
        const c = o[o.length - 1], d = o[o.length - 2], l = d.close > 0 ? (c.close - d.close) / d.close * 100 : 0, u = this.computeDecisionSimple(o);
        s.push({
          instId: r.inst_id,
          name: r.name || ((n = r.inst_id) == null ? void 0 : n.split("-")[0]) || "",
          price: c.close,
          chg24h: Math.round(l * 100) / 100,
          high24h: Math.max(...o.slice(-24).map((h) => h.high)),
          low24h: Math.min(...o.slice(-24).map((h) => h.low)),
          vol24h: o.slice(-24).reduce((h, f) => h + f.vol, 0),
          rsi: this.computeRSI(o),
          decision: u.action !== "WAIT" ? u : void 0
        });
      } catch {
        continue;
      }
    return s;
  }
  computeRSI(e) {
    const s = e.map((o) => o.close), n = [], r = [];
    for (let o = 1; o < s.length; o++) {
      const c = s[o] - s[o - 1];
      n.push(c > 0 ? c : 0), r.push(c < 0 ? -c : 0);
    }
    const a = n.slice(-14).reduce((o, c) => o + c, 0) / 14, i = r.slice(-14).reduce((o, c) => o + c, 0) / 14;
    return i === 0 ? 100 : Math.round((100 - 100 / (1 + a / i)) * 10) / 10;
  }
  computeDecisionSimple(e) {
    const s = e.map((g) => g.close), n = s[s.length - 1], r = s[s.length - 2], a = this.computeRSI(e), i = r > 0 ? (n - r) / r * 100 : 0, o = this.ema(s, 12), c = this.ema(s, 26), d = o - c, l = s.length >= 50 ? this.ema(s, 50) : s.reduce((g, _) => g + _, 0) / s.length, u = n >= l, h = { rsi: a, macd: d, chg_pct: i, above_ema50: u, current: n, prev: r }, f = Cf();
    for (const g of f.filter((_) => _.enabled).sort((_, w) => w.priority - _.priority))
      if (this.evaluateRuleConditions(g.conditions, h)) {
        let w = g.confidence;
        return g.action === "BUY_LONG" && a < 35 ? w = Math.min(85, Math.round(w + (35 - a) * 2)) : g.action === "SELL_SHORT" && a > 70 && (w = Math.min(85, Math.round(w + (a - 70) * 2))), {
          action: g.action,
          confidence: w,
          leverage: g.leverage || 2,
          entry_price: n,
          take_profit_price: n * (1 + (g.take_profit_pct || 3) / 100 * (g.action === "BUY_LONG" ? 1 : -1)),
          stop_loss_price: n * (1 - (g.stop_loss_pct || 1.5) / 100 * (g.action === "BUY_LONG" ? 1 : -1)),
          risk_reward_ratio: `${Math.abs((g.take_profit_pct || 3) / (g.stop_loss_pct || 1.5)).toFixed(1)}:1`,
          summary_reason: g.name
        };
      }
    return { action: "WAIT", confidence: 30, leverage: 1, entry_price: n, summary_reason: `RSI ${a.toFixed(1)} 无规则匹配` };
  }
  // ── Command handler ──
  async handleCommand(e) {
    switch (e.type) {
      case "process_strategy":
        return await this.processStrategy(e.payload);
      case "start_auto_run":
        return await this.startAutoRun(e.payload);
      case "stop_auto_run":
        return await this.stopAutoRun();
      case "submit_order":
        return await this.submitOrder(e.payload);
      case "close_position":
        return await this.closePosition(e.payload);
      case "reset":
        return await this.reset();
      default:
        return new Response(JSON.stringify({ error: `Unknown command: ${e.type}` }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }
  }
  // ── Auto Run: 持续自动交易 ──
  /**
   * 启动自动交易模式。
   * 将 auto_run 标记写入 DO 持久化存储，Alarm 周期中自动调用 processStrategy。
   * interval_seconds 默认 900s（15 分钟），最小 60s。
   */
  async startAutoRun(e) {
    var n;
    const s = Math.max(60, (e == null ? void 0 : e.interval_seconds) ?? 900);
    return this.storage.set("auto_run", !0), this.storage.set("auto_run_interval_seconds", s), this.storage.set("last_auto_run_time", Date.now()), await ((n = this.state.storage) == null ? void 0 : n.put("trader_state", Object.fromEntries(this.storage))), await He(this.env.DB, "info", `[AutoRun] 启动自动交易，间隔 ${s}s`, "trader-do"), this.processStrategy({ _auto: !0 }).catch(() => {
    }), new Response(JSON.stringify({
      status: "started",
      auto_run: !0,
      interval_seconds: s
    }), { headers: { "Content-Type": "application/json" } });
  }
  /**
   * 停止自动交易模式。
   */
  async stopAutoRun() {
    var e;
    return this.storage.set("auto_run", !1), await ((e = this.state.storage) == null ? void 0 : e.put("trader_state", Object.fromEntries(this.storage))), await He(this.env.DB, "info", "[AutoRun] 停止自动交易", "trader-do"), new Response(JSON.stringify({
      status: "stopped",
      auto_run: !1
    }), { headers: { "Content-Type": "application/json" } });
  }
  /** 获取自动交易运行状态 */
  getAutoRunStatus() {
    return new Response(JSON.stringify({
      auto_run: this.storage.get("auto_run") === !0,
      interval_seconds: this.storage.get("auto_run_interval_seconds") || 60,
      last_auto_run_time: this.storage.get("last_auto_run_time") || null
    }), { headers: { "Content-Type": "application/json" } });
  }
  // ── Core AI Strategy Processing (Pass Pipeline) ──
  /**
   * 完整的交易决策管线，按 Pass 顺序执行：
   *
   *   Pass 1 ─ 风控门禁 (Risk Gate)
   *     加载风控参数，检查日亏损熔断、冷却期、持仓上限
   *
   *   Pass 2 ─ 上下文构建 (Context Build)
   *     收集市场数据、账户状态、持仓信息，生成模板变量
   *
   *   Pass 3 ─ 提示词渲染 (Prompt Render)
   *     加载激活的提示词方案，用上下文变量渲染模板
   *
   *   Pass 4 ─ LLM 决策 (LLM Decision)
   *     将渲染后的提示词发给 AI 提供商，获取交易决策
   *
   *   Pass 5 ─ 决策后处理 (Post-Process)
   *     杠杆钳制、置信度过滤、止盈止损优化
   */
  async processStrategy(e) {
    var w, b, I, D;
    const s = this.env.DB, n = crypto.randomUUID(), r = [], a = await this.loadRiskConfig(s), i = this.checkRiskGates(a);
    if (i.blocked)
      return await He(s, "warn", `[Pass 1] 风控熔断: ${i.reason}`, "trader-do"), new Response(JSON.stringify({
        cycle_id: n,
        status: "blocked",
        pass: 1,
        reason: i.reason,
        decisions: []
      }), { headers: { "Content-Type": "application/json" } });
    r.push("风控门禁通过");
    const o = await Sk(s);
    if (!o)
      return new Response(JSON.stringify({ error: "No active strategy" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    if (typeof o.config_json == "string")
      try {
        o.config_json = JSON.parse(o.config_json);
      } catch {
      }
    const c = await this.getCachedInstruments(s);
    r.push(`策略「${o.name}」· ${c.length} 个标的`);
    let d = "paper";
    try {
      const M = await s.prepare(
        "SELECT venue FROM qtrade_venues WHERE enabled = 1 AND venue != 'paper' LIMIT 1"
      ).first();
      M && (d = M.venue);
    } catch {
    }
    r.push(`交易场所: ${d}`);
    const l = this.buildAccountContext(a), u = this.buildTemplateContext(l, a, c), h = await this.loadActivePromptProfile(s);
    h ? r.push(`提示词方案「${h.name}」已加载`) : r.push("无激活的提示词方案，使用规则引擎");
    const f = [];
    let g = 0;
    for (const M of c) {
      const z = `${M.inst_id}:1H`, te = this.candleCache.get(z);
      if (!te || Date.now() - te.ts >= this.CANDLE_CACHE_TTL) {
        g++;
        continue;
      }
      const E = te.data;
      if (E.length < 2) {
        g++;
        continue;
      }
      if (this.checkInstrumentCooldown(M.inst_id, a).blocked) {
        g++;
        continue;
      }
      let j = this.computeDecision(M.inst_id, E, o);
      if (h)
        try {
          const he = await this.callLLMForDecision(
            M.inst_id,
            E,
            o,
            h,
            u
          );
          he && he.action !== "WAIT" && (j = he);
        } catch (he) {
          await He(
            s,
            "warn",
            `[Pass 5] LLM 决策失败 ${M.inst_id}: ${he.message}，回退规则引擎`,
            "trader-do"
          );
        }
      if (j = this.postProcessDecision(j, a, E), j.action !== "WAIT") {
        const he = await lk(s, {
          ...j,
          inst_id: M.inst_id,
          strategy_tag: o.name,
          cycle_id: n,
          llm_model: (w = o.config_json) == null ? void 0 : w.model,
          llm_provider: (b = o.config_json) == null ? void 0 : b.provider
        }), Ce = this.positionsCache.some(
          (Ee) => Ee.inst_id === M.inst_id && Ee.side === (j.action === "BUY_LONG" ? "long" : "short")
        ), We = this.ordersCache.some(
          (Ee) => Ee.inst_id === M.inst_id && Ee.state === "pending"
        );
        if (!Ce && !We)
          try {
            const xe = (this.exchangeBalance ?? parseFloat(this.storage.get("current_equity") || "10000")) * (a.risk_per_trade_ratio || 0.02), Qe = parseFloat(j.entry_price || j.stop_loss_price || "0"), et = Math.abs(
              parseFloat(j.entry_price || "0") - parseFloat(j.stop_loss_price || "0")
            );
            let ce;
            if (et > 0 && Qe > 0 ? ce = xe / et * (j.leverage || 1) : ce = xe / (Qe > 0 ? Qe : 1), ce = Math.max(ce, 1e-3), ce = parseFloat(ce.toFixed(6)), this.dryrunMode) {
              const Se = {
                ordId: `DRYRUN-${crypto.randomUUID().slice(0, 10)}`,
                instId: M.inst_id,
                side: j.action === "BUY_LONG" ? "buy" : "sell",
                posSide: j.action === "BUY_LONG" ? "long" : "short",
                px: String(Qe || 0),
                sz: String(ce),
                state: "dryrun",
                cTime: (/* @__PURE__ */ new Date()).toISOString(),
                lever: String(j.leverage || 2),
                venue: "DRYRUN",
                tag: "DRYRUN",
                decision: { ...j, id: he }
              };
              this.dryrunOrders.unshift(Se), this.dryrunOrders.length > 50 && (this.dryrunOrders.length = 50), await ((I = this.state.storage) == null ? void 0 : I.put("dryrun_orders", JSON.stringify(this.dryrunOrders))), await He(
                s,
                "info",
                `[DRYRUN] 模拟下单 ${M.inst_id} ${j.action} ${ce}@${Qe}`,
                "trader-do"
              );
            } else
              await this.submitOrder({
                inst_id: M.inst_id,
                side: j.action === "BUY_LONG" ? "buy" : "sell",
                pos_side: j.action === "BUY_LONG" ? "long" : "short",
                order_type: "market",
                price: Qe || void 0,
                size: ce,
                leverage: j.leverage || 2,
                venue: d,
                strategy_tag: o.name,
                decision_id: he,
                stop_loss: j.stop_loss_price,
                take_profit: j.take_profit_price
              }), await He(
                s,
                "info",
                `[Pass 5d] 自动下单 ${M.inst_id} ${j.action} ${ce}@${Qe}`,
                "trader-do"
              );
          } catch (Ee) {
            await He(
              s,
              "warn",
              `[Pass 5d] ${this.dryrunMode ? "模拟" : ""}下单失败 ${M.inst_id}: ${Ee.message}`,
              "trader-do"
            );
          }
        f.push({ ...j, id: he, inst_id: M.inst_id });
      }
    }
    this.storage.set("cycle_id", n), this.storage.set("last_strategy_run", (/* @__PURE__ */ new Date()).toISOString()), this.storage.set("active_positions", f.filter((M) => M.action.startsWith("BUY") || M.action.startsWith("SELL")).length), await ((D = this.state.storage) == null ? void 0 : D.put("trader_state", Object.fromEntries(this.storage)));
    const _ = `策略周期 ${n}: ${f.length} 个决策 · ${g} 跳过 · ${r.join(" · ")}`;
    return await He(s, "info", _, "trader-do"), new Response(JSON.stringify({
      cycle_id: n,
      decisions: f,
      strategy: o.name,
      pass_logs: r,
      risk_config: {
        max_positions: a.max_positions,
        max_leverage: a.max_leverage,
        daily_loss_limit_usdt: a.daily_loss_limit_usdt
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), { headers: { "Content-Type": "application/json" } });
  }
  // ─────────────────────────────────────────────────────────
  //  Pass 工具方法
  // ─────────────────────────────────────────────────────────
  /** 加载风控配置（从 D1 config 表读取） */
  async loadRiskConfig(e) {
    const s = {
      max_positions: 3,
      max_same_direction: 2,
      max_margin_ratio: 0.1,
      single_asset_cap_usdt: 1e3,
      min_leverage: 1,
      max_leverage: 3,
      min_rr: 2,
      max_rr: 5,
      min_confidence: 0.5,
      risk_per_trade_ratio: 0.01,
      daily_loss_limit_usdt: 100,
      max_hold_hours: 24,
      cooldown_minutes: 120
    };
    try {
      const n = await e.prepare(
        "SELECT value FROM qtrade_config WHERE key = 'risk_config'"
      ).first();
      if (n) {
        const r = JSON.parse(n.value);
        return { ...s, ...r };
      }
    } catch {
    }
    return s;
  }
  /** 风控门禁总检 */
  checkRiskGates(e) {
    if (e.daily_loss_limit_usdt > 0) {
      const n = Math.abs(this.todayStatsCache.net_realized < 0 ? this.todayStatsCache.net_realized : 0);
      if (n >= e.daily_loss_limit_usdt)
        return { blocked: !0, reason: `日亏损熔断: 已亏 $${n.toFixed(2)} ≥ 限额 $${e.daily_loss_limit_usdt}` };
    }
    const s = this.positionsCache.length;
    return s >= e.max_positions ? { blocked: !0, reason: `持仓数 ${s} 已达上限 ${e.max_positions}` } : { blocked: !1 };
  }
  /** 单个品种冷却期检查 */
  checkInstrumentCooldown(e, s) {
    if (!s.cooldown_minutes || s.cooldown_minutes <= 0) return { blocked: !1 };
    const n = this.storage.get(`cooldown:${e}`);
    return n && (Date.now() - n) / 6e4 < s.cooldown_minutes ? { blocked: !0 } : { blocked: !1 };
  }
  /** 构建账户上下文（供模板变量使用） */
  buildAccountContext(e) {
    const s = this.exchangeBalance ?? parseFloat(this.storage.get("current_equity") || "10000"), n = this.positionsCache, r = this.ordersCache;
    return {
      total_equity: s.toFixed(2),
      avail_equity: (s * 0.8).toFixed(2),
      // 近似可用
      open_positions: String(n.length),
      pending_orders: String(r.length),
      daily_pnl: this.todayStatsCache.net_realized.toFixed(2),
      daily_trades: String(this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades),
      max_positions: String(e.max_positions),
      max_leverage: String(e.max_leverage),
      risk_per_trade: String((e.risk_per_trade_ratio * 100).toFixed(1)),
      daily_loss_limit: String(e.daily_loss_limit_usdt)
    };
  }
  /** 构建完整模板上下文（含品种列表和市场概况） */
  buildTemplateContext(e, s, n) {
    const r = n.slice(0, 10).map((a, i) => {
      var l;
      const o = `${a.inst_id}:1H`, c = this.candleCache.get(o), d = c ? (l = c.data[c.data.length - 1]) == null ? void 0 : l.close : "N/A";
      return `${i + 1}. ${a.inst_id} $${d}`;
    }).join(`
`);
    return {
      ...e,
      instrument_list: r || "无可用标的",
      instrument_count: String(n.length),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      strategy_mode: this.env.ENVIRONMENT || "production"
    };
  }
  /** 加载激活的提示词方案 */
  async loadActivePromptProfile(e) {
    try {
      const s = await e.prepare(
        "SELECT value FROM qtrade_config WHERE key = 'prompt_library'"
      ).first();
      if (!s) return null;
      const n = JSON.parse(s.value);
      if (!n.active_profile_id || !n.profiles[n.active_profile_id]) return null;
      const r = n.profiles[n.active_profile_id];
      return r.enabled ? r : null;
    } catch {
      return null;
    }
  }
  /** 渲染提示词模板 */
  renderPrompt(e, s) {
    return e.replace(/\{\{(\w+)\}\}/g, (n, r) => s[r] ?? `[MISSING:${r}]`);
  }
  /** 调用 LLM API 获取交易决策 */
  async callLLMForDecision(e, s, n, r, a) {
    var he, Ce, We, Ee, xe, Qe, et;
    const i = ((he = r.pipelines) == null ? void 0 : he.trading_system) || [], o = ((Ce = r.pipelines) == null ? void 0 : Ce.trading_user) || [];
    if (!i.length && !o.length) return null;
    const c = i.filter((ce) => ce.enabled), d = o.filter((ce) => ce.enabled);
    if (!c.length && !d.length) return null;
    const l = s.slice(-48).map((ce) => ce.close), u = s.slice(-48).map((ce) => ce.vol), h = l[l.length - 1], f = l.length > 24 ? ((l[l.length - 1] - l[l.length - 25]) / l[l.length - 25] * 100).toFixed(2) : "0", g = {
      ...a,
      inst_id: e,
      price: String(h),
      chg_24h: f,
      high_24h: String(Math.max(...l.slice(-24))),
      low_24h: String(Math.min(...l.slice(-24))),
      volume_24h: String(u.slice(-24).reduce((ce, Se) => ce + Se, 0).toFixed(2)),
      rsi_14: String(this.computeRSI(s)),
      current_leverage: String(((We = this.positionsCache.find((ce) => ce.inst_id === e)) == null ? void 0 : We.leverage) || "1")
    }, _ = c.map((ce) => this.renderPrompt(ce.content, g)).join(`

`), w = d.map((ce) => this.renderPrompt(ce.content, g)).join(`

`), b = await Ek(this.env.DB);
    if (!b.length) return null;
    const D = b.find(
      (ce) => {
        var Se, tr, xt;
        return ce.provider_type === ((Se = n.config_json) == null ? void 0 : Se.provider) || ((xt = ce.models) == null ? void 0 : xt.includes(((tr = n.config_json) == null ? void 0 : tr.model) || ""));
      }
    ) || b[0];
    if (!D) return null;
    const M = (D.api_url || "").replace(/\/+$/, "") || "https://api.openai.com/v1", z = ((Ee = n.config_json) == null ? void 0 : Ee.model) || (D.models || "").split(",")[0] || "gpt-4o-mini", te = [];
    _ && te.push({ role: "system", content: _ }), te.push({
      role: "user",
      content: w || `分析 ${e} 当前价格 $${h}，24h 涨跌 ${f}%，RSI ${g.rsi_14}。给出交易建议（BUY_LONG/SELL_SHORT/WAIT）、置信度、杠杆。仅返回 JSON。`
    });
    const E = await fetch(`${M}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${D.api_key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: z,
        messages: te,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!E.ok) {
      const ce = await E.text().catch(() => "");
      throw new Error(`LLM API ${E.status}: ${ce.slice(0, 200)}`);
    }
    const Pe = (et = (Qe = (xe = (await E.json()).choices) == null ? void 0 : xe[0]) == null ? void 0 : Qe.message) == null ? void 0 : et.content;
    if (!Pe) throw new Error("LLM 返回空内容");
    const j = JSON.parse(Pe);
    return {
      action: j.action || "WAIT",
      confidence: j.confidence ?? 50,
      leverage: j.leverage ?? 2,
      entry_price: j.entry_price ?? h,
      take_profit_price: j.take_profit_price ?? h * 1.02,
      stop_loss_price: j.stop_loss_price ?? h * 0.98,
      risk_reward_ratio: j.risk_reward_ratio || "1:2",
      summary_reason: j.reason || j.summary_reason || "LLM 决策",
      llm_model: z,
      llm_provider: D.name
    };
  }
  /** 决策后处理：杠杆钳制、置信度过滤、止盈止损优化 */
  postProcessDecision(e, s, n) {
    var o;
    if (e.action === "WAIT") return e;
    const r = ((o = n[n.length - 1]) == null ? void 0 : o.close) || e.entry_price || 0, a = { ...e };
    if (a.leverage < s.min_leverage && (a.leverage = s.min_leverage), a.leverage > s.max_leverage && (a.leverage = s.max_leverage), (a.confidence ?? 0) < s.min_confidence * 100)
      return { action: "WAIT", confidence: a.confidence, leverage: 1, entry_price: r, summary_reason: `置信度 ${a.confidence} < 阈值 ${s.min_confidence * 100}` };
    const i = s.min_rr;
    return a.action === "BUY_LONG" ? (a.take_profit_price || (a.take_profit_price = r * (1 + i * 0.01)), a.stop_loss_price || (a.stop_loss_price = r * (1 - 0.01 / i))) : a.action === "SELL_SHORT" && (a.take_profit_price || (a.take_profit_price = r * (1 - i * 0.01)), a.stop_loss_price || (a.stop_loss_price = r * (1 + 0.01 / i))), this.storage.set(`cooldown:${e.inst_id || ""}`, Date.now()), a;
  }
  // ── 规则引擎（从策略配置加载规则，替代硬编码） ──
  /**
   * 规则格式（存储在 strategy.config_json.rules 中，示例见 getDefaultRules）：
   * 每条规则包含 conditions（AND 逻辑）、action、confidence、止盈止损百分比等。
   * 从策略配置读取 rules，没有则使用 getDefaultRules() 内建规则。
   */
  computeDecision(e, s, n) {
    var w;
    const r = s.map((b) => b.close), a = r[r.length - 1], i = r[r.length - 2], o = this.computeRSI(s), c = i > 0 ? (a - i) / i * 100 : 0, d = this.ema(r, 12), l = this.ema(r, 26), u = d - l, h = r.length >= 50 ? this.ema(r, 50) : r.reduce((b, I) => b + I, 0) / r.length, f = a >= h, g = {
      rsi: o,
      macd: u,
      chg_pct: c,
      above_ema50: f,
      current: a,
      prev: i
    };
    let _ = (w = n == null ? void 0 : n.config_json) == null ? void 0 : w.rules;
    (!_ || !Array.isArray(_) || _.length === 0) && (_ = Cf());
    for (const b of _.filter((I) => I.enabled).sort((I, D) => D.priority - I.priority))
      if (this.evaluateRuleConditions(b.conditions, g)) {
        let I = b.confidence;
        return b.action === "BUY_LONG" && o < 35 ? I = Math.min(85, Math.round(I + (35 - o) * 2)) : b.action === "SELL_SHORT" && o > 70 && (I = Math.min(85, Math.round(I + (o - 70) * 2))), {
          action: b.action,
          confidence: I,
          leverage: b.leverage || 2,
          entry_price: a,
          take_profit_price: b.action === "BUY_LONG" ? a * (1 + (b.take_profit_pct || 3) / 100) : a * (1 - (b.take_profit_pct || 3) / 100),
          stop_loss_price: b.action === "BUY_LONG" ? a * (1 - (b.stop_loss_pct || 1.5) / 100) : a * (1 + (b.stop_loss_pct || 1.5) / 100),
          risk_reward_ratio: `${Math.abs((b.take_profit_pct || 3) / (b.stop_loss_pct || 1.5)).toFixed(1)}:1`,
          summary_reason: b.name
        };
      }
    return { action: "WAIT", confidence: 30, leverage: 1, entry_price: a, summary_reason: `RSI ${o.toFixed(1)} 无规则匹配` };
  }
  /** 评估单条规则的所有条件（AND 逻辑） */
  evaluateRuleConditions(e, s) {
    for (const n of e) {
      const r = s[n.indicator];
      if (r === void 0) return !1;
      switch (n.operator) {
        case ">":
          if (!(r > n.value)) return !1;
          break;
        case "<":
          if (!(r < n.value)) return !1;
          break;
        case ">=":
          if (!(r >= n.value)) return !1;
          break;
        case "<=":
          if (!(r <= n.value)) return !1;
          break;
        case "==":
          if (r !== n.value) return !1;
          break;
        case "!=":
          if (r === n.value) return !1;
          break;
        default:
          return !1;
      }
    }
    return !0;
  }
  ema(e, s) {
    if (e.length < s) return e[e.length - 1] || 0;
    const n = 2 / (s + 1);
    let r = e.slice(0, s).reduce((a, i) => a + i, 0) / s;
    for (let a = s; a < e.length; a++)
      r = e[a] * n + r * (1 - n);
    return r;
  }
  // ── 自动平仓检查（止盈止损 + 超时强平） ──
  async checkAutoClose() {
    var a, i;
    if (this.positionsCache.length === 0 && !((a = this.exchangePositionsCache) != null && a.length)) return;
    const e = this.env.DB, s = await this.loadRiskConfig(e), n = (s.max_hold_hours || 24) * 36e5, r = [...this.positionsCache, ...this.exchangePositionsCache ?? []];
    for (const o of r) {
      const c = o.inst_id || o.instId;
      if (!c) continue;
      let d = 0;
      const l = `${c}:1H`, u = this.candleCache.get(l);
      if ((i = u == null ? void 0 : u.data) != null && i.length && (d = u.data[u.data.length - 1].close || 0), d <= 0) continue;
      const h = `${c}:${o.venue || "paper"}`, f = this.sltpMap.get(h), g = o.pos_side || o.side || "long";
      if (f && (f.stop_loss > 0 || f.take_profit > 0)) {
        let _ = !1, w = "";
        if (g === "long" ? f.stop_loss > 0 && d <= f.stop_loss ? (_ = !0, w = `止损触发 (SL=${f.stop_loss}, 当前=${d.toFixed(2)})`) : f.take_profit > 0 && d >= f.take_profit && (_ = !0, w = `止盈触发 (TP=${f.take_profit}, 当前=${d.toFixed(2)})`) : f.stop_loss > 0 && d >= f.stop_loss ? (_ = !0, w = `止损触发 (SL=${f.stop_loss}, 当前=${d.toFixed(2)})`) : f.take_profit > 0 && d <= f.take_profit && (_ = !0, w = `止盈触发 (TP=${f.take_profit}, 当前=${d.toFixed(2)})`), _) {
          await this.closePosition({ inst_id: c, price: d, _auto_reason: w }), await He(e, "info", `[AutoClose] ${c} ${g} ${w}`, "trader-do");
          continue;
        }
      }
      if (o.created_at || o.createdAt || o.open_time) {
        const _ = new Date(o.created_at || o.createdAt || o.open_time).getTime();
        !isNaN(_) && Date.now() - _ > n && (await this.closePosition({
          inst_id: c,
          price: d,
          _auto_reason: `超时强平 (持仓 > ${s.max_hold_hours}h)`
        }), await He(e, "info", `[AutoClose] ${c} 超时强平 (>${s.max_hold_hours}h)`, "trader-do"));
      }
    }
  }
  // ── Order Submission ──
  async submitOrder(e) {
    var i;
    if (!(e != null && e.inst_id) || !(e != null && e.side) || !(e != null && e.size))
      return new Response(JSON.stringify({ error: "Missing required fields: inst_id, side, size" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    const s = crypto.randomUUID().slice(0, 16), n = {
      order_id: s,
      inst_id: e.inst_id,
      side: e.side,
      pos_side: e.pos_side || (e.side === "buy" ? "long" : "short"),
      order_type: e.order_type || "market",
      price: e.price,
      size: e.size,
      leverage: e.leverage || 1,
      venue: e.venue || "paper",
      strategy_tag: e.strategy_tag || "default",
      decision_id: e.decision_id
    };
    if (e.stop_loss || e.take_profit) {
      const o = `${e.inst_id}:${e.venue || "paper"}`;
      this.sltpMap.set(o, {
        stop_loss: e.stop_loss || 0,
        take_profit: e.take_profit || 0
      });
    }
    const r = await uk(this.env.DB, n), a = (this.storage.get("pending_orders_count") || 0) + 1;
    if (this.storage.set("pending_orders_count", a), await ((i = this.state.storage) == null ? void 0 : i.put("trader_state", Object.fromEntries(this.storage))), this.ordersCache.unshift({
      ...n,
      id: r,
      order_id: s,
      state: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }), await He(this.env.DB, "info", `Order ${s}: ${e.side} ${e.size} ${e.inst_id}`, "trader-do"), e.venue && e.venue !== "paper")
      try {
        const o = await this.env.DB.prepare(
          "SELECT * FROM qtrade_venues WHERE venue = ? AND enabled = 1 LIMIT 1"
        ).bind(e.venue).first();
        if (o) {
          const c = await Bk(e, o);
          await He(
            this.env.DB,
            "info",
            `Exchange ${e.venue} order submitted: ${s} (${c.exchange_id || "ok"})`,
            "trader-do"
          );
        } else
          await He(
            this.env.DB,
            "warn",
            `Venue ${e.venue} not found in DB, order saved locally only`,
            "trader-do"
          );
      } catch (o) {
        await He(
          this.env.DB,
          "warn",
          `Exchange ${e.venue} order failed: ${o.message}`,
          "trader-do"
        );
      }
    return new Response(JSON.stringify({ id: r, order_id: s, status: "pending" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  // ── Close Position ──
  async closePosition(e) {
    if (!(e != null && e.inst_id))
      return new Response(JSON.stringify({ error: "Missing inst_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    const s = this.positionsCache.findIndex((d) => d.inst_id === e.inst_id);
    if (s === -1)
      return new Response(JSON.stringify({ error: `No open position for ${e.inst_id}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    const n = this.positionsCache[s], r = e.price || n.open_price * 1.01, a = (r - n.open_price) * n.size * (n.pos_side === "short" ? -1 : 1), i = Math.abs(a) * 1e-3;
    await mk(this.env.DB, n.id, r, a, i);
    const o = n.venue || "paper";
    if (o !== "paper")
      try {
        const d = await this.env.DB.prepare(
          "SELECT * FROM qtrade_venues WHERE venue = ? AND enabled = 1 LIMIT 1"
        ).bind(o).first();
        d && (await Lk({ inst_id: e.inst_id, venue: o }, d), await He(
          this.env.DB,
          "info",
          `Exchange close ${o} ${e.inst_id}`,
          "trader-do"
        ));
      } catch (d) {
        await He(
          this.env.DB,
          "warn",
          `Exchange close ${o} failed: ${d.message}`,
          "trader-do"
        );
      }
    this.sltpMap.delete(`${e.inst_id}:${o}`), this.positionsCache.splice(s, 1), this.tradesCache = null;
    const c = a - i;
    return this.todayStatsCache.net_realized += c, this.todayStatsCache.fees_paid += i, this.todayStatsCache.realized_gross += a, c > 0 ? this.todayStatsCache.win_trades++ : c < 0 && this.todayStatsCache.loss_trades++, this.todayStatsCache.win_rate = this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades > 0 ? Math.round(this.todayStatsCache.win_trades / (this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades) * 100) : 0, this.ordersCache = this.ordersCache.filter((d) => d.inst_id !== e.inst_id), await He(this.env.DB, "info", `Closed ${e.inst_id}: PnL ${a.toFixed(2)} USDT`, "trader-do"), new Response(JSON.stringify({
      inst_id: e.inst_id,
      close_price: r,
      pnl: a,
      fees: i
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  // ── Reset State ──
  async reset() {
    var e;
    return this.storage.clear(), this.initialized = !1, this.candleCache.clear(), this.factorsCache = null, this.positionsCache = [], this.ordersCache = [], this.tradesCache = null, this.configCache = null, this.equityHistoryCache = null, this.logsCache = null, this.logMsgsCache = null, this.todayStatsCache = { realized_gross: 0, fees_paid: 0, net_realized: 0, win_trades: 0, loss_trades: 0, win_rate: 0, source: "memory" }, this.exchangeBalance = null, this.venueHealthCache = null, this.aiProviderHealthCache = null, this.exchangePositionsCache = null, this.exchangeOrdersCache = null, this._lastHealthCheck = 0, this._lastAIProviderCheck = 0, this._lastExchangeSync = 0, await ((e = this.state.storage) == null ? void 0 : e.deleteAll()), await He(this.env.DB, "warn", "TraderDO state reset", "trader-do"), new Response(JSON.stringify({ status: "reset" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  // ── 预留：动态自进化 AI ──
  // private async evolve(payload?: any): Promise<Response> {
  //   // Analyze recent performance, adjust strategy parameters
  //   // Update prompt templates, optimize risk parameters
  //   return new Response(JSON.stringify({ status: 'evolved', changes: [] }), {
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  // }
  // ── 预留：AI 委员会投票 ──
  // private async councilVote(payload?: any): Promise<Response> {
  //   // Aggregate votes from multiple AI agents
  //   // Apply weighted voting based on historical accuracy
  //   return new Response(JSON.stringify({ status: 'voted', consensus: {} }), {
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  // }
  // ── Get DO State Snapshot ──
  async getState() {
    const e = {
      cycle_id: this.storage.get("cycle_id") || "",
      last_strategy_run: this.storage.get("last_strategy_run") || null,
      active_positions: this.storage.get("active_positions") || 0,
      pending_orders_count: this.storage.get("pending_orders_count") || 0,
      instruments_count: this.storage.get("instruments_count") || 0,
      last_candle_update: this.storage.get("last_candle_update") || null,
      auto_run: this.storage.get("auto_run") === !0,
      auto_run_interval_seconds: this.storage.get("auto_run_interval_seconds") || 60,
      last_auto_run_time: this.storage.get("last_auto_run_time") || 0,
      config: Object.fromEntries(this.storage)
    };
    return new Response(JSON.stringify(e), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function Bk(t, e) {
  const s = e.venue;
  if (s === "okx") return Uk(t, e);
  if (s === "binance") return Fk(t, e);
  if (s === "gate") return $k();
  throw new Error(`Unsupported exchange venue: ${s}`);
}
async function Uk(t, e) {
  var f, g;
  const s = (e.api_key || "").trim(), n = (e.api_secret || "").trim(), r = (e.api_passphrase || "").trim();
  if (!s || !n) throw new Error("OKX API credentials missing");
  const a = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", i = "/api/v5/trade/order", o = JSON.stringify({
    instId: t.inst_id,
    tdMode: "cross",
    side: t.side,
    posSide: t.pos_side === "long" ? "long" : "short",
    ordType: t.order_type === "limit" ? "limit" : "market",
    sz: String(t.size),
    ...t.order_type === "limit" && t.price ? { px: String(t.price) } : {}
  }), c = (/* @__PURE__ */ new Date()).toISOString(), d = await Sa(n, c + "POST" + i + o), u = await (await fetch(`${a}${i}`, {
    method: "POST",
    headers: {
      "OK-ACCESS-KEY": s,
      "OK-ACCESS-SIGN": d,
      "OK-ACCESS-TIMESTAMP": c,
      "OK-ACCESS-PASSPHRASE": r,
      "Content-Type": "application/json",
      ...e.testnet ? { "x-simulated-trading": "1" } : {}
    },
    body: o,
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (u.code !== "0") throw new Error(`OKX order error: ${u.code} ${u.msg || JSON.stringify(u.data)}`);
  return { exchange_id: (g = (f = u.data) == null ? void 0 : f[0]) == null ? void 0 : g.ordId, status: "submitted" };
}
async function Fk(t, e) {
  const s = (e.api_key || "").trim(), n = (e.api_secret || "").trim();
  if (!s || !n) throw new Error("Binance API credentials missing");
  const r = "https://fapi.binance.com", a = t.side === "buy" ? "BUY" : "SELL", i = new URLSearchParams({
    symbol: t.inst_id.replace("-", ""),
    // BTCUSDT
    side: a,
    type: "MARKET",
    quantity: String(t.size),
    timestamp: String(Date.now())
  }), o = await qn(n, i.toString());
  i.append("signature", o);
  const d = await (await fetch(`${r}/fapi/v1/order?${i.toString()}`, {
    method: "POST",
    headers: { "X-MBX-APIKEY": s, "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (d.code) throw new Error(`Binance order error: ${d.code} ${d.msg}`);
  return { exchange_id: d.orderId, status: "submitted" };
}
async function $k(t, e) {
  throw new Error("Gate order placement not yet implemented");
}
async function Lk(t, e) {
  const s = e.venue;
  if (s === "okx") return Hk(t, e);
  if (s === "binance") return jk(t, e);
  if (s === "gate") return qk();
  throw new Error(`Unsupported exchange venue for closing: ${s}`);
}
async function Hk(t, e) {
  var _, w, b;
  const s = (e.api_key || "").trim(), n = (e.api_secret || "").trim(), r = (e.api_passphrase || "").trim();
  if (!s || !n) throw new Error("OKX API credentials missing");
  let a = "long", i = 0;
  try {
    const I = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", D = (/* @__PURE__ */ new Date()).toISOString(), M = "/api/v5/account/positions?instId=" + encodeURIComponent(t.inst_id), z = await Sa(n, D + "GET" + M), E = await (await fetch(`${I}${M}`, {
      headers: {
        "OK-ACCESS-KEY": s,
        "OK-ACCESS-SIGN": z,
        "OK-ACCESS-TIMESTAMP": D,
        "OK-ACCESS-PASSPHRASE": r,
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(8e3)
    })).json();
    (_ = E.data) != null && _.length && (a = E.data[0].posSide === "long" ? "long" : "short", i = parseFloat(E.data[0].pos || "0"));
  } catch {
  }
  i <= 0 && (i = t.size || 1e-3);
  const o = a, c = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", d = "/api/v5/trade/close-position", l = JSON.stringify({
    instId: t.inst_id,
    posSide: o,
    mgnMode: "cross",
    sz: String(i),
    ccy: "USDT"
    // autoCxl: true, // 自动取消该品种挂单
  }), u = (/* @__PURE__ */ new Date()).toISOString(), h = await Sa(n, u + "POST" + d + l), g = await (await fetch(`${c}${d}`, {
    method: "POST",
    headers: {
      "OK-ACCESS-KEY": s,
      "OK-ACCESS-SIGN": h,
      "OK-ACCESS-TIMESTAMP": u,
      "OK-ACCESS-PASSPHRASE": r,
      "Content-Type": "application/json"
    },
    body: l,
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (g.code !== "0") throw new Error(`OKX close error: ${g.code} ${g.msg || JSON.stringify(g.data)}`);
  return { exchange_id: (b = (w = g.data) == null ? void 0 : w[0]) == null ? void 0 : b.ordId, status: "closed" };
}
async function jk(t, e) {
  const s = (e.api_key || "").trim(), n = (e.api_secret || "").trim();
  if (!s || !n) throw new Error("Binance API credentials missing");
  let r = 0;
  try {
    const h = Date.now(), f = `symbol=${t.inst_id.replace("-", "")}&timestamp=${h}`, g = await qn(n, f), w = await (await fetch(`https://fapi.binance.com/fapi/v1/positionRisk?${f}&signature=${g}`, {
      headers: { "X-MBX-APIKEY": s, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
    if (Array.isArray(w)) {
      const b = w.find((I) => I.symbol === t.inst_id.replace("-", ""));
      b && (r = parseFloat(b.positionAmt || "0"));
    }
  } catch {
  }
  r === 0 && (r = t.size || 1e-3);
  const a = r > 0 ? "SELL" : "BUY", i = Math.abs(r), o = "https://fapi.binance.com", c = new URLSearchParams({
    symbol: t.inst_id.replace("-", ""),
    side: a,
    type: "MARKET",
    quantity: String(i),
    reduceOnly: "true",
    timestamp: String(Date.now())
  }), d = await qn(n, c.toString());
  c.append("signature", d);
  const u = await (await fetch(`${o}/fapi/v1/order?${c.toString()}`, {
    method: "POST",
    headers: { "X-MBX-APIKEY": s, "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (u.code) throw new Error(`Binance close error: ${u.code} ${u.msg}`);
  return { exchange_id: u.orderId, status: "closed" };
}
async function qk(t, e) {
  throw new Error("Gate position closing not yet implemented");
}
async function zk(t) {
  const { venue: e } = t;
  return e === "okx" ? Kk(t) : e === "binance" ? Wk(t) : e === "gate" ? Vk(t) : { positions: [], orders: [] };
}
async function Kk(t) {
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim(), n = (t.api_passphrase || "").trim();
  if (!e || !s) return { positions: [], orders: [] };
  const r = "https://www.okx.com";
  async function a(l) {
    const u = (/* @__PURE__ */ new Date()).toISOString(), h = await Sa(s, u + "GET" + l);
    return (await fetch(`${r}${l}`, {
      headers: {
        "OK-ACCESS-KEY": e,
        "OK-ACCESS-SIGN": h,
        "OK-ACCESS-TIMESTAMP": u,
        "OK-ACCESS-PASSPHRASE": n,
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(8e3)
    })).json();
  }
  const [i, o] = await Promise.all([
    a("/api/v5/account/positions"),
    a("/api/v5/trade/orders-pending")
  ]), c = ((i == null ? void 0 : i.data) || []).map((l) => {
    var u;
    return {
      instId: l.instId,
      side: ((u = l.posSide) == null ? void 0 : u.toLowerCase()) || "long",
      size: parseFloat(l.pos || "0"),
      leverage: parseFloat(l.lever || "1"),
      open_price: parseFloat(l.avgPx || "0"),
      mark_price: parseFloat(l.markPx || "0"),
      upl: parseFloat(l.upl || "0"),
      uplRatio: parseFloat(l.uplRatio || "0") / 100,
      margin: parseFloat(l.margin || "0"),
      notional_usdt: parseFloat(l.notionalUsd || "0"),
      state: l.pos ? "open" : "closed",
      venue: "okx"
    };
  }), d = ((o == null ? void 0 : o.data) || []).map((l) => {
    var u;
    return {
      instId: l.instId,
      side: l.side,
      posSide: ((u = l.posSide) == null ? void 0 : u.toLowerCase()) || (l.side === "buy" ? "long" : "short"),
      px: parseFloat(l.px || "0"),
      sz: parseFloat(l.sz || "0"),
      price: parseFloat(l.px || "0"),
      size: parseFloat(l.sz || "0"),
      state: l.state,
      ordId: l.ordId,
      ordType: l.ordType,
      createdAt: l.cTime ? new Date(parseInt(l.cTime)).toISOString() : "",
      venue: "okx"
    };
  });
  return { positions: c, orders: d };
}
async function Wk(t) {
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim();
  if (!e || !s) return { positions: [], orders: [] };
  const n = "https://fapi.binance.com";
  async function r(d, l = "") {
    const u = Date.now(), h = l ? `${l}&timestamp=${u}` : `timestamp=${u}`, f = await qn(s, h);
    return (await fetch(`${n}${d}?${h}&signature=${f}`, {
      headers: { "X-MBX-APIKEY": e, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
  }
  const [a, i] = await Promise.all([
    r("/fapi/v1/positionRisk"),
    r("/fapi/v1/openOrders")
  ]), o = (Array.isArray(a) ? a : []).filter(
    (d) => parseFloat(d.positionAmt || "0") !== 0
  ).map((d) => ({
    instId: d.symbol,
    side: parseFloat(d.positionAmt) > 0 ? "long" : "short",
    size: Math.abs(parseFloat(d.positionAmt || "0")),
    leverage: parseFloat(d.leverage || "1"),
    open_price: parseFloat(d.entryPrice || "0"),
    mark_price: parseFloat(d.markPrice || "0"),
    upl: parseFloat(d.unRealizedProfit || "0"),
    uplRatio: parseFloat(d.percentage || "0") / 100,
    margin: parseFloat(d.isolatedMargin || "0"),
    notional_usdt: Math.abs(parseFloat(d.positionAmt || "0")) * parseFloat(d.markPrice || "0"),
    state: "open",
    venue: "binance"
  })), c = (Array.isArray(i) ? i : []).filter(
    (d) => d.status === "NEW" || d.status === "PARTIALLY_FILLED"
  ).map((d) => {
    var l, u;
    return {
      instId: d.symbol,
      side: (l = d.side) == null ? void 0 : l.toLowerCase(),
      posSide: d.side === "BUY" ? "long" : "short",
      px: parseFloat(d.price || "0"),
      sz: parseFloat(d.origQty || "0"),
      price: parseFloat(d.price || "0"),
      size: parseFloat(d.origQty || "0"),
      state: d.status === "PARTIALLY_FILLED" ? "partially_filled" : "pending",
      ordId: (u = d.orderId) == null ? void 0 : u.toString(),
      ordType: d.type,
      createdAt: new Date(d.time).toISOString(),
      venue: "binance"
    };
  });
  return { positions: o, orders: c };
}
async function Vk(t) {
  const e = (t.api_key || "").trim(), s = (t.api_secret || "").trim();
  if (!e || !s) return { positions: [], orders: [] };
  const n = "https://api.gateio.ws", r = Math.floor(Date.now() / 1e3).toString();
  async function a(l) {
    const u = await Ng(""), h = `GET
${l}

${u}
${r}`, f = await qn(s, h);
    return (await fetch(`${n}${l}`, {
      headers: { KEY: e, SIGN: f, Timestamp: r, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
  }
  const [i, o] = await Promise.all([
    a("/api/v4/futures/usdt/positions"),
    a("/api/v4/futures/usdt/orders?status=open")
  ]), c = (Array.isArray(i) ? i : []).filter(
    (l) => parseFloat(l.size || "0") !== 0
  ).map((l) => ({
    instId: l.contract || l.name,
    side: parseFloat(l.size) > 0 ? "long" : "short",
    size: Math.abs(parseFloat(l.size || "0")),
    leverage: parseFloat(l.leverage || "1"),
    open_price: parseFloat(l.entry_price || "0"),
    mark_price: parseFloat(l.mark_price || "0"),
    upl: parseFloat(l.unrealised_pnl || "0"),
    uplRatio: parseFloat(l.unrealised_pnl_pnl || "0") / 100,
    margin: parseFloat(l.initial_margin || "0"),
    notional_usdt: Math.abs(parseFloat(l.size || "0")) * parseFloat(l.mark_price || "0"),
    state: "open",
    venue: "gate"
  })), d = (Array.isArray(o) ? o : []).filter(
    (l) => l.status === "open" || l.status === "partially_filled"
  ).map((l) => {
    var u, h;
    return {
      instId: l.contract || l.name,
      side: (u = l.side) == null ? void 0 : u.toLowerCase(),
      posSide: l.side === "buy" ? "long" : "short",
      px: parseFloat(l.price || "0"),
      sz: parseFloat(l.size || "0"),
      price: parseFloat(l.price || "0"),
      size: parseFloat(l.size || "0"),
      state: l.status === "partially_filled" ? "partially_filled" : "pending",
      ordId: (h = l.id) == null ? void 0 : h.toString(),
      ordType: l.type,
      createdAt: l.create_time ? new Date(parseInt(l.create_time) * 1e3).toISOString() : "",
      venue: "gate"
    };
  });
  return { positions: c, orders: d };
}
function Cf() {
  return [
    {
      name: "RSI超卖+MACD多头·EMA50顺势",
      conditions: [
        { indicator: "rsi", operator: "<", value: 35 },
        { indicator: "macd", operator: ">", value: 0 },
        { indicator: "chg_pct", operator: ">", value: -1 },
        { indicator: "above_ema50", operator: "==", value: !0 }
      ],
      action: "BUY_LONG",
      confidence: 75,
      take_profit_pct: 3,
      stop_loss_pct: 1.5,
      leverage: 2,
      enabled: !0,
      priority: 10
    },
    {
      name: "RSI超买+MACD空头·EMA50逆势",
      conditions: [
        { indicator: "rsi", operator: ">", value: 70 },
        { indicator: "macd", operator: "<", value: 0 },
        { indicator: "chg_pct", operator: "<", value: 1 },
        { indicator: "above_ema50", operator: "==", value: !1 }
      ],
      action: "SELL_SHORT",
      confidence: 75,
      take_profit_pct: 3,
      stop_loss_pct: 1.5,
      leverage: 2,
      enabled: !0,
      priority: 9
    },
    {
      name: "强势上涨跟进",
      conditions: [
        { indicator: "chg_pct", operator: ">", value: 2 },
        { indicator: "rsi", operator: "<", value: 70 },
        { indicator: "above_ema50", operator: "==", value: !0 }
      ],
      action: "BUY_LONG",
      confidence: 65,
      take_profit_pct: 2,
      stop_loss_pct: 1,
      leverage: 2,
      enabled: !0,
      priority: 5
    },
    {
      name: "强势下跌跟进",
      conditions: [
        { indicator: "chg_pct", operator: "<", value: -2 },
        { indicator: "rsi", operator: ">", value: 30 },
        { indicator: "above_ema50", operator: "==", value: !1 }
      ],
      action: "SELL_SHORT",
      confidence: 65,
      take_profit_pct: 2,
      stop_loss_pct: 1,
      leverage: 2,
      enabled: !0,
      priority: 4
    },
    {
      name: "RSI超卖反弹",
      conditions: [
        { indicator: "rsi", operator: "<", value: 30 },
        { indicator: "chg_pct", operator: ">", value: -5 },
        { indicator: "above_ema50", operator: "==", value: !1 }
      ],
      action: "BUY_LONG",
      confidence: 60,
      take_profit_pct: 2.5,
      stop_loss_pct: 1.2,
      leverage: 2,
      enabled: !0,
      priority: 3
    },
    {
      name: "RSI超买回落",
      conditions: [
        { indicator: "rsi", operator: ">", value: 70 },
        { indicator: "chg_pct", operator: "<", value: 5 },
        { indicator: "above_ema50", operator: "==", value: !0 }
      ],
      action: "SELL_SHORT",
      confidence: 60,
      take_profit_pct: 2.5,
      stop_loss_pct: 1.2,
      leverage: 2,
      enabled: !0,
      priority: 2
    },
    {
      name: "EMA50顺势跟多",
      conditions: [
        { indicator: "above_ema50", operator: "==", value: !0 },
        { indicator: "rsi", operator: ">", value: 50 },
        { indicator: "rsi", operator: "<", value: 75 },
        { indicator: "macd", operator: ">", value: 0 }
      ],
      action: "BUY_LONG",
      confidence: 55,
      take_profit_pct: 2,
      stop_loss_pct: 1,
      leverage: 2,
      enabled: !0,
      priority: 1
    },
    {
      name: "EMA50逆势跟空",
      conditions: [
        { indicator: "above_ema50", operator: "==", value: !1 },
        { indicator: "rsi", operator: "<", value: 50 },
        { indicator: "rsi", operator: ">", value: 25 },
        { indicator: "macd", operator: "<", value: 0 }
      ],
      action: "SELL_SHORT",
      confidence: 55,
      take_profit_pct: 2,
      stop_loss_pct: 1,
      leverage: 2,
      enabled: !0,
      priority: 0
    }
  ];
}
async function If(t, e) {
  return await t.prepare(
    "SELECT * FROM qspider_sites WHERE id=?"
  ).bind(e).first() ?? null;
}
async function Tf(t, e) {
  let s = "SELECT * FROM qspider_proxies";
  const n = [];
  return e && (s += " WHERE site_id=?", n.push(e)), s += " ORDER BY weight DESC, success_count DESC", (await t.prepare(s).bind(...n).all()).results || [];
}
async function kf(t, e) {
  let s = "SELECT * FROM qspider_cookies";
  const n = [];
  return e && (s += " WHERE site_id=?", n.push(e)), s += " ORDER BY used_count ASC, fail_count ASC", (await t.prepare(s).bind(...n).all()).results || [];
}
async function Rf(t, e) {
  const s = await t.prepare(
    "SELECT id, is_vip FROM qspider_members WHERE site_id=? AND member_id=?"
  ).bind(e.site_id, e.member_id).first();
  if (s) {
    await t.prepare(
      `UPDATE qspider_members SET nickname=?, age=?, gender=?, city=?, avatar_url=?,
       is_vip=?, vip_level=?, registered_at=?, raw_data=?, crawled_at=datetime('now')
       WHERE id=?`
    ).bind(
      e.nickname || null,
      e.age || null,
      e.gender || null,
      e.city || null,
      e.avatar_url || null,
      e.is_vip ?? 0,
      e.vip_level || null,
      e.registered_at || null,
      e.raw_data || "{}",
      s.id
    ).run();
    const a = s.is_vip;
    return e.is_vip && !a && await Of(t, e.site_id, e.member_id, s.id, e.is_vip, e.vip_level, e.registered_at), { is_new: !1, member_row_id: s.id };
  }
  const n = await t.prepare(
    `INSERT INTO qspider_members (site_id, member_id, nickname, age, gender, city, avatar_url, is_vip, vip_level, registered_at, raw_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(
    e.site_id,
    e.member_id,
    e.nickname || null,
    e.age || null,
    e.gender || null,
    e.city || null,
    e.avatar_url || null,
    e.is_vip ?? 0,
    e.vip_level || null,
    e.registered_at || null,
    e.raw_data || "{}"
  ).first(), r = (n == null ? void 0 : n.id) ?? 0;
  return e.is_vip && await Of(t, e.site_id, e.member_id, r, e.is_vip, e.vip_level, e.registered_at), { is_new: !0, member_row_id: r };
}
async function Of(t, e, s, n, r, a, i) {
  const o = await t.prepare(
    "SELECT id FROM qspider_assets WHERE site_id=? AND member_id=?"
  ).bind(e, s).first();
  o ? await t.prepare(
    "UPDATE qspider_assets SET is_vip=?, vip_level=?, last_updated_at=datetime('now') WHERE id=?"
  ).bind(r ?? 0, a || null, o.id).run() : await t.prepare(
    `INSERT INTO qspider_assets (site_id, member_id, member_row_id, is_vip, vip_level, registered_at)
       VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(e, s, n, r ?? 0, a || null, i || null).run();
}
async function Gk(t, e, s = [], n, r, a, i, o, c, d, l) {
  const u = await t.prepare(
    `INSERT INTO qspider_crawl_tasks (site_id, status, cookie_id, proxy_id, start_page, max_pages, min_interval_ms, max_interval_ms, rotate_cookie_after, rotate_proxy_after)
     VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(e, n || null, r || null, null, null, null, null, null, null).first(), h = (u == null ? void 0 : u.id) ?? 0;
  return h && s.length > 0 && await Jk(t, h, s), h;
}
async function Jk(t, e, s) {
  if (await t.prepare("DELETE FROM qspider_task_configs WHERE task_id=?").bind(e).run(), s.length === 0) return;
  const n = t.prepare("INSERT OR IGNORE INTO qspider_task_configs (task_id, config_id) VALUES (?, ?)");
  for (const r of s)
    await n.bind(e, r).run();
}
async function Zk(t, e) {
  return ((await t.prepare(
    "SELECT config_id FROM qspider_task_configs WHERE task_id=? ORDER BY id"
  ).bind(e).all()).results || []).map((n) => n.config_id);
}
async function As(t, e, s) {
  const n = [], r = [];
  s.status && (n.push("status=?"), r.push(s.status)), s.pages_crawled !== void 0 && (n.push("pages_crawled=?"), r.push(s.pages_crawled)), s.members_found !== void 0 && (n.push("members_found=?"), r.push(s.members_found)), s.new_assets !== void 0 && (n.push("new_assets=?"), r.push(s.new_assets)), s.error_message !== void 0 && (n.push("error_message=?"), r.push(s.error_message)), s.started_at !== void 0 && (n.push("started_at=?"), r.push(s.started_at)), s.completed_at !== void 0 && (n.push("completed_at=?"), r.push(s.completed_at)), n.length !== 0 && (r.push(e), await t.prepare(`UPDATE qspider_crawl_tasks SET ${n.join(",")} WHERE id=?`).bind(...r).run());
}
async function Nf(t, e) {
  const s = await t.prepare(
    `SELECT t.*, s.display_name as site_name
     FROM qspider_crawl_tasks t
     LEFT JOIN qspider_sites s ON t.site_id=s.id
     WHERE t.id=?`
  ).bind(e).first();
  if (!s) return null;
  const n = s, r = await Zk(t, n.id);
  if (n.config_ids = r, r.length > 0) {
    const a = await t.prepare(
      `SELECT id, name FROM qspider_crawl_configs WHERE id IN (${r.map(() => "?").join(",")})`
    ).bind(...r).all();
    n.configs = a.results || [];
  } else
    n.configs = [];
  return n;
}
async function Mf(t, e, s, n, r) {
  await t.prepare(
    "INSERT INTO qspider_crawl_logs (task_id, site_id, level, message) VALUES (?, ?, ?, ?)"
  ).bind(e || null, s, n, r).run();
}
async function Df(t, e) {
  let s = "SELECT * FROM qspider_crawl_configs";
  const n = [];
  return e && (s += " WHERE site_id=?", n.push(e)), s += " ORDER BY created_at DESC", (n.length ? await t.prepare(s).bind(...n).all() : await t.prepare(s).all()).results || [];
}
async function Yk(t, e = {}) {
  const { proxy: s, ...n } = e;
  return s && (n.headers = {
    ...n.headers || {},
    "X-Proxy-Url": s
  }), fetch(t, n);
}
class jR {
  constructor(e, s) {
    p(this, "state");
    p(this, "env");
    /** Active crawl task per site */
    p(this, "activeCrawls", /* @__PURE__ */ new Map());
    p(this, "initialized", !1);
    p(this, "_currentPage", 1);
    this.state = e, this.env = s;
  }
  async initialize() {
    this.initialized || (this.initialized = !0);
  }
  // ── DO fetch handler (HTTP + WebSocket upgrade) ──
  async fetch(e) {
    await this.initialize();
    const s = new URL(e.url);
    if (e.headers.get("Upgrade") === "websocket") {
      const n = new WebSocketPair(), [r, a] = Object.values(n);
      return this.state.acceptWebSocket(a), new Response(null, { status: 101, webSocket: r });
    }
    if (s.pathname === "/crawl" && e.method === "POST") {
      const n = await e.json(), r = n.siteId;
      if (!r) return new Response(JSON.stringify({ error: "siteId required" }), { status: 400 });
      const a = await this.startCrawl(r, n.taskId, n.cookieId, n.proxyId);
      return new Response(JSON.stringify({ taskId: a }));
    }
    if (s.pathname.startsWith("/stop/") && e.method === "POST") {
      const n = parseInt(s.pathname.split("/")[2]);
      return this.stopCrawl(n), new Response(JSON.stringify({ status: "stopped" }));
    }
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }
  // ── WebSocket message handler ──
  /** Called by Hibernation runtime when a WS message arrives (after DO wakes from hibernation) */
  webSocketMessage(e, s) {
    try {
      const n = JSON.parse(s);
      this.handleCommand(e, n).catch((r) => {
        try {
          e.send(JSON.stringify({ type: "error", message: r.message }));
        } catch {
        }
      });
    } catch (n) {
      try {
        e.send(JSON.stringify({ type: "error", message: n.message }));
      } catch {
      }
    }
  }
  /** Called by Hibernation runtime when a WS closes */
  webSocketClose() {
  }
  async handleCommand(e, s) {
    switch (s.type) {
      case "start_crawl":
        if (!s.siteId) {
          e.send(JSON.stringify({ type: "error", message: "siteId required" }));
          return;
        }
        const n = await this.startCrawl(s.siteId, s.taskId, s.cookieId, s.proxyId);
        e.send(JSON.stringify({ type: "crawl_started", taskId: n, status: "running", siteId: s.siteId }));
        break;
      case "stop_crawl":
        if (!s.siteId) {
          e.send(JSON.stringify({ type: "error", message: "siteId required" }));
          return;
        }
        this.stopCrawl(s.siteId), e.send(JSON.stringify({ type: "crawl_stopped", siteId: s.siteId }));
        break;
      case "ping":
        e.send(JSON.stringify({ type: "pong" }));
        break;
    }
  }
  // ── Broadcast to all connected clients ──
  broadcast(e) {
    const s = JSON.stringify(e);
    for (const n of this.state.getWebSockets())
      try {
        n.send(s);
      } catch {
      }
  }
  // ── Crawl Logic (CF-compatible core) ──
  async startCrawl(e, s, n, r) {
    this.stopCrawl(e);
    let a = n, i = r, o, c, d;
    if (s) {
      d = s;
      const u = await Nf(this.env.DB, s);
      u && (a === void 0 && (a = u.cookie_id), i === void 0 && (i = u.proxy_id), o = u.start_page, c = u.max_pages), await As(this.env.DB, s, { status: "running", started_at: (/* @__PURE__ */ new Date()).toISOString() });
    } else
      d = await Gk(this.env.DB, e, [], n, r);
    const l = new AbortController();
    return this.activeCrawls.set(e, { taskId: d, abort: l }), this.runCrawl(d, e, a, i, o, c).catch((u) => {
      console.error(`[QSpider] Crawl task ${d} failed:`, u);
    }), d;
  }
  stopCrawl(e) {
    const s = this.activeCrawls.get(e);
    s && (s.abort.abort(), this.activeCrawls.delete(e), As(this.env.DB, s.taskId, {
      status: "cancelled",
      completed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).catch(() => {
    }));
  }
  async runCrawl(e, s, n, r, a, i) {
    var c, d, l, u;
    const o = (h, f) => {
      Mf(this.env.DB, e, s, h, f).catch(() => {
      }), this.broadcast({ type: "log", taskId: e, level: h, message: f, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    };
    try {
      if (await As(this.env.DB, e, {
        status: "running",
        started_at: (/* @__PURE__ */ new Date()).toISOString()
      }), this.broadcast({ type: "task_update", taskId: e, status: "running" }), o("info", `Crawl task started for site ${s}`), !await If(this.env.DB, s)) {
        o("error", `Site ${s} not found`), await As(this.env.DB, e, { status: "failed", error_message: "Site not found", completed_at: (/* @__PURE__ */ new Date()).toISOString() });
        return;
      }
      const g = (await Df(this.env.DB, s)).find((Se) => Se.enabled);
      if (!g) {
        o("warn", "No enabled crawl config found — falling back to simulated crawl"), await this.simulatedRun(e, s, n, r);
        return;
      }
      o("info", `Using crawl config: ${g.name}`);
      const _ = await Nf(this.env.DB, e), w = (_ == null ? void 0 : _.min_interval_ms) ?? g.min_interval_ms ?? 6e3, b = (_ == null ? void 0 : _.max_interval_ms) ?? g.max_interval_ms ?? 8e3, I = (_ == null ? void 0 : _.rotate_cookie_after) ?? g.rotate_cookie_after ?? 50, D = (_ == null ? void 0 : _.rotate_proxy_after) ?? g.rotate_proxy_after ?? 100;
      o("info", `Crawl settings — interval: ${w}-${b}ms, cookie rotate: ${I}, proxy rotate: ${D}`);
      let z = (await kf(this.env.DB, s)).filter((Se) => Se.is_active);
      n && (z = z.filter((Se) => Se.id === n));
      let te = [];
      D === 0 ? o("info", "Proxy disabled (rotate_proxy_after = 0)") : (te = (await Tf(this.env.DB, s)).filter((Se) => Se.enabled), te.length === 0 ? o("warn", "No enabled proxies available") : o("info", `Using ${te.length} proxy/proxies, rotate every ${D} requests`)), z.length === 0 && o("warn", "No active cookies available. Add cookies to crawl.");
      const E = this.safeParseJson(g.list_headers_json, {}), we = g.page_size ?? 20;
      let Pe = a ?? 1;
      const j = i ?? 100;
      let he = 0, Ce = 0, We = 0, Ee = 0, xe = 0, Qe = 0;
      const et = (c = this.activeCrawls.get(s)) == null ? void 0 : c.abort;
      for (; !(et != null && et.signal.aborted); ) {
        const Se = z.length > 0 ? z[xe % z.length] : null, tr = te.length > 0 ? te[Qe % te.length] : null;
        let xt = g.list_url.replace(/\{page\}/g, String(Pe));
        xt = xt.replace(/\{timestamp\}/g, String(Date.now())), xt = xt.replace(/\{pageSize\}/g, String(we));
        const Dg = (d = g.list_body_json) == null ? void 0 : d.includes("{page}");
        if (g.pagination_type === "query_param" && g.page_param_name && !xt.includes("{page}") && !Dg) {
          const gn = xt.includes("?") ? "&" : "?";
          xt += `${gn}${g.page_param_name}=${Pe}`;
        }
        o("info", `Fetching page ${Pe}: ${xt} (cookie: ${(Se == null ? void 0 : Se.user_label) || "none"})`);
        const Sl = { ...E };
        Se != null && Se.cookie_value && (Sl.Cookie = Se.cookie_value);
        try {
          const gn = await this.fetchAndParsePage(
            xt,
            g,
            s,
            Pe,
            Sl,
            tr == null ? void 0 : tr.proxy_url,
            o,
            we,
            Se == null ? void 0 : Se.ua
          );
          Ce += gn.length;
          let Ya = 0;
          for (const Jt of gn) {
            const Bg = {
              ...Jt,
              age: Jt.age ?? void 0,
              vip_level: Jt.vip_level ?? void 0,
              avatar_url: Jt.avatar_url ?? void 0,
              registered_at: Jt.registered_at ?? void 0,
              gender: Jt.gender ?? void 0,
              city: Jt.city ?? void 0,
              nickname: Jt.nickname || ""
            };
            (await Rf(this.env.DB, Bg)).is_new && Jt.is_vip && Ya++;
          }
          if (We += Ya, he++, await As(this.env.DB, e, {
            pages_crawled: he,
            members_found: Ce,
            new_assets: We
          }), this.broadcast({
            type: "crawl_progress",
            taskId: e,
            page: Pe,
            totalMembers: Ce,
            totalAssets: We,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }), gn.length === 0) {
            o("warn", `No members extracted on page ${Pe}: ${xt} — check selectors or page content`);
            break;
          }
          Ee++, I > 0 && Ee % I === 0 && z.length > 0 && (xe++, o("info", `Rotating cookie to: ${(l = z[xe % z.length]) == null ? void 0 : l.user_label}`)), D > 0 && Ee % D === 0 && te.length > 0 && (Qe++, o("info", `Rotating proxy to: ${(u = te[Qe % te.length]) == null ? void 0 : u.proxy_url}`));
          const Pg = Math.floor(Math.random() * (b - w + 1)) + w;
          await new Promise((Jt) => setTimeout(Jt, Pg)), Pe++;
        } catch (gn) {
          if (o("error", `Page ${Pe} failed: ${gn.message}`), z.length > 0 && xe++, te.length > 0 && Qe++, !(et != null && et.signal.aborted))
            await new Promise((Ya) => setTimeout(Ya, w * 2)), Pe++;
          else
            break;
        }
        if (j && Pe > j) {
          o("info", `Reached max pages (${j})`);
          break;
        }
      }
      const ce = et != null && et.signal.aborted ? "cancelled" : "completed";
      await As(this.env.DB, e, {
        status: ce,
        completed_at: (/* @__PURE__ */ new Date()).toISOString()
      }), this.activeCrawls.delete(s), this.broadcast({
        type: "task_update",
        taskId: e,
        status: ce,
        totalMembers: Ce,
        totalAssets: We
      }), o("info", `Crawl ${ce}: ${Ce} members, ${We} new assets`);
    } catch (h) {
      o("error", `Crawl failed: ${h.message}`), await As(this.env.DB, e, {
        status: "failed",
        error_message: h.message,
        completed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).catch(() => {
      }), this.activeCrawls.delete(s), this.broadcast({ type: "task_update", taskId: e, status: "failed", error: h.message });
    }
  }
  /**
   * Fetch a list page and parse members from HTML using the crawl config selectors.
   */
  async fetchAndParsePage(e, s, n, r, a, i, o, c = 20, d) {
    const l = { method: s.list_http_method || "GET", headers: a };
    s.list_http_method === "POST" && s.list_body_json && (l.body = s.list_body_json.replace(/\{page\}/g, String(r)).replace(/\{timestamp\}/g, String(Date.now())).replace(/\{pageSize\}/g, String(c)).replace(/\{ua\}/g, String(d || s.ua || "")));
    const u = i ? await Yk(e, { ...l, proxy: i }) : await fetch(e, l);
    if (!u.ok)
      throw new Error(`HTTP ${u.status} ${u.statusText} for ${e}`);
    const h = await u.text();
    return (!h || h.length < 200) && (o == null || o("warn", `Page ${r} response too short (${(h == null ? void 0 : h.length) || 0} bytes) at ${e} — possible wrong URL or blocked`)), s.fetch_type === "json" ? this.extractMembersFromJson(h, s, n, o) : this.extractMembersFromHtml(h, s, n);
  }
  /**
   * Extract member data from HTML using CSS-selector-like patterns.
   *
   * Uses regex-based extraction since CF Workers have no DOM parser.
   * Selectors like `.class` are matched against HTML elements.
   * The `@attr` suffix extracts an attribute instead of text content.
   */
  extractMembersFromHtml(e, s, n) {
    const r = [], a = s.list_item_selector, i = this.extractBlocks(e, a);
    for (const o of i)
      try {
        const c = this.extractField(o, s.member_id_selector, s.member_id_attr || "text");
        if (!c) continue;
        const d = this.extractField(o, s.nickname_selector, "text") || "", l = this.extractField(o, s.age_selector, "text"), u = this.extractField(o, s.gender_selector, "text") || null, h = this.extractField(o, s.city_selector, "text") || null, f = s.is_vip_selector && this.extractField(o, s.is_vip_selector, "text") ? 1 : 0, g = this.extractField(o, s.vip_level_selector, "text") || null, _ = this.extractField(o, s.avatar_selector, "src") || null, w = this.extractField(o, s.registered_at_selector, "text") || null, b = l && parseInt(l.replace(/\D/g, "")) || null;
        r.push({
          site_id: n,
          member_id: c,
          nickname: d,
          age: b,
          gender: u,
          city: h,
          is_vip: f,
          vip_level: g,
          avatar_url: _,
          registered_at: w,
          raw_data: JSON.stringify({ selector: a, page: this._currentPage })
        });
      } catch {
      }
    return r;
  }
  /**
   * Extract member data from a JSON API response.
   *
   * Selector fields are interpreted as dot-path JSON paths.
   * `list_item_selector` points to the array of items (e.g., "data.list").
   * Other selectors are paths relative to each item (e.g., "userId", "userInfo.name").
   */
  extractMembersFromJson(e, s, n, r) {
    let a;
    try {
      a = JSON.parse(e);
    } catch (c) {
      return r == null || r("error", `JSON parse failed: ${c.message}`), [];
    }
    const i = (s.list_item_selector || "").replace(/^\$\.?/, ""), o = i ? this.resolveJsonPath(a, i) : a;
    return Array.isArray(o) ? o.map((c) => {
      try {
        const d = String(this.resolveJsonPath(c, s.member_id_selector) ?? "");
        if (!d) return null;
        const l = this.resolveJsonPath(c, s.age_selector), u = l != null && parseInt(String(l).replace(/\D/g, "")) || null;
        return {
          site_id: n,
          member_id: d,
          nickname: String(this.resolveJsonPath(c, s.nickname_selector) ?? ""),
          age: u,
          gender: String(this.resolveJsonPath(c, s.gender_selector) ?? "") || null,
          city: String(this.resolveJsonPath(c, s.city_selector) ?? "") || null,
          is_vip: s.is_vip_selector && this.resolveJsonPath(c, s.is_vip_selector) ? 1 : 0,
          vip_level: String(this.resolveJsonPath(c, s.vip_level_selector) ?? "") || null,
          avatar_url: String(this.resolveJsonPath(c, s.avatar_selector) ?? "") || null,
          registered_at: String(this.resolveJsonPath(c, s.registered_at_selector) ?? "") || null,
          raw_data: JSON.stringify({ jsonPath: i, item: c })
        };
      } catch {
        return null;
      }
    }).filter(Boolean) : (r == null || r("warn", `JSON path "${s.list_item_selector}" did not resolve to an array`), []);
  }
  /**
   * Resolve a dot-path from a JSON object.
   * Supports: "user.name", "data.items[0].id", "$.data.list"
   */
  resolveJsonPath(e, s) {
    if (!s || e == null) return null;
    const n = s.replace(/^\$\.?/, "");
    if (!n) return e;
    const r = n.split(".");
    let a = e;
    for (const i of r) {
      if (a == null || typeof a != "object") return null;
      const o = i.match(/^(\w+)\[(\d+)\]$/);
      if (o)
        if (a = a[o[1]], Array.isArray(a)) a = a[parseInt(o[2])];
        else return null;
      else
        a = a[i];
    }
    return a ?? null;
  }
  /**
   * Extract HTML blocks matching a CSS selector using regex.
   * Supports: tag, .class, #id, tag.class, [attr=value]
   */
  extractBlocks(e, s) {
    const n = this.selectorToRegex(s), r = [];
    let a;
    const i = new RegExp(`(<${n.source}[^>]*>)`, "gi");
    for (; (a = i.exec(e)) !== null; ) {
      const o = a.index, c = this._extractTagName(a[1]), l = e.slice(o).match(new RegExp(`<\\/${c}\\s*>`)), u = l ? o + l.index + l[0].length : e.indexOf("<", o + 1);
      u > o && (r.push(e.slice(o, u)), i.lastIndex = u);
    }
    return r;
  }
  /**
   * Extract a field value from an HTML block using a selector.
   * The selector can be: `.class`, `#id`, `tag`, or `tag @attr`
   * The `@attr` suffix specifies which attribute to extract.
   */
  extractField(e, s, n) {
    if (!s) return null;
    let r = s, a = n;
    const i = s.indexOf(" @");
    i > 0 && (r = s.slice(0, i), a = s.slice(i + 2));
    const o = this.selectorToRegex(r), c = e.match(o);
    if (!c) return null;
    if (a === "text")
      return c[0].replace(/<[^>]*>/g, "").trim() || null;
    const d = new RegExp(`${a}=["']([^"']*)["']`, "i"), l = c[0].match(d);
    return l ? l[1] : null;
  }
  /**
   * Convert a simple CSS selector to a regex pattern for HTML matching.
   */
  selectorToRegex(e) {
    e.split(/(?=[.#\[]) /);
    let s = "*", n = [], r = null;
    const a = e.match(/^([a-zA-Z0-9]+)/);
    a && (s = a[1]), e.startsWith(".") && (s = "*"), e.startsWith("#") && (s = "*");
    const i = e.match(/\.([a-zA-Z0-9_-]+)/g);
    i && (n = i.map((d) => d.slice(1)));
    const o = e.match(/#([a-zA-Z0-9_-]+)/);
    o && (r = o[1]);
    let c = `<${s}[^>]*`;
    n.length > 0 && (c += `\\s+class=["'][^"']*\\b(${n.join("|")})\\b[^"']*["']`), r && (c += `\\s+id=["']${r}["']`), c += "[^>]*>";
    try {
      return new RegExp(c, "i");
    } catch {
      return new RegExp(`<${s}[^>]*>`, "i");
    }
  }
  _extractTagName(e) {
    const s = e.match(/^<\s*([a-zA-Z0-9]+)/);
    return s ? s[1] : "div";
  }
  /**
   * Fallback simulated crawl when no crawl config is configured.
   */
  async simulatedRun(e, s, n, r) {
    var Pe;
    const a = (j, he) => {
      Mf(this.env.DB, e, s, j, he).catch(() => {
      }), this.broadcast({ type: "log", taskId: e, level: j, message: he, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    };
    if (!await If(this.env.DB, s)) return;
    const o = await Df(this.env.DB, s), c = o.find((j) => j.enabled) || o[0] || null, d = (c == null ? void 0 : c.min_interval_ms) || 3e3, l = (c == null ? void 0 : c.max_interval_ms) || 8e3, u = (c == null ? void 0 : c.rotate_cookie_after) || 50, h = (c == null ? void 0 : c.rotate_proxy_after) || 100, f = (c == null ? void 0 : c.page_size) || 20;
    let _ = (await kf(this.env.DB, s)).filter((j) => j.is_active);
    n && (_ = _.filter((j) => j.id === n));
    let w = [];
    (c == null ? void 0 : c.rotate_proxy_after) === 0 ? a("info", "Proxy disabled (rotate_proxy_after = 0)") : (w = (await Tf(this.env.DB, s)).filter((j) => j.enabled), w.length > 0 ? a("info", `Using ${w.length} proxy/proxies`) : a("warn", "No enabled proxies available")), _.length === 0 && a("warn", "No active cookies available. Add cookies to crawl.");
    let b = 1, I = 0, D = 0, M = 0, z = 0, te = 0;
    const E = (Pe = this.activeCrawls.get(s)) == null ? void 0 : Pe.abort;
    for (; !(E != null && E.signal.aborted); ) {
      const j = _.length > 0 ? _[z % _.length] : null, he = w.length > 0 ? w[te % w.length] : null;
      a("info", `Simulating page ${b} (cookie: ${(j == null ? void 0 : j.user_label) || "none"})`);
      const Ce = await this.simulateCrawlPageDB(
        this.env.DB,
        s,
        b,
        f,
        j,
        he
      );
      I += Ce.length;
      let We = 0;
      for (const xe of Ce) {
        const Qe = {
          ...xe,
          vip_level: xe.vip_level ?? void 0,
          avatar_url: xe.avatar_url ?? void 0
        };
        (await Rf(this.env.DB, Qe)).is_new && xe.is_vip && We++;
      }
      if (D += We, await As(this.env.DB, e, {
        pages_crawled: b,
        members_found: I,
        new_assets: D
      }), this.broadcast({ type: "crawl_progress", taskId: e, page: b, totalMembers: I, totalAssets: D, timestamp: (/* @__PURE__ */ new Date()).toISOString() }), M++, M % u === 0 && _.length > 0 && z++, M % h === 0 && w.length > 0 && te++, Ce.length === 0) {
        a("info", "No more members found, crawl complete");
        break;
      }
      const Ee = Math.floor(Math.random() * (l - d + 1)) + d;
      await new Promise((xe) => setTimeout(xe, Ee)), b++;
    }
    const we = E != null && E.signal.aborted ? "cancelled" : "completed";
    await As(this.env.DB, e, {
      status: we,
      completed_at: (/* @__PURE__ */ new Date()).toISOString()
    }), this.activeCrawls.delete(s), this.broadcast({ type: "task_update", taskId: e, status: we, totalMembers: I, totalAssets: D }), a("info", `Simulated crawl ${we}: ${I} members, ${D} new assets`);
  }
  safeParseJson(e, s) {
    try {
      return JSON.parse(e);
    } catch {
      return s;
    }
  }
  /**
   * Simulate crawling a page of members (fallback for when no config is configured).
   */
  async simulateCrawlPageDB(e, s, n, r, a, i) {
    if (n > 3) return [];
    const o = ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "南京"], c = ["张", "李", "王", "刘", "陈", "杨", "黄", "赵", "周", "吴"], d = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋"], l = ["普通会员", "钻石会员", "至尊会员"], u = [], h = /* @__PURE__ */ new Date(), f = h.toISOString().split("T")[0];
    for (let g = 0; g < r; g++) {
      const _ = (n - 1) * r + g, w = Math.random() < 0.3, b = Math.random() < 0.1;
      let I;
      if (b)
        I = f;
      else {
        const M = Math.floor(Math.random() * 365) + 1, z = new Date(h);
        z.setDate(z.getDate() - M), I = z.toISOString().split("T")[0];
      }
      const D = c[Math.floor(Math.random() * c.length)] + d[Math.floor(Math.random() * d.length)];
      u.push({
        site_id: s,
        member_id: `sim_member_${1e5 + _}`,
        nickname: D,
        age: Math.floor(Math.random() * 20) + 22,
        gender: Math.random() < 0.5 ? "female" : "male",
        city: o[Math.floor(Math.random() * o.length)],
        is_vip: w ? 1 : 0,
        vip_level: w ? l[Math.floor(Math.random() * l.length)] : null,
        registered_at: I,
        raw_data: JSON.stringify({ source: "simulated", page: n, index: g })
      });
    }
    return u;
  }
}
const Xk = 30 * 24 * 60 * 60;
class Qk {
  constructor(e, s, n, r, a, i, o, c) {
    this.channels = e, this.conversations = s, this.messages = n, this.conversationService = r, this.realtime = a, this.media = i, this.endUsers = o, this.tokenSecret = c;
  }
  async createSession(e) {
    const s = await this.channels.getAccount(e.channelAccountId);
    this.assertWebChatChannel(s);
    const n = eR(e.visitorId), r = !!(e.endUserId && e.endUserName), a = r ? `${e.endUserId}` : n, i = Math.floor(Date.now() / 1e3) + Xk, o = await this.signToken({
      version: 1,
      channelAccountId: s.id,
      visitorId: a,
      contactName: r ? e.endUserName : "匿名访客",
      isAnonymous: !r,
      exp: i
    }), c = await this.conversations.findLatestByExternalContact(s.id, a);
    return {
      conversationId: (c == null ? void 0 : c.id) ?? "",
      channelAccountId: s.id,
      visitorId: a,
      visitorToken: o,
      expiresAt: new Date(i * 1e3).toISOString()
    };
  }
  async sendVisitorMediaMessage(e) {
    const { conversationId: s, claims: n } = await this.ensureConversation(e.token, e.conversationId || void 0), r = await this.channels.getAccount(n.channelAccountId), a = e.clientMessageId ? `widget:${n.visitorId}:${e.clientMessageId}` : Ie("widget_evt"), i = await this.messages.findByExternalMessageId(r.id, a);
    if (i)
      return {
        conversationId: i.conversationId,
        inboundMessage: Os(i),
        aiMessage: null,
        duplicate: !0
      };
    const o = Ie("msg"), c = await this.media.storeUpload({
      conversationId: s,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage({
      channelAccount: r,
      inbound: {
        externalMessageId: a,
        externalContactId: n.visitorId,
        externalThreadId: n.visitorId,
        contactName: n.contactName,
        isAnonymous: n.isAnonymous,
        messageType: c.messageType,
        content: tR(e.content),
        attachments: [c.attachment],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: V()
      },
      messageId: o
    }, { createAiReply: !1 });
    return d.duplicate || await this.notifyVisitorMessageResult(d), {
      conversationId: d.conversationId,
      inboundMessage: Os(d.inboundMessage),
      aiMessage: null,
      duplicate: d.duplicate
    };
  }
  async sendVisitorMessage(e, s = {}) {
    const { conversationId: n, claims: r } = await this.ensureConversation(e.token, e.conversationId || void 0), a = await this.channels.getAccount(r.channelAccountId), i = await this.conversationService.receiveInboundMessage({
      channelAccount: a,
      inbound: {
        externalMessageId: e.clientMessageId ? `widget:${r.visitorId}:${e.clientMessageId}` : Ie("widget_evt"),
        externalContactId: r.visitorId,
        externalThreadId: r.visitorId,
        contactName: r.contactName,
        isAnonymous: r.isAnonymous,
        messageType: "text",
        content: e.content.trim(),
        attachments: [],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: V()
      }
    }, { createAiReply: s.createAiReply });
    return i.aiMessage && await this.messages.markSent(i.aiMessage.id, i.aiMessage.id), s.notifyRealtime !== !1 && await this.notifyVisitorMessageResult(i), {
      conversationId: i.conversationId,
      inboundMessage: Os(i.inboundMessage),
      aiMessage: i.aiMessage ? Os({ ...i.aiMessage, status: "sent" }) : null,
      duplicate: i.duplicate
    };
  }
  async completeVisitorMessage(e) {
    try {
      const s = await this.conversations.findById(e.conversationId), n = await this.messages.findById(e.inboundMessageId);
      if (!s || !n || n.conversationId !== s.id) return;
      await this.realtime.notifyMessageCreated({
        conversation: s,
        message: n
      });
      const r = await this.conversationService.createAiReply({
        conversationId: s.id,
        channelAccountId: s.channelAccountId,
        messageContent: n.content,
        handoffStatus: s.handoffStatus
      });
      if (!r) return;
      await this.messages.markSent(r.id, r.id);
      const a = await this.conversations.findById(s.id) ?? s;
      await this.realtime.notifyMessageCreated({
        conversation: a,
        message: { ...r, status: "sent" }
      });
    } catch (s) {
      ts.warn("widget_message_background_failed", {
        conversationId: e.conversationId,
        inboundMessageId: e.inboundMessageId,
        error: s instanceof Error ? s.message : String(s)
      });
    }
  }
  async ensureConversation(e, s) {
    const n = await this.verifyToken(e), r = await this.channels.getAccount(n.channelAccountId);
    if (this.assertWebChatChannel(r), !n.isAnonymous && !await this.endUsers.findById(n.visitorId))
      throw new v("END_USER_NOT_FOUND", "End user not found", 401);
    if (s && s !== "_") {
      const i = await this.conversations.findById(s);
      if (!i)
        throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
      if (i.channelAccountId !== n.channelAccountId || i.externalContactId !== n.visitorId)
        throw new v("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
      return { conversationId: s, claims: n };
    }
    return { conversationId: (await this.conversations.findOrCreateByExternalThread({
      channelAccountId: r.id,
      externalContactId: n.visitorId,
      externalThreadId: n.visitorId,
      contactName: n.contactName,
      isAnonymous: n.isAnonymous
    })).id, claims: n };
  }
  async notifyVisitorMessageResult(e) {
    const s = e.duplicate ? null : await this.conversations.findById(e.conversationId);
    s && (await this.realtime.notifyMessageCreated({
      conversation: s,
      message: e.inboundMessage
    }), e.aiMessage && await this.realtime.notifyMessageCreated({
      conversation: s,
      message: { ...e.aiMessage, status: "sent" }
    }));
  }
  async listMessages(e) {
    return await this.verifyConversationAccess(e.conversationId, e.token), (await this.messages.listByConversationAfter(e.conversationId, e.afterMessageId, 100)).map(Os);
  }
  requireConversationAccess(e, s) {
    return this.verifyConversationAccess(e, s);
  }
  assertWebChatChannel(e) {
    if (e.channelType !== "web_chat")
      throw new v("CHANNEL_NOT_WEB_CHAT", "Channel is not a Web Chat channel", 400);
    if (e.status !== "active")
      throw new v("CHANNEL_INACTIVE", "Channel is not active", 400);
  }
  async verifyConversationAccess(e, s) {
    const n = await this.verifyToken(s), r = await this.conversations.findById(e);
    if (!r)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (r.channelAccountId !== n.channelAccountId || r.externalContactId !== n.visitorId || r.externalThreadId !== n.visitorId)
      throw new v("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
    return n;
  }
  async signToken(e) {
    const s = Ht(JSON.stringify(e)), n = await Un(this.tokenSecret, s);
    return `${s}.${n}`;
  }
  async verifyToken(e) {
    const [s, n] = e.split(".");
    if (!s || !n)
      throw new v("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const r = await Un(this.tokenSecret, s);
    if (!Fr(n, r))
      throw new v("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const a = JSON.parse(yd(s));
    if (!a.version || !a.channelAccountId || !a.visitorId || !a.contactName || a.isAnonymous === void 0 || !a.exp)
      throw new v("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    if (a.exp < Math.floor(Date.now() / 1e3))
      throw new v("VISITOR_TOKEN_EXPIRED", "Visitor token has expired", 401);
    return a;
  }
}
function eR(t) {
  const e = t.trim().slice(0, 128);
  if (!e)
    throw new v("VISITOR_ID_INVALID", "Visitor id cannot be empty", 400);
  return e;
}
function tR(t) {
  return (t == null ? void 0 : t.trim()) ?? "";
}
const sR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WidgetService: Qk
}, Symbol.toStringTag, { value: "Module" }));
function Uc(t, e, s, n, r) {
  const a = xs(t.rawPayloadJson);
  return {
    id: t.id,
    conversationId: t.conversationId,
    direction: t.direction,
    senderType: t.senderType,
    messageType: t.messageType,
    content: t.content,
    attachments: wd(t.attachmentsJson),
    status: t.status,
    createdAt: t.createdAt,
    contactName: e,
    externalContactId: s,
    avatarUrl: n ?? null,
    signature: r ?? null,
    likeCount: a.likeCount,
    likedBy: a.likedBy,
    quotedMessageId: a.quotedMessageId
  };
}
function xs(t) {
  if (!t)
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  try {
    const e = JSON.parse(t);
    return {
      likeCount: typeof e.forumLikes == "number" ? e.forumLikes : 0,
      likedBy: Array.isArray(e.forumLikedBy) ? e.forumLikedBy : [],
      tags: Array.isArray(e.forumTags) ? e.forumTags : [],
      category: typeof e.forumCategory == "string" ? e.forumCategory : "综合讨论",
      isPinned: e.forumPinned === !0,
      isFeatured: e.forumFeatured === !0,
      quotedMessageId: typeof e.quotedMessageId == "string" ? e.quotedMessageId : null,
      visibility: e.forumVisibility === "login_required" ? "login_required" : "public",
      forumDeleted: e.forumDeleted === !0,
      forumDeletedBy: typeof e.forumDeletedBy == "string" ? e.forumDeletedBy : null,
      forumDeletedAt: typeof e.forumDeletedAt == "string" ? e.forumDeletedAt : null,
      forumEditedAt: typeof e.forumEditedAt == "string" ? e.forumEditedAt : null,
      forumTopicTitle: typeof e.forumTopicTitle == "string" ? e.forumTopicTitle : null
    };
  } catch {
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  }
}
function ia(t) {
  var e;
  if (!t) return null;
  try {
    const s = JSON.parse(t);
    return typeof ((e = s == null ? void 0 : s.settings) == null ? void 0 : e.avatar_url) == "string" ? s.settings.avatar_url : null;
  } catch {
    return null;
  }
}
function nR(t) {
  var e;
  if (!t) return null;
  try {
    const s = JSON.parse(t);
    return typeof ((e = s == null ? void 0 : s.settings) == null ? void 0 : e.signature) == "string" ? s.settings.signature : null;
  } catch {
    return null;
  }
}
const Pf = 30 * 24 * 60 * 60;
class rR {
  constructor(e, s, n, r, a, i, o, c, d, l) {
    this.channels = e, this.conversations = s, this.messages = n, this.conversationService = r, this.realtime = a, this.media = i, this.endUsers = o, this.endUserAuth = c, this.auth = d, this.tokenSecret = l;
  }
  async listTopics(e) {
    const s = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(s);
    const n = e.limit ?? 50, r = e.offset ?? 0, [a, i] = await Promise.all([
      this.conversations.listByChannelWithFirstMessage(s.id, n, r),
      this.conversations.countByChannel(s.id)
    ]), o = [...new Set(a.map((u) => u.externalContactId).filter(Boolean))], c = await this.endUsers.findByIds(o), d = /* @__PURE__ */ new Map();
    for (const u of c)
      d.set(u.id, ia(u.rawPayloadJson));
    let l = a.map((u) => {
      const h = yi(u.firstMessageRawPayload), f = xs(u.firstMessageRawPayload);
      return {
        id: u.id,
        conversationId: u.id,
        title: h,
        authorName: u.contactName ?? "匿名用户",
        authorId: u.externalContactId ?? "",
        avatarUrl: d.get(u.externalContactId ?? "") ?? null,
        category: f.category ?? "综合讨论",
        messageCount: u.unreadCount,
        lastReplyAt: u.lastMessageAt ?? u.createdAt,
        createdAt: u.createdAt,
        tags: f.tags,
        isPinned: f.isPinned,
        isFeatured: f.isFeatured,
        likeCount: f.likeCount,
        likedBy: f.likedBy,
        visibility: f.visibility,
        isDeleted: f.forumDeleted,
        editedAt: f.forumEditedAt
      };
    });
    if (e.search) {
      const u = e.search.toLowerCase();
      l = l.filter(
        (h) => h.title.toLowerCase().includes(u) || h.authorName.toLowerCase().includes(u) || h.tags.some((f) => f.toLowerCase().includes(u))
      );
    }
    return e.tag && (l = l.filter((u) => u.tags.includes(e.tag))), e.category && (l = l.filter((u) => u.category === e.category)), e.sortBy === "replies" ? l.sort((u, h) => h.messageCount - u.messageCount) : e.sortBy === "hot" ? l.sort((u, h) => h.likeCount - u.likeCount || h.messageCount - u.messageCount) : l.sort((u, h) => u.isPinned !== h.isPinned ? u.isPinned ? -1 : 1 : new Date(h.lastReplyAt).getTime() - new Date(u.lastReplyAt).getTime()), { topics: l, total: i };
  }
  async createTopic(e) {
    const s = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(s);
    const n = Fc(e.visitorId), r = `forum:${n}:${Ie("forum_topic")}`, { contactName: a, externalContactId: i, isAnonymous: o } = await this.resolveEndUserIdentity(
      n,
      e.endUserToken
    );
    let c = null;
    if (!o && i)
      try {
        const u = await this.endUsers.findById(i);
        u && (c = ia(u.rawPayloadJson));
      } catch {
      }
    const d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: s,
        inbound: {
          externalMessageId: r,
          externalContactId: i,
          externalThreadId: i,
          contactName: a,
          isAnonymous: o,
          messageType: "text",
          content: `**${e.title}**

${e.content.trim()}`,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumTopicTitle: e.title,
            forumCategory: e.category ?? "综合讨论",
            forumTags: e.tags ?? [],
            forumLikes: 0,
            forumLikedBy: [],
            forumPinned: !1,
            forumFeatured: !1,
            forumVisibility: e.visibility ?? "public",
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle
          },
          receivedAt: V()
        }
      },
      { createAiReply: !1 }
    ), l = await this.signForumToken({
      version: 1,
      channelAccountId: s.id,
      visitorId: i,
      conversationId: d.conversationId,
      contactName: a,
      isAnonymous: o,
      exp: Math.floor(Date.now() / 1e3) + Pf
    });
    return {
      conversationId: d.conversationId,
      channelAccountId: s.id,
      visitorId: i,
      visitorToken: l,
      expiresAt: new Date(Date.now() + Pf * 1e3).toISOString(),
      message: Uc(d.inboundMessage, a, i, c)
    };
  }
  async sendReply(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = Fc(e.visitorId), a = `forum:${r}:${Ie("forum_reply")}`, { contactName: i, externalContactId: o, isAnonymous: c } = await this.resolveEndUserIdentity(
      r,
      e.endUserToken
    );
    let d = null;
    if (!c && o)
      try {
        const h = await this.endUsers.findById(o);
        h && (d = ia(h.rawPayloadJson));
      } catch {
      }
    let l = e.content.trim();
    if (e.quotedMessageId) {
      const h = await this.messages.findById(e.quotedMessageId);
      if (h && h.conversationId === e.conversationId) {
        const f = s.contactName && s.contactName !== "匿名用户" ? s.contactName : `用户${(s.externalContactId ?? "").slice(-5)}`, _ = (h.content ?? "").substring(0, 500).split(`
`);
        let w = _.length;
        for (let z = 0; z < _.length; z++)
          if (/^> @.+ 说：$/.test(_[z].trim())) {
            w = z;
            break;
          }
        const b = _.slice(0, w), I = _.slice(w), D = [];
        if (!xs(h.rawPayloadJson).quotedMessageId && b.length > 0) {
          const z = b[0].trim();
          z.startsWith("**") && z.endsWith("**") && (b.shift(), b.length > 0 && b[0].trim() === "" && b.shift());
        }
        D.push(l), D.push("");
        for (const z of b) D.push(z.trim() === "" ? ">" : `> ${z}`);
        D.push(`> @${f} 说：`);
        for (const z of I) D.push(`> ${z}`);
        l = D.join(`
`);
      }
    }
    const u = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: a,
          externalContactId: o,
          externalThreadId: s.externalThreadId ?? o,
          contactName: i,
          isAnonymous: c,
          messageType: "text",
          content: l,
          attachments: [],
          rawPayload: {
            source: "forum",
            forumLikes: 0,
            forumLikedBy: [],
            pageUrl: e.pageUrl,
            pageTitle: e.pageTitle,
            quotedMessageId: e.quotedMessageId || null
          },
          receivedAt: V()
        }
      },
      { createAiReply: !1 }
    );
    return u.duplicate || await this.realtime.notifyMessageCreated({
      conversation: s,
      message: u.inboundMessage
    }), {
      conversationId: u.conversationId,
      message: Uc(u.inboundMessage, i, o, d),
      duplicate: u.duplicate
    };
  }
  async listMessages(e) {
    const s = await this.conversations.findById(e.conversationId), n = (s == null ? void 0 : s.contactName) ?? "论坛用户", r = (s == null ? void 0 : s.externalContactId) ?? "anonymous";
    let a = null, i = null;
    if (r && r !== "anonymous")
      try {
        const h = await this.endUsers.findById(r);
        h && (a = ia(h.rawPayloadJson), i = nR(h.rawPayloadJson));
      } catch {
      }
    const o = await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ), c = o.length > 0 ? yi(o[0].rawPayloadJson) : void 0, d = o.length > 0 ? xs(o[0].rawPayloadJson).visibility : void 0, l = o.length > 0 ? xs(o[0].rawPayloadJson).forumDeleted : !1, u = (s == null ? void 0 : s.externalContactId) ?? "";
    return {
      messages: o.map((h) => {
        let f = h.content;
        return f && (f = f.replace(/^\*\*.+?\*\*\n\n/, "")), Uc({ ...h, content: f }, n, r, a, i);
      }),
      topicTitle: c,
      topicVisibility: d,
      isDeleted: l,
      topicAuthorId: u
    };
  }
  async likeTopic(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = Fc(e.visitorId), a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new v("MESSAGE_NOT_FOUND", "First message not found", 404);
    const i = xs(a.rawPayloadJson), o = i.likedBy.includes(r);
    let c, d;
    return o ? (c = Math.max(0, i.likeCount - 1), d = i.likedBy.filter((l) => l !== r)) : (c = i.likeCount + 1, d = [...i.likedBy, r]), await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumLikes: c,
      forumLikedBy: d
    }), { likeCount: c, liked: !o, likedBy: d };
  }
  async togglePin(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new v("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumPinned: e.pin
    }), { isPinned: e.pin };
  }
  async toggleFeatured(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new v("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumFeatured: e.feature
    }), { isFeatured: e.feature };
  }
  async deleteTopic(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new v("MESSAGE_NOT_FOUND", "First message not found", 404);
    if (xs(r.rawPayloadJson), e.userRole !== "admin") {
      if (e.userRole !== "mediator") throw new v("FORBIDDEN", "You do not have permission to delete this topic", 403);
    }
    return await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumDeleted: !0,
      forumDeletedBy: e.userId,
      forumDeletedAt: V()
    }), { success: !0 };
  }
  async updateTopic(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new v("MESSAGE_NOT_FOUND", "First message not found", 404);
    const a = xs(r.rawPayloadJson);
    if (a.forumDeleted)
      throw new v("TOPIC_DELETED", "Cannot edit a deleted topic", 400);
    if (e.userRole !== "admin") {
      if (e.userRole === "mediator")
        throw new v("FORBIDDEN", "Mediators cannot edit topics", 403);
      if (s.externalContactId !== e.userId)
        throw new v("FORBIDDEN", "You can only edit your own topics", 403);
    }
    const i = {};
    if (e.title !== void 0 && (i.forumTopicTitle = e.title), e.content !== void 0) {
      const o = e.title ? `**${e.title}**

${e.content.trim()}` : `**${a.forumTopicTitle || "无标题"}**

${e.content.trim()}`;
      await this.messages.updateContent(r.id, o), i.forumEditedAt = V();
    } else if (e.title !== void 0) {
      const o = r.content || "", c = o.indexOf(`

`), d = c >= 0 ? o.slice(c + 2) : o, l = `**${e.title}**

${d}`;
      await this.messages.updateContent(r.id, l), i.forumEditedAt = V();
    }
    return Object.keys(i).length > 0 && await this.updateMessageRawPayload(r.id, r.rawPayloadJson, i), { success: !0 };
  }
  async getUserProfile(e) {
    var l, u;
    const s = await this.conversations.listByExternalContact(e, "forum");
    if (s.length === 0) return null;
    const n = s[0].isAnonymous, r = s[0].contactName ?? "匿名用户";
    let a = 0, i = 0, o = null, c = null;
    if (!n)
      try {
        const h = await this.endUsers.findById(e);
        if (h != null && h.rawPayloadJson) {
          const f = JSON.parse(h.rawPayloadJson);
          typeof ((l = f == null ? void 0 : f.settings) == null ? void 0 : l.avatar_url) == "string" && (o = f.settings.avatar_url), typeof ((u = f == null ? void 0 : f.settings) == null ? void 0 : u.signature) == "string" && (c = f.settings.signature);
        }
      } catch {
      }
    const d = [];
    for (const h of s) {
      const f = await this.getFirstMessage(h.id), g = xs((f == null ? void 0 : f.rawPayloadJson) ?? null);
      a += g.likeCount, i += Math.max(0, h.unreadCount - 1), f && d.push({
        id: h.id,
        conversationId: h.id,
        title: yi(f.rawPayloadJson),
        authorName: h.contactName ?? "匿名用户",
        authorId: h.externalContactId ?? "",
        category: g.category,
        messageCount: h.unreadCount,
        lastReplyAt: h.lastMessageAt ?? h.createdAt,
        createdAt: h.createdAt,
        tags: g.tags,
        isPinned: g.isPinned,
        isFeatured: g.isFeatured,
        likeCount: g.likeCount,
        likedBy: g.likedBy,
        visibility: g.visibility,
        isDeleted: g.forumDeleted,
        editedAt: g.forumEditedAt
      });
    }
    return {
      externalContactId: e,
      displayName: r,
      isAnonymous: n,
      topicCount: s.length,
      replyCount: i,
      totalLikesReceived: a,
      joinedAt: s[s.length - 1].createdAt,
      avatarUrl: o,
      signature: c,
      recentTopics: d.sort(
        (h, f) => new Date(f.lastReplyAt).getTime() - new Date(h.lastReplyAt).getTime()
      )
    };
  }
  async getUserNotifications(e) {
    const s = await this.conversations.listByExternalContact(e, "forum"), n = [];
    for (const r of s) {
      const a = await this.getFirstMessage(r.id), i = yi((a == null ? void 0 : a.rawPayloadJson) ?? null), o = Math.max(0, r.unreadCount - 1);
      n.push({
        topicId: r.id,
        topicTitle: i,
        replyCount: o,
        lastReplyAt: r.lastMessageAt ?? r.createdAt,
        lastReplyAuthor: r.contactName ?? "匿名用户",
        hasNewReplies: o > 0
      });
    }
    return n;
  }
  // ===== PM (Private Message) 方法 =====
  async createPMConversation(e) {
    const s = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(s);
    const n = await this.endUsers.findById(e.currentUserId), r = await this.endUsers.findById(e.targetUserId);
    if (!n || !r)
      throw new v("USER_NOT_FOUND", "User not found", 404);
    const a = [e.currentUserId, e.targetUserId].sort(), i = `pm:${a[0]}::${a[1]}`, o = await this.conversations.findByExternalThread(s.id, i);
    return o ? { conversationId: o.id, isNew: !1 } : { conversationId: (await this.conversations.create({
      channelAccountId: s.id,
      externalContactId: e.currentUserId,
      externalThreadId: i,
      contactName: r.displayName || r.username,
      isAnonymous: !1
    })).id, isNew: !0 };
  }
  async listPMConversations(e) {
    const n = (await this.conversations.listByChannel(e.channelAccountId)).filter((a) => {
      var i;
      return (i = a.externalThreadId) == null ? void 0 : i.startsWith("pm:");
    }), r = [];
    for (const a of n) {
      const i = (a.externalThreadId ?? "").replace("pm:", "").split("::");
      if (!i.includes(e.currentUserId)) continue;
      const o = i.find((l) => l !== e.currentUserId) || "", c = await this.endUsers.findById(o);
      let d = null;
      if (a.lastMessageId) {
        const l = await this.messages.findById(a.lastMessageId);
        l && (d = l.content ? l.content.substring(0, 100) : "[媒体消息]");
      }
      r.push({
        id: a.id,
        contactName: (c == null ? void 0 : c.displayName) || (c == null ? void 0 : c.username) || "未知用户",
        contactId: o,
        lastMessage: d,
        lastMessageAt: a.lastMessageAt,
        isOnline: !1,
        unreadCount: a.unreadCount,
        avatarUrl: ia((c == null ? void 0 : c.rawPayloadJson) ?? null)
      });
    }
    return r.sort((a, i) => a.lastMessageAt ? i.lastMessageAt ? new Date(i.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime() : -1 : 1), r;
  }
  async sendPMMessage(e) {
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.endUsers.findById(e.senderUserId);
    if (!r)
      throw new v("USER_NOT_FOUND", "Sender not found", 404);
    const a = `pm:${r.id}:${Ie("pm_msg")}`, i = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: a,
          externalContactId: r.id,
          externalThreadId: s.externalThreadId,
          contactName: r.displayName || r.username,
          isAnonymous: !1,
          messageType: "text",
          content: e.content.trim(),
          attachments: [],
          rawPayload: {
            source: "pm"
          },
          receivedAt: V()
        }
      },
      { createAiReply: !1 }
    );
    if (!i.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: s,
        message: i.inboundMessage
      });
      const c = (s.externalThreadId ?? "").replace("pm:", "").split("::").find((d) => d !== e.senderUserId);
      c && await this.realtime.notifyEndUserMessage(c, {
        type: "pm_message.new",
        conversationId: s.id,
        message: {
          id: i.inboundMessage.id,
          content: i.inboundMessage.content,
          createdAt: i.inboundMessage.createdAt,
          senderId: e.senderUserId
        }
      });
    }
    return { message: i.inboundMessage };
  }
  async sendPMMediaMessage(e) {
    var l;
    const s = await this.conversations.findById(e.conversationId);
    if (!s)
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(s.channelAccountId);
    this.assertForumChannel(n);
    const r = await this.endUsers.findById(e.senderUserId);
    if (!r)
      throw new v("USER_NOT_FOUND", "Sender not found", 404);
    const a = e.clientMessageId ? `pm:${r.id}:${e.clientMessageId}` : `pm:${r.id}:${Ie("pm_msg")}`, i = await this.messages.findByExternalMessageId(n.id, a);
    if (i)
      return { message: i };
    const o = Ie("msg"), c = await this.media.storeUpload({
      conversationId: s.id,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
        inbound: {
          externalMessageId: a,
          externalContactId: r.id,
          externalThreadId: s.externalThreadId,
          contactName: r.displayName || r.username,
          isAnonymous: !1,
          messageType: c.messageType,
          content: ((l = e.content) == null ? void 0 : l.trim()) || "",
          attachments: [c.attachment],
          rawPayload: {
            source: "pm"
          },
          receivedAt: V()
        },
        messageId: o
      },
      { createAiReply: !1 }
    );
    if (!d.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: s,
        message: d.inboundMessage
      });
      const h = (s.externalThreadId ?? "").replace("pm:", "").split("::").find((f) => f !== e.senderUserId);
      h && await this.realtime.notifyEndUserMessage(h, {
        type: "pm_message.new",
        conversationId: s.id,
        message: {
          id: d.inboundMessage.id,
          content: d.inboundMessage.content,
          createdAt: d.inboundMessage.createdAt,
          senderId: e.senderUserId
        }
      });
    }
    return { message: d.inboundMessage };
  }
  async listPMMessages(e) {
    if (!await this.conversations.findById(e.conversationId))
      throw new v("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return { messages: await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ) };
  }
  async requireConversationAccess(e, s) {
    const n = await this.conversations.findById(e);
    if (!n)
      throw new v("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const r = await this.channels.getAccount(n.channelAccountId);
    return this.assertForumChannel(r), {
      conversationId: n.id,
      visitorId: n.externalContactId ?? "anonymous"
    };
  }
  async resolveEndUserIdentity(e, s) {
    if (s) {
      const n = await this.endUserAuth.tryGetEndUser(`Bearer ${s}`);
      if (n)
        return {
          contactName: n.displayName || n.username,
          externalContactId: n.id,
          isAnonymous: !1
        };
      const r = await this.auth.tryGetAdminUser(`Bearer ${s}`);
      if (r)
        return {
          contactName: r.name || "Default Admin",
          externalContactId: "admin_1",
          isAnonymous: !1
        };
    }
    return {
      contactName: "论坛用户",
      externalContactId: e,
      isAnonymous: !0
    };
  }
  assertForumChannel(e) {
    if (e.channelType !== "forum")
      throw new v("CHANNEL_NOT_FORUM", "Channel is not a forum channel", 400);
  }
  async getFirstMessage(e) {
    return this.messages.listByConversation(e, 1).then((s) => s[0] ?? null);
  }
  async updateMessageRawPayload(e, s, n) {
    let r = {};
    if (s)
      try {
        r = JSON.parse(s);
      } catch {
      }
    const a = { ...r, ...n };
    await this.messages.updateRawPayload(e, JSON.stringify(a));
  }
  async signForumToken(e) {
    const s = Ht(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = Ht(JSON.stringify(e)), r = await Un(`${s}.${n}`, this.tokenSecret);
    return `${s}.${n}.${r}`;
  }
}
function Fc(t) {
  const e = t.trim();
  return e ? e.length > 128 ? e.slice(0, 128) : e : "anonymous";
}
function yi(t) {
  if (!t) return "无标题";
  try {
    const e = JSON.parse(t);
    if (e.forumTopicTitle && typeof e.forumTopicTitle == "string")
      return e.forumTopicTitle.trim();
  } catch {
  }
  return "无标题";
}
const aR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForumService: rR
}, Symbol.toStringTag, { value: "Module" })), Qn = new Nt();
Qn.get("/ws", async (t) => {
  var o, c;
  iR(t.req.raw);
  const e = await N(t.env), s = (o = t.req.query("token")) == null ? void 0 : o.trim(), n = await e.auth.requireAdminUser({
    adminUserId: ((c = t.req.query("adminUserId")) == null ? void 0 : c.trim()) || t.req.header("x-admin-user-id"),
    authorization: s ? `Bearer ${s}` : t.req.header("authorization")
  }), r = t.env.ADMIN_STREAM.idFromName("admin"), a = t.env.ADMIN_STREAM.get(r), i = oR(t.req.raw, {
    "x-supportly-admin-user-id": n.id
  });
  return a.fetch(i);
});
Qn.use("*", Us());
Qn.get("/", (t) => q({ ok: !0 }));
Qn.get("/end-users", async (t) => {
  const e = await N(t.env);
  return q(await e.endUserAuth.listUsers());
});
Qn.post("/end-users/:id/approve", async (t) => {
  const e = await N(t.env);
  return q(await e.endUserAuth.approveUser(t.req.param("id")));
});
Qn.post("/end-users/:id/deactivate", async (t) => (await (await N(t.env)).endUserAuth.deactivateUser(t.req.param("id")), q({ deactivated: !0 })));
function iR(t) {
  var e;
  if (((e = t.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new v("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function oR(t, e) {
  const s = new URL(t.url);
  s.searchParams.delete("token"), s.searchParams.delete("adminUserId");
  const n = new Headers(t.headers);
  n.delete("authorization"), n.delete("x-admin-user-id");
  for (const [r, a] of Object.entries(e))
    n.set(r, a);
  return new Request(s.toString(), {
    method: t.method,
    headers: n
  });
}
const cR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adminRoutes: Qn
}, Symbol.toStringTag, { value: "Module" })), dR = oe({
  channelAccountId: O().min(1),
  visitorId: O().min(1).max(128),
  pageUrl: O().max(2048).optional(),
  pageTitle: O().max(300).optional()
}), lR = oe({
  clientMessageId: O().trim().min(1).max(128).optional(),
  content: O().trim().min(1).max(2e3),
  pageUrl: O().max(2048).optional(),
  pageTitle: O().max(300).optional()
}), er = new Nt();
er.get("/ws", async (t) => {
  var o;
  uR(t.req.raw);
  const e = (o = t.req.query("conversationId")) == null ? void 0 : o.trim();
  if (!e)
    throw new v("CONVERSATION_ID_REQUIRED", "Conversation id is required", 400);
  const n = await (await N(t.env)).widget.requireConversationAccess(e, Mg(t.req.raw, t.req.query("token"))), r = t.env.VISITOR_STREAM.idFromName(e), a = t.env.VISITOR_STREAM.get(r), i = pR(t.req.raw, {
    "x-supportly-conversation-id": e,
    "x-supportly-visitor-id": n.visitorId
  });
  return a.fetch(i);
});
er.post("/conversations", async (t) => {
  const e = dR.parse(await t.req.json()), s = await N(t.env), n = t.req.header("authorization"), r = n ? await s.endUserAuth.requireEndUser(n) : null;
  return Gt(await s.widget.createSession({
    ...e,
    endUserId: r == null ? void 0 : r.id,
    endUserName: r == null ? void 0 : r.displayName
  }));
});
er.post("/conversations/:conversationId/messages", async (t) => {
  const e = lR.parse(await t.req.json()), s = await N(t.env), n = await s.widget.sendVisitorMessage(
    {
      conversationId: t.req.param("conversationId"),
      token: wo(t.req.raw),
      clientMessageId: e.clientMessageId,
      content: e.content,
      pageUrl: e.pageUrl,
      pageTitle: e.pageTitle
    },
    { createAiReply: !1, notifyRealtime: !1 }
  );
  if (!n.duplicate) {
    t.executionCtx.waitUntil(
      s.widget.completeVisitorMessage({
        conversationId: n.conversationId,
        inboundMessageId: n.inboundMessage.id
      })
    );
    const r = (n.inboundMessage.content ?? "").substring(0, 500);
    t.executionCtx.waitUntil(
      s.notification.notify(`💬 <b>Web Chat 新消息</b>

${r}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.conversationId}`)
    );
  }
  return q(n);
});
er.post("/conversations/:conversationId/messages/media", async (t) => {
  const e = await t.req.formData(), s = e.get("file");
  if (!hR(s))
    throw new v("VALIDATION_ERROR", "file is required", 400);
  const r = await (await N(t.env)).widget.sendVisitorMediaMessage({
    conversationId: t.req.param("conversationId"),
    token: wo(t.req.raw),
    clientMessageId: lr(e, "clientMessageId", 128),
    content: lr(e, "content", 2e3),
    file: s,
    fileName: lr(e, "fileName", 300),
    mimeType: lr(e, "mimeType", 100),
    pageUrl: lr(e, "pageUrl", 2048),
    pageTitle: lr(e, "pageTitle", 300)
  });
  return q(r);
});
er.get("/conversations/:conversationId/messages", async (t) => {
  const e = await N(t.env), s = t.req.param("conversationId");
  return q(!s || s === "_" ? { messages: [] } : {
    messages: await e.widget.listMessages({
      conversationId: s,
      token: wo(t.req.raw),
      afterMessageId: t.req.query("after") || void 0
    })
  });
});
er.get("/conversations/:conversationId/messages/:messageId/attachments/:index", async (t) => {
  const e = await N(t.env), s = t.req.param("conversationId");
  return await e.widget.requireConversationAccess(s, Mg(t.req.raw, t.req.query("token"))), e.media.getMessageAttachmentResponse({
    conversationId: s,
    messageId: t.req.param("messageId"),
    attachmentIndex: fR(t.req.param("index")),
    request: t.req.raw
  });
});
function wo(t) {
  const e = t.headers.get("authorization"), s = "Bearer ";
  if (!(e != null && e.startsWith(s)))
    throw new v("VISITOR_TOKEN_REQUIRED", "Visitor token is required", 401);
  return e.slice(s.length).trim();
}
function Mg(t, e) {
  return e != null && e.trim() ? e.trim() : wo(t);
}
function uR(t) {
  var e;
  if (((e = t.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new v("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function hR(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "stream" in t;
}
function lr(t, e, s) {
  const n = t.get(e);
  if (typeof n != "string") return;
  const r = n.trim();
  if (r) {
    if (r.length > s)
      throw new v("VALIDATION_ERROR", `${e} is too long`, 400);
    return r;
  }
}
function fR(t) {
  const e = Number(t);
  if (!Number.isInteger(e) || e < 0)
    throw new v("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function pR(t, e) {
  const s = new URL(t.url);
  s.searchParams.delete("token");
  const n = new Headers(t.headers);
  n.delete("authorization");
  for (const [r, a] of Object.entries(e))
    n.set(r, a);
  return new Request(s.toString(), {
    method: t.method,
    headers: n
  });
}
const mR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  widgetRoutes: er
}, Symbol.toStringTag, { value: "Module" })), gR = oe({
  channelAccountId: O().min(1),
  visitorId: O().min(1).max(128),
  title: O().trim().min(1).max(200),
  content: O().trim().min(1).max(5e4),
  category: O().max(30).optional(),
  tags: co(O().max(30)).max(5).optional(),
  pageUrl: O().max(2048).optional(),
  pageTitle: O().max(300).optional(),
  endUserToken: O().optional(),
  visibility: Ur(["public", "login_required"]).optional()
}), yR = oe({
  visitorId: O().min(1).max(128),
  content: O().trim().min(1).max(5e4),
  quotedMessageId: O().optional(),
  pageUrl: O().max(2048).optional(),
  pageTitle: O().max(300).optional(),
  endUserToken: O().optional()
}), wR = oe({
  visitorId: O().min(1).max(128)
}), _R = oe({
  pin: Ct()
}), vR = oe({
  feature: Ct()
}), ke = new Nt();
ke.get("/config", async (t) => {
  const e = t.env.FORUM_CHANNEL_ID;
  if (!e)
    throw new v("FORUM_NOT_FOUND", "FORUM_CHANNEL_ID not configured", 404);
  return q({
    channelId: e,
    title: t.env.FORUM_TITLE || "社区论坛",
    primaryColor: t.env.FORUM_PRIMARY_COLOR || "#2563eb",
    categories: (t.env.FORUM_CATEGORIES || "综合讨论,技术交流,问题反馈,资源分享,公告通知").split(",").map((s) => s.trim()),
    widgetChannelId: t.env.WIDGET_CHANNEL_ID,
    widgetTitle: t.env.WIDGET_TITLE,
    widgetMode: t.env.WIDGET_MODE || "chat"
  });
});
ke.get("/admin/check", Us(), async (t) => q({ isAdmin: !0 }));
const bR = oe({
  account: O().min(1),
  password: O().min(1)
});
ke.post("/login", async (t) => {
  const e = bR.parse(await t.req.json()), s = await N(t.env);
  try {
    const n = await s.auth.login(e.account, e.password);
    return q({ ...n, authType: "admin" });
  } catch {
    const n = await s.endUserAuth.login(e.account, e.password);
    return q({ ...n, authType: "end_user" });
  }
});
ke.get("/channels/:channelAccountId/topics", async (t) => {
  const e = await N(t.env), s = Bf(t.req.query("limit"), 50), n = Bf(t.req.query("offset"), 0);
  return q(
    await e.forum.listTopics({
      channelAccountId: t.req.param("channelAccountId"),
      limit: s,
      offset: n,
      search: t.req.query("search") || void 0,
      sortBy: t.req.query("sort") || void 0,
      tag: t.req.query("tag") || void 0,
      category: t.req.query("category") || void 0
    })
  );
});
ke.post("/channels/:channelAccountId/topics", async (t) => {
  const e = gR.parse(await t.req.json()), s = await N(t.env), n = await s.forum.createTopic(e), r = e.content.substring(0, 300);
  return t.executionCtx.waitUntil(
    s.notification.notify(
      `📝 <b>论坛新帖</b>
标题：${e.title}
作者：${n.message.contactName}

${r}${e.content.length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.message.conversationId}`
    )
  ), Gt(n);
});
ke.post("/topics/:conversationId/replies", async (t) => {
  const e = yR.parse(await t.req.json()), s = await N(t.env), n = await s.forum.sendReply({
    conversationId: t.req.param("conversationId"),
    ...e
  });
  if (!n.duplicate) {
    const r = (n.message.content ?? "").substring(0, 300);
    t.executionCtx.waitUntil(
      s.notification.notify(
        `💬 <b>论坛新回复</b>
作者：${n.message.contactName}

${r}${(n.message.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.message.conversationId}`
      )
    );
  }
  return Gt(n);
});
ke.get("/topics/:conversationId/messages", async (t) => {
  const e = await N(t.env), s = t.req.param("conversationId");
  return q(!s || s === "_" ? { messages: [] } : await e.forum.listMessages({
    conversationId: s,
    afterMessageId: t.req.query("after") || void 0
  }));
});
ke.post("/topics/:conversationId/like", async (t) => {
  const e = wR.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.forum.likeTopic({
      conversationId: t.req.param("conversationId"),
      visitorId: e.visitorId
    })
  );
});
ke.post("/topics/:conversationId/pin", Us(), async (t) => {
  const e = _R.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.forum.togglePin({
      conversationId: t.req.param("conversationId"),
      pin: e.pin
    })
  );
});
ke.post("/topics/:conversationId/feature", Us(), async (t) => {
  const e = vR.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.forum.toggleFeatured({
      conversationId: t.req.param("conversationId"),
      feature: e.feature
    })
  );
});
const SR = oe({
  userId: O().min(1),
  userRole: Ur(["admin", "mediator", "member"])
});
ke.delete("/topics/:conversationId", async (t) => {
  const e = SR.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.forum.deleteTopic({
      conversationId: t.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole
    })
  );
});
const ER = oe({
  userId: O().min(1),
  userRole: Ur(["admin", "mediator", "member"]),
  title: O().trim().min(1).max(200).optional(),
  content: O().trim().min(1).max(5e4).optional()
});
ke.patch("/topics/:conversationId", async (t) => {
  const e = ER.parse(await t.req.json()), s = await N(t.env);
  return q(
    await s.forum.updateTopic({
      conversationId: t.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole,
      title: e.title,
      content: e.content
    })
  );
});
ke.get("/users/:externalContactId/profile", async (t) => {
  const s = await (await N(t.env)).forum.getUserProfile(
    t.req.param("externalContactId")
  );
  return q(s);
});
ke.get("/users/:externalContactId/notifications", async (t) => {
  const e = await N(t.env);
  return q(
    await e.forum.getUserNotifications(
      t.req.param("externalContactId")
    )
  );
});
const AR = oe({
  channelAccountId: O().min(1),
  targetUserId: O().min(1)
}), xR = oe({
  content: O().trim().min(1).max(5e4)
});
ke.post("/pm/conversations", async (t) => {
  const e = AR.parse(await t.req.json()), s = await N(t.env), n = await s.endUserAuth.requireEndUser(t.req.header("authorization"));
  return q(
    await s.forum.createPMConversation({
      channelAccountId: e.channelAccountId,
      currentUserId: n.id,
      targetUserId: e.targetUserId
    })
  );
});
ke.get("/pm/conversations", async (t) => {
  const e = await N(t.env), s = t.req.query("channelAccountId");
  if (!s)
    throw new v("MISSING_PARAM", "channelAccountId is required", 400);
  const n = await e.endUserAuth.requireEndUser(t.req.header("authorization"));
  return q(
    await e.forum.listPMConversations({
      channelAccountId: s,
      currentUserId: n.id
    })
  );
});
ke.post("/pm/conversations/:conversationId/messages", async (t) => {
  const e = xR.parse(await t.req.json()), s = await N(t.env), n = await s.endUserAuth.requireEndUser(t.req.header("authorization")), r = await s.forum.sendPMMessage({
    conversationId: t.req.param("conversationId"),
    senderUserId: n.id,
    content: e.content
  }), a = getAvatarUrlFromRawPayload(n.rawPayloadJson);
  return q({ message: Os(r.message, a) });
});
ke.post("/pm/conversations/:conversationId/messages/media", async (t) => {
  const e = await t.req.formData(), s = e.get("file");
  if (!IR(s))
    throw new v("VALIDATION_ERROR", "file is required", 400);
  const n = await N(t.env), r = await n.endUserAuth.requireEndUser(t.req.header("authorization")), a = await n.forum.sendPMMediaMessage({
    conversationId: t.req.param("conversationId"),
    senderUserId: r.id,
    clientMessageId: wi(e, "clientMessageId", 128),
    content: wi(e, "content", 2e3),
    file: s,
    fileName: wi(e, "fileName", 300),
    mimeType: wi(e, "mimeType", 100)
  }), i = getAvatarUrlFromRawPayload(r.rawPayloadJson);
  return q({ message: Os(a.message, i) });
});
ke.get("/pm/conversations/:conversationId/messages", async (t) => {
  const e = await N(t.env);
  await e.endUserAuth.requireEndUser(t.req.header("authorization"));
  const s = await e.forum.listPMMessages({
    conversationId: t.req.param("conversationId"),
    afterMessageId: t.req.query("after") || void 0
  });
  return q({ messages: s.messages.map(Os) });
});
ke.get("/pm/conversations/:conversationId/messages/:messageId/attachments/:index", async (t) => (await N(t.env)).media.getMessageAttachmentResponse({
  conversationId: t.req.param("conversationId"),
  messageId: t.req.param("messageId"),
  attachmentIndex: CR(t.req.param("index")),
  request: t.req.raw
}));
ke.get("/ws", async (t) => {
  var d;
  const e = t.req.query("token");
  if (!e)
    throw new v("MISSING_TOKEN", "token is required", 400);
  const n = await (await N(t.env)).endUserAuth.tryGetEndUser(`Bearer ${e}`);
  if (!n)
    throw new v("UNAUTHORIZED", "Invalid or expired token", 401);
  if (((d = t.req.header("upgrade")) == null ? void 0 : d.toLowerCase()) !== "websocket")
    throw new v("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
  const a = t.env.END_USER_STREAM.idFromName("end_user"), i = t.env.END_USER_STREAM.get(a), o = new URL("https://end-user-stream.internal/"), c = new Request(o, {
    headers: {
      upgrade: "websocket",
      "x-supportly-end-user-id": n.id
    }
  });
  return i.fetch(c);
});
function Bf(t, e) {
  if (!t) return e;
  const s = parseInt(t, 10);
  return Number.isFinite(s) && s > 0 ? s : e;
}
function CR(t) {
  const e = Number(t);
  if (!Number.isInteger(e) || e < 0)
    throw new v("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function IR(t) {
  return typeof t == "object" && t !== null && "name" in t && "size" in t && "stream" in t;
}
function wi(t, e, s) {
  const n = t.get(e);
  if (typeof n != "string") return;
  const r = n.trim();
  if (r) {
    if (r.length > s)
      throw new v("VALIDATION_ERROR", `${e} is too long`, 400);
    return r;
  }
}
const TR = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  forumRoutes: ke
}, Symbol.toStringTag, { value: "Module" }));
export {
  UR as AdminStream,
  $R as EndUserStream,
  LR as HostDO,
  jR as QspiderCrawlerDO,
  HR as TraderDO,
  FR as VisitorStream,
  rt as default
};
