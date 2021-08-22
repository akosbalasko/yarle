# About the export for logseq #

## How to export for logseq ##

Please use settings below
- **OutputFormate : standardMD**
- **Store Attachments in one folder: TRUE**
- Perform URL encoding : TRUE
- Keep original amount of new lines : TRUE
- **Export for Logseq : TRUE**
- **Custome resourse folder: assets**


```
{
    "keepOriginalHtml": false,
    "isMetadataNeeded": true,
    "isNotebookNameNeeded": false,
    "isZettelkastenNeeded": false,
    "plainTextNotesOnly": false,
    "skipWebClips": true,
    "useHashTags": false,
    "nestedTags": {
        "separatorInEN": "_",
        "replaceSeparatorWith": "---",
        "replaceSpaceWith": "-"
    },
    "outputFormat": "StandardMD",
    "urlEncodeFileNamesAndLinks": false,
    "pathSeparator": "/",
    "resourcesDir": "assets",
    "turndownOptions": {
        "headingStyle": "atx"
    },
    "logseqMode": true,
    "skipLocation": true,
    "skipCreationTime": true,
    "skipUpdateTime": true,
    "skipSourceUrl": true,
    "skipTags": true,
    "skipEnexFileNameFromOutputPath": false,
    "keepMDCharactersOfENNotes": false,
    "monospaceIsCodeBlock": false,
    "currentTemplate": "{content-block}{content}{end-content-block}",
    "keepOriginalAmountOfNewlines": true,
    "haveEnexLevelResources": true
}
```

## Further Notes ## 

If successful, the output folder there are two folders:
- assets
- pages

You can merge these folders into Logseq

If these are journals,
- rename `pages` into `journals`
- make sure the files inside are formated as `2021-01-01.md`
  logseq will auto detect the dates
