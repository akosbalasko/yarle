var assert = require('assert');
const utils = require('./../src/utils');
const fs = require('fs');

const yarle = require('./../src/yarle');

describe('dropTheRope ', function () {
 
    afterEach(() =>{
     utils.clearDistDir(`${__dirname}/../out/md`);
    });

    it('Empty enex file - throw eoent', function() {
        let errorHappened = false;
        try{
            yarle.dropTheRope('./test/data/do_not_exists.enex');
        } catch(e){
            errorHappened = true;
        }
        assert.equal(true,errorHappened);
    });
    it('Enex file with note containing text only', function() {
        yarle.dropTheRope('./test/data/test-justText.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__note.0.md`), true);    
       
        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__note.0.md`,'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-justText.md`,'utf8')
        );    

    });

    it('Note with tags', function() {
        yarle.dropTheRope('./test/data/test-noteWithTags.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__note.0.md`), true);    
       
        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__note.0.md`,'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithTags.md`,'utf8')
        );    

    });

    it('Note with latlong', function() {
        yarle.dropTheRope('./test/data/test-noteWithLatLong.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST.0.md`), true);    
       
        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST.0.md`,'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithLatLong.md`,'utf8')
        );    

    });


    it('Enex file with note containing a picture', function() {
        yarle.dropTheRope('./test/data/test-withPicture.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__.0.md`), true);    
        assert.equal(fs.existsSync(`${__dirname}/../out/md/_resources/TEST__.0.md.resources`), true);    

        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__.0.md`,'utf8'),
        fs.readFileSync(`${__dirname}/data/test-withPicture.md`,'utf8') );    

    });

    it('Enex file with multiple notes', function() {
        yarle.dropTheRope('./test/data/test-twoNotes.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__.0.md`), true);    
        assert.equal(fs.existsSync(`${__dirname}/../out/md/_resources/TEST__.0.md.resources`), true);    

        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__.0.md`,'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-twoNotes-pic.md`,'utf8'));    
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__note.0.md`), true);    

        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__note.0.md`,'utf8'),
                    fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`,'utf8'));    
    
    });

    it('Enex file with note containing more pictures', function() {
        yarle.dropTheRope('./test/data/test-threePictures.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/TEST__.0.md`), true);    
        assert.equal(fs.existsSync(`${__dirname}/../out/md/_resources/TEST__.0.md.resources`), true);    

        assert.equal(fs.readFileSync(`${__dirname}/../out/md/TEST__.0.md`,'utf8'),
        fs.readFileSync(`${__dirname}/data/test-threePictures.md`,'utf8'),);    

    });

    it('Enex file with two notes with same names', function() {
        yarle.dropTheRope('./test/data/test-twoNotesWithSameName.enex', 'utf8');
        assert.equal(fs.existsSync(`${__dirname}/../out/md/Untitled.0.md`), true);    

        assert.equal(fs.readFileSync(`${__dirname}/../out/md/Untitled.0.md`,'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.0.md`,'utf8'));    
        
        assert.equal(fs.existsSync(`${__dirname}/../out/md/Untitled.1.md`), true);    
        assert.equal(fs.readFileSync(`${__dirname}/../out/md/Untitled.1.md`,'utf8'),
                    fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.1.md`,'utf8'));    
    
    });
});