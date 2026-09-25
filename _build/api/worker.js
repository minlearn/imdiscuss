var _a = Object.defineProperty;
var Qs = (s) => {
  throw TypeError(s);
};
var ya = (s, e, t) => e in s ? _a(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var y = (s, e, t) => ya(s, typeof e != "symbol" ? e + "" : e, t), Ss = (s, e, t) => e.has(s) || Qs("Cannot " + t);
var p = (s, e, t) => (Ss(s, e, "read from private field"), t ? t.call(s) : e.get(s)), $ = (s, e, t) => e.has(s) ? Qs("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), O = (s, e, t, n) => (Ss(s, e, "write to private field"), n ? n.call(s, t) : e.set(s, t), t), q = (s, e, t) => (Ss(s, e, "access private method"), t);
var en = (s, e, t, n) => ({
  set _(a) {
    O(s, e, a, t);
  },
  get _() {
    return p(s, e, n);
  }
});
var tn = (s, e, t) => (n, a) => {
  let r = -1;
  return i(0);
  async function i(o) {
    if (o <= r)
      throw new Error("next() called multiple times");
    r = o;
    let c, d = !1, l;
    if (s[o] ? (l = s[o][0][0], n.req.routeIndex = o) : l = o === s.length && a || void 0, l)
      try {
        c = await l(n, () => i(o + 1));
      } catch (u) {
        if (u instanceof Error && e)
          n.error = u, c = await e(u, n), d = !0;
        else
          throw u;
      }
    else
      n.finalized === !1 && t && (c = await t(n));
    return c && (n.finalized === !1 || d) && (n.res = c), n;
  }
}, wa = /* @__PURE__ */ Symbol(), va = (s, e) => new Response(s, {
  headers: {
    // Normalize the media type (case-insensitive) while keeping parameters like the boundary
    "Content-Type": e.replace(/^[^;]+/, (n) => n.toLowerCase())
  }
}).formData(), is = (s) => "headers" in s, Ia = async (s, e = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = !1, dot: n = !1 } = e, r = (is(s) ? s.headers : s.raw.headers).get("Content-Type"), i = r == null ? void 0 : r.split(";")[0].trim().toLowerCase();
  return i === "multipart/form-data" || i === "application/x-www-form-urlencoded" ? Sa(s, { all: t, dot: n }) : {};
};
async function Sa(s, e) {
  if (!is(s) && s.bodyCache.formData)
    return sn(
      await s.bodyCache.formData,
      e
    );
  const t = is(s) ? s.headers : s.raw.headers, n = await s.arrayBuffer(), a = va(n, t.get("Content-Type") || "");
  is(s) || (s.bodyCache.formData = a);
  const r = await a;
  return r ? sn(r, e) : {};
}
function sn(s, e) {
  const t = /* @__PURE__ */ Object.create(null);
  return s.forEach((n, a) => {
    e.all || a.endsWith("[]") ? Ea(t, a, n) : t[a] = n;
  }), e.dot && Object.entries(t).forEach(([n, a]) => {
    n.includes(".") && (Aa(t, n, a), delete t[n]);
  }), t;
}
var Ea = (s, e, t) => {
  s[e] !== void 0 ? Array.isArray(s[e]) ? s[e].push(t) : s[e] = [s[e], t] : e.endsWith("[]") ? s[e] = [t] : s[e] = t;
}, Aa = (s, e, t) => {
  if (/(?:^|\.)__proto__\./.test(e))
    return;
  let n = s;
  const a = e.split(".");
  a.forEach((r, i) => {
    i === a.length - 1 ? n[r] = t : ((!n[r] || typeof n[r] != "object" || Array.isArray(n[r]) || n[r] instanceof File) && (n[r] = /* @__PURE__ */ Object.create(null)), n = n[r]);
  });
}, Ln = (s) => {
  const e = s.split("/");
  return e[0] === "" && e.shift(), e;
}, ba = (s) => {
  const { groups: e, path: t } = Ta(s), n = Ln(t);
  return xa(n, e);
}, Ta = (s) => {
  const e = [];
  return s = s.replace(/\{[^}]+\}/g, (t, n) => {
    const a = `@${n}`;
    return e.push([a, t]), a;
  }), { groups: e, path: s };
}, xa = (s, e) => {
  for (let t = e.length - 1; t >= 0; t--) {
    const [n] = e[t];
    for (let a = s.length - 1; a >= 0; a--)
      if (s[a].includes(n)) {
        s[a] = s[a].replace(n, e[t][1]);
        break;
      }
  }
  return s;
}, Qt = {}, Ca = (s, e) => {
  if (s === "*")
    return "*";
  const t = s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const n = `${s}#${e}`;
    return Qt[n] || (t[2] ? Qt[n] = e && e[0] !== ":" && e[0] !== "*" ? [n, t[1], new RegExp(`^${t[2]}(?=/${e})`)] : [s, t[1], new RegExp(`^${t[2]}$`)] : Qt[n] = [s, t[1], !0]), Qt[n];
  }
  return null;
}, zs = (s, e) => {
  try {
    return e(s);
  } catch {
    return s.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return e(t);
      } catch {
        return t;
      }
    });
  }
}, ka = (s) => zs(s, decodeURI), Fn = (s) => {
  const e = s.url, t = e.indexOf("/", e.indexOf(":") + 4);
  let n = t;
  for (; n < e.length; n++) {
    const a = e.charCodeAt(n);
    if (a === 37) {
      const r = e.indexOf("?", n), i = e.indexOf("#", n), o = r === -1 ? i === -1 ? void 0 : i : i === -1 ? r : Math.min(r, i), c = e.slice(t, o);
      return ka(c.includes("%25") ? c.replace(/%25/g, "%2525") : c);
    } else if (a === 63 || a === 35)
      break;
  }
  return e.slice(t, n);
}, Oa = (s) => {
  const e = Fn(s);
  return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
}, Ve = (s, e, ...t) => (t.length && (e = Ve(e, ...t)), `${(s == null ? void 0 : s[0]) === "/" ? "" : "/"}${s}${e === "/" ? "" : `${(s == null ? void 0 : s.at(-1)) === "/" ? "" : "/"}${(e == null ? void 0 : e[0]) === "/" ? e.slice(1) : e}`}`), Bn = (s) => {
  if (s.charCodeAt(s.length - 1) !== 63 || !s.includes(":"))
    return null;
  const e = s.split("/"), t = [];
  let n = "";
  return e.forEach((a) => {
    if (a !== "" && !/\:/.test(a))
      n += "/" + a;
    else if (/\:/.test(a))
      if (/\?/.test(a)) {
        t.length === 0 && n === "" ? t.push("/") : t.push(n);
        const r = a.replace("?", "");
        n += "/" + r, t.push(n);
      } else
        n += "/" + a;
  }), t.filter((a, r, i) => i.indexOf(a) === r);
}, Es = (s) => /[%+]/.test(s) ? (s.indexOf("+") !== -1 && (s = s.replace(/\+/g, " ")), s.indexOf("%") !== -1 ? zs(s, Hn) : s) : s, jn = (s, e, t) => {
  let n;
  if (!t && e && !/[%+]/.test(e)) {
    let i = s.indexOf("?", 8);
    if (i === -1)
      return;
    for (s.startsWith(e, i + 1) || (i = s.indexOf(`&${e}`, i + 1)); i !== -1; ) {
      const o = s.charCodeAt(i + e.length + 1);
      if (o === 61) {
        const c = i + e.length + 2, d = s.indexOf("&", c);
        return Es(s.slice(c, d === -1 ? void 0 : d));
      } else if (o == 38 || isNaN(o))
        return "";
      i = s.indexOf(`&${e}`, i + 1);
    }
    if (n = /[%+]/.test(s), !n)
      return;
  }
  const a = {};
  n ?? (n = /[%+]/.test(s));
  let r = s.indexOf("?", 8);
  for (; r !== -1; ) {
    const i = s.indexOf("&", r + 1);
    let o = s.indexOf("=", r);
    o > i && i !== -1 && (o = -1);
    let c = s.slice(
      r + 1,
      o === -1 ? i === -1 ? void 0 : i : o
    );
    if (n && (c = Es(c)), r = i, c === "")
      continue;
    let d;
    o === -1 ? d = "" : (d = s.slice(o + 1, i === -1 ? void 0 : i), n && (d = Es(d))), t ? (a[c] && Array.isArray(a[c]) || (a[c] = []), a[c].push(d)) : a[c] ?? (a[c] = d);
  }
  return e ? a[e] : a;
}, Ra = jn, Na = (s, e) => jn(s, e, !0), Hn = decodeURIComponent, nn = (s) => zs(s, Hn), _t, de, Ne, qn, Wn, Us, Te, Nn, Ma = (Nn = class {
  constructor(s, e = "/", t = [[]]) {
    $(this, Ne);
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
    y(this, "raw");
    $(this, _t);
    // Short name of validatedData
    $(this, de);
    y(this, "routeIndex", 0);
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
    y(this, "path");
    y(this, "bodyCache", {});
    $(this, Te, (s) => {
      const { bodyCache: e, raw: t } = this, n = e[s];
      if (n)
        return n;
      const a = Object.keys(e)[0];
      return a ? e[a].then((r) => (a === "json" && (r = JSON.stringify(r)), new Response(r)[s]())) : e[s] = t[s]();
    });
    this.raw = s, this.path = e, O(this, de, t), O(this, _t, {});
  }
  param(s) {
    return s ? q(this, Ne, qn).call(this, s) : q(this, Ne, Wn).call(this);
  }
  query(s) {
    return Ra(this.url, s);
  }
  queries(s) {
    return Na(this.url, s);
  }
  header(s) {
    if (s)
      return this.raw.headers.get(s) ?? void 0;
    const e = {};
    return this.raw.headers.forEach((t, n) => {
      e[n] = t;
    }), e;
  }
  async parseBody(s) {
    return Ia(this, s);
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
    return p(this, Te).call(this, "text").then((s) => JSON.parse(s));
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
    return p(this, Te).call(this, "text");
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
    return p(this, Te).call(this, "arrayBuffer");
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
    return p(this, Te).call(this, "arrayBuffer").then((s) => new Uint8Array(s));
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
    return p(this, Te).call(this, "blob");
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
    return p(this, Te).call(this, "formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(s, e) {
    p(this, _t)[s] = e;
  }
  valid(s) {
    return p(this, _t)[s];
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
  get [wa]() {
    return p(this, de);
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
    return p(this, de)[0].map(([[, s]]) => s);
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
    return p(this, de)[0].map(([[, s]]) => s)[this.routeIndex].path;
  }
}, _t = new WeakMap(), de = new WeakMap(), Ne = new WeakSet(), qn = function(s) {
  const e = p(this, de)[0][this.routeIndex][1][s], t = q(this, Ne, Us).call(this, e);
  return t && /\%/.test(t) ? nn(t) : t;
}, Wn = function() {
  const s = {}, e = Object.keys(p(this, de)[0][this.routeIndex][1]);
  for (const t of e) {
    const n = q(this, Ne, Us).call(this, p(this, de)[0][this.routeIndex][1][t]);
    n !== void 0 && (s[t] = /\%/.test(n) ? nn(n) : n);
  }
  return s;
}, Us = function(s) {
  return p(this, de)[1] ? p(this, de)[1][s] : s;
}, Te = new WeakMap(), Nn), Da = {
  Stringify: 1
}, zn = async (s, e, t, n, a) => {
  typeof s == "object" && !(s instanceof String) && (s instanceof Promise || (s = s.toString()), s instanceof Promise && (s = await s));
  const r = s.callbacks;
  return r != null && r.length ? (a ? a[0] += s : a = [s], Promise.all(r.map((o) => o({ phase: e, buffer: a, context: n }))).then(
    (o) => Promise.all(
      o.filter(Boolean).map((c) => zn(c, e, !1, n, a))
    ).then(() => a[0])
  )) : Promise.resolve(s);
}, Ua = "text/plain; charset=UTF-8", As = (s, e) => ({
  "Content-Type": s,
  ...e
}), Dt = (s, e) => new Response(s, e), Vt, Jt, xe, yt, Ce, se, Gt, wt, vt, Ke, Kt, Zt, $e, ft, Mn, Pa = (Mn = class {
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(s, e) {
    $(this, $e);
    $(this, Vt);
    $(this, Jt);
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
    y(this, "env", {});
    $(this, xe);
    y(this, "finalized", !1);
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
    y(this, "error");
    $(this, yt);
    $(this, Ce);
    $(this, se);
    $(this, Gt);
    $(this, wt);
    $(this, vt);
    $(this, Ke);
    $(this, Kt);
    $(this, Zt);
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
    y(this, "render", (...s) => (p(this, wt) ?? O(this, wt, (e) => this.html(e)), p(this, wt).call(this, ...s)));
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    y(this, "setLayout", (s) => O(this, Gt, s));
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    y(this, "getLayout", () => p(this, Gt));
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
    y(this, "setRenderer", (s) => {
      O(this, wt, s);
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
    y(this, "header", (s, e, t) => {
      this.finalized && O(this, se, Dt(p(this, se).body, p(this, se)));
      const n = p(this, se) ? p(this, se).headers : p(this, Ke) ?? O(this, Ke, new Headers());
      e === void 0 ? n.delete(s) : t != null && t.append ? n.append(s, e) : n.set(s, e);
    });
    y(this, "status", (s) => {
      O(this, yt, s);
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
    y(this, "set", (s, e) => {
      p(this, xe) ?? O(this, xe, /* @__PURE__ */ new Map()), p(this, xe).set(s, e);
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
    y(this, "get", (s) => p(this, xe) ? p(this, xe).get(s) : void 0);
    y(this, "newResponse", (...s) => q(this, $e, ft).call(this, ...s));
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
    y(this, "body", (s, e, t) => q(this, $e, ft).call(this, s, e, t));
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
    y(this, "text", (s, e, t) => !p(this, Ke) && !p(this, yt) && !e && !t && !this.finalized ? new Response(s) : q(this, $e, ft).call(this, s, e, As(Ua, t)));
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
    y(this, "json", (s, e, t) => q(this, $e, ft).call(this, JSON.stringify(s), e, As("application/json", t)));
    y(this, "html", (s, e, t) => {
      const n = (a) => q(this, $e, ft).call(this, a, e, As("text/html; charset=UTF-8", t));
      return typeof s == "object" ? zn(s, Da.Stringify, !1, {}).then(n) : n(s);
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
    y(this, "redirect", (s, e) => {
      const t = String(s);
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
    y(this, "notFound", () => (p(this, vt) ?? O(this, vt, () => Dt()), p(this, vt).call(this, this)));
    O(this, Vt, s), e && (O(this, Ce, e.executionCtx), this.env = e.env, O(this, vt, e.notFoundHandler), O(this, Zt, e.path), O(this, Kt, e.matchResult));
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return p(this, Jt) ?? O(this, Jt, new Ma(p(this, Vt), p(this, Zt), p(this, Kt))), p(this, Jt);
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (p(this, Ce) && "respondWith" in p(this, Ce))
      return p(this, Ce);
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (p(this, Ce))
      return p(this, Ce);
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return p(this, se) || O(this, se, Dt(null, {
      headers: p(this, Ke) ?? O(this, Ke, new Headers())
    }));
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(s) {
    if (p(this, se) && s) {
      s = Dt(s.body, s);
      for (const [e, t] of p(this, se).headers.entries())
        if (e !== "content-type")
          if (e === "set-cookie") {
            const n = p(this, se).headers.getSetCookie();
            s.headers.delete("set-cookie");
            for (const a of n)
              s.headers.append("set-cookie", a);
          } else
            s.headers.set(e, t);
    }
    O(this, se, s), this.finalized = !0;
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
    return p(this, xe) ? Object.fromEntries(p(this, xe)) : {};
  }
}, Vt = new WeakMap(), Jt = new WeakMap(), xe = new WeakMap(), yt = new WeakMap(), Ce = new WeakMap(), se = new WeakMap(), Gt = new WeakMap(), wt = new WeakMap(), vt = new WeakMap(), Ke = new WeakMap(), Kt = new WeakMap(), Zt = new WeakMap(), $e = new WeakSet(), ft = function(s, e, t) {
  const n = p(this, se) ? new Headers(p(this, se).headers) : p(this, Ke) ?? new Headers();
  if (typeof e == "object" && "headers" in e) {
    const r = e.headers instanceof Headers ? e.headers : new Headers(e.headers);
    for (const [i, o] of r)
      i.toLowerCase() === "set-cookie" ? n.append(i, o) : n.set(i, o);
  }
  if (t)
    for (const [r, i] of Object.entries(t))
      if (typeof i == "string")
        n.set(r, i);
      else {
        n.delete(r);
        for (const o of i)
          n.append(r, o);
      }
  const a = typeof e == "number" ? e : (e == null ? void 0 : e.status) ?? p(this, yt);
  return Dt(s, { status: a, headers: n });
}, Mn), K = "ALL", $a = "all", La = ["get", "post", "put", "delete", "options", "patch"], Vn = "Can not add a route since the matcher is already built.", Jn = class extends Error {
}, Fa = "__COMPOSED_HANDLER", Ba = (s) => s.text("404 Not Found", 404), an = (s, e) => {
  if ("getResponse" in s) {
    const t = s.getResponse();
    return e.newResponse(t.body, t);
  }
  return console.error(s), e.text("Internal Server Error", 500);
}, he, Z, Gn, pe, Je, os, cs, It, ja = (It = class {
  constructor(e = {}) {
    $(this, Z);
    y(this, "get");
    y(this, "post");
    y(this, "put");
    y(this, "delete");
    y(this, "options");
    y(this, "patch");
    y(this, "all");
    y(this, "on");
    y(this, "use");
    /*
      This class is like an abstract class and does not have a router.
      To use it, inherit the class and implement router in the constructor.
    */
    y(this, "router");
    y(this, "getPath");
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    y(this, "_basePath", "/");
    $(this, he, "/");
    y(this, "routes", []);
    $(this, pe, Ba);
    // Cannot use `#` because it requires visibility at JavaScript runtime.
    y(this, "errorHandler", an);
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
    y(this, "onError", (e) => (this.errorHandler = e, this));
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
    y(this, "notFound", (e) => (O(this, pe, e), this));
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
    y(this, "fetch", (e, ...t) => q(this, Z, cs).call(this, e, t[1], t[0], e.method));
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
    y(this, "request", (e, t, n, a) => e instanceof Request ? this.fetch(t ? new Request(e, t) : e, n, a) : (e = e.toString(), this.fetch(
      new Request(
        /^https?:\/\//.test(e) ? e : `http://localhost${Ve("/", e)}`,
        t
      ),
      n,
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
    y(this, "fire", () => {
      addEventListener("fetch", (e) => {
        e.respondWith(q(this, Z, cs).call(this, e.request, e, void 0, e.request.method));
      });
    });
    [...La, $a].forEach((r) => {
      this[r] = (i, ...o) => (typeof i == "string" ? O(this, he, i) : q(this, Z, Je).call(this, r, p(this, he), i), o.forEach((c) => {
        q(this, Z, Je).call(this, r, p(this, he), c);
      }), this);
    }), this.on = (r, i, ...o) => {
      for (const c of [i].flat()) {
        O(this, he, c);
        for (const d of [r].flat())
          o.map((l) => {
            q(this, Z, Je).call(this, d.toUpperCase(), p(this, he), l);
          });
      }
      return this;
    }, this.use = (r, ...i) => (typeof r == "string" ? O(this, he, r) : (O(this, he, "*"), i.unshift(r)), i.forEach((o) => {
      q(this, Z, Je).call(this, K, p(this, he), o);
    }), this);
    const { strict: n, ...a } = e;
    Object.assign(this, a), this.getPath = n ?? !0 ? e.getPath ?? Fn : Oa;
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
    const n = this.basePath(e);
    return t.routes.map((a) => {
      var i;
      let r;
      t.errorHandler === an ? r = a.handler : (r = async (o, c) => (await tn([], t.errorHandler)(o, () => a.handler(o, c))).res, r[Fa] = a.handler), q(i = n, Z, Je).call(i, a.method, a.path, r, a.basePath);
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
    const t = q(this, Z, Gn).call(this);
    return t._basePath = Ve(this._basePath, e), t;
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
  mount(e, t, n) {
    let a, r;
    n && (typeof n == "function" ? r = n : (r = n.optionHandler, n.replaceRequest === !1 ? a = (c) => c : a = n.replaceRequest));
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
      const c = Ve(this._basePath, e), d = c === "/" ? 0 : c.length;
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
    return q(this, Z, Je).call(this, K, Ve(e, "*"), o), this;
  }
}, he = new WeakMap(), Z = new WeakSet(), Gn = function() {
  const e = new It({
    router: this.router,
    getPath: this.getPath
  });
  return e.errorHandler = this.errorHandler, O(e, pe, p(this, pe)), e.routes = this.routes, e;
}, pe = new WeakMap(), Je = function(e, t, n, a) {
  e = e.toUpperCase(), t = Ve(this._basePath, t);
  const r = {
    basePath: a !== void 0 ? Ve(this._basePath, a) : this._basePath,
    path: t,
    method: e,
    handler: n
  };
  this.router.add(e, t, [n, r]), this.routes.push(r);
}, os = function(e, t) {
  if (e instanceof Error)
    return this.errorHandler(e, t);
  throw e;
}, cs = function(e, t, n, a) {
  if (a === "HEAD")
    return (async () => new Response(null, await q(this, Z, cs).call(this, e, t, n, "GET")))();
  const r = this.getPath(e, { env: n }), i = this.router.match(a, r), o = new Pa(e, {
    path: r,
    matchResult: i,
    env: n,
    executionCtx: t,
    notFoundHandler: p(this, pe)
  });
  if (i[0].length === 1) {
    let d;
    try {
      d = i[0][0][0][0](o, async () => {
        o.res = await p(this, pe).call(this, o);
      });
    } catch (l) {
      return q(this, Z, os).call(this, l, o);
    }
    return d instanceof Promise ? d.then(
      (l) => l || (o.finalized ? o.res : p(this, pe).call(this, o))
    ).catch((l) => q(this, Z, os).call(this, l, o)) : d ?? p(this, pe).call(this, o);
  }
  const c = tn(i[0], this.errorHandler, p(this, pe));
  return (async () => {
    try {
      const d = await c(o);
      if (!d.finalized)
        throw new Error(
          "Context is not finalized. Did you forget to return a Response object or `await next()`?"
        );
      return d.res;
    } catch (d) {
      return q(this, Z, os).call(this, d, o);
    }
  })();
}, It), Kn = [];
function Ha(s, e) {
  const t = this.buildAllMatchers(), n = (a, r) => {
    const i = t[a] || t[K], o = i[2][r];
    if (o)
      return o;
    const c = r.match(i[0]);
    if (!c)
      return [[], Kn];
    const d = c.indexOf("", 1);
    return [i[1][d], c];
  };
  return this.match = n, n(s, e);
}
var ls = "[^/]+", jt = ".*", Ht = "(?:|/.*)", mt = /* @__PURE__ */ Symbol(), qa = new Set(".\\+*[^]$()");
function Wa(s, e) {
  return s.length === 1 ? e.length === 1 ? s < e ? -1 : 1 : -1 : e.length === 1 || s === jt || s === Ht ? 1 : e === jt || e === Ht ? -1 : s === ls ? 1 : e === ls ? -1 : s.length === e.length ? s < e ? -1 : 1 : e.length - s.length;
}
var Ze, Ye, fe, et, za = (et = class {
  constructor() {
    $(this, Ze);
    $(this, Ye);
    $(this, fe, /* @__PURE__ */ Object.create(null));
  }
  insert(e, t, n, a, r) {
    if (e.length === 0) {
      if (p(this, Ze) !== void 0)
        throw mt;
      if (r)
        return;
      O(this, Ze, t);
      return;
    }
    const [i, ...o] = e, c = i === "*" ? o.length === 0 ? ["", "", jt] : ["", "", ls] : i === "/*" ? ["", "", Ht] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let d;
    if (c) {
      const l = c[1];
      let u = c[2] || ls;
      if (l && c[2] && (u === ".*" || (u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(u))))
        throw mt;
      if (d = p(this, fe)[u], !d) {
        if (Object.keys(p(this, fe)).some(
          (h) => h !== jt && h !== Ht
        ))
          throw mt;
        if (r)
          return;
        d = p(this, fe)[u] = new et(), l !== "" && O(d, Ye, a.varIndex++);
      }
      !r && l !== "" && n.push([l, p(d, Ye)]);
    } else if (d = p(this, fe)[i], !d) {
      if (Object.keys(p(this, fe)).some(
        (l) => l.length > 1 && l !== jt && l !== Ht
      ))
        throw mt;
      if (r)
        return;
      d = p(this, fe)[i] = new et();
    }
    d.insert(o, t, n, a, r);
  }
  buildRegExpStr() {
    const t = Object.keys(p(this, fe)).sort(Wa).map((n) => {
      const a = p(this, fe)[n];
      return (typeof p(a, Ye) == "number" ? `(${n})@${p(a, Ye)}` : qa.has(n) ? `\\${n}` : n) + a.buildRegExpStr();
    });
    return typeof p(this, Ze) == "number" && t.unshift(`#${p(this, Ze)}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, Ze = new WeakMap(), Ye = new WeakMap(), fe = new WeakMap(), et), ys, Yt, Dn, Va = (Dn = class {
  constructor() {
    $(this, ys, { varIndex: 0 });
    $(this, Yt, new za());
  }
  insert(s, e, t) {
    const n = [], a = [];
    for (let i = 0; ; ) {
      let o = !1;
      if (s = s.replace(/\{[^}]+\}/g, (c) => {
        const d = `@\\${i}`;
        return a[i] = [d, c], i++, o = !0, d;
      }), !o)
        break;
    }
    const r = s.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = a.length - 1; i >= 0; i--) {
      const [o] = a[i];
      for (let c = r.length - 1; c >= 0; c--)
        if (r[c].indexOf(o) !== -1) {
          r[c] = r[c].replace(o, a[i][1]);
          break;
        }
    }
    return p(this, Yt).insert(r, e, n, p(this, ys), t), n;
  }
  buildRegExp() {
    let s = p(this, Yt).buildRegExpStr();
    if (s === "")
      return [/^$/, [], []];
    let e = 0;
    const t = [], n = [];
    return s = s.replace(/#(\d+)|@(\d+)|\.\*\$/g, (a, r, i) => r !== void 0 ? (t[++e] = Number(r), "$()") : (i !== void 0 && (n[Number(i)] = ++e), "")), [new RegExp(`^${s}`), t, n];
  }
}, ys = new WeakMap(), Yt = new WeakMap(), Dn), Ja = [/^$/, [], /* @__PURE__ */ Object.create(null)], ds = /* @__PURE__ */ Object.create(null);
function Zn(s) {
  return ds[s] ?? (ds[s] = new RegExp(
    s === "*" ? "" : `^${s.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (e, t) => t ? `\\${t}` : "(?:|/.*)"
    )}$`
  ));
}
function Ga() {
  ds = /* @__PURE__ */ Object.create(null);
}
function Ka(s) {
  var d;
  const e = new Va(), t = [];
  if (s.length === 0)
    return Ja;
  const n = s.map(
    (l) => [!/\*|\/:/.test(l[0]), ...l]
  ).sort(
    ([l, u], [h, m]) => l ? 1 : h ? -1 : u.length - m.length
  ), a = /* @__PURE__ */ Object.create(null);
  for (let l = 0, u = -1, h = n.length; l < h; l++) {
    const [m, _, E] = n[l];
    m ? a[_] = [E.map(([b]) => [b, /* @__PURE__ */ Object.create(null)]), Kn] : u++;
    let S;
    try {
      S = e.insert(_, u, m);
    } catch (b) {
      throw b === mt ? new Jn(_) : b;
    }
    m || (t[u] = E.map(([b, C]) => {
      const L = /* @__PURE__ */ Object.create(null);
      for (C -= 1; C >= 0; C--) {
        const [D, W] = S[C];
        L[D] = W;
      }
      return [b, L];
    }));
  }
  const [r, i, o] = e.buildRegExp();
  for (let l = 0, u = t.length; l < u; l++)
    for (let h = 0, m = t[l].length; h < m; h++) {
      const _ = (d = t[l][h]) == null ? void 0 : d[1];
      if (!_)
        continue;
      const E = Object.keys(_);
      for (let S = 0, b = E.length; S < b; S++)
        _[E[S]] = o[_[E[S]]];
    }
  const c = [];
  for (const l in i)
    c[l] = t[i[l]];
  return [r, c, a];
}
function dt(s, e) {
  if (s) {
    for (const t of Object.keys(s).sort((n, a) => a.length - n.length))
      if (Zn(t).test(e))
        return [...s[t]];
  }
}
var Le, Fe, ws, Yn, Un, Za = (Un = class {
  constructor() {
    $(this, ws);
    y(this, "name", "RegExpRouter");
    $(this, Le);
    $(this, Fe);
    y(this, "match", Ha);
    O(this, Le, { [K]: /* @__PURE__ */ Object.create(null) }), O(this, Fe, { [K]: /* @__PURE__ */ Object.create(null) });
  }
  add(s, e, t) {
    var o;
    const n = p(this, Le), a = p(this, Fe);
    if (!n || !a)
      throw new Error(Vn);
    n[s] || [n, a].forEach((c) => {
      c[s] = /* @__PURE__ */ Object.create(null), Object.keys(c[K]).forEach((d) => {
        c[s][d] = [...c[K][d]];
      });
    }), e === "/*" && (e = "*");
    const r = (e.match(/\/:/g) || []).length;
    if (/\*$/.test(e)) {
      const c = Zn(e);
      s === K ? Object.keys(n).forEach((d) => {
        var l;
        (l = n[d])[e] || (l[e] = dt(n[d], e) || dt(n[K], e) || []);
      }) : (o = n[s])[e] || (o[e] = dt(n[s], e) || dt(n[K], e) || []), Object.keys(n).forEach((d) => {
        (s === K || s === d) && Object.keys(n[d]).forEach((l) => {
          c.test(l) && n[d][l].push([t, r]);
        });
      }), Object.keys(a).forEach((d) => {
        (s === K || s === d) && Object.keys(a[d]).forEach(
          (l) => c.test(l) && a[d][l].push([t, r])
        );
      });
      return;
    }
    const i = Bn(e) || [e];
    for (let c = 0, d = i.length; c < d; c++) {
      const l = i[c];
      Object.keys(a).forEach((u) => {
        var h;
        (s === K || s === u) && ((h = a[u])[l] || (h[l] = [
          ...dt(n[u], l) || dt(n[K], l) || []
        ]), a[u][l].push([t, r - d + c + 1]));
      });
    }
  }
  buildAllMatchers() {
    const s = /* @__PURE__ */ Object.create(null);
    return Object.keys(p(this, Fe)).concat(Object.keys(p(this, Le))).forEach((e) => {
      s[e] || (s[e] = q(this, ws, Yn).call(this, e));
    }), O(this, Le, O(this, Fe, void 0)), Ga(), s;
  }
}, Le = new WeakMap(), Fe = new WeakMap(), ws = new WeakSet(), Yn = function(s) {
  const e = [];
  let t = s === K;
  return [p(this, Le), p(this, Fe)].forEach((n) => {
    const a = n[s] ? Object.keys(n[s]).map((r) => [r, n[s][r]]) : [];
    a.length !== 0 ? (t || (t = !0), e.push(...a)) : s !== K && e.push(
      ...Object.keys(n[K]).map((r) => [r, n[K][r]])
    );
  }), t ? Ka(e) : null;
}, Un), Be, ke, Pn, Ya = (Pn = class {
  constructor(s) {
    y(this, "name", "SmartRouter");
    $(this, Be, []);
    $(this, ke, []);
    O(this, Be, s.routers);
  }
  add(s, e, t) {
    if (!p(this, ke))
      throw new Error(Vn);
    p(this, ke).push([s, e, t]);
  }
  match(s, e) {
    if (!p(this, ke))
      throw new Error("Fatal error");
    const t = p(this, Be), n = p(this, ke), a = t.length;
    let r = 0, i;
    for (; r < a; r++) {
      const o = t[r];
      try {
        for (let c = 0, d = n.length; c < d; c++)
          o.add(...n[c]);
        i = o.match(s, e);
      } catch (c) {
        if (c instanceof Jn)
          continue;
        throw c;
      }
      this.match = o.match.bind(o), O(this, Be, [o]), O(this, ke, void 0);
      break;
    }
    if (r === a)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (p(this, ke) || p(this, Be).length !== 1)
      throw new Error("No active router has been determined yet.");
    return p(this, Be)[0];
  }
}, Be = new WeakMap(), ke = new WeakMap(), Pn), Ut = /* @__PURE__ */ Object.create(null), Xa = (s) => {
  for (const e in s)
    return !0;
  return !1;
}, je, Q, Xe, St, ee, we, Ue, Et, Qa = (Et = class {
  constructor(e, t, n) {
    $(this, we);
    $(this, je);
    $(this, Q);
    $(this, Xe);
    $(this, St, 0);
    $(this, ee, Ut);
    if (O(this, Q, n || /* @__PURE__ */ Object.create(null)), O(this, je, []), e && t) {
      const a = /* @__PURE__ */ Object.create(null);
      a[e] = { handler: t, possibleKeys: [], score: 0 }, O(this, je, [a]);
    }
    O(this, Xe, []);
  }
  insert(e, t, n) {
    O(this, St, ++en(this, St)._);
    let a = this;
    const r = ba(t), i = [];
    for (let o = 0, c = r.length; o < c; o++) {
      const d = r[o], l = r[o + 1], u = Ca(d, l), h = Array.isArray(u) ? u[0] : d;
      if (h in p(a, Q)) {
        a = p(a, Q)[h], u && i.push(u[1]);
        continue;
      }
      p(a, Q)[h] = new Et(), u && (p(a, Xe).push(u), i.push(u[1])), a = p(a, Q)[h];
    }
    return p(a, je).push({
      [e]: {
        handler: n,
        possibleKeys: i.filter((o, c, d) => d.indexOf(o) === c),
        score: p(this, St)
      }
    }), a;
  }
  search(e, t) {
    var l;
    const n = [];
    O(this, ee, Ut);
    let r = [this];
    const i = Ln(t), o = [], c = i.length;
    let d = null;
    for (let u = 0; u < c; u++) {
      const h = i[u], m = u === c - 1, _ = [];
      for (let S = 0, b = r.length; S < b; S++) {
        const C = r[S], L = p(C, Q)[h];
        L && (O(L, ee, p(C, ee)), m ? (p(L, Q)["*"] && q(this, we, Ue).call(this, n, p(L, Q)["*"], e, p(C, ee)), q(this, we, Ue).call(this, n, L, e, p(C, ee))) : _.push(L));
        for (let D = 0, W = p(C, Xe).length; D < W; D++) {
          const te = p(C, Xe)[D], f = p(C, ee) === Ut ? {} : { ...p(C, ee) };
          if (te === "*") {
            const ce = p(C, Q)["*"];
            ce && (q(this, we, Ue).call(this, n, ce, e, p(C, ee)), O(ce, ee, f), _.push(ce));
            continue;
          }
          const [ae, ot, P] = te;
          if (!h && !(P instanceof RegExp))
            continue;
          const z = p(C, Q)[ae];
          if (P instanceof RegExp) {
            if (d === null) {
              d = new Array(c);
              let X = t[0] === "/" ? 1 : 0;
              for (let ue = 0; ue < c; ue++)
                d[ue] = X, X += i[ue].length + 1;
            }
            const ce = t.substring(d[u]), Ae = P.exec(ce);
            if (Ae) {
              if (f[ot] = Ae[0], q(this, we, Ue).call(this, n, z, e, p(C, ee), f), Ae[0].length === ce.length && p(z, Q)["*"] && q(this, we, Ue).call(this, n, p(z, Q)["*"], e, p(C, ee), f), Xa(p(z, Q))) {
                O(z, ee, f);
                const X = ((l = Ae[0].match(/\//)) == null ? void 0 : l.length) ?? 0;
                (o[X] || (o[X] = [])).push(z);
              }
              continue;
            }
          }
          (P === !0 || P.test(h)) && (f[ot] = h, m ? (q(this, we, Ue).call(this, n, z, e, f, p(C, ee)), p(z, Q)["*"] && q(this, we, Ue).call(this, n, p(z, Q)["*"], e, f, p(C, ee))) : (O(z, ee, f), _.push(z)));
        }
      }
      const E = o.shift();
      r = E ? _.concat(E) : _;
    }
    return n.length > 1 && n.sort((u, h) => u.score - h.score), [n.map(({ handler: u, params: h }) => [u, h])];
  }
}, je = new WeakMap(), Q = new WeakMap(), Xe = new WeakMap(), St = new WeakMap(), ee = new WeakMap(), we = new WeakSet(), Ue = function(e, t, n, a, r) {
  for (let i = 0, o = p(t, je).length; i < o; i++) {
    const c = p(t, je)[i], d = c[n] || c[K], l = {};
    if (d !== void 0 && (d.params = /* @__PURE__ */ Object.create(null), e.push(d), a !== Ut || r && r !== Ut))
      for (let u = 0, h = d.possibleKeys.length; u < h; u++) {
        const m = d.possibleKeys[u], _ = l[d.score];
        d.params[m] = r != null && r[m] && !_ ? r[m] : a[m] ?? (r == null ? void 0 : r[m]), l[d.score] = !0;
      }
  }
}, Et), Qe, $n, er = ($n = class {
  constructor() {
    y(this, "name", "TrieRouter");
    $(this, Qe);
    O(this, Qe, new Qa());
  }
  add(s, e, t) {
    const n = Bn(e);
    if (n) {
      for (let a = 0, r = n.length; a < r; a++)
        p(this, Qe).insert(s, n[a], t);
      return;
    }
    p(this, Qe).insert(s, e, t);
  }
  match(s, e) {
    return p(this, Qe).search(s, e);
  }
}, Qe = new WeakMap(), $n), _e = class extends ja {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(s = {}) {
    super(s), this.router = s.router ?? new Ya({
      routers: [new Za(), new er()]
    });
  }
}, tr = (s) => {
  const e = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...s
  }, t = /* @__PURE__ */ ((a) => typeof a == "string" ? a === "*" ? () => a : (r) => a === r ? r : null : typeof a == "function" ? a : (r) => a.includes(r) ? r : null)(e.origin), n = ((a) => typeof a == "function" ? a : Array.isArray(a) ? () => a : () => [])(e.allowMethods);
  return async function(r, i) {
    var d;
    function o(l, u) {
      r.res.headers.set(l, u);
    }
    const c = await t(r.req.header("origin") || "", r);
    if (c && o("Access-Control-Allow-Origin", c), e.credentials && o("Access-Control-Allow-Credentials", "true"), (d = e.exposeHeaders) != null && d.length && o("Access-Control-Expose-Headers", e.exposeHeaders.join(",")), r.req.method === "OPTIONS") {
      e.origin !== "*" && o("Vary", "Origin"), e.maxAge != null && o("Access-Control-Max-Age", e.maxAge.toString());
      const l = await n(r.req.header("origin") || "", r);
      l.length && o("Access-Control-Allow-Methods", l.join(","));
      let u = e.allowHeaders;
      if (!(u != null && u.length)) {
        const h = r.req.header("Access-Control-Request-Headers");
        h && (u = h.split(/\s*,\s*/));
      }
      return u != null && u.length && (o("Access-Control-Allow-Headers", u.join(",")), r.res.headers.append("Vary", "Access-Control-Request-Headers")), r.res.headers.delete("Content-Length"), r.res.headers.delete("Content-Type"), new Response(null, {
        headers: r.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), e.origin !== "*" && r.header("Vary", "Origin", { append: !0 });
  };
}, j;
(function(s) {
  s.assertEqual = (a) => {
  };
  function e(a) {
  }
  s.assertIs = e;
  function t(a) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (a) => {
    const r = {};
    for (const i of a)
      r[i] = i;
    return r;
  }, s.getValidEnumValues = (a) => {
    const r = s.objectKeys(a).filter((o) => typeof a[a[o]] != "number"), i = {};
    for (const o of r)
      i[o] = a[o];
    return s.objectValues(i);
  }, s.objectValues = (a) => s.objectKeys(a).map(function(r) {
    return a[r];
  }), s.objectKeys = typeof Object.keys == "function" ? (a) => Object.keys(a) : (a) => {
    const r = [];
    for (const i in a)
      Object.prototype.hasOwnProperty.call(a, i) && r.push(i);
    return r;
  }, s.find = (a, r) => {
    for (const i of a)
      if (r(i))
        return i;
  }, s.isInteger = typeof Number.isInteger == "function" ? (a) => Number.isInteger(a) : (a) => typeof a == "number" && Number.isFinite(a) && Math.floor(a) === a;
  function n(a, r = " | ") {
    return a.map((i) => typeof i == "string" ? `'${i}'` : i).join(r);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (a, r) => typeof r == "bigint" ? r.toString() : r;
})(j || (j = {}));
var rn;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(rn || (rn = {}));
const A = j.arrayToEnum([
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
]), Pe = (s) => {
  switch (typeof s) {
    case "undefined":
      return A.undefined;
    case "string":
      return A.string;
    case "number":
      return Number.isNaN(s) ? A.nan : A.number;
    case "boolean":
      return A.boolean;
    case "function":
      return A.function;
    case "bigint":
      return A.bigint;
    case "symbol":
      return A.symbol;
    case "object":
      return Array.isArray(s) ? A.array : s === null ? A.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? A.promise : typeof Map < "u" && s instanceof Map ? A.map : typeof Set < "u" && s instanceof Set ? A.set : typeof Date < "u" && s instanceof Date ? A.date : A.object;
    default:
      return A.unknown;
  }
}, w = j.arrayToEnum([
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
class Ie extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, n = { _errors: [] }, a = (r) => {
      for (const i of r.issues)
        if (i.code === "invalid_union")
          i.unionErrors.map(a);
        else if (i.code === "invalid_return_type")
          a(i.returnTypeError);
        else if (i.code === "invalid_arguments")
          a(i.argumentsError);
        else if (i.path.length === 0)
          n._errors.push(t(i));
        else {
          let o = n, c = 0;
          for (; c < i.path.length; ) {
            const d = i.path[c];
            c === i.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(i))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return a(this), n;
  }
  static assert(e) {
    if (!(e instanceof Ie))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, j.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const a of this.issues)
      if (a.path.length > 0) {
        const r = a.path[0];
        t[r] = t[r] || [], t[r].push(e(a));
      } else
        n.push(e(a));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
Ie.create = (s) => new Ie(s);
const Ps = (s, e) => {
  let t;
  switch (s.code) {
    case w.invalid_type:
      s.received === A.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case w.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, j.jsonStringifyReplacer)}`;
      break;
    case w.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${j.joinValues(s.keys, ", ")}`;
      break;
    case w.invalid_union:
      t = "Invalid input";
      break;
    case w.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${j.joinValues(s.options)}`;
      break;
    case w.invalid_enum_value:
      t = `Invalid enum value. Expected ${j.joinValues(s.options)}, received '${s.received}'`;
      break;
    case w.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case w.invalid_return_type:
      t = "Invalid function return type";
      break;
    case w.invalid_date:
      t = "Invalid date";
      break;
    case w.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : j.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case w.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case w.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case w.custom:
      t = "Invalid input";
      break;
    case w.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case w.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case w.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, j.assertNever(s);
  }
  return { message: t };
};
let sr = Ps;
function nr() {
  return sr;
}
const ar = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: a } = s, r = [...t, ...a.path || []], i = {
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
  const c = n.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(i, { data: e, defaultError: o }).message;
  return {
    ...a,
    path: r,
    message: o
  };
};
function I(s, e) {
  const t = nr(), n = ar({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === Ps ? void 0 : Ps
      // then global default map
    ].filter((a) => !!a)
  });
  s.common.issues.push(n);
}
class ne {
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
    const n = [];
    for (const a of t) {
      if (a.status === "aborted")
        return N;
      a.status === "dirty" && e.dirty(), n.push(a.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const a of t) {
      const r = await a.key, i = await a.value;
      n.push({
        key: r,
        value: i
      });
    }
    return ne.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const a of t) {
      const { key: r, value: i } = a;
      if (r.status === "aborted" || i.status === "aborted")
        return N;
      r.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof i.value < "u" || a.alwaysSet) && (n[r.value] = i.value);
    }
    return { status: e.value, value: n };
  }
}
const N = Object.freeze({
  status: "aborted"
}), Bt = (s) => ({ status: "dirty", value: s }), le = (s) => ({ status: "valid", value: s }), on = (s) => s.status === "aborted", cn = (s) => s.status === "dirty", At = (s) => s.status === "valid", us = (s) => typeof Promise < "u" && s instanceof Promise;
var T;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(T || (T = {}));
class Se {
  constructor(e, t, n, a) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = a;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const dn = (s, e) => {
  if (At(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new Ie(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function U(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: a } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: a } : { errorMap: (i, o) => {
    const { message: c } = s;
    return i.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? n ?? o.defaultError } : i.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: a };
}
class B {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Pe(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Pe(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new ne(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Pe(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (us(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: (t == null ? void 0 : t.async) ?? !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Pe(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return dn(n, a);
  }
  "~validate"(e) {
    var n, a;
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Pe(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return At(r) ? {
          value: r.value
        } : {
          issues: t.common.issues
        };
      } catch (r) {
        (a = (n = r == null ? void 0 : r.message) == null ? void 0 : n.toLowerCase()) != null && a.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => At(r) ? {
      value: r.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t == null ? void 0 : t.errorMap,
        async: !0
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Pe(e)
    }, a = this._parse({ data: e, path: n.path, parent: n }), r = await (us(a) ? a : Promise.resolve(a));
    return dn(n, r);
  }
  refine(e, t) {
    const n = (a) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(a) : t;
    return this._refinement((a, r) => {
      const i = e(a), o = () => r.addIssue({
        code: w.custom,
        ...n(a)
      });
      return typeof Promise < "u" && i instanceof Promise ? i.then((c) => c ? !0 : (o(), !1)) : i ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, a) => e(n) ? !0 : (a.addIssue(typeof t == "function" ? t(n, a) : t), !1));
  }
  _refinement(e) {
    return new xt({
      schema: this,
      typeName: R.ZodEffects,
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
    return He.create(this, this._def);
  }
  nullable() {
    return Ct.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ve.create(this);
  }
  promise() {
    return gs.create(this, this._def);
  }
  or(e) {
    return ps.create([this, e], this._def);
  }
  and(e) {
    return fs.create(this, e, this._def);
  }
  transform(e) {
    return new xt({
      ...U(this._def),
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Bs({
      ...U(this._def),
      innerType: this,
      defaultValue: t,
      typeName: R.ZodDefault
    });
  }
  brand() {
    return new xr({
      typeName: R.ZodBranded,
      type: this,
      ...U(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new js({
      ...U(this._def),
      innerType: this,
      catchValue: t,
      typeName: R.ZodCatch
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
    return Vs.create(this, e);
  }
  readonly() {
    return Hs.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const rr = /^c[^\s-]{8,}$/i, ir = /^[0-9a-z]+$/, or = /^[0-9A-HJKMNP-TV-Z]{26}$/i, cr = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, dr = /^[a-z0-9_-]{21}$/i, lr = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, ur = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, hr = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, pr = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let bs;
const fr = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, mr = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, gr = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, _r = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, yr = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, wr = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Xn = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", vr = new RegExp(`^${Xn}$`);
function Qn(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Ir(s) {
  return new RegExp(`^${Qn(s)}$`);
}
function Sr(s) {
  let e = `${Xn}T${Qn(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Er(s, e) {
  return !!((e === "v4" || !e) && fr.test(s) || (e === "v6" || !e) && gr.test(s));
}
function Ar(s, e) {
  if (!lr.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), a = JSON.parse(atob(n));
    return !(typeof a != "object" || a === null || "typ" in a && (a == null ? void 0 : a.typ) !== "JWT" || !a.alg || e && a.alg !== e);
  } catch {
    return !1;
  }
}
function br(s, e) {
  return !!((e === "v4" || !e) && mr.test(s) || (e === "v6" || !e) && _r.test(s));
}
class Re extends B {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== A.string) {
      const r = this._getOrReturnCtx(e);
      return I(r, {
        code: w.invalid_type,
        expected: A.string,
        received: r.parsedType
      }), N;
    }
    const n = new ne();
    let a;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (a = this._getOrReturnCtx(e, a), I(a, {
          code: w.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (a = this._getOrReturnCtx(e, a), I(a, {
          code: w.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "length") {
        const i = e.data.length > r.value, o = e.data.length < r.value;
        (i || o) && (a = this._getOrReturnCtx(e, a), i ? I(a, {
          code: w.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && I(a, {
          code: w.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), n.dirty());
      } else if (r.kind === "email")
        hr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "email",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "emoji")
        bs || (bs = new RegExp(pr, "u")), bs.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "emoji",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "uuid")
        cr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "uuid",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "nanoid")
        dr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "nanoid",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid")
        rr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "cuid",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid2")
        ir.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "cuid2",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "ulid")
        or.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
          validation: "ulid",
          code: w.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          a = this._getOrReturnCtx(e, a), I(a, {
            validation: "url",
            code: w.invalid_string,
            message: r.message
          }), n.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "regex",
        code: w.invalid_string,
        message: r.message
      }), n.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), n.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "datetime" ? Sr(r).test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: "datetime",
        message: r.message
      }), n.dirty()) : r.kind === "date" ? vr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: "date",
        message: r.message
      }), n.dirty()) : r.kind === "time" ? Ir(r).test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.invalid_string,
        validation: "time",
        message: r.message
      }), n.dirty()) : r.kind === "duration" ? ur.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "duration",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "ip" ? Er(e.data, r.version) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "ip",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "jwt" ? Ar(e.data, r.alg) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "jwt",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "cidr" ? br(e.data, r.version) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "cidr",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64" ? yr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "base64",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64url" ? wr.test(e.data) || (a = this._getOrReturnCtx(e, a), I(a, {
        validation: "base64url",
        code: w.invalid_string,
        message: r.message
      }), n.dirty()) : j.assertNever(r);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((a) => e.test(a), {
      validation: t,
      code: w.invalid_string,
      ...T.errToObj(n)
    });
  }
  _addCheck(e) {
    return new Re({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...T.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...T.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...T.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...T.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...T.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...T.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...T.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...T.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...T.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...T.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...T.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...T.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...T.errToObj(e) });
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
      ...T.errToObj(e == null ? void 0 : e.message)
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
      ...T.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...T.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...T.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position,
      ...T.errToObj(t == null ? void 0 : t.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...T.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...T.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...T.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...T.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...T.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, T.errToObj(e));
  }
  trim() {
    return new Re({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Re({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Re({
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
Re.create = (s) => new Re({
  checks: [],
  typeName: R.ZodString,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...U(s)
});
function Tr(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, a = t > n ? t : n, r = Number.parseInt(s.toFixed(a).replace(".", "")), i = Number.parseInt(e.toFixed(a).replace(".", ""));
  return r % i / 10 ** a;
}
class bt extends B {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== A.number) {
      const r = this._getOrReturnCtx(e);
      return I(r, {
        code: w.invalid_type,
        expected: A.number,
        received: r.parsedType
      }), N;
    }
    let n;
    const a = new ne();
    for (const r of this._def.checks)
      r.kind === "int" ? j.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), a.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? Tr(e.data, r.value) !== 0 && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.not_finite,
        message: r.message
      }), a.dirty()) : j.assertNever(r);
    return { status: a.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, T.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, T.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, T.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, T.toString(t));
  }
  setLimit(e, t, n, a) {
    return new bt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: T.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new bt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: T.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: T.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: T.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: T.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: T.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: T.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: T.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: T.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && j.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
bt.create = (s) => new bt({
  checks: [],
  typeName: R.ZodNumber,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...U(s)
});
class qt extends B {
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
    if (this._getType(e) !== A.bigint)
      return this._getInvalidInput(e);
    let n;
    const a = new ne();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), a.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), I(n, {
        code: w.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), a.dirty()) : j.assertNever(r);
    return { status: a.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return I(t, {
      code: w.invalid_type,
      expected: A.bigint,
      received: t.parsedType
    }), N;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, T.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, T.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, T.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, T.toString(t));
  }
  setLimit(e, t, n, a) {
    return new qt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: T.toString(a)
        }
      ]
    });
  }
  _addCheck(e) {
    return new qt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: T.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: T.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: T.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: T.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(t)
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
qt.create = (s) => new qt({
  checks: [],
  typeName: R.ZodBigInt,
  coerce: (s == null ? void 0 : s.coerce) ?? !1,
  ...U(s)
});
class $s extends B {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== A.boolean) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.boolean,
        received: n.parsedType
      }), N;
    }
    return le(e.data);
  }
}
$s.create = (s) => new $s({
  typeName: R.ZodBoolean,
  coerce: (s == null ? void 0 : s.coerce) || !1,
  ...U(s)
});
class hs extends B {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== A.date) {
      const r = this._getOrReturnCtx(e);
      return I(r, {
        code: w.invalid_type,
        expected: A.date,
        received: r.parsedType
      }), N;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return I(r, {
        code: w.invalid_date
      }), N;
    }
    const n = new ne();
    let a;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), n.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (a = this._getOrReturnCtx(e, a), I(a, {
        code: w.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), n.dirty()) : j.assertNever(r);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new hs({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: T.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: T.toString(t)
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
hs.create = (s) => new hs({
  checks: [],
  coerce: (s == null ? void 0 : s.coerce) || !1,
  typeName: R.ZodDate,
  ...U(s)
});
class ln extends B {
  _parse(e) {
    if (this._getType(e) !== A.symbol) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.symbol,
        received: n.parsedType
      }), N;
    }
    return le(e.data);
  }
}
ln.create = (s) => new ln({
  typeName: R.ZodSymbol,
  ...U(s)
});
class un extends B {
  _parse(e) {
    if (this._getType(e) !== A.undefined) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.undefined,
        received: n.parsedType
      }), N;
    }
    return le(e.data);
  }
}
un.create = (s) => new un({
  typeName: R.ZodUndefined,
  ...U(s)
});
class hn extends B {
  _parse(e) {
    if (this._getType(e) !== A.null) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.null,
        received: n.parsedType
      }), N;
    }
    return le(e.data);
  }
}
hn.create = (s) => new hn({
  typeName: R.ZodNull,
  ...U(s)
});
class pn extends B {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return le(e.data);
  }
}
pn.create = (s) => new pn({
  typeName: R.ZodAny,
  ...U(s)
});
class Ls extends B {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return le(e.data);
  }
}
Ls.create = (s) => new Ls({
  typeName: R.ZodUnknown,
  ...U(s)
});
class qe extends B {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return I(t, {
      code: w.invalid_type,
      expected: A.never,
      received: t.parsedType
    }), N;
  }
}
qe.create = (s) => new qe({
  typeName: R.ZodNever,
  ...U(s)
});
class fn extends B {
  _parse(e) {
    if (this._getType(e) !== A.undefined) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.void,
        received: n.parsedType
      }), N;
    }
    return le(e.data);
  }
}
fn.create = (s) => new fn({
  typeName: R.ZodVoid,
  ...U(s)
});
class ve extends B {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), a = this._def;
    if (t.parsedType !== A.array)
      return I(t, {
        code: w.invalid_type,
        expected: A.array,
        received: t.parsedType
      }), N;
    if (a.exactLength !== null) {
      const i = t.data.length > a.exactLength.value, o = t.data.length < a.exactLength.value;
      (i || o) && (I(t, {
        code: i ? w.too_big : w.too_small,
        minimum: o ? a.exactLength.value : void 0,
        maximum: i ? a.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: a.exactLength.message
      }), n.dirty());
    }
    if (a.minLength !== null && t.data.length < a.minLength.value && (I(t, {
      code: w.too_small,
      minimum: a.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.minLength.message
    }), n.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (I(t, {
      code: w.too_big,
      maximum: a.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: a.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((i, o) => a.type._parseAsync(new Se(t, i, t.path, o)))).then((i) => ne.mergeArray(n, i));
    const r = [...t.data].map((i, o) => a.type._parseSync(new Se(t, i, t.path, o)));
    return ne.mergeArray(n, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new ve({
      ...this._def,
      minLength: { value: e, message: T.toString(t) }
    });
  }
  max(e, t) {
    return new ve({
      ...this._def,
      maxLength: { value: e, message: T.toString(t) }
    });
  }
  length(e, t) {
    return new ve({
      ...this._def,
      exactLength: { value: e, message: T.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ve.create = (s, e) => new ve({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: R.ZodArray,
  ...U(e)
});
function gt(s) {
  if (s instanceof J) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = He.create(gt(n));
    }
    return new J({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof ve ? new ve({
    ...s._def,
    type: gt(s.element)
  }) : s instanceof He ? He.create(gt(s.unwrap())) : s instanceof Ct ? Ct.create(gt(s.unwrap())) : s instanceof tt ? tt.create(s.items.map((e) => gt(e))) : s;
}
class J extends B {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = j.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== A.object) {
      const d = this._getOrReturnCtx(e);
      return I(d, {
        code: w.invalid_type,
        expected: A.object,
        received: d.parsedType
      }), N;
    }
    const { status: n, ctx: a } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof qe && this._def.unknownKeys === "strip"))
      for (const d in a.data)
        i.includes(d) || o.push(d);
    const c = [];
    for (const d of i) {
      const l = r[d], u = a.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new Se(a, u, a.path, d)),
        alwaysSet: d in a.data
      });
    }
    if (this._def.catchall instanceof qe) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: a.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (I(a, {
          code: w.unrecognized_keys,
          keys: o
        }), n.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const u = a.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new Se(a, u, a.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in a.data
        });
      }
    }
    return a.common.async ? Promise.resolve().then(async () => {
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
    }).then((d) => ne.mergeObjectSync(n, d)) : ne.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return T.errToObj, new J({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          var r, i;
          const a = ((i = (r = this._def).errorMap) == null ? void 0 : i.call(r, t, n).message) ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: T.errToObj(e).message ?? a
          } : {
            message: a
          };
        }
      } : {}
    });
  }
  strip() {
    return new J({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new J({
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
    return new J({
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
    return new J({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: R.ZodObject
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
    return new J({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of j.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new J({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of j.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new J({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return gt(this);
  }
  partial(e) {
    const t = {};
    for (const n of j.objectKeys(this.shape)) {
      const a = this.shape[n];
      e && !e[n] ? t[n] = a : t[n] = a.optional();
    }
    return new J({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of j.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let r = this.shape[n];
        for (; r instanceof He; )
          r = r._def.innerType;
        t[n] = r;
      }
    return new J({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return ea(j.objectKeys(this.shape));
  }
}
J.create = (s, e) => new J({
  shape: () => s,
  unknownKeys: "strip",
  catchall: qe.create(),
  typeName: R.ZodObject,
  ...U(e)
});
J.strictCreate = (s, e) => new J({
  shape: () => s,
  unknownKeys: "strict",
  catchall: qe.create(),
  typeName: R.ZodObject,
  ...U(e)
});
J.lazycreate = (s, e) => new J({
  shape: s,
  unknownKeys: "strip",
  catchall: qe.create(),
  typeName: R.ZodObject,
  ...U(e)
});
class ps extends B {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function a(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const i = r.map((o) => new Ie(o.ctx.common.issues));
      return I(t, {
        code: w.invalid_union,
        unionErrors: i
      }), N;
    }
    if (t.common.async)
      return Promise.all(n.map(async (r) => {
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
      for (const c of n) {
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
      const o = i.map((c) => new Ie(c));
      return I(t, {
        code: w.invalid_union,
        unionErrors: o
      }), N;
    }
  }
  get options() {
    return this._def.options;
  }
}
ps.create = (s, e) => new ps({
  options: s,
  typeName: R.ZodUnion,
  ...U(e)
});
function Fs(s, e) {
  const t = Pe(s), n = Pe(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === A.object && n === A.object) {
    const a = j.objectKeys(e), r = j.objectKeys(s).filter((o) => a.indexOf(o) !== -1), i = { ...s, ...e };
    for (const o of r) {
      const c = Fs(s[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      i[o] = c.data;
    }
    return { valid: !0, data: i };
  } else if (t === A.array && n === A.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const a = [];
    for (let r = 0; r < s.length; r++) {
      const i = s[r], o = e[r], c = Fs(i, o);
      if (!c.valid)
        return { valid: !1 };
      a.push(c.data);
    }
    return { valid: !0, data: a };
  } else return t === A.date && n === A.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class fs extends B {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = (r, i) => {
      if (on(r) || on(i))
        return N;
      const o = Fs(r.value, i.value);
      return o.valid ? ((cn(r) || cn(i)) && t.dirty(), { status: t.value, value: o.data }) : (I(n, {
        code: w.invalid_intersection_types
      }), N);
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
    ]).then(([r, i]) => a(r, i)) : a(this._def.left._parseSync({
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
fs.create = (s, e, t) => new fs({
  left: s,
  right: e,
  typeName: R.ZodIntersection,
  ...U(t)
});
class tt extends B {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== A.array)
      return I(n, {
        code: w.invalid_type,
        expected: A.array,
        received: n.parsedType
      }), N;
    if (n.data.length < this._def.items.length)
      return I(n, {
        code: w.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), N;
    !this._def.rest && n.data.length > this._def.items.length && (I(n, {
      code: w.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...n.data].map((i, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new Se(n, i, n.path, o)) : null;
    }).filter((i) => !!i);
    return n.common.async ? Promise.all(r).then((i) => ne.mergeArray(t, i)) : ne.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new tt({
      ...this._def,
      rest: e
    });
  }
}
tt.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new tt({
    items: s,
    typeName: R.ZodTuple,
    rest: null,
    ...U(e)
  });
};
class ms extends B {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== A.object)
      return I(n, {
        code: w.invalid_type,
        expected: A.object,
        received: n.parsedType
      }), N;
    const a = [], r = this._def.keyType, i = this._def.valueType;
    for (const o in n.data)
      a.push({
        key: r._parse(new Se(n, o, n.path, o)),
        value: i._parse(new Se(n, n.data[o], n.path, o)),
        alwaysSet: o in n.data
      });
    return n.common.async ? ne.mergeObjectAsync(t, a) : ne.mergeObjectSync(t, a);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof B ? new ms({
      keyType: e,
      valueType: t,
      typeName: R.ZodRecord,
      ...U(n)
    }) : new ms({
      keyType: Re.create(),
      valueType: e,
      typeName: R.ZodRecord,
      ...U(t)
    });
  }
}
class mn extends B {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== A.map)
      return I(n, {
        code: w.invalid_type,
        expected: A.map,
        received: n.parsedType
      }), N;
    const a = this._def.keyType, r = this._def.valueType, i = [...n.data.entries()].map(([o, c], d) => ({
      key: a._parse(new Se(n, o, n.path, [d, "key"])),
      value: r._parse(new Se(n, c, n.path, [d, "value"]))
    }));
    if (n.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of i) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return N;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of i) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return N;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
mn.create = (s, e, t) => new mn({
  valueType: e,
  keyType: s,
  typeName: R.ZodMap,
  ...U(t)
});
class Wt extends B {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== A.set)
      return I(n, {
        code: w.invalid_type,
        expected: A.set,
        received: n.parsedType
      }), N;
    const a = this._def;
    a.minSize !== null && n.data.size < a.minSize.value && (I(n, {
      code: w.too_small,
      minimum: a.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: a.minSize.message
    }), t.dirty()), a.maxSize !== null && n.data.size > a.maxSize.value && (I(n, {
      code: w.too_big,
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
          return N;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...n.data.values()].map((c, d) => r._parse(new Se(n, c, n.path, d)));
    return n.common.async ? Promise.all(o).then((c) => i(c)) : i(o);
  }
  min(e, t) {
    return new Wt({
      ...this._def,
      minSize: { value: e, message: T.toString(t) }
    });
  }
  max(e, t) {
    return new Wt({
      ...this._def,
      maxSize: { value: e, message: T.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Wt.create = (s, e) => new Wt({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: R.ZodSet,
  ...U(e)
});
class gn extends B {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
gn.create = (s, e) => new gn({
  getter: s,
  typeName: R.ZodLazy,
  ...U(e)
});
class _n extends B {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return I(t, {
        received: t.data,
        code: w.invalid_literal,
        expected: this._def.value
      }), N;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
_n.create = (s, e) => new _n({
  value: s,
  typeName: R.ZodLiteral,
  ...U(e)
});
function ea(s, e) {
  return new Tt({
    values: s,
    typeName: R.ZodEnum,
    ...U(e)
  });
}
class Tt extends B {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return I(t, {
        expected: j.joinValues(n),
        received: t.parsedType,
        code: w.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return I(t, {
        received: t.data,
        code: w.invalid_enum_value,
        options: n
      }), N;
    }
    return le(e.data);
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
    return Tt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Tt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Tt.create = ea;
class yn extends B {
  _parse(e) {
    const t = j.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== A.string && n.parsedType !== A.number) {
      const a = j.objectValues(t);
      return I(n, {
        expected: j.joinValues(a),
        received: n.parsedType,
        code: w.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(j.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const a = j.objectValues(t);
      return I(n, {
        received: n.data,
        code: w.invalid_enum_value,
        options: a
      }), N;
    }
    return le(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
yn.create = (s, e) => new yn({
  values: s,
  typeName: R.ZodNativeEnum,
  ...U(e)
});
class gs extends B {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== A.promise && t.common.async === !1)
      return I(t, {
        code: w.invalid_type,
        expected: A.promise,
        received: t.parsedType
      }), N;
    const n = t.parsedType === A.promise ? t.data : Promise.resolve(t.data);
    return le(n.then((a) => this._def.type.parseAsync(a, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
gs.create = (s, e) => new gs({
  type: s,
  typeName: R.ZodPromise,
  ...U(e)
});
class xt extends B {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === R.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), a = this._def.effect || null, r = {
      addIssue: (i) => {
        I(n, i), i.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), a.type === "preprocess") {
      const i = a.transform(n.data, r);
      if (n.common.async)
        return Promise.resolve(i).then(async (o) => {
          if (t.value === "aborted")
            return N;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? N : c.status === "dirty" || t.value === "dirty" ? Bt(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return N;
        const o = this._def.schema._parseSync({
          data: i,
          path: n.path,
          parent: n
        });
        return o.status === "aborted" ? N : o.status === "dirty" || t.value === "dirty" ? Bt(o.value) : o;
      }
    }
    if (a.type === "refinement") {
      const i = (o) => {
        const c = a.refinement(o, r);
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
        return o.status === "aborted" ? N : (o.status === "dirty" && t.dirty(), i(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => o.status === "aborted" ? N : (o.status === "dirty" && t.dirty(), i(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (a.type === "transform")
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!At(i))
          return N;
        const o = a.transform(i.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((i) => At(i) ? Promise.resolve(a.transform(i.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : N);
    j.assertNever(a);
  }
}
xt.create = (s, e, t) => new xt({
  schema: s,
  typeName: R.ZodEffects,
  effect: e,
  ...U(t)
});
xt.createWithPreprocess = (s, e, t) => new xt({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: R.ZodEffects,
  ...U(t)
});
class He extends B {
  _parse(e) {
    return this._getType(e) === A.undefined ? le(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
He.create = (s, e) => new He({
  innerType: s,
  typeName: R.ZodOptional,
  ...U(e)
});
class Ct extends B {
  _parse(e) {
    return this._getType(e) === A.null ? le(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ct.create = (s, e) => new Ct({
  innerType: s,
  typeName: R.ZodNullable,
  ...U(e)
});
class Bs extends B {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === A.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Bs.create = (s, e) => new Bs({
  innerType: s,
  typeName: R.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...U(e)
});
class js extends B {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, a = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return us(a) ? a.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new Ie(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new Ie(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
js.create = (s, e) => new js({
  innerType: s,
  typeName: R.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...U(e)
});
class wn extends B {
  _parse(e) {
    if (this._getType(e) !== A.nan) {
      const n = this._getOrReturnCtx(e);
      return I(n, {
        code: w.invalid_type,
        expected: A.nan,
        received: n.parsedType
      }), N;
    }
    return { status: "valid", value: e.data };
  }
}
wn.create = (s) => new wn({
  typeName: R.ZodNaN,
  ...U(s)
});
class xr extends B {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Vs extends B {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return r.status === "aborted" ? N : r.status === "dirty" ? (t.dirty(), Bt(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const a = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return a.status === "aborted" ? N : a.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: a.value
      }) : this._def.out._parseSync({
        data: a.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Vs({
      in: e,
      out: t,
      typeName: R.ZodPipeline
    });
  }
}
class Hs extends B {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (a) => (At(a) && (a.value = Object.freeze(a.value)), a);
    return us(t) ? t.then((a) => n(a)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Hs.create = (s, e) => new Hs({
  innerType: s,
  typeName: R.ZodReadonly,
  ...U(e)
});
var R;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(R || (R = {}));
const v = Re.create, re = bt.create, oe = $s.create, ta = Ls.create;
qe.create;
const vs = ve.create, F = J.create;
ps.create;
fs.create;
tt.create;
const sa = ms.create, kt = Tt.create;
gs.create;
He.create;
Ct.create;
class g extends Error {
  constructor(e, t, n = 400, a) {
    super(t), this.code = e, this.status = n, this.details = a;
  }
}
function Cr(s) {
  return s instanceof g;
}
function Ts(s, e, t = {}) {
  const n = JSON.stringify({
    level: s,
    event: e,
    ...t
  });
  if (s === "error") {
    console.error(n);
    return;
  }
  if (s === "warn") {
    console.warn(n);
    return;
  }
  console.log(n);
}
const me = {
  info: (s, e) => Ts("info", s, e),
  warn: (s, e) => Ts("warn", s, e),
  error: (s, e) => Ts("error", s, e)
};
function kr() {
  return async (s, e) => {
    try {
      await e();
    } catch (t) {
      return na(t, s);
    }
  };
}
function na(s, e) {
  const t = e.get("requestId");
  return Cr(s) ? (me.warn("app_error", { requestId: t, code: s.code, message: s.message }), e.json({ error: { code: s.code, message: s.message, details: s.details } }, s.status)) : s instanceof Ie ? (me.warn("validation_error", { requestId: t, issues: s.issues }), e.json(
    { error: { code: "VALIDATION_ERROR", message: "Invalid request", details: s.flatten() } },
    400
  )) : (me.error("unhandled_error", {
    requestId: t,
    message: s instanceof Error ? s.message : String(s)
  }), e.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500));
}
function Y(s) {
  const e = new Uint8Array(16);
  crypto.getRandomValues(e);
  const t = Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("");
  return `${s}_${t}`;
}
function Or() {
  return async (s, e) => {
    const t = s.req.header("x-request-id") || Y("req");
    s.set("requestId", t), s.header("x-request-id", t), await e();
  };
}
class Rr {
  constructor(e) {
    this.adapters = e;
  }
  get(e) {
    const t = this.adapters.find((n) => n.type === e);
    if (!t)
      throw new g("CHANNEL_NOT_SUPPORTED", `Unsupported channel: ${e}`, 400);
    return t;
  }
}
async function vn(s) {
  const e = new TextEncoder().encode(s), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t), (n) => n.toString(16).padStart(2, "0")).join("");
}
async function In(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return Array.from(new Uint8Array(n), (a) => a.toString(16).padStart(2, "0")).join("");
}
async function st(s, e) {
  const t = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), n = await crypto.subtle.sign("HMAC", t, new TextEncoder().encode(e));
  return ge(new Uint8Array(n));
}
function Ot(s, e) {
  if (s.length !== e.length) return !1;
  let t = 0;
  for (let n = 0; n < s.length; n += 1)
    t |= s.charCodeAt(n) ^ e.charCodeAt(n);
  return t === 0;
}
function ge(s) {
  const e = typeof s == "string" ? new TextEncoder().encode(s) : s;
  let t = "";
  for (const n of e) t += String.fromCharCode(n);
  return btoa(t).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
function Js(s) {
  return new TextDecoder().decode(aa(s));
}
function aa(s) {
  const e = s.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(s.length / 4) * 4, "="), t = atob(e), n = new Uint8Array(t.length);
  for (let a = 0; a < t.length; a += 1)
    n[a] = t.charCodeAt(a);
  return n;
}
async function ra(s, e = crypto.getRandomValues(new Uint8Array(16))) {
  const n = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), a = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: e, iterations: 1e5, hash: "SHA-256" },
    n,
    256
  );
  return `pbkdf2_sha256$100000$${ge(e)}$${ge(new Uint8Array(a))}`;
}
async function qs(s, e) {
  if (!e) return !1;
  const [t, n, a, r] = e.split("$");
  if (t !== "pbkdf2_sha256" || !n || !a || !r) return !1;
  const i = Number(n);
  if (!Number.isInteger(i) || i < 1e4) return !1;
  const o = await crypto.subtle.importKey("raw", new TextEncoder().encode(s), "PBKDF2", !1, ["deriveBits"]), c = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: aa(a), iterations: i, hash: "SHA-256" },
    o,
    256
  );
  return Ot(ge(new Uint8Array(c)), r);
}
function M() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
const Nr = F({
  event_id: v().optional(),
  event_type: v().default("message.created"),
  contact: F({
    external_id: v().optional(),
    name: v().optional(),
    avatar_url: v().optional()
  }).optional(),
  message: F({
    external_id: v().optional(),
    type: kt(["text", "image", "file", "audio", "video", "event"]).default("text"),
    text: v().optional(),
    attachments: vs(sa(ta())).default([])
  }),
  timestamp: v().optional()
});
class Mr {
  constructor() {
    y(this, "type", "custom_webhook");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-supportly-signature");
    if (!n)
      throw new g("SIGNATURE_INVALID", "Missing webhook signature", 401);
    const a = await e.text(), r = await In(t.webhookSecretCiphertext, a);
    if (!Ot(n, r))
      throw new g("SIGNATURE_INVALID", "Invalid webhook signature", 401);
  }
  async parseInbound(e, t) {
    var i, o, c, d, l;
    const n = Nr.parse(await e.json()), a = ((i = n.contact) == null ? void 0 : i.external_id) ?? n.event_id ?? await vn(JSON.stringify(n)), r = ((o = n.contact) == null ? void 0 : o.external_id) ?? `anonymous:${await vn(`${t.id}:${a}`)}`;
    return [
      {
        externalMessageId: n.message.external_id ?? n.event_id,
        externalContactId: r,
        externalThreadId: a,
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
        receivedAt: n.timestamp ?? M()
      }
    ];
  }
  async sendMessage(e, t) {
    if (!e.outboundUrl)
      return { externalMessageId: t.messageId };
    const n = {
      event_type: "message.send",
      conversation_id: t.conversationId,
      message_id: t.messageId,
      message: {
        type: t.messageType,
        text: t.content,
        attachments: t.attachments ?? []
      }
    }, a = JSON.stringify(n), r = new Headers({ "content-type": "application/json" });
    e.webhookSecretCiphertext && r.set("x-supportly-signature", await In(e.webhookSecretCiphertext, a));
    const i = await fetch(e.outboundUrl, {
      method: "POST",
      headers: r,
      body: a
    });
    if (!i.ok)
      throw new g("MESSAGE_SEND_FAILED", `Outbound webhook failed: ${i.status}`, 502);
    return { externalMessageId: t.messageId };
  }
}
class Dr {
  constructor() {
    y(this, "type", "forum");
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
const ia = F({
  id: re(),
  is_bot: oe().optional(),
  first_name: v().optional(),
  last_name: v().optional(),
  username: v().optional()
}), Ur = F({
  id: re(),
  type: v(),
  first_name: v().optional(),
  last_name: v().optional(),
  username: v().optional(),
  title: v().optional()
}), Pr = F({
  file_id: v(),
  file_unique_id: v(),
  file_size: re().optional(),
  width: re(),
  height: re()
}), $r = F({
  message_id: re(),
  date: re(),
  chat: Ur,
  from: ia.optional(),
  text: v().optional(),
  caption: v().optional(),
  photo: vs(Pr).optional(),
  reply_to_message: F({
    message_id: re(),
    text: v().optional(),
    caption: v().optional()
  }).optional()
}), Lr = F({
  update_id: re(),
  message: $r.optional()
}), Sn = F({
  ok: oe(),
  result: F({
    message_id: re()
  }).optional(),
  description: v().optional()
}), Fr = F({
  ok: oe(),
  result: oe().optional(),
  description: v().optional()
}), Br = F({
  ok: oe(),
  result: ia.extend({
    can_join_groups: oe().optional(),
    can_read_all_group_messages: oe().optional(),
    supports_inline_queries: oe().optional()
  }).optional(),
  description: v().optional()
}), jr = F({
  ok: oe(),
  result: F({
    url: v(),
    has_custom_certificate: oe().optional(),
    pending_update_count: re(),
    ip_address: v().optional(),
    last_error_date: re().optional(),
    last_error_message: v().optional(),
    last_synchronization_error_date: re().optional(),
    max_connections: re().optional(),
    allowed_updates: vs(v()).optional()
  }).optional(),
  description: v().optional()
});
class oa {
  constructor() {
    y(this, "type", "telegram");
  }
  async verify(e, t) {
    if (!t.webhookSecretCiphertext) return;
    const n = e.headers.get("x-telegram-bot-api-secret-token");
    if (!n || !Ot(n, t.webhookSecretCiphertext))
      throw new g("SIGNATURE_INVALID", "Invalid Telegram webhook secret", 401);
  }
  async parseInbound(e, t, n) {
    var c, d;
    const a = Lr.parse(await e.json()), r = a.message;
    if (!r || !r.from)
      return [];
    const i = String(r.from.id), o = String(r.chat.id);
    return n && (i === n || o === n) ? this.parseAdminReply(a, r, t, n) : (c = r.text) != null && c.trim() ? [
      {
        externalMessageId: String(a.update_id),
        externalContactId: i,
        externalThreadId: String(r.chat.id),
        contactName: Pt(r.from) ?? Pt(r.chat),
        isAnonymous: !1,
        messageType: "text",
        content: r.text,
        attachments: [],
        rawPayload: a,
        receivedAt: new Date(r.date * 1e3).toISOString()
      }
    ] : (d = r.photo) != null && d.length ? this.parsePhotoInbound(a, r, t) : [];
  }
  async parseAdminReply(e, t, n, a) {
    const r = t.reply_to_message;
    if (!(r != null && r.text))
      return await this.sendWarning(n, a, t.message_id), [];
    const i = r.text.match(/#conv_(\w+)/);
    return i ? [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(t.from.id),
        externalThreadId: String(t.chat.id),
        contactName: Pt(t.from) ?? "Admin",
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
    ] : (await this.sendWarning(n, a, t.message_id), []);
  }
  async parsePhotoInbound(e, t, n) {
    const a = n.credentialCiphertext;
    if (!a) return [];
    const r = t.photo.reduce((o, c) => (o.file_size ?? 0) > (c.file_size ?? 0) ? o : c), i = await this.getFileUrl(a, r.file_id);
    return [
      {
        externalMessageId: String(e.update_id),
        externalContactId: String(t.from.id),
        externalThreadId: String(t.chat.id),
        contactName: Pt(t.from) ?? Pt(t.chat),
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
  async sendWarning(e, t, n) {
    const a = e.credentialCiphertext;
    if (a)
      try {
        await fetch(`https://api.telegram.org/bot${a}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: t,
            reply_to_message_id: n,
            text: "⚠️ 普通回复无效，请<b>引用回复</b>通知消息，否则客户不会收到任何回复。",
            parse_mode: "HTML"
          })
        });
      } catch {
      }
  }
  async sendMessage(e, t) {
    const n = e.credentialCiphertext;
    if (!n)
      throw new g("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    if (t.messageType === "image" && t.fileData)
      return this.sendPhoto(e, t);
    if (t.messageType !== "text")
      throw new g("MESSAGE_TYPE_NOT_SUPPORTED", "Telegram media outbound is not supported yet", 400);
    const a = await fetch(`https://api.telegram.org/bot${n}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: t.externalThreadId,
        text: t.content ?? ""
      })
    }), r = Sn.parse(await a.json().catch(() => ({ ok: !1 })));
    if (!a.ok || !r.ok || !r.result)
      throw new g(
        "MESSAGE_SEND_FAILED",
        `Telegram sendMessage failed: ${a.status}${r.description ? ` ${r.description}` : ""}`,
        502
      );
    return { externalMessageId: String(r.result.message_id) };
  }
  async sendPhoto(e, t) {
    const n = e.credentialCiphertext, a = new FormData();
    a.append("chat_id", t.externalThreadId), a.append("photo", new Blob([t.fileData]), t.fileName ?? "photo.jpg"), t.content && (a.append("caption", t.content), a.append("parse_mode", "HTML"));
    const r = await fetch(`https://api.telegram.org/bot${n}/sendPhoto`, {
      method: "POST",
      body: a
    }), i = Sn.parse(await r.json().catch(() => ({ ok: !1 })));
    if (!r.ok || !i.ok || !i.result)
      throw new g(
        "MESSAGE_SEND_FAILED",
        `Telegram sendPhoto failed: ${r.status}${i.description ? ` ${i.description}` : ""}`,
        502
      );
    return { externalMessageId: String(i.result.message_id) };
  }
  async setWebhook(e, t) {
    const n = Fr.parse(
      await this.callTelegram(e, "setWebhook", {
        url: t.webhookUrl,
        secret_token: e.webhookSecretCiphertext || void 0,
        allowed_updates: ["message"],
        drop_pending_updates: t.dropPendingUpdates ?? !1
      })
    );
    if (!n.ok || !n.result)
      throw new g("TELEGRAM_SET_WEBHOOK_FAILED", n.description ?? "Telegram setWebhook failed", 502);
    return {
      ok: !0,
      description: n.description,
      webhookUrl: t.webhookUrl,
      webhookInfo: await this.getWebhookInfo(e)
    };
  }
  async testConnection(e, t) {
    const n = await this.getMe(e), a = await this.getWebhookInfo(e);
    return {
      bot: n,
      webhookInfo: a,
      webhookUrlMatches: t ? a.url === t : !!a.url,
      expectedWebhookUrl: t
    };
  }
  async getMe(e) {
    const t = Br.parse(await this.callTelegram(e, "getMe"));
    if (!t.ok || !t.result)
      throw new g("TELEGRAM_GET_ME_FAILED", t.description ?? "Telegram getMe failed", 502);
    return {
      id: t.result.id,
      isBot: t.result.is_bot,
      firstName: t.result.first_name,
      username: t.result.username
    };
  }
  async getWebhookInfo(e) {
    const t = jr.parse(await this.callTelegram(e, "getWebhookInfo"));
    if (!t.ok || !t.result)
      throw new g("TELEGRAM_GET_WEBHOOK_INFO_FAILED", t.description ?? "Telegram getWebhookInfo failed", 502);
    return {
      url: t.result.url,
      pendingUpdateCount: t.result.pending_update_count,
      lastErrorDate: t.result.last_error_date,
      lastErrorMessage: t.result.last_error_message,
      allowedUpdates: t.result.allowed_updates
    };
  }
  async callTelegram(e, t, n) {
    const a = e.credentialCiphertext;
    if (!a)
      throw new g("CHANNEL_CREDENTIAL_MISSING", "Telegram bot token is missing", 400);
    const r = await fetch(`https://api.telegram.org/bot${a}/${t}`, {
      method: n ? "POST" : "GET",
      headers: n ? { "content-type": "application/json" } : void 0,
      body: n ? JSON.stringify(n) : void 0
    }), i = await r.json().catch(() => ({ ok: !1 }));
    if (!r.ok) {
      const o = typeof i == "object" && i && "description" in i ? String(i.description) : `HTTP ${r.status}`;
      throw new g("TELEGRAM_API_FAILED", `Telegram ${t} failed: ${o}`, 502);
    }
    return i;
  }
}
function Pt(s) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ").trim() || s.username || s.title || void 0;
}
class Hr {
  constructor() {
    y(this, "type", "web_chat");
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
class qr {
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
    let n = 1;
    for (; ; ) {
      const a = await this.search.items.list({
        page: n,
        per_page: 50,
        sort_by: "modified_at"
      }), r = a.result ?? [];
      e.push(...r);
      const i = a.result_info, o = (i == null ? void 0 : i.total_count) ?? e.length, c = (i == null ? void 0 : i.page) ?? n, d = (i == null ? void 0 : i.per_page) ?? 50;
      if (e.length >= o || r.length === 0 || (n = c + 1, n > Math.ceil(o / d) + 1)) break;
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
        var a, r, i, o, c;
        return {
          id: n.id,
          title: String(((r = (a = n.item) == null ? void 0 : a.metadata) == null ? void 0 : r.filename) ?? ((i = n.item) == null ? void 0 : i.key) ?? "Knowledge"),
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
const Wr = "@cf/meta/llama-3.1-8b-instruct", zr = "kb/", Vr = 4 * 1024 * 1024, Jr = "media/", Gr = 10 * 1024 * 1024, Kr = 50 * 1024 * 1024;
class Zr {
  constructor(e, t) {
    this.ai = e, this.env = t;
  }
  async generateKnowledgeReply(e) {
    const t = this.env.DEFAULT_AI_MODEL || Wr, n = Date.now(), a = Yr(e.question, e.references), r = await this.ai.run(t, { prompt: a });
    return {
      text: Xr(r),
      metadata: {
        model: t,
        latencyMs: Date.now() - n,
        referencesCount: e.references.length
      }
    };
  }
}
function Yr(s, e) {
  const t = e.map((n, a) => `Source ${a + 1}: ${n.title}
${n.text}`).join(`

`);
  return [
    "You are a customer support assistant.",
    "Answer the customer only using the knowledge context.",
    "If the answer is not in the context, say you are not sure and ask a human agent to help.",
    "",
    `Question: ${s}`,
    "",
    `Knowledge context:
${t}`
  ].join(`
`);
}
function Xr(s) {
  if (typeof s == "string") return s;
  if (s && typeof s == "object") {
    const e = s;
    if (typeof e.response == "string") return e.response;
    if (typeof e.result == "string") return e.result;
    if (typeof e.text == "string") return e.text;
  }
  return "抱歉，我暂时无法根据知识库生成回答。";
}
class Qr {
  constructor(e, t, n) {
    this.aiSearch = e, this.workersAi = t, this.messages = n;
  }
  async maybeCreateReply(e) {
    var t;
    if (e.handoffStatus === "agent" || !((t = e.messageContent) != null && t.trim()) || !this.aiSearch || !this.workersAi) return null;
    try {
      const n = await this.aiSearch.searchKnowledge(e.messageContent);
      if (n.length === 0) return null;
      const a = await this.workersAi.generateKnowledgeReply({
        question: e.messageContent,
        references: n
      });
      return this.messages.createOutbound({
        conversationId: e.conversationId,
        channelAccountId: e.channelAccountId,
        senderType: "ai",
        content: a.text,
        status: "sending",
        aiMetadata: a.metadata,
        aiReferences: n.map((r) => ({
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
function xs(s) {
  return {
    id: s.id,
    channelType: s.channel_type,
    displayName: s.display_name,
    externalAccountId: s.external_account_id,
    credentialCiphertext: s.credential_ciphertext,
    webhookSecretCiphertext: s.webhook_secret_ciphertext,
    outboundUrl: s.outbound_url,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class ei {
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
    ).all()).results.map(xs);
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
    return t ? xs(t) : null;
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
    return t ? xs(t) : null;
  }
  async create(e) {
    const t = Y("ch"), n = M();
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
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created channel account not found");
    return a;
  }
  async update(e, t) {
    const n = M(), a = [], r = [];
    if (t.displayName !== void 0 && (a.push("display_name = ?"), r.push(t.displayName)), t.externalAccountId !== void 0 && (a.push("external_account_id = ?"), r.push(t.externalAccountId)), t.credentialCiphertext !== void 0 && (a.push("credential_ciphertext = ?"), r.push(t.credentialCiphertext)), t.webhookSecretCiphertext !== void 0 && (a.push("webhook_secret_ciphertext = ?"), r.push(t.webhookSecretCiphertext)), t.outboundUrl !== void 0 && (a.push("outbound_url = ?"), r.push(t.outboundUrl)), a.length === 0) {
      const o = await this.findById(e);
      if (!o) throw new Error("Channel account not found");
      return o;
    }
    a.push("updated_at = ?"), r.push(n), r.push(e), await this.db.prepare(`UPDATE channel_accounts SET ${a.join(", ")} WHERE id = ?`).bind(...r).run();
    const i = await this.findById(e);
    if (!i) throw new Error("Channel account not found after update");
    return i;
  }
}
class ti {
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
      throw new g("CHANNEL_NOT_FOUND", "Channel account not found", 404);
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
function De(s) {
  return {
    id: s.id,
    channelAccountId: s.channel_account_id,
    externalContactId: s.external_contact_id,
    externalThreadId: s.external_thread_id,
    contactName: s.contact_name,
    contactAvatarUrl: s.contact_avatar_url,
    isAnonymous: s.is_anonymous === 1,
    status: s.status,
    handoffStatus: s.handoff_status,
    assigneeAdminUserId: s.assignee_admin_user_id,
    lastMessageId: s.last_message_id,
    lastMessageAt: s.last_message_at,
    unreadCount: s.unread_count,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    resolvedAt: s.resolved_at
  };
}
class si {
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
    ).bind(e).all()).results.map(De);
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
    ).bind(e).all()).results.map(De);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM conversations WHERE id = ? LIMIT 1").bind(e).first();
    return t ? De(t) : null;
  }
  async findByExternalThread(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
          AND external_thread_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? De(n) : null;
  }
  async findLatestByExternalContact(e, t) {
    const n = await this.db.prepare(
      "SELECT * FROM conversations WHERE channel_account_id = ? AND external_contact_id = ? ORDER BY last_message_at DESC LIMIT 1"
    ).bind(e, t).first();
    return n ? De(n) : null;
  }
  async create(e) {
    const t = Y("conv"), n = M();
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
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created conversation not found");
    return a;
  }
  async findOrCreateByExternalThread(e) {
    return await this.findByExternalThread(e.channelAccountId, e.externalThreadId) ?? this.create(e);
  }
  async touchAfterInbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            unread_count = unread_count + 1,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
  }
  async touchAfterOutbound(e, t, n) {
    await this.db.prepare(
      `
        UPDATE conversations
        SET last_message_id = ?,
            last_message_at = ?,
            updated_at = ?
        WHERE id = ?
        `
    ).bind(t, n, n, e).run();
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
    ).bind(M(), e).run();
  }
  async setHandoffStatus(e, t) {
    await this.db.prepare("UPDATE conversations SET handoff_status = ?, updated_at = ? WHERE id = ?").bind(t, M(), e).run();
  }
  async resolve(e) {
    const t = M();
    await this.db.prepare("UPDATE conversations SET status = 'resolved', resolved_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async reopen(e) {
    await this.db.prepare("UPDATE conversations SET status = 'open', resolved_at = NULL, updated_at = ? WHERE id = ?").bind(M(), e).run();
  }
  async listByChannel(e, t = 50, n = 0) {
    return (await this.db.prepare(
      `
        SELECT *
        FROM conversations
        WHERE channel_account_id = ?
        ORDER BY last_message_at DESC
        LIMIT ? OFFSET ?
        `
    ).bind(e, t, n).all()).results.map(De);
  }
  async listByExternalContact(e, t) {
    let n = "SELECT c.* FROM conversations c";
    const a = [];
    return t && (n += " INNER JOIN channel_accounts ca ON ca.id = c.channel_account_id AND ca.channel_type = ?", a.push(t)), n += " WHERE c.external_contact_id = ? ORDER BY c.last_message_at DESC", a.push(e), (await this.db.prepare(n).bind(...a).all()).results.map(De);
  }
  async countByChannel(e) {
    const t = await this.db.prepare("SELECT COUNT(*) as cnt FROM conversations WHERE channel_account_id = ?").bind(e).first();
    return (t == null ? void 0 : t.cnt) ?? 0;
  }
  async listByChannelWithFirstMessage(e, t = 50, n = 0) {
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
    ).bind(e, t, n).all()).results.map((r) => ({
      ...De(r),
      firstMessageRawPayload: r.first_message_raw_payload
    }));
  }
}
class ni {
  constructor(e, t, n) {
    this.conversations = e, this.messages = t, this.ai = n;
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
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
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
    const n = await this.conversations.findOrCreateByExternalThread({
      channelAccountId: e.channelAccount.id,
      externalContactId: e.inbound.externalContactId,
      externalThreadId: e.inbound.externalThreadId,
      contactName: e.inbound.contactName,
      contactAvatarUrl: e.inbound.contactAvatarUrl,
      isAnonymous: e.inbound.isAnonymous
    });
    n.status === "resolved" && await this.conversations.reopen(n.id);
    const a = await this.messages.createInbound({
      id: e.messageId,
      conversationId: n.id,
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
    if (await this.conversations.touchAfterInbound(n.id, r.id, r.createdAt), t.createAiReply === !1)
      return {
        conversationId: n.id,
        inboundMessage: r,
        aiMessage: null,
        duplicate: !1
      };
    const i = await this.createAiReply({
      conversationId: n.id,
      channelAccountId: e.channelAccount.id,
      messageContent: r.content,
      handoffStatus: n.handoffStatus
    });
    return {
      conversationId: n.id,
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
function Cs(s) {
  return {
    id: s.id,
    title: s.title,
    sourceType: s.source_type,
    aiSearchInstanceId: s.ai_search_instance_id,
    aiSearchItemId: s.ai_search_item_id,
    aiSearchPath: s.ai_search_path,
    status: s.status,
    fileName: s.file_name,
    fileSize: s.file_size,
    mimeType: s.mime_type,
    checksum: s.checksum,
    metadataJson: s.metadata_json,
    errorMessage: s.error_message,
    createdByAdminUserId: s.created_by_admin_user_id,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    indexedAt: s.indexed_at,
    deletedAt: s.deleted_at
  };
}
class ai {
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
    ).all()).results.map(Cs);
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM kb_documents WHERE id = ? AND deleted_at IS NULL LIMIT 1").bind(e).first();
    return t ? Cs(t) : null;
  }
  async findByAiSearchItem(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM kb_documents
        WHERE ai_search_instance_id = ?
          AND ai_search_item_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? Cs(n) : null;
  }
  async create(e) {
    const t = Y("kb"), n = M();
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
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created knowledge document not found");
    return a;
  }
  async markDeleted(e) {
    const t = M();
    await this.db.prepare("UPDATE kb_documents SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?").bind(t, t, e).run();
  }
  async upsertFromAiSearchItem(e) {
    const t = await this.findByAiSearchItem(e.aiSearchInstanceId, e.aiSearchItemId), n = M();
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
        n,
        e.indexedAt ?? (e.status === "indexed" ? t.indexedAt ?? n : t.indexedAt),
        t.id
      ).run();
      const i = await this.findById(t.id);
      if (!i) throw new Error("Updated knowledge document not found");
      return { document: i, action: "updated" };
    }
    const a = Y("kb");
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
      n,
      n,
      e.indexedAt ?? (e.status === "indexed" ? n : null)
    ).run();
    const r = await this.findById(a);
    if (!r) throw new Error("Created knowledge document not found");
    return { document: r, action: "created" };
  }
}
function Ge(s) {
  return JSON.stringify(s ?? null);
}
class ri {
  constructor(e, t) {
    this.knowledge = e, this.aiSearch = t;
  }
  listDocuments() {
    return this.knowledge.list();
  }
  requireAiSearch() {
    if (!this.aiSearch)
      throw new g("AI_SEARCH_NOT_CONFIGURED", "AI Search is not configured", 503);
    return this.aiSearch;
  }
  async uploadDocument(e) {
    const t = this.requireAiSearch();
    if (e.file.size > Vr)
      throw new g("KNOWLEDGE_FILE_TOO_LARGE", "Knowledge file is larger than 4MB", 400);
    const n = Y("kb"), a = e.file.name.replace(/[^\w.\-]+/g, "_"), r = `${zr}${n}/${a}`, i = await oi(e.file), o = await this.uploadToAiSearch(t, r, i), c = await this.knowledge.create({
      title: e.title || e.file.name,
      aiSearchInstanceId: t.instanceName,
      aiSearchItemId: o.id,
      aiSearchPath: o.key || r,
      status: ks(o.status),
      fileName: e.file.name,
      fileSize: e.file.size,
      mimeType: e.file.type || void 0,
      metadataJson: Ge({ filename: e.file.name, source: "upload" }),
      indexedAt: ks(o.status) === "indexed" ? o.last_seen_at ?? o.created_at : void 0,
      createdByAdminUserId: e.createdByAdminUserId
    });
    try {
      return await this.syncFromAiSearch(), await this.knowledge.findById(c.id) ?? c;
    } catch {
      return c;
    }
  }
  async uploadToAiSearch(e, t, n) {
    try {
      return await e.uploadDocument({ path: t, content: n });
    } catch (a) {
      throw new g(
        "KNOWLEDGE_UPLOAD_FAILED",
        `AI Search upload failed: ${a instanceof Error ? a.message : String(a)}`,
        502
      );
    }
  }
  async deleteDocument(e) {
    const t = this.requireAiSearch(), n = await this.knowledge.findById(e);
    if (!n)
      throw new g("KNOWLEDGE_DOCUMENT_NOT_FOUND", "Knowledge document not found", 404);
    n.aiSearchItemId && await t.deleteDocument(n.aiSearchItemId), await this.knowledge.markDeleted(e);
  }
  async syncFromAiSearch() {
    const e = this.requireAiSearch(), t = await e.listDocuments(), n = {
      instanceName: e.instanceName,
      scanned: t.length,
      created: 0,
      updated: 0,
      failed: 0
    };
    for (const a of t)
      try {
        const r = ks(a.status), i = a.metadata ?? {}, o = es(i.filename) ?? ii(a.key), c = await this.knowledge.upsertFromAiSearchItem({
          title: es(i.title) ?? o ?? a.key,
          aiSearchInstanceId: e.instanceName,
          aiSearchItemId: a.id,
          aiSearchPath: a.key,
          status: r,
          fileName: o,
          fileSize: a.file_size ?? 0,
          mimeType: es(i.mime_type) ?? es(i.content_type),
          metadataJson: Ge({
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
        c.action === "created" && (n.created += 1), c.action === "updated" && (n.updated += 1);
      } catch {
        n.failed += 1;
      }
    return n;
  }
}
function ks(s) {
  switch (s) {
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
function es(s) {
  return typeof s == "string" && s.trim() ? s : void 0;
}
function ii(s) {
  return s.split("/").filter(Boolean).at(-1) ?? s;
}
async function oi(s) {
  return ci(s) ? s.text() : s.arrayBuffer();
}
function ci(s) {
  const e = s.name.toLowerCase(), t = s.type.toLowerCase();
  return t.startsWith("text/") || t === "application/json" || t === "application/xml" || t === "application/x-yaml" || e.endsWith(".md") || e.endsWith(".mdx") || e.endsWith(".txt") || e.endsWith(".html") || e.endsWith(".htm") || e.endsWith(".json") || e.endsWith(".csv") || e.endsWith(".yaml") || e.endsWith(".yml");
}
function $t(s) {
  return {
    id: s.id,
    conversationId: s.conversation_id,
    channelAccountId: s.channel_account_id,
    externalMessageId: s.external_message_id,
    direction: s.direction,
    senderType: s.sender_type,
    senderAdminUserId: s.sender_admin_user_id,
    clientMessageId: s.client_message_id,
    messageType: s.message_type,
    content: s.content,
    attachmentsJson: s.attachments_json,
    rawPayloadJson: s.raw_payload_json,
    aiMetadataJson: s.ai_metadata_json,
    aiReferencesJson: s.ai_references_json,
    status: s.status,
    errorMessage: s.error_message,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
function Gs(s) {
  if (!s) return [];
  try {
    const e = JSON.parse(s);
    return Array.isArray(e) ? e.filter(di) : [];
  } catch {
    return [];
  }
}
function di(s) {
  if (!s || typeof s != "object") return !1;
  const e = s;
  return e.type !== "image" && e.type !== "file" && e.type !== "audio" && e.type !== "video" ? !1 : lt(e.url) && lt(e.fileId) && lt(e.r2Key) && lt(e.mimeType) && lt(e.fileName) && ts(e.size) && ts(e.width) && ts(e.height) && ts(e.durationMs) && lt(e.thumbnailR2Key);
}
function lt(s) {
  return s === void 0 || typeof s == "string";
}
function ts(s) {
  return s === void 0 || typeof s == "number";
}
const En = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]), An = /* @__PURE__ */ new Set(["video/mp4", "video/webm", "video/quicktime"]);
class li {
  constructor(e, t) {
    this.bucket = e, this.messages = t;
  }
  async storeUpload(e) {
    var l;
    const t = this.requireBucket(), n = ((l = e.fileName) == null ? void 0 : l.trim()) || e.file.name || "upload", a = ui(e.mimeType || e.file.type, n), r = hi(a), i = r === "image" ? Gr : Kr;
    if (e.file.size > i)
      throw new g(
        "MEDIA_FILE_TOO_LARGE",
        `${r === "image" ? "Image" : "Video"} file is too large`,
        400,
        { maxBytes: i }
      );
    const o = Y("att"), c = ca(n || o), d = `${Jr}${e.conversationId}/${e.messageId}/${o}/${c}`;
    return await t.put(d, e.file.stream(), {
      httpMetadata: {
        contentType: a,
        contentDisposition: bn(n || c)
      },
      customMetadata: {
        conversationId: e.conversationId,
        messageId: e.messageId,
        attachmentId: o,
        fileName: n || c
      }
    }), {
      messageType: r,
      attachment: {
        type: r,
        r2Key: d,
        fileName: n || c,
        mimeType: a,
        size: e.file.size
      }
    };
  }
  async getMessageAttachmentResponse(e) {
    const t = await this.messages.findById(e.messageId);
    if (!t || t.conversationId !== e.conversationId)
      throw new g("MESSAGE_NOT_FOUND", "Message not found", 404);
    const n = Gs(t.attachmentsJson)[e.attachmentIndex];
    if (!n)
      throw new g("ATTACHMENT_NOT_FOUND", "Attachment not found", 404);
    if (!n.r2Key) {
      if (n.url) return Response.redirect(n.url, 302);
      throw new g("ATTACHMENT_NOT_FOUND", "Attachment is not stored in Supportly", 404);
    }
    const a = this.requireBucket(), r = e.request.headers.get("range"), i = await a.get(
      n.r2Key,
      r ? { range: e.request.headers } : void 0
    );
    if (!i)
      throw new g("ATTACHMENT_NOT_FOUND", "Attachment file not found", 404);
    const o = new Headers();
    if (i.writeHttpMetadata(o), o.set("etag", i.httpEtag), o.set("accept-ranges", "bytes"), o.set("cache-control", "private, max-age=300"), o.set("content-type", n.mimeType || o.get("content-type") || "application/octet-stream"), n.fileName && !o.has("content-disposition") && o.set("content-disposition", bn(n.fileName)), i.range) {
      const c = fi(i.range, i.size);
      return o.set("content-range", `bytes ${c.start}-${c.end}/${i.size}`), o.set("content-length", String(c.length)), new Response(i.body, { status: 206, headers: o });
    }
    return o.set("content-length", String(i.size)), new Response(i.body, { headers: o });
  }
  requireBucket() {
    if (!this.bucket)
      throw new g("MEDIA_STORAGE_NOT_CONFIGURED", "Media storage is not configured", 500);
    return this.bucket;
  }
}
function ui(s, e) {
  const t = s.trim().toLowerCase();
  if (t && t !== "application/octet-stream")
    return t;
  const n = pi(e);
  if (!n)
    throw new g("MEDIA_MIME_TYPE_REQUIRED", "Media file type is required", 400);
  return n;
}
function hi(s) {
  if (En.has(s)) return "image";
  if (An.has(s)) return "video";
  throw new g("MEDIA_TYPE_NOT_SUPPORTED", "Only image and video files are supported", 400, {
    allowedMimeTypes: [...En, ...An]
  });
}
function ca(s) {
  return s.trim().replace(/[^\w.\-]+/g, "_").replace(/^_+|_+$/g, "") || "upload";
}
function pi(s) {
  const e = s.toLowerCase();
  if (e.endsWith(".jpg") || e.endsWith(".jpeg")) return "image/jpeg";
  if (e.endsWith(".png")) return "image/png";
  if (e.endsWith(".gif")) return "image/gif";
  if (e.endsWith(".webp")) return "image/webp";
  if (e.endsWith(".mp4")) return "video/mp4";
  if (e.endsWith(".webm")) return "video/webm";
  if (e.endsWith(".mov") || e.endsWith(".qt")) return "video/quicktime";
}
function bn(s) {
  return `inline; filename="${ca(s).replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(s)}`;
}
function fi(s, e) {
  const t = s;
  if (typeof t.offset == "number" && typeof t.length == "number") {
    const r = t.offset, i = Math.min(e - 1, t.offset + t.length - 1);
    return { start: r, end: i, length: i - r + 1 };
  }
  if (typeof t.offset == "number" && typeof t.end == "number") {
    const r = t.offset, i = Math.min(e - 1, t.end);
    return { start: r, end: i, length: i - r + 1 };
  }
  const n = Math.min(e, t.suffix ?? e);
  return { start: Math.max(0, e - n), end: e - 1, length: n };
}
class mi {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM messages WHERE id = ? LIMIT 1").bind(e).first();
    return t ? $t(t) : null;
  }
  async findByExternalMessageId(e, t) {
    const n = await this.db.prepare(
      `
        SELECT *
        FROM messages
        WHERE channel_account_id = ?
          AND external_message_id = ?
        LIMIT 1
        `
    ).bind(e, t).first();
    return n ? $t(n) : null;
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
    return t ? $t(t) : null;
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
    ).bind(e, t).all()).results.map($t);
  }
  async listByConversationAfter(e, t, n = 100) {
    if (!t)
      return this.listByConversation(e, n);
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
    ).bind(e, a.createdAt, a.createdAt, a.id, n).all()).results.map($t);
  }
  async createInbound(e) {
    const t = e.id ?? Y("msg"), n = e.inbound.receivedAt || M();
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
      Ge(e.inbound.attachments),
      Ge(e.inbound.rawPayload),
      n,
      n
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
    const t = e.id ?? Y("msg"), n = M();
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
      Ge(e.attachments ?? []),
      Ge(e.aiMetadata ?? {}),
      Ge(e.aiReferences ?? []),
      e.status,
      n,
      n
    ).run();
    const a = await this.findById(t);
    if (!a) throw new Error("Created outbound message not found");
    return a;
  }
  async updateRawPayload(e, t) {
    await this.db.prepare("UPDATE messages SET raw_payload_json = ? WHERE id = ?").bind(t, e).run();
  }
  async updateContent(e, t) {
    await this.db.prepare("UPDATE messages SET content = ?, updated_at = ? WHERE id = ?").bind(t, M(), e).run();
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
    ).bind(t ?? null, M(), e).run();
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
    ).bind(t, M(), e).run();
  }
}
class gi {
  constructor(e, t, n, a, r) {
    this.channels = e, this.conversations = t, this.messages = n, this.realtime = a, this.media = r;
  }
  async listConversationMessages(e, t) {
    if (!await this.conversations.findById(e))
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return await this.conversations.markRead(e), this.messages.listByConversationAfter(e, t);
  }
  async sendAgentMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const i = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (i) return i;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = await this.messages.createOutbound({
      conversationId: t.id,
      channelAccountId: n.id,
      senderAdminUserId: e.adminUserId,
      senderType: "agent",
      clientMessageId: e.clientMessageId,
      content: e.content,
      attachments: [],
      status: "sending"
    });
    try {
      const i = await a.sendMessage(n, {
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
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (e.clientMessageId) {
      const d = await this.messages.findByClientMessageId({
        conversationId: t.id,
        senderType: "agent",
        senderAdminUserId: e.adminUserId,
        clientMessageId: e.clientMessageId
      });
      if (d) return d;
    }
    const n = await this.channels.getAccount(t.channelAccountId), a = this.channels.getAdapter(n), r = Y("msg"), i = await this.media.storeUpload({
      conversationId: t.id,
      messageId: r,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), o = _i(e.content), c = await this.messages.createOutbound({
      id: r,
      conversationId: t.id,
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
      const d = await a.sendMessage(n, {
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
function _i(s) {
  const e = s == null ? void 0 : s.trim();
  return e || null;
}
function Oe(s, e) {
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Gs(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt,
    externalMessageId: s.externalMessageId,
    avatarUrl: e ?? null
  };
}
const yi = "admin", Tn = "end_user", Os = "https://supportly.internal/__notify";
class wi {
  constructor(e) {
    this.env = e;
  }
  async notifyMessageCreated(e) {
    const t = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: Oe(e.message)
    }, n = {
      type: "message.new",
      conversationId: e.conversation.id,
      message: e.message
    }, a = {
      type: "conversation.updated",
      conversation: e.conversation
    }, r = await Promise.allSettled([
      this.notifyVisitor(e.conversation.id, t),
      this.notifyAdmin(n),
      this.notifyAdmin(a)
    ]);
    for (const i of r)
      i.status === "rejected" && me.warn("realtime_notify_failed", {
        conversationId: e.conversation.id,
        messageId: e.message.id,
        error: i.reason instanceof Error ? i.reason.message : String(i.reason)
      });
  }
  async notifyVisitor(e, t) {
    const n = this.env.VISITOR_STREAM.idFromName(e), a = this.env.VISITOR_STREAM.get(n);
    await this.notify(a, t);
  }
  async notifyAdmin(e) {
    const t = this.env.ADMIN_STREAM.idFromName(yi), n = this.env.ADMIN_STREAM.get(t);
    await this.notify(n, e);
  }
  async notifyEndUserPresence() {
    try {
      const e = this.env.END_USER_STREAM.idFromName(Tn);
      await this.env.END_USER_STREAM.get(e).fetch(Os, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "refresh_presence" })
      });
    } catch {
    }
  }
  async notifyEndUserMessage(e, t) {
    try {
      const n = this.env.END_USER_STREAM.idFromName(Tn);
      await this.env.END_USER_STREAM.get(n).fetch(Os, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "message.new", targetUserId: e, payload: t })
      });
    } catch {
    }
  }
  async notify(e, t) {
    const n = await e.fetch(Os, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(t)
    });
    if (!n.ok)
      throw new Error(`Realtime notify failed with status ${n.status}`);
  }
}
function xn(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    passwordHash: s.password_hash,
    role: s.role,
    status: s.status,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class vi {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? xn(t) : null;
  }
  async findByEmail(e) {
    const t = await this.db.prepare("SELECT * FROM admin_users WHERE lower(email) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? xn(t) : null;
  }
}
const Ii = 60 * 60 * 24 * 7;
class Si {
  constructor(e, t) {
    this.adminUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.adminUsers.findByEmail(e), a = n ? await qs(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new g("INVALID_CREDENTIALS", "Invalid email or password", 401);
    const r = Math.floor(Date.now() / 1e3) + Ii;
    return {
      token: await this.signToken({
        sub: n.id,
        email: n.email,
        name: n.name,
        role: n.role,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      adminUser: Ai(n)
    };
  }
  async requireAdminUser(e) {
    const t = Ei(e.authorization);
    if (t) {
      const a = await this.verifyToken(t), r = await this.adminUsers.findById(a.sub);
      if (!r)
        throw new g("UNAUTHORIZED", "Admin user not found", 401);
      return r;
    }
    if (!e.adminUserId)
      throw new g("UNAUTHORIZED", "Missing admin user", 401);
    const n = await this.adminUsers.findById(e.adminUserId);
    if (!n)
      throw new g("UNAUTHORIZED", "Admin user not found", 401);
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
    const t = ge(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ge(JSON.stringify(e)), a = await st(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new g("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await st(this.jwtSecret, `${t}.${n}`);
    if (!Ot(a, r))
      throw new g("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Js(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new g("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function Ei(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function Ai(s) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    role: s.role
  };
}
function Lt(s) {
  return {
    id: s.id,
    username: s.username,
    email: s.email,
    passwordHash: s.password_hash,
    displayName: s.display_name,
    status: s.status,
    rawPayloadJson: s.raw_payload_json,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  };
}
class bi {
  constructor(e) {
    this.db = e;
  }
  async findById(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE id = ? AND status = 'active' LIMIT 1").bind(e).first();
    return t ? Lt(t) : null;
  }
  async findByIds(e) {
    if (e.length === 0) return [];
    const t = e.map(() => "?").join(",");
    return (await this.db.prepare(`SELECT * FROM end_users WHERE id IN (${t}) AND status = 'active'`).bind(...e).all()).results.map(Lt);
  }
  async findByUsername(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) AND status = 'active' LIMIT 1").bind(e).first();
    return t ? Lt(t) : null;
  }
  async findByUsernameAny(e) {
    const t = await this.db.prepare("SELECT * FROM end_users WHERE lower(username) = lower(?) LIMIT 1").bind(e).first();
    return t ? Lt(t) : null;
  }
  async listAll() {
    return (await this.db.prepare("SELECT * FROM end_users ORDER BY created_at DESC LIMIT 200").all()).results.map(Lt);
  }
  async approve(e) {
    const t = M();
    return await this.db.prepare("UPDATE end_users SET status = 'active', updated_at = ? WHERE id = ? AND status = 'pending'").bind(t, e).run(), this.findById(e);
  }
  async deactivate(e) {
    const t = M();
    await this.db.prepare("UPDATE end_users SET status = 'pending', updated_at = ? WHERE id = ?").bind(t, e).run();
  }
  async anonymizeConversations(e) {
    const t = M();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 1, contact_name = '匿名访客', updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, e).run();
  }
  async restoreConversations(e, t) {
    const n = M();
    await this.db.prepare(
      "UPDATE conversations SET is_anonymous = 0, contact_name = ?, updated_at = ? WHERE external_contact_id = ?"
    ).bind(t, n, e).run();
  }
  async getConversationCounts() {
    const e = await this.db.prepare("SELECT external_contact_id, COUNT(*) as count FROM conversations GROUP BY external_contact_id").all();
    return new Map(e.results.map((t) => [t.external_contact_id, t.count]));
  }
  async create(e) {
    var i;
    const t = Y("eu"), n = await ra(e.password), a = M(), r = ((i = e.displayName) == null ? void 0 : i.trim()) || e.username;
    return await this.db.prepare(
      "INSERT INTO end_users (id, username, email, password_hash, display_name, status, raw_payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)"
    ).bind(t, e.username, e.email ?? null, n, r, null, a, a).run(), {
      id: t,
      username: e.username,
      email: e.email ?? null,
      displayName: r,
      passwordHash: n,
      status: "pending",
      rawPayloadJson: null,
      createdAt: a,
      updatedAt: a
    };
  }
  async updateRawPayload(e, t) {
    const n = M();
    await this.db.prepare("UPDATE end_users SET raw_payload_json = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
  async updatePassword(e, t) {
    const n = M();
    await this.db.prepare("UPDATE end_users SET password_hash = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
  async updateDisplayName(e, t) {
    const n = M();
    await this.db.prepare("UPDATE end_users SET display_name = ?, updated_at = ? WHERE id = ?").bind(t, n, e).run();
  }
}
const Ti = 60 * 60 * 24 * 7;
class xi {
  constructor(e, t) {
    this.endUsers = e, this.jwtSecret = t;
  }
  async login(e, t) {
    const n = await this.endUsers.findByUsername(e), a = n ? await qs(t, n.passwordHash) : !1;
    if (!n || !a)
      throw new g("INVALID_CREDENTIALS", "Invalid username or password", 401);
    const r = Math.floor(Date.now() / 1e3) + Ti;
    return {
      token: await this.signToken({
        sub: n.id,
        username: n.username,
        displayName: n.displayName,
        exp: r
      }),
      tokenType: "Bearer",
      expiresAt: new Date(r * 1e3).toISOString(),
      user: ss(n)
    };
  }
  async register(e) {
    if (await this.endUsers.findByUsernameAny(e.username))
      throw new g("USERNAME_TAKEN", "Username is already taken", 409);
    const n = await this.endUsers.create(e);
    return ss(n);
  }
  async listUsers() {
    const [e, t] = await Promise.all([
      this.endUsers.listAll(),
      this.endUsers.getConversationCounts()
    ]);
    return e.map((n) => ({
      ...ss(n),
      conversationCount: t.get(n.id) ?? 0
    }));
  }
  async approveUser(e) {
    const t = await this.endUsers.approve(e);
    if (!t)
      throw new g("END_USER_NOT_FOUND", "End user not found or already approved", 404);
    return await this.endUsers.restoreConversations(t.id, t.displayName), ss(t);
  }
  async deactivateUser(e) {
    await this.endUsers.anonymizeConversations(e), await this.endUsers.deactivate(e);
  }
  async requireEndUser(e) {
    const t = Ci(e);
    if (!t)
      throw new g("UNAUTHORIZED", "Missing auth token", 401);
    const n = await this.verifyToken(t), a = await this.endUsers.findById(n.sub);
    if (!a)
      throw new g("UNAUTHORIZED", "End user not found", 401);
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
      throw new g("END_USER_NOT_FOUND", "End user not found", 404);
    let n = {};
    if (t.rawPayloadJson)
      try {
        n = JSON.parse(t.rawPayloadJson);
      } catch {
      }
    return {
      id: t.id,
      username: t.username,
      displayName: t.displayName,
      email: t.email,
      settings: n.settings || {},
      isMediator: n.is_mediator === !0
    };
  }
  async updateSettings(e, t) {
    const n = await this.endUsers.findById(e);
    if (!n)
      throw new g("END_USER_NOT_FOUND", "End user not found", 404);
    let a = {};
    if (n.rawPayloadJson)
      try {
        a = JSON.parse(n.rawPayloadJson);
      } catch {
      }
    a.settings = { ...a.settings || {}, ...t }, await this.endUsers.updateRawPayload(e, JSON.stringify(a));
  }
  async changePassword(e, t, n) {
    const a = await this.endUsers.findById(e);
    if (!a)
      throw new g("END_USER_NOT_FOUND", "End user not found", 404);
    if (!await qs(t, a.passwordHash))
      throw new g("INVALID_PASSWORD", "Current password is incorrect", 400);
    const i = await ra(n);
    await this.endUsers.updatePassword(e, i);
  }
  async updateDisplayName(e, t) {
    await this.endUsers.updateDisplayName(e, t);
  }
  async signToken(e) {
    const t = ge(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ge(JSON.stringify(e)), a = await st(this.jwtSecret, `${t}.${n}`);
    return `${t}.${n}.${a}`;
  }
  async verifyToken(e) {
    const [t, n, a] = e.split(".");
    if (!t || !n || !a)
      throw new g("UNAUTHORIZED", "Invalid auth token", 401);
    const r = await st(this.jwtSecret, `${t}.${n}`);
    if (!Ot(a, r))
      throw new g("UNAUTHORIZED", "Invalid auth token", 401);
    const i = JSON.parse(Js(n));
    if (!i.sub || !i.exp || i.exp < Math.floor(Date.now() / 1e3))
      throw new g("UNAUTHORIZED", "Auth token expired", 401);
    return i;
  }
}
function Ci(s) {
  if (!s) return null;
  const [e, t] = s.split(" ");
  return (e == null ? void 0 : e.toLowerCase()) !== "bearer" || !t ? null : t;
}
function ss(s) {
  return {
    id: s.id,
    username: s.username,
    displayName: s.displayName,
    email: s.email,
    status: s.status,
    createdAt: s.createdAt
  };
}
class ki {
  constructor(e) {
    this.channelService = e;
  }
  async notify(e) {
    const t = await this.channelService.getAccountByType("telegram");
    if (!(t != null && t.credentialCiphertext)) return;
    const n = t.externalAccountId;
    if (n)
      try {
        const a = await fetch(`https://api.telegram.org/bot${t.credentialCiphertext}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: n,
            text: e,
            parse_mode: "HTML",
            disable_web_page_preview: !0
          })
        });
        if (!a.ok) {
          const r = await a.text().catch(() => "");
          me.warn("tg_notification_failed", {
            status: a.status,
            body: r.substring(0, 200)
          });
        }
      } catch (a) {
        me.warn("tg_notification_error", {
          error: a instanceof Error ? a.message : String(a)
        });
      }
  }
}
async function x(s) {
  const e = new Rr([new Mr(), new Dr(), new oa(), new Hr()]), t = new ei(s.DB), n = new si(s.DB), a = new mi(s.DB), r = new ai(s.DB), i = new vi(s.DB), o = s.KB_INSTANCE_NAME ?? "supportly-dev";
  let c = null;
  if (s.AI_SEARCH)
    try {
      c = new qr(s.AI_SEARCH.get(o), o);
    } catch (f) {
      console.warn("ai_search_unavailable", f instanceof Error ? f.message : String(f));
    }
  const d = s.AI ? new Zr(s.AI, s) : null, l = new Qr(c, d, a), u = new ti(t, e), h = new ni(n, a, l), m = new wi(s), _ = new li(s.MEDIA_BUCKET, a), E = new gi(
    u,
    n,
    a,
    m,
    _
  ), S = new ri(r, c), b = new Si(i, s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"), C = new bi(s.DB), L = new xi(
    C,
    s.END_USER_JWT_SECRET ?? "supportly-dev-enduser-secret-change-before-deploy"
  );
  let D = null, W = null;
  {
    const { WidgetService: f } = await Promise.resolve().then(() => Uo);
    D = new f(
      u,
      n,
      a,
      h,
      m,
      _,
      C,
      s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
    );
  }
  {
    const { ForumService: f } = await Promise.resolve().then(() => Lo);
    W = new f(
      u,
      n,
      a,
      h,
      m,
      _,
      C,
      L,
      b,
      s.WIDGET_TOKEN_SECRET ?? s.JWT_SECRET ?? "supportly-dev-secret-change-before-deploy"
    );
  }
  const te = new ki(u);
  return {
    adapters: e,
    channels: u,
    conversations: h,
    messages: E,
    media: _,
    realtime: m,
    knowledge: S,
    auth: b,
    endUserAuth: L,
    widget: D,
    forum: W,
    notification: te
  };
}
function We() {
  return async (s, e) => {
    const t = s.req.header("x-admin-user-id"), n = s.req.header("authorization"), r = await (await x(s.env)).auth.requireAdminUser({ adminUserId: t, authorization: n });
    s.set("adminUserId", r.id), s.set("adminUser", {
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role
    }), await e();
  };
}
function k(s, e) {
  return Response.json({ data: s }, e);
}
function Xt(s) {
  return k(s, { status: 201 });
}
function Oi() {
  return new Response(null, { status: 204 });
}
const Me = new _e(), Ri = F({
  email: v().email(),
  password: v().min(1)
});
Me.post("/login", async (s) => {
  const e = Ri.parse(await s.req.json()), t = await x(s.env);
  return k(await t.auth.login(e.email, e.password));
});
Me.get("/me", We(), (s) => k(s.get("adminUser")));
const Ni = F({
  username: v().trim().min(2).max(50),
  password: v().min(6).max(128),
  email: v().email().optional(),
  displayName: v().trim().max(100).optional()
}), Mi = F({
  username: v().trim().min(1),
  password: v().min(1)
});
Me.post("/end-user/register", async (s) => {
  const e = Ni.parse(await s.req.json()), t = await x(s.env);
  return k(await t.endUserAuth.register(e));
});
Me.post("/end-user/login", async (s) => {
  const e = Mi.parse(await s.req.json()), t = await x(s.env);
  return k(await t.endUserAuth.login(e.username, e.password));
});
Me.get("/end-user/me", async (s) => {
  const t = await (await x(s.env)).endUserAuth.requireEndUser(s.req.header("authorization"));
  return k({
    id: t.id,
    username: t.username,
    displayName: t.displayName,
    email: t.email,
    rawPayloadJson: t.rawPayloadJson
  });
});
const Di = F({
  displayName: v().trim().max(100).optional(),
  oldPassword: v().min(1).optional(),
  newPassword: v().min(6).max(128).optional(),
  settings: sa(ta()).optional()
});
Me.patch("/end-user/me", async (s) => {
  const e = Di.parse(await s.req.json()), t = await x(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization"));
  if (e.settings && await t.endUserAuth.updateSettings(n.id, e.settings), e.newPassword) {
    if (!e.oldPassword)
      throw new g("MISSING_OLD_PASSWORD", "Old password is required", 400);
    await t.endUserAuth.changePassword(n.id, e.oldPassword, e.newPassword);
  }
  return e.displayName && await t.endUserAuth.updateDisplayName(n.id, e.displayName), k({ success: !0 });
});
const da = "avatars/", Ui = 2 * 1024 * 1024, Pi = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
Me.post("/end-user/avatar", async (s) => {
  const t = await (await x(s.env)).endUserAuth.requireEndUser(s.req.header("authorization")), a = (await s.req.formData()).get("file");
  if (!$i(a))
    throw new g("NO_FILE", "No file uploaded", 400);
  const r = (a.type || "image/png").toLowerCase();
  if (!Pi.has(r))
    throw new g("INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, WebP images are allowed", 400);
  if (a.size > Ui)
    throw new g("FILE_TOO_LARGE", "Avatar image must be under 2MB", 400);
  const i = s.env.MEDIA_BUCKET;
  if (!i)
    throw new g("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const o = `${da}${t.id}`;
  await i.put(o, a.stream(), {
    httpMetadata: { contentType: r, cacheControl: "no-cache" }
  });
  const c = `/api/auth/end-user/avatar/${t.id}`;
  return k({ avatarUrl: c });
});
Me.get("/end-user/avatar/:userId", async (s) => {
  const e = s.env.MEDIA_BUCKET;
  if (!e)
    throw new g("STORAGE_NOT_CONFIGURED", "Storage is not configured", 500);
  const t = s.req.param("userId"), n = `${da}${t}`, a = await e.get(n);
  if (!a)
    throw new g("AVATAR_NOT_FOUND", "Avatar not found", 404);
  const r = new Headers();
  return a.writeHttpMetadata(r), r.set("cache-control", "no-cache"), r.set("etag", a.httpEtag), new Response(a.body, { headers: r });
});
function $i(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
const Li = F({
  channelType: kt(["custom_webhook", "telegram", "whatsapp", "wechat", "web_chat", "forum"]),
  displayName: v().min(1),
  externalAccountId: v().optional(),
  credentialCiphertext: v().optional(),
  webhookSecretCiphertext: v().optional(),
  outboundUrl: v().url().optional()
}), Fi = F({
  displayName: v().min(1).optional(),
  externalAccountId: v().optional().nullable(),
  credentialCiphertext: v().optional().nullable(),
  webhookSecretCiphertext: v().optional().nullable(),
  outboundUrl: v().url().optional().nullable()
}), la = F({
  webhookUrl: v().url().optional(),
  dropPendingUpdates: oe().optional()
}), at = new _e();
at.use("*", We());
at.get("/", async (s) => {
  const e = await x(s.env);
  return k((await e.channels.listAccounts()).map(Ks));
});
at.post("/", async (s) => {
  const e = Li.parse(await s.req.json()), t = await x(s.env);
  return Xt(Ks(await t.channels.createAccount(e)));
});
at.patch("/:id", async (s) => {
  const e = Fi.parse(await s.req.json()), t = await x(s.env);
  return k(Ks(await t.channels.updateAccount(s.req.param("id"), {
    displayName: e.displayName,
    externalAccountId: e.externalAccountId ?? void 0,
    credentialCiphertext: e.credentialCiphertext ?? void 0,
    webhookSecretCiphertext: e.webhookSecretCiphertext ?? void 0,
    outboundUrl: e.outboundUrl ?? void 0
  })));
});
at.post("/:id/telegram/set-webhook", async (s) => {
  const e = la.parse(await s.req.json().catch(() => ({}))), t = await x(s.env), n = await t.channels.getAccount(s.req.param("id")), a = ua(t.channels.getAdapter(n));
  return k(
    await a.setWebhook(n, {
      webhookUrl: e.webhookUrl ?? ha(s.req.url, n.id),
      dropPendingUpdates: e.dropPendingUpdates
    })
  );
});
at.post("/:id/telegram/test", async (s) => {
  const e = la.pick({ webhookUrl: !0 }).parse(await s.req.json().catch(() => ({}))), t = await x(s.env), n = await t.channels.getAccount(s.req.param("id")), a = ua(t.channels.getAdapter(n));
  return k(await a.testConnection(n, e.webhookUrl ?? ha(s.req.url, n.id)));
});
function Ks(s) {
  return {
    ...s,
    credentialCiphertext: null
  };
}
function ua(s) {
  if (s instanceof oa) return s;
  throw new g("CHANNEL_NOT_TELEGRAM", "Channel is not a Telegram channel", 400);
}
function ha(s, e) {
  return `${new URL(s).origin}/webhooks/${e}`;
}
const Bi = F({
  clientMessageId: v().trim().min(1).max(128).optional(),
  content: v().min(1)
}), ji = F({
  status: kt(["bot", "agent"])
}), Ee = new _e();
Ee.get("/:id/messages/:messageId/attachments/:index", async (s) => {
  var n, a;
  const e = await x(s.env), t = (n = s.req.query("token")) == null ? void 0 : n.trim();
  return await e.auth.requireAdminUser({
    adminUserId: ((a = s.req.query("adminUserId")) == null ? void 0 : a.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), e.media.getMessageAttachmentResponse({
    conversationId: s.req.param("id"),
    messageId: s.req.param("messageId"),
    attachmentIndex: qi(s.req.param("index")),
    request: s.req.raw
  });
});
Ee.use("*", We());
Ee.get("/", async (s) => {
  const e = await x(s.env);
  return s.req.query("status") === "resolved" ? k(await e.conversations.listResolvedConversations()) : k(await e.conversations.listOpenConversations());
});
Ee.get("/:id", async (s) => {
  const e = await x(s.env);
  return k(await e.conversations.getConversation(s.req.param("id")));
});
Ee.get("/:id/messages", async (s) => {
  const e = await x(s.env);
  return k(await e.messages.listConversationMessages(s.req.param("id"), s.req.query("after") || void 0));
});
Ee.post("/:id/messages", async (s) => {
  const e = Bi.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.messages.sendAgentMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: e.clientMessageId,
      content: e.content
    })
  );
});
Ee.post("/:id/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Hi(t))
    throw new g("VALIDATION_ERROR", "file is required", 400);
  const n = await x(s.env);
  return k(
    await n.messages.sendAgentMediaMessage({
      conversationId: s.req.param("id"),
      adminUserId: s.get("adminUserId"),
      clientMessageId: ns(e, "clientMessageId", 128),
      content: ns(e, "content", 2e3),
      file: t,
      fileName: ns(e, "fileName", 300),
      mimeType: ns(e, "mimeType", 100)
    })
  );
});
Ee.post("/:id/handoff", async (s) => {
  const e = ji.parse(await s.req.json()), t = await x(s.env);
  return k(await t.conversations.setHandoff(s.req.param("id"), e.status));
});
Ee.post("/:id/resolve", async (s) => {
  const e = await x(s.env);
  return k(await e.conversations.resolve(s.req.param("id")));
});
function Hi(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function ns(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new g("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function qi(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new g("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
const pa = new _e();
pa.get("/", (s) => s.json({ ok: !0 }));
const Rt = new _e();
Rt.use("*", We());
function Wi(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "arrayBuffer" in s;
}
Rt.get("/documents", async (s) => {
  const e = await x(s.env);
  return k(await e.knowledge.listDocuments());
});
Rt.post("/documents", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!Wi(t))
    throw new g("VALIDATION_ERROR", "file is required", 400);
  const n = e.get("title"), a = await x(s.env);
  return Xt(
    await a.knowledge.uploadDocument({
      file: t,
      title: typeof n == "string" ? n : void 0,
      createdByAdminUserId: s.get("adminUserId")
    })
  );
});
Rt.post("/sync/ai-search", async (s) => {
  const e = await x(s.env);
  return k(await e.knowledge.syncFromAiSearch());
});
Rt.delete("/documents/:id", async (s) => (await (await x(s.env)).knowledge.deleteDocument(s.req.param("id")), Oi()));
const fa = new _e();
fa.post("/:channelAccountId", async (s) => {
  try {
    const e = await x(s.env), t = await e.channels.getAccount(s.req.param("channelAccountId")), n = e.channels.getAdapter(t);
    await n.verify(s.req.raw.clone(), t);
    const a = await e.channels.getAccountByType("telegram"), r = (a == null ? void 0 : a.externalAccountId) ?? void 0, i = await n.parseInbound(s.req.raw.clone(), t, r);
    let o = 0, c = 0, d = 0, l = 0, u = 0, h = 0;
    for (const _ of i) {
      if (_.agentReply) {
        try {
          await e.messages.sendAgentMessage({
            conversationId: _.agentReply.replyToConversationId,
            content: _.content ?? ""
          }), u += 1;
        } catch (S) {
          h += 1, me.warn("agent_reply_send_failed", {
            requestId: s.get("requestId"),
            conversationId: _.agentReply.replyToConversationId,
            error: S instanceof Error ? S.message : String(S)
          });
        }
        continue;
      }
      const E = await e.conversations.receiveInboundMessage({ channelAccount: t, inbound: _ });
      if (E.duplicate)
        c += 1;
      else {
        o += 1;
        const b = (_.messageType === "image" ? "[图片] " : "") + (_.content ?? "").substring(0, 300);
        s.executionCtx.waitUntil(
          e.notification.notify(
            `📩 <b>${t.channelType === "telegram" ? "Telegram" : "Webhook"} 新消息</b>
来自：${_.contactName}

${b}${(_.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${E.conversationId}`
          )
        );
      }
      if (E.aiMessage) {
        d += 1;
        try {
          const S = await n.sendMessage(t, {
            conversationId: E.conversationId,
            externalThreadId: _.externalThreadId,
            messageId: E.aiMessage.id,
            messageType: "text",
            content: E.aiMessage.content ?? ""
          });
          await e.messages.markSent(E.aiMessage.id, S.externalMessageId), me.info("ai_reply_sent", {
            requestId: s.get("requestId"),
            conversationId: E.conversationId,
            messageId: E.aiMessage.id,
            externalMessageId: S.externalMessageId
          });
        } catch (S) {
          await e.messages.markFailed(
            E.aiMessage.id,
            S instanceof Error ? S.message : "AI reply send failed"
          ), l += 1, me.warn("ai_reply_send_failed", {
            requestId: s.get("requestId"),
            conversationId: E.conversationId,
            messageId: E.aiMessage.id,
            error: S instanceof Error ? S.message : String(S)
          });
        }
      }
    }
    const m = {
      received: i.length,
      accepted: o,
      duplicates: c,
      aiReplies: d,
      aiReplySendFailures: l,
      agentReplies: u,
      agentReplySendFailures: h
    };
    return k(m);
  } catch (e) {
    const t = e instanceof Error ? e.message : String(e);
    return me.error("webhook_unhandled_error", { message: t }), s.json({
      error: {
        code: "WEBHOOK_ERROR",
        message: t
      }
    }, 500);
  }
});
const ie = new _e();
ie.use("*", Or());
ie.use(
  "*",
  tr({
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
ie.use("*", kr());
ie.route("/health", pa);
ie.route("/api/auth", Me);
ie.route("/api/channels", at);
ie.route("/api/conversations", Ee);
ie.route("/api/knowledge", Rt);
(async () => {
  {
    const { adminRoutes: s } = await Promise.resolve().then(() => jo);
    ie.route("/api/admin", s);
  }
  {
    const { widgetRoutes: s } = await Promise.resolve().then(() => Go);
    ie.route("/api/widget", s);
  }
  {
    const { forumRoutes: s } = await Promise.resolve().then(() => oc);
    ie.route("/api/forum", s);
  }
})();
ie.route("/webhooks", fa);
ie.onError((s, e) => na(s, e));
ie.notFound((s) => s.json({ error: { code: "NOT_FOUND", message: "Route not found" } }, 404));
class dc {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      ut(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        ut(e, { type: "pong", serverTime: M() });
        return;
      }
      ut(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      ut(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-admin-user-id");
    if (!t)
      return new Response("Missing admin identity", { status: 400 });
    const n = new WebSocketPair(), a = n[0], r = n[1], i = {
      kind: "admin",
      adminUserId: t,
      connectedAt: M()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), ut(r, { type: "connected", connectionKind: "admin", serverTime: M() }), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" && t.type !== "conversation.updated" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      ut(t, e);
  }
}
function ut(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
class lc {
  constructor(e, t) {
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      ht(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        ht(e, { type: "pong", serverTime: M() });
        return;
      }
      ht(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      ht(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketError(e) {
    e.close(1011, "WebSocket error");
  }
  handleWebSocket(e) {
    const t = e.headers.get("x-supportly-conversation-id"), n = e.headers.get("x-supportly-visitor-id");
    if (!t || !n)
      return new Response("Missing connection identity", { status: 400 });
    const a = new WebSocketPair(), r = a[0], i = a[1], o = {
      kind: "visitor",
      conversationId: t,
      visitorId: n,
      connectedAt: M()
    };
    return i.serializeAttachment(o), this.state.acceptWebSocket(i), ht(i, { type: "connected", connectionKind: "visitor", serverTime: M() }), new Response(null, { status: 101, webSocket: r });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return !t || t.type !== "message.new" ? new Response("Invalid notify event", { status: 400 }) : (this.broadcast(t), new Response(null, { status: 204 }));
  }
  broadcast(e) {
    for (const t of this.state.getWebSockets())
      ht(t, e);
  }
}
function ht(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
const Cn = 3e4, zi = 6e4;
class uc {
  constructor(e, t) {
    y(this, "onlineUsers", /* @__PURE__ */ new Set());
    y(this, "heartbeatMap", /* @__PURE__ */ new Map());
    this.state = e, this.env = t;
  }
  async fetch(e) {
    var n;
    const t = new URL(e.url);
    return e.method === "POST" && t.pathname === "/__notify" ? this.handleNotify(e) : e.method === "GET" && ((n = e.headers.get("upgrade")) == null ? void 0 : n.toLowerCase()) === "websocket" ? this.handleWebSocket(e) : new Response("Not found", { status: 404 });
  }
  async alarm() {
    const e = Date.now();
    let t = !1;
    for (const [n, a] of this.heartbeatMap)
      e - a > zi && (this.heartbeatMap.delete(n), this.onlineUsers.delete(n), t = !0);
    t && this.broadcastPresence(), this.heartbeatMap.size > 0 && await this.state.storage.setAlarm(Date.now() + Cn);
  }
  webSocketMessage(e, t) {
    if (typeof t != "string") {
      ze(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported binary event" });
      return;
    }
    try {
      if (JSON.parse(t).type === "ping") {
        const a = e.deserializeAttachment();
        a != null && a.userId && this.heartbeatMap.set(a.userId, Date.now()), ze(e, { type: "pong", serverTime: M() });
        return;
      }
      ze(e, { type: "error", code: "INVALID_EVENT", message: "Unsupported event" });
    } catch {
      ze(e, { type: "error", code: "INVALID_JSON", message: "Invalid JSON event" });
    }
  }
  webSocketClose(e, t, n, a) {
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
    const n = new WebSocketPair(), a = n[0], r = n[1], i = {
      kind: "end_user",
      userId: t,
      connectedAt: M()
    };
    return r.serializeAttachment(i), this.state.acceptWebSocket(r), this.onlineUsers.add(t), this.heartbeatMap.set(t, Date.now()), ze(r, { type: "connected", connectionKind: "end_user", serverTime: M() }), this.broadcastPresence(), await this.state.storage.setAlarm(Date.now() + Cn), new Response(null, { status: 101, webSocket: a });
  }
  async handleNotify(e) {
    const t = await e.json().catch(() => null);
    return t ? (t.type === "message.new" && t.targetUserId && t.payload && this.sendToUser(t.targetUserId, t.payload), this.broadcastPresence(), new Response(null, { status: 204 })) : new Response("Invalid notify event", { status: 400 });
  }
  sendToUser(e, t) {
    for (const n of this.state.getWebSockets()) {
      const a = n.deserializeAttachment();
      (a == null ? void 0 : a.userId) === e && ze(n, t);
    }
  }
  broadcastPresence() {
    const e = {
      type: "end_user.presence",
      onlineUserIds: Array.from(this.onlineUsers)
    };
    for (const t of this.state.getWebSockets())
      ze(t, e);
  }
}
function ze(s, e) {
  if (s.readyState === 1)
    try {
      s.send(JSON.stringify(e));
    } catch {
      s.close(1011, "Send failed");
    }
}
async function Vi(s, e) {
  const t = await s.prepare(
    `INSERT INTO decisions (inst_id, action, confidence, leverage, margin_usdt, entry_price, take_profit_price, stop_loss_price, risk_reward_ratio, reason, strategy_tag, llm_model, llm_provider, cycle_id)
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
  return (t == null ? void 0 : t.id) ?? 0;
}
async function Ji(s, e) {
  const t = await s.prepare(
    `INSERT INTO orders (order_id, inst_id, side, pos_side, order_type, price, size, leverage, venue, strategy_tag, decision_id)
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
  return (t == null ? void 0 : t.id) ?? 0;
}
async function Gi(s) {
  return (await s.prepare(
    `SELECT * FROM orders WHERE state IN ('pending','open','partially_filled')
     ORDER BY created_at DESC`
  ).all()).results || [];
}
async function Ki(s, e = 100) {
  return (await s.prepare(
    "SELECT * FROM trades WHERE status = 'closed' ORDER BY close_time DESC LIMIT ?"
  ).bind(e).all()).results || [];
}
async function Zi(s) {
  return (await s.prepare(
    "SELECT * FROM trades WHERE status = 'open'"
  ).all()).results || [];
}
async function Yi(s, e, t, n, a) {
  await s.prepare(
    `UPDATE trades SET status = 'closed', close_price = ?, pnl = ?, net_pnl = ? - fees, fees = ?, close_time = datetime('now')
     WHERE id = ? AND status = 'open'`
  ).bind(t, n, n, a, e).run();
}
async function Xi(s, e = 14) {
  return ((await s.prepare(
    `SELECT date(snapshot_time) as date, total_eq FROM equity_snapshots
     WHERE snapshot_time >= datetime('now', ?)
     GROUP BY date(snapshot_time)
     ORDER BY date ASC`
  ).bind(`-${e} days`).all()).results || []).map((n) => ({ date: n.date, equity: n.total_eq }));
}
async function G(s, e, t, n) {
  await s.prepare(
    "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
  ).bind(e, t, n).run();
}
async function Qi(s, e = 60) {
  return ((await s.prepare(
    "SELECT level, message, created_at FROM logs ORDER BY created_at DESC LIMIT ?"
  ).bind(e).all()).results || []).map((n) => `[${n.created_at}] [${n.level.toUpperCase()}] ${n.message}`);
}
async function eo(s, e = 60) {
  return (await s.prepare(
    "SELECT created_at, level, message, source FROM logs ORDER BY created_at DESC LIMIT ?"
  ).bind(e).all()).results || [];
}
async function to(s, e) {
  const t = await s.prepare("SELECT value FROM config WHERE key = ?").bind(e).first();
  return (t == null ? void 0 : t.value) ?? null;
}
async function so(s) {
  const e = await s.prepare("SELECT key, value FROM config").all(), t = {};
  for (const n of e.results || [])
    t[n.key] = n.value;
  return t;
}
async function no(s, e = !0) {
  let t = "SELECT * FROM instruments";
  return e && (t += " WHERE enabled = 1"), t += " ORDER BY inst_id ASC", (await s.prepare(t).all()).results || [];
}
async function ao(s) {
  const e = await s.prepare(
    "SELECT * FROM strategies WHERE enabled = 1 ORDER BY priority DESC LIMIT 1"
  ).first();
  if (!e) return null;
  const t = e;
  return t.config_json = typeof t.config_json == "string" ? JSON.parse(t.config_json) : t.config_json || {}, t;
}
async function ro(s) {
  return (await s.prepare(
    "SELECT * FROM llm_providers WHERE enabled = 1 ORDER BY priority DESC"
  ).all()).results || [];
}
async function io(s) {
  const e = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), n = await s.prepare(
    `SELECT
       COALESCE(SUM(CASE WHEN status = 'closed' THEN net_pnl ELSE 0 END), 0) as net_realized,
       COALESCE(SUM(fees), 0) as fees_paid,
       COUNT(CASE WHEN status = 'closed' AND net_pnl > 0 THEN 1 END) as win_trades,
       COUNT(CASE WHEN status = 'closed' AND net_pnl < 0 THEN 1 END) as loss_trades
     FROM trades
     WHERE date(close_time) = ?`
  ).bind(e).first() || {}, a = n.net_realized || 0, r = (n.win_trades || 0) + (n.loss_trades || 0);
  return {
    realized_gross: a + n.fees_paid,
    fees_paid: n.fees_paid || 0,
    net_realized: a,
    win_trades: n.win_trades || 0,
    loss_trades: n.loss_trades || 0,
    win_rate: r > 0 ? (n.win_trades || 0) / r : 0,
    source: "db"
  };
}
async function oo(s) {
  const t = await s.prepare(
    `SELECT
       COALESCE(SUM(net_pnl), 0) as total_pnl,
       COUNT(CASE WHEN net_pnl > 0 THEN 1 END) as wins,
       COUNT(CASE WHEN net_pnl < 0 THEN 1 END) as losses,
       COALESCE(AVG(CASE WHEN net_pnl > 0 THEN net_pnl END), 0) as avg_win,
       COALESCE(AVG(CASE WHEN net_pnl < 0 THEN net_pnl END), 0) as avg_loss,
       COALESCE(SUM(CASE WHEN net_pnl > 0 THEN net_pnl END), 0) as total_wins,
       COALESCE(ABS(SUM(CASE WHEN net_pnl < 0 THEN net_pnl END)), 0) as total_losses
     FROM trades WHERE status = 'closed'`
  ).first() || {}, n = t.total_pnl || 0, a = t.wins || 0, r = t.losses || 0, i = a + r, o = parseFloat(await to(s, "initial_capital") || "10000");
  return {
    total_cum_net_pnl: n,
    total_cum_realized_pnl: n,
    cum_roi_pct: o > 0 ? n / o * 100 : 0,
    profit_factor: t.total_losses > 0 ? (t.total_wins || 0) / t.total_losses : a > 0 ? 1 / 0 : 0,
    avg_win: t.avg_win || 0,
    avg_loss: Math.abs(t.avg_loss || 0),
    win_rate: i > 0 ? a / i : 0
  };
}
const Nt = new _e();
Nt.get("/", async (s) => {
  try {
    const e = await s.env.DB.prepare(
      `SELECT id, venue, display_name, enabled, testnet,
              api_key IS NOT NULL AND api_key != '' AS has_key,
              created_at, updated_at
       FROM venues ORDER BY venue`
    ).all();
    return s.json({ venues: e.results || [] });
  } catch (e) {
    return s.json({ error: e.message }, 500);
  }
});
Nt.get("/:id", async (s) => {
  const e = parseInt(s.req.param("id"), 10);
  if (isNaN(e)) return s.json({ error: "invalid id" }, 400);
  try {
    const t = await s.env.DB.prepare(
      "SELECT * FROM venues WHERE id = ?"
    ).bind(e).first();
    if (!t) return s.json({ error: "Venue not found" }, 404);
    const n = { ...t };
    return n.api_key && (n.api_key = Rs(n.api_key)), n.api_secret && (n.api_secret = Rs(n.api_secret)), n.api_passphrase && (n.api_passphrase = Rs(n.api_passphrase)), s.json({ venue: n });
  } catch (t) {
    return s.json({ error: t.message }, 500);
  }
});
Nt.post("/", async (s) => {
  try {
    const e = await s.req.json(), { id: t, venue: n, display_name: a, enabled: r, testnet: i, api_key: o, api_secret: c, api_passphrase: d, extra_config: l } = e;
    if (!n || !a)
      return s.json({ error: "venue and display_name are required" }, 400);
    if (t) {
      const u = ["venue = ?", "display_name = ?"], h = [n, a];
      r !== void 0 && (u.push("enabled = ?"), h.push(r ? 1 : 0)), i !== void 0 && (u.push("testnet = ?"), h.push(i ? 1 : 0)), o && (u.push("api_key = ?"), h.push(o)), c && (u.push("api_secret = ?"), h.push(c)), d && (u.push("api_passphrase = ?"), h.push(d)), l && (u.push("extra_config = ?"), h.push(typeof l == "string" ? l : JSON.stringify(l))), u.push("updated_at = datetime('now')"), await s.env.DB.prepare(
        `UPDATE venues SET ${u.join(", ")} WHERE id = ?`
      ).bind(...h, t).run();
    } else
      await s.env.DB.prepare(
        `INSERT INTO venues (venue, display_name, enabled, testnet, api_key, api_secret, api_passphrase, extra_config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        n,
        a,
        r !== void 0 ? r ? 1 : 0 : 1,
        i !== void 0 && i ? 1 : 0,
        o || null,
        c || null,
        d || null,
        l ? typeof l == "string" ? l : JSON.stringify(l) : null
      ).run();
    return await s.env.DB.prepare(
      "INSERT INTO logs (level, message, source) VALUES ('info', ?, 'venues')"
    ).bind(`Venue '${n}' ${t ? "updated" : "created"}`).run(), s.json({ success: !0, venue: n });
  } catch (e) {
    return s.json({ error: e.message }, 500);
  }
});
Nt.delete("/:id", async (s) => {
  var t;
  const e = parseInt(s.req.param("id"), 10);
  if (isNaN(e)) return s.json({ error: "invalid id" }, 400);
  try {
    const n = await s.env.DB.prepare("SELECT venue FROM venues WHERE id = ?").bind(e).first();
    return (n == null ? void 0 : n.venue) === "paper" ? s.json({ error: "Cannot delete paper trading venue" }, 400) : (t = (await s.env.DB.prepare("DELETE FROM venues WHERE id = ?").bind(e).run()).meta) != null && t.changes ? (await s.env.DB.prepare(
      "INSERT INTO logs (level, message, source) VALUES ('warn', ?, 'venues')"
    ).bind(`Venue '${(n == null ? void 0 : n.venue) || e}' deleted`).run(), s.json({ success: !0 })) : s.json({ error: "Venue not found" }, 404);
  } catch (n) {
    return s.json({ error: n.message }, 500);
  }
});
async function zt(s, e) {
  const t = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    t.encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), a = await crypto.subtle.sign("HMAC", n, t.encode(e));
  return btoa(String.fromCharCode(...new Uint8Array(a)));
}
async function nt(s, e) {
  const t = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    t.encode(s),
    { name: "HMAC", hash: "SHA-256" },
    !1,
    ["sign"]
  ), a = await crypto.subtle.sign("HMAC", n, t.encode(e));
  return [...new Uint8Array(a)].map((r) => r.toString(16).padStart(2, "0")).join("");
}
async function ma(s) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
async function co(s) {
  var l, u, h, m, _, E;
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim(), n = (s.api_passphrase || "").trim();
  if (!e || !t || !n)
    return { ok: !1, message: `OKX: API Key(${e ? "✓" : "✗"}) Secret(${t ? "✓" : "✗"}) Passphrase(${n ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const a = "GET", r = "/api/v5/account/balance?ccy=USDT", i = (/* @__PURE__ */ new Date()).toISOString(), o = await zt(t, i + a + r), d = await (await fetch(`https://www.okx.com${r}`, {
    method: a,
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
    const S = (u = (l = d.data) == null ? void 0 : l[0]) == null ? void 0 : u.totalEq, b = ((E = (_ = (m = (h = d.data) == null ? void 0 : h[0]) == null ? void 0 : m.details) == null ? void 0 : _[0]) == null ? void 0 : E.ccy) || "USDT", C = S ? parseFloat(S) : void 0;
    return {
      ok: !0,
      balance: C,
      currency: b,
      message: `OKX 验证通过，账户总权益 $${(C == null ? void 0 : C.toFixed(2)) ?? "?"}`
    };
  }
  return { ok: !1, message: `OKX 认证失败 (${d.code}): ${d.msg || "请检查 API Key/Secret/Passphrase 是否正确"}` };
}
async function lo(s) {
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim();
  if (!e || !t)
    return { ok: !1, message: `Binance: API Key(${e ? "✓" : "✗"}) Secret(${t ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const n = Date.now(), a = await nt(t, `timestamp=${n}`), r = await fetch(`https://fapi.binance.com/fapi/v1/account?timestamp=${n}&signature=${a}`, {
    headers: { "X-MBX-APIKEY": e, Accept: "application/json" },
    signal: AbortSignal.timeout(8e3)
  });
  if (r.ok) {
    const o = await r.json(), c = (o == null ? void 0 : o.totalWalletBalance) || "?";
    return { ok: !0, message: `Binance 验证通过，账户余额 $${parseFloat(c).toFixed(2)}` };
  }
  const i = await r.text();
  return { ok: !1, message: `Binance 认证失败 (${r.status}): ${i.slice(0, 200)}` };
}
async function uo(s) {
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim();
  if (!e || !t)
    return { ok: !1, message: `Gate.io: API Key(${e ? "✓" : "✗"}) Secret(${t ? "✓" : "✗"}) 请填写完整并保存后再测试` };
  const n = "GET", a = "/api/v4/futures/usdt/accounts", r = "", i = await ma(""), o = Math.floor(Date.now() / 1e3).toString(), c = `${n}
${a}
${r}
${i}
${o}`, d = await nt(t, c), l = await fetch(`https://api.gateio.ws${a}`, {
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
const _s = {
  okx: co,
  binance: lo,
  gate: uo
};
Nt.post("/:id/test", async (s) => {
  const e = parseInt(s.req.param("id"), 10);
  if (isNaN(e)) return s.json({ error: "invalid id" }, 400);
  try {
    const t = await s.env.DB.prepare(
      "SELECT * FROM venues WHERE id = ?"
    ).bind(e).first();
    if (!t) return s.json({ error: "Venue not found" }, 404);
    const n = t;
    if (n.venue === "paper")
      return s.json({ success: !0, message: "Paper trading is always available" });
    const a = _s[n.venue];
    if (!a)
      return s.json({
        success: !1,
        message: `Unsupported venue: ${n.venue}`
      });
    const r = await a(n);
    return await s.env.DB.prepare(
      "INSERT INTO logs (level, message, source) VALUES (?, ?, 'venues')"
    ).bind(r.ok ? "info" : "error", r.message).run(), s.json({ success: r.ok, message: r.message });
  } catch (t) {
    return s.json({ error: t.message }, 500);
  }
});
async function Ws(s, e = 6e3) {
  const t = Date.now();
  try {
    let n = "";
    if (s === "okx") n = "https://www.okx.com/api/v5/public/time";
    else if (s === "binance") n = "https://fapi.binance.com/fapi/v1/time";
    else if (s === "gate") n = "https://api.gateio.ws/api/v4/futures/usdt/contracts";
    else return { ok: !1, latency_ms: null, message: `Unknown venue: ${s}` };
    const a = await fetch(n, { method: "GET", signal: AbortSignal.timeout(e) }), r = Date.now() - t;
    return a.ok ? { ok: !0, latency_ms: r, message: `${s} 公共 API 可达（延迟 ${r}ms）` } : { ok: !1, latency_ms: r, message: `${s} 返回 HTTP ${a.status}` };
  } catch (n) {
    return { ok: !1, latency_ms: Date.now() - t, message: `${s} 连接失败: ${n.name}` };
  }
}
Nt.get("/health", async (s) => {
  try {
    const e = await s.env.DB.prepare(
      "SELECT value FROM config WHERE key = 'venue_health'"
    ).first(), t = Date.now();
    if (e) {
      const o = JSON.parse(e.value);
      if (t - (o._checked_at || 0) < 6e4) {
        const { _checked_at: d, ...l } = o;
        return s.json({ health: l });
      }
    }
    const n = await s.env.DB.prepare(
      `SELECT venue, display_name, api_key, api_secret, api_passphrase
       FROM venues WHERE enabled = 1 AND venue != 'paper'`
    ).all(), a = {}, r = (n.results || []).map(async (o) => {
      const c = o.venue, d = !!(o.api_key && o.api_secret), l = _s[c];
      if (d && l) {
        const u = Date.now();
        try {
          const h = await l(o), m = Date.now() - u;
          a[c] = {
            venue: c,
            display_name: o.display_name,
            ok: h.ok,
            latency_ms: m,
            message: h.message,
            balance: h.balance,
            currency: h.currency,
            mode: h.ok ? "authenticated" : "network_error",
            checked_at: (/* @__PURE__ */ new Date()).toISOString(),
            has_key: !0
          };
        } catch (h) {
          const m = Date.now() - u;
          a[c] = {
            venue: c,
            display_name: o.display_name,
            ok: !1,
            latency_ms: m,
            message: `测试异常: ${h.name}`,
            mode: "network_error",
            checked_at: (/* @__PURE__ */ new Date()).toISOString(),
            has_key: !0
          };
        }
      } else {
        const u = await Ws(c);
        a[c] = {
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
    await Promise.allSettled(r);
    const i = { ...a, _checked_at: t };
    return await s.env.DB.prepare(
      "INSERT OR REPLACE INTO config (key, value) VALUES ('venue_health', ?)"
    ).bind(JSON.stringify(i)).run(), s.json({ health: a });
  } catch (e) {
    return s.json({ error: e.message }, 500);
  }
});
function Rs(s) {
  return !s || s.length < 6 ? "******" : s.slice(0, 4) + "****" + s.slice(-4);
}
const ho = {
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
}, po = {
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
}, fo = {
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
function Zs(s, e) {
  switch (e) {
    case "okx":
      return s;
    case "binance":
      return s.replace(/-/g, "").replace("SWAP", "");
    case "gate":
      return s.replace("-SWAP", "_USDT");
    default:
      return s;
  }
}
async function mo(s, e, t) {
  var c;
  const n = Zs(s, "okx"), a = ho[e] || "15m", r = `https://www.okx.com/api/v5/market/candles?instId=${n}&bar=${a}&limit=${t}`, i = await fetch(r, {
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
async function go(s, e, t) {
  const n = Zs(s, "binance"), a = po[e] || "15m", r = `https://fapi.binance.com/fapi/v1/klines?symbol=${n}&interval=${a}&limit=${t}`, i = await fetch(r, {
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
async function _o(s, e, t) {
  const n = Zs(s, "gate"), a = fo[e] || "15m", r = `https://api.gateio.ws/api/v4/futures/usdt/candlesticks?contract=${n}&interval=${a}&limit=${t}`, i = await fetch(r, {
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
const yo = {
  okx: mo,
  binance: go,
  gate: _o
};
async function Ns(s, e, t, n) {
  const a = await s.prepare(
    "SELECT venue FROM venues WHERE enabled = 1 AND venue != 'paper' ORDER BY venue LIMIT 1"
  ).first();
  if (!a) return null;
  const r = a.venue, i = yo[r];
  return i ? i(e, t, n) : null;
}
class hc {
  constructor(e, t) {
    y(this, "state");
    y(this, "env");
    y(this, "storage");
    y(this, "initialized", !1);
    /** 所有活跃的 WebSocket 连接 */
    y(this, "webSockets", /* @__PURE__ */ new Set());
    /** 客户端订阅的品种/周期，key: ws → "instId:bar" */
    y(this, "candleSub", /* @__PURE__ */ new Map());
    /** K 线内存缓存：key → { data, ts }，防 429 */
    y(this, "candleCache", /* @__PURE__ */ new Map());
    y(this, "CANDLE_CACHE_TTL", 3e5);
    // 5 分钟
    /** Factor 缓存（算好的）—— buildFactors 只读此缓存，不碰交易所 */
    y(this, "factorsCache", null);
    y(this, "FACTORS_CACHE_TTL", 3e5);
    // 5 分钟
    /** instruments 缓存（D1 数据极少变更，缓存避免高频查询） */
    y(this, "instrumentsCache", null);
    y(this, "INSTRUMENTS_CACHE_TTL", 3e5);
    // 5 分钟
    /** config / equity / logs / logMsgs 缓存 —— 每 10s alarm 不重复读 D1 */
    y(this, "configCache", null);
    y(this, "CONFIG_CACHE_TTL", 3e5);
    // 5 分钟
    y(this, "equityHistoryCache", null);
    y(this, "EQUITY_CACHE_TTL", 3e5);
    // 5 分钟
    y(this, "logsCache", null);
    y(this, "LOGS_CACHE_TTL", 6e4);
    // 1 分钟
    y(this, "logMsgsCache", null);
    y(this, "LOGMSGS_CACHE_TTL", 6e4);
    // 1 分钟
    y(this, "tradesCache", null);
    y(this, "TRADES_CACHE_TTL", 3e5);
    // 5 分钟
    /** AI 提供商健康缓存（alarm 驱动，5 分钟刷新） */
    y(this, "aiProviderHealthCache", null);
    y(this, "_lastAIProviderCheck", 0);
    /** 交易所仓位同步缓存（从交易所 API 拉取，非本地 orders/trades 表） */
    y(this, "exchangePositionsCache", null);
    y(this, "exchangeOrdersCache", null);
    y(this, "_lastExchangeSync", 0);
    /** ── DO 内存缓存（高频动态数据不重复读 D1，由事件驱动更新） ── */
    y(this, "positionsCache", []);
    // open trades
    y(this, "ordersCache", []);
    // pending orders
    y(this, "todayStatsCache", {
      realized_gross: 0,
      fees_paid: 0,
      net_realized: 0,
      win_trades: 0,
      loss_trades: 0,
      win_rate: 0,
      source: "memory"
    });
    y(this, "exchangeBalance", null);
    // 交易所余额缓存
    y(this, "venueHealthCache", null);
    /** DRYRUN 模式相关 */
    y(this, "dryrunOrders", []);
    // DRYRUN mode simulated orders
    y(this, "dryrunMode", !1);
    // current DRYRUN/LIVE mode
    /** 错峰拉取：当前轮到的索引 */
    y(this, "staggerIndex", 0);
    /** 预拉取 K 线缓存错峰索引 */
    y(this, "_prefetchIndex", 0);
    /** ── 止盈止损（SL/TP）价跟踪：key = inst_id:venue，用于 auto-close ── */
    y(this, "sltpMap", /* @__PURE__ */ new Map());
    /** 自动交易所健康检查（alarm 驱动，用公开 ping，无需 API key） */
    y(this, "_lastHealthCheck", 0);
    this.state = e, this.env = t, this.storage = /* @__PURE__ */ new Map();
  }
  async initialize() {
    var a, r, i;
    if (this.initialized) return;
    this.initialized = !0;
    const e = await ((a = this.state.storage) == null ? void 0 : a.get("trader_state"));
    if (e)
      for (const [o, c] of Object.entries(e))
        this.storage.set(o, c);
    const t = await ((r = this.state.storage) == null ? void 0 : r.get("dryrun_orders"));
    if (t)
      try {
        this.dryrunOrders = JSON.parse(t);
      } catch {
        this.dryrunOrders = [];
      }
    const n = await ((i = this.state.storage) == null ? void 0 : i.get("dryrun_mode"));
    this.dryrunMode = n === "true";
    try {
      this.positionsCache = await Zi(this.env.DB), this.ordersCache = await Gi(this.env.DB);
      const o = await io(this.env.DB);
      o && (this.todayStatsCache = o);
    } catch {
    }
    await this.loadExchangeSyncCache(), await G(this.env.DB, "info", "TraderDO initialized", "trader-do");
  }
  /** 缓存版 getInstruments —— 避免每 10s alarm 重复读 D1 */
  async getCachedInstruments(e) {
    if (this.instrumentsCache && Date.now() - this.instrumentsCache.ts < this.INSTRUMENTS_CACHE_TTL)
      return this.instrumentsCache.data;
    const t = await no(e);
    return t.length > 0 && (this.instrumentsCache = { data: t, ts: Date.now() }), t;
  }
  // ── Main request handler ──
  async fetch(e) {
    if (await this.initialize(), e.headers.get("Upgrade") === "websocket") {
      const t = new WebSocketPair(), [n, a] = Object.values(t);
      return this.state.acceptWebSocket(a), this.webSockets.add(a), a.send(JSON.stringify({ type: "connected", message: "TraderDO Hibernation WebSocket" })), this.state.storage.getAlarm().then((r) => {
        r === null && this.state.storage.setAlarm(Date.now() + 15e3);
      }), new Response(null, { status: 101, webSocket: n });
    }
    if (e.method === "POST") {
      const t = await e.json();
      return this.handleCommand(t);
    }
    if (e.method === "GET") {
      const t = new URL(e.url);
      if (t.pathname === "/api/dashboard") {
        const n = await this.assembleDashboardData();
        return new Response(JSON.stringify(n), {
          headers: { "Content-Type": "application/json" }
        });
      }
      return t.pathname === "/status" || t.pathname === "/api/status" ? this.getAutoRunStatus() : this.getState();
    }
    return new Response("Method not allowed", { status: 405 });
  }
  // ── DO Hibernation 钩子 ──────────────────────────────────
  /**
   * DO 从休眠中唤醒，收到 WebSocket 消息时调用此方法。
   * Hibernation API 接管后，所有消息均通过此钩子处理（无论休眠/活跃态）。
   */
  async webSocketMessage(e, t) {
    try {
      await this.initialize(), await this.handleWSMessage(e, t);
    } catch (n) {
      try {
        e.send(JSON.stringify({ type: "error", message: `webSocketMessage: ${String(n)}` }));
      } catch {
      }
    }
  }
  /** WebSocket 关闭时清理 */
  async webSocketClose(e, t, n, a) {
    this.webSockets.delete(e), this.candleSub.delete(e);
  }
  /** Alarm 驱动：定时从交易所拉取最新 K 线 → 内存缓存 → WS 推送 + 心跳 */
  async alarm() {
    if (await this.initialize(), await this.prefetchAllCandleCaches(), this.webSockets.size > 0 && await this.broadcastAllCandles(), this.webSockets.size > 0) {
      const a = JSON.stringify({ type: "ping" });
      for (const r of this.webSockets)
        try {
          r.send(a);
        } catch {
          this.webSockets.delete(r), this.candleSub.delete(r);
        }
    }
    if (!this.factorsCache || Date.now() - this.factorsCache.ts >= this.FACTORS_CACHE_TTL)
      try {
        const a = await this.getCachedInstruments(this.env.DB), r = await this.computeFactors(a);
        r.length > 0 && (this.factorsCache = { factors: r, ts: Date.now() });
      } catch {
      }
    if (!this.venueHealthCache || Date.now() - this._lastHealthCheck >= 3e5)
      try {
        await this.autoHealthCheck();
      } catch {
      }
    if (await this.autoAIProviderHealthCheck(), await this.syncExchangeData(), this.storage.get("auto_run") === !0) {
      const a = this.storage.get("auto_run_interval_seconds") || 60, r = this.storage.get("last_auto_run_time") || 0;
      Date.now() - r >= a * 1e3 && (this.storage.set("last_auto_run_time", Date.now()), this.processStrategy({ _auto: !0 }).then((i) => {
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
    const e = this.env.DB, t = Date.now(), n = await e.prepare(
      `SELECT venue, display_name, api_key, api_secret, api_passphrase
       FROM venues WHERE enabled = 1 AND venue != 'paper'`
    ).all(), a = {}, r = (n.results || []).map(async (i) => {
      const o = Date.now();
      if (i.api_key) {
        const d = _s[i.venue];
        if (d) {
          try {
            const l = await d(i);
            a[i.venue] = {
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
            a[i.venue] = {
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
      const c = await Ws(i.venue);
      a[i.venue] = {
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
    await Promise.allSettled(r), this.venueHealthCache = a, this.exchangeBalance = null, this._lastHealthCheck = t;
  }
  /** 自动 AI 提供商健康检查（alarm 驱动，用 POST /messages 等 /models 轻量探测） */
  async autoAIProviderHealthCheck() {
    const e = Date.now();
    if (!(e - this._lastAIProviderCheck < 3e5)) {
      this._lastAIProviderCheck = e;
      try {
        const t = await this.env.DB.prepare(
          `SELECT id, name, provider_type, api_key, api_url, models, enabled
         FROM llm_providers WHERE enabled = 1`
        ).all(), n = {}, a = (t.results || []).map(async (r) => {
          const i = Date.now(), o = (r.api_url || "").replace(/\/+$/, "") || "https://api.openai.com/v1", c = r.api_key || "";
          try {
            let d = !1, l = "";
            if (["openai_chat", "openai_compat", "deepseek_chat"].includes(r.provider_type)) {
              const u = await fetch(`${o}/models`, {
                headers: { Authorization: `Bearer ${c}` },
                signal: AbortSignal.timeout(8e3)
              });
              d = u.ok, l = d ? `HTTP ${u.status}` : `HTTP ${u.status} ${u.statusText}`;
            } else if (r.provider_type === "anthropic_chat") {
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
            n[r.name] = {
              name: r.name,
              provider_type: r.provider_type,
              models: r.models,
              ok: d,
              latency_ms: Date.now() - i,
              message: l,
              checked_at: (/* @__PURE__ */ new Date()).toISOString()
            };
          } catch (d) {
            n[r.name] = {
              name: r.name,
              provider_type: r.provider_type,
              models: r.models,
              ok: !1,
              latency_ms: Date.now() - i,
              message: d.name === "TimeoutError" ? "超时" : d.message,
              checked_at: (/* @__PURE__ */ new Date()).toISOString()
            };
          }
        });
        await Promise.allSettled(a), this.aiProviderHealthCache = n;
      } catch {
      }
    }
  }
  /** 从已连接交易所同步仓位 & 挂单（alarm 驱动，5 分钟一次） */
  async syncExchangeData() {
    var t;
    const e = Date.now();
    if (!(e - this._lastExchangeSync < 3e5)) {
      this._lastExchangeSync = e;
      try {
        const n = await this.env.DB.prepare(
          `SELECT venue, display_name, api_key, api_secret, api_passphrase
         FROM venues WHERE enabled = 1 AND venue != 'paper' AND api_key IS NOT NULL AND api_key != ''`
        ).all();
        if (!((t = n.results) != null && t.length)) return;
        const a = [], r = [], i = (n.results || []).map(async (o) => {
          try {
            const { positions: c, orders: d } = await xo(o);
            a.push(...c.map((l) => ({ ...l, _venue: o.venue }))), r.push(...d.map((l) => ({ ...l, _venue: o.venue })));
          } catch {
          }
        });
        await Promise.allSettled(i), this.exchangePositionsCache = a.length > 0 ? a : null, this.exchangeOrdersCache = r.length > 0 ? r : null, await this.env.DB.prepare(
          "INSERT OR REPLACE INTO config (key, value) VALUES ('exchange_positions', ?)"
        ).bind(JSON.stringify({ positions: a, orders: r, _synced_at: e })).run();
      } catch {
      }
    }
  }
  /** 从 D1 恢复交易所仓位缓存 */
  async loadExchangeSyncCache() {
    if (!(this.exchangePositionsCache || this.exchangeOrdersCache))
      try {
        const e = await this.env.DB.prepare(
          "SELECT value FROM config WHERE key = 'exchange_positions'"
        ).first();
        if (e) {
          const t = JSON.parse(e.value);
          Date.now() - (t._synced_at || 0) < 3e5 && (this.exchangePositionsCache = t.positions || null, this.exchangeOrdersCache = t.orders || null);
        }
      } catch {
      }
  }
  // ── WebSocket 消息分发 ──────────────────────────────────
  async handleWSMessage(e, t) {
    var a, r, i;
    let n;
    try {
      n = JSON.parse(typeof t == "string" ? t : new TextDecoder().decode(t));
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
            "SELECT name FROM strategies WHERE enabled = 1 ORDER BY priority DESC LIMIT 1"
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
        this.dryrunMode = o === "dryrun", await ((a = this.state.storage) == null ? void 0 : a.put("dryrun_mode", String(this.dryrunMode))), this.dryrunMode || (this.dryrunOrders = [], await ((r = this.state.storage) == null ? void 0 : r.put("dryrun_orders", "[]"))), e.send(JSON.stringify({ type: "dryrun", mode: this.dryrunMode ? "dryrun" : "live" })), await this.pushDashboard(e);
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
    const e = "1H", t = this.CANDLE_CACHE_TTL, n = await this.getCachedInstruments(this.env.DB), a = n.length;
    if (a === 0) return;
    const r = [];
    for (const c of n) {
      const d = `${c.inst_id}:${e}`, l = this.candleCache.get(d);
      (!l || Date.now() - l.ts >= t) && r.push(c.inst_id);
    }
    if (r.length === 0) return;
    const o = r.length > a / 2 ? Math.min(5, r.length) : 1;
    for (let c = 0; c < o; c++) {
      const d = (this._prefetchIndex + c) % r.length, l = r[d];
      try {
        const u = await Ns(this.env.DB, l, e, 150);
        u && u.length >= 2 && this.candleCache.set(`${l}:${e}`, { data: u, ts: Date.now() });
      } catch {
      }
    }
    this._prefetchIndex += o;
  }
  /** 向所有订阅的客户端广播所有品种的最新 K 线（错峰拉取，防 429） */
  async broadcastAllCandles() {
    const e = /* @__PURE__ */ new Map();
    for (const [a, r] of this.candleSub)
      e.has(r) || e.set(r, /* @__PURE__ */ new Set()), e.get(r).add(a);
    const t = [...e.keys()];
    if (t.length === 0) return;
    this.staggerIndex = this.staggerIndex % t.length;
    const n = t[this.staggerIndex];
    this.staggerIndex++;
    for (const a of t) {
      const [r, i] = a.split(":"), o = e.get(a), c = `${r}:${i}`;
      let d = [];
      const l = this.candleCache.get(c);
      if (l && (d = l.data), a === n)
        try {
          const h = await Ns(this.env.DB, r, i, 150);
          h && h.length >= 2 && (d = h, this.candleCache.set(c, { data: d, ts: Date.now() }));
        } catch (h) {
          console.error(`[TraderDO] broadcastAllCandles error: ${r}/${i} -`, h);
        }
      if (!d.length) continue;
      const u = JSON.stringify({ type: "candles", instId: r, bar: i, candles: d });
      for (const h of o)
        try {
          h.send(u);
        } catch {
          this.webSockets.delete(h), this.candleSub.delete(h);
        }
    }
  }
  /** 向单个客户端推送指定品种的 K 线（有缓存直接发，alarm 负责刷新） */
  async pushCandles(e, t, n) {
    try {
      const a = `${t}:${n}`, r = this.candleCache.get(a);
      if (r) {
        e.send(JSON.stringify({ type: "candles", instId: t, bar: n, candles: r.data }));
        return;
      }
      const i = await Ns(this.env.DB, t, n, 150);
      i && i.length >= 2 ? (this.candleCache.set(a, { data: i, ts: Date.now() }), e.send(JSON.stringify({ type: "candles", instId: t, bar: n, candles: i }))) : e.send(JSON.stringify({ type: "candles", instId: t, bar: n, candles: [] }));
    } catch (a) {
      console.error(`[TraderDO] pushCandles error: ${t}/${n} -`, a);
      try {
        e.send(JSON.stringify({ type: "error", message: `pushCandles failed: ${String(a)}` }));
      } catch {
      }
    }
  }
  /** 向单个客户端推送完整的仪表盘数据 */
  async pushDashboard(e) {
    try {
      const t = await this.assembleDashboardData();
      e.send(JSON.stringify({ type: "dashboard", data: t }));
    } catch (t) {
      try {
        e.send(JSON.stringify({ type: "error", message: `pushDashboard: ${String(t)}` }));
      } catch {
      }
    }
  }
  /** 交易所健康检查（WS 版，替代 HTTP /api/venues/health） */
  async handleHealthCheck(e) {
    try {
      const t = this.env.DB, n = Date.now(), a = await t.prepare(
        `SELECT venue, display_name, api_key, api_secret, api_passphrase
         FROM venues WHERE enabled = 1 AND venue != 'paper'`
      ).all(), r = {}, i = (a.results || []).map(async (c) => {
        const d = c.venue, l = !!(c.api_key && c.api_secret), u = _s[d];
        if (l && u) {
          const h = Date.now();
          try {
            const m = await u(c), _ = Date.now() - h;
            r[d] = {
              venue: d,
              display_name: c.display_name,
              ok: m.ok,
              latency_ms: _,
              message: m.message,
              balance: m.balance,
              currency: m.currency,
              mode: m.ok ? "authenticated" : "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          } catch (m) {
            const _ = Date.now() - h;
            r[d] = {
              venue: d,
              display_name: c.display_name,
              ok: !1,
              latency_ms: _,
              message: `测试异常: ${m.name}`,
              mode: "network_error",
              checked_at: (/* @__PURE__ */ new Date()).toISOString(),
              has_key: !0
            };
          }
        } else {
          const h = await Ws(d);
          r[d] = {
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
      await Promise.allSettled(i), this.venueHealthCache = r, this.exchangeBalance = null;
      const o = { ...r, _checked_at: n };
      await t.prepare(
        "INSERT OR REPLACE INTO config (key, value) VALUES ('venue_health', ?)"
      ).bind(JSON.stringify(o)).run(), e.send(JSON.stringify({ type: "health_checked", health: r })), await this.pushDashboard(e);
    } catch (t) {
      try {
        e.send(JSON.stringify({ type: "error", message: `health_check: ${t.message}` }));
      } catch {
      }
    }
  }
  // ── Assemble full dashboard response（动态数据读 DO 内存缓存）──
  async assembleDashboardData() {
    const e = this.env.DB, t = await this.getCachedInstruments(e);
    let n;
    this.configCache && Date.now() - this.configCache.ts < this.CONFIG_CACHE_TTL ? n = this.configCache.data : (n = await so(e), this.configCache = { data: n, ts: Date.now() });
    let a;
    this.tradesCache && Date.now() - this.tradesCache.ts < this.TRADES_CACHE_TTL ? a = this.tradesCache.data : (a = await Ki(e, 10), this.tradesCache = { data: a, ts: Date.now() });
    let r;
    this.equityHistoryCache && Date.now() - this.equityHistoryCache.ts < this.EQUITY_CACHE_TTL ? r = this.equityHistoryCache.data : (r = await Xi(e, 30), this.equityHistoryCache = { data: r, ts: Date.now() });
    let i;
    this.logsCache && Date.now() - this.logsCache.ts < this.LOGS_CACHE_TTL ? i = this.logsCache.data : (i = await Qi(e, 30), this.logsCache = { data: i, ts: Date.now() });
    let o;
    this.logMsgsCache && Date.now() - this.logMsgsCache.ts < this.LOGMSGS_CACHE_TTL ? o = this.logMsgsCache.data : (o = await eo(e, 30), this.logMsgsCache = { data: o, ts: Date.now() });
    const c = parseFloat(n.initial_capital || "10000"), d = parseFloat(n.current_equity || String(c));
    let l = { total_cum_net_pnl: 0, total_cum_realized_pnl: 0, cum_roi_pct: 0, profit_factor: 0, avg_win: 0, avg_loss: 0, win_rate: 0 };
    try {
      l = await oo(e);
    } catch {
    }
    const u = await this.buildFactors(t), h = this.positionsCache, m = this.ordersCache, _ = this.todayStatsCache, E = this.exchangePositionsCache ?? [], S = [...h, ...E], b = this.exchangeOrdersCache ?? [], C = [...m, ...b.map((f) => ({
      order_id: f.ordId || f.order_id || "",
      inst_id: f.instId || f.inst_id,
      side: f.side,
      pos_side: f.posSide || f.pos_side || (f.side === "buy" ? "long" : "short"),
      price: f.price || f.px || 0,
      size: f.size || f.sz || 0,
      state: f.state,
      created_at: f.createdAt || f.cTime || f.created_at || "",
      leverage: f.leverage || f.lever || 1,
      _venue: f._venue || f.venue || "exchange"
    }))];
    let L = this.exchangeBalance;
    if (L === null && this.venueHealthCache)
      for (const f of Object.values(this.venueHealthCache)) {
        const ae = f;
        if (ae.ok && ae.balance != null) {
          L = ae.balance;
          break;
        }
      }
    const D = L ?? d, W = {
      total_eq: D,
      avail_eq: D * 0.8,
      cash_bal: D * 0.3,
      upl: h.reduce((f, ae) => f + (parseFloat(ae.upl || "0") || 0), 0),
      pos_upl_total: h.reduce((f, ae) => f + (parseFloat(ae.upl || "0") || 0), 0),
      margin_usage_pct: h.length > 0 ? 20 : 0,
      initial_capital: c,
      cum_net_pnl: l.total_cum_net_pnl,
      cum_realized_pnl: l.total_cum_realized_pnl,
      cum_roi_pct: c > 0 ? (D - c) / c * 100 : 0,
      cum_total_fees: _.fees_paid
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
      account: W,
      positions_summary: {
        total_count: S.length,
        long_count: S.filter((f) => f.pos_side === "long" || f.side === "long").length,
        short_count: S.filter((f) => f.pos_side === "short" || f.side === "short").length,
        items: S.map((f) => {
          var ae;
          return {
            instId: f.inst_id || f.instId,
            name: ((ae = f.inst_id || f.instId || "") == null ? void 0 : ae.split("-")[0]) || "",
            side: f.pos_side || f.side || "long",
            pos: String(f.size || f.pos || "0"),
            lever: String(f.leverage || f.lever || "1"),
            margin: String(f.margin || (f.size || 0) * (f.open_price || 0) / (f.leverage || 1)),
            avgPx: String(f.open_price || f.avgPx || "0"),
            last: String(f.mark_price || f.last || f.open_price || "0"),
            upl: String(f.upl || "0"),
            uplRatio: String(f.upl_ratio || f.uplRatio || "0"),
            venue: f._venue || f.venue || "",
            notional_usdt: f.notional_usdt || 0
          };
        })
      },
      pending_orders: [
        ...C.map((f) => ({
          ordId: f.order_id || f.ordId || String(f.id),
          instId: f.inst_id || f.instId,
          side: f.side,
          posSide: f.pos_side || f.posSide || (f.side === "buy" ? "long" : "short"),
          px: String(f.price || f.px || "0"),
          sz: String(f.size || f.sz || "0"),
          state: f.state,
          cTime: f.created_at || f.cTime || f.createdAt || "",
          lever: String(f.leverage || f.lever || "1"),
          venue: f._venue || f.venue || ""
        })),
        // DRYRUN mode 模拟挂单
        ...(this.dryrunOrders || []).map((f) => ({
          ordId: f.ordId,
          instId: f.instId,
          side: f.side,
          posSide: f.posSide,
          px: f.px,
          sz: f.sz,
          state: f.state,
          cTime: f.cTime,
          lever: f.lever,
          venue: f.venue,
          tag: f.tag || "DRYRUN"
        }))
      ],
      factors: u,
      today_stats: _,
      performance: te,
      equity_history: r,
      logs: o,
      trades: a.slice(0, 20),
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
    const t = await this.computeFactors(e);
    return t.length > 0 && (this.factorsCache = { factors: t, ts: Date.now() }), t;
  }
  /** 计算 factor：只读 DO 内存缓存，不碰交易所 API */
  async computeFactors(e) {
    var n;
    const t = [];
    for (const a of e)
      try {
        const r = `${a.inst_id}:1H`, i = this.candleCache.get(r);
        if (!i || Date.now() - i.ts >= this.CANDLE_CACHE_TTL)
          continue;
        const o = i.data;
        if (o.length < 2) continue;
        const c = o[o.length - 1], d = o[o.length - 2], l = d.close > 0 ? (c.close - d.close) / d.close * 100 : 0, u = this.computeDecisionSimple(o);
        t.push({
          instId: a.inst_id,
          name: a.name || ((n = a.inst_id) == null ? void 0 : n.split("-")[0]) || "",
          price: c.close,
          chg24h: Math.round(l * 100) / 100,
          high24h: Math.max(...o.slice(-24).map((h) => h.high)),
          low24h: Math.min(...o.slice(-24).map((h) => h.low)),
          vol24h: o.slice(-24).reduce((h, m) => h + m.vol, 0),
          rsi: this.computeRSI(o),
          decision: u.action !== "WAIT" ? u : void 0
        });
      } catch {
        continue;
      }
    return t;
  }
  computeRSI(e) {
    const t = e.map((o) => o.close), n = [], a = [];
    for (let o = 1; o < t.length; o++) {
      const c = t[o] - t[o - 1];
      n.push(c > 0 ? c : 0), a.push(c < 0 ? -c : 0);
    }
    const r = n.slice(-14).reduce((o, c) => o + c, 0) / 14, i = a.slice(-14).reduce((o, c) => o + c, 0) / 14;
    return i === 0 ? 100 : Math.round((100 - 100 / (1 + r / i)) * 10) / 10;
  }
  computeDecisionSimple(e) {
    const t = e.map((_) => _.close), n = t[t.length - 1], a = t[t.length - 2], r = this.computeRSI(e), i = a > 0 ? (n - a) / a * 100 : 0, o = this.ema(t, 12), c = this.ema(t, 26), d = o - c, l = t.length >= 50 ? this.ema(t, 50) : t.reduce((_, E) => _ + E, 0) / t.length, u = n >= l, h = { rsi: r, macd: d, chg_pct: i, above_ema50: u, current: n, prev: a }, m = kn();
    for (const _ of m.filter((E) => E.enabled).sort((E, S) => S.priority - E.priority))
      if (this.evaluateRuleConditions(_.conditions, h)) {
        let S = _.confidence;
        return _.action === "BUY_LONG" && r < 35 ? S = Math.min(85, Math.round(S + (35 - r) * 2)) : _.action === "SELL_SHORT" && r > 70 && (S = Math.min(85, Math.round(S + (r - 70) * 2))), {
          action: _.action,
          confidence: S,
          leverage: _.leverage || 2,
          entry_price: n,
          take_profit_price: n * (1 + (_.take_profit_pct || 3) / 100 * (_.action === "BUY_LONG" ? 1 : -1)),
          stop_loss_price: n * (1 - (_.stop_loss_pct || 1.5) / 100 * (_.action === "BUY_LONG" ? 1 : -1)),
          risk_reward_ratio: `${Math.abs((_.take_profit_pct || 3) / (_.stop_loss_pct || 1.5)).toFixed(1)}:1`,
          summary_reason: _.name
        };
      }
    return { action: "WAIT", confidence: 30, leverage: 1, entry_price: n, summary_reason: `RSI ${r.toFixed(1)} 无规则匹配` };
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
    const t = Math.max(60, (e == null ? void 0 : e.interval_seconds) ?? 900);
    return this.storage.set("auto_run", !0), this.storage.set("auto_run_interval_seconds", t), this.storage.set("last_auto_run_time", Date.now()), await ((n = this.state.storage) == null ? void 0 : n.put("trader_state", Object.fromEntries(this.storage))), await G(this.env.DB, "info", `[AutoRun] 启动自动交易，间隔 ${t}s`, "trader-do"), this.processStrategy({ _auto: !0 }).catch(() => {
    }), new Response(JSON.stringify({
      status: "started",
      auto_run: !0,
      interval_seconds: t
    }), { headers: { "Content-Type": "application/json" } });
  }
  /**
   * 停止自动交易模式。
   */
  async stopAutoRun() {
    var e;
    return this.storage.set("auto_run", !1), await ((e = this.state.storage) == null ? void 0 : e.put("trader_state", Object.fromEntries(this.storage))), await G(this.env.DB, "info", "[AutoRun] 停止自动交易", "trader-do"), new Response(JSON.stringify({
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
    var S, b, C, L;
    const t = this.env.DB, n = crypto.randomUUID(), a = [], r = await this.loadRiskConfig(t), i = this.checkRiskGates(r);
    if (i.blocked)
      return await G(t, "warn", `[Pass 1] 风控熔断: ${i.reason}`, "trader-do"), new Response(JSON.stringify({
        cycle_id: n,
        status: "blocked",
        pass: 1,
        reason: i.reason,
        decisions: []
      }), { headers: { "Content-Type": "application/json" } });
    a.push("风控门禁通过");
    const o = await ao(t);
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
    const c = await this.getCachedInstruments(t);
    a.push(`策略「${o.name}」· ${c.length} 个标的`);
    let d = "paper";
    try {
      const D = await t.prepare(
        "SELECT venue FROM venues WHERE enabled = 1 AND venue != 'paper' LIMIT 1"
      ).first();
      D && (d = D.venue);
    } catch {
    }
    a.push(`交易场所: ${d}`);
    const l = this.buildAccountContext(r), u = this.buildTemplateContext(l, r, c), h = await this.loadActivePromptProfile(t);
    h ? a.push(`提示词方案「${h.name}」已加载`) : a.push("无激活的提示词方案，使用规则引擎");
    const m = [];
    let _ = 0;
    for (const D of c) {
      const W = `${D.inst_id}:1H`, te = this.candleCache.get(W);
      if (!te || Date.now() - te.ts >= this.CANDLE_CACHE_TTL) {
        _++;
        continue;
      }
      const f = te.data;
      if (f.length < 2) {
        _++;
        continue;
      }
      if (this.checkInstrumentCooldown(D.inst_id, r).blocked) {
        _++;
        continue;
      }
      let P = this.computeDecision(D.inst_id, f, o);
      if (h)
        try {
          const z = await this.callLLMForDecision(
            D.inst_id,
            f,
            o,
            h,
            u
          );
          z && z.action !== "WAIT" && (P = z);
        } catch (z) {
          await G(
            t,
            "warn",
            `[Pass 5] LLM 决策失败 ${D.inst_id}: ${z.message}，回退规则引擎`,
            "trader-do"
          );
        }
      if (P = this.postProcessDecision(P, r, f), P.action !== "WAIT") {
        const z = await Vi(t, {
          ...P,
          inst_id: D.inst_id,
          strategy_tag: o.name,
          cycle_id: n,
          llm_model: (S = o.config_json) == null ? void 0 : S.model,
          llm_provider: (b = o.config_json) == null ? void 0 : b.provider
        }), ce = this.positionsCache.some(
          (X) => X.inst_id === D.inst_id && X.side === (P.action === "BUY_LONG" ? "long" : "short")
        ), Ae = this.ordersCache.some(
          (X) => X.inst_id === D.inst_id && X.state === "pending"
        );
        if (!ce && !Ae)
          try {
            const ue = (this.exchangeBalance ?? parseFloat(this.storage.get("current_equity") || "10000")) * (r.risk_per_trade_ratio || 0.02), ye = parseFloat(P.entry_price || P.stop_loss_price || "0"), Mt = Math.abs(
              parseFloat(P.entry_price || "0") - parseFloat(P.stop_loss_price || "0")
            );
            let H;
            if (Mt > 0 && ye > 0 ? H = ue / Mt * (P.leverage || 1) : H = ue / (ye > 0 ? ye : 1), H = Math.max(H, 1e-3), H = parseFloat(H.toFixed(6)), this.dryrunMode) {
              const ct = {
                ordId: `DRYRUN-${crypto.randomUUID().slice(0, 10)}`,
                instId: D.inst_id,
                side: P.action === "BUY_LONG" ? "buy" : "sell",
                posSide: P.action === "BUY_LONG" ? "long" : "short",
                px: String(ye || 0),
                sz: String(H),
                state: "dryrun",
                cTime: (/* @__PURE__ */ new Date()).toISOString(),
                lever: String(P.leverage || 2),
                venue: "DRYRUN",
                tag: "DRYRUN",
                decision: { ...P, id: z }
              };
              this.dryrunOrders.unshift(ct), this.dryrunOrders.length > 50 && (this.dryrunOrders.length = 50), await ((C = this.state.storage) == null ? void 0 : C.put("dryrun_orders", JSON.stringify(this.dryrunOrders))), await G(
                t,
                "info",
                `[DRYRUN] 模拟下单 ${D.inst_id} ${P.action} ${H}@${ye}`,
                "trader-do"
              );
            } else
              await this.submitOrder({
                inst_id: D.inst_id,
                side: P.action === "BUY_LONG" ? "buy" : "sell",
                pos_side: P.action === "BUY_LONG" ? "long" : "short",
                order_type: "market",
                price: ye || void 0,
                size: H,
                leverage: P.leverage || 2,
                venue: d,
                strategy_tag: o.name,
                decision_id: z,
                stop_loss: P.stop_loss_price,
                take_profit: P.take_profit_price
              }), await G(
                t,
                "info",
                `[Pass 5d] 自动下单 ${D.inst_id} ${P.action} ${H}@${ye}`,
                "trader-do"
              );
          } catch (X) {
            await G(
              t,
              "warn",
              `[Pass 5d] ${this.dryrunMode ? "模拟" : ""}下单失败 ${D.inst_id}: ${X.message}`,
              "trader-do"
            );
          }
        m.push({ ...P, id: z, inst_id: D.inst_id });
      }
    }
    this.storage.set("cycle_id", n), this.storage.set("last_strategy_run", (/* @__PURE__ */ new Date()).toISOString()), this.storage.set("active_positions", m.filter((D) => D.action.startsWith("BUY") || D.action.startsWith("SELL")).length), await ((L = this.state.storage) == null ? void 0 : L.put("trader_state", Object.fromEntries(this.storage)));
    const E = `策略周期 ${n}: ${m.length} 个决策 · ${_} 跳过 · ${a.join(" · ")}`;
    return await G(t, "info", E, "trader-do"), new Response(JSON.stringify({
      cycle_id: n,
      decisions: m,
      strategy: o.name,
      pass_logs: a,
      risk_config: {
        max_positions: r.max_positions,
        max_leverage: r.max_leverage,
        daily_loss_limit_usdt: r.daily_loss_limit_usdt
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), { headers: { "Content-Type": "application/json" } });
  }
  // ─────────────────────────────────────────────────────────
  //  Pass 工具方法
  // ─────────────────────────────────────────────────────────
  /** 加载风控配置（从 D1 config 表读取） */
  async loadRiskConfig(e) {
    const t = {
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
        "SELECT value FROM config WHERE key = 'risk_config'"
      ).first();
      if (n) {
        const a = JSON.parse(n.value);
        return { ...t, ...a };
      }
    } catch {
    }
    return t;
  }
  /** 风控门禁总检 */
  checkRiskGates(e) {
    if (e.daily_loss_limit_usdt > 0) {
      const n = Math.abs(this.todayStatsCache.net_realized < 0 ? this.todayStatsCache.net_realized : 0);
      if (n >= e.daily_loss_limit_usdt)
        return { blocked: !0, reason: `日亏损熔断: 已亏 $${n.toFixed(2)} ≥ 限额 $${e.daily_loss_limit_usdt}` };
    }
    const t = this.positionsCache.length;
    return t >= e.max_positions ? { blocked: !0, reason: `持仓数 ${t} 已达上限 ${e.max_positions}` } : { blocked: !1 };
  }
  /** 单个品种冷却期检查 */
  checkInstrumentCooldown(e, t) {
    if (!t.cooldown_minutes || t.cooldown_minutes <= 0) return { blocked: !1 };
    const n = this.storage.get(`cooldown:${e}`);
    return n && (Date.now() - n) / 6e4 < t.cooldown_minutes ? { blocked: !0 } : { blocked: !1 };
  }
  /** 构建账户上下文（供模板变量使用） */
  buildAccountContext(e) {
    const t = this.exchangeBalance ?? parseFloat(this.storage.get("current_equity") || "10000"), n = this.positionsCache, a = this.ordersCache;
    return {
      total_equity: t.toFixed(2),
      avail_equity: (t * 0.8).toFixed(2),
      // 近似可用
      open_positions: String(n.length),
      pending_orders: String(a.length),
      daily_pnl: this.todayStatsCache.net_realized.toFixed(2),
      daily_trades: String(this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades),
      max_positions: String(e.max_positions),
      max_leverage: String(e.max_leverage),
      risk_per_trade: String((e.risk_per_trade_ratio * 100).toFixed(1)),
      daily_loss_limit: String(e.daily_loss_limit_usdt)
    };
  }
  /** 构建完整模板上下文（含品种列表和市场概况） */
  buildTemplateContext(e, t, n) {
    const a = n.slice(0, 10).map((r, i) => {
      var l;
      const o = `${r.inst_id}:1H`, c = this.candleCache.get(o), d = c ? (l = c.data[c.data.length - 1]) == null ? void 0 : l.close : "N/A";
      return `${i + 1}. ${r.inst_id} $${d}`;
    }).join(`
`);
    return {
      ...e,
      instrument_list: a || "无可用标的",
      instrument_count: String(n.length),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      strategy_mode: this.env.ENVIRONMENT || "production"
    };
  }
  /** 加载激活的提示词方案 */
  async loadActivePromptProfile(e) {
    try {
      const t = await e.prepare(
        "SELECT value FROM config WHERE key = 'prompt_library'"
      ).first();
      if (!t) return null;
      const n = JSON.parse(t.value);
      if (!n.active_profile_id || !n.profiles[n.active_profile_id]) return null;
      const a = n.profiles[n.active_profile_id];
      return a.enabled ? a : null;
    } catch {
      return null;
    }
  }
  /** 渲染提示词模板 */
  renderPrompt(e, t) {
    return e.replace(/\{\{(\w+)\}\}/g, (n, a) => t[a] ?? `[MISSING:${a}]`);
  }
  /** 调用 LLM API 获取交易决策 */
  async callLLMForDecision(e, t, n, a, r) {
    var z, ce, Ae, X, ue, ye, Mt;
    const i = ((z = a.pipelines) == null ? void 0 : z.trading_system) || [], o = ((ce = a.pipelines) == null ? void 0 : ce.trading_user) || [];
    if (!i.length && !o.length) return null;
    const c = i.filter((H) => H.enabled), d = o.filter((H) => H.enabled);
    if (!c.length && !d.length) return null;
    const l = t.slice(-48).map((H) => H.close), u = t.slice(-48).map((H) => H.vol), h = l[l.length - 1], m = l.length > 24 ? ((l[l.length - 1] - l[l.length - 25]) / l[l.length - 25] * 100).toFixed(2) : "0", _ = {
      ...r,
      inst_id: e,
      price: String(h),
      chg_24h: m,
      high_24h: String(Math.max(...l.slice(-24))),
      low_24h: String(Math.min(...l.slice(-24))),
      volume_24h: String(u.slice(-24).reduce((H, ct) => H + ct, 0).toFixed(2)),
      rsi_14: String(this.computeRSI(t)),
      current_leverage: String(((Ae = this.positionsCache.find((H) => H.inst_id === e)) == null ? void 0 : Ae.leverage) || "1")
    }, E = c.map((H) => this.renderPrompt(H.content, _)).join(`

`), S = d.map((H) => this.renderPrompt(H.content, _)).join(`

`), b = await ro(this.env.DB);
    if (!b.length) return null;
    const L = b.find(
      (H) => {
        var ct, Ys, Xs;
        return H.provider_type === ((ct = n.config_json) == null ? void 0 : ct.provider) || ((Xs = H.models) == null ? void 0 : Xs.includes(((Ys = n.config_json) == null ? void 0 : Ys.model) || ""));
      }
    ) || b[0];
    if (!L) return null;
    const D = (L.api_url || "").replace(/\/+$/, "") || "https://api.openai.com/v1", W = ((X = n.config_json) == null ? void 0 : X.model) || (L.models || "").split(",")[0] || "gpt-4o-mini", te = [];
    E && te.push({ role: "system", content: E }), te.push({
      role: "user",
      content: S || `分析 ${e} 当前价格 $${h}，24h 涨跌 ${m}%，RSI ${_.rsi_14}。给出交易建议（BUY_LONG/SELL_SHORT/WAIT）、置信度、杠杆。仅返回 JSON。`
    });
    const f = await fetch(`${D}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${L.api_key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: W,
        messages: te,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!f.ok) {
      const H = await f.text().catch(() => "");
      throw new Error(`LLM API ${f.status}: ${H.slice(0, 200)}`);
    }
    const ot = (Mt = (ye = (ue = (await f.json()).choices) == null ? void 0 : ue[0]) == null ? void 0 : ye.message) == null ? void 0 : Mt.content;
    if (!ot) throw new Error("LLM 返回空内容");
    const P = JSON.parse(ot);
    return {
      action: P.action || "WAIT",
      confidence: P.confidence ?? 50,
      leverage: P.leverage ?? 2,
      entry_price: P.entry_price ?? h,
      take_profit_price: P.take_profit_price ?? h * 1.02,
      stop_loss_price: P.stop_loss_price ?? h * 0.98,
      risk_reward_ratio: P.risk_reward_ratio || "1:2",
      summary_reason: P.reason || P.summary_reason || "LLM 决策",
      llm_model: W,
      llm_provider: L.name
    };
  }
  /** 决策后处理：杠杆钳制、置信度过滤、止盈止损优化 */
  postProcessDecision(e, t, n) {
    var o;
    if (e.action === "WAIT") return e;
    const a = ((o = n[n.length - 1]) == null ? void 0 : o.close) || e.entry_price || 0, r = { ...e };
    if (r.leverage < t.min_leverage && (r.leverage = t.min_leverage), r.leverage > t.max_leverage && (r.leverage = t.max_leverage), (r.confidence ?? 0) < t.min_confidence * 100)
      return { action: "WAIT", confidence: r.confidence, leverage: 1, entry_price: a, summary_reason: `置信度 ${r.confidence} < 阈值 ${t.min_confidence * 100}` };
    const i = t.min_rr;
    return r.action === "BUY_LONG" ? (r.take_profit_price || (r.take_profit_price = a * (1 + i * 0.01)), r.stop_loss_price || (r.stop_loss_price = a * (1 - 0.01 / i))) : r.action === "SELL_SHORT" && (r.take_profit_price || (r.take_profit_price = a * (1 - i * 0.01)), r.stop_loss_price || (r.stop_loss_price = a * (1 + 0.01 / i))), this.storage.set(`cooldown:${e.inst_id || ""}`, Date.now()), r;
  }
  // ── 规则引擎（从策略配置加载规则，替代硬编码） ──
  /**
   * 规则格式（存储在 strategy.config_json.rules 中，示例见 getDefaultRules）：
   * 每条规则包含 conditions（AND 逻辑）、action、confidence、止盈止损百分比等。
   * 从策略配置读取 rules，没有则使用 getDefaultRules() 内建规则。
   */
  computeDecision(e, t, n) {
    var S;
    const a = t.map((b) => b.close), r = a[a.length - 1], i = a[a.length - 2], o = this.computeRSI(t), c = i > 0 ? (r - i) / i * 100 : 0, d = this.ema(a, 12), l = this.ema(a, 26), u = d - l, h = a.length >= 50 ? this.ema(a, 50) : a.reduce((b, C) => b + C, 0) / a.length, m = r >= h, _ = {
      rsi: o,
      macd: u,
      chg_pct: c,
      above_ema50: m,
      current: r,
      prev: i
    };
    let E = (S = n == null ? void 0 : n.config_json) == null ? void 0 : S.rules;
    (!E || !Array.isArray(E) || E.length === 0) && (E = kn());
    for (const b of E.filter((C) => C.enabled).sort((C, L) => L.priority - C.priority))
      if (this.evaluateRuleConditions(b.conditions, _)) {
        let C = b.confidence;
        return b.action === "BUY_LONG" && o < 35 ? C = Math.min(85, Math.round(C + (35 - o) * 2)) : b.action === "SELL_SHORT" && o > 70 && (C = Math.min(85, Math.round(C + (o - 70) * 2))), {
          action: b.action,
          confidence: C,
          leverage: b.leverage || 2,
          entry_price: r,
          take_profit_price: b.action === "BUY_LONG" ? r * (1 + (b.take_profit_pct || 3) / 100) : r * (1 - (b.take_profit_pct || 3) / 100),
          stop_loss_price: b.action === "BUY_LONG" ? r * (1 - (b.stop_loss_pct || 1.5) / 100) : r * (1 + (b.stop_loss_pct || 1.5) / 100),
          risk_reward_ratio: `${Math.abs((b.take_profit_pct || 3) / (b.stop_loss_pct || 1.5)).toFixed(1)}:1`,
          summary_reason: b.name
        };
      }
    return { action: "WAIT", confidence: 30, leverage: 1, entry_price: r, summary_reason: `RSI ${o.toFixed(1)} 无规则匹配` };
  }
  /** 评估单条规则的所有条件（AND 逻辑） */
  evaluateRuleConditions(e, t) {
    for (const n of e) {
      const a = t[n.indicator];
      if (a === void 0) return !1;
      switch (n.operator) {
        case ">":
          if (!(a > n.value)) return !1;
          break;
        case "<":
          if (!(a < n.value)) return !1;
          break;
        case ">=":
          if (!(a >= n.value)) return !1;
          break;
        case "<=":
          if (!(a <= n.value)) return !1;
          break;
        case "==":
          if (a !== n.value) return !1;
          break;
        case "!=":
          if (a === n.value) return !1;
          break;
        default:
          return !1;
      }
    }
    return !0;
  }
  ema(e, t) {
    if (e.length < t) return e[e.length - 1] || 0;
    const n = 2 / (t + 1);
    let a = e.slice(0, t).reduce((r, i) => r + i, 0) / t;
    for (let r = t; r < e.length; r++)
      a = e[r] * n + a * (1 - n);
    return a;
  }
  // ── 自动平仓检查（止盈止损 + 超时强平） ──
  async checkAutoClose() {
    var r, i;
    if (this.positionsCache.length === 0 && !((r = this.exchangePositionsCache) != null && r.length)) return;
    const e = this.env.DB, t = await this.loadRiskConfig(e), n = (t.max_hold_hours || 24) * 36e5, a = [...this.positionsCache, ...this.exchangePositionsCache ?? []];
    for (const o of a) {
      const c = o.inst_id || o.instId;
      if (!c) continue;
      let d = 0;
      const l = `${c}:1H`, u = this.candleCache.get(l);
      if ((i = u == null ? void 0 : u.data) != null && i.length && (d = u.data[u.data.length - 1].close || 0), d <= 0) continue;
      const h = `${c}:${o.venue || "paper"}`, m = this.sltpMap.get(h), _ = o.pos_side || o.side || "long";
      if (m && (m.stop_loss > 0 || m.take_profit > 0)) {
        let E = !1, S = "";
        if (_ === "long" ? m.stop_loss > 0 && d <= m.stop_loss ? (E = !0, S = `止损触发 (SL=${m.stop_loss}, 当前=${d.toFixed(2)})`) : m.take_profit > 0 && d >= m.take_profit && (E = !0, S = `止盈触发 (TP=${m.take_profit}, 当前=${d.toFixed(2)})`) : m.stop_loss > 0 && d >= m.stop_loss ? (E = !0, S = `止损触发 (SL=${m.stop_loss}, 当前=${d.toFixed(2)})`) : m.take_profit > 0 && d <= m.take_profit && (E = !0, S = `止盈触发 (TP=${m.take_profit}, 当前=${d.toFixed(2)})`), E) {
          await this.closePosition({ inst_id: c, price: d, _auto_reason: S }), await G(e, "info", `[AutoClose] ${c} ${_} ${S}`, "trader-do");
          continue;
        }
      }
      if (o.created_at || o.createdAt || o.open_time) {
        const E = new Date(o.created_at || o.createdAt || o.open_time).getTime();
        !isNaN(E) && Date.now() - E > n && (await this.closePosition({
          inst_id: c,
          price: d,
          _auto_reason: `超时强平 (持仓 > ${t.max_hold_hours}h)`
        }), await G(e, "info", `[AutoClose] ${c} 超时强平 (>${t.max_hold_hours}h)`, "trader-do"));
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
    const t = crypto.randomUUID().slice(0, 16), n = {
      order_id: t,
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
    const a = await Ji(this.env.DB, n), r = (this.storage.get("pending_orders_count") || 0) + 1;
    if (this.storage.set("pending_orders_count", r), await ((i = this.state.storage) == null ? void 0 : i.put("trader_state", Object.fromEntries(this.storage))), this.ordersCache.unshift({
      ...n,
      id: a,
      order_id: t,
      state: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }), await G(this.env.DB, "info", `Order ${t}: ${e.side} ${e.size} ${e.inst_id}`, "trader-do"), e.venue && e.venue !== "paper")
      try {
        const o = await this.env.DB.prepare(
          "SELECT * FROM venues WHERE venue = ? AND enabled = 1 LIMIT 1"
        ).bind(e.venue).first();
        if (o) {
          const c = await wo(e, o);
          await G(
            this.env.DB,
            "info",
            `Exchange ${e.venue} order submitted: ${t} (${c.exchange_id || "ok"})`,
            "trader-do"
          );
        } else
          await G(
            this.env.DB,
            "warn",
            `Venue ${e.venue} not found in DB, order saved locally only`,
            "trader-do"
          );
      } catch (o) {
        await G(
          this.env.DB,
          "warn",
          `Exchange ${e.venue} order failed: ${o.message}`,
          "trader-do"
        );
      }
    return new Response(JSON.stringify({ id: a, order_id: t, status: "pending" }), {
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
    const t = this.positionsCache.findIndex((d) => d.inst_id === e.inst_id);
    if (t === -1)
      return new Response(JSON.stringify({ error: `No open position for ${e.inst_id}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    const n = this.positionsCache[t], a = e.price || n.open_price * 1.01, r = (a - n.open_price) * n.size * (n.pos_side === "short" ? -1 : 1), i = Math.abs(r) * 1e-3;
    await Yi(this.env.DB, n.id, a, r, i);
    const o = n.venue || "paper";
    if (o !== "paper")
      try {
        const d = await this.env.DB.prepare(
          "SELECT * FROM venues WHERE venue = ? AND enabled = 1 LIMIT 1"
        ).bind(o).first();
        d && (await Eo({ inst_id: e.inst_id, venue: o }, d), await G(
          this.env.DB,
          "info",
          `Exchange close ${o} ${e.inst_id}`,
          "trader-do"
        ));
      } catch (d) {
        await G(
          this.env.DB,
          "warn",
          `Exchange close ${o} failed: ${d.message}`,
          "trader-do"
        );
      }
    this.sltpMap.delete(`${e.inst_id}:${o}`), this.positionsCache.splice(t, 1), this.tradesCache = null;
    const c = r - i;
    return this.todayStatsCache.net_realized += c, this.todayStatsCache.fees_paid += i, this.todayStatsCache.realized_gross += r, c > 0 ? this.todayStatsCache.win_trades++ : c < 0 && this.todayStatsCache.loss_trades++, this.todayStatsCache.win_rate = this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades > 0 ? Math.round(this.todayStatsCache.win_trades / (this.todayStatsCache.win_trades + this.todayStatsCache.loss_trades) * 100) : 0, this.ordersCache = this.ordersCache.filter((d) => d.inst_id !== e.inst_id), await G(this.env.DB, "info", `Closed ${e.inst_id}: PnL ${r.toFixed(2)} USDT`, "trader-do"), new Response(JSON.stringify({
      inst_id: e.inst_id,
      close_price: a,
      pnl: r,
      fees: i
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  // ── Reset State ──
  async reset() {
    var e;
    return this.storage.clear(), this.initialized = !1, this.candleCache.clear(), this.factorsCache = null, this.positionsCache = [], this.ordersCache = [], this.tradesCache = null, this.configCache = null, this.equityHistoryCache = null, this.logsCache = null, this.logMsgsCache = null, this.todayStatsCache = { realized_gross: 0, fees_paid: 0, net_realized: 0, win_trades: 0, loss_trades: 0, win_rate: 0, source: "memory" }, this.exchangeBalance = null, this.venueHealthCache = null, this.aiProviderHealthCache = null, this.exchangePositionsCache = null, this.exchangeOrdersCache = null, this._lastHealthCheck = 0, this._lastAIProviderCheck = 0, this._lastExchangeSync = 0, await ((e = this.state.storage) == null ? void 0 : e.deleteAll()), await G(this.env.DB, "warn", "TraderDO state reset", "trader-do"), new Response(JSON.stringify({ status: "reset" }), {
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
async function wo(s, e) {
  const t = e.venue;
  if (t === "okx") return vo(s, e);
  if (t === "binance") return Io(s, e);
  if (t === "gate") return So();
  throw new Error(`Unsupported exchange venue: ${t}`);
}
async function vo(s, e) {
  var m, _;
  const t = (e.api_key || "").trim(), n = (e.api_secret || "").trim(), a = (e.api_passphrase || "").trim();
  if (!t || !n) throw new Error("OKX API credentials missing");
  const r = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", i = "/api/v5/trade/order", o = JSON.stringify({
    instId: s.inst_id,
    tdMode: "cross",
    side: s.side,
    posSide: s.pos_side === "long" ? "long" : "short",
    ordType: s.order_type === "limit" ? "limit" : "market",
    sz: String(s.size),
    ...s.order_type === "limit" && s.price ? { px: String(s.price) } : {}
  }), c = (/* @__PURE__ */ new Date()).toISOString(), d = await zt(n, c + "POST" + i + o), u = await (await fetch(`${r}${i}`, {
    method: "POST",
    headers: {
      "OK-ACCESS-KEY": t,
      "OK-ACCESS-SIGN": d,
      "OK-ACCESS-TIMESTAMP": c,
      "OK-ACCESS-PASSPHRASE": a,
      "Content-Type": "application/json",
      ...e.testnet ? { "x-simulated-trading": "1" } : {}
    },
    body: o,
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (u.code !== "0") throw new Error(`OKX order error: ${u.code} ${u.msg || JSON.stringify(u.data)}`);
  return { exchange_id: (_ = (m = u.data) == null ? void 0 : m[0]) == null ? void 0 : _.ordId, status: "submitted" };
}
async function Io(s, e) {
  const t = (e.api_key || "").trim(), n = (e.api_secret || "").trim();
  if (!t || !n) throw new Error("Binance API credentials missing");
  const a = "https://fapi.binance.com", r = s.side === "buy" ? "BUY" : "SELL", i = new URLSearchParams({
    symbol: s.inst_id.replace("-", ""),
    // BTCUSDT
    side: r,
    type: "MARKET",
    quantity: String(s.size),
    timestamp: String(Date.now())
  }), o = await nt(n, i.toString());
  i.append("signature", o);
  const d = await (await fetch(`${a}/fapi/v1/order?${i.toString()}`, {
    method: "POST",
    headers: { "X-MBX-APIKEY": t, "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (d.code) throw new Error(`Binance order error: ${d.code} ${d.msg}`);
  return { exchange_id: d.orderId, status: "submitted" };
}
async function So(s, e) {
  throw new Error("Gate order placement not yet implemented");
}
async function Eo(s, e) {
  const t = e.venue;
  if (t === "okx") return Ao(s, e);
  if (t === "binance") return bo(s, e);
  if (t === "gate") return To();
  throw new Error(`Unsupported exchange venue for closing: ${t}`);
}
async function Ao(s, e) {
  var E, S, b;
  const t = (e.api_key || "").trim(), n = (e.api_secret || "").trim(), a = (e.api_passphrase || "").trim();
  if (!t || !n) throw new Error("OKX API credentials missing");
  let r = "long", i = 0;
  try {
    const C = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", L = (/* @__PURE__ */ new Date()).toISOString(), D = "/api/v5/account/positions?instId=" + encodeURIComponent(s.inst_id), W = await zt(n, L + "GET" + D), f = await (await fetch(`${C}${D}`, {
      headers: {
        "OK-ACCESS-KEY": t,
        "OK-ACCESS-SIGN": W,
        "OK-ACCESS-TIMESTAMP": L,
        "OK-ACCESS-PASSPHRASE": a,
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(8e3)
    })).json();
    (E = f.data) != null && E.length && (r = f.data[0].posSide === "long" ? "long" : "short", i = parseFloat(f.data[0].pos || "0"));
  } catch {
  }
  i <= 0 && (i = s.size || 1e-3);
  const o = r, c = e.testnet ? "https://testnet.okx.com" : "https://www.okx.com", d = "/api/v5/trade/close-position", l = JSON.stringify({
    instId: s.inst_id,
    posSide: o,
    mgnMode: "cross",
    sz: String(i),
    ccy: "USDT"
    // autoCxl: true, // 自动取消该品种挂单
  }), u = (/* @__PURE__ */ new Date()).toISOString(), h = await zt(n, u + "POST" + d + l), _ = await (await fetch(`${c}${d}`, {
    method: "POST",
    headers: {
      "OK-ACCESS-KEY": t,
      "OK-ACCESS-SIGN": h,
      "OK-ACCESS-TIMESTAMP": u,
      "OK-ACCESS-PASSPHRASE": a,
      "Content-Type": "application/json"
    },
    body: l,
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (_.code !== "0") throw new Error(`OKX close error: ${_.code} ${_.msg || JSON.stringify(_.data)}`);
  return { exchange_id: (b = (S = _.data) == null ? void 0 : S[0]) == null ? void 0 : b.ordId, status: "closed" };
}
async function bo(s, e) {
  const t = (e.api_key || "").trim(), n = (e.api_secret || "").trim();
  if (!t || !n) throw new Error("Binance API credentials missing");
  let a = 0;
  try {
    const h = Date.now(), m = `symbol=${s.inst_id.replace("-", "")}&timestamp=${h}`, _ = await nt(n, m), S = await (await fetch(`https://fapi.binance.com/fapi/v1/positionRisk?${m}&signature=${_}`, {
      headers: { "X-MBX-APIKEY": t, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
    if (Array.isArray(S)) {
      const b = S.find((C) => C.symbol === s.inst_id.replace("-", ""));
      b && (a = parseFloat(b.positionAmt || "0"));
    }
  } catch {
  }
  a === 0 && (a = s.size || 1e-3);
  const r = a > 0 ? "SELL" : "BUY", i = Math.abs(a), o = "https://fapi.binance.com", c = new URLSearchParams({
    symbol: s.inst_id.replace("-", ""),
    side: r,
    type: "MARKET",
    quantity: String(i),
    reduceOnly: "true",
    timestamp: String(Date.now())
  }), d = await nt(n, c.toString());
  c.append("signature", d);
  const u = await (await fetch(`${o}/fapi/v1/order?${c.toString()}`, {
    method: "POST",
    headers: { "X-MBX-APIKEY": t, "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(1e4)
  })).json();
  if (u.code) throw new Error(`Binance close error: ${u.code} ${u.msg}`);
  return { exchange_id: u.orderId, status: "closed" };
}
async function To(s, e) {
  throw new Error("Gate position closing not yet implemented");
}
async function xo(s) {
  const { venue: e } = s;
  return e === "okx" ? Co(s) : e === "binance" ? ko(s) : e === "gate" ? Oo(s) : { positions: [], orders: [] };
}
async function Co(s) {
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim(), n = (s.api_passphrase || "").trim();
  if (!e || !t) return { positions: [], orders: [] };
  const a = "https://www.okx.com";
  async function r(l) {
    const u = (/* @__PURE__ */ new Date()).toISOString(), h = await zt(t, u + "GET" + l);
    return (await fetch(`${a}${l}`, {
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
    r("/api/v5/account/positions"),
    r("/api/v5/trade/orders-pending")
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
async function ko(s) {
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim();
  if (!e || !t) return { positions: [], orders: [] };
  const n = "https://fapi.binance.com";
  async function a(d, l = "") {
    const u = Date.now(), h = l ? `${l}&timestamp=${u}` : `timestamp=${u}`, m = await nt(t, h);
    return (await fetch(`${n}${d}?${h}&signature=${m}`, {
      headers: { "X-MBX-APIKEY": e, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
  }
  const [r, i] = await Promise.all([
    a("/fapi/v1/positionRisk"),
    a("/fapi/v1/openOrders")
  ]), o = (Array.isArray(r) ? r : []).filter(
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
async function Oo(s) {
  const e = (s.api_key || "").trim(), t = (s.api_secret || "").trim();
  if (!e || !t) return { positions: [], orders: [] };
  const n = "https://api.gateio.ws", a = Math.floor(Date.now() / 1e3).toString();
  async function r(l) {
    const u = await ma(""), h = `GET
${l}

${u}
${a}`, m = await nt(t, h);
    return (await fetch(`${n}${l}`, {
      headers: { KEY: e, SIGN: m, Timestamp: a, Accept: "application/json" },
      signal: AbortSignal.timeout(8e3)
    })).json();
  }
  const [i, o] = await Promise.all([
    r("/api/v4/futures/usdt/positions"),
    r("/api/v4/futures/usdt/orders?status=open")
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
function kn() {
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
const Ro = 30 * 24 * 60 * 60;
class No {
  constructor(e, t, n, a, r, i, o, c) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.tokenSecret = c;
  }
  async createSession(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertWebChatChannel(t);
    const n = Mo(e.visitorId), a = !!(e.endUserId && e.endUserName), r = a ? `${e.endUserId}` : n, i = Math.floor(Date.now() / 1e3) + Ro, o = await this.signToken({
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
    const { conversationId: t, claims: n } = await this.ensureConversation(e.token, e.conversationId || void 0), a = await this.channels.getAccount(n.channelAccountId), r = e.clientMessageId ? `widget:${n.visitorId}:${e.clientMessageId}` : Y("widget_evt"), i = await this.messages.findByExternalMessageId(a.id, r);
    if (i)
      return {
        conversationId: i.conversationId,
        inboundMessage: Oe(i),
        aiMessage: null,
        duplicate: !0
      };
    const o = Y("msg"), c = await this.media.storeUpload({
      conversationId: t,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage({
      channelAccount: a,
      inbound: {
        externalMessageId: r,
        externalContactId: n.visitorId,
        externalThreadId: n.visitorId,
        contactName: n.contactName,
        isAnonymous: n.isAnonymous,
        messageType: c.messageType,
        content: Do(e.content),
        attachments: [c.attachment],
        rawPayload: {
          source: "web_chat_widget",
          pageUrl: e.pageUrl,
          pageTitle: e.pageTitle
        },
        receivedAt: M()
      },
      messageId: o
    }, { createAiReply: !1 });
    return d.duplicate || await this.notifyVisitorMessageResult(d), {
      conversationId: d.conversationId,
      inboundMessage: Oe(d.inboundMessage),
      aiMessage: null,
      duplicate: d.duplicate
    };
  }
  async sendVisitorMessage(e, t = {}) {
    const { conversationId: n, claims: a } = await this.ensureConversation(e.token, e.conversationId || void 0), r = await this.channels.getAccount(a.channelAccountId), i = await this.conversationService.receiveInboundMessage({
      channelAccount: r,
      inbound: {
        externalMessageId: e.clientMessageId ? `widget:${a.visitorId}:${e.clientMessageId}` : Y("widget_evt"),
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
        receivedAt: M()
      }
    }, { createAiReply: t.createAiReply });
    return i.aiMessage && await this.messages.markSent(i.aiMessage.id, i.aiMessage.id), t.notifyRealtime !== !1 && await this.notifyVisitorMessageResult(i), {
      conversationId: i.conversationId,
      inboundMessage: Oe(i.inboundMessage),
      aiMessage: i.aiMessage ? Oe({ ...i.aiMessage, status: "sent" }) : null,
      duplicate: i.duplicate
    };
  }
  async completeVisitorMessage(e) {
    try {
      const t = await this.conversations.findById(e.conversationId), n = await this.messages.findById(e.inboundMessageId);
      if (!t || !n || n.conversationId !== t.id) return;
      await this.realtime.notifyMessageCreated({
        conversation: t,
        message: n
      });
      const a = await this.conversationService.createAiReply({
        conversationId: t.id,
        channelAccountId: t.channelAccountId,
        messageContent: n.content,
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
      me.warn("widget_message_background_failed", {
        conversationId: e.conversationId,
        inboundMessageId: e.inboundMessageId,
        error: t instanceof Error ? t.message : String(t)
      });
    }
  }
  async ensureConversation(e, t) {
    const n = await this.verifyToken(e), a = await this.channels.getAccount(n.channelAccountId);
    if (this.assertWebChatChannel(a), !n.isAnonymous && !await this.endUsers.findById(n.visitorId))
      throw new g("END_USER_NOT_FOUND", "End user not found", 401);
    if (t && t !== "_") {
      const i = await this.conversations.findById(t);
      if (!i)
        throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
      if (i.channelAccountId !== n.channelAccountId || i.externalContactId !== n.visitorId)
        throw new g("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
      return { conversationId: t, claims: n };
    }
    return { conversationId: (await this.conversations.findOrCreateByExternalThread({
      channelAccountId: a.id,
      externalContactId: n.visitorId,
      externalThreadId: n.visitorId,
      contactName: n.contactName,
      isAnonymous: n.isAnonymous
    })).id, claims: n };
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
    return await this.verifyConversationAccess(e.conversationId, e.token), (await this.messages.listByConversationAfter(e.conversationId, e.afterMessageId, 100)).map(Oe);
  }
  requireConversationAccess(e, t) {
    return this.verifyConversationAccess(e, t);
  }
  assertWebChatChannel(e) {
    if (e.channelType !== "web_chat")
      throw new g("CHANNEL_NOT_WEB_CHAT", "Channel is not a Web Chat channel", 400);
    if (e.status !== "active")
      throw new g("CHANNEL_INACTIVE", "Channel is not active", 400);
  }
  async verifyConversationAccess(e, t) {
    const n = await this.verifyToken(t), a = await this.conversations.findById(e);
    if (!a)
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    if (a.channelAccountId !== n.channelAccountId || a.externalContactId !== n.visitorId || a.externalThreadId !== n.visitorId)
      throw new g("VISITOR_TOKEN_INVALID", "Visitor token does not match conversation", 401);
    return n;
  }
  async signToken(e) {
    const t = ge(JSON.stringify(e)), n = await st(this.tokenSecret, t);
    return `${t}.${n}`;
  }
  async verifyToken(e) {
    const [t, n] = e.split(".");
    if (!t || !n)
      throw new g("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const a = await st(this.tokenSecret, t);
    if (!Ot(n, a))
      throw new g("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    const r = JSON.parse(Js(t));
    if (!r.version || !r.channelAccountId || !r.visitorId || !r.contactName || r.isAnonymous === void 0 || !r.exp)
      throw new g("VISITOR_TOKEN_INVALID", "Visitor token is invalid", 401);
    if (r.exp < Math.floor(Date.now() / 1e3))
      throw new g("VISITOR_TOKEN_EXPIRED", "Visitor token has expired", 401);
    return r;
  }
}
function Mo(s) {
  const e = s.trim().slice(0, 128);
  if (!e)
    throw new g("VISITOR_ID_INVALID", "Visitor id cannot be empty", 400);
  return e;
}
function Do(s) {
  return (s == null ? void 0 : s.trim()) ?? "";
}
const Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WidgetService: No
}, Symbol.toStringTag, { value: "Module" }));
function Ms(s, e, t, n, a) {
  const r = be(s.rawPayloadJson);
  return {
    id: s.id,
    conversationId: s.conversationId,
    direction: s.direction,
    senderType: s.senderType,
    messageType: s.messageType,
    content: s.content,
    attachments: Gs(s.attachmentsJson),
    status: s.status,
    createdAt: s.createdAt,
    contactName: e,
    externalContactId: t,
    avatarUrl: n ?? null,
    signature: a ?? null,
    likeCount: r.likeCount,
    likedBy: r.likedBy,
    quotedMessageId: r.quotedMessageId
  };
}
function be(s) {
  if (!s)
    return { likeCount: 0, likedBy: [], tags: [], category: "综合讨论", isPinned: !1, isFeatured: !1, quotedMessageId: null, visibility: "public", forumDeleted: !1, forumDeletedBy: null, forumDeletedAt: null, forumEditedAt: null, forumTopicTitle: null };
  try {
    const e = JSON.parse(s);
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
function Ft(s) {
  var e;
  if (!s) return null;
  try {
    const t = JSON.parse(s);
    return typeof ((e = t == null ? void 0 : t.settings) == null ? void 0 : e.avatar_url) == "string" ? t.settings.avatar_url : null;
  } catch {
    return null;
  }
}
function Po(s) {
  var e;
  if (!s) return null;
  try {
    const t = JSON.parse(s);
    return typeof ((e = t == null ? void 0 : t.settings) == null ? void 0 : e.signature) == "string" ? t.settings.signature : null;
  } catch {
    return null;
  }
}
const On = 30 * 24 * 60 * 60;
class $o {
  constructor(e, t, n, a, r, i, o, c, d, l) {
    this.channels = e, this.conversations = t, this.messages = n, this.conversationService = a, this.realtime = r, this.media = i, this.endUsers = o, this.endUserAuth = c, this.auth = d, this.tokenSecret = l;
  }
  async listTopics(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = e.limit ?? 50, a = e.offset ?? 0, [r, i] = await Promise.all([
      this.conversations.listByChannelWithFirstMessage(t.id, n, a),
      this.conversations.countByChannel(t.id)
    ]), o = [...new Set(r.map((u) => u.externalContactId).filter(Boolean))], c = await this.endUsers.findByIds(o), d = /* @__PURE__ */ new Map();
    for (const u of c)
      d.set(u.id, Ft(u.rawPayloadJson));
    let l = r.map((u) => {
      const h = as(u.firstMessageRawPayload), m = be(u.firstMessageRawPayload);
      return {
        id: u.id,
        conversationId: u.id,
        title: h,
        authorName: u.contactName ?? "匿名用户",
        authorId: u.externalContactId ?? "",
        avatarUrl: d.get(u.externalContactId ?? "") ?? null,
        category: m.category ?? "综合讨论",
        messageCount: u.unreadCount,
        lastReplyAt: u.lastMessageAt ?? u.createdAt,
        createdAt: u.createdAt,
        tags: m.tags,
        isPinned: m.isPinned,
        isFeatured: m.isFeatured,
        likeCount: m.likeCount,
        likedBy: m.likedBy,
        visibility: m.visibility,
        isDeleted: m.forumDeleted,
        editedAt: m.forumEditedAt
      };
    });
    if (e.search) {
      const u = e.search.toLowerCase();
      l = l.filter(
        (h) => h.title.toLowerCase().includes(u) || h.authorName.toLowerCase().includes(u) || h.tags.some((m) => m.toLowerCase().includes(u))
      );
    }
    return e.tag && (l = l.filter((u) => u.tags.includes(e.tag))), e.category && (l = l.filter((u) => u.category === e.category)), e.sortBy === "replies" ? l.sort((u, h) => h.messageCount - u.messageCount) : e.sortBy === "hot" ? l.sort((u, h) => h.likeCount - u.likeCount || h.messageCount - u.messageCount) : l.sort((u, h) => u.isPinned !== h.isPinned ? u.isPinned ? -1 : 1 : new Date(h.lastReplyAt).getTime() - new Date(u.lastReplyAt).getTime()), { topics: l, total: i };
  }
  async createTopic(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = Ds(e.visitorId), a = `forum:${n}:${Y("forum_topic")}`, { contactName: r, externalContactId: i, isAnonymous: o } = await this.resolveEndUserIdentity(
      n,
      e.endUserToken
    );
    let c = null;
    if (!o && i)
      try {
        const u = await this.endUsers.findById(i);
        u && (c = Ft(u.rawPayloadJson));
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
          receivedAt: M()
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
      exp: Math.floor(Date.now() / 1e3) + On
    });
    return {
      conversationId: d.conversationId,
      channelAccountId: t.id,
      visitorId: i,
      visitorToken: l,
      expiresAt: new Date(Date.now() + On * 1e3).toISOString(),
      message: Ms(d.inboundMessage, r, i, c)
    };
  }
  async sendReply(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = Ds(e.visitorId), r = `forum:${a}:${Y("forum_reply")}`, { contactName: i, externalContactId: o, isAnonymous: c } = await this.resolveEndUserIdentity(
      a,
      e.endUserToken
    );
    let d = null;
    if (!c && o)
      try {
        const h = await this.endUsers.findById(o);
        h && (d = Ft(h.rawPayloadJson));
      } catch {
      }
    let l = e.content.trim();
    if (e.quotedMessageId) {
      const h = await this.messages.findById(e.quotedMessageId);
      if (h && h.conversationId === e.conversationId) {
        const m = t.contactName && t.contactName !== "匿名用户" ? t.contactName : `用户${(t.externalContactId ?? "").slice(-5)}`, E = (h.content ?? "").substring(0, 500).split(`
`);
        let S = E.length;
        for (let W = 0; W < E.length; W++)
          if (/^> @.+ 说：$/.test(E[W].trim())) {
            S = W;
            break;
          }
        const b = E.slice(0, S), C = E.slice(S), L = [];
        if (!be(h.rawPayloadJson).quotedMessageId && b.length > 0) {
          const W = b[0].trim();
          W.startsWith("**") && W.endsWith("**") && (b.shift(), b.length > 0 && b[0].trim() === "" && b.shift());
        }
        L.push(l), L.push("");
        for (const W of b) L.push(W.trim() === "" ? ">" : `> ${W}`);
        L.push(`> @${m} 说：`);
        for (const W of C) L.push(`> ${W}`);
        l = L.join(`
`);
      }
    }
    const u = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
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
          receivedAt: M()
        }
      },
      { createAiReply: !1 }
    );
    return u.duplicate || await this.realtime.notifyMessageCreated({
      conversation: t,
      message: u.inboundMessage
    }), {
      conversationId: u.conversationId,
      message: Ms(u.inboundMessage, i, o, d),
      duplicate: u.duplicate
    };
  }
  async listMessages(e) {
    const t = await this.conversations.findById(e.conversationId), n = (t == null ? void 0 : t.contactName) ?? "论坛用户", a = (t == null ? void 0 : t.externalContactId) ?? "anonymous";
    let r = null, i = null;
    if (a && a !== "anonymous")
      try {
        const h = await this.endUsers.findById(a);
        h && (r = Ft(h.rawPayloadJson), i = Po(h.rawPayloadJson));
      } catch {
      }
    const o = await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ), c = o.length > 0 ? as(o[0].rawPayloadJson) : void 0, d = o.length > 0 ? be(o[0].rawPayloadJson).visibility : void 0, l = o.length > 0 ? be(o[0].rawPayloadJson).forumDeleted : !1, u = (t == null ? void 0 : t.externalContactId) ?? "";
    return {
      messages: o.map((h) => {
        let m = h.content;
        return m && (m = m.replace(/^\*\*.+?\*\*\n\n/, "")), Ms({ ...h, content: m }, n, a, r, i);
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
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = Ds(e.visitorId), r = await this.getFirstMessage(e.conversationId);
    if (!r)
      throw new g("MESSAGE_NOT_FOUND", "First message not found", 404);
    const i = be(r.rawPayloadJson), o = i.likedBy.includes(a);
    let c, d;
    return o ? (c = Math.max(0, i.likeCount - 1), d = i.likedBy.filter((l) => l !== a)) : (c = i.likeCount + 1, d = [...i.likedBy, a]), await this.updateMessageRawPayload(r.id, r.rawPayloadJson, {
      forumLikes: c,
      forumLikedBy: d
    }), { likeCount: c, liked: !o, likedBy: d };
  }
  async togglePin(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new g("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumPinned: e.pin
    }), { isPinned: e.pin };
  }
  async toggleFeatured(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new g("MESSAGE_NOT_FOUND", "First message not found", 404);
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumFeatured: e.feature
    }), { isFeatured: e.feature };
  }
  async deleteTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new g("MESSAGE_NOT_FOUND", "First message not found", 404);
    if (be(a.rawPayloadJson), e.userRole !== "admin") {
      if (e.userRole !== "mediator") throw new g("FORBIDDEN", "You do not have permission to delete this topic", 403);
    }
    return await this.updateMessageRawPayload(a.id, a.rawPayloadJson, {
      forumDeleted: !0,
      forumDeletedBy: e.userId,
      forumDeletedAt: M()
    }), { success: !0 };
  }
  async updateTopic(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.getFirstMessage(e.conversationId);
    if (!a)
      throw new g("MESSAGE_NOT_FOUND", "First message not found", 404);
    const r = be(a.rawPayloadJson);
    if (r.forumDeleted)
      throw new g("TOPIC_DELETED", "Cannot edit a deleted topic", 400);
    if (e.userRole !== "admin") {
      if (e.userRole === "mediator")
        throw new g("FORBIDDEN", "Mediators cannot edit topics", 403);
      if (t.externalContactId !== e.userId)
        throw new g("FORBIDDEN", "You can only edit your own topics", 403);
    }
    const i = {};
    if (e.title !== void 0 && (i.forumTopicTitle = e.title), e.content !== void 0) {
      const o = e.title ? `**${e.title}**

${e.content.trim()}` : `**${r.forumTopicTitle || "无标题"}**

${e.content.trim()}`;
      await this.messages.updateContent(a.id, o), i.forumEditedAt = M();
    } else if (e.title !== void 0) {
      const o = a.content || "", c = o.indexOf(`

`), d = c >= 0 ? o.slice(c + 2) : o, l = `**${e.title}**

${d}`;
      await this.messages.updateContent(a.id, l), i.forumEditedAt = M();
    }
    return Object.keys(i).length > 0 && await this.updateMessageRawPayload(a.id, a.rawPayloadJson, i), { success: !0 };
  }
  async getUserProfile(e) {
    var l, u;
    const t = await this.conversations.listByExternalContact(e, "forum");
    if (t.length === 0) return null;
    const n = t[0].isAnonymous, a = t[0].contactName ?? "匿名用户";
    let r = 0, i = 0, o = null, c = null;
    if (!n)
      try {
        const h = await this.endUsers.findById(e);
        if (h != null && h.rawPayloadJson) {
          const m = JSON.parse(h.rawPayloadJson);
          typeof ((l = m == null ? void 0 : m.settings) == null ? void 0 : l.avatar_url) == "string" && (o = m.settings.avatar_url), typeof ((u = m == null ? void 0 : m.settings) == null ? void 0 : u.signature) == "string" && (c = m.settings.signature);
        }
      } catch {
      }
    const d = [];
    for (const h of t) {
      const m = await this.getFirstMessage(h.id), _ = be((m == null ? void 0 : m.rawPayloadJson) ?? null);
      r += _.likeCount, i += Math.max(0, h.unreadCount - 1), m && d.push({
        id: h.id,
        conversationId: h.id,
        title: as(m.rawPayloadJson),
        authorName: h.contactName ?? "匿名用户",
        authorId: h.externalContactId ?? "",
        category: _.category,
        messageCount: h.unreadCount,
        lastReplyAt: h.lastMessageAt ?? h.createdAt,
        createdAt: h.createdAt,
        tags: _.tags,
        isPinned: _.isPinned,
        isFeatured: _.isFeatured,
        likeCount: _.likeCount,
        likedBy: _.likedBy,
        visibility: _.visibility,
        isDeleted: _.forumDeleted,
        editedAt: _.forumEditedAt
      });
    }
    return {
      externalContactId: e,
      displayName: a,
      isAnonymous: n,
      topicCount: t.length,
      replyCount: i,
      totalLikesReceived: r,
      joinedAt: t[t.length - 1].createdAt,
      avatarUrl: o,
      signature: c,
      recentTopics: d.sort(
        (h, m) => new Date(m.lastReplyAt).getTime() - new Date(h.lastReplyAt).getTime()
      )
    };
  }
  async getUserNotifications(e) {
    const t = await this.conversations.listByExternalContact(e, "forum"), n = [];
    for (const a of t) {
      const r = await this.getFirstMessage(a.id), i = as((r == null ? void 0 : r.rawPayloadJson) ?? null), o = Math.max(0, a.unreadCount - 1);
      n.push({
        topicId: a.id,
        topicTitle: i,
        replyCount: o,
        lastReplyAt: a.lastMessageAt ?? a.createdAt,
        lastReplyAuthor: a.contactName ?? "匿名用户",
        hasNewReplies: o > 0
      });
    }
    return n;
  }
  // ===== PM (Private Message) 方法 =====
  async createPMConversation(e) {
    const t = await this.channels.getAccount(e.channelAccountId);
    this.assertForumChannel(t);
    const n = await this.endUsers.findById(e.currentUserId), a = await this.endUsers.findById(e.targetUserId);
    if (!n || !a)
      throw new g("USER_NOT_FOUND", "User not found", 404);
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
    const n = (await this.conversations.listByChannel(e.channelAccountId)).filter((r) => {
      var i;
      return (i = r.externalThreadId) == null ? void 0 : i.startsWith("pm:");
    }), a = [];
    for (const r of n) {
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
        avatarUrl: Ft((c == null ? void 0 : c.rawPayloadJson) ?? null)
      });
    }
    return a.sort((r, i) => r.lastMessageAt ? i.lastMessageAt ? new Date(i.lastMessageAt).getTime() - new Date(r.lastMessageAt).getTime() : -1 : 1), a;
  }
  async sendPMMessage(e) {
    const t = await this.conversations.findById(e.conversationId);
    if (!t)
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new g("USER_NOT_FOUND", "Sender not found", 404);
    const r = `pm:${a.id}:${Y("pm_msg")}`, i = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
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
          receivedAt: M()
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
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    const n = await this.channels.getAccount(t.channelAccountId);
    this.assertForumChannel(n);
    const a = await this.endUsers.findById(e.senderUserId);
    if (!a)
      throw new g("USER_NOT_FOUND", "Sender not found", 404);
    const r = e.clientMessageId ? `pm:${a.id}:${e.clientMessageId}` : `pm:${a.id}:${Y("pm_msg")}`, i = await this.messages.findByExternalMessageId(n.id, r);
    if (i)
      return { message: i };
    const o = Y("msg"), c = await this.media.storeUpload({
      conversationId: t.id,
      messageId: o,
      file: e.file,
      fileName: e.fileName,
      mimeType: e.mimeType
    }), d = await this.conversationService.receiveInboundMessage(
      {
        channelAccount: n,
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
          receivedAt: M()
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
      const h = (t.externalThreadId ?? "").replace("pm:", "").split("::").find((m) => m !== e.senderUserId);
      h && await this.realtime.notifyEndUserMessage(h, {
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
      throw new g("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
    return { messages: await this.messages.listByConversationAfter(
      e.conversationId,
      e.afterMessageId
    ) };
  }
  async requireConversationAccess(e, t) {
    const n = await this.conversations.findById(e);
    if (!n)
      throw new g("CONVERSATION_NOT_FOUND", "Topic not found", 404);
    const a = await this.channels.getAccount(n.channelAccountId);
    return this.assertForumChannel(a), {
      conversationId: n.id,
      visitorId: n.externalContactId ?? "anonymous"
    };
  }
  async resolveEndUserIdentity(e, t) {
    if (t) {
      const n = await this.endUserAuth.tryGetEndUser(`Bearer ${t}`);
      if (n)
        return {
          contactName: n.displayName || n.username,
          externalContactId: n.id,
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
      throw new g("CHANNEL_NOT_FORUM", "Channel is not a forum channel", 400);
  }
  async getFirstMessage(e) {
    return this.messages.listByConversation(e, 1).then((t) => t[0] ?? null);
  }
  async updateMessageRawPayload(e, t, n) {
    let a = {};
    if (t)
      try {
        a = JSON.parse(t);
      } catch {
      }
    const r = { ...a, ...n };
    await this.messages.updateRawPayload(e, JSON.stringify(r));
  }
  async signForumToken(e) {
    const t = ge(JSON.stringify({ alg: "HS256", typ: "JWT" })), n = ge(JSON.stringify(e)), a = await st(`${t}.${n}`, this.tokenSecret);
    return `${t}.${n}.${a}`;
  }
}
function Ds(s) {
  const e = s.trim();
  return e ? e.length > 128 ? e.slice(0, 128) : e : "anonymous";
}
function as(s) {
  if (!s) return "无标题";
  try {
    const e = JSON.parse(s);
    if (e.forumTopicTitle && typeof e.forumTopicTitle == "string")
      return e.forumTopicTitle.trim();
  } catch {
  }
  return "无标题";
}
const Lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForumService: $o
}, Symbol.toStringTag, { value: "Module" })), rt = new _e();
rt.get("/ws", async (s) => {
  var o, c;
  Fo(s.req.raw);
  const e = await x(s.env), t = (o = s.req.query("token")) == null ? void 0 : o.trim(), n = await e.auth.requireAdminUser({
    adminUserId: ((c = s.req.query("adminUserId")) == null ? void 0 : c.trim()) || s.req.header("x-admin-user-id"),
    authorization: t ? `Bearer ${t}` : s.req.header("authorization")
  }), a = s.env.ADMIN_STREAM.idFromName("admin"), r = s.env.ADMIN_STREAM.get(a), i = Bo(s.req.raw, {
    "x-supportly-admin-user-id": n.id
  });
  return r.fetch(i);
});
rt.use("*", We());
rt.get("/", (s) => k({ ok: !0 }));
rt.get("/end-users", async (s) => {
  const e = await x(s.env);
  return k(await e.endUserAuth.listUsers());
});
rt.post("/end-users/:id/approve", async (s) => {
  const e = await x(s.env);
  return k(await e.endUserAuth.approveUser(s.req.param("id")));
});
rt.post("/end-users/:id/deactivate", async (s) => (await (await x(s.env)).endUserAuth.deactivateUser(s.req.param("id")), k({ deactivated: !0 })));
function Fo(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new g("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function Bo(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token"), t.searchParams.delete("adminUserId");
  const n = new Headers(s.headers);
  n.delete("authorization"), n.delete("x-admin-user-id");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const jo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adminRoutes: rt
}, Symbol.toStringTag, { value: "Module" })), Ho = F({
  channelAccountId: v().min(1),
  visitorId: v().min(1).max(128),
  pageUrl: v().max(2048).optional(),
  pageTitle: v().max(300).optional()
}), qo = F({
  clientMessageId: v().trim().min(1).max(128).optional(),
  content: v().trim().min(1).max(2e3),
  pageUrl: v().max(2048).optional(),
  pageTitle: v().max(300).optional()
}), it = new _e();
it.get("/ws", async (s) => {
  var o;
  Wo(s.req.raw);
  const e = (o = s.req.query("conversationId")) == null ? void 0 : o.trim();
  if (!e)
    throw new g("CONVERSATION_ID_REQUIRED", "Conversation id is required", 400);
  const n = await (await x(s.env)).widget.requireConversationAccess(e, ga(s.req.raw, s.req.query("token"))), a = s.env.VISITOR_STREAM.idFromName(e), r = s.env.VISITOR_STREAM.get(a), i = Jo(s.req.raw, {
    "x-supportly-conversation-id": e,
    "x-supportly-visitor-id": n.visitorId
  });
  return r.fetch(i);
});
it.post("/conversations", async (s) => {
  const e = Ho.parse(await s.req.json()), t = await x(s.env), n = s.req.header("authorization"), a = n ? await t.endUserAuth.requireEndUser(n) : null;
  return Xt(await t.widget.createSession({
    ...e,
    endUserId: a == null ? void 0 : a.id,
    endUserName: a == null ? void 0 : a.displayName
  }));
});
it.post("/conversations/:conversationId/messages", async (s) => {
  const e = qo.parse(await s.req.json()), t = await x(s.env), n = await t.widget.sendVisitorMessage(
    {
      conversationId: s.req.param("conversationId"),
      token: Is(s.req.raw),
      clientMessageId: e.clientMessageId,
      content: e.content,
      pageUrl: e.pageUrl,
      pageTitle: e.pageTitle
    },
    { createAiReply: !1, notifyRealtime: !1 }
  );
  if (!n.duplicate) {
    s.executionCtx.waitUntil(
      t.widget.completeVisitorMessage({
        conversationId: n.conversationId,
        inboundMessageId: n.inboundMessage.id
      })
    );
    const a = (n.inboundMessage.content ?? "").substring(0, 500);
    s.executionCtx.waitUntil(
      t.notification.notify(`💬 <b>Web Chat 新消息</b>

${a}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.conversationId}`)
    );
  }
  return k(n);
});
it.post("/conversations/:conversationId/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!zo(t))
    throw new g("VALIDATION_ERROR", "file is required", 400);
  const a = await (await x(s.env)).widget.sendVisitorMediaMessage({
    conversationId: s.req.param("conversationId"),
    token: Is(s.req.raw),
    clientMessageId: pt(e, "clientMessageId", 128),
    content: pt(e, "content", 2e3),
    file: t,
    fileName: pt(e, "fileName", 300),
    mimeType: pt(e, "mimeType", 100),
    pageUrl: pt(e, "pageUrl", 2048),
    pageTitle: pt(e, "pageTitle", 300)
  });
  return k(a);
});
it.get("/conversations/:conversationId/messages", async (s) => {
  const e = await x(s.env), t = s.req.param("conversationId");
  return k(!t || t === "_" ? { messages: [] } : {
    messages: await e.widget.listMessages({
      conversationId: t,
      token: Is(s.req.raw),
      afterMessageId: s.req.query("after") || void 0
    })
  });
});
it.get("/conversations/:conversationId/messages/:messageId/attachments/:index", async (s) => {
  const e = await x(s.env), t = s.req.param("conversationId");
  return await e.widget.requireConversationAccess(t, ga(s.req.raw, s.req.query("token"))), e.media.getMessageAttachmentResponse({
    conversationId: t,
    messageId: s.req.param("messageId"),
    attachmentIndex: Vo(s.req.param("index")),
    request: s.req.raw
  });
});
function Is(s) {
  const e = s.headers.get("authorization"), t = "Bearer ";
  if (!(e != null && e.startsWith(t)))
    throw new g("VISITOR_TOKEN_REQUIRED", "Visitor token is required", 401);
  return e.slice(t.length).trim();
}
function ga(s, e) {
  return e != null && e.trim() ? e.trim() : Is(s);
}
function Wo(s) {
  var e;
  if (((e = s.headers.get("upgrade")) == null ? void 0 : e.toLowerCase()) !== "websocket")
    throw new g("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
}
function zo(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function pt(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new g("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
function Vo(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new g("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function Jo(s, e) {
  const t = new URL(s.url);
  t.searchParams.delete("token");
  const n = new Headers(s.headers);
  n.delete("authorization");
  for (const [a, r] of Object.entries(e))
    n.set(a, r);
  return new Request(t.toString(), {
    method: s.method,
    headers: n
  });
}
const Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  widgetRoutes: it
}, Symbol.toStringTag, { value: "Module" })), Ko = F({
  channelAccountId: v().min(1),
  visitorId: v().min(1).max(128),
  title: v().trim().min(1).max(200),
  content: v().trim().min(1).max(5e4),
  category: v().max(30).optional(),
  tags: vs(v().max(30)).max(5).optional(),
  pageUrl: v().max(2048).optional(),
  pageTitle: v().max(300).optional(),
  endUserToken: v().optional(),
  visibility: kt(["public", "login_required"]).optional()
}), Zo = F({
  visitorId: v().min(1).max(128),
  content: v().trim().min(1).max(5e4),
  quotedMessageId: v().optional(),
  pageUrl: v().max(2048).optional(),
  pageTitle: v().max(300).optional(),
  endUserToken: v().optional()
}), Yo = F({
  visitorId: v().min(1).max(128)
}), Xo = F({
  pin: oe()
}), Qo = F({
  feature: oe()
}), V = new _e();
V.get("/config", async (s) => {
  const e = s.env.FORUM_CHANNEL_ID;
  if (!e)
    throw new g("FORUM_NOT_FOUND", "FORUM_CHANNEL_ID not configured", 404);
  return k({
    channelId: e,
    title: s.env.FORUM_TITLE || "社区论坛",
    primaryColor: s.env.FORUM_PRIMARY_COLOR || "#2563eb",
    categories: (s.env.FORUM_CATEGORIES || "综合讨论,技术交流,问题反馈,资源分享,公告通知").split(",").map((t) => t.trim()),
    widgetChannelId: s.env.WIDGET_CHANNEL_ID,
    widgetTitle: s.env.WIDGET_TITLE,
    widgetMode: s.env.WIDGET_MODE || "chat"
  });
});
V.get("/admin/check", We(), async (s) => k({ isAdmin: !0 }));
const ec = F({
  account: v().min(1),
  password: v().min(1)
});
V.post("/login", async (s) => {
  const e = ec.parse(await s.req.json()), t = await x(s.env);
  try {
    const n = await t.auth.login(e.account, e.password);
    return k({ ...n, authType: "admin" });
  } catch {
    const n = await t.endUserAuth.login(e.account, e.password);
    return k({ ...n, authType: "end_user" });
  }
});
V.get("/channels/:channelAccountId/topics", async (s) => {
  const e = await x(s.env), t = Rn(s.req.query("limit"), 50), n = Rn(s.req.query("offset"), 0);
  return k(
    await e.forum.listTopics({
      channelAccountId: s.req.param("channelAccountId"),
      limit: t,
      offset: n,
      search: s.req.query("search") || void 0,
      sortBy: s.req.query("sort") || void 0,
      tag: s.req.query("tag") || void 0,
      category: s.req.query("category") || void 0
    })
  );
});
V.post("/channels/:channelAccountId/topics", async (s) => {
  const e = Ko.parse(await s.req.json()), t = await x(s.env), n = await t.forum.createTopic(e), a = e.content.substring(0, 300);
  return s.executionCtx.waitUntil(
    t.notification.notify(
      `📝 <b>论坛新帖</b>
标题：${e.title}
作者：${n.message.contactName}

${a}${e.content.length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.message.conversationId}`
    )
  ), Xt(n);
});
V.post("/topics/:conversationId/replies", async (s) => {
  const e = Zo.parse(await s.req.json()), t = await x(s.env), n = await t.forum.sendReply({
    conversationId: s.req.param("conversationId"),
    ...e
  });
  if (!n.duplicate) {
    const a = (n.message.content ?? "").substring(0, 300);
    s.executionCtx.waitUntil(
      t.notification.notify(
        `💬 <b>论坛新回复</b>
作者：${n.message.contactName}

${a}${(n.message.content ?? "").length > 300 ? "..." : ""}
（建议前往web_chat完整对话，这里内容有截段，只能引用回复，且不能发图）

#conv_${n.message.conversationId}`
      )
    );
  }
  return Xt(n);
});
V.get("/topics/:conversationId/messages", async (s) => {
  const e = await x(s.env), t = s.req.param("conversationId");
  return k(!t || t === "_" ? { messages: [] } : await e.forum.listMessages({
    conversationId: t,
    afterMessageId: s.req.query("after") || void 0
  }));
});
V.post("/topics/:conversationId/like", async (s) => {
  const e = Yo.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.forum.likeTopic({
      conversationId: s.req.param("conversationId"),
      visitorId: e.visitorId
    })
  );
});
V.post("/topics/:conversationId/pin", We(), async (s) => {
  const e = Xo.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.forum.togglePin({
      conversationId: s.req.param("conversationId"),
      pin: e.pin
    })
  );
});
V.post("/topics/:conversationId/feature", We(), async (s) => {
  const e = Qo.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.forum.toggleFeatured({
      conversationId: s.req.param("conversationId"),
      feature: e.feature
    })
  );
});
const tc = F({
  userId: v().min(1),
  userRole: kt(["admin", "mediator", "member"])
});
V.delete("/topics/:conversationId", async (s) => {
  const e = tc.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.forum.deleteTopic({
      conversationId: s.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole
    })
  );
});
const sc = F({
  userId: v().min(1),
  userRole: kt(["admin", "mediator", "member"]),
  title: v().trim().min(1).max(200).optional(),
  content: v().trim().min(1).max(5e4).optional()
});
V.patch("/topics/:conversationId", async (s) => {
  const e = sc.parse(await s.req.json()), t = await x(s.env);
  return k(
    await t.forum.updateTopic({
      conversationId: s.req.param("conversationId"),
      userId: e.userId,
      userRole: e.userRole,
      title: e.title,
      content: e.content
    })
  );
});
V.get("/users/:externalContactId/profile", async (s) => {
  const t = await (await x(s.env)).forum.getUserProfile(
    s.req.param("externalContactId")
  );
  return k(t);
});
V.get("/users/:externalContactId/notifications", async (s) => {
  const e = await x(s.env);
  return k(
    await e.forum.getUserNotifications(
      s.req.param("externalContactId")
    )
  );
});
const nc = F({
  channelAccountId: v().min(1),
  targetUserId: v().min(1)
}), ac = F({
  content: v().trim().min(1).max(5e4)
});
V.post("/pm/conversations", async (s) => {
  const e = nc.parse(await s.req.json()), t = await x(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization"));
  return k(
    await t.forum.createPMConversation({
      channelAccountId: e.channelAccountId,
      currentUserId: n.id,
      targetUserId: e.targetUserId
    })
  );
});
V.get("/pm/conversations", async (s) => {
  const e = await x(s.env), t = s.req.query("channelAccountId");
  if (!t)
    throw new g("MISSING_PARAM", "channelAccountId is required", 400);
  const n = await e.endUserAuth.requireEndUser(s.req.header("authorization"));
  return k(
    await e.forum.listPMConversations({
      channelAccountId: t,
      currentUserId: n.id
    })
  );
});
V.post("/pm/conversations/:conversationId/messages", async (s) => {
  const e = ac.parse(await s.req.json()), t = await x(s.env), n = await t.endUserAuth.requireEndUser(s.req.header("authorization")), a = await t.forum.sendPMMessage({
    conversationId: s.req.param("conversationId"),
    senderUserId: n.id,
    content: e.content
  }), r = getAvatarUrlFromRawPayload(n.rawPayloadJson);
  return k({ message: Oe(a.message, r) });
});
V.post("/pm/conversations/:conversationId/messages/media", async (s) => {
  const e = await s.req.formData(), t = e.get("file");
  if (!ic(t))
    throw new g("VALIDATION_ERROR", "file is required", 400);
  const n = await x(s.env), a = await n.endUserAuth.requireEndUser(s.req.header("authorization")), r = await n.forum.sendPMMediaMessage({
    conversationId: s.req.param("conversationId"),
    senderUserId: a.id,
    clientMessageId: rs(e, "clientMessageId", 128),
    content: rs(e, "content", 2e3),
    file: t,
    fileName: rs(e, "fileName", 300),
    mimeType: rs(e, "mimeType", 100)
  }), i = getAvatarUrlFromRawPayload(a.rawPayloadJson);
  return k({ message: Oe(r.message, i) });
});
V.get("/pm/conversations/:conversationId/messages", async (s) => {
  const e = await x(s.env);
  await e.endUserAuth.requireEndUser(s.req.header("authorization"));
  const t = await e.forum.listPMMessages({
    conversationId: s.req.param("conversationId"),
    afterMessageId: s.req.query("after") || void 0
  });
  return k({ messages: t.messages.map(Oe) });
});
V.get("/pm/conversations/:conversationId/messages/:messageId/attachments/:index", async (s) => (await x(s.env)).media.getMessageAttachmentResponse({
  conversationId: s.req.param("conversationId"),
  messageId: s.req.param("messageId"),
  attachmentIndex: rc(s.req.param("index")),
  request: s.req.raw
}));
V.get("/ws", async (s) => {
  var d;
  const e = s.req.query("token");
  if (!e)
    throw new g("MISSING_TOKEN", "token is required", 400);
  const n = await (await x(s.env)).endUserAuth.tryGetEndUser(`Bearer ${e}`);
  if (!n)
    throw new g("UNAUTHORIZED", "Invalid or expired token", 401);
  if (((d = s.req.header("upgrade")) == null ? void 0 : d.toLowerCase()) !== "websocket")
    throw new g("WEBSOCKET_REQUIRED", "WebSocket upgrade is required", 426);
  const r = s.env.END_USER_STREAM.idFromName("end_user"), i = s.env.END_USER_STREAM.get(r), o = new URL("https://end-user-stream.internal/"), c = new Request(o, {
    headers: {
      upgrade: "websocket",
      "x-supportly-end-user-id": n.id
    }
  });
  return i.fetch(c);
});
function Rn(s, e) {
  if (!s) return e;
  const t = parseInt(s, 10);
  return Number.isFinite(t) && t > 0 ? t : e;
}
function rc(s) {
  const e = Number(s);
  if (!Number.isInteger(e) || e < 0)
    throw new g("VALIDATION_ERROR", "Invalid attachment index", 400);
  return e;
}
function ic(s) {
  return typeof s == "object" && s !== null && "name" in s && "size" in s && "stream" in s;
}
function rs(s, e, t) {
  const n = s.get(e);
  if (typeof n != "string") return;
  const a = n.trim();
  if (a) {
    if (a.length > t)
      throw new g("VALIDATION_ERROR", `${e} is too long`, 400);
    return a;
  }
}
const oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  forumRoutes: V
}, Symbol.toStringTag, { value: "Module" }));
export {
  dc as AdminStream,
  uc as EndUserStream,
  hc as TraderDO,
  lc as VisitorStream,
  ie as default
};
