document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Il tuo nome']; // Stimolo associato a "Io"
    const stimuliOther = ['Il nome di un altro']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Imbarazzo', 'Timidezza']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Ansia', 'Paura']; // Stimoli associati a "Ansia"

    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let startTime, endTime;
    const reactionTimes = [];

    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const stimulusDiv = document.getElementById('stimulus');
    const errorMessage = document.getElementById('error-message');
    const iatContainer = document.getElementById('iat-container');
    const resultsDiv = document.getElementById('results');
    const reactionTimesDisplay = document.getElementById('reaction-times');

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        showNextStimulus();
    }

    function showNextStimulus() {
        errorMessage.classList.add('hidden');
        stimulusDiv.innerText = getStimulusForBlock(currentBlock);
        categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
        categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);
        startTime = new Date().getTime();
    }

    function getStimulusForBlock(block) {
        if (block === 1 || block === 4) {
            return Math.random() > 0.5 
                ? stimuliSelf[0] 
                : stimuliOther[0];
        } else if (block === 2 || block === 5) {
            return Math.random() > 0.5 
                ? stimuliShame[Math.floor(Math.random() * stimuliShame.length)] 
                : stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)];
        } else if (block === 3) {
            return Math.random() > 0.5 
                ? stimuliSelf[0] 
                : stimuliShame[Math.floor(Math.random() * stimuliShame.length)];
        } else {
            return Math.random() > 0.5 
                ? stimuliSelf[0] 
                : stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)];
        }
    }

    function getCategoryLeftForBlock(block) {
        switch (block) {
            case 1:
            case 4:
                return 'Io';
            case 2:
            case 5:
                return 'Vergogna';
            case 3:
                return 'Io e Vergogna';
            default:
                return '';
        }
    }

    function getCategoryRightForBlock(block) {
        switch (block) {
            case 1:
            case 4:
                return 'Non Io';
            case 2:
            case 5:
                return 'Ansia';
            case 3:
                return 'Non Io e Ansia';
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
            currentStimulusIndex++;
            if (currentStimulusIndex < 20) {
                showNextStimulus();
            } else {
                nextBlock();
            }
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    function nextBlock() {
        currentBlock++;
        currentStimulusIndex = 0;
        if (currentBlock > 5) {
            endTest();
        } else {
            showBlockInfo();
        }
    }

    function showBlockInfo() {
        iatContainer.classList.add('hidden');
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati! Premi la barra spaziatrice per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
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
                return stimulus === 'Il tuo nome';
            case 'Non Io':
                return stimulus === 'Il nome di un altro';
            case 'Vergogna':
                return stimuliShame.includes(stimulus);
            case 'Ansia':
                return stimuliAnxiety.includes(stimulus);
            case 'Io e Vergogna':
                return stimulus === 'Il tuo nome' || stimuliShame.includes(stimulus);
            case 'Non Io e Ansia':
                return stimulus === 'Il nome di un altro' || stimuliAnxiety.includes(stimulus);
            default:
                return false;
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space' && iatContainer.classList.contains('hidden')) {
            startIAT();
        } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
            const isLeft = event.code === 'ArrowLeft';
            const category = isLeft ? getCategoryLeftForBlock(currentBlock) : getCategoryRightForBlock(currentBlock);
            const stimulusText = stimulusDiv.innerText;
            const isCorrect = isCorrectResponse(category, stimulusText);

            recordResponse(isCorrect);
        }
    });
});
