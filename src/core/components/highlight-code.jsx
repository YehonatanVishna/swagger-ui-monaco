import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"
import isFunction from "lodash/isFunction"
import saveAs from "js-file-download"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Editor from '@monaco-editor/react';
import { MONACCO_THEME } from "../../consts"
import { EditorWrapper } from "./EditorWrapper/EditorWrapper"

const HighlightCode = ({value, fileName, className, downloadable, getConfigs, canCopy, language}) => {
  const config = isFunction(getConfigs) ? getConfigs() : null
  const canSyntaxHighlight = get(config, "syntaxHighlight") !== false && get(config, "syntaxHighlight.activated", true)
  const rootRef = useRef(null)

  useEffect(() => {
    const childNodes = Array
      .from(rootRef.current.childNodes)
      .filter(node => !!node.nodeType && node.classList.contains("microlight"))

    // eslint-disable-next-line no-use-before-define
    childNodes.forEach(node => node.addEventListener("mousewheel", handlePreventYScrollingBeyondElement, { passive: false }))

    return () => {
      // eslint-disable-next-line no-use-before-define
      childNodes.forEach(node => node.removeEventListener("mousewheel", handlePreventYScrollingBeyondElement))
    }
  }, [value, className, language])

  const handleDownload = () => {
    saveAs(value, fileName)
  }

  const handlePreventYScrollingBeyondElement = (e) => {
    const { target, deltaY } = e
    const { scrollHeight: contentHeight, offsetHeight: visibleHeight, scrollTop } = target
    const scrollOffset = visibleHeight + scrollTop
    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }


  return (
    <div className="highlight-code" ref={rootRef}>
      {canCopy && (
        <div className="copy-to-clipboard">
          <CopyToClipboard text={value}><button/></CopyToClipboard>
        </div>
      )}

      {!downloadable ? null :
        <button className="download-contents" onClick={handleDownload}>
          Download
        </button>
      }

      

      {canSyntaxHighlight
        ? <EditorWrapper
          language={language}
          height={500}
          width="100%"
          className={cx(className, "microlight")}
          value={value}
          theme={MONACCO_THEME}
          style={getStyle(get(config, "syntaxHighlight.theme", "agate"))}
          options={{readOnly: true}}
        >
        </EditorWrapper>
        : <pre className={cx(className, "microlight")}>{value}</pre>
      }

    </div>
  )
}

HighlightCode.propTypes = {
  value: PropTypes.string.isRequired,
  getConfigs: PropTypes.func.isRequired,
  className: PropTypes.string,
  downloadable: PropTypes.bool,
  fileName: PropTypes.string,
  language: PropTypes.string,
  canCopy: PropTypes.bool
}

HighlightCode.defaultProps = {
  fileName: "response.txt"
}

export default HighlightCode
