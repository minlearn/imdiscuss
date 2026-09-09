var ea = Object.defineProperty;
var $n = (n) => {
  throw TypeError(n);
};
var ta = (n, e, t) => e in n ? ea(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var A = (n, e, t) => ta(n, typeof e != "symbol" ? e + "" : e, t), hn = (n, e, t) => e.has(n) || $n("Cannot " + t);
var h = (n, e, t) => (hn(n, e, "read from private field"), t ? t.call(n) : e.get(n)), k = (n, e, t) => e.has(n) ? $n("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), E = (n, e, t, s) => (hn(n, e, "write to private field"), s ? s.call(n, t) : e.set(n, t), t), D = (n, e, t) => (hn(n, e, "access private method"), t);
var Bn = (n, e, t, s) => ({
  set _(a) {
    E(n, e, a, t);
  },
  get _() {
    return h(n, e, s);
  }
});
var jn = (n, e, t) => (s, a) => {
  let r = -1;
  return i(0);
  async function i(o) {
    if (o <= r)
      throw new Error("next() called multiple times");
    r = o;
    let c, d = !1, l;
    if (n[o] ? (l = n[o][0][0], s.req.routeIndex = o) : l = o === n.length && a || void 0, l)
      try {
        c = await l(s, () => i(o + 1));
      } catch (u) {
        if (u instanceof Error && e)
          s.error = u, c = await e(u, s), d = !0;
        else
          throw u;
      }
    else
      s.finalized === !1 && t && (c = await t(s));
    return c && (s.finalized === !1 || d) && (s.res = c), s;
  }
}, na = /* @__PURE__ */ Symbol(), sa = (n, e) => new Response(n, {
  headers: {
    // Normalize the media type (case-insensitive) while keeping parameters like the boundary
    "Content-Type": e.replace(/^[^;]+/, (s) => s.toLowerCase())
  }
}).formData(), Kt = (n) => "headers" in n, aa = async (n, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = !1, dot: s = !1 } = e, r = (Kt(n) ? n.headers : n.raw.headers).get("Content-Type"), i = r == null ? void 0 : r.split(";")[0].trim().toLowerCase();
  return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? ra(n, { all: t, dot: s }) : {};
};
async function ra(n, e) {
  if (!Kt(n) && n.bodyCache.formData)
    return Fn(
      await n.bodyCache.formData,
      e
    );
  const t = Kt(n) ? n.headers : n.raw.headers, s = await n.arrayBuffer(), a = sa(s, t.get("Content-Type") || "");
  Kt(n) || (n.bodyCache.formData = a);
  const r = await a;
  return r ? Fn(r, e) : {};
}
function Fn(n, e) {
  const t = /* @__PURE__ */ Object.create(null);
  return n.forEach((s, a) => {
    e.all || a.endsWith("[]") ? ia(t, a, s) : t[a] = s;
  }), e.dot && Object.entries(t).forEach(([s, a]) => {
    s.includes(".") && (oa(t, s, a), delete t[s]);
  }), t;
}
var ia = (n, e, t) => {
  n[e] !== void 0 ? Array.isArray(n[e]) ? n[e].push(t) : n[e] = [n[e], t] : e.endsWith("[]") ? n[e] = [t] : n[e] = t;
}, oa = (n, e, t) => {
  if (/(?:^|\.)__proto__\./.test(e))
    return;
  let s = n;
  const a = e.split(".");
  a.forEach((r, i) => {
    i === a.length - 1 ? s[r] = t : ((!s[r] || typeof s[r] != "object" || Array.isArray(s[r]) || s[r] instanceof File) && (s[r] = /* @__PURE__ */ Object.create(null)), s = s[r]);
  });
}, Is = (n) => {
  const e = n.split("/");
  return e[0] === "" && e.shift(), e;
}, ca = (n) => {
  const { groups: e, path: t } = da(n), s = Is(t);
  return la(s, e);
}, da = (n) => {
  const e = [];
  return n = n.replace(/\{[^}]+\}/g, (t, s) => {
    const a = `@${s}`;
    return e.push([a, t]), a;
  }), { groups: e, path: n };
}, la = (n, e) => {
  for (let t = e.length - 1; t >= 0; t--) {
    const [s] = e[t];
    for (let a = n.length - 1; a >= 0; a--)
      if (n[a].includes(s)) {
        n[a] = n[a].replace(s, e[t][1]);
        break;
      }
  }
  return n;
}, Wt = {}, ua = (n, e) => {
  if (n === "*")
    return "*";
  const t = n.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const s = `${n}#${e}`;
    return Wt[s] || (t[2] ? Wt[s] = e && e[0] !== ":" && e[0] !== "*" ? [s, t[1], new RegExp(`^${t[2]}(?=/${e})`)] : [n, t[1], new RegExp(`^${t[2]}$`)] : Wt[s] = [n, t[1], !0]), Wt[s];
  }
  return null;
}, Cn = (n, e) => {
  try {
    return e(n);
  } catch {
    return n.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return e(t);
      } catch {
        return t;
      }
    });
  }
}, ha = (n) => Cn(n, decodeURI), As = (n) => {
  const e = n.url, t = e.indexOf("/", e.indexOf(":") + 4);
  let s = t;
  for (; s < e.length; s++) {
    const a = e.charCodeAt(s);
    if (a === 37) {
      const r = e.indexOf("?", s), i = e.indexOf("#", s), o = r === -1 ? i === -1 ? void 0 : i : i === -1 ? r : Math.min(r, i), c = e.slice(t, o);
      return ha(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (a === 63 || a === 35)
      break;
  }
  return e.slice(t, s);
}, fa = (n) => {
  const e = As(n);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, Le = (n, e, ...t) => (t.length && (e = Le(e, ...t)), `${(n == null ? void 0 : n[0]) === "/" ? "" : "/"}${n}${e === "/" ? "" : `${(n == null ? void 0 : n.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), bs = (n) => {
  if (n.charCodeAt(n.length - 1) !== 63 || !n.includes(":"))
    return null;
  const e = n.split("/"), t = [];
  let s = "";
  return e.forEach((a) => {
    if (a !== "" && !/\:/.test(a))
      s += "/" + a;
    else if (/\:/.test(a))
      if (/\?/.test(a)) {
        t.length === 0 && s === "" ? t.push("/") : t.push(s);
        const r = a.replace("?", "");
        s += "/" + r, t.push(s);
      } else
        s += "/" + a;
  }), t.filter((a, r, i) => i.indexOf(a) === r);
}, fn = (n) => /[%+]/.test(n) ? (n.indexOf("+") !== -1 && (n = n.replace(/\+/g, " ")), n.indexOf("%") !== -1 ? Cn(n, Ts) : n) : n, Es = (n, e, t) => {
  let s;
  if (!t && e && !/[%+]/.test(e)) {
    let i = n.indexOf("?", 8);
    if (i === -1)
      return;
    for (n.startsWith(e, i + 1) || (i = n.indexOf(`&${e}`, i + 1)); i !== -1; ) {
      const o = n.charCodeAt(i + e.length + 1);
      if (o === 61) {
        const c = i + e.length + 2, d = n.indexOf("&", c);
        return fn(n.slice(c, d === -1 ? void 0 : d));
      } else if (o == 38 || isNaN(o))
        return "";
      i = n.indexOf(`&${e}`, i + 1);
    }
    if (s = /[%+]/.test(n), !s)
      return;
  }
  const a = {};
  s ?? (s = /[%+]/.test(n));
  let r = n.indexOf("?", 8);
  for (; r !== -1; ) {
    const i = n.indexOf("&", r + 1);
    let o = n.indexOf("=", r);
    o > i && i !== -1 && (o = -1);
    let c = n.slice(
      r + 1,
      o === -1 ? i === -1 ? void 0 : i : o
    );
    if (s && (c = fn(c)), r = i, c === "")
      continue;
    let d;
    o === -1 ? d = "" : (d = n.slice(o + 1, i === -1 ? void 0 : i), s && (d = fn(d))), t ? (a[c] && Array.isArray(a[c]) || (a[c] = []), a[c].push(d)) : a[c] ?? (a[c] = d);
  }
  return e ? a[e] : a;
}, ma = Es, pa = (n, e) => Es(n, e, !0), Ts = decodeURIComponent, qn = (n) => Cn(n, Ts), it, ee, Ie, xs, Ss, bn, pe, ps, ga = (ps = class {
  constructor(n, e = "/", t = [[]]) {
    k(this, Ie);
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
    A(this, "raw");
    k(this, it);
    // Short name of validatedData
    k(this, ee);
    A(this, "routeIndex", 0);
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
    A(this, "path");
    A(this, "bodyCache", {});
    k(this, pe, (n) => {
      const { bodyCache: e, raw: t } = this, s = e[n];
      if (s)
        return s;
      const a = Object.keys(e)[0];
      return a ? e[a].then((r) => (a === "json" && (r = JSON.stringify(r)), new Response(r)[n]())) : e[n] = t[n]();
    });
    this.raw = n, this.path = e, E(this, ee, t), E(this, it, {});
  }
  param(n) {
    return n ? D(this, Ie, xs).call(this, n) : D(this, Ie, Ss).call(this);
  }
  query(n) {
    return ma(this.url, n);
  }
  queries(n) {
    return pa(this.url, n);
  }
  header(n) {
    if (n)
      return this.raw.headers.get(n) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((t, s) => {
      e[s] = t;
    }), e;
  }
  async parseBody(n) {
    return aa(this, n);
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
    return h(this, pe).call(this, "text").then((n) => JSON.parse(n));
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
    return h(this, pe).call(this, "text");
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
    return h(this, pe).call(this, "arrayBuffer");
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
    return h(this, pe).call(this, "arrayBuffer").then((n) => new Uint8Array(n));
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
    return h(this, pe).call(this, "blob");
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
    return h(this, pe).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(n, e) {
    h(this, it)[n] = e;
  }
  valid(n) {
    return h(this, it)[n];
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
  get [na]() {
    return h(this, ee);
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
    return h(this, ee)[0].map(([[, n]]) => n);
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
    return h(this, ee)[0].map(([[, n]]) => n)[this.routeIndex].path;
  }
}, it = new WeakMap(), ee = new WeakMap(), Ie = new WeakSet(), xs = function(n) {
  const e = h(this, ee)[0][this.routeIndex][1][n], t = D(this, Ie, bn).call(this, e);
  return t && /\%/.test(t) ? qn(t) : t;
}, Ss = function() {
  const n = {}, e = Object.keys(h(this, ee)[0][this.routeIndex][1]);
  for (const t of e) {
    const s = D(this, Ie, bn).call(this, h(this, ee)[0][this.routeIndex][1][t]);
    s !== void 0 && (n[t] = /\%/.test(s) ? qn(s) : s);
  }
  return n;
}, bn = function(n) {
  return h(this, ee)[1] ? h(this, ee)[1][n] : n;
}, pe = new WeakMap(), ps), ya = {
  Stringify: 1
}, Ns = async (n, e, t, s, a) => {
  typeof n == "object" && !(n instanceof String) && (n instanceof Promise || (n = n.toString()), n instanceof Promise && (n = await n));
  const r = n.callbacks;
  return r != null && r.length ? (a ? a[0] += n : a = [n], Promise.all(r.map((o) => o({ phase: e, buffer: a, context: s }))).then(
    (o) => Promise.all(
      o.filter(Boolean).map((c) => Ns(c, e, !1, s, a))
    ).then(() => a[0])
  )) : Promise.resolve(n);
}, _a = "text/plain; charset=UTF-8", mn = (n, e) => ({
  "Content-Type": n,
  ...e
}), bt = (n, e) => new Response(n, e), Ut, Dt, ge, ot, ye, J, Pt, ct, dt, je, Lt, $t, Se, st, gs, wa = (gs = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(n, e) {
    k(this, Se);
    k(this, Ut);
    k(this, Dt);
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
    A(this, "env", {});
    k(this, ge);
    A(this, "finalized", !1);
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
    A(this, "error");
    k(this, ot);
    k(this, ye);
    k(this, J);
    k(this, Pt);
    k(this, ct);
    k(this, dt);
    k(this, je);
    k(this, Lt);
    k(this, $t);
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
    A(this, "render", (...n) => (h(this, ct) ?? E(this, ct, (e) => this.html(e)), h(this, ct).call(this, ...n)));
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    A(this, "setLayout", (n) => E(this, Pt, n));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    A(this, "getLayout", () => h(this, Pt));
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
    A(this, "setRenderer", (n) => {
      E(this, ct, n);
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
    A(this, "header", (n, e, t) => {
      this.finalized && E(this, J, bt(h(this, J).body, h(this, J)));
      const s = h(this, J) ? h(this, J).headers : h(this, je) ?? E(this, je, new Headers());
      e === void 0 ? s.delete(n) : t != null && t.append ? s.append(n, e) : s.set(n, e);
    });
    A(this, "status", (n) => {
      E(this, ot, n);
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
    A(this, "set", (n, e) => {
      h(this, ge) ?? E(this, ge, /* @__PURE__ */ new Map()), h(this, ge).set(n, e);
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
    A(this, "get", (n) => h(this, ge) ? h(this, ge).get(n) : void 0);
    A(this, "newResponse", (...n) => D(this, Se, st).call(this, ...n));
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
    A(this, "body", (n, e, t) => D(this, Se, st).call(this, n, e, t));
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
    A(this, "text", (n, e, t) => !h(this, je) && !h(this, ot) && !e && !t && !this.finalized ? new Response(n) : D(this, Se, st).call(this, n, e, mn(_a, t)));
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
    A(this, "json", (n, e, t) => D(this, Se, st).call(this, JSON.stringify(n), e, mn("application/json", t)));
    A(this, "html", (n, e, t) => {
      const s = (a) => D(this, Se, st).call(this, a, e, mn("text/html; charset=UTF-8", t));
      return typeof n == "object" ? Ns(n, ya.Stringify, !1, {}).then(s) : s(n);
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
    A(this, "redirect", (n, e) => {
      const t = String(n);
      return this.header(
        "Location",
        // Multibyes should be encoded
        // eslint-disable-next-line no-control-regex
        /[^\x00-\xFF]/.test(t) ? encodeURI(t) : t
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
    A(this, "notFound", () => (h(this, dt) ?? E(this, dt, () => bt()), h(this, dt).call(this, this)));
    E(this, Ut, n), e && (E(this, ye, e.executionCtx), this.env = e.env, E(this, dt, e.notFoundHandler), E(this, $t, e.path), E(this, Lt, e.matchResult));
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return h(this, Dt) ?? E(this, Dt, new ga(h(this, Ut), h(this, $t), h(this, Lt))), h(this, Dt);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (h(this, ye) && "respondWith" in h(this, ye))
      return h(this, ye);
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (h(this, ye))
      return h(this, ye);
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return h(this, J) || E(this, J, bt(null, {
      headers: h(this, je) ?? E(this, je, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(n) {
    if (h(this, J) && n) {
      n = bt(n.body, n);
      for (const [e, t] of h(this, J).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const s = h(this, J).headers.getSetCookie();
            n.headers.delete("set-cookie");
            for (const a of s)
              n.headers.append("set-cookie", a);
          } else
            n.headers.set(e, t);
    }
    E(this, J, n), this.finalized = !0;
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
    return h(this, ge) ? Object.fromEntries(h(this, ge)) : {};
  }
}, Ut = new WeakMap(), Dt = new WeakMap(), ge = new WeakMap(), ot = new WeakMap(), ye = new WeakMap(), J = new WeakMap(), Pt = new WeakMap(), ct = new WeakMap(), dt = new WeakMap(), je = new WeakMap(), Lt = new WeakMap(), $t = new WeakMap(), Se = new WeakSet(), st = function(n, e, t) {
  const s = h(this, J) ? new Headers(h(this, J).headers) : h(this, je) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const r = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [i, o] of r)
      i.toLowerCase() === "set-cookie" ? s.append(i, o) : s.set(i, o);
  }
  if (t)
    for (const [r, i] of Object.entries(t))
      if (typeof i == "string")
        s.set(r, i);
      else {
        s.delete(r);
        for (const o of i)
          s.append(r, o);
      }
  const a = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? h(this, ot);
  return bt(n, { status: a, headers: s });
}, gs), q = "ALL", va = "all", Ia = ["get", "post", "put", "delete", "options", "patch"], Rs = "Can not add a route since the matcher is already built.", ks = class extends Error {
}, Aa = "__COMPOSED_HANDLER", ba = (n) => n.text("404 Not Found", 404), Wn = (n, e) => {
  if ("getResponse" in n) {
    const t = n.getResponse();
    return e.newResponse(t.body, t);
  }
  return console.error(n), e.text("Internal Server Error", 500);
}, se, W, Os, ae, $e, Yt, Xt, lt, Ea = (lt = class {
  constructor(e = {}) {
    k(this, W);
    A(this, "get");
    A(this, "post");
    A(this, "put");
    A(this, "delete");
    A(this, "options");
    A(this, "patch");
    A(this, "all");
    A(this, "on");
    A(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    A(this, "router");
    A(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    A(this, "_basePath", "/");
    k(this, se, "/");
    A(this, "routes", []);
    k(this, ae, ba);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    A(this, "errorHandler", Wn);
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
    A(this, "onError", (e) => (this.errorHandler = e, this));
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
    A(this, "notFound", (e) => (E(this, ae, e), this));
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
    A(this, "fetch", (e, ...t) => D(this, W, Xt).call(this, e, t[1], t[0], e.method));
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
    A(this, "request", (e, t, s, a) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, s, a) : (e = e.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(e) ? e : `http://localhost${Le("/", e)}`,
        t
      ),
      s,
      a
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
    A(this, "fire", () => {
      addEventListener("fetch", (e) => {
        e.respondWith(D(this, W, Xt).call(this, e.request, e, void 0, e.request.method));
      });
    });
    [...Ia, va].forEach((r) => {
      this[r] = (i, ...o) => (typeof i == "string" ? E(this, se, i) : D(this, W, $e).call(this, r, h(this, se), i), o.forEach((c) => {
        D(this, W, $e).call(this, r, h(this, se), c);
      }), this);
    }), this.on = (r, i, ...o) => {
      for (const c of [i].flat()) {
        E(this, se, c);
        for (const d of [r].flat())
          o.map((l) => {
            D(this, W, $e).call(this, d.toUpperCase(), h(this, se), l);
          });
      }
      return this;
    }, this.use = (r, ...i) => (typeof r == "string" ? E(this, se, r) : (E(this, se, "*"), i.unshift(r)), i.forEach((o) => {
      D(this, W, $e).call(this, q, h(this, se), o);
    }), this);
    const { strict: s, ...a } = e;
    Object.assign(this, a), this.getPath = s ?? !0 ? e.getPath ?? As : fa;
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
  route(e, t) {
    const s = this.basePath(e);
    return t.routes.map((a) => {
      var i;
      let r;
      t.errorHandler === Wn ? r = a.handler : (r = async (o, c) => (await jn([], t.errorHandler)(o, () => a.handler(o, c))).res, r[Aa] = a.handler), D(i = s, W, $e).call(i, a.method, a.path, r, a.basePath);
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
    const t = D(this, W, Os).call(this);
    return t._basePath = Le(this._basePath, e), t;
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
  mount(e, t, s) {
    let a, r;
    s && (typeof s == "function" ? r = s : (r = s.optionHandler, s.replaceRequest === !1 ? a = (c) => c : a = s.replaceRequest));
    const i = r ? (c) => {
      const d = r(c);
      return Array.isArray(d) ? d : [d];
    } : (c) => {
      let d;
      try {
        d = c.executionCtx;
      } catch {
      }
      return [c.env, d];
    };
    a || (a = (() => {
      const c = Le(this._basePath, e), d = c === "/" ? 0 : c.length;
      return (l) => {
        const u = new URL(l.url);
        return u.pathname = this.getPath(l).slice(d) || "/", new Request(u, l);
      };
    })());
    const o = async (c, d) => {
      const l = await t(a(c.req.raw), ...i(c));
      if (l)
        return l;
      await d();
    };
    return D(this, W, $e).call(this, q, Le(e, "*"), o), this;
  }
}, se = new WeakMap(), W = new WeakSet(), Os = function() {
  const e = new lt({
    router: this.router,
    getPath: this.getPath
  });
  return e.errorHandler = this.errorHandler, E(e, ae, h(this, ae)), e.routes = this.routes, e;
}, ae = new WeakMap(), $e = function(e, t, s, a) {
  e = e.toUpperCase(), t = Le(this._basePath, t);
  const r = {
    basePath: a !== void 0 ? Le(this._basePath, a) : this._basePath,
    path: t,
    method: e,
    handler: s
  };
  this.router.add(e, t, [s, r]), this.routes.push(r);
}, Yt = function(e, t) {
  if (e instanceof Error)
    return this.errorHandler(e, t);
  throw e;
}, Xt = function(e, t, s, a) {
  if (a === "HEAD")
    return (async () => new Response(null, await D(this, W, Xt).call(this, e, t, s, "GET")))();
  const r = this.getPath(e, { env: s }), i = this.router.match(a, r), o = new wa(e, {
    path: r,
    matchResult: i,
    env: s,
    executionCtx: t,
    notFoundHandler: h(this, ae)
  });
  if (i[0].length === 1) {
    let d;
    try {
      d = i[0][0][0][0](o, async () => {
        o.res = await h(this, ae).call(this, o);
      });
    } catch (l) {
      return D(this, W, Yt).call(this, l, o);
    }
    return d instanceof Promise ? d.then(
      (l) => l || (o.finalized ? o.res : h(this, ae).call(this, o))
    ).catch((l) => D(this, W, Yt).call(this, l, o)) : d ?? h(this, ae).call(this, o);
  }
  const c = jn(i[0], this.errorHandler, h(this, ae));
  return (async () => {
    try {
      const d = await c(o);
      if (!d.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return d.res;
    } catch (d) {
      return D(this, W, Yt).call(this, d, o);
    }
  })();
}, lt), Cs = [];
function Ta(n, e) {
  const t = this.buildAllMatchers(), s = (a, r) => {
    const i = t[a] || t[q], o = i[2][r];
    if (o)
      return o;
    const c = r.match(i[0]);
    if (!c)
      return [[], Cs];
    const d = c.indexOf("", 1);
    return [i[1][d], c];
  };
  return this.match = s, s(n, e);
}
var en = "[^/]+", kt = ".*", Ot = "(?:|/.*)", at = /* @__PURE__ */ Symbol(), xa = new Set(".\\+*[^]$()");
function Sa(n, e) {
  return n.length === 1 ? e.length === 1 ? n < e ? -1 : 1 : -1 : e.length === 1 || n === kt || n === Ot ? 1 : e === kt || e === Ot ? -1 : n === en ? 1 : e === en ? -1 : n.length === e.length ? n < e ? -1 : 1 : e.length - n.length;
}
var Fe, qe, re, Ve, Na = (Ve = class {
  constructor() {
    k(this, Fe);
    k(this, qe);
    k(this, re, /* @__PURE__ */ Object.create(null));
  }
  insert(e, t, s, a, r) {
    if (e.length === 0) {
      if (h(this, Fe) !== void 0)
        throw at;
      if (r)
        return;
      E(this, Fe, t);
      return;
    }
    const [i, ...o] = e, c = i === "*" ? o.length === 0 ? ["", "", kt] : ["", "", en] : i === "/*" ? ["", "", Ot] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let d;
    if (c) {
      const l = c[1];
      let u = c[2] || en;
      if (l && c[2] && (u === ".*" || (u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(u))))
        throw at;
      if (d = h(this, re)[u], !d) {
        if (Object.keys(h(this, re)).some(
          (m) => m !== kt && m !== Ot
        ))
          throw at;
        if (r)
          return;
        d = h(this, re)[u] = new Ve(), l !== "" && E(d, qe, a.varIndex++);
      }
      !r && l !== "" && s.push([l, h(d, qe)]);
    } else if (d = h(this, re)[i], !d) {
      if (Object.keys(h(this, re)).some(
        (l) => l.length > 1 && l !== kt && l !== Ot
      ))
        throw at;
      if (r)
        return;
      d = h(this, re)[i] = new Ve();
    }
    d.insert(o, t, s, a, r);
  }
  buildRegExpStr() {
    const t = Object.keys(h(this, re)).sort(Sa).map((s) => {
      const a = h(this, re)[s];
      return (typeof h(a, qe) == "number" ? `(${s})@${h(a, qe)}` : xa.has(s) ? `\\${s}` : s) + a.buildRegExpStr();
    });
    return typeof h(this, Fe) == "number" && t.unshift(`#${h(this, Fe)}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, Fe = new WeakMap(), qe = new WeakMap(), re = new WeakMap(), Ve), cn, Bt, ys, Ra = (ys = class {
  constructor() {
    k(this, cn, { varIndex: 0 });
    k(this, Bt, new Na());
  }
  insert(n, e, t) {
    const s = [], a = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (n = n.replace(/\{[^}]+\}/g, (c) => {
        const d = `@\\${i}`;
        return a[i] = [d, c], i++, o = !0, d;
      }), !o)
        break;
    }
    const r = n.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = a.length - 1; i >= 0; i--) {
      const [o] = a[i];
      for (let c = r.length - 1; c >= 0; c--)
        if (r[c].indexOf(o) !== -1) {
          r[c] = r[c].replace(o, a[i][1]);
          break;
        }
    }
    return h(this, Bt).insert(r, e, s, h(this, cn), t), s;
  }
  buildRegExp() {
    let n = h(this, Bt).buildRegExpStr();
    if (n === "")
      return [/^$/, [], []];
    let e = 0;
    const t = [], s = [];
    return n = n.replace(/#(\d+)|@(\d+)|\.\*\$/g, (a, r, i) => r !== void 0 ? (t[++e] = Number(r), "$()") : (i !== void 0 && (s[Number(i)] = ++e), "")), [new RegExp(`^${n}`), t, s];
  }
}, cn = new WeakMap(), Bt = new WeakMap(), ys), ka = [/^$/, [], /* @__PURE__ */ Object.create(null)], Qt = /* @__PURE__ */ Object.create(null);
function Ms(n) {
  return Qt[n] ?? (Qt[n] = new RegExp(
    n === "*" ? "" : `^${n.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (e, t) => t ? `\\${t}` : "(?:|/.*)"
    )}$`
  ));
}
function Oa() {
  Qt = /* @__PURE__ */ Object.create(null);
}
function Ca(n) {
  var d;
  const e = new Ra(), t = [];
  if (n.length === 0)
    return ka;
  const s = n.map(
    (l) => [!/\*|\/:/.test(l[0]), ...l]
  ).sort(
    ([l, u], [m, w]) => l ? 1 : m ? -1 : u.length - w.length
  ), a = /* @__PURE__ */ Object.create(null);
  for (let l = 0, u = -1, m = s.length; l < m; l++) {
    const [w, S, P] = s[l];
    w ? a[S] = [P.map(([$]) => [$, /* @__PURE__ */ Object.create(null)]), Cs] : u++;
    let U;
    try {
      U = e.insert(S, u, w);
    } catch ($) {
      throw $ === at ? new ks(S) : $;
    }
    w || (t[u] = P.map(([$, L]) => {
      const F = /* @__PURE__ */ Object.create(null);
      for (L -= 1; L >= 0; L--) {
        const [be, V] = U[L];
        F[be] = V;
      }
      return [$, F];
    }));
  }
  const [r, i, o] = e.buildRegExp();
  for (let l = 0, u = t.length; l < u; l++)
    for (let m = 0, w = t[l].length; m < w; m++) {
      const S = (d = t[l][m]) == null ? void 0 : d[1];
      if (!S)
        continue;
      const P = Object.keys(S);
      for (let U = 0, $ = P.length; U < $; U++)
        S[P[U]] = o[S[P[U]]];
    }
  const c = [];
  for (const l in i)
    c[l] = t[i[l]];
  return [r, c, a];
}
function Xe(n, e) {
  if (n) {
    for (const t of Object.keys(n).sort((s, a) => a.length - s.length))
      if (Ms(t).test(e))
        return [...n[t]];
  }
}
var Ne, Re, dn, Us, _s, Ma = (_s = class {
  constructor() {
    k(this, dn);
    A(this, "name", "RegExpRouter");
    k(this, Ne);
    k(this, Re);
    A(this, "match", Ta);
    E(this, Ne, { [q]: /* @__PURE__ */ Object.create(null) }), E(this, Re, { [q]: /* @__PURE__ */ Object.create(null) });
  }
  add(n, e, t) {
    var o;
    const s = h(this, Ne), a = h(this, Re);
    if (!s || !a)
      throw new Error(Rs);
    s[n] || [s, a].forEach((c) => {
      c[n] = /* @__PURE__ */ Object.create(null), Object.keys(c[q]).forEach((d) => {
        c[n][d] = [...c[q][d]];
      });
    }), e === "/*" && (e = "*");
    const r = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const c = Ms(e);
      n === q ? Object.keys(s).forEach((d) => {
        var l;
        (l = s[d])[e] || (l[e] = Xe(s[d], e) || Xe(s[q], e) || []);
      }) : (o = s[n])[e] || (o[e] = Xe(s[n], e) || Xe(s[q], e) || []), Object.keys(s).forEach((d) => {
        (n === q || n === d) && Object.keys(s[d]).forEach((l) => {
          c.test(l) && s[d][l].push([t, r]);
        });
      }), Object.keys(a).forEach((d) => {
        (n === q || n === d) && Object.keys(a[d]).forEach(
          (l) => c.test(l) && a[d][l].push([t, r])
        );
      });
      return;
    }
    const i = bs(e) || [e];
    for (let c = 0, d = i.length; c < d; c++) {
      const l = i[c];
      Object.keys(a).forEach((u) => {
        var m;
        (n === q || n === u) && ((m = a[u])[l] || (m[l] = [
          ...Xe(s[u], l) || Xe(s[q], l) || []
        ]), a[u][l].push([t, r - d + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const n = /* @__PURE__ */ Object.create(null);
    return Object.keys(h(this, Re)).concat(Object.keys(h(this, Ne))).forEach((e) => {
      n[e] || (n[e] = D(this, dn, Us).call(this, e));
    }), E(this, Ne, E(this, Re, void 0)), Oa(), n;
  }
}, Ne = new WeakMap(), Re = new WeakMap(), dn = new WeakSet(), Us = function(n) {
  const e = [];
  let t = n === q;
  return [h(this, Ne), h(this, Re)].forEach((s) => {
    const a = s[n] ? Object.keys(s[n]).map((r) => [r, s[n][r]]) : [];
    a.length !== 0 ? (t || (t = !0), e.push(...a)) : n !== q && e.push(
      ...Object.keys(s[q]).map((r) => [r, s[q][r]])
    );
  }), t ? Ca(e) : null;
}, _s), ke, _e, ws, Ua = (ws = class {
  constructor(n) {
    A(this, "name", "SmartRouter");
    k(this, ke, []);
    k(this, _e, []);
    E(this, ke, n.routers);
  }
  add(n, e, t) {
    if (!h(this, _e))
      throw new Error(Rs);
    h(this, _e).push([n, e, t]);
  }
  match(n, e) {
    if (!h(this, _e))
      throw new Error("Fatal error");
    const t = h(this, ke), s = h(this, _e), a = t.length;
    let r = 0, i;
    for (; r < a; r++) {
      const o = t[r];
      try {
        for (let c = 0, d = s.length; c < d; c++)
          o.add(...s[c]);
        i = o.match(n, e);
      } catch (c) {
        if (c instanceof ks)
          continue;
        throw c;
      }
      this.match = o.match.bind(o), E(this, ke, [o]), E(this, _e, void 0);
      break;
    }
    if (r === a)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (h(this, _e) || h(this, ke).length !== 1)
      throw new Error("No active router has been determined yet.");
    return h(this, ke)[0];
  }
}, ke = new WeakMap(), _e = new WeakMap(), ws), Et = /* @__PURE__ */ Object.create(null), Da = (n) => {
  for (const e in n)
    return !0;
  return !1;
}, Oe, Z, We, ut, z, ce, Te, ht, Pa = (ht = class {
  constructor(e, t, s) {
    k(this, ce);
    k(this, Oe);
    k(this, Z);
    k(this, We);
    k(this, ut, 0);
    k(this, z, Et);
    if (E(this, Z, s || /* @__PURE__ */ Object.create(null)), E(this, Oe, []), e && t) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: t, possibleKeys: [], score: 0 }, E(this, Oe, [a]);
    }
    E(this, We, []);
  }
  insert(e, t, s) {
    E(this, ut, ++Bn(this, ut)._);
    let a = this;
    const r = ca(t), i = [];
    for (let o = 0, c = r.length; o < c; o++) {
      const d = r[o], l = r[o + 1], u = ua(d, l), m = Array.isArray(u) ? u[0] : d;
      if (m in h(a, Z)) {
        a = h(a, Z)[m], u && i.push(u[1]);
        continue;
      }
      h(a, Z)[m] = new ht(), u && (h(a, We).push(u), i.push(u[1])), a = h(a, Z)[m];
    }
    return h(a, Oe).push({
      [e]: {
        handler: s,
        possibleKeys: i.filter((o, c, d) => d.indexOf(o) === c),
        score: h(this, ut)
      }
    }), a;
  }
  search(e, t) {
    var l;
    const s = [];
    E(this, z, Et);
    let r = [this];
    const i = Is(t), o = [], c = i.length;
    let d = null;
    for (let u = 0; u < c; u++) {
      const m = i[u], w = u === c - 1, S = [];
      for (let U = 0, $ = r.length; U < $; U++) {
        const L = r[U], F = h(L, Z)[m];
        F && (E(F, z, h(L, z)), w ? (h(F, Z)["*"] && D(this, ce, Te).call(this, s, h(F, Z)["*"], e, h(L, z)), D(this, ce, Te).call(this, s, F, e, h(L, z))) : S.push(F));
        for (let be = 0, V = h(L, We).length; be < V; be++) {
          const Ft = h(L, We)[be], X = h(L, z) === Et ? {} : { ...h(L, z) };
          if (Ft === "*") {
            const De = h(L, Z)["*"];
            De && (D(this, ce, Te).call(this, s, De, e, h(L, z)), E(De, z, X), S.push(De));
            continue;
          }
          const [Qs, Ln, It] = Ft;
          if (!m && !(It instanceof RegExp))
            continue;
          const ne = h(L, Z)[Qs];
          if (It instanceof RegExp) {
            if (d === null) {
              d = new Array(c);
              let Ye = t[0] === "/" ? 1 : 0;
              for (let At = 0; At < c; At++)
                d[At] = Ye, Ye += i[At].length + 1;
            }
            const De = t.substring(d[u]), qt = It.exec(De);
            if (qt) {
              if (X[Ln] = qt[0], D(this, ce, Te).call(this, s, ne, e, h(L, z), X), qt[0].length === De.length && h(ne, Z)["*"] && D(this, ce, Te).call(this, s, h(ne, Z)["*"], e, h(L, z), X), Da(h(ne, Z))) {
                E(ne, z, X);
                const Ye = ((l = qt[0].match(/\//)) == null ? void 0 : l.length) ?? 0;
                (o[Ye] || (o[Ye] = [])).push(ne);
              }
              continue;
            }
          }
          (It === !0 || It.test(m)) && (X[Ln] = m, w ? (D(this, ce, Te).call(this, s, ne, e, X, h(L, z)), h(ne, Z)["*"] && D(this, ce, Te).call(this, s, h(ne, Z)["*"], e, X, h(L, z))) : (E(ne, z, X), S.push(ne)));
        }
      }
      const P = o.shift();
      r = P ? S.concat(P) : S;
    }
    return s.length > 1 && s.sort((u, m) => u.score - m.score), [s.map(({ handler: u, params: m }) => [u, m])];
  }
}, Oe = new WeakMap(), Z = new WeakMap(), We = new WeakMap(), ut = new WeakMap(), z = new WeakMap(), ce = new WeakSet(), Te = function(e, t, s, a, r) {
  for (let i = 0, o = h(t, Oe).length; i < o; i++) {
    const c = h(t, Oe)[i], d = c[s] || c[q], l = {};
    if (d !== void 0 && (d.params = /* @__PURE__ */ Object.create(null), e.push(d), a !== Et || r && r !== Et))
      for (let u = 0, m = d.possibleKeys.length; u < m; u++) {
        const w = d.possibleKeys[u], S = l[d.score];
        d.params[w] = r != null && r[w] && !S ? r[w] : a[w] ?? (r == null ? void 0 : r[w]), l[d.score] = !0;
      }
  }
}, ht), He, vs, La = (vs = class {
  constructor() {
    A(this, "name", "TrieRouter");
    k(this, He);
    E(this, He, new Pa());
  }
  add(n, e, t) {
    const s = bs(e);
    if (s) {
      for (let a = 0, r = s.length; a < r; a++)
        h(this, He).insert(n, s[a], t);
      return;
    }
    h(this, He).insert(n, e, t);
  }
  match(n, e) {
    return h(this, He).search(n, e);
  }
}, He = new WeakMap(), vs), he = class extends Ea {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(n = {}) {
    super(n), this.router = n.router ?? new Ua({
      routers: [new Ma(), new La()]
    });
  }
}, $a = (n) => {
  const e = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...n
  }, t = /* @__PURE__ */ ((a) => typeof a == "string" ? a === "*" ? () => a : (r) => a === r ? r : null : typeof a == "function" ? a : (r) => a.includes(r) ? r : null)(e.origin), s = ((a) => typeof a == "function" ? a : Array.isArray(a) ? () => a : () => [])(e.allowMethods);
  return async function(r, i) {
    var d;
    function o(l, u) {
      r.res.headers.set(l, u);
    }
    const c = await t(r.req.header("origin") || "", r);
    if (c && o("Access-Control-Allow-Origin", c), e.credentials && o("Access-Control-Allow-Credentials", "true"), (d = e.exposeHeaders) != null && d.length && o("Access-Control-Expose-Headers", e.exposeHeaders.join(",")), r.req.method === "OPTIONS") {
      e.origin !== "*" && o("Vary", "Origin"), e.maxAge != null && o("Access-Control-Max-Age", e.maxAge.toString());
      const l = await s(r.req.header("origin") || "", r);
      l.length && o("Access-Control-Allow-Methods", l.join(","));
      let u = e.allowHeaders;
      if (!(u != null && u.length)) {
        const m = r.req.header("Access-Control-Request-Headers");
        m && (u = m.split(/\s*,\s*/));
      }
      return u != null && u.length && (o("Access-Control-Allow-Headers", u.join(",")), r.res.headers.append("Vary", "Access-Control-Request-Headers")), r.res.headers.delete("Content-Length"), r.res.headers.delete("Content-Type"), new Response(null, {
        headers: r.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), e.origin !== "*" && r.header("Vary", "Origin", { append: !0 });
  };
}, M;
(function(n) {
  n.assertEqual = (a) => {
  };
  function e(a) {
  }
  n.assertIs = e;
  function t(a) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (a) => {
    const r = {};
    for (const i of a)
      r[i] = i;
    return r;
  }, n.getValidEnumValues = (a) => {
    const r = n.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of r)
      i[o] = a[o];
    return n.objectValues(i);
  }, n.objectValues = (a) => n.objectKeys(a).map(function(r) {
    return a[r];
  }), n.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const r = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && r.push(i);
    return r;
  }, n.find = (a, r) => {
    for (const i of a)
      if (r(i))
        return i;
  }, n.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function s(a, r = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(r);
  }
  n.joinValues = s, n.jsonStringifyReplacer = (a, r) => typeof r == "bigint" ? r.toString() : r;
})(M || (M = {}));
var Hn;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Hn || (Hn = {}));
const _ = M.arrayToEnum([
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
]), xe = (n) => {
  switch (typeof n) {
    case "undefined":
      return _.undefined;
    case "string":
      return _.string;
    case "number":
      return Number.isNaN(n) ? _.nan : _.number;
    case "boolean":
      return _.boolean;
    case "function":
      return _.function;
    case "bigint":
      return _.bigint;
    case "symbol":
      return _.symbol;
    case "object":
      return Array.isArray(n) ? _.array : n === null ? _.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? _.promise : typeof Map < "u" && n instanceof Map ? _.map : typeof Set < "u" && n instanceof Set ? _.set : typeof Date < "u" && n instanceof Date ? _.date : _.object;
    default:
      return _.unknown;
  }
}, p = M.arrayToEnum([
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
class le extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, s = { _errors: [] }, a = (r) => {
      for (const i of r.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          s._errors.push(t(i));
        else {
          let o = s, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return a(this), s;
  }
  static assert(e) {
    if (!(e instanceof le))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, M.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const r = a.path[0];
        t[r] = t[r] || [], t[r].push(e(a));
      } else
        s.push(e(a));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
le.create = (n) => new le(n);
const En = (n, e) => {
  let t;
  switch (n.code) {
    case p.invalid_type:
      n.received === _.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case p.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, M.jsonStringifyReplacer)}`;
      break;
    case p.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${M.joinValues(n.keys, ", ")}`;
      break;
    case p.invalid_union:
      t = "Invalid input";
      break;
    case p.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${M.joinValues(n.options)}`;
      break;
    case p.invalid_enum_value:
      t = `Invalid enum value. Expected ${M.joinValues(n.options)}, received '${n.received}'`;
      break;
    case p.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case p.invalid_return_type:
      t = "Invalid function return type";
      break;
    case p.invalid_date:
      t = "Invalid date";
      break;
    case p.invalid_string:
      typeof n.validation == "object" ? "includes" in n.validation ? (t = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : M.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case p.too_small:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "bigint" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : t = "Invalid input";
      break;
    case p.too_big:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? t = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : t = "Invalid input";
      break;
    case p.custom:
      t = "Invalid input";
      break;
    case p.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case p.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case p.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, M.assertNever(n);
  }
  return { message: t };
};
let Ba = En;
function ja() {
  return Ba;
}
const Fa = (n) => {
  const { data: e, path: t, errorMaps: s, issueData: a } = n, r = [...t, ...a.path || []], i = {
    ...a,
    path: r
  };
  if (a.message !== void 0)
    return {
      ...a,
      path: r,
      message: a.message
    };
  let o = "";
  const c = s.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: r,
    message: o
  };
};
function y(n, e) {
  const t = ja(), s = Fa({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      // contextual error map is first priority
      n.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === En ? void 0 : En
      // then global default map
    ].filter((a) => !!a)
  });
  n.common.issues.push(s);
}
class G {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const a of t) {
      if (a.status === "aborted")
        return x;
      a.status === "dirty" && e.dirty(), s.push(a.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const a of t) {
      const r = await a.key, i = await a.value;
      s.push({
        key: r,
        value: i
      });
    }
    return G.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const a of t) {
      const { key: r, value: i } = a;
      if (r.status === "aborted" || i.status === "aborted")
        return x;
      r.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (s[r.value] = i.value);
    }
    return { status: e.value, value: s };
  }
}
const x = Object.freeze({
  status: "aborted"
}), Rt = (n) => ({ status: "dirty", value: n }), te = (n) => ({ status: "valid", value: n }), Vn = (n) => n.status === "aborted", Zn = (n) => n.status === "dirty", ft = (n) => n.status === "valid", tn = (n) => typeof Promise < "u" && n instanceof Promise;
var v;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(v || (v = {}));
class ue {
  constructor(e, t, s, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const zn = (n, e) => {
  if (ft(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new le(n.common.issues);
      return this._error = t, this._error;
    }
  };
};
function R(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: a } = n;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: c } = n;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? s ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: a };
}
class C {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return xe(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: xe(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new G(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: xe(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (tn(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: xe(e)
    }, a = this._parseSync({ data: e, path: s.path, parent: s });
    return zn(s, a);
  }
  "~validate"(e) {
    var s, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: xe(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return ft(r) ? {
          value: r.value
        } : {
          issues: t.common.issues
        };
      } catch (r) {
        (a = (s = r == null ? void 0 : r.message) == null ? void 0 : s.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => ft(r) ? {
      value: r.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: xe(e)
    }, a = this._parse({ data: e, path: s.path, parent: s }), r = await (tn(a) ? a : Promise.resolve(a));
    return zn(s, r);
  }
  refine(e, t) {
    const s = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, r) => {
      const i = e(a), o = () => r.addIssue({
        code: p.custom,
        ...s(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, a) => e(s) ? !0 : (a.addIssue(typeof t == "function" ? t(s, a) : t), !1));
  }
  _refinement(e) {
    return new gt({
      schema: this,
      typeName: T.ZodEffects,
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
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return Ce.create(this, this._def);
  }
  nullable() {
    return yt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return de.create(this);
  }
  promise() {
    return on.create(this, this._def);
  }
  or(e) {
    return sn.create([this, e], this._def);
  }
  and(e) {
    return an.create(this, e, this._def);
  }
  transform(e) {
    return new gt({
      ...R(this._def),
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Nn({
      ...R(this._def),
      innerType: this,
      defaultValue: t,
      typeName: T.ZodDefault
    });
  }
  brand() {
    return new lr({
      typeName: T.ZodBranded,
      type: this,
      ...R(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Rn({
      ...R(this._def),
      innerType: this,
      catchValue: t,
      typeName: T.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Mn.create(this, e);
  }
  readonly() {
    return kn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const qa = /^c[^\s-]{8,}$/i, Wa = /^[0-9a-z]+$/, Ha = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Va = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Za = /^[a-z0-9_-]{21}$/i, za = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ja = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ga = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ka = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let pn;
const Ya = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Xa = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Qa = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, er = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, tr = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, nr = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ds = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", sr = new RegExp(`^${Ds}$`);
function Ps(n) {
  let e = "[0-5]\\d";
  n.precision ? e = `${e}\\.\\d{${n.precision}}` : n.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = n.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function ar(n) {
  return new RegExp(`^${Ps(n)}$`);
}
function rr(n) {
  let e = `${Ds}T${Ps(n)}`;
  const t = [];
  return t.push(n.local ? "Z?" : "Z"), n.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ir(n, e) {
  return !!((e === "v4" || !e) && Ya.test(n) || (e === "v6" || !e) && Qa.test(n));
}
function or(n, e) {
  if (!za.test(n))
    return !1;
  try {
    const [t] = n.split(".");
    if (!t)
      return !1;
    const s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(s));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function cr(n, e) {
  return !!((e === "v4" || !e) && Xa.test(n) || (e === "v6" || !e) && er.test(n));
}
class ve extends C {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== _.string) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: p.invalid_type,
        expected: _.string,
        received: r.parsedType
      }), x;
    }
    const s = new G();
    let a;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (a = this._getOrReturnCtx(e, a), y(a, {
          code: p.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (a = this._getOrReturnCtx(e, a), y(a, {
          code: p.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "length") {
        const i = e.data.length > r.value, o = e.data.length < r.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? y(a, {
          code: p.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && y(a, {
          code: p.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), s.dirty());
      } else if (r.kind === "email")
        Ga.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "email",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "emoji")
        pn || (pn = new RegExp(Ka, "u")), pn.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "emoji",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "uuid")
        Va.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "uuid",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "nanoid")
        Za.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "nanoid",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid")
        qa.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "cuid",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid2")
        Wa.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "cuid2",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "ulid")
        Ha.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
          validation: "ulid",
          code: p.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), y(a, {
            validation: "url",
            code: p.invalid_string,
            message: r.message
          }), s.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "regex",
        code: p.invalid_string,
        message: r.message
      }), s.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), s.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "datetime" ? rr(r).test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: "datetime",
        message: r.message
      }), s.dirty()) : r.kind === "date" ? sr.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: "date",
        message: r.message
      }), s.dirty()) : r.kind === "time" ? ar(r).test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.invalid_string,
        validation: "time",
        message: r.message
      }), s.dirty()) : r.kind === "duration" ? Ja.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "duration",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "ip" ? ir(e.data, r.version) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "ip",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "jwt" ? or(e.data, r.alg) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "jwt",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "cidr" ? cr(e.data, r.version) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "cidr",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64" ? tr.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "base64",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64url" ? nr.test(e.data) || (a = this._getOrReturnCtx(e, a), y(a, {
        validation: "base64url",
        code: p.invalid_string,
        message: r.message
      }), s.dirty()) : M.assertNever(r);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: p.invalid_string,
      ...v.errToObj(s)
    });
  }
  _addCheck(e) {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...v.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...v.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...v.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...v.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...v.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...v.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...v.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...v.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...v.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...v.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...v.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...v.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...v.errToObj(e) });
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
      ...v.errToObj(e == null ? void 0 : e.message)
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
      ...v.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...v.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...v.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...v.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...v.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...v.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...v.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...v.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...v.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, v.errToObj(e));
  }
  trim() {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ve({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ve({
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
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ve.create = (n) => new ve({
  checks: [],
  typeName: T.ZodString,
  coerce: (n == null ? void 0 : n.coerce) ?? !1,
  ...R(n)
});
function dr(n, e) {
  const t = (n.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, a = t > s ? t : s, r = Number.parseInt(n.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return r % i / 10 ** a;
}
class mt extends C {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== _.number) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: p.invalid_type,
        expected: _.number,
        received: r.parsedType
      }), x;
    }
    let s;
    const a = new G();
    for (const r of this._def.checks)
      r.kind === "int" ? M.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), a.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? dr(e.data, r.value) !== 0 && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.not_finite,
        message: r.message
      }), a.dirty()) : M.assertNever(r);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, v.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, v.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, v.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, v.toString(t));
  }
  setLimit(e, t, s, a) {
    return new mt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: v.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new mt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: v.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: v.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: v.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: v.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: v.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: v.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: v.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: v.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: v.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && M.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
mt.create = (n) => new mt({
  checks: [],
  typeName: T.ZodNumber,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ...R(n)
});
class Ct extends C {
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
    if (this._getType(e) !== _.bigint)
      return this._getInvalidInput(e);
    let s;
    const a = new G();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), y(s, {
        code: p.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : M.assertNever(r);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return y(t, {
      code: p.invalid_type,
      expected: _.bigint,
      received: t.parsedType
    }), x;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, v.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, v.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, v.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, v.toString(t));
  }
  setLimit(e, t, s, a) {
    return new Ct({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: v.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ct({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: v.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: v.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: v.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: v.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: v.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Ct.create = (n) => new Ct({
  checks: [],
  typeName: T.ZodBigInt,
  coerce: (n == null ? void 0 : n.coerce) ?? !1,
  ...R(n)
});
class Tn extends C {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== _.boolean) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.boolean,
        received: s.parsedType
      }), x;
    }
    return te(e.data);
  }
}
Tn.create = (n) => new Tn({
  typeName: T.ZodBoolean,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ...R(n)
});
class nn extends C {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== _.date) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: p.invalid_type,
        expected: _.date,
        received: r.parsedType
      }), x;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        code: p.invalid_date
      }), x;
    }
    const s = new G();
    let a;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), s.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (a = this._getOrReturnCtx(e, a), y(a, {
        code: p.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), s.dirty()) : M.assertNever(r);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new nn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: v.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: v.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
nn.create = (n) => new nn({
  checks: [],
  coerce: (n == null ? void 0 : n.coerce) || !1,
  typeName: T.ZodDate,
  ...R(n)
});
class Jn extends C {
  _parse(e) {
    if (this._getType(e) !== _.symbol) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.symbol,
        received: s.parsedType
      }), x;
    }
    return te(e.data);
  }
}
Jn.create = (n) => new Jn({
  typeName: T.ZodSymbol,
  ...R(n)
});
class Gn extends C {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.undefined,
        received: s.parsedType
      }), x;
    }
    return te(e.data);
  }
}
Gn.create = (n) => new Gn({
  typeName: T.ZodUndefined,
  ...R(n)
});
class Kn extends C {
  _parse(e) {
    if (this._getType(e) !== _.null) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.null,
        received: s.parsedType
      }), x;
    }
    return te(e.data);
  }
}
Kn.create = (n) => new Kn({
  typeName: T.ZodNull,
  ...R(n)
});
class Yn extends C {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return te(e.data);
  }
}
Yn.create = (n) => new Yn({
  typeName: T.ZodAny,
  ...R(n)
});
class xn extends C {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return te(e.data);
  }
}
xn.create = (n) => new xn({
  typeName: T.ZodUnknown,
  ...R(n)
});
class Me extends C {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return y(t, {
      code: p.invalid_type,
      expected: _.never,
      received: t.parsedType
    }), x;
  }
}
Me.create = (n) => new Me({
  typeName: T.ZodNever,
  ...R(n)
});
class Xn extends C {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.void,
        received: s.parsedType
      }), x;
    }
    return te(e.data);
  }
}
Xn.create = (n) => new Xn({
  typeName: T.ZodVoid,
  ...R(n)
});
class de extends C {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== _.array)
      return y(t, {
        code: p.invalid_type,
        expected: _.array,
        received: t.parsedType
      }), x;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (y(t, {
        code: i ? p.too_big : p.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), s.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (y(t, {
      code: p.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), s.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (y(t, {
      code: p.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new ue(t, i, t.path, o)))).then((i) => G.mergeArray(s, i));
    const r = [...t.data].map((i, o) => a.type._parseSync(new ue(t, i, t.path, o)));
    return G.mergeArray(s, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new de({
      ...this._def,
      minLength: { value: e, message: v.toString(t) }
    });
  }
  max(e, t) {
    return new de({
      ...this._def,
      maxLength: { value: e, message: v.toString(t) }
    });
  }
  length(e, t) {
    return new de({
      ...this._def,
      exactLength: { value: e, message: v.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
de.create = (n, e) => new de({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: T.ZodArray,
  ...R(e)
});
function rt(n) {
  if (n instanceof j) {
    const e = {};
    for (const t in n.shape) {
      const s = n.shape[t];
      e[t] = Ce.create(rt(s));
    }
    return new j({
      ...n._def,
      shape: () => e
    });
  } else return n instanceof de ? new de({
    ...n._def,
    type: rt(n.element)
  }) : n instanceof Ce ? Ce.create(rt(n.unwrap())) : n instanceof yt ? yt.create(rt(n.unwrap())) : n instanceof Ze ? Ze.create(n.items.map((e) => rt(e))) : n;
}
class j extends C {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = M.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== _.object) {
      const d = this._getOrReturnCtx(e);
      return y(d, {
        code: p.invalid_type,
        expected: _.object,
        received: d.parsedType
      }), x;
    }
    const { status: s, ctx: a } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof Me && this._def.unknownKeys === "strip"))
      for (const d in a.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const l = r[d], u = a.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new ue(a, u, a.path, d)),
        alwaysSet: d in a.data
      });
    }
    if (this._def.catchall instanceof Me) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: a.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (y(a, {
          code: p.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const u = a.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new ue(a, u, a.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const u = await l.key, m = await l.value;
        d.push({
          key: u,
          value: m,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => G.mergeObjectSync(s, d)) : G.mergeObjectSync(s, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return v.errToObj, new j({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          var r, i;
          const a = ((i = (r = this._def).errorMap) == null ? void 0 : i.call(r, t, s).message) ?? s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: v.errToObj(e).message ?? a
          } : {
            message: a
          };
        }
      } : {}
    });
  }
  strip() {
    return new j({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new j({
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
    return new j({
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
    return new j({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: T.ZodObject
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
  setKey(e, t) {
    return this.augment({ [e]: t });
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
    return new j({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of M.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of M.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return rt(this);
  }
  partial(e) {
    const t = {};
    for (const s of M.objectKeys(this.shape)) {
      const a = this.shape[s];
      e && !e[s] ? t[s] = a : t[s] = a.optional();
    }
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of M.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let r = this.shape[s];
        for (; r instanceof Ce; )
          r = r._def.innerType;
        t[s] = r;
      }
    return new j({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ls(M.objectKeys(this.shape));
  }
}
j.create = (n, e) => new j({
  shape: () => n,
  unknownKeys: "strip",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...R(e)
});
j.strictCreate = (n, e) => new j({
  shape: () => n,
  unknownKeys: "strict",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...R(e)
});
j.lazycreate = (n, e) => new j({
  shape: n,
  unknownKeys: "strip",
  catchall: Me.create(),
  typeName: T.ZodObject,
  ...R(e)
});
class sn extends C {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function a(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = r.map((o) => new le(o.ctx.common.issues));
      return y(t, {
        code: p.invalid_union,
        unionErrors: i
      }), x;
    }
    if (t.common.async)
      return Promise.all(s.map(async (r) => {
        const i = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await r._parseAsync({
            data: t.data,
            path: t.path,
            parent: i
          }),
          ctx: i
        };
      })).then(a);
    {
      let r;
      const i = [];
      for (const c of s) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !r && (r = { result: l, ctx: d }), d.common.issues.length && i.push(d.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const o = i.map((c) => new le(c));
      return y(t, {
        code: p.invalid_union,
        unionErrors: o
      }), x;
    }
  }
  get options() {
    return this._def.options;
  }
}
sn.create = (n, e) => new sn({
  options: n,
  typeName: T.ZodUnion,
  ...R(e)
});
function Sn(n, e) {
  const t = xe(n), s = xe(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === _.object && s === _.object) {
    const a = M.objectKeys(e), r = M.objectKeys(n).filter((o) => a.indexOf(o) !== -1), i = { ...n, ...e };
    for (const o of r) {
      const c = Sn(n[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === _.array && s === _.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let r = 0; r < n.length; r++) {
      const i = n[r], o = e[r], c = Sn(i, o);
      if (!c.valid)
        return { valid: !1 };
      a.push(c.data);
    }
    return { valid: !0, data: a };
  } else return t === _.date && s === _.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class an extends C {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = (r, i) => {
      if (Vn(r) || Vn(i))
        return x;
      const o = Sn(r.value, i.value);
      return o.valid ? ((Zn(r) || Zn(i)) && t.dirty(), { status: t.value, value: o.data }) : (y(s, {
        code: p.invalid_intersection_types
      }), x);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([r, i]) => a(r, i)) : a(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
an.create = (n, e, t) => new an({
  left: n,
  right: e,
  typeName: T.ZodIntersection,
  ...R(t)
});
class Ze extends C {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== _.array)
      return y(s, {
        code: p.invalid_type,
        expected: _.array,
        received: s.parsedType
      }), x;
    if (s.data.length < this._def.items.length)
      return y(s, {
        code: p.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), x;
    !this._def.rest && s.data.length > this._def.items.length && (y(s, {
      code: p.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...s.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new ue(s, i, s.path, o)) : null;
    }).filter((i) => !!i);
    return s.common.async ? Promise.all(r).then((i) => G.mergeArray(t, i)) : G.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Ze({
      ...this._def,
      rest: e
    });
  }
}
Ze.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Ze({
    items: n,
    typeName: T.ZodTuple,
    rest: null,
    ...R(e)
  });
};
class rn extends C {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== _.object)
      return y(s, {
        code: p.invalid_type,
        expected: _.object,
        received: s.parsedType
      }), x;
    const a = [], r = this._def.keyType, i = this._def.valueType;
    for (const o in s.data)
      a.push({
        key: r._parse(new ue(s, o, s.path, o)),
        value: i._parse(new ue(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? G.mergeObjectAsync(t, a) : G.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof C ? new rn({
      keyType: e,
      valueType: t,
      typeName: T.ZodRecord,
      ...R(s)
    }) : new rn({
      keyType: ve.create(),
      valueType: e,
      typeName: T.ZodRecord,
      ...R(t)
    });
  }
}
class Qn extends C {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== _.map)
      return y(s, {
        code: p.invalid_type,
        expected: _.map,
        received: s.parsedType
      }), x;
    const a = this._def.keyType, r = this._def.valueType, i = [...s.data.entries()].map(([o, c], d) => ({
      key: a._parse(new ue(s, o, s.path, [d, "key"])),
      value: r._parse(new ue(s, c, s.path, [d, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return x;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return x;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Qn.create = (n, e, t) => new Qn({
  valueType: e,
  keyType: n,
  typeName: T.ZodMap,
  ...R(t)
});
class Mt extends C {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== _.set)
      return y(s, {
        code: p.invalid_type,
        expected: _.set,
        received: s.parsedType
      }), x;
    const a = this._def;
    a.minSize !== null && s.data.size < a.minSize.value && (y(s, {
      code: p.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && s.data.size > a.maxSize.value && (y(s, {
      code: p.too_big,
      maximum: a.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function i(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return x;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...s.data.values()].map((c, d) => r._parse(new ue(s, c, s.path, d)));
    return s.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new Mt({
      ...this._def,
      minSize: { value: e, message: v.toString(t) }
    });
  }
  max(e, t) {
    return new Mt({
      ...this._def,
      maxSize: { value: e, message: v.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Mt.create = (n, e) => new Mt({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: T.ZodSet,
  ...R(e)
});
class es extends C {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
es.create = (n, e) => new es({
  getter: n,
  typeName: T.ZodLazy,
  ...R(e)
});
class ts extends C {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return y(t, {
        received: t.data,
        code: p.invalid_literal,
        expected: this._def.value
      }), x;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ts.create = (n, e) => new ts({
  value: n,
  typeName: T.ZodLiteral,
  ...R(e)
});
function Ls(n, e) {
  return new pt({
    values: n,
    typeName: T.ZodEnum,
    ...R(e)
  });
}
class pt extends C {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return y(t, {
        expected: M.joinValues(s),
        received: t.parsedType,
        code: p.invalid_type
      }), x;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return y(t, {
        received: t.data,
        code: p.invalid_enum_value,
        options: s
      }), x;
    }
    return te(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return pt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return pt.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
pt.create = Ls;
class ns extends C {
  _parse(e) {
    const t = M.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== _.string && s.parsedType !== _.number) {
      const a = M.objectValues(t);
      return y(s, {
        expected: M.joinValues(a),
        received: s.parsedType,
        code: p.invalid_type
      }), x;
    }
    if (this._cache || (this._cache = new Set(M.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = M.objectValues(t);
      return y(s, {
        received: s.data,
        code: p.invalid_enum_value,
        options: a
      }), x;
    }
    return te(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
ns.create = (n, e) => new ns({
  values: n,
  typeName: T.ZodNativeEnum,
  ...R(e)
});
class on extends C {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== _.promise && t.common.async === !1)
      return y(t, {
        code: p.invalid_type,
        expected: _.promise,
        received: t.parsedType
      }), x;
    const s = t.parsedType === _.promise ? t.data : Promise.resolve(t.data);
    return te(s.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
on.create = (n, e) => new on({
  type: n,
  typeName: T.ZodPromise,
  ...R(e)
});
class gt extends C {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === T.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), a = this._def.effect || null, r = {
      addIssue: (i) => {
        y(s, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), a.type === "preprocess") {
      const i = a.transform(s.data, r);
      if (s.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return x;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return c.status === "aborted" ? x : c.status === "dirty" || t.value === "dirty" ? Rt(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return x;
        const o = this._def.schema._parseSync({
          data: i,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? x : o.status === "dirty" || t.value === "dirty" ? Rt(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const c = a.refinement(o, r);
        if (s.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? x : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? x : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!ft(i))
          return x;
        const o = a.transform(i.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => ft(i) ? Promise.resolve(a.transform(i.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : x);
    M.assertNever(a);
  }
}
gt.create = (n, e, t) => new gt({
  schema: n,
  typeName: T.ZodEffects,
  effect: e,
  ...R(t)
});
gt.createWithPreprocess = (n, e, t) => new gt({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: T.ZodEffects,
  ...R(t)
});
class Ce extends C {
  _parse(e) {
    return this._getType(e) === _.undefined ? te(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ce.create = (n, e) => new Ce({
  innerType: n,
  typeName: T.ZodOptional,
  ...R(e)
});
class yt extends C {
  _parse(e) {
    return this._getType(e) === _.null ? te(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
yt.create = (n, e) => new yt({
  innerType: n,
  typeName: T.ZodNullable,
  ...R(e)
});
class Nn extends C {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === _.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Nn.create = (n, e) => new Nn({
  innerType: n,
  typeName: T.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...R(e)
});
class Rn extends C {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return tn(a) ? a.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new le(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new le(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Rn.create = (n, e) => new Rn({
  innerType: n,
  typeName: T.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...R(e)
});
class ss extends C {
  _parse(e) {
    if (this._getType(e) !== _.nan) {
      const s = this._getOrReturnCtx(e);
      return y(s, {
        code: p.invalid_type,
        expected: _.nan,
        received: s.parsedType
      }), x;
    }
    return { status: "valid", value: e.data };
  }
}
ss.create = (n) => new ss({
  typeName: T.ZodNaN,
  ...R(n)
});
class lr extends C {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Mn extends C {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return r.status === "aborted" ? x : r.status === "dirty" ? (t.dirty(), Rt(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return a.status === "aborted" ? x : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new Mn({
      in: e,
      out: t,
      typeName: T.ZodPipeline
    });
  }
}
class kn extends C {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (a) => (ft(a) && (a.value = Object.freeze(a.value)), a);
    return tn(t) ? t.then((a) => s(a)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
kn.create = (n, e) => new kn({
  innerType: n,
  typeName: T.ZodReadonly,
  ...R(e)
});
var T;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline", n.ZodReadonly = "ZodReadonly";
})(T || (T = {}));
const g = ve.create, K = mt.create, Q = Tn.create, $s = xn.create;
Me.create;
const ln = de.create, O = j.create;
sn.create;
an.create;
Ze.create;
const Bs = rn.create, _t = pt.create;
on.create;
Ce.create;
yt.create;
class f extends Error {
  constructor(e, t, s = 400, a) {
    super(t), this.code = e, this.status = s, this.details = a;
  }
}
function ur(n) {
  return n instanceof f;
}
function gn(n, e, t = {}) {
  const s = JSON.stringify({
    level: n,
    event: e,
    ...t
  });
  if (n === "error") {
    console.error(s);
    return;
  }
  if (n === "warn") {
    console.warn(s);
    return;
  }
  console.log(s);
}
const ie = {
  info: (n, e) => gn("info", n, e),
  warn: (n, e) => gn("warn", n, e),
  error: (n, e) => gn("error", n, e)
};
function hr() {
  return async (n, e) => {
    try {
      await e();
    } catch (t) {
      return js(t, n);
    }
  };
}
function js(n, e) {
  const t = e.get("requestId");
  return ur(n) ? (ie.warn("app_error", { requestId: t, code: n.code, message: n.message }), e.json({ error: { code: n.code, message: n.message, details: n.details } }, n.status)) : n instanceof le ? (ie.warn("validation_error", { requestId: t, issues: n.issues }), e.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: n.flatten() } },
    400
  )) : (ie.error("unhandled_error", {
    requestId: t,
    message: n instanceof Error ? n.message : String(n)
  }), e.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500));
}
function H(n) {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const t = Array.from(e, (s) => s.toString(16).padStart(2, "0")).join("");
  return `${n}_${t}`;
}
function fr() {
  return async (n, e) => {
    const t = n.req.header("x-request-id") || H("req");
    n.set("requestId", t), n.header("x-request-id", t), await e();
  };
}
class mr {
  constructor(e) {
    this.adapters = e;
  }
  get(e) {
    const t = this.adapters.find((s) => s.type === e);
    if (!t)
      throw new f("CHANNEL_NOT_SUPPORTED", `Unsupported channel: ${e}`, 400);
    return t;
  }
}
async function as(n) {
  const e = new TextEncoder().encode(n), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t), (s) => s.toString(16).padStart(2, "0")).join("");
}
async function rs(n, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(n),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), s = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return Array.from(new Uint8Array(s), (a) => a.toString(16).padStart(2, "0")).join("");
}
async function ze(n, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(n),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), s = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return oe(new Uint8Array(s));
}
function wt(n, e) {
  if (n.length !== e.length) return !1;
  let t = 0;
  for (let s = 0; s < n.length; s += 1)
    t |= n.charCodeAt(s) ^ e.charCodeAt(s);
  return t === 0;
}
function oe(n) {
  const e = typeof n == "string" ? new TextEncoder().encode(n) : n;
  let t = "";
  for (const s of e) t += String.fromCharCode(s);
  return btoa(t).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function Un(n) {
  return new TextDecoder().decode(Fs(n));
}
function Fs(n) {
  const e = n.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(n.length / 4) * 4, "="), t = atob(e), s = new Uint8Array(t.length);
  for (let a = 0; a < t.length; a += 1)
    s[a] = t.charCodeAt(a);
  return s;
}
async function qs(n, e = crypto.getRandomValues(new Uint8Array(16))) {
  const s = await crypto.subtle.importKey("raw", new TextEncoder().encode(n), "PBKDF2", !1, ["deriveBits"]), a = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: e, iterations: 1e5, hash: "SHA-256" },
    s,
    256
  );
  return `pbkdf2_sha256$100000$${oe(e)}$${oe(new Uint8Array(a))}`;
}
async function On(n, e) {
  if (!e) return !1;
  const [t, s, a, r] = e.split("$");
  if (t !== "pbkdf2_sha256" || !s || !a || !r) return !1;
  const i = Number(s);
  if (!Number.isInteger(i) || i < 1e4) return !1;
  const o = await crypto.subtle.importKey("raw", new TextEncoder().encode(n), "PBKDF2", !1, ["deriveBits"]), c = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: Fs(a), iterations: i, hash: "SHA-256" },
    o,
    256
  );
  return wt(oe(new Uint8Array(c)), r);
}
function N() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
const pr = O({
  event_id: g().optional(),
  event_type: g().default("message.created"),
  contact: O({
    external_id: g().optional(),
    name: g().optional(),
    avatar_url: g().optional()
  }).optional(),
  message: O({
    external_id: g().optional(),
    type: _t(["text", "image", "file", "audio", "video", "event"]).default("text"),
    text: g().optional(),
    attachments: ln(Bs($s())).default([])
  }),
  timestamp: g().optional()
});
class gr {
  constructor() {
    A(this, "type", "custom_webhook");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const s = e.headers.get("x-supportly-signature");
    if (!s)
      throw new f("SIGNATURE_INVALID", "Missing webhook signature", 401);
    const a = await e.text(), r = await rs(t.webhookSecretCiphertext, a);
    if (!wt(s, r))
      throw new f("SIGNATURE_INVALID", "Invalid webhook signature", 401);
  }
  async parseInbound(e, t) {
    var i, o, c, d, l;
    const s = pr.parse(await e.json()), a = ((i = s.contact) == null ? void 0 : i.external_id) ?? s.event_id ?? await as(JSON.stringify(s)), r = ((o = s.contact) == null ? void 0 : o.external_id) ?? `anonymous:${await as(`${t.id}:${a}`)}`;
    return [
      {
        externalMessageId: s.message.external_id ?? s.event_id,
        externalContactId: r,
        externalThreadId: a,
        contactName: (c = s.contact) == null ? void 0 : c.name,
        contactAvatarUrl: (d = s.contact) == null ? void 0 : d.avatar_url,
        isAnonymous: !((l = s.contact) != null && l.external_id),
        messageType: s.message.type,
        content: s.message.text,
        attachments: s.message.attachments.map((u) => ({
          type: typeof u.type == "string" ? u.type : "file",
          url: typeof u.url == "string" ? u.url : void 0,
          fileId: typeof u.file_id == "string" ? u.file_id : void 0,
          mimeType: typeof u.mime_type == "string" ? u.mime_type : void 0,
          fileName: typeof u.file_name == "string" ? u.file_name : void 0,
          size: typeof u.size == "number" ? u.size : void 0
        })),
        rawPayload: s,
        receivedAt: s.timestamp ?? N()
      }
    ];
  }
  async sendMessage(e, t) {
    if (!e.outboundUrl)
      return { externalMessageId: t.messageId };
    const s = {
      event_type: "message.send",
      conversation_id: t.conversationId,
      message_id: t.messageId,
      message: {
        type: t.messageType,
        text: t.content,
        attachments: t.attachments ?? []
      }
    }, a = JSON.stringify(s), r = new Headers({ "content-type": "application/json" });
    e.webhookSecretCiphertext && r.set("x-supportly-signature", await rs(e.webhookSecretCiphertext, a));
    const i = await fetch(e.outboundUrl, {
      method: "POST",
      headers: r,
      body: a
    });
    if (!i.ok)
      throw new f("MESSAGE_SEND_FAILED", `Outbound webhook failed: ${i.status}`, 502);
    return { externalMessageId: t.messageId };
  }
}
class yr {
  constructor() {
    A(this, "type", "forum");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
const Ws = O({
  id: K(),
  is_bot: Q().optional(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional()
}), _r = O({
  id: K(),
  type: g(),
  first_name: g().optional(),
  last_name: g().optional(),
  username: g().optional(),
  title: g().optional()
}), wr = O({
  file_id: g(),
  file_unique_id: g(),
  file_size: K().optional(),
  width: K(),
  height: K()
}), vr = O({
  message_id: K(),
  date: K(),
  chat: _r,
  from: Ws.optional(),
  text: g().optional(),
  caption: g().optional(),
  photo: ln(wr).optional(),
  reply_to_message: O({
    message_id: K(),
    text: g().optional(),
    caption: g().optional()
  }).optional()
}), Ir = O({
  update_id: K(),
  message: vr.optional()
}), is = O({
  ok: Q(),
  result: O({
    message_id: K()
  }).optional(),
  description: g().optional()
}), Ar = O({
  ok: Q(),
  result: Q().optional(),
  description: g().optional()
}), br = O({
  ok: Q(),
  result: Ws.extend({
    can_join_groups: Q().optional(),
    can_read_all_group_messages: Q().optional(),
    supports_inline_queries: Q().optional()
  }).optional(),
  description: g().optional()
}), Er = O({
  ok: Q(),
  result: O({
    url: g(),
    has_custom_certificate: Q().optional(),
    pending_update_count: K(),
    ip_address: g().optional(),
    last_error_date: K().optional(),
    last_error_message: g().optional(),
    last_synchronization_error_date: K().optional(),
    max_connections: K().optional(),
    allowed_updates: ln(g()).optional()
  }).optional(),
  description: g().optional()
});
class Hs {
  constructor() {
    A(this, "type", "telegram");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const s = e.headers.get("x-telegram-bot-api-secret-token");
    if (!s || !wt(s, t.webhookSecretCiphertext))
      throw new f("SIGNATURE_INVALID", "Invalid Telegram webhook secret", 401);
  }
  async parseInbound(e, t, s) {
    var c, d;
    const a = Ir.parse(await e.json()), r = a.message;
    if (!r || !r.from)
      return [];
    const i = String(r.from.id), o = String(r.chat.id);
    return s && (i === s || o === s) ? this.parseAdminReply(a, r, t, s) : (c = r.text) != null && c.trim() ? [
      {
        externalMessageId: String(a.update_id),
        externalContactId: i,
        externalThreadId: String(r.chat.id),
        contactName: Tt(r.from) ?? Tt(r.chat),
        isAnonymous: !1,
        messageType: "text",
        content: r.text,
        attachments: [],
        rawPayload: a,
        receivedAt: new Date(r.date * 1e3).toISOString()
      }
    ] : (d = r.photo) != null && d.length ? this.parsePhotoInbound(a, r, t) : [];
  }
  async parseAdminReply(e, t, s, a) {
    const r = t.reply_to_message;
    if (!(r != null && r.text))
      return await this.sendWarning(s, a, t.message_id), [];
    const i = r.text.match(/#conv_(\w+)/);
    return i ? [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(t.from.id),
        externalThreadId: String(t.chat.id),
        contactName: Tt(t.from) ?? "Admin",
        isAnonymous: !1,
        messageType: "text",
        content: t.text,
        attachments: [],
        rawPayload: e,
        receivedAt: new Date(t.date * 1e3).toISOString(),
        agentReply: {
          replyToConversationId: i[1]
        }
      }
    ] : (await this.sendWarning(s, a, t.message_id), []);
  }
  async parsePhotoInbound(e, t, s) {
    const a = s.credentialCiphertext;
    if (!a) return [];
    const r = t.photo.reduce((o, c) => (o.file_size ?? 0) > (c.file_size ?? 0) ? o : c), i = await this.getFileUrl(a, r.file_id);
    return [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(t.from.id),
        externalThreadId: String(t.chat.id),
        contactName: Tt(t.from) ?? Tt(t.chat),
        isAnonymous: !1,
        messageType: "image",
        content: t.caption ?? "",
        attachments: [{ type: "image", url: i.url, mimeType: i.mimeType, fileName: i.fileName, size: r.file_size ?? 0 }],
        rawPayload: e,
        receivedAt: new Date(t.date * 1e3).toISOString()
      }
    ];
  }
  async getFileUrl(e, t) {
    var l, u;
    const r = (l = (await (await fetch(`https://api.telegram.org/bot${e}/getFile?file_id=${t}`)).json()).result) == null ? void 0 : l.file_path;
    if (!r) throw new Error("Telegram getFile failed: no file_path");
    const i = r.split("/").pop() ?? "photo.jpg", o = ((u = i.split(".").pop()) == null ? void 0 : u.toLowerCase()) ?? "", d = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[o] ?? "image/jpeg";
    return { url: `https://api.telegram.org/file/bot${e}/${r}`, fileName: i, mimeType: d };
  }
  async sendWarning(e, t, s) {
    const a = e.credentialCiphertext;
    if (a)
      try {
        await fetch(`https://api.telegram.org/bot${a}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: t,
            reply_to_message_id: s,
            text: "⚠️ 普通回复无效，请<b>引用回复</b>通知消息，否则客户不会收到任何回复。",
            parse_mode: "HTML"
          })
        });
      } catch {
      }
  }
  async sendMessage(e, t) {
    const s = e.credentialCiphertext;
    if (!s)
      throw new f("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    if (t.messageType === "image" && t.fileData)
      return this.sendPhoto(e, t);
    if (t.messageType !== "text")
      throw new f("MESSAGE_TYPE_NOT_SUPPORTED", "Telegram media outbound is not supported yet", 400);
    const a = await fetch(`https://api.telegram.org/bot${s}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: t.externalThreadId,
        text: t.content ?? ""
      })
    }), r = is.parse(await a.json().catch(() => ({ ok: !1 })));
    if (!a.ok || !r.ok || !r.result)
      throw new f(
        "MESSAGE_SEND_FAILED",
        `Telegram sendMessage failed: ${a.status}${r.description ? ` ${r.description}` : ""}`,
        502
      );
    return { externalMessageId: String(r.result.message_id) };
  }
  async sendPhoto(e, t) {
    const s = e.credentialCiphertext, a = new FormData();
    a.append("chat_id", t.externalThreadId), a.append("photo", new Blob([t.fileData]), t.fileName ?? "photo.jpg"), t.content && (a.append("caption", t.content), a.append("parse_mode", "HTML"));
    const r = await fetch(`https://api.telegram.org/bot${s}/sendPhoto`, {
      method: "POST",
      body: a
    }), i = is.parse(await r.json().catch(() => ({ ok: !1 })));
    if (!r.ok || !i.ok || !i.result)
      throw new f(
        "MESSAGE_SEND_FAILED",
        `Telegram sendPhoto failed: ${r.status}${i.description ? ` ${i.description}` : ""}`,
        502
      );
    return { externalMessageId: String(i.result.message_id) };
  }
  async setWebhook(e, t) {
    const s = Ar.parse(
      await this.callTelegram(e, "setWebhook", {
        url: t.webhookUrl,
        secret_token: e.webhookSecretCiphertext || void 0,
        allowed_updates: ["message"],
        drop_pending_updates: t.dropPendingUpdates ?? !1
      })
    );
    if (!s.ok || !s.result)
      throw new f("TELEGRAM_SET_WEBHOOK_FAILED", s.description ?? "Telegram setWebhook failed", 502);
    return {
      ok: !0,
      description: s.description,
      webhookUrl: t.webhookUrl,
      webhookInfo: await this.getWebhookInfo(e)
    };
  }
  async testConnection(e, t) {
    const s = await this.getMe(e), a = await this.getWebhookInfo(e);
    return {
      bot: s,
      webhookInfo: a,
      webhookUrlMatches: t ? a.url === t : !!a.url,
      expectedWebhookUrl: t
    };
  }
  async getMe(e) {
    const t = br.parse(await this.callTelegram(e, "getMe"));
    if (!t.ok || !t.result)
      throw new f("TELEGRAM_GET_ME_FAILED", t.description ?? "Telegram getMe failed", 502);
    return {
      id: t.result.id,
      isBot: t.result.is_bot,
      firstName: t.result.first_name,
      username: t.result.username
    };
  }
  async getWebhookInfo(e) {
    const t = Er.parse(await this.callTelegram(e, "getWebhookInfo"));
    if (!t.ok || !t.result)
      throw new f("TELEGRAM_GET_WEBHOOK_INFO_FAILED", t.description ?? "Telegram getWebhookInfo failed", 502);
    return {
      url: t.result.url,
      pendingUpdateCount: t.result.pending_update_count,
      lastErrorDate: t.result.last_error_date,
      lastErrorMessage: t.result.last_error_message,
      allowedUpdates: t.result.allowed_updates
    };
  }
  async callTelegram(e, t, s) {
    const a = e.credentialCiphertext;
    if (!a)
      throw new f("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const r = await fetch(`https://api.telegram.org/bot${a}/${t}`, {
      method: s ? "POST" : "GET",
      headers: s ? { "content-type": "application/json" } : void 0,
      body: s ? JSON.stringify(s) : void 0
    }), i = await r.json().catch(() => ({ ok: !1 }));
    if (!r.ok) {
      const o = typeof i == "object" && i && "description" in i ? String(i.description) : `HTTP ${r.status}`;
      throw new f("TELEGRAM_API_FAILED", `Telegram ${t} failed: ${o}`, 502);
    }
    return i;
  }
}
function Tt(n) {
  return [n.first_name, n.last_name].filter(Boolean).join(" ").trim() || n.username || n.title || void 0;
}
class Tr {
  constructor() {
    A(this, "type", "web_chat");
  }
  async verify() {
  }
  async parseInbound() {
    return [];
  }
  async sendMessage(e, t) {
    return { externalMessageId: t.messageId };
  }
}
class xr {
  constructor(e, t) {
    this.search = e, this.instanceName = t;
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
    let s = 1;
    for (; ; ) {
      const a = await this.search.items.list({
        page: s,
        per_page: 50,
        sort_by: "modified_at"
      }), r = a.result ?? [];
      e.push(...r);
      const i = a.result_info, o = (i == null ? void 0 : i.total_count) ?? e.length, c = (i == null ? void 0 : i.page) ?? s, d = (i == null ? void 0 : i.per_page) ?? 50;
      if (e.length >= o || r.length === 0 || (s = c + 1, s > Math.ceil(o / d) + 1)) break;
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
      })).chunks ?? []).map((s) => {
        var a, r, i, o, c;
        return {
          id: s.id,
          title: String(((r = (a = s.item) == null ? void 0 : a.metadata) == null ? void 0 : r.filename) ?? ((i = s.item) == null ? void 0 : i.key) ?? "Knowledge"),
          path: ((o = s.item) == null ? void 0 : o.key) ?? "",
          score: s.score ?? 0,
          text: s.text ?? "",
          metadata: ((c = s.item) == null ? void 0 : c.metadata) ?? {}
        };
      });
    } catch {
      return [];
    }
  }
}
const Sr = "@cf/meta/llama-3.1-8b-instruct", Nr = "kb/", Rr = 4 * 1024 * 1024, kr = "media/", Or = 10 * 1024 * 1024, Cr = 50 * 1024 * 1024;
class Mr {
  constructor(e, t) {
    this.ai = e, this.env = t;
  }
  async generateKnowledgeReply(e) {
    const t = this.env.DEFAULT_AI_MODEL || Sr, s = Date.now(), a = Ur(e.question, e.references), r = await this.ai.run(t, { prompt: a });
    return {
      text: Dr(r),
      metadata: {
        model: t,
        latencyMs: Date.now() - s,
        referencesCount: e.references.length
      }
    };
  }
}
function Ur(n, e) {
  const t = e.map((s, a) => `Source ${a + 1}: ${s.title}
${s.text}`).join(`

`);
  return [
    "You are a customer support assistant.",
    "Answer the customer only using the knowledge context.",
    "If the answer is not in the context, say you are not sure and ask a human agent to help.",
    "",
    `Question: ${n}`,
    "",
    `Knowledge context:
${t}`
  ].join(`
`);
}
function Dr(n) {
  if (typeof n == "string") return n;
  if (n && typeof n == "object") {
    const e = n;
    if (typeof e.response == "string") return e.response;
    if (typeof e.result == "string") return e.result;
    if (typeof e.text == "string") return e.text;
  }
  return "抱歉，我暂时无法根据知识库生成回答。";
}
class Pr {
  constructor(e, t, s) {
    this.aiSearch = e, this.workersAi = t, this.messages = s;
  }
  async maybeCreateReply(e) {
    var t;
    if (e.handoffStatus === "agent" || !((t = e.messageContent) != null && t.trim()) || !this.aiSearch || !this.workersAi) return null;
    try {
      const s = await this.aiSearch.searchKnowledge(e.messageContent);
      if (s.length === 0) return null;
      const a = await this.workersAi.generateKnowledgeReply({
        question: e.messageContent,
        references: s
      });
      return this.messages.createOutbound({
        conversationId: e.conversationId,
        channelAccountId: e.channelAccountId,
        senderType: "ai",
        content: a.text,
        status: "sending",
        aiMetadata: a.metadata,
        aiReferences: s.map((r) => ({
          id: r.id,
          title: r.title,
          path: r.path,
          score: r.score
        }))
      });
    } catch {
      return null;
    }
  }
}
function yn(n) {
  return {
    id: n.id,
    channelType: n.channel_type,
    displayName: n.display_name,
    externalAccountId: n.external_account_id,
    credentialCiphertext: n.credential_ciphertext,
    webhookSecretCiphertext: n.webhook_secret_ciphertext,
    outboundUrl: n.outbound_url,
    status: n.status,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  };
}
class Lr {
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
    ).all()).results.map(yn);
  }
  async findById(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE id = ?
        LIMIT 1
        `
    ).bind(e).first();
    return t ? yn(t) : null;
  }
  async findByType(e) {
    const t = await this.db.prepare(
      `
        SELECT *
        FROM channel_accounts
        WHERE channel_type = ? AND status = 'active'
        LIMIT 1
        `
    ).bind(e).first();
    return t ? yn(t) : null;
  }
  async create(e) {
    const t = H("ch"), s = N();
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
      t,
      e.channelType,
      e.displayName,
      e.externalAccountId ?? null,
      e.credentialCiphertext ?? null,
      e.webhookSecretCiphertext ?? null,
      e.outboundUrl ?? null,
      s,
      s
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created channel account not found");
    return a;
  }
  async update(e, t) {
    const s = N(), a = [], r = [];
    if (t.displayName !== void 0 && (a.push("display_name = ?"), r.push(t.displayName)), t.externalAccountId !== void 0 && (a.push("external_account_id = ?"), r.push(t.externalAccountId)), t.credentialCiphertext !== void 0 && (a.push("credential_ciphertext = ?"), r.push(t.credentialCiphertext)), t.webhookSecretCiphertext !== void 0 && (a.push("webhook_secret_ciphertext = ?"), r.push(t.webhookSecretCiphertext)), t.outboundUrl !== void 0 && (a.push("outbound_url = ?"), r.push(t.outboundUrl)), a.length === 0) {
      const o = await this.findById(e);
      if (!o) throw new Error("Channel account not found");
      return o;
    }
    a.push("updated_at = ?"), r.push(s), r.push(e), await this.db.prepare(`UPDATE channel_accounts SET ${a.join(", ")} WHERE id = ?`).bind(...r).run();
    const i = await this.findById(e);
    if (!i) throw new Error("Channel account not found after update");
    return i;
  }
}
class $r {
  constructor(e, t) {
    this.channels = e, this.adapters = t;
  }
  listAccounts() {
    return this.channels.list();
  }
  createAccount(e) {
    return this.adapters.get(e.channelType), this.channels.create(e);
  }
  async getAccount(e) {
    const t = await this.channels.findById(e);
    if (!t)
      throw new f("CHANNEL_NOT_FOUND", "Channel account not found", 404);
    return t;
  }
  async getAccountByType(e) {
    return this.channels.findByType(e);
  }
  async updateAccount(e, t) {
    return await this.getAccount(e), this.channels.update(e, t);
  }
  getAdapter(e) {
    return this.adapters.get(e.channelType);
  }
}
function Ee(n) {
  return {
    id: n.id,
    channelAccountId: n.channel_account_id,
    externalContactId: n.external_contact_id,
    externalThreadId: n.external_thread_id,
    contactName: n.contact_name,
    contactAvatarUrl: n.contact_avatar_url,
    isAnonymous: n.is_anonymous === 1,
    status: n.status,
    handoffStatus: n.handoff_status,
    assigneeAdminUserId: n.assignee_admin_user_id,
    lastMessageId: n.last_message_id,
    lastMessageAt: n.last_message_at,
    unreadCount: n.unread_count,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    resolvedAt: n.resolved_at
  };
}
class Br {
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
    ).bind(e).all()).results.map(Ee);
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
    ).bind(e).all()).results.map(Ee);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM conversations WHERE id = ? LIMIT 1").bind(e).first();
    return t ? Ee(t) : null;
  }
  async findByExternalThread(e, t) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
          AND external_thread_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return s ? Ee(s) : null;
  }
  async findLatestByExternalContact(e, t) {
    const s = await this.db.prepare(
      "SELECT * FROM conversations WHERE channel_account_id = ? AND external_contact_id = ? ORDER BY last_message_at DESC LIMIT 1"
    ).bind(e, t).first();
    return s ? Ee(s) : null;
  }
  async create(e) {
    const t = H("conv"), s = N();
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
      t,
      e.channelAccountId,
      e.externalContactId,
      e.externalThreadId,
      e.contactName ?? null,
      e.contactAvatarUrl ?? null,
      e.isAnonymous ? 1 : 0,
      s,
      s
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created conversation not found");
    return a;
  }
  async findOrCreateByExternalThread(e) {
    return await this.findByExternalThread(e.channelAccountId, e.externalThreadId) ?? this.create(e);
  }
  async touchAfterInbound(e, t, s) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            unread_count = unread_count + 1,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, s, s, e).run();
  }
  async touchAfterOutbound(e, t, s) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, s, s, e).run();
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
    ).bind(N(), e).run();
  }
  async setHandoffStatus(e, t) {
    await this.db.prepare("UPDATE conversations SET handoff_status = ?, updated_at = ? WHERE id = ?").bind(t, N(), e).run();
  }
  async resolve(e) {
    const t = N();
    await this.db.prepare("UPDATE conversations SET status = 'resolved', resolved_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async reopen(e) {
    await this.db.prepare("UPDATE conversations SET status = 'open', resolved_at = NULL, updated_at = ? WHERE id = ?").bind(N(), e).run();
  }
  async listByChannel(e, t = 50, s = 0) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
        ORDER BY last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, s).all()).results.map(Ee);
  }
  async listByExternalContact(e, t) {
    let s = "SELECT c.* FROM conversations c";
    const a = [];
    return t && (s += " INNER JOIN channel_accounts ca ON ca.id = c.channel_account_id AND ca.channel_type = ?", a.push(t)), s += " WHERE c.external_contact_id = ? ORDER BY c.last_message_at DESC", a.push(e), (await this.db.prepare(s).bind(...a).all()).results.map(Ee);
  }
  async countByChannel(e) {
    const t = await this.db.prepare("SELECT COUNT(*) as cnt FROM conversations WHERE channel_account_id = ?").bind(e).first();
    return (t == null ? void 0 : t.cnt) ?? 0;
  }
  async listByChannelWithFirstMessage(e, t = 50, s = 0) {
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
    ).bind(e, t, s).all()).results.map((r) => ({
      ...Ee(r),
      firstMessageRawPayload: r.first_message_raw_payload
    }));
  }
}
class jr {
  constructor(e, t, s) {
    this.conversations = e, this.messages = t, this.ai = s;
  }
  listOpenConversations() {
    return this.conversations.listOpen();
  }
  listResolvedConversations() {
    return this.conversations.listResolved();
  }
  async getConversation(e) {
    const t = await this.conversations.findById(e);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return t;
  }
  async receiveInboundMessage(e, t = {}) {
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
    const s = await this.conversations.findOrCreateByExternalThread({
      channelAccountId: e.channelAccount.id,
      externalContactId: e.inbound.externalContactId,
      externalThreadId: e.inbound.externalThreadId,
      contactName: e.inbound.contactName,
      contactAvatarUrl: e.inbound.contactAvatarUrl,
      isAnonymous: e.inbound.isAnonymous
    });
    s.status === "resolved" && await this.conversations.reopen(s.id);
    const a = await this.messages.createInbound({
      id: e.messageId,
      conversationId: s.id,
      channelAccountId: e.channelAccount.id,
      inbound: e.inbound
    }), r = a.message;
    if (!a.created)
      return {
        conversationId: r.conversationId,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !0
      };
    if (await this.conversations.touchAfterInbound(s.id, r.id, r.createdAt), t.createAiReply === !1)
      return {
        conversationId: s.id,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !1
      };
    const i = await this.createAiReply({
      conversationId: s.id,
      channelAccountId: e.channelAccount.id,
      messageContent: r.content,
      handoffStatus: s.handoffStatus
    });
    return {
      conversationId: s.id,
      inboundMessage: r,
      aiMessage: i,
      duplicate: !1
    };
  }
  async createAiReply(e) {
    try {
      const t = await this.ai.maybeCreateReply(e);
      return t && await this.conversations.touchAfterOutbound(e.conversationId, t.id, t.createdAt), t;
    } catch {
      return null;
    }
  }
  async setHandoff(e, t) {
    return await this.getConversation(e), await this.conversations.setHandoffStatus(e, t), this.getConversation(e);
  }
  async resolve(e) {
    return await this.getConversation(e), await this.conversations.resolve(e), this.getConversation(e);
  }
}
function xt(n) {
  return {
    id: n.id,
    conversationId: n.conversation_id,
    channelAccountId: n.channel_account_id,
    externalMessageId: n.external_message_id,
    direction: n.direction,
    senderType: n.sender_type,
    senderAdminUserId: n.sender_admin_user_id,
    clientMessageId: n.client_message_id,
    messageType: n.message_type,
    content: n.content,
    attachmentsJson: n.attachments_json,
    rawPayloadJson: n.raw_payload_json,
    aiMetadataJson: n.ai_metadata_json,
    aiReferencesJson: n.ai_references_json,
    status: n.status,
    errorMessage: n.error_message,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  };
}
function Dn(n) {
  if (!n) return [];
  try {
    const e = JSON.parse(n);
    return Array.isArray(e) ? e.filter(Fr) : [];
  } catch {
    return [];
  }
}
function Fr(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return e.type !== "image" && e.type !== "file" && e.type !== "audio" && e.type !== "video" ? !1 : Qe(e.url) && Qe(e.fileId) && Qe(e.r2Key) && Qe(e.mimeType) && Qe(e.fileName) && Ht(e.size) && Ht(e.width) && Ht(e.height) && Ht(e.durationMs) && Qe(e.thumbnailR2Key);
}
function Qe(n) {
  return n === void 0 || typeof n == "string";
}
function Ht(n) {
  return n === void 0 || typeof n == "number";
}
function _n(n, e, t, s, a) {
  const r = me(n.rawPayloadJson);
  return {
    id: n.id,
    conversationId: n.conversationId,
    direction: n.direction,
    senderType: n.senderType,
    messageType: n.messageType,
    content: n.content,
    attachments: Dn(n.attachmentsJson),
    status: n.status,
    createdAt: n.createdAt,
    contactName: e,
    externalContactId: t,
    avatarUrl: s ?? null,
    signature: a ?? null,
    likeCount: r.likeCount,
    likedBy: r.likedBy,
    quotedMessageId: r.quotedMessageId
  };
}
function me(n) {
  if (!n)
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  try {
    const e = JSON.parse(n);
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
function St(n) {
  var e;
  if (!n) return null;
  try {
    const t = JSON.parse(n);
    return typeof ((e = t == null ? void 0 : t.settings) == null ? void 0 : e.avatar_url) == "string" ? t.settings.avatar_url : null;
  } catch {
    return null;
  }
}
function qr(n) {
  var e;
  if (!n) return null;
  try {
    const t = JSON.parse(n);
    return typeof ((e = t == null ? void 0 : t.settings) == null ? void 0 : e.signature) == "string" ? t.settings.signature : null;
  } catch {
    return null;
  }
}
const os = 30 * 24 * 60 * 60;
class Wr {
  constructor(e, t, s, a, r, i, o, c, d, l) {
    this.channels = e, this.conversations = t, this.messages = s, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.endUserAuth = c, this.auth = d, this.tokenSecret = l;
  }
  async listTopics(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const s = e.limit ?? 50, a = e.offset ?? 0, [r, i] = await Promise.all([
      this.conversations.listByChannelWithFirstMessage(t.id, s, a),
      this.conversations.countByChannel(t.id)
    ]), o = [...new Set(r.map((u) => u.externalContactId).filter(Boolean))], c = await this.endUsers.findByIds(o), d = /* @__PURE__ */ new Map();
    for (const u of c)
      d.set(u.id, St(u.rawPayloadJson));
    let l = r.map((u) => {
      const m = Vt(u.firstMessageRawPayload), w = me(u.firstMessageRawPayload);
      return {
        id: u.id,
        conversationId: u.id,
        title: m,
        authorName: u.contactName ?? "匿名用户",
        authorId: u.externalContactId ?? "",
        avatarUrl: d.get(u.externalContactId ?? "") ?? null,
        category: w.category ?? "综合讨论",
        messageCount: u.unreadCount,
        lastReplyAt: u.lastMessageAt ?? u.createdAt,
        createdAt: u.createdAt,
        tags: w.tags,
        isPinned: w.isPinned,
        isFeatured: w.isFeatured,
        likeCount: w.likeCount,
        likedBy: w.likedBy,
        visibility: w.visibility,
        isDeleted: w.forumDeleted,
        editedAt: w.forumEditedAt
      };
    });
    if (e.search) {
      const u = e.search.toLowerCase();
      l = l.filter(
        (m) => m.title.toLowerCase().includes(u) || m.authorName.toLowerCase().includes(u) || m.tags.some((w) => w.toLowerCase().includes(u))
      );
    }
    return e.tag && (l = l.filter((u) => u.tags.includes(e.tag))), e.category && (l = l.filter((u) => u.category === e.category)), e.sortBy === "replies" ? l.sort((u, m) => m.messageCount - u.messageCount) : e.sortBy === "hot" ? l.sort((u, m) => m.likeCount - u.likeCount || m.messageCount - u.messageCount) : l.sort((u, m) => u.isPinned !== m.isPinned ? u.isPinned ? -1 : 1 : new Date(m.lastReplyAt).getTime() - new Date(u.lastReplyAt).getTime()), { topics: l, total: i };
  }
  async createTopic(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const s = wn(e.visitorId), a = `forum:${s}:${H("forum_topic")}`, { contactName: r, externalContactId: i, isAnonymous: o } = await this.resolveEndUserIdentity(
      s,
      e.endUserToken
    );
    let c = null;
    if (!o && i)
      try {
        const u = await this.endUsers.findById(i);
        u && (c = St(u.rawPayloadJson));
      } catch {
      }
    const d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: t,
        inbound: {
          externalMessageId: a,
          externalContactId: i,
          externalThreadId: i,
          contactName: r,
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
          receivedAt: N()
        }
      },
      { createAiReply: !1 }
    ), l = await this.signForumToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: i,
      conversationId: d.conversationId,
      contactName: r,
      isAnonymous: o,
      exp: Math.floor(Date.now() / 1e3) + os
    });
    return {
      conversationId: d.conversationId,
      channelAccountId: t.id,
      visitorId: i,
      visitorToken: l,
      expiresAt: new Date(Date.now() + os * 1e3).toISOString(),
      message: _n(d.inboundMessage, r, i, c)
    };
  }
  async sendReply(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = wn(e.visitorId), r = `forum:${a}:${H("forum_reply")}`, { contactName: i, externalContactId: o, isAnonymous: c } = await this.resolveEndUserIdentity(
      a,
      e.endUserToken
    );
    let d = null;
    if (!c && o)
      try {
        const m = await this.endUsers.findById(o);
        m && (d = St(m.rawPayloadJson));
      } catch {
      }
    let l = e.content.trim();
    if (e.quotedMessageId) {
      const m = await this.messages.findById(e.quotedMessageId);
      if (m && m.conversationId === e.conversationId) {
        const w = t.contactName && t.contactName !== "匿名用户" ? t.contactName : `用户${(t.externalContactId ?? "").slice(-5)}`, P = (m.content ?? "").substring(0, 500).split(`
`);
        let U = P.length;
        for (let V = 0; V < P.length; V++)
          if (/^> @.+ 说：$/.test(P[V].trim())) {
            U = V;
            break;
          }
        const $ = P.slice(0, U), L = P.slice(U), F = [];
        if (!me(m.rawPayloadJson).quotedMessageId && $.length > 0) {
          const V = $[0].trim();
          V.startsWith("**") && V.endsWith("**") && ($.shift(), $.length > 0 && $[0].trim() === "" && $.shift());
        }
        F.push(l), F.push("");
        for (const V of $) F.push(V.trim() === "" ? ">" : `> ${V}`);
        F.push(`> @${w} 说：`);
        for (const V of L) F.push(`> ${V}`);
        l = F.join(`
`);
      }
    }
    const u = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: s,
        inbound: {
          externalMessageId: r,
          externalContactId: o,
          externalThreadId: t.externalThreadId ?? o,
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
          receivedAt: N()
        }
      },
      { createAiReply: !1 }
    );
    return u.duplicate || await this.realtime.notifyMessageCreated({
      conversation: t,
      message: u.inboundMessage
    }), {
      conversationId: u.conversationId,
      message: _n(u.inboundMessage, i, o, d),
      duplicate: u.duplicate
    };
  }
  async listMessages(e) {
    const t = await this.conversations.findById(e.conversationId), s = (t == null ? void 0 : t.contactName) ?? "论坛用户", a = (t == null ? void 0 : t.externalContactId) ?? "anonymous";
    let r = null, i = null;
    if (a && a !== "anonymous")
      try {
        const m = await this.endUsers.findById(a);
        m && (r = St(m.rawPayloadJson), i = qr(m.rawPayloadJson));
      } catch {
      }
    const o = await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ), c = o.length > 0 ? Vt(o[0].rawPayloadJson) : void 0, d = o.length > 0 ? me(o[0].rawPayloadJson).visibility : void 0, l = o.length > 0 ? me(o[0].rawPayloadJson).forumDeleted : !1, u = (t == null ? void 0 : t.externalContactId) ?? "";
    return {
      messages: o.map((m) => {
        let w = m.content;
        return w && (w = w.replace(/^\*\*.+?\*\*\n\n/, "")), _n({ ...m, content: w }, s, a, r, i);
      }),
      topicTitle: c,
      topicVisibility: d,
      isDeleted: l,
      topicAuthorId: u
    };
  }
  async likeTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = wn(e.visitorId), r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    const i = me(r.rawPayloadJson), o = i.likedBy.includes(a);
    let c, d;
    return o ? (c = Math.max(0, i.likeCount - 1), d = i.likedBy.filter((l) => l !== a)) : (c = i.likeCount + 1, d = [...i.likedBy, a]), await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumLikes: c,
      forumLikedBy: d
    }), { likeCount: c, liked: !o, likedBy: d };
  }
  async togglePin(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumPinned: e.pin
    }), { isPinned: e.pin };
  }
  async toggleFeatured(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumFeatured: e.feature
    }), { isFeatured: e.feature };
  }
  async deleteTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    if (me(a.rawPayloadJson), e.userRole !== "admin") {
      if (e.userRole !== "mediator") throw new f("FORBIDDEN", "You do not have permission to delete this topic", 403);
    }
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumDeleted: !0,
      forumDeletedBy: e.userId,
      forumDeletedAt: N()
    }), { success: !0 };
  }
  async updateTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new f("MESSAGE_NOT_FOUND", "First message not found", 404);
    const r = me(a.rawPayloadJson);
    if (r.forumDeleted)
      throw new f("TOPIC_DELETED", "Cannot edit a deleted topic", 400);
    if (e.userRole !== "admin") {
      if (e.userRole === "mediator")
        throw new f("FORBIDDEN", "Mediators cannot edit topics", 403);
      if (t.externalContactId !== e.userId)
        throw new f("FORBIDDEN", "You can only edit your own topics", 403);
    }
    const i = {};
    if (e.title !== void 0 && (i.forumTopicTitle = e.title), e.content !== void 0) {
      const o = e.title ? `**${e.title}**

${e.content.trim()}` : `**${r.forumTopicTitle || "无标题"}**

${e.content.trim()}`;
      await this.messages.updateContent(a.id, o), i.forumEditedAt = N();
    } else if (e.title !== void 0) {
      const o = a.content || "", c = o.indexOf(`

`), d = c >= 0 ? o.slice(c + 2) : o, l = `**${e.title}**

${d}`;
      await this.messages.updateContent(a.id, l), i.forumEditedAt = N();
    }
    return Object.keys(i).length > 0 && await this.updateMessageRawPayload(a.id, a.rawPayloadJson, i), { success: !0 };
  }
  async getUserProfile(e) {
    var l, u;
    const t = await this.conversations.listByExternalContact(e, "forum");
    if (t.length === 0) return null;
    const s = t[0].isAnonymous, a = t[0].contactName ?? "匿名用户";
    let r = 0, i = 0, o = null, c = null;
    if (!s)
      try {
        const m = await this.endUsers.findById(e);
        if (m != null && m.rawPayloadJson) {
          const w = JSON.parse(m.rawPayloadJson);
          typeof ((l = w == null ? void 0 : w.settings) == null ? void 0 : l.avatar_url) == "string" && (o = w.settings.avatar_url), typeof ((u = w == null ? void 0 : w.settings) == null ? void 0 : u.signature) == "string" && (c = w.settings.signature);
        }
      } catch {
      }
    const d = [];
    for (const m of t) {
      const w = await this.getFirstMessage(m.id), S = me((w == null ? void 0 : w.rawPayloadJson) ?? null);
      r += S.likeCount, i += Math.max(0, m.unreadCount - 1), w && d.push({
        id: m.id,
        conversationId: m.id,
        title: Vt(w.rawPayloadJson),
        authorName: m.contactName ?? "匿名用户",
        authorId: m.externalContactId ?? "",
        category: S.category,
        messageCount: m.unreadCount,
        lastReplyAt: m.lastMessageAt ?? m.createdAt,
        createdAt: m.createdAt,
        tags: S.tags,
        isPinned: S.isPinned,
        isFeatured: S.isFeatured,
        likeCount: S.likeCount,
        likedBy: S.likedBy,
        visibility: S.visibility,
        isDeleted: S.forumDeleted,
        editedAt: S.forumEditedAt
      });
    }
    return {
      externalContactId: e,
      displayName: a,
      isAnonymous: s,
      topicCount: t.length,
      replyCount: i,
      totalLikesReceived: r,
      joinedAt: t[t.length - 1].createdAt,
      avatarUrl: o,
      signature: c,
      recentTopics: d.sort(
        (m, w) => new Date(w.lastReplyAt).getTime() - new Date(m.lastReplyAt).getTime()
      )
    };
  }
  async getUserNotifications(e) {
    const t = await this.conversations.listByExternalContact(e, "forum"), s = [];
    for (const a of t) {
      const r = await this.getFirstMessage(a.id), i = Vt((r == null ? void 0 : r.rawPayloadJson) ?? null), o = Math.max(0, a.unreadCount - 1);
      s.push({
        topicId: a.id,
        topicTitle: i,
        replyCount: o,
        lastReplyAt: a.lastMessageAt ?? a.createdAt,
        lastReplyAuthor: a.contactName ?? "匿名用户",
        hasNewReplies: o > 0
      });
    }
    return s;
  }
  // ===== PM (Private Message) 方法 =====
  async createPMConversation(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const s = await this.endUsers.findById(e.currentUserId), a = await this.endUsers.findById(e.targetUserId);
    if (!s || !a)
      throw new f("USER_NOT_FOUND", "User not found", 404);
    const r = [e.currentUserId, e.targetUserId].sort(), i = `pm:${r[0]}::${r[1]}`, o = await this.conversations.findByExternalThread(t.id, i);
    return o ? { conversationId: o.id, isNew: !1 } : { conversationId: (await this.conversations.create({
      channelAccountId: t.id,
      externalContactId: e.currentUserId,
      externalThreadId: i,
      contactName: a.displayName || a.username,
      isAnonymous: !1
    })).id, isNew: !0 };
  }
  async listPMConversations(e) {
    const s = (await this.conversations.listByChannel(e.channelAccountId)).filter((r) => {
      var i;
      return (i = r.externalThreadId) == null ? void 0 : i.startsWith("pm:");
    }), a = [];
    for (const r of s) {
      const i = (r.externalThreadId ?? "").replace("pm:", "").split("::");
      if (!i.includes(e.currentUserId)) continue;
      const o = i.find((l) => l !== e.currentUserId) || "", c = await this.endUsers.findById(o);
      let d = null;
      if (r.lastMessageId) {
        const l = await this.messages.findById(r.lastMessageId);
        l && (d = l.content ? l.content.substring(0, 100) : "[媒体消息]");
      }
      a.push({
        id: r.id,
        contactName: (c == null ? void 0 : c.displayName) || (c == null ? void 0 : c.username) || "未知用户",
        contactId: o,
        lastMessage: d,
        lastMessageAt: r.lastMessageAt,
        isOnline: !1,
        unreadCount: r.unreadCount,
        avatarUrl: St((c == null ? void 0 : c.rawPayloadJson) ?? null)
      });
    }
    return a.sort((r, i) => r.lastMessageAt ? i.lastMessageAt ? new Date(i.lastMessageAt).getTime() - new Date(r.lastMessageAt).getTime() : -1 : 1), a;
  }
  async sendPMMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new f("USER_NOT_FOUND", "Sender not found", 404);
    const r = `pm:${a.id}:${H("pm_msg")}`, i = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: s,
        inbound: {
          externalMessageId: r,
          externalContactId: a.id,
          externalThreadId: t.externalThreadId,
          contactName: a.displayName || a.username,
          isAnonymous: !1,
          messageType: "text",
          content: e.content.trim(),
          attachments: [],
          rawPayload: {
            source: "pm"
          },
          receivedAt: N()
        }
      },
      { createAiReply: !1 }
    );
    if (!i.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: i.inboundMessage
      });
      const c = (t.externalThreadId ?? "").replace("pm:", "").split("::").find((d) => d !== e.senderUserId);
      c && await this.realtime.notifyEndUserMessage(c, {
        type: "pm_message.new",
        conversationId: t.id,
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
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const s = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(s);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new f("USER_NOT_FOUND", "Sender not found", 404);
    const r = e.clientMessageId ? `pm:${a.id}:${e.clientMessageId}` : `pm:${a.id}:${H("pm_msg")}`, i = await this.messages.findByExternalMessageId(s.id, r);
    if (i)
      return { message: i };
    const o = H("msg"), c = await this.media.storeUpload({
      conversationId: t.id,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: s,
        inbound: {
          externalMessageId: r,
          externalContactId: a.id,
          externalThreadId: t.externalThreadId,
          contactName: a.displayName || a.username,
          isAnonymous: !1,
          messageType: c.messageType,
          content: ((l = e.content) == null ? void 0 : l.trim()) || "",
          attachments: [c.attachment],
          rawPayload: {
            source: "pm"
          },
          receivedAt: N()
        },
        messageId: o
      },
      { createAiReply: !1 }
    );
    if (!d.duplicate) {
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: d.inboundMessage
      });
      const m = (t.externalThreadId ?? "").replace("pm:", "").split("::").find((w) => w !== e.senderUserId);
      m && await this.realtime.notifyEndUserMessage(m, {
        type: "pm_message.new",
        conversationId: t.id,
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
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return { messages: await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ) };
  }
  async requireConversationAccess(e, t) {
    const s = await this.conversations.findById(e);
    if (!s)
      throw new f("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const a = await this.channels.getAccount(s.channelAccountId);
    return this.assertForumChannel(a), {
      conversationId: s.id,
      visitorId: s.externalContactId ?? "anonymous"
    };
  }
  async resolveEndUserIdentity(e, t) {
    if (t) {
      const s = await this.endUserAuth.tryGetEndUser(`Bearer ${t}`);
      if (s)
        return {
          contactName: s.displayName || s.username,
          externalContactId: s.id,
          isAnonymous: !1
        };
      const a = await this.auth.tryGetAdminUser(`Bearer ${t}`);
      if (a)
        return {
          contactName: a.name || "Default Admin",
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
      throw new f("CHANNEL_NOT_FORUM", "Channel is not a forum channel", 400);
  }
  async getFirstMessage(e) {
    return this.messages.listByConversation(e, 1).then((t) => t[0] ?? null);
  }
  async updateMessageRawPayload(e, t, s) {
    let a = {};
    if (t)
      try {
        a = JSON.parse(t);
      } catch {
      }
    const r = { ...a, ...s };
    await this.messages.updateRawPayload(e, JSON.stringify(r));
  }
  async signForumToken(e) {
    const t = oe(JSON.stringify({ alg: "HS256", typ: "JWT" })), s = oe(JSON.stringify(e)), a = await ze(`${t}.${s}`, this.tokenSecret);
    return `${t}.${s}.${a}`;
  }
}
function wn(n) {
  const e = n.trim();
  return e ? e.length > 128 ? e.slice(0, 128) : e : "anonymous";
}
function Vt(n) {
  if (!n) return "无标题";
  try {
    const e = JSON.parse(n);
    if (e.forumTopicTitle && typeof e.forumTopicTitle == "string")
      return e.forumTopicTitle.trim();
  } catch {
  }
  return "无标题";
}
function vn(n) {
  return {
    id: n.id,
    title: n.title,
    sourceType: n.source_type,
    aiSearchInstanceId: n.ai_search_instance_id,
    aiSearchItemId: n.ai_search_item_id,
    aiSearchPath: n.ai_search_path,
    status: n.status,
    fileName: n.file_name,
    fileSize: n.file_size,
    mimeType: n.mime_type,
    checksum: n.checksum,
    metadataJson: n.metadata_json,
    errorMessage: n.error_message,
    createdByAdminUserId: n.created_by_admin_user_id,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    indexedAt: n.indexed_at,
    deletedAt: n.deleted_at
  };
}
class Hr {
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
    ).all()).results.map(vn);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM kb_documents WHERE id = ? AND deleted_at IS NULL LIMIT 1").bind(e).first();
    return t ? vn(t) : null;
  }
  async findByAiSearchItem(e, t) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE ai_search_instance_id = ?
          AND ai_search_item_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return s ? vn(s) : null;
  }
  async create(e) {
    const t = H("kb"), s = N();
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
      t,
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
      s,
      s,
      e.indexedAt ?? (e.status === "indexed" ? s : null)
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created knowledge document not found");
    return a;
  }
  async markDeleted(e) {
    const t = N();
    await this.db.prepare("UPDATE kb_documents SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async upsertFromAiSearchItem(e) {
    const t = await this.findByAiSearchItem(e.aiSearchInstanceId, e.aiSearchItemId), s = N();
    if (t) {
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
        s,
        e.indexedAt ?? (e.status === "indexed" ? t.indexedAt ?? s : t.indexedAt),
        t.id
      ).run();
      const i = await this.findById(t.id);
      if (!i) throw new Error("Updated knowledge document not found");
      return { document: i, action: "updated" };
    }
    const a = H("kb");
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
      a,
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
      s,
      s,
      e.indexedAt ?? (e.status === "indexed" ? s : null)
    ).run();
    const r = await this.findById(a);
    if (!r) throw new Error("Created knowledge document not found");
    return { document: r, action: "created" };
  }
}
function Be(n) {
  return JSON.stringify(n ?? null);
}
class Vr {
  constructor(e, t) {
    this.knowledge = e, this.aiSearch = t;
  }
  listDocuments() {
    return this.knowledge.list();
  }
  requireAiSearch() {
    if (!this.aiSearch)
      throw new f("AI_SEARCH_NOT_CONFIGURED", "AI Search is not configured", 503);
    return this.aiSearch;
  }
  async uploadDocument(e) {
    const t = this.requireAiSearch();
    if (e.file.size > Rr)
      throw new f("KNOWLEDGE_FILE_TOO_LARGE", "Knowledge file is larger than 4MB", 400);
    const s = H("kb"), a = e.file.name.replace(/[^\w.\-]+/g, "_"), r = `${Nr}${s}/${a}`, i = await zr(e.file), o = await this.uploadToAiSearch(t, r, i), c = await this.knowledge.create({
      title: e.title || e.file.name,
      aiSearchInstanceId: t.instanceName,
      aiSearchItemId: o.id,
      aiSearchPath: o.key || r,
      status: In(o.status),
      fileName: e.file.name,
      fileSize: e.file.size,
      mimeType: e.file.type || void 0,
      metadataJson: Be({ filename: e.file.name, source: "upload" }),
      indexedAt: In(o.status) === "indexed" ? o.last_seen_at ?? o.created_at : void 0,
      createdByAdminUserId: e.createdByAdminUserId
    });
    try {
      return await this.syncFromAiSearch(), await this.knowledge.findById(c.id) ?? c;
    } catch {
      return c;
    }
  }
  async uploadToAiSearch(e, t, s) {
    try {
      return await e.uploadDocument({ path: t, content: s });
    } catch (a) {
      throw new f(
        "KNOWLEDGE_UPLOAD_FAILED",
        `AI Search upload failed: ${a instanceof Error ? a.message : String(a)}`,
        502
      );
    }
  }
  async deleteDocument(e) {
    const t = this.requireAiSearch(), s = await this.knowledge.findById(e);
    if (!s)
      throw new f("KNOWLEDGE_DOCUMENT_NOT_FOUND", "Knowledge document not found", 404);
    s.aiSearchItemId && await t.deleteDocument(s.aiSearchItemId), await this.knowledge.markDeleted(e);
  }
  async syncFromAiSearch() {
    const e = this.requireAiSearch(), t = await e.listDocuments(), s = {
      instanceName: e.instanceName,
      scanned: t.length,
      created: 0,
      updated: 0,
      failed: 0
    };
    for (const a of t)
      try {
        const r = In(a.status), i = a.metadata ?? {}, o = Zt(i.filename) ?? Zr(a.key), c = await this.knowledge.upsertFromAiSearchItem({
          title: Zt(i.title) ?? o ?? a.key,
          aiSearchInstanceId: e.instanceName,
          aiSearchItemId: a.id,
          aiSearchPath: a.key,
          status: r,
          fileName: o,
          fileSize: a.file_size ?? 0,
          mimeType: Zt(i.mime_type) ?? Zt(i.content_type),
          metadataJson: Be({
            ...i,
            ai_search_source_id: a.source_id,
            ai_search_status: a.status,
            chunks_count: a.chunks_count,
            created_at: a.created_at,
            last_seen_at: a.last_seen_at
          }),
          errorMessage: r === "failed" ? `AI Search item status: ${a.status ?? "unknown"}` : void 0,
          indexedAt: r === "indexed" ? a.last_seen_at ?? a.created_at : void 0
        });
        c.action === "created" && (s.created += 1), c.action === "updated" && (s.updated += 1);
      } catch {
        s.failed += 1;
      }
    return s;
  }
}
function In(n) {
  switch (n) {
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
function Zt(n) {
  return typeof n == "string" && n.trim() ? n : void 0;
}
function Zr(n) {
  return n.split("/").filter(Boolean).at(-1) ?? n;
}
async function zr(n) {
  return Jr(n) ? n.text() : n.arrayBuffer();
}
function Jr(n) {
  const e = n.name.toLowerCase(), t = n.type.toLowerCase();
  return t.startsWith("text/") || t === "application/json" || t === "application/xml" || t === "application/x-yaml" || e.endsWith(".md") || e.endsWith(".mdx") || e.endsWith(".txt") || e.endsWith(".html") || e.endsWith(".htm") || e.endsWith(".json") || e.endsWith(".csv") || e.endsWith(".yaml") || e.endsWith(".yml");
}
const cs = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]), ds = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/quicktime"]);
class Gr {
  constructor(e, t) {
    this.bucket = e, this.messages = t;
  }
  async storeUpload(e) {
    var l;
    const t = this.requireBucket(), s = ((l = e.fileName) == null ? void 0 : l.trim()) || e.file.name || "upload", a = Kr(e.mimeType || e.file.type, s), r = Yr(a), i = r === "image" ? Or : Cr;
    if (e.file.size > i)
      throw new f(
        "MEDIA_FILE_TOO_LARGE",
        `${r === "image" ? "Image" : "Video"} file is too large`,
        400,
        { maxBytes: i }
      );
    const o = H("att"), c = Vs(s || o), d = `${kr}${e.conversationId}/${e.messageId}/${o}/${c}`;
    return await t.put(d, e.file.stream(), {
      httpMetadata: {
        contentType: a,
        contentDisposition: ls(s || c)
      },
      customMetadata: {
        conversationId: e.conversationId,
        messageId: e.messageId,
        attachmentId: o,
        fileName: s || c
      }
    }), {
      messageType: r,
      attachment: {
        type: r,
        r2Key: d,
        fileName: s || c,
        mimeType: a,
        size: e.file.size
      }
    };
  }
  async getMessageAttachmentResponse(e) {
    const t = await this.messages.findById(e.messageId);
    if (!t || t.conversationId !== e.conversationId)
      throw new f("MESSAGE_NOT_FOUND", "Message not found", 404);
    const s = Dn(t.attachmentsJson)[e.attachmentIndex];
    if (!s)
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment not found", 404);
    if (!s.r2Key) {
      if (s.url) return Response.redirect(s.url, 302);
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment is not stored in Supportly", 404);
    }
    const a = this.requireBucket(), r = e.request.headers.get("range"), i = await a.get(
      s.r2Key,
      r ? { range: e.request.headers } : void 0
    );
    if (!i)
      throw new f("ATTACHMENT_NOT_FOUND", "Attachment file not found", 404);
    const o = new Headers();
    if (i.writeHttpMetadata(o), o.set("etag", i.httpEtag), o.set("accept-ranges", "bytes"), o.set("cache-control", "private, max-age=300"), o.set("content-type", s.mimeType || o.get("content-type") || "application/octet-stream"), s.fileName && !o.has("content-disposition") && o.set("content-disposition", ls(s.fileName)), i.range) {
      const c = Qr(i.range, i.size);
      return o.set("content-range", `bytes ${c.start}-${c.end}/${i.size}`), o.set("content-length", String(c.length)), new Response(i.body, { status: 206, headers: o });
    }
    return o.set("content-length", String(i.size)), new Response(i.body, { headers: o });
  }
  requireBucket() {
    if (!this.bucket)
      throw new f("MEDIA_STORAGE_NOT_CONFIGURED", "Media storage is not configured", 500);
    return this.bucket;
  }
}
function Kr(n, e) {
  const t = n.trim().toLowerCase();
  if (t && t !== "application/octet-stream")
    return t;
  const s = Xr(e);
  if (!s)
    throw new f("MEDIA_MIME_TYPE_REQUIRED", "Media file type is required", 400);
  return s;
}
function Yr(n) {
  if (cs.has(n)) return "image";
  if (ds.has(n)) return "video";
  throw new f("MEDIA_TYPE_NOT_SUPPORTED", "Only image and video files are supported", 400, {
    allowedMimeTypes: [...cs, ...ds]
  });
}
function Vs(n) {
  return n.trim().replace(/[^\w.\-]+/g, "_").replace(/^_+|_+$/g, "") || "upload";
}
function Xr(n) {
  const e = n.toLowerCase();
  if (e.endsWith(".jpg") || e.endsWith(".jpeg")) return "image/jpeg";
  if (e.endsWith(".png")) return "image/png";
  if (e.endsWith(".gif")) return "image/gif";
  if (e.endsWith(".webp")) return "image/webp";
  if (e.endsWith(".mp4")) return "video/mp4";
  if (e.endsWith(".webm")) return "video/webm";
  if (e.endsWith(".mov") || e.endsWith(".qt")) return "video/quicktime";
}
function ls(n) {
  return `inline; filename="${Vs(n).replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(n)}`;
}
function Qr(n, e) {
  const t = n;
  if (typeof t.offset == "number" && typeof t.length == "number") {
    const r = t.offset, i = Math.min(e - 1, t.offset + t.length - 1);
    return { start: r, end: i, length: i - r + 1 };
  }
  if (typeof t.offset == "number" && typeof t.end == "number") {
    const r = t.offset, i = Math.min(e - 1, t.end);
    return { start: r, end: i, length: i - r + 1 };
  }
  const s = Math.min(e, t.suffix ?? e);
  return { start: Math.max(0, e - s), end: e - 1, length: s };
}
class ei {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM messages WHERE id = ? LIMIT 1").bind(e).first();
    return t ? xt(t) : null;
  }
  async findByExternalMessageId(e, t) {
    const s = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE channel_account_id = ?
          AND external_message_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return s ? xt(s) : null;
  }
  async findByClientMessageId(e) {
    const t = await this.db.prepare(
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
    return t ? xt(t) : null;
  }
  async listByConversation(e, t = 100) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT ?
        `
    ).bind(e, t).all()).results.map(xt);
  }
  async listByConversationAfter(e, t, s = 100) {
    if (!t)
      return this.listByConversation(e, s);
    const a = await this.findById(t);
    return !a || a.conversationId !== e ? [] : (await this.db.prepare(
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
    ).bind(e, a.createdAt, a.createdAt, a.id, s).all()).results.map(xt);
  }
  async createInbound(e) {
    const t = e.id ?? H("msg"), s = e.inbound.receivedAt || N();
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
      t,
      e.conversationId,
      e.channelAccountId,
      e.inbound.externalMessageId ?? null,
      e.inbound.messageType,
      e.inbound.content ?? null,
      Be(e.inbound.attachments),
      Be(e.inbound.rawPayload),
      s,
      s
    ).run();
    const a = await this.findById(t);
    if (a) return { message: a, created: !0 };
    if (e.inbound.externalMessageId) {
      const r = await this.findByExternalMessageId(e.channelAccountId, e.inbound.externalMessageId);
      if (r) return { message: r, created: !1 };
    }
    throw new Error("Created inbound message not found");
  }
  async createOutbound(e) {
    const t = e.id ?? H("msg"), s = N();
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
      t,
      e.conversationId,
      e.channelAccountId,
      e.senderType,
      e.senderAdminUserId ?? null,
      e.clientMessageId ?? null,
      e.messageType ?? "text",
      e.content,
      Be(e.attachments ?? []),
      Be(e.aiMetadata ?? {}),
      Be(e.aiReferences ?? []),
      e.status,
      s,
      s
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created outbound message not found");
    return a;
  }
  async updateRawPayload(e, t) {
    await this.db.prepare("UPDATE messages SET raw_payload_json = ? WHERE id = ?").bind(t, e).run();
  }
  async updateContent(e, t) {
    await this.db.prepare("UPDATE messages SET content = ?, updated_at = ? WHERE id = ?").bind(t, N(), e).run();
  }
  async markSent(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'sent',
            external_message_id = COALESCE(?, external_message_id),
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t ?? null, N(), e).run();
  }
  async markFailed(e, t) {
    await this.db.prepare(
      `
        UPDATE messages
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, N(), e).run();
  }
}
class ti {
  constructor(e, t, s, a, r) {
    this.channels = e, this.conversations = t, this.messages = s, this.realtime = a, this.media = r;
  }
  async listConversationMessages(e, t) {
    if (!await this.conversations.findById(e))
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return await this.conversations.markRead(e), this.messages.listByConversationAfter(e, t);
  }
  async sendAgentMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const i = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (i) return i;
    }
    const s = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(s), r = await this.messages.createOutbound({
      conversationId: t.id,
      channelAccountId: s.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      content: e.content,
      attachments: [],
      status: "sending"
    });
    try {
      const i = await a.sendMessage(s, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: r.id,
        messageType: "text",
        content: e.content,
        attachments: []
      });
      await this.messages.markSent(r.id, i.externalMessageId), await this.conversations.touchAfterOutbound(t.id, r.id, r.createdAt);
      const o = await this.messages.findById(r.id), c = await this.conversations.findById(t.id);
      return o && c && await this.realtime.notifyMessageCreated({
        conversation: c,
        message: o
      }), o ?? { ...r, status: "sent", externalMessageId: i.externalMessageId ?? null };
    } catch (i) {
      throw await this.messages.markFailed(r.id, i instanceof Error ? i.message : "Message send failed"), i;
    }
  }
  async sendAgentMediaMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const d = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (d) return d;
    }
    const s = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(s), r = H("msg"), i = await this.media.storeUpload({
      conversationId: t.id,
      messageId: r,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), o = ni(e.content), c = await this.messages.createOutbound({
      id: r,
      conversationId: t.id,
      channelAccountId: s.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      messageType: i.messageType,
      content: o,
      attachments: [i.attachment],
      status: "sending"
    });
    try {
      const d = await a.sendMessage(s, {
        conversationId: t.id,
        externalThreadId: t.externalThreadId,
        messageId: c.id,
        messageType: i.messageType,
        content: o,
        attachments: [i.attachment],
        fileData: await e.file.arrayBuffer(),
        fileName: e.fileName ?? e.file.name
      });
      await this.messages.markSent(c.id, d.externalMessageId), await this.conversations.touchAfterOutbound(t.id, c.id, c.createdAt);
      const l = await this.messages.findById(c.id), u = await this.conversations.findById(t.id);
      return l && u && await this.realtime.notifyMessageCreated({
        conversation: u,
        message: l
      }), l ?? { ...c, status: "sent", externalMessageId: d.externalMessageId ?? null };
    } catch (d) {
      throw await this.messages.markFailed(c.id, d instanceof Error ? d.message : "Message send failed"), d;
    }
  }
  markSent(e, t) {
    return this.messages.markSent(e, t);
  }
  markFailed(e, t) {
    return this.messages.markFailed(e, t);
  }
}
function ni(n) {
  const e = n == null ? void 0 : n.trim();
  return e || null;
}
function we(n, e) {
  return {
    id: n.id,
    conversationId: n.conversationId,
    direction: n.direction,
    senderType: n.senderType,
    messageType: n.messageType,
    content: n.content,
    attachments: Dn(n.attachmentsJson),
    status: n.status,
    createdAt: n.createdAt,
    externalMessageId: n.externalMessageId,
    avatarUrl: e ?? null
  };
}
const si = "admin", us = "end_user", An = "https://supportly.internal/__notify";
class ai {
  constructor(e) {
    this.env = e;
  }
  async notifyMessageCreated(e) {
    const t = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: we(e.message)
    }, s = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: e.message
    }, a = {
      type: "conversation.updated",
      conversation: e.conversation
    }, r = await Promise.allSettled([
      this.notifyVisitor(e.conversation.id, t),
      this.notifyAdmin(s),
      this.notifyAdmin(a)
    ]);
    for (const i of r)
      i.status === "rejected" && ie.warn("realtime_notify_failed", {
        conversationId: e.conversation.id,
        messageId: e.message.id,
        error: i.reason instanceof Error ? i.reason.message : String(i.reason)
      });
  }
  async notifyVisitor(e, t) {
    const s = this.env.VISITOR_STREAM.idFromName(e), a = this.env.VISITOR_STREAM.get(s);
    await this.notify(a, t);
  }
  async notifyAdmin(e) {
    const t = this.env.ADMIN_STREAM.idFromName(si), s = this.env.ADMIN_STREAM.get(t);
    await this.notify(s, e);
  }
  async notifyEndUserPresence() {
    try {
      const e = this.env.END_USER_STREAM.idFromName(us);
      await this.env.END_USER_STREAM.get(e).fetch(An, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "refresh_presence" })
      });
    } catch {
    }
  }
  async notifyEndUserMessage(e, t) {
    try {
      const s = this.env.END_USER_STREAM.idFromName(us);
      await this.env.END_USER_STREAM.get(s).fetch(An, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "message.new", targetUserId: e, payload: t })
      });
    } catch {
    }
  }
  async notify(e, t) {
    const s = await e.fetch(An, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(t)
    });
    if (!s.ok)
      throw new Error(`Realtime notify failed with status ${s.status}`);
  }
}
function hs(n) {
  return {
    id: n.id,
    email: n.email,
    name: n.name,
    passwordHash: n.password_hash,
    role: n.role,
    status: n.status,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  };
}
class ri {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? hs(t) : null;
  }
  async findByEmail(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE lower(email) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? hs(t) : null;
  }
}
const ii = 60 * 60 * 24 * 7;
class oi {
  constructor(e, t) {
    this.adminUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const s = await this.adminUsers.findByEmail(e), a = s ? await On(t, s.passwordHash) : !1;
    if (!s || !a)
      throw new f("INVALID_CREDENTIALS", "Invalid email or password", 401);
    const r = Math.floor(Date.now() / 1e3) + ii;
    return {
      token: await this.signToken({
        sub: s.id,
        email: s.email,
        name: s.name,
        role: s.role,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      adminUser: di(s)
    };
  }
  async requireAdminUser(e) {
    const t = ci(e.authorization);
    if (t) {
      const a = await this.verifyToken(t), r = await this.adminUsers.findById(a.sub);
      if (!r)
        throw new f("UNAUTHORIZED", "Admin user not found", 401);
      return r;
    }
    if (!e.adminUserId)
      throw new f("UNAUTHORIZED", "Missing admin user", 401);
    const s = await this.adminUsers.findById(e.adminUserId);
    if (!s)
      throw new f("UNAUTHORIZED", "Admin user not found", 401);
    return s;
  }
  async tryGetAdminUser(e) {
    try {
      return await this.requireAdminUser({ authorization: e });
    } catch {
      return null;
    }
  }
  async signToken(e) {
    const t = oe(JSON.stringify({ alg: "HS256", typ: "JWT" })), s = oe(JSON.stringify(e)), a = await ze(this.jwtSecret, `${t}.${s}`);
    return `${t}.${s}.${a}`;
  }
  async verifyToken(e) {
    const [t, s, a] = e.split(".");
    if (!t || !s || !a)
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await ze(this.jwtSecret, `${t}.${s}`);
    if (!wt(a, r))
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Un(s));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new f("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function ci(n) {
  if (!n) return null;
  const [e, t] = n.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function di(n) {
  return {
    id: n.id,
    email: n.email,
    name: n.name,
    role: n.role
  };
}
function Nt(n) {
  return {
    id: n.id,
    username: n.username,
    email: n.email,
    passwordHash: n.password_hash,
    displayName: n.display_name,
    status: n.status,
    rawPayloadJson: n.raw_payload_json,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  };
}
class li {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? Nt(t) : null;
  }
  async findByIds(e) {
    if (e.length === 0) return [];
    const t = e.map(() => "?").join(",");
    return (await this.db.prepare(`SELECT * FROM end_users WHERE id IN (${t}) AND status = 'active'`).bind(...e).all()).results.map(Nt);
  }
  async findByUsername(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? Nt(t) : null;
  }
  async findByUsernameAny(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) LIMIT 1").bind(e).first();
    return t ? Nt(t) : null;
  }
  async listAll() {
    return (await this.db.prepare("SELECT * FROM end_users ORDER BY created_at DESC LIMIT 200").all()).results.map(Nt);
  }
  async approve(e) {
    const t = N();
    return await this.db.prepare("UPDATE end_users SET status = 'active', updated_at = ? WHERE id = ? AND status = 'pending'").bind(t, e).run(), this.findById(e);
  }
  async deactivate(e) {
    const t = N();
    await this.db.prepare("UPDATE end_users SET status = 'pending', updated_at = ? WHERE id = ?").bind(t, e).run();
  }
  async anonymizeConversations(e) {
    const t = N();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 1, contact_name = '匿名访客', updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, e).run();
  }
  async restoreConversations(e, t) {
    const s = N();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 0, contact_name = ?, updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, s, e).run();
  }
  async getConversationCounts() {
    const e = await this.db.prepare("SELECT external_contact_id, COUNT(*) as count FROM conversations GROUP BY external_contact_id").all();
    return new Map(e.results.map((t) => [t.external_contact_id, t.count]));
  }
  async create(e) {
    var i;
    const t = H("eu"), s = await qs(e.password), a = N(), r = ((i = e.displayName) == null ? void 0 : i.trim()) || e.username;
    return await this.db.prepare(
      "INSERT INTO end_users (id, username, email, password_hash, display_name, status, raw_payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)"
    ).bind(t, e.username, e.email ?? null, s, r, null, a, a).run(), {
      id: t,
      username: e.username,
      email: e.email ?? null,
      displayName: r,
      passwordHash: s,
      status: "pending",
      rawPayloadJson: null,
      createdAt: a,
      updatedAt: a
    };
  }
  async updateRawPayload(e, t) {
    const s = N();
    await this.db.prepare("UPDATE end_users SET raw_payload_json = ?, updated_at = ? WHERE id = ?").bind(t, s, e).run();
  }
  async updatePassword(e, t) {
    const s = N();
    await this.db.prepare("UPDATE end_users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(t, s, e).run();
  }
  async updateDisplayName(e, t) {
    const s = N();
    await this.db.prepare("UPDATE end_users SET display_name = ?, updated_at = ? WHERE id = ?").bind(t, s, e).run();
  }
}
const ui = 60 * 60 * 24 * 7;
class hi {
  constructor(e, t) {
    this.endUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const s = await this.endUsers.findByUsername(e), a = s ? await On(t, s.passwordHash) : !1;
    if (!s || !a)
      throw new f("INVALID_CREDENTIALS", "Invalid username or password", 401);
    const r = Math.floor(Date.now() / 1e3) + ui;
    return {
      token: await this.signToken({
        sub: s.id,
        username: s.username,
        displayName: s.displayName,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      user: zt(s)
    };
  }
  async register(e) {
    if (await this.endUsers.findByUsernameAny(e.username))
      throw new f("USERNAME_TAKEN", "Username is already taken", 409);
    const s = await this.endUsers.create(e);
    return zt(s);
  }
  async listUsers() {
    const [e, t] = await Promise.all([
      this.endUsers.listAll(),
      this.endUsers.getConversationCounts()
    ]);
    return e.map((s) => ({
      ...zt(s),
      conversationCount: t.get(s.id) ?? 0
    }));
  }
  async approveUser(e) {
    const t = await this.endUsers.approve(e);
    if (!t)
      throw new f("END_USER_NOT_FOUND", "End user not found or already approved", 404);
    return await this.endUsers.restoreConversations(t.id, t.displayName), zt(t);
  }
  async deactivateUser(e) {
    await this.endUsers.anonymizeConversations(e), await this.endUsers.deactivate(e);
  }
  async requireEndUser(e) {
    const t = fi(e);
    if (!t)
      throw new f("UNAUTHORIZED", "Missing auth token", 401);
    const s = await this.verifyToken(t), a = await this.endUsers.findById(s.sub);
    if (!a)
      throw new f("UNAUTHORIZED", "End user not found", 401);
    return a;
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
    const t = await this.endUsers.findById(e);
    if (!t)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    let s = {};
    if (t.rawPayloadJson)
      try {
        s = JSON.parse(t.rawPayloadJson);
      } catch {
      }
    return {
      id: t.id,
      username: t.username,
      displayName: t.displayName,
      email: t.email,
      settings: s.settings || {},
      isMediator: s.is_mediator === !0
    };
  }
  async updateSettings(e, t) {
    const s = await this.endUsers.findById(e);
    if (!s)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    let a = {};
    if (s.rawPayloadJson)
      try {
        a = JSON.parse(s.rawPayloadJson);
      } catch {
      }
    a.settings = { ...a.settings || {}, ...t }, await this.endUsers.updateRawPayload(e, JSON.stringify(a));
  }
  async changePassword(e, t, s) {
    const a = await this.endUsers.findById(e);
    if (!a)
      throw new f("END_USER_NOT_FOUND", "End user not found", 404);
    if (!await On(t, a.passwordHash))
      throw new f("INVALID_PASSWORD", "Current password is incorrect", 400);
    const i = await qs(s);
    await this.endUsers.updatePassword(e, i);
  }
  async updateDisplayName(e, t) {
    await this.endUsers.updateDisplayName(e, t);
  }
  async signToken(e) {
    const t = oe(JSON.stringify({ alg: "HS256", typ: "JWT" })), s = oe(JSON.stringify(e)), a = await ze(this.jwtSecret, `${t}.${s}`);
    return `${t}.${s}.${a}`;
  }
  async verifyToken(e) {
    const [t, s, a] = e.split(".");
    if (!t || !s || !a)
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await ze(this.jwtSecret, `${t}.${s}`);
    if (!wt(a, r))
      throw new f("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Un(s));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new f("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function fi(n) {
  if (!n) return null;
  const [e, t] = n.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function zt(n) {
  return {
    id: n.id,
    username: n.username,
    displayName: n.displayName,
    email: n.email,
    status: n.status,
    createdAt: n.createdAt
  };
}
const mi = 30 * 24 * 60 * 60;
class pi {
  constructor(e, t, s, a, r, i, o, c) {
    this.channels = e, this.conversations = t, this.messages = s, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.tokenSecret = c;
  }
  async createSession(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertWebChatChannel(t);
    const s = gi(e.visitorId), a = !!(e.endUserId && e.endUserName), r = a ? `${e.endUserId}` : s, i = Math.floor(Date.now() / 1e3) + mi, o = await this.signToken({
      version: 1,
      channelAccountId: t.id,
      visitorId: r,
      contactName: a ? e.endUserName : "匿名访客",
      isAnonymous: !a,
      exp: i
    }), c = await this.conversations.findLatestByExternalContact(t.id, r);
    return {
      conversationId: (c == null ? void 0 : c.id) ?? "",
      channelAccountId: t.id,
      visitorId: r,
      visitorToken: o,
      expiresAt: new Date(i * 1e3).toISOString()
    };
  }
  async sendVisitorMediaMessage(e) {
    const { conversationId: t, claims: s } = await this.ensureConversation(e.token, e.conversationId || void 0), a = await this.channels.getAccount(s.channelAccountId), r = e.clientMessageId ? `widget:${s.visitorId}:${e.clientMessageId}` : H("widget_evt"), i = await this.messages.findByExternalMessageId(a.id, r);
    if (i)
      return {
        conversationId: i.conversationId,
        inboundMessage: we(i),
        aiMessage: null,
        duplicate: !0
      };
    const o = H("msg"), c = await this.media.storeUpload({
      conversationId: t,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage({
      channelAccount: a,
      inbound: {
        externalMessageId: r,
        externalContactId: s.visitorId,
        externalThreadId: s.visitorId,
        contactName: s.contactName,
        isAnonymous: s.isAnonymous,
        messageType: c.messageType,
        content: yi(e.content),
        attachments: [c.attachment],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: N()
      },
      messageId: o
    }, { createAiReply: !1 });
    return d.duplicate || await this.notifyVisitorMessageResult(d), {
      conversationId: d.conversationId,
      inboundMessage: we(d.inboundMessage),
      aiMessage: null,
      duplicate: d.duplicate
    };
  }
  async sendVisitorMessage(e, t = {}) {
    const { conversationId: s, claims: a } = await this.ensureConversation(e.token, e.conversationId || void 0), r = await this.channels.getAccount(a.channelAccountId), i = await this.conversationService.receiveInboundMessage({
      channelAccount: r,
      inbound: {
        externalMessageId: e.clientMessageId ? `widget:${a.visitorId}:${e.clientMessageId}` : H("widget_evt"),
        externalContactId: a.visitorId,
        externalThreadId: a.visitorId,
        contactName: a.contactName,
        isAnonymous: a.isAnonymous,
        messageType: "text",
        content: e.content.trim(),
        attachments: [],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: N()
      }
    }, { createAiReply: t.createAiReply });
    return i.aiMessage && await this.messages.markSent(i.aiMessage.id, i.aiMessage.id), t.notifyRealtime !== !1 && await this.notifyVisitorMessageResult(i), {
      conversationId: i.conversationId,
      inboundMessage: we(i.inboundMessage),
      aiMessage: i.aiMessage ? we({ ...i.aiMessage, status: "sent" }) : null,
      duplicate: i.duplicate
    };
  }
  async completeVisitorMessage(e) {
    try {
      const t = await this.conversations.findById(e.conversationId), s = await this.messages.findById(e.inboundMessageId);
      if (!t || !s || s.conversationId !== t.id) return;
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: s
      });
      const a = await this.conversationService.createAiReply({
        conversationId: t.id,
        channelAccountId: t.channelAccountId,
        messageContent: s.content,
        handoffStatus: t.handoffStatus
      });
      if (!a) return;
      await this.messages.markSent(a.id, a.id);
      const r = await this.conversations.findById(t.id) ?? t;
      await this.realtime.notifyMessageCreated({
        conversation: r,
        message: { ...a, status: "sent" }
      });
    } catch (t) {
      ie.warn("widget_message_background_failed", {
        conversationId: e.conversationId,
        inboundMessageId: e.inboundMessageId,
        error: t instanceof Error ? t.message : String(t)
      });
    }
  }
  async ensureConversation(e, t) {
    const s = await this.verifyToken(e), a = await this.channels.getAccount(s.channelAccountId);
    if (this.assertWebChatChannel(a), !s.isAnonymous && !await this.endUsers.findById(s.visitorId))
      throw new f("END_USER_NOT_FOUND", "End user not found", 401);
    if (t && t !== "_") {
      const i = await this.conversations.findById(t);
      if (!i)
        throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
      if (i.channelAccountId !== s.channelAccountId || i.externalContactId !== s.visitorId)
        throw new f("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
      return { conversationId: t, claims: s };
    }
    return { conversationId: (await this.conversations.findOrCreateByExternalThread({
      channelAccountId: a.id,
      externalContactId: s.visitorId,
      externalThreadId: s.visitorId,
      contactName: s.contactName,
      isAnonymous: s.isAnonymous
    })).id, claims: s };
  }
  async notifyVisitorMessageResult(e) {
    const t = e.duplicate ? null : await this.conversations.findById(e.conversationId);
    t && (await this.realtime.notifyMessageCreated({
      conversation: t,
      message: e.inboundMessage
    }), e.aiMessage && await this.realtime.notifyMessageCreated({
      conversation: t,
      message: { ...e.aiMessage, status: "sent" }
    }));
  }
  async listMessages(e) {
    return await this.verifyConversationAccess(e.conversationId, e.token), (await this.messages.listByConversationAfter(e.conversationId, e.afterMessageId, 100)).map(we);
  }
  requireConversationAccess(e, t) {
    return this.verifyConversationAccess(e, t);
  }
  assertWebChatChannel(e) {
    if (e.channelType !== "web_chat")
      throw new f("CHANNEL_NOT_WEB_CHAT", "Channel is not a Web Chat channel", 400);
    if (e.status !== "active")
      throw new f("CHANNEL_INACTIVE", "Channel is not active", 400);
  }
  async verifyConversationAccess(e, t) {
    const s = await this.verifyToken(t), a = await this.conversations.findById(e);
    if (!a)
      throw new f("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (a.channelAccountId !== s.channelAccountId || a.externalContactId !== s.visitorId || a.externalThreadId !== s.visitorId)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
    return s;
  }
  async signToken(e) {
    const t = oe(JSON.stringify(e)), s = await ze(this.tokenSecret, t);
    return `${t}.${s}`;
  }
  async verifyToken(e) {
    const [t, s] = e.split(".");
    if (!t || !s)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const a = await ze(this.tokenSecret, t);
    if (!wt(s, a))
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const r = JSON.parse(Un(t));
    if (!r.version || !r.channelAccountId || !r.visitorId || !r.contactName || r.isAnonymous === void 0 || !r.exp)
      throw new f("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    if (r.exp < Math.floor(Date.now() / 1e3))
      throw new f("VISITOR_TOKEN_EXPIRED", "Visitor token has expired", 401);
    return r;
  }
}
function gi(n) {
  const e = n.trim().slice(0, 128);
  if (!e)
    throw new f("VISITOR_ID_INVALID", "Visitor id cannot be empty", 400);
  return e;
}
function yi(n) {
  return (n == null ? void 0 : n.trim()) ?? "";
}
class _i {
  constructor(e) {
    this.channelService = e;
  }
  async notify(e) {
    const t = await this.channelService.getAccountByType("telegram");
    if (!(t != null && t.credentialCiphertext)) return;
    const s = t.externalAccountId;
    if (s)
      try {
        const a = await fetch(`https://api.telegram.org/bot${t.credentialCiphertext}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: s,
            text: e,
            parse_mode: "HTML",
            disable_web_page_preview: !0
          })
        });
        if (!a.ok) {
          const r = await a.text().catch(() => "");
          ie.warn("tg_notification_failed", {
            status: a.status,
            body: r.substring(0, 200)
          });
        }
      } catch (a) {
        ie.warn("tg_notification_error", {
          error: a instanceof Error ? a.message : String(a)
        });
      }
  }
}
function I(n) {
  const e = new mr([new gr(), new yr(), new Hs(), new Tr()]), t = new Lr(n.DB), s = new Br(n.DB), a = new ei(n.DB), r = new Hr(n.DB), i = new ri(n.DB), o = n.KB_INSTANCE_NAME ?? "supportly-dev";
  let c = null;
  if (n.AI_SEARCH)
    try {
      c = new xr(n.AI_SEARCH.get(o), o);
    } catch (X) {
      console.warn("ai_search_unavailable", X instanceof Error ? X.message : String(X));
    }
  const d = n.AI ? new Mr(n.AI, n) : null, l = new Pr(c, d, a), u = new $r(t, e), m = new jr(s, a, l), w = new ai(n), S = new Gr(n.MEDIA_BUCKET, a), P = new ti(
    u,
    s,
    a,
    w,
    S
  ), U = new Vr(r, c), $ = new oi(i, n.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"), L = new li(n.DB), F = new hi(
    L,
    n.END_USER_JWT_SECRET ?? "supportly-dev-enduser-secret-change-before-deploy"
  ), be = new pi(
    u,
    s,
    a,
    m,
    w,
    S,
    L,
    n.WIDGET_TOKEN_SECRET ?? n.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  ), V = new Wr(
    u,
    s,
    a,
    m,
    w,
    S,
    L,
    F,
    $,
    n.WIDGET_TOKEN_SECRET ?? n.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
  ), Ft = new _i(u);
  return {
    adapters: e,
    channels: u,
    conversations: m,
    messages: P,
    media: S,
    realtime: w,
    knowledge: U,
    auth: $,
    endUserAuth: F,
    widget: be,
    forum: V,
    notification: Ft
  };
}
function Ue() {
  return async (n, e) => {
    const t = n.req.header("x-admin-user-id"), s = n.req.header("authorization"), r = await I(n.env).auth.requireAdminUser({ adminUserId: t, authorization: s });
    n.set("adminUserId", r.id), n.set("adminUser", {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role
    }), await e();
  };
}
function b(n, e) {
  return Response.json({ data: n }, e);
}
function jt(n) {
  return b(n, { status: 201 });
}
function wi() {
  return new Response(null, { status: 204 });
}
const Je = new he();
Je.get("/ws", async (n) => {
  var o, c;
  vi(n.req.raw);
  const e = I(n.env), t = (o = n.req.query("token")) == null ? void 0 : o.trim(), s = await e.auth.requireAdminUser({
    adminUserId: ((c = n.req.query("adminUserId")) == null ? void 0 : c.trim()) || n.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : n.req.header("authorization")
  }), a = n.env.ADMIN_STREAM.idFromName("admin"), r = n.env.ADMIN_STREAM.get(a), i = Ii(n.req.raw, {
    "x-supportly-admin-user-id": s.id
  });
  return r.fetch(i);
});
Je.use("*", Ue());
Je.get("/", (n) => b({ ok: !0 }));
Je.get("/end-users", async (n) => {
  const e = I(n.env);
  return b(await e.endUserAuth.listUsers());
});
Je.post("/end-users/:id/approve", async (n) => {
  const e = I(n.env);
  return b(await e.endUserAuth.approveUser(n.req.param("id")));
});
Je.post("/end-users/:id/deactivate", async (n) => (await I(n.env).endUserAuth.deactivateUser(n.req.param("id")), b({ deactivated: !0 })));
function vi(n) {
  var e;
  if (((e = n.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function Ii(n, e) {
  const t = new URL(n.url);
  t.searchParams.delete("token"), t.searchParams.delete("adminUserId");
  const s = new Headers(n.headers);
  s.delete("authorization"), s.delete("x-admin-user-id");
  for (const [a, r] of Object.entries(e))
    s.set(a, r);
  return new Request(t.toString(), {
    method: n.method,
    headers: s
  });
}
const Ae = new he(), Ai = O({
  email: g().email(),
  password: g().min(1)
});
Ae.post("/login", async (n) => {
  const e = Ai.parse(await n.req.json()), t = I(n.env);
  return b(await t.auth.login(e.email, e.password));
});
Ae.get("/me", Ue(), (n) => b(n.get("adminUser")));
const bi = O({
  username: g().trim().min(2).max(50),
  password: g().min(6).max(128),
  email: g().email().optional(),
  displayName: g().trim().max(100).optional()
}), Ei = O({
  username: g().trim().min(1),
  password: g().min(1)
});
Ae.post("/end-user/register", async (n) => {
  const e = bi.parse(await n.req.json()), t = I(n.env);
  return b(await t.endUserAuth.register(e));
});
Ae.post("/end-user/login", async (n) => {
  const e = Ei.parse(await n.req.json()), t = I(n.env);
  return b(await t.endUserAuth.login(e.username, e.password));
});
Ae.get("/end-user/me", async (n) => {
  const t = await I(n.env).endUserAuth.requireEndUser(n.req.header("authorization"));
  return b({
    id: t.id,
    username: t.username,
    displayName: t.displayName,
    email: t.email,
    rawPayloadJson: t.rawPayloadJson
  });
});
const Ti = O({
  displayName: g().trim().max(100).optional(),
  oldPassword: g().min(1).optional(),
  newPassword: g().min(6).max(128).optional(),
  settings: Bs($s()).optional()
});
Ae.patch("/end-user/me", async (n) => {
  const e = Ti.parse(await n.req.json()), t = I(n.env), s = await t.endUserAuth.requireEndUser(n.req.header("authorization"));
  if (e.settings && await t.endUserAuth.updateSettings(s.id, e.settings), e.newPassword) {
    if (!e.oldPassword)
      throw new f("MISSING_OLD_PASSWORD", "Old password is required", 400);
    await t.endUserAuth.changePassword(s.id, e.oldPassword, e.newPassword);
  }
  return e.displayName && await t.endUserAuth.updateDisplayName(s.id, e.displayName), b({ success: !0 });
});
const Zs = "avatars/", xi = 2 * 1024 * 1024, Si = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
Ae.post("/end-user/avatar", async (n) => {
  const t = await I(n.env).endUserAuth.requireEndUser(n.req.header("authorization")), a = (await n.req.formData()).get("file");
  if (!Ni(a))
    throw new f("NO_FILE", "No file uploaded", 400);
  const r = (a.type || "image/png").toLowerCase();
  if (!Si.has(r))
    throw new f("INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, WebP images are allowed", 400);
  if (a.size > xi)
    throw new f("FILE_TOO_LARGE", "Avatar image must be under 2MB", 400);
  const i = n.env.MEDIA_BUCKET;
  if (!i)
    throw new f("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const o = `${Zs}${t.id}`;
  await i.put(o, a.stream(), {
    httpMetadata: { contentType: r, cacheControl: "no-cache" }
  });
  const c = `/api/auth/end-user/avatar/${t.id}`;
  return b({ avatarUrl: c });
});
Ae.get("/end-user/avatar/:userId", async (n) => {
  const e = n.env.MEDIA_BUCKET;
  if (!e)
    throw new f("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const t = n.req.param("userId"), s = `${Zs}${t}`, a = await e.get(s);
  if (!a)
    throw new f("AVATAR_NOT_FOUND", "Avatar not found", 404);
  const r = new Headers();
  return a.writeHttpMetadata(r), r.set("cache-control", "no-cache"), r.set("etag", a.httpEtag), new Response(a.body, { headers: r });
});
function Ni(n) {
  return typeof n == "object" && n !== null && "name" in n && "size" in n && "stream" in n;
}
const Ri = O({
  channelType: _t(["custom_webhook", "telegram", "whatsapp", "wechat", "web_chat", "forum"]),
  displayName: g().min(1),
  externalAccountId: g().optional(),
  credentialCiphertext: g().optional(),
  webhookSecretCiphertext: g().optional(),
  outboundUrl: g().url().optional()
}), ki = O({
  displayName: g().min(1).optional(),
  externalAccountId: g().optional().nullable(),
  credentialCiphertext: g().optional().nullable(),
  webhookSecretCiphertext: g().optional().nullable(),
  outboundUrl: g().url().optional().nullable()
}), zs = O({
  webhookUrl: g().url().optional(),
  dropPendingUpdates: Q().optional()
}), Ge = new he();
Ge.use("*", Ue());
Ge.get("/", async (n) => {
  const e = I(n.env);
  return b((await e.channels.listAccounts()).map(Pn));
});
Ge.post("/", async (n) => {
  const e = Ri.parse(await n.req.json()), t = I(n.env);
  return jt(Pn(await t.channels.createAccount(e)));
});
Ge.patch("/:id", async (n) => {
  const e = ki.parse(await n.req.json()), t = I(n.env);
  return b(Pn(await t.channels.updateAccount(n.req.param("id"), {
    displayName: e.displayName,
    externalAccountId: e.externalAccountId ?? void 0,
    credentialCiphertext: e.credentialCiphertext ?? void 0,
    webhookSecretCiphertext: e.webhookSecretCiphertext ?? void 0,
    outboundUrl: e.outboundUrl ?? void 0
  })));
});
Ge.post("/:id/telegram/set-webhook", async (n) => {
  const e = zs.parse(await n.req.json().catch(() => ({}))), t = I(n.env), s = await t.channels.getAccount(n.req.param("id")), a = Js(t.channels.getAdapter(s));
  return b(
    await a.setWebhook(s, {
      webhookUrl: e.webhookUrl ?? Gs(n.req.url, s.id),
      dropPendingUpdates: e.dropPendingUpdates
    })
  );
});
Ge.post("/:id/telegram/test", async (n) => {
  const e = zs.pick({ webhookUrl: !0 }).parse(await n.req.json().catch(() => ({}))), t = I(n.env), s = await t.channels.getAccount(n.req.param("id")), a = Js(t.channels.getAdapter(s));
  return b(await a.testConnection(s, e.webhookUrl ?? Gs(n.req.url, s.id)));
});
function Pn(n) {
  return {
    ...n,
    credentialCiphertext: null
  };
}
function Js(n) {
  if (n instanceof Hs) return n;
  throw new f("CHANNEL_NOT_TELEGRAM", "Channel is not a Telegram channel", 400);
}
function Gs(n, e) {
  return `${new URL(n).origin}/webhooks/${e}`;
}
const Oi = O({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().min(1)
}), Ci = O({
  status: _t(["bot", "agent"])
}), fe = new he();
fe.get("/:id/messages/:messageId/attachments/:index", async (n) => {
  var s, a;
  const e = I(n.env), t = (s = n.req.query("token")) == null ? void 0 : s.trim();
  return await e.auth.requireAdminUser({
    adminUserId: ((a = n.req.query("adminUserId")) == null ? void 0 : a.trim()) || n.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : n.req.header("authorization")
  }), e.media.getMessageAttachmentResponse({
    conversationId: n.req.param("id"),
    messageId: n.req.param("messageId"),
    attachmentIndex: Ui(n.req.param("index")),
    request: n.req.raw
  });
});
fe.use("*", Ue());
fe.get("/", async (n) => {
  const e = I(n.env);
  return n.req.query("status") === "resolved" ? b(await e.conversations.listResolvedConversations()) : b(await e.conversations.listOpenConversations());
});
fe.get("/:id", async (n) => {
  const e = I(n.env);
  return b(await e.conversations.getConversation(n.req.param("id")));
});
fe.get("/:id/messages", async (n) => {
  const e = I(n.env);
  return b(await e.messages.listConversationMessages(n.req.param("id"), n.req.query("after") || void 0));
});
fe.post("/:id/messages", async (n) => {
  const e = Oi.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.messages.sendAgentMessage({
      conversationId: n.req.param("id"),
      adminUserId: n.get("adminUserId"),
      clientMessageId: e.clientMessageId,
      content: e.content
    })
  );
});
fe.post("/:id/messages/media", async (n) => {
  const e = await n.req.formData(), t = e.get("file");
  if (!Mi(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const s = I(n.env);
  return b(
    await s.messages.sendAgentMediaMessage({
      conversationId: n.req.param("id"),
      adminUserId: n.get("adminUserId"),
      clientMessageId: Jt(e, "clientMessageId", 128),
      content: Jt(e, "content", 2e3),
      file: t,
      fileName: Jt(e, "fileName", 300),
      mimeType: Jt(e, "mimeType", 100)
    })
  );
});
fe.post("/:id/handoff", async (n) => {
  const e = Ci.parse(await n.req.json()), t = I(n.env);
  return b(await t.conversations.setHandoff(n.req.param("id"), e.status));
});
fe.post("/:id/resolve", async (n) => {
  const e = I(n.env);
  return b(await e.conversations.resolve(n.req.param("id")));
});
function Mi(n) {
  return typeof n == "object" && n !== null && "name" in n && "size" in n && "stream" in n;
}
function Jt(n, e, t) {
  const s = n.get(e);
  if (typeof s != "string") return;
  const a = s.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function Ui(n) {
  const e = Number(n);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
const Ks = new he();
Ks.get("/", (n) => n.json({ ok: !0 }));
const vt = new he();
vt.use("*", Ue());
function Di(n) {
  return typeof n == "object" && n !== null && "name" in n && "size" in n && "arrayBuffer" in n;
}
vt.get("/documents", async (n) => {
  const e = I(n.env);
  return b(await e.knowledge.listDocuments());
});
vt.post("/documents", async (n) => {
  const e = await n.req.formData(), t = e.get("file");
  if (!Di(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const s = e.get("title"), a = I(n.env);
  return jt(
    await a.knowledge.uploadDocument({
      file: t,
      title: typeof s == "string" ? s : void 0,
      createdByAdminUserId: n.get("adminUserId")
    })
  );
});
vt.post("/sync/ai-search", async (n) => {
  const e = I(n.env);
  return b(await e.knowledge.syncFromAiSearch());
});
vt.delete("/documents/:id", async (n) => (await I(n.env).knowledge.deleteDocument(n.req.param("id")), wi()));
const Ys = new he();
Ys.post("/:channelAccountId", async (n) => {
  try {
    const e = I(n.env), t = await e.channels.getAccount(n.req.param("channelAccountId")), s = e.channels.getAdapter(t);
    await s.verify(n.req.raw.clone(), t);
    const a = await e.channels.getAccountByType("telegram"), r = (a == null ? void 0 : a.externalAccountId) ?? void 0, i = await s.parseInbound(n.req.raw.clone(), t, r);
    let o = 0, c = 0, d = 0, l = 0, u = 0, m = 0;
    for (const S of i) {
      if (S.agentReply) {
        try {
          await e.messages.sendAgentMessage({
            conversationId: S.agentReply.replyToConversationId,
            content: S.content ?? ""
          }), u += 1;
        } catch (U) {
          m += 1, ie.warn("agent_reply_send_failed", {
            requestId: n.get("requestId"),
            conversationId: S.agentReply.replyToConversationId,
            error: U instanceof Error ? U.message : String(U)
          });
        }
        continue;
      }
      const P = await e.conversations.receiveInboundMessage({ channelAccount: t, inbound: S });
      if (P.duplicate)
        c += 1;
      else {
        o += 1;
        const $ = (S.messageType === "image" ? "[图片] " : "") + (S.content ?? "").substring(0, 300);
        n.executionCtx.waitUntil(
          e.notification.notify(
            `📩 <b>${t.channelType === "telegram" ? "Telegram" : "Webhook"} 新消息</b>
来自：${S.contactName}

${$}${(S.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${P.conversationId}`
          )
        );
      }
      if (P.aiMessage) {
        d += 1;
        try {
          const U = await s.sendMessage(t, {
            conversationId: P.conversationId,
            externalThreadId: S.externalThreadId,
            messageId: P.aiMessage.id,
            messageType: "text",
            content: P.aiMessage.content ?? ""
          });
          await e.messages.markSent(P.aiMessage.id, U.externalMessageId), ie.info("ai_reply_sent", {
            requestId: n.get("requestId"),
            conversationId: P.conversationId,
            messageId: P.aiMessage.id,
            externalMessageId: U.externalMessageId
          });
        } catch (U) {
          await e.messages.markFailed(
            P.aiMessage.id,
            U instanceof Error ? U.message : "AI reply send failed"
          ), l += 1, ie.warn("ai_reply_send_failed", {
            requestId: n.get("requestId"),
            conversationId: P.conversationId,
            messageId: P.aiMessage.id,
            error: U instanceof Error ? U.message : String(U)
          });
        }
      }
    }
    const w = {
      received: i.length,
      accepted: o,
      duplicates: c,
      aiReplies: d,
      aiReplySendFailures: l,
      agentReplies: u,
      agentReplySendFailures: m
    };
    return b(w);
  } catch (e) {
    const t = e instanceof Error ? e.message : String(e);
    return ie.error("webhook_unhandled_error", { message: t }), n.json({
      error: {
        code: "WEBHOOK_ERROR",
        message: t
      }
    }, 500);
  }
});
const Pi = O({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), Li = O({
  clientMessageId: g().trim().min(1).max(128).optional(),
  content: g().trim().min(1).max(2e3),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional()
}), Ke = new he();
Ke.get("/ws", async (n) => {
  var o;
  $i(n.req.raw);
  const e = (o = n.req.query("conversationId")) == null ? void 0 : o.trim();
  if (!e)
    throw new f("CONVERSATION_ID_REQUIRED", "Conversation id is required", 400);
  const s = await I(n.env).widget.requireConversationAccess(e, Xs(n.req.raw, n.req.query("token"))), a = n.env.VISITOR_STREAM.idFromName(e), r = n.env.VISITOR_STREAM.get(a), i = Fi(n.req.raw, {
    "x-supportly-conversation-id": e,
    "x-supportly-visitor-id": s.visitorId
  });
  return r.fetch(i);
});
Ke.post("/conversations", async (n) => {
  const e = Pi.parse(await n.req.json()), t = I(n.env), s = n.req.header("authorization"), a = s ? await t.endUserAuth.requireEndUser(s) : null;
  return jt(await t.widget.createSession({
    ...e,
    endUserId: a == null ? void 0 : a.id,
    endUserName: a == null ? void 0 : a.displayName
  }));
});
Ke.post("/conversations/:conversationId/messages", async (n) => {
  const e = Li.parse(await n.req.json()), t = I(n.env), s = await t.widget.sendVisitorMessage(
    {
      conversationId: n.req.param("conversationId"),
      token: un(n.req.raw),
      clientMessageId: e.clientMessageId,
      content: e.content,
      pageUrl: e.pageUrl,
      pageTitle: e.pageTitle
    },
    { createAiReply: !1, notifyRealtime: !1 }
  );
  if (!s.duplicate) {
    n.executionCtx.waitUntil(
      t.widget.completeVisitorMessage({
        conversationId: s.conversationId,
        inboundMessageId: s.inboundMessage.id
      })
    );
    const a = (s.inboundMessage.content ?? "").substring(0, 500);
    n.executionCtx.waitUntil(
      t.notification.notify(`💬 <b>Web Chat 新消息</b>

${a}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${s.conversationId}`)
    );
  }
  return b(s);
});
Ke.post("/conversations/:conversationId/messages/media", async (n) => {
  const e = await n.req.formData(), t = e.get("file");
  if (!Bi(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const a = await I(n.env).widget.sendVisitorMediaMessage({
    conversationId: n.req.param("conversationId"),
    token: un(n.req.raw),
    clientMessageId: et(e, "clientMessageId", 128),
    content: et(e, "content", 2e3),
    file: t,
    fileName: et(e, "fileName", 300),
    mimeType: et(e, "mimeType", 100),
    pageUrl: et(e, "pageUrl", 2048),
    pageTitle: et(e, "pageTitle", 300)
  });
  return b(a);
});
Ke.get("/conversations/:conversationId/messages", async (n) => {
  const e = I(n.env), t = n.req.param("conversationId");
  return b(!t || t === "_" ? { messages: [] } : {
    messages: await e.widget.listMessages({
      conversationId: t,
      token: un(n.req.raw),
      afterMessageId: n.req.query("after") || void 0
    })
  });
});
Ke.get("/conversations/:conversationId/messages/:messageId/attachments/:index", async (n) => {
  const e = I(n.env), t = n.req.param("conversationId");
  return await e.widget.requireConversationAccess(t, Xs(n.req.raw, n.req.query("token"))), e.media.getMessageAttachmentResponse({
    conversationId: t,
    messageId: n.req.param("messageId"),
    attachmentIndex: ji(n.req.param("index")),
    request: n.req.raw
  });
});
function un(n) {
  const e = n.headers.get("authorization"), t = "Bearer ";
  if (!(e != null && e.startsWith(t)))
    throw new f("VISITOR_TOKEN_REQUIRED", "Visitor token is required", 401);
  return e.slice(t.length).trim();
}
function Xs(n, e) {
  return e != null && e.trim() ? e.trim() : un(n);
}
function $i(n) {
  var e;
  if (((e = n.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function Bi(n) {
  return typeof n == "object" && n !== null && "name" in n && "size" in n && "stream" in n;
}
function et(n, e, t) {
  const s = n.get(e);
  if (typeof s != "string") return;
  const a = s.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function ji(n) {
  const e = Number(n);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function Fi(n, e) {
  const t = new URL(n.url);
  t.searchParams.delete("token");
  const s = new Headers(n.headers);
  s.delete("authorization");
  for (const [a, r] of Object.entries(e))
    s.set(a, r);
  return new Request(t.toString(), {
    method: n.method,
    headers: s
  });
}
const qi = O({
  channelAccountId: g().min(1),
  visitorId: g().min(1).max(128),
  title: g().trim().min(1).max(200),
  content: g().trim().min(1).max(5e4),
  category: g().max(30).optional(),
  tags: ln(g().max(30)).max(5).optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional(),
  visibility: _t(["public", "login_required"]).optional()
}), Wi = O({
  visitorId: g().min(1).max(128),
  content: g().trim().min(1).max(5e4),
  quotedMessageId: g().optional(),
  pageUrl: g().max(2048).optional(),
  pageTitle: g().max(300).optional(),
  endUserToken: g().optional()
}), Hi = O({
  visitorId: g().min(1).max(128)
}), Vi = O({
  pin: Q()
}), Zi = O({
  feature: Q()
}), B = new he();
B.get("/config", async (n) => {
  const e = n.env.FORUM_CHANNEL_ID;
  if (!e)
    throw new f("FORUM_NOT_FOUND", "FORUM_CHANNEL_ID not configured", 404);
  return b({
    channelId: e,
    title: n.env.FORUM_TITLE || "社区论坛",
    primaryColor: n.env.FORUM_PRIMARY_COLOR || "#2563eb",
    categories: (n.env.FORUM_CATEGORIES || "综合讨论,技术交流,问题反馈,资源分享,公告通知").split(",").map((t) => t.trim()),
    widgetChannelId: n.env.WIDGET_CHANNEL_ID,
    widgetTitle: n.env.WIDGET_TITLE,
    widgetMode: n.env.WIDGET_MODE || "chat"
  });
});
B.get("/admin/check", Ue(), async (n) => b({ isAdmin: !0 }));
const zi = O({
  account: g().min(1),
  password: g().min(1)
});
B.post("/login", async (n) => {
  const e = zi.parse(await n.req.json()), t = I(n.env);
  try {
    const s = await t.auth.login(e.account, e.password);
    return b({ ...s, authType: "admin" });
  } catch {
    const s = await t.endUserAuth.login(e.account, e.password);
    return b({ ...s, authType: "end_user" });
  }
});
B.get("/channels/:channelAccountId/topics", async (n) => {
  const e = I(n.env), t = fs(n.req.query("limit"), 50), s = fs(n.req.query("offset"), 0);
  return b(
    await e.forum.listTopics({
      channelAccountId: n.req.param("channelAccountId"),
      limit: t,
      offset: s,
      search: n.req.query("search") || void 0,
      sortBy: n.req.query("sort") || void 0,
      tag: n.req.query("tag") || void 0,
      category: n.req.query("category") || void 0
    })
  );
});
B.post("/channels/:channelAccountId/topics", async (n) => {
  const e = qi.parse(await n.req.json()), t = I(n.env), s = await t.forum.createTopic(e), a = e.content.substring(0, 300);
  return n.executionCtx.waitUntil(
    t.notification.notify(
      `📝 <b>论坛新帖</b>
标题：${e.title}
作者：${s.message.contactName}

${a}${e.content.length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${s.message.conversationId}`
    )
  ), jt(s);
});
B.post("/topics/:conversationId/replies", async (n) => {
  const e = Wi.parse(await n.req.json()), t = I(n.env), s = await t.forum.sendReply({
    conversationId: n.req.param("conversationId"),
    ...e
  });
  if (!s.duplicate) {
    const a = (s.message.content ?? "").substring(0, 300);
    n.executionCtx.waitUntil(
      t.notification.notify(
        `💬 <b>论坛新回复</b>
作者：${s.message.contactName}

${a}${(s.message.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${s.message.conversationId}`
      )
    );
  }
  return jt(s);
});
B.get("/topics/:conversationId/messages", async (n) => {
  const e = I(n.env), t = n.req.param("conversationId");
  return b(!t || t === "_" ? { messages: [] } : await e.forum.listMessages({
    conversationId: t,
    afterMessageId: n.req.query("after") || void 0
  }));
});
B.post("/topics/:conversationId/like", async (n) => {
  const e = Hi.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.forum.likeTopic({
      conversationId: n.req.param("conversationId"),
      visitorId: e.visitorId
    })
  );
});
B.post("/topics/:conversationId/pin", Ue(), async (n) => {
  const e = Vi.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.forum.togglePin({
      conversationId: n.req.param("conversationId"),
      pin: e.pin
    })
  );
});
B.post("/topics/:conversationId/feature", Ue(), async (n) => {
  const e = Zi.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.forum.toggleFeatured({
      conversationId: n.req.param("conversationId"),
      feature: e.feature
    })
  );
});
const Ji = O({
  userId: g().min(1),
  userRole: _t(["admin", "mediator", "member"])
});
B.delete("/topics/:conversationId", async (n) => {
  const e = Ji.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.forum.deleteTopic({
      conversationId: n.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole
    })
  );
});
const Gi = O({
  userId: g().min(1),
  userRole: _t(["admin", "mediator", "member"]),
  title: g().trim().min(1).max(200).optional(),
  content: g().trim().min(1).max(5e4).optional()
});
B.patch("/topics/:conversationId", async (n) => {
  const e = Gi.parse(await n.req.json()), t = I(n.env);
  return b(
    await t.forum.updateTopic({
      conversationId: n.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole,
      title: e.title,
      content: e.content
    })
  );
});
B.get("/users/:externalContactId/profile", async (n) => {
  const t = await I(n.env).forum.getUserProfile(
    n.req.param("externalContactId")
  );
  return b(t);
});
B.get("/users/:externalContactId/notifications", async (n) => {
  const e = I(n.env);
  return b(
    await e.forum.getUserNotifications(
      n.req.param("externalContactId")
    )
  );
});
const Ki = O({
  channelAccountId: g().min(1),
  targetUserId: g().min(1)
}), Yi = O({
  content: g().trim().min(1).max(5e4)
});
B.post("/pm/conversations", async (n) => {
  const e = Ki.parse(await n.req.json()), t = I(n.env), s = await t.endUserAuth.requireEndUser(n.req.header("authorization"));
  return b(
    await t.forum.createPMConversation({
      channelAccountId: e.channelAccountId,
      currentUserId: s.id,
      targetUserId: e.targetUserId
    })
  );
});
B.get("/pm/conversations", async (n) => {
  const e = I(n.env), t = n.req.query("channelAccountId");
  if (!t)
    throw new f("MISSING_PARAM", "channelAccountId is required", 400);
  const s = await e.endUserAuth.requireEndUser(n.req.header("authorization"));
  return b(
    await e.forum.listPMConversations({
      channelAccountId: t,
      currentUserId: s.id
    })
  );
});
B.post("/pm/conversations/:conversationId/messages", async (n) => {
  const e = Yi.parse(await n.req.json()), t = I(n.env), s = await t.endUserAuth.requireEndUser(n.req.header("authorization")), a = await t.forum.sendPMMessage({
    conversationId: n.req.param("conversationId"),
    senderUserId: s.id,
    content: e.content
  }), r = getAvatarUrlFromRawPayload(s.rawPayloadJson);
  return b({ message: we(a.message, r) });
});
B.post("/pm/conversations/:conversationId/messages/media", async (n) => {
  const e = await n.req.formData(), t = e.get("file");
  if (!Qi(t))
    throw new f("VALIDATION_ERROR", "file is required", 400);
  const s = I(n.env), a = await s.endUserAuth.requireEndUser(n.req.header("authorization")), r = await s.forum.sendPMMediaMessage({
    conversationId: n.req.param("conversationId"),
    senderUserId: a.id,
    clientMessageId: Gt(e, "clientMessageId", 128),
    content: Gt(e, "content", 2e3),
    file: t,
    fileName: Gt(e, "fileName", 300),
    mimeType: Gt(e, "mimeType", 100)
  }), i = getAvatarUrlFromRawPayload(a.rawPayloadJson);
  return b({ message: we(r.message, i) });
});
B.get("/pm/conversations/:conversationId/messages", async (n) => {
  const e = I(n.env);
  await e.endUserAuth.requireEndUser(n.req.header("authorization"));
  const t = await e.forum.listPMMessages({
    conversationId: n.req.param("conversationId"),
    afterMessageId: n.req.query("after") || void 0
  });
  return b({ messages: t.messages.map(we) });
});
B.get("/pm/conversations/:conversationId/messages/:messageId/attachments/:index", async (n) => I(n.env).media.getMessageAttachmentResponse({
  conversationId: n.req.param("conversationId"),
  messageId: n.req.param("messageId"),
  attachmentIndex: Xi(n.req.param("index")),
  request: n.req.raw
}));
B.get("/ws", async (n) => {
  var d;
  const e = n.req.query("token");
  if (!e)
    throw new f("MISSING_TOKEN", "token is required", 400);
  const s = await I(n.env).endUserAuth.tryGetEndUser(`Bearer ${e}`);
  if (!s)
    throw new f("UNAUTHORIZED", "Invalid or expired token", 401);
  if (((d = n.req.header("upgrade")) == null ? void 0 : d.toLowerCase()) !== "websocket")
    throw new f("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
  const r = n.env.END_USER_STREAM.idFromName("end_user"), i = n.env.END_USER_STREAM.get(r), o = new URL("https://end-user-stream.internal/"), c = new Request(o, {
    headers: {
      upgrade: "websocket",
      "x-supportly-end-user-id": s.id
    }
  });
  return i.fetch(c);
});
function fs(n, e) {
  if (!n) return e;
  const t = parseInt(n, 10);
  return Number.isFinite(t) && t > 0 ? t : e;
}
function Xi(n) {
  const e = Number(n);
  if (!Number.isInteger(e) || e < 0)
    throw new f("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function Qi(n) {
  return typeof n == "object" && n !== null && "name" in n && "size" in n && "stream" in n;
}
function Gt(n, e, t) {
  const s = n.get(e);
  if (typeof s != "string") return;
  const a = s.trim();
  if (a) {
    if (a.length > t)
      throw new f("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
const Y = new he();
Y.use("*", fr());
Y.use(
  "*",
  $a({
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
Y.use("*", hr());
Y.route("/health", Ks);
Y.route("/api/auth", Ae);
Y.route("/api/admin", Je);
Y.route("/api/channels", Ge);
Y.route("/api/conversations", fe);
Y.route("/api/knowledge", vt);
Y.route("/api/widget", Ke);
Y.route("/api/forum", B);
Y.route("/webhooks", Ys);
Y.onError((n, e) => js(n, e));
Y.notFound((n) => n.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
class no {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var s;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((s = e.headers.get("upgrade")) == null ? void 0 : s.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      tt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        tt(e, { type: "pong", serverTime: N() });
        return;
      }
      tt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      tt(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-admin-user-id");
    if (!t)
      return new Response("Missing admin identity", { status: 400 });
    const s = new WebSocketPair(), a = s[0], r = s[1], i = {
      kind: "admin",
      adminUserId: t,
      connectedAt: N()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), tt(r, { type: "connected", connectionKind: "admin", serverTime: N() }), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" && t.type !== "conversation.updated" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      tt(t, e);
  }
}
function tt(n, e) {
  if (n.readyState === 1)
    try {
      n.send(JSON.stringify(e));
    } catch {
      n.close(1011, "Send failed");
    }
}
class so {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var s;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((s = e.headers.get("upgrade")) == null ? void 0 : s.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      nt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        nt(e, { type: "pong", serverTime: N() });
        return;
      }
      nt(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      nt(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-conversation-id"), s = e.headers.get("x-supportly-visitor-id");
    if (!t || !s)
      return new Response("Missing connection identity", { status: 400 });
    const a = new WebSocketPair(), r = a[0], i = a[1], o = {
      kind: "visitor",
      conversationId: t,
      visitorId: s,
      connectedAt: N()
    };
    return i.serializeAttachment(o), this.state.acceptWebSocket(i), nt(i, { type: "connected", connectionKind: "visitor", serverTime: N() }), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      nt(t, e);
  }
}
function nt(n, e) {
  if (n.readyState === 1)
    try {
      n.send(JSON.stringify(e));
    } catch {
      n.close(1011, "Send failed");
    }
}
const ms = 3e4, eo = 6e4;
class ao {
  constructor(e, t) {
    A(this, "onlineUsers", /* @__PURE__ */ new Set());
    A(this, "heartbeatMap", /* @__PURE__ */ new Map());
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var s;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((s = e.headers.get("upgrade")) == null ? void 0 : s.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  async alarm() {
    const e = Date.now();
    let t = !1;
    for (const [s, a] of this.heartbeatMap)
      e - a > eo && (this.heartbeatMap.delete(s), this.onlineUsers.delete(s), t = !0);
    t && this.broadcastPresence(), this.heartbeatMap.size > 0 && await this.state.storage.setAlarm(Date.now() + ms);
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      Pe(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        const a = e.deserializeAttachment();
        a != null && a.userId && this.heartbeatMap.set(a.userId, Date.now()), Pe(e, { type: "pong", serverTime: N() });
        return;
      }
      Pe(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      Pe(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketClose(e, t, s, a) {
    const r = e.deserializeAttachment();
    r != null && r.userId && (this.onlineUsers.delete(r.userId), this.heartbeatMap.delete(r.userId), this.broadcastPresence());
  }
  webSocketError(e) {
    const t = e.deserializeAttachment();
    t != null && t.userId && (this.onlineUsers.delete(t.userId), this.heartbeatMap.delete(t.userId), this.broadcastPresence()), e.close(1011, "WebSocket error");
  }
  async handleWebSocket(e) {
    const t = e.headers.get("x-supportly-end-user-id");
    if (!t)
      return new Response("Missing end user identity", { status: 400 });
    const s = new WebSocketPair(), a = s[0], r = s[1], i = {
      kind: "end_user",
      userId: t,
      connectedAt: N()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), this.onlineUsers.add(t), this.heartbeatMap.set(t, Date.now()), Pe(r, { type: "connected", connectionKind: "end_user", serverTime: N() }), this.broadcastPresence(), await this.state.storage.setAlarm(Date.now() + ms), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return t ? (t.type === "message.new" && t.targetUserId && t.payload && this.sendToUser(t.targetUserId, t.payload), this.broadcastPresence(), new Response(null, { status: 204 })) : new Response("Invalid notify event", { status: 400 });
  }
  sendToUser(e, t) {
    for (const s of this.state.getWebSockets()) {
      const a = s.deserializeAttachment();
      (a == null ? void 0 : a.userId) === e && Pe(s, t);
    }
  }
  broadcastPresence() {
    const e = {
      type: "end_user.presence",
      onlineUserIds: Array.from(this.onlineUsers)
    };
    for (const t of this.state.getWebSockets())
      Pe(t, e);
  }
}
function Pe(n, e) {
  if (n.readyState === 1)
    try {
      n.send(JSON.stringify(e));
    } catch {
      n.close(1011, "Send failed");
    }
}
export {
  no as AdminStream,
  ao as EndUserStream,
  so as VisitorStream,
  Y as default
};
