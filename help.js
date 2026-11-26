import { createTranslator, getLanguage } from './i18n.js?v=0.7.1';
import { HELP_COPY, HELP_MESSAGES } from './help-messages.js?v=0.7.1';
export { HELP_MESSAGES } from './help-messages.js?v=0.7.1';

const translate = createTranslator(HELP_MESSAGES);

/** Local help content. User data is escaped; translated markup is static app copy. */
export function renderHelp({ icon, escapeHTML, version, language = getLanguage() }) {
  const t = (source, values = {}) => translate(source, values, language);
  const topic = ({ title, paragraphs, installButton }) => `<details class="help-topic"><summary>${t(title)}<span class="help-chevron" aria-hidden="true">${icon('arrow')}</span></summary><div class="help-topic-body">${paragraphs.map(paragraph => paragraph.startsWith('<div') ? t(paragraph) : `<p>${t(paragraph)}</p>`).join('')}${installButton ? `<button class="help-inline-button" type="button" data-action="install-help">${icon('share')}${t(HELP_COPY.installButton)}${icon('arrow')}</button>` : ''}</div></details>`;
  return `<div class="help-center">
    <section class="help-start" aria-labelledby="help-start-title">
      <div class="help-section-label">${t(HELP_COPY.quickLabel)}</div>
      <h3 id="help-start-title">${t(HELP_COPY.quickTitle)}</h3>
      <ol class="help-steps">${HELP_COPY.steps.map(step => `<li><strong>${t(step.title)}</strong> ${t(step.body)}</li>`).join('')}</ol>
    </section>
    <section class="help-feedback" aria-labelledby="help-feedback-title">
      <h3 id="help-feedback-title">${t(HELP_COPY.feedbackTitle)}</h3>
      <div class="help-feedback-grid">
        <button class="help-feedback-card" type="button" data-action="feedback-open" data-kind="bug">${icon('info')}<span><strong>${t(HELP_COPY.bugTitle)}</strong><small>${t(HELP_COPY.bugSubtitle)}</small></span>${icon('arrow')}</button>
        <button class="help-feedback-card help-feedback-idea" type="button" data-action="feedback-open" data-kind="idea">${icon('new')}<span><strong>${t(HELP_COPY.ideaTitle)}</strong><small>${t(HELP_COPY.ideaSubtitle)}</small></span>${icon('arrow')}</button>
      </div>
      <p class="help-feedback-note">${t(HELP_COPY.feedbackNote)}</p>
    </section>
    <section class="help-guide" aria-labelledby="help-guide-title">
      <div class="help-guide-heading"><h3 id="help-guide-title">${t(HELP_COPY.guideTitle)}</h3><span>${t(HELP_COPY.guideNote)}</span></div>
      ${HELP_COPY.topics.map(topic).join('')}
    </section>
    <div class="help-footer">
      <button class="help-question" type="button" data-action="feedback-open" data-kind="question">${icon('text')}${t(HELP_COPY.question)}</button>
      <p>${t(HELP_COPY.footer,{version:escapeHTML(version)})}</p>
    </div>
  </div>`;
}
