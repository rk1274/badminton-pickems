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

// -------------------- Render Groups --------------------
function renderGroups(existingSelections = {}) {
  groupsContainer.innerHTML = "";

  groups.forEach((group) => {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add("group-container");

    const groupName = document.createElement("div");
    groupName.classList.add("name");
    groupName.textContent = group.name;
    groupContainer.appendChild(groupName);

    // Slots container
    const slotsContainer = document.createElement("ul");
    slotsContainer.classList.add("slots");
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("li");
      slot.classList.add("slot");
      slotsContainer.appendChild(slot);
    }
    groupContainer.appendChild(slotsContainer);

    // Player pool
    const poolContainer = document.createElement("ul");
    poolContainer.classList.add("player-pool");
    group.pairs.forEach((pairObj) => {
      const playerItem = document.createElement("li");
      playerItem.classList.add("player");
      playerItem.textContent = pairObj.pair.join(" & ");
      playerItem.style.borderColor = pairObj.colour;
      poolContainer.appendChild(playerItem);
    });
    groupContainer.appendChild(poolContainer);

    groupsContainer.appendChild(groupContainer);

    // -------------------- Initialize Sortable --------------------
    Sortable.create(slotsContainer, {
      group: `group-${group.name}`,
      animation: 150,
      swap: true,
      swapClass: "dragging",
    });

    Sortable.create(poolContainer, {
      group: `group-${group.name}`,
      animation: 150,
      swap: true,
      swapClass: "dragging",
    });

    // Populate saved selections
    const saved = existingSelections[group.name];
    if (saved) {
      saved.forEach((name, idx) => {
        const slot = slotsContainer.children[idx];
        const player = Array.from(poolContainer.children).find(
          (p) => p.textContent === name
        );
        if (player) slot.appendChild(player);
      });
    }
  });
}

// -------------------- Get Current Selections --------------------
function getSelections() {
  const selections = {};

  document.querySelectorAll(".group-container").forEach((container) => {
    const groupName = container.querySelector(".name").textContent;
    const slots = container.querySelectorAll(".slots li"); // all li in slots
    selections[groupName] = Array.from(slots)
      .map((slot) => slot.textContent.trim())
      .filter(Boolean); // ignore empty slots
  });

  return selections;
}

// -------------------- Load Existing Picks --------------------
loadBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name first.");

  try {
    const res = await fetch(
      `/.netlify/functions/get-picks?username=${encodeURIComponent(username)}`
    );
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

// -------------------- Submit / Save Picks --------------------
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

// -------------------- Initial Render --------------------
renderGroups();
