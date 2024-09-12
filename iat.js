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
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        startButton.classList.add('hidden');
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
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther,
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther
                ];
                break;
            case 2:
                stimulusList = [
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety
                ];
                break;
            case 3:
                stimulusList = [
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther,
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther,
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety
                ];
                break;
            case 5:
                stimulusList = [
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther,
                    ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther, ...stimuliOther,
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame, ...stimuliShame,
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf, ...stimuliSelf,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety,
                    ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety, ...stimuliAnxiety
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
        if (blockStimuliCount < stimulusList.length) { 
            if (currentStimulusIndex < stimulusList.length) {
                errorMessage.classList.add('hidden');
                stimulusDiv.innerText = stimulusList[currentStimulusIndex];
                categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
                categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);
                startTime = new Date().getTime();
                blockStimuliCount++;
                currentStimulusIndex++;
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
        if (currentBlock === 1) {
            document.getElementById('start-container').classList.remove('hidden');
        } else {
            generateStimuliForBlock(currentBlock);
            showNextStimulus();
        }
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        reactionTimesDisplay.innerText = `Tempi di reazione: ${reactionTimes.join(', ')}`;
    }

    startButton.addEventListener('click', startIAT);

    leftButton.addEventListener('click', function () {
        const currentStimulus = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(currentStimulus, getCategoryLeftForBlock(currentBlock));
        recordResponse(isCorrect);
    });

    rightButton.addEventListener('click', function () {
        const currentStimulus = stimulusDiv.innerText;
        const isCorrect = isCorrectResponse(currentStimulus, getCategoryRightForBlock(currentBlock));
        recordResponse(isCorrect);
    });

    function isCorrectResponse(stimulus, category) {
        if (currentBlock === 1 || currentBlock === 4) {
            return (category === 'Io' && stimuliSelf.includes(stimulus)) ||
                   (category === 'Non Io' && stimuliOther.includes(stimulus));
        } else if (currentBlock === 2) {
            return (category === 'Vergogna' && stimuliShame.includes(stimulus)) ||
                   (category === 'Ansia' && stimuliAnxiety.includes(stimulus));
        } else if (currentBlock === 3) {
            return (category === 'Io' && stimuliSelf.includes(stimulus)) ||
                   (category === 'Non Io' && stimuliOther.includes(stimulus)) ||
                   (category === 'Vergogna' && stimuliShame.includes(stimulus)) ||
                   (category === 'Ansia' && stimuliAnxiety.includes(stimulus));
        } else if (currentBlock === 5) {
            return (category === 'Non Io' && stimuliOther.includes(stimulus)) ||
                   (category === 'Vergogna' && stimuliShame.includes(stimulus)) ||
                   (category === 'Io' && stimuliSelf.includes(stimulus)) ||
                   (category === 'Ansia' && stimuliAnxiety.includes(stimulus));
        }
        return false;
    }
});
