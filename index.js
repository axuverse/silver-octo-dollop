const https = require('https');
const cheerio = require('cheerio');
const constants = require('./constants');
let requestStack = [];

const scrape = (url, heur) => {
    if (!url.indexOf(constants.URL_PREFIX.HTTPS)) {
        https.get(url, stream => {
            requestStack.push({date: Date.now(), statusCode: stream.statusCode});
            console.log('Request ', requestStack.length, ': ', stream.statusCode);

            let dataCluster = [];
            stream.on('data', dataChunk => {dataCluster.push(dataChunk)});
            stream.on('end', () => {
                dataCluster.forEach(dataItem => {
                    let $queries = heur;
                    let queryString = '';
                    const $ = cheerio.load(dataItem);
                    while ($queries.length) {
                        if (queryString.length) queryString += ' > ';
                        const $currentQuery = $query.shift();
                        queryString += `${$currentQuery.typeSpecifier} ${$currentQuery.classSpecifier}`;
                    }
                    return $(queryString).html();
                });
            });
        }).on('error', e => {console.log('Error: ', e)});
    }
}

module.exports = {
    scrape: scrape,
    requestStack: requestStack
}