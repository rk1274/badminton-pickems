const groups = [
  {
    name: "Group 1",
    pairs: [
      { pair: ["Joy", "Kelvin"], colour: "#72916e", text: "#000000ff" },
      { pair: ["Ash", "David"], colour: "#a3c4bc", text: "#000000ff" },
      { pair: ["Vanne", "VJ"], colour: "#d9e6d0", text: "#000000ff" },
    ],
  },
  {
    name: "Group 2",
    pairs: [
      { pair: ["Bryan", "Khrystle"], colour: "#FF5900", text: "#000000ff" },
      { pair: ["Rosie", "Kacper"], colour: "#ff8383ff", text: "#000000ff" },
      { pair: ["Josh", "Lanz 1"], colour: "#88a08e", text: "#000000ff" },
    ],
  },
  {
    name: "Group 3",
    pairs: [
      { pair: ["Francis", "Dal"], colour: "#5B3256", text: "#adadadff" },
      { pair: ["Vedant", "Abhay"], colour: "#0000cd", text: "#adadadff" },
      { pair: ["Lanz 2", "Andee"], colour: "#6e8f6a", text: "#000000ff" },
    ],
  },
];

const groupsContainer = document.querySelector(".groups-container");

const setPairs = (group, pairContainer) => {
  group.pairs.forEach(pairObj => {
    const pairItem = document.createElement("li");
    pairItem.classList.add("sortable-item");
    pairItem.innerHTML = pairObj.pair.join(" & ");
    pairItem.style.borderColor = pairObj.colour;
    pairContainer.appendChild(pairItem);
  });
};

groups.forEach(group => {
  const groupContainer = document.createElement("div");
  groupContainer.classList.add("group-container");

  const numContainer = document.createElement("div");
  numContainer.classList.add("num-container");
  for (let i = 1; i < 4; i++) {
    const num = document.createElement("div");
    num.classList.add("num");
    num.textContent = i;
    numContainer.appendChild(num);
  }

  const pairContainer = document.createElement("ul");
  pairContainer.classList.add("group");

  const groupName = document.createElement("div");
  groupName.classList.add("name");
  groupName.textContent = group.name;
  pairContainer.appendChild(groupName);

  setPairs(group, pairContainer);

  groupContainer.appendChild(numContainer);
  groupContainer.appendChild(pairContainer);
  groupsContainer.appendChild(groupContainer);

  Sortable.create(pairContainer, {
    animation: 150,
    ghostClass: "dragging",
    handle: ".sortable-item", 
  });
});
