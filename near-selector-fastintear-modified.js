/* ⋈ 🏃🏻💨 FastNEAR API - ESM Bundled (fastintear version 0.1.16, modified for near-selector) */
// TODO: rewrite without using fastintear, or rewrite fastintear to support near-selector more natively. And TODO implement signing with function call key.

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../utils/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  LsPrefix: () => LsPrefix,
  SCHEMA: () => SCHEMA,
  base64ToBytes: () => base64ToBytes,
  bytesToBase64: () => bytesToBase64,
  canSignWithLAK: () => canSignWithLAK,
  convertUnit: () => convertUnit,
  createDefaultStorage: () => createDefaultStorage,
  deepCopy: () => deepCopy,
  exp: () => exp,
  fromBase58: () => base58_to_binary_default,
  fromBase64: () => fromBase64,
  fromHex: () => fromHex,
  keyFromString: () => keyFromString,
  keyToString: () => keyToString,
  lsGet: () => lsGet,
  lsSet: () => lsSet,
  mapAction: () => mapAction,
  mapTransaction: () => mapTransaction,
  memoryStore: () => memoryStore,
  parseJsonFromBytes: () => parseJsonFromBytes,
  privateKeyFromRandom: () => privateKeyFromRandom,
  publicKeyFromPrivate: () => publicKeyFromPrivate,
  serializeSignedTransaction: () => serializeSignedTransaction,
  serializeTransaction: () => serializeTransaction,
  sha256: () => sha256,
  signBytes: () => signBytes,
  signHash: () => signHash,
  storage: () => storage,
  toBase58: () => binary_to_base58_default,
  toBase64: () => toBase64,
  toHex: () => toHex,
  tryParseJson: () => tryParseJson,
  txToJson: () => txToJson,
  txToJsonStringified: () => txToJsonStringified
});

// ../../node_modules/@noble/hashes/esm/_assert.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
__name(isBytes, "isBytes");
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
__name(abytes, "abytes");
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
__name(aexists, "aexists");
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
__name(aoutput, "aoutput");

// ../../node_modules/@noble/hashes/esm/crypto.js
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// ../../node_modules/@noble/hashes/esm/utils.js
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
__name(createView, "createView");
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
__name(rotr, "rotr");
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("utf8ToBytes expected string, got " + typeof str);
  return new Uint8Array(new TextEncoder().encode(str));
}
__name(utf8ToBytes, "utf8ToBytes");
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
__name(toBytes, "toBytes");
var Hash = class {
  static {
    __name(this, "Hash");
  }
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wrapConstructor(hashCons) {
  const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes(msg)).digest(), "hashC");
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
__name(wrapConstructor, "wrapConstructor");
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return crypto2.randomBytes(bytesLength);
  }
  throw new Error("crypto.getRandomValues must be defined");
}
__name(randomBytes, "randomBytes");

// ../../node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view2, byteOffset, value, isLE) {
  if (typeof view2.setBigUint64 === "function")
    return view2.setBigUint64(byteOffset, value, isLE);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view2.setUint32(byteOffset + h, wh, isLE);
  view2.setUint32(byteOffset + l, wl, isLE);
}
__name(setBigUint64, "setBigUint64");
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
__name(Chi, "Chi");
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
__name(Maj, "Maj");
var HashMD = class extends Hash {
  static {
    __name(this, "HashMD");
  }
  constructor(blockLen, outputLen, padOffset, isLE) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    const { view: view2, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view2, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view: view2, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view2, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view2, blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view2, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state2 = this.get();
    if (outLen > state2.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state2[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// ../../node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
__name(fromBig, "fromBig");
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
__name(split, "split");
var toBig = /* @__PURE__ */ __name((h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0), "toBig");
var shrSH = /* @__PURE__ */ __name((h, _l, s) => h >>> s, "shrSH");
var shrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
var rotrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
var rotrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
var rotrBH = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
var rotrBL = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
var rotr32H = /* @__PURE__ */ __name((_h, l) => l, "rotr32H");
var rotr32L = /* @__PURE__ */ __name((h, _l) => h, "rotr32L");
var rotlSH = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
var rotlSL = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
var rotlBH = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
var rotlBL = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
__name(add, "add");
var add3L = /* @__PURE__ */ __name((Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0), "add3L");
var add3H = /* @__PURE__ */ __name((low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0, "add3H");
var add4L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0), "add4L");
var add4H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0, "add4H");
var add5L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0), "add5L");
var add5H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0, "add5H");
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var u64_default = u64;

// ../../node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
  static {
    __name(this, "SHA512");
  }
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view2.getUint32(offset);
      SHA512_W_L[i] = view2.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var sha512 = /* @__PURE__ */ wrapConstructor(() => new SHA512());

// ../../node_modules/@noble/curves/esm/abstract/utils.js
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
__name(isBytes2, "isBytes");
function abytes2(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
__name(abytes2, "abytes");
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
__name(abool, "abool");
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes2(bytes);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
__name(bytesToHex, "bytesToHex");
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
__name(hexToNumber, "hexToNumber");
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
__name(asciiToBase16, "asciiToBase16");
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
__name(hexToBytes, "hexToBytes");
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
__name(bytesToNumberBE, "bytesToNumberBE");
function bytesToNumberLE(bytes) {
  abytes2(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
__name(bytesToNumberLE, "bytesToNumberLE");
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
__name(numberToBytesBE, "numberToBytesBE");
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
__name(numberToBytesLE, "numberToBytesLE");
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
__name(ensureBytes, "ensureBytes");
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
__name(concatBytes, "concatBytes");
var isPosBig = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n <= n, "isPosBig");
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
__name(inRange, "inRange");
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
__name(aInRange, "aInRange");
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
__name(bitLen, "bitLen");
var bitMask = /* @__PURE__ */ __name((n) => (_2n << BigInt(n - 1)) - _1n, "bitMask");
var validatorFns = {
  bigint: /* @__PURE__ */ __name((val) => typeof val === "bigint", "bigint"),
  function: /* @__PURE__ */ __name((val) => typeof val === "function", "function"),
  boolean: /* @__PURE__ */ __name((val) => typeof val === "boolean", "boolean"),
  string: /* @__PURE__ */ __name((val) => typeof val === "string", "string"),
  stringOrUint8Array: /* @__PURE__ */ __name((val) => typeof val === "string" || isBytes2(val), "stringOrUint8Array"),
  isSafeInteger: /* @__PURE__ */ __name((val) => Number.isSafeInteger(val), "isSafeInteger"),
  array: /* @__PURE__ */ __name((val) => Array.isArray(val), "array"),
  field: /* @__PURE__ */ __name((val, object) => object.Fp.isValid(val), "field"),
  hash: /* @__PURE__ */ __name((val) => typeof val === "function" && Number.isSafeInteger(val.outputLen), "hash")
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = /* @__PURE__ */ __name((fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  }, "checkField");
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
__name(validateObject, "validateObject");
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
__name(memoized, "memoized");

// ../../node_modules/@noble/curves/esm/abstract/modular.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
__name(mod, "mod");
function pow(num, power, modulo) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (modulo <= _0n2)
    throw new Error("invalid modulus");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
__name(pow, "pow");
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
__name(pow2, "pow2");
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
__name(invert, "invert");
function tonelliShanks(P2) {
  const legendreC = (P2 - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P2 - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2; Z < P2 && pow(Z, legendreC, P2) !== P2 - _1n2; Z++) {
    if (Z > 1e3)
      throw new Error("Cannot find square root: likely non-prime P");
  }
  if (S === 1) {
    const p1div4 = (P2 + _1n2) / _4n;
    return /* @__PURE__ */ __name(function tonelliFast(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "tonelliFast");
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return /* @__PURE__ */ __name(function tonelliSlow(Fp2, n) {
    if (Fp2.pow(n, legendreC) === Fp2.neg(Fp2.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp2.pow(Fp2.mul(Fp2.ONE, Z), Q);
    let x = Fp2.pow(n, Q1div2);
    let b = Fp2.pow(n, Q);
    while (!Fp2.eql(b, Fp2.ONE)) {
      if (Fp2.eql(b, Fp2.ZERO))
        return Fp2.ZERO;
      let m = 1;
      for (let t2 = Fp2.sqr(b); m < r; m++) {
        if (Fp2.eql(t2, Fp2.ONE))
          break;
        t2 = Fp2.sqr(t2);
      }
      const ge = Fp2.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp2.sqr(ge);
      x = Fp2.mul(x, ge);
      b = Fp2.mul(b, g);
      r = m;
    }
    return x;
  }, "tonelliSlow");
}
__name(tonelliShanks, "tonelliShanks");
function FpSqrt(P2) {
  if (P2 % _4n === _3n) {
    const p1div4 = (P2 + _1n2) / _4n;
    return /* @__PURE__ */ __name(function sqrt3mod4(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "sqrt3mod4");
  }
  if (P2 % _8n === _5n) {
    const c1 = (P2 - _5n) / _8n;
    return /* @__PURE__ */ __name(function sqrt5mod8(Fp2, n) {
      const n2 = Fp2.mul(n, _2n2);
      const v = Fp2.pow(n2, c1);
      const nv = Fp2.mul(n, v);
      const i = Fp2.mul(Fp2.mul(nv, _2n2), v);
      const root = Fp2.mul(nv, Fp2.sub(i, Fp2.ONE));
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "sqrt5mod8");
  }
  if (P2 % _16n === _9n) {
  }
  return tonelliShanks(P2);
}
__name(FpSqrt, "FpSqrt");
var isNegativeLE = /* @__PURE__ */ __name((num, modulo) => (mod(num, modulo) & _1n2) === _1n2, "isNegativeLE");
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
__name(validateField, "validateField");
function FpPow(f, num, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return f.ONE;
  if (power === _1n2)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n2;
  }
  return p;
}
__name(FpPow, "FpPow");
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
__name(FpInvertBatch, "FpInvertBatch");
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
__name(nLength, "nLength");
function Field(ORDER, bitLen2, isLE = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: /* @__PURE__ */ __name((num) => mod(num, ORDER), "create"),
    isValid: /* @__PURE__ */ __name((num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n2 <= num && num < ORDER;
    }, "isValid"),
    is0: /* @__PURE__ */ __name((num) => num === _0n2, "is0"),
    isOdd: /* @__PURE__ */ __name((num) => (num & _1n2) === _1n2, "isOdd"),
    neg: /* @__PURE__ */ __name((num) => mod(-num, ORDER), "neg"),
    eql: /* @__PURE__ */ __name((lhs, rhs) => lhs === rhs, "eql"),
    sqr: /* @__PURE__ */ __name((num) => mod(num * num, ORDER), "sqr"),
    add: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs + rhs, ORDER), "add"),
    sub: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs - rhs, ORDER), "sub"),
    mul: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * rhs, ORDER), "mul"),
    pow: /* @__PURE__ */ __name((num, power) => FpPow(f, num, power), "pow"),
    div: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER), "div"),
    // Same as above, but doesn't normalize
    sqrN: /* @__PURE__ */ __name((num) => num * num, "sqrN"),
    addN: /* @__PURE__ */ __name((lhs, rhs) => lhs + rhs, "addN"),
    subN: /* @__PURE__ */ __name((lhs, rhs) => lhs - rhs, "subN"),
    mulN: /* @__PURE__ */ __name((lhs, rhs) => lhs * rhs, "mulN"),
    inv: /* @__PURE__ */ __name((num) => invert(num, ORDER), "inv"),
    sqrt: redef.sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    invertBatch: /* @__PURE__ */ __name((lst) => FpInvertBatch(f, lst), "invertBatch"),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: /* @__PURE__ */ __name((a, b, c) => c ? b : a, "cmov"),
    toBytes: /* @__PURE__ */ __name((num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES), "toBytes"),
    fromBytes: /* @__PURE__ */ __name((bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    }, "fromBytes")
  });
  return Object.freeze(f);
}
__name(Field, "Field");

// ../../node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
__name(constTimeNegate, "constTimeNegate");
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
__name(validateW, "validateW");
function calcWOpts(W, bits) {
  validateW(W, bits);
  const windows = Math.ceil(bits / W) + 1;
  const windowSize = 2 ** (W - 1);
  return { windows, windowSize };
}
__name(calcWOpts, "calcWOpts");
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
__name(validateMSMPoints, "validateMSMPoints");
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
__name(validateMSMScalars, "validateMSMScalars");
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P2) {
  return pointWindowSizes.get(P2) || 1;
}
__name(getW, "getW");
function wNAF(c, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p = c.ZERO) {
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = calcWOpts(W, bits);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        if (n === _0n3)
          break;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        if (wbits === 0)
          continue;
        let curr = precomputes[offset + Math.abs(wbits) - 1];
        if (wbits < 0)
          curr = curr.negate();
        acc = acc.add(curr);
      }
      return acc;
    },
    getPrecomputes(W, P2, transform) {
      let comp = pointPrecomputes.get(P2);
      if (!comp) {
        comp = this.precomputeWindow(P2, W);
        if (W !== 1)
          pointPrecomputes.set(P2, transform(comp));
      }
      return comp;
    },
    wNAFCached(P2, n, transform) {
      const W = getW(P2);
      return this.wNAF(W, this.getPrecomputes(W, P2, transform), n);
    },
    wNAFCachedUnsafe(P2, n, transform, prev) {
      const W = getW(P2);
      if (W === 1)
        return this.unsafeLadder(P2, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P2, transform), n, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P2, W) {
      validateW(W, bits);
      pointWindowSizes.set(P2, W);
      pointPrecomputes.delete(P2);
    }
  };
}
__name(wNAF, "wNAF");
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  if (points.length !== scalars.length)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
__name(pippenger, "pippenger");
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
__name(validateBasic, "validateBasic");

// ../../node_modules/@noble/curves/esm/abstract/edwards.js
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _8n2 = BigInt(8);
var VERIFY_DEFAULT = { zip215: true };
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(curve, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  });
  return Object.freeze({ ...opts });
}
__name(validateOpts, "validateOpts");
function twistedEdwards(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp2, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes2, nByteLength, h: cofactor } = CURVE;
  const MASK = _2n3 << BigInt(nByteLength * 8) - _1n4;
  const modP = Fp2.create;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const uvRatio2 = CURVE.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp2.sqrt(u * Fp2.inv(v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  const adjustScalarBytes2 = CURVE.adjustScalarBytes || ((bytes) => bytes);
  const domain = CURVE.domain || ((data, ctx, phflag) => {
    abool("phflag", phflag);
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function aCoordinate(title, n) {
    aInRange("coordinate " + title, n, _0n4, MASK);
  }
  __name(aCoordinate, "aCoordinate");
  function assertPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }
  __name(assertPoint, "assertPoint");
  const toAffineMemo = memoized((p, iz) => {
    const { ex: x, ey: y, ez: z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp2.inv(z);
    const ax = modP(x * iz);
    const ay = modP(y * iz);
    const zz = modP(z * iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    static {
      __name(this, "Point");
    }
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
      aCoordinate("x", ex);
      aCoordinate("y", ey);
      aCoordinate("z", ez);
      aCoordinate("t", et);
      Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      aCoordinate("x", x);
      aCoordinate("y", y);
      return new Point(x, y, _1n4, modP(x * y));
    }
    static normalizeZ(points) {
      const toInv = Fp2.invertBatch(points.map((p) => p.ez));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // Not required for fromHex(), which always creates valid points.
    // Could be useful for fromAffine().
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      assertPoint(other);
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n3 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      assertPoint(other);
      const { a, d } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
      if (a === BigInt(-1)) {
        const A2 = modP((Y1 - X1) * (Y2 + X2));
        const B2 = modP((Y1 + X1) * (Y2 - X2));
        const F2 = modP(B2 - A2);
        if (F2 === _0n4)
          return this.double();
        const C2 = modP(Z1 * _2n3 * T2);
        const D2 = modP(T1 * _2n3 * Z2);
        const E2 = D2 + C2;
        const G3 = B2 + A2;
        const H2 = D2 - C2;
        const X32 = modP(E2 * F2);
        const Y32 = modP(G3 * H2);
        const T32 = modP(E2 * H2);
        const Z32 = modP(F2 * G3);
        return new Point(X32, Y32, Z32, T32);
      }
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G2 = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    // Constant-time multiplication.
    multiply(scalar) {
      const n = scalar;
      aInRange("scalar", n, _1n4, CURVE_ORDER);
      const { p, f } = this.wNAF(n);
      return Point.normalizeZ([p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(scalar, acc = Point.ZERO) {
      const n = scalar;
      aInRange("scalar", n, _0n4, CURVE_ORDER);
      if (n === _0n4)
        return I;
      if (this.is0() || n === _1n4)
        return this;
      return wnaf.wNAFCachedUnsafe(this, n, Point.normalizeZ, acc);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    clearCofactor() {
      const { h: cofactor2 } = CURVE;
      if (cofactor2 === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor2);
    }
    // Converts hash string or Uint8Array to Point.
    // Uses algo from RFC8032 5.1.3.
    static fromHex(hex, zip215 = false) {
      const { d, a } = CURVE;
      const len = Fp2.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      abool("zip215", zip215);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp2.ORDER;
      aInRange("pointHex.y", y, _0n4, max);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const bytes = numberToBytesLE(y, Fp2.BYTES);
      bytes[bytes.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n4, _1n4, _1n4, _0n4);
  const { BASE: G, ZERO: I } = Point;
  const wnaf = wNAF(Point, nByteLength * 8);
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  __name(modN, "modN");
  function modN_LE(hash) {
    return modN(bytesToNumberLE(hash));
  }
  __name(modN_LE, "modN_LE");
  function getExtendedPublicKey(key) {
    const len = Fp2.BYTES;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    const point = G.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  __name(getExtendedPublicKey, "getExtendedPublicKey");
  function getPublicKey(privKey) {
    return getExtendedPublicKey(privKey).pointBytes;
  }
  __name(getPublicKey, "getPublicKey");
  function hashDomainToScalar(context = new Uint8Array(), ...msgs) {
    const msg = concatBytes(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  __name(hashDomainToScalar, "hashDomainToScalar");
  function sign(msg, privKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = G.multiply(r).toRawBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = modN(r + k * scalar);
    aInRange("signature.s", s, _0n4, CURVE_ORDER);
    const res = concatBytes(R, numberToBytesLE(s, Fp2.BYTES));
    return ensureBytes("result", res, Fp2.BYTES * 2);
  }
  __name(sign, "sign");
  const verifyOpts = VERIFY_DEFAULT;
  function verify(sig, msg, publicKey2, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = Fp2.BYTES;
    sig = ensureBytes("signature", sig, 2 * len);
    msg = ensureBytes("message", msg);
    publicKey2 = ensureBytes("publicKey", publicKey2, len);
    if (zip215 !== void 0)
      abool("zip215", zip215);
    if (prehash)
      msg = prehash(msg);
    const s = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point.fromHex(publicKey2, zip215);
      R = Point.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
  }
  __name(verify, "verify");
  G._setWindowSize(8);
  const utils2 = {
    getExtendedPublicKey,
    // ed25519 private keys are uniform 32b. No need to check for modulo bias, like in secp256k1.
    randomPrivateKey: /* @__PURE__ */ __name(() => randomBytes2(Fp2.BYTES), "randomPrivateKey"),
    /**
     * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
     * values. This slows down first getPublicKey() by milliseconds (see Speed section),
     * but allows to speed-up subsequent getPublicKey() calls up to 20x.
     * @param windowSize 2, 4, 8, 16
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  return {
    CURVE,
    getPublicKey,
    sign,
    verify,
    ExtendedPoint: Point,
    utils: utils2
  };
}
__name(twistedEdwards, "twistedEdwards");

// ../../node_modules/@noble/curves/esm/ed25519.js
var ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var _3n2 = BigInt(3);
var _5n2 = BigInt(5);
var _8n3 = BigInt(8);
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P2 = ED25519_P;
  const x2 = x * x % P2;
  const b2 = x2 * x % P2;
  const b4 = pow2(b2, _2n4, P2) * b2 % P2;
  const b5 = pow2(b4, _1n5, P2) * x % P2;
  const b10 = pow2(b5, _5n2, P2) * b5 % P2;
  const b20 = pow2(b10, _10n, P2) * b10 % P2;
  const b40 = pow2(b20, _20n, P2) * b20 % P2;
  const b80 = pow2(b40, _40n, P2) * b40 % P2;
  const b160 = pow2(b80, _80n, P2) * b80 % P2;
  const b240 = pow2(b160, _80n, P2) * b80 % P2;
  const b250 = pow2(b240, _10n, P2) * b10 % P2;
  const pow_p_5_8 = pow2(b250, _2n4, P2) * x % P2;
  return { pow_p_5_8, b2 };
}
__name(ed25519_pow_2_252_3, "ed25519_pow_2_252_3");
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
__name(adjustScalarBytes, "adjustScalarBytes");
function uvRatio(u, v) {
  const P2 = ED25519_P;
  const v3 = mod(v * v * v, P2);
  const v7 = mod(v3 * v3 * v, P2);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P2);
  const vx2 = mod(v * x * x, P2);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P2);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P2);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P2);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P2))
    x = mod(-x, P2);
  return { isValid: useRoot1 || useRoot2, value: x };
}
__name(uvRatio, "uvRatio");
var Fp = /* @__PURE__ */ (() => Field(ED25519_P, void 0, true))();
var ed25519Defaults = /* @__PURE__ */ (() => ({
  // Param: a
  a: BigInt(-1),
  // Fp.create(-1) is proper; our way still works and is faster
  // d is equal to -121665/121666 over finite field.
  // Negative number is P - number, and division is invert(number, P)
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  // Finite field 𝔽p over which we'll do calculations; 2n**255n - 19n
  Fp,
  // Subgroup order: how many points curve has
  // 2n**252n + 27742317777372353535851937790883648493n;
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  // Cofactor
  h: _8n3,
  // Base point (x, y) aka generator point
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: sha512,
  randomBytes,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();

// ../../node_modules/@noble/hashes/esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
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
]);
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  static {
    __name(this, "SHA256");
  }
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view2, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view2.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

// ../utils/node_modules/base58-js/base58_chars.js
var base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var base58_chars_default = base58_chars;

// ../utils/node_modules/base58-js/base58_to_binary.js
function base58_to_binary(base58String) {
  if (!base58String || typeof base58String !== "string")
    throw new Error(`Expected base58 string but got \u201C${base58String}\u201D`);
  if (base58String.match(/[IOl0]/gmu))
    throw new Error(
      `Invalid base58 character \u201C${base58String.match(/[IOl0]/gmu)}\u201D`
    );
  const lz = base58String.match(/^1+/gmu);
  const psz = lz ? lz[0].length : 0;
  const size = (base58String.length - psz) * (Math.log(58) / Math.log(256)) + 1 >>> 0;
  return new Uint8Array([
    ...new Uint8Array(psz),
    ...base58String.match(/.{1}/gmu).map((i) => base58_chars_default.indexOf(i)).reduce((acc, i) => {
      acc = acc.map((j) => {
        const x = j * 58 + i;
        i = x >> 8;
        return x;
      });
      return acc;
    }, new Uint8Array(size)).reverse().filter(
      /* @__PURE__ */ ((lastValue) => (value) => (
        // @ts-ignore
        lastValue = lastValue || value
      ))(false)
    )
  ]);
}
__name(base58_to_binary, "base58_to_binary");
var base58_to_binary_default = base58_to_binary;

// ../utils/node_modules/base58-js/create_base58_map.js
var create_base58_map = /* @__PURE__ */ __name(() => {
  const base58M = Array(256).fill(-1);
  for (let i = 0; i < base58_chars_default.length; ++i)
    base58M[base58_chars_default.charCodeAt(i)] = i;
  return base58M;
}, "create_base58_map");
var create_base58_map_default = create_base58_map;

// ../utils/node_modules/base58-js/binary_to_base58.js
var base58Map = create_base58_map_default();
function binary_to_base58(uint8array) {
  const result = [];
  for (const byte of uint8array) {
    let carry = byte;
    for (let j = 0; j < result.length; ++j) {
      const x = (base58Map[result[j]] << 8) + carry;
      result[j] = base58_chars_default.charCodeAt(x % 58);
      carry = x / 58 | 0;
    }
    while (carry) {
      result.push(base58_chars_default.charCodeAt(carry % 58));
      carry = carry / 58 | 0;
    }
  }
  for (const byte of uint8array)
    if (byte) break;
    else result.push("1".charCodeAt(0));
  result.reverse();
  return String.fromCharCode(...result);
}
__name(binary_to_base58, "binary_to_base58");
var binary_to_base58_default = binary_to_base58;

// ../../node_modules/big.js/big.mjs
var DP = 20;
var RM = 1;
var MAX_DP = 1e6;
var MAX_POWER = 1e6;
var NE = -7;
var PE = 21;
var STRICT = false;
var NAME = "[big.js] ";
var INVALID = NAME + "Invalid ";
var INVALID_DP = INVALID + "decimal places";
var INVALID_RM = INVALID + "rounding mode";
var DIV_BY_ZERO = NAME + "Division by zero";
var P = {};
var UNDEFINED = void 0;
var NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
function _Big_() {
  function Big2(n) {
    var x = this;
    if (!(x instanceof Big2)) return n === UNDEFINED ? _Big_() : new Big2(n);
    if (n instanceof Big2) {
      x.s = n.s;
      x.e = n.e;
      x.c = n.c.slice();
    } else {
      if (typeof n !== "string") {
        if (Big2.strict === true && typeof n !== "bigint") {
          throw TypeError(INVALID + "value");
        }
        n = n === 0 && 1 / n < 0 ? "-0" : String(n);
      }
      parse(x, n);
    }
    x.constructor = Big2;
  }
  __name(Big2, "Big");
  Big2.prototype = P;
  Big2.DP = DP;
  Big2.RM = RM;
  Big2.NE = NE;
  Big2.PE = PE;
  Big2.strict = STRICT;
  Big2.roundDown = 0;
  Big2.roundHalfUp = 1;
  Big2.roundHalfEven = 2;
  Big2.roundUp = 3;
  return Big2;
}
__name(_Big_, "_Big_");
function parse(x, n) {
  var e, i, nl;
  if (!NUMERIC.test(n)) {
    throw Error(INVALID + "number");
  }
  x.s = n.charAt(0) == "-" ? (n = n.slice(1), -1) : 1;
  if ((e = n.indexOf(".")) > -1) n = n.replace(".", "");
  if ((i = n.search(/e/i)) > 0) {
    if (e < 0) e = i;
    e += +n.slice(i + 1);
    n = n.substring(0, i);
  } else if (e < 0) {
    e = n.length;
  }
  nl = n.length;
  for (i = 0; i < nl && n.charAt(i) == "0"; ) ++i;
  if (i == nl) {
    x.c = [x.e = 0];
  } else {
    for (; nl > 0 && n.charAt(--nl) == "0"; ) ;
    x.e = e - i - 1;
    x.c = [];
    for (e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
  }
  return x;
}
__name(parse, "parse");
function round(x, sd, rm, more) {
  var xc = x.c;
  if (rm === UNDEFINED) rm = x.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }
  if (sd < 1) {
    more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
    xc.length = 1;
    if (more) {
      x.e = x.e - sd + 1;
      xc[0] = 1;
    } else {
      xc[0] = x.e = 0;
    }
  } else if (sd < xc.length) {
    more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
    xc.length = sd;
    if (more) {
      for (; ++xc[--sd] > 9; ) {
        xc[sd] = 0;
        if (sd === 0) {
          ++x.e;
          xc.unshift(1);
          break;
        }
      }
    }
    for (sd = xc.length; !xc[--sd]; ) xc.pop();
  }
  return x;
}
__name(round, "round");
function stringify(x, doExponential, isNonzero) {
  var e = x.e, s = x.c.join(""), n = s.length;
  if (doExponential) {
    s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e;
  } else if (e < 0) {
    for (; ++e; ) s = "0" + s;
    s = "0." + s;
  } else if (e > 0) {
    if (++e > n) {
      for (e -= n; e--; ) s += "0";
    } else if (e < n) {
      s = s.slice(0, e) + "." + s.slice(e);
    }
  } else if (n > 1) {
    s = s.charAt(0) + "." + s.slice(1);
  }
  return x.s < 0 && isNonzero ? "-" + s : s;
}
__name(stringify, "stringify");
P.abs = function() {
  var x = new this.constructor(this);
  x.s = 1;
  return x;
};
P.cmp = function(y) {
  var isneg, x = this, xc = x.c, yc = (y = new x.constructor(y)).c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
  if (i != j) return i;
  isneg = i < 0;
  if (k != l) return k > l ^ isneg ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = -1; ++i < j; ) {
    if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
  }
  return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};
P.div = function(y) {
  var x = this, Big2 = x.constructor, a = x.c, b = (y = new Big2(y)).c, k = x.s == y.s ? 1 : -1, dp = Big2.DP;
  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }
  if (!a[0]) {
    y.s = k;
    y.c = [y.e = 0];
    return y;
  }
  var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), rl = r.length, q = y, qc = q.c = [], qi = 0, p = dp + (q.e = x.e - y.e) + 1;
  q.s = k;
  k = p < 0 ? 0 : p;
  bz.unshift(0);
  for (; rl++ < bl; ) r.push(0);
  do {
    for (n = 0; n < 10; n++) {
      if (bl != (rl = r.length)) {
        cmp = bl > rl ? 1 : -1;
      } else {
        for (ri = -1, cmp = 0; ++ri < bl; ) {
          if (b[ri] != r[ri]) {
            cmp = b[ri] > r[ri] ? 1 : -1;
            break;
          }
        }
      }
      if (cmp < 0) {
        for (bt = rl == bl ? b : bz; rl; ) {
          if (r[--rl] < bt[rl]) {
            ri = rl;
            for (; ri && !r[--ri]; ) r[ri] = 9;
            --r[ri];
            r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }
        for (; !r[0]; ) r.shift();
      } else {
        break;
      }
    }
    qc[qi++] = cmp ? n : ++n;
    if (r[0] && cmp) r[rl] = a[ai] || 0;
    else r = [a[ai]];
  } while ((ai++ < al || r[0] !== UNDEFINED) && k--);
  if (!qc[0] && qi != 1) {
    qc.shift();
    q.e--;
    p--;
  }
  if (qi > p) round(q, p, Big2.RM, r[0] !== UNDEFINED);
  return q;
};
P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.gte = function(y) {
  return this.cmp(y) > -1;
};
P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.minus = P.sub = function(y) {
  var i, j, t, xlty, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
  if (a != b) {
    y.s = -b;
    return x.plus(y);
  }
  var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
  if (!xc[0] || !yc[0]) {
    if (yc[0]) {
      y.s = -b;
    } else if (xc[0]) {
      y = new Big2(x);
    } else {
      y.s = 1;
    }
    return y;
  }
  if (a = xe - ye) {
    if (xlty = a < 0) {
      a = -a;
      t = xc;
    } else {
      ye = xe;
      t = yc;
    }
    t.reverse();
    for (b = a; b--; ) t.push(0);
    t.reverse();
  } else {
    j = ((xlty = xc.length < yc.length) ? xc : yc).length;
    for (a = b = 0; b < j; b++) {
      if (xc[b] != yc[b]) {
        xlty = xc[b] < yc[b];
        break;
      }
    }
  }
  if (xlty) {
    t = xc;
    xc = yc;
    yc = t;
    y.s = -y.s;
  }
  if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--; ) xc[i++] = 0;
  for (b = i; j > a; ) {
    if (xc[--j] < yc[j]) {
      for (i = j; i && !xc[--i]; ) xc[i] = 9;
      --xc[i];
      xc[j] += 10;
    }
    xc[j] -= yc[j];
  }
  for (; xc[--b] === 0; ) xc.pop();
  for (; xc[0] === 0; ) {
    xc.shift();
    --ye;
  }
  if (!xc[0]) {
    y.s = 1;
    xc = [ye = 0];
  }
  y.c = xc;
  y.e = ye;
  return y;
};
P.mod = function(y) {
  var ygtx, x = this, Big2 = x.constructor, a = x.s, b = (y = new Big2(y)).s;
  if (!y.c[0]) {
    throw Error(DIV_BY_ZERO);
  }
  x.s = y.s = 1;
  ygtx = y.cmp(x) == 1;
  x.s = a;
  y.s = b;
  if (ygtx) return new Big2(x);
  a = Big2.DP;
  b = Big2.RM;
  Big2.DP = Big2.RM = 0;
  x = x.div(y);
  Big2.DP = a;
  Big2.RM = b;
  return this.minus(x.times(y));
};
P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return x;
};
P.plus = P.add = function(y) {
  var e, k, t, x = this, Big2 = x.constructor;
  y = new Big2(y);
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
  if (!xc[0] || !yc[0]) {
    if (!yc[0]) {
      if (xc[0]) {
        y = new Big2(x);
      } else {
        y.s = x.s;
      }
    }
    return y;
  }
  xc = xc.slice();
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t = yc;
    } else {
      e = -e;
      t = xc;
    }
    t.reverse();
    for (; e--; ) t.push(0);
    t.reverse();
  }
  if (xc.length - yc.length < 0) {
    t = yc;
    yc = xc;
    xc = t;
  }
  e = yc.length;
  for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;
  if (k) {
    xc.unshift(k);
    ++ye;
  }
  for (e = xc.length; xc[--e] === 0; ) xc.pop();
  y.c = xc;
  y.e = ye;
  return y;
};
P.pow = function(n) {
  var x = this, one = new x.constructor("1"), y = one, isneg = n < 0;
  if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
    throw Error(INVALID + "exponent");
  }
  if (isneg) n = -n;
  for (; ; ) {
    if (n & 1) y = y.times(x);
    n >>= 1;
    if (!n) break;
    x = x.times(x);
  }
  return isneg ? one.div(y) : y;
};
P.prec = function(sd, rm) {
  if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
    throw Error(INVALID + "precision");
  }
  return round(new this.constructor(this), sd, rm);
};
P.round = function(dp, rm) {
  if (dp === UNDEFINED) dp = 0;
  else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round(new this.constructor(this), dp + this.e + 1, rm);
};
P.sqrt = function() {
  var r, c, t, x = this, Big2 = x.constructor, s = x.s, e = x.e, half = new Big2("0.5");
  if (!x.c[0]) return new Big2(x);
  if (s < 0) {
    throw Error(NAME + "No square root");
  }
  s = Math.sqrt(+stringify(x, true, true));
  if (s === 0 || s === 1 / 0) {
    c = x.c.join("");
    if (!(c.length + e & 1)) c += "0";
    s = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r = new Big2((s == 1 / 0 ? "5e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e);
  } else {
    r = new Big2(s + "");
  }
  e = r.e + (Big2.DP += 4);
  do {
    t = r;
    r = half.times(t.plus(x.div(t)));
  } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));
  return round(r, (Big2.DP -= 4) + r.e + 1, Big2.RM);
};
P.times = P.mul = function(y) {
  var c, x = this, Big2 = x.constructor, xc = x.c, yc = (y = new Big2(y)).c, a = xc.length, b = yc.length, i = x.e, j = y.e;
  y.s = x.s == y.s ? 1 : -1;
  if (!xc[0] || !yc[0]) {
    y.c = [y.e = 0];
    return y;
  }
  y.e = i + j;
  if (a < b) {
    c = xc;
    xc = yc;
    yc = c;
    j = a;
    a = b;
    b = j;
  }
  for (c = new Array(j = a + b); j--; ) c[j] = 0;
  for (i = b; i--; ) {
    b = 0;
    for (j = a + i; j > i; ) {
      b = c[j] + yc[i] * xc[j - i - 1] + b;
      c[j--] = b % 10;
      b = b / 10 | 0;
    }
    c[j] = b;
  }
  if (b) ++y.e;
  else c.shift();
  for (i = c.length; !c[--i]; ) c.pop();
  y.c = c;
  return y;
};
P.toExponential = function(dp, rm) {
  var x = this, n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), ++dp, rm);
    for (; x.c.length < dp; ) x.c.push(0);
  }
  return stringify(x, true, !!n);
};
P.toFixed = function(dp, rm) {
  var x = this, n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), dp + x.e + 1, rm);
    for (dp = dp + x.e + 1; x.c.length < dp; ) x.c.push(0);
  }
  return stringify(x, false, !!n);
};
P[Symbol.for("nodejs.util.inspect.custom")] = P.toJSON = P.toString = function() {
  var x = this, Big2 = x.constructor;
  return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, !!x.c[0]);
};
P.toNumber = function() {
  var n = +stringify(this, true, true);
  if (this.constructor.strict === true && !this.eq(n.toString())) {
    throw Error(NAME + "Imprecise conversion");
  }
  return n;
};
P.toPrecision = function(sd, rm) {
  var x = this, Big2 = x.constructor, n = x.c[0];
  if (sd !== UNDEFINED) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + "precision");
    }
    x = round(new Big2(x), sd, rm);
    for (; x.c.length < sd; ) x.c.push(0);
  }
  return stringify(x, sd <= x.e || x.e <= Big2.NE || x.e >= Big2.PE, !!n);
};
P.valueOf = function() {
  var x = this, Big2 = x.constructor;
  if (Big2.strict === true) {
    throw Error(NAME + "valueOf disallowed");
  }
  return stringify(x, x.e <= Big2.NE || x.e >= Big2.PE, true);
};
var Big = _Big_();
var big_default = Big;

// ../../node_modules/js-base64/base64.mjs
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _mkUriSafe = /* @__PURE__ */ __name((src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_"), "_mkUriSafe");
var _tidyB64 = /* @__PURE__ */ __name((s) => s.replace(/[^A-Za-z0-9\+\/]/g, ""), "_tidyB64");
var btoaPolyfill = /* @__PURE__ */ __name((bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
}, "btoaPolyfill");
var _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l = u8a.length; i < l; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = /* @__PURE__ */ __name((u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a), "fromUint8Array");
var cb_utob = /* @__PURE__ */ __name((c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
}, "cb_utob");
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = /* @__PURE__ */ __name((u) => u.replace(re_utob, cb_utob), "utob");
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = /* @__PURE__ */ __name((src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src), "encode");
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = /* @__PURE__ */ __name((cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
}, "cb_btou");
var btou = /* @__PURE__ */ __name((b) => b.replace(re_btou, cb_btou), "btou");
var atobPolyfill = /* @__PURE__ */ __name((asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
}, "atobPolyfill");
var _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = /* @__PURE__ */ __name((a) => _toUint8Array(_unURI(a)), "toUint8Array");
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = /* @__PURE__ */ __name((a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/")), "_unURI");
var decode = /* @__PURE__ */ __name((src) => _decode(_unURI(src)), "decode");

// ../utils/src/storage.ts
var LsPrefix = "__fastnear_";
var createDefaultStorage = /* @__PURE__ */ __name(() => typeof localStorage !== "undefined" ? localStorage : {
  getItem: /* @__PURE__ */ __name((key) => Promise.resolve(memoryStore.get(key) || null), "getItem"),
  setItem: /* @__PURE__ */ __name((key, value) => {
    memoryStore.set(key, value);
    return Promise.resolve();
  }, "setItem"),
  removeItem: /* @__PURE__ */ __name((key) => {
    memoryStore.delete(key);
    return Promise.resolve();
  }, "removeItem"),
  clear: /* @__PURE__ */ __name(() => Promise.resolve(memoryStore.clear()), "clear")
}, "createDefaultStorage");
var memoryStore = /* @__PURE__ */ new Map();
var storageBackend = createDefaultStorage();
var storage = {
  setBackend: /* @__PURE__ */ __name((customBackend) => {
    storageBackend = customBackend;
  }, "setBackend"),
  set: /* @__PURE__ */ __name(async (key, value) => {
    if (value === null || value === void 0) {
      await storageBackend.removeItem(LsPrefix + key);
    } else {
      await storageBackend.setItem(LsPrefix + key, JSON.stringify(value));
    }
  }, "set"),
  get: /* @__PURE__ */ __name(async (key) => {
    const value = await storageBackend.getItem(LsPrefix + key);
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, "get"),
  remove: /* @__PURE__ */ __name((key) => storageBackend.removeItem(key), "remove"),
  clear: /* @__PURE__ */ __name(() => storageBackend.clear(), "clear")
};

// ../utils/src/misc.ts
function toHex(data) {
  return Array.from(data).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(toHex, "toHex");
function fromHex(hex) {
  if (hex.length % 2) throw new Error("Hex string must be even length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
__name(fromHex, "fromHex");
function base64ToBytes(b64Val) {
  return toUint8Array(b64Val);
}
__name(base64ToBytes, "base64ToBytes");
function bytesToBase64(bytesArr) {
  return fromUint8Array(bytesArr);
}
__name(bytesToBase64, "bytesToBase64");
function toBase64(strVal) {
  try {
    return encode(strVal);
  } catch (e) {
    console.error("Issue base64 encoding", e);
    return null;
  }
}
__name(toBase64, "toBase64");
function fromBase64(strVal) {
  try {
    return decode(strVal);
  } catch (e) {
    console.error("Issue base64 decoding", e);
    return null;
  }
}
__name(fromBase64, "fromBase64");
function convertUnit(s, ...args) {
  if (Array.isArray(s)) {
    s = s.reduce((acc, part, i) => {
      return acc + (args[i - 1] ?? "") + part;
    });
  }
  if (typeof s == "string") {
    const match = s.match(/([0-9.,_]+)\s*([a-zA-Z]+)?/);
    if (match) {
      const amount = match[1].replace(/[_,]/g, "");
      const unitPart = match[2];
      if (unitPart) {
        switch (unitPart.toLowerCase()) {
          case "near":
            return big_default(amount).mul(big_default(10).pow(24)).toFixed(0);
          case "tgas":
            return big_default(amount).mul(big_default(10).pow(12)).toFixed(0);
          case "ggas":
            return big_default(amount).mul(big_default(10).pow(9)).toFixed(0);
          case "gas":
          case "yoctonear":
            return big_default(amount).toFixed(0);
          default:
            throw new Error(`Unknown unit: ${unitPart}`);
        }
      } else {
        return big_default(amount).toFixed(0);
      }
    }
  }
  return big_default(`${s}`).toFixed(0);
}
__name(convertUnit, "convertUnit");
async function lsSet(key, value) {
  await storage.set(key, value);
}
__name(lsSet, "lsSet");
async function lsGet(key) {
  return await storage.get(key);
}
__name(lsGet, "lsGet");
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
__name(deepCopy, "deepCopy");
function tryParseJson(...args) {
  try {
    return JSON.parse(args[0]);
  } catch {
    if (args.length > 1) {
      return args[1];
    }
    return args[0];
  }
}
__name(tryParseJson, "tryParseJson");
function parseJsonFromBytes(bytes) {
  try {
    const decoder = new TextDecoder();
    return JSON.parse(
      decoder.decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    );
  } catch (e) {
    try {
      return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    } catch (e2) {
      return bytes;
    }
  }
}
__name(parseJsonFromBytes, "parseJsonFromBytes");
function canSignWithLAK(actions2) {
  return actions2.length === 1 && actions2[0].type === "FunctionCall" && big_default(actions2[0]?.deposit ?? "0").eq(0);
}
__name(canSignWithLAK, "canSignWithLAK");

// ../utils/src/crypto.ts
var keyFromString = /* @__PURE__ */ __name((key) => base58_to_binary_default(
  key.includes(":") ? (() => {
    const [curve, keyPart] = key.split(":");
    if (curve !== "ed25519") {
      throw new Error(`Unsupported curve: ${curve}`);
    }
    return keyPart;
  })() : key
), "keyFromString");
var keyToString = /* @__PURE__ */ __name((key) => `ed25519:${binary_to_base58_default(key)}`, "keyToString");
function publicKeyFromPrivate(privateKey) {
  const secret = keyFromString(privateKey).slice(0, 32);
  const publicKey2 = ed25519.getPublicKey(secret);
  return keyToString(publicKey2);
}
__name(publicKeyFromPrivate, "publicKeyFromPrivate");
function privateKeyFromRandom() {
  const privateKey = crypto.getRandomValues(new Uint8Array(64));
  return keyToString(privateKey);
}
__name(privateKeyFromRandom, "privateKeyFromRandom");
function signHash(hashBytes, privateKey, opts) {
  const secret = keyFromString(privateKey).slice(0, 32);
  const signature = ed25519.sign(hashBytes, secret);
  if (opts?.returnBase58) {
    return binary_to_base58_default(signature);
  }
  return signature;
}
__name(signHash, "signHash");
function signBytes(bytes, privateKey) {
  const hash = sha256(bytes);
  return signHash(hash, privateKey);
}
__name(signBytes, "signBytes");

// ../../node_modules/borsh/lib/esm/types.js
var integers = ["u8", "u16", "u32", "u64", "u128", "i8", "i16", "i32", "i64", "i128", "f32", "f64"];

// ../../node_modules/borsh/lib/esm/buffer.js
var EncodeBuffer = (
  /** @class */
  function() {
    function EncodeBuffer2() {
      this.offset = 0;
      this.buffer_size = 256;
      this.buffer = new ArrayBuffer(this.buffer_size);
      this.view = new DataView(this.buffer);
    }
    __name(EncodeBuffer2, "EncodeBuffer");
    EncodeBuffer2.prototype.resize_if_necessary = function(needed_space) {
      if (this.buffer_size - this.offset < needed_space) {
        this.buffer_size = Math.max(this.buffer_size * 2, this.buffer_size + needed_space);
        var new_buffer = new ArrayBuffer(this.buffer_size);
        new Uint8Array(new_buffer).set(new Uint8Array(this.buffer));
        this.buffer = new_buffer;
        this.view = new DataView(new_buffer);
      }
    };
    EncodeBuffer2.prototype.get_used_buffer = function() {
      return new Uint8Array(this.buffer).slice(0, this.offset);
    };
    EncodeBuffer2.prototype.store_value = function(value, type) {
      var bSize = type.substring(1);
      var size = parseInt(bSize) / 8;
      this.resize_if_necessary(size);
      var toCall = type[0] === "f" ? "setFloat".concat(bSize) : type[0] === "i" ? "setInt".concat(bSize) : "setUint".concat(bSize);
      this.view[toCall](this.offset, value, true);
      this.offset += size;
    };
    EncodeBuffer2.prototype.store_bytes = function(from) {
      this.resize_if_necessary(from.length);
      new Uint8Array(this.buffer).set(new Uint8Array(from), this.offset);
      this.offset += from.length;
    };
    return EncodeBuffer2;
  }()
);
var DecodeBuffer = (
  /** @class */
  function() {
    function DecodeBuffer2(buf) {
      this.offset = 0;
      this.buffer_size = buf.length;
      this.buffer = new ArrayBuffer(buf.length);
      new Uint8Array(this.buffer).set(buf);
      this.view = new DataView(this.buffer);
    }
    __name(DecodeBuffer2, "DecodeBuffer");
    DecodeBuffer2.prototype.assert_enough_buffer = function(size) {
      if (this.offset + size > this.buffer.byteLength) {
        throw new Error("Error in schema, the buffer is smaller than expected");
      }
    };
    DecodeBuffer2.prototype.consume_value = function(type) {
      var bSize = type.substring(1);
      var size = parseInt(bSize) / 8;
      this.assert_enough_buffer(size);
      var toCall = type[0] === "f" ? "getFloat".concat(bSize) : type[0] === "i" ? "getInt".concat(bSize) : "getUint".concat(bSize);
      var ret = this.view[toCall](this.offset, true);
      this.offset += size;
      return ret;
    };
    DecodeBuffer2.prototype.consume_bytes = function(size) {
      this.assert_enough_buffer(size);
      var ret = this.buffer.slice(this.offset, this.offset + size);
      this.offset += size;
      return ret;
    };
    return DecodeBuffer2;
  }()
);

// ../../node_modules/borsh/lib/esm/utils.js
var __extends = /* @__PURE__ */ function() {
  var extendStatics = /* @__PURE__ */ __name(function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  }, "extendStatics");
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    __name(__, "__");
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
function isArrayLike(value) {
  return Array.isArray(value) || !!value && typeof value === "object" && "length" in value && typeof value.length === "number" && (value.length === 0 || value.length > 0 && value.length - 1 in value);
}
__name(isArrayLike, "isArrayLike");
function expect_type(value, type, fieldPath) {
  if (typeof value !== type) {
    throw new Error("Expected ".concat(type, " not ").concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
__name(expect_type, "expect_type");
function expect_bigint(value, fieldPath) {
  var basicType = ["number", "string", "bigint", "boolean"].includes(typeof value);
  var strObject = typeof value === "object" && value !== null && "toString" in value;
  if (!basicType && !strObject) {
    throw new Error("Expected bigint, number, boolean or string not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
__name(expect_bigint, "expect_bigint");
function expect_same_size(length, expected, fieldPath) {
  if (length !== expected) {
    throw new Error("Array length ".concat(length, " does not match schema length ").concat(expected, " at ").concat(fieldPath.join(".")));
  }
}
__name(expect_same_size, "expect_same_size");
function expect_enum(value, fieldPath) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Expected object not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
__name(expect_enum, "expect_enum");
var VALID_STRING_TYPES = integers.concat(["bool", "string"]);
var VALID_OBJECT_KEYS = ["option", "enum", "array", "set", "map", "struct"];
var ErrorSchema = (
  /** @class */
  function(_super) {
    __extends(ErrorSchema2, _super);
    function ErrorSchema2(schema, expected) {
      var message = "Invalid schema: ".concat(JSON.stringify(schema), " expected ").concat(expected);
      return _super.call(this, message) || this;
    }
    __name(ErrorSchema2, "ErrorSchema");
    return ErrorSchema2;
  }(Error)
);
function validate_schema(schema) {
  if (typeof schema === "string" && VALID_STRING_TYPES.includes(schema)) {
    return;
  }
  if (schema && typeof schema === "object") {
    var keys = Object.keys(schema);
    if (keys.length === 1 && VALID_OBJECT_KEYS.includes(keys[0])) {
      var key = keys[0];
      if (key === "option")
        return validate_schema(schema[key]);
      if (key === "enum")
        return validate_enum_schema(schema[key]);
      if (key === "array")
        return validate_array_schema(schema[key]);
      if (key === "set")
        return validate_schema(schema[key]);
      if (key === "map")
        return validate_map_schema(schema[key]);
      if (key === "struct")
        return validate_struct_schema(schema[key]);
    }
  }
  throw new ErrorSchema(schema, VALID_OBJECT_KEYS.join(", ") + " or " + VALID_STRING_TYPES.join(", "));
}
__name(validate_schema, "validate_schema");
function validate_enum_schema(schema) {
  if (!Array.isArray(schema))
    throw new ErrorSchema(schema, "Array");
  for (var _i = 0, schema_1 = schema; _i < schema_1.length; _i++) {
    var sch = schema_1[_i];
    if (typeof sch !== "object" || !("struct" in sch)) {
      throw new Error('Missing "struct" key in enum schema');
    }
    if (typeof sch.struct !== "object" || Object.keys(sch.struct).length !== 1) {
      throw new Error('The "struct" in each enum must have a single key');
    }
    validate_schema({ struct: sch.struct });
  }
}
__name(validate_enum_schema, "validate_enum_schema");
function validate_array_schema(schema) {
  if (typeof schema !== "object")
    throw new ErrorSchema(schema, "{ type, len? }");
  if (schema.len && typeof schema.len !== "number") {
    throw new Error("Invalid schema: ".concat(schema));
  }
  if ("type" in schema)
    return validate_schema(schema.type);
  throw new ErrorSchema(schema, "{ type, len? }");
}
__name(validate_array_schema, "validate_array_schema");
function validate_map_schema(schema) {
  if (typeof schema === "object" && "key" in schema && "value" in schema) {
    validate_schema(schema.key);
    validate_schema(schema.value);
  } else {
    throw new ErrorSchema(schema, "{ key, value }");
  }
}
__name(validate_map_schema, "validate_map_schema");
function validate_struct_schema(schema) {
  if (typeof schema !== "object")
    throw new ErrorSchema(schema, "object");
  for (var key in schema) {
    validate_schema(schema[key]);
  }
}
__name(validate_struct_schema, "validate_struct_schema");

// ../../node_modules/borsh/lib/esm/serialize.js
var BorshSerializer = (
  /** @class */
  function() {
    function BorshSerializer2(checkTypes) {
      this.encoded = new EncodeBuffer();
      this.fieldPath = ["value"];
      this.checkTypes = checkTypes;
    }
    __name(BorshSerializer2, "BorshSerializer");
    BorshSerializer2.prototype.encode = function(value, schema) {
      this.encode_value(value, schema);
      return this.encoded.get_used_buffer();
    };
    BorshSerializer2.prototype.encode_value = function(value, schema) {
      if (typeof schema === "string") {
        if (integers.includes(schema))
          return this.encode_integer(value, schema);
        if (schema === "string")
          return this.encode_string(value);
        if (schema === "bool")
          return this.encode_boolean(value);
      }
      if (typeof schema === "object") {
        if ("option" in schema)
          return this.encode_option(value, schema);
        if ("enum" in schema)
          return this.encode_enum(value, schema);
        if ("array" in schema)
          return this.encode_array(value, schema);
        if ("set" in schema)
          return this.encode_set(value, schema);
        if ("map" in schema)
          return this.encode_map(value, schema);
        if ("struct" in schema)
          return this.encode_struct(value, schema);
      }
    };
    BorshSerializer2.prototype.encode_integer = function(value, schema) {
      var size = parseInt(schema.substring(1));
      if (size <= 32 || schema == "f64") {
        this.checkTypes && expect_type(value, "number", this.fieldPath);
        this.encoded.store_value(value, schema);
      } else {
        this.checkTypes && expect_bigint(value, this.fieldPath);
        this.encode_bigint(BigInt(value), size);
      }
    };
    BorshSerializer2.prototype.encode_bigint = function(value, size) {
      var buffer_len = size / 8;
      var buffer = new Uint8Array(buffer_len);
      for (var i = 0; i < buffer_len; i++) {
        buffer[i] = Number(value & BigInt(255));
        value = value >> BigInt(8);
      }
      this.encoded.store_bytes(new Uint8Array(buffer));
    };
    BorshSerializer2.prototype.encode_string = function(value) {
      this.checkTypes && expect_type(value, "string", this.fieldPath);
      var _value = value;
      var utf8Bytes = [];
      for (var i = 0; i < _value.length; i++) {
        var charCode = _value.charCodeAt(i);
        if (charCode < 128) {
          utf8Bytes.push(charCode);
        } else if (charCode < 2048) {
          utf8Bytes.push(192 | charCode >> 6, 128 | charCode & 63);
        } else if (charCode < 55296 || charCode >= 57344) {
          utf8Bytes.push(224 | charCode >> 12, 128 | charCode >> 6 & 63, 128 | charCode & 63);
        } else {
          i++;
          charCode = 65536 + ((charCode & 1023) << 10 | _value.charCodeAt(i) & 1023);
          utf8Bytes.push(240 | charCode >> 18, 128 | charCode >> 12 & 63, 128 | charCode >> 6 & 63, 128 | charCode & 63);
        }
      }
      this.encoded.store_value(utf8Bytes.length, "u32");
      this.encoded.store_bytes(new Uint8Array(utf8Bytes));
    };
    BorshSerializer2.prototype.encode_boolean = function(value) {
      this.checkTypes && expect_type(value, "boolean", this.fieldPath);
      this.encoded.store_value(value ? 1 : 0, "u8");
    };
    BorshSerializer2.prototype.encode_option = function(value, schema) {
      if (value === null || value === void 0) {
        this.encoded.store_value(0, "u8");
      } else {
        this.encoded.store_value(1, "u8");
        this.encode_value(value, schema.option);
      }
    };
    BorshSerializer2.prototype.encode_enum = function(value, schema) {
      this.checkTypes && expect_enum(value, this.fieldPath);
      var valueKey = Object.keys(value)[0];
      for (var i = 0; i < schema["enum"].length; i++) {
        var valueSchema = schema["enum"][i];
        if (valueKey === Object.keys(valueSchema.struct)[0]) {
          this.encoded.store_value(i, "u8");
          return this.encode_struct(value, valueSchema);
        }
      }
      throw new Error("Enum key (".concat(valueKey, ") not found in enum schema: ").concat(JSON.stringify(schema), " at ").concat(this.fieldPath.join(".")));
    };
    BorshSerializer2.prototype.encode_array = function(value, schema) {
      if (isArrayLike(value))
        return this.encode_arraylike(value, schema);
      if (value instanceof ArrayBuffer)
        return this.encode_buffer(value, schema);
      throw new Error("Expected Array-like not ".concat(typeof value, "(").concat(value, ") at ").concat(this.fieldPath.join(".")));
    };
    BorshSerializer2.prototype.encode_arraylike = function(value, schema) {
      if (schema.array.len) {
        expect_same_size(value.length, schema.array.len, this.fieldPath);
      } else {
        this.encoded.store_value(value.length, "u32");
      }
      for (var i = 0; i < value.length; i++) {
        this.encode_value(value[i], schema.array.type);
      }
    };
    BorshSerializer2.prototype.encode_buffer = function(value, schema) {
      if (schema.array.len) {
        expect_same_size(value.byteLength, schema.array.len, this.fieldPath);
      } else {
        this.encoded.store_value(value.byteLength, "u32");
      }
      this.encoded.store_bytes(new Uint8Array(value));
    };
    BorshSerializer2.prototype.encode_set = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      var isSet = value instanceof Set;
      var values = isSet ? Array.from(value.values()) : Object.values(value);
      this.encoded.store_value(values.length, "u32");
      for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value_1 = values_1[_i];
        this.encode_value(value_1, schema.set);
      }
    };
    BorshSerializer2.prototype.encode_map = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      var isMap = value instanceof Map;
      var keys = isMap ? Array.from(value.keys()) : Object.keys(value);
      this.encoded.store_value(keys.length, "u32");
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        this.encode_value(key, schema.map.key);
        this.encode_value(isMap ? value.get(key) : value[key], schema.map.value);
      }
    };
    BorshSerializer2.prototype.encode_struct = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      for (var _i = 0, _a = Object.keys(schema.struct); _i < _a.length; _i++) {
        var key = _a[_i];
        this.fieldPath.push(key);
        this.encode_value(value[key], schema.struct[key]);
        this.fieldPath.pop();
      }
    };
    return BorshSerializer2;
  }()
);

// ../../node_modules/borsh/lib/esm/deserialize.js
var BorshDeserializer = (
  /** @class */
  function() {
    function BorshDeserializer2(bufferArray) {
      this.buffer = new DecodeBuffer(bufferArray);
    }
    __name(BorshDeserializer2, "BorshDeserializer");
    BorshDeserializer2.prototype.decode = function(schema) {
      return this.decode_value(schema);
    };
    BorshDeserializer2.prototype.decode_value = function(schema) {
      if (typeof schema === "string") {
        if (integers.includes(schema))
          return this.decode_integer(schema);
        if (schema === "string")
          return this.decode_string();
        if (schema === "bool")
          return this.decode_boolean();
      }
      if (typeof schema === "object") {
        if ("option" in schema)
          return this.decode_option(schema);
        if ("enum" in schema)
          return this.decode_enum(schema);
        if ("array" in schema)
          return this.decode_array(schema);
        if ("set" in schema)
          return this.decode_set(schema);
        if ("map" in schema)
          return this.decode_map(schema);
        if ("struct" in schema)
          return this.decode_struct(schema);
      }
      throw new Error("Unsupported type: ".concat(schema));
    };
    BorshDeserializer2.prototype.decode_integer = function(schema) {
      var size = parseInt(schema.substring(1));
      if (size <= 32 || schema == "f64") {
        return this.buffer.consume_value(schema);
      }
      return this.decode_bigint(size, schema.startsWith("i"));
    };
    BorshDeserializer2.prototype.decode_bigint = function(size, signed) {
      if (signed === void 0) {
        signed = false;
      }
      var buffer_len = size / 8;
      var buffer = new Uint8Array(this.buffer.consume_bytes(buffer_len));
      var bits = buffer.reduceRight(function(r, x) {
        return r + x.toString(16).padStart(2, "0");
      }, "");
      if (signed && buffer[buffer_len - 1]) {
        return BigInt.asIntN(size, BigInt("0x".concat(bits)));
      }
      return BigInt("0x".concat(bits));
    };
    BorshDeserializer2.prototype.decode_string = function() {
      var len = this.decode_integer("u32");
      var buffer = new Uint8Array(this.buffer.consume_bytes(len));
      var codePoints = [];
      for (var i = 0; i < len; ++i) {
        var byte = buffer[i];
        if (byte < 128) {
          codePoints.push(byte);
        } else if (byte < 224) {
          codePoints.push((byte & 31) << 6 | buffer[++i] & 63);
        } else if (byte < 240) {
          codePoints.push((byte & 15) << 12 | (buffer[++i] & 63) << 6 | buffer[++i] & 63);
        } else {
          var codePoint = (byte & 7) << 18 | (buffer[++i] & 63) << 12 | (buffer[++i] & 63) << 6 | buffer[++i] & 63;
          codePoints.push(codePoint);
        }
      }
      return String.fromCodePoint.apply(String, codePoints);
    };
    BorshDeserializer2.prototype.decode_boolean = function() {
      return this.buffer.consume_value("u8") > 0;
    };
    BorshDeserializer2.prototype.decode_option = function(schema) {
      var option = this.buffer.consume_value("u8");
      if (option === 1) {
        return this.decode_value(schema.option);
      }
      if (option !== 0) {
        throw new Error("Invalid option ".concat(option));
      }
      return null;
    };
    BorshDeserializer2.prototype.decode_enum = function(schema) {
      var _a;
      var valueIndex = this.buffer.consume_value("u8");
      if (valueIndex > schema["enum"].length) {
        throw new Error("Enum option ".concat(valueIndex, " is not available"));
      }
      var struct = schema["enum"][valueIndex].struct;
      var key = Object.keys(struct)[0];
      return _a = {}, _a[key] = this.decode_value(struct[key]), _a;
    };
    BorshDeserializer2.prototype.decode_array = function(schema) {
      var result = [];
      var len = schema.array.len ? schema.array.len : this.decode_integer("u32");
      for (var i = 0; i < len; ++i) {
        result.push(this.decode_value(schema.array.type));
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_set = function(schema) {
      var len = this.decode_integer("u32");
      var result = /* @__PURE__ */ new Set();
      for (var i = 0; i < len; ++i) {
        result.add(this.decode_value(schema.set));
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_map = function(schema) {
      var len = this.decode_integer("u32");
      var result = /* @__PURE__ */ new Map();
      for (var i = 0; i < len; ++i) {
        var key = this.decode_value(schema.map.key);
        var value = this.decode_value(schema.map.value);
        result.set(key, value);
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_struct = function(schema) {
      var result = {};
      for (var key in schema.struct) {
        result[key] = this.decode_value(schema.struct[key]);
      }
      return result;
    };
    return BorshDeserializer2;
  }()
);

// ../../node_modules/borsh/lib/esm/index.js
function serialize(schema, value, validate) {
  if (validate === void 0) {
    validate = true;
  }
  if (validate)
    validate_schema(schema);
  var serializer = new BorshSerializer(validate);
  return serializer.encode(value, schema);
}
__name(serialize, "serialize");
function deserialize(schema, buffer, validate) {
  if (validate === void 0) {
    validate = true;
  }
  if (validate)
    validate_schema(schema);
  var deserializer = new BorshDeserializer(buffer);
  return deserializer.decode(schema);
}
__name(deserialize, "deserialize");

// ../borsh-schema/src/index.ts
var src_exports = {};
__export(src_exports, {
  getBorshSchema: () => getBorshSchema,
  nearChainSchema: () => nearChainSchema
});
var nearChainSchema = new class BorshSchema {
  static {
    __name(this, "BorshSchema");
  }
  Ed25519Signature = {
    struct: {
      data: { array: { type: "u8", len: 64 } }
    }
  };
  Secp256k1Signature = {
    struct: {
      data: { array: { type: "u8", len: 65 } }
    }
  };
  Signature = {
    enum: [
      { struct: { ed25519Signature: this.Ed25519Signature } },
      { struct: { secp256k1Signature: this.Secp256k1Signature } }
    ]
  };
  Ed25519Data = {
    struct: {
      data: { array: { type: "u8", len: 32 } }
    }
  };
  Secp256k1Data = {
    struct: {
      data: { array: { type: "u8", len: 64 } }
    }
  };
  PublicKey = {
    enum: [
      { struct: { ed25519Key: this.Ed25519Data } },
      { struct: { secp256k1Key: this.Secp256k1Data } }
    ]
  };
  FunctionCallPermission = {
    struct: {
      allowance: { option: "u128" },
      receiverId: "string",
      methodNames: { array: { type: "string" } }
    }
  };
  FullAccessPermission = {
    struct: {}
  };
  AccessKeyPermission = {
    enum: [
      { struct: { functionCall: this.FunctionCallPermission } },
      { struct: { fullAccess: this.FullAccessPermission } }
    ]
  };
  AccessKey = {
    struct: {
      nonce: "u64",
      permission: this.AccessKeyPermission
    }
  };
  CreateAccount = {
    struct: {}
  };
  DeployContract = {
    struct: {
      code: { array: { type: "u8" } }
    }
  };
  FunctionCall = {
    struct: {
      methodName: "string",
      args: { array: { type: "u8" } },
      gas: "u64",
      deposit: "u128"
    }
  };
  Transfer = {
    struct: {
      deposit: "u128"
    }
  };
  Stake = {
    struct: {
      stake: "u128",
      publicKey: this.PublicKey
    }
  };
  AddKey = {
    struct: {
      publicKey: this.PublicKey,
      accessKey: this.AccessKey
    }
  };
  DeleteKey = {
    struct: {
      publicKey: this.PublicKey
    }
  };
  DeleteAccount = {
    struct: {
      beneficiaryId: "string"
    }
  };
  ClassicAction = {
    enum: [
      { struct: { createAccount: this.CreateAccount } },
      { struct: { deployContract: this.DeployContract } },
      { struct: { functionCall: this.FunctionCall } },
      { struct: { transfer: this.Transfer } },
      { struct: { stake: this.Stake } },
      { struct: { addKey: this.AddKey } },
      { struct: { deleteKey: this.DeleteKey } },
      { struct: { deleteAccount: this.DeleteAccount } }
    ]
  };
  DelegateAction = {
    struct: {
      senderId: "string",
      receiverId: "string",
      actions: { array: { type: this.ClassicAction } },
      nonce: "u64",
      maxBlockHeight: "u64",
      publicKey: this.PublicKey
    }
  };
  SignedDelegate = {
    struct: {
      delegateAction: this.DelegateAction,
      signature: this.Signature
    }
  };
  Action = {
    enum: [
      { struct: { createAccount: this.CreateAccount } },
      { struct: { deployContract: this.DeployContract } },
      { struct: { functionCall: this.FunctionCall } },
      { struct: { transfer: this.Transfer } },
      { struct: { stake: this.Stake } },
      { struct: { addKey: this.AddKey } },
      { struct: { deleteKey: this.DeleteKey } },
      { struct: { deleteAccount: this.DeleteAccount } },
      { struct: { signedDelegate: this.SignedDelegate } }
    ]
  };
  Transaction = {
    struct: {
      signerId: "string",
      publicKey: this.PublicKey,
      nonce: "u64",
      receiverId: "string",
      blockHash: { array: { type: "u8", len: 32 } },
      actions: { array: { type: this.Action } }
    }
  };
  SignedTransaction = {
    struct: {
      transaction: this.Transaction,
      signature: this.Signature
    }
  };
}();
var getBorshSchema = /* @__PURE__ */ __name(() => nearChainSchema, "getBorshSchema");

// ../utils/src/transaction.ts
var txToJson = /* @__PURE__ */ __name((tx) => {
  return JSON.parse(JSON.stringify(
    tx,
    (key, value) => typeof value === "bigint" ? value.toString() : value
  ));
}, "txToJson");
var txToJsonStringified = /* @__PURE__ */ __name((tx) => {
  return JSON.stringify(txToJson(tx));
}, "txToJsonStringified");
function mapTransaction(jsonTransaction) {
  return {
    signerId: jsonTransaction.signerId,
    publicKey: {
      ed25519Key: {
        data: keyFromString(jsonTransaction.publicKey)
      }
    },
    nonce: BigInt(jsonTransaction.nonce),
    receiverId: jsonTransaction.receiverId,
    blockHash: base58_to_binary_default(jsonTransaction.blockHash),
    actions: jsonTransaction.actions.map(mapAction)
  };
}
__name(mapTransaction, "mapTransaction");
function serializeTransaction(jsonTransaction) {
  console.log("fastnear: serializing transaction");
  const transaction = mapTransaction(jsonTransaction);
  console.log("fastnear: mapped transaction for borsh:", transaction);
  return serialize(SCHEMA.Transaction, transaction);
}
__name(serializeTransaction, "serializeTransaction");
function serializeSignedTransaction(jsonTransaction, signature) {
  console.log("fastnear: Serializing Signed Transaction", jsonTransaction);
  console.log("fastnear: signature", signature);
  console.log("fastnear: signature length", base58_to_binary_default(signature).length);
  const mappedSignedTx = mapTransaction(jsonTransaction);
  console.log("fastnear: mapped (for borsh schema) signed transaction", mappedSignedTx);
  const plainSignedTransaction = {
    transaction: mappedSignedTx,
    signature: {
      ed25519Signature: {
        data: base58_to_binary_default(signature)
      }
    }
  };
  const borshSignedTx = serialize(SCHEMA.SignedTransaction, plainSignedTransaction, true);
  console.log("fastnear: borsh-serialized signed transaction:", borshSignedTx);
  return borshSignedTx;
}
__name(serializeSignedTransaction, "serializeSignedTransaction");
function mapAction(action) {
  switch (action.type) {
    case "CreateAccount": {
      return {
        createAccount: {}
      };
    }
    case "DeployContract": {
      const deployContractAction = action;
      return {
        deployContract: {
          code: deployContractAction.params.code
        }
      };
    }
    case "FunctionCall": {
      const functionCallAction = action;
      return {
        functionCall: {
          methodName: functionCallAction.params.methodName,
          args: new TextEncoder().encode(JSON.stringify(functionCallAction.params.args)),
          gas: BigInt(functionCallAction.params.gas ?? "300000000000000"),
          deposit: BigInt(functionCallAction.params.deposit ?? "0")
        }
      };
    }
    case "Transfer": {
      const transferAction = action;
      return {
        transfer: {
          deposit: BigInt(transferAction.params.deposit)
        }
      };
    }
    case "Stake": {
      const stakeAction = action;
      return {
        stake: {
          stake: BigInt(stakeAction.params.stake),
          publicKey: {
            ed25519Key: {
              data: keyFromString(stakeAction.params.publicKey)
            }
          }
        }
      };
    }
    case "AddKey": {
      const addKeyAction = action;
      const permission = addKeyAction.params.accessKey.permission;
      let mappedPermission;
      if (permission === "FullAccess") {
        mappedPermission = { fullAccess: {} };
      } else {
        mappedPermission = {
          functionCall: {
            allowance: permission.allowance ? BigInt(permission.allowance) : null,
            receiverId: permission.receiverId,
            methodNames: permission.methodNames || []
          }
        };
      }
      return {
        addKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(addKeyAction.params.publicKey)
            }
          },
          accessKey: {
            nonce: BigInt(addKeyAction.params.accessKey.nonce || 0),
            permission: mappedPermission
          }
        }
      };
    }
    case "DeleteKey": {
      const deleteKeyAction = action;
      return {
        deleteKey: {
          publicKey: {
            ed25519Key: {
              data: keyFromString(deleteKeyAction.params.publicKey)
            }
          }
        }
      };
    }
    case "DeleteAccount": {
      const deleteAccountAction = action;
      return {
        deleteAccount: {
          beneficiaryId: deleteAccountAction.params.beneficiaryId
        }
      };
    }
    case "SignedDelegate": {
      const signedDelegateAction = action;
      return {
        signedDelegate: {
          delegateAction: mapAction(signedDelegateAction.params.delegateAction),
          // Recursive call
          signature: {
            ed25519Signature: {
              data: base58_to_binary_default(signedDelegateAction.params.signature)
            }
          }
        }
      };
    }
    default: {
      const _exhaustiveCheck = action;
      throw new Error(`Unhandled action type: ${_exhaustiveCheck.type}`);
    }
  }
}
__name(mapAction, "mapAction");
var SCHEMA = getBorshSchema();

// ../utils/src/index.ts
var exp = {
  borsh: {
    serialize,
    deserialize
  },
  borshSchema: src_exports
};

// src/state.ts
var state_exports = {};
__export(state_exports, {
  DEFAULT_NETWORK_ID: () => DEFAULT_NETWORK_ID,
  NETWORKS: () => NETWORKS,
  WIDGET_URL: () => WIDGET_URL,
  _adapter: () => _adapter,
  _config: () => _config,
  _state: () => _state,
  _txHistory: () => _txHistory,
  _unbroadcastedEvents: () => _unbroadcastedEvents,
  events: () => events,
  getConfig: () => getConfig,
  getTxHistory: () => getTxHistory,
  getWalletAdapterState: () => getWalletAdapterState,
  onAdapterStateUpdate: () => onAdapterStateUpdate,
  resetTxHistory: () => resetTxHistory,
  setConfig: () => setConfig,
  update: () => update,
  updateTxHistory: () => updateTxHistory
});

// src/intear.ts
var DEFAULT_WALLET_DOMAIN = "https://wallet.intear.tech";
var DEFAULT_LOGOUT_BRIDGE_SERVICE = "https://logout-bridge-service.intear.tech";
var STORAGE_KEY = "_intear_wallet_connected_account";
var POPUP_FEATURES = "width=400,height=700";
var hasCheckedLogout = false;
var checkingAccountPromise = null;
var sessionVerificationInProgress = false;
var IntearAdapterError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "IntearAdapterError";
    if (cause) {
      this.stack += `
Caused by: ${cause instanceof Error ? cause.stack : String(cause)}`;
    }
  }
  static {
    __name(this, "IntearAdapterError");
  }
};
var LogoutWebSocket = class _LogoutWebSocket {
  static {
    __name(this, "LogoutWebSocket");
  }
  static instance = null;
  ws = null;
  network;
  accountId;
  appPrivateKey;
  userLogoutPublicKey;
  logoutBridgeServiceUrl;
  intentionallyClosed = false;
  reconnectAttempts = 0;
  maxReconnectAttempts = 3;
  logger;
  constructor(network, accountId2, appPrivateKey, userLogoutPublicKey, logoutBridgeServiceUrl, logger) {
    this.network = network;
    this.accountId = accountId2;
    this.appPrivateKey = appPrivateKey;
    this.userLogoutPublicKey = userLogoutPublicKey;
    this.logoutBridgeServiceUrl = logoutBridgeServiceUrl;
    this.logger = logger;
    this.connect();
  }
  async connect() {
    try {
      const wsUrl = this.logoutBridgeServiceUrl.replace("https://", "wss://").replace("http://", "ws://");
      this.ws = new WebSocket(`${wsUrl}/api/subscribe`);
      this.ws.onopen = async () => {
        if (!this.ws) {
          return;
        }
        const nonce = Date.now();
        const messageText = `subscribe|${nonce}`;
        const messageBytes = new TextEncoder().encode(messageText);
        const appPublicKeyString = publicKeyFromPrivate(this.appPrivateKey);
        const signatureBase58 = signHash(messageBytes, this.appPrivateKey, { returnBase58: true });
        const signatureString = `ed25519:${signatureBase58}`;
        const authMessage = {
          Auth: {
            network: this.network,
            account_id: this.accountId,
            app_public_key: appPublicKeyString,
            nonce,
            signature: signatureString
          }
        };
        this.ws.send(JSON.stringify(authMessage));
      };
      this.ws.onmessage = async (event2) => {
        const message = JSON.parse(event2.data);
        if ("Success" in message) {
          this.logger.log("LogoutWebSocket:", message.Success.message);
          this.reconnectAttempts = 0;
        } else if ("Error" in message) {
          this.logger.error("LogoutWebSocket error:", message.Error.message);
          this.ws?.close();
        } else if ("LoggedOut" in message) {
          const { logout_info: logoutInfo } = message.LoggedOut;
          this.logger.log("LogoutWebSocket: Received logout notification:", logoutInfo);
          if (logoutInfo.nonce > Date.now() || logoutInfo.nonce < Date.now() - 1e3 * 60 * 5) {
            this.logger.error("LogoutWebSocket: Invalid logout nonce:", logoutInfo.nonce);
            return;
          }
          const appPublicKeyString = publicKeyFromPrivate(this.appPrivateKey);
          const verifyMessageText = `logout|${logoutInfo.nonce}|${this.accountId}|${appPublicKeyString}`;
          const verifyMessageBytes = new TextEncoder().encode(verifyMessageText);
          const sigParts = logoutInfo.signature.split(":");
          if (sigParts.length !== 2 || sigParts[0] !== "ed25519" && sigParts[0] !== "secp256k1") {
            this.logger.error("LogoutWebSocket: Invalid signature format:", logoutInfo.signature);
            return;
          }
          const sigData = sigParts[1];
          const signatureBytes = base58_to_binary_default(sigData);
          let effectiveVerifyKey;
          if (logoutInfo.caused_by === "User") {
            effectiveVerifyKey = this.userLogoutPublicKey;
          } else if (logoutInfo.caused_by === "App") {
            effectiveVerifyKey = appPublicKeyString;
          } else {
            this.logger.error("LogoutWebSocket: Unknown logout cause:", logoutInfo.caused_by);
            return;
          }
          let publicKeyBytes;
          const base58PublicKey = effectiveVerifyKey.substring("ed25519:".length);
          publicKeyBytes = base58_to_binary_default(base58PublicKey);
          const isValid = ed25519.verify(signatureBytes, verifyMessageBytes, publicKeyBytes);
          if (!isValid) {
            this.logger.error("LogoutWebSocket: Invalid logout signature");
            return;
          }
          this.logger.log(
            "LogoutWebSocket: Valid logout message received. Calling signOut and reloading."
          );
          signOut();
          this.intentionallyClosed = true;
          this.close();
          window.location.reload();
        }
      };
      this.ws.onclose = () => {
        this.logger.log("LogoutWebSocket: Connection closed.");
        if (this.intentionallyClosed) {
          if (_LogoutWebSocket.instance === this) {
            _LogoutWebSocket.instance = null;
          }
        } else if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.logger.log(`LogoutWebSocket: Attempting to reconnect in 500ms... (Attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), 500);
        } else {
          this.logger.warn(`LogoutWebSocket: Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
          if (_LogoutWebSocket.instance === this) {
            _LogoutWebSocket.instance = null;
          }
        }
      };
      this.ws.onerror = (error) => {
        this.logger.warn("LogoutWebSocket: Error:", error);
        if (!this.intentionallyClosed) {
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.logger.log(`LogoutWebSocket: Attempting to reconnect in 500ms... (Attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), 500);
          } else {
            this.logger.warn(`LogoutWebSocket: Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
            if (_LogoutWebSocket.instance === this) {
              _LogoutWebSocket.instance = null;
            }
          }
        } else {
          _LogoutWebSocket.instance = null;
        }
      };
    } catch (error) {
      this.logger.warn("LogoutWebSocket: Error creating WebSocket connection:", error);
    }
  }
  static initialize(network, accountId2, appPrivateKey, userLogoutPublicKey, logoutBridgeServiceUrl, logger) {
    try {
      if (_LogoutWebSocket.instance) {
        return _LogoutWebSocket.instance;
      }
      _LogoutWebSocket.instance = new _LogoutWebSocket(
        network,
        accountId2,
        appPrivateKey,
        userLogoutPublicKey,
        logoutBridgeServiceUrl,
        logger
      );
      return _LogoutWebSocket.instance;
    } catch (error) {
      logger.warn("LogoutWebSocket: Failed to initialize:", error);
      return null;
    }
  }
  static getInstance() {
    return _LogoutWebSocket.instance;
  }
  close() {
    if (this.ws) {
      this.intentionallyClosed = true;
      this.ws.close();
    }
    _LogoutWebSocket.instance = null;
  }
};
async function generateAuthSignature(privateKey, data, nonce) {
  const messageToSign = nonce.toString() + "|" + data;
  const messageBytes = new TextEncoder().encode(messageToSign);
  const hashBytes = sha256(messageBytes);
  const signatureBase58 = signHash(hashBytes, privateKey, { returnBase58: true });
  return `ed25519:${signatureBase58}`;
}
__name(generateAuthSignature, "generateAuthSignature");
async function assertLoggedIn() {
  if (typeof window === "undefined") {
    throw new IntearAdapterError("Cannot access localStorage in this environment.");
  }
  const savedDataStr = await window.localStorage.getItem(STORAGE_KEY);
  if (!savedDataStr) {
    throw new IntearAdapterError("Not signed in (no data found)");
  }
  try {
    const savedData = JSON.parse(savedDataStr);
    if (!savedData || !savedData.accounts || savedData.accounts.length === 0 || !savedData.key) {
      throw new Error("Invalid saved data structure");
    }
    return savedData;
  } catch (e) {
    console.error("Error parsing saved login data, clearing storage.", e);
    await window.localStorage.removeItem(STORAGE_KEY);
    throw new IntearAdapterError("Failed to parse login data, please sign in again.", e);
  }
}
__name(assertLoggedIn, "assertLoggedIn");
async function getSavedData() {
  try {
    return await assertLoggedIn();
  } catch {
    return null;
  }
}
__name(getSavedData, "getSavedData");
function verifyLogoutSignature(logoutInfo, accountId2, appPublicKeyString, userLogoutPublicKey) {
  try {
    const logoutMessageToVerify = `logout|${logoutInfo.nonce}|${accountId2}|${appPublicKeyString}`;
    const sigParts = logoutInfo.signature.split(":");
    if (sigParts.length !== 2 || sigParts[0] !== "ed25519" && sigParts[0] !== "secp256k1") {
      console.error("WalletAdapter: Invalid signature format:", logoutInfo.signature);
      return false;
    }
    const sigData = sigParts[1];
    const signatureToVerify = base58_to_binary_default(sigData);
    let verifyKey;
    if (logoutInfo.caused_by === "User") {
      verifyKey = userLogoutPublicKey;
    } else if (logoutInfo.caused_by === "App") {
      verifyKey = appPublicKeyString;
    } else {
      console.error("WalletAdapter: Unknown logout cause:", logoutInfo.caused_by);
      return false;
    }
    const base58PublicKey = verifyKey.substring("ed25519:".length);
    const publicKeyBytes = base58_to_binary_default(base58PublicKey);
    return ed25519.verify(
      signatureToVerify,
      new TextEncoder().encode(logoutMessageToVerify),
      publicKeyBytes
    );
  } catch (error) {
    console.error("WalletAdapter: Error verifying logout signature:", error);
    return false;
  }
}
__name(verifyLogoutSignature, "verifyLogoutSignature");
async function verifySessionStatus(savedData, logoutBridgeService, onStateUpdate) {
  try {
    const account = savedData.accounts[0];
    const networkId = savedData.networkId;
    const appPrivateKey = savedData.key;
    const appPublicKeyString = publicKeyFromPrivate(appPrivateKey);
    LogoutWebSocket.initialize(
      networkId,
      account.accountId,
      appPrivateKey,
      savedData.logoutKey,
      logoutBridgeService,
      console
    );
    const nonce = Date.now();
    const checkMessage = `check|${nonce}`;
    const messageBytes = new TextEncoder().encode(checkMessage);
    const signatureBase58 = signHash(messageBytes, appPrivateKey, { returnBase58: true });
    const signatureString = `ed25519:${signatureBase58}`;
    const response = await fetch(
      `${logoutBridgeService}/api/check_logout/${networkId}/${account.accountId}/${appPublicKeyString}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ nonce, signature: signatureString })
      }
    );
    if (!response.ok) {
      console.warn("WalletAdapter: Failed to check logout status:", await response.text());
      return { isActive: true, accounts: savedData.accounts };
    }
    const status = await response.json();
    console.debug("WalletAdapter: Logout check response:", status);
    if (status === "Active") {
      return { isActive: true, accounts: savedData.accounts };
    } else {
      const logoutInfo = status.LoggedOut;
      console.debug("WalletAdapter: User was logged out:", logoutInfo);
      const isValid = verifyLogoutSignature(
        logoutInfo,
        account.accountId,
        appPublicKeyString,
        savedData.logoutKey
      );
      if (!isValid) {
        console.error("WalletAdapter: Invalid logout signature");
        return { isActive: true, accounts: savedData.accounts };
      }
      console.debug("WalletAdapter: Valid remote logout. Clearing local session.");
      await window.localStorage.removeItem(STORAGE_KEY);
      LogoutWebSocket.getInstance()?.close();
      onStateUpdate?.({ accountId: null, networkId: null, publicKey: null });
      return { isActive: false, accounts: [] };
    }
  } catch (error) {
    console.error("WalletAdapter: Error verifying session status:", error);
    return { isActive: true, accounts: savedData.accounts };
  }
}
__name(verifySessionStatus, "verifySessionStatus");
var WalletAdapter = class {
  static {
    __name(this, "WalletAdapter");
  }
  #walletUrl;
  #logoutBridgeService;
  #onStateUpdate;
  constructor({
    walletUrl = DEFAULT_WALLET_DOMAIN,
    targetOrigin,
    onStateUpdate,
    lastState,
    callbackUrl,
    logoutBridgeService = DEFAULT_LOGOUT_BRIDGE_SERVICE
  }) {
    this.#walletUrl = walletUrl;
    this.#logoutBridgeService = logoutBridgeService;
    this.#onStateUpdate = onStateUpdate;
    console.debug("Intear Popup WalletAdapter initialized. URL:", this.#walletUrl);
    if (typeof window !== "undefined") {
      this.initializeSession().catch((err) => {
        console.error("Error during initial session initialization:", err);
      });
    }
  }
  async signIn({ contractId, methodNames, networkId }) {
    console.debug("WalletAdapter: signIn", { contractId, methodNames, networkId });
    const privateKey = privateKeyFromRandom();
    return new Promise((resolve, reject) => {
      const popup = window.open(`${this.#walletUrl}/connect`, "_blank", POPUP_FEATURES);
      if (!popup) {
        return reject(new IntearAdapterError("Popup was blocked"));
      }
      let done = false;
      const listener = /* @__PURE__ */ __name(async (event2) => {
        if (!event2.data || !event2.data.type) {
          return;
        }
        console.debug("Message from connect popup", event2.data);
        switch (event2.data.type) {
          case "ready": {
            const origin = window.selector.location.startsWith("file://") ? window.selector.location : window.selector.location.split("/").slice(0, 3).join("/");
            const message = JSON.stringify({ origin });
            const nonce = Date.now();
            const signatureString = await generateAuthSignature(privateKey, message, nonce);
            const publicKey2 = publicKeyFromPrivate(privateKey);
            popup.postMessage(
              {
                type: "signIn",
                data: {
                  contractId,
                  methodNames,
                  publicKey: publicKey2,
                  networkId,
                  nonce,
                  message,
                  signature: signatureString
                }
              },
              this.#walletUrl
            );
            break;
          }
          case "connected": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            const accounts = event2.data.accounts;
            if (!accounts || accounts.length === 0) {
              return reject(new IntearAdapterError("No accounts returned from wallet"));
            }
            const functionCallKeyAdded = event2.data.functionCallKeyAdded;
            const logoutKey = event2.data.logoutKey;
            const dataToSave = {
              accounts,
              key: privateKey,
              contractId: functionCallKeyAdded && contractId ? contractId : "",
              methodNames: functionCallKeyAdded ? methodNames ?? [] : [],
              logoutKey,
              networkId
            };
            await window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            const newState = {
              accountId: accounts[0].accountId,
              networkId,
              privateKey: dataToSave.key,
              publicKey: publicKeyFromPrivate(dataToSave.key)
            };
            this.#onStateUpdate?.(newState);
            LogoutWebSocket.getInstance()?.close();
            LogoutWebSocket.initialize(
              dataToSave.networkId,
              dataToSave.accounts[0].accountId,
              dataToSave.key,
              // App's LAK private key (this is the appPrivateKey for WS)
              dataToSave.logoutKey,
              // User's main logout public key from wallet
              this.#logoutBridgeService,
              console
            );
            resolve({
              accountId: accounts[0].accountId,
              accounts,
              privateKey: dataToSave.key,
              publicKey: publicKeyFromPrivate(dataToSave.key)
            });
            break;
          }
          case "error": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            reject(new IntearAdapterError(event2.data.message || "Unknown error from wallet popup"));
            break;
          }
        }
      }, "listener");
      window.addEventListener("message", listener);
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener("message", listener);
          clearInterval(checkPopupClosed);
          if (!done) {
            reject(new IntearAdapterError("Sign-in canceled - popup closed by user"));
          }
        }
      }, 100);
    });
  }
  async signOut() {
    console.debug("WalletAdapter: signOut");
    const savedData = await getSavedData();
    LogoutWebSocket.getInstance()?.close();
    if (savedData) {
      try {
        const accountId2 = savedData.accounts[0].accountId;
        const appPrivateKey = savedData.key;
        const appPublicKeyString = publicKeyFromPrivate(appPrivateKey);
        const networkId = savedData.networkId;
        const nonce = Date.now();
        const messageText = `logout|${nonce}|${accountId2}|${appPublicKeyString}`;
        const messageBytes = new TextEncoder().encode(messageText);
        const hashBytes = sha256(messageBytes);
        const signatureBase58 = signHash(hashBytes, appPrivateKey, { returnBase58: true });
        const signatureString = `ed25519:${signatureBase58}`;
        const response = await fetch(`${this.#logoutBridgeService}/api/logout_app/${networkId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            account_id: accountId2,
            app_public_key: appPublicKeyString,
            nonce,
            signature: signatureString
          })
        });
        if (!response.ok) {
          console.error("WalletAdapter: Failed to notify bridge service of logout:", await response.text());
        } else {
          console.debug("WalletAdapter: Successfully notified bridge service of logout");
        }
      } catch (e) {
        console.error("WalletAdapter: Error during bridge service logout notification:", e);
      }
    }
    await window.localStorage.removeItem(STORAGE_KEY);
    this.#onStateUpdate?.({ accountId: null, networkId: null, publicKey: null });
  }
  // Initialize the session by checking if the user is logged in and setting up WebSocket connection
  async initializeSession() {
    if (sessionVerificationInProgress) {
      return;
    }
    sessionVerificationInProgress = true;
    try {
      const savedData = await getSavedData();
      if (!savedData) {
        LogoutWebSocket.getInstance()?.close();
        return;
      }
      await verifySessionStatus(savedData, this.#logoutBridgeService, this.#onStateUpdate);
    } catch (e) {
      console.error("WalletAdapter: Unexpected error during session initialization:", e);
      LogoutWebSocket.getInstance()?.close();
    } finally {
      sessionVerificationInProgress = false;
    }
  }
  async getState() {
    const savedData = await getSavedData();
    if (savedData) {
      return {
        accountId: savedData.accounts[0].accountId,
        networkId: savedData.networkId,
        publicKey: publicKeyFromPrivate(savedData.key)
      };
    }
    return { accountId: null, networkId: null, publicKey: null };
  }
  setState(state2) {
    this.#onStateUpdate?.(state2);
  }
  async getAccounts() {
    console.debug("WalletAdapter: getAccounts");
    const savedData = await getSavedData();
    if (!savedData) {
      return [];
    }
    if (!hasCheckedLogout) {
      if (checkingAccountPromise) {
        return await checkingAccountPromise;
      }
      checkingAccountPromise = new Promise(async (resolve) => {
        try {
          const result = await verifySessionStatus(savedData, this.#logoutBridgeService, this.#onStateUpdate);
          resolve(result.accounts);
        } catch (error) {
          console.error("WalletAdapter: Error in getAccounts:", error);
          resolve(savedData.accounts);
        }
      }).finally(() => {
        checkingAccountPromise = null;
        hasCheckedLogout = true;
      });
      return await checkingAccountPromise;
    }
    console.debug("WalletAdapter: Accounts:", savedData.accounts);
    return savedData.accounts;
  }
  async sendTransactions({ transactions }) {
    console.debug("WalletAdapter: sendTransactions", { transactions });
    const savedData = await assertLoggedIn();
    const privateKey = savedData.key;
    const accountId2 = savedData.accounts[0].accountId;
    return new Promise(async (resolve, reject) => {
      const popup = window.open(`${this.#walletUrl}/send-transactions`, "_blank", POPUP_FEATURES);
      if (!popup) {
        return reject(new IntearAdapterError("Popup was blocked"));
      }
      let done = false;
      const listener = /* @__PURE__ */ __name(async (event2) => {
        if (!event2.data || !event2.data.type) return;
        console.debug("Message from send-transactions popup", event2.data);
        switch (event2.data.type) {
          case "ready": {
            const transactionsString = JSON.stringify(transactions);
            const nonce = Date.now();
            const signatureString = await generateAuthSignature(privateKey, transactionsString, nonce);
            const publicKey2 = publicKeyFromPrivate(privateKey);
            popup.postMessage(
              {
                type: "signAndSendTransactions",
                data: {
                  transactions: transactionsString,
                  accountId: accountId2,
                  publicKey: publicKey2,
                  nonce,
                  signature: signatureString
                }
              },
              this.#walletUrl
            );
            break;
          }
          case "sent": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            resolve({ outcomes: event2.data.outcomes });
            break;
          }
          case "error": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            reject(new IntearAdapterError(event2.data.message || "Unknown error from send-transactions popup"));
            break;
          }
        }
      }, "listener");
      window.addEventListener("message", listener);
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener("message", listener);
          clearInterval(checkPopupClosed);
          if (!done) {
            reject(new IntearAdapterError("Transaction canceled - popup closed by user"));
          }
        }
      }, 100);
    });
  }
  async signMessage({ message, nonce, recipient, callbackUrl, state: state2 }) {
    console.debug("WalletAdapter: signMessage", { message, nonce, recipient });
    const savedData = await assertLoggedIn();
    const privateKey = savedData.key;
    const accountId2 = savedData.accounts[0].accountId;
    return new Promise(async (resolve, reject) => {
      const popup = window.open(`${this.#walletUrl}/sign-message`, "_blank", POPUP_FEATURES);
      if (!popup) {
        return reject(new IntearAdapterError("Popup was blocked"));
      }
      let done = false;
      const listener = /* @__PURE__ */ __name(async (event2) => {
        if (!event2.data || !event2.data.type) return;
        console.debug("Message from sign-message popup", event2.data);
        switch (event2.data.type) {
          case "ready": {
            const signMessageString = JSON.stringify({
              message,
              recipient,
              nonce: Array.from(nonce),
              callbackUrl,
              state: state2
            });
            const authNonce = Date.now();
            const signatureString = await generateAuthSignature(privateKey, signMessageString, authNonce);
            const publicKey2 = publicKeyFromPrivate(privateKey);
            popup.postMessage(
              {
                type: "signMessage",
                data: {
                  message: signMessageString,
                  accountId: accountId2,
                  publicKey: publicKey2,
                  nonce: authNonce,
                  signature: signatureString
                }
              },
              this.#walletUrl
            );
            break;
          }
          case "signed": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            const signatureData = event2.data.signature;
            try {
              resolve({
                accountId: signatureData.accountId,
                publicKey: signatureData.publicKey,
                signature: signatureData.signature
              });
            } catch (e) {
              reject(new IntearAdapterError("Failed to process signature from wallet", e));
            }
            break;
          }
          case "error": {
            done = true;
            popup.close();
            window.removeEventListener("message", listener);
            reject(new IntearAdapterError(event2.data.message || "Unknown error from sign-message popup"));
            break;
          }
        }
      }, "listener");
      window.addEventListener("message", listener);
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener("message", listener);
          clearInterval(checkPopupClosed);
          if (!done) {
            reject(new IntearAdapterError("Message signing canceled - popup closed by user"));
          }
        }
      }, 100);
    });
  }
  destroy() {
    console.debug("Intear Popup WalletAdapter destroyed.");
  }
};

// src/state.ts
var WIDGET_URL = "https://wallet.intear.tech";
var DEFAULT_NETWORK_ID = "mainnet";
var NETWORKS = {
  testnet: {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.fastnear.com/"
  },
  mainnet: {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.fastnear.com/"
  }
};
var _config = await lsGet("config") || {
  ...NETWORKS[DEFAULT_NETWORK_ID]
};
var _state = await lsGet("state") || {};
var onAdapterStateUpdate = /* @__PURE__ */ __name((state2) => {
  console.log("Adapter state update:", state2);
  const { accountId: accountId2, lastWalletId, privateKey } = state2;
  update({
    accountId: accountId2 || void 0,
    lastWalletId: lastWalletId || void 0,
    ...privateKey ? { privateKey } : {}
  });
}, "onAdapterStateUpdate");
var getWalletAdapterState = /* @__PURE__ */ __name(() => {
  return {
    publicKey: _state.publicKey,
    accountId: _state.accountId,
    lastWalletId: _state.lastWalletId,
    networkId: _config.networkId
  };
}, "getWalletAdapterState");
var _adapter = new WalletAdapter({
  onStateUpdate: onAdapterStateUpdate,
  walletUrl: WIDGET_URL
});
try {
  _state.publicKey = _state.privateKey ? publicKeyFromPrivate(_state.privateKey) : null;
} catch (e) {
  console.error("Error parsing private key:", e);
  _state.privateKey = null;
  await lsSet("nonce", null);
}
var _txHistory = await lsGet("txHistory") || {};
var _unbroadcastedEvents = {
  account: [],
  tx: []
};
var events = {
  _eventListeners: {
    account: /* @__PURE__ */ new Set(),
    tx: /* @__PURE__ */ new Set()
  },
  notifyAccountListeners: /* @__PURE__ */ __name((accountId2) => {
    if (events._eventListeners.account.size === 0) {
      _unbroadcastedEvents.account.push(accountId2);
      return;
    }
    events._eventListeners.account.forEach((callback) => {
      try {
        callback(accountId2);
      } catch (e) {
        console.error(e);
      }
    });
  }, "notifyAccountListeners"),
  notifyTxListeners: /* @__PURE__ */ __name((tx) => {
    if (events._eventListeners.tx.size === 0) {
      _unbroadcastedEvents.tx.push(tx);
      return;
    }
    events._eventListeners.tx.forEach((callback) => {
      try {
        callback(tx);
      } catch (e) {
        console.error(e);
      }
    });
  }, "notifyTxListeners"),
  onAccount: /* @__PURE__ */ __name((callback) => {
    events._eventListeners.account.add(callback);
    if (_unbroadcastedEvents.account.length > 0) {
      const accountEvent = _unbroadcastedEvents.account;
      _unbroadcastedEvents.account = [];
      accountEvent.forEach(events.notifyAccountListeners);
    }
    return callback;
  }, "onAccount"),
  onTx: /* @__PURE__ */ __name((callback) => {
    events._eventListeners.tx.add(callback);
    if (_unbroadcastedEvents.tx.length > 0) {
      const txEvent = _unbroadcastedEvents.tx;
      _unbroadcastedEvents.tx = [];
      txEvent.forEach(events.notifyTxListeners);
    }
    return callback;
  }, "onTx"),
  offAccount: /* @__PURE__ */ __name((callback) => {
    events._eventListeners.account.delete(callback);
  }, "offAccount"),
  offTx: /* @__PURE__ */ __name((callback) => {
    events._eventListeners.tx.delete(callback);
  }, "offTx")
};
var update = /* @__PURE__ */ __name((newState) => {
  const oldState = _state;
  _state = { ..._state, ...newState };
  lsSet("state", {
    accountId: _state.accountId,
    privateKey: _state.privateKey,
    lastWalletId: _state.lastWalletId,
    accessKeyContractId: _state.accessKeyContractId
  });
  if (newState.hasOwnProperty("privateKey") && newState.privateKey !== oldState.privateKey) {
    _state.publicKey = newState.privateKey ? publicKeyFromPrivate(newState.privateKey) : null;
    lsSet("nonce", null);
  }
  if (newState.accountId !== oldState.accountId) {
    events.notifyAccountListeners(newState.accountId);
  }
  if (newState.hasOwnProperty("lastWalletId") && newState.lastWalletId !== oldState.lastWalletId || newState.hasOwnProperty("accountId") && newState.accountId !== oldState.accountId || newState.hasOwnProperty("privateKey") && newState.privateKey !== oldState.privateKey) {
    _adapter.setState(getWalletAdapterState());
  }
}, "update");
var updateTxHistory = /* @__PURE__ */ __name((txStatus) => {
  const txId = txStatus.txId;
  _txHistory[txId] = {
    ..._txHistory[txId] || {},
    ...txStatus,
    updateTimestamp: Date.now()
  };
  lsSet("txHistory", _txHistory);
  events.notifyTxListeners(_txHistory[txId]);
}, "updateTxHistory");
var getConfig = /* @__PURE__ */ __name(() => {
  return _config;
}, "getConfig");
var getTxHistory = /* @__PURE__ */ __name(() => {
  return _txHistory;
}, "getTxHistory");
var setConfig = /* @__PURE__ */ __name((newConf) => {
  _config = { ...NETWORKS[newConf.networkId], ...newConf };
  lsSet("config", _config);
}, "setConfig");
var resetTxHistory = /* @__PURE__ */ __name(() => {
  _txHistory = {};
  lsSet("txHistory", _txHistory);
}, "resetTxHistory");

// src/near.ts
var adapter = _adapter;
big_default.DP = 27;
var MaxBlockDelayMs = 1e3 * 60 * 60 * 6;
function withBlockId(params, blockId) {
  if (blockId === "final" || blockId === "optimistic") {
    return { ...params, finality: blockId };
  }
  return blockId ? { ...params, block_id: blockId } : { ...params, finality: "optimistic" };
}
__name(withBlockId, "withBlockId");
async function sendRpc(method, params) {
  const config2 = getConfig();
  if (!config2?.nodeUrl) {
    throw new Error("fastnear: getConfig() returned invalid config: missing nodeUrl.");
  }
  const response = await fetch(config2.nodeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `fastnear-${Date.now()}`,
      method,
      params
    })
  });
  const result = await response.json();
  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }
  return result;
}
__name(sendRpc, "sendRpc");
function afterTxSent(txId) {
  const txHistory = getTxHistory();
  sendRpc("tx", {
    tx_hash: txHistory[txId]?.txHash,
    sender_account_id: txHistory[txId]?.tx?.signerId,
    wait_until: "EXECUTED_OPTIMISTIC"
  }).then((result) => {
    const successValue = result?.result?.status?.SuccessValue;
    updateTxHistory({
      txId,
      status: "Executed",
      result,
      successValue: successValue ? tryParseJson(fromBase64(successValue)) : void 0,
      finalState: true
    });
  }).catch((error) => {
    updateTxHistory({
      txId,
      status: "ErrorAfterIncluded",
      error: tryParseJson(error.message) ?? error.message,
      finalState: true
    });
  });
}
__name(afterTxSent, "afterTxSent");
async function sendTxToRpc(signedTxBase64, waitUntil, txId) {
  waitUntil = waitUntil || "INCLUDED";
  try {
    const sendTxRes = await sendRpc("send_tx", {
      signed_tx_base64: signedTxBase64,
      wait_until: waitUntil
    });
    updateTxHistory({ txId, status: "Included", finalState: false });
    afterTxSent(txId);
    return sendTxRes;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    updateTxHistory({
      txId,
      status: "Error",
      error: tryParseJson(errorMessage) ?? errorMessage,
      finalState: false
    });
    throw new Error(errorMessage);
  }
}
__name(sendTxToRpc, "sendTxToRpc");
function generateTxId() {
  const randomPart = crypto.getRandomValues(new Uint32Array(2)).join("");
  return `tx-${Date.now()}-${parseInt(randomPart, 10).toString(36)}`;
}
__name(generateTxId, "generateTxId");
var lastAccountCheckTime = 0;
var ACCOUNT_CHECK_INTERVAL = 6e4;
var accountId = /* @__PURE__ */ __name(() => {
  const currentTime = Date.now();
  if (_state.accountId && currentTime - lastAccountCheckTime > ACCOUNT_CHECK_INTERVAL) {
    lastAccountCheckTime = currentTime;
    _adapter.getAccounts().then((accounts) => {
      if (accounts.length === 0 && _state.accountId) {
        update({ accountId: null, privateKey: null, lastWalletId: null });
      }
    }).catch((e) => {
      console.error("Error checking account status:", e);
    });
  }
  return _state.accountId;
}, "accountId");
var publicKey = /* @__PURE__ */ __name(() => _state.publicKey, "publicKey");
var config = /* @__PURE__ */ __name((newConfig) => {
  const current = getConfig();
  if (newConfig) {
    if (newConfig.networkId && current.networkId !== newConfig.networkId) {
      setConfig(newConfig.networkId);
      update({ accountId: null, privateKey: null, lastWalletId: null });
      lsSet("block", null);
      resetTxHistory();
    }
    setConfig({ ...getConfig(), ...newConfig });
  }
  return getConfig();
}, "config");
var authStatus = /* @__PURE__ */ __name(() => {
  if (!_state.accountId) {
    return "SignedOut";
  }
  return "SignedIn";
}, "authStatus");
var getPublicKeyForContract = /* @__PURE__ */ __name((opts) => {
  return publicKey();
}, "getPublicKeyForContract");
var selected = /* @__PURE__ */ __name(() => {
  const network = getConfig().networkId;
  const nodeUrl = getConfig().nodeUrl;
  const walletUrl = getConfig().walletUrl;
  const helperUrl = getConfig().helperUrl;
  const explorerUrl = getConfig().explorerUrl;
  const account = accountId();
  const contract = _state.accessKeyContractId;
  const publicKey2 = getPublicKeyForContract();
  return {
    network,
    nodeUrl,
    walletUrl,
    helperUrl,
    explorerUrl,
    account,
    contract,
    publicKey: publicKey2
  };
}, "selected");
var requestSignIn = /* @__PURE__ */ __name(async (args) => {
  const contractId = args?.contractId;
  const privateKey = privateKeyFromRandom();
  update({ accessKeyContractId: contractId, accountId: null, privateKey });
  const result = await _adapter.signIn({
    networkId: getConfig().networkId,
    contractId
  });
  if (result.error) {
    throw new Error(`Wallet error: ${result.error}`);
  }
  if (result.accountId) {
    update({
      accountId: result.accountId,
      privateKey: result.privateKey,
      // Return the publicKey and privateKey from intear adapter
      publicKey: result.publicKey,
      accessKeyContractId: contractId
    });
  } else {
    console.warn("@fastnear: signIn resolved without accountId or error.");
    update({ accountId: null, privateKey: null, publicKey: null, accessKeyContractId: null });
  }
}, "requestSignIn");
var view = /* @__PURE__ */ __name(async ({
  contractId,
  methodName,
  args,
  argsBase64,
  blockId
}) => {
  const encodedArgs = argsBase64 || (args ? toBase64(JSON.stringify(args)) : "");
  const queryResult = await sendRpc(
    "query",
    withBlockId(
      {
        request_type: "call_function",
        account_id: contractId,
        method_name: methodName,
        args_base64: encodedArgs
      },
      blockId
    )
  );
  return parseJsonFromBytes(queryResult.result.result);
}, "view");
var queryAccount = /* @__PURE__ */ __name(async ({
  accountId: accountId2,
  blockId
}) => {
  return sendRpc(
    "query",
    withBlockId({ request_type: "view_account", account_id: accountId2 }, blockId)
  );
}, "queryAccount");
var queryBlock = /* @__PURE__ */ __name(async ({ blockId }) => {
  return sendRpc("block", withBlockId({}, blockId));
}, "queryBlock");
var queryAccessKey = /* @__PURE__ */ __name(async ({
  accountId: accountId2,
  publicKey: publicKey2,
  blockId
}) => {
  return sendRpc(
    "query",
    withBlockId(
      { request_type: "view_access_key", account_id: accountId2, public_key: publicKey2 },
      blockId
    )
  );
}, "queryAccessKey");
var queryTx = /* @__PURE__ */ __name(async ({ txHash, accountId: accountId2 }) => {
  return sendRpc("tx", [txHash, accountId2]);
}, "queryTx");
var localTxHistory = /* @__PURE__ */ __name(() => {
  return getTxHistory();
}, "localTxHistory");
var signOut = /* @__PURE__ */ __name(() => {
  update({ accountId: null, privateKey: null, contractId: null });
}, "signOut");
var signMessage = /* @__PURE__ */ __name(async ({
  message,
  recipient,
  nonce,
  callbackUrl,
  state: state2
}) => {
  const signerId = _state.accountId;
  if (!signerId) throw new Error("Must sign in");
  const messageNonce = nonce || crypto.getRandomValues(new Uint8Array(32));
  try {
    const result = await _adapter.signMessage({
      message,
      recipient,
      // @ts-ignore - We know the adapter expects Buffer but we're using Uint8Array
      nonce: messageNonce,
      callbackUrl,
      state: state2
    });
    return {
      accountId: result.accountId,
      publicKey: result.publicKey,
      signature: result.signature
    };
  } catch (err) {
    console.error("fastnear: error signing message using adapter:", err);
    throw err;
  }
}, "signMessage");
var sendTx = /* @__PURE__ */ __name(async ({
  receiverId,
  actions: actions2,
  waitUntil
}) => {
  const signerId = _state.accountId;
  if (!signerId) throw new Error("Must sign in");
  const publicKey2 = _state.publicKey ?? "";
  const privKey = _state.privateKey;
  const txId = generateTxId();
  if (!privKey || receiverId !== _state.accessKeyContractId || !canSignWithLAK(actions2) || hasNonZeroDeposit(actions2)) {
    const jsonTx = { signerId, receiverId, actions: actions2 };
    updateTxHistory({ status: "Pending", txId, tx: jsonTx, finalState: false });
    const url = new URL(typeof window !== "undefined" ? window.location.href : "");
    url.searchParams.set("txIds", txId);
    const existingParams = new URLSearchParams(window.location.search);
    existingParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    url.searchParams.delete("errorCode");
    url.searchParams.delete("errorMessage");
    try {
      const result = await _adapter.sendTransactions({
        transactions: [jsonTx]
      });
      if (result.outcomes?.length) {
        result.outcomes.forEach((r) => {
          const transactionEntry = r.get("transaction");
          updateTxHistory({
            txId,
            status: "Executed",
            result: r,
            txHash: transactionEntry?.hash,
            finalState: true
          });
        });
      } else if (result.rejected) {
        updateTxHistory({ txId, status: "RejectedByUser", finalState: true });
      } else if (result.error) {
        updateTxHistory({
          txId,
          status: "Error",
          error: tryParseJson(result.error),
          finalState: true
        });
      }
      return result;
    } catch (err) {
      console.error("fastnear: error sending tx using adapter:", err);
      updateTxHistory({
        txId,
        status: "Error",
        error: tryParseJson(err.message),
        finalState: true
      });
      return Promise.reject(err);
    }
  }
  let nonce = await lsGet("nonce");
  if (nonce == null) {
    const accessKey = await queryAccessKey({ accountId: signerId, publicKey: publicKey2 });
    if (accessKey.result.error) {
      throw new Error(`Access key error: ${accessKey.result.error} when attempting to get nonce for ${signerId} for public key ${publicKey2}`);
    }
    nonce = accessKey.result.nonce;
    lsSet("nonce", nonce);
  }
  let lastKnownBlock = await lsGet("block");
  if (!lastKnownBlock || parseFloat(lastKnownBlock.header.timestamp_nanosec) / 1e6 + MaxBlockDelayMs < Date.now()) {
    const latestBlock = await queryBlock({ blockId: "final" });
    lastKnownBlock = {
      header: {
        hash: latestBlock.result.header.hash,
        timestamp_nanosec: latestBlock.result.header.timestamp_nanosec
      }
    };
    lsSet("block", lastKnownBlock);
  }
  nonce += 1;
  lsSet("nonce", nonce);
  const blockHash = lastKnownBlock.header.hash;
  const plainTransactionObj = {
    signerId,
    publicKey: publicKey2,
    nonce,
    receiverId,
    blockHash,
    actions: actions2
  };
  const txBytes = serializeTransaction(plainTransactionObj);
  const txHashBytes = sha256(txBytes);
  const txHash58 = binary_to_base58_default(txHashBytes);
  const signatureBase58 = signHash(txHashBytes, privKey, { returnBase58: true });
  const signedTransactionBytes = serializeSignedTransaction(plainTransactionObj, signatureBase58);
  const signedTxBase64 = bytesToBase64(signedTransactionBytes);
  updateTxHistory({
    status: "Pending",
    txId,
    tx: plainTransactionObj,
    signature: signatureBase58,
    signedTxBase64,
    txHash: txHash58,
    finalState: false
  });
  try {
    return await sendTxToRpc(signedTxBase64, waitUntil, txId);
  } catch (error) {
    console.error("Error Sending Transaction:", error, plainTransactionObj, signedTxBase64);
  }
}, "sendTx");
function hasNonZeroDeposit(actions2) {
  for (const action of actions2) {
    if (action.type === "FunctionCall" || action.type === "Transfer") {
      if (action.params.deposit && action.params.deposit !== "0") {
        return true;
      }
    }
  }
  return false;
}
__name(hasNonZeroDeposit, "hasNonZeroDeposit");
var exp2 = {
  utils: {},
  // we will map this in a moment, giving keys, for IDE hints
  borsh: exp.borsh,
  borshSchema: exp.borshSchema.getBorshSchema()
};
for (const key in src_exports2) {
  exp2.utils[key] = src_exports2[key];
}
var utils = exp2.utils;
var state = {};
for (const key in state_exports) {
  state[key] = state_exports[key];
}
var event = state["events"];
delete state["events"];
try {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const accId = url.searchParams.get("account_id");
    const pubKey = url.searchParams.get("public_key");
    const errCode = url.searchParams.get("errorCode");
    const errMsg = url.searchParams.get("errorMessage");
    const decodedErrMsg = errMsg ? decodeURIComponent(errMsg) : null;
    const txHashes = url.searchParams.get("transactionHashes");
    const txIds = url.searchParams.get("txIds");
    if (errCode || errMsg) {
      console.warn(new Error(`Wallet raises:
code: ${errCode}
message: ${decodedErrMsg}`));
    }
    if (accId && pubKey) {
      if (pubKey === _state.publicKey) {
        update({ accountId: accId });
      } else {
        if (authStatus() === "SignedIn") {
          console.warn("Public key mismatch from wallet redirect", pubKey, _state.publicKey);
        }
        url.searchParams.delete("public_key");
      }
    }
    if (txHashes || txIds) {
      const hashArr = txHashes ? txHashes.split(",") : [];
      const idArr = txIds ? txIds.split(",") : [];
      if (idArr.length > hashArr.length) {
        idArr.forEach((id) => {
          updateTxHistory({ txId: id, status: "RejectedByUser", finalState: true });
        });
      } else if (idArr.length === hashArr.length) {
        idArr.forEach((id, i) => {
          updateTxHistory({
            txId: id,
            status: "PendingGotTxHash",
            txHash: hashArr[i],
            finalState: false
          });
          afterTxSent(id);
        });
      } else {
        console.error(new Error("Transaction hash mismatch from wallet redirect"), idArr, hashArr);
      }
    }
    url.searchParams.delete("txIds");
    if (authStatus() === "SignedOut") {
      url.searchParams.delete("errorCode");
      url.searchParams.delete("errorMessage");
    }
  }
} catch (e) {
  console.error("Error handling wallet redirect:", e);
}
var actions = {
  functionCall: /* @__PURE__ */ __name(({
    methodName,
    gas,
    deposit,
    args,
    argsBase64
  }) => {
    let finalArgs = args || {};
    if (!args && argsBase64) {
      try {
        const decoded = fromBase64(argsBase64);
        if (typeof decoded !== "object" || decoded === null || !(decoded instanceof Uint8Array)) {
          throw new Error(
            "Failed to decode base64 contract code, or the result was not a valid Uint8Array."
          );
        }
        finalArgs = JSON.parse(new TextDecoder().decode(decoded));
      } catch (e) {
        console.error("Failed to decode or parse argsBase64:", e);
        throw new Error("Invalid argsBase64 provided for functionCall");
      }
    }
    return {
      type: "FunctionCall",
      params: {
        methodName,
        args: finalArgs,
        gas: gas || "30000000000000",
        // Default gas
        deposit: deposit || "0"
        // Default deposit
      }
    };
  }, "functionCall"),
  transfer: /* @__PURE__ */ __name((yoctoAmount) => ({
    type: "Transfer",
    params: {
      deposit: yoctoAmount
    }
  }), "transfer"),
  stake: /* @__PURE__ */ __name(({ amount, publicKey: publicKey2 }) => ({
    type: "Stake",
    params: {
      stake: amount,
      publicKey: publicKey2
    }
  }), "stake"),
  addFullAccessKey: /* @__PURE__ */ __name(({ publicKey: publicKey2 }) => ({
    type: "AddKey",
    params: {
      publicKey: publicKey2,
      accessKey: { permission: "FullAccess" }
    }
  }), "addFullAccessKey"),
  addLimitedAccessKey: /* @__PURE__ */ __name(({
    publicKey: publicKey2,
    allowance,
    accountId: accountId2,
    methodNames
  }) => ({
    type: "AddKey",
    params: {
      publicKey: publicKey2,
      accessKey: {
        permission: {
          receiverId: accountId2,
          allowance,
          methodNames
        }
      }
    }
  }), "addLimitedAccessKey"),
  deleteKey: /* @__PURE__ */ __name(({ publicKey: publicKey2 }) => ({
    type: "DeleteKey",
    params: {
      publicKey: publicKey2
    }
  }), "deleteKey"),
  deleteAccount: /* @__PURE__ */ __name(({ beneficiaryId }) => ({
    type: "DeleteAccount",
    params: {
      beneficiaryId
    }
  }), "deleteAccount"),
  createAccount: /* @__PURE__ */ __name(() => ({
    type: "CreateAccount"
  }), "createAccount"),
  deployContract: /* @__PURE__ */ __name(({ codeBase64 }) => {
    const codeBytes = fromBase64(codeBase64);
    if (typeof codeBytes !== "object" || codeBytes === null || !(codeBytes instanceof Uint8Array)) {
      throw new Error(
        "Failed to decode base64 contract code, or the result was not a valid Uint8Array."
      );
    }
    return {
      type: "DeployContract",
      params: {
        code: codeBytes
      }
    };
  }, "deployContract")
};
export {
  MaxBlockDelayMs,
  accountId,
  actions,
  adapter,
  afterTxSent,
  authStatus,
  config,
  event,
  exp2 as exp,
  generateTxId,
  getPublicKeyForContract,
  localTxHistory,
  publicKey,
  queryAccessKey,
  queryAccount,
  queryBlock,
  queryTx,
  requestSignIn,
  selected,
  sendRpc,
  sendTx,
  sendTxToRpc,
  signMessage,
  signOut,
  state,
  utils,
  view,
  withBlockId
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/edwards.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=bundled.js.map