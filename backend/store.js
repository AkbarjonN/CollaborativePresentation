const fs = require('fs');
const path = './data/presentations.json';

let presentations = {};

if (fs.existsSync(path)) {
  presentations = JSON.parse(fs.readFileSync(path, 'utf-8'));
}

function saveToFile() {
  fs.writeFileSync(path, JSON.stringify(presentations, null, 2));
  
}

function createPresentation(id, creatorUser) {
  presentations[id] = {
    id,
    slides: [{ blocks: [] }],
    users: {},
  };
  presentations[id].users[creatorUser.id] = {
    id: creatorUser.id,
    nickname: creatorUser.nickname,
    role: 'creator',
  };
  saveToFile(); 
}

function updatePresentationSlides(id, slides) {
  if (presentations[id]) {
    presentations[id].slides = slides;
    saveToFile(); 
  }
}

function getPresentation(id) {
  return presentations[id];
}

function updateUserRole(presId, userId, newRole) {
  if (presentations[presId]?.users[userId]) {
    presentations[presId].users[userId].role = newRole;
    saveToFile();
  }
}

module.exports = {
  presentations,
  createPresentation,
  getPresentation,
  updatePresentationSlides,
  updateUserRole,
};