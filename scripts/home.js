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
    const postArea = document.getElementById("main-post-box");
    const postButtons = document.querySelectorAll(".post-box button");
    const postsContainer = document.getElementById("posts");
    const fileInputButton = document.querySelector(".upload-button");
    
    postArea.addEventListener("focusin", () => {
        postBox.style.height = "10vh";
        postButtons.forEach((button) => {
          button.style.display = "inline-block";
        });
        //document.querySelector(".upload-label").style.display = "inline-block"; // Show upload label
        postsContainer.style.height = "calc(80vh - 20vh)";
    });

    postArea.addEventListener("focusout", () => {
        setTimeout(() => {
            if (postBox.value.trim() === "" && !postArea.contains(document.activeElement) && uploadedImages.length == 0) {
                postBox.style.height = "2vh";
                postButtons.forEach((button) => {
                    button.style.display = "none";
                });
                //document.querySelector(".upload-label").style.display = "none"; // Hide upload label
                postsContainer.style.height = "calc(80vh - 12vh)";
            }
        }, 0); // Use a 0ms delay to run the code after the current event loop);
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
async function replaceBase64Images(str) {
    const promises = [];
    let parts = str.split(base64Pattern);
    for (let i = 1; i < parts.length; i += 2) {
        promises.push(convertBase64ToWebP(parts[i]).then(url => {
            if (url) {
                parts[i] = `<img src="${url}" alt="Image" />`;
            } else {
                parts[i] = "";
            }
        }));
    }
    await Promise.all(promises);
    return parts.join("");
}

// Function to load posts from the Worker API
async function loadPosts() {
    if (loading || allPostsLoaded) return;
    loading = true;
    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch(`https://${baseDomain}getposts.retreat.workers.dev/?offset=${offset}&limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.success) {
            if (data.posts.length === 0) {
                allPostsLoaded = true;
                document.getElementById("loading").innerText = "No more posts.";
                return;
            }

            // Create an array of promises for each post's content replacement
            const postPromises = data.posts.map(async post => {
                let formattedContent = markdown.toHTML(post.content);

                if (containsBase64Image(post.content)) {
                    formattedContent = await replaceBase64Images(formattedContent);
                }

                return `<div class='post'><p><strong>${post.username}:</strong></p><p>${formattedContent}</p></div>`;
            });

            // Wait for all promises to resolve
            const newPosts = await Promise.all(postPromises);

            // Append all new posts to the DOM
            document.getElementById("posts").innerHTML += newPosts.join("");

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

    fetch(`https://${baseDomain}createpost.retreat.workers.dev`, {
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

//Add pre-processing here
function triggerUploadImage() {
    fileInput.click();
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
  
  async function convertBase64ToPNG(base64Input) {
    try {
      const binaryString = atob(base64Input);
      const byteArr = new Uint8Array(binaryString.length);
      const totalBytes = binaryString.length;
  
      for (let i = 0; i < binaryString.length; i++) {
        byteArr[i] = binaryString.charCodeAt(i);
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
        }, 'image/png');
      }
      img.src = URL.createObjectURL(webpBlob);
    } catch (error) {
      console.error("Decompression error:", error);
      alert("Decompression error: " + error);
      document.getElementById('progressBar').querySelector('div').style.width = '0%';
    }
  }
  
  async function convertBase64ToWebP(base64Input) {
    try {
      const binaryString = atob(base64Input);
      const byteArr = new Uint8Array(binaryString.length);
      const totalBytes = binaryString.length;
  
      for (let i = 0; i < binaryString.length; i++) {
        byteArr[i] = binaryString.charCodeAt(i);
      }
  
      const webpBlob = new Blob([byteArr], {
        type: 'image/webp'
      });
      
      const url = URL.createObjectURL(webpBlob);
      return url;
  
    } catch (error) {
      console.error("Decompression error:", error);
      alert("Decompression error: " + error);
      document.getElementById('progressBar').querySelector('div').style.width = '0%';
    }
  }
