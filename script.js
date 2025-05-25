document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('photosynthesis-container');
    const startButton = document.getElementById('start-photosynthesis');
    const annotationsContainer = document.getElementById('annotations-container');
    const sunlightSlider = document.getElementById('sunlight-slider');
    const sunlightValueElement = document.getElementById('sunlight-value');

    const svgFiles = [
        { name: 'sunlight', id: 'sunlight-svg' },
        { name: 'water', id: 'water-svg' },
        { name: 'co2', id: 'co2-svg' },
        { name: 'chloroplast', id: 'chloroplast-svg' },
        { name: 'glucose', id: 'glucose-svg' },
        { name: 'oxygen', id: 'oxygen-svg' }
    ];

    const loadedElements = {}; // To store references to the loaded SVG elements

    /**
     * Loads all SVG files, adds them to the DOM, and then positions them.
     */
    async function loadSVGs() {
        if (!container) {
            console.error('Photosynthesis container not found!');
            return;
        }

        try {
            for (const svgInfo of svgFiles) {
                const response = await fetch(`assets/${svgInfo.name}.svg`);
                if (!response.ok) {
                    console.error(`Failed to load ${svgInfo.name}.svg: ${response.statusText}`);
                    continue;
                }
                const svgText = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;

                svgElement.id = svgInfo.id;
                svgElement.style.position = 'absolute'; // Essential for positioning
                svgElement.style.width = '100px'; // Default width, can be adjusted in CSS
                svgElement.style.height = '100px'; // Default height, can be adjusted in CSS

                container.appendChild(svgElement);
                loadedElements[svgInfo.name] = svgElement;
                // console.log(`Loaded ${svgInfo.name}.svg`);
            }
            positionElements(); // Position elements after all SVGs are loaded
        } catch (error) {
            console.error('Error loading SVGs:', error);
        }
    }

    /**
     * Positions the SVG elements within the container.
     * Assumes SVGs are loaded and have position:absolute.
     */
    function positionElements() {
        if (!container) return;

        const containerRect = container.getBoundingClientRect();

        // Ensure elements are loaded before trying to position
        const { chloroplast, sunlight, water, co2, glucose, oxygen } = loadedElements;

        if (chloroplast) {
            chloroplast.style.left = `${containerRect.width / 2 - 50}px`; // 50 is half of default 100px width
            chloroplast.style.top = `${containerRect.height / 2 - 50}px`; // 50 is half of default 100px height
        }

        if (sunlight && chloroplast) {
            sunlight.style.left = `${parseFloat(chloroplast.style.left)}px`;
            sunlight.style.top = `${parseFloat(chloroplast.style.top) - 100}px`; // 100px above
    } else if (!sunlight) {
        console.warn("Sunlight SVG not loaded for positioning.");
        }


        if (water && chloroplast) {
            water.style.left = `${parseFloat(chloroplast.style.left) - 100}px`; // 100px to the left
            water.style.top = `${parseFloat(chloroplast.style.top)}px`;
    } else if (!water) {
        console.warn("Water SVG not loaded for positioning.");
        }

        if (co2 && chloroplast) {
            co2.style.left = `${parseFloat(chloroplast.style.left) - 100}px`; // 100px to the left
            co2.style.top = `${parseFloat(chloroplast.style.top) + 70}px`; // Below water, adjust as needed
    } else if (!co2) {
        console.warn("CO2 SVG not loaded for positioning.");
        }

        if (glucose && chloroplast) {
            glucose.style.left = `${parseFloat(chloroplast.style.left) + 100}px`;
            glucose.style.top = `${parseFloat(chloroplast.style.top)}px`;
            glucose.style.display = 'none'; // Initially hidden
    } else if (!glucose) {
        console.warn("Glucose SVG not loaded for positioning.");
        }

        if (oxygen && chloroplast) {
            oxygen.style.left = `${parseFloat(chloroplast.style.left) + 100}px`;
            oxygen.style.top = `${parseFloat(chloroplast.style.top) + 70}px`; // Below glucose, adjust as needed
            oxygen.style.display = 'none'; // Initially hidden
    } else if (!oxygen) {
        console.warn("Oxygen SVG not loaded for positioning.");
        }
    }

    /**
     * Animates the photosynthesis process.
     */
    function startAnimation() {
        updateAnnotation("Plants absorb water from the soil and carbon dioxide from the air.");
        // console.log('Starting animation...');
        const { water, co2, chloroplast, glucose, oxygen } = loadedElements;

        // Critical elements for animation
        if (!water || !co2 || !chloroplast || !glucose || !oxygen) {
            console.error('One or more essential SVG elements for animation are not loaded. Aborting animation.');
            updateAnnotation("Animation cannot start: essential elements are missing. Please check console for errors.");
            startButton.disabled = false; // Re-enable button
            return;
        }
        
        // Ensure elements that will move have transitions (will be defined in style.css)
        // This check is now somewhat redundant due to the above, but good for individual styling
        [water, co2, glucose, oxygen].forEach(el => {
            if (el) el.style.transition = 'left 1s ease-in-out, top 1s ease-in-out, opacity 0.5s ease-in-out';
        });


        // 1. Water and CO2 move towards chloroplast
        // Target center of chloroplast (adjusting for half-width/height of water/co2 SVGs)
        const chloroRect = chloroplast.getBoundingClientRect(); // Chloroplast is confirmed by the check above
        const containerOrigin = container.getBoundingClientRect();

        const chloroCenterX = chloroRect.left - containerOrigin.left + (chloroRect.width / 2) - 50; // 50 is half-width of water/co2
        const chloroCenterY = chloroRect.top - containerOrigin.top + (chloroRect.height / 2) - 50; // 50 is half-height of water/co2

        if (water) {
            water.style.left = `${chloroCenterX}px`;
            water.style.top = `${chloroCenterY}px`;
        }
        if (co2) {
            co2.style.left = `${chloroCenterX}px`;
            co2.style.top = `${chloroCenterY}px`;
        }

        // 2. After they reach, they disappear (using opacity and then display none for better transition)
        setTimeout(() => {
            if (water) {
                water.style.opacity = '0';
            }
            if (co2) {
                co2.style.opacity = '0';
            }
            setTimeout(() => {
                if (water) water.style.display = 'none';
                if (co2) co2.style.display = 'none';

                updateAnnotation("Inside the chloroplast, light energy from the sun drives the chemical reaction to convert CO2 and water into glucose.");

                // 3. Delay for reaction text, then Glucose and Oxygen appear
                setTimeout(() => {
                    updateAnnotation("The results of photosynthesis are glucose (sugar, which is food for the plant) and oxygen (which is released into the atmosphere).");
                    // console.log('Water and CO2 disappeared. Glucose and Oxygen appearing...');
                    if (glucose) {
                        glucose.style.display = 'block'; // Or 'inline' or 'inline-block' depending on SVG type
                        glucose.style.opacity = '0'; // Start transparent for fade-in
                    }
                    if (oxygen) {
                        oxygen.style.display = 'block';
                        oxygen.style.opacity = '0';
                    }

                    // Force reflow for opacity transition to take effect
                    void glucose.offsetWidth;
                    void oxygen.offsetWidth;

                    if (glucose) glucose.style.opacity = '1';
                    if (oxygen) oxygen.style.opacity = '1';

                    // 4. Glucose and Oxygen move slightly further to the right
                    setTimeout(() => {
                        // console.log('Glucose and Oxygen moving right...');
                        if (glucose) {
                            glucose.style.left = `${parseFloat(glucose.style.left) + 50}px`;
                        }
                        if (oxygen) {
                            oxygen.style.left = `${parseFloat(oxygen.style.left) + 50}px`;
                        }

                        // 5. Animation complete message
                        setTimeout(() => {
                            updateAnnotation("Summary: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2");
                        }, 1000); // Delay for products to move and then show summary

                    }, 1000); // Delay for appearance before moving (increased for reading)
                }, 2500); // Delay for "Inside chloroplast" message (increased for reading)
            }, 500); // Delay for water/co2 disappearance (time for fadeout)
        }, 1000); // Corresponds to the transition duration of water/co2 movement
    }

    // Attach event listener to the button
    if (startButton) {
        startButton.addEventListener('click', () => {
            // Disable button to prevent re-clicks during animation
            startButton.disabled = true; 
            startAnimation();
            // Re-enable button after animation sequence is complete
            // Total animation time: 1000 (move) + 500 (fade) + 2500 (react text) + 1000 (products appear/move) + 1000 (summary text) = 6000ms
            setTimeout(() => {
                startButton.disabled = false;
            }, 6000); 
        });
    } else {
        console.error('Start button not found!');
    }

    // Initial load of SVGs and initial annotation
    async function initializeApp() {
        await loadSVGs(); // Wait for SVGs to be loaded and initially positioned
        updateAnnotation("Photosynthesis is the process plants use to convert light energy into chemical energy. On screen, you see sunlight, water (H2O), carbon dioxide (CO2), and a chloroplast (where photosynthesis happens).");

        // Initialize and set up sunlight slider
        if (sunlightSlider && sunlightValueElement) {
            updateSunlightIntensity(sunlightSlider.value); // Set initial opacity and text

            sunlightSlider.addEventListener('input', (event) => {
                updateSunlightIntensity(event.target.value);
            });
        } else {
            console.error('Sunlight slider or value element not found for initialization.');
        }
    }

    initializeApp();

    /**
     * Updates the sunlight SVG opacity and the value display based on the slider.
     * @param {string} value - The current value of the sunlight slider (0-100).
     */
    function updateSunlightIntensity(value) {
        const percentage = parseInt(value, 10);
        const opacity = percentage / 100;

        if (loadedElements.sunlight) {
            loadedElements.sunlight.style.opacity = opacity;
        } else {
            // console.warn('Sunlight SVG not loaded yet for opacity update.');
            // This might happen if called before loadSVGs completes or if sunlight.svg failed to load.
            // Consider queueing this update or ensuring loadSVGs is fully complete.
        }

        if (sunlightValueElement) {
            sunlightValueElement.textContent = `${percentage}%`;
        }
    }

    // Optional: Reposition elements on window resize
    window.addEventListener('resize', positionElements);

    /**
    * Updates the text content of the annotations container.
    * Uses the 'annotationsContainer' variable from the outer scope.
    * @param {string} text - The text to display.
    */
    function updateAnnotation(text) {
        if (annotationsContainer) {
            annotationsContainer.innerHTML = text; // Using innerHTML to allow for simple tags like <br> if needed later
        } else {
            console.error('Annotations container element not found in DOM!');
        }
    }
});
