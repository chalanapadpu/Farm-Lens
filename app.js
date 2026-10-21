
"use strict";

// ------------------------------------
// 1. Demo produce listings
// ------------------------------------

const initialProduce = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        farmer: "Demo Farmer 1",
        category: "Vegetables",
        emoji: "🍅",
        price: 30,
        quantity: 50,
        location: "Mangaluru",
        description: "Freshly harvested tomatoes."
    },
    {
        id: 2,
        name: "Organic Bananas",
        farmer: "Demo Farmer 2",
        category: "Fruits",
        emoji: "🍌",
        price: 45,
        quantity: 35,
        location: "Udupi",
        description: "Ripe bananas from a demo farm."
    },
    {
        id: 3,
        name: "Fresh Green Chillies",
        farmer: "Demo Farmer 3",
        category: "Vegetables",
        emoji: "🌶️",
        price: 60,
        quantity: 20,
        location: "Sullia",
        description: "Fresh green chillies."
    },
    {
        id: 4,
        name: "Raw Rice",
        farmer: "Demo Farmer 4",
        category: "Grains",
        emoji: "🌾",
        price: 40,
        quantity: 100,
        location: "Puttur",
        description: "Rice available for bulk enquiries."
    },
    {
        id: 5,
        name: "Fresh Coconuts",
        farmer: "Demo Farmer 5",
        category: "Other",
        emoji: "🥥",
        price: 25,
        quantity: 80,
        location: "Mangaluru",
        description: "Fresh coconuts from a demo listing."
    },
    {
        id: 6,
        name: "Sweet Mangoes",
        farmer: "Demo Farmer 6",
        category: "Fruits",
        emoji: "🥭",
        price: 70,
        quantity: 25,
        location: "Udupi",
        description: "Seasonal mangoes in this demo."
    }
];

const STORAGE_KEY = "farmlens-produce";

// ------------------------------------
// 2. Load and save produce listings
// ------------------------------------

function loadProduce() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Could not load saved listings:", error);
    }

    return initialProduce.map(item => ({ ...item }));
}

let produce = loadProduce();

function saveProduce() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(produce));
        return true;
    } catch (error) {
        console.error("Could not save listings:", error);
        alert("Your listing could not be saved in this browser.");
        return false;
    }
}

// ------------------------------------
// 3. Connect JavaScript to HTML
// ------------------------------------

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const sortSelect = document.getElementById("sortSelect");
const categoryFilter = document.getElementById("categoryFilter");
const locationFilter = document.getElementById("locationFilter");

const produceContainer = document.getElementById("foodContainer");
const resultsLabel = document.getElementById("resultsLabel");
const produceCount = document.getElementById("produceCount");

const farmerForm = document.getElementById("farmerForm");

// ------------------------------------
// 4. Helper functions
// ------------------------------------

function formatPrice(amount) {
    const price = Number(amount);

    if (!Number.isFinite(price)) {
        return "₹0";
    }

    return "₹" + price.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function normalizeCategory(value) {
    const category = String(value ?? "").trim().toLowerCase();

    const aliases = {
        vegetable: "vegetables",
        vegetables: "vegetables",
        fruit: "fruits",
        fruits: "fruits",
        grain: "grains",
        grains: "grains",
        other: "others",
        others: "others"
    };

    return aliases[category] || category;
}

function getEmoji(category) {
    const emojis = {
        vegetables: "🥬",
        fruits: "🍎",
        grains: "🌾",
        others: "🌱"
    };

    return emojis[normalizeCategory(category)] || "🌱";
}

// ------------------------------------
// 5. Update the location dropdown
// ------------------------------------

function updateLocationOptions() {
    if (!locationFilter) return;

    const previousValue = locationFilter.value;

    const locations = [
        ...new Set(
            produce
                .map(item => String(item.location ?? "").trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b));

    locationFilter.innerHTML =
        '<option value="all">All locations</option>';

    locations.forEach(location => {
        const option = document.createElement("option");

        option.value = location;
        option.textContent = location;

        locationFilter.appendChild(option);
    });

    if (locations.includes(previousValue)) {
        locationFilter.value = previousValue;
    } else {
        locationFilter.value = "all";
    }
}

// ------------------------------------
// 6. Create a produce card
// ------------------------------------


function createProduceCard(item) {
    const phone = String(item.phone || item.farmerPhone || "")
        .replace(/\D/g, "")
        .replace(/^0/, "");

    const validPhone = /^[6-9]\d{9}$/.test(phone);

    const locationDetails = [
        item.village || item.farmerVillage || item.location,
        item.district || item.farmerDistrict
    ].filter(Boolean).join(", ");

    const whatsappNumber = validPhone ? `91${phone}` : "";

    return `
        <article class="food-card">
            <div class="food-card-head">
                <div class="food-emoji" aria-hidden="true">
                    ${escapeHTML(item.emoji || getEmoji(item.category))}
                </div>

                <span class="best-badge">DIRECT FROM FARM</span>
            </div>

            <h3>${escapeHTML(item.name)}</h3>

            <p class="restaurant">
                ${escapeHTML(item.farmer)} ·
                ${escapeHTML(item.category)}
            </p>

            <p class="rating">
                📍 ${escapeHTML(locationDetails || "Location not provided")}
            </p>

            <div class="platform-comparison">
                <div class="platform-row">
                    <div class="platform-name">Price per kg</div>
                    <div class="platform-price">
                        <strong>${formatPrice(item.price)}</strong>
                        <small>Seller-provided demo price</small>
                    </div>
                </div>

                <div class="platform-row">
                    <div class="platform-name">Available quantity</div>
                    <div class="platform-price">
                        <strong>${Number(item.quantity)} kg</strong>
                    </div>
                </div>
            </div>

            <p class="restaurant">
                ${escapeHTML(
        item.description || "Contact the farmer for details."
    )}
            </p>

            ${validPhone
            ? `
                        <div class="farmer-contact-actions">
                            <a
                                class="review-button enquiry-button"
                                href="tel:${phone}"
                                aria-label="Call farmer ${escapeHTML(item.farmer)}"
                            >
                                📞 Call Farmer
                            </a>

                            <a
                                class="review-button enquiry-button"
                                href="https://wa.me/${whatsappNumber}"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Contact farmer on WhatsApp"
                            >
                                WhatsApp
                            </a>
                        </div>
                    `
            : `
                        <p class="restaurant">
                            Contact number not available. Please use the enquiry option.
                        </p>
                    `
        }

            <button
                class="review-button enquiry-button"
                type="button"
                data-id="${Number(item.id)}"
                aria-label="Enquire about ${escapeHTML(item.name)}"
            >
                <span>✉ Enquire with Farmer</span>
                <span aria-hidden="true">→</span>
            </button>
        </article>
    `;
}

// ------------------------------------
// 7. Search, filter and sort listings
// ------------------------------------

function renderProduce() {
    if (!produceContainer) {
        console.error(
            'Could not find the element with id="foodContainer".'
        );
        return;
    }

    // Refresh available locations before reading the selected location.
    updateLocationOptions();

    const searchTerm =
        searchInput?.value.trim().toLowerCase() || "";

    const category = categoryFilter?.value || "all";
    const location = locationFilter?.value || "all";

    let filtered = produce.filter(item => {
        const searchableText = [
            item.name,
            item.farmer,
            item.category,
            item.location,
            item.description
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            category === "all" ||
            normalizeCategory(item.category) ===
            normalizeCategory(category);

        const matchesLocation =
            location === "all" ||
            String(item.location ?? "").trim().toLowerCase() ===
            location.trim().toLowerCase();

        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort by the selected price order.
    const sort = sortSelect?.value || "low";

    if (sort === "low") {
        filtered.sort(
            (a, b) => Number(a.price) - Number(b.price)
        );
    } else if (sort === "high") {
        filtered.sort(
            (a, b) => Number(b.price) - Number(a.price)
        );
    }

    // Update the listing count.
    if (produceCount) {
        produceCount.textContent =
            String(filtered.length).padStart(2, "0");
    }

    if (resultsLabel) {
        resultsLabel.textContent =
            `${filtered.length} PRODUCE LISTINGS`;
    }

    if (clearSearch) {
        clearSearch.style.display =
            searchTerm ? "block" : "none";
    }

    // Display a helpful message when nothing matches.
    if (filtered.length === 0) {
        produceContainer.innerHTML = `
            <div class="empty-state">
                <strong>No produce found</strong>
                <p>
                    Try a different crop name, category or location.
                </p>
            </div>
        `;

        return;
    }

    // Display the matching produce cards.
    produceContainer.innerHTML =
        filtered.map(createProduceCard).join("");
}

// ------------------------------------
// 8. Search and filter event listeners
// ------------------------------------

searchInput?.addEventListener("input", renderProduce);

sortSelect?.addEventListener("change", renderProduce);

categoryFilter?.addEventListener("change", renderProduce);

locationFilter?.addEventListener("change", renderProduce);

clearSearch?.addEventListener("click", () => {
    if (searchInput) {
        searchInput.value = "";
    }

    renderProduce();
    searchInput?.focus();
});

// ------------------------------------
// 9. Buyer enquiry demonstration
// ------------------------------------

produceContainer?.addEventListener("click", event => {
    const button = event.target.closest(".enquiry-button");

    if (!button) return;

    const item = produce.find(
        product => product.id === Number(button.dataset.id)
    );

    if (!item) return;

    alert(
        "Demo buyer enquiry\n\n" +
        `Produce: ${item.name}\n` +
        `Farmer: ${item.farmer}\n` +
        `Price: ${formatPrice(item.price)} per kg\n` +
        `Available quantity: ${item.quantity} kg\n` +
        `Location: ${item.location}\n\n` +
        "This is a prototype. Real messaging requires a backend."
    );
});


// ------------------------------------
// 10. Add a new farmer listing
// ------------------------------------

farmerForm?.addEventListener("submit", event => {
    event.preventDefault();

    const name =
        document.getElementById("produceName")?.value.trim() || "";

    const farmer =
        document.getElementById("farmerName")?.value.trim() || "";

    const category =
        document.getElementById("produceCategory")?.value || "";

    const price = Number(
        document.getElementById("producePrice")?.value
    );

    const quantity = Number(
        document.getElementById("produceQuantity")?.value
    );

    const location =
        document.getElementById("farmerLocation")?.value.trim() || "";

    const phone =
        document.getElementById("farmerPhone")?.value.trim() || "";
    const village = location;
    const district =
        document.getElementById("farmerDistrict")?.value.trim() || "";

    const description =
        document.getElementById("produceDescription")?.value.trim() || "";


    const errors = [];

    if (!name) errors.push("Produce name");
    if (!farmer) errors.push("Farmer name");
    if (!category) errors.push("Category");
    if (!location) errors.push("Location");
    if (!village) errors.push("Village");
    if (!district) errors.push("District");
    if (phone !== "" && !/^[6-9]\d{9}$/.test(phone)) {
        errors.push("Valid 10-digit phone number");
    }
    if (!Number.isFinite(price) || price <= 0) errors.push("Price");
    if (!Number.isFinite(quantity) || quantity <= 0) {
        errors.push("Available quantity");
    }

    if (errors.length > 0) {
        alert("Please check these fields:\n" + errors.join("\n"));
        return;
    }
    const newItem = {
        id: Date.now(),
        name,
        farmer,
        category: normalizeCategory(category),
        emoji: getEmoji(category),
        price,
        quantity,
        location,
        phone,
        village,
        district,
        description
    };

    // Add and save the new listing.
    produce.unshift(newItem);

    if (!saveProduce()) {
        produce.shift();
        return;
    }

    farmerForm.reset();

    // Clear existing filters to show the new listing.
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (locationFilter) locationFilter.value = "all";
    if (sortSelect) sortSelect.value = "low";

    renderProduce();

    alert("Your produce listing was added successfully!");
});

// ------------------------------------


// ------------------------------------
// 11. Start the application
// ------------------------------------

renderProduce();
