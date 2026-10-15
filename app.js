
const foods = [
    { name: "Chicken Biryani", restaurant: "Spice Route Kitchen", category: "Biryani", emoji: "🍛", rating: 4.5, swiggy: 189, swiggyFee: 28, zomato: 205, zomatoFee: 24, review: "Example review insight: flavour and portion size." },
    { name: "Margherita Pizza", restaurant: "The Pizza Studio", category: "Pizza", emoji: "🍕", rating: 4.3, swiggy: 229, swiggyFee: 25, zomato: 215, zomatoFee: 32, review: "Example review insight: cheese topping and crisp crust." },
    { name: "Classic Veg Burger", restaurant: "Burger Barn", category: "Burger", emoji: "🍔", rating: 4.1, swiggy: 119, swiggyFee: 20, zomato: 109, zomatoFee: 25, review: "Example review insight: price and convenience." },
    { name: "Masala Dosa", restaurant: "Coastal Tiffin House", category: "South Indian", emoji: "🥞", rating: 4.6, swiggy: 85, swiggyFee: 18, zomato: 92, zomatoFee: 16, review: "Example review insight: crisp texture and chutney." },
    { name: "Paneer Biryani", restaurant: "Spice Route Kitchen", category: "Biryani", emoji: "🍲", rating: 4.2, swiggy: 169, swiggyFee: 26, zomato: 155, zomatoFee: 29, review: "Example review insight: flavour and paneer texture." },
    { name: "Farmhouse Pizza", restaurant: "The Pizza Studio", category: "Pizza", emoji: "🍕", rating: 4.4, swiggy: 299, swiggyFee: 30, zomato: 279, zomatoFee: 35, review: "Example review insight: vegetable toppings and variety." }
];

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("clearSearch");
const sortSelect = document.getElementById("sortSelect");
const budgetFilter = document.getElementById("budgetFilter");
const foodContainer = document.getElementById("foodContainer");
const resultsLabel = document.getElementById("resultsLabel");
const foodCount = document.getElementById("foodCount");

function totalCost(food, platform) {
    return food[platform] + food[platform + "Fee"];
}

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function getBestPlatform(food) {
    const swiggyTotal = totalCost(food, "swiggy");
    const zomatoTotal = totalCost(food, "zomato");

    if (swiggyTotal <= zomatoTotal) {
        return {
            name: "Swiggy",
            total: swiggyTotal,
            savings: zomatoTotal - swiggyTotal
        };
    }

    return {
        name: "Zomato",
        total: zomatoTotal,
        savings: swiggyTotal - zomatoTotal
    };
}

function createFoodCard(food) {
    const best = getBestPlatform(food);

    return `
        <article class="food-card">
            <div class="food-card-head">
                <div class="food-emoji">${food.emoji}</div>
                <span class="best-badge">
                    ✦ ${best.savings === 0 ? "EQUAL PRICE" : "BEST VALUE: " + best.name}
                </span>
            </div>

            <h3>${food.name}</h3>
            <p class="restaurant">${food.restaurant} · ${food.category}</p>
            <p class="rating">
                ★ ${food.rating.toFixed(1)}
                <small>Illustrative rating</small>
            </p>

            <div class="platform-comparison">
                <div class="platform-row">
                    <div class="platform-name">
                        <span class="platform-mark swiggy"></span>
                        <span>Swiggy</span>
                    </div>
                    <div class="platform-price">
                        <strong>${formatPrice(food.swiggy)}</strong>
                        <small>+ ${formatPrice(food.swiggyFee)} demo delivery fees</small>
                        <small>Total: ${formatPrice(totalCost(food, "swiggy"))}</small>
                    </div>
                </div>

                <div class="platform-row">
                    <div class="platform-name">
                        <span class="platform-mark zomato"></span>
                        <span>Zomato</span>
                    </div>
                    <div class="platform-price">
                        <strong>${formatPrice(food.zomato)}</strong>
                        <small>+ ${formatPrice(food.zomatoFee)} demo fees</small>
                        <small>Total: ${formatPrice(totalCost(food, "zomato"))}</small>
                    </div>
                </div>
            </div>

            <div class="total-price">
                <div class="total-line">
                    <span>Lowest estimated total</span>
                    <strong>${formatPrice(best.total)}</strong>
                </div>
                <p class="winner-label">
                    ${best.name} · ${formatPrice(best.savings)} less in this demo
                </p>
            </div>

            <button class="review-button" type="button" aria-expanded="false">
                <span>✳ View Review Insights</span>
                <span class="review-arrow">＋</span>
            </button>

            <div class="review-details">
                ${food.review}
                <strong>Illustrative example, not verified customer reviews or AI analysis.</strong>
            </div>
        </article>
    `;
}

function renderFoods() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const budget = budgetFilter ? budgetFilter.value : "all";

    const filteredFoods = foods.filter(food => {
        const matchesSearch =
            food.name.toLowerCase().includes(searchTerm) ||
            food.restaurant.toLowerCase().includes(searchTerm) ||
            food.category.toLowerCase().includes(searchTerm);

        const matchesBudget =
            budget === "all" ||
            getBestPlatform(food).total < Number(budget);

        return matchesSearch && matchesBudget;
    });

    if (sortSelect.value === "low") {
        filteredFoods.sort((a, b) =>
            getBestPlatform(a).total - getBestPlatform(b).total
        );
    } else if (sortSelect.value === "high") {
        filteredFoods.sort((a, b) =>
            getBestPlatform(b).total - getBestPlatform(a).total
        );
    } else if (sortSelect.value === "rating") {
        filteredFoods.sort((a, b) => b.rating - a.rating);
    }

    foodCount.textContent = String(filteredFoods.length).padStart(2, "0");
    resultsLabel.textContent = `${filteredFoods.length} OPTIONS`;

    searchButton.style.display = searchTerm ? "block" : "none";

    const savingsElement = document.getElementById("totalSavings");
    if (savingsElement) {
        const savings = filteredFoods.reduce(
            (sum, food) => sum + getBestPlatform(food).savings, 0
        );
        savingsElement.textContent = formatPrice(savings);
    }

    if (filteredFoods.length === 0) {
        foodContainer.innerHTML = `
            <div class="empty-state">
                <strong>No food found</strong>
                <p>Try another search or budget.</p>
            </div>
        `;
        return;
    }

    foodContainer.innerHTML = filteredFoods.map(createFoodCard).join("");
}

searchInput.addEventListener("input", renderFoods);
sortSelect.addEventListener("change", renderFoods);
budgetFilter.addEventListener("change", renderFoods);

if (budgetFilter) {
    budgetFilter.addEventListener("change", renderFoods);
}

searchButton.addEventListener("click", () => {
    searchInput.value = "";
    renderFoods();
    searchInput.focus();
});

foodContainer.addEventListener("click", event => {
    const button = event.target.closest(".review-button");
    if (!button) return;

    const details = button.nextElementSibling;
    const opening = !details.classList.contains("visible");

    details.classList.toggle("visible", opening);
    button.setAttribute("aria-expanded", String(opening));
    button.querySelector(".review-arrow").textContent = opening ? "−" : "＋";
    button.querySelector("span:first-child").textContent =
        opening ? "✳ Hide Review Insights" : "✳ View Review Insights";
});

renderFoods();
