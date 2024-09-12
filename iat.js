document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Il tuo nome']; // Stimolo associato a "Io"
    const stimuliOther = ['Il nome di un altro']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Imbarazzo', 'Timidezza']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Ansia', 'Paura']; // Stimoli associati a "Ansia"

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

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        startButton.classList.add('hidden'); // Hide start button if visible
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
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0])
                ];
                break;
            case 2:
                // Blocco 2: 10 stimoli per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 3:
                // Blocco 3: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0]),
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 4:
                // Blocco 4: "Io" a destra e "Non Io" a sinistra
                stimulusList = [
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0])
                ];
                break;
            case 5:
                // Blocco 5: "Non Io" e "Vergogna" a sinistra, "Io" e "Ansia" a destra
                stimulusList = [
                    ...Array(10).fill(stimuliOther[0]),
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati!`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0; // Reset the index for the new block
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        const avgReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        reactionTimesDisplay.innerText = `Tempo di reazione medio: ${avgReactionTime} ms`;
    }

    function handleKeyPress(event) {
        if (event.code === 'Space') {
            if (iatContainer.classList.contains('hidden')) {
                startIAT();
            }
        } else if (event.code === 'ArrowLeft') {
            recordResponse(checkResponse('left'));
        } else if (event.code === 'ArrowRight') {
            recordResponse(checkResponse('right'));
        }
    }

    function handleTouchStart(event) {
        const touchX = event.touches[0].clientX;
        const screenWidth = window.innerWidth;

        if (touchX < screenWidth / 2) {
            recordResponse(checkResponse('left'));
        } else {
            recordResponse(checkResponse('right'));
        }
    }

    function checkResponse(side) {
        const categoryLeft = getCategoryLeftForBlock(currentBlock);
        const categoryRight = getCategoryRightForBlock(currentBlock);
        const stimulus = stimulusList[currentStimulusIndex - 1];
        if (side === 'left') {
            return stimulus === categoryLeft;
        } else {
            return stimulus === categoryRight;
        }
    }

    // Event listeners
    document.addEventListener('keydown', handleKeyPress);

    startButton.addEventListener('click', function() {
        if (iatContainer.classList.contains('hidden')) {
            startIAT();
        }
    });

    if ('ontouchstart' in window) {
        // This is a touch device
        document.addEventListener('touchstart', handleTouchStart);
        startButton.classList.remove('hidden'); // Show start button for touch devices
    } else {
        // This is not a touch device
        startButton.classList.add('hidden'); // Hide start button for non-touch devices
    }
});
