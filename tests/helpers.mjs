import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import * as React from "react";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Transpile in memory with the already installed compiler; no test dependencies.
export function loadSource(relativePath, mocks = {}, globals = {}, cache = new Map()) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const sourceModule = { exports: {} };
  cache.set(filename, sourceModule);
  const nativeRequire = createRequire(filename);
  const requireSource = (request) => {
    if (Object.hasOwn(mocks, request)) return mocks[request];
    if (!request.startsWith(".") && !request.startsWith("@/")) {
      return nativeRequire(request);
    }
    const base = request.startsWith("@/")
      ? path.resolve(root, request.slice(2))
      : path.resolve(path.dirname(filename), request);
    const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!target) throw new Error(`Cannot resolve ${request} from ${filename}`);
    return loadSource(target, mocks, globals, cache);
  };
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  new Function("require", "module", "exports", ...Object.keys(globals), outputText)(
    requireSource, sourceModule, sourceModule.exports, ...Object.values(globals),
  );
  return sourceModule.exports;
}

// Handler tests use controlled hook state, not a browser or React DOM lifecycle.
export function componentHarness(file, exportName, initialProps, globals = {}) {
  const slots = [];
  let cursor = 0;
  let props = initialProps;
  const hooks = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
      return [slots[index], (next) => {
        slots[index] = typeof next === "function" ? next(slots[index]) : next;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect() {},
  };
  const Component = loadSource(file, { react: hooks }, globals)[exportName];
  return {
    render(nextProps = props) {
      props = nextProps;
      cursor = 0;
      return Component(props);
    },
  };
}

export function findNodes(node, predicate) {
  if (node == null || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap((child) => findNodes(child, predicate));
  if (typeof node !== "object") return [];
  return [
    ...(predicate(node) ? [node] : []),
    ...findNodes(node.props?.children, predicate),
  ];
}

export function textContent(node) {
  if (node == null || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(textContent).join(" ");
  if (typeof node !== "object") return String(node);
  return textContent(node.props?.children);
}
