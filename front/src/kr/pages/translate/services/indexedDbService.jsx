let db;
//1. indexedDB를 초기화한 후 연결
export const initDB = (dbName, objectStoreName) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName);
    request.onerror = (event) => {
      reject("indexedDB에 연결할 수 없습니다.: " + event.target.errorCode);
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      if (db.objectStoreNames.contains(objectStoreName)) {
        resolve(db);
        return;
      }
      const newVersion = db.version + 1;
      db.close();

      const upgradeRequest = indexedDB.open(dbName, newVersion);
      upgradeRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        // 해당 이름의 객체저장소가 없을 때만 생성
        if (!db.objectStoreNames.contains(objectStoreName)) {
          db.createObjectStore(objectStoreName, { keyPath: "id" });
        }
      };
      upgradeRequest.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };
      upgradeRequest.onerror = (event) => {
        reject("db 버전 갱신 실패: " + event.target.error);
      };
    };
    request.onerror = (event) => {
      reject("초기화 실패: " + event.target.error);
    };
  });
};

//2. indexedDB에 데이터 추가 함수
export const addData = (data, objectStoreName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);

    if (Array.isArray(data)) {
      let completed = 0;
      data.forEach((item, index) => {
        // id가 없는 경우 추가
        if (!item.id) {
          item.id = index + 1;
        }
        const request = objectStore.add(item);

        request.onsuccess = () => {
          completed++;
          if (completed === data.length) {
            resolve();
          }
        };

        request.onerror = (event) => {
          // console.error("Error adding item:", item, event.target.error);
          reject("데이터 추가 실패: " + event.target.error);
        };
      });
    }
  });
};

//3. indexedDB에서 데이터 전부 가져오기
export const loadData = (objectStoreName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.getAll();
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject("데이터 가져오기 실패: " + event.target.error);
    };
  });
};

//4. 현재 버전 indexedDB와 연결 해제(버전 업 작업을 위해서 먼저 연결해제하는 게 필수)
export const closeAllConnections = () => {
  if (db) {
    db.close();
    db = null;
  }
};

//5. 특정 필드에서 키워드 검색 (부분 일치 검색)
export const searchData = (objectStoreName, fieldName, query) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);
    const results = [];

    const request = objectStore.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const value = cursor.value[fieldName];
        if (
          value &&
          value.toString().toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(results); // 모든 검색이 끝난 후 결과 반환
      }
    };
    request.onerror = (event) => {
      reject("검색 실패: " + event.target.error);
    };
  });
};

export const clearDB = async () => {
  await indexedDB.deleteDatabase("docs");
};
