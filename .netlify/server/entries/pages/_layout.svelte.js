import { c as create_ssr_component, a as subscribe, b as add_attribute, v as validate_component } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
const app = "";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentRoute;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  currentRoute = $page.url.pathname;
  $$unsubscribe_page();
  return `<nav class="bg-cyan w-screen h-20 font-bold shadow-xl z-20 absolute"><ul class=""><li class="flex">
        <a href="/"${add_attribute("class", `bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === "/" ? "bg-opacity-100" : "bg-opacity-0"}`, 0)}>
        <img src="../logo.png" alt="" class="h-20"></a>

        
        <a href="/floor1"${add_attribute(
    "class",
    `bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === "/floor1" ? "bg-opacity-100" : "bg-opacity-0"}`,
    0
  )}><h1 class="mt-6 mx-5 text-white text-2xl">F1</h1></a>

        
        <a href="/floor2"${add_attribute(
    "class",
    `bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === "/floor2" ? "bg-opacity-100" : "bg-opacity-0"}`,
    0
  )}><h1 class="mt-6 mx-5 text-white text-2xl">F2</h1></a></li></ul></nav>`;
});
const Pagebase = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  innerWidth = 0;
  return `


<div${add_attribute("class", `fixed z-0`, 0)}>${innerWidth < 1200 ? `<img src="../main-bg.png" alt=""${add_attribute("class", ``, 0)}>
        <img src="../main-bg.png" alt=""${add_attribute("class", `absolute`, 0)}>
        <img src="../main-bg.png" alt=""${add_attribute("class", `absolute mt-[220px]`, 0)}>
        <img src="../main-bg.png" alt=""${add_attribute("class", `absolute mt-[440px]`, 0)}>` : `<img src="../main-bg.png" alt=""${add_attribute("class", ``, 0)}>`}</div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}
${validate_component(Pagebase, "Pagebase").$$render($$result, {}, {}, {})}

${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
