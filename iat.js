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
    let blockStimuliCount = 0; // Conta il numero di stimoli mostrati nel blocco corrente

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
        blockStimuliCount = 0;

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
                // Blocco 3: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 5:
                // Blocco 5: "Non Io" e "Vergogna" a sinistra, "Io" e "Ansia" a destra
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
        const blockMessage = `Inizia il blocco ${currentBlock}. Premi il pulsante "Inizia" per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0;
        showNextStimulus();
    }

    function standardDeviation(values) {
        const avg = values.reduce((a, b) => a + b) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        
        const block3Times = reactionTimes.slice(40, 80); // Blocco 3
        const block5Times = reactionTimes.slice(120, 160); // Blocco 5
        const block1Times = reactionTimes.slice(0, 20);  // Blocco 1
        const block4Times = reactionTimes.slice(100, 120);  // Blocco 4

        const avgBlock3 = block3Times.reduce((a, b) => a + b) / block3Times.length;
        const avgBlock5 = block5Times.reduce((a, b) => a + b) / block5Times.length;
        const avgBlock1 = block1Times.reduce((a, b) => a + b) / block1Times.length;
        const avgBlock4 = block4Times.reduce((a, b) => a + b) / block4Times.length;

        const sdBlock3_1 = standardDeviation([...block3Times, ...block1Times]);
        const sdBlock5_4 = standardDeviation([...block5Times, ...block4Times]);

        const D1 = (avgBlock3 - avgBlock1) / sdBlock3_1;
        const D2 = (avgBlock5 - avgBlock4) / sdBlock5_4;

        const finalD = (D1 + D2) / 2;

        reactionTimesDisplay.innerText = `Punteggio D: ${finalD.toFixed(2)}\nInterpretazione: ${
            finalD > 0 ? 'Associazione più forte tra "Io" e "Vergogna"' : 'Associazione più forte tra "Io" e "Ansia"'
        }`;
    }

    startButton.addEventListener('click', function () {
        startIAT();
        startButton.classList.add('hidden');
        document.getElementById('touch-buttons').classList.remove('hidden');
    });

   
