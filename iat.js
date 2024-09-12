document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso']; // Stimoli associati a "Io"
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi']; // Stimoli associati a "Non Io"
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
    const startButton = document.getElementById('start-button');
    const touchButtons = document.getElementById('touch-buttons');

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        touchButtons.classList.add('hidden'); // Hide touch buttons when starting
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
                stimulusList = [
                    ...Array(10).fill(stimuliSelf).flat(),
                    ...Array(10).fill(stimuliOther).flat()
                ];
                break;
            case 2:
                // Blocco 2: 10 stimoli per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliShame).flat(),
                    ...Array(10).fill(stimuliAnxiety).flat()
                ];
                break;
            case 3:
                // Blocco 3: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliSelf).flat(),
                    ...Array(10).fill(stimuliOther).flat(),
                    ...Array(10).fill(stimuliShame).flat(),
                    ...Array(10).fill(stimuliAnxiety).flat()
                ];
                break;
            case 4:
                // Blocco 4: "Io" a destra e "Non Io" a sinistra
                stimulusList = [
                    ...Array(10).fill(stimuliSelf).flat(),
                    ...Array(10).fill(stimuliOther).flat()
                ];
                break;
            case 5:
                // Blocco 5: "Non Io" e "Vergogna" a sinistra, "Io" e "Ansia" a destra
                stimulusList = [
                    ...Array(10).fill(stimuliOther).flat(),
                    ...Array(10).fill(stimuliShame).flat(),
                    ...Array(10).fill(stimuliSelf).flat(),
                    ...Array(10).fill(stimuliAnxiety).flat()
                ];
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

    function recordResponse(isCorrect) {
        if (isCorrect) {
            errorMessage.classList.add('hidden');
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;
            reactionTimes.push(reactionTime);
            showNextStimulus();
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    function nextBlock() {
        currentBlock++;
        if (currentBlock > 5) {
            endTest();
        } else {
            showBlockInfo();
        }
    }

    function showBlockInfo() {
        iatContainer.classList.add('hidden');
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati! Premi la barra spaziatrice per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0; // Reset the index for the new block
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        const avgReactionTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
        reactionTimesDisplay.innerText = `Tempo medio di reazione: ${avgReactionTime.toFixed(2)} ms`;
    }

    function isCorrectResponse(category, stimulus) {
        switch (category) {
            case 'Io':
                return stimulus === 'Il tuo nome';
            case 'Non Io':
                return stimulus === 'Il nome di un altro';
            case 'Vergogna':
                return stimuliShame.includes(stimulus);
            case 'Ansia':
                return stimuliAnxiety.includes(stimulus);
            case 'Io e Vergogna':
                return stimulus === 'Il tuo nome' || stimuliShame.includes(stimulus);
            case 'Non Io e Ansia':
                return stimulus === 'Il nome di un altro' || stimuliAnxiety.includes(stimulus);
            case 'Non Io e Vergogna':
                return stimulus === 'Il nome di un altro' || stimuliShame.includes(stimulus);
            case 'Io e Ansia':
                return stimulus === 'Il tuo nome' || stimuliAnxiety.includes(stimulus);
            default:
                return false;
        }
    }

    function showStartButton() {
        if (window.innerWidth <= 768) { // Show start button only on mobile
            startButton.classList.remove('hidden');
            touchButtons.classList.remove('hidden'); // Show touch buttons
        } else {
            startButton.classList.add('hidden');
        }
    }

    document.getElementById('start-button').addEventListener('click', function () {
        startIAT();
    });

    document.getElementById('left-button').addEventListener('click', function () {
        handleTouchResponse(true);
    });

    document.getElementById('right-button').addEventListener('click', function () {
        handleTouchResponse(false);
    });

    function handleTouchResponse(isLeft) {
        const category = isLeft ? getCategoryLeftForBlock(currentBlock) : getCategoryRightForBlock(currentBlock);
        const stimulusText = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(category, stimulusText);
        recordResponse(isCorrect);
    }

    // Initialize
    showStartButton();
});
