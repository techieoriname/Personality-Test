/**
 *
 * @param $answers - pass array of answer points
 */
function computedAnswers($answers: number[]) {
    // hold sum of result answer points
    let result = 0;

    for (const answer of $answers) {
        result += answer;
    }

    return result;
}

export = computedAnswers;
