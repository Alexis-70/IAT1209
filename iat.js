document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso'];
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi'];
    const stimuliShame = ['Imbarazzo', 'Arrossamento', 'Fallimento', 'Rifiuto'];
    const stimuliAnxiety = ['Tensione', 'Nervi a fior di pelle', 'Tachicardia'];

    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let startTime, endTime;
    const reactionTimes = [];
    let stimulusList = [];
    let blockStimuliCount = 0;

    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const stimulusDiv = document.getElementById('stimulus');
    const errorMessage = document.getElementById('error-message');
    const iatContainer = document.getElementById('iat-container');
    const resultsDiv = document.getElementById('results');
    const reactionTimesDisplay = document.getElementById('reaction-times');
    const startButton = document.getElementById('start-button');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    function startIAT() {
        console.log('Starting IAT...'); // Debug
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        showNextStimulus();
    }

    function generateStimuliForBlock(block) {
        console.log(`Generating stimuli for block ${block}`); // Debug
        stimulusList = [];
        blockStimuliCount = 0;

        switch (block) {
            case 1:
            case 4:
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)])
                ];
                break;
            case 2:
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 3:
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 5:
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
        console.log('Showing next stimulus...'); // Debug
        if (blockStimuliCount < 20) {
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
                return 'Non Io';
            case 5:
                return 'Non Io e Vergogna';
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
                return 'Io';
            case 5:
                return 'Io e Ansia';
            default:
                return '';
        }
    }

    function recordResponse(isCorrect) {
        console.log(`Recording response: ${isCorrect}`); // Debug
        if (isCorrect) {
            errorMessage.classList.add('hidden');
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;
            reactionTimes.push({
                time: reactionTime,
                block: currentBlock,
                stimulus: stimulusDiv.innerText
            });
            showNextStimulus();
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    function nextBlock() {
        console.log('Moving to next block...'); // Debug
        currentBlock++;
        if (currentBlock > 5) {
            endTest();
        } else {
            showBlockInfo();
        }
    }

    function showBlockInfo() {
        iatContainer.classList.add('hidden');
        const blockMessage = `Inizia il blocco ${currentBlock}. Premi il pulsante "Inizia" per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0;
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        calculateAndDisplayResults();
    }

    function calculateAndDisplayResults() {
        console.log('Calculating and displaying results...'); // Debug
        const blocks = [1, 2, 3, 4, 5];
        let results = {};

        blocks.forEach(block => {
            const blockTimes = reactionTimes.filter(rt => rt.block === block).map(rt => rt.time);
            if (blockTimes.length > 0) {
                const mean = blockTimes.reduce((a, b) => a + b) / blockTimes.length;
                const variance = blockTimes.reduce((a, b) => a + (b - mean) ** 2, 0) / blockTimes.length;
                const stdDev = Math.sqrt(variance);
                results[block] = { mean, stdDev };
            }
        });

        const block1_4 = results[1].mean + results[4].mean;
        const block2_5 = results[2].mean + results[5].mean;

        const D = (block1_4 - block2_5) / (results[1].stdDev + results[4].stdDev);

        reactionTimesDisplay.innerHTML = `
            <p>Tempo medio di reazione (Blocco 1 e 4): ${results[1].mean.toFixed(2)} ms</p>
            <p>Tempo medio di reazione (Blocco 2 e 5): ${results[2].mean.toFixed(2)} ms</p>
            <p>Deviazione standard (Blocco 1 e 4): ${results[1].stdDev.toFixed(2)} ms</p>
            <p>Deviazione standard (Blocco 2 e 5): ${results[2].stdDev.toFixed(2)} ms</p>
            <p>Punteggio D: ${D.toFixed(2)}</p>
        `;
    }

    function isCorrectResponse(category, stimulus) {
        switch (category) {
            case 'Io':
                return stimuliSelf.includes(stimulus);
            case 'Non Io':
                return stimuliOther.includes(stimulus);
            case 'Vergogna':
                return stimuliShame.includes(stimulus);
            case 'Ansia':
                return stimuliAnxiety.includes(stimulus);
            case 'Io e Vergogna':
                return stimuliSelf.includes(stimulus) || stimuliShame.includes(stimulus);
            case 'Non Io e Ansia':
                return stimuliOther.includes(stimulus) || stimuliAnxiety.includes(stimulus);
            case 'Non Io e Vergogna':
                return stimuliOther.includes(stimulus) || stimuliShame.includes(stimulus);
            case 'Io e Ansia':
                return stimuliSelf.includes(stimulus) || stimuliAnxiety.includes(stimulus);
            default:
                return false;
        }
    }

    // Event listener for start button
    startButton.addEventListener('click', function () {
        startIAT();
        startButton.classList.add('hidden');
        document.getElementById('touch-buttons').classList.remove('hidden'); // Show touch buttons
    });

    // Event listeners for touch buttons
    leftButton.addEventListener('click', function () {
        const stimulus = stimulusDiv.innerText;
        const categoryLeft = getCategoryLeftForBlock(currentBlock);
        recordResponse(isCorrectResponse(categoryLeft, stimulus));
    });

    rightButton.addEventListener('click', function () {
        const stimulus = stimulusDiv.innerText;
        const categoryRight = getCategoryRightForBlock(currentBlock);
        recordResponse(isCorrectResponse(categoryRight, stimulus));
    });

    // For desktop compatibility, use arrow keys for responses
    document.addEventListener('keydown', function (event) {
        const stimulus = stimulusDiv.innerText;
        if (event.key === 'ArrowLeft') {
            const categoryLeft = getCategoryLeftForBlock(currentBlock);
            recordResponse(isCorrectResponse(categoryLeft, stimulus));
        } else if (event.key === 'ArrowRight') {
            const categoryRight = getCategoryRightForBlock(currentBlock);
            recordResponse(isCorrectResponse(categoryRight, stimulus));
        }
    });

});
