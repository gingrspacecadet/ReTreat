let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;

function getCookie(name) {
    const cookieArr = document.cookie.split("; ");
    for (const cookie of cookieArr) {
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
    loadPosts();

    // Handle infinite scrolling only when DOM is loaded
    window.addEventListener("scroll", handleScroll);
});

async function loadPosts() {
    if (loading || allPostsLoaded) return;

    loading = true;
    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch(`https://getposts.retreat.workers.dev/?offset=${offset}&limit=${limit}`);
        const data = await response.json();

        if (response.ok && data.success) {
            if (data.posts.length === 0) {
                allPostsLoaded = true;
                document.getElementById("loading").innerText = "No more posts.";
                return;
            }

            const postsContainer = document.getElementById("posts");

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
        document.getElementById("loading").innerText = "Failed to load posts.";
    } finally {
        loading = false;
        document.getElementById("loading").style.display = "none";
    }
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 100;

    if (scrollPosition >= threshold) {
        loadPosts();
    }
}
