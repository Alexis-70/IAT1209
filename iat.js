document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso'];
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi'];
    const stimuliShame = ['Arrossamento', 'Imbarazzo', 'Vergogna', 'Vergognoso/a'];
    const stimuliAnxiety = ['Ansioso/a', 'Tachicardia', 'Paura', 'Incertezza'];

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
    let blockStimuliCount = 0;

    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const stimulusDiv = document.getElementById('stimulus');
    const errorMessage = document.getElementById('error-message');
    const iatContainer = document.getElementById('iat-container');
    const resultsDiv = document.getElementById('results');
    const startButton = document.getElementById('start-button');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        startButton.classList.add('hidden'); // Nasconde il pulsante Start durante il test
        leftButton.classList.remove('hidden'); // Mostra i pulsanti di risposta
        rightButton.classList.remove('hidden'); // Mostra i pulsanti di risposta
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
                // Blocco 3: 20 stimoli per "Io", 20 per "Non Io", 10 per "Vergogna" e 10 per "Ansia" (pratica)
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 5:
                // Blocco 5: "Non Io" e "Vergogna" a sinistra, "Io" e "Ansia" a destra
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
        if (blockStimuliCount < (currentBlock === 3 ? 60 : 20)) {
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

    function recordResponse(isLeftButton) {
        if (isLeftButton) {
            const stimulus = stimulusDiv.innerText;
            const categoryLeft = getCategoryLeftForBlock(currentBlock);
            if (isCorrectResponse(categoryLeft, stimulus)) {
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
                        reactionTimes['Io_Ansia'].push(reactionTime);
                        break;
                    case 4:
                        reactionTimes['NonIo_Ansia'].push(reactionTime);
                        break;
                }
                showNextStimulus();
            } else {
                errorMessage.classList.remove('hidden');
            }
        } else {
            const stimulus = stimulusDiv.innerText;
            const categoryRight = getCategoryRightForBlock(currentBlock);
            if (isCorrectResponse(categoryRight, stimulus)) {
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
                        reactionTimes['Io_Ansia'].push(reactionTime);
                        break;
                    case 4:
                        reactionTimes['NonIo_Ansia'].push(reactionTime);
                        break;
                }
                showNextStimulus();
            } else {
                errorMessage.classList.remove('hidden');
            }
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

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        // Calculate average reaction times for each condition
        const avgRT_Io_Vergogna = average(reactionTimes['Io_Vergogna']);
        const avgRT_NonIo_Vergogna = average(reactionTimes['NonIo_Vergogna']);
        const avgRT_Io_Ansia = average(reactionTimes['Io_Ansia']);
        const avgRT_NonIo_Ansia = average(reactionTimes['NonIo_Ansia']);

        // Calculate the D score
        const dScore = calculateDScore(avgRT_Io_Vergogna, avgRT_NonIo_Vergogna, avgRT_Io_Ansia, avgRT_NonIo_Ansia);

        resultsDiv.innerHTML = `
            <p>Tempo medio di reazione per "Io" e "Vergogna": ${avgRT_Io_Vergogna} ms</p>
            <p>Tempo medio di reazione per "Non Io" e "Vergogna": ${avgRT_NonIo_Vergogna} ms</p>
            <p>Tempo medio di reazione per "Io" e "Ansia": ${avgRT_Io_Ansia} ms</p>
            <p>Tempo medio di reazione per "Non Io" e "Ansia": ${avgRT_NonIo_Ansia} ms</p>
            <p>Punteggio D: ${dScore}</p>
        `;
    }

    function isCorrectResponse(category, stimulus) {
        if (currentBlock === 1 || currentBlock === 4) {
            return (category === 'Io' && stimuliSelf.includes(stimulus)) ||
                   (category === 'Non Io' && stimuliOther.includes(stimulus));
        } else if (currentBlock === 2) {
            return (category === 'Vergogna' && stimuliShame.includes(stimulus)) ||
                   (category === 'Ansia' && stimuliAnxiety.includes(stimulus));
        } else if (currentBlock === 3) {
            return (category === 'Io e Vergogna' && stimuliSelf.includes(stimulus) || stimuliShame.includes(stimulus)) ||
                   (category === 'Non Io e Ansia' && stimuliOther.includes(stimulus) || stimuliAnxiety.includes(stimulus));
        } else if (currentBlock === 5) {
            return (category === 'Non Io e Vergogna' && stimuliOther.includes(stimulus) || stimuliShame.includes(stimulus)) ||
                   (category === 'Io e Ansia' && stimuliSelf.includes(stimulus) || stimuliAnxiety.includes(stimulus));
        }
        return false;
    }

    function average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function calculateDScore(avgRT_Io_Vergogna, avgRT_NonIo_Vergogna, avgRT_Io_Ansia, avgRT_NonIo_Ansia) {
        const meanRT_Vergogna = (avgRT_Io_Vergogna + avgRT_NonIo_Vergogna) / 2;
        const meanRT_Ansia = (avgRT_Io_Ansia + avgRT_NonIo_Ansia) / 2;
        return (meanRT_Vergogna - meanRT_Ansia) / (meanRT_Vergogna + meanRT_Ansia);
    }

    // Event listeners for the buttons
    leftButton.addEventListener('click', function () {
        recordResponse(true); // true = left button
    });

    rightButton.addEventListener('click', function () {
        recordResponse(false); // false = right button
    });

    startButton.addEventListener('click', startIAT);
});
