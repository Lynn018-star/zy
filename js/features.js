(function() {
    var MY_SYM_KEY   = 'pokeSym_my';
    var PTR_SYM_KEY  = 'pokeSym_partner';
    var MY_CUST_KEY  = 'pokeSym_my_custom';
    var PTR_CUST_KEY = 'pokeSym_partner_custom';

    var PRESETS = [
        { value: 'none',    label: '无装饰',   sym: '' },
        { value: 'star4',   label: '✦ 四角星', sym: '✦' },
        { value: 'star5',   label: '✧ 镂空星', sym: '✧' },
        { value: 'dot',     label: '· 圆点',   sym: '·' },
        { value: 'wave',    label: '～ 波浪',  sym: '～' },
        { value: 'heart',   label: '♡ 爱心',   sym: '♡' },
        { value: 'flower',  label: '✿ 花朵',   sym: '✿' },
        { value: 'sparkle', label: '✨ 闪光',  sym: '✨' },
        { value: 'custom',  label: '自定义…',  sym: null }
    ];

    function _getSym(key, customKey) {
        var v = localStorage.getItem(key) || 'star4';
        if (v === 'custom') return localStorage.getItem(customKey) || '✦';
        var p = PRESETS.find(function(x){ return x.value === v; });
        return p ? p.sym : '✦';
    }

    // 用于“戳一戳”文本的清理：移除大部分表情类字符，避免用户文本里夹带 emoji
    // 装饰符号仍由 _formatPokeText() 根据用户配置自动包裹输出
    function _stripEmojiForPoke(text) {
        return String(text || '')
            // 常见 Emoji / 符号区段（尽量保守）
            .replace(/[\u2600-\u27BF\u{1F300}-\u{1FAFF}]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    window._formatPokeText = function(text) {
        var sym = _getSym(MY_SYM_KEY, MY_CUST_KEY);
        return sym ? (sym + ' ' + text + ' ' + sym) : text;
    };
    window._formatPartnerPokeText = function(text) {
        var sym = _getSym(PTR_SYM_KEY, PTR_CUST_KEY);
        return sym ? (sym + ' ' + text + ' ' + sym) : text;
    };
    window._sanitizePokeTextForDisplay = _stripEmojiForPoke;

    function _esc(s) {
        return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    window._openPokeSymSettings = function() {
        var old = document.getElementById('poke-sym-modal');
        if (old) old.remove();

        var mySel    = localStorage.getItem(MY_SYM_KEY) || 'star4';
        var ptrSel   = localStorage.getItem(PTR_SYM_KEY) || 'star4';
        var myCustom = localStorage.getItem(MY_CUST_KEY) || '';
        var ptrCustom= localStorage.getItem(PTR_CUST_KEY) || '';

        function opts(sel) {
            return PRESETS.map(function(p){
                return '<option value="'+p.value+'"'+(sel===p.value?' selected':'')+'>'+p.label+'</option>';
            }).join('');
        }

        var wrap = document.createElement('div');
        wrap.id = 'poke-sym-modal';
        wrap.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
        wrap.innerHTML = [
            '<div style="background:var(--primary-bg);border-radius:20px;padding:22px 20px;width:min(340px,92vw);box-shadow:0 20px 60px rgba(0,0,0,0.28);border:1px solid var(--border-color);">',
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">',
                '<span style="font-size:15px;font-weight:700;color:var(--text-primary);font-family:var(--font-family);">戳一戳装饰符号</span>',
                '<button id="psm-close" style="background:none;border:none;font-size:18px;color:var(--text-secondary);cursor:pointer;padding:2px 6px;border-radius:6px;">✕</button>',
              '</div>',
              '<div style="font-size:11px;color:var(--text-secondary);font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:5px;">我发出的</div>',
              '<select id="psm-my" style="width:100%;padding:9px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;font-family:var(--font-family);margin-bottom:8px;">'+opts(mySel)+'</select>',
              '<div id="psm-my-cw" style="margin-bottom:12px;display:'+(mySel==='custom'?'block':'none')+';">',
                '<input id="psm-my-ci" type="text" maxlength="4" placeholder="输入 1-2 个字符" value="'+_esc(myCustom)+'" style="width:100%;padding:8px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box;font-family:var(--font-family);">',
              '</div>',
              '<div style="font-size:11px;color:var(--text-secondary);font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:5px;">对方发出的</div>',
              '<select id="psm-ptr" style="width:100%;padding:9px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;font-family:var(--font-family);margin-bottom:8px;">'+opts(ptrSel)+'</select>',
              '<div id="psm-ptr-cw" style="margin-bottom:14px;display:'+(ptrSel==='custom'?'block':'none')+';">',
                '<input id="psm-ptr-ci" type="text" maxlength="4" placeholder="输入 1-2 个字符" value="'+_esc(ptrCustom)+'" style="width:100%;padding:8px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box;font-family:var(--font-family);">',
              '</div>',
              '<div id="psm-preview" style="background:var(--secondary-bg);border-radius:10px;padding:10px 14px;font-size:12.5px;color:var(--text-secondary);margin-bottom:16px;border:1px dashed var(--border-color);line-height:1.7;"></div>',
              '<div style="display:flex;gap:8px;">',
                '<button id="psm-cancel" style="flex:1;padding:9px;border:1px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>',
                '<button id="psm-save" style="flex:2;padding:9px;border:none;border-radius:10px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-family);">保存</button>',
              '</div>',
            '</div>'
        ].join('');
        document.body.appendChild(wrap);

        function preview() {
            var mv = document.getElementById('psm-my').value;
            var pv = document.getElementById('psm-ptr').value;
            var ms = mv==='custom'?(document.getElementById('psm-my-ci').value||'✦'):((PRESETS.find(function(x){return x.value===mv;})||{}).sym||'');
            var ps = pv==='custom'?(document.getElementById('psm-ptr-ci').value||'✦'):((PRESETS.find(function(x){return x.value===pv;})||{}).sym||'');
            var myN  = (typeof settings!=='undefined'&&settings.myName)||'我';
            var pN   = (typeof settings!=='undefined'&&settings.partnerName)||'对方';
            var mt   = ms?(ms+' '+myN+' 拍了拍你 '+ms):(myN+' 拍了拍你');
            var pt   = ps?(ps+' '+pN+' 拍了拍你 '+ps):(pN+' 拍了拍你');
            document.getElementById('psm-preview').innerHTML =
                '<div style="color:var(--text-primary);">我：'+_esc(mt)+'</div>'+
                '<div style="color:var(--text-primary);margin-top:3px;">对方：'+_esc(pt)+'</div>';
        }

        document.getElementById('psm-my').addEventListener('change', function(){
            document.getElementById('psm-my-cw').style.display = this.value==='custom'?'block':'none'; preview();
        });
        document.getElementById('psm-ptr').addEventListener('change', function(){
            document.getElementById('psm-ptr-cw').style.display = this.value==='custom'?'block':'none'; preview();
        });
        document.getElementById('psm-my-ci').addEventListener('input', preview);
        document.getElementById('psm-ptr-ci').addEventListener('input', preview);
        preview();

        function close(){ wrap.remove(); }
        document.getElementById('psm-close').addEventListener('click', close);
        document.getElementById('psm-cancel').addEventListener('click', close);
        wrap.addEventListener('click', function(e){ if(e.target===wrap) close(); });
        document.getElementById('psm-save').addEventListener('click', function(){
            var mv = document.getElementById('psm-my').value;
            var pv = document.getElementById('psm-ptr').value;
            localStorage.setItem(MY_SYM_KEY, mv);
            localStorage.setItem(PTR_SYM_KEY, pv);
            if(mv==='custom') localStorage.setItem(MY_CUST_KEY, document.getElementById('psm-my-ci').value.trim());
            if(pv==='custom') localStorage.setItem(PTR_CUST_KEY, document.getElementById('psm-ptr-ci').value.trim());
            close();
            if(window._syncPokeDesc) window._syncPokeDesc();
            if(typeof showNotification==='function') showNotification('戳一戳符号已保存 ✓','success',1800);
        });
    };

    function _syncPokeDesc() {
        var ms = localStorage.getItem(MY_SYM_KEY)||'star4';
        var ps = localStorage.getItem(PTR_SYM_KEY)||'star4';
        var ml = (PRESETS.find(function(p){return p.value===ms;})||{}).label||ms;
        var pl = (PRESETS.find(function(p){return p.value===ps;})||{}).label||ps;
        var d = document.getElementById('poke-symbol-desc');
        if(d) d.textContent = '我: '+ml+'  /  对方: '+pl;
    }
    window._syncPokeDesc = _syncPokeDesc;
    document.addEventListener('DOMContentLoaded', _syncPokeDesc);
    setTimeout(_syncPokeDesc, 600);
})();

(function() {
    var KEY = 'headerAlwaysClear';
    function _get() { return localStorage.getItem(KEY) === 'true'; }

    function _applyHeader() {
        var en = _get();
        var id = 'header-clear-override';
        var t  = document.getElementById(id);
        if (!t) { t = document.createElement('style'); t.id = id; document.head.appendChild(t); }
        if (en) {
            t.textContent = '.header { opacity: 1 !important; }';
        } else {
            t.textContent = [
                '.header { opacity: 0.5 !important; transition: opacity 0.3s ease !important; }',
                '.header:hover { opacity: 1 !important; }'
            ].join(' ');
        }
    }

    function _syncUI() {
        var en  = _get();
        var row = document.getElementById('header-opacity-toggle');
        if (row) row.classList.toggle('active', en);
        var spans = document.querySelectorAll('#header-opacity-toggle .setting-pill-label span');
        if (spans.length) spans[0].textContent = en ? '已开启，始终清晰' : '关闭后悬停才清晰';
    }

    window._toggleHeaderOpacity = function() {
        localStorage.setItem(KEY, String(!_get()));
        _applyHeader(); _syncUI();
        if (typeof showNotification === 'function')
            showNotification(_get() ? '顶部栏已常驻清晰 ✓' : '顶部栏已恢复悬停清晰', 'success', 1800);
    };

    _applyHeader();
    document.addEventListener('DOMContentLoaded', function(){ _applyHeader(); _syncUI(); });
    setTimeout(function(){ _applyHeader(); _syncUI(); }, 500);
    setTimeout(function(){ _applyHeader(); _syncUI(); }, 1500);
})();

(function() {
    var KEY = 'keepaliveAudioEnabled';
    var SRC = 'data:audio/wav;base64,UklGRqQ+AABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YYA+AAAAAAEAAgADAAUABgAHAAkACgALAAwADgAPABAAEgATABQAFQAXABgAGQAbABwAHQAeACAAIQAiACQAJQAmACcAKQAqACsALQAuAC8AMAAyADMANAA2ADcAOAA5ADsAPAA9AD8AQABBAEIARABFAEYASABJAEoASwBNAE4ATwBRAFIAUwBUAFYAVwBYAFoAWwBcAF0AXwBgAGEAYwBkAGUAZgBoAGkAagBsAG0AbgBvAHEAcgBzAHQAdgB3AHgAegB7AHwAfQB/AIAAgQCDAIQAhQCGAIgAiQCKAIwAjQCOAI8AkQCSAJMAlQCWAJcAmACaAJsAnACeAJ8AoAChAKMApAClAKYAqACpAKoArACtAK4ArwCxALIAswC1ALYAtwC4ALoAuwC8AL4AvwDAAMEAwwDEAMUAxgDIAMkAygDMAM0AzgDPANEA0gDTANQA1gDXANgA2gDbANwA3QDfAOAA4QDjAOQA5QDmAOgA6QDqAOsA7QDuAO8A8QDyAPMA9AD2APcA+AD5APsA/AD9AP8AAAEBAQIBBAEFAQYBBwEJAQoBCwEMAQ4BDwEQARIBEwEUARUBFwEYARkBGgEcAR0BHgEgASEBIgEjASUBJgEnASgBKgErASwBLQEvATABMQEyATQBNQE2ATgBOQE6ATsBPQE+AT8BQAFCAUMBRAFFAUcBSAFJAUoBTAFNAU4BUAFRAVIBUwFVAVYBVwFYAVoBWwFcAV0BXwFgAWEBYgFkAWUBZgFnAWkBagFrAWwBbgFvAXABcQFzAXQBdQF2AXgBeQF6AXsBfQF+AX8BgAGCAYMBhAGFAYcBiAGJAYoBjAGNAY4BjwGRAZIBkwGUAZYBlwGYAZkBmwGcAZ0BngGgAaEBogGjAaUBpgGnAagBqgGrAawBrQGvAbABsQGyAbQBtQG2AbcBuAG6AbsBvAG9Ab8BwAHBAcIBxAHFAcYBxwHJAcoBywHMAc4BzwHQAdEB0gHUAdUB1gHXAdkB2gHbAdwB3gHfAeAB4QHiAeQB5QHmAecB6QHqAesB7AHuAe8B8AHxAfIB9AH1AfYB9wH5AfoB+wH8Af0B/wEAAgECAgIEAgUCBgIHAggCCgILAgwCDQIPAhACEQISAhMCFQIWAhcCGAIZAhsCHAIdAh4CIAIhAiICIwIkAiYCJwIoAikCKgIsAi0CLgIvAjECMgIzAjQCNQI3AjgCOQI6AjsCPQI+Aj8CQAJBAkMCRAJFAkYCRwJJAkoCSwJMAk0CTwJQAlECUgJTAlUCVgJXAlgCWQJbAlwCXQJeAl8CYQJiAmMCZAJlAmcCaAJpAmoCawJtAm4CbwJwAnECcgJ0AnUCdgJ3AngCegJ7AnwCfQJ+AoACgQKCAoMChAKFAocCiAKJAooCiwKNAo4CjwKQApECkgKUApUClgKXApgCmQKbApwCnQKeAp8CoQKiAqMCpAKlAqYCqAKpAqoCqwKsAq0CrwKwArECsgKzArQCtgK3ArgCuQK6ArsCvQK+Ar8CwALBAsICxALFAsYCxwLIAskCygLMAs0CzgLPAtAC0QLTAtQC1QLWAtcC2ALaAtsC3ALdAt4C3wLgAuIC4wLkAuUC5gLnAugC6gLrAuwC7QLuAu8C8ALyAvMC9AL1AvYC9wL4AvoC+wL8Av0C/gL/AgADAgMDAwQDBQMGAwcDCAMJAwsDDAMNAw4DDwMQAxEDEwMUAxUDFgMXAxgDGQMaAxwDHQMeAx8DIAMhAyIDIwMlAyYDJwMoAykDKgMrAywDLQMvAzADMQMyAzMDNAM1AzYDNwM5AzoDOwM8Az0DPgM/A0ADQQNDA0QDRQNGA0cDSANJA0oDSwNNA04DTwNQA1EDUgNTA1QDVQNWA1gDWQNaA1sDXANdA14DXwNgA2EDYgNkA2UDZgNnA2gDaQNqA2sDbANtA24DcANxA3IDcwN0A3UDdgN3A3gDeQN6A3sDfQN+A38DgAOBA4IDgwOEA4UDhgOHA4gDiQOLA4wDjQOOA48DkAORA5IDkwOUA5UDlgOXA5gDmQObA5wDnQOeA58DoAOhA6IDowOkA6UDpgOnA6gDqQOqA6sDrQOuA68DsAOxA7IDswO0A7UDtgO3A7gDuQO6A7sDvAO9A74DvwPAA8EDwgPEA8UDxgPHA8gDyQPKA8sDzAPNA84DzwPQA9ED0gPTA9QD1QPWA9cD2APZA9oD2wPcA90D3gPfA+AD4QPiA+QD5QPmA+cD6APpA+oD6wPsA+0D7gPvA/AD8QPyA/MD9AP1A/YD9wP4A/kD+gP7A/wD/QP+A/8DAAQBBAIEAwQEBAUEBgQHBAgECQQKBAsEDAQNBA4EDwQQBBEEEgQTBBQEFQQWBBcEGAQZBBoEGwQcBB0EHgQfBCAEIQQiBCMEJAQlBCYEJwQoBCkEKQQqBCsELAQtBC4ELwQwBDEEMgQzBDQENQQ2BDcEOAQ5BDoEOwQ8BD0EPgQ/BEAEQQRCBEMERARFBEYERgRHBEgESQRKBEsETARNBE4ETwRQBFEEUgRTBFQEVQRWBFcEWARZBFoEWgRbBFwEXQReBF8EYARhBGIEYwRkBGUEZgRnBGgEaQRpBGoEawRsBG0EbgRvBHAEcQRyBHMEdAR1BHUEdgR3BHgEeQR6BHsEfAR9BH4EfwSABIEEgQSCBIMEhASFBIYEhwSIBIkEigSLBIsEjASNBI4EjwSQBJEEkgSTBJQElASVBJYElwSYBJkEmgSbBJwEnQSdBJ4EnwSgBKEEogSjBKQEpQSlBKYEpwSoBKkEqgSrBKwErAStBK4ErwSwBLEEsgSzBLMEtAS1BLYEtwS4BLkEugS6BLsEvAS9BL4EvwTABMAEwQTCBMMExATFBMYExgTHBMgEyQTKBMsEzATMBM0EzgTPBNAE0QTSBNIE0wTUBNUE1gTXBNcE2ATZBNoE2wTcBNwE3QTeBN8E4AThBOEE4gTjBOQE5QTmBOYE5wToBOkE6gTrBOsE7ATtBO4E7wTwBPAE8QTyBPME9AT0BPUE9gT3BPgE+AT5BPoE+wT8BP0E/QT+BP8EAAUBBQEFAgUDBQQFBQUFBQYFBwUIBQkFCQUKBQsFDAUMBQ0FDgUPBRAFEAURBRIFEwUUBRQFFQUWBRcFFwUYBRkFGgUbBRsFHAUdBR4FHgUfBSAFIQUiBSIFIwUkBSUFJQUmBScFKAUoBSkFKgUrBSsFLAUtBS4FLgUvBTAFMQUxBTIFMwU0BTQFNQU2BTcFNwU4BTkFOgU6BTsFPAU9BT0FPgU/BUAFQAVBBUIFQwVDBUQFRQVFBUYFRwVIBUgFSQVKBUsFSwVMBU0FTQVOBU8FUAVQBVEFUgVSBVMFVAVVBVUFVgVXBVcFWAVZBVoFWgVbBVwFXAVdBV4FXgVfBWAFYQVhBWIFYwVjBWQFZQVlBWYFZwVnBWgFaQVqBWoFawVsBWwFbQVuBW4FbwVwBXAFcQVyBXIFcwV0BXQFdQV2BXYFdwV4BXgFeQV6BXoFewV8BXwFfQV+BX4FfwWABYAFgQWCBYIFgwWEBYQFhQWGBYYFhwWIBYgFiQWJBYoFiwWLBYwFjQWNBY4FjwWPBZAFkQWRBZIFkgWTBZQFlAWVBZYFlgWXBZcFmAWZBZkFmgWbBZsFnAWcBZ0FngWeBZ8FoAWgBaEFoQWiBaMFowWkBaQFpQWmBaYFpwWnBagFqQWpBaoFqgWrBawFrAWtBa0FrgWvBa8FsAWwBbEFsgWyBbMFswW0BbQFtQW2BbYFtwW3BbgFuQW5BboFugW7BbsFvAW9Bb0FvgW+Bb8FvwXABcAFwQXCBcIFwwXDBcQFxAXFBcYFxgXHBccFyAXIBckFyQXKBcoFywXMBcwFzQXNBc4FzgXPBc8F0AXQBdEF0gXSBdMF0wXUBdQF1QXVBdYF1gXXBdcF2AXYBdkF2QXaBdoF2wXcBdwF3QXdBd4F3gXfBd8F4AXgBeEF4QXiBeIF4wXjBeQF5AXlBeUF5gXmBecF5wXoBegF6QXpBeoF6gXrBesF7AXsBe0F7QXuBe4F7gXvBe8F8AXwBfEF8QXyBfIF8wXzBfQF9AX1BfUF9gX2BfcF9wX3BfgF+AX5BfkF+gX6BfsF+wX8BfwF/QX9Bf0F/gX+Bf8F/wUABgAGAQYBBgEGAgYCBgMGAwYEBgQGBQYFBgUGBgYGBgcGBwYIBggGCAYJBgkGCgYKBgsGCwYLBgwGDAYNBg0GDgYOBg4GDwYPBhAGEAYQBhEGEQYSBhIGEgYTBhMGFAYUBhQGFQYVBhYGFgYWBhcGFwYYBhgGGAYZBhkGGgYaBhoGGwYbBhwGHAYcBh0GHQYdBh4GHgYfBh8GHwYgBiAGIAYhBiEGIgYiBiIGIwYjBiMGJAYkBiQGJQYlBiYGJgYmBicGJwYnBigGKAYoBikGKQYpBioGKgYqBisGKwYrBiwGLAYsBi0GLQYtBi4GLgYuBi8GLwYvBjAGMAYwBjEGMQYxBjIGMgYyBjMGMwYzBjQGNAY0BjUGNQY1BjYGNgY2BjYGNwY3BjcGOAY4BjgGOQY5BjkGOQY6BjoGOgY7BjsGOwY8BjwGPAY8Bj0GPQY9Bj4GPgY+Bj4GPwY/Bj8GQAZABkAGQAZBBkEGQQZBBkIGQgZCBkIGQwZDBkMGRAZEBkQGRAZFBkUGRQZFBkYGRgZGBkYGRwZHBkcGRwZIBkgGSAZIBkkGSQZJBkkGSgZKBkoGSgZKBksGSwZLBksGTAZMBkwGTAZNBk0GTQZNBk0GTgZOBk4GTgZPBk8GTwZPBk8GUAZQBlAGUAZQBlEGUQZRBlEGUQZSBlIGUgZSBlIGUwZTBlMGUwZTBlQGVAZUBlQGVAZVBlUGVQZVBlUGVgZWBlYGVgZWBlYGVwZXBlcGVwZXBlcGWAZYBlgGWAZYBlgGWQZZBlkGWQZZBlkGWgZaBloGWgZaBloGWgZbBlsGWwZbBlsGWwZcBlwGXAZcBlwGXAZcBl0GXQZdBl0GXQZdBl0GXQZeBl4GXgZeBl4GXgZeBl4GXwZfBl8GXwZfBl8GXwZfBmAGYAZgBmAGYAZgBmAGYAZgBmAGYQZhBmEGYQZhBmEGYQZhBmEGYQZiBmIGYgZiBmIGYgZiBmIGYgZiBmIGYwZjBmMGYwZjBmMGYwZjBmMGYwZjBmMGYwZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZgZmBmYGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZlBmUGZQZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGZAZkBmQGYwZjBmMGYwZjBmMGYwZjBmMGYwZjBmMGYwZiBmIGYgZiBmIGYgZiBmIGYgZiBmIGYQZhBmEGYQZhBmEGYQZhBmEGYQZgBmAGYAZgBmAGYAZgBmAGYAZgBl8GXwZfBl8GXwZfBl8GXwZeBl4GXgZeBl4GXgZeBl4GXQZdBl0GXQZdBl0GXQZdBlwGXAZcBlwGXAZcBlwGWwZbBlsGWwZbBlsGWgZaBloGWgZaBloGWgZZBlkGWQZZBlkGWQZYBlgGWAZYBlgGWAZXBlcGVwZXBlcGVwZWBlYGVgZWBlYGVgZVBlUGVQZVBlUGVAZUBlQGVAZUBlMGUwZTBlMGUwZSBlIGUgZSBlIGUQZRBlEGUQZRBlAGUAZQBlAGUAZPBk8GTwZPBk8GTgZOBk4GTgZNBk0GTQZNBk0GTAZMBkwGTAZLBksGSwZLBkoGSgZKBkoGSgZJBkkGSQZJBkgGSAZIBkgGRwZHBkcGRwZGBkYGRgZGBkUGRQZFBkUGRAZEBkQGRAZDBkMGQwZCBkIGQgZCBkEGQQZBBkEGQAZABkAGQAY/Bj8GPwY+Bj4GPgY+Bj0GPQY9BjwGPAY8BjwGOwY7BjsGOgY6BjoGOQY5BjkGOQY4BjgGOAY3BjcGNwY2BjYGNgY2BjUGNQY1BjQGNAY0BjMGMwYzBjIGMgYyBjEGMQYxBjAGMAYwBi8GLwYvBi4GLgYuBi0GLQYtBiwGLAYsBisGKwYrBioGKgYqBikGKQYpBigGKAYoBicGJwYnBiYGJgYmBiUGJQYkBiQGJAYjBiMGIwYiBiIGIgYhBiEGIAYgBiAGHwYfBh8GHgYeBh0GHQYdBhwGHAYcBhsGGwYaBhoGGgYZBhkGGAYYBhgGFwYXBhYGFgYWBhUGFQYUBhQGFAYTBhMGEgYSBhIGEQYRBhAGEAYQBg8GDwYOBg4GDgYNBg0GDAYMBgsGCwYLBgoGCgYJBgkGCAYIBggGBwYHBgYGBgYFBgUGBQYEBgQGAwYDBgIGAgYBBgEGAQYABgAG/wX/Bf4F/gX9Bf0F/QX8BfwF+wX7BfoF+gX5BfkF+AX4BfcF9wX3BfYF9gX1BfUF9AX0BfMF8wXyBfIF8QXxBfAF8AXvBe8F7gXuBe4F7QXtBewF7AXrBesF6gXqBekF6QXoBegF5wXnBeYF5gXlBeUF5AXkBeMF4wXiBeIF4QXhBeAF4AXfBd8F3gXeBd0F3QXcBdwF2wXaBdoF2QXZBdgF2AXXBdcF1gXWBdUF1QXUBdQF0wXTBdIF0gXRBdAF0AXPBc8FzgXOBc0FzQXMBcwFywXKBcoFyQXJBcgFyAXHBccFxgXGBcUFxAXEBcMFwwXCBcIFwQXABcAFvwW/Bb4FvgW9Bb0FvAW7BbsFugW6BbkFuQW4BbcFtwW2BbYFtQW0BbQFswWzBbIFsgWxBbAFsAWvBa8FrgWtBa0FrAWsBasFqgWqBakFqQWoBacFpwWmBaYFpQWkBaQFowWjBaIFoQWhBaAFoAWfBZ4FngWdBZwFnAWbBZsFmgWZBZkFmAWXBZcFlgWWBZUFlAWUBZMFkgWSBZEFkQWQBY8FjwWOBY0FjQWMBYsFiwWKBYkFiQWIBYgFhwWGBYYFhQWEBYQFgwWCBYIFgQWABYAFfwV+BX4FfQV8BXwFewV6BXoFeQV4BXgFdwV2BXYFdQV0BXQFcwVyBXIFcQVwBXAFbwVuBW4FbQVsBWwFawVqBWoFaQVoBWcFZwVmBWUFZQVkBWMFYwViBWEFYQVgBV8FXgVeBV0FXAVcBVsFWgVaBVkFWAVXBVcFVgVVBVUFVAVTBVIFUgVRBVAFUAVPBU4FTQVNBUwFSwVLBUoFSQVIBUgFRwVGBUUFRQVEBUMFQwVCBUEFQAVABT8FPgU9BT0FPAU7BToFOgU5BTgFNwU3BTYFNQU0BTQFMwUyBTEFMQUwBS8FLgUuBS0FLAUrBSsFKgUpBSgFKAUnBSYFJQUlBSQFIwUiBSIFIQUgBR8FHgUeBR0FHAUbBRsFGgUZBRgFFwUXBRYFFQUUBRQFEwUSBREFEAUQBQ8FDgUNBQwFDAULBQoFCQUJBQgFBwUGBQUFBQUEBQMFAgUBBQEFAAX/BP4E/QT9BPwE+wT6BPkE+AT4BPcE9gT1BPQE9ATzBPIE8QTwBPAE7wTuBO0E7ATrBOsE6gTpBOgE5wTmBOYE5QTkBOME4gThBOEE4ATfBN4E3QTcBNwE2wTaBNkE2ATXBNcE1gTVBNQE0wTSBNIE0QTQBM8EzgTNBMwEzATLBMoEyQTIBMcExgTGBMUExATDBMIEwQTABMAEvwS+BL0EvAS7BLoEugS5BLgEtwS2BLUEtASzBLMEsgSxBLAErwSuBK0ErASsBKsEqgSpBKgEpwSmBKUEpQSkBKMEogShBKAEnwSeBJ0EnQScBJsEmgSZBJgElwSWBJUElASUBJMEkgSRBJAEjwSOBI0EjASLBIsEigSJBIgEhwSGBIUEhASDBIIEgQSBBIAEfwR+BH0EfAR7BHoEeQR4BHcEdgR1BHUEdARzBHIEcQRwBG8EbgRtBGwEawRqBGkEaQRoBGcEZgRlBGQEYwRiBGEEYARfBF4EXQRcBFsEWgRaBFkEWARXBFYEVQRUBFMEUgRRBFAETwROBE0ETARLBEoESQRIBEcERgRGBEUERARDBEIEQQRABD8EPgQ9BDwEOwQ6BDkEOAQ3BDYENQQ0BDMEMgQxBDAELwQuBC0ELAQrBCoEKQQpBCgEJwQmBCUEJAQjBCIEIQQgBB8EHgQdBBwEGwQaBBkEGAQXBBYEFQQUBBMEEgQRBBAEDwQOBA0EDAQLBAoECQQIBAcEBgQFBAQEAwQCBAEEAAT/A/4D/QP8A/sD+gP5A/gD9wP2A/UD9APzA/ID8QPwA+8D7gPtA+wD6wPqA+kD6APnA+YD5QPkA+ID4QPgA98D3gPdA9wD2wPaA9kD2APXA9YD1QPUA9MD0gPRA9ADzwPOA80DzAPLA8oDyQPIA8cDxgPFA8QDwgPBA8ADvwO+A70DvAO7A7oDuQO4A7cDtgO1A7QDswOyA7EDsAOvA64DrQOrA6oDqQOoA6cDpgOlA6QDowOiA6EDoAOfA54DnQOcA5sDmQOYA5cDlgOVA5QDkwOSA5EDkAOPA44DjQOMA4sDiQOIA4cDhgOFA4QDgwOCA4EDgAN/A34DfQN7A3oDeQN4A3cDdgN1A3QDcwNyA3EDcANuA20DbANrA2oDaQNoA2cDZgNlA2QDYgNhA2ADXwNeA10DXANbA1oDWQNYA1YDVQNUA1MDUgNRA1ADTwNOA00DSwNKA0kDSANHA0YDRQNEA0MDQQNAAz8DPgM9AzwDOwM6AzkDNwM2AzUDNAMzAzIDMQMwAy8DLQMsAysDKgMpAygDJwMmAyUDIwMiAyEDIAMfAx4DHQMcAxoDGQMYAxcDFgMVAxQDEwMRAxADDwMOAw0DDAMLAwkDCAMHAwYDBQMEAwMDAgMAA/8C/gL9AvwC+wL6AvgC9wL2AvUC9ALzAvIC8ALvAu4C7QLsAusC6gLoAucC5gLlAuQC4wLiAuAC3wLeAt0C3ALbAtoC2ALXAtYC1QLUAtMC0QLQAs8CzgLNAswCygLJAsgCxwLGAsUCxALCAsECwAK/Ar4CvQK7AroCuQK4ArcCtgK0ArMCsgKxArACrwKtAqwCqwKqAqkCqAKmAqUCpAKjAqICoQKfAp4CnQKcApsCmQKYApcClgKVApQCkgKRApACjwKOAo0CiwKKAokCiAKHAoUChAKDAoICgQKAAn4CfQJ8AnsCegJ4AncCdgJ1AnQCcgJxAnACbwJuAm0CawJqAmkCaAJnAmUCZAJjAmICYQJfAl4CXQJcAlsCWQJYAlcCVgJVAlMCUgJRAlACTwJNAkwCSwJKAkkCRwJGAkUCRAJDAkECQAI/Aj4CPQI7AjoCOQI4AjcCNQI0AjMCMgIxAi8CLgItAiwCKgIpAigCJwImAiQCIwIiAiECIAIeAh0CHAIbAhkCGAIXAhYCFQITAhICEQIQAg8CDQIMAgsCCgIIAgcCBgIFAgQCAgIBAgAC/wH9AfwB+wH6AfkB9wH2AfUB9AHyAfEB8AHvAe4B7AHrAeoB6QHnAeYB5QHkAeIB4QHgAd8B3gHcAdsB2gHZAdcB1gHVAdQB0gHRAdABzwHOAcwBywHKAckBxwHGAcUBxAHCAcEBwAG/Ab0BvAG7AboBuAG3AbYBtQG0AbIBsQGwAa8BrQGsAasBqgGoAacBpgGlAaMBogGhAaABngGdAZwBmwGZAZgBlwGWAZQBkwGSAZEBjwGOAY0BjAGKAYkBiAGHAYUBhAGDAYIBgAF/AX4BfQF7AXoBeQF4AXYBdQF0AXMBcQFwAW8BbgFsAWsBagFpAWcBZgFlAWQBYgFhAWABXwFdAVwBWwFaAVgBVwFWAVUBUwFSAVEBUAFOAU0BTAFKAUkBSAFHAUUBRAFDAUIBQAE/AT4BPQE7AToBOQE4ATYBNQE0ATIBMQEwAS8BLQEsASsBKgEoAScBJgElASMBIgEhASABHgEdARwBGgEZARgBFwEVARQBEwESARABDwEOAQwBCwEKAQkBBwEGAQUBBAECAQEBAAH/AP0A/AD7APkA+AD3APYA9ADzAPIA8QDvAO4A7QDrAOoA6QDoAOYA5QDkAOMA4QDgAN8A3QDcANsA2gDYANcA1gDUANMA0gDRAM8AzgDNAMwAygDJAMgAxgDFAMQAwwDBAMAAvwC+ALwAuwC6ALgAtwC2ALUAswCyALEArwCuAK0ArACqAKkAqACmAKUApACjAKEAoACfAJ4AnACbAJoAmACXAJYAlQCTAJIAkQCPAI4AjQCMAIoAiQCIAIYAhQCEAIMAgQCAAH8AfQB8AHsAegB4AHcAdgB0AHMAcgBxAG8AbgBtAGwAagBpAGgAZgBlAGQAYwBhAGAAXwBdAFwAWwBaAFgAVwBWAFQAUwBSAFEATwBOAE0ASwBKAEkASABGAEUARABCAEEAQAA/AD0APAA7ADkAOAA3ADYANAAzADIAMAAvAC4ALQArACoAKQAnACYAJQAkACIAIQAgAB4AHQAcABsAGQAYABcAFQAUABMAEgAQAA8ADgAMAAsACgAJAAcABgAFAAMAAgABAAAA///+//3/+//6//n/9//2//X/9P/y//H/8P/u/+3/7P/r/+n/6P/n/+X/5P/j/+L/4P/f/97/3P/b/9r/2f/X/9b/1f/T/9L/0f/Q/87/zf/M/8r/yf/I/8f/xf/E/8P/wf/A/7//vv+8/7v/uv+4/7f/tv+1/7P/sv+x/6//rv+t/6z/qv+p/6j/pv+l/6T/o/+h/6D/n/+d/5z/m/+a/5j/l/+W/5T/k/+S/5H/j/+O/43/jP+K/4n/iP+G/4X/hP+D/4H/gP9//33/fP97/3r/eP93/3b/dP9z/3L/cf9v/27/bf9r/2r/af9o/2b/Zf9k/2L/Yf9g/1//Xf9c/1v/Wv9Y/1f/Vv9U/1P/Uv9R/0//Tv9N/0v/Sv9J/0j/Rv9F/0T/Qv9B/0D/P/89/zz/O/86/zj/N/82/zT/M/8y/zH/L/8u/y3/LP8q/yn/KP8m/yX/JP8j/yH/IP8f/x3/HP8b/xr/GP8X/xb/Ff8T/xL/Ef8P/w7/Df8M/wr/Cf8I/wf/Bf8E/wP/Af8A///+/v78/vv++v75/vf+9v71/vT+8v7x/vD+7v7t/uz+6/7p/uj+5/7m/uT+4/7i/uD+3/7e/t3+2/7a/tn+2P7W/tX+1P7T/tH+0P7P/s7+zP7L/sr+yP7H/sb+xf7D/sL+wf7A/r7+vf68/rv+uf64/rf+tv60/rP+sv6w/q/+rv6t/qv+qv6p/qj+pv6l/qT+o/6h/qD+n/6e/pz+m/6a/pn+l/6W/pX+lP6S/pH+kP6P/o3+jP6L/or+iP6H/ob+hf6D/oL+gf6A/n7+ff58/nv+ef54/nf+dv50/nP+cv5x/m/+bv5t/mz+av5p/mj+Z/5l/mT+Y/5i/mD+X/5e/l3+W/5a/ln+WP5W/lX+VP5T/lH+UP5P/k7+TP5L/kr+Sf5I/kb+Rf5E/kP+Qf5A/j/+Pv48/jv+Ov45/jf+Nv41/jT+Mv4x/jD+L/4u/iz+K/4q/in+J/4m/iX+JP4i/iH+IP4f/h7+HP4b/hr+Gf4X/hb+Ff4U/hL+Ef4Q/g/+Dv4M/gv+Cv4J/gf+Bv4F/gT+A/4B/gD+//3+/fz9+/36/fn9+P32/fX99P3z/fH98P3v/e797f3r/er96f3o/ef95f3k/eP94v3g/d/93v3d/dz92v3Z/dj91/3W/dT90/3S/dH9z/3O/c39zP3L/cn9yP3H/cb9xf3D/cL9wf3A/b/9vf28/bv9uv25/bf9tv21/bT9s/2x/bD9r/2u/a39q/2q/an9qP2n/aX9pP2j/aL9of2f/Z79nf2c/Zv9mf2Y/Zf9lv2V/ZP9kv2R/ZD9j/2O/Yz9i/2K/Yn9iP2G/YX9hP2D/YL9gP1//X79ff18/Xv9ef14/Xf9dv11/XP9cv1x/XD9b/1u/Wz9a/1q/Wn9aP1n/WX9ZP1j/WL9Yf1f/V79Xf1c/Vv9Wv1Y/Vf9Vv1V/VT9U/1R/VD9T/1O/U39TP1K/Un9SP1H/Ub9Rf1D/UL9Qf1A/T/9Pv08/Tv9Ov05/Tj9N/02/TT9M/0y/TH9MP0v/S39LP0r/Sr9Kf0o/Sb9Jf0k/SP9Iv0h/SD9Hv0d/Rz9G/0a/Rn9GP0W/RX9FP0T/RL9Ef0Q/Q79Df0M/Qv9Cv0J/Qj9Bv0F/QT9A/0C/QH9AP3+/P38/Pz7/Pr8+fz4/Pf89fz0/PP88vzx/PD87/zt/Oz86/zq/On86Pzn/Ob85Pzj/OL84fzg/N/83vzd/Nv82vzZ/Nj81/zW/NX81PzT/NH80PzP/M78zfzM/Mv8yvzJ/Mf8xvzF/MT8w/zC/MH8wPy//L38vPy7/Lr8ufy4/Lf8tvy1/LP8svyx/LD8r/yu/K38rPyr/Kr8qPyn/Kb8pfyk/KP8ovyh/KD8n/ye/Jz8m/ya/Jn8mPyX/Jb8lfyU/JP8kvyQ/I/8jvyN/Iz8i/yK/In8iPyH/Ib8hfyD/IL8gfyA/H/8fvx9/Hz8e/x6/Hn8ePx3/HX8dPxz/HL8cfxw/G/8bvxt/Gz8a/xq/Gn8aPxn/GX8ZPxj/GL8Yfxg/F/8Xvxd/Fz8W/xa/Fn8WPxX/Fb8VfxT/FL8UfxQ/E/8TvxN/Ez8S/xK/En8SPxH/Eb8RfxE/EP8QvxB/ED8P/w+/Dz8O/w6/Dn8OPw3/Db8Nfw0/DP8Mvwx/DD8L/wu/C38LPwr/Cr8Kfwo/Cf8Jvwl/CT8I/wi/CH8IPwf/B78HPwb/Br8GfwY/Bf8FvwV/BT8E/wS/BH8EPwP/A78DfwM/Av8CvwJ/Aj8B/wG/AX8BPwD/AL8AfwA/P/7/vv9+/z7+/v6+/n7+Pv3+/b79fv0+/P78vvx+/D77/vu++377Pvr++r76fvo++f75vvl++T74/vi++H74Pvf+9773fvc+9v72vvZ+9j71/vX+9b71fvU+9P70vvR+9D7z/vO+837zPvL+8r7yfvI+8f7xvvF+8T7w/vC+8H7wPu/+777vfu8+7v7uvu6+7n7uPu3+7b7tfu0+7P7svux+7D7r/uu+637rPur+6r7qfuo+6f7pvum+6X7pPuj+6L7ofug+5/7nvud+5z7m/ua+5n7mPuX+5f7lvuV+5T7k/uS+5H7kPuP+477jfuM+4v7i/uK+4n7iPuH+4b7hfuE+4P7gvuB+4D7f/t/+377fft8+3v7evt5+3j7d/t2+3X7dft0+3P7cvtx+3D7b/tu+237bPts+2v7avtp+2j7Z/tm+2X7ZPtj+2P7Yvth+2D7X/te+137XPtb+1v7WvtZ+1j7V/tW+1X7VPtU+1P7UvtR+1D7T/tO+037TftM+0v7SvtJ+0j7R/tG+0b7RftE+0P7QvtB+0D7QPs/+z77Pfs8+zv7Ovs6+zn7OPs3+zb7Nfs0+zT7M/sy+zH7MPsv+y77Lvst+yz7K/sq+yn7Kfso+yf7Jvsl+yT7JPsj+yL7Ifsg+x/7H/se+x37HPsb+xr7GvsZ+xj7F/sW+xX7FfsU+xP7EvsR+xD7EPsP+w77DfsM+wz7C/sK+wn7CPsI+wf7BvsF+wT7A/sD+wL7AfsA+//6//r++v36/Pr7+vv6+vr5+vj69/r3+vb69fr0+vT68/ry+vH68Prw+u/67vrt+uz67Prr+ur66frp+uj65/rm+uX65frk+uP64vri+uH64Prf+t763vrd+tz62/rb+tr62frY+tj61/rW+tX61frU+tP60vrS+tH60PrP+s/6zvrN+sz6zPrL+sr6yfrJ+sj6x/rG+sb6xfrE+sP6w/rC+sH6wPrA+r/6vvq9+r36vPq7+rv6uvq5+rj6uPq3+rb6tfq1+rT6s/qz+rL6sfqw+rD6r/qu+q76rfqs+qv6q/qq+qn6qfqo+qf6pvqm+qX6pPqk+qP6ovqi+qH6oPqf+p/6nvqd+p36nPqb+pv6mvqZ+pn6mPqX+pb6lvqV+pT6lPqT+pL6kvqR+pD6kPqP+o76jvqN+oz6jPqL+or6ivqJ+oj6iPqH+ob6hvqF+oT6hPqD+oL6gvqB+oD6gPp/+n76fvp9+nz6fPp7+nr6evp5+nj6ePp3+nf6dvp1+nX6dPpz+nP6cvpx+nH6cPpv+m/6bvpu+m36bPps+mv6avpq+mn6afpo+mf6Z/pm+mX6Zfpk+mT6Y/pi+mL6Yfpg+mD6X/pf+l76Xfpd+lz6XPpb+lr6WvpZ+ln6WPpX+lf6VvpW+lX6VPpU+lP6U/pS+lH6UfpQ+lD6T/pO+k76TfpN+kz6TPpL+kr6SvpJ+kn6SPpH+kf6RvpG+kX6RfpE+kP6Q/pC+kL6QfpB+kD6QPo/+j76Pvo9+j36PPo8+jv6Ovo6+jn6Ofo4+jj6N/o3+jb6Nvo1+jT6NPoz+jP6Mvoy+jH6Mfow+jD6L/ou+i76Lfot+iz6LPor+iv6Kvoq+in6Kfoo+ij6J/on+ib6Jvol+iT6JPoj+iP6Ivoi+iH6Ifog+iD6H/of+h76Hvod+h36HPoc+hv6G/oa+hr6GfoZ+hj6GPoX+hf6FvoW+hX6FfoU+hT6E/oT+hL6EvoS+hH6EfoQ+hD6D/oP+g76DvoN+g36DPoM+gv6C/oK+gr6CfoJ+gn6CPoI+gf6B/oG+gb6BfoF+gT6BPoD+gP6A/oC+gL6AfoB+gD6APr/+f/5//n++f75/fn9+fz5/Pn7+fv5+/n6+fr5+fn5+fj5+Pn4+ff59/n2+fb59fn1+fX59Pn0+fP58/ny+fL58vnx+fH58Pnw+fD57/nv+e757vnu+e357fns+ez57Pnr+ev56vnq+er56fnp+ej56Pno+ef55/nm+eb55vnl+eX55Pnk+eT54/nj+eP54vni+eH54fnh+eD54Png+d/53/ne+d753vnd+d353fnc+dz53Pnb+dv52vna+dr52fnZ+dn52PnY+dj51/nX+df51vnW+db51fnV+dX51PnU+dT50/nT+dP50vnS+dL50fnR+dH50PnQ+dD5z/nP+c/5zvnO+c75zfnN+c35zPnM+cz5y/nL+cv5yvnK+cr5yvnJ+cn5yfnI+cj5yPnH+cf5x/nH+cb5xvnG+cX5xfnF+cT5xPnE+cT5w/nD+cP5wvnC+cL5wvnB+cH5wfnA+cD5wPnA+b/5v/m/+b/5vvm++b75vvm9+b35vfm8+bz5vPm8+bv5u/m7+bv5uvm6+br5uvm5+bn5ufm5+bj5uPm4+bj5t/m3+bf5t/m2+bb5tvm2+bb5tfm1+bX5tfm0+bT5tPm0+bP5s/mz+bP5s/my+bL5svmy+bH5sfmx+bH5sfmw+bD5sPmw+bD5r/mv+a/5r/mv+a75rvmu+a75rvmt+a35rfmt+a35rPms+az5rPms+av5q/mr+av5q/mq+ar5qvmq+ar5qvmp+an5qfmp+an5qfmo+aj5qPmo+aj5qPmn+af5p/mn+af5p/mm+ab5pvmm+ab5pvmm+aX5pfml+aX5pfml+aT5pPmk+aT5pPmk+aT5o/mj+aP5o/mj+aP5o/mj+aL5ovmi+aL5ovmi+aL5ovmh+aH5ofmh+aH5ofmh+aH5oPmg+aD5oPmg+aD5oPmg+aD5oPmf+Z/5n/mf+Z/5n/mf+Z/5n/mf+Z75nvme+Z75nvme+Z75nvme+Z75nvmd+Z35nfmd+Z35nfmd+Z35nfmd+Z35nfmd+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvma+Zr5mvmb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zv5m/mb+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmc+Zz5nPmd+Z35nfmd+Z35nfmd+Z35nfmd+Z35nfmd+Z75nvme+Z75nvme+Z75nvme+Z75nvmf+Z/5n/mf+Z/5n/mf+Z/5n/mf+aD5oPmg+aD5oPmg+aD5oPmg+aD5ofmh+aH5ofmh+aH5ofmh+aL5ovmi+aL5ovmi+aL5ovmj+aP5o/mj+aP5o/mj+aP5pPmk+aT5pPmk+aT5pPml+aX5pfml+aX5pfmm+ab5pvmm+ab5pvmm+af5p/mn+af5p/mn+aj5qPmo+aj5qPmo+an5qfmp+an5qfmp+ar5qvmq+ar5qvmq+av5q/mr+av5q/ms+az5rPms+az5rfmt+a35rfmt+a75rvmu+a75rvmv+a/5r/mv+a/5sPmw+bD5sPmw+bH5sfmx+bH5sfmy+bL5svmy+bP5s/mz+bP5s/m0+bT5tPm0+bX5tfm1+bX5tvm2+bb5tvm2+bf5t/m3+bf5uPm4+bj5uPm5+bn5ufm5+br5uvm6+br5u/m7+bv5u/m8+bz5vPm8+b35vfm9+b75vvm++b75v/m/+b/5v/nA+cD5wPnA+cH5wfnB+cL5wvnC+cL5w/nD+cP5xPnE+cT5xPnF+cX5xfnG+cb5xvnH+cf5x/nH+cj5yPnI+cn5yfnJ+cr5yvnK+cr5y/nL+cv5zPnM+cz5zfnN+c35zvnO+c75z/nP+c/50PnQ+dD50fnR+dH50vnS+dL50/nT+dP51PnU+dT51fnV+dX51vnW+db51/nX+df52PnY+dj52fnZ+dn52vna+dr52/nb+dz53Pnc+d353fnd+d753vne+d/53/ng+eD54Pnh+eH54fni+eL54/nj+eP55Pnk+eT55fnl+eb55vnm+ef55/no+ej56Pnp+en56vnq+er56/nr+ez57Pns+e357fnu+e757vnv+e/58Pnw+fD58fnx+fL58vny+fP58/n0+fT59fn1+fX59vn2+ff59/n4+fj5+Pn5+fn5+vn6+fv5+/n7+fz5/Pn9+f35/vn++f/5//n/+QD6APoB+gH6AvoC+gP6A/oD+gT6BPoF+gX6BvoG+gf6B/oI+gj6CfoJ+gn6CvoK+gv6C/oM+gz6DfoN+g76DvoP+g/6EPoQ+hH6EfoS+hL6EvoT+hP6FPoU+hX6FfoW+hb6F/oX+hj6GPoZ+hn6Gvoa+hv6G/oc+hz6Hfod+h76Hvof+h/6IPog+iH6Ifoi+iL6I/oj+iT6JPol+ib6Jvon+if6KPoo+in6Kfoq+ir6K/or+iz6LPot+i36Lvou+i/6MPow+jH6Mfoy+jL6M/oz+jT6NPo1+jb6Nvo3+jf6OPo4+jn6Ofo6+jr6O/o8+jz6Pfo9+j76Pvo/+kD6QPpB+kH6QvpC+kP6Q/pE+kX6RfpG+kb6R/pH+kj6SfpJ+kr6SvpL+kz6TPpN+k36TvpO+k/6UPpQ+lH6UfpS+lP6U/pU+lT6VfpW+lb6V/pX+lj6WfpZ+lr6Wvpb+lz6XPpd+l36Xvpf+l/6YPpg+mH6Yvpi+mP6ZPpk+mX6Zfpm+mf6Z/po+mn6afpq+mr6a/ps+mz6bfpu+m76b/pv+nD6cfpx+nL6c/pz+nT6dfp1+nb6d/p3+nj6ePp5+nr6evp7+nz6fPp9+n76fvp/+oD6gPqB+oL6gvqD+oT6hPqF+ob6hvqH+oj6iPqJ+or6ivqL+oz6jPqN+o76jvqP+pD6kPqR+pL6kvqT+pT6lPqV+pb6lvqX+pj6mfqZ+pr6m/qb+pz6nfqd+p76n/qf+qD6ofqi+qL6o/qk+qT6pfqm+qb6p/qo+qn6qfqq+qv6q/qs+q36rvqu+q/6sPqw+rH6svqz+rP6tPq1+rX6tvq3+rj6uPq5+rr6u/q7+rz6vfq9+r76v/rA+sD6wfrC+sP6w/rE+sX6xvrG+sf6yPrJ+sn6yvrL+sz6zPrN+s76z/rP+tD60frS+tL60/rU+tX61frW+tf62PrY+tn62vrb+tv63Prd+t763vrf+uD64fri+uL64/rk+uX65frm+uf66Prp+un66vrr+uz67Prt+u767/rw+vD68fry+vP69Pr0+vX69vr3+vf6+Pr5+vr6+/r7+vz6/fr++v/6//oA+wH7AvsD+wP7BPsF+wb7B/sI+wj7CfsK+wv7DPsM+w37DvsP+xD7EPsR+xL7E/sU+xX7FfsW+xf7GPsZ+xr7Gvsb+xz7Hfse+x/7H/sg+yH7Ivsj+yT7JPsl+yb7J/so+yn7Kfsq+yv7LPst+y77Lvsv+zD7Mfsy+zP7NPs0+zX7Nvs3+zj7Ofs6+zr7O/s8+z37Pvs/+0D7QPtB+0L7Q/tE+0X7RvtG+0f7SPtJ+0r7S/tM+037TftO+0/7UPtR+1L7U/tU+1T7VftW+1f7WPtZ+1r7W/tb+1z7Xfte+1/7YPth+2L7Y/tj+2T7Zftm+2f7aPtp+2r7a/ts+2z7bftu+2/7cPtx+3L7c/t0+3X7dft2+3f7ePt5+3r7e/t8+337fvt/+3/7gPuB+4L7g/uE+4X7hvuH+4j7ifuK+4v7i/uM+437jvuP+5D7kfuS+5P7lPuV+5b7l/uX+5j7mfua+5v7nPud+577n/ug+6H7ovuj+6T7pfum+6b7p/uo+6n7qvur+6z7rfuu+6/7sPux+7L7s/u0+7X7tvu3+7j7ufu6+7r7u/u8+737vvu/+8D7wfvC+8P7xPvF+8b7x/vI+8n7yvvL+8z7zfvO+8/70PvR+9L70/vU+9X71vvX+9f72PvZ+9r72/vc+9373vvf++D74fvi++P75Pvl++b75/vo++n76vvr++z77fvu++/78Pvx+/L78/v0+/X79vv3+/j7+fv6+/v7/Pv9+/77//sA/AH8AvwD/AT8BfwG/Af8CPwJ/Ar8C/wM/A38DvwP/BD8EfwS/BP8FPwV/Bb8F/wY/Bn8Gvwb/Bz8Hvwf/CD8Ifwi/CP8JPwl/Cb8J/wo/Cn8Kvwr/Cz8Lfwu/C/8MPwx/DL8M/w0/DX8Nvw3/Dj8Ofw6/Dv8PPw+/D/8QPxB/EL8Q/xE/EX8RvxH/Ej8SfxK/Ev8TPxN/E78T/xQ/FH8UvxT/FX8VvxX/Fj8Wfxa/Fv8XPxd/F78X/xg/GH8Yvxj/GT8Zfxn/Gj8afxq/Gv8bPxt/G78b/xw/HH8cvxz/HT8dfx3/Hj8efx6/Hv8fPx9/H78f/yA/IH8gvyD/IX8hvyH/Ij8ifyK/Iv8jPyN/I78j/yQ/JL8k/yU/JX8lvyX/Jj8mfya/Jv8nPye/J/8oPyh/KL8o/yk/KX8pvyn/Kj8qvyr/Kz8rfyu/K/8sPyx/LL8s/y1/Lb8t/y4/Ln8uvy7/Lz8vfy//MD8wfzC/MP8xPzF/Mb8x/zJ/Mr8y/zM/M38zvzP/ND80fzT/NT81fzW/Nf82PzZ/Nr82/zd/N783/zg/OH84vzj/OT85vzn/Oj86fzq/Ov87Pzt/O/88Pzx/PL88/z0/PX89/z4/Pn8+vz7/Pz8/fz+/AD9Af0C/QP9BP0F/Qb9CP0J/Qr9C/0M/Q39Dv0Q/RH9Ev0T/RT9Ff0W/Rj9Gf0a/Rv9HP0d/R79IP0h/SL9I/0k/SX9Jv0o/Sn9Kv0r/Sz9Lf0v/TD9Mf0y/TP9NP02/Tf9OP05/Tr9O/08/T79P/1A/UH9Qv1D/UX9Rv1H/Uj9Sf1K/Uz9Tf1O/U/9UP1R/VP9VP1V/Vb9V/1Y/Vr9W/1c/V39Xv1f/WH9Yv1j/WT9Zf1n/Wj9af1q/Wv9bP1u/W/9cP1x/XL9c/11/Xb9d/14/Xn9e/18/X39fv1//YD9gv2D/YT9hf2G/Yj9if2K/Yv9jP2O/Y/9kP2R/ZL9k/2V/Zb9l/2Y/Zn9m/2c/Z39nv2f/aH9ov2j/aT9pf2n/aj9qf2q/av9rf2u/a/9sP2x/bP9tP21/bb9t/25/br9u/28/b39v/3A/cH9wv3D/cX9xv3H/cj9yf3L/cz9zf3O/c/90f3S/dP91P3W/df92P3Z/dr93P3d/d793/3g/eL94/3k/eX95/3o/en96v3r/e397v3v/fD98f3z/fT99f32/fj9+f36/fv9/P3+/f/9AP4B/gP+BP4F/gb+B/4J/gr+C/4M/g7+D/4Q/hH+Ev4U/hX+Fv4X/hn+Gv4b/hz+Hv4f/iD+If4i/iT+Jf4m/if+Kf4q/iv+LP4u/i/+MP4x/jL+NP41/jb+N/45/jr+O/48/j7+P/5A/kH+Q/5E/kX+Rv5I/kn+Sv5L/kz+Tv5P/lD+Uf5T/lT+Vf5W/lj+Wf5a/lv+Xf5e/l/+YP5i/mP+ZP5l/mf+aP5p/mr+bP5t/m7+b/5x/nL+c/50/nb+d/54/nn+e/58/n3+fv6A/oH+gv6D/oX+hv6H/oj+iv6L/oz+jf6P/pD+kf6S/pT+lf6W/pf+mf6a/pv+nP6e/p/+oP6h/qP+pP6l/qb+qP6p/qr+q/6t/q7+r/6w/rL+s/60/rb+t/64/rn+u/68/r3+vv7A/sH+wv7D/sX+xv7H/sj+yv7L/sz+zv7P/tD+0f7T/tT+1f7W/tj+2f7a/tv+3f7e/t/+4P7i/uP+5P7m/uf+6P7p/uv+7P7t/u7+8P7x/vL+9P71/vb+9/75/vr++/78/v7+//4A/wH/A/8E/wX/B/8I/wn/Cv8M/w3/Dv8P/xH/Ev8T/xX/Fv8X/xj/Gv8b/xz/Hf8f/yD/If8j/yT/Jf8m/yj/Kf8q/yz/Lf8u/y//Mf8y/zP/NP82/zf/OP86/zv/PP89/z//QP9B/0L/RP9F/0b/SP9J/0r/S/9N/07/T/9R/1L/U/9U/1b/V/9Y/1r/W/9c/13/X/9g/2H/Yv9k/2X/Zv9o/2n/av9r/23/bv9v/3H/cv9z/3T/dv93/3j/ev97/3z/ff9//4D/gf+D/4T/hf+G/4j/if+K/4z/jf+O/4//kf+S/5P/lP+W/5f/mP+a/5v/nP+d/5//oP+h/6P/pP+l/6b/qP+p/6r/rP+t/67/r/+x/7L/s/+1/7b/t/+4/7r/u/+8/77/v//A/8H/w//E/8X/x//I/8n/yv/M/83/zv/Q/9H/0v/T/9X/1v/X/9n/2v/b/9z/3v/f/+D/4v/j/+T/5f/n/+j/6f/r/+z/7f/u//D/8f/y//T/9f/2//f/+f/6//v//f/+////';
    var _audio = null;
    var _audioCtx = null;
    var _unlockBound = false;
    var _retryCount = 0;
    var _maxRetries = 3;
    var _autoResumeTimer = null;
    var _pageVisible = true;

    function _get() { return localStorage.getItem(KEY) === 'true'; }

    function _createAudio() {
        if (_audio) {
            _audio.src = SRC;
            _audio.load();
            return _audio;
        }
        _audio = new Audio(SRC);
        _audio.loop   = true;
        _audio.volume = 0.05;   // 5% 音量 - 足够让 iOS 认为是真实音频
        _audio.preload = 'auto';
        _audio.setAttribute('playsinline', 'true');      // iOS 必需：允许内联播放
        _audio.setAttribute('webkit-playsinline', 'true'); // 旧版 iOS 兼容
        _audio.setAttribute('webkit-playsinline', 'true');

        // 播放成功
        _audio.addEventListener('play',  function(){
            console.log('[keepalive] 音频播放成功');
            _retryCount = 0;
            _setUI(true);
            _setupMediaSession();
        });
        // 被暂停时自动恢复（iOS 后台挂起时会触发）
        _audio.addEventListener('pause', function(){
            console.log('[keepalive] 音频被暂停，尝试自动恢复');
            _setUI(false);
            _scheduleAutoResume();
        });
        // 被中断时自动恢复（其他 App 抢占音频会话）
        _audio.addEventListener('suspend', function(){
            console.log('[keepalive] 音频会话被挂起');
            _setUI(false);
            _scheduleAutoResume();
        });
        _audio.addEventListener('ended', function(){
            console.log('[keepalive] 音频结束，重新播放');
            if (_get()) {
                _audio.currentTime = 0;
                _audio.play().catch(function(){ _scheduleAutoResume(); });
            }
        });
        _audio.addEventListener('error', function(e){
            console.warn('[keepalive] 音频加载失败，尝试备用方案', e);
            _fallbackWebAudio();
        });
        _audio.addEventListener('canplaythrough', function(){
            console.log('[keepalive] 音频文件已就绪');
        });
        // iOS 专属：被其他 App 中断后，中断结束时自动恢复
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', function(){
                if (_get() && _audio) _audio.play().catch(function(){});
            });
            navigator.mediaSession.setActionHandler('pause', function(){
                // 被系统暂停时，立即尝试恢复
                if (_get()) _scheduleAutoResume();
            });
        }
        return _audio;
    }

    // 设置 Media Session API - 让 iOS 认为这是一个媒体播放页面
    function _setupMediaSession() {
        if ('mediaSession' in navigator) {
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: '保活运行中',
                    artist: 'ZY',
                    album: '后台保活',
                    artwork: []
                });
                navigator.mediaSession.playbackState = 'playing';
            } catch(e) {}
        }
    }

    // 自动恢复播放：3秒内尝试3次
    function _scheduleAutoResume() {
        if (_autoResumeTimer) return; // 已经在等待了
        var attempts = 0;
        _autoResumeTimer = setInterval(function(){
            attempts++;
            if (!_get() || !_pageVisible) {
                clearInterval(_autoResumeTimer);
                _autoResumeTimer = null;
                return;
            }
            if (_audio && _audio.paused) {
                var p = _audio.play();
                if (p && p.then) {
                    p.then(function(){
                        console.log('[keepalive] 自动恢复成功 (尝试 ' + attempts + ')');
                        clearInterval(_autoResumeTimer);
                        _autoResumeTimer = null;
                    }).catch(function(){
                        if (attempts >= 3) {
                            console.warn('[keepalive] 自动恢复失败 3 次，切换到 Web Audio');
                            _fallbackWebAudio();
                            clearInterval(_autoResumeTimer);
                            _autoResumeTimer = null;
                        }
                    });
                }
            } else {
                clearInterval(_autoResumeTimer);
                _autoResumeTimer = null;
            }
        }, 1000);
    }

    function _fallbackWebAudio() {
        try {
            if (_audioCtx) return;
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) { console.error('[keepalive] 浏览器不支持 Web Audio API'); return; }
            _audioCtx = new AC();
            var osc = _audioCtx.createOscillator();
            var gain = _audioCtx.createGain();
            gain.gain.value = 0.001;  // 极低音量但不是零
            osc.frequency.value = 1;  // 1Hz 极低频
            osc.connect(gain);
            gain.connect(_audioCtx.destination);
            osc.start();
            _setUI(true);
            console.log('[keepalive] Web Audio API 备用方案已启动');
        } catch(e) {
            console.error('[keepalive] Web Audio 备用方案失败:', e);
        }
    }

    function _setUI(playing) {
        var dot  = document.getElementById('keepalive-dot');
        var desc = document.getElementById('keepalive-audio-desc');
        var sw   = document.getElementById('keepalive-audio-switch');
        var row  = document.getElementById('keepalive-bar-row');

        if (sw)   sw.classList.toggle('active', _get());
        if (dot) {
            dot.className = 'keepalive-dot' + (playing ? ' alive' : '');
        }
        if (desc) {
            if (!_get())      desc.textContent = '静音循环音频，防止页面被系统挂起';
            else if (playing) desc.textContent = '运行中 · 页面已保活';
            else              desc.textContent = '等待交互后启动…';
        }
        if (row)  row.style.display = _get() ? 'flex' : 'none';
        var bars = document.querySelectorAll('.keepalive-wave-bar');
        bars.forEach(function(b){ b.style.animationPlayState = playing ? 'running' : 'paused'; });
    }

    function _start() {
        var a = _createAudio();
        var p = a.play();
        if (p && p.then) {
            p.then(function(){
                console.log('[keepalive] 音频播放成功');
            }).catch(function(err){
                console.warn('[keepalive] 播放被拦截，等待用户交互', err);
                _setUI(false);
                _bindUnlock();
            });
        }
    }

    function _bindUnlock() {
        if (_unlockBound) return;
        _unlockBound = true;

        function unlock(e){
            if (!_get()) { _unlockBound = false; return; }

            if (_audioCtx && _audioCtx.state === 'suspended') {
                _audioCtx.resume().catch(function(){});
            }

            if (_audio) {
                _audio.play().then(function(){
                    console.log('[keepalive] 用户交互后播放成功');
                    _retryCount = 0;
                    _unlockBound = false;
                    _setUI(true);
                }).catch(function(err2){
                    console.warn('[keepalive] 用户交互后仍失败 (尝试 ' + (_retryCount+1) + '/' + _maxRetries + ')', err2);
                    _retryCount++;
                    if (_retryCount >= _maxRetries) {
                        console.log('[keepalive] 文件播放失败过多，启用 Web Audio 备用方案');
                        _fallbackWebAudio();
                        _unlockBound = false;
                    } else {
                        _unlockBound = false;
                    }
                });
            } else {
                _fallbackWebAudio();
                _unlockBound = false;
            }
        }

        document.addEventListener('touchstart', unlock, { once:false, passive:true });
        document.addEventListener('click',      unlock, { once:false });
        document.addEventListener('pointerdown', unlock, { once:false, passive:true });
        document.addEventListener('keydown',     unlock, { once:false });

        setTimeout(function(){
            if (_unlockBound) {
                console.log('[keepalive] 自动重试播放');
                unlock({ type:'auto-retry' });
            }
        }, 500);
    }

    function _stop() {
        if (_autoResumeTimer) { clearInterval(_autoResumeTimer); _autoResumeTimer = null; }
        if (_audio) { _audio.pause(); _audio.currentTime = 0; }
        if (_audioCtx) {
            try { _audioCtx.close(); } catch(e){}
            _audioCtx = null;
        }
        if ('mediaSession' in navigator) {
            try { navigator.mediaSession.playbackState = 'none'; } catch(e) {}
        }
        _retryCount = 0;
        _unlockBound = false;
        _setUI(false);
    }

    window._toggleKeepaliveAudio = function() {
        var next = !_get();
        localStorage.setItem(KEY, String(next));
        if (next) {
            _start();
            if (typeof showNotification === 'function') showNotification('保活音频已开启 🎵', 'success', 2000);
        } else {
            _stop();
            if (typeof showNotification === 'function') showNotification('保活音频已关闭', 'info', 1500);
        }
        _setUI(next && ((_audio && !_audio.paused) || (_audioCtx && _audioCtx.state === 'running')));
    };

    // 页面可见性变化
    document.addEventListener('visibilitychange', function(){
        _pageVisible = (document.visibilityState === 'visible');
        console.log('[keepalive] visibilitychange:', document.visibilityState);

        if (_get() && document.visibilityState === 'visible') {
            // 回到前台：立即恢复音频
            if (_audioCtx && _audioCtx.state === 'suspended') {
                _audioCtx.resume().catch(function(){});
            }
            if (_audio && _audio.paused) {
                _audio.play().then(function(){
                    console.log('[keepalive] 回到前台，音频恢复成功');
                    _setUI(true);
                }).catch(function(){
                    console.warn('[keepalive] 回到前台恢复失败，等待交互');
                    _setUI(false);
                    _bindUnlock();
                });
            }
            if ('mediaSession' in navigator) {
                try { navigator.mediaSession.playbackState = 'playing'; } catch(e) {}
            }
        }
    });

    // iOS 专属：页面被挂起时（requestAnimationFrame 停止触发）
    // 用 Page Visibility API + 定时器双重检测
    setInterval(function(){
        if (!_get()) return;
        if (!_pageVisible) return;

        // 如果开关开着但音频停了，尝试恢复
        if (_audio && _audio.paused && !_autoResumeTimer) {
            console.log('[keepalive] 检测到音频停止，尝试恢复');
            _scheduleAutoResume();
        }
        if (_audioCtx && _audioCtx.state === 'suspended' && !_autoResumeTimer) {
            _audioCtx.resume().catch(function(){});
        }
    }, 5000);

    // 监听页面即将卸载（iOS 后台清理前）
    window.addEventListener('pagehide', function(){
        if (_get() && _audio) {
            try {
                _audio.play().catch(function(){});
            } catch(e) {}
        }
    });

    document.addEventListener('DOMContentLoaded', function(){
        _setUI(false);
        if (_get()) _start();
    });
    setTimeout(function(){
        _setUI(_get() && ((_audio && !_audio.paused) || (_audioCtx && _audioCtx.state === 'running')));
        if (_get() && (!_audio || _audio.paused) && (!_audioCtx || _audioCtx.state !== 'running')) _start();
    }, 1800);
})();

(function() {
    window._runMsgSearch = function() {
        var inp  = document.getElementById('msg-search-input');
        var from = document.getElementById('msg-search-date-from');
        var to   = document.getElementById('msg-search-date-to');
        var out  = document.getElementById('msg-search-results');
        if (!out) return;

        var q  = inp  ? inp.value.trim().toLowerCase() : '';
        var fd = from && from.value ? new Date(from.value+'T00:00:00') : null;
        var td = to   && to.value   ? new Date(to.value  +'T23:59:59') : null;

        if (!q && !fd && !td) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-search"></i><span>输入关键词或选择日期范围</span></div>';
            return;
        }
        if (typeof messages === 'undefined' || !messages || !messages.length) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-inbox"></i><span>暂无聊天记录</span></div>';
            return;
        }

        var res = messages.filter(function(m){
            if (m.type === 'system') return false;
            var ts = m.timestamp ? new Date(m.timestamp) : null;
            if (fd && ts && ts < fd) return false;
            if (td && ts && ts > td) return false;
            if (q) return m.text && m.text.toLowerCase().indexOf(q) !== -1;
            return true;
        });

        if (!res.length) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-inbox"></i><span>未找到匹配消息</span></div>';
            return;
        }

        function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
        function hi(t,k){
            if(!k||!t) return esc(t||'');
            return esc(t).replace(new RegExp('('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark style="background:rgba(var(--accent-color-rgb),.28);color:var(--text-primary);border-radius:3px;padding:0 2px;">$1</mark>');
        }
        function fmt(ts){
            if(!ts) return '';
            var d=new Date(ts);
            return d.getFullYear()+'/'+(d.getMonth()+1+'').padStart(2,'0')+'/'+(d.getDate()+'').padStart(2,'0')+' '+(d.getHours()+'').padStart(2,'0')+':'+(d.getMinutes()+'').padStart(2,'0');
        }
        function nm(m){ return m.sender==='user'?((typeof settings!=='undefined'&&settings.myName)||'我'):((typeof settings!=='undefined'&&settings.partnerName)||'对方'); }

        var _myAvSrc = (function(){
            var el = document.querySelector('#my-avatar img,[id*="my-avatar"] img');
            return el ? el.src : null;
        })();
        var _partnerAvSrc = (function(){
            var el = document.querySelector('#partner-avatar img,[id*="partner-avatar"] img,.partner-avatar img');
            return el ? el.src : null;
        })();
        function _avHtml(isMe) {
            var src = isMe ? _myAvSrc : _partnerAvSrc;
            if (src) return '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
            return '<i class="fas fa-'+(isMe?'user':'user-circle')+'" style="font-size:16px;color:rgba(255,255,255,.8);"></i>';
        }
        var html = '<div style="font-size:12px;color:var(--text-secondary);padding:0 2px 8px;">共 <b style="color:var(--accent-color)">'+res.length+'</b> 条</div>';
        html += res.slice(0,200).map(function(m){
            var isMe = m.sender==='user';
            var preview = m.text?(m.text.length>100?m.text.slice(0,100)+'…':m.text):(m.image?'[图片]':'');
            return '<div class="search-result-item" onclick="window._scrollToMsg&&window._scrollToMsg('+m.id+')">'+
                '<div class="sri-avatar '+(isMe?'sri-me':'sri-partner')+'">'+_avHtml(isMe)+'</div>'+
                '<div class="sri-body">'+
                  '<div class="sri-meta"><span class="sri-name">'+esc(nm(m))+'</span><span class="sri-time">'+fmt(m.timestamp)+'</span></div>'+
                  '<div class="sri-text">'+hi(preview,q)+'</div>'+
                '</div>'+
            '</div>';
        }).join('');
        if (res.length>200) html+='<div style="text-align:center;font-size:12px;color:var(--text-secondary);padding:6px 0">仅显示前 200 条</div>';
        out.innerHTML = html;
    };

    window._scrollToMsg = function(id) {
        // 关闭统计弹窗（hideModal 可能不在全局作用域，直接操作 DOM）
        var m = document.getElementById('stats-modal');
        if (m) {
            var content = m.querySelector('.modal-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px) scale(0.95)';
            }
            if (m._hideTimeout) clearTimeout(m._hideTimeout);
            m._hideTimeout = setTimeout(function() {
                m.style.display = 'none';
            }, 300);
        }

        // 延迟等弹窗关闭动画完成，再尝试滚动
        setTimeout(function() {
            var el = document.querySelector('[data-id="'+id+'"]') || document.querySelector('[data-message-id="'+id+'"]');
            if (el) {
                el.scrollIntoView({behavior:'smooth',block:'center'});
                el.style.transition='background .3s ease';
                el.style.background='rgba(var(--accent-color-rgb),.14)';
                setTimeout(function(){ el.style.background=''; }, 1800);
            } else {
                // 消息不在当前视图中，需要加载更多历史消息
                var msgIndex = -1;
                if (typeof messages !== 'undefined') {
                    for (var i = 0; i < messages.length; i++) {
                        if (String(messages[i].id) === String(id)) {
                            msgIndex = i;
                            break;
                        }
                    }
                }
                if (msgIndex === -1) {
                    if (typeof showNotification==='function') showNotification('消息可能已被删除','info',2000);
                    return;
                }
                // 增加显示的消息数量以包含目标消息
                if (typeof displayedMessageCount !== 'undefined') {
                    var needed = messages.length - msgIndex;
                    if (needed > displayedMessageCount) {
                        displayedMessageCount = needed + 10; // 多加载一些
                        if (typeof renderMessages === 'function') renderMessages(false);
                        // 渲染完成后再尝试滚动
                        setTimeout(function() {
                            var el2 = document.querySelector('[data-id="'+id+'"]') || document.querySelector('[data-message-id="'+id+'"]');
                            if (el2) {
                                el2.scrollIntoView({behavior:'smooth',block:'center'});
                                el2.style.transition='background .3s ease';
                                el2.style.background='rgba(var(--accent-color-rgb),.14)';
                                setTimeout(function(){ el2.style.background=''; }, 1800);
                            } else {
                                if (typeof showNotification==='function') showNotification('消息定位失败','info',2000);
                            }
                        }, 200);
                    }
                }
            }
        }, 350);
    };
})();

function renderComboMenu() {
    const content = document.getElementById('user-sticker-content');
    content.innerHTML = '';
    
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex; gap:8px; padding:8px; border-bottom:1px solid var(--border-color);';
    tabBar.innerHTML = `
        <button class="combo-tab active" data-tab="emoji" style="flex:1; padding:8px; border:none; background:var(--accent-color); color:#fff; border-radius:8px; cursor:pointer;">
            😊 表情
        </button>
        <button class="combo-tab" data-tab="poke" style="flex:1; padding:8px; border:none; background:var(--secondary-bg); color:var(--text-primary); border-radius:8px; cursor:pointer;">
            ✨ 拍一拍
        </button>
        <button class="combo-tab" data-tab="voice" style="flex:1; padding:8px; border:none; background:var(--secondary-bg); color:var(--text-primary); border-radius:8px; cursor:pointer;">
            🎤 语音
        </button>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.id = 'combo-content-area';
    contentArea.style.cssText = 'padding:10px; max-height:240px; overflow-y:auto;';
    
    content.appendChild(tabBar);
    content.appendChild(contentArea);
    
    showEmojiTab();
    
    tabBar.querySelectorAll('.combo-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            tabBar.querySelectorAll('.combo-tab').forEach(b => {
                b.style.background = 'var(--secondary-bg)';
                b.style.color = 'var(--text-primary)';
                b.classList.remove('active');
            });
            btn.style.background = 'var(--accent-color)';
            btn.style.color = '#fff';
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'emoji') {
                showEmojiTab();
            } else if (btn.dataset.tab === 'poke') {
                showPokeTab();
            } else if (btn.dataset.tab === 'voice') {
                showVoiceTab();
            }
        });
    });
}

function showEmojiTab() {
    const area = document.getElementById('combo-content-area');
    area.innerHTML = '';
    area.style.display = 'grid';
    area.style.gridTemplateColumns = 'repeat(5, 1fr)';
    area.style.gap = '8px';
    
    CONSTANTS.REPLY_EMOJIS.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<span style="font-size:24px;">${emoji}</span>`;
        item.onclick = () => {
            const input = document.getElementById('message-input');
            input.value += emoji;
            document.getElementById('user-sticker-picker').classList.remove('active');
            input.focus();
        };
        area.appendChild(item);
    });
    customEmojis.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<span style="font-size:24px;">${emoji}</span>`;
        item.onclick = () => {
            const input = document.getElementById('message-input');
            input.value += emoji;
            document.getElementById('user-sticker-picker').classList.remove('active');
            input.focus();
        };
        area.appendChild(item);
    });

    stickerLibrary.forEach(src => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
        item.onclick = () => {
            if (isBatchMode) {
                batchMessages.push({ id: Date.now() + batchMessages.length, text: '', image: src });
                updateBatchPreview();
                showNotification('已添加到批量发送', 'success', 1200);
            } else {
                addMessage({
                    id: Date.now(),
                    sender: 'user',
                    text: '',
                    timestamp: new Date(),
                    image: src,
                    status: 'sent',
                    type: 'normal'
                });
                playSound('send');
                
                const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                if (window._pendingReplyTimer) clearTimeout(window._pendingReplyTimer);
                window._pendingReplyTimer = setTimeout(() => { window._pendingReplyTimer = null; simulateReply(); }, randomDelay);
            }
            document.getElementById('user-sticker-picker').classList.remove('active');
        };
        area.appendChild(item);
    });
}

function showPokeTab() {
    const area = document.getElementById('combo-content-area');
    area.innerHTML = '';
    area.style.display = 'flex';
    area.style.flexDirection = 'column';
    area.style.gap = '8px';

    // 使用独立的 myPokes 库（表情快捷栏专用），不继承预设
    const pokes = (typeof myPokes !== 'undefined' && Array.isArray(myPokes)) ? myPokes : [];

    if (pokes.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'text-align:center;padding:30px 10px;color:var(--text-secondary);font-size:13px;';
        empty.innerHTML = '<i class="fas fa-hand-sparkles" style="font-size:24px;margin-bottom:8px;display:block;opacity:0.4;"></i>暂无拍一拍<br><span style="font-size:11px;opacity:0.6;">点击下方按钮添加</span>';
        area.appendChild(empty);
    }

    pokes.forEach((pokeText, idx) => {
        const cleanPokeText = (typeof window._sanitizePokeTextForDisplay === 'function')
            ? window._sanitizePokeTextForDisplay(pokeText)
            : pokeText;
        const item = document.createElement('div');
        item.style.cssText = `
            display:flex;align-items:center;gap:8px;padding:10px 12px;
            background:var(--primary-bg);border:1px solid var(--border-color);
            border-radius:12px;cursor:pointer;
            transition:all 0.2s;font-family:var(--font-family);
        `;
        const _esc = (typeof window !== 'undefined' && window.escapeHtml) ? window.escapeHtml : (s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));
        item.innerHTML = `
            <div style="flex:1;min-width:0;font-size:13px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${_esc(cleanPokeText)}">${_esc(cleanPokeText)}</div>
            <button class="poke-send-btn" title="发送" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border-color);background:var(--accent-color);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;">
                <i class="fas fa-paper-plane"></i>
            </button>
            <button class="poke-del-btn" title="删除" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        item.addEventListener('mouseover', () => {
            item.style.borderColor = 'var(--accent-color)';
            item.style.background = 'rgba(var(--accent-color-rgb),0.04)';
        });
        item.addEventListener('mouseout', () => {
            item.style.borderColor = 'var(--border-color)';
            item.style.background = 'var(--primary-bg)';
        });
        // 发送按钮
        item.querySelector('.poke-send-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addMessage({
                id: Date.now(),
                text: _formatPokeText(`${settings.myName} ${cleanPokeText}`),
                timestamp: new Date(),
                type: 'system'
            });
            document.getElementById('user-sticker-picker').classList.remove('active');
            if (typeof playSound === 'function') playSound('poke');
            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
            setTimeout(simulateReply, randomDelay);
        });
        // 删除按钮
        item.querySelector('.poke-del-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('确定删除此拍一拍？')) {
                myPokes.splice(idx, 1);
                if (typeof throttledSaveData === 'function') throttledSaveData();
                showPokeTab(); // 刷新列表
            }
        });
        // 点击整行也发送
        item.addEventListener('click', () => {
            addMessage({
                id: Date.now(),
                text: _formatPokeText(`${settings.myName} ${cleanPokeText}`),
                timestamp: new Date(),
                type: 'system'
            });
            document.getElementById('user-sticker-picker').classList.remove('active');
            if (typeof playSound === 'function') playSound('poke');
            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
            setTimeout(simulateReply, randomDelay);
        });
        area.appendChild(item);
    });

    // 底部操作按钮
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;margin-top:4px;';

    const addBtn = document.createElement('button');
    addBtn.innerHTML = '<i class="fas fa-plus"></i> 添加拍一拍';
    addBtn.style.cssText = `
        flex:1;padding:11px 14px;
        background:linear-gradient(135deg, var(--accent-color), rgba(var(--accent-color-rgb),0.8));
        color:#fff;border:none;border-radius:12px;cursor:pointer;
        font-weight:600;font-size:13px;width:100%;
        letter-spacing:0.3px;box-shadow:0 4px 14px rgba(var(--accent-color-rgb),0.25);
        font-family:var(--font-family);
    `;
    addBtn.onclick = () => {
        document.getElementById('user-sticker-picker').classList.remove('active');
        showModal(DOMElements.pokeModal.modal, DOMElements.pokeModal.input);
    };
    btnRow.appendChild(addBtn);

    // 清空全部按钮（仅当有内容时显示）
    if (pokes.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        clearBtn.title = '清空全部';
        clearBtn.style.cssText = `
            width:42px;height:42px;border-radius:12px;border:1px solid var(--border-color);
            background:var(--primary-bg);color:var(--text-secondary);cursor:pointer;
            display:flex;align-items:center;justify-content:center;font-size:13px;
            flex-shrink:0;font-family:var(--font-family);
        `;
        clearBtn.onmouseover = () => { clearBtn.style.color = '#e74c3c'; clearBtn.style.borderColor = '#e74c3c'; };
        clearBtn.onmouseout = () => { clearBtn.style.color = 'var(--text-secondary)'; clearBtn.style.borderColor = 'var(--border-color)'; };
        clearBtn.onclick = () => {
            if (confirm('确定清空所有拍一拍？此操作不可恢复。')) {
                myPokes = [];
                if (typeof throttledSaveData === 'function') throttledSaveData();
                showPokeTab();
            }
        };
        btnRow.appendChild(clearBtn);
    }

    area.appendChild(btnRow);
}

function showVoiceTab() {
    const area = document.getElementById('combo-content-area');
    area.innerHTML = '';
    area.style.display = 'flex';
    area.style.flexDirection = 'column';
    area.style.gap = '8px';

    const voices = (typeof customVoices !== 'undefined' && Array.isArray(customVoices)) ? customVoices : [];

    if (voices.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'text-align:center;padding:30px 10px;color:var(--text-secondary);font-size:13px;';
        empty.innerHTML = '<i class="fas fa-microphone-slash" style="font-size:24px;margin-bottom:8px;display:block;opacity:0.4;"></i>暂无语音<br><span style="font-size:11px;opacity:0.6;">请在自定义回复-语音中添加</span>';
        area.appendChild(empty);
        return;
    }

    voices.forEach((voice, idx) => {
        const item = document.createElement('div');
        item.style.cssText = `
            display:flex;align-items:center;gap:10px;padding:10px 12px;
            background:var(--primary-bg);border:1px solid var(--border-color);
            border-radius:12px;cursor:pointer;
            transition:all 0.2s;font-family:var(--font-family);
        `;
        item.innerHTML = `
            <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-color);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-size:13px;">
                <i class="fas fa-play"></i>
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(voice.text || '未命名语音')}</div>
            </div>
            <i class="fas fa-paper-plane" style="color:var(--text-secondary);font-size:12px;flex-shrink:0;"></i>
        `;
        item.addEventListener('mouseover', () => {
            item.style.borderColor = 'var(--accent-color)';
            item.style.background = 'rgba(var(--accent-color-rgb,180,140,100),0.06)';
        });
        item.addEventListener('mouseout', () => {
            item.style.borderColor = 'var(--border-color)';
            item.style.background = 'var(--primary-bg)';
        });
        item.onclick = () => {
            // 发送语音消息
            const voiceMsg = {
                id: Date.now(),
                sender: 'user',
                text: '',
                timestamp: new Date(),
                type: 'voice',
                voiceUrl: voice.audioUrl,
                voiceText: voice.text,
                voiceDuration: 0,
                status: 'sent',
                favorited: false,
                note: null,
                replyTo: null
            };
            // 获取音频时长（带超时保底）
            let sent = false;
            const doSend = () => {
                if (sent) return;
                sent = true;
                addMessage(voiceMsg);
            };
            if (voice.audioUrl) {
                try {
                    const tmpAudio = new Audio(voice.audioUrl);
                    tmpAudio.addEventListener('loadedmetadata', () => {
                        voiceMsg.voiceDuration = Math.round(tmpAudio.duration) || 0;
                        doSend();
                    });
                    tmpAudio.addEventListener('canplaythrough', () => {
                        voiceMsg.voiceDuration = Math.round(tmpAudio.duration) || 0;
                        doSend();
                    });
                    tmpAudio.addEventListener('error', () => { doSend(); });
                    // 超时保底：2秒后无论如何发送
                    setTimeout(doSend, 2000);
                } catch(e) {
                    doSend();
                }
            } else {
                doSend();
            }
            document.getElementById('user-sticker-picker').classList.remove('active');
            playSound('send');
            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
            setTimeout(simulateReply, randomDelay);
        };
        area.appendChild(item);
    });
}

        function initCoreListeners() {


            DOMElements.sendBtn.addEventListener('click', () => isBatchMode ? addToBatch(): sendMessage());
            DOMElements.messageInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); isBatchMode ? addToBatch(): sendMessage();
                }
            });
            DOMElements.messageInput.addEventListener('input', () => {
                DOMElements.messageInput.style.height = 'auto'; DOMElements.messageInput.style.height = `${Math.min(DOMElements.messageInput.scrollHeight, 120)}px`;
            });


            DOMElements.attachmentBtn.addEventListener('click', () => {

                const modal = document.createElement('div');
                modal.className = 'modal image-upload-modal';
                modal.style.cssText = `
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
            opacity: 0;
            transition: opacity 0.3s ease;
            `;

                modal.innerHTML = `
            <div class="modal-content" style="
            z-index: 10000;
            position: relative;
            background-color: var(--secondary-bg);
            border-radius: var(--radius);
            padding: 24px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            ">
            <div class="modal-title"><i class="fas fa-image"></i><span>发送图片</span></div>
            <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="modal-btn modal-btn-secondary upload-mode-btn active" id="upload-image-file-btn" style="flex: 1;">选择文件</button>
            <button class="modal-btn modal-btn-secondary upload-mode-btn" id="paste-image-url-btn" style="flex: 1;">粘贴URL</button>
            </div>
            <input type="file" class="modal-input" id="image-file-input" accept="image/*">
            <input type="text" class="modal-input" id="image-url-input" placeholder="输入图片URL地址" style="display: none;">
            <div id="image-preview" style="text-align: center; margin-top: 10px; display: none;">
            <img id="preview-chat-image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--border-color);">
            </div>
            </div>
            <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" id="cancel-image">取消</button>
            <button class="modal-btn modal-btn-primary" id="send-image" disabled>发送</button>
            </div>
            </div>
            `;

                document.body.appendChild(modal);


                setTimeout(() => {
                    modal.style.opacity = '1';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 10);

                const fileInput = document.getElementById('image-file-input');
                const urlInput = document.getElementById('image-url-input');
                const uploadBtn = document.getElementById('upload-image-file-btn');
                const pasteUrlBtn = document.getElementById('paste-image-url-btn');
                const previewDiv = document.getElementById('image-preview');
                const previewImg = document.getElementById('preview-chat-image');
                const sendBtn = document.getElementById('send-image');
                const cancelBtn = document.getElementById('cancel-image');
                const uploadModeBtns = document.querySelectorAll('.upload-mode-btn');

                let currentImageData = null;


                function switchUploadMode(isFileMode) {
                    uploadModeBtns.forEach(btn => btn.classList.remove('active'));
                    if (isFileMode) {
                        uploadBtn.classList.add('active');
                        fileInput.style.display = 'block';
                        urlInput.style.display = 'none';
                    } else {
                        pasteUrlBtn.classList.add('active');
                        fileInput.style.display = 'none';
                        urlInput.style.display = 'block';
                        urlInput.focus();
                    }

                    previewDiv.style.display = 'none';
                    sendBtn.disabled = true;
                    currentImageData = null;
                }


                uploadBtn.addEventListener('click', () => switchUploadMode(true));


                pasteUrlBtn.addEventListener('click', () => switchUploadMode(false));


                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > MAX_IMAGE_SIZE) {
                            showNotification('图片大小不能超过5MB', 'error');
                            return;
                        }
                        showNotification('正在优化图片...', 'info', 1500);
                        optimizeImage(file).then(optimizedData => {
                            currentImageData = optimizedData;
                            previewImg.src = currentImageData;
                            previewDiv.style.display = 'block';
                            sendBtn.disabled = false;
                        }).catch(() => {
                            showNotification('图片处理失败', 'error');
                        });
                    }
                });


                urlInput.addEventListener('input',
                    function() {
                        const url = urlInput.value.trim();
                        if (url) {

                            if (/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp))$/i.test(url)) {
                                previewImg.src = url;
                                previewDiv.style.display = 'block';
                                currentImageData = url;
                                sendBtn.disabled = false;


                                const img = new Image();
                                img.onload = function() {

                                    previewImg.src = url;
                                    showNotification('图片URL有效', 'success', 1000);
                                };
                                img.onerror = function() {
                                    showNotification('图片URL无效或无法访问', 'error');
                                    sendBtn.disabled = true;
                                    previewDiv.style.display = 'none';
                                };
                                img.src = url;
                            } else {
                                sendBtn.disabled = true;
                                previewDiv.style.display = 'none';
                            }
                        } else {
                            sendBtn.disabled = true;
                            previewDiv.style.display = 'none';
                        }
                    });


                sendBtn.addEventListener('click',
                    () => {
                        if (currentImageData) {

                            addMessage({
                                id: Date.now(),
                                sender: 'user',
                                text: '',
                                timestamp: new Date(),
                                image: currentImageData,
                                status: 'sent',
                                favorited: false,
                                note: null,
                                replyTo: currentReplyTo,
                                type: 'normal'
                            });
                            playSound('send');
                            currentReplyTo = null;
                            updateReplyPreview();
                            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                            setTimeout(simulateReply, randomDelay);


                            closeModal();
                        }
                    });


                cancelBtn.addEventListener('click',
                    closeModal);


                function closeModal() {
                    modal.style.opacity = '0';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    },
                        300);
                }


                modal.addEventListener('click',
                    (e) => {
                        if (e.target === modal) {
                            closeModal();
                        }
                    });


                modal.querySelector('.modal-content').addEventListener('click',
                    (e) => {
                        e.stopPropagation();
                    });


                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };
                document.addEventListener('keydown', handleEscKey);


                modal.addEventListener('close', () => {
                    document.removeEventListener('keydown', handleEscKey);
                });
            });


            DOMElements.imageInput.addEventListener('change', () => {
                if (DOMElements.imageInput.files[0]) {
                    if (isBatchMode) {
                        showNotification('批量模式不支持图片', 'warning');
                        DOMElements.imageInput.value = '';
                    } else {
                        sendMessage();
                    }
                }
            });

            DOMElements.continueBtn.addEventListener('click', simulateReply);
            DOMElements.batchBtn.addEventListener('click', toggleBatchMode);
        }

window._dailyGreetingReady = false;

function _getDailyGreetingData() {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();

    var timeLabel = '早上好', timeEmoji = '🌅';
    if (hour >= 12 && hour < 18) { timeLabel = '下午好'; timeEmoji = '☀️'; }
    else if (hour >= 18 && hour < 22) { timeLabel = '傍晚好'; timeEmoji = '🌇'; }
    else if (hour >= 22 || hour < 6) { timeLabel = '晚上好'; timeEmoji = '🌙'; }

var festivals = [
    { m:1, d:1, name:'元旦', emoji:'🎆', label:'NEW YEAR', note:'新年快乐！愿新的一年里，你们的爱情越来越甜蜜，每一天都充满幸福与惊喜～' },
    { m:1, d:5, name:'小寒', emoji:'❄️', label:'MINOR COLD', note:'小寒至，春不远。有你在身边，心里总是暖暖的。' },
    { m:1, d:20, name:'大寒', emoji:'🧊', label:'MAJOR COLD', note:'大寒快乐，记得添衣保暖。你的拥抱就是最暖的炉火。' },

    { m:2, d:4, name:'立春', emoji:'🌱', label:'START OF SPRING', note:'立春快乐！春天来了，我们的爱也像新芽一样蓬勃生长。' },
    { m:2, d:14, name:'情人节', emoji:'💝', label:'VALENTINES DAY', note:'情人节快乐，亲爱的！你是我最美好的礼物，爱你哦～' },
    { m:2, d:16, name:'除夕', emoji:'🧧', label:'CHINESE NEW YEAR EVE', note:'除夕快乐！辞旧迎新，愿你们携手跨入幸福的新一年，万事如意！' },
    { m:2, d:17, name:'春节', emoji:'🎊', label:'SPRING FESTIVAL', note:'新年快乐！新的一年，愿你们相爱如初，甜蜜长久。' },
    { m:2, d:18, name:'雨水', emoji:'☔', label:'RAIN WATER', note:'雨水节气，愿幸福像春雨一样滋润你的每一天。' },

    { m:3, d:3, name:'元宵节', emoji:'🏮', label:'LANTERN FESTIVAL', note:'元宵节快乐！花灯映月，你是我心里最亮的那盏灯。' },
    { m:3, d:5, name:'惊蛰', emoji:'⚡', label:'AWAKENING OF INSECTS', note:'惊蛰春雷响，万物复苏，你是我最美的春天。' },
    { m:3, d:8, name:'妇女节', emoji:'🌹', label:'WOMENS DAY', note:'今天是属于你的节日，愿你永远被温柔相待，被爱守护。' },
    { m:3, d:12, name:'植树节', emoji:'🌳', label:'TREE PLANTING DAY', note:'今天种下一棵树，也在心里种下对你不变的爱。' },
    { m:3, d:20, name:'春分', emoji:'🌸', label:'SPRING EQUINOX', note:'春分昼夜平分，我的爱对你从不偏心——永远满分。' },

    { m:4, d:1, name:'愚人节', emoji:'🤡', label:'APRIL FOOLS', note:'今天可以骗你说“我不爱你了”，但我的心骗不了自己～' },
    { m:4, d:5, name:'清明节', emoji:'🌧', label:'QINGMING FESTIVAL', note:'慎终追远，珍惜眼前。有你在，每一天都格外温暖。' },
    { m:4, d:20, name:'谷雨', emoji:'🌾', label:'GRAIN RAIN', note:'谷雨生百谷，你是我生命里最饱满的那颗。' },

    { m:5, d:1, name:'劳动节', emoji:'🛠️', label:'LABOR DAY', note:'劳动最光荣，但我更光荣的是能拥有你。' },
    { m:5, d:4, name:'青年节', emoji:'✨', label:'YOUTH DAY', note:'青春正好，与你共度。愿我们永远年轻，永远热泪盈眶。' },
    { m:5, d:5, name:'立夏', emoji:'☀️', label:'START OF SUMMER', note:'立夏快乐！愿我们的爱像夏天一样热情。' },
    { m:5, d:20, name:'520', emoji:'💕', label:'I LOVE YOU', note:'520，我爱你！感谢你出现在我的生命里，你是我最好的选择。' },
    { m:5, d:21, name:'小满', emoji:'🌾', label:'GRAIN BUDS', note:'小满未满，万物可期。我对你的爱永远在增长的季节。' },

    { m:6, d:1, name:'儿童节', emoji:'🎈', label:'CHILDRENS DAY', note:'愿你永远保持那颗童心，和我一起做个快乐的大小孩。' },
    { m:6, d:5, name:'芒种', emoji:'🌽', label:'GRAIN IN EAR', note:'芒种忙种，有你在的日子，每天都是收获。' },
    { m:6, d:19, name:'端午节', emoji:'🛶', label:'DRAGON BOAT FESTIVAL', note:'粽子软糯，你更甜～端午安康！' },
    { m:6, d:21, name:'夏至', emoji:'🍉', label:'SUMMER SOLSTICE', note:'夏至最长的一天，我的思念比它还长。' },

    { m:7, d:6, name:'小暑', emoji:'🌡️', label:'MINOR HEAT', note:'小暑入伏天，你的怀抱是最清凉的风。' },
    { m:7, d:23, name:'大暑', emoji:'🔥', label:'MAJOR HEAT', note:'大暑炎炎，你是我心里的冰镇西瓜。' },

    { m:8, d:7, name:'立秋', emoji:'🍁', label:'START OF AUTUMN', note:'立秋快乐，愿与你共赏每一片秋叶。' },
    { m:8, d:19, name:'七夕节', emoji:'🌌', label:'QIXI FESTIVAL', note:'七夕快乐！牛郎织女一年只见一次，而我们每天都在一起，真幸运。' },
    { m:8, d:23, name:'处暑', emoji:'🌬️', label:'END OF HEAT', note:'处暑出暑，炎热渐消，爱意不减。' },

    { m:9, d:7, name:'白露', emoji:'💧', label:'WHITE DEW', note:'白露为霜，所谓伊人，在我身旁。' },
    { m:9, d:10, name:'教师节', emoji:'📚', label:'TEACHERS DAY', note:'你是我人生中最特别的老师，教会了我什么是爱。' },
    { m:9, d:23, name:'秋分', emoji:'🍂', label:'AUTUMN EQUINOX', note:'秋分昼夜均，你是我心里的天平。' },
    { m:9, d:25, name:'中秋节', emoji:'🌕', label:'MID AUTUMN FESTIVAL', note:'月圆人团圆，有你才叫团圆。中秋快乐！' },

    { m:10, d:1, name:'国庆节', emoji:'🎑', label:'NATIONAL DAY', note:'国庆快乐！和你在一起的每一天都像节日，爱你。' },
    { m:10, d:8, name:'寒露', emoji:'🍃', label:'COLD DEW', note:'寒露凝霜，有你在心里总是暖的。' },
    { m:10, d:23, name:'霜降', emoji:'❄️', label:'FROST DESCENT', note:'霜降叶落，我的爱却常青。' },
    { m:10, d:31, name:'万圣夜', emoji:'🎃', label:'HALLOWEEN', note:'不给糖就捣蛋，但你给了我全世界最甜的糖——你的爱。' },

    { m:11, d:7, name:'立冬', emoji:'🧣', label:'START OF WINTER', note:'立冬快乐，你的拥抱是冬天里最暖的阳光。' },
    { m:11, d:11, name:'光棍节', emoji:'👫', label:'SINGLES DAY', note:'幸好我们不用过这个节，因为我有你。' },
    { m:11, d:22, name:'小雪', emoji:'⛄', label:'MINOR SNOW', note:'小雪飘飘，你是我心里最暖的那团火。' },
    { m:11, d:26, name:'感恩节', emoji:'🙏', label:'THANKSGIVING', note:'感谢生命中有你，每一天都是恩赐。' },

    { m:12, d:7, name:'大雪', emoji:'☃️', label:'MAJOR SNOW', note:'大雪封门，封不住我对你的想念。' },
    { m:12, d:22, name:'冬至', emoji:'🥟', label:'WINTER SOLSTICE', note:'冬至快乐，记得吃饺子，但记得想我。' },
    { m:12, d:24, name:'平安夜', emoji:'🎄', label:'CHRISTMAS EVE', note:'平安夜快乐！愿你平平安安，我们的爱情也岁岁常安。' },
    { m:12, d:25, name:'圣诞节', emoji:'🎅', label:'MERRY CHRISTMAS', note:'圣诞快乐！你就是我收到的最好的礼物，永远爱你。' },
    { m:12, d:31, name:'跨年夜', emoji:'🎆', label:'NEW YEAR EVE', note:'再见这一年，你是我最好的收获。新的一年，继续爱你。' }
];
var festival = null;
    for (var fi = 0; fi < festivals.length; fi++) {
        if (festivals[fi].m === month && festivals[fi].d === day) { festival = festivals[fi]; break; }
    }

  var weathers = [
    '晴空万里',
    '多云转晴',
    '阴天有云',
    '细雨蒙蒙',
    '春风和煦',
    '微微寒冷',
    '清风徐徐',
    '雨后初晴',
    '夜色宁静',
    '月光皎洁',
    '晴间多云',
    '大雨滂沱',
    '雷雨交加',
    '小雪纷飞',
    '微风拂面',
    '多云天气',
    '雾气朦胧',
    '星光璀璨',
    '朝霞满天',
    '夕阳西下',
    '海风轻拂',
    '山间清爽',
    '秋叶飘落',
    '花香四溢',
    '绿意盎然',
    '雨后清新',
    '雪花飞舞',
    '阳光明媚'
];

var statusPool = [
    '正在想你 💭',
    '忙碌中，但心里有你',
    '好好的，别担心 ✨',
    '期待见到你',
    '有点想你了',
    '在努力变更好',
    '今天挺安静的',
    '心情不错哦 🌱',
    '一切都好，你呢？',
    '看月亮，想到你 🌙',
    '今天有点想你',
    '刚刚看到一朵云像你 ☁️',
    '工作再忙也会想你的',
    '今天你开心吗？',
    '梦里见 💤',
    '好好吃饭了吗？',
    '记得多喝水哦 💧',
    '今天有没有照顾好自己',
    '想你，但不说 🤫',
    '全世界你最可爱',
    '今天天气不错，适合想你',
    '吃饱喝足，开始想你',
    '今天也想牵你的手',
    '你有没有想我',
    '今天比昨天更想你',
    '看到好吃的想分享给你 🍜',
    '听到一首歌想到你 🎵',
    '今天也要加油鸭',
    '晚安，我的全世界 🌙',
    '早安，又是想你的一天'
];
    var todayKey = String(now.getFullYear()) + String(month) + String(day);
    // 为每个安装生成唯一 salt，确保每位用户每天的天气/状态各不相同
    var userSalt = localStorage.getItem('_dgUserSalt');
    if (!userSalt) {
        userSalt = String(Math.floor(Math.random() * 999983) + 1);
        localStorage.setItem('_dgUserSalt', userSalt);
    }
    var seed = 0;
    var saltedKey = todayKey + userSalt;
    for (var si = 0; si < saltedKey.length; si++) seed += saltedKey.charCodeAt(si) * (si + 1);
    function seededRandDg(s, offset) {
        var x = Math.sin(s * 9301 + offset * 49297 + 233) * 1000003;
        return x - Math.floor(x);
    }
    var defaultWeather = weathers[Math.floor(seededRandDg(seed, 0) * weathers.length)];
    var customWeatherKey = 'customWeather_' + now.getFullYear() + '_' + month + '_' + day;
    var weather = localStorage.getItem(customWeatherKey) || defaultWeather;

    // 混合系统预设 + 用户自定义状态池
    var userStatusPool = [];
    try { userStatusPool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e) {}
    var userStatusTexts = userStatusPool.map(function(item) { return item.status || item; }).filter(Boolean);
    var mixedStatusPool = statusPool.concat(userStatusTexts);
    var status = mixedStatusPool[Math.floor(seededRandDg(seed, 1) * mixedStatusPool.length)];

    return { timeLabel: timeLabel, timeEmoji: timeEmoji, festival: festival, weather: weather, status: status };
}

function _buildDailyGreeting() {
    try {
        var data = _getDailyGreetingData();
        var festival = data.festival;
        var timeLabel = data.timeLabel;
        var timeEmoji = data.timeEmoji;
        var weather = data.weather;
        var status = data.status;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');

        var moodDataRaw = window.moodData || {};
        var todayMood = moodDataRaw[todayStr];
        var allMoods = (typeof getAllMoodOptions === 'function') ? getAllMoodOptions() : [];

        var pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        var mName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        var partnerMoodText = pName + ' 今天还没有记录';
        var partnerMoodIcon = null; 
        var partnerMoodNote = '';

        if (todayMood && todayMood.partner) {
            for (var pi = 0; pi < allMoods.length; pi++) {
                if (allMoods[pi].key === todayMood.partner) {
                    partnerMoodText = allMoods[pi].kaomoji + '  ' + allMoods[pi].label;
                    partnerMoodIcon = allMoods[pi].kaomoji;
                    break;
                }
            }
            partnerMoodNote = todayMood.partnerNote || '';
        }

        var h = now.getHours();
        var mainTitle = festival ? (festival.name + '快乐') : timeLabel;
        var festLabel = festival ? festival.label : ('GOOD ' + (h < 12 ? 'MORNING' : h < 18 ? 'AFTERNOON' : 'EVENING'));
        var noteText = festival ? festival.note : '今天也要元气满满，我在这里陪着你 ✦';

        var customData = {};
        try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e2) {}
        
        var now2 = new Date();
        var dailySeed = now2.getFullYear() * 10000 + (now2.getMonth()+1) * 100 + now2.getDate();
        function seededRandom(seed) { return (Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % 233280) / 233280; }
        var todaySeedForText = dailySeed;

        var defaultTitles = festival ? [(festival.name + '快乐')] : [timeLabel, '今天也要开心哦', '你在我心里呀', '想你'];
        var defaultNotes = festival ? [festival.note] : ['今天也要元气满满，我在这里陪着你 ✦', '每一天都因为有你而特别 ✦', '想到你就觉得很安心 ✦', '你是我最喜欢的人 ✦'];

        var mixedTitles = (customData.titles && customData.titles.length > 0) ? [...customData.titles, ...defaultTitles] : 
                          (customData.title ? [customData.title, ...defaultTitles] : defaultTitles);
        var mixedNotes = (customData.notes && customData.notes.length > 0) ? [...customData.notes, ...defaultNotes] :
                         (customData.note ? [customData.note, ...defaultNotes] : defaultNotes);

        mainTitle = mixedTitles[Math.floor(seededRandom(todaySeedForText) * mixedTitles.length)];
        noteText = mixedNotes[Math.floor(seededRandom(todaySeedForText + 1) * mixedNotes.length)];

        function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
        function setElHTML(id, val) { var el = document.getElementById(id); if (el) el.innerHTML = val; }

        var emojiEl = document.getElementById('dg-emoji');
        if (emojiEl) {
            if (festival) {
                emojiEl.textContent = festival.emoji;
            }
        }

        var moodIconEl = document.getElementById('dg-partner-mood-icon');
        if (moodIconEl) {
            if (partnerMoodIcon) {
                moodIconEl.textContent = partnerMoodIcon;
                moodIconEl.style.fontSize = '32px';
            }
        }

        setEl('dg-festival', festLabel);
        setEl('dg-title', mainTitle);
        setEl('dg-partner-mood', partnerMoodText);
        setEl('dg-partner-mood-note', partnerMoodNote || (todayMood && todayMood.partner ? pName + ' 记录了今天的心情 ☆' : ''));

        var statusPoolData = [];
        try { statusPoolData = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
        // 将系统预设 + 用户自定义混合后，按今日种子选取
        var systemStatusItems = (function() {
            var sysPool = [];
            // 将系统状态文本包装成与 statusPoolData 兼容的格式
            var baseStatus = (typeof status !== 'undefined') ? status : '';
            if (baseStatus) sysPool.push({ status: baseStatus, icon: null, iconImg: null });
            return sysPool;
        })();
        var fullPool = systemStatusItems.concat(statusPoolData);
        if (fullPool.length > 0) {
            var poolItem = fullPool[Math.floor(seededRandom(todaySeedForText + 2) * fullPool.length)];
            if (poolItem) {
                setEl('dg-festival', poolItem.label || festLabel);
                setEl('dg-status', poolItem.status || status);
                var emojiEl2 = document.getElementById('dg-emoji');
                if (emojiEl2) {
                    if (poolItem.iconImg) {
                        emojiEl2.textContent = '';
                        emojiEl2.style.backgroundImage = 'url(' + poolItem.iconImg + ')';
                        emojiEl2.style.backgroundSize = 'cover';
                        emojiEl2.style.backgroundPosition = 'center';
                    } else if (poolItem.icon) {
                        emojiEl2.style.backgroundImage = '';
                        emojiEl2.textContent = poolItem.icon;
                    }
                }
            }
        } else {
            setEl('dg-status', status);
        }
        setEl('dg-weather', weather);

        var noteTextEl = document.getElementById('dg-note-text');
        if (noteTextEl) noteTextEl.textContent = noteText;
        var wBadge = document.getElementById('dg-note-weather-badge');
        if (wBadge) wBadge.style.display = 'none';

        setEl('dg-section-label-partner', pName + ' 今日状态');
        setEl('dg-weather-label', pName + ' 的天气');
        setEl('dg-status-label', pName + ' 的状态');

        var months = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
        setEl('dg-date-stamp', now.getFullYear() + ' · ' + months[now.getMonth()] + '月' + now.getDate() + '日');

        var headerBg = localStorage.getItem('dg_header_bg');
        var bgEl = document.getElementById('dg-header-band-bg');
        if (bgEl && headerBg) {
            bgEl.style.backgroundImage = 'url(' + headerBg + ')';
            bgEl.classList.add('has-img');
        }

        var overlayBg = localStorage.getItem('dg_overlay_bg');
        if (overlayBg) { applyDgOverlayBg(overlayBg); }

        var decoImg = customData.decoImg;
        var decoWrap2 = document.getElementById('dg-deco-img-wrap');
        var decoImgEl2 = document.getElementById('dg-deco-img');
        if (decoWrap2 && decoImgEl2) {
            if (decoImg) {
                decoImgEl2.src = decoImg;
                decoWrap2.style.display = 'block';
            } else {
                decoWrap2.style.display = 'none';
            }
        }
    } catch(e) { console.warn('Daily greeting build error:', e); }
}

window.toggleImmersiveMode = function(force) {
    var isOn = (force !== undefined) ? force : !document.body.classList.contains('immersive-mode');
    document.body.classList.toggle('immersive-mode', isOn);
    var toggle = document.getElementById('immersive-toggle');
    if (toggle) toggle.classList.toggle('active', isOn);
    try { localStorage.setItem('immersive_mode', isOn ? '1' : '0'); } catch(e) {}
    if (!isOn && typeof showNotification === 'function') showNotification('已退出沉浸式模式', 'info');
};

(function() {
    var btn = document.getElementById('immersive-exit-btn');
    if (!btn) return;
    var isDragging = false, hasMoved = false;
    var startX, startY, origRight, origBottom;
    
    function getRight() { return parseInt(btn.style.right) || 20; }
    function getBottom() { return parseInt(btn.style.bottom) || 100; }
    
    function onStart(e) {
        isDragging = true; hasMoved = false;
        btn.classList.add('dragging');
        var touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        origRight = getRight();
        origBottom = getBottom();
        e.preventDefault();
    }
    function onMove(e) {
        if (!isDragging) return;
        var touch = e.touches ? e.touches[0] : e;
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
        var newRight = Math.max(10, Math.min(window.innerWidth - 54, origRight - dx));
        var newBottom = Math.max(10, Math.min(window.innerHeight - 54, origBottom - dy));
        btn.style.right = newRight + 'px';
        btn.style.bottom = newBottom + 'px';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
        e.preventDefault();
    }
    function onEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        btn.classList.remove('dragging');
        if (!hasMoved) {
            window.toggleImmersiveMode(false);
        }
    }
    btn.addEventListener('mousedown', onStart, {passive: false});
    btn.addEventListener('touchstart', onStart, {passive: false});
    document.addEventListener('mousemove', onMove, {passive: false});
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
    
    btn.removeAttribute('onclick');
})();
(function() {
    try {
        if (localStorage.getItem('immersive_mode') === '1') {
            document.body.classList.add('immersive-mode');
            var t = document.getElementById('immersive-toggle');
            if (t) t.classList.add('active');
        }
    } catch(e) {}
})();

window.openDailyGreetingEditor = function() {
    var modal = document.getElementById('dg-editor-modal');
    if (!modal) return;
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    var titleEl = document.getElementById('dg-edit-title');
    var noteEl = document.getElementById('dg-edit-note');
    if (titleEl) titleEl.value = (customData.titles && customData.titles.length) ? customData.titles.join('\n') : (customData.title || '');
    if (noteEl) noteEl.value = (customData.notes && customData.notes.length) ? customData.notes.join('\n') : (customData.note || '');

    if (customData.decoImg) {
        var prev = document.getElementById('dg-deco-preview');
        var prevImg = document.getElementById('dg-deco-preview-img');
        if (prev && prevImg) { prevImg.src = customData.decoImg; prev.style.display = 'block'; }
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
};
window.closeDailyGreetingEditor = function() {
    var modal = document.getElementById('dg-editor-modal');
    if (modal) { modal.style.display = 'none'; modal.classList.remove('active'); }
};
window.saveDailyGreetingCustom = function() {
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    var titleEl = document.getElementById('dg-edit-title');
    var noteEl = document.getElementById('dg-edit-note');
    if (titleEl && titleEl.value.trim()) {
        var titles = titleEl.value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
        customData.titles = titles;
        customData.title = titles[0];
    } else { delete customData.titles; delete customData.title; }
    if (noteEl && noteEl.value.trim()) {
        var notes = noteEl.value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
        customData.notes = notes;
        customData.note = notes[0]; 
    } else { delete customData.notes; delete customData.note; }
    localStorage.setItem('dg_custom_data', JSON.stringify(customData));
    closeDailyGreetingEditor();
    if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
    if (typeof showNotification === 'function') showNotification('公告已保存 ✦', 'success');
};
window.clearDgDecoImg = function() {
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    delete customData.decoImg;
    localStorage.setItem('dg_custom_data', JSON.stringify(customData));
    var prev = document.getElementById('dg-deco-preview');
    if (prev) prev.style.display = 'none';
    var wrap = document.getElementById('dg-deco-img-wrap');
    if (wrap) wrap.style.display = 'none';
};
window.clearDgHeaderBg = function() {
    localStorage.removeItem('dg_header_bg');
    var bgEl = document.getElementById('dg-header-band-bg');
    if (bgEl) { bgEl.style.backgroundImage = ''; bgEl.classList.remove('has-img'); }
};

window.onDgOverlayOpacityChange = function(val) {
    var tint = parseInt(val) / 100;
    localStorage.setItem('dg_overlay_bg_tint', tint);
    var valEl = document.getElementById('dg-overlay-opacity-val');
    if (valEl) valEl.textContent = val + '%';
    var tintLayer = document.getElementById('dg-card-tint-overlay');
    if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,' + tint + ')';
};

window.handleDgOverlayBgUpload = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var data = ev.target.result;
        localStorage.setItem('dg_overlay_bg', data);
        applyDgOverlayBg(data);
        var prev = document.getElementById('dg-overlay-bg-preview');
        var prevImg = document.getElementById('dg-overlay-bg-preview-img');
        if (prev && prevImg) { prevImg.src = data; prev.style.display = 'block'; }
        var opRow = document.getElementById('dg-overlay-opacity-row');
        if (opRow) opRow.style.display = 'block';
        var savedTint = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
        var pct = isNaN(savedTint) ? 25 : Math.round(savedTint * 100);
        var slider = document.getElementById('dg-overlay-opacity-slider');
        var valEl = document.getElementById('dg-overlay-opacity-val');
        if (slider) slider.value = pct;
        if (valEl) valEl.textContent = pct + '%';
    };
    reader.readAsDataURL(file);
};

window.clearDgOverlayBg = function() {
    localStorage.removeItem('dg_overlay_bg');
    applyDgOverlayBg(null);
    var prev = document.getElementById('dg-overlay-bg-preview');
    if (prev) prev.style.display = 'none';
    var opRow = document.getElementById('dg-overlay-opacity-row');
    if (opRow) opRow.style.display = 'none';
    if (typeof showNotification === 'function') showNotification('全屏背景已清除', 'success');
};

function applyDgOverlayBg(data, tintOpacity) {
    var card = document.getElementById('daily-greeting-card');
    var bgLayer = document.getElementById('dg-card-bg-layer');
    var tintLayer = document.getElementById('dg-card-tint-overlay');
    if (!card || !bgLayer) return;
    if (tintOpacity === undefined || tintOpacity === null) {
        var saved = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
        tintOpacity = isNaN(saved) ? 0.25 : saved;
    }
    if (data) {
        bgLayer.style.backgroundImage = 'url(' + data + ')';
        bgLayer.style.opacity = '1';
        if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,' + tintOpacity + ')';
        card.classList.add('has-card-bg');
        card.style.backgroundImage = '';
        card.style.backgroundSize = '';
        card.style.backgroundPosition = '';
        card.style.backgroundRepeat = '';
    } else {
        bgLayer.style.backgroundImage = '';
        bgLayer.style.opacity = '';
        if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,0)';
        card.classList.remove('has-card-bg');
    }
}

(function() {
    var savedOverlayBg = localStorage.getItem('dg_overlay_bg');
    if (savedOverlayBg) {
        document.addEventListener('DOMContentLoaded', function() {
            applyDgOverlayBg(savedOverlayBg);
            var prev = document.getElementById('dg-overlay-bg-preview');
            var prevImg = document.getElementById('dg-overlay-bg-preview-img');
            if (prev && prevImg) { prevImg.src = savedOverlayBg; prev.style.display = 'block'; }
            var opRow = document.getElementById('dg-overlay-opacity-row');
            if (opRow) opRow.style.display = 'block';
            var savedOp = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
            var pct = isNaN(savedOp) ? 25 : Math.round(savedOp * 100);
            var slider = document.getElementById('dg-overlay-opacity-slider');
            var valEl = document.getElementById('dg-overlay-opacity-val');
            if (slider) slider.value = pct;
            if (valEl) valEl.textContent = pct + '%';
        });
    }
})();

window.switchToAnnouncementPanel = function() {
    var listArea = document.getElementById('custom-replies-list');
    var annPanel = document.getElementById('announcement-panel');
    var toolbar = document.getElementById('cr-toolbar');
    var batchToolbar = document.getElementById('batch-ops-toolbar');
    var subTabs = document.getElementById('cr-sub-tabs');
    var addBtn = document.getElementById('add-custom-reply');
    var titleEl = document.getElementById('cr-modal-title');
    // 隐藏并清空列表区域，彻底清除 emoji/sticker/字卡等残留内容
    if (listArea) { listArea.style.display = 'none'; listArea.innerHTML = ''; listArea.className = 'content-list-area'; }
    // 隐藏并清空批量操作工具栏，防止工具栏内容残留
    if (batchToolbar) { batchToolbar.style.display = 'none'; batchToolbar.innerHTML = ''; }
    // 隐藏并清空 sub tabs，防止 tab 按钮残留
    if (subTabs) { subTabs.style.display = 'none'; subTabs.innerHTML = ''; }
    if (annPanel) { annPanel.style.display = 'block'; annPanel.scrollTop = 0; }
    if (toolbar) toolbar.style.display = 'none';
    if (addBtn) addBtn.style.display = 'none';
    if (titleEl) titleEl.textContent = '今日公告配置';
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e2) {}
    var titleInput = document.getElementById('dg-edit-title');
    var noteInput = document.getElementById('dg-edit-note');
    if (titleInput) titleInput.value = (customData.titles && customData.titles.length) ? customData.titles.join('\n') : (customData.title || '');
    if (noteInput) noteInput.value = (customData.notes && customData.notes.length) ? customData.notes.join('\n') : (customData.note || '');
    if (customData.decoImg) {
        var prev = document.getElementById('dg-deco-preview');
        var prevImg = document.getElementById('dg-deco-preview-img');
        if (prev && prevImg) { prevImg.src = customData.decoImg; prev.style.display = 'block'; }
    }
    var savedOverlayBg2 = localStorage.getItem('dg_overlay_bg');
    if (savedOverlayBg2) {
        var overlayPrev = document.getElementById('dg-overlay-bg-preview');
        var overlayPrevImg = document.getElementById('dg-overlay-bg-preview-img');
        if (overlayPrev && overlayPrevImg) { overlayPrevImg.src = savedOverlayBg2; overlayPrev.style.display = 'block'; }
    }
    renderAnnStatusPool();
};

window.renderAnnStatusPool = function() {
    var listEl = document.getElementById('ann-status-pool-list');
    if (!listEl) return;
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    listEl.innerHTML = '';
    if (pool.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:var(--text-secondary);text-align:center;padding:10px 0;opacity:0.6;">暂无条目，添加后将随机抽取</div>';
        return;
    }
    pool.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:9px 12px;background:linear-gradient(135deg,rgba(var(--accent-color-rgb),0.05),rgba(var(--accent-color-rgb),0.02));border-radius:12px;border:1px solid rgba(var(--accent-color-rgb),0.15);font-size:13px;transition:box-shadow 0.2s;';
        var iconHtml = item.iconImg
            ? '<img src="' + item.iconImg + '" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;">'
            : '<span style="font-size:18px;min-width:26px;text-align:center;flex-shrink:0;">' + (item.icon || '✦') + '</span>';
        row.innerHTML = iconHtml
            + '<div style="flex:1;min-width:0;">'
            + '<div style="color:var(--text-primary);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (item.status || '—') + '</div>'
            + (item.label ? '<div style="color:var(--accent-color);font-size:10px;letter-spacing:1.5px;margin-top:2px;opacity:0.8;">' + item.label + '</div>' : '')
            + '</div>'
            + '<button onclick="removeAnnStatusPoolItem(' + idx + ')" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:14px;padding:3px 5px;border-radius:6px;opacity:0.6;transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">✕</button>';
        listEl.appendChild(row);
    });
};

window.addAnnStatusPoolItem = function() {
    var statusInput = document.getElementById('ann-status-pool-input');
    var labelInput = document.getElementById('ann-status-label-input');
    var iconInput = document.getElementById('ann-status-icon-input');
    var status = statusInput ? statusInput.value.trim() : '';
    var label = labelInput ? labelInput.value.trim() : '';
    var icon = iconInput ? iconInput.value.trim() : '';
    var iconImg = iconInput ? (iconInput.dataset.imgSrc || '') : '';
    if (!status && !label) { if (typeof showNotification === 'function') showNotification('请至少填写状态或标签', 'warning'); return; }
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    var entry = { status: status, label: label, icon: icon || '✦' };
    if (iconImg) entry.iconImg = iconImg;
    pool.push(entry);
    localStorage.setItem('dg_status_pool', JSON.stringify(pool));
    if (statusInput) statusInput.value = '';
    if (labelInput) labelInput.value = '';
    if (iconInput) { iconInput.value = ''; delete iconInput.dataset.imgSrc; }
    renderAnnStatusPool();
    if (typeof showNotification === 'function') showNotification('已添加到随机库', 'success');
};

window.handleAnnStatusIconUpload = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var iconInput = document.getElementById('ann-status-icon-input');
        if (iconInput) {
            iconInput.dataset.imgSrc = ev.target.result;
            iconInput.value = '[图片]';
            iconInput.style.fontSize = '10px';
        }
    };
    reader.readAsDataURL(file);
};

window.removeAnnStatusPoolItem = function(idx) {
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    pool.splice(idx, 1);
    localStorage.setItem('dg_status_pool', JSON.stringify(pool));
    renderAnnStatusPool();
};

document.addEventListener('DOMContentLoaded', function() {
    var headerInput = document.getElementById('dg-header-img-input');
    if (headerInput) {
        headerInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var data = ev.target.result;
                localStorage.setItem('dg_header_bg', data);
                var bgEl = document.getElementById('dg-header-band-bg');
                if (bgEl) { bgEl.style.backgroundImage = 'url(' + data + ')'; bgEl.classList.add('has-img'); }
            };
            reader.readAsDataURL(file);
        });
    }
    var decoInput = document.getElementById('dg-deco-img-input');
    if (decoInput) {
        decoInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var data = ev.target.result;
                var customData = {};
                try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(ex) {}
                customData.decoImg = data;
                localStorage.setItem('dg_custom_data', JSON.stringify(customData));
                var prev = document.getElementById('dg-deco-preview');
                var prevImg = document.getElementById('dg-deco-preview-img');
                if (prev && prevImg) { prevImg.src = data; prev.style.display = 'block'; }
            };
            reader.readAsDataURL(file);
        });
    }
});

window.updateDynamicNames = function() {
    try {
        var pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        var mName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        var tabPartner = document.getElementById('mood-tab-partner');
        if (tabPartner) tabPartner.textContent = pName + '的记录';
        var tabMe = document.getElementById('mood-tab-me');
        if (tabMe) tabMe.textContent = mName + '的记录';

        var detailPartnerTitle = document.getElementById('detail-partner-title');
        if (detailPartnerTitle) detailPartnerTitle.textContent = pName + '的';

        var partnerNoRec = document.getElementById('detail-partner-no-record');
        if (partnerNoRec) {
            var msgEl = partnerNoRec;
            if (!msgEl.querySelector('span')) msgEl.textContent = pName + ' 这天还没有留下记录';
        }

        var editPartnerBtn = document.getElementById('edit-partner-mood');
        if (editPartnerBtn) editPartnerBtn.textContent = '修改' + pName;
        var deletePartnerBtn = document.getElementById('delete-partner-mood');
        if (deletePartnerBtn) deletePartnerBtn.textContent = '删除' + pName;

        var continueBtn = document.getElementById('continue-btn');
        if (continueBtn) continueBtn.title = '让' + pName + '继续说';

        var envInfo = document.querySelector('.env-send-info');
        if (envInfo) {
            var textNodes = Array.from(envInfo.childNodes).filter(n => n.nodeType === 3);
            textNodes.forEach(function(n) {
                if (n.textContent.includes('对方将在') || n.textContent.includes('小时内回信')) {
                    n.textContent = pName + ' 将在 10-24 小时内回信（8-12 句话）';
                }
            });
        }

        setDgLabel('dg-section-label-partner', pName + ' 今日状态');
        setDgLabel('dg-weather-label', pName + ' 的天气');
        setDgLabel('dg-status-label', pName + ' 的状态');

        var envInfoSpan = document.getElementById('env-reply-time-info');
        if (envInfoSpan) envInfoSpan.textContent = pName + ' 将在 10-24 小时内回信（8-12 句话）';

        var pokeInput = document.getElementById('poke-input');
        if (pokeInput) pokeInput.placeholder = '例如：拍了拍"' + pName + '"的肩膀';

        document.querySelectorAll('[data-name-partner]').forEach(function(el) {
            el.textContent = pName + '的记录';
        });
        document.querySelectorAll('[data-name-me]').forEach(function(el) {
            el.textContent = mName + '的记录';
        });
        document.querySelectorAll('[data-delete-partner]').forEach(function(el) {
            el.textContent = '删除' + pName;
        });
        document.querySelectorAll('[data-edit-partner]').forEach(function(el) {
            el.textContent = '修改' + pName;
        });
    } catch(e) { console.warn('updateDynamicNames error:', e); }
};
function setDgLabel(id, txt) {
    var el = document.getElementById(id);
    if (el && el.tagName !== 'INPUT') el.textContent = txt;
}

window.closeDailyGreeting = function() {
    try {
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                modal.classList.add('hidden');
                modal.style.opacity = '';
                modal.style.transition = '';
            }, 320);
        }
        localStorage.setItem('dailyGreetingShown', new Date().toDateString());
    } catch(e) {}
};

window.reopenDailyGreeting = function() {
    try {
        if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.classList.remove('hidden');
            requestAnimationFrame(function() {
                modal.style.transition = 'opacity 0.3s ease';
                modal.style.opacity = '1';
            });
        }
    } catch(e) {}
};

window.tryShowDailyGreeting = function() {
    try {
        if (localStorage.getItem('dailyGreetingShown') === new Date().toDateString()) return;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        var moodDataRaw = window.moodData || {};
        var todayMood = moodDataRaw[todayStr];

        if (!todayMood || !todayMood.partner) {
            setTimeout(function() {
                var refreshedMood = (window.moodData || {})[todayStr];
                _buildDailyGreeting(); 
                var modal = document.getElementById('daily-greeting-modal');
                if (modal) modal.classList.remove('hidden');
                localStorage.setItem('dailyGreetingShown', new Date().toDateString());
            }, 45000);
            return;
        }

        _buildDailyGreeting();
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) modal.classList.remove('hidden');
    } catch(e) { console.warn('Daily greeting show error:', e); }
};

