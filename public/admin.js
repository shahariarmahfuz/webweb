const form = document.getElementById("listing-form");
const list = document.getElementById("admin-list");

async function fetchListings() {
  const response = await fetch("/api/listings");
  const payload = await response.json();
  return payload.data || [];
}

function renderListings(listings) {
  if (!listings.length) {
    list.innerHTML = "<p class=\"empty-state\">কোনো লিস্টিং নেই।</p>";
    return;
  }

  list.innerHTML = listings
    .map(
      (listing) => `
        <div class="admin-list-item">
          <div>
            <strong>${listing.title}</strong>
            <div class="listing-meta">
              <span>${listing.price}</span>
              <span>${listing.location}</span>
            </div>
          </div>
          <button data-id="${listing.id}">Delete</button>
        </div>
      `
    )
    .join("");

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      await fetch(`/api/listings/${button.dataset.id}`, {
        method: "DELETE"
      });
      await refreshListings();
    });
  });
}

async function refreshListings() {
  const listings = await fetchListings();
  renderListings(listings);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const payload = {
    title: formData.get("title"),
    price: formData.get("price"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl"),
    description: formData.get("description")
  };

  await fetch("/api/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  form.reset();
  await refreshListings();
});

refreshListings();
