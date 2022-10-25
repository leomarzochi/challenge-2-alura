import { toPng } from 'html-to-image';
import { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { codeEditorRefState, codeEditorState, colorState, languageState } from 'atoms/codeEditorAtom';
import { Button, Input, MenuTitle, Select, TextArea } from 'components';
import { ColorPicker } from 'components/color-picker/ColorPicker';
import { supabase } from 'supabaseClient';
import { ProjectLanguage } from 'types/shared';

import styles from './ProjectMenu.module.scss';

export const ProjectMenu = () => {
  const [language, setLanguage] = useRecoilState(languageState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const color = useRecoilValue(colorState);
  const snippet = useRecoilValue(codeEditorState);

  const languages: readonly ProjectLanguage[] = [
    { name: 'Javascript', id: 'javascript' },
    { name: 'Python', id: 'python' },
    { name: 'Java', id: 'java' },
    { name: 'Kotlin', id: 'kotlin' },
  ];
  const ref = useRecoilValue(codeEditorRefState);

  const onButtonClick = useCallback(() => {
    if (ref === null) {
      return;
    }
    toPng(ref, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const handleSaveProject = async () => {
    try {
      let { error } = await supabase.from('snippets').upsert({
        name: title,
        language: language.name,
        description,
        color,
        snippet,
      });
      if (error) {
        throw error;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.menu}>
      <MenuTitle>seu projeto</MenuTitle>
      <div className={styles['form-container']}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Nome do seu projeto"
        />
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do seu projeto"
        />
      </div>
      <MenuTitle>Personalizacao</MenuTitle>
      <div className={styles['form-container']}>
        <Select
          value={language}
          options={languages}
          onChange={setLanguage}
          mapOptionToValue={(option: ProjectLanguage) => option.id}
          mapOptionToLabel={(option: ProjectLanguage) => option.name}
        />
        <ColorPicker />
        <Button buttonStyle="outlined" onClick={onButtonClick}>
          Baixar imagem
        </Button>
        <Button buttonStyle="filled" onClick={handleSaveProject}>
          Salvar projeto
        </Button>
      </div>
    </div>
  );
};
