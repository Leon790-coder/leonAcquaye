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