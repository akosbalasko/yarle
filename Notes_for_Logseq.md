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
    "skipLocation": true,
    "skipCreationTime": true,
    "skipUpdateTime": true,
    "skipSourceUrl": true,
    "skipTags": true,
    "skipEnexFileNameFromOutputPath": false,
    "keepMDCharactersOfENNotes": false,
    "monospaceIsCodeBlock": false,
    "dateFormat": "YYYY-MM-DD",
    "currentTemplate": "{content-block}{content}{end-content-block}",
    "keepOriginalAmountOfNewlines": true,
    "haveEnexLevelResources": true,
    "logseqSettings":{
      "journalNotes": false
    }
}
```

## Template ## 

You should use the page template below instead of the default one

```
- This is my template 

{title-block}- #{title}#{end-title-block}

- 
  ---


{content-block}{content}{end-content-block}

- 
  ---

{created-at-block}- _Created at {created-at}._{end-created-at-block}
{updated-at-block}- _Last updated at {updated-at}._{end-updated-at-block}
{source-url-block}- _Source URL: []({source-url})._{end-source-url-block}


{tags-block}
-
  ---
- Tagged: 
  - {tags}
{end-tags-block}

```

## Further Notes ## 

If successful, in the output folder there are two folders:
- assets
- pages

You can merge these folders into Logseq

If these notes are journals then set Page type dropdown to Journal. It will 
- rename `pages` into `journals`
- rename all generated note files  as `2021-01-01.md` (based on dateFormat property) to let logseq auto detect the dates
