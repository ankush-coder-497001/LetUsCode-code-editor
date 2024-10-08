import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import {toast} from 'react-hot-toast'

import { useLocation } from 'react-router-dom';
const Editor = ({setCode,code,SocketRef,handleLanguageChange,language,showlang,setshowlang}) => {
  const location  = useLocation()
  

  // Language options and corresponding CodeMirror language support
  const languages = {
    javascript: javascript(),
    python: python(),
    cpp: cpp(),
    html: html(),
    css: css(),
  };

  const handleChange = (value) => {
    setCode(value);
  };




  return (
    <div>
      <div className='language-select'>
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={showlang} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>
      
      <CodeMirror
      className='codemirror'
        value={code}
        height="400px"
        extensions={[languages[language]]}
        onChange={handleChange}
        theme="dark" // You can change to "light" or custom themes
        options={{
          lineNumbers: true,
          tabSize: 2,
          mode: language,
        }}
      />



    </div>
  );
};

export default Editor;
