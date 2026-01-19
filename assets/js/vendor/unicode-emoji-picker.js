const EMOJI_OPTIONS = [
  "✨","🔥","⚡","⭐","💎","🏆","🎯","🚀","🧠","🪙","🌟","🦖","🎉","🍀","🌈","🥇",
  "🧩","💡","📚","🧪","🧭","🎵","🎮","🎲","🧸","🦄","🐉","🐯","🐬","🦊","🐼",
  "🍓","🍉","🍎","🥕","🍪","🍫","🍿","🧁","☕","🥤","⚽","🏀","🏸","⛳","🏹",
  "🛡️","🗡️","⚔️","🧨","🪄","🔮","💫","💥","✅","📌","📍","🔔","🎧","📣",
  "🥳","😎","🤩","🫶","👏","🙌","💪","🤝","🧗","🕹️","🎬","📷","📝","🗺️"
];

class UnicodeEmojiPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this._value = this.getAttribute("value") || "✨";
    this.valueEl = null;
    this.panelEl = null;
    this.toggleEl = null;
  }

  get value() {
    return this._value;
  }

  set value(next) {
    this._value = next || "✨";
    if (this.valueEl) this.valueEl.textContent = this._value;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host{ display:block; }
        .picker{ position:relative; font-family:inherit; }
        .toggle{
          width:100%;
          display:flex;
          align-items:center;
          gap:8px;
          padding:10px 12px;
          border-radius:12px;
          border:1px solid rgba(36,36,53,.9);
          background: rgba(0,0,0,.25);
          color:#f2f2f2;
          cursor:pointer;
          font-size:16px;
        }
        .toggle span{ font-size:20px; }
        .panel{
          position:absolute;
          z-index:20;
          margin-top:6px;
          width:100%;
          max-height:220px;
          overflow:auto;
          padding:8px;
          border-radius:12px;
          border:1px solid rgba(36,36,53,.9);
          background:#121219;
          display:none;
          box-shadow:0 10px 30px rgba(0,0,0,.35);
        }
        .panel.open{ display:grid; grid-template-columns: repeat(auto-fill, minmax(36px,1fr)); gap:6px; }
        .emoji{
          border:none;
          background: rgba(255,255,255,.04);
          border-radius:8px;
          font-size:20px;
          padding:6px 0;
          cursor:pointer;
          color:#f2f2f2;
        }
        .emoji:hover{ background: rgba(255,255,255,.12); }
      </style>
      <div class="picker">
        <button class="toggle" type="button" aria-haspopup="listbox" aria-expanded="false">
          <span class="value">${this._value}</span>
          <span>Wybierz ikonę</span>
        </button>
        <div class="panel" role="listbox"></div>
      </div>
    `;

    const panel = this.shadowRoot.querySelector(".panel");
    const toggle = this.shadowRoot.querySelector(".toggle");
    const valueEl = this.shadowRoot.querySelector(".value");
    if (!panel || !toggle || !valueEl) return;
    this.panelEl = panel;
    this.toggleEl = toggle;
    this.valueEl = valueEl;

    panel.innerHTML = EMOJI_OPTIONS.map((icon) => (
      `<button class="emoji" type="button" data-icon="${icon}" aria-label="Ikona ${icon}">${icon}</button>`
    )).join("");

    toggle.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
      panel.classList.toggle("open", this.isOpen);
      toggle.setAttribute("aria-expanded", String(this.isOpen));
    });

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const icon = target.getAttribute("data-icon");
      if (!icon) return;
      this.value = icon;
      this.isOpen = false;
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        this.isOpen = false;
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

customElements.define("unicode-emoji-picker", UnicodeEmojiPicker);
