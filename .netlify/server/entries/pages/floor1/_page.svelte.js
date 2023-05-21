import { c as create_ssr_component, b as add_attribute, f as each, e as escape } from "../../../chunks/index2.js";
function IMAGESOURCE(dispenser) {
  let source = "../" + dispenser.status + "-" + dispenser.level + ".png";
  return source;
}
function LOGNAME(dispenser) {
  let source = "/floor" + dispenser.floor + "/" + dispenser.location;
  return source;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  let dispensers = [
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1"
    },
    {
      location: "Room 105",
      level: "Medium",
      status: "Inactive",
      floor: "1"
    },
    {
      location: "CR Left",
      level: "Low",
      status: "Active",
      floor: "1"
    },
    {
      location: "Room 109",
      level: "Medium",
      status: "Active",
      floor: "1"
    },
    {
      location: "Room 114",
      level: "High",
      status: "Active",
      floor: "1"
    },
    {
      location: "CR Right",
      level: "Low",
      status: "Active",
      floor: "1"
    },
    {
      location: "Back Entrance",
      level: "High",
      status: "Active",
      floor: "1"
    },
    {
      location: "Room 120",
      level: "Low",
      status: "Inactive",
      floor: "1"
    },
    {
      location: "Room 127",
      level: "Low",
      status: "Active",
      floor: "1"
    }
  ];
  innerWidth = 0;
  return `


<body><div class="min-h-screen w-screen absolute flex justify-center mt-20">
    <ul${add_attribute("class", `${innerWidth > 900 ? "flex flex-wrap justify-center" : ""} `, 0)}>
        ${each(dispensers, (dispenser) => {
    return `<li><a${add_attribute("href", LOGNAME(dispenser), 0)}><div${add_attribute("class", `mt-10 hover:brightness-90 ${innerWidth > 700 ? "mx-10" : ""} `, 0)}><img${add_attribute("src", IMAGESOURCE(dispenser), 0)} alt=""${add_attribute("class", `max-w-[350px] drop-shadow-xl ${innerWidth > 700 ? "flex flex-wrap justify-center" : ""} `, 0)}>
            <p class="absolute -mt-[90px] mx-20 font-bold text-lg">${escape(dispenser.location)}</p>
            <p class="absolute -mt-[65px] mx-20">Level: ${escape(dispenser.level)}</p>
            <p class="absolute -mt-[40px] mx-20">Status: ${escape(dispenser.status)}</p>
            </div></a>
        </li>`;
  })}</ul></div></body>`;
});
export {
  Page as default
};
