document.addEventListener('DOMContentLoaded', function () {
    // Definizioni stimoli
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso'];
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi'];
    const stimuliShame = ['Arrossamento', 'Imbarazzo', 'Vergogna', 'Vergognoso/a'];
    const stimuliAnxiety = ['Ansioso/a', 'Tachicardia', 'Paura', 'Incertezza'];

    let stimulusList = [];
    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let blockStimuliCount = 0;
    let startTime;
    let endTime;
    let isPracticePhase = false;
    let reactionTimes = {
        'Io_Vergogna': [],
        'NonIo_Vergogna': [],
        'Io_Ansia': [],
        'NonIo_Ansia': []
    };

    const iatContainer = document.getElementById('iat-container');
    const stimulusDiv = document.getElementById('stimulus');
    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const errorMessage = document.getElementById('error-message');
    const startButton = document.getElementById('start-button');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const touchButtons = document.getElementById('touch-buttons');
    const resultsDiv = document.getElementById('results');
    const reactionTimesParagraph = document.getElementById('reaction-times');

    function getCategoryLeftForBlock(block) {
        switch (block) {
            case 1: return 'Io';
            case 2: return 'Non Io';
            case 3: return 'Io';
            case 4: return 'Non Io';
            case 5: return 'Non Io';
        }
    }

    function getCategoryRightForBlock(block) {
        switch (block) {
            case 1: return 'Vergogna';
            case 2: return 'Ansia';
            case 3: return 'Ansia';
            case 4: return 'Vergogna';
            case 5: return 'Vergogna';
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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
            case 5:
                // Genera 60 stimoli per ciascuna categoria
                stimulusList = [
                    ...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(20).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
        }
        shuffleArray(stimulusList);
    }

    function showNextStimulus() {
        if (currentStimulusIndex < stimulusList.length) {
            if (blockStimuliCount < 60) { // Assicurati 60 stimoli per blocco
                if (isPracticePhase) {
                    if (blockStimuliCount >= 20) {
                        isPracticePhase = false; // Passa alla fase di test effettivo
                        startTime = new Date().getTime(); // Inizia a misurare i tempi
                    }
                } else {
                    startTime = new Date().getTime();
                }

                errorMessage.classList.add('hidden');
                stimulusDiv.innerText = stimulusList[currentStimulusIndex];
                categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
                categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);

                blockStimuliCount++;
                currentStimulusIndex++;
            }
            else {
                nextBlock();
            }
        } else {
            nextBlock();
        }
    }

    function recordResponse(isCorrect) {
        if (isCorrect) {
            errorMessage.classList.add('hidden');
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;

            // Registra i tempi di reazione basati sul blocco attuale
            if (!isPracticePhase) { // Solo nella fase di test effettivo
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
        isPracticePhase = (currentBlock === 3 || currentBlock === 5); // Imposta la fase di pratica per i blocchi 3 e 5
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0; // Reset the index for the new block
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        let resultsHtml = '<h3>Tempi di Reazione</h3>';
        for (const [key, times] of Object.entries(reactionTimes)) {
            resultsHtml += `<p>${key}: ${times.join(', ')} ms</p>`;
        }
        reactionTimesParagraph.innerHTML = resultsHtml;
    }

    function isCorrectResponse(category, stimulus) {
        if (category === 'Io') {
            return stimuliSelf.includes(stimulus);
        } else if (category === 'Non Io') {
            return stimuliOther.includes(stimulus);
        } else if (category === 'Vergogna') {
            return stimuliShame.includes(stimulus);
        } else if (category === 'Ansia') {
            return stimuliAnxiety.includes(stimulus);
        }
    }

    // Event listener for start button
    startButton.addEventListener('click', function () {
        startIAT();
        startButton.classList.add('hidden');
        touchButtons.classList.remove('hidden'); // Show touch buttons
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
