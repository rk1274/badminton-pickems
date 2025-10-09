const groups = [
  {
    name: "Group 1",
    pairs: [
      {
        pair: ["Joy", "Kelvin"],
        colour: "#72916e",
        text: "#000000ff",
      },
      {
        pair: ["Ash", "David"],
        colour: "#a3c4bc",
        text: "#000000ff",
      },
      {
        pair: ["Vanne", "VJ"],
        colour: "#d9e6d0",
        text: "#000000ff",
      },
    ],
  },
  {
    name: "Group 2",
    pairs: [
      {
        pair: ["Bryan", "Khrystle"],
        colour: "#FF5900",
        text: "#000000ff",
      },
      {
        pair: ["Rosie", "Kacper"],
        colour: "#ff8383ff",
        text: "#000000ff",
      },
      {
        pair: ["Josh", "Lanz 1"],
        colour: "#88a08e",
        text: "#000000ff",
      },
    ],
  },
  {
    name: "Group 3",
    pairs: [
      {
        pair: ["Francis", "Dal"],
        colour: "#5B3256",
        text: "#adadadff",
      },
      {
        pair: ["Vedant", "Abhay"],
        colour: "#0000cd",
        text: "#adadadff",
      },
      {
        pair: ["Lanz 2", "Andee"],
        colour: "#6e8f6a",
        text: "#000000ff",
      },
    ],
  },
];

const groupsContainer = document.querySelector(".groups-container");

const setPairs = (group, pairContainer) => {
    group.pairs.forEach(pairObj => {
        const pairItem = document.createElement("li");
        pairItem.classList.add("sortable-item");
        pairItem.setAttribute("draggable", "true");
        pairItem.innerHTML = pairObj.pair.join(" & ");
        pairItem.style.borderColor = pairObj.colour;

        pairContainer.appendChild(pairItem);
    });
}

groups.forEach(group => {
  const groupContainer = document.createElement("div");
  groupContainer.classList.add("group-container");
  
  const numContainer = document.createElement("div");
  numContainer.classList.add("num-container");
  
  for (i = 1; i < 4; i++) {
    const num = document.createElement("div"); 
    num.classList.add("num");
    num.innerHTML = i;

    numContainer.appendChild(num);
  }

  const pairContainer = document.createElement("ul");
  pairContainer.classList.add("group");
  
  const groupName = document.createElement("div");
  groupName.classList.add("name");
  groupName.innerHTML = group.name;

  pairContainer.appendChild(groupName);

  
  setPairs(group, pairContainer);

  groupContainer.appendChild(numContainer);
  groupContainer.appendChild(pairContainer);
  groupsContainer.appendChild(groupContainer);
});


document.querySelectorAll(".group").forEach(list => {
  let draggingItem = null;
  let dropTarget = null;

  list.addEventListener("dragstart", e => {
    draggingItem = e.target;
    e.target.classList.add("dragging");
  });

  list.addEventListener("dragend", e => {
    e.target.classList.remove("dragging");
    document.querySelectorAll(".sortable-item").forEach(item => item.classList.remove("over"));
    draggingItem = null;
    dropTarget = null;
  });

  list.addEventListener("dragover", e => {
    e.preventDefault();

    // Find the item you're hovering over
    const draggingOverItem = getDragAfterElement(list, e.clientY);

    // Remove all .over before adding new one
    document.querySelectorAll(".sortable-item").forEach(item => item.classList.remove("over"));

    if (draggingOverItem && draggingOverItem !== draggingItem) {
      draggingOverItem.classList.add("over");
      dropTarget = draggingOverItem;
    } else {
      dropTarget = null;
    }
  });

  list.addEventListener("drop", e => {
    e.preventDefault();

    // Insert the dragged item in the new position
    if (dropTarget) {
      dropTarget.classList.remove("over");
      list.insertBefore(draggingItem, dropTarget);
    } else {
      list.appendChild(draggingItem);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}