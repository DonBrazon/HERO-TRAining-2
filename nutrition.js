let totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
};

function updateNutritionDisplay() {
    document.getElementById("totalCalories").textContent =
        Math.round(totals.calories);

    document.getElementById("totalProtein").textContent =
        totals.protein.toFixed(1) + " g";

    document.getElementById("totalCarbs").textContent =
        totals.carbs.toFixed(1) + " g";

    document.getElementById("totalFat").textContent =
        totals.fat.toFixed(1) + " g";

    document.getElementById("totalFiber").textContent =
        totals.fiber.toFixed(1) + " g";
}

document.querySelectorAll(".add-food").forEach(button => {

    button.addEventListener("click", function () {

        const food = this.closest(".food-result");

        totals.calories += Number(food.dataset.calories);
        totals.protein += Number(food.dataset.protein);
        totals.carbs += Number(food.dataset.carbs);
        totals.fat += Number(food.dataset.fat);
        totals.fiber += Number(food.dataset.fiber);

        updateNutritionDisplay();

        this.textContent = "AJOUTÉ ✓";

        setTimeout(() => {
            this.textContent = "AJOUTER";
        }, 1000);
    });

});


document.querySelectorAll(".food-tool").forEach(tool => {

    tool.addEventListener("click", function () {

        document.querySelectorAll(".food-tool")
            .forEach(t => t.classList.remove("active"));

        this.classList.add("active");

    });

});