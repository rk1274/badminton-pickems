const groups = [
  {
    name: "Group 1",
    pairs: [
      ["Joy", "Kelvin"],
      ["Ash", "David"],
      ["Andee", "VJ"],
    ],
  },
  {
    name: "Group 2",
    pairs: [
      ["Bryan", "Khrystle"],
      ["Rosie", "Kacper"],
      ["Josh", "Lanz 1"],
    ],
  },
  {
    name: "Group 3",
    pairs: [
      ["Francis", "Dal"],
      ["Vedant", "Abhay"],
      ["Lanz 2", "Vanne"],
    ],
  },
];

const groupsContainer = document.querySelector(".groups-container");

groups.forEach(group => {
  const groupContainer = document.createElement("div");
  groupContainer.classList.add("group-container");

  const pairContainer = document.createElement("ul");
  pairContainer.classList.add("group");
  
  const groupName = document.createElement("div");
  groupName.classList.add("name");
  groupName.innerHTML = group.name;
  pairContainer.appendChild(groupName);

  group.pairs.forEach(pair => {
    const pairItem = document.createElement("li");
    pairItem.classList.add("sortable-item");
    pairItem.setAttribute("draggable", "true");
    pairItem.innerHTML = pair.join(" & ");

    pairContainer.appendChild(pairItem);
  });

  groupContainer.appendChild(pairContainer);
  groupsContainer.appendChild(groupContainer);
});

document.querySelectorAll(".group").forEach(list => {
  let draggingItem = null;

  list.addEventListener("dragstart", e => {
    draggingItem = e.target;
    e.target.classList.add("dragging");
  });

  list.addEventListener("dragend", e => {
    e.target.classList.remove("dragging");
    document.querySelectorAll(".sortable-item").forEach(item => item.classList.remove("over"));
    draggingItem = null;
  });

  list.addEventListener("dragover", e => {
    e.preventDefault();
    const draggingOverItem = getDragAfterElement(list, e.clientY);

    document.querySelectorAll(".sortable-item").forEach(item => item.classList.remove("over"));

    if (draggingOverItem) {
      draggingOverItem.classList.add("over");
      list.insertBefore(draggingItem, draggingOverItem);
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