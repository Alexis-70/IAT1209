document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Mio', 'Me', 'Me stesso', 'Miei']; // Stimolo associato a "Io"
    const stimuliOther = ['Lui', 'Lei', 'Loro', 'Suo', 'Suoi']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Imbarazzo', 'Fallimento', 'Arrossamento', 'Rifiuto']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Ansia', 'Nervi a fior di pelle', 'Tachicardia']; // Stimoli associati a "Ansia"

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
    const leftZone = document.querySelector('.left-zone');
    const rightZone = document.querySelector('.right-zone');

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
                    ...getRandomStimuli(stimuliSelf, 10),
                    ...getRandomStimuli(stimuliOther, 10)
                ];
                break;
            case 2:
                stimulusList = [
                    ...getRandomStimuli(stimuliShame, 10),
                    ...getRandomStimuli(stimuliAnxiety, 10)
                ];
                break;
            case 3:
                stimulusList = [
                    ...getRandomStimuli(stimuliSelf, 10),
                    ...getRandomStimuli(stimuliOther, 10),
                    ...getRandomStimuli(stimuliShame, 10),
                    ...getRandomStimuli(stimuliAnxiety, 10)
                ];
                break;
            case 5:
                stimulusList = [
                    ...getRandomStimuli(stimuliOther, 10),
                    ...getRandomStimuli(stimuliShame, 10),
                    ...getRandomStimuli(stimuliSelf, 10),
                    ...getRandomStimuli(stimuliAnxiety, 10)
                ];
                break;
        }
        shuffleArray(stimulusList);
    }

    function getRandomStimuli(stimuliArray, count) {
        const randomStimuli = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * stimuliArray.length);
            randomStimuli.push(stimuliArray[randomIndex]);
        }
        return randomStimuli;
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
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati! Premi il pulsante Start per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        showNextStimulus(); }
  
function endTest() {
    iatContainer.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    reactionTimesDisplay.innerText = `I tuoi tempi di reazione: ${reactionTimes.join(', ')} ms`;
}

function handleTouchInput(side) {
    const currentStimulus = stimulusDiv.innerText;
    let isCorrect = false;

    if (currentBlock === 1 || currentBlock === 4) {
        if ((side === 'left' && currentStimulus === 'Il tuo nome') || (side === 'right' && currentStimulus === 'Il nome di un altro')) {
            isCorrect = true;
        }
    } else if (currentBlock === 2 || currentBlock === 5) {
        if ((side === 'left' && (currentStimulus === 'Imbarazzo' || currentStimulus === 'Timidezza')) || 
            (side === 'right' && (currentStimulus === 'Ansia' || currentStimulus === 'Paura'))) {
            isCorrect = true;
        }
    } else if (currentBlock === 3) {
        if ((side === 'left' && (currentStimulus === 'Il tuo nome' || currentStimulus === 'Imbarazzo' || currentStimulus === 'Timidezza')) || 
            (side === 'right' && (currentStimulus === 'Il nome di un altro' || currentStimulus === 'Ansia' || currentStimulus === 'Paura'))) {
            isCorrect = true;
        }
    }

    recordResponse(isCorrect);
}

startButton.addEventListener('click', startIAT);

leftZone.addEventListener('click', function () {
    handleTouchInput('left');
});

rightZone.addEventListener('click', function () {
    handleTouchInput('right');
});
