import React, { useRef, useState } from 'react';

const seconds = (ms) => (ms / 1000).toFixed(2);

export default function RealmanSubtitleEditor({ groups, disabled, onEdit }) {
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState('');
  const itemKeys = useRef(new WeakMap());
  const nextKey = useRef(0);

  const begin = (groupIndex, itemIndex, text) => {
    setDraft(text);
    setSelected({ groupIndex, itemIndex });
  };

  const save = (groupIndex, itemIndex, value) => {
    if (!disabled) onEdit(groupIndex, itemIndex, value);
    setSelected(null);
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setSelected(null);
    }
  };

  return (
    <>
      <p className="realman-subtitle-hint">点击字幕改字或补字，按回车或点其他位置保存。</p>
      <div className="realman-subtitle-editor">
        {groups.map((group, groupIndex) => (
          <div className="realman-subtitle-row" key={groupIndex}>
            <small dir="ltr">{seconds(group[0].startMs)} – {seconds(group.at(-1).endMs)} s</small>
            <div className="realman-subtitle-characters">
              {group.map((item, itemIndex) => {
                if (!itemKeys.current.has(item)) itemKeys.current.set(item, nextKey.current++);
                const key = itemKeys.current.get(item);
                if (selected?.groupIndex === groupIndex && selected.itemIndex === itemIndex) {
                  return (
                    <input
                      key={key}
                      autoFocus
                      translate="no"
                      aria-label="编辑字幕"
                      value={draft}
                      size={Math.max(2, Math.min(18, Array.from(draft).length * 2))}
                      onFocus={(event) => event.currentTarget.select()}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={(event) => save(groupIndex, itemIndex, event.currentTarget.value)}
                    />
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    translate="no"
                    disabled={disabled}
                    title={seconds(item.startMs) + ' s'}
                    onClick={() => begin(groupIndex, itemIndex, item.text)}
                  >
                    {/\s/u.test(item.text) ? '␣' : item.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
