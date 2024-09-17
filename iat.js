document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso']; // Stimoli per "Io"
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi']; // Stimoli per "Non Io"
    const stimuliShame = ['Arrossamento', 'Imbarazzo', 'Vergogna', 'Vergognoso/a']; // Stimoli per "Vergogna"
    const stimuliAnxiety = ['Ansioso/a', 'Tachicardia', 'Paura', 'Incertezza']; // Stimoli per "Ansia"

    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let startTime, endTime;
    const reactionTimes = {
        'Io_Vergogna': [],
        'NonIo_Vergogna': [],
        'Io_Ansia': [],
        'NonIo_Ansia': []
    };
    let stimulusList = [];
    let blockStimuliCount = 0; // Track the number of stimuli shown in the current block
    let isPracticePhase = false; // Flag to check if it's practice phase

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
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        showNextStimulus();
    }

    function generateStimuliForBlock(block) {
        stimulusList = [];
        blockStimuliCount = 0; // Reset stimuli count for the new block
        isPracticePhase = block === 3 || block === 5; // Set practice phase flag for blocks 3 and 5

        switch (block) {
            case 1:
                // Blocco 1: 10 stimoli per "Io" e 10 per "Non Io"
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)])
                ];
                break;
            case 2:
                // Blocco 2: 10 stimoli per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 3:
                // Blocco 3: 20 prove di pratica + 40 prove di test
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(20).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 4:
                // Blocco 4: "Io" a destra e "Non Io" a sinistra
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)])
                ];
                break;
            case 5:
                // Blocco 5: 20 prove di pratica + 40 prove di test
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
        if (blockStimuliCount < (isPracticePhase ? 20 : 60)) { // Ensure correct number of stimuli per block
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

            // Record reaction times based on current block
            if (!isPracticePhase) { // Record reaction times only in test phases
                switch (currentBlock) {
                    case 1:
                        reactionTimes['Io_Vergogna'].push(reactionTime);
                        break;
                    case 2:
                        reactionTimes['NonIo_Vergogna'].push(reactionTime);
                        break;
                    case 3:
                        reactionTimes['Io_Ansia'].push(reactionTime);
                        break;
                    case 4:
                        reactionTimes['NonIo_Ansia'].push(reactionTime);
                        break;
                }
            }

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
        const blockMessage = `Inizia il blocco ${currentBlock}. Premi il pulsante "Inizia" per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0; // Reset the index for the new block
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        // Calculate average reaction times for each condition
        const avgRT_Io_Vergogna = average(reactionTimes['Io_Vergogna']);
        const avgRT_NonIo_Vergogna = average(reactionTimes['NonIo_Vergogna']);
        const avgRT_Io_Ansia = average(reactionTimes['Io_Ansia']);
        const avgRT_NonIo_Ansia = average(reactionTimes['NonIo_Ansia']);

        // Calculate the D-score
        const sd = standardDeviation([...reactionTimes['Io_Vergogna'], ...reactionTimes['NonIo_Vergogna'], ...reactionTimes['Io_Ansia'], ...reactionTimes['NonIo_Ansia']]);
        const D = ((avgRT_Io_Vergogna - avgRT_NonIo_Vergogna) - (avgRT_Io_Ansia - avgRT_NonIo_Ansia)) / sd;

        reactionTimesDisplay.innerHTML = `
            <h2>Risultati</h2>
            <p>Media tempi di reazione per 'Io' e 'Vergogna': ${avgRT_Io_Vergogna} ms</p>
            <p>Media tempi di reazione per 'Non Io' e 'Vergogna': ${avgRT_NonIo_Vergogna} ms</p>
            <p>Media tempi di reazione per 'Io' e 'Ansia': ${avgRT_Io_Ansia} ms</p>
            <p>Media tempi di reazione per 'Non Io' e 'Ansia': ${avgRT_NonIo_Ansia} ms</p>
            <p>Algoritmo D: ${D}</p>
        `;
    }

    function average(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    function standardDeviation(array) {
        const mean = average(array);
        return Math.sqrt(array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length);
    }

    startButton.addEventListener('click', startIAT);
    leftButton.addEventListener('click', () => recordResponse(isResponseCorrect('left')));
    rightButton.addEventListener('click', () => recordResponse(isResponseCorrect('right')));

    function isResponseCorrect(button) {
        // Implement this function to check if the response is correct based on the button clicked
        // This is a placeholder and needs to be implemented
        return true;
    }
});
