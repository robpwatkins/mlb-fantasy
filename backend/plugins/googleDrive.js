const { getGoogleClient } = require('../utils/getAuthenticacatedGoogleClient');

const getAllSeries = async (spreadsheetId, range) => {
  const google = await getGoogleClient();
  const sheets = google.sheets('v4');
  const { values: rows } = (await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  })).data;
  const allSeries = [];
  let seriesGroup;
  rows.forEach((row, index) => {
    if (!row.length) return;
    if (row.length === 1 || index === rows.length - 1) {
      if (seriesGroup) allSeries.push(seriesGroup);
      seriesGroup = {};
      seriesGroup.dates = row[0];
    } else {
      if (!seriesGroup.series) seriesGroup.series = [row];
      else seriesGroup.series.push(row);
    }
  })
  return allSeries;
};

module.exports = { getAllSeries };