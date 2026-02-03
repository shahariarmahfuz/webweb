async function loadListings() {
  const grid = document.getElementById("listing-grid");
  const count = document.getElementById("listing-count");

  try {
    const response = await fetch("/api/listings");
    const payload = await response.json();
    const listings = payload.data || [];

    count.textContent = `${listings.length}+`;

    if (!listings.length) {
      grid.innerHTML =
        "<p class=\"empty-state\">কোনো লিস্টিং নেই। অ্যাডমিন প্যানেল থেকে নতুন লিস্টিং যুক্ত করুন।</p>";
      return;
    }

    grid.innerHTML = listings
      .map(
        (listing) => `
          <article class="listing-card">
            <img src="${listing.image_url}" alt="${listing.title}" />
            <div class="listing-content">
              <h3>${listing.title}</h3>
              <p>${listing.description}</p>
              <div class="listing-meta">
                <span class="badge">${listing.category}</span>
                <span class="badge">${listing.condition}</span>
                <span>${listing.location}</span>
              </div>
              <strong>${listing.price}</strong>
            </div>
          </article>
        `
      )
      .join("");
  } catch (error) {
    grid.innerHTML =
      "<p class=\"empty-state\">ডেটা লোড করা যাচ্ছে না। একটু পর চেষ্টা করুন।</p>";
  }
}

loadListings();
