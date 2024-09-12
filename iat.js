document.addEventListener('DOMContentLoaded', function () {
    const categoriesTarget = ['Io', 'Non Io'];
    const categoriesAttribute = ['Vergogna', 'Ansia'];
    const stimuliSelf = ['Il tuo nome'];
    const stimuliOther = ['Il nome di un altro'];
    const stimuliShame = ['Imbarazzo', 'Timidezza'];
    const stimuliAnxiety = ['Ansia', 'Paura'];

    let currentStimulusIndex = 0;
    let currentBlock = 1;
    let startTime, endTime;
    const reactionTimes = [];

    const startButton = document.getElementById('start-button');
    const categoryLeftDiv = document.getElementById('category-left');
    const categoryRightDiv = document.getElementById('category-right');
    const stimulusDiv = document.getElementById('stimulus');
    const errorMessage = document.getElementById('error-message');
    const iatContainer = document.getElementById('iat-container');
    const resultsDiv = document.getElementById('results');
    const reactionTimesDisplay = document.getElementById('reaction-times');
    const leftZone = document.getElementById('left-zone');
    const rightZone = document.getElementById('right-zone');

    function startIAT() {
        document.getElementById('instructions').classList.add('hidden');
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        showNextStimulus();
    }

    function showNextStimulus() {
        errorMessage.classList.add('hidden');
        if (currentStimulusIndex >= stimuliForCurrentBlock.length) {
            nextBlock();
            return;
        }
        stimulusDiv.innerText = stimuliForCurrentBlock[currentStimulusIndex];
        categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
        categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);
        startTime = new Date().getTime();
    }

    function generateStimuliForBlock(block) {
        let stimuliForBlock = [];
        if (block === 1) {
            for (let i = 0; i < 10; i++) {
                stimuliForBlock.push(stimuliSelf[0]);
                stimuliForBlock.push(stimuliOther[0]);
            }
        } else if (block === 2) {
            for (let i = 0; i < 10; i++) {
                stimuliForBlock.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                stimuliForBlock.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
            }
        } else if (block === 3) {
            for (let i = 0; i < 10; i++) {
                stimuliForBlock.push(stimuliSelf[0]);
                stimuliForBlock.push(stimuliOther[0]);
                stimuliForBlock.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                stimuliForBlock.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
            }
        } else if (block === 4) {
            for (let i = 0; i < 10; i++) {
                stimuliForBlock.push(stimuliSelf[0]);
                stimuliForBlock.push(stimuliOther[0]);
            }
        } else if (block === 5) {
            for (let i = 0; i < 10; i++) {
                stimuliForBlock.push(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]);
                stimuliForBlock.push(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)]);
                stimuliForBlock.push(stimuliSelf[0]);
                stimuliForBlock.push(stimuliOther[0]);
            }
        }
        stimuliForBlock = shuffle(stimuliForBlock);
        stimuliForCurrentBlock = stimuliForBlock;
    }

    function getCategoryLeftForBlock(block) {
        switch (block) {
            case 1:
            case 4:
                return 'Non Io';
            case 2:
                return 'Vergogna';
            case 3:
                return 'Io e Vergogna'; 
            case 5:
                return 'Non Io e Vergogna';
            default:
                return '';
        }
    }

    function getCategoryRightForBlock(block) {
        switch (block) {
            case 1:
            case 4:
                return 'Io';
            case 2:
                return 'Ansia';
            case 3:
                return 'Ansia e Io';
            case 5:
                return 'Ansia e Io';
            default:
                return '';
        }
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function recordResponse(isCorrect) {
        if (isCorrect) {
            errorMessage.classList.add('hidden');
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;
            reactionTimes.push(reactionTime);
            currentStimulusIndex++;
            if (currentStimulusIndex < stimuliForCurrentBlock.length) {
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
        generateStimuliForBlock(currentBlock);
        showNextStimulus();
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        const avgReactionTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
        reactionTimesDisplay.innerText = `Tempo medio di reazione: ${avgReactionTime.toFixed(2)} ms`;
    }

    function checkResponse(category, stimulus) {
        const isSelf = stimulus === stimuliSelf[0];
        const isOther = stimulus === stimuliOther[0];
        const isShame = stimuliShame.includes(stimulus);
        const isAnxiety = stimuliAnxiety.includes(stimulus);

        if (category === 'Io') {
            return isSelf;
        }
        if (category === 'Non Io') {
            return isOther;
        }
        if (category === 'Vergogna') {
            return isShame;
        }
        if (category === 'Ansia') {
            return isAnxiety;
        }
        return false;
    }

    startButton.addEventListener('click', function () {
        startIAT();
    });

    leftZone.addEventListener('click', function () {
        const correctResponse = checkResponse(getCategoryLeftForBlock(currentBlock), stimulusDiv.innerText);
        recordResponse(correctResponse);
    });

    rightZone.addEventListener('click', function () {
        const correctResponse = checkResponse(getCategoryRightForBlock(currentBlock), stimulusDiv.innerText);
        recordResponse(correctResponse);
    });
});
