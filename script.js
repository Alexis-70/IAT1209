// Variabili per memorizzare i tempi di reazione per ciascun blocco
let reactionTimesBlock1 = [];
let reactionTimesBlock2 = [];
let reactionTimesBlock3 = [];
let reactionTimesBlock4 = [];
let reactionTimesBlock5 = [];

// Funzione per registrare i tempi di reazione
function recordResponse(isCorrect) {
    if (isCorrect) {
        errorMessage.classList.add('hidden');
        endTime = new Date().getTime();
        const reactionTime = endTime - startTime;
        reactionTimes.push(reactionTime);

        // Registra il tempo di reazione per il blocco specifico
        switch (currentBlock) {
            case 1:
                reactionTimesBlock1.push(reactionTime);
                break;
            case 2:
                reactionTimesBlock2.push(reactionTime);
                break;
            case 3:
                reactionTimesBlock3.push(reactionTime);
                break;
            case 4:
                reactionTimesBlock4.push(reactionTime);
                break;
            case 5:
                reactionTimesBlock5.push(reactionTime);
                break;
        }

        showNextStimulus();
    } else {
        errorMessage.classList.remove('hidden');
    }
}

// Funzione per calcolare la media dei dati
function calculateMean(data) {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
}

// Funzione per calcolare la deviazione standard dei dati
function calculateStandardDeviation(data, mean) {
    return Math.sqrt(data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length);
}

// Funzione per calcolare il punteggio D
function calculateDScore() {
    const meanBlock3 = calculateMean(reactionTimesBlock3);
    const meanBlock4 = calculateMean(reactionTimesBlock4);
    const combinedData = reactionTimesBlock3.concat(reactionTimesBlock4);
    const sd = calculateStandardDeviation(combinedData, calculateMean(combinedData));

    const dScore = (meanBlock3 - meanBlock4) / sd;
    return dScore;
}

// Funzione per terminare il test e visualizzare i risultati
function endTest() {
    iatContainer.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    
    // Calcolare la media dei tempi di reazione
    const avgReactionTime = reactionTimes.reduce((a, b) => a + b) / reactionTimes.length;
    reactionTimesDisplay.innerText = `Tempo medio di reazione: ${avgReactionTime.toFixed(2)} ms`;
    
    // Calcolare e mostrare il punteggio D
    const dScore = calculateDScore();
    const dScoreDisplay = document.createElement('div');
    dScoreDisplay.innerText = `Punteggio D: ${dScore.toFixed(2)}`;
    resultsDiv.appendChild(dScoreDisplay);
}
