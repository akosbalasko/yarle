const fs = require('fs');
var moment = require('moment');
const fsExtra = require('fs-extra');
const fileNameLength=50;
var endOfLine = require('os').EOL;

function getNoteFileName(dstPath, note){
  return `${getNoteName(dstPath,note)}.md`
}
function getNoteName(dstPath, note){
    const fileNamePrefix = getFilePrefix(note);
    const nextIndex = getFileIndex(dstPath, note);
    return (nextIndex == '') ? `${fileNamePrefix}` :  `${fileNamePrefix}.${nextIndex}`;

}
function getResourceDir(dstPath, note){
  const noteFileName = getNoteName(dstPath, note);
  return noteFileName.replace(/ /g,'_');
}

function getFilePrefix(note){
  const fName = note['title'] ? note['title'].toString() : 'Untitled';
    //const fName = (fNameArray.length >=2) ? `${fNameArray[0]}_${fNameArray[1]}`: fNameArray.join(' ');
    return fName.substring(0,fileNameLength)
                                .replace(/[\\/!.;+:_\?]+/g," ").toLowerCase();
}
function getFileIndex(dstPath, note){

  const fileNamePrefix = getFilePrefix(note);
  const indexList = fs.readdirSync(dstPath)
                      .filter((file) => file.indexOf(fileNamePrefix) > -1)
                      .map((file) => {
                        nameParts = file.split('.');
                        return (nameParts.length <= 2) ? 0 : Number(nameParts[1]);
                    });

  return indexList.length !== 0 ? Math.max(...indexList) + 1 : '';

}
function getFilePath(dstPath, note){
    
  return `${dstPath}/${getNoteFileName(dstPath,note)}`;
    
}

function getMetadata(note){
    return ''.concat(logBeginning())
             .concat(logCreationTime(note))
             .concat(logUpdateTime(note))
             .concat(logLatLong(note))
             .concat(logTags(note))
             .concat(logBeginning());
    
  }

  function getTitle(dstPath, note){
    const index = getFileIndex(dstPath, note);
    if (index  === '')
      return note['title']
           ? `# ${note['title']}${endOfLine}`
           : ''
    else
      return note['title']
             ? `# ${note['title']}.${index}${endOfLine}`
             : '';
  }
  function logCreationTime(note){
    return note['created']
           ? `    Created at: ${moment(note['created']).format()}${endOfLine}`
           : '';
  }

  function logUpdateTime(note){
    return note['updated']
           ? `    Updated at: ${moment(note['updated']).format()}${endOfLine}`
           : '';
  }

  function logLatLong(note){
    return (note['note-attributes'] && note['note-attributes']['longitude'])
            ? `    Where: ${note['note-attributes']['longitude']},${note['note-attributes']['latitude']}${endOfLine}`
            : '';
  }

  function logTags(note){
    return note['tag']
           ? `    Tag(s): ${note['tag']}${endOfLine}`
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
module.exports.getResourceDir = getResourceDir;
module.exports.getNoteFileName = getNoteFileName;
module.exports.getNoteName = getNoteName;
module.exports.getFilePath = getFilePath;
module.exports.getMetadata = getMetadata;
module.exports.setFileDates = setFileDates;
module.exports.clearDistDir = clearDistDir;
module.exports.getTitle = getTitle;