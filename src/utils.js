const fs = require('fs');
var moment = require('moment');
const fsExtra = require('fs-extra');
const fileNameLength=20;
var endOfLine = require('os').EOL;

function getNoteName(dstPath, note){
  const fNameArray = note['title'].split(' ');
    const fName = (fNameArray.length >=2) ? `${fNameArray[0]}_${fNameArray[1]}`: fNameArray.join('_');
    const fileNamePrefix = fName.substring(0,fileNameLength)
                                .replace(/[\\/!-.;+:\ ?]+/g,"_");;
    const indexList = fs.readdirSync(dstPath)
                        .filter((file) => file.indexOf(fileNamePrefix) > -1)
                        .map((file) => {
                          nameParts = file.split('.');
                          return (nameParts.length <= 2) ? 0 : Number(nameParts[1]);
                        });
    const nextIndex = indexList.length !== 0 ? Math.max(...indexList) + 1 : 0;
    return `${fileNamePrefix}.${nextIndex}.md`;

}
function getFilePath(dstPath, note){
    
   return `${dstPath}/${getNoteName(dstPath,note)}`;
    
  }
  
function getMetadata(note){
    return ''.concat(logTitle(note))
             .concat(logCreationTime(note))
             .concat(logUpdateTime(note))
             .concat(logLatLong(note))
             .concat(logTags(note))
             .concat(logBeginning());
    
  }

  function logTitle(note){
    return note['title']
           ? `Title: ${note['title']}${endOfLine}`
           : '';
  }
  function logCreationTime(note){
    return note['created']
           ? `Created at: ${moment(note['created']).format()}${endOfLine}`
           : '';
  }

  function logUpdateTime(note){
    return note['updated']
           ? `Updated at: ${moment(note['updated']).format()}${endOfLine}`
           : '';
  }

  function logLatLong(note){
    return (note['note-attributes'] && note['note-attributes']['longitude'])
            ? `Where: ${note['note-attributes']['longitude']},${note['note-attributes']['latitude']}${endOfLine}`
            : '';
  }

  function logTags(note){
    return note['tag']
           ? `Tag(s): ${note['tag']}${endOfLine}`
           : '';
  }

  function logBeginning(){
    return `${endOfLine}${endOfLine}`;
  }

function setFileDates(path, note){
    var modificationTime = new moment(note['updated']);
    var mtime = (modificationTime.format('x')) / 1000;
    fs.utimesSync(path,mtime,mtime);  
  }

function clearDistDir(dstPath){
    if (fs.existsSync(dstPath))
        fsExtra.removeSync(dstPath);
    fs.mkdirSync(dstPath);
}
module.exports.getNoteName = getNoteName;
module.exports.getFilePath = getFilePath;
module.exports.getMetadata = getMetadata;
module.exports.setFileDates = setFileDates;
module.exports.clearDistDir = clearDistDir;