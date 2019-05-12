'use strict';

const sqlite = require('sqlite'); 

exports.ready = (async function () {

  await sqlite.open('.data/database');
  
  await sqlite.migrate(); 
}());

exports.getDreams = function () {
  return sqlite.all('SELECT * FROM dreams');
};

exports.createDream = function (dream) {
  return sqlite.run('INSERT INTO dreams (id, name, description, count, date) VALUES (?, ?, ?, ?, ?)', dream.id, dream.name, dream.description, dream.count, dream.date);
};

exports.deleteDream = function (id) {
  return sqlite.run('DELETE FROM dreams WHERE id = ?', id);
};

exports.vote = async function (id) {
  await sqlite.run('UPDATE dreams SET count = count + 1 WHERE id = ?', id);
  
  return sqlite.get('SELECT * FROM dreams WHERE id = ?', id);
};
