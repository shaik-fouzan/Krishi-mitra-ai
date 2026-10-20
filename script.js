
"use strict";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Basic educational crop advisor
const cropForm = document.getElementById("cropForm");
const cropResult = document.getElementById("cropResult");

cropForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const soil = document.getElementById("soil").value;
  const season = document.getElementById("season").value;
  const water = document.getElementById("water").value;

  let suggestions = [];

  if (soil === "black") {
    suggestions = ["Cotton", "Pigeon pea"];
  } else if (soil === "red") {
    suggestions = ["Groundnut", "Millets"];
  } else if (soil === "sandy") {
    suggestions = ["Pearl millet", "Suitable pulses"];
  } else if (soil === "loamy") {
    suggestions = ["Maize", "Suitable pulses"];
  }

  let waterAdvice = "";

  if (water === "low") {
    waterAdvice =
      "Prioritize locally suitable, relatively drought-tolerant crops and verify their water needs.";
  } else if (water === "medium") {
    waterAdvice =
      "Check the crop's growth-stage water needs and plan irrigation carefully.";
  } else {
    waterAdvice =
      "Reliable irrigation gives more options, but check drainage and water requirements.";
  }

  let seasonAdvice = "";

  if (season === "kharif") {
    seasonAdvice =
      "Check local monsoon onset, rainfall forecasts and drainage before sowing.";
  } else if (season === "rabi") {
    seasonAdvice =
      "Check local winter temperatures and the recommended sowing window.";
  } else {
    seasonAdvice =
      "Check heat tolerance and irrigation availability before choosing a summer crop.";
  }

  cropResult.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = "Your preliminary crop ideas";

  const crops = document.createElement("p");
  crops.textContent = "Explore: " + suggestions.join(", ") + ".";

  const soilText = document.createElement("p");
  soilText.textContent = "Selected soil: " + soil + ".";

  const seasonText = document.createElement("p");
  seasonText.textContent = seasonAdvice;

  const waterText = document.createElement("p");
  waterText.textContent = waterAdvice;

  const caution = document.createElement("p");
  caution.textContent =
    "These are general examples, not a validated crop recommendation. " +
    "Confirm local suitability, soil pH, soil test results, seed variety, " +
    "expected rainfall, pest risks and market prices with an agricultural expert.";

  cropResult.append(
    title,
    crops,
    soilText,
    seasonText,
    waterText,
    caution
  );

  cropResult.hidden = false;
  cropResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Plant image preview
const plantImage = document.getElementById("plantImage");
const imagePreview = document.getElementById("imagePreview");
const imageMessage = document.getElementById("imageMessage");

let currentImageURL = null;

plantImage.addEventListener("change", () => {
  imageMessage.textContent = "";

  const file = plantImage.files[0];

  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
    currentImageURL = null;
  }

  imagePreview.hidden = true;
  imagePreview.removeAttribute("src");

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    imageMessage.textContent = "Please choose an image file.";
    plantImage.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    imageMessage.textContent = "Choose an image smaller than 5 MB.";
    plantImage.value = "";
    return;
  }

  currentImageURL = URL.createObjectURL(file);
  imagePreview.src = currentImageURL;
  imagePreview.hidden = false;

  imageMessage.textContent =
    "Image preview ready. No disease analysis has been performed.";
});

// Demonstration chat: not connected to a real AI model
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getSampleReply(question) {
  const q = question.toLowerCase();

  if (q.includes("soil")) {
    return "Soil health starts with a soil test. Check pH and nutrient levels, " +
      "add suitable organic matter, rotate crops and avoid excessive fertilizer. " +
      "Ask your local agricultural extension office for a soil-test-based plan.";
  }

  if (
    q.includes("dry") ||
    q.includes("water") ||
    q.includes("drought") ||
    q.includes("weather")
  ) {
    return "Check the local forecast, soil moisture and crop growth stage. " +
      "Use irrigation efficiently and protect young crops from heat where practical. " +
      "The right action depends on your crop and local conditions.";
  }

  if (
    q.includes("disease") ||
    q.includes("leaf") ||
    q.includes("plant") ||
    q.includes("pest")
  ) {
    return "Look for leaf spots, yellowing, wilting and insect damage. " +
      "Take clear photos of the whole plant and affected leaves. " +
      "A photo alone may not confirm the cause. Consult a local agricultural " +
      "expert before using any pesticide.";
  }

  if (q.includes("crop") || q.includes("seed") || q.includes("sow")) {
    return "Crop selection depends on your location, soil test, season, water, " +
      "seed variety and market demand. Use the Crop Advisor as a starting point " +
      "and verify the recommendation with your local agriculture department.";
  }

  return "Thank you for your question! This is a demo assistant, not a live AI. " +
    "For a useful recommendation, include your location, crop name, soil type, " +
    "season and the problem you are seeing. Verify important decisions locally.";
}

function askQuestion(question) {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) return;

  addMessage(cleanQuestion, "user");
  addMessage(getSampleReply(cleanQuestion), "bot");
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const question = chatInput.value.trim();

  if (!question) return;

  chatInput.value = "";
  askQuestion(question);
  chatInput.focus();
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    askQuestion(button.dataset.question);
  });
});
