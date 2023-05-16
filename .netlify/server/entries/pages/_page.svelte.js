import { c as create_ssr_component, b as add_attribute } from "../../chunks/index2.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  innerWidth = 0;
  return `




<body>

<div${add_attribute("class", `min-h-screen w-screen absolute text-center flex flex-wrap justify-center mt-20 ${innerWidth > 700 ? "space-x-16" : ""}`, 0)}>
    <div${add_attribute(
    "class",
    `mt-10 bg-white drop-shadow-lg rounded-2xl bg-opacity-80 ${innerWidth > 700 ? "min-w-[50%] max-h-[500px]" : "w-72 h-full py-8"}`,
    0
  )}><div${add_attribute("class", `flex justify-center`, 0)}><div${add_attribute("class", `h-48 w-64 bg-white`, 0)}>logo</div></div>
    <div${add_attribute("class", ` ${innerWidth > 700 ? "mt-[25%]" : ""} `, 0)}><h1${add_attribute("class", `text-4xl font-bold text-gray-800`, 0)}>TITLE</h1>
        <h1${add_attribute("class", `text-xl font-bold text-gray-600`, 0)}>CS 145 System Series Project</h1>
        <h1${add_attribute("class", `text-s text-gray-600`, 0)}>details</h1></div></div>

    
    <div${add_attribute("class", ` h-full`, 0)}>
    <div${add_attribute("class", `mt-10 bg-white drop-shadow-lg w-72 h-full rounded-2xl bg-opacity-80 py-8`, 0)}><h1${add_attribute("class", `text-xl font-bold text-gray-800`, 0)}>Members:</h1>
    <div${add_attribute("class", `text-gray-600`, 0)}><h1>Adrian Joshua M. Reapor</h1>
        <h1>Carl David B. Ragunton</h1>
        <h1>Jack Vincent Nicolas</h1>
        <h1>Jan Paul M. Batrina</h1>
        <h1>Yenzy Urson S. Hebron</h1></div></div>
    
    <div${add_attribute("class", `mt-10 bg-white drop-shadow-lg w-72 h-full rounded-2xl bg-opacity-80 py-8`, 0)}><h1${add_attribute("class", `text-xl font-bold text-gray-800`, 0)}>CS 145 Handlers:</h1>
    <div${add_attribute("class", `text-gray-600`, 0)}><h1>Wilson M. Tan</h1>
        <h1>Alfonso Labao</h1></div></div></div></div></body>`;
});
export {
  Page as default
};
