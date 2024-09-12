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
    const touchButtons = document.getElementById('touch-buttons');
    const startButton = document.getElementById('start-button');
    const startButtonContainer = document.getElementById('start-button-container');

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        startButtonContainer.classList.add('hidden');
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
                stimulusList = [
                    ...stimuliSelf,
                    ...stimuliSelf,
                    ...stimuliOther,
                    ...stimuliOther
                ];
                break;
            case 2:
                stimulusList = [
                    ...stimuliShame,
                    ...stimuliShame,
                    ...stimuliAnxiety,
                    ...stimuliAnxiety
                ];
                break;
            case 3:
                stimulusList = [
                    ...stimuliSelf,
                    ...stimuliSelf,
                    ...stimuliOther,
                    ...stimuliOther,
                    ...stimuliShame,
                    ...stimuliShame,
                    ...stimuliAnxiety,
                    ...stimuliAnxiety
                ];
                break;
            case 4:
                stimulusList = [
                    ...stimuliSelf,
                    ...stimuliSelf,
                    ...stimuliOther,
                    ...stimuliOther
                ];
                break;
            case 5:
                stimulusList = [
                    ...stimuliOther,
                    ...stimuliOther,
                    ...stimuliShame,
                    ...stimuliShame,
                    ...stimuliSelf,
                    ...stimuliSelf,
                    ...stimuliAnxiety,
                    ...stimuliAnxiety
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
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati!`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0;
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

    function handleStart() {
        startIAT();
    }

    function handleResponse(event) {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
            const isLeft = event.code === 'ArrowLeft';
            const category = isLeft ? getCategoryLeftForBlock(currentBlock) : getCategoryRightForBlock(currentBlock);
            const stimulusText = stimulusDiv.innerText;
            const isCorrect = isCorrectResponse(category, stimulusText);

            recordResponse(isCorrect);
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            handleStart();
        } else {
            handleResponse(event);
        }
    });

    document.getElementById('start-button').addEventListener('click', handleStart);

    document.getElementById('left-button').addEventListener('click', function () {
        const category = getCategoryLeftForBlock(currentBlock);
        const stimulusText = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(category, stimulusText);

        recordResponse(isCorrect);
    });

    document.getElementById('right-button').addEventListener('click', function () {
        const category = getCategoryRightForBlock(currentBlock);
        const stimulusText = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(category, stimulusText);

        recordResponse(isCorrect);
    });

    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        startButtonContainer.classList.remove('hidden');
    }
});
