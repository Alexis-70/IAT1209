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
case 5:
    stimulusList = [
        ...Array(15).fill().map(() => stimuliSelf[Math.floor(Math.random() * stimuliSelf.length)]),
        ...Array(15).fill().map(() => stimuliOther[Math.floor(Math.random() * stimuliOther.length)]),
        ...Array(15).fill().map(() => stimuliShame[Math.floor(Math.random() * stimuliShame.length)]),
        ...Array(15).fill().map(() => stimuliAnxiety[Math.floor(Math.random() * stimuliAnxiety.length)])
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
        endTime = new Date().getTime();
        const reactionTime = endTime - startTime;

        console.log('Tempo di reazione:', reactionTime);  // Log per vedere il tempo di reazione registrato

        // Conta solo i tempi di reazione dal 21° stimolo in poi (per blocchi 3 e 5)
        if ((currentBlock === 3 || currentBlock === 5) && blockStimuliCount > 20) {
            if (currentBlock === 3) {
                if (stimuliSelf.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['Io_Vergogna'].push(reactionTime);
                    console.log('Tempi di reazione Io_Vergogna:', reactionTimes['Io_Vergogna']);
                } else if (stimuliOther.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['NonIo_Ansia'].push(reactionTime);
                    console.log('Tempi di reazione NonIo_Ansia:', reactionTimes['NonIo_Ansia']);
                } else if (stimuliShame.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['Io_Vergogna'].push(reactionTime);
                    console.log('Tempi di reazione Io_Vergogna:', reactionTimes['Io_Vergogna']);
                } else if (stimuliAnxiety.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['NonIo_Ansia'].push(reactionTime);
                    console.log('Tempi di reazione NonIo_Ansia:', reactionTimes['NonIo_Ansia']);
                }
            } else if (currentBlock === 5) {
                if (stimuliSelf.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['Io_Ansia'].push(reactionTime);
                    console.log('Tempi di reazione Io_Ansia:', reactionTimes['Io_Ansia']);
                } else if (stimuliOther.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['NonIo_Vergogna'].push(reactionTime);
                    console.log('Tempi di reazione NonIo_Vergogna:', reactionTimes['NonIo_Vergogna']);
                } else if (stimuliShame.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['NonIo_Vergogna'].push(reactionTime);
                    console.log('Tempi di reazione NonIo_Vergogna:', reactionTimes['NonIo_Vergogna']);
                } else if (stimuliAnxiety.includes(stimulusList[currentStimulusIndex - 1])) {
                    reactionTimes['Io_Ansia'].push(reactionTime);
                    console.log('Tempi di reazione Io_Ansia:', reactionTimes['Io_Ansia']);
                }
            }
        } else if (currentBlock === 1 || currentBlock === 4 || currentBlock === 2) {
            // Non registrare il tempo per i blocchi 1, 2, e 4
        }

        // Nascondi il messaggio di errore e mostra il prossimo stimolo
        errorMessage.classList.add('hidden');
        showNextStimulus();
    } else {
        // Mostra un messaggio di errore senza modificare il timer
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
    
    // Ottieni le categorie per sinistra e destra
    const leftCategory = getCategoryLeftForBlock(currentBlock);
    const rightCategory = getCategoryRightForBlock(currentBlock);
    
    // Crea il messaggio dinamico
    const blockMessage = `Inizia il blocco ${currentBlock}. In questo blocco bisognerà premere a sinistra per assegnare le parole alla categoria "${leftCategory}", e premere a destra per la categoria "${rightCategory}". Ricordi di premere i pulsanti il più velocemente possibile. Prema il pulsante "Inizia" per continuare.`;

    // Mostra il messaggio all'utente (puoi usare un alert, o personalizzare con una modale)
    alert(blockMessage);
    
    iatContainer.classList.remove('hidden');
    generateStimuliForBlock(currentBlock);
    currentStimulusIndex = 0;
    showNextStimulus();
}


    function endTest() {
        iatContainer.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        const avgRT_Io_Vergogna = average(reactionTimes['Io_Vergogna']);
        const avgRT_NonIo_Vergogna = average(reactionTimes['NonIo_Vergogna']);
        const avgRT_Io_Ansia = average(reactionTimes['Io_Ansia']);
        const avgRT_NonIo_Ansia = average(reactionTimes['NonIo_Ansia']);

        const sd = standardDeviation([...reactionTimes['Io_Vergogna'], ...reactionTimes['NonIo_Vergogna'], ...reactionTimes['Io_Ansia'], ...reactionTimes['NonIo_Ansia']]);
        const avgRT_Compatibile = (avgRT_Io_Vergogna + avgRT_NonIo_Ansia) / 2;
const avgRT_Incompatibile = (avgRT_Io_Ansia + avgRT_NonIo_Vergogna) / 2;
// Calcola il tasso di errore
    const totalResponses = reactionTimes['Io_Vergogna'].length + reactionTimes['NonIo_Vergogna'].length + reactionTimes['Io_Ansia'].length + reactionTimes['NonIo_Ansia'].length;
    const incorrectResponses = totalResponses - (reactionTimes['Io_Vergogna'].length + reactionTimes['NonIo_Vergogna'].length + reactionTimes['Io_Ansia'].length + reactionTimes['NonIo_Ansia'].length); // Aggiorna in base a come registri le risposte corrette
    const errorRate = incorrectResponses / totalResponses;

    // Condizioni per considerare il punteggio D come non interpretabile
    const isAvgRTInvalid = (
        avgRT_Io_Vergogna < 300 || avgRT_Io_Vergogna > 3000 ||
        avgRT_NonIo_Vergogna < 300 || avgRT_NonIo_Vergogna > 3000 ||
        avgRT_Io_Ansia < 300 || avgRT_Io_Ansia > 3000 ||
        avgRT_NonIo_Ansia < 300 || avgRT_NonIo_Ansia > 3000
    );

    if (isAvgRTInvalid || errorRate > 0.2) { // Se ci sono tempi di reazione non validi o un tasso di errore maggiore del 20%
        reactionTimesDisplay.innerText = `Il punteggio D non è interpretabile.`;
        return;
    }

const D = (avgRT_Incompatibile - avgRT_Compatibile) / sd;

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
