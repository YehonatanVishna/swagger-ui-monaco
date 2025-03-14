import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { MONACCO_THEME } from '../../../consts';
import { options } from 'less';

export const EdiorWrapper = (props) => {
  return (
    <div className="swagger-monaco-editor-container">
      <Editor
        theme={MONACCO_THEME}
        options={{...(props.options ?? {}), automaticLayout:true, extraEditorClassName: 'swagger-monaco-editor'}}
        {...props}
      />
      </div>
  );
};

