import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import _omit from 'lodash/omit';
import { useSystemTheme } from '../providers/themeProvider/ThemeProvider';

loader.config({ monaco });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const EditorWrapper = (props) => {
  const editorRef = useRef(null);
  const theme = useSystemTheme();

  return (
    <div className='swagger-monaco-editor-container' ref={editorRef}>
      <Editor
        {..._omit(props, ['options', 'onChange'])}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{...(props.options ?? {}), automaticLayout:true, extraEditorClassName: 'swagger-monaco-editor'}}
        onChange= {(value, event) => {
          if (props.onChange)
          props.onChange({...event, target: {value}});
        }}
        className={`swagger-monaco-editor ${props.className ?? ''}`}
        onMount={()=>
          {
            sleep(100).then(() => {
              if (editorRef.current){
                const selection = editorRef.current.children.item(0);
                selection.style.height = 'fit-content';
              }
            });
          }}
          />
    </div>
  );
};

