let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (name === key) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

const accentColor = getCookie("accentcolour") ? `#${getCookie("accentcolour")}` : "#007bff";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("button").forEach(button => {
        button.style.backgroundColor = accentColor;
    });

    // Load initial posts and attach scroll listener
    loadPosts();
    window.addEventListener("scroll", handleScroll);
});

async function loadPosts() {
    if (loading || allPostsLoaded) return;

    loading = true;
    const loadingIndicator = document.getElementById("loading");
    loadingIndicator.style.display = "block";

    try {
        const response = await fetch(`https://getposts.retreat.workers.dev/?offset=${offset}&limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.success) {
            const postsContainer = document.getElementById("posts");

            if (data.posts.length === 0) {
                allPostsLoaded = true;
                loadingIndicator.innerText = "No more posts.";
                return;
            }

            data.posts.forEach(post => {
                const formattedContent = post.content.replace(/\n/g, "<br>");
                const newPost = document.createElement("div");
                newPost.className = "post";
                newPost.innerHTML = `
                    <p><strong>${post.username}:</strong></p>
                    <p>${formattedContent}</p>`;
                postsContainer.appendChild(newPost);
            });

            offset += limit; // Update offset for next batch
        } else {
            throw new Error("Failed to fetch posts.");
        }
    } catch (error) {
        console.error("Error:", error);
        loadingIndicator.innerText = "Failed to load posts.";
    } finally {
        loading = false;
        loadingIndicator.style.display = "none";
    }
}

function handleScroll() {
    console.log("Scroll Position:", window.innerHeight + window.scrollY); // Debugging line
    console.log("Document Height:", document.documentElement.scrollHeight); // Debugging line

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 100;

    if (scrollPosition >= threshold) {
        console.log("Threshold reached!");
        loadPosts();
    }
}