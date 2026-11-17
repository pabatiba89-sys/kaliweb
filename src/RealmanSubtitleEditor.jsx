import React, { useRef, useState } from 'react';
import { isSingleSubtitleCharacter } from './realmanSubtitles.js';

const seconds = (ms) => (ms / 1000).toFixed(2);

export default function RealmanSubtitleEditor({ groups, disabled, onReplace }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(null);
  const [replacement, setReplacement] = useState('');
  const [composing, setComposing] = useState(false);
  const valid = isSingleSubtitleCharacter(replacement);

  const open = (groupIndex, itemIndex, item) => {
    setSelected({ groupIndex, itemIndex, item });
    setReplacement(item.text);
    setComposing(false);
    dialog.current.showModal();
  };

  const apply = (event) => {
    event.preventDefault();
    if (!selected || !valid || composing || disabled) return;
    onReplace(selected.groupIndex, selected.itemIndex, replacement);
    dialog.current.close();
  };

  return (
    <>
      <p className="realman-subtitle-hint">点击单字修改。提交时会使用校对后的字幕和原始时间戳。</p>
      <div className="realman-subtitle-editor">
        {groups.map((group, groupIndex) => (
          <div className="realman-subtitle-row" key={groupIndex}>
            <small dir="ltr">{seconds(group[0].startMs)} – {seconds(group.at(-1).endMs)} s</small>
            <div className="realman-subtitle-characters">
              {group.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  type="button"
                  translate="no"
                  disabled={disabled}
                  title={seconds(item.startMs) + ' s'}
                  onClick={() => open(groupIndex, itemIndex, item)}
                >
                  {/\s/u.test(item.text) ? '␣' : item.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <dialog ref={dialog} className="realman-subtitle-dialog" aria-labelledby="realman-subtitle-edit-title">
        <form onSubmit={apply}>
          <h3 id="realman-subtitle-edit-title">修改单字</h3>
          {selected && <small dir="ltr">{seconds(selected.item.startMs)} – {seconds(selected.item.endMs)} s</small>}
          <label>
            <span>替换字符</span>
            <input
              autoFocus
              translate="no"
              value={replacement}
              aria-invalid={!composing && !valid}
              aria-describedby="realman-subtitle-character-hint"
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => setReplacement(event.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={(event) => {
                setReplacement(event.currentTarget.value);
                setComposing(false);
              }}
            />
          </label>
          <small id="realman-subtitle-character-hint">请输入一个字符。</small>
          <div className="realman-subtitle-actions">
            <button type="button" className="outline-button" onClick={() => dialog.current.close()}>取消</button>
            <button type="submit" className="primary-button" disabled={!valid || composing || disabled}>确认替换</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
