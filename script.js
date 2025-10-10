const groups = [
  {
    name: "Group 1",
    pairs: [
      { pair: ["Joy", "Kelvin"], colour: "#72916e", text: "#000000ff" },
      { pair: ["Ash", "David"], colour: "#a3c4bc", text: "#000000ff" },
      { pair: ["Vanne", "VJ"], colour: "#d9e6d0", text: "#133f05ff" },
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
const usernameInput = document.getElementById("username");
const loadBtn = document.getElementById("load-btn");
const submitBtn = document.getElementById("submit-btn");

function renderGroups(existingSelections = {}) {
  groupsContainer.innerHTML = "";

  groups.forEach(group => {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add("group-container");

    const groupName = document.createElement("div");
    groupName.classList.add("name");
    groupName.textContent = group.name;
    groupContainer.appendChild(groupName);

    const pairContainer = document.createElement("ul");
    pairContainer.classList.add("group");

    // If user has saved picks, use their saved order
    const order = existingSelections[group.name];
    const pairs = order
      ? order.map(nameStr => group.pairs.find(p => p.pair.join(" & ") === nameStr))
      : group.pairs;

    pairs.forEach(pairObj => {
      const pairItem = document.createElement("li");
      pairItem.classList.add("sortable-item");
      pairItem.innerHTML = pairObj.pair.join(" & ");
      pairItem.style.borderColor = pairObj.colour;
      pairContainer.appendChild(pairItem);
    });

    groupContainer.appendChild(pairContainer);
    groupsContainer.appendChild(groupContainer);

    Sortable.create(pairContainer, {
      animation: 150,
      ghostClass: "dragging",
    });
  });
}

// Helper: get current selections
function getSelections() {
  const selections = {};
  document.querySelectorAll(".group-container").forEach(container => {
    const groupName = container.querySelector(".name").textContent;
    const pairItems = container.querySelectorAll(".sortable-item");
    selections[groupName] = Array.from(pairItems).map(item => item.textContent);
  });
  return selections;
}

// Load existing picks
loadBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name first.");

  try {
    const res = await fetch(`/.netlify/functions/get-picks?username=${encodeURIComponent(username)}`);
    if (!res.ok) {
      alert("No saved picks found for this name. You can start a new one.");
      renderGroups();
      return;
    }
    const data = await res.json();
    alert("Loaded your saved picks!");
    renderGroups(data);
  } catch (err) {
    console.error(err);
    alert("Error loading picks.");
  }
});

// Submit / Save picks
submitBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name first.");

  const selections = getSelections();

  try {
    const res = await fetch("/.netlify/functions/save-picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, selections }),
    });

    if (res.ok) alert("Your picks have been saved!");
    else alert("Error saving picks.");
  } catch (err) {
    console.error(err);
    alert("Network error saving picks.");
  }
});

// Render default on first load
renderGroups();
