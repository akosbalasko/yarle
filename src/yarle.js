
const fs = require('fs');
var parser = require('fast-xml-parser');
var moment = require('moment');
var TurndownService = require('turndown')
const options = require('./xml-parser.options');
const utils = require('./utils');

// simpleNotes folder will contain those notes that contains plain text only 
const simpleMdPath = `${__dirname}/../out/simpleNotes`;
// complexNotes folder contains notes that have external resources (eg. images, pdf etc.) 
const complexMdPath = `${__dirname}/../out/complexNotes`;
const resourcePath =`${complexMdPath}/_resources`

var turndownService = new TurndownService();
var resourceHashes={};
utils.clearDistDir(simpleMdPath);
utils.clearDistDir(complexMdPath);

function dropTheRope(enexFile){

    const content = fs.readFileSync(enexFile, 'utf8');
    var notebook = parser.parse(content,options);
    var notes = notebook['en-export'];
    utils.clearDistDir(resourcePath);
    
  if (notes)
    if (Array.isArray(notes['note']))
      for (let note of notes['note'])
        processNode(note);
    else processNode(notes['note']);
}

function processNode(note){
  let data='';
  let content =note['content']['__cdata'];
  let absFilePath = utils.getFilePath(simpleMdPath, note);
  let noteName =utils.getNoteName(simpleMdPath,note);
  


  if (note['resource']){
    absFilePath = utils.getFilePath(complexMdPath, note);
    noteName =utils.getNoteName(complexMdPath,note);
    data = data.concat(utils.getTitle(complexMdPath,note));

    const relativeWorkDir = `${utils.getResourceDir(complexMdPath,note)}.resources`;
    const absoluteWorkDir = `${resourcePath}/${relativeWorkDir}`;

    utils.clearDistDir(absoluteWorkDir)
    if (Array.isArray(note['resource'])){
      for (let j=0; j< note['resource'].length; ++j){
        processResource(absoluteWorkDir, note['resource'][j]);
      }
    } else
      {
        utils.clearDistDir(absoluteWorkDir)
        processResource(absoluteWorkDir, note['resource']);
    }
  
    //en-media
    for (let hash in resourceHashes){
      const replace = `<en-media [^>]*hash="${hash}".[^>]*\/>`;
      var re = new RegExp(replace,"g");
      content = content.replace(re,`<img alt=${resourceHashes[hash]} src=./_resources/${relativeWorkDir}/${resourceHashes[hash].replace(/ /g,'\ ')}>`);
    }
  }
  else{
    data = data.concat(utils.getTitle(simpleMdPath,note));

  }
  var markdown = turndownService.turndown(content)
  data = data.concat(markdown);
  let metadata = utils.getMetadata(note);
  data = data.concat(metadata);

  try{
    fs.writeFileSync(absFilePath, data);
    utils.setFileDates(absFilePath,note)
  } catch (e){
    console.log("Cannot write file ", e);
    throw e;
  }

}

function processResource(workDir, resource){
    const data = resource['data'];
    const timeStamp = resource['resource-attributes']['timestamp'];
    const fileName = resource['resource-attributes']['file-name'];
    const absFilePath = `${workDir}/${fileName}`;
    if (resource['recognition'] && resource['recognition']['__cdata'] && fileName){
      resourceHashes[resource['recognition']['__cdata'].match(/[a-f0-9]{32}/)] = fileName;
    }
    var accessTime = new moment(timeStamp);
    fs.writeFileSync(absFilePath, data, 'base64');
    var atime = (accessTime.format('x')) / 1000;
    fs.utimesSync(absFilePath,atime,atime); 
  }

module.exports.dropTheRope = dropTheRope;