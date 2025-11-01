// ===== PDF Download System =====

// Select all download buttons on the page
const downloadButtons = document.querySelectorAll('.download');

// Loop through and attach event listeners
downloadButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filePath = button.getAttribute('data-pdf'); // Get file path
    if (!filePath) {
      alert('❌ PDF file not found.');
      return;
    }

    // Create a hidden <a> tag to trigger download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop(); // Extract file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: visual feedback
    button.innerText = '📥 Downloading...';
    setTimeout(() => {
      button.innerText = '⬇️ Download';
    }, 2000);
  });
});

// ===== PDF Like System (Real-Time Frontend) =====

// Load saved likes from localStorage
let savedLikes = JSON.parse(localStorage.getItem('pdfLikes')) || {};

// Select all like buttons
const likeButtons = document.querySelectorAll('.like');

// Initialize likes on page load
likeButtons.forEach(button => {
  const pdfId = button.getAttribute('data-pdf-id');
  const count = savedLikes[pdfId] || 0;
  button.innerText = `❤️ ${count}`;
  button.setAttribute('data-likes', count);
});

// Listen for like clicks
likeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const pdfId = button.getAttribute('data-pdf-id');
    let count = parseInt(button.getAttribute('data-likes')) || 0;
    count++;

    // Update UI instantly
    button.innerText = `❤️ ${count}`;
    button.setAttribute('data-likes', count);

    // Save to localStorage (simulate real-time persistence)
    savedLikes[pdfId] = count;
    localStorage.setItem('pdfLikes', JSON.stringify(savedLikes));

    // Add smooth visual feedback
    button.style.transform = 'scale(1.15)';
    button.style.transition = '0.2s ease';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  });
});

// ===== PDF Share System =====

// Select all share buttons
const shareButtons = document.querySelectorAll('.share');

shareButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const pdfName = button.getAttribute('data-pdf-name');
    const pdfLink = button.getAttribute('data-pdf-link');

    // Full shareable URL
    const shareUrl = window.location.origin + '/' + pdfLink;

    // If browser supports native sharing (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: pdfName,
          text: `Check out this PDF: ${pdfName}`,
          url: shareUrl,
        });
        showShareToast('✅ Shared successfully!');
      } catch (err) {
        showShareToast('❌ Share cancelled.');
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showShareToast('🔗 Link copied to clipboard!');
      } catch (err) {
        alert('Could not copy link automatically.');
      }
    }

    // Animation feedback
    button.style.transform = 'scale(0.9)';
    setTimeout(() => (button.style.transform = 'scale(1)'), 150);
  });
});

// ===== Small toast notification for feedback =====
function showShareToast(message) {
  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== PDF Save System (Local Save / Bookmark) =====

// Load saved PDFs from localStorage
let savedPDFs = JSON.parse(localStorage.getItem('savedPDFs')) || [];

// Select all save buttons
const saveButtons = document.querySelectorAll('.save');

// Initialize buttons (restore saved state)
saveButtons.forEach(button => {
  const pdfId = button.getAttribute('data-pdf-id');
  if (savedPDFs.includes(pdfId)) {
    button.innerText = '💾 Saved';
    button.classList.add('saved');
  }
});

// Listen for save button clicks
saveButtons.forEach(button => {
  button.addEventListener('click', () => {
    const pdfId = button.getAttribute('data-pdf-id');
    const pdfName = button.getAttribute('data-pdf-name');

    if (savedPDFs.includes(pdfId)) {
      // Unsave
      savedPDFs = savedPDFs.filter(id => id !== pdfId);
      button.innerText = '💾 Save';
      button.classList.remove('saved');
      showSaveToast(`❌ Removed "${pdfName}" from saved PDFs`);
    } else {
      // Save
      savedPDFs.push(pdfId);
      button.innerText = '💾 Saved';
      button.classList.add('saved');
      showSaveToast(`✅ Saved "${pdfName}"`);
    }

    // Save to localStorage
    localStorage.setItem('savedPDFs', JSON.stringify(savedPDFs));

    // Add a small animation
    button.style.transform = 'scale(0.9)';
    setTimeout(() => (button.style.transform = 'scale(1)'), 150);
  });
});

// ===== Toast Notification =====
function showSaveToast(message) {
  const toast = document.createElement('div');
  toast.className = 'save-toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ===== PDF Comment System =====

// Load saved comments from localStorage
let savedComments = JSON.parse(localStorage.getItem('pdfComments')) || {};

// Select all comment forms
const commentForms = document.querySelectorAll('.comment-form');

// Initialize existing comments on page load
document.querySelectorAll('.pdf-box').forEach(box => {
  const pdfId = box.getAttribute('data-pdf-id');
  const commentList = box.querySelector('.comment-list');
  const comments = savedComments[pdfId] || [];

  comments.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    commentList.appendChild(li);
  });
});

// Handle comment submissions
commentForms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const input = form.querySelector('.comment-input');
    const text = input.value.trim();
    const pdfId = form.closest('.pdf-box').getAttribute('data-pdf-id');
    const commentList = form.closest('.pdf-box').querySelector('.comment-list');

    if (text === '') return;

    // Save to local data
    if (!savedComments[pdfId]) savedComments[pdfId] = [];
    savedComments[pdfId].push(text);
    localStorage.setItem('pdfComments', JSON.stringify(savedComments));

    // Create new comment element
    const li = document.createElement('li');
    li.textContent = text;
    li.classList.add('fade-in');
    commentList.appendChild(li);

    // Clear input and show toast
    input.value = '';
    showCommentToast('💬 Comment added!');
  });
});

// ===== Toast notification for feedback =====
function showCommentToast(message) {
  const toast = document.createElement('div');
  toast.className = 'comment-toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// --- Upload Button Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.querySelector(".bottom-nav .upload");
  
  if (uploadBtn) {
    // Create hidden file input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Click upload button to trigger file picker
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        // You can later send this to server here
        alert(`📂 Uploading "${file.name}" ...`);
        
        // Simulate upload success
        setTimeout(() => {
          alert(`✅ "${file.name}" uploaded successfully!`);
        }, 1500);
      }
    });
  }
});

// --- PDF Search Filter ---
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("pdfSearchInput");
  const pdfBoxes = document.querySelectorAll(".pdf-box");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    pdfBoxes.forEach(box => {
      const pdfName = box.textContent.toLowerCase();
      if (pdfName.includes(query)) {
        box.style.display = "flex";
      } else {
        box.style.display = "none";
      }
    });
  });
});

//firebase.js import statements
import { db, storage, auth } from "./firebase.js";
// You can now use db, storage, and auth in this script
