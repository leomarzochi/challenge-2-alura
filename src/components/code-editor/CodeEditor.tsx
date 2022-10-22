import { Button } from 'components';
import hljs from 'highlight.js';
import { useEffect, useState } from 'react';
import styles from './CodeEditor.module.scss';
import 'highlight.js/styles/github.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { colorState, languageState } from 'atoms/codeEditorAtom';

export const CodeEditor = () => {
  const [showEditor, setShowEditor] = useState(true);
  const [buffer, setBuffer] = useState('');
  const color = useRecoilValue(colorState);
  const language = useRecoilValue(languageState);
  const [content, setContent] = useState(`const alura_challenge = () => { 
  alert("awesome!"); 
}

alura_challenge();
`);

  // useEffect(() => {
  //  setContent(hljs.highlight(language, content).value);
  // }, [language]);

  const handleHighlight = () => {
    if (showEditor) {
      setBuffer(content);
      setContent(hljs.highlight(language, content).value);
      setShowEditor(false);
      return;
    }
    setContent(buffer);
    setShowEditor(true);
  };

  return (
    <>
      <div style={{'backgroundColor': color}} className={styles.editor}>
        <div className={styles.editor__header}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        <div className={styles.editor__body_spacing}>
          {showEditor && (
            <textarea
              className={styles.editor__body}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
          {!showEditor && (
            <pre>
              <code
                className={styles.editor__body}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              ></code>
            </pre>
          )}
        </div>
      </div>
      <Button buttonStyle="outlined" onClick={handleHighlight}>
        {!showEditor
          ? 'Voltar ao modo de edição'
          : 'Visualizar com o highlight'}
      </Button>
    </>
  );
};
