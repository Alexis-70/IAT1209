document.addEventListener('DOMContentLoaded', function () {
    const stimuliSelf = ['Io', 'Me', 'Miei', 'Mie', 'Mio', 'Me stesso'];
    const stimuliOther = ['Loro', 'Lui', 'Lei', 'Suo', 'Suoi', 'Essi'];
    const stimuliShame = ['Arrossamento', 'Imbarazzo', 'Vergogna', 'Vergognoso/a'];
    const stimuliAnxiety = ['Ansioso/a', 'Tachicardia', 'Paura', 'Incertezza'];

    // Per familiarizzazione
    const familiarizationSelf = [...Array(20).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)])];
    const familiarizationOther = [...Array(20).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)])];
    const familiarizationShame = [...Array(20).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)])];
    const familiarizationAnxiety = [...Array(20).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])];

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
    let lastStimulus = null; // Track the last stimulus shown

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
        blockStimuliCount = 0;
        lastStimulus = null; // Reset lastStimulus for the new block

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
                // Blocco 3: 20 stimoli di familiarizzazione + 20 stimoli per il test
                stimulusList = [
                    ...familiarizationSelf,
                    ...familiarizationOther,
                    ...Array(10).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
                    ...Array(10).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
                    ...Array(10).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
                    ...Array(10).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
                ];
                break;
            case 5:
                // Blocco 5: 20 stimoli di familiarizzazione + 20 stimoli per il test
                stimulusList = [
                    ...familiarizationOther,
                    ...familiarizationShame,
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
        if (blockStimuliCount < 20 || currentStimulusIndex < stimulusList.length) { // Ensure correct number of stimuli per block
            if (currentStimulusIndex < stimulusList.length) {
                let newStimulus;
                do {
                    newStimulus = stimulusList[currentStimulusIndex];
                    currentStimulusIndex++;
                } while (newStimulus === lastStimulus && currentStimulusIndex < stimulusList.length);

                errorMessage.classList.add('hidden');
                stimulusDiv.innerText = newStimulus;
                categoryLeftDiv.innerText = getCategoryLeftForBlock(currentBlock);
                categoryRightDiv.innerText = getCategoryRightForBlock(currentBlock);
                startTime = new Date().getTime();
                blockStimuliCount++;
                lastStimulus = newStimulus; // Update the lastStimulus
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

      function showBlockInstructions() {
        const instructionsText = getBlockInstructions(currentBlock);
        const blockInstructionsDiv = document.getElementById('block-instructions');
        blockInstructionsDiv.innerText = instructionsText;
        blockInstructionsDiv.classList.remove('hidden');

        // Mostra il messaggio e avvia il blocco dopo un ritardo
        setTimeout(() => {
            blockInstructionsDiv.classList.add('hidden');
            iatContainer.classList.remove('hidden');
            generateStimuliForBlock(currentBlock);
            showNextStimulus();
        }, 5000); // Mostra il messaggio per 5 secondi
    }

    function getBlockInstructions(block) {
        switch (block) {
            case 1:
                return 'In questo blocco, premi il tasto sinistro per "Io" e il tasto destro per "Non Io".';
            case 2:
                return 'In questo blocco, premi il tasto sinistro per "Vergogna" e il tasto destro per "Ansia".';
            case 3:
                return 'In questo blocco, premi il tasto sinistro per "Io" o "Vergogna" e il tasto destro per "Non Io" o "Ansia".';
            case 4:
                return 'In questo blocco, premi il tasto sinistro per "Non Io" e il tasto destro per "Io".';
            case 5:
                return 'In questo blocco, premi il tasto sinistro per "Non Io" o "Vergogna" e il tasto destro per "Io" o "Ansia".';
            default:
                return '';
        }
    }

    function nextBlock() {
        currentBlock++;
        if (currentBlock > 5) {
            endTest();
        } else {
            iatContainer.classList.add('hidden');
            showBlockInstructions();
        }
    }

    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        const avgRT_Io_Vergogna = average(reactionTimes['Io_Vergogna']);
        const avgRT_NonIo_Vergogna = average(reactionTimes['NonIo_Vergogna']);
        const avgRT_Io_Ansia = average(reactionTimes['Io_Ansia']);
        const avgRT_NonIo_Ansia = average(reactionTimes['NonIo_Ansia']);

        const sd = standardDeviation([...reactionTimes['Io_Vergogna'], ...reactionTimes['NonIo_Vergogna'], ...reactionTimes['Io_Ansia'], ...reactionTimes['NonIo_Ansia']]);
        const D = ((avgRT_Io_Vergogna - avgRT_Io_Ansia) - (avgRT_NonIo_Vergogna - avgRT_NonIo_Ansia)) / sd;

        reactionTimesDisplay.innerText = `Tempo medio di reazione per "Io e Vergogna": ${avgRT_Io_Vergogna.toFixed(2)} ms\nTempo medio di reazione per "Non Io e Vergogna": ${avgRT_NonIo_Vergogna.toFixed(2)} ms\nTempo medio di reazione per "Io e Ansia": ${avgRT_Io_Ansia.toFixed(2)} ms\nTempo medio di reazione per "Non Io e Ansia": ${avgRT_NonIo_Ansia.toFixed(2)} ms\nPunteggio D: ${D.toFixed(2)}`;

        // Codice per inviare i dati al Google Form
        const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf-1xmaYc6C0_cWOJQ14_HyUP9JJwiak5X4XhKpPnJRKCBXOw/formResponse'; // Inserisci qui l'URL del tuo Google Form
        const data = {
            'entry.695362309': userName, // Sostituisci con l'ID del campo per il nome
            'entry.222093517': userSurname, // Sostituisci con l'ID del campo per il cognome
            'entry.1683801057': D.toFixed(2) // Sostituisci con l'ID del campo per il punteggio D
        };

        const formData = new URLSearchParams(data).toString();
        fetch(formUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('Dati inviati con successo.');
            } else {
                console.log('Errore nell\'invio dei dati.');
            }
        }).catch(error => {
            console.error('Errore:', error);
        });
    }
    
    function average(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function standardDeviation(arr) {
        const avg = average(arr);
        return Math.sqrt(arr.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / arr.length);
    }

    function isCorrectResponse(category, stimulus) {
        console.log(`Checking Response - Stimulus: ${stimulus}, Category: ${category}`);
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

    startButton.addEventListener('click', function () {
        startIAT();
        startButton.classList.add('hidden');
        document.getElementById('touch-buttons').classList.remove('hidden');
    });

    leftButton.addEventListener('click', function () {
        const stimulus = stimulusDiv.innerText;
        const categoryLeft = getCategoryLeftForBlock(currentBlock);
        console.log(`Left Button Pressed - Stimulus: ${stimulus}, Category: ${categoryLeft}`);
        recordResponse(isCorrectResponse(categoryLeft, stimulus));
    });

    rightButton.addEventListener('click', function () {
        const stimulus = stimulusDiv.innerText;
        const categoryRight = getCategoryRightForBlock(currentBlock);
        console.log(`Right Button Pressed - Stimulus: ${stimulus}, Category: ${categoryRight}`);
        recordResponse(isCorrectResponse(categoryRight, stimulus));
    });

    document.addEventListener('keydown', function (event) {
        const stimulus = stimulusDiv.innerText;
        if (event.key === 'ArrowLeft') {
            const categoryLeft = getCategoryLeftForBlock(currentBlock);
            console.log(`ArrowLeft Key Pressed - Stimulus: ${stimulus}, Category: ${categoryLeft}`);
            recordResponse(isCorrectResponse(categoryLeft, stimulus));
        } else if (event.key === 'ArrowRight') {
            const categoryRight = getCategoryRightForBlock(currentBlock);
            console.log(`ArrowRight Key Pressed - Stimulus: ${stimulus}, Category: ${categoryRight}`);
            recordResponse(isCorrectResponse(categoryRight, stimulus));
        }
    });
});
