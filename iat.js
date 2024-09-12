document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso']; // Stimolo associato a "Io"
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Imbarazzo', 'Arrossamento', 'Fallimento', 'Rifiuto']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Tensione', 'Nervi a fior di pelle', 'Tachicardia']; // Stimoli associati a "Ansia"

    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let startTime, endTime;
    const reactionTimes = [];
    let stimulusList = [];
    let blockStimuliCount = 0; // Track the number of stimuli shown in the current block

    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const stimulusDiv = document.getElementById('stimulus');
    const errorMessage = document.getElementById('error-message');
    const iatContainer = document.getElementById('iat-container');
    const resultsDiv = document.getElementById('results');
    const reactionTimesDisplay = document.getElementById('reaction-times');

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        if (isMobileDevice()) {
            document.getElementById('touch-buttons').classList.remove('hidden');
        }
        generateStimuliForBlock(currentBlock);
        showNextStimulus();
    }

    function generateStimuliForBlock(block) {
        stimulusList = [];
        blockStimuliCount = 0; // Reset stimuli count for the new block

        switch (block) {
            case 1:
            case 4:
                // Blocchi 1 e 4: 10 stimoli per "Io" e 10 per "Non Io"
                for (let i = 0; i < 10; i++) {
                    stimulusList.push(stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]);
                    stimulusList.push(stimuliOther[Math.floor(Math.random() * stimuliOther.length)]);
                }
                break;
            case 2:
                // Blocco 2: 10 stimoli per "Vergogna" e 10 per "Ansia"
                for (let i = 0; i < 10; i++) {
                    stimulusList.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                    stimulusList.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
                }
                break;
            case 3:
                // Blocco 3: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia"
                for (let i = 0; i < 10; i++) {
                    stimulusList.push(stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]);
                    stimulusList.push(stimuliOther[Math.floor(Math.random() * stimuliOther.length)]);
                    stimulusList.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                    stimulusList.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
                }
                break;
            case 4:
                // Blocco 4: "Io" a destra e "Non Io" a sinistra
                for (let i = 0; i < 10; i++) {
                    stimulusList.push(stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]);
                    stimulusList.push(stimuliOther[Math.floor(Math.random() * stimuliOther.length)]);
                }
                break;
            case 5:
                // Blocco 5: "Non Io" e "Vergogna" a sinistra, "Io" e "Ansia" a destra
                for (let i = 0; i < 10; i++) {
                    stimulusList.push(stimuliOther[Math.floor(Math.random() * stimuliOther.length)]);
                    stimulusList.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                    stimulusList.push(stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]);
                    stimulusList.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
                }
                break;
        }
        shuffleArray(stimulusList);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showNextStimulus() {
        if (blockStimuliCount < 20) { // Ensure 20 stimuli per block
            if (currentStimulusIndex < stimulusList.length) {
                errorMessage.classList.add('hidden');
                stimulusDiv.innerText = stimulusList[currentStimulusIndex];
                categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
                categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);
                startTime = new Date().getTime();
                blockStimuliCount++;
                currentStimulusIndex++;
            } else {
                nextBlock();
            }
        } else {
            nextBlock();
        }
    }

    function getCategoryLeftForBlock(block) {
        switch (block) {
            case 1:
                return 'Io';
            case 2:
                return 'Vergogna';
            case 3:
                return 'Io e Vergogna';
            case 4:
                return 'Non Io'; // Blocco 4
            case 5:
                return 'Non Io e Vergogna'; // Blocco 5
            default:
                return '';
        }
    }

    function getCategoryRightForBlock(block) {
        switch (block) {
            case 1:
                return 'Non Io';
            case 2:
                return 'Ansia';
            case 3:
                return 'Non Io e Ansia';
            case 4:
                return 'Io'; // Blocco 4
            case 5:
                return 'Io e Ansia'; // Blocco 5
            default:
                return '';
        }
    }

    function isCorrectResponse(category, stimulusText) {
        // Implement your logic to determine if the response is correct
        // This is a placeholder function
        return true; // Adjust logic based on your criteria
    }

    function recordResponse(isCorrect) {
        endTime = new Date().getTime();
        const reactionTime = endTime - startTime;
        reactionTimes.push(reactionTime);
        if (isCorrect) {
            showNextStimulus();
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    function nextBlock() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        reactionTimesDisplay.innerText = `Tempi di reazione: ${reactionTimes.join(', ')}`;
        // Here you would calculate the D-score and other statistics
    }

    function handleKeyPress(event) {
        if (event.key === ' ') {
            startIAT();
        } else if (event.key === 'ArrowLeft') {
            const category = getCategoryLeftForBlock(currentBlock);
            const stimulusText = stimulusDiv.innerText;
            const isCorrect = isCorrectResponse(category, stimulusText);
            recordResponse(isCorrect);
        } else if (event.key === 'ArrowRight') {
            const category = getCategoryRightForBlock(currentBlock);
            const stimulusText = stimulusDiv.innerText;
            const isCorrect = isCorrectResponse(category, stimulusText);
            recordResponse(isCorrect);
        }
    }

    function handleTouchResponse(isLeft) {
        const category = isLeft ? getCategoryLeftForBlock(currentBlock) : getCategoryRightForBlock(currentBlock);
        const stimulusText = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(category, stimulusText);
        recordResponse(isCorrect);
    }

    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('left-button').addEventListener('click', function () {
        handleTouchResponse(true);
    });
    document.getElementById('right-button').addEventListener('click', function () {
        handleTouchResponse(false);
    });
});
