import { c as create_ssr_component, e as escape, f as each, b as add_attribute } from "../../../../chunks/index2.js";
function PCLOG(log) {
  let source = log.timestamp + "    " + log.message;
  return source;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let innerWidth;
  let logs = [
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    },
    {
      location: "Working Dispenser",
      level: "High",
      status: "Active",
      floor: "1",
      timestamp: "[2012-12-20 12:00:00]",
      message: "Dropped to Medium level"
    }
  ];
  innerWidth = 0;
  return `


<div class="flex justify-center text-center"><div class="absolute mt-24">
    <h1 class="text-4xl font-bold text-gray-800">${escape(logs[0].location)} History Log</h1>
    <div class="flex justify-center"><div class="absolute mt-5 bg-white rounded-2xl opacity-80 min-w-[90%] min-h-full">
        <h1 class="my-6 text-lg font-bold text-gray-800">Latest Log</h1>
        <div class="h-1 w-full bg-cyan-light"></div>
        
        ${each(logs, (log) => {
    return `<div class="my-6 text-lg font-bold text-gray-800">${innerWidth < 700 ? `<h1 class>${escape(log.timestamp)}</h1>
                <h1 class>${escape(log.message)}</h1>` : `<h1 class>${escape(PCLOG(log))}</h1>`}</div>
        <div class="h-1 w-full bg-cyan-light"></div>`;
  })}
        
        <h1 class="my-6 text-lg font-bold text-gray-800">First Log</h1></div></div></div></div>


<button onclick="history.back()" class="fixed bottom-0 right-0"><img src="../back.png" alt=""${add_attribute("class", `max-w-[100px] shadow-4xl hover:animate-bouncex`, 0)}></button>`;
});
export {
  Page as default
};
