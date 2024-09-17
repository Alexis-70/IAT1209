document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso']; // Stimolo associato a "Io"
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Arrossamento', 'Imbarazzo', 'Vergogna', 'Vergognoso/a']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Ansioso/a', 'Tachicardia', 'Paura', 'Incertezza']; // Stimoli associati a "Ansia"

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

        switch (block) {
            case 1:
            case 4:
                // Blocchi 1 e 4: 10 stimoli per "Io" e 10 per "Non Io"
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
                // Blocco 3: 20 stimoli per "Io", 20 per "Non Io", 10 per "Vergogna" e 10 per "Ansia" (20 di pratica e 40 di test)
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
                // Blocco 5: 20 stimoli per "Non Io" e "Vergogna" a sinistra, 20 stimoli per "Io" e "Ansia" a destra (20 di pratica e 40 di test)
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
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
        if (blockStimuliCount < 60) { // Ensure 60 stimuli per block
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
                return 'Io e Vergogna'; // Adjusted for block 3
            case 4:
                return 'Non Io';
            case 5:
                return 'Non Io e Vergogna'; // Adjusted for block 5
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
                return 'Non Io e Ansia'; // Adjusted for block 3
            case 4:
                return 'Io';
            case 5:
                return 'Io e Ansia'; // Adjusted for block 5
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
            switch (currentBlock) {
                case 1:
                    reactionTimes['Io_Vergogna'].push(reactionTime);
                    break;
                case 2:
                    reactionTimes['NonIo_Vergogna'].push(reactionTime);
                    break;
                case 3:
                    if (blockStimuliCount > 20) { // Record only test trials
                        reactionTimes['Io_Ansia'].push(reactionTime);
                    }
                    break;
                case 4:
                    reactionTimes['NonIo_Ansia'].push(reactionTime);
                    break;
                case 5:
                    if (blockStimuliCount > 20) { // Record only test trials
                        reactionTimes['Io_Ansia'].push(reactionTime);
                    }
                    break;
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
        const allReactionTimes = [
            ...reactionTimes['Io_Vergogna'],
            ...reactionTimes['NonIo_Vergogna'],
            ...reactionTimes['Io_Ansia'],
            ...reactionTimes['NonIo_Ansia']
        ];
        const mean = average(allReactionTimes);
        const sd = standardDeviation(allReactionTimes);
        const dScore = (avgRT_Io_Vergogna - avgRT_Io_Ansia) / sd;

        // Display results
        reactionTimesDisplay.innerText = `Tempo medio di reazione per "Io e Vergogna": ${avgRT_Io_Vergogna.toFixed(2)} ms\nTempo medio di reazione per "Non Io e Vergogna": ${avgRT_NonIo_Vergogna.toFixed(2)} ms\nTempo medio di reazione per "Io e Ansia": ${avgRT_Io_Ansia.toFixed(2)} ms\nTempo medio di reazione per "Non Io e Ansia": ${avgRT_NonIo_Ansia.toFixed(2)} ms\n\nPunteggio D: ${dScore.toFixed(2)}`;
    }

    function average(array) {
        if (array.length === 0) return 0;
        const sum = array.reduce((acc, val) => acc + val, 0);
        return sum / array.length;
    }

    function standardDeviation(array) {
        if (array.length === 0) return 0;
        const mean = average(array);
        const squaredDiffs = array.map(value => {
            const diff = value - mean;
            return diff * diff;
        });
        const avgSquaredDiff = average(squaredDiffs);
        return Math.sqrt(avgSquaredDiff);
    }

    startButton.addEventListener('click', startIAT);

    leftButton.addEventListener('click', function () {
        const categoryLeft = getCategoryLeftForBlock(currentBlock);
        const categoryRight = getCategoryRightForBlock(currentBlock);
        const isCorrect = isResponseCorrect(stimulusDiv.innerText, categoryLeft);
        recordResponse(isCorrect);
    });

    rightButton.addEventListener('click', function () {
        const categoryLeft = getCategoryLeftForBlock(currentBlock);
        const categoryRight = getCategoryRightForBlock(currentBlock);
        const isCorrect = isResponseCorrect(stimulusDiv.innerText, categoryRight);
        recordResponse(isCorrect);
    });

    function isResponseCorrect(stimulus, category) {
        const shameSet = new Set(stimuliShame);
        const anxietySet = new Set(stimuliAnxiety);
        const selfSet = new Set(stimuliSelf);
        const otherSet = new Set(stimuliOther);

        if (category === 'Io') {
            return selfSet.has(stimulus);
        } else if (category === 'Non Io') {
            return otherSet.has(stimulus);
        } else if (category === 'Vergogna') {
            return shameSet.has(stimulus);
        } else if (category === 'Ansia') {
            return anxietySet.has(stimulus);
        } else if (category === 'Io e Vergogna') {
            return selfSet.has(stimulus) || shameSet.has(stimulus);
        } else if (category === 'Non Io e Vergogna') {
            return otherSet.has(stimulus) || shameSet.has(stimulus);
        } else if (category === 'Io e Ansia') {
            return selfSet.has(stimulus) || anxietySet.has(stimulus);
        } else if (category === 'Non Io e Ansia') {
            return otherSet.has(stimulus) || anxietySet.has(stimulus);
        } else {
            return false;
        }
    }
});
