import { dataSources } from "./config.js";
import { setView, getCurrentView } from "./dataManager.js";

// Create UI controls dynamically
export function createControls() {
    const container = document.querySelector(".filters-container");
    if (!container) {
        console.error("Filters container not found");
        return;
    }

    // Clear existing controls (except toggle button)
    const existingControls = container.querySelector(".heatmap-controls");
    if (existingControls) {
        existingControls.remove();
    }

    // Create controls wrapper
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "heatmap-controls";

    // const title = document.createElement("h3");
    // title.textContent = "Visualizzazione Dati";
    // controlsWrapper.appendChild(title);

    // Create controls for each data source
    dataSources.forEach((source) => {
        const sourceControl = createSourceControl(source);
        controlsWrapper.appendChild(sourceControl);
    });

    // Add controls to container
    container.appendChild(controlsWrapper);

    // Create mobile toggle button (outside the container)
    createMobileToggle(container);

    // Set initial state for mobile: menu hidden by default
    initializeMobileState(container);
}

// Initialize mobile state - hide menu on mobile by default
function initializeMobileState(container) {
    // Check if we're on mobile
    if (window.innerWidth <= 768) {
        container.classList.add("mobile-hidden");
        const toggleBtn = document.querySelector(".mobile-toggle-btn");
        if (toggleBtn) {
            toggleBtn.classList.remove("menu-open");
        }
    }
}

// Create mobile toggle button - appended to body, not container
function createMobileToggle(container) {
    // Remove existing toggle button if any
    const existingBtn = document.querySelector(".mobile-toggle-btn");
    if (existingBtn) {
        existingBtn.remove();
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-toggle-btn";
    toggleBtn.innerHTML = `
        <span class="caret">▼</span>
        <span>Menu</span>
    `;

    // Toggle menu on click
    toggleBtn.addEventListener("click", () => {
        const isOpen = !container.classList.contains("mobile-hidden");

        if (isOpen) {
            // Close menu
            container.classList.add("mobile-hidden");
            toggleBtn.classList.remove("menu-open");
        } else {
            // Open menu
            container.classList.remove("mobile-hidden");
            toggleBtn.classList.add("menu-open");
        }
    });

    // Append to body instead of container so it stays visible
    document.body.appendChild(toggleBtn);
}

// Create control group for a single data source
function createSourceControl(source) {
    const group = document.createElement("div");
    group.className = "control-group";

    // Source title with color indicator
    const header = document.createElement("div");
    header.className = "source-header";
    header.innerHTML = `
        <span class="color-indicator" style="background-color: ${source.color}"></span>
        <span class="source-name">${source.name}</span>
    `;
    group.appendChild(header);

    // Radio options container
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "radio-options";

    // Create radio options
    const options = [
        { value: "pins", label: "Pin" },
        { value: "heatmap", label: "Heatmap" },
        // { value: "none", label: "Nascondi" },
    ];

    options.forEach((option) => {
        const label = document.createElement("label");
        label.className = "radio-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `view-${source.id}`;
        radio.value = option.value;
        radio.checked = source.defaultView === option.value;

        // Add change event listener for radio button
        radio.addEventListener("change", () => {
            if (radio.checked) {
                setView(source.id, option.value);
            }
        });

        const span = document.createElement("span");
        span.className = "option-text";
        span.textContent = option.label;

        label.appendChild(radio);
        label.appendChild(span);

        // Make entire label clickable on mobile (since radio is hidden)
        label.addEventListener("click", (e) => {
            // Prevent double firing
            if (e.target !== radio) {
                e.preventDefault();
                radio.checked = true;
                setView(source.id, option.value);

                // Update visual state of all options in this group
                const allOptions =
                    optionsContainer.querySelectorAll(".radio-option");
                allOptions.forEach((opt) => {
                    const optRadio = opt.querySelector("input[type='radio']");
                    if (optRadio === radio) {
                        opt.classList.add("selected");
                    } else {
                        opt.classList.remove("selected");
                    }
                });
            }
        });

        optionsContainer.appendChild(label);
    });

    group.appendChild(optionsContainer);

    return group;
}
