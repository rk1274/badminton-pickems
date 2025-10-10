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

  // --- Render regular groups ---
  groups.forEach((group) => {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add("group-container");

    const groupName = document.createElement("div");
    groupName.classList.add("name");
    groupName.textContent = group.name;
    groupContainer.appendChild(groupName);

    // Slots
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

    // Sortable logic
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

    // Load saved picks
    const saved = existingSelections[group.name];
    if (saved) {
      saved.forEach((name, idx) => {
        const slot = slotsContainer.children[idx];
        const player = Array.from(poolContainer.children).find(
          (p) => p.textContent === name
        );
        if (player) {
          // --- swap the slot and player in the DOM ---
          const temp = document.createElement("li");
          poolContainer.replaceChild(temp, player); // placeholder where player was
          slotsContainer.replaceChild(player, slot); // move player into slot
          poolContainer.replaceChild(slot, temp);    // move old slot into pool
        }
      });
    }
  });

  // --- Overall Top 3 Section ---
  const overallContainer = document.createElement("div");
  overallContainer.classList.add("group-container");

  const overallName = document.createElement("div");
  overallName.classList.add("name");
  overallName.textContent = "🏆 Overall Top 3";
  overallContainer.appendChild(overallName);

  const overallSlots = document.createElement("ul");
  overallSlots.classList.add("slots");
  for (let i = 0; i < 3; i++) {
    const slot = document.createElement("li");
    slot.classList.add("slot");
    overallSlots.appendChild(slot);
  }
  overallContainer.appendChild(overallSlots);

  const overallPool = document.createElement("ul");
  overallPool.classList.add("player-pool");

  // Flatten all pairs from all groups
  const allPairs = groups.flatMap((g) => g.pairs);
  allPairs.forEach((pairObj) => {
    const playerItem = document.createElement("li");
    playerItem.classList.add("player");
    playerItem.textContent = pairObj.pair.join(" & ");
    playerItem.style.borderColor = pairObj.colour;
    overallPool.appendChild(playerItem);
  });

  overallContainer.appendChild(overallPool);
  groupsContainer.appendChild(overallContainer);

  // Sortables for Overall section
  Sortable.create(overallSlots, {
    group: "overall",
    animation: 150,
    swap: true,
    swapClass: "dragging",
  });

  Sortable.create(overallPool, {
    group: "overall",
    animation: 150,
    swap: true,
    swapClass: "dragging",
  });

  // Load saved picks
  const savedOverall = existingSelections["🏆 Overall Top 3"];
  if (savedOverall) {
    savedOverall.forEach((name, idx) => {
      const slot = overallSlots.children[idx];
      const player = Array.from(overallPool.children).find(
        (p) => p.textContent === name
      );
      if (player) {
        // Swap the slot and player in the DOM
        const temp = document.createElement("li");
        overallPool.replaceChild(temp, player); // placeholder where player was
        overallSlots.replaceChild(player, slot); // move player into slot
        overallPool.replaceChild(slot, temp);    // move old slot into pool
      }
    });
  }
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



function showMessage(text, type = "info") {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = `message ${type}`;
}

// -------------------- Load Existing Picks --------------------
loadBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return showMessage("Please enter your name first.", "error");

  try {
    const res = await fetch(
      `/.netlify/functions/get-picks?username=${encodeURIComponent(username)}`
    );

    if (!res.ok) {
      showMessage("No saved picks found for this name. You can start a new one.", "info");
      renderGroups();
      return;
    }

    const data = await res.json();
    showMessage("Loaded your saved picks!", "success");
    renderGroups(data);
  } catch (err) {
    console.error(err);
    showMessage("Error loading picks.", "error");
  }
});

// -------------------- Submit / Save Picks --------------------
submitBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return showMessage("Please enter your name first.", "error");

  const selections = getSelections();

  try {
    const res = await fetch("/.netlify/functions/save-picks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, selections }),
    });

    const data = await res.json();

    if (res.ok) showMessage(data.message, "success");
    else if (res.status === 403) showMessage(data.message, "error");
    else showMessage("Error saving picks.", "error");
  } catch (err) {
    console.error(err);
    showMessage("Network error saving picks.", "error");
  }
});

async function loadUsernames() {
  try {
    const res = await fetch("/.netlify/functions/get-all-usernames"); // you'll create this endpoint
    if (!res.ok) return;
    const usernames = await res.json(); // expects ["Alice", "Bob", "Charlie"]

    console.log("Usernames loaded:", usernames);

    const datalist = document.getElementById("usernames");
    datalist.innerHTML = ""; // clear old options

    usernames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      datalist.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading usernames:", err);
  }
}

// Load usernames when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadUsernames();
});


// -------------------- Initial Render --------------------
renderGroups();


