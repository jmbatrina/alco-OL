import { c as create_ssr_component, b as add_attribute, f as each, e as escape } from "../../../chunks/index2.js";
function IMAGESOURCE(dispenser) {
  let source = "../" + dispenser.status + "-" + dispenser.level + ".png";
  return source;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  let dispensers = [
    {
      location: "Stairs Left",
      level: "High",
      status: "Active"
    },
    {
      location: "Room 205",
      level: "Medium",
      status: "Inactive"
    },
    {
      location: "CR Left",
      level: "Low",
      status: "Active"
    },
    {
      location: "Room 209",
      level: "Medium",
      status: "Active"
    },
    {
      location: "Room 214",
      level: "High",
      status: "Active"
    },
    {
      location: "CR Right",
      level: "Low",
      status: "Active"
    },
    {
      location: "Stairs Right",
      level: "High",
      status: "Active"
    },
    {
      location: "Room 220",
      level: "Low",
      status: "Inactive"
    },
    {
      location: "Room 227",
      level: "Low",
      status: "Active"
    }
  ];
  innerWidth = 0;
  return `


<body>
<div class="min-h-screen w-screen absolute flex justify-center mt-20">
    <ul${add_attribute("class", `${innerWidth > 900 ? "flex flex-wrap justify-center" : ""} `, 0)}>${each(dispensers, (dispenser) => {
    return `<li><div${add_attribute("class", `mt-10 hover:brightness-90 ${innerWidth > 700 ? "mx-10" : ""} `, 0)}><img${add_attribute("src", IMAGESOURCE(dispenser), 0)} alt=""${add_attribute("class", `max-w-[350px] drop-shadow-xl ${innerWidth > 700 ? "flex flex-wrap justify-center" : ""} `, 0)}>
            <p class="absolute -mt-[90px] mx-20 font-bold text-lg">${escape(dispenser.location)}</p>
            <p class="absolute -mt-[65px] mx-20">Level: ${escape(dispenser.level)}</p>
            <p class="absolute -mt-[40px] mx-20">Status: ${escape(dispenser.status)}</p>
        </div></li>`;
  })}</ul></div></body>`;
});
export {
  Page as default
};
