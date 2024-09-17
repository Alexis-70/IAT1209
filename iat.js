document.addEventListener('DOMContentLoaded', function () {
    // Definizione degli stimoli
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
                // Blocco 3: 20 stimoli di prova e 40 stimoli di test
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]),
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
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
                // Blocco 5: 20 stimoli di prova e 40 stimoli di test
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]),
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
        if (blockStimuliCount < 20 || (currentBlock === 3 && blockStimuliCount >= 20 && blockStimuliCount < 60) || (currentBlock === 5 && blockStimuliCount >= 20 && blockStimuliCount < 60)) {
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

            // Record reaction times based on current block
            if (currentBlock === 3 || currentBlock === 5) {
                if (blockStimuliCount > 20) {
                    switch (currentBlock) {
                        case 3:
                            reactionTimes['Io_Ansia'].push(reactionTime);
                            break;
                        case 5:
                            reactionTimes['NonIo_Ansia'].push(reactionTime);
                            break;
                    }
                }
            } else {
                switch (currentBlock) {
                    case 1:
                        reactionTimes['Io_Vergogna'].push(reactionTime);
                        break;
                    case 2:
                        reactionTimes['NonIo_Vergogna'].push(reactionTime);
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
        document.getElementById('block-info').innerText = blockMessage;
        document.getElementById('block-info').classList.remove('hidden');
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        calculateResults();
    }

    function calculateResults() {
        const totalTimes = {
            'Io_Vergogna': reactionTimes['Io_Vergogna'].reduce((a, b) => a + b, 0),
            'NonIo_Vergogna': reactionTimes['NonIo_Vergogna'].reduce((a, b) => a + b, 0),
            'Io_Ansia': reactionTimes['Io_Ansia'].reduce((a, b) => a + b, 0),
            'NonIo_Ansia': reactionTimes['NonIo_Ansia'].reduce((a, b) => a + b, 0)
        };

        const totalCounts = {
            'Io_Vergogna': reactionTimes['Io_Vergogna'].length,
            'NonIo_Vergogna': reactionTimes['NonIo_Vergogna'].length,
            'Io_Ansia': reactionTimes['Io_Ansia'].length,
            'NonIo_Ansia': reactionTimes['NonIo_Ansia'].length
        };

        const averages = {
            'Io_Vergogna': totalTimes['Io_Vergogna'] / totalCounts['Io_Vergogna'],
            'NonIo_Vergogna': totalTimes['NonIo_Vergogna'] / totalCounts['NonIo_Vergogna'],
            'Io_Ansia': totalTimes['Io_Ansia'] / totalCounts['Io_Ansia'],
            'NonIo_Ansia': totalTimes['NonIo_Ansia'] / totalCounts['NonIo_Ansia']
        };

        const resultD = ((averages['Io_Vergogna'] - averages['NonIo_Vergogna']) - (averages['Io_Ansia'] - averages['NonIo_Ansia'])) / 
                        (averages['Io_Vergogna'] + averages['NonIo_Vergogna'] + averages['Io_Ansia'] + averages['NonIo_Ansia']);

        reactionTimesDisplay.innerText = `Punteggio D: ${resultD.toFixed(2)}`;
    }

    startButton.addEventListener('click', startIAT);
    leftButton.addEventListener('click', () => recordResponse(true));
    rightButton.addEventListener('click', () => recordResponse(false));
});
