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

  // Set type
  notification.classList.remove("success", "error");
  notification.classList.add(type);

  // Reset any current animations
  notification.classList.remove("hidden", "opacity-0", "opacity-100", "active");

  // Force a reflow before adding the active class (this makes the animation work properly)
  void notification.offsetWidth;

  // Show the notification with animation
  notification.classList.add("active");

  // Clear any existing timeout
  if (window.notificationTimeout) {
    clearTimeout(window.notificationTimeout);
  }

  // Set new timeout to hide the notification
  window.notificationTimeout = setTimeout(() => {
    notification.classList.remove("active");

    // Add hidden class after animation completes
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

  // Esc to close any open modals or menus
  if (e.key === "Escape") {
    const documentManager = document.getElementById("documentManager");
    const settingsMenu = document.getElementById("settingsMenu");
    const welcomeModal = document.getElementById("welcomeModal");
    const shareLinkDialog = document.getElementById("shareLinkDialog");
    if (shareLinkDialog && !shareLinkDialog.classList.contains("hidden")) {
      shareLinkDialog.classList.add("hidden");
    }

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

document.addEventListener("DOMContentLoaded", () => {
  // Define welcomeModal at the beginning so it's available throughout the function
  const welcomeModal = document.getElementById("welcomeModal");

  // Add these lines from the second event handler
  const shareBtn = document.getElementById("share-btn");
  const shareLinkDialog = document.getElementById("shareLinkDialog");
  const closeShareDialog = document.getElementById("closeShareDialog");
  const shareLinkInput = document.getElementById("shareLink");
  const copyLinkBtn = document.getElementById("copyLink");
  const sharedNoteView = document.getElementById("sharedNoteView");
  const sharedNoteContent = document.getElementById("sharedNoteContent");
  const editSharedNoteBtn = document.getElementById("editSharedNote");
  const mainContent = document.querySelector(
    ".h-screen.relative.max-w-screen-lg.mx-auto"
  );

  // Check if this is the first visit
  if (!localStorage.getItem("hasVisited")) {
    // Show welcome modal on first visit
    if (welcomeModal) {
      welcomeModal.classList.remove("hidden");
      // Set the flag to prevent showing on subsequent visits
      localStorage.setItem("hasVisited", "true");
    }
  }

  // Set up welcome modal close buttons
  const closeWelcome = document.getElementById("closeWelcome");
  const startWriting = document.getElementById("startWriting");

  if (closeWelcome) {
    closeWelcome.addEventListener("click", function () {
      welcomeModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }

  if (startWriting) {
    startWriting.addEventListener("click", function () {
      welcomeModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }

  const showWelcomeBtn = document.getElementById("showWelcomeBtn");
  if (showWelcomeBtn) {
    showWelcomeBtn.addEventListener("click", function () {
      // Hide any other open dialogs
      const shareLinkDialog = document.getElementById("shareLinkDialog");
      if (shareLinkDialog) {
        shareLinkDialog.classList.add("hidden");
      }

      // Show welcome modal (using the already defined welcomeModal)
      if (welcomeModal) {
        welcomeModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }

      // Close settings menu
      document.getElementById("settingsMenu").classList.add("hidden");
    });
  }

  // Generate share link functionality
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      // Ensure welcome modal is hidden when share dialog is shown
      if (welcomeModal) {
        welcomeModal.classList.add("hidden");
      }

      const textContent = document.getElementById("scrabble-pad").value;
      const headingContent = document
        .getElementById("heading")
        .textContent.trim();

      if (!textContent.trim()) {
        showNotification("Nothing to share. Write something first!", "error");
        return;
      }

      // Compress the text content
      const compressedContent =
        LZString.compressToEncodedURIComponent(textContent);

      // Generate the full URL
      const shareURL = `${window.location.origin}${window.location.pathname}#note=${compressedContent}`;

      // Show the share dialog
      shareLinkInput.value = shareURL;
      shareLinkDialog.classList.remove("hidden");
      shareLinkInput.select();

      // Generate QR code
      try {
        const qrcodeContainer = document.getElementById("qrcode");
        qrcodeContainer.innerHTML = ""; // Clear previous QR code

        QRCode.toCanvas(
          qrcodeContainer,
          shareURL,
          {
            width: 200,
            margin: 1,
            color: {
              dark: document.body.classList.contains("dark-mode")
                ? "#000000"
                : "#000000",
              light: "#ffffff",
            },
          },
          function (error) {
            if (error) {
              console.error("Error generating QR code:", error);
              showNotification("Error generating QR code", "error");
            }
          }
        );

        console.log("QR code generated successfully");
      } catch (error) {
        console.error("Failed to generate QR code:", error);
        showNotification("Failed to generate QR code", "error");
      }

      // Close the settings menu
      document.getElementById("settingsMenu").classList.add("hidden");
    });
  }

  // Close share dialog
  if (closeShareDialog) {
    closeShareDialog.addEventListener("click", function () {
      shareLinkDialog.classList.add("hidden");
    });
  }

  // Copy link button
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      try {
        navigator.clipboard
          .writeText(shareLinkInput.value)
          .then(() => {
            showNotification("Link copied to clipboard!");
          })
          .catch((err) => {
            // Fallback to the older method if the Clipboard API fails
            shareLinkInput.select();
            document.execCommand("copy");
            showNotification("Link copied to clipboard!");
          });
      } catch (err) {
        // Final fallback
        shareLinkInput.select();
        document.execCommand("copy");
        showNotification("Link copied to clipboard!");
      }
    });
  }

  // Edit shared note
  if (editSharedNoteBtn) {
    editSharedNoteBtn.addEventListener("click", function () {
      const noteContent = sharedNoteContent.textContent;
      const textArea = document.getElementById("scrabble-pad");

      // Put the shared note content into the editor
      textArea.value = noteContent;

      // Hide the shared note view, show the editor
      sharedNoteView.classList.add("hidden");
      mainContent.classList.remove("hidden");

      // Remove the hash from the URL
      history.pushState("", document.title, window.location.pathname);

      // Save the content locally
      saveDocumentContent();
      showNotification("Note loaded to editor");
    });
  }

  // Check for shared note in URL on page load
  function checkForSharedNote() {
    const hash = window.location.hash;
    if (hash.startsWith("#note=")) {
      try {
        const compressedNote = hash.substring(6); // Remove the '#note=' part
        const decompressedNote =
          LZString.decompressFromEncodedURIComponent(compressedNote);

        // Display the shared note
        sharedNoteContent.textContent = decompressedNote;
        mainContent.classList.add("hidden");
        sharedNoteView.classList.remove("hidden");
      } catch (e) {
        showNotification("Error loading shared note", "error");
      }
    }
  }

  // Check for shared note when the page loads
  checkForSharedNote();

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
  // Modal handling
  function setupModals() {
    // Close modal when clicking outside content area
    document.querySelectorAll(".app-modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          document.body.style.overflow = "auto";
        }
      });
    });

    // Prevent propagation from modal content
    document.querySelectorAll(".modal-content").forEach((content) => {
      content.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".app-modal").forEach((modal) => {
          if (!modal.classList.contains("hidden")) {
            modal.classList.add("hidden");
            document.body.style.overflow = "auto";
          }
        });
      }
    });
  }

  setupModals();
});

document.addEventListener("DOMContentLoaded", function () {
  // Setup the symbol formatting
  const textarea = document.getElementById("scrabble-pad");
  if (textarea) {
    // Create a debounced version of formatTextAreaDisplay
    const debouncedFormatText = debounce(formatTextAreaDisplay, 300);

    textarea.addEventListener("input", function (e) {
      // Only format if arrow characters are detected (removed horizontal rule detection)
      if (/--|<=|=>|<-|->/.test(e.target.value)) {
        debouncedFormatText();
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
// Pretty formatting for arrows, logical symbols, and horizontal rules
function prettifySymbols(text) {
  // Process only inline symbols
  const replacements = [
    { pattern: /-->/g, replacement: "→" },
    { pattern: /<--/g, replacement: "←" },
    { pattern: /<->/g, replacement: "↔" },
    { pattern: /<=>/g, replacement: "⟺" },
    { pattern: /=>/g, replacement: "⇒" },
    { pattern: /<=/g, replacement: "⇐" },
    { pattern: /->/g, replacement: "→" },
    { pattern: /<-/g, replacement: "←" },
  ];

  // Apply all replacements
  for (const { pattern, replacement } of replacements) {
    text = text.replace(pattern, replacement);
  }

  return text;
}
// Update the formatTextAreaDisplay function
function formatTextAreaDisplay() {
  const textarea = document.getElementById("scrabble-pad");
  if (!textarea) return;

  // Store cursor position
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;

  // Get raw content
  const rawContent = textarea.value;

  // Check if we need to perform replacements (optimization)
  if (/--|<=|=>|<-|->/.test(rawContent)) {
    // Create formatted text
    const formattedContent = prettifySymbols(rawContent);

    // Apply only if changed to avoid cursor jumping
    if (formattedContent !== rawContent) {
      textarea.value = formattedContent;

      // Restore cursor position
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}
