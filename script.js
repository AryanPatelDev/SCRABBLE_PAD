// Disable document functionality
const disabledFunctions = [
  "showDocumentManager",
  "createNewDocument",
  "loadDocument",
  "deleteDocument",
  "getDocumentsList",
  "saveDocumentsList",
  "setupDocumentSearch",
  "initDocumentSystem",
  "setupDocumentFiltersAndSorting",
  "toggleFavorite",
  "setupShareFunctionality",
];

// Create empty placeholder functions to prevent errors
disabledFunctions.forEach((funcName) => {
  window[funcName] = function () {
    console.log(`${funcName} is disabled`);
    return false;
  };
});

// Override document initialization with simple text storage
function initDocument() {
  // Simple local storage for single document
  const savedText = localStorage.getItem("scrabble_text") || "";
  const savedHeading =
    localStorage.getItem("scrabble_heading") || "HEADING HERE...";

  document.getElementById("heading").textContent = savedHeading;
  document.getElementById("scrabble-pad").value = savedText;
}

// Replace document saving with simple storage
function saveDocumentContent() {
  const text = document.getElementById("scrabble-pad").value;
  const heading = document.getElementById("heading").textContent;

  localStorage.setItem("scrabble_text", text);
  localStorage.setItem("scrabble_heading", heading);

  showSaveIndicator();
}

// Register service worker for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

// Word counter functionality
function updateWordCount() {
  const text = document.getElementById("scrabble-pad").value;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  document.getElementById(
    "word-counter"
  ).textContent = `${wordCount} words | ${charCount} characters`;
}

// DOM references
const textArea = document.getElementById("scrabble-pad");
const headingArea = document.getElementById("heading");

// Set up initial word count
document
  .getElementById("scrabble-pad")
  .addEventListener("input", updateWordCount);
updateWordCount();

// Document management
let currentDocId = "";
const DOCS_KEY = "scrabble_documents";

// Load dark mode settings
const settings = JSON.parse(localStorage.getItem("settings") || "{}");
if (settings.theme === "dark") {
  document.body.classList.add("dark-mode");
  if (document.getElementById("darkModeToggle")) {
    document.getElementById("darkModeToggle").textContent =
      "Switch to Light Mode";
  }
} else {
  if (document.getElementById("darkModeToggle")) {
    document.getElementById("darkModeToggle").textContent =
      "Switch to Dark Mode";
  }
}

// Dark mode toggle function
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  settings.theme = isDarkMode ? "dark" : "light";
  localStorage.setItem("settings", JSON.stringify(settings));

  // Update button text
  if (document.getElementById("darkModeToggle")) {
    document.getElementById("darkModeToggle").textContent = isDarkMode
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
  }

  // Apply styles for light mode explicitly
  if (!isDarkMode) {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.getElementById("scrabble-pad").style.backgroundColor = "white";
    document.getElementById("scrabble-pad").style.color = "black";
    document.getElementById("heading").style.backgroundColor = "white";
    document.getElementById("heading").style.color = "black";
  } else {
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.getElementById("scrabble-pad").style.backgroundColor = "";
    document.getElementById("scrabble-pad").style.color = "";
    document.getElementById("heading").style.backgroundColor = "";
    document.getElementById("heading").style.color = "";
  }
}

// Toggle settings menu and close it on outside click
document
  .getElementById("settingsToggle")
  .addEventListener("click", function (event) {
    const menu = document.getElementById("settingsMenu");
    menu.classList.toggle("hidden");
    menu.classList.toggle("active");
    event.stopPropagation(); // Prevent the click from closing the menu immediately
  });

// Close menu when clicking elsewhere
document.addEventListener("click", function (event) {
  const menu = document.getElementById("settingsMenu");
  const toggleButton = document.getElementById("settingsToggle");
  const textarea = document.getElementById("scrabble-pad");
  const headingArea = document.getElementById("heading");

  if (
    menu &&
    !menu.contains(event.target) &&
    !toggleButton.contains(event.target)
  ) {
    menu.classList.add("hidden");
    menu.classList.remove("active");
    // Set focus to the textarea if the click was outside the settings menu
    if (event.target === textarea || event.target === headingArea) {
      event.target.focus();
    }
  }
});

// Placeholder behavior for heading
headingArea.addEventListener("click", () => {
  if (headingArea.textContent === "HEADING HERE...") {
    headingArea.textContent = ""; // Clear placeholder on click
  }
});

headingArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && headingArea.textContent.trim() === "") {
    e.preventDefault();
    headingArea.textContent = ""; // Prevent adding empty lines
  }
});

// Function to format date and time for heading
function getFormattedDateTimeForHeading() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to get formatted date and time for filename
function getFormattedDateTimeForFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}`;
}

// Export Text and Heading as File
document.getElementById("export-btn").addEventListener("click", function () {
  const text = document.getElementById("scrabble-pad").value;
  let heading = document.getElementById("heading").textContent.trim();

  // Ensure placeholder is not copied for export
  if (heading === "" || heading === "HEADING HERE...") {
    heading = ""; // Clear placeholder from export
  }

  // Default filename with date and time
  const defaultFilename = heading
    ? heading
    : `scrabble-pad_${getFormattedDateTimeForFilename()}`;
  const filename = prompt(
    "Enter the filename to Export it:",
    defaultFilename + ".txt"
  );

  if (filename) {
    // Include date and time in heading if it's empty
    const exportHeading = heading ? heading : getFormattedDateTimeForHeading();
    const content = `##${exportHeading}##\n${text}`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(link.href), 100);

    // Show success notification
    showNotification("File exported successfully!");
  }
});

// Import Text and Heading from File
document.getElementById("import-btn").addEventListener("click", function () {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";
  input.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result.split("\n");
      let heading = "";
      let text = "";

      // Check if the first line contains the heading format ##HEADING##
      if (content[0].startsWith("##") && content[0].endsWith("##")) {
        heading = content[0].replace(/##/g, "").trim();
        text = content.slice(1).join("\n"); // Remaining content goes to the text area
      } else {
        text = content.join("\n"); // If no heading format, treat all content as text
      }

      // Set heading and text area content
      document.getElementById("heading").textContent =
        heading || "HEADING HERE...";
      document.getElementById("scrabble-pad").value = text;

      // Save imported data to document system
      saveDocumentContent();

      // Show success notification
      showNotification("File imported successfully!");
    };

    reader.onerror = function () {
      showNotification("Error reading file", "error");
    };

    reader.readAsText(file);
  });
  input.click();
});

// Clear Text functionality with confirmation
document.getElementById("clearTextBtn").addEventListener("click", function () {
  if (
    confirm(
      "Are you sure you want to clear all text? This action cannot be undone."
    )
  ) {
    // Clear heading and textarea content
    document.getElementById("heading").textContent = "HEADING HERE...";
    document.getElementById("scrabble-pad").value = "";

    // Save empty content
    saveDocumentContent();

    // Show notification
    showNotification("Text cleared successfully");
  }
});

// Show notification system
function showNotification(message, type = "success", duration = 3000) {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = message;

  // Set color based on type
  if (type === "error") {
    notification.classList.remove("bg-green-500");
    notification.classList.add("bg-red-500");
  } else {
    notification.classList.remove("bg-red-500");
    notification.classList.add("bg-green-500");
  }

  notification.classList.remove("hidden");
  notification.classList.add("opacity-100");

  setTimeout(() => {
    notification.classList.add("opacity-0");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 300);
  }, duration);
}

// Show save indicator with visual feedback
function showSaveIndicator() {
  const indicator = document.getElementById("save-indicator");
  if (!indicator) return;

  indicator.textContent = "Saving...";
  indicator.classList.remove("opacity-0");
  indicator.classList.add("opacity-100");

  setTimeout(() => {
    indicator.textContent = "Saved";
    setTimeout(() => {
      indicator.classList.remove("opacity-100");
      indicator.classList.add("opacity-0");
    }, 1500);
  }, 500);
}

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // If horizontal swipe is stronger than vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Right swipe - toggle settings
    if (diffX > 100) {
      document.getElementById("settingsToggle").click();
    }
  }
}

// Initialize documents system
function initDocumentSystem() {
  // Check for redirected document ID from 404.html
  let docId = sessionStorage.getItem("redirectDocId");
  if (docId) {
    sessionStorage.removeItem("redirectDocId");
    currentDocId = docId;
    loadDocument(currentDocId);
    return;
  }

  // Check if URL has a document ID in the path
  const path = window.location.pathname;
  docId = path.substring(1); // Remove leading slash

  if (docId && docId !== "index.html" && docId !== "") {
    currentDocId = docId;
    loadDocument(currentDocId);
  } else {
    // If no document ID in URL, create a new document or load the last one
    const docs = getDocumentsList();
    if (docs.length > 0) {
      currentDocId = docs[docs.length - 1].id;
      loadDocument(currentDocId);
    } else {
      createNewDocument();
    }
  }
}

// Get list of documents
function getDocumentsList() {
  const docsJson = localStorage.getItem(DOCS_KEY);
  return docsJson ? JSON.parse(docsJson) : [];
}

// Save document list
function saveDocumentsList(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

// Create a new document with unique ID
function createNewDocument() {
  // Create unique ID - use timestamp plus random string for better uniqueness
  const newId =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  const title = "New Document";

  const docs = getDocumentsList();
  docs.push({
    id: newId,
    title: title,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  });
  saveDocumentsList(docs);

  // Add to the createNewDocument function
  const originalCreateNewDocument = createNewDocument;
  createNewDocument = function () {
    originalCreateNewDocument();
    updateDocumentHeader();
  };

  // Set as current document
  currentDocId = newId;

  // Update URL without reloading
  const url = "/" + currentDocId;
  window.history.pushState({ docId: currentDocId }, "", url);

  // Clear content
  document.getElementById("heading").textContent = "HEADING HERE...";
  document.getElementById("scrabble-pad").value = "";

  // Save empty content for this document
  saveDocumentContent();
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Save current document content with debounce
const debouncedSaveContent = debounce(function () {
  if (!currentDocId) return;

  const heading = document.getElementById("heading").textContent;
  const content = document.getElementById("scrabble-pad").value;

  localStorage.setItem(`doc_${currentDocId}_heading`, heading);
  localStorage.setItem(`doc_${currentDocId}_content`, content);

  // Update document title in list
  const docs = getDocumentsList();
  const docIndex = docs.findIndex((doc) => doc.id === currentDocId);
  if (docIndex >= 0) {
    docs[docIndex].title =
      heading === "HEADING HERE..." ? "Untitled Document" : heading;
    docs[docIndex].updated = new Date().toISOString();
    saveDocumentsList(docs);
  }

  showSaveIndicator();
}, 500);

// Regular save function that calls the debounced version
function saveDocumentContent() {
  debouncedSaveContent();
  // Add to saveDocumentContent to update header when title changes
  const originalSaveDocumentContent = saveDocumentContent;
  saveDocumentContent = function () {
    originalSaveDocumentContent();
    updateDocumentHeader();
  };
}

// Load document content
function loadDocument(docId) {
  try {
    const heading =
      localStorage.getItem(`doc_${docId}_heading`) || "HEADING HERE...";
    const content = localStorage.getItem(`doc_${docId}_content`) || "";

    document.getElementById("heading").textContent = heading;
    document.getElementById("scrabble-pad").value = content;

    // Update URL without reloading using history API
    const url = "/" + docId;
    window.history.pushState({ docId: docId }, "", url);

    // Update current doc ID
    currentDocId = docId;

    // Update word count
    updateWordCount();

    // Add to the loadDocument function
    const originalLoadDocument = loadDocument;
    loadDocument = function (docId) {
      const result = originalLoadDocument(docId);
      updateDocumentHeader();
      return result;
    };

    return true;
  } catch (err) {
    console.error("Error loading document:", err);
    showNotification("Error loading document", "error");
    return false;
  }
}

// Delete document
function deleteDocument(docId) {
  if (!confirm("Are you sure you want to delete this document?")) return;

  try {
    // Remove from document list
    let docs = getDocumentsList();
    docs = docs.filter((doc) => doc.id !== docId);
    saveDocumentsList(docs);

    // Remove content
    localStorage.removeItem(`doc_${docId}_heading`);
    localStorage.removeItem(`doc_${docId}_content`);

    // If current document was deleted, load another or create new
    if (docId === currentDocId) {
      if (docs.length > 0) {
        loadDocument(docs[docs.length - 1].id);
      } else {
        createNewDocument();
      }
    }

    // Refresh document list
    showDocumentManager();

    // Show success notification
    showNotification("Document deleted successfully");
  } catch (err) {
    console.error("Error deleting document:", err);
    showNotification("Error deleting document", "error");
  }
}

// Populate document manager
function showDocumentManager() {
  console.log("Showing document manager");
  const docs = getDocumentsList();
  console.log("Documents:", docs);
  const listEl = document.getElementById("documentList");
  if (!listEl) {
    console.error("Document list element not found");
    return;
  }

  listEl.innerHTML = "";

  if (docs.length === 0) {
    listEl.innerHTML =
      '<div class="text-gray-500 p-4 text-center">No documents found</div>';
    return;
  }

  docs.forEach((doc) => {
    const lastUpdated = new Date(doc.updated).toLocaleString();
    const docEl = document.createElement("div");
    docEl.className =
      "border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center";
    docEl.innerHTML = `
          <div>
            <div class="font-medium ${
              doc.id === currentDocId ? "text-blue-500" : ""
            }">${doc.title}</div>
            <div class="text-xs text-gray-500">Last updated: ${lastUpdated}</div>
          </div>
          <div class="flex gap-2">
            <button class="open-doc text-blue-500 hover:text-blue-700" data-id="${
              doc.id
            }">Open</button>
            <button class="delete-doc text-red-500 hover:text-red-700" data-id="${
              doc.id
            }">Delete</button>
          </div>
        `;
    listEl.appendChild(docEl);
  });

  // Add event listeners to buttons
  document.querySelectorAll(".open-doc").forEach((btn) => {
    btn.addEventListener("click", () => {
      const docId = btn.getAttribute("data-id");
      loadDocument(docId);
      document.getElementById("documentManager").classList.add("hidden");
    });
  });

  document.querySelectorAll(".delete-doc").forEach((btn) => {
    btn.addEventListener("click", () => {
      const docId = btn.getAttribute("data-id");
      deleteDocument(docId);
    });
  });

  // Show the manager
  document.getElementById("documentManager").classList.remove("hidden");

  // Initialize search functionality
  setupDocumentSearch();
}

// Setup share functionality
function setupShareFunctionality() {
  const shareBtn = document.getElementById("shareDocBtn");
  const shareBox = document.getElementById("shareBox");
  const shareInput = document.getElementById("shareUrlInput");
  const copyBtn = document.getElementById("copyShareUrl");

  if (!shareBtn || !shareBox || !shareInput || !copyBtn) return;

  shareBtn.addEventListener("click", () => {
    if (!currentDocId) return;

    const fullUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      "/" +
      currentDocId;

    shareInput.value = fullUrl;
    shareBox.classList.remove("hidden");
    shareInput.select();

    // Try to copy to clipboard automatically
    try {
      navigator.clipboard.writeText(fullUrl);
      showNotification("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  copyBtn.addEventListener("click", () => {
    shareInput.select();

    try {
      navigator.clipboard.writeText(shareInput.value);
      showNotification("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
}

// Add search functionality for document manager
function setupDocumentSearch() {
  const searchInput = document.getElementById("documentSearch");
  const clearButton = document.getElementById("clearSearch");

  if (!searchInput || !clearButton) return;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const docItems = document.querySelectorAll("#documentList > div");

    docItems.forEach((item) => {
      const titleEl = item.querySelector(".font-medium");
      if (!titleEl) return;

      const title = titleEl.textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    const event = new Event("input");
    searchInput.dispatchEvent(event);
  });
}

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + S to export
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    const exportBtn = document.getElementById("export-btn");
    if (exportBtn) exportBtn.click();
  }

  // Ctrl/Cmd + O to import
  if ((e.ctrlKey || e.metaKey) && e.key === "o") {
    e.preventDefault();
    const importBtn = document.getElementById("import-btn");
    if (importBtn) importBtn.click();
  }

  // Ctrl/Cmd + D to toggle dark mode
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    toggleDarkMode();
  }

  // Ctrl/Cmd + , to open documents manager
  if ((e.ctrlKey || e.metaKey) && e.key === ",") {
    e.preventDefault();
    const documentsBtn = document.getElementById("documentsBtn");
    if (documentsBtn) documentsBtn.click();
  }

  // Esc to close any open modals or menus
  if (e.key === "Escape") {
    const documentManager = document.getElementById("documentManager");
    const settingsMenu = document.getElementById("settingsMenu");
    const welcomeModal = document.getElementById("welcomeModal");

    if (documentManager && !documentManager.classList.contains("hidden")) {
      documentManager.classList.add("hidden");
    } else if (settingsMenu && !settingsMenu.classList.contains("hidden")) {
      settingsMenu.classList.add("hidden");
    } else if (welcomeModal && !welcomeModal.classList.contains("hidden")) {
      welcomeModal.classList.add("hidden");
    }
  }
});

// Handle browser back/forward buttons
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.docId) {
    loadDocument(event.state.docId);
  } else {
    const path = window.location.pathname;
    const docId = path.substring(1);

    if (docId && docId !== "index.html" && docId !== "") {
      loadDocument(docId);
    }
  }
});

// Replace existing DOM content loaded handler with this simplified version
document.addEventListener("DOMContentLoaded", () => {
  // Check if first visit
  const welcomeModal = document.getElementById("welcomeModal");
  if (welcomeModal && !localStorage.getItem("hasVisited")) {
    welcomeModal.classList.remove("hidden");
    localStorage.setItem("hasVisited", "true");

    const closeWelcome = document.getElementById("closeWelcome");
    const startWriting = document.getElementById("startWriting");

    if (closeWelcome) {
      closeWelcome.addEventListener("click", () => {
        welcomeModal.classList.add("hidden");
      });
    }

    if (startWriting) {
      startWriting.addEventListener("click", () => {
        welcomeModal.classList.add("hidden");
      });
    }
  }

  // Initialize simple document
  initDocument();

  // Setup event listeners
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }

  // Update save handlers to use simple storage
  const textArea = document.getElementById("scrabble-pad");
  const headingArea = document.getElementById("heading");
  textArea.addEventListener("input", saveDocumentContent);
  headingArea.addEventListener("input", saveDocumentContent);

  // Improve keyboard navigation
  document.querySelectorAll("#settingsMenu button").forEach((btn, index) => {
    btn.setAttribute("tabindex", index + 1);
  });

  const settingsToggle = document.getElementById("settingsToggle");
  if (settingsToggle) {
    settingsToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        settingsToggle.click();
        setTimeout(() => {
          const firstButton = document.querySelector("#settingsMenu button");
          if (firstButton) firstButton.focus();
        }, 100);
      }
    });
  }
});

// Add enhanced document management functions

// Update the document dropdown with current doc name
function updateDocumentHeader() {
  const docName = document.getElementById("currentDocumentName");
  if (!docName) return;

  const docs = getDocumentsList();
  const currentDoc = docs.find((doc) => doc.id === currentDocId);

  if (currentDoc) {
    docName.textContent =
      currentDoc.title === "HEADING HERE..." || currentDoc.title === ""
        ? "Untitled Document"
        : currentDoc.title;
  } else {
    docName.textContent = "Untitled Document";
  }
}

// Enhanced document population function
function showDocumentManager() {
  console.log("Showing document manager");
  const docs = getDocumentsList();
  console.log("Documents:", docs);
  const listEl = document.getElementById("documentList");

  if (!listEl) {
    console.error("Document list element not found");
    return;
  }

  // Clear the list
  listEl.innerHTML = "";

  // Update document stats
  const statsEl = document.getElementById("documentStats");
  if (statsEl) {
    let lastEditDate = "Never";
    if (docs.length > 0) {
      // Find the most recently updated document
      const mostRecent = [...docs].sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      )[0];
      lastEditDate = new Date(mostRecent.updated).toLocaleDateString();
    }
    statsEl.textContent = `${docs.length} document${
      docs.length !== 1 ? "s" : ""
    } • Last edit: ${lastEditDate}`;
  }

  if (docs.length === 0) {
    listEl.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-500">No documents yet</h4>
          <p class="text-gray-400 mb-4">Create a new document to get started</p>
          <button id="emptyStateNewDoc" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            + New Document
          </button>
        </div>
      `;

    // Add event listener for the empty state button
    document
      .getElementById("emptyStateNewDoc")
      .addEventListener("click", () => {
        createNewDocument();
      });

    return;
  }

  // Sort documents based on selected sort order
  const sortSelect = document.getElementById("docSortOrder");
  const sortBy = sortSelect ? sortSelect.value : "updated";

  let sortedDocs = [...docs];
  switch (sortBy) {
    case "updated":
      sortedDocs.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      break;
    case "created":
      sortedDocs.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case "name":
      sortedDocs.sort((a, b) => a.title.localeCompare(b.title));
      break;
    // Implement other sort methods as needed
  }

  // Get current filter
  const activeFilter = document.querySelector(".doc-filter-btn.active");
  const filterType = activeFilter ? activeFilter.dataset.filter : "all";

  // Filter docs if needed
  if (filterType === "recent") {
    // Show only docs from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    sortedDocs = sortedDocs.filter((doc) => new Date(doc.updated) > oneWeekAgo);
  } else if (filterType === "favorite") {
    // Show only favorited docs (if you implement this feature)
    sortedDocs = sortedDocs.filter((doc) => doc.favorite);
  }

  // Create document cards
  sortedDocs.forEach((doc) => {
    const lastUpdated = new Date(doc.updated).toLocaleDateString();
    const isActive = doc.id === currentDocId;
    const docContent = localStorage.getItem(`doc_${doc.id}_content`) || "";
    const wordCount =
      docContent.trim() === "" ? 0 : docContent.trim().split(/\s+/).length;

    // We'll truncate the content for the preview
    const previewContent =
      docContent.length > 150
        ? docContent.substring(0, 150) + "..."
        : docContent;

    const docEl = document.createElement("div");
    docEl.className = `document-card ${isActive ? "active" : ""}`;
    docEl.dataset.id = doc.id;

    docEl.innerHTML = `
        <div class="document-card-title">${
          doc.title === "HEADING HERE..." ? "Untitled Document" : doc.title
        }</div>
        <div class="document-preview">${
          previewContent || "Empty document"
        }</div>
        <div class="document-card-actions">
          <button class="doc-card-btn favorite ${
            doc.favorite ? "active" : ""
          }" data-id="${doc.id}" title="Favorite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${
              doc.favorite ? "currentColor" : "none"
            }" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <button class="doc-card-btn delete" data-id="${
            doc.id
          }" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        <div class="document-info-bar">
          <span>${lastUpdated}</span>
          <span>${wordCount} words</span>
        </div>
      `;

    // Make the whole card clickable
    docEl.addEventListener("click", (e) => {
      // Don't open if clicking on an action button
      if (e.target.closest(".doc-card-btn")) return;

      loadDocument(doc.id);
      document.getElementById("documentManager").classList.add("hidden");
    });

    listEl.appendChild(docEl);
  });

  // Add event listeners for action buttons
  document.querySelectorAll(".doc-card-btn.delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click
      const docId = btn.getAttribute("data-id");
      deleteDocument(docId);
    });
  });

  document.querySelectorAll(".doc-card-btn.favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click
      const docId = btn.getAttribute("data-id");
      toggleFavorite(docId);
      btn.classList.toggle("active");

      // Update the star icon
      const starIcon = btn.querySelector("svg");
      if (btn.classList.contains("active")) {
        starIcon.setAttribute("fill", "currentColor");
      } else {
        starIcon.setAttribute("fill", "none");
      }
    });
  });

  // Show the manager
  document.getElementById("documentManager").classList.remove("hidden");

  // Set up event listeners for filters and sorting
  setupDocumentFiltersAndSorting();
}

// Toggle document favorite status
function toggleFavorite(docId) {
  const docs = getDocumentsList();
  const docIndex = docs.findIndex((doc) => doc.id === docId);

  if (docIndex >= 0) {
    // Toggle favorite status
    docs[docIndex].favorite = !docs[docIndex].favorite;
    saveDocumentsList(docs);

    // Show notification
    const action = docs[docIndex].favorite ? "added to" : "removed from";
    showNotification(`Document ${action} favorites`);
  }
}

// Set up filters and sorting for document manager
function setupDocumentFiltersAndSorting() {
  // Set up filter buttons
  document.querySelectorAll(".doc-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      document
        .querySelectorAll(".doc-filter-btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Refresh document list with new filter
      showDocumentManager();
    });
  });

  // Set up sort dropdown
  const sortSelect = document.getElementById("docSortOrder");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      showDocumentManager();
    });
  }
}

// Initialize document dropdown
function initDocumentDropdown() {
  const dropdown = document.getElementById("documentDropdown");
  if (!dropdown) return;

  dropdown.addEventListener("click", () => {
    showDocumentManager();
  });

  // Quick action buttons
  const newBtn = document.getElementById("quickNewDoc");
  if (newBtn) {
    newBtn.addEventListener("click", () => {
      createNewDocument();
    });
  }

  const saveBtn = document.getElementById("quickSave");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveDocumentContent();
      showNotification("Document saved");
    });
  }

  // Update header with current document name
  updateDocumentHeader();
}

// Modify your existing functions to update the document header
