import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/tags-yaml-list-placeholders';

import { applyTemplateOnBlock } from './apply-template-on-block';
import { getTemplateBlockSettings } from './get-templateblock-settings';

export const applyTagsYamlListTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
	let tags;
	if (noteData.tags) {
			tags = '\n'+noteData.tags.split(' ').map((tag:string) => `  - ${tag.replace(/^#/, '')}`).join('\n');
		}
	const tagsTemplateSettings = getTemplateBlockSettings(inputText, check, P, tags);
	
	return applyTemplateOnBlock(tagsTemplateSettings);

};