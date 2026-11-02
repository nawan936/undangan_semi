const SPREADSHEET_ID = '1x9iba5NX1dCYdpd-LKA6tK0_r9BrepeheJzXNgTkfZA';

function getUcapanSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets()[0];
  if (!sheet) {
    throw new Error('Spreadsheet tidak memiliki sheet.');
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(function(header) {
      return String(header).trim().toLowerCase();
    });
  const requiredHeaders = ['waktu', 'nama', 'ucapan', 'kehadiran', 'jumlah'];
  const missingHeaders = requiredHeaders.filter(function(header) {
    return headers.indexOf(header) === -1;
  });
  if (missingHeaders.length) {
    throw new Error('Kolom spreadsheet tidak lengkap: ' + missingHeaders.join(', '));
  }

  return { sheet: sheet, headers: headers };
}

function doGet(event) {
  const result = getUcapanSheet();
  const lastRow = result.sheet.getLastRow();
  const rows = lastRow < 2
    ? []
    : result.sheet.getRange(2, 1, lastRow - 1, result.headers.length).getValues();
  const comments = rows.map(function(row) {
    const item = {};
    result.headers.forEach(function(header, index) {
      item[header] = row[index];
    });
    return {
      waktu: item.waktu instanceof Date ? item.waktu.toLocaleString() : item.waktu,
      nama: item.nama,
      ucapan: item.ucapan,
      kehadiran: item.kehadiran,
      jumlah: item.jumlah
    };
  });

  const callback = event && event.parameter && event.parameter.callback;
  const output = callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)
    ? callback + '(' + JSON.stringify(comments) + ');'
    : JSON.stringify(comments);
  const mimeType = callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  return ContentService.createTextOutput(output).setMimeType(mimeType);
}

function doPost(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('Data ucapan tidak ditemukan.');
  }

  const data = JSON.parse(event.postData.contents);
  const nama = String(data.nama || '').trim();
  const ucapan = String(data.ucapan || 'Tidak ada ucapan.').trim();
  const kehadiran = String(data.ket_hadir || data.kehadiran || '').trim();
  const jumlah = Number(data.jumlah || 0);

  if (!nama || (kehadiran !== '0' && kehadiran !== '1')) {
    throw new Error('Nama dan status kehadiran wajib diisi dengan benar.');
  }
  if (!Number.isInteger(jumlah) || jumlah < 0 || jumlah > 10) {
    throw new Error('Jumlah kehadiran harus berupa angka antara 0 dan 10.');
  }

  const result = getUcapanSheet();
  const row = result.headers.map(function(header) {
    switch (header) {
      case 'waktu':
        return new Date();
      case 'nama':
        return nama;
      case 'ucapan':
        return ucapan;
      case 'kehadiran':
        return kehadiran === '1' ? 'Hadir' : 'Tidak hadir';
      case 'jumlah':
        return kehadiran === '1' ? jumlah : 0;
      default:
        return '';
    }
  });
  result.sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
