let offset = 0;
const limit = 10;
let loading = false;
let allPostsLoaded = false;

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

const accentColor = getCookie("accentcolour") ? `#${getCookie("accentcolour")}` : "#007bff";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("button").forEach(button => {
        button.style.backgroundColor = accentColor;
    });
    loadPosts();
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

            data.posts.forEach(post => {
                let formattedContent = post.content.replace(/\n/g, "<br>");
                let newPost = `<div class='post'><p><strong>${post.username}:</strong></p><p>${formattedContent}</p></div>`;
                document.getElementById("posts").insertAdjacentHTML('beforeend', newPost);
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

window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadPosts();
    }
});
