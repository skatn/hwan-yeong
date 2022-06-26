import mysql from "mysql";

const pool = mysql.createPool({
  host: "us-cdbr-east-05.cleardb.net",
  user: "b898cbd3cc64d8",
  password: "fd8a6b3c",
  database: "heroku_a03b5b0676d3b80",
});

function getConnectionPool(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("get connection pool error");
      console.error(err);
      return;
    }
    callback(connection);
  });
}

export function getMember(id) {
  return new Promise((resolve, reject) => {
    getConnectionPool((connection) => {
      connection.query(
        `SELECT * FROM member WHERE mb_id="${id}"`,
        (err, results) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(results[0]);
        }
      );
      connection.release();
    });
  });
}

export function addMember(id, encryptedPw) {
  return new Promise((resolve, reject) => {
    getMember(id)
      .then((member) => {
        if (member) {
          reject("ERR_DUPLICATE_ID");
          return;
        }
        getConnectionPool((connection) => {
          connection.query(
            `INSERT INTO member (mb_id, mb_pw) VALUES ("${id}", "${encryptedPw}")`,
            (err, results) => {
              if (err) {
                reject(err);
                console.error(err);
                return;
              }

              resolve("SUCCESS");
            }
          );

          connection.release();
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function queryTest() {
  connection.connect();
  connection.query("SELECT * FROM test", (err, results, fields) => {
    if (err) console.error(err);
    console.log(results);
    connection.end();
  });
}
