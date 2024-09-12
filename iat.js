document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Il tuo nome'];
    const stimuliOther = ['Il nome di un altro'];
    const stimuliShame = ['Imbarazzo', 'Timidezza'];
    const stimuliAnxiety = ['Ansia', 'Paura'];

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

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space' && iatContainer.classList.contains('hidden')) {
            startIAT();
        } else if (event.code === 'ArrowLeft') {
            const leftCategory = getCategoryLeftForBlock(currentBlock);
            const isSelf = stimulusDiv.innerText === 'Il tuo nome';
            const isOther = stimulusDiv.innerText === 'Il nome di un altro';
            const isShame = stimuliShame.includes(stimulusDiv.innerText);
            const isCorrect = (leftCategory === 'Io' && isSelf) ||
                              (leftCategory === 'Vergogna' && isShame) ||
                              (leftCategory === 'Io e Vergogna' && (isSelf || isShame));
            recordResponse(isCorrect);
        } else if (event.code === 'ArrowRight') {
            const rightCategory = getCategoryRightForBlock(currentBlock);
            const isOther = stimulusDiv.innerText === 'Il nome di un altro';
            const isAnxiety = stimuliAnxiety.includes(stimulusDiv.innerText);
            const isCorrect = (rightCategory === 'Non Io' && isOther) ||
                              (rightCategory === 'Ansia' && isAnxiety) ||
                              (rightCategory === 'Non Io e Ansia' && (isOther || isAnxiety));
            recordResponse(isCorrect);
        }
    });
});
