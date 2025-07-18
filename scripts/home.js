let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;
const baseDomain = window.location.hostname.includes("canary-ec4") 
  ? "canary" 
  : "";
const base64Pattern = /data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+/g;

let uploadedImages = [];
let fileInput; // Define fileInput here
// Function to get the cookie value by name
function getCookie(name) {
    let cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Retrieve accent color from cookie
const accentColor = getCookie("accentcolour") ? `#${getCookie("accentcolour")}` : "#007bff"; // Default color

document.addEventListener("DOMContentLoaded", function () {
    // Set accent color for all buttons
    document.querySelectorAll("button").forEach(button => {
        button.style.backgroundColor = accentColor;
    });
  
    // Get Dark Mode settings and apply
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("mode-toggle").innerHTML = '<img src="/assets/sun.png" width="40" height="40">';
    } else {
        document.getElementById("mode-toggle").innerHTML = '<img src="/assets/moon.png" width="40" height="40">';
    }

    const postBox = document.getElementById("postContent");
    const postButton = document.querySelector(".post-box button");
    const postsContainer = document.getElementById("posts");

    postBox.addEventListener("focus", () => {
        postBox.style.height = "10vh";
        postButton.style.display = "inline-block";
        document.querySelector(".upload-label").style.display = "inline-block"; // Show upload label
        postsContainer.style.height = "calc(80vh - 20vh)";
    });

    postBox.addEventListener("blur", () => {
        if (postBox.value.trim() === "") {
            postBox.style.height = "2vh";
            postButton.style.display = "none";
            document.querySelector(".upload-label").style.display = "none"; // Hide upload label
            postsContainer.style.height = "calc(80vh - 12vh)";
        }
    });

    loadPosts(); // Load posts when the page loads

    // Load more posts when you scroll to the bottom
    document.getElementById("posts").addEventListener("scrollend", (event) => {
        loadPosts();
    });

    fileInput = document.getElementById("uploadImage"); // Initialize fileInput here
    fileInput.addEventListener('change', uploadImage);
});

function settings() {
    window.location.href = 'settings.html';
}

function logout() {
    window.location.href = 'logout.php';
}

// Function to check if a string contains a valid base64 image
function containsBase64Image(str) {
    return base64Pattern.test(str);
}

// Function to replace base64 image strings with <img> tags
function replaceBase64Images(str) {
    return str.replace(base64Pattern, match => `<img src="${match}" alt="Image" />`);
}

// Function to load posts from the Worker API
async function loadPosts() {
    if (loading || allPostsLoaded) return;
    loading = true;
    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch(`/api/getposts?offset=${offset}&limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.success) {
            if (data.posts.length === 0) {
                allPostsLoaded = true;
                document.getElementById("loading").innerText = "No more posts.";
                return;
            }

            data.posts.forEach(post => {
                let formattedContent = markdown.toHTML(post.content); // Parse and render Markdown

                // Check if the content contains a base64 image and replace it with an <img> tag
                if (containsBase64Image(post.content)) {
                    formattedContent = replaceBase64Images(formattedContent);
                }

                let newPost = `<div class='post'><p><strong>${post.username}:</strong></p><p>${formattedContent}</p></div>`;
                document.getElementById("posts").innerHTML += newPost;
            });

            offset += limit;
        } else {
            throw new Error("Failed to fetch posts.");
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("loading").innerText = "Failed to load posts.";
    } finally {
        loading = false;
        document.getElementById("loading").style.display = "none";
    }
}

// Function to submit a new post to the Worker API
function submitPost() {
    let content = document.getElementById("postContent").value.trim();
    for (let image of uploadedImages) {
        content += " " + image;
    }
    let username = getCookie("username"); // Retrieve username from cookie

    if (!username) {
        document.getElementById("message").innerText = "You must be logged in to post!";
        document.getElementById("message").style.color = "red";
        return;
    }

    if (content === "") {
        document.getElementById("message").innerText = "Post cannot be empty!";
        document.getElementById("message").style.color = "red";
        return;
    }

    fetch(`/api/createpost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("message").innerText = "Post successful!";
            document.getElementById("message").style.color = "green";

            let newPost = `<div class='post'><p><strong>${username}:</strong></p><p>${markdown.toHTML(content)}</p></div>`; // Parse and render Markdown
            document.getElementById("posts").insertAdjacentHTML('afterbegin', newPost);
        } else {
            document.getElementById("message").innerText = "Error: " + data.error;
            document.getElementById("message").style.color = "red";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("message").innerText = "Server error.";
        document.getElementById("message").style.color = "red";
    });

    document.getElementById("postContent").value = "";
}

function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const modeButton = document.getElementById("mode-toggle");

    if (document.body.classList.contains("dark-mode")) {
        modeButton.innerHTML = '<img src="/assets/sun.png" width="40" height="40">';
        localStorage.setItem("dark-mode", "true");
    } else {
        modeButton.innerHTML = '<img src="/assets/moon.png" width="40" height="40">';
        localStorage.setItem("dark-mode", "false");
    }
}

// Handle image uploading
async function uploadImage() {
    let files = fileInput.files;
    if (files.length === 0) {
        alert("no files selected");
        return;
    }

    for (let file of files) {
        uploadedImages.push(await convertToWebPBase64(file));
    }
}

async function convertToWebPBase64(file) {
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async function(event) {
        const img = new Image();
        img.onload = async function() {
          // Resize the image (using maxPixels)
          const maxPixels = 800 * 600; // Adjust as needed (e.g., 480000)
          let width = img.width;
          let height = img.height;
          const totalPixels = width * height;
  
          if (totalPixels > maxPixels) {
            const scaleRatio = Math.sqrt(maxPixels / totalPixels);
            width = Math.round(width * scaleRatio);
            height = Math.round(height * scaleRatio);
          }
  
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          const webpBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
          const webpBuffer = await webpBlob.arrayBuffer();
          const webpBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(webpBuffer)));
  
          resolve("data:image/webp;base64," + webpBase64);
        };
        img.src = event.target.result;
      };
  
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  async function convertBase64ToPNG() {
    const base64Input = document.getElementById('base64Input').value;
    try {
      const binaryString = atob(base64Input);
      const byteArr = new Uint8Array(binaryString.length);
      const progressBar = document.getElementById('progressBar').querySelector('div');
      const totalBytes = binaryString.length;
  
      for (let i = 0; i < binaryString.length; i++) {
        byteArr[i] = binaryString.charCodeAt(i);
        const progress = (i + 1) / totalBytes * 100;
        progressBar.style.width = progress + '%';
      }
  
      const webpBlob = new Blob([byteArr], {
        type: 'image/webp'
      });
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted_image.png';
  
          requestAnimationFrame(() => {
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            progressBar.style.width = '0%';
          });
        }, 'image/png');
      }
      img.src = URL.createObjectURL(webpBlob);
    } catch (error) {
      console.error("Decompression error:", error);
      alert("Decompression error: " + error);
      document.getElementById('progressBar').querySelector('div').style.width = '0%';
    }
  }
  
  async function convertBase64ToWebP() {
    const base64Input = document.getElementById('base64Input').value;
    try {
      const binaryString = atob(base64Input);
      const byteArr = new Uint8Array(binaryString.length);
      const progressBar = document.getElementById('progressBar').querySelector('div');
      const totalBytes = binaryString.length;
  
      for (let i = 0; i < binaryString.length; i++) {
        byteArr[i] = binaryString.charCodeAt(i);
        const progress = (i + 1) / totalBytes * 100;
        progressBar.style.width = progress + '%';
      }
  
      const webpBlob = new Blob([byteArr], {
        type: 'image/webp'
      });
      const url = URL.createObjectURL(webpBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_image.webp';
  
      requestAnimationFrame(() => {
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        progressBar.style.width = '0%';
      });
    } catch (error) {
      console.error("Decompression error:", error);
      alert("Decompression error: " + error);
      document.getElementById('progressBar').querySelector('div').style.width = '0%';
    }
  }