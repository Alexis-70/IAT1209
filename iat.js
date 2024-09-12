document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Il tuo nome']; // Stimolo associato a "Io"
    const stimuliOther = ['Il nome di un altro']; // Stimolo associato a "Non Io"
    const stimuliShame = ['Imbarazzo', 'Timidezza']; // Stimoli associati a "Vergogna"
    const stimuliAnxiety = ['Ansia', 'Paura']; // Stimoli associati a "Ansia"

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
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0])
                ];
                break;
            case 2:
            case 5:
                // Blocchi 2 e 5: 10 stimoli per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 3:
                // Blocco 3: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia"
                stimulusList = [
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0]),
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 5:
                // Blocco 5: 10 stimoli per "Io", 10 per "Non Io", 10 per "Vergogna" e 10 per "Ansia", 
                // con "Io" e "Non Io" invertiti rispetto al blocco 3
                stimulusList = [
                    ...Array(10).fill(stimuliSelf[0]),
                    ...Array(10).fill(stimuliOther[0]),
                    ...Array(10).fill(stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill(stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
            case 4:
                return 'Io';
            case 2:
            case 5:
                return 'Vergogna';
            case 3:
                return 'Io e Vergogna';
            case 5:
                return 'Non Io e Ansia'; // Inversione per il blocco 5
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
            case 5:
                return 'Io e Vergogna'; // Inversione per il blocco 5
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
        const blockMessage = `Inizia il blocco ${currentBlock}. Preparati! Premi la barra spaziatrice per continuare.`;
        alert(blockMessage);
        iatContainer.classList.remove('hidden');
        generateStimuliForBlock(currentBlock);
        currentStimulusIndex = 0; // Reset the index for the new block
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
