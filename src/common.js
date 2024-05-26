const commonPublicFunctions = () => {
  const publicFunctions = {
    HOUR_MILLISECOND: 1000*60*60,
    getCurrentDate: () => {
      return new Date();
    },
    getNextDate: () => {
      const today = new Date()
      const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      return nextDay;
    },
    getNext20Date: () => {
      const today = new Date();
      if (today.getDate() > 20) {
        today.setMonth(today.getMonth() + 1);
      }
      today.setDate(20);
      return today;
    },
    getLastDate: (yyyy, mm) => {
      const today = new Date();
      if(yyyy) today.setFullYear(yyyy);
      if(mm) today.setMonth(mm - 1);

      const endOfTheMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return endOfTheMonth;
    },
    // 今週の日曜日
    getFirstDayOfTheCurrentWeek: () => {
      const today = new Date();
      today.setDate(today.getDate() - today.getDay());
      return today;
    },
    // 来週の日曜日
    getFirstDayOfTheNextWeek: () => {
      const today = new Date();
      const result = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7)
      return result;
    },
    // 4週間後の火曜日
    getTuesdayOfThe4WeeksLater: () => {
      const today = new Date();
      const result = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2 + (7 * 4))
      return result;
    },
    // 来月の第3週目の水曜日
    getThirdWednesdayOfTheNextMonth: () => {
      const today = new Date();
      // 来月月初
      const b = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      // 来月月初の週の日曜日
      const e = new Date(b.getFullYear(), b.getMonth(), b.getDate() - b.getDay())
      // 来月の第三水曜日
      const r = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 3 + (7 * 2))

      return r
    },
    // 最終週の水曜日を返す※当月ではなく、該当の日付から見た最終週の水曜日
    // セルに記載されてる日付から過ぎた場合に起動するので、当月の最終週の水曜日を返す方針にする。


    getMondayOfTheCurrentWeek: () => {
      const today = new Date();
      today.setDate(today.getDate() - today.getDay() + 1);
      return today;
    },
    getEndDayOfTheCurrentWeek: () => {
      const today = new Date();
      today.setDate(today.getDate() - today.getDay() + 6);
      return today;
    },

    // 最新のメンテナンス日を取得
    getMaintenanceDate: () => {
      const response = UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('fetchMaintenanceDate'));
      const maintenanceDate = new Date(JSON.parse(response).maintenance_date);
      const today = new Date();
      // 来年のメンテの場合、今年の年数に+1してメンテの年を求める。(メンテ日に年の記載がないためこのような実装が必要)
      if(today.getMonth() === 12 && maintenanceDate.getMonth() === 1){
        return new Date(today.getFullYear()+1, maintenanceDate.getMonth(), maintenanceDate.getDate());
      }else{
        return new Date(today.getFullYear(), maintenanceDate.getMonth(), maintenanceDate.getDate());
      }
    },

    sendMessageToDiscordEventChannel: (message) => {
      const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty('discordWebHook');

      const payload = {
        username: '時限通知',
        content: message,
      };

      UrlFetchApp.fetch(WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      });
    },
    sendMessageToDiscordClanEventChannel: (message) => {
      const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty('discordWebHook3');

      const payload = {
        username: 'クライベ通知',
        content: message,
      };

      UrlFetchApp.fetch(WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      });
    },
    sendMessageToDiscordScheduleChannel: (message) => {
      const WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty('discordWebHook2');

      const payload = {
        username: 'スケジュール',
        content: message,
      };

      UrlFetchApp.fetch(WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      });
    },

    findColumnByHeader: (sheet, val) => {
      const last_col = sheet.getLastColumn();
      const range = sheet.getRange(1, 1, 1, last_col);
      const headers = range.getValues().flat();

      for(let i=0;i<headers.length;i++){
        if(headers[i] === val){
          return i+1;
        }
      }
      return 0;
    },
  }
  return publicFunctions;
}


// 存在する日付かをチェックする
function ckDate(strDate) {
  var y = strDate.split("/")[0];
  var m = strDate.split("/")[1] - 2;
  var d = strDate.split("/")[2];
  var date = new Date(y,m,d);
  if(date.getFullYear() != y || date.getMonth() != m || date.getDate() != d){
    return false;
  }
  return true;
}

// 指定したシートを指定したbookにコピーして一番左へ移動
// ついでにシート１も削除
function copySheetToSpreadSheets(sheet, spreadSheetsId){
  let destSpreadsheet = SpreadsheetApp.openById(spreadSheetsId);
  let newCopySheet = sheet.copyTo(destSpreadsheet);
  newCopySheet.setName(sheet.getSheetName());
  if(destSpreadsheet.getSheetByName("シート1")){
    destSpreadsheet.deleteSheet(destSpreadsheet.getSheetByName("シート1"));
  }
}

// 指定したフォルダーに名前を指定して新しいbookを作成
function createSpreadsheetInfolder(folderID, fileName) {
  var folder = DriveApp.getFolderById(folderID);
  var newSS=SpreadsheetApp.create(fileName);
  var originalFile=DriveApp.getFileById(newSS.getId());
  var copiedFile = originalFile.makeCopy(fileName, folder);
  originalFile.setTrashed(true);
  return copiedFile;
}